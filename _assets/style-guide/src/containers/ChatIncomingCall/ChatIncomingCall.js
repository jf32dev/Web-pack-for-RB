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
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import {
  ChatIncomingCall,
} from 'components';

const ChatIncomingCallDocs = require('!!react-docgen-loader!components/ChatIncomingCall/ChatIncomingCall.js');

const users = require('../../static/users.json');

export default class ChatIncomingCallView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null
    };
    autobind(this);
  }

  handleAcceptClick(event) {
    event.preventDefault();
    const id = event.currentTarget.dataset.id;
    this.setState({
      lastClick: 'accept user id: ' + id
    });
  }

  handleRejectClick(event) {
    event.preventDefault();
    const id = event.currentTarget.dataset.id;
    this.setState({
      lastClick: 'reject user id: ' + id
    });
  }

  render() {
    const { lastClick } = this.state;

    return (
      <section id="ChatIncomingCall">
        <h1>ChatIncomingCall</h1>
        <Docs {...ChatIncomingCallDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem>
          <ChatIncomingCall
            user={users[0]}
            onAcceptClick={this.handleAcceptClick}
            onRejectClick={this.handleRejectClick}
          />
          <br />
          <ChatIncomingCall
            user={users[1]}
            isVideo
            onAcceptClick={this.handleAcceptClick}
            onRejectClick={this.handleRejectClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
