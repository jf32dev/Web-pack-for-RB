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
import classNames from 'classnames/bind';

import UserItem from 'components/UserItem/UserItem';

/**
 * Displays a Chat User's details with related actions.
 */
export default class ChatUserDetails extends PureComponent {
  static propTypes = {
    /** Valid UserItem data */
    user: PropTypes.object,

    showAudioCall: PropTypes.bool,
    showVideoCall: PropTypes.bool,
    showViewProfile: PropTypes.bool,

    strings: PropTypes.object,

    /** Handle anchor click (view profile) */
    onAnchorClick: PropTypes.func,

    /** Handle audio/video call (dataset.type) */
    onCallClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    showAudioCall: true,
    showVideoCall: true,
    showViewProfile: true,
    strings: {
      details: 'Details',
      call: 'Call',
      videoCall: 'Video Call',
      viewProfile: 'View Profile',
    },
  };

  render() {
    const {
      user,
      strings,
      showAudioCall,
      showVideoCall,
      showViewProfile,
      onAnchorClick,
      onCallClick,
      className,
      style
    } = this.props;
    const styles = require('./ChatUserDetails.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatUserDetails: true
    }, className);

    const hasAction = showAudioCall || showVideoCall || showViewProfile;

    return (
      <div className={classes} style={style}>
        <div className={styles.detailWrap}>
          <h3>{strings.details}</h3>
          <UserItem
            {...user}
            grid
            thumbSize="medium"
            showThumb
            inList
            onClick={onAnchorClick}
            className={styles.userItem}
          />
        </div>
        {hasAction && <ul className={styles.actions}>
          {showAudioCall && <li data-type="audio" className={styles.audioCall} onClick={onCallClick}>
            {strings.call}
          </li>}
          {showVideoCall && <li data-type="video" className={styles.videoCall} onClick={onCallClick}>
            {strings.videoCall}
          </li>}
          {showViewProfile && <li className={styles.viewProfile}>
            <a href={'/people/' + user.id} aria-label={strings.viewProfile} onClick={onAnchorClick}>
              {strings.viewProfile}
            </a>
          </li>}
        </ul>}
      </div>
    );
  }
}
