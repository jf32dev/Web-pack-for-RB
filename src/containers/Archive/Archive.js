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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadTabs,
  loadChannels,
  loadStories,
  loadRevisions,

  clearLastChannelAndStory
} from 'redux/modules/archive';
import {
  setArchiveTabsSortBy,
  setArchiveChannelsSortBy,
  setArchiveStoriesSortBy,
  toggleArchiveShowHiddenChannels,
  toggleArchiveStoryGrid,
  setLastArchiveRoute
} from 'redux/modules/settings';

import AppHeader from 'components/AppHeader/AppHeader';
import BreadcrumbList from 'components/BreadcrumbList/BreadcrumbList';

import ArchiveSettings from 'components/ArchiveSettings/ArchiveSettings';
import ChannelSettings from 'components/ChannelSettings/ChannelSettings';
import TabSettings from 'components/TabSettings/TabSettings';

const messages = defineMessages({
  archive: { id: 'archive', defaultMessage: 'Archive' },
  companyTabs: { id: 'company-tabs', defaultMessage: 'Company {tabs}' },

  emptyStoryHeading: { id: 'archived-stories', defaultMessage: 'Archived {stories}' },
  emptyStoryMessage: { id: 'archive-empty-message', defaultMessage: 'Select a {channel} to view archived {stories}' },

  noChannelsMessage: {
    id: 'archive-channels-empty-message',
    defaultMessage: 'There are currently no archived {channels} located inside this {tab}.'
  },

  noStoryMessage: {
    id: 'archive-story-empty-message',
    defaultMessage: 'There are currently no archived {stories} located inside this {channel}.'
  },

  noRevisionsMessage: {
    id: 'story-no-revisions-message',
    defaultMessage: 'There is currently no revision history associated with this {story}.'
  },

  emptyRevisionsHeading: {
    id: 'story-revisions',
    defaultMessage: '{story} Revisions'
  },
  emptyRevisionsMessage: {
    id: 'story-revisions-empty-message',
    defaultMessage: 'Select a {story} to view {story} revision history.'
  },

  archiveDetails: { id: 'archiveDetails', defaultMessage: 'Archive Details' },
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
  contentIq: { id: 'content-iq', defaultMessage: 'Content IQ' }
});

function mapStateToProps(state, ownProps) {
  const { tabs, tabsById, channelsById, storiesById, revisionsById, lastChannel, lastStory } = state.archive;
  const selectedTab = tabsById[ownProps.match.params.tabId];

  // Use lastChannel if available
  const selectedChannel = channelsById[lastChannel] || channelsById[ownProps.match.params.channelId];
  const selectedStory = storiesById[lastStory] || storiesById[ownProps.match.params.storyId];

  // Selected Tab's channels
  let channels = [];
  if (selectedTab && selectedTab.channels) {
    channels = selectedTab.channels.map(id => channelsById[id]);
  }

  // Selected Channel's Stories
  let stories = [];
  if (selectedChannel && selectedChannel.stories) {
    stories = selectedChannel.stories.map(id => ({
      ...storiesById[id],
      rootUrl: `/archive/tab/${selectedChannel.tabId}/channel/${selectedChannel.id}`,
    }));
  }

  // Selected Story's Revisions
  let revisions = [];
  if (selectedStory && selectedStory.revisions) {
    revisions = selectedStory.revisions.map(id => revisionsById[id]);
  }

  return {
    ...state.archive,
    tabs: tabs.map(id => tabsById[id]),
    channels: channels,
    stories: stories,
    revisions: revisions,

    selectedTab: selectedTab,
    selectedTabId: selectedTab ? selectedTab.id : null,
    selectedTabName: selectedTab ? selectedTab.name : '',

    channelsComplete: selectedTab ? selectedTab.channelsComplete : false,
    channelsLoading: selectedTab ? selectedTab.channelsLoading : false,
    channelsError: selectedTab ? selectedTab.channelsError : {},

    selectedChannel: selectedChannel,
    selectedChannelId: selectedChannel ? selectedChannel.id : null,
    selectedChannelName: selectedChannel ? selectedChannel.name : '',

    storiesComplete: selectedChannel ? selectedChannel.storiesComplete : false,
    storiesLoading: selectedChannel ? selectedChannel.storiesLoading : false,
    storiesError: selectedChannel ? selectedChannel.storiesError : {},

    selectedStory: selectedStory,
    selectedStoryId: selectedStory ? selectedStory.id : null,
    selectedStoryName: selectedStory ? selectedStory.name : '',

    revisionsComplete: selectedStory ? selectedStory.revisionsComplete : false,
    revisionsLoading: selectedStory ? selectedStory.revisionsLoading : false,
    revisionsError: selectedStory ? selectedStory.revisionsError : {},

    // Settings
    tabsSortBy: state.settings.archiveSettings.tabsSortBy,
    channelsSortBy: state.settings.archiveSettings.channelsSortBy,
    showHiddenChannels: state.settings.archiveSettings.showHiddenChannels,
    storiesSortBy: state.settings.archiveSettings.storiesSortBy,
    storyGridList: state.settings.archiveSettings.storyGrid,

    isSafari: state.settings.platform.name === 'Safari'
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadTabs,
    loadChannels,
    loadStories,
    loadRevisions,

    clearLastChannelAndStory,

    setArchiveTabsSortBy,
    setArchiveChannelsSortBy,
    setArchiveStoriesSortBy,
    toggleArchiveShowHiddenChannels,
    toggleArchiveStoryGrid,
    setLastArchiveRoute
  })
)
export default class Archive extends Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired,
    stories: PropTypes.array.isRequired,
    revisions: PropTypes.array.isRequired,

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
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    // Manually fetch tabs if tabId is passed on mount
    if (this.props.match.params.tabId) {
      this.props.loadTabs(0, this.props.tabsSortBy, this.props.showHiddenChannels);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      match,
      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      storiesSortBy
    } = this.props;
    const {
      params
    } = match;

    // Load Tabs if changing tabsSortById, showHiddenChannels
    if (!nextProps.match.params.tabId && (tabsSortBy !== nextProps.tabsSortBy || showHiddenChannels !== nextProps.showHiddenChannels)) {
      this.props.loadTabs(0, nextProps.tabsSortBy, nextProps.showHiddenChannels);

    // Load Channels if changing channelsSortBy, showHiddenChannels
    } else if (nextProps.match.params.tabId && (channelsSortBy !== nextProps.channelsSortBy || showHiddenChannels !== nextProps.showHiddenChannels)) {
      this.props.loadChannels(nextProps.match.params.tabId, 0, nextProps.channelsSortBy, nextProps.showHiddenChannels);

    // Load Stories if changing Channel ID
    // or changing storiesSortBy
    } else if (nextProps.match.params.channelId && (params.channelId !== nextProps.match.params.channelId ||
                                              storiesSortBy !== nextProps.storiesSortBy)) {
      this.props.loadStories(nextProps.match.params.channelId, 0, nextProps.storiesSortBy);
    }

    // Save current route
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.setLastArchiveRoute(nextProps.location.pathname);
    }
  }

  componentWillUnmount() {
    this.props.clearLastChannelAndStory();
  }

  handleGetTabList(offset) {
    this.props.loadTabs(offset, this.props.tabsSortBy, this.props.showHiddenChannels);
  }

  handleGetChanneList(offset) {
    const {
      match,
      channelsSortBy,
      showHiddenChannels
    } = this.props;

    if (match.params.tabId) {
      this.props.loadChannels(match.params.tabId, offset, channelsSortBy, showHiddenChannels);
    }
  }

  handleGetStoryList(offset) {
    const {
      match,
      storiesSortBy
    } = this.props;

    if (match.params.channelId) {
      this.props.loadStories(match.params.channelId, offset, storiesSortBy);
    }
  }

  handleGetRevisionsList(offset) {
    const {
      match
    } = this.props;

    if (match.params.storyId) {
      this.props.loadRevisions(match.params.storyId, offset);
    }
  }

  // Change Archive (Tabs) options
  handleArchiveOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'showHiddenChannels':
        this.props.toggleArchiveShowHiddenChannels(event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Archive (Tabs)
  handleArchiveSortOrderChange(selected) {
    this.props.setArchiveTabsSortBy(selected.value);
  }

  // Change Channel options
  handleChannelOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'showHiddenChannels':
        this.props.toggleArchiveShowHiddenChannels(event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Channels
  handleChannelSortOrderChange(selected) {
    this.props.setArchiveChannelsSortBy(selected.value);
  }

  // Change Story options
  handleStoryOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'isGrid':
        this.props.toggleArchiveStoryGrid(event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Stories
  handleStorySortOrderChange(selected) {
    this.props.setArchiveStoriesSortBy(selected.value);
  }

  renderSettingsComponent(type, strings) {
    const { authString, userCapabilities } = this.context.settings;
    const { hasHiddenChannelToggle } = userCapabilities;
    const {
      selectedTab,
      selectedChannel,

      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      storiesSortBy,
      storyGridList
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
            onOptionChange={this.handleChannelOptionChange}
            onSortOrderChange={this.handleChannelSortOrderChange}
          />);
        break;
      default:  // archive
        settingsComponent = (
          <ArchiveSettings
            sortOptions={[
              { value: 'name', label: strings.name },
              { value: 'channel_count', label: strings.channelCount }
            ]}
            sortOrder={tabsSortBy}
            hasHiddenChannelToggle={hasHiddenChannelToggle}
            showHiddenChannels={showHiddenChannels}
            strings={strings}
            onSortOrderChange={this.handleArchiveSortOrderChange}
            onOptionChange={this.handleArchiveOptionChange}
          />
        );
        break;
    }

    return settingsComponent;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, userCapabilities } = this.context.settings;
    const { hasStoryBadges, showStoryAuthor } = userCapabilities;
    const {
      tabs,
      tabsLoading,
      tabsError,

      channels,
      stories,
      revisions,

      tabsComplete,
      channelsComplete,
      storiesComplete,
      revisionsComplete,

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

      selectedStoryId,
      selectedStoryName,

      revisionsLoading,
      revisionsError,

      storyGridList,

      isSafari
    } = this.props;
    const styles = require('./Archive.less');
    const cx = classNames.bind(styles);
    const tabChannelListClasses = cx({
      tabChannelList: true,
      safariListFix: isSafari && !selectedChannelId
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const tabChannelPaths = [{
      name: strings.archive,
      path: '/archive'
    }];
    const storyRevisionPaths = [];

    if (selectedTabName && this.props.location.pathname !== '/archive') {
      tabChannelPaths.push({
        name: selectedTabName,
        path: `/archive/tab/${selectedTabId}`
      });
    }

    if (selectedChannelName) {
      storyRevisionPaths.push({
        name: selectedChannelName,
        path: `/archive/tab/${selectedChannel.tabId}/channel/${selectedChannelId}`
      });
    }

    if (selectedChannelName && selectedStoryName) {
      storyRevisionPaths.push({
        name: selectedStoryName,
        path: `/archive/tab/${selectedChannel.tabId}/channel/${selectedChannelId}/story/${selectedStoryId}`
      });
    }

    const tabChannelList = {
      activeList: this.props.match.params.tabId ? 1 : 0,
      lists: [{
        list: tabs,
        isLoaded: tabs.length > 1,
        isLoading: tabsLoading,
        isLoadingMore: tabsLoading && tabs.length > 1 && !tabsComplete,
        isComplete: tabsComplete,
        error: tabsError,
        onGetList: this.handleGetTabList,
        listProps: {
          rootUrl: '/archive',
          activeId: selectedTabId,
          showThumb: true,
          thumbSize: 'small',
          onItemClick: this.props.onAnchorClick
        }
      }, {
        list: channels,
        isLoaded: channels.length > 0,
        isLoading: channelsLoading,
        isLoadingMore: channelsLoading && channels.length > 0 && !channelsComplete,
        isComplete: channelsComplete,
        error: channelsError,
        onGetList: this.handleGetChanneList,
        listProps: {
          rootUrl: `/archive/tab/${selectedTabId}`,
          activeId: selectedChannelId,
          showThumb: true,
          thumbSize: 'small',
          emptyHeading: '',
          emptyMessage: strings.noChannelsMessage,
          onItemClick: this.props.onAnchorClick
        }
      }],
      menuComponent: this.renderSettingsComponent((selectedTab && selectedTab.id) ? 'tab' : 'content', strings),
      menuPosition: !selectedTabId ? { left: '-2rem', right: 'inherit' } : undefined,
      paths: tabChannelPaths,
      strings: strings
    };

    // Determine when to show Story/Revision list
    let activeStoryList = 0;
    if (this.props.match.params.tabId && this.props.match.params.channelId && !this.props.match.params.storyId) {
      activeStoryList = 0;
    } else if (this.props.match.params.storyId || (!this.props.match.params.storyId && selectedChannelId && selectedStoryId)) {
      activeStoryList = 1;
    }

    const storyRevisionList = {
      activeList: activeStoryList,
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
          activeId: selectedChannelId,
          itemProps: {
            showBadges: hasStoryBadges,
            showIcons: true,
            showThumb: true,
            showQuicklinkEdit: false,
            showAuthor: showStoryAuthor,
          },
          thumbSize: storyGridList ? 'large' : 'medium',
          className: !storyGridList ? styles.listView : null,
          emptyHeading: (selectedTabId && selectedChannelId) ? '' : strings.emptyStoryHeading,
          emptyMessage: (selectedTabId && selectedChannelId) ? strings.noStoryMessage : strings.emptyStoryMessage,
          onItemClick: this.props.onAnchorClick
        }
      }, {
        list: revisions,
        isLoaded: revisions.length > 0,
        isLoading: revisionsLoading,
        isLoadingMore: revisionsLoading && revisions.length > 0,
        isComplete: revisionsComplete,
        error: revisionsError,
        onGetList: this.handleGetRevisionsList,
        listProps: {
          activeId: selectedStoryId,
          showAuthor: showStoryAuthor,
          showThumb: true,
          onItemClick: this.props.onStoryClick,
          emptyHeading: (selectedChannelId && selectedStoryId) ? '' : strings.emptyRevisionsHeading,
          emptyMessage: (selectedChannelId && selectedStoryId) ? strings.noRevisionsMessage : strings.emptyRevisionsMessage
        }
      }],
      menuComponent: (selectedChannelId && !selectedStoryId) ? this.renderSettingsComponent('channel', strings) : null,
      paths: storyRevisionPaths,
      strings: strings
    };

    return (
      <div className={styles.Archive}>
        <Helmet>
          <title>{strings.archive}</title>
        </Helmet>
        <AppHeader />
        <div className={styles.listWrapper}>
          <BreadcrumbList
            width={308}
            authString={authString}
            onAnchorClick={this.props.onAnchorClick}
            onPathClick={this.props.onAnchorClick}
            onSortOrderChange={this.handleTabSortOrderChange}
            className={tabChannelListClasses}
            {...tabChannelList}
          />
          <BreadcrumbList
            disableAnimation
            authString={authString}
            onAnchorClick={this.props.onAnchorClick}
            onPathClick={this.props.onAnchorClick}
            onOptionChange={this.handleChannelOptionChange}
            onSortOrderChange={this.handleChannelSortOrderChange}
            className={styles.storyRevisionList}
            {...storyRevisionList}
          />
        </div>
      </div>
    );
  }
}
