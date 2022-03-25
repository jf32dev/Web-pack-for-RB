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
  setDefaultChannel,
  clearDefaultChannel,
  setStoryOption
} from 'redux/modules/settings';
import {
  loadTabs,
  loadChannels,
  reset,
  selectSingleTab,
  selectSingleChannel,
  toggleSelectedChannel
} from 'redux/modules/browser';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import ChannelItem from 'components/ChannelItem/ChannelItem';
import DropMenu from 'components/DropMenu/DropMenu';
import Modal from 'components/Modal/Modal';
import TriggerList from 'components/TriggerList/TriggerList';

import ContentSettings from 'components/ContentSettings/ContentSettings';
import TabSettings from 'components/TabSettings/TabSettings';

const messages = defineMessages({
  addChannels: { id: 'add-channels', defaultMessage: 'Add {channels}' },
  addChannel: { id: 'add-channel', defaultMessage: 'Add {channel}' },
  nItems: { id: 'n-items', defaultMessage: '{itemCount, plural, one {# item} other {# items}}' },
  defaultChannelText: { id: 'default-channel', defaultMessage: 'Default {channel}' },
  makeDefaultText: { id: 'make-default', defaultMessage: 'Make Default' },

  content: { id: 'content', defaultMessage: 'Content' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  add: { id: 'add', defaultMessage: 'Add' },
  remove: { id: 'remove', defaultMessage: 'Remove' },

  tabsEmptyHeading: { id: 'tabs', defaultMessage: '{tabs}' },
  tabsEmptyMessage: { id: 'no-tabs-available', defaultMessage: 'No {tabs} available' },
  channelsEmptyHeading: { id: 'channels', defaultMessage: '{channels}' },
  channelsEmptyMessage: { id: 'no-channels-available', defaultMessage: 'No {channels} available' },

  contentDetails: { id: 'contentDetails', defaultMessage: 'Content Details' },

  showHiddenChannels: { id: 'show-hidden-channels', defaultMessage: 'Show Hidden {channels}' },

  name: { id: 'name', defaultMessage: 'Name' },
  storyCount: { id: 'story-count', defaultMessage: '{story} count' },
  channelCount: { id: 'channel-count', defaultMessage: '{channel} count' },
});

function mapStateToProps(state) {
  const { browser, settings } = state;
  const { storyDefaults } = settings;
  const availableTabs = browser.tabs.map(id => browser.tabsById[id]);
  const selectedTab = availableTabs.find(t => t.isSelected);

  // Default Channel
  const defaultChannel = storyDefaults.channels && storyDefaults.channels.id ? storyDefaults.channels : null;

  // Selected Tab's channels
  let selectedTabsChannels = [];
  if (selectedTab && selectedTab.channels) {
    selectedTabsChannels = selectedTab.channels.map(id => browser.channelsById[id]);
  }

  // All Selected Channels
  const selectedChannels = [];
  for (const key in browser.channelsById) {
    if (browser.channelsById[key].isSelected) {
      selectedChannels.push(browser.channelsById[key]);
    }
  }

  // Detect IE10/11 for flex bug workaround
  const isIE = settings.platform.name === 'IE';

  return {
    ...browser,
    defaultChannel: defaultChannel,

    tabs: availableTabs,
    selectedTab: selectedTab,
    selectedTabsChannels: selectedTabsChannels,
    selectedChannels: selectedChannels,

    channelsLoaded: selectedTab && selectedTab.channelsLoaded,
    channelsLoading: selectedTab && selectedTab.channelsLoading,

    // Currently intended to only be used on StoryEdit
    // if this changes, pass these settings as props
    // when the component is rendered instad of here
    tabsSortBy: state.settings.storySettings.tabsSortBy,
    channelsSortBy: state.settings.storySettings.channelsSortBy,
    showHiddenChannels: state.settings.storySettings.showHiddenChannels,

    isIE: isIE
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    setDefaultChannel,
    clearDefaultChannel,
    setStoryOption,

    loadTabs,
    loadChannels,
    reset,
    selectSingleTab,
    selectSingleChannel,
    toggleSelectedChannel
  })
)
export default class ChannelPickerModal extends Component {
  static propTypes = {
    defaultChannel: PropTypes.object,

    tabs: PropTypes.array,
    selectedTab: PropTypes.object,
    selectedTabsChannels: PropTypes.array,
    selectedChannels: PropTypes.array,

    /** Allow multiple Channels to be selected */
    allowMultiple: PropTypes.bool,

    /** sets `can_post` on /content/tabs & /content/channels API */
    canPost: PropTypes.bool,

    /* sets `exclude_feed_channels` on /content/tabs & /content/channels */
    excludeFeedChannels: PropTypes.bool,

    /** applies flexbox style fix */
    isIE: PropTypes.bool,

    strings: PropTypes.object,

    loadTabs: PropTypes.func,
    loadChannels: PropTypes.func,
    reset: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.dropmenu = null;
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const {
      selectedTab,
      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      canPost,
      excludeFeedChannels
    } = nextProps;

    // Fetch Tabs if tabsSortBy changing
    // or showHiddenChannels has changed and no Tab selected
    // or navigating back to Tab list
    if (tabsSortBy !== this.props.tabsSortBy ||
       (showHiddenChannels !== this.props.showHiddenChannels && !selectedTab) ||
       !selectedTab && this.props.selectedTab) {
      this.props.loadTabs(0, tabsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
    }

    // Fetch Channels if channelsSortBy changing
    // or showHiddenChannels has changed and Tab is selected
    // or navigating back to Channel list
    if (channelsSortBy !== this.props.channelsSortBy ||
       (showHiddenChannels !== this.props.showHiddenChannels && selectedTab) ||
       selectedTab && !this.props.selectedTab) {
      this.props.loadChannels(selectedTab.id, 0, channelsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleGetTabList(offset) {
    const {
      tabs,
      tabsSortBy,
      showHiddenChannels,
      canPost,
      excludeFeedChannels
    } = this.props;

    // Fetch on initial load or if offset > 0
    if (offset || tabs.length <= 1) {
      this.props.loadTabs(offset, tabsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
    }
  }

  handleGetChannelList(offset) {
    const {
      selectedTab,
      selectedTabsChannels,
      channelsSortBy,
      showHiddenChannels,
      canPost,
      excludeFeedChannels
    } = this.props;

    // Fetch on initial load or it offset > 0
    if (selectedTab && selectedTab.id && (offset || !selectedTabsChannels.length)) {
      this.props.loadChannels(selectedTab.id, offset, channelsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
    }
  }

  // Change Content (Tabs) options
  handleContentOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'showHiddenChannels':
        this.props.setStoryOption(option, event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Content (Tabs)
  handleContentSortOrderChange(selected) {
    this.props.setStoryOption('tabsSortBy', selected.value);
  }

  // Change Channel options
  handleChannelOptionChange(event) {
    const option = event.target.dataset.option;
    switch (option) {
      case 'showHiddenChannels':
        this.props.setStoryOption(option, event.currentTarget.checked);
        break;
      default:
        break;
    }
  }

  // Change sort order of Channels
  handleChannelSortOrderChange(selected) {
    this.props.setStoryOption('channelsSortBy', selected.value);
  }

  handlePathClick(event) {
    event.preventDefault();
    this.props.selectSingleTab(0);
  }

  handleTabClick(event, item) {
    event.preventDefault();
    this.props.selectSingleTab(item.props.id);
  }

  handleChannelClick(event, item) {
    event.preventDefault();

    if (this.props.allowMultiple) {
      this.props.toggleSelectedChannel(item.props.id);
    } else {
      this.props.selectSingleChannel(item.props.id);
    }
  }

  handlePreventClick(event) {
    event.preventDefault();
  }

  handleRemoveDefaultClick(event) {
    event.preventDefault();
    this.props.clearDefaultChannel();
  }

  handleMakeDefaultClick(event) {
    event.stopPropagation();
    const channelId = event.target.dataset.id;
    const channel = this.props.channelsById[channelId];

    if (channel) {
      const data = {
        id: channel.id,
        name: channel.name,
        colour: channel.colour,
        thumbnail: channel.thumbnail,
        alias: false
      };
      this.props.setDefaultChannel(data);
    }
  }

  handleSaveClick(event) {
    this.props.onSave(event, this.props.selectedChannels);
  }

  render() {
    const { naming, authString, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { hasHiddenChannelToggle } = userCapabilities;
    const {
      allowMultiple,
      defaultChannel,

      tabs,
      tabsLoaded,
      tabsLoading,
      tabsComplete,

      selectedTab,
      selectedTabsChannels,
      selectedChannels,
      channelsLoaded,
      channelsLoading,
      onClose,

      tabsSortBy,
      channelsSortBy,
      showHiddenChannels
    } = this.props;
    const styles = require('./ChannelPickerModal.less');
    const cx = classNames.bind(styles);
    const listWrapperClasses = cx({
      listWrapper: true,
      ieBody: this.props.isIE,
      loading: tabsLoading || channelsLoading,
      empty: selectedTab ? !selectedTabsChannels.length : !tabs.length
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, itemCount: selectedChannels.length });

    // Breadcrumbs
    const paths = [{
      name: strings.content,
      path: ''
    }];

    // Settings
    let menuComponent = (
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

    if (selectedTab) {
      paths.push({
        name: selectedTab.name,
        path: ''
      });

      menuComponent = (
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
          onAnchorClick={this.handlePreventClick}
          onOptionChange={this.handleChannelOptionChange}
          onSortOrderChange={this.handleChannelSortOrderChange}
        />
      );
    }

    // Set 'Make Default' button to Channel children prop
    const fixedSelectedTabsChannels = [];
    if (selectedTabsChannels) {
      selectedTabsChannels.forEach(c => {
        fixedSelectedTabsChannels.push({
          ...c,
          children: (<Btn  // eslint-disable-line
            data-id={c.id}
            onClick={this.handleMakeDefaultClick}
            inverted
            className={styles.makeDefault}
          >
            {strings.makeDefaultText}
          </Btn>)
        });
      });
    }

    // Title String
    let titleString = allowMultiple ? strings.addChannels : strings.addChannel;
    if (selectedChannels.length) {
      titleString += ` (${strings.nItems})`;
    }

    // Show Default Channel?
    let showDefault = false;
    if (defaultChannel && ((!tabsLoading && !channelsLoading) || (!selectedTab && tabsLoaded) || (selectedTab && channelsLoaded))) {
      showDefault = true;
    }

    return (
      <Modal
        id="channel-picker"
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
              disabled={!selectedChannels.length}
              onClick={this.handleSaveClick}
            >
              {strings.add}
            </Btn>
          </div>
        )}
        className={styles.ChannelPickerModal}
        bodyClassName={styles.body}
        footerClassName={styles.footer}
        onClose={onClose}
      >
        {showDefault && <div data-id="default-channel" className={styles.defaultChannelWrap}>
          <h4>{strings.defaultChannelText}</h4>
          <ChannelItem
            {...defaultChannel}
            noLink
            showThumb
            thumbSize="small"
            authString={authString}
            className={styles.defaultChannel}
            onClick={this.handlePreventClick}
          >
            <Btn
              warning
              className={styles.removeDefault}
              onClick={this.handleRemoveDefaultClick}
            >
              {strings.remove}
            </Btn>
          </ChannelItem>
        </div>}
        <div className={styles.crumbWrapper}>
          <Breadcrumbs
            key="breadcrumbs"
            paths={paths}
            noLink
            onPathClick={this.handlePathClick}
            className={styles.crumbs}
          />
          <DropMenu
            key="dropmenu"
            ref={(c) => { this.dropmenu = c; }}
            icon="triangle"
            position={{
              left: '-1.25rem',
              right: 'inherit'
            }}
            className={styles.dropMenu}
          >
            {menuComponent}
          </DropMenu>
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
          {selectedTab && <TriggerList
            list={fixedSelectedTabsChannels}
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
              itemProps: { showCheckbox: true },
              emptyHeading: strings.channelsEmptyHeading,
              emptyMessage: strings.channelsEmptyMessage,
              onItemClick: this.handleChannelClick,
              itemClassName: styles.item
            }}
          />}
        </div>
      </Modal>
    );
  }
}
