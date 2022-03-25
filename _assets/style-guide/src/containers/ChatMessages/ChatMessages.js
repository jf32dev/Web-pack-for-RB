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
  Btn,
  ChatMessages,
  ChatMessageItem
} from 'components';

const ChatMessagesDocs = require('!!react-docgen-loader!components/ChatMessages/ChatMessages.js');
const ChatMessageItemDocs = require('!!react-docgen-loader!components/ChatMessages/ChatMessageItem.js');

const sampleRoom = require('../../static/room.json');

const sampleMessages = sampleRoom[0].messages;

export default class ChatMessagesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeExampleUserId: 1,
      testMessages: sampleMessages,
      exampleMessageBody: '',
      exampleMessage: {
        id: 1337,
        type: 'chat',
        body: 'Example recieved',
        time: 1459305207774,
        received: true,
        user: {
          id: 202,
          name: 'Radical Guy',
          thumbnail: ''
        }
      },
      exampleFileMessage: {
        id: 1338,
        type: 'hub-attachment',
        body: 'StoryFileIdentifier/10093',
        time: 1459305203774,
        sent: true,
        user: {
          id: 202,
          name: 'Radical Guy',
          thumbnail: ''
        },
        file: {
          id: 10093,
          filename: 'example_file.jpg',
          description: '',
          category: 'image',
          thumbnail: ''
        },
      },
      isPinned: false,
      size: 'full'
    };

    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event);
  }

  handlePinClick(event) {
    event.preventDefault();
    this.setState({
      isPinned: !this.state.isPinned
    });
  }

  handleToggleSortClick(event) {
    event.preventDefault();
    let newSort = 'name';
    if (this.state.sortByExample === 'name') {
      newSort = 'time';
    }
    this.setState({ sortByExample: newSort });
  }

  handleExampleMessageInputChange(event) {
    this.setState({ exampleMessageBody: event.currentTarget.value });
  }

  handleExampleMessageSend(event) {
    event.preventDefault();
    const messageBody = this.state.exampleMessageBody.trim();

    if (messageBody) {
      const { testMessages } = this.state;
      const lastMessageId = testMessages[testMessages.length - 1].id;
      const newMessage = {
        id: lastMessageId + 1,
        type: 'chat',
        body: messageBody,
        time: Date.now(),
        sent: true,
        user: sampleMessages[0].user.id
      };
      const messagesCopy = [...testMessages, newMessage];

      this.setState({
        testMessages: messagesCopy,
        exampleMessageBody: ''
      });
    }
  }

  handleSizeToggle() {
    this.setState({
      size: this.state.size === 'full' ? 'compact' : 'full'
    });
  }

  handleSentToggle() {
    const newMessage = {
      ...this.state.exampleMessage,
      received: !this.state.exampleMessage.received,
      sent: !this.state.exampleMessage.sent
    };

    this.setState({
      exampleMessage: newMessage
    });
  }

  handleLoadingToggle() {
    const newMessage = {
      ...this.state.exampleFileMessage,
      file: {
        ...this.state.exampleFileMessage.file,
        description: !this.state.exampleFileMessage.file.description ? 'Example File' : ''
      }
    };

    this.setState({
      exampleFileMessage: newMessage
    });
  }

  render() {
    const { size } = this.state;

    return (
      <section id="ChatMessages">
        <h1>ChatMessages</h1>
        <Docs {...ChatMessagesDocs} />
        <p>
          <Btn onClick={this.handleSizeToggle} small>Toggle Size</Btn>
        </p>
        <ComponentItem style={{ width: size === 'full' ? '100%' : 390 }}>
          <ChatMessages
            userId={this.state.activeExampleUserId}
            messages={this.state.testMessages}
            messageBody={this.state.exampleMessageBody}
            showPin={size === 'full'}
            userIsPinned={this.state.isPinned}
            size={size}
            focusInputOnMount={false}
            onAnchorClick={this.handleAnchorClick}
            onFileClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
            onAttachClick={this.handleAnchorClick}
            onPinClick={this.handlePinClick}
            onInputChange={this.handleExampleMessageInputChange}
            onSendClick={this.handleExampleMessageSend}
            onUserClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>ChatMessageItem</h2>
        <Docs {...ChatMessageItemDocs} />
        <p>
          <Btn onClick={this.handleSentToggle} small>Toggle Sent</Btn>
          <Btn onClick={this.handleLoadingToggle} small>Toggle Loading</Btn>
        </p>
        <ComponentItem style={{ width: size === 'full' ? '100%' : 390 }}>
          <ChatMessageItem
            {...this.state.exampleMessage}
            size={size}
            onAnchorClick={this.handleAnchorClick}
            onFileClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
          <ChatMessageItem
            {...this.state.exampleFileMessage}
            size={size}
            onAnchorClick={this.handleAnchorClick}
            onFileClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
