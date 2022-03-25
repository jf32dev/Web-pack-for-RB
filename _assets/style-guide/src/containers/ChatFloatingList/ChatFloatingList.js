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

import findIndex from 'lodash/findIndex';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import {
  Btn,
  ChatFloatingList,
} from 'components';

const ChatFloatingListDocs = require('!!react-docgen-loader!components/ChatFloatingList/ChatFloatingList.js');

const sampleRoster = require('../../static/roster.json');

export default class ChatFloatingListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUserId: sampleRoster[0].id,
      activeUserName: sampleRoster[0].name,
      activeUserMessages: sampleRoster[0].messages,
      users: sampleRoster,
      lastClick: null
    };
    autobind(this);
  }

  handleAddUser(event) {
    event.preventDefault();
    const { users } = this.state;
    const newId = users[users.length - 1].id + 1;
    const newUsers = [...this.state.users,
      {
        id: newId,
        name: 'User ' + newId,
        type: 'people',
        presence: 100,
        messages: []
      }
    ];
    this.setState({
      users: newUsers
    });
  }

  handleUserClick(event) {
    event.preventDefault();
    const { users } = this.state;
    const id = parseInt(event.currentTarget.dataset.id, 10);
    const i = findIndex(users, { id: id });

    this.setState({
      activeUserId: id,
      activeUserMessages: users[i].messages,
      activeUserName: users[i].name,
      lastClick: 'activeUserId: ' + id
    });
  }

  handleCallClick(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    this.setState({
      lastClick: 'handleCallClick: ' + type
    });
  }

  handleCloseClick(event) {
    event.preventDefault();

    this.setState({
      lastClick: 'handleCloseClick'
    });
  }

  handleFileClick(event) {
    event.preventDefault();
    this.setState({
      lastClick: 'handleFileClick'
    });
  }

  handleStoryClick(event) {
    event.preventDefault();
    this.setState({
      lastClick: 'handleStoryClick'
    });
  }

  handleAttachClick(event) {
    event.preventDefault();
    this.setState({
      lastClick: 'handleAttachClick'
    });
  }

  handleInputChange(event) {
    event.preventDefault();
    this.setState({
      lastClick: 'handleInputChange'
    });
  }

  handleSendClick(event) {
    event.preventDefault();
    this.setState({
      lastClick: 'handleSendClick'
    });
  }

  handleMoreUsersClick(event) {
    event.preventDefault();
    this.setState({
      lastClick: 'show more users'
    });
  }

  render() {
    const { lastClick } = this.state;

    return (
      <section id="ChatFloatingList">
        <h1>ChatFloatingList</h1>
        <Docs {...ChatFloatingListDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <p><Btn small onClick={this.handleAddUser}>Add User</Btn></p>
        <ComponentItem>
          <ChatFloatingList
            users={this.state.users}
            activeUserId={this.state.activeUserId}
            activeUserName={this.state.activeUserName}
            activeUserMessages={this.state.activeUserMessages}
            onUserClick={this.handleUserClick}
            onCallClick={this.handleCallClick}
            onCloseClick={this.handleCloseClick}
            onFileClick={this.handleFileClick}
            onStoryClick={this.handleStoryClick}
            onAttachClick={this.handleAttachClick}
            onInputChange={this.handleInputChange}
            onSendClick={this.handleSendClick}
            onMoreUsersClick={this.handleMoreUsersClick}
            style={{ position: 'relative', top: 0, right: 0 }}
          />
        </ComponentItem>
      </section>
    );
  }
}
