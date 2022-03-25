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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ChatIncomingCall from 'components/ChatIncomingCall/ChatIncomingCall';
import ChatFloatingList from 'components/ChatFloatingList/ChatFloatingList';
import ChatRoom from 'components/ChatRoom/ChatRoom';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import { createPrompt } from 'redux/modules/prompts';
import {
  acceptCallInvitation,
  declineCallInvitation,
  disconnectCall,
  sendCallInvitation,
  setRoomSubscribed,
  setOpenTokSupported,
  setDevices,
  getStory,
  getFile
} from '../../../_assets/style-guide/src/redux/modules/chat/actions';

function mapStateToProps(state) {
  const { chat, entities, settings } = state;
  const { activeRecipientId } = entities;
  const lastMessage = entities.messagesById[entities.lastMessage];

  // Array of incoming call invites
  const incomingInvites = Object.keys(chat.roomsById).reduce(function(room, key) {
    if (chat.roomsById[key] && chat.roomsById[key].status === 'incoming' && chat.roomsById[key].inviteUser) {
      room.push({
        ...chat.roomsById[key],
        inviteUser: {
          ...entities.users[chat.roomsById[key].inviteUser]
        }
      });
    }
    return room;
  }, []);

  // Array of active calls
  const activeCalls = Object.keys(chat.roomsById).reduce(function(room, key) {
    if (chat.roomsById[key] && chat.roomsById[key].status === 'empty' || chat.roomsById[key].status === 'invited' || chat.roomsById[key].status === 'accepted' || chat.roomsById[key].status === 'connected') {
      // Active room, invited by remote user
      if (chat.roomsById[key].inviteUser) {
        room.push({
          ...chat.roomsById[key],
          inviteUser: {
            ...entities.users[chat.roomsById[key].inviteUser]
          }
        });

        // Active room, created by current user
      } else {
        room.push(chat.roomsById[key]);
      }
    }
    return room;
  }, []);

  return {
    ...chat,
    settings: settings,
    messagesById: entities.messagesById,
    usersById: entities.users,
    accessToken: state.auth.BTCTK_A,
    server: state.settings.company.chatServerHost,
    lastMessage,
    activeRecipientId: activeRecipientId,
    unreadCount: entities.unreadCount,

    incomingInvites,
    activeCalls,

    hasVideoChat: state.settings.userCapabilities.hasVideoChat,
    viewerDocked: state.viewer.isDocked
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    acceptCallInvitation,
    declineCallInvitation,
    disconnectCall,
    sendCallInvitation,
    setRoomSubscribed,
    setOpenTokSupported,
    setDevices,
    getStory,
    getFile
  })
)
export default class ChatSocket extends PureComponent {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,

    activeRecipient: PropTypes.object,
    activeRecipientId: PropTypes.number,

    connected: PropTypes.bool.isRequired,
    connecting: PropTypes.bool.isRequired,
    lastMessage: PropTypes.object,
    usersById: PropTypes.object,

    showFloatingList: PropTypes.bool,
    hasVideoChat: PropTypes.bool,

    disconnect: PropTypes.func.isRequired,
    openSocket: PropTypes.func.isRequired,
  };

  static contextTypes = {
    events: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    showFloatingList: true
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const accessToken = this.props.accessToken;
    const bearerId = this.context.settings.user.id + '@' + this.context.settings.company.id;
    const server = this.props.server;

    // Connect to chat
    if (!this.props.connected) {
      this.props.openSocket(accessToken, bearerId, server, this.context.store);
    }

    // Attempt to load OpenTok if user has video chat
    if (this.props.hasVideoChat) {
      const $script = require('scriptjs');
      $script('//static.opentok.com/v2/js/opentok.min.js', this.handleOpenTokLoaded);
    }
  }

  componentDidUpdate() {
    const { connected, activeRecipientId, usersById } = this.props;

    // Parse active user's attachments
    if (connected && usersById[activeRecipientId]) {
      this.parseActiveRecipientMessages();
    }
  }

  /*componentWillUnmount() {
    // Don't disconnect during development
    // live reload often unmounts component
    if (process.env.NODE_ENV === 'production') {
      if (this.props.connected) {
        this.props.disconnect();
      }
    }
  }*/

  createMessagePrompt(user, message) {
    // Truncate message length for preview
    let fixedMessage = message;
    if (message.length > 50) {
      fixedMessage = message.substring(0, 50) + '...';
    }

    // Dispatch prompt that links to user's chat
    this.props.createPrompt({
      id: uniqueId('chat-'),
      type: 'chat',
      title: user.name,
      message: fixedMessage,
      autoDismiss: 5,
      dismissible: true,
      link: '/chat/' + user.id,
    });
  }

  parseActiveRecipientMessages() {
    // Check for hub-attachment with no loaded data
    const { activeRecipient, filesById, storiesById } = this.props;
    const attachments = activeRecipient.messages.filter(m => m.type === 'hub-attachment');

    attachments.forEach(a => {
      // File attachment
      if (typeof a.file === 'number' && !filesById[a.file]) {
        this.props.getFile(a.file);

      // Story attachment
      } else if (typeof a.story === 'number' && !storiesById[a.story]) {
        this.props.getStory(a.story);
      }
    });
  }

  handleEvent(event) {
    console.log(event);  // eslint-disable-line
  }

  handleOpenTokLoaded() {
    if (window.OT) {
      const supported = window.OT.checkSystemRequirements();
      if (supported) {
        this.props.setOpenTokSupported();

        window.OT.getDevices((error, devices) => {
          if (error) {
            console.error(error);  // eslint-disable-line
            return;
          }
          this.props.setDevices(devices);
        });
      }
    }
  }

  handleUserClick(event) {
    const { activeRecipientId } = this.props;
    const id = parseInt(event.currentTarget.dataset.id, 10);
    const newActiveUserId = activeRecipientId === id ? 0 : id;
    this.props.setActiveRecipient(newActiveUserId);
  }

  handleCloseClick(event) {
    event.preventDefault();
    this.props.setActiveRecipient(0);
  }

  handleMessageInputChange(event) {
    this.props.setMessageBody(this.props.activeRecipientId, event.currentTarget.value);
  }

  handleMessageSendClick(event) {
    event.preventDefault();
    const { company, user } = this.context.settings;
    const { activeRecipient } = this.props;
    const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;

    const data = {
      id: newMessageId,
      bearerId: user.id + '@' + company.id,
      toBearerId: activeRecipient.id + '@' + company.id,
      type: 'chat',
      messageBody: this.props.activeRecipient.messageBody
    };
    this.props.sendMessage(data);
    this.props.setMessageBody(activeRecipient.id, '');
  }

  handleMoreUsersClick(event) {
    event.preventDefault();
    this.context.router.history.push('/chat');
  }

  handleIncomingCallResponseClick(event) {
    event.preventDefault();
    const { company, user } = this.context.settings;

    const callerId = event.currentTarget.dataset.id;
    const roomId = event.currentTarget.dataset.roomid;
    const token = event.currentTarget.dataset.token;
    const type = event.currentTarget.dataset.type;

    let newMessageId = 1;
    const callingUser = this.props.usersById[callerId];
    if (callingUser && callingUser.messages && callingUser.messages.length) {
      const messageInternalId = newMessageId = callingUser.messages[callingUser.messages.length - 1];  // eslint-disable-line
      newMessageId = this.props.messagesById[messageInternalId].id + 1;
    }

    const bearerId = user.id + '@' + company.id;

    const data = {
      id: newMessageId,
      bearerId: bearerId,
      roomId: roomId,
      token: token
    };

    // Decline call if OpenTok not supported
    if (!this.props.openTokSupported) {
      this.props.declineCallInvitation(data);
      return;
    }

    // Accept or Deny call
    if (type === 'accept') {
      this.props.acceptCallInvitation(data);
    } else {
      this.props.declineCallInvitation(data);
    }
  }

  handleChatRoomDisconnectClick(event, roomId) {
    event.preventDefault();
    const { company, user } = this.context.settings;
    const newMessageId = this.props.lastMessage ? this.props.lastMessage.id : 1;
    const bearerId = user.id + '@' + company.id;
    const chatRouteActive = this.context.router.history.location.pathname.indexOf('chat') > -1;

    // clear active recipient if not on /chat route
    if (!chatRouteActive) {
      this.props.setActiveRecipient(0);
    }

    this.props.disconnectCall({ newMessageId, bearerId, roomId });
  }

  handleChatRoomSendCallInvitation(roomId) {
    const { company, user } = this.context.settings;
    const { activeRecipient } = this.props;
    const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;

    const bearerId = user.id + '@' + company.id;
    const toBearerId = activeRecipient.id + '@' + company.id;

    const data = {
      id: newMessageId,
      bearerId: bearerId,
      roomId: roomId,
      invitees: [toBearerId]
    };
    this.props.sendCallInvitation(data, activeRecipient.id);
  }

  handleStreamSubscribed(stream, roomId) {
    this.props.setRoomSubscribed(roomId, true);
  }

  handlePublishError(error) {
    this.props.createPrompt({
      id: uniqueId('chat-'),
      type: 'error',
      title: 'Unable to Publish Audio/Video',
      message: error.message,
      autoDismiss: 5,
      dismissible: true,
    });
  }

  render() {
    const {
      onAnchorClick,
      onCallClick,
      onFileClick,
      onStoryClick
    } = this.context.events;
    const {
      history
    } = this.context.router;
    const {
      connected,
      activeRecipient,
      recipientsWithMessages,
      activeCalls,
      incomingInvites
    } = this.props;
    const hasActiveCall = activeCalls && activeCalls[0];
    const hasPendingCall = this.props.pendingRoom;
    const chatRouteActive = history.location.pathname.indexOf('chat') > -1;
    const modalRouteActive = history.location.state && history.location.state.modal;
    const showFloatingList = connected && this.props.showFloatingList && !chatRouteActive && !hasActiveCall && !hasPendingCall && !modalRouteActive;

    // Render nothing if not connected
    if (!connected) {
      return false;
    }

    // ChatFloatingList position
    const floatingListStyle = {
      position: 'absolute',
      bottom: '0.75rem',
      left: '0.75rem'
    };

    // Incoming Call position
    const incomingCallStyle = {
      position: 'absolute',
      top: '6rem',
      right: '0.75rem',
      zIndex: 1
    };

    return (
      <div>
        {showFloatingList && <ChatFloatingList
          users={recipientsWithMessages}
          activeUser={activeRecipient}
          //showAudioCall={this.props.audioSupported}
          //showVideoCall={this.props.videoSupported}
          authString={this.context.settings.authString}
          onUserClick={this.handleUserClick}
          onCallClick={onCallClick}
          onCloseClick={this.handleCloseClick}
          onAnchorClick={onAnchorClick}
          onFileClick={onFileClick}
          onStoryClick={onStoryClick}
          onAttachClick={this.handleEvent}
          onInputChange={this.handleMessageInputChange}
          onSendClick={this.handleMessageSendClick}
          onMoreUsersClick={this.handleMoreUsersClick}
          style={floatingListStyle}
        />}
        <TransitionGroup style={incomingCallStyle}>
          {incomingInvites.length > 0 && <CSSTransition
            classNames="slide-left"
            timeout={250}
          >
            {incomingInvites.map(item => (
              <ChatIncomingCall
                key={item.token}
                user={item.inviteUser}
                roomId={item.id}
                token={item.token}
                isVideo={item.type === 'video and audio'}
                onAcceptClick={this.handleIncomingCallResponseClick}
                onDenyClick={this.handleIncomingCallResponseClick}
              />
            ))}
          </CSSTransition>}
        </TransitionGroup>
        <TransitionGroup>
          {hasActiveCall && <CSSTransition
            classNames="fade"
            timeout={250}
          >
            <ChatRoom
              {...activeCalls[0]}
              publishAudio
              publishVideo={activeCalls[0].type === 'video and audio'}
              apiKey={this.context.settings.company.openTokApiKey}
              onCallInvitation={this.handleChatRoomSendCallInvitation}
              onSubscribed={this.handleStreamSubscribed}
              onPublishError={this.handlePublishError}
              onSessionDisconnect={this.handleChatRoomDisconnect}
              onDisconnectClick={this.handleChatRoomDisconnectClick}
            />
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
