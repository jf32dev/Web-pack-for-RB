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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadTabs,
  loadChannels,
  loadStories,
  reset,
  selectSingleTab,
  selectSingleChannel,
  selectSingleStory,
  toggleSelectedStory
} from 'redux/modules/browser';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import TriggerList from 'components/TriggerList/TriggerList';

const messages = defineMessages({
  addStories: { id: 'add-stories', defaultMessage: 'Add {stories}' },
  addStory: { id: 'add-story', defaultMessage: 'Add {story}' },
  nItems: { id: 'n-items', defaultMessage: '{itemCount, plural, one {# item} other {# items}}' },

  content: { id: 'content', defaultMessage: 'Content' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  add: { id: 'add', defaultMessage: 'Add' },
  remove: { id: 'remove', defaultMessage: 'Remove' },

  tabsEmptyHeading: { id: 'tabs', defaultMessage: '{tabs}' },
  tabsEmptyMessage: { id: 'no-tabs-available', defaultMessage: 'No {tabs} available' },

  channelsEmptyHeading: { id: 'channels', defaultMessage: '{channels}' },
  channelsEmptyMessage: { id: 'no-channels-available', defaultMessage: 'No {channels} available' },

  storiesEmptyHeading: { id: 'stories', defaultMessage: '{stories}' },
  storiesEmptyMessage: { id: 'no-stories-available', defaultMessage: 'No {stories} available' },
});

function mapStateToProps(state) {
  const { browser, settings } = state;

  const availableTabs = browser.tabs.map(id => browser.tabsById[id]);
  const selectedTab = availableTabs.find(t => t.isSelected);

  // Selected Tab's Channels
  let selectedTabsChannels = [];
  let selectedChannel;
  if (selectedTab && selectedTab.channels) {
    selectedTabsChannels = selectedTab.channels.map(id => browser.channelsById[id]);

    // Filter Tabs with no Channels
    selectedTabsChannels = selectedTabsChannels.filter(function(t) {
      return t.childCount;
    });

    selectedChannel = selectedTabsChannels.find(c => c.isSelected);
  }

  // Selected Channel's Stories
  let selectedChannelsStories = [];
  if (selectedChannel && selectedChannel.stories) {
    selectedChannelsStories = selectedChannel.stories.map(id => browser.storiesById[id]);
  }

  // All Selected Stories
  const selectedStories = [];
  for (const key in browser.storiesById) {
    if (browser.storiesById[key].isSelected) {
      selectedStories.push(browser.storiesById[key]);
    }
  }

  // Is the current list empty?
  let currentListEmpty = false;
  if (selectedChannel && !selectedChannelsStories.length) {
    currentListEmpty = true;
  } else if (selectedTab && !selectedTabsChannels.length) {
    currentListEmpty = true;
  } else if (!browser.tabs.length) {
    currentListEmpty = true;
  }

  // Detect IE10/11 for flex bug workaround
  const isIE = settings.platform.name === 'IE';

  return {
    ...browser,
    tabs: availableTabs,
    selectedTab: selectedTab,
    selectedChannel: selectedChannel,
    selectedTabsChannels: selectedTabsChannels,
    selectedChannelsStories: selectedChannelsStories,
    selectedStories: selectedStories,
    currentListEmpty: currentListEmpty,

    // Content settings
    tabsSortBy: state.settings.contentSettings.tabsSortBy,
    channelsSortBy: state.settings.contentSettings.channelsSortBy,
    showHiddenChannels: state.settings.contentSettings.showHiddenChannels,
    storiesSortBy: state.settings.contentSettings.storiesSortBy,

    isIE: isIE
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadTabs,
    loadChannels,
    loadStories,
    reset,
    selectSingleTab,
    selectSingleChannel,
    selectSingleStory,
    toggleSelectedStory
  })
)
export default class StoryPickerModal extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    isVisible: PropTypes.bool,

    tabs: PropTypes.array,
    selectedTab: PropTypes.object,
    selectedChannel: PropTypes.object,

    selectedTabsChannels: PropTypes.array,
    selectedChannelsStories: PropTypes.array,
    selectedStories: PropTypes.array,

    allowMultiple: PropTypes.bool,

    /* sets `exclude_feed_channels` on /content/channels API */
    excludeFeedChannels: PropTypes.bool,

    /* sets `show_hidden_channels` on /content/channels API */
    showHiddenChannels: PropTypes.bool,

    /* sets `can_share` on /content/files API */
    canShare: PropTypes.bool,

    /** applies flexbox style fix */
    isIE: PropTypes.bool,

    loadTabs: PropTypes.func,
    loadChannels: PropTypes.func,
    loadStories: PropTypes.func,
    reset: PropTypes.func,
    selectSingleTab: PropTypes.func,
    selectSingleChannel: PropTypes.func,
    selectSingleStory: PropTypes.func,
    toggleSelectedStory: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static defaultProps = {
    allowFeedStories: true,
    excludeFeedChannels: false,
    showHiddenChannels: false,
    canShare: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleGetTabList(offset) {
    const {
      tabs,
      tabsSortBy,
      showHiddenChannels
    } = this.props;

    // Fetch on initial load or if offset > 0
    if (offset || tabs.length <= 1) {
      this.props.loadTabs(offset, tabsSortBy, showHiddenChannels);
    }
  }

  handleGetChannelList(offset) {
    const {
      selectedTab,
      selectedTabsChannels,
      channelsSortBy,
      showHiddenChannels,
      excludeFeedChannels
    } = this.props;

    // Fetch on initial load or it offset > 0
    if (selectedTab && selectedTab.id && (offset || !selectedTabsChannels.length)) {
      const canPost = false;
      this.props.loadChannels(selectedTab.id, offset, channelsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
    }
  }

  handleGetStoryList(offset) {
    const {
      selectedChannel,
      selectedChannelsStories,
      storiesSortBy,
      canShare,
    } = this.props;

    // Fetch on initial load or it offset > 0
    if (selectedChannel && selectedChannel.id && (offset || !selectedChannelsStories.length)) {
      this.props.loadStories(selectedChannel.id, offset, storiesSortBy, canShare);
    }
  }

  handlePathClick(event) {
    event.preventDefault();
    const path = event.target.dataset.path;

    // Return to root
    if (!path) {
      this.props.selectSingleTab(0);

    // Path exists
    } else {
      const [type, id] = path.split('/');
      if (type === 'tab') {
        this.props.selectSingleStory(0);
        this.props.selectSingleChannel(0);
        this.props.selectSingleTab(parseInt(id, 10));
      } else if (type === 'channel') {
        this.props.selectSingleStory(0);
        this.props.selectSingleChannel(parseInt(id, 10));
      }
    }
  }

  handleTabClick(event, item) {
    event.preventDefault();
    this.props.selectSingleTab(item.props.id);
  }

  handleChannelClick(event, item) {
    event.preventDefault();
    this.props.selectSingleChannel(item.props.id);
  }

  handleStoryClick(event, item) {
    event.preventDefault();

    if (this.props.allowMultiple) {
      this.props.toggleSelectedStory(item.props.id);
    } else {
      this.props.selectSingleStory(item.props.id);
    }
  }

  handleSaveClick(event) {
    this.props.onSave(event, this.props.selectedStories);
  }

  render() {
    const { naming, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { showStoryAuthor } = userCapabilities;
    const {
      isLoading,
      currentListEmpty,
      allowMultiple,

      tabs,
      tabsLoaded,
      tabsLoading,
      tabsComplete,

      selectedTab,
      selectedChannel,
      selectedChannelsStories,
      selectedStories,
      selectedTabsChannels,
      onClose
    } = this.props;
    const styles = require('./StoryPickerModal.less');
    const cx = classNames.bind(styles);
    const listWrapperClasses = cx({
      listWrapper: true,
      ieBody: this.props.isIE,
      loading: isLoading,
      empty: currentListEmpty
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, itemCount: selectedStories.length });

    // Breadcrumbs
    const paths = [{
      name: strings.content,
      path: ''
    }];

    if (selectedTab) {
      paths.push({
        name: selectedTab.name,
        path: 'tab/' + selectedTab.id
      });
    }

    if (selectedTab && selectedChannel) {
      paths.push({
        name: selectedChannel.name,
        path: 'channel/' + selectedChannel.id
      });
    }

    // Title String
    let titleString = allowMultiple ? strings.addStories : strings.addStory;
    if (selectedStories.length) {
      titleString += ` (${strings.nItems})`;
    }

    return (
      <Modal
        id="story-picker"
        escClosesModal
        isVisible={this.props.isVisible}
        headerTitle={titleString}
        footerChildren={(
          <div>
            <Btn
              data-id="cancel"
              large
              alt
              onClick={onClose}
            >
              {strings.cancel}
            </Btn>
            <Btn
              data-id="add"
              large
              inverted
              disabled={!selectedStories.length}
              onClick={this.handleSaveClick}
            >
              {strings.add}
            </Btn>
          </div>
        )}
        className={styles.StoryPickerModal}
        bodyClassName={styles.body}
        footerClassName={styles.footer}
        onClose={onClose}
      >
        <div className={styles.crumbWrapper}>
          <Breadcrumbs
            paths={paths}
            noLink
            onPathClick={this.handlePathClick}
            className={styles.crumbs}
          />
        </div>
        <div className={listWrapperClasses}>
          {!selectedTab && <TriggerList
            list={tabs}
            isLoaded={tabsLoaded}
            isLoading={tabsLoading}
            isLoadingMore={tabsLoading && tabs.length > 0}
            isComplete={tabsComplete}
            onGetList={this.handleGetTabList}
            listProps={{
              error: this.props.tabsError,
              noLink: true,
              showThumb: true,
              thumbSize: 'small',
              emptyHeading: strings.tabsEmptyHeading,
              emptyMessage: strings.tabsEmptyMessage,
              onItemClick: this.handleTabClick,
              itemClassName: styles.item
            }}
          />}
          {selectedTab && !selectedChannel && <TriggerList
            list={selectedTabsChannels}
            isLoaded={selectedTab.channelsLoaded}
            isLoading={selectedTab.channelsLoading}
            isLoadingMore={selectedTab.channelsLoading && selectedTabsChannels.length > 0}
            isComplete={selectedTab.channelsComplete}
            onGetList={this.handleGetChannelList}
            listProps={{
              error: selectedTab.channelsError,
              noLink: true,
              showThumb: true,
              thumbSize: 'small',
              emptyHeading: strings.channelsEmptyHeading,
              emptyMessage: strings.channelsEmptyMessage,
              onItemClick: this.handleChannelClick,
              itemClassName: styles.item
            }}
          />}
          {selectedTab && selectedChannel && <TriggerList
            list={selectedChannelsStories}
            isLoaded={selectedChannel.storiesLoaded}
            isLoading={selectedChannel.storiesLoading}
            isLoadingMore={selectedChannel.storiesLoading && selectedChannelsStories.length > 0}
            isComplete={selectedChannel.storiesComplete}
            onGetList={this.handleGetStoryList}
            listProps={{
              error: selectedChannel.storiesError,
              noLink: true,
              showThumb: true,
              thumbSize: 'small',
              itemProps: {
                showCheckbox: true,
                showAuthor: showStoryAuthor,
              },
              emptyHeading: strings.storiesEmptyHeading,
              emptyMessage: strings.storiesEmptyMessage,
              onItemClick: this.handleStoryClick,
              itemClassName: styles.item
            }}
          />}
        </div>
      </Modal>
    );
  }
}
