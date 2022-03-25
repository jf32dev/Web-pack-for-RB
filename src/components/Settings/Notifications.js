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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { connect } from 'react-redux';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getNotifications,
  setNotifications,
} from 'redux/modules/userSettings';

import Loader from 'components/Loader/Loader';
import UserNotifications from 'components/UserNotifications/UserNotifications';

function mapStateToProps(state) {
  const { userSettings } = state;

  return {
    ...userSettings,
    notifications: userSettings.notifications,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getNotifications,
    setNotifications,
  })
)
export default class Notifications extends Component {
  static propTypes = {
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.notificationsLoading) {
      this.props.getNotifications();
    }
  }

  //Dummy function for presentation
  handleOnChange(event, context) {
    const code = event.currentTarget.name;
    const value = parseInt(event.currentTarget.value, 10);
    const options = context.options;
    const notificationValue = parseInt(this.props.notifications[code], 10) || 0;

    const isChecked = event.currentTarget.checked;
    const currentValue = isChecked ? notificationValue + value : notificationValue - value;

    const tmpData = [];
    tmpData.push({ code: code, value: currentValue, hasChildren: options && options.length });

    // Changing all children depending on parent
    if (options && options.length) {
      options.map(obj => {
        let nShifted = this.props.notifications[obj.id];
        const aFromMask = [];

        // Bitwise - Reverse mask of notification objects
        for (nShifted; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1); // eslint-disable-line

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

        tmpData.push({ code: obj.id, value: values });
        return obj;
      });
    }
    this.props.setNotifications(tmpData);
  }

  render() {
    if (this.props.notificationsLoading || !this.props.notificationsLoaded) {
      return <Loader type="page" />;
    }

    return (
      <UserNotifications
        onChange={this.handleOnChange}
        notifications={this.props.notifications}
      />
    );
  }
}
