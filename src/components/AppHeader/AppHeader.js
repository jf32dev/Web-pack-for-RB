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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import _get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { logout } from 'redux/modules/auth';
import { setModalState } from 'redux/modules/search';
import { setData as setShareData } from 'redux/modules/share';
import { getUserCourseUrl } from 'redux/modules/admin/education';
import { createPrompt } from 'redux/modules/prompts';

import CreateMenu from 'components/CreateMenu/CreateMenu';
import ProfileMenu from 'components/ProfileMenu/ProfileMenu';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

const messages = defineMessages({
  create: { id: 'create', defaultMessage: 'Create' },
  draft: { id: 'drafts', defaultMessage: 'Drafts' },
  form: { id: 'form', defaultMessage: 'Form' },
  note: { id: 'note', defaultMessage: 'Note' },
  pitch: { id: 'pitch', defaultMessage: 'Pitch' },
  quicklink: { id: 'quicklink', defaultMessage: 'Quicklink' },
  share: { id: 'share', defaultMessage: 'Share' },
  story: { id: 'story', defaultMessage: '{story}' },
  web: { id: 'website', defaultMessage: 'Web' },

  profile: { id: 'profile', defaultMessage: 'Profile' },
  settings: { id: 'settings', defaultMessage: 'Settings' },
  notifications: { id: 'notifications', defaultMessage: 'Notifications' },
  support: { id: 'support', defaultMessage: 'Support' },
  signOut: { id: 'sign-out', defaultMessage: 'Sign Out' },
});

@connect(
  state => ({
    ...state.auth,
    search: state.search,
    loadedLocale: state.intl.locale,

    courseLoading: state.admin.education.courseLoading,
    courseLoaded: state.admin.education.courseLoaded,
    courseURL: state.admin.education.courseURL,
    error: state.admin.education.error
  }),
  bindActionCreatorsSafe({
    createPrompt,
    getUserCourseUrl,
    logout,
    setModalState,
    setShareData
  })
)
export default class AppHeader extends Component {
  static propTypes = {
    children: PropTypes.node,

    paths: PropTypes.array,
    showBreadcrumbs: PropTypes.bool,

    logout: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    paths: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    // Open Share modal if passed in route
    if (this.context.router.history.location.pathname.indexOf('/share/new') > -1) {
      this.handleOpenShareModal();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loadedLocale !== this.props.loadedLocale) {
      this.forceUpdate();
    }

    if (this.props.courseURL && prevProps.courseURL !== this.props.courseURL) {
      this.handleOpenInNewWindow(this.props.courseURL);
    }

    // Learning error
    const nextError = _get(this.props, 'error.message', '');
    if (nextError && nextError !== _get(prevProps, 'error.message', '')) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextError,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleOpenInNewWindow(url) {
    // If we're missing a protocol, assume http
    let fixedUrl = url;
    if (fixedUrl.indexOf('://') === -1) {
      fixedUrl = 'http://' + url;
    }

    window.open(fixedUrl, 'Zunos_tab');
  }

  handleSearchClick() {
    const { hasBlockSearch, hasPageSearch } = this.context.settings.userCapabilities;

    if (hasPageSearch) {
      this.context.router.history.push('/pagesearch');
    } else if (hasBlockSearch) {
      this.context.router.history.push('/blocksearch');
    } else {
      this.props.setModalState(true);
    }
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    if (href.indexOf('/share/new') > -1) {
      this.handleOpenShareModal();
    } else {
      this.context.router.history.push(href);
    }
  }

  handleProfileButtonClick() {
    this.props.logout();
  }

  handleOpenShareModal() {
    this.props.setShareData({
      id: 0,
      isVisible: true,
      name: '',
      showMoreOptions: true, // go to advance share when enabled
      files: [],
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  handleOpenLearning() {
    const {
      courseLoading
    } = this.props;

    if (!courseLoading) {
      this.props.getUserCourseUrl(1); // zunos default
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming, user, userCapabilities } = this.context.settings;
    const {
      canCreateStory,
      hasBlockSearch,
      hasPageSearch,
      hasPitchBuilderWeb,
      hasLearning,
      hasNotes,
      hasSearch,
      hasShare,
      hasQuicklink,
      hasQuickfile,
      hasQuickform,
      hasNotifications
    } = userCapabilities;
    const { children, showBreadcrumbs, paths } = this.props;
    const styles = require('./AppHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AppHeader: true,
      fixedTop: children || paths.length > 0,
      fixedRight: !children || !paths.length
    }, this.props.className);

    const learningClasses = cx({
      learningIcon: true,
      loadingCourse: this.props.courseLoading
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const showCreateMenu = canCreateStory || hasNotes || hasShare;
    const hasQuicks = hasQuicklink || hasQuickfile || hasQuickform;

    return (
      <header id="app-header" className={classes} style={this.props.style} ref={this.props.myAppHeaderRef}>
        {showBreadcrumbs && paths.length > 0 && <Breadcrumbs
          paths={paths}
          className={styles.headerCrumbs}
          onPathClick={this.handleAnchorClick}
        />}
        {!showBreadcrumbs && children}
        <ul className={styles.headerActions}>
          {hasLearning && <li>
            <i
              className={learningClasses}
              onClick={this.handleOpenLearning}
            />
          </li>}
          {showCreateMenu && <li>
            <CreateMenu
              pitch={hasBlockSearch || (hasPageSearch && hasPitchBuilderWeb)}
              note={hasNotes}
              quicklink={canCreateStory && hasQuicks}
              share={hasShare}
              story={canCreateStory}
              strings={strings}
              position={{ top: '2.2rem', right: '-9.05rem' }}
              onAnchorClick={this.handleAnchorClick}
            />
          </li>}
          {hasSearch && <li>
            <div
              data-id="app-search"
              className={styles.search}
              onClick={this.handleSearchClick}
            />
          </li>}
          <li>
            <ProfileMenu
              user={user}
              strings={strings}
              position={{ top: '2.5rem', right: '-0.75rem' }}
              onAnchorClick={this.handleAnchorClick}
              hasNotifications={hasNotifications}
              onButtonClick={this.handleProfileButtonClick}
            />
          </li>
        </ul>
      </header>
    );
  }
}
