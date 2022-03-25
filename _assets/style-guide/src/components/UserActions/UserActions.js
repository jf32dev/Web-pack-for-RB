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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';

const messages = defineMessages({
  chat: { id: 'chat', defaultMessage: 'Chat' },
  email: { id: 'email', defaultMessage: 'Email' },
  follow: { id: 'follow', defaultMessage: 'Follow' },
  unfollow: { id: 'unfollow', defaultMessage: 'Unfollow' },
  bulkUpload: { id: 'bulk-upload', defaultMessage: 'Bulk Upload' },
  userDefaults: { id: 'user-defaults', defaultMessage: 'User Defaults' },
  userDefaultSettings: { id: 'user-default-settings', defaultMessage: 'User Default Settings' },
  defaultMetadataAttributes: { id: 'default-metadata-attributes', defaultMessage: 'Default Metadata Attributes' },
  userDefaultNotifications: { id: 'user-default-notifications', defaultMessage: 'User Default Notifications' },
  select: { id: 'select', defaultMessage: 'Select' }
});

const ucFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Actions related to UserItem: call, chat, follow
 */
export default class UserActions extends PureComponent {
  static propTypes = {
    /** user id required for '/chat/id' url */
    id: PropTypes.number.isRequired,

    /** indicates followed state */
    isFollowed: PropTypes.bool,

    /** show Bulk upload icon - must set onBulkUploadClick - Used in Admin Manage list*/
    showBulkUpload: PropTypes.bool,

    /** show Call icon - must set onCallClick */
    showCall: PropTypes.bool,

    /** show Chat icon - must set onChatClick */
    showChat: PropTypes.bool,

    /** show Chat icon - must set onEmailClick */
    showEmail: PropTypes.bool,

    /** show Edit icon - must set onEditClick */
    showEdit: PropTypes.bool,

    /** show Delete icon - must set onDeleteClick */
    showDelete: PropTypes.bool,

    /** show Follow button - must set onFollowClick */
    showFollow: PropTypes.bool,

    /** show Plus icon when item is not selected */
    showPlus: PropTypes.bool,

    /** show Tick icon when item is selected */
    showTick: PropTypes.bool,

    /** show User Share icon when item is selected */
    showShare: PropTypes.bool,

    /** show User Default menu - must set onUserDefaultClick - Used in Admin Manage list*/
    showUserDefault: PropTypes.bool,

    /** show Default Metadata menu- must set onDefaultMetadata - Used in Admin Manage list*/
    showDefaultMetadata: PropTypes.bool,

    /** show User Default Notification menu - must set onUserDefaultNotifications - Used in Admin Manage list*/
    showUserDefaultNotifications: PropTypes.bool,

    /** show Unlink/ Remove relationship */
    showUnlink: PropTypes.bool,

    onCallClick: function(props) {
      if (props.showCall && typeof props.onCallClick !== 'function') {
        return new Error('onCallClick is required when showCall is provided.');
      }
      return null;
    },

    onChatClick: function(props) {
      if (props.showChat && typeof props.onChatClick !== 'function') {
        return new Error('onChatClick is required when showChat is provided.');
      }
      return null;
    },

    onEmailClick: function(props) {
      if (props.showEmail && typeof props.onEmailClick !== 'function') {
        return new Error('onEmailClick is required when showEmail is provided.');
      }
      return null;
    },

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    onUnlinkClick: function(props) {
      if (props.showUnlink && typeof props.onUnlinkClick !== 'function') {
        return new Error('onUnlinkClick is required when showUnlink is provided.');
      }
      return null;
    },

    onFollowClick: function(props) {
      if (props.showFollow && typeof props.onFollowClick !== 'function') {
        return new Error('onFollowClick is required when showFollow is provided.');
      }
      return null;
    },

    onDeleteClick: function(props) {
      if (props.showDelete && typeof props.onDeleteClick !== 'function') {
        return new Error('onDeleteClick is required when showDelete is provided.');
      }
      return null;
    },

    onBulkUploadClick: function(props) {
      if (props.showBulkUpload && typeof props.onBulkUploadClick !== 'function') {
        return new Error('onBulkUploadClick is required when showBulkUpload is provided.');
      }
      return null;
    },

    onUserDefaultsClick: function(props) {
      if (props.showUserDefault && typeof props.onUserDefaultsClick !== 'function') {
        return new Error('onUserDefaultsClick is required when showUserDefault is provided.');
      }
      return null;
    },

    onUserDefaultNotificationsClick: function(props) {
      if (props.showUserDefaultNotifications && typeof props.onUserDefaultNotificationsClick !== 'function') {
        return new Error('onUserDefaultNotificationsClick is required when showUserDefaultNotifications is provided.');
      }
      return null;
    },

    onDefaultMetadataClick: function(props) {
      if (props.showDefaultMetadata && typeof props.onDefaultMetadataClick !== 'function') {
        return new Error('onDefaultMetadataClick is required when showDefaultMetadata is provided.');
      }
      return null;
    },

    onSelectClick: function(props) {
      if (props.showSelect && typeof props.onCallClick !== 'function') {
        return new Error('onCallClick is required when showSelect is provided.');
      }
      return null;
    },

    onAddClick: PropTypes.func,

    onTickClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object
  };

  static defaultProps = {
    showFollow: true,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      id,
      isFollowed,
      showCall,
      showChat,
      showEmail,
      showEdit,
      showFollow,
      showPlus,
      showDelete,
      showTick,
      showBulkUpload,
      showUserDefault,
      showUnlink,
      showDefaultMetadata,
      showUserDefaultNotifications,
      className,
      style,
      showShare
    } = this.props;
    const styles = require('./UserActions.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      UserActions: true,
      onlyActionList: !showFollow
    }, className);

    // Translations
    const strings = generateStrings(messages, this.context.intl !== undefined ? this.context.intl.formatMessage : null);
    const userDefaultEnabled = showUserDefault || showDefaultMetadata || showUserDefaultNotifications;

    return (
      <div className={classes} style={style}>
        {showFollow && <Btn
          inverted={!isFollowed}
          className={styles.followBtn}
          onClick={this.props.onFollowClick}
        >
          {isFollowed ? strings.unfollow : strings.follow}
        </Btn>}
        {['select'].filter(item => this.props[`show${ucFirst(item)}`]).map(item => (<Btn
          key={item}
          className={styles.followBtn}
          {...{
            onClick: this.props[`on${ucFirst(item)}Click`]
          }}
        >
          {strings[item]}
        </Btn>))}
        {(showShare || showCall || showChat || showEmail || showEdit || showUnlink || showPlus || showTick || showDelete || showBulkUpload || showUserDefault || showDefaultMetadata || showUserDefaultNotifications) && <ul>
          {showChat && <li data-testid="chat" className={styles.chatBtn}>
            <a aria-label={strings.chat} href={'/chat/' + id} onClick={this.props.onChatClick} />
          </li>}
          {showEmail && <li data-testid="email" className={styles.emailBtn} onClick={this.props.onEmailClick} />}
          {showShare && <li data-testid="share" className={styles.shareBtn} />}
          {showCall && <li
            data-testid="call" data-type="audio" className={styles.callBtn}
            onClick={this.props.onCallClick}
          />}
          {showEdit && !userDefaultEnabled && !showBulkUpload && <li data-testid="edit" className={styles.editBtn} onClick={this.props.onEditClick} />}
          {showUnlink && !showBulkUpload && <li data-testid="unLink" className={styles.unlinkBtn} onClick={this.props.onUnlinkClick} />}
          {(userDefaultEnabled) && <li className={styles.settingsBtn}>
            <DropMenu
              icon="pencil-edit"
              position={{ right: 0 }}
              className={styles.settingsDropMenu}
              width={220}
            >
              <ul>
                {showUserDefault && <li data-testid="userDefault" onClick={this.props.onUserDefaultsClick}>{strings.userDefaultSettings}</li>}
                {showDefaultMetadata && <li data-testid="defaultMetadata" onClick={this.props.onDefaultMetadataClick}>{strings.defaultMetadataAttributes}</li>}
                {showUserDefaultNotifications && <li data-testid="defaultNotification" onClick={this.props.onUserDefaultNotificationsClick}>{strings.userDefaultNotifications}</li>}
              </ul>
            </DropMenu>
          </li>}
          {showBulkUpload && <li data-testid="bulkUpload" className={styles.bulkBtn} onClick={this.props.onBulkUploadClick} />}
          {showPlus && <li
            data-testid="add" className={styles.plusBtn} data-action="add"
            data-id={id} onClick={this.props.onAddClick}
          />}
          {showTick && <li
            data-testid="tick" className={styles.tickBtn} data-action="delete"
            data-id={id} onClick={this.props.onTickClick}
          />}
          {showDelete && <li
            data-testid="delete" className={styles.deleteBtn} data-action="delete"
            data-id={id} onClick={this.props.onDeleteClick}
          />}
        </ul>}
      </div>
    );
  }
}
