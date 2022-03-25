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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import _each from 'lodash/each';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import {
  Route,
  Switch
} from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import { mapChatMessages } from 'redux/modules/entities/helpers';

import Chat from 'containers/Chat/Chat';
import ChatSocket from 'containers/ChatSocket/ChatSocket';

import { createPrompt } from 'redux/modules/prompts';
import {
  // Chat.js && ChatSocket
  disconnect,
  openSocket,
  sendMessage,
  messagesRead,
  setActiveRecipient,
  setPreviousRecipient,
  newRecipient,
  setMessageBody,
  createRoomRequest,
} from '../../../_assets/style-guide/src/redux/modules/chat/actions';

function mapStateToProps(state, ownProps) {
  const { chat, entities, settings } = state;
  const { activeRecipientId } = entities;

  // Recipients
  let activeRecipient = {};
  const recipients = [];
  const recipientsWithMessages = [];

  // Mapping states once for each file
  if (chat.connected &&
    ownProps.location.pathname.indexOf('story') === -1 && // Close when story or viewer is opened
    ownProps.location.pathname.indexOf('file') === -1 &&
    ((ownProps.location.pathname.indexOf('chat') > -1 && !ownProps.enableChatSocket) ||
    (ownProps.location.pathname.indexOf('chat') === -1 && ownProps.enableChatSocket))
  ) {
    const tmpUsers = { ...entities.users };
    // filter current user
    delete tmpUsers[settings.user.id];
    _each(Object.keys(tmpUsers), id => {
      // Merge wih entities store
      const obj = {
        ...entities.users[id]
      };

      // Map messages
      if (entities.users[id] && entities.users[id].messages && Object.keys(entities.messagesById).length > 0) {
        obj.messages = mapChatMessages(entities.users[id].messages, { ...entities, messages: entities.messagesById });
        recipientsWithMessages.push(obj);
      }

      // Set as activeRecipient if match
      if (parseInt(id, 10) === activeRecipientId) {
        activeRecipient = obj;
        activeRecipient.unreadCount = 0;

        if (activeRecipient.messages && activeRecipient.messages.length) {
          activeRecipient.lastMessageId = activeRecipient.messages[activeRecipient.messages.length - 1].id;
        }

        if (!activeRecipient.messages) {
          activeRecipient.messages = [];
          recipientsWithMessages.push(obj);
        }
      }

      recipients.push(obj);
    });
  }

  return {
    connected: chat.connected,
    accessToken: state.auth.BTCTK_A,
    recipients,
    recipientsWithMessages,
    activeRecipient,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    disconnect,
    sendMessage,
    messagesRead,
    openSocket,
    setActiveRecipient,
    setPreviousRecipient,
    newRecipient,
    setMessageBody,
    createRoomRequest,
  })
)
export default class ChatRoot extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  renderRoute(RouteComponent, props) {
    return (
      <RouteComponent
        {...props}
        onAnchorClick={this.props.onAnchorClick}
        onCallClick={this.props.onCallClick}
        onFileClick={this.props.onFileClick}
        onFilesClick={this.props.onFilesClick}
        onStoryClick={this.props.onStoryClick}
        onCloseClick={this.handleCloseClick}
      />
    );
  }

  render() {
    const {
      connected,
      enableChatSocket,
      location
    } = this.props;

    //
    const isChatSocketAvailable = (
      connected &&
      enableChatSocket &&
      location.pathname.indexOf('story') === -1 && // Close when story or file viewer is opened
      location.pathname.indexOf('file') === -1 &&
      location.pathname.indexOf('chat') === -1
    );

    return (
      <div>
        {!enableChatSocket && <Switch>
          <Route path="/chat/:recipientId?" render={(props) => this.renderRoute(Chat, { ...props, ...this.props })} />
        </Switch>}
        {isChatSocketAvailable && <ChatSocket {...this.props} />}
      </div>
    );
  }
}
