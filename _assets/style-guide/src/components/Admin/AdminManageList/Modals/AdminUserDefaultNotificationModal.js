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
 * @author Jason Huang <jason.huangs@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import UserNotifications from 'components/UserNotifications/UserNotifications';

const messages = defineMessages({
  userDefaults: { id: 'user-defaults', defaultMessage: 'User Defaults' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },
  email: { id: 'email', defaultMessage: 'Email' },
  userDefaultNotifications: { id: 'user-default-notifications', defaultMessage: 'User Default Notifications' },
  userDefaultNotificationsDesc: { id: 'user-default-notifications-desc', defaultMessage: 'Apply default settings for Notifications. Notifications provide users with updates on activity that occurs on their content and others. You can enable email, push or both for each activity listed. Enable "Update All Users" for applying the setting to new and existing users.' },
});

/**
 * Create/Edit user Admin modal
 */
export default class AdminUserDefaultNotificationModal extends PureComponent {
  static propTypes = {
    notifications: PropTypes.object,

    isVisible: PropTypes.bool,

    onChange: function(props) {
      if (typeof props.onChange !== 'function') {
        return new Error('onChange is required');
      }
      return null;
    },

    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    notifications: {},
    isVisible: false,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleChange(event, context) {
    const { checked, value } = event.currentTarget;
    const { notifications } = this.props;
    const currentValue = notifications[context.id];

    let update = notifications;

    if (context.options.length > 0) {
      const optionsUpdate = context.options.reduce((accumulator, item) => {
        if (checked) {
          return {
            ...accumulator,
            [item.id]: +notifications[item.id] + +value
          };
        }

        const binaryNum = (+notifications[item.id]).toString(2);
        const binaryStr = '000'.substr(binaryNum.length) + binaryNum;

        if (+binaryStr[3 - (+value).toString(2).length] === 1) {
          return {
            ...accumulator,
            [item.id]: +notifications[item.id] - +value
          };
        }

        return {
          ...accumulator,
          [item.id]: +notifications[item.id]
        };
      }, {});
      update = {
        ...notifications,
        ...optionsUpdate,
      };
    } else {
      update = {
        ...notifications,
        [context.id]: checked ? +currentValue + +value : +currentValue - +value,
      };
    }

    this.props.onChange(update);
  }

  render() {
    const {
      notifications,
      isVisible,
    } = this.props;
    const styles = require('./AdminUserDefaultNotificationsModal.less');

    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <Modal
        isVisible={isVisible}
        headerTitle={strings.userDefaultNotifications}
        escClosesModal
        width="medium"
        footerChildren={(<div>
          <Btn
            alt large onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.props.onSave}
            style={{ marginLeft: '0.5rem' }}
          >{strings.save}</Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div className={styles.desc}>
          <h3>{strings.userDefaultNotifications}</h3>
          <h5>{strings.userDefaultNotificationsDesc}</h5>
        </div>
        <UserNotifications
          notifications={notifications}
          notificationsLoading={false}
          admin
          className={styles.adminNotifications}
          onChange={this.handleChange}
        />
      </Modal>
    );
  }
}
