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
import { store } from '../../redux/modules/chat/store';
import {
  disconnect,
  sendMessage,
  openSocket,
  messagesRead,
  setActiveRecipient
} from '../../redux/modules/chat/actions';
import ComponentItem from '../../views/ComponentItem';
import {
  Blankslate,
  Btn,
  ChatMessages,
  ChatRoster,
  Text
} from 'components';

export default class ChatSocketView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '0e7d047e9795d2a089099d495290b75f12235be7',
      messageBody: '',
      userId: 204,
      error: null,
      storeState: store.getState()
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    store.subscribe(this.handleStoreChange);
  }

  componentWillUnmount() {
    if (this.state.storeState.connected) {
      store.dispatch(disconnect());
    }
  }

  handleStoreChange() {
    const currentState = store.getState();
    this.setState({
      ...this.state,
      storeState: currentState
    });
  }

  handleUserIdChange(event) {
    this.setState({ userId: parseInt(event.currentTarget.value, 10) });
  }

  handleAccessTokenChange(event) {
    this.setState({ accessToken: event.currentTarget.value });
  }

  handleConnectClick(event) {
    event.preventDefault();
    const bearerId = this.state.userId + '@22';
    const server = this.state.storeState.server;
    store.dispatch(openSocket(this.state.accessToken, bearerId, server, store));
  }

  handleDisconnectClick(event) {
    event.preventDefault();
    store.dispatch(disconnect());
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event);
  }

  handleRosterUserClick(component, event) {
    event.preventDefault();
    const userId = parseInt(component.props.id, 10);
    store.dispatch(setActiveRecipient(userId));
    store.dispatch(messagesRead(userId));
  }

  handleMessageInputChange(event) {
    this.setState({ messageBody: event.currentTarget.value });
  }

  handleMessageSend(event) {
    event.preventDefault();
    const activeRecipientId = this.state.storeState.activeRecipientId;
    const messages = this.state.storeState.messagesByRecipientId[activeRecipientId];

    let newMessageId = 1;
    if (messages.length && messages[messages.length - 1].id) {
      newMessageId = messages[messages.length - 1].id + 1;
    }
    const data = {
      id: newMessageId,
      bearerId: this.state.userId + '@22',
      toBearerId: activeRecipientId + '@22',
      type: 'chat',
      messageBody: this.state.messageBody
    };
    store.dispatch(sendMessage(data));
    this.setState({ messageBody: '' });
  }

  render() {
    const { accessToken, userId, storeState } = this.state;
    const { activeRecipientId, messagesByRecipientId, usersById } = storeState;
    const chatWrapperStyle = {
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    };

    let rosterArray = [];
    let messagesArray = [];
    if (activeRecipientId) {
      // Only display users with chat history
      if (messagesByRecipientId) {
        rosterArray = Object.keys(messagesByRecipientId).reduce(function(user, key) {
          if (usersById[key]) {  // filter
            user.push({  // map
              ...usersById[key],
              messages: messagesByRecipientId[key]
            });
          }
          return user;
        }, []);
      }

      // Get active users messages
      const activeUser = usersById[activeRecipientId];
      const activeMessages = messagesByRecipientId[activeRecipientId];
      if (activeUser && activeMessages.length) {
        messagesArray = activeMessages.map(function(msg) {
          return {
            ...msg,
            user: {
              id: activeUser.id,
              name: activeUser.name,
              thumbnail: activeUser.thumbnail
            }
          };
        });
      }
    }

    return (
      <section id="ChatSocketView">
        <h1>Chat</h1>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
          <Text
            placeholder="userId"
            defaultValue={userId}
            inline
            onChange={this.handleUserIdChange}
            readOnly={storeState.connected}
            style={{ width: '50px' }}
          />
          <Text
            placeholder="accessToken"
            defaultValue={accessToken}
            inline
            onChange={this.handleAccessTokenChange}
            readOnly={storeState.connected}
            style={{ width: '380px', marginRight: '1.25rem' }}
          />
          {!storeState.connected && <Btn inverted onClick={this.handleConnectClick} style={{ marginBottom: '0.75rem' }}>Connect</Btn>}
          {storeState.connected && <Btn inverted onClick={this.handleDisconnectClick} style={{ marginBottom: '0.75rem' }}>Disconnect</Btn>}
        </div>
        {storeState.error && !storeState.connected && <p style={{ color: 'red' }}>{storeState.error}</p>}
        <ComponentItem style={{ height: '350px', overflow: 'auto' }}>
          {!storeState.connected && <Blankslate
            icon="comment"
            heading="Not connected"
            message="Enter a matching (and valid) userId and accessToken to connect to HubChat"
            style={{ height: '100%' }}
            middle
          />}
          {storeState.connected && <div style={chatWrapperStyle}>
            <ChatRoster
              activeUserId={activeRecipientId}
              roster={rosterArray}
              sortBy="time"
              onUserClick={this.handleRosterUserClick}
            />
            <ChatMessages
              userId={activeRecipientId}
              messages={messagesArray}
              messageBody={this.state.messageBody}
              onFileClick={this.handleAnchorClick}
              onStoryClick={this.handleAnchorClick}
              onPinClick={this.handleAnchorClick}
              onAttachClick={this.handleAnchorClick}
              onInputChange={this.handleMessageInputChange}
              onSendClick={this.handleMessageSend}
              onUserClick={this.handleAnchorClick}
            />
          </div>}
        </ComponentItem>
      </section>
    );
  }
}
