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
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import get from 'lodash/get';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';
import PersonalChannelModal from 'components/PersonalChannelModel/PersonalChannelModel.js';
import ImagePickerModal from 'components/ImagePickerModal/ImagePickerModal';
import ChannelSharingModel from 'components/ChannelSharingModel/ChannelSharingModel';
import Dialog from 'components/Dialog/Dialog';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadTabs,
  loadChannels,
  loadStories,
  subscribeChannel,

  savePersonalChannel,
  deletePersonalChannel,
  leaveSharedChannel,

  setStoriesScrollPosition,
  clearLastChannel,

  loadTabById,
  toggleClearChannelFilter,
} from 'redux/modules/content';
import {
  setContentTabsSortBy,
  setContentChannelsSortBy,
  setContentStoriesSortBy,
  toggleContentShowHiddenChannels,
  toggleContentStoryGrid,
  setLastContentRoute
} from 'redux/modules/settings';

import {
  getShareChannelUsers
} from 'redux/modules/channelShare';
import { createPrompt } from 'redux/modules/prompts';
import { mapChannels, mapStories } from 'redux/modules/entities/helpers';

import AppHeader from 'components/AppHeader/AppHeader';
import BreadcrumbList from 'components/BreadcrumbList/BreadcrumbList';
import MyFiles from 'components/MyFiles/MyFiles';

import ChannelSettings from 'components/ChannelSettings/ChannelSettings';
import ContentSettings from 'components/ContentSettings/ContentSettings';
import TabSettings from 'components/TabSettings/TabSettings';

const messages = defineMessages({
  content: { id: 'content', defaultMessage: 'Content' },
  companyTabs: { id: 'company-tabs', defaultMessage: 'Company {tabs}' },
  personalChannels: { id: 'personal-channels', defaultMessage: 'Personal {channels}' },
  sharedWithMe: { id: 'shared-with-me', defaultMessage: 'Shared with me' },

  emptyStoryHeading: { id: 'stories', defaultMessage: '{stories}' },
  emptyStoryMessage: { id: 'content-empty-message', defaultMessage: 'Select a {channel} to view {stories}' },

  noStoryHeading: {
    id: 'content-story-empty-heading',
    defaultMessage: 'There are currently no {stories} located inside this {channel}.'
  },
  noStoryMessage: {
    id: 'content-story-empty-message',
    defaultMessage: 'Publishing a {story} into this {channel} will mean anyone who has access can view it.'
  },

  contentDetails: { id: 'contentDetails', defaultMessage: 'Content Details' },
  tabDetails: { id: 'tabDetails', defaultMessage: '{tab} Details' },
  channelDetails: { id: 'channelDetails', defaultMessage: '{channel} Details' },

  subscribe: { id: 'subscribe', defaultMessage: 'Subscribe' },
  subscribed: { id: 'subscribed', defaultMessage: 'Subscribed' },
  addPeople: { id: 'add-people', defaultMessage: 'Add People' },
  gridView: { id: 'grid-view', defaultMessage: 'Grid View' },
  showHiddenChannels: { id: 'show-hidden-channels', defaultMessage: 'Show Hidden {channels}' },

  name: { id: 'name', defaultMessage: 'Name' },
  storyCount: { id: 'story-count', defaultMessage: '{story} count' },
  channelCount: { id: 'channel-count', defaultMessage: '{channel} count' },
  date: { id: 'date', defaultMessage: 'Date' },
  title: { id: 'title', defaultMessage: 'Title' },
  priority: { id: 'priority', defaultMessage: 'Priority' },
  likes: { id: 'likes', defaultMessage: 'Likes' },
  mostRead: { id: 'most-read', defaultMessage: 'Most read' },
  leastRead: { id: 'least-read', defaultMessage: 'Least read' },
  authorFirstName: { id: 'author-first-name', defaultMessage: 'Author first name' },
  authorLastName: { id: 'author-last-name', defaultMessage: 'Author last name' },
  contentIq: { id: 'content-iq', defaultMessage: 'Content IQ' },

  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully' },
  addPersonalChannel: { id: 'add-personal-channel', defaultMessage: 'Add' },
  confirmDeleteChannelHeader: { id: 'confirm-delete-channel-header', defaultMessage: 'Are you sure you want to delete this Personal {channel}?' },
  deletedSuccessfully: { id: 'deleted-successfully', defaultMessage: 'Deleted successfully' },
  success: { id: 'success', defaultMessage: 'Success' },
  confirmLeaveChannelHeader: { id: 'are-you-sure-want-to-leave-channel', defaultMessage: 'Are you sure you want to leave this {channel}?' },

  deleteChannel: { id: 'deleted-channel', defaultMessage: 'Delete {channel}' },
  leaveChannel: { id: 'leave-channel', defaultMessage: 'Leave {channel}' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  leave: { id: 'leave', defaultMessage: 'Leave' },
  manageSharing: { id: 'manage-sharing', defaultMessage: 'Manage Sharing' },
  editChannel: { id: 'edit-channel', defaultMessage: 'Edit {channel}' },

  filterTabs: { id: 'filter-tabs', defaultMessage: 'Filter {tabs}' },
  filterChannels: { id: 'filter-channels', defaultMessage: 'Filter {channels}' },

  emptyChannelMessage: { id: 'empty-channel-message', defaultMessage: 'No {channels} matching search term found' },

});

function mapStateToProps(state, ownProps) {
  const { entities, settings } = state;
  const { lastChannel } = state.content;
  const tabs = state.content.tabs.map(id => entities.tabs[id]);

  // Check if on /content/personal route
  const personalSelected = ownProps.location.pathname.indexOf('/personal') > -1;
  const myFilesSelected = ownProps.match.params.sectionId === 'files';
  let selectedTab = {
    id: ownProps.match.params.tabId
  }; // taking browser URL tabId when no data is fetched
  if (personalSelected) {
    selectedTab = entities.tabs.personal;
  } else if (entities.tabs[ownProps.match.params.tabId]) {
    selectedTab = { id: ownProps.match.params.tabId, ...entities.tabs[ownProps.match.params.tabId] };
  }

  // Fake 'My Files' Channel
  const myFiles = [{
    id: 'files',
    type: 'channel',
    name: 'My Files',  // TOOD: translation
    colour: '#00cc00',
    anchorUrl: '/content/personal/files',
    isSelected: myFilesSelected
  }];
  const personalChannels = [];
  const sharedChannels = [];

  // Use lastChannel if available
  const selectedChannel = !myFilesSelected && (entities.channels[lastChannel] || entities.channels[ownProps.match.params.channelId]);
  // Selected Tab's channels
  let channels = [];
  if (selectedTab && selectedTab.channels) {
    channels = mapChannels(selectedTab.channels, entities);

    // Browsing Personal Content
    if (selectedTab.id === 'personal' && settings.userCapabilities.hasPersonalContent) {
      // Separate channels to personal/shared
      channels.forEach(c => {
        if (c.isPersonal) {
          personalChannels.push(c);
        } else if (c.isShared) {
          sharedChannels.push(c);
        }
      });
    }
  }

  // Set defaultSortBy to selected channel
  if (selectedChannel) {
    const storiesSortBy = channels.find((item) => item.id === selectedChannel.id);
    if (storiesSortBy) selectedChannel.defaultSortBy = storiesSortBy.defaultSortBy;
  }

  // Last Channel's Stories
  let stories = [];
  if (!myFilesSelected && selectedChannel && selectedChannel.stories) {
    stories = mapStories(selectedChannel.stories, entities);
  }

  return {
    ...state.content,
    tabs: tabs,
    channels: channels,
    stories: stories,
    myUser: settings.user,
    myFiles: myFiles,
    myFilesSelected: myFilesSelected,

    personalChannels: personalChannels,
    sharedChannels: sharedChannels,

    selectedTab: selectedTab,
    selectedTabId: selectedTab ? selectedTab.id : null,
    selectedTabName: selectedTab ? selectedTab.name || ' ' : '',

    channelsComplete: selectedTab ? selectedTab.channelsComplete : false,
    channelsLoading: selectedTab ? selectedTab.channelsLoading : false,
    channelsError: selectedTab ? selectedTab.channelsError : {},

    selectedChannel: selectedChannel,
    selectedChannelId: selectedChannel ? selectedChannel.id : null,
    selectedChannelName: selectedChannel ? selectedChannel.name : '',

    storiesComplete: selectedChannel ? selectedChannel.storiesComplete : false,
    storiesLoading: selectedChannel ? selectedChannel.storiesLoading : false,
    storiesError: selectedChannel ? selectedChannel.storiesError : {},

    // Settings
    tabsSortBy: state.settings.contentSettings.tabsSortBy,
    channelsSortBy: state.settings.contentSettings.channelsSortBy,
    showHiddenChannels: state.settings.contentSettings.showHiddenChannels,
    storiesSortBy: state.settings.contentSettings.storiesSortBy,
    storyGridList: state.settings.contentSettings.storyGrid,

    isSafari: state.settings.platform.name === 'Safari',
    baseColour: state.settings.theme.baseColor,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    loadTabs,
    loadTabById,
    loadChannels,
    loadStories,
    subscribeChannel,

    setStoriesScrollPosition,
    clearLastChannel,

    setContentTabsSortBy,
    setContentChannelsSortBy,
    setContentStoriesSortBy,
    toggleContentShowHiddenChannels,
    toggleContentStoryGrid,
    setLastContentRoute,

    savePersonalChannel,
    deletePersonalChannel,
    leaveSharedChannel,
    getShareChannelUsers,
    toggleClearChannelFilter
  })
)
export default class Content extends Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired,
    stories: PropTypes.array.isRequired,
    personalChannels: PropTypes.array.isRequired,

    tabsSortBy: PropTypes.string.isRequired,
    channelsSortBy: PropTypes.string.isRequired,
    showHiddenChannels: PropTypes.bool.isRequired,

    storiesSortBy: PropTypes.string.isRequired,
    storyGridList: PropTypes.bool.isRequired,

    onAnchorClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    personalChannels: [],
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      isPersonalChannelModalVisible: false,
      personalChannelDetails: {},
      channelImagePickerModalVisible: false,
      confirmRemoveChannel: false,
      confirmShareChannelLeaveModelVisible: false,
      showManageSharingDialog: false,
    };
    // refs
    this.storyList = null;
  }

  UNSAFE_componentWillMount() {
    const { params } = this.props.match;
    const {
      tabId,
      channelId
    } = params;

    // Redirect to Content section if tabId is undefined
    if (tabId === 'undefined') {
      this.props.history.push('/content');
      // Redirect to Tab section if channel is undefined
    } else if (tabId && channelId && isNaN(channelId)) {
      this.props.history.push(`/content/tab/${tabId}`);
      // Manually fetch tabs if tabId is passed on mount
    } else if (tabId) {
      // Load tab by ID if the request is openEntity for tab from jsBridge
      if (this.props.history.location.state && this.props.history.location.state.jsbridgeRequest) {
        this.props.loadTabById(tabId);
      } else {
        this.props.loadTabs(0, this.props.tabsSortBy, this.props.showHiddenChannels, this.props.tabSearchTerm);
      }
    }
  }

  componentDidMount() {
    const { ui, stories } = this.props;

    // Restore Story list scroll position if loaded
    if (this.props.match.params.channelId && stories.length && ui.storyScrollY &&
      this.storyList && this.storyList.list[0] && this.storyList.list[0].list.list) {
      this.storyList.list[0].list.list.scrollTop = ui.storyScrollY;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      match,
      selectedTabId,  // not using params.tabs for 'personal' tab
      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      storiesSortBy,
      selectedChannel,
      saved,
      deleted,
      leaved,
      error,
    } = this.props;
    const {
      params
    } = match;
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    // Load Tabs if changing tabsSortById, showHiddenChannels
    if (!selectedTabId && (tabsSortBy !== nextProps.tabsSortBy || showHiddenChannels !== nextProps.showHiddenChannels)) {
      this.props.loadTabs(0, nextProps.tabsSortBy, nextProps.showHiddenChannels, this.props.tabSearchTerm);

      // Load Channels if changing channelsSortBy, showHiddenChannels
    } else if (selectedTabId && (channelsSortBy !== nextProps.channelsSortBy || showHiddenChannels !== nextProps.showHiddenChannels)) {
      this.loadChannels(selectedTabId, 0, nextProps.channelsSortBy, nextProps.showHiddenChannels, this.props.channelSearchTerm);

      // Set channel selected default order
    } else if (selectedChannel && nextProps.selectedChannel && selectedChannel.id !== nextProps.selectedChannel.id && nextProps.selectedChannel.defaultSortBy && (
      selectedChannel.defaultSortBy !== nextProps.selectedChannel.defaultSortBy)) {
      this.props.setContentStoriesSortBy(nextProps.selectedChannel.defaultSortBy);

      // Load Stories if changing Channel ID
      // or changing storiesSortBy
    } else if (nextProps.match.params.channelId && (params.channelId !== nextProps.match.params.channelId ||
      storiesSortBy !== nextProps.storiesSortBy)) {
      this.loadStories(nextProps.match.params.channelId, 0, nextProps.storiesSortBy);
    }

    // Save current route
    if (nextProps.location.pathname !== this.props.location.pathname && nextProps.match.params.tabId !== 'undefined') {
      this.props.setLastContentRoute(nextProps.location.pathname);
    }
    if (!saved && nextProps.saved) {
      this.setState({
        isPersonalChannelModalVisible: false
      });
      this.props.createPrompt({
        id: uniqueId('saved-'),
        type: 'success',
        message: strings.savedSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
      this.props.history.push('/content/personal/channel/' + nextProps.newChannelId);
      this.loadChannels(selectedTabId, 0, channelsSortBy, showHiddenChannels);
      this.setState({
        personalChannelDetails: {}
      });
    }
    if (!deleted && nextProps.deleted) {
      this.setState({
        confirmRemoveChannel: false
      });
      this.props.createPrompt({
        id: uniqueId('deleted-'),
        type: 'success',
        message: strings.deletedSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
      this.props.history.push('/content/personal');
      this.loadChannels(selectedTabId, 0, channelsSortBy, showHiddenChannels);
      this.props.clearLastChannel();
      this.setState({
        personalChannelDetails: {},
        isPersonalChannelModalVisible: false
      });
    }
    if (!leaved && nextProps.leaved) {
      this.props.createPrompt({
        id: uniqueId('leaved-'),
        type: 'success',
        message: strings.success,
        dismissible: true,
        autoDismiss: 5
      });
      this.props.history.push('/content/personal');
      this.loadChannels(selectedTabId, 0, channelsSortBy, showHiddenChannels);
      this.props.clearLastChannel();
      this.setState({
        personalChannelDetails: {}
      });
    }
    const prevError = error ? error.message : '';
    if (nextProps.error && nextProps.error.message && (nextProps.error.message !== prevError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  componentDidUpdate() {
    if (!this.props.tabsLoading && this.props.tabs.some(tab => tab.id !== this.props.match.params.tabId) && this.props.history.location.state && this.props.history.location.state.jsbridgeRequest) {
      this.context.router.history.push({
        state: { jsbridgeRequest: false }
      });
      this.props.loadTabById(this.props.match.params.tabId);
      this.loadChannels(this.props.match.params.tabId, 0);
    }
  }

  componentWillUnmount() {
    const { stories } = this.props;

    // Save Story list scroll position if available
    if (this.props.match.params.channelId && stories.length &&
      this.storyList && this.storyList.list[0] && this.storyList.list[0].list.list) {
      const yPos = this.storyList.list[0].list.list.scrollTop;
      this.props.setStoriesScrollPosition(yPos);
    }

    this.props.clearLastChannel();
  }

  handleGetTabList(offset, searchTerm = this.props.tabSearchTerm) {
    let fixedOffset = offset;

    // Handle nested list offset
    if (fixedOffset > 0) {
      fixedOffset = this.props.tabs.length - 1;
    }

    this.props.loadTabs(fixedOffset, this.props.tabsSortBy, this.props.showHiddenChannels, searchTerm);
  }

  handleGetChanneList(offset, searchTerm) {
    const {
      selectedTabId,
      channelsSortBy,
      showHiddenChannels
    } = this.props;

    if (selectedTabId || this.props.match.params.tabId) {
      this.loadChannels(selectedTabId || this.props.match.params.tabId, offset, channelsSortBy, showHiddenChannels, searchTerm);
    }
  }

  handleGetStoryList(offset) {
    const {
      match,
      storiesSortBy
    } = this.props;

    // Load Stories
    if (match.params.channelId) {
      this.loadStories(match.params.channelId, offset, storiesSortBy);
    }
  }

  // Change Content (Tabs) options
  handleContentOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'showHiddenChannels':
        this.props.toggleContentShowHiddenChannels(event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Content (Tabs)
  handleContentSortOrderChange(selected) {
    this.props.setContentTabsSortBy(selected.value);
  }

  // TODO: Edit Tab
  handleTabEditClick(event) {
    event.preventDefault();
    console.log('handleEditClick');  // eslint-disable-line
  }

  // Change Channel options
  handleChannelOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'showHiddenChannels':
        this.props.toggleContentShowHiddenChannels(event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Channels
  handleChannelSortOrderChange(selected) {
    this.props.setContentChannelsSortBy(selected.value);
  }

  // Subscribe to a Channel
  handleChannelSubscribeClick() {
    const { id, isSubscribed } = this.props.selectedChannel;
    this.props.subscribeChannel(id, !isSubscribed);
  }

  /*** Start Personal Channel  ***/
  handleCreatePersonalChannel() {
    this.setState({
      isPersonalChannelModalVisible: true,
    });
  }

  // Channels modal
  handleChannelChange(data) {
    const key = data.key;
    const value = data.value;

    const tmpDetails = Object.assign({}, this.state.personalChannelDetails);
    tmpDetails[key] = value;

    this.setState({
      personalChannelDetails: tmpDetails
    });
  }

  handleToggleChannelModal(event, context) {
    event.preventDefault();
    let details = {};
    if (context && context.props && context.props.id) {
      details = context.props;
    }

    this.setState({
      isPersonalChannelModalVisible: !this.state.isPersonalChannelModalVisible,
      personalChannelDetails: details,
    });
  }

  handleChannelDeleteClick(event, context) {
    event.preventDefault();
    let details = {};
    if (get(context, 'props.channel.id', false)) {
      details = context.props.channel;
    } else {
      details = context;
    }
    this.setState({
      personalChannelDetails: details,
      confirmRemoveChannel: !this.state.confirmRemoveChannel
    });
  }

  handleChannelLeaveClick(event, context) {
    event.preventDefault();
    let details = {};
    if (get(context, 'props.channel.id', false)) {
      details = context.props.channel;
    }
    this.setState({
      personalChannelDetails: details,
      confirmShareChannelLeaveModelVisible: !this.state.confirmShareChannelLeaveModelVisible
    });
  }

  handleRemoveChannelClick() {
    this.props.deletePersonalChannel(this.state.personalChannelDetails.id);
    this.handleToggleConfirmRemoveChannel();
  }

  handleLeaveShareChannelClick() {
    const { myUser } = this.props;
    this.props.leaveSharedChannel(this.state.personalChannelDetails.id, myUser.id);
    this.handleToggleConfirmShareLeaveChannel();
  }

  handleToggleConfirmRemoveChannel() {
    this.setState({
      confirmRemoveChannel: !this.state.confirmRemoveChannel
    });
  }

  handleToggleConfirmShareLeaveChannel() {
    this.setState({
      confirmShareChannelLeaveModelVisible: !this.state.confirmShareChannelLeaveModelVisible
    });
  }

  handleChannelThumbnailClick() {
    const personalChannelDetails = Object.assign({}, this.state.personalChannelDetails);
    if (personalChannelDetails.thumbnail) {
      personalChannelDetails.thumbnail = '';
      personalChannelDetails.thumbnailDownloadUrl = '';
      this.setState({
        personalChannelDetails: personalChannelDetails,
      });
    } else {
      this.setState({
        channelImagePickerModalVisible: true,
        isPersonalChannelModalVisible: false,
      });
    }
  }

  handleChannelSave(e, context) {
    const data = {
      colour: context.colour,
      description: context.description,
      name: context.name,
      thumbnail: context.thumbnail,
      thumbnailDownloadUrl: context.thumbnailDownloadUrl,
      defaultSortBy: context.defaultSortBy,
      tabId: 'personal',
      personalChannel: 1,
    };
    if (context.id) data.id = context.id;
    this.props.savePersonalChannel(data);
  }

  // Channel Covert Art
  handleChannelImagePickerCancel() {
    this.setState({
      channelImagePickerModalVisible: false,
      isPersonalChannelModalVisible: true
    });
  }

  handleChannelImagePickerSave(event, images) {
    if (images && images[0]) {
      // Cover Art
      this.setState({
        personalChannelDetails: { ...this.state.personalChannelDetails, thumbnailId: images[0].id, thumbnail: images[0].url, thumbnailDownloadUrl: images[0].download_location },
        channelImagePickerModalVisible: false,
        isPersonalChannelModalVisible: true,
      });
    }
  }

  // Change Story options
  handleStoryOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'isGrid':
        this.props.toggleContentStoryGrid(event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Stories
  handleStorySortOrderChange(selected) {
    this.props.setContentStoriesSortBy(selected.value);
  }

  handleManageSharing(event, context) {
    event.preventDefault();
    let details = {};
    if (get(context, 'props.channel.id', false)) {
      details = context.props.channel;
    }
    this.setState({
      personalChannelDetails: details,
      showManageSharingDialog: !this.state.showManageSharingDialog
    });
  }

  handleChannelEditClick(event, context) {
    event.preventDefault();
    let details = {};
    if (get(context, 'props.channel.id', false)) {
      details = context.props.channel;
    }
    this.setState({
      isPersonalChannelModalVisible: !this.state.isPersonalChannelModalVisible,
      personalChannelDetails: details,
    });
  }

  handleManageSharingClose() {
    const {
      selectedTabId,
      channelsSortBy,
      showHiddenChannels
    } = this.props;
    this.setState({
      showManageSharingDialog: !this.state.showManageSharingDialog
    });
    this.loadChannels(selectedTabId, 0, channelsSortBy, showHiddenChannels);
  }

  handleToggleClearChannelFilter(value) {
    this.handleGetChanneList(0);
    this.props.toggleClearChannelFilter(value);
  }

  canChannelDelete() {
    const { selectedChannel } = this.props;
    return !(selectedChannel.name === 'My Channel' || selectedChannel.isFeed || selectedChannel.name === 'My Learning Channel(Completed)' || selectedChannel.name === 'My Learning Channel') && selectedChannel.isPersonal && selectedChannel.isWritable;
  }

  canIEditChannel() {
    const { selectedChannel } = this.props;
    return selectedChannel.isPersonal;
  }

  canIShareChannel() {
    const { selectedChannel, myUser } = this.props;
    let currentShareFlag = selectedChannel.isPersonal && !selectedChannel.isFeed;
    if (!currentShareFlag && selectedChannel.isShared) {
      const myId = myUser.id;
      const myShareSetting = (selectedChannel.shareUsers || []).find((user) => user.user.id === myId);
      currentShareFlag = myShareSetting && myShareSetting.meta && myShareSetting.meta.canInvite;
    }
    return currentShareFlag;
  }

  canILeaveChannel() {
    const { selectedChannel } = this.props;
    return (!selectedChannel.isPersonal && selectedChannel.isShared);
  }

  loadChannels(tabId, offset = 0, sortBy = 'name', includeHidden = false, searchTerm) {
    this.props.loadChannels(tabId, offset, sortBy, includeHidden, searchTerm);
  }

  loadStories(channelId, offset = 0, sortBy = 'date') {
    if (this.props.selectedTab && this.props.selectedTab.id === 'personal') {
      const internalChannelId = +channelId;
      let currentChannel = this.props.personalChannels.find((item) => item.id === internalChannelId);
      if (!currentChannel) {
        currentChannel = this.props.sharedChannels.find((item) => item.id === internalChannelId);
      }
      if (currentChannel && currentChannel.isShared) {
        this.props.getShareChannelUsers(internalChannelId);
      }
    }
    if (!isNaN(channelId)) this.props.loadStories(channelId, offset, sortBy);
  }

  renderSettingsComponent(type, strings) {
    const { authString, userCapabilities } = this.context.settings;
    const { canChannelSubscribe, hasHiddenChannelToggle } = userCapabilities;
    const {
      selectedTab,
      selectedChannel,

      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      storiesSortBy,
      storyGridList,
    } = this.props;
    let settingsComponent;
    switch (type) {
      case 'channel':
        settingsComponent = (
          <ChannelSettings
            channel={selectedChannel}
            sortOptions={[
              { value: 'date', label: strings.date },
              { value: 'title', label: strings.title },
              { value: 'sequence', label: strings.priority, disabled: selectedChannel.isFeed },
              { value: 'likes', label: strings.likes, disabled: selectedChannel.isFeed },
              { value: 'mostread', label: strings.mostRead },
              { value: 'leastread', label: strings.leastRead },
              { value: 'author_first_name', label: strings.authorFirstName, disabled: selectedChannel.isFeed },
              { value: 'author_last_name', label: strings.authorLastName, disabled: selectedChannel.isFeed },
              { value: 'content_score', label: strings.contentIq, disabled: selectedChannel.isFeed }
            ]}
            sortOrder={storiesSortBy}
            isGrid={storyGridList}
            authString={authString}
            strings={strings}
            onAnchorClick={this.props.onAnchorClick}
            onOptionChange={this.handleStoryOptionChange}
            onSortOrderChange={this.handleStorySortOrderChange}
            onSubscribeClick={canChannelSubscribe ? this.handleChannelSubscribeClick : null}
            showLeaveOption={this.canILeaveChannel()}
            onDeleteClick={this.handleChannelDeleteClick}
            onLeaveClick={this.handleChannelLeaveClick}
            showSharing={this.canIShareChannel()}
            onClickManageSharing={this.handleManageSharing}
            onEditClick={this.handleChannelEditClick}
            showEdit={this.canIEditChannel()}
          />);
        break;
      case 'tab':
        settingsComponent = (
          <TabSettings
            tab={selectedTab}
            sortOptions={[
              { value: 'name', label: strings.name },
              { value: 'story_count', label: strings.storyCount }
            ]}
            sortOrder={channelsSortBy}
            hasHiddenChannelToggle={hasHiddenChannelToggle}
            showHiddenChannels={showHiddenChannels}
            authString={authString}
            strings={strings}
            onAnchorClick={this.props.onAnchorClick}
            onEditClick={this.handleTabEditClick}
            onOptionChange={this.handleChannelOptionChange}
            onSortOrderChange={this.handleChannelSortOrderChange}
          />);
        break;
      default:  // content
        settingsComponent = (
          <ContentSettings
            sortOptions={[
              { value: 'name', label: strings.name },
              { value: 'channel_count', label: strings.channelCount }
            ]}
            sortOrder={tabsSortBy}
            hasHiddenChannelToggle={hasHiddenChannelToggle}
            showHiddenChannels={showHiddenChannels}
            strings={strings}
            onOptionChange={this.handleContentOptionChange}
            onSortOrderChange={this.handleContentSortOrderChange}
          />
        );
        break;
    }

    return settingsComponent;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, userCapabilities } = this.context.settings;
    const { hasPersonalContent, hasStoryBadges, showStoryAuthor } = userCapabilities;
    const {
      tabs,
      tabsLoading,
      tabsError,

      myFilesSelected,

      channels,
      stories,

      tabsComplete,
      channelsComplete,
      storiesComplete,

      selectedTab,
      selectedTabId,
      selectedTabName,

      channelsLoading,
      channelsError,

      selectedChannel,
      selectedChannelId,
      selectedChannelName,

      storiesLoading,
      storiesError,

      storyGridList,

      isSafari,
      tabSearchTerm,
      channelSearchTerm,
      baseColour,
      clearChannelFilter,
    } = this.props;
    const styles = require('./Content.less');
    const cx = classNames.bind(styles);
    const tabChannelListClasses = cx({
      tabChannelList: true,
      safariListFix: isSafari && !selectedChannelId
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Normal Tab list
    const tabList = [{
      title: hasPersonalContent ? strings.companyTabs : '',
      list: tabs.slice(1, tabs.length)
    }];

    // Add 'Personal Content' Tab to start of list
    // if user has access
    if (hasPersonalContent) {
      tabList.unshift({
        title: '',
        list: tabs.slice(0, 1)
      });
    }
    // Channel list
    const allChannels = channels;
    let personalContent = [];
    if (selectedTab && selectedTab.id === 'personal') {
      personalContent = [{
        title: '',
        list: this.props.myFiles,
      }, {
        title: strings.personalChannels,
        list: this.props.personalChannels.map((channel) => {
          const currentChannel = Object.assign({}, channel);
          if (!(currentChannel.name === 'My Channel' || currentChannel.name === 'My Learning Channel' || currentChannel.name === 'My Learning Channel(Completed)') || currentChannel.isShared) {
            currentChannel.showAdmin = true;
          } else {
            currentChannel.showAdmin = false;
          }
          currentChannel.isChannelShare = currentChannel.isShared;
          return currentChannel;
        }),
        actions: [{
          title: strings.addPersonalChannel,
          handleClick: this.handleCreatePersonalChannel
        }],
      }, {
        title: strings.sharedWithMe,
        list: this.props.sharedChannels
      }];
    }

    // Breadcrumb paths
    const tabChannelPaths = [{
      name: strings.content,
      path: '/content'
    }];
    const storyPaths = [];

    if ((selectedTabId || selectedTabName) && this.props.location.pathname !== '/content') {
      tabChannelPaths.push({
        name: selectedTabName,
        path: `/content/tabs/'${selectedTabId}`
      });
    }

    if (selectedChannelName) {
      storyPaths.push({
        name: selectedChannelName,
        path: `/content/tabs/'${selectedTabId}/channels/${selectedChannelId}`
      });
    }
    const tabChannelList = {
      shouldAnimate: true,
      activeList: (this.props.match.params.tabId || (selectedTab && selectedTab.id === 'personal')) ? 1 : 0,
      lists: [{
        list: tabList,
        isLoaded: tabs.length > 1,
        isLoading: tabsLoading,
        isLoadingMore: tabsLoading && tabs.length > 1 && !tabsComplete,
        isComplete: tabsComplete,
        error: tabsError,
        onGetList: this.handleGetTabList,
        listProps: {
          rootUrl: '/content',
          activeId: selectedTabId,
          showThumb: true,
          nestedList: true,
          thumbSize: 'small',
          onItemClick: this.props.onAnchorClick
        }
      }, {
        list: (personalContent.length > 0 && hasPersonalContent) ? personalContent : allChannels,
        isLoaded: channels.length > 0,
        isLoading: channelsLoading,
        isLoadingMore: channelsLoading && channels.length > 0 && !channelsComplete,
        isComplete: channelsComplete,
        error: channelsError,
        onGetList: this.handleGetChanneList,
        listProps: {
          rootUrl: (personalContent.length > 0 && hasPersonalContent) ? ('/content/' + selectedTabId) : ('/content/tab/' + selectedTabId),
          activeId: selectedChannelId,
          showThumb: true,
          nestedList: (personalContent.length > 0 && hasPersonalContent),
          thumbSize: 'small',
          onItemClick: this.props.onAnchorClick,
          itemProps: {
            showIcons: true,
            onEditClick: this.handleToggleChannelModal,
            onDeleteClick: this.handleChannelDeleteClick,
          },
          emptyMessage: strings.emptyChannelMessage,
        }
      }],
      menuComponent: this.renderSettingsComponent((selectedTab && selectedTab.id) ? 'tab' : 'content', strings),
      menuPosition: !selectedTabId ? { left: '-2rem', right: 'inherit' } : undefined,
      paths: tabChannelPaths,
      strings: strings,
      baseColour,
    };

    const storyList = {
      lists: [{
        list: stories,
        isLoaded: stories.length > 0,
        isLoading: storiesLoading,
        isLoadingMore: storiesLoading && stories.length > 0,
        isComplete: storiesComplete,
        error: storiesError,
        onGetList: this.handleGetStoryList,
        listProps: {
          grid: storyGridList,
          thumbSize: storyGridList ? 'large' : 'medium',
          activeId: selectedChannelId,
          itemProps: {
            showBadges: hasStoryBadges,
            showIcons: true,
            showThumb: true,
            showAuthor: showStoryAuthor,
          },
          className: !storyGridList ? styles.listView : null,
          emptyHeading: selectedChannelId ? strings.noStoryHeading : strings.emptyStoryHeading,
          emptyMessage: selectedChannelId ? strings.noStoryMessage : strings.emptyStoryMessage,
          onItemClick: this.props.onStoryClick
        }
      }],
      menuComponent: (selectedChannel && selectedChannel.id) ? this.renderSettingsComponent('channel', strings) : null,
      paths: storyPaths,
      strings: strings
    };

    return (
      <div data-id="content" className={styles.Content}>
        <Helmet>
          <title>{strings.content}</title>
        </Helmet>
        <AppHeader />
        <div data-id="lists" className={styles.listWrapper}>
          <BreadcrumbList
            width={308}
            authString={authString}
            onPathClick={this.props.onAnchorClick}
            className={tabChannelListClasses}
            hasFilter
            {...{ tabSearchTerm }}
            {...{ channelSearchTerm }}
            onTabSearch={this.handleGetTabList}
            onChannelSearch={this.handleGetChanneList}
            {...{ strings }}
            {...tabChannelList}
            {...{ clearChannelFilter }}
            onToggleClearChannelFilter={this.handleToggleClearChannelFilter}
          />
          {!myFilesSelected && <BreadcrumbList
            ref={(c) => { this.storyList = c; }}
            disableAnimation
            authString={authString}
            onPathClick={this.props.onAnchorClick}
            className={styles.storyList}
            {...storyList}
          />}
          {myFilesSelected && <MyFiles />}
        </div>
        {this.state.isPersonalChannelModalVisible &&
          <PersonalChannelModal
            loading={this.props.saving || this.props.deleting}
            isVisible={this.state.isPersonalChannelModalVisible}
            onClose={this.handleToggleChannelModal}
            onThumbnailClick={this.handleChannelThumbnailClick}
            onSave={this.handleChannelSave}
            onChange={this.handleChannelChange}
            {...this.state.personalChannelDetails}
            showDelete
            onDelete={this.handleChannelDeleteClick}
          />
        }
        {/* Channel Image Picker Modal */}
        {this.state.channelImagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleChannelImagePickerCancel}
          onSave={this.handleChannelImagePickerSave}
        />}
        {/* Channel Remove Dialog */}
        {this.state.confirmRemoveChannel && <Dialog
          title={strings.confirmDeleteChannelHeader}
          isVisible
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmRemoveChannel}
          onConfirm={this.handleRemoveChannelClick}
        >
          <FormattedMessage
            id="confirm-delete-personal-channel-message"
            defaultMessage={'Are you sure you want to delete this {channel}? All active {stories} contained in it will be deleted too.'}
            values={{ stories: naming.stories, channel: naming.channel }}
            tagName="p"
          />
        </Dialog>}
        {this.state.confirmShareChannelLeaveModelVisible && <Dialog
          title={strings.leaveChannel}
          isVisible
          confirmText={strings.leave}
          onCancel={this.handleToggleConfirmShareLeaveChannel}
          onConfirm={this.handleLeaveShareChannelClick}
        >
          <FormattedMessage
            id="confirm-leave-share-channel-message"
            defaultMessage={'Are you sure you want to leave this {channel}?'}
            values={{ channel: naming.channel }}
            tagName="p"
          />
        </Dialog>}

        {this.state.showManageSharingDialog && <ChannelSharingModel
          isVisible
          onClose={this.handleManageSharingClose}
          channelDetails={this.state.personalChannelDetails}
        />}
      </div>
    );
  }
}
