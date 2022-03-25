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
import Docs from '../../views/Docs';
import {
  ChatRoom,
  RadioGroup
} from 'components';

const ChatRoomDocs = require('!!react-docgen-loader!components/ChatRoom/ChatRoom.js');

const sampleRoom = require('../../static/room.json');
const sampleMessages = sampleRoom[0].messages;
const users = require('../../static/users.json');

export default class ChatRoomView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      name: 'Cool Room',
      status: 'incoming',
      messages: sampleMessages
    };
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event);
  }

  handleRadioGroupChange(event) {
    this.setState({
      status: event.currentTarget.value
    });
  }

  render() {
    return (
      <section id="ChatRoomView">
        <h1>ChatRoom</h1>
        <Docs {...ChatRoomDocs} />
        <RadioGroup
          legend="Status"
          name="status"
          selectedValue={this.state.status}
          onChange={this.handleRadioGroupChange}
          inlineInputs
          inlineLegend
          options={[{
            label: 'Incoming',
            value: 'incoming'
          }, {
            label: 'Empty',
            value: 'empty'
          }, {
            label: 'Invited',
            value: 'invited'
          }, {
            label: 'Accepted',
            value: 'accepted'
          }, {
            label: 'Expired',
            value: 'expired'
          }]}
        />
        <ComponentItem style={{ height: 450 }}>
          <ChatRoom
            messages={sampleMessages}
            inviteUser={users[0]}
            publishAudio
            publishVideo
            onAnchorClick={this.handleAnchorClick}
            onFileClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
            onAttachClick={this.handleAnchorClick}
            onInputChange={this.handleAnchorClick}
            onSendClick={this.handleAnchorClick}
            {...this.state}
          />
        </ComponentItem>
      </section>
    );
  }
}
