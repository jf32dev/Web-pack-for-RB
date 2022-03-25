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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

//import differenceBy from 'lodash/differenceBy';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import UserNotifications from 'components/UserNotifications/UserNotifications';

const UserNotificationsDocs = require('!!react-docgen-loader!components/UserNotifications/UserNotifications.js');

const notifications = require('../../static/userNotifications.json');

export default class UserNotificationsView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: '',
      notifications: notifications
    }
    autobind(this);
  }

  handleOnChange(event, context) {
    const code = event.currentTarget.name;
    const value = parseInt(event.currentTarget.value, 10);
    const options = context.options;
    const notificationValue = parseInt(this.state.notifications[code], 10);

    const isChecked = event.currentTarget.checked;
    const currentValue = isChecked ? notificationValue + value : notificationValue - value;

    const tmpData = {};
    tmpData[code] = currentValue;

    // Changing all children depending on parent
    if (options && options.length) {
      options.map(obj => {
        let nShifted = this.state.notifications[obj.id];
        const aFromMask = [];

        // Bitwise - Reverse mask of notification objects
        for (nShifted; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);

        let values = 0;
        if (isChecked && value === 1) {
          values = 1;
          if (aFromMask[1]) values += 2;
        } else if (isChecked && value === 2) {
          values = 2;
          if (aFromMask[0]) values += 1;
        } else if (!isChecked && value === 1) {
          if (aFromMask[1]) values = 2;
        } else if (!isChecked && value === 2) {
          if (aFromMask[0]) values = 1;
        }

        tmpData[obj.id] = values;
      });
    }

    this.setState({
      notifications: {
        ...this.state.notifications,
        ...tmpData
      }
    })
  }

  render() {
    const { lastClick } = this.state;

    return (
      <section id="UserProfileView">
        <h1>User Notifications</h1>
        <p>Set User notifications settings.</p>

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>UserNotifications</h2>
        <Docs {...UserNotificationsDocs} />
        <ComponentItem>
          <UserNotifications
            onChange={this.handleOnChange}
            notifications={this.state.notifications}
          />
        </ComponentItem>
      </section>
    );
  }
}
