/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * All Rights Reserved.
 *
 * NOTICE: All information contained herein is, and remains the property of BigTinCan Mobile Pty Ltd and its suppliers,
 * if any. The intellectual and technical concepts contained herein are proprietary to BigTinCan Mobile Pty Ltd and its
 * suppliers and may be covered by U.S. and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Dissemination of this information or reproduction of this material is strictly forbidden unless prior
 * written permission is obtained from BigTinCan Mobile Pty Ltd.
 *
 * @package hub-web-app-v5
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import {
  Route,
  Switch
} from 'react-router-dom';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  load,
  loadArchived,
  loadRevision,
  loadProtected,
  loadSamlProtected,
  close,
  setReferrerPath
} from 'redux/modules/story/story';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';

import StoryDetail from 'containers/StoryDetail/StoryDetail';
import StoryEdit from 'containers/StoryEdit/StoryEdit';
import StoryUnlock from 'components/StoryDetail/StoryUnlock';

const messages = defineMessages({
  close: { id: 'close', defaultMessage: 'Close' },
  unlockHeading: { id: 'password-protected-story', defaultMessage: 'Password Protected {story}' },
  unlockDetailDescription: { id: 'unlock-story-detail-description', defaultMessage: 'To view this {story} you must enter your password.' },
  unlockEditDescription: { id: 'unlock-story-edit-description', defaultMessage: 'To edit this {story} you must enter your password.' },
  password: { id: 'password', defaultMessage: 'Password' },
  unlock: { id: 'unlock', defaultMessage: 'Unlock' },
});

function mapStateToProps(state) {
  const { story } = state;
  return {
    saving: story.saving,
    saved: story.saved,
    saveError: story.saveError,
    loading: story.loading,
    loaded: story.loaded,
    loadError: story.loadError,
    unlocked: story.unlocked,
    unlockError: story.unlockError,

    id: story.id,
    permId: story.permId,
    name: story.name,
    isProtected: story.isProtected,
    referrerPath: story.referrerPath,
  };
}

@connect(
  mapStateToProps,
  bindActionCreatorsSafe({
    load,
    loadArchived,
    loadRevision,
    loadProtected,
    loadSamlProtected,
    close,

    setReferrerPath
  })
)
export default class Story extends Component {
  static propTypes = {
    saving: PropTypes.bool,
    saved: PropTypes.bool,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    loadError: PropTypes.object,
    unlocked: PropTypes.bool,
    unlockError: PropTypes.object,

    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    permId: PropTypes.number,
    name: PropTypes.string,
    isProtected: PropTypes.bool,
    referrerPath: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      passwordInputValue: ''
    };

    // Loaded as a modal route
    this.isModal = props.location.state && props.location.state.modal;

    this.samlInterval = null;

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { storyId } = this.props.match.params;
    // Load Story
    if (!this.props.loading && storyId && storyId !== 'new') {
      // Load by id (revision)
      if (this.props.location.query.rev) {
        this.props.loadRevision(this.props.location.query.rev);

      // Load by permId archived stories as Admin
      } else if (this.props.location.query.arch) {
        this.props.loadArchived(this.props.location.query.arch);

      // Load by permId
      } else {
        this.props.load(storyId);
      }
    }

    // Sets referrer as home page
    if (this.isModal && window.previousLocation && window.previousLocation.pathname === '/') {
      this.props.setReferrerPath(window.previousLocation.pathname);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Load new Story
    if (nextProps.match.params.storyId && nextProps.match.params.storyId !== this.props.match.params.storyId) {
      this.props.load(nextProps.match.params.storyId);

    // Clear password input on successul unlock
    } else if (nextProps.unlocked && !this.props.unlocked) {
      this.setState({ passwordInputValue: '' });
    }
  }

  componentDidUpdate(prevProps) {
    // Redirect to Story Detail if saved
    if (prevProps.saving && this.props.saved && this.props.permId) {
      this.props.history.push('/story/' + this.props.permId, { modal: this.isModal });
    }
  }

  componentWillUnmount() {
    const { user } = this.context.settings;
    const { id, permId, saved } = this.props;
    const pathname = this.props.location.pathname;

    // Close Story if navigating away from Story Detail/Edit
    if (pathname.indexOf(permId) !== -1 ||
        !saved && pathname.indexOf('/edit') === -1 ||
        (id === 'new' && pathname.indexOf('/new') === -1) ||
        (id === 'new' && pathname.indexOf('/quicklink') === -1)) {
      this.props.close();
    }

    if (user.authType === 'saml') {
      if (this.samlInterval) {
        clearInterval(this.samlInterval);
      }
      window.removeEventListener('message', this.handleSamlAuthMessage);
    }
  }

  openSamlAuth() {
    const { permId } = this.props;

    // Listen for postMessage from redirectUri window
    window.addEventListener('message', this.handleSamlAuthMessage);

    // https://stackoverflow.com/questions/18625733/how-do-i-get-around-window-opener-cross-domain-security
    const redirectUri = window.location.origin + '/saml_auth_story.html';
    const url = `${window.BTC.BTCAPI}/story/get?permId=${permId}&access_token=${localStorage.BTCTK_A}&redirectUri=${redirectUri}`;
    const child = window.open(url, '_blank', 'height=614,width=420');

    let leftDomain = false;
    this.samlInterval = setInterval(() => {
      try {
        if (child.document.domain === document.domain) {
          if (leftDomain && child.document.readyState === 'complete') {
            // child window returned to our domain
            clearInterval(this.samlInterval);
            child.postMessage({ message: 'requestToken' }, '*');
          }
        } else {
          leftDomain = true;
        }
      } catch (e) {
        // child window navigated or closed
        if (child.closed) {
          clearInterval(this.samlInterval);
          return;
        }
        leftDomain = true;  // navigated to another domain
      }
    }, 50);
  }

  handleSamlAuthMessage(event) {
    if (event.data.message === 'storyAccessToken' && event.data.token) {
      event.source.close();
      this.props.loadSamlProtected(this.props.permId, event.data.token);
    }
  }

  handleCloseClick(event) {
    event.preventDefault();
    const { referrerPath } = this.props;
    const { pathname } = this.props.location;
    const isEditing = pathname.indexOf('/edit') > -1 || pathname.indexOf('/quicklink') > -1;

    // Close Story Detail and Create Story
    if (!isEditing || !this.props.permId) {
      const modal = referrerPath.indexOf('/search') > -1 && this.isModal ||
        referrerPath === '/' && this.isModal;

      this.props.history.push(referrerPath, { modal: modal });

    // Cancel Edit Story
    } else if (isEditing && this.props.permId) {
      //reload props from server to clear any unsaved changes, due to "handleChange" functions already updated changes to props
      this.props.load(this.props.permId);
      this.props.history.push('/story/' + this.props.permId, { modal: this.isModal });
    }
  }

  handlePasswordInputChange(event) {
    this.setState({ passwordInputValue: event.currentTarget.value });
  }

  handleUnlockClick(event) {
    event.preventDefault();
    const { user } = this.context.settings;

    if (user.authType === 'saml') {
      this.openSamlAuth();
    } else {
      this.props.loadProtected(this.props.permId, this.state.passwordInputValue);
    }
  }

  renderRoute(RouteComponent, props) {
    return (
      <RouteComponent
        {...props}
        onAnchorClick={this.props.onAnchorClick}
        onCallClick={this.props.onCallClick}
        onFileClick={this.props.onFileClick}
        onFilesClick={this.props.onFilesClick}
        onStoryClick={this.props.onStoryClick}
        onCloseClick={this.handleCloseClick}
      />
    );
  }

  render() {
    const { naming, user } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { loading, loaded, loadError, location } = this.props;
    const styles = require('./Story.less');

    const isNewStory = location.pathname === '/story/new' || location.pathname === '/quicklink';
    const isEdit = isNewStory || location.pathname.indexOf('/edit') > -1;

    // Loading indicator
    if (loading || !isNewStory && !loaded) {
      return (
        <div className={styles.loaderWrapper}>
          <Loader type="page" />
        </div>
      );
    }

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Protected Story
    if (loaded && this.props.isProtected && !this.props.unlocked) {
      return (
        <StoryUnlock
          storyName={this.props.name}
          heading={strings.unlockHeading}
          description={isEdit ? strings.unlockEditDescription : strings.unlockDetailDescription}
          error={this.props.unlockError}
          btnText={strings.unlock}
          closeText={strings.close}
          inputPlaceholder={strings.password}
          inputValue={this.state.passwordInputValue}
          disableButton={!this.state.passwordInputValue && user.authType !== 'saml'}
          hideInput={user.authType === 'saml'}
          onCloseClick={this.handleCloseClick}
          onInputChange={this.handlePasswordInputChange}
          onUnlockClick={this.handleUnlockClick}
        />
      );

    // Loading error
    } else if (loaded && loadError && loadError.message) {
      return (
        <div className={styles.errorWrapper}>
          <Blankslate
            icon="error"
            message={loadError.message}
          >
            <p><Btn onClick={this.handleCloseClick} small>{strings.close}</Btn></p>
          </Blankslate>
        </div>
      );
    }

    return (
      <Switch>
        <Route exact path="/story/new" render={(props) => this.renderRoute(StoryEdit, props)} />
        <Route exact path="/quicklink" render={(props) => this.renderRoute(StoryEdit, props)} />
        <Route exact path="/story/:storyId/edit" render={(props) => this.renderRoute(StoryEdit, props)} />
        <Route exact path="/story/:storyId/share" render={(props) => this.renderRoute(StoryDetail, props)} />
        <Route path="/story/:storyId" render={(props) => this.renderRoute(StoryDetail, props)} />
      </Switch>
    );
  }
}
