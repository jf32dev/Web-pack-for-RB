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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
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
import Checkbox from 'components/Checkbox/Checkbox';
import DropMenu from 'components/DropMenu/DropMenu';
import Modal from 'components/Modal/Modal';
import TriggerList from 'components/TriggerList/TriggerList';

import ContentSettings from 'components/ContentSettings/ContentSettings';
import TabSettings from 'components/TabSettings/TabSettings';

const messages = defineMessages({
  addChannels: { id: 'add-channels', defaultMessage: 'Add {channels}' },
  addChannel: { id: 'add-channel', defaultMessage: 'Add {channel}' },
  nItems: { id: 'n-items', defaultMessage: '{itemCount, plural, one {# item} other {# items}}' },

  selectAll: { id: 'select-all', defaultMessage: 'Select All' },

  content: { id: 'content', defaultMessage: 'Content' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  add: { id: 'add', defaultMessage: 'Add' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  apply: { id: 'apply', defaultMessage: 'Apply' },

  tabsEmptyHeading: { id: 'tabs', defaultMessage: '{tabs}' },
  tabsEmptyMessage: { id: 'no-tabs-available', defaultMessage: 'No {tabs} available' },
  channelsEmptyHeading: { id: 'channels', defaultMessage: '{channels}' },
  channelsEmptyMessage: { id: 'no-channels-available', defaultMessage: 'No {channels} available' },

  contentDetails: { id: 'contentDetails', defaultMessage: 'Content Details' },

  showHiddenChannels: { id: 'show-hidden-channels', defaultMessage: 'Show Hidden {channels}' },

  name: { id: 'name', defaultMessage: 'Name' },
  storyCount: { id: 'story-count', defaultMessage: '{story} count' },
  channelCount: { id: 'channel-count', defaultMessage: '{channel} count' },
  selectLocation: { id: 'select-location', defaultMessage: 'Select Location' },
  nChannelsSelected: { id: 'n-channels-selected', defaultMessage: '{itemCount, plural, one {# {channel}} other {# {channels}}} selected' },
  selectedTabChannels: { id: 'selected-tab-channels', defaultMessage: '{selectedTabChannels, plural, one {# {channel}} other {# {channels}}}' },
  companyTabs: { id: 'company-tabs', defaultMessage: 'Company {tabs}' },
  clearAll: { id: 'clear-all', defaultMessage: 'Clear All' },
});

function mapStateToProps(state) {
  const { browser, settings } = state;
  const availableTabs = browser.tabs.map(id => browser.tabsById[id]);
  const selectedTab = availableTabs.find(t => t.isSelected);

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
    setStoryOption,

    loadTabs,
    loadChannels,
    reset,
    selectSingleTab,
    selectSingleChannel,
    toggleSelectedChannel
  })
)
export default class ChannelPickerModalForSearch extends Component {
  static propTypes = {

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

    /** modal heading description is for pageSearch */
    isLocationHeader: PropTypes.bool,

    strings: PropTypes.object,

    loadTabs: PropTypes.func,
    loadChannels: PropTypes.func,
    reset: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,

    canShare: PropTypes.bool,
    onClearAllSelectedChannels: PropTypes.func
  };

  static defaultProps = {
    selectedChannelsForSearch: [],
    selectedTabsChannels: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      selectAllChecked: false,
      selectAllIndeterminate: false
    };
    autobind(this);

    // refs
    this.dropmenu = null;
  }

  componentDidUpdate(prevProps) {
    const {
      selectedTab,
      selectedTabsChannels,
      selectedChannels,
      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      canPost,
      excludeFeedChannels,
      canShare
    } = this.props;

    // Reset Select All checkbox when another tab is selected
    if (selectedTab && !prevProps.selectedTab) {
      let totalSelected = 0;
      if (selectedChannels && selectedChannels.length >= selectedTabsChannels.length) {
        for (const obj of selectedTabsChannels) {
          if (selectedTab && selectedChannels.find(item => item.id === obj.id)) {
            totalSelected += 1;
          }
        }
      }

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selectAllChecked: selectedTabsChannels.length > 0 && totalSelected === selectedTabsChannels.length,
        selectAllIndeterminate: selectedTabsChannels.length > 0 && totalSelected < selectedTabsChannels.length
      });
    }

    // Fetch Tabs if tabsSortBy changing
    // or showHiddenChannels has changed and no Tab selected
    // or navigating back to Tab list
    if (tabsSortBy !== prevProps.tabsSortBy ||
      (showHiddenChannels !== prevProps.showHiddenChannels && !selectedTab) ||
      !selectedTab && prevProps.selectedTab) {
      this.props.loadTabs(0, tabsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
    }

    // Fetch Channels if channelsSortBy changing
    // or showHiddenChannels has changed and Tab is selected
    // or navigating back to Channel list
    if (channelsSortBy !== prevProps.channelsSortBy ||
      (showHiddenChannels !== prevProps.showHiddenChannels && selectedTab)) {
      this.props.loadChannels(selectedTab.id, 0, channelsSortBy, showHiddenChannels, canPost, excludeFeedChannels, canShare);
    }

    // Preselect channels
    if (this.props.selectedChannelsForSearch && this.props.selectedTab && this.props.selectedTab.channelsLoaded && prevProps.selectedTab && (!prevProps.selectedTab.channelsLoaded || this.props.selectedTab.channelsLoaded !== prevProps.selectedTab.channelsLoaded)) {
      this.props.selectedChannelsForSearch.forEach(channel => {
        for (const key in this.props.selectedTabsChannels) {
          if (this.props.selectedTabsChannels[key].id === channel.id) {
            this.props.toggleSelectedChannel(channel.id);
          }
        }
      });
    }

    if (prevProps.selectedChannels.length !== selectedChannels.length) {
      if (selectedTabsChannels.every(tabChannel => selectedChannels.find(selectedChannel => selectedChannel.id === tabChannel.id))) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          selectAllChecked: true,
          selectAllIndeterminate: false
        });
      }
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

    let fixedOffset = offset;

    // Handle nested list offset
    if (fixedOffset > 0) {
      fixedOffset = tabs.length - 1;
    }

    this.props.loadTabs(fixedOffset, tabsSortBy, showHiddenChannels, canPost, excludeFeedChannels);
  }

  handleGetChannelList(offset) {
    const {
      selectedTab,
      selectedTabsChannels,
      channelsSortBy,
      showHiddenChannels,
      canPost,
      excludeFeedChannels,
      canShare
    } = this.props;

    // Fetch on initial load or it offset > 0
    if (selectedTab && selectedTab.id && (offset || !selectedTabsChannels.length)) {
      this.props.loadChannels(selectedTab.id, offset, channelsSortBy, showHiddenChannels, canPost, excludeFeedChannels, canShare);
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

      // Set "Select All" to indeterminate state if currently isSelected
      if (this.state.selectAllChecked) {
        this.setState({
          selectAllChecked: this.props.selectedChannels.length > 1,
          selectAllIndeterminate: item.props.isSelected && this.props.selectedChannels.length > 1
        });
      }
    } else {
      this.props.selectSingleChannel(item.props.id);
    }
  }

  handlePreventClick(event) {
    event.preventDefault();
  }

  handleSaveClick() {
    this.props.onSave(this.props.selectedChannels);
  }

  handleSelectAllChange(event) {
    const checked = event.target.checked;
    this.selectedChannelUpdate(this.props.selectedTabsChannels, checked);
    this.setState({
      selectAllChecked: checked,
      selectAllIndeterminate: false
    });
  }

  selectedChannelUpdate(channels, checked = true) {
    if (channels.length > 0) {
      if (this.props.toggleSelectedChannel) {
        channels.forEach(channel => {
          this.props.toggleSelectedChannel(channel.id, { isSelected: checked });
        });
      }
    }
  }

  render() {
    const { naming, authString, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { hasHiddenChannelToggle, hasPersonalContent } = userCapabilities;
    const {
      allowMultiple,
      isLocationHeader,

      tabs,
      tabsLoaded,
      tabsLoading,
      tabsComplete,

      selectedTab,
      selectedTabsChannels,
      selectedChannels,
      channelsLoading,
      onClose,

      tabsSortBy,
      channelsSortBy,
      showHiddenChannels,
      selectedChannelsForSearch,
      onClearAllSelectedChannels
    } = this.props;

    const styles = require('./ChannelPickerModalForSearch.less');
    const cx = classNames.bind(styles);
    const listWrapperClasses = cx({
      listWrapper: true,
      hideChevron: selectedTab,
      ieBody: this.props.isIE,
      loading: tabsLoading || channelsLoading,
      empty: selectedTab ? !selectedTabsChannels.length : !tabs.length
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, itemCount: selectedChannelsForSearch && selectedChannelsForSearch.length, selectedTabChannels: selectedTabsChannels && selectedTabsChannels.length });

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

    let channelListVisible = false;

    if (selectedTab) {
      paths.push({
        name: selectedTab.name,
        path: ''
      });
      channelListVisible = true;

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

    // Title String
    let titleString = allowMultiple ? strings.addChannels : strings.addChannel;
    if (selectedChannels.length) {
      titleString += ` (${strings.nItems})`;
    }

    return (
      <Modal
        id="channel-picker"
        escClosesModal
        isVisible={this.props.isVisible}
        headerChildren={
          <React.Fragment>
            <h3>{isLocationHeader ? strings.selectLocation : titleString}</h3>
          </React.Fragment>
        }
        headerClassName={styles.modalHeader}
        footerChildren={(
          <div>
            <Btn
              data-id="cancel"
              borderless
              alt
              large
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
              counter={this.props.selectedChannels.length}
            >
              {isLocationHeader ? strings.apply : strings.add}
            </Btn>
          </div>
        )}
        className={styles.ChannelPickerModal}
        bodyClassName={styles.body}
        onClose={onClose}
      >
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
          {isLocationHeader && selectedTab && <span className={styles.selectedChannelCountForTab}>{selectedTabsChannels.filter(channel => channel.isSelected).length}/{strings.selectedTabChannels}</span>}
        </div>
        {allowMultiple && channelListVisible && <div className={styles.selectAllWrapper}>
          <Checkbox
            inputId="channel-picker-select-all"
            name="channel-picker-select-all"
            label={strings.selectAll}
            checked={this.state.selectAllChecked}
            indeterminateValue={this.state.selectAllIndeterminate}
            onChange={this.handleSelectAllChange}
            disabled={selectedTab.channelsLoading || !selectedTabsChannels.length}
          />
        </div>}
        {!selectedTab && isLocationHeader && <div className={styles.headerActions}>
          <Btn
            borderless
            onClick={onClearAllSelectedChannels}
            style={{ 'marginRight': !selectedChannelsForSearch.length ? '1rem' : '0.5rem' }}
            disabled={!selectedChannelsForSearch.length}
          >
            {strings.clearAll}
          </Btn>
          </div>}
        <div className={listWrapperClasses}>
          {!selectedTab && <TriggerList
            list={tabList}
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
              nestedList: true,
              emptyHeading: strings.tabsEmptyHeading,
              emptyMessage: strings.tabsEmptyMessage,
              onItemClick: this.handleTabClick,
              itemClassName: styles.item,
              className: styles.listHeader
            }}
          />}
          {selectedTab && <TriggerList
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
              itemProps: { showCheckbox: true },
              emptyHeading: strings.channelsEmptyHeading,
              emptyMessage: strings.channelsEmptyMessage,
              onItemClick: this.handleChannelClick,
              itemClassName: styles.channelItem
            }}
          />}
        </div>
      </Modal>
    );
  }
}
