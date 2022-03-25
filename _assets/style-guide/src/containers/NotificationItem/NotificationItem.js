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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import { NotificationItem } from 'components';

const ItemDocs = require('!!react-docgen-loader!components/NotificationItem/NotificationItem.js');

const notifications = require('../../static/notifications.json');

export default class NotificationItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  render() {
    return (
      <section id="NotificationItemView">
        <h1>NotificationItem</h1>
        <Docs {...ItemDocs} />

        <h2>List</h2>
        <ComponentItem>
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              onClick={this.handleClick}
              onFollowClick={this.handleClick}
              showThumb
              {...notification}
            />
          ))}
        </ComponentItem>
      </section>
    );
  }
}
