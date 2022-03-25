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

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadTabs,
  loadChannels,
  loadStories,
  loadFiles,
  reset,
  selectSingleTab,
  selectSingleChannel,
  selectSingleStory,
  selectSingleFile,
  toggleSelectedFile
} from 'redux/modules/browser';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import TriggerList from 'components/TriggerList/TriggerList';

const messages = defineMessages({
  addFiles: { id: 'add-files', defaultMessage: 'Add Files' },
  addFile: { id: 'add-file', defaultMessage: 'Add File' },
  nItems: { id: 'n-items', defaultMessage: '{itemCount, plural, one {# item} other {# items}}' },
  selectAll: { id: 'select-all', defaultMessage: 'Select All' },

  content: { id: 'content', defaultMessage: 'Content' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  add: { id: 'add', defaultMessage: 'Add' },
  update: { id: 'update', defaultMessage: 'Update' },
  remove: { id: 'remove', defaultMessage: 'Remove' },

  tabsEmptyHeading: { id: 'tabs', defaultMessage: '{tabs}' },
  tabsEmptyMessage: { id: 'no-tabs-available', defaultMessage: 'No {tabs} available' },

  channelsEmptyHeading: { id: 'channels', defaultMessage: '{channels}' },
  channelsEmptyMessage: { id: 'no-channels-available', defaultMessage: 'No {channels} available' },

  storiesEmptyHeading: { id: 'stories', defaultMessage: '{stories}' },
  storiesEmptyMessage: { id: 'no-stories-available', defaultMessage: 'No {stories} available' },

  filesEmptyHeading: { id: 'files', defaultMessage: 'Files' },
  filesEmptyMessage: { id: 'no-files-available', defaultMessage: 'No Files available' },
});

function mapStateToProps(state, ownProps) {
  const { browser, entities, settings, story, share } = state;

  const availableTabs = browser.tabs.map(id => browser.tabsById[id]);
  const selectedTab = availableTabs.find(t => t.isSelected);

  // Ignore blocked files
  let defaultShareFiles = share.files.filter(file => file.shareStatus !== 'blocked');

  // Filter ignored categories
  if (ownProps.ignoreCategories && ownProps.ignoreCategories.length) {
    defaultShareFiles = defaultShareFiles.filter(file => (ownProps.ignoreCategories.indexOf(file.category) === -1));
  }

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
  let selectedStory;
  if (selectedChannel && selectedChannel.stories) {
    selectedChannelsStories = selectedChannel.stories.map(id => browser.storiesById[id]);

    // Filter Stories with no files
    selectedChannelsStories = selectedChannelsStories.filter(function(s) {
      return s.fileCount;
    });

    selectedStory = selectedChannelsStories.find(s => s.isSelected);
  }

  // Selected Story's Files
  let selectedStoriesFiles = [];
  if (selectedStory && selectedStory.files) {
    selectedStoriesFiles = selectedStory.files.map(id => browser.filesById[id]);

    // Filter ignored categories
    if (ownProps.ignoreCategories && ownProps.ignoreCategories.length) {
      selectedStoriesFiles = selectedStoriesFiles.filter(function(f) {
        return ownProps.ignoreCategories.indexOf(f.category) === -1;
      });
    }
  }

  // All Selected Files
  const selectedFiles = [];
  for (const key in browser.filesById) {  // eslint-disable-line
    if (browser.filesById[key].isSelected) {
      selectedFiles.push(browser.filesById[key]);
    }
  }

  // Is the current list empty?
  let currentListEmpty = false;
  if (selectedStory && !selectedStoriesFiles.length) {
    currentListEmpty = true;
  } else if (selectedChannel && !selectedChannelsStories.length) {
    currentListEmpty = true;
  } else if (selectedTab && !selectedTabsChannels.length) {
    currentListEmpty = true;
  } else if (!browser.tabs.length) {
    currentListEmpty = true;
  }

  // Detect IE10/11 for flex bug workaround
  const isIE = settings.platform.name === 'IE';

  // Breadcrumb selected by default
  const tab = entities.tabs[story.tab];

  // Reference to Primary Channel
  const channels = story.channels.map(id => story.channelsById[id]);  // using story channels for 'alias'
  const primaryChannel = channels.filter(c => !c.alias)[0];

  return {
    ...browser,
    tab: tab,
    channel: primaryChannel,
    story: story,

    tabs: availableTabs,
    selectedTab: selectedTab,
    selectedChannel: selectedChannel,
    selectedStory: selectedStory,
    defaultShareFiles: defaultShareFiles,
    selectedTabsChannels: selectedTabsChannels,
    selectedChannelsStories: selectedChannelsStories,
    selectedStoriesFiles: selectedStoriesFiles,
    selectedFiles: selectedFiles,
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
    loadFiles,
    reset,
    selectSingleTab,
    selectSingleChannel,
    selectSingleStory,
    selectSingleFile,
    toggleSelectedFile
  })
)
export default class FilePickerModal extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,

    // Pre-selected directories
    tab: PropTypes.object,
    channel: PropTypes.object,
    story: PropTypes.object,

    tabs: PropTypes.array,
    selectedTab: PropTypes.object,
    selectedChannel: PropTypes.object,
    selectedStory: PropTypes.object,

    selectedTabsChannels: PropTypes.array,
    selectedChannelsStories: PropTypes.array,
    selectedStoriesFiles: PropTypes.array,
    selectedFiles: PropTypes.array,

    /** allow more than 1 file to be selected, displays "select all" option */
    allowMultiple: PropTypes.bool,

    /** file categories to ignore */
    ignoreCategories: PropTypes.array,

    /** sets `can_post` on /content/tabs & /content/channels API */
    canPost: PropTypes.bool,

    /** sets `canShare` on /content/tabs, /content/channels, /content/stories & /content/files API */
    canShare: PropTypes.bool,

    /** automatically select a mandatory file if any sibling is selected */
    autoSelectMandatory: PropTypes.bool,

    /** passes prop to FileItem, only displays mandatory status */
    showShareStatus: PropTypes.bool,

    /** Set the confirm button text - defaults to "Update" */
    confirmButtonText: PropTypes.string,

    /** applies flexbox style fix */
    isIE: PropTypes.bool,

    loadTabs: PropTypes.func,
    loadChannels: PropTypes.func,
    loadStories: PropTypes.func,
    loadFiles: PropTypes.func,
    reset: PropTypes.func,
    selectSingleTab: PropTypes.func,
    selectSingleChannel: PropTypes.func,
    selectSingleStory: PropTypes.func,
    selectSingleFile: PropTypes.func,
    toggleSelectedFile: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      preSelectInitialState: false,
      selectAllChecked: false,
      selectAllIndeterminate: false
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Reset Select All checkbox when another story is opened
    if (nextProps.selectedStory && !this.props.selectedStory) {
      let totalSelected = 0;
      if (nextProps.selectedFiles && nextProps.selectedFiles.length >= nextProps.selectedStoriesFiles.length) {
        for (const obj of nextProps.selectedStoriesFiles) {
          if (nextProps.selectedStory && nextProps.selectedStory.permId === obj.permId &&
            nextProps.selectedFiles.find(item => item.id === obj.id)) {
            totalSelected += 1;
          }
        }
      }

      this.setState({
        preSelectInitialState: false,
        selectAllChecked: nextProps.selectedStoriesFiles.length > 0 && totalSelected === nextProps.selectedStoriesFiles.length,
        selectAllIndeterminate: nextProps.selectedStoriesFiles.length > 0 && totalSelected < nextProps.selectedStoriesFiles.length
      });
    }

    // Pre select Tab - Channel -Story
    if (nextProps.tabsLoaded && nextProps.tabsLoaded !== this.props.tabsLoaded) {
      if (this.props.tab) this.props.selectSingleTab(parseInt(this.props.tab.id, 10));
    }
    if (nextProps.selectedTab && nextProps.selectedTab.channelsLoaded && this.props.selectedTab && (!this.props.selectedTab.channelsLoaded || nextProps.selectedTab.channelsLoaded !== this.props.selectedTab.channelsLoaded)) {
      if (this.props.channel) this.props.selectSingleChannel(parseInt(this.props.channel.id, 10));
    }
    if (!this.state.preSelectInitialState && nextProps.selectedChannel && nextProps.selectedChannel.storiesLoaded && (!this.props.selectedChannel || nextProps.selectedChannel.storiesLoaded !== this.props.selectedChannel.storiesLoaded)) {
      this.props.selectSingleStory(parseInt(nextProps.story.id, 10));
      this.setState({ preSelectInitialState: true });
    }

    //update file isSelected
    if ((this.props.isLoading && !nextProps.isLoading) || (!this.props.isVisible && nextProps.isVisible)) {
      if (nextProps.selectedStoriesFiles.length > 0) {
        let selectedStoryFiles = [];
        let nonSelectedStoryFiles = [];

        nextProps.selectedStoriesFiles.forEach(storiesFile => {
          if (nextProps.defaultShareFiles.find(shareFile => shareFile.id === storiesFile.id)) {
            selectedStoryFiles = selectedStoryFiles.concat(storiesFile);
          } else {
            nonSelectedStoryFiles = nonSelectedStoryFiles.concat(storiesFile);
          }
        });
        this.selectedFileUpdate(selectedStoryFiles);
        this.selectedFileUpdate(nonSelectedStoryFiles, false);
      }
    }

    if (this.props.selectedFiles.length !== nextProps.selectedFiles.length) {
      if (nextProps.selectedStoriesFiles.every(storyFile => nextProps.selectedFiles.find(selectedFile => selectedFile.id === storyFile.id))) {
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
      excludeFeedChannels,
      canShare
    } = this.props;

    // Fetch on initial load or if offset > 0
    if (offset || tabs.length <= 1) {
      this.props.loadTabs(offset, tabsSortBy, showHiddenChannels, canPost, excludeFeedChannels, canShare);
    }
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

  handleGetFileList(offset) {
    const {
      selectedStory,
      selectedStoriesFiles,
      canShare,
    } = this.props;

    // Fetch on initial load or it offset > 0
    if (selectedStory && selectedStory.permId && (offset || !selectedStoriesFiles.length)) {
      this.props.loadFiles(selectedStory.permId, offset, canShare);
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

  handleSelectAllChange(event) {
    const checked = event.target.checked;
    this.selectedFileUpdate(this.props.selectedStoriesFiles, checked);
    this.setState({
      selectAllChecked: checked,
      selectAllIndeterminate: false
    });
  }

  selectedFileUpdate(files, checked = true) {
    if (files.length > 0) {
      const validFiles = files.filter((file) => file.shareStatus !== 'blocked');
      const { permId } = this.props;
      if (this.props.toggleSelectedFile && validFiles.length > 0) {
        validFiles.forEach(file => {
          const isMandatory = permId && file.shareStatus === 'mandatory' && file.permId && (file.permId === permId);
          this.props.toggleSelectedFile(file.id, {
            isSelected: isMandatory ? true : checked,
            disabled: isMandatory
          });
        });
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
    this.props.selectSingleStory(item.props.id);
  }

  handleFileClick(event, context) {
    const id = context.props.id;
    event.preventDefault();

    if (this.props.allowMultiple) {
      if (this.props.autoSelectMandatory) {
        const fileSelected = this.props.selectedStoriesFiles.find(file => file.id === id);
        // Select a file
        if (!fileSelected.isSelected || fileSelected.shareStatus === 'optional' || fileSelected.permId !== this.props.permId) {
          this.props.toggleSelectedFile(id);
        // Unselected - Verify whether it's a mandatory and no optional file isSelected
        }
      // mandatory files are not required
      } else {
        this.props.toggleSelectedFile(id);
      }
      // Set "Select All" to indeterminate state if currently isSelected
      if (this.state.selectAllChecked) {
        this.setState({
          selectAllChecked: this.props.selectedFiles.length > 1,
          selectAllIndeterminate: context.props.isSelected && this.props.selectedFiles.length > 1
        });
      }
    } else {
      this.props.selectSingleFile(id);
    }
  }

  handleSaveClick(event) {
    this.props.onSave(event, this.props.selectedFiles);
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const {
      isLoading,
      currentListEmpty,
      allowMultiple,
      selectedFiles,

      tabs,
      tabsLoaded,
      tabsLoading,
      tabsComplete,

      selectedTab,
      selectedChannel,
      selectedStory,
      selectedTabsChannels,
      selectedChannelsStories,
      selectedStoriesFiles,
      onClose
    } = this.props;
    const styles = require('./FilePickerModal.less');
    const cx = classNames.bind(styles);
    const listWrapperClasses = cx({
      listWrapper: true,
      ieBody: this.props.isIE,
      loading: isLoading,
      empty: currentListEmpty
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, itemCount: selectedFiles.length });

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

    let fileListVisible = false;
    if (selectedTab && selectedChannel && selectedStory) {
      fileListVisible = true;
      paths.push({
        name: selectedStory.name,
        path: ''
      });
    }

    // Title String
    let titleString = allowMultiple ? strings.addFiles : strings.addFile;
    if (selectedFiles.length) {
      titleString += ` (${strings.nItems})`;
    }

    const fixedselectedChannelsStories = [];
    // Set fileCount to Story note prop
    if (selectedChannelsStories) {
      selectedChannelsStories.forEach(function(c) {
        fixedselectedChannelsStories.push({
          ...c,
          note: (  // eslint-disable-line
            <FormattedMessage
              id="n-files"
              defaultMessage="{itemCount} Files"
              values={{ itemCount: c.fileCount }}
            />
          )
        });
      });
    }

    return (
      <Modal
        id="file-picker"
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
              disabled={!selectedTabsChannels.length}
              onClick={this.handleSaveClick}
            >
              {this.props.confirmButtonText || strings.update}
            </Btn>
          </div>
        )}
        className={styles.FilePickerModal}
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
        {allowMultiple && fileListVisible && <div className={styles.selectAllWrapper}>
          <Checkbox
            inputId="file-picker-select-all"
            name="file-picker-select-all"
            label={strings.selectAll}
            checked={this.state.selectAllChecked}
            indeterminateValue={this.state.selectAllIndeterminate}
            onChange={this.handleSelectAllChange}
            disabled={selectedStory.filesLoading || !selectedStoriesFiles.length}
          />
        </div>}
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
          {selectedTab && selectedChannel && !selectedStory && <TriggerList
            list={fixedselectedChannelsStories}
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
              emptyHeading: strings.storiesEmptyHeading,
              emptyMessage: strings.storiesEmptyMessage,
              onItemClick: this.handleStoryClick,
              itemClassName: styles.item
            }}
          />}
          {fileListVisible && <TriggerList
            list={selectedStoriesFiles}
            isLoaded={selectedStory.filesLoaded}
            isLoading={selectedStory.filesLoading}
            isLoadingMore={selectedStory.filesLoading && selectedStoriesFiles.length > 0}
            isComplete={selectedStory.filesComplete}
            onGetList={this.handleGetFileList}
            listProps={{
              error: selectedStory.filesError,
              noLink: true,
              showThumb: false,
              thumbSize: 'small',
              itemProps: {
                showCheckbox: true,
                hideMeta: true,
                showShareStatus: this.props.showShareStatus
              },
              emptyHeading: strings.filesEmptyHeading,
              emptyMessage: strings.filesEmptyMessage,
              onItemClick: this.handleFileClick,
              className: styles.fileList,
              itemClassName: styles.item
            }}
          />}
        </div>
      </Modal>
    );
  }
}
