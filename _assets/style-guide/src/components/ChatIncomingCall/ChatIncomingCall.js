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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import UserItem from 'components/UserItem/UserItem';

/**
 * Incoming audio/video call notification for Chat Users.
 */
export default class ChatIncomingCall extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,

    isVideo: PropTypes.bool,
    roomId: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,

    onAcceptClick: PropTypes.func.isRequired,
    onDenyClick: PropTypes.func.isRequired,

    authString: PropTypes.string,
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    strings: {
      incomingAudioCall: 'Incoming audio call...',
      incomingVideoCall: 'Incoming video call...'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      user,
      roomId,
      token,
      isVideo,
      onAcceptClick,
      onDenyClick,
      authString,
      strings,
      className,
      style
    } = this.props;
    const styles = require('./ChatIncomingCall.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatIncomingCall: true
    }, className);

    return (
      <div className={classes} style={style}>
        <UserItem
          {...user}
          thumbSize="small"
          note={isVideo ? strings.incomingVideoCall : strings.incomingAudioCall}
          showThumb
          noLink
          authString={authString}
          className={styles.userItem}
        />
        <ul className={styles.actions}>
          <li
            className={styles.acceptCall}
            data-id={user.id}
            data-roomid={roomId}
            data-token={token}
            data-type="accept"
            onClick={onAcceptClick}
          />
          <li
            className={styles.denyCall}
            data-id={user.id}
            data-roomid={roomId}
            data-token={token}
            data-type="deny"
            onClick={onDenyClick}
          />
        </ul>
      </div>
    );
  }
}
