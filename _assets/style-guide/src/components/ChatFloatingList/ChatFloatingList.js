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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import ChatMessages from 'components/ChatMessages/ChatMessages';
import UserThumb from 'components/UserThumb/UserThumb';

/**
 * Displays the last n users in a compact window.
 * Should only be displayed when there is an active user.
 */
export default class ChatFloatingList extends Component {
  static propTypes = {
    /** users with messages */
    users: PropTypes.array,
    activeUser: PropTypes.object,

    /** max users to display */
    maxUsers: PropTypes.number,

    showAudioCall: PropTypes.bool,
    showVideoCall: PropTypes.bool,

    children: PropTypes.node,

    onUserClick: PropTypes.func.isRequired,
    onCallClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,
    onAttachClick: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSendClick: PropTypes.func.isRequired,
    onMoreUsersClick: PropTypes.func.isRequired,

    authString: PropTypes.string,
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    activeUserId: 0,
    maxUsers: 5,
    authString: '',
    strings: {}
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const {
      users,
      activeUser,
      maxUsers,
      showAudioCall,
      showVideoCall,
      children,
      onUserClick,
      onCallClick,
      onCloseClick,
      onAnchorClick,
      onFileClick,
      onStoryClick,
      onAttachClick,
      onInputChange,
      onSendClick,
      onMoreUsersClick,
      authString,
      className,
      style
    } = this.props;
    const styles = require('./ChatFloatingList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatFloatingList: true
    }, className);

    // Do not display if no active user
    if (!activeUser || !activeUser.id || !activeUser.name) {
      return false;
    }

    const tooManyUsers = users.length > 99;

    return (
      <div className={classes} style={style}>
        <div className={styles.userListWrap}>
          <ul>
            {users.slice(0, maxUsers).map(user => (
              <li
                key={user.id}
                aria-label={user.name}
                data-id={user.id}
                className={styles.userItem + (user.id === activeUser.id ? ' ' + styles.userActive : '')}
                onClick={onUserClick}
              >
                {user.unreadCount > 0 && <span
                  className={styles.unreadIndicator}
                />}
                <UserThumb
                  grid
                  width={32}
                  authString={authString}
                  className={styles.userThumb}
                  {...user}
                />
              </li>
            ))}
            {users.length > maxUsers && <li
              className={styles.moreUsers}
              onClick={onMoreUsersClick}
            >
              <span>{tooManyUsers ? '>99' : '+' + (users.length - maxUsers)}</span>
            </li>}
          </ul>
          <div className={styles.minimise} onClick={onCloseClick} />
        </div>
        {activeUser.id && activeUser.name && <div className={styles.chatMessagesWrap}>
          <header className={styles.chatMessagesHeader}>
            <h4>{activeUser.name}</h4>
            <ul className={styles.actions}>
              {showAudioCall && <li
                data-type="audio"
                className={styles.audioCall}
                onClick={onCallClick}
              />}
              {showVideoCall && <li
                data-type="video"
                className={styles.videoCall}
                onClick={onCallClick}
              />}
            </ul>
          </header>
          <ChatMessages
            userId={activeUser.id}
            messages={activeUser.messages}
            messageBody={activeUser.messageBody}
            size="compact"
            showAttachMenu={false}
            authString={authString}
            onAnchorClick={onAnchorClick}
            onFileClick={onFileClick}
            onStoryClick={onStoryClick}
            onAttachClick={onAttachClick}
            onInputChange={onInputChange}
            onSendClick={onSendClick}
            className={styles.chatMessages}
          />
          {children && children}
        </div>}
      </div>
    );
  }
}
