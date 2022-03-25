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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import { createPrompt } from 'redux/modules/prompts';
import {
  getStory,
  getFile
} from '../../../_assets/style-guide/src/redux/modules/chat/actions';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';

import FilePickerModal from 'components/FilePickerModal/FilePickerModal';
import StoryPickerModal from 'components/StoryPickerModal/StoryPickerModal';

import ChatMessages from 'components/ChatMessages/ChatMessages';
import ChatRoster from 'components/ChatRoster/ChatRoster';
import ChatUserDetails from 'components/ChatUserDetails/ChatUserDetails';

const messages = defineMessages({
  chat: { id: 'chat', defaultMessage: 'Chat' },
  welcomeToHubChat: { id: 'welcome-to-hubchat', defaultMessage: 'Welcome to Hub Chat' },
  clickConnectToGetStarted: { id: 'click-connect-to-get-started', defaultMessage: 'Click Connect to get started' },
  connectionError: { id: 'connection-error', defaultMessage: 'Connection Error' },
  reconnect: { id: 'reconnect', defaultMessage: 'Reconnect' },
  connect: { id: 'connect', defaultMessage: 'Reconnect' },
  rosterEmptyHeading: { id: 'message-a-colleague', defaultMessage: 'Message a colleague' },
  rosterEmptyMessage: { id: 'chat-message-description', defaultMessage: 'Instantly message someone within your organization. Share ideas, discuss project details or simply work out lunch plans.' },
  rosterEmptyActionText: { id: 'start-a-conversation', defaultMessage: 'Start a conversation' },
  selectARecipient: { id: 'select-a-recipient', defaultMessage: 'Select a Recipient' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  search: { id: 'search', defaultMessage: 'Search' },
});

function mapStateToProps(state) {
  const { chat, entities, settings } = state;
  const { activeRecipientId } = entities;
  const lastMessage = entities.messagesById[entities.lastMessage];

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
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    getFile,
    getStory
  })
)
export default class Chat extends PureComponent {
  static propTypes = {
    accessToken: PropTypes.string.isRequired,

    activeRecipient: PropTypes.object,
    activeRecipientId: PropTypes.number,

    previousRecipientId: PropTypes.number,

    connected: PropTypes.bool,
    connecting: PropTypes.bool,
    rosterLoading: PropTypes.bool,
    rosterLoaded: PropTypes.bool
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      recipientModalVisible: false,
      storyPickerModalVisible: false,
      filePickerModalVisible: false
    };
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

    // Set activeRecipientId if passed in URL params
    // or a previous recipient is available
    if (this.props.match.params.recipientId || this.props.previousRecipientId) {
      const recipientIdParams = parseInt(this.props.match.params.recipientId, 10);

      // recipientId by URL params
      if (this.props.activeRecipientId !== recipientIdParams && recipientIdParams) {
        this.props.setActiveRecipient(recipientIdParams);
        this.props.messagesRead(recipientIdParams);

      // recipientId by previousRecipientId
      } else if (this.props.previousRecipientId > 0) {
        this.props.history.replace('/chat/' + this.props.previousRecipientId);
        this.props.messagesRead(this.props.previousRecipientId);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Keep URL and activeRecipientId in sync
    if (nextProps.match.params.recipientId && nextProps.match.params.recipientId !== this.props.match.params.recipientId) {
      const userId = parseInt(nextProps.match.params.recipientId, 10);
      this.props.setActiveRecipient(userId);
    }
  }

  componentDidUpdate() {
    const { connected, activeRecipientId, usersById } = this.props;

    // Parse active user's attachments
    if (connected && usersById[activeRecipientId]) {
      this.parseActiveRecipientMessages();
    }
  }

  componentWillUnmount() {
    if (this.props.activeRecipientId) {
      this.props.setPreviousRecipient(this.props.activeRecipientId);
      this.props.setActiveRecipient(0);
    }
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

  handleToggleRecipientModal() {
    this.setState({ recipientModalVisible: !this.state.recipientModalVisible });
  }

  handleFilePickerClose() {
    this.setState({ filePickerModalVisible: false });
  }

  handleFilePickerSave(event, selectedFiles) {
    event.preventDefault();
    const { company, user } = this.context.settings;
    const { activeRecipient } = this.props;

    if (selectedFiles.length && selectedFiles[0].id) {
      const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;

      const data = {
        id: newMessageId,
        bearerId: user.id + '@' + company.id,
        toBearerId: activeRecipient.id + '@' + company.id,
        type: 'hub-attachment',
        messageBody: 'StoryFileIdentifier/' + selectedFiles[0].id
      };

      this.props.sendMessage(data);
    }

    this.setState({ filePickerModalVisible: false });
  }

  handleStoryPickerClose() {
    this.setState({ storyPickerModalVisible: false });
  }

  handleStoryPickerSave(event, selectedStories) {
    event.preventDefault();
    const { company, user } = this.context.settings;
    const { activeRecipient } = this.props;

    if (selectedStories.length && selectedStories[0].permId) {
      const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;

      const data = {
        id: newMessageId,
        bearerId: user.id + '@' + company.id,
        toBearerId: activeRecipient.id + '@' + company.id,
        type: 'hub-attachment',
        messageBody: 'StoryPermanentIdentifier/' + selectedStories[0].permId
      };

      this.props.sendMessage(data);
    }

    this.setState({
      storyPickerModalVisible: false
    });
  }

  handleAttachClick(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;
    if (type === 'file') {
      this.setState({ filePickerModalVisible: true });
    } else {
      this.setState({ storyPickerModalVisible: true });
    }
  }

  handleConnectClick(event) {
    event.preventDefault();
    const accessToken = this.props.accessToken;
    const bearerId = this.context.settings.user.id + '@' + this.context.settings.company.id;
    const server = this.props.server;  // to be passed in settings

    if (this.props.connected) {
      this.props.disconnect();
    }

    this.props.openSocket(accessToken, bearerId, server, this.context.store);
  }

  handleDisconnectClick(event) {
    event.preventDefault();
    this.props.disconnect();
  }

  handleMessageInputChange(event) {
    this.props.setMessageBody(this.props.activeRecipientId, event.currentTarget.value);
  }

  handleMessageSendClick(event) {
    event.preventDefault();
    const { company, user } = this.context.settings;
    const { activeRecipient } = this.props;
    const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;

    const bearerId = user.id + '@' + company.id;
    const toBearerId = activeRecipient.id + '@' + company.id;

    const data = {
      id: newMessageId,
      bearerId: bearerId,
      toBearerId: toBearerId,
      type: 'chat',
      messageBody: this.props.activeRecipient.messageBody
    };

    this.props.sendMessage(data);
    this.props.setMessageBody(activeRecipient.id, '');
  }

  handleExistingRecipientClick(component, event) {
    event.preventDefault();
    const userId = parseInt(component.props.id, 10);

    this.props.messagesRead(userId);
    this.props.history.push('/chat/' + userId);
  }

  handleNewRecipientClick(component, event) {
    event.preventDefault();
    const userId = parseInt(component.props.id, 10);

    // Add empty messages array if recipient doesn't exist
    if (!this.props.usersById[userId]) {
      this.props.newRecipient(userId);
    }

    // Close modal
    this.setState({ recipientModalVisible: false });

    // Set user active
    this.props.history.push('/chat/' + userId);
  }

  handleCallClick(event) {
    event.preventDefault();
    const { company, user } = this.context.settings;
    const { activeRecipient } = this.props;
    const type = event.currentTarget.dataset.type;
    const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;

    const bearerId = user.id + '@' + company.id;

    // Send room create request to chat server
    const data = {
      id: newMessageId,
      bearerId: bearerId,
      calltype: type === 'audio' ? 'audio' : 'video and audio'
    };
    this.props.createRoomRequest(data, activeRecipient.id);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { userCapabilities } = this.context.settings;
    const { showStoryAuthor } = userCapabilities;
    const {
      activeRecipientId,
      activeRecipient,
      connected,
      connecting,
      recipientsWithMessages,
      error
    } = this.props;
    const style = require('./Chat.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className="mainContainer" style={{ paddingRight: 0 }}>
        <Helmet>
          <title>{strings.chat}</title>
        </Helmet>
        <AppHeader />
        <div className={style.Chat}>
          <div className={style.titleWrap}>
            <FormattedMessage id="chat" defaultMessage="Chat" tagName="h3" />
            {connected && <Btn
              icon="plus"
              borderless
              onClick={this.handleToggleRecipientModal}
              className={style.addBtn}
            />}
          </div>
          {connected && activeRecipient && activeRecipient.name && <div className={style.titleWrap}>
            <h3>{activeRecipient.name}</h3>
            <DropMenu
              icon="triangle"
              className={style.userDropMenu}
            >
              <ChatUserDetails
                user={activeRecipient}
                showAudioCall={this.props.audioSupported}
                showVideoCall={this.props.videoSupported}
                onAnchorClick={this.props.onAnchorClick}
                onCallClick={this.handleCallClick}
              />
            </DropMenu>
          </div>}
          {connecting && <div className={style.chatStatus}>
            <Blankslate
              icon="chat"
              iconSize={192}
              middle
            >
              <Loader type="content" />
            </Blankslate>
          </div>}
          {!connected && error && <div className={style.chatStatus}>
            <Blankslate
              icon="chat"
              iconSize={192}
              heading={strings.connectionError}
              message={typeof error === 'object' ? strings.connectionError : error}
              middle
            >
              <Btn onClick={this.handleConnectClick}>{strings.reconnect}</Btn>
            </Blankslate>
          </div>}
          {!connecting && !connected && !error && <div className={style.chatStatus}>
            <Blankslate
              icon="chat"
              iconSize={192}
              heading={strings.welcomeToHubChat}
              message={strings.clickConnectToGetStarted}
              middle
            >
              <Btn onClick={this.handleConnectClick}>{strings.connect}</Btn>
            </Blankslate>
          </div>}
          <div className={style.chatWrap}>
            {connected && <ChatRoster
              activeUserId={activeRecipientId}
              roster={recipientsWithMessages}
              sortBy="time"
              strings={strings}
              onEmptyActionClick={this.handleToggleRecipientModal}
              onUserClick={this.handleExistingRecipientClick}
            />}
            {connected && activeRecipient && activeRecipient.name && <ChatMessages
              showAuthor={showStoryAuthor}
              userId={activeRecipientId}
              messages={this.props.activeRecipient.messages}
              messageBody={this.props.activeRecipient.messageBody}
              authString={this.context.settings.authString}
              onAnchorClick={this.props.onAnchorClick}
              onFileClick={this.props.onFileClick}
              onStoryClick={this.props.onStoryClick}
              onAttachClick={this.handleAttachClick}
              onInputChange={this.handleMessageInputChange}
              onSendClick={this.handleMessageSendClick}
              style={{ marginBottom: '0.5rem' }}
            />}
          </div>
        </div>

        {/* Recipient Modal */}
        <Modal
          backdropClosesModal
          escClosesModal
          isVisible={this.state.recipientModalVisible}
          headerCloseButton
          headerTitle={strings.selectARecipient}
          bodyClassName={style.chatRosterModal}
          onClose={this.handleToggleRecipientModal}
        >
          <ChatRoster
            roster={this.props.recipients}
            sortBy="name"
            noteType="email"
            showSearch
            virtualized
            height={420}
            rowCount={this.props.recipients.length}
            rowHeight={62}
            width={559}
            onUserClick={this.handleNewRecipientClick}
            disableAnimations
          />
        </Modal>

        {/* File Picker Modal */}
        {this.state.filePickerModalVisible && <FilePickerModal
          isVisible
          ignoreCategories={['btc', 'folder']}
          canShare
          onClose={this.handleFilePickerClose}
          onSave={this.handleFilePickerSave}
        />}

        {/* Story Picker Modal */}
        {this.state.storyPickerModalVisible && <StoryPickerModal
          isVisible
          canShare
          onClose={this.handleStoryPickerClose}
          onSave={this.handleStoryPickerSave}
        />}
      </div>
    );
  }
}
