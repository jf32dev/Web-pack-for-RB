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
 * @package style-guide
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import CustomAppsEdit, { EDIT, KEY } from './CustomAppsEdit';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const AUTH = 1;
const INPUT = 2;
const COPY = 3;

/**
 * choose auth modal
 */
export default class CreateModal extends PureComponent {
  static propTypes = {
    /** call back method to close modal*/
    onClose: PropTypes.func,

    isVisible: PropTypes.bool,

    onClick: PropTypes.func,

    onSave: PropTypes.func,

    scopes: PropTypes.object,

    user: PropTypes.object,

    client: PropTypes.object,

    onChangeUser: PropTypes.func,

    onCopyError: PropTypes.func,

    onCopySuccess: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      chooseAuthMethod: 'Choose Auth Method',
      standardOAuth: 'Standard OAuth 2.0 (User Authentication)',
      apiOAuth: 'OAuth 2.0 with API key (Server Authentication)',
      standardOAuthDesc: 'Require Bigtincan Hub users to log in to authorize your app.',
      apiOAuthDesc: 'Allows your app to authenticate with Bigtincan Hub using an API key instead of user credentials.',
      cancel: 'Cancel',
    },
    user: {},
    client: null,
    scopes: {
      'admin_group_r': 'Read user group data',
      'admin_group_w': 'Create/edit user groups',
      'admin_user_r': 'Read user data',
      'admin_user_w': 'Create/edit users',
      'channel_r': 'Read channel data',
      'channel_w': 'Modify channels',
      'form_r': 'Read form data',
      'history_w': 'Track story and file interactions',
      'story_r': 'Read story data',
      'story_w': 'Modify stories',
      'settings_r': 'Read user settings',
      'structure_w': 'Modify content structure',
      'as_user': 'Perform actions on behalf of other users'
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.view === AUTH && !prevState.isSaveDisable) {
      return {
        isSaveDisable: true
      };
    }

    if (nextProps.error && prevState.view === INPUT && prevState.isSaveDisable && prevState.isCreateBtnPress) {
      return {
        isSaveDisable: false,
        isCreateBtnPress: false
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      view: AUTH,
      isForward: true,
      isSaveDisable: true,
      isCreateBtnPress: false
    };
    this.choose = ['standardOAuth', 'apiOAuth'];
    this.myEditRef = React.createRef();
    autobind(this);
  }

  //===== Forward backward ====== start
  componentDidUpdate(prevProps, prevState) {
    if (this.state.isForward !== prevState.isForward) {
      this.handleSetView(this.state.view + (this.state.isForward ? 1 : -1));
    }

    if (!_isEmpty(this.props.client) && this.state.view === INPUT) {
      this.handleForward();
    }

    if (!this.props.isVisible && prevProps.isVisible && this.state.view !== AUTH && _isEmpty(this.props.user)) {
      this.timer = window.setTimeout(() => {
        this.setState({
          view: AUTH,
          isSaveDisable: false,
          isCreateBtnPress: false
        });
        window.clearInterval(this.timer);
      }, 500);
    }
  }

  componentWillUnmount() {
    if (this.timer) window.clearInterval(this.timer);
  }

  handleForward() {
    if (this.state.isForward) {
      this.handleSetView(this.state.view + 1);
    } else {
      this.setState({
        isForward: true,
      });
    }
  }

  handleBackward() {
    if (this.state.isForward) {
      this.setState({
        isForward: false,
      });
    } else {
      this.handleSetView(this.state.view - 1);
    }
  }

  handleSetView(view) {
    this.setState({ view });
  }
  //===== Forward backward ====== end

  handleAuthClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    this.handleForward();
  }

  handleSaveDisableUpdate(isSaveDisable) {
    this.setState({
      isSaveDisable
    });
  }

  handleSave() {
    this.setState({
      isSaveDisable: true,
      isCreateBtnPress: true,
    });

    if (this.props.onSave) {
      const node = this.myEditRef.current;
      this.props.onSave(node.state.update);
    }
  }

  render() {
    const styles = require('./CreateModal.less');
    const { isVisible, onClose, strings, scopes, user, client, onChangeUser } = this.props;
    const { isForward, view, isSaveDisable } = this.state;

    const cx = classNames.bind(styles);
    const classes = cx({
      CreateModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        bodyClassName={styles.body}
        onClose={onClose}
        headerClassName={view === INPUT ? styles.emptyHeader : ''}
        headerChildren={
          <Fragment>
            {view === AUTH && <p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.chooseAuthMethod}</p>}
            {view === COPY && <p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.OAuth2Credentials}</p>}
          </Fragment>
        }
        footerChildren={(<div>
          {view === AUTH && <Btn
            alt large onClick={onClose}
            data-id="close"
          >{strings.cancel}</Btn>}
          {view === COPY && <Btn
            alt large onClick={onClose}
            data-id="done"
          >{strings.done}</Btn>}
          {view === INPUT && <Btn
            alt large onClick={this.handleBackward}
            data-id="back"
          >{strings.back}</Btn>}
          {view === INPUT && <Btn
            inverted
            large
            data-action="confirm"
            disabled={isSaveDisable}
            onClick={this.handleSave}
            data-id="save"
          >{strings.save}</Btn>}
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <TransitionGroup>
            <CSSTransition
              key={view}
              classNames={{
                enter: isForward ? styles['slide-enter'] : styles['slide-exit-enter'],
                enterActive: isForward ? styles['slide-enter-active'] : styles['slide-exit-enter-active'],
                exit: isForward ? styles['slide-exit'] : styles['slide-enter-leave'],
                exitActive: isForward ? styles['slide-exit-active'] : styles['slide-enter-leave-active']
              }}
              timeout={{
                enter: 500,
                exit: 500
              }}
              appear
            >
              <Fragment>
                {view === AUTH && <div className={styles.auth}>
                  {this.choose.map(item => (
                    <div
                      className={styles.item} key={item} data-type={item === 'apiOAuth' ? 'api_key' : 'authorization'}
                      onClick={this.handleAuthClick}
                    >
                      <div>{strings[item]}</div>
                      <p>{strings[`${item}Desc`]}</p>
                      <div className={styles.icon} />
                    </div>
                  ))}
                </div>}
                {view === INPUT && <CustomAppsEdit
                  ref={this.myEditRef}
                  strings={strings}
                  user={user}
                  scopes={scopes}
                  views={[EDIT]}
                  onSaveDisableUpdate={this.handleSaveDisableUpdate}
                  onChangeUser={onChangeUser}
                />}
                {view === COPY && <CustomAppsEdit
                  client={client}
                  strings={strings}
                  user={user}
                  onCopyError={this.props.onCopyError}
                  onCopySuccess={this.props.onCopySuccess}
                  views={[KEY]}
                />}
              </Fragment>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </Modal>
    );
  }
}
