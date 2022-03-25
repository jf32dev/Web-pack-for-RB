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

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import UserItem from 'components/UserItem/UserItem';
import UserThumb from 'components/UserThumb/UserThumb';

/**
 * Displayed in <code>AppHeader</code>
 */
export default class ProfileMenu extends Component {
  static propTypes = {
    /** A user object with id, name and thumbnail */
    user: PropTypes.object.isRequired,
    position: PropTypes.object,

    strings: PropTypes.object,

    /** Handler for links */
    onAnchorClick: PropTypes.func.isRequired,

    /** Handler for Sign Out button */
    onButtonClick: PropTypes.func.isRequired,

    hasNotifications: PropTypes.bool,
  };

  static defaultProps = {
    position: { left: 0, right: 0 },
    hasNotifications: true,
    strings: {
      viewProfile: 'View Profile',
      settings: 'Settings',
      notifications: 'Notifications',
      support: 'Support',
      signOut: 'Sign Out'
    }
  };

  render() {
    const {
      user,
      strings,
      onAnchorClick,
      onButtonClick,
      hasNotifications
    } = this.props;
    const styles = require('./ProfileMenu.less');
    const headingElem = (
      <div>
        <UserThumb
          {...user}
          width={38}
          className={styles.headingThumb}
        />
        <span className={styles.headingIcon} />
      </div>
    );

    return (
      <DropMenu
        id="profile-menu" heading={headingElem} position={this.props.position}
        width={250}
      >
        <div className={styles.ProfileMenu}>
          <UserItem
            {...user}
            anchorLink="/profile"
            thumbSize="medium"
            showThumb
            onClick={onAnchorClick}
            className={styles.userThumb}
          />
          <ul className={styles.linkList}>
            <li><a href="/settings/general" onClick={onAnchorClick}>{strings.settings}</a></li>
            {hasNotifications && <li><a href="/settings/notifications" onClick={onAnchorClick}>{strings.notifications}</a></li>}
            <li><a href="/settings/support" onClick={onAnchorClick}>{strings.support}</a></li>
          </ul>
          <Btn inverted onClick={onButtonClick} data-id="signout">
            {strings.signOut}
          </Btn>
        </div>
      </DropMenu>
    );
  }
}
