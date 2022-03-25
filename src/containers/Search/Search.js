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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */
import moment from 'moment-timezone';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';
import get from 'lodash/get';
import unionBy from 'lodash/unionBy';
import SearchList from 'components/SearchList/SearchList';
import Btn from 'components/Btn/Btn';
import take from 'lodash/take';
import SearchTagItem from 'components/SearchTagItem/SearchTagItem';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

import Text from 'components/Text/Text';
import Select from 'components/Select/Select';
import SelectItemWithImage from 'components/Select/SelectItemWithImage';
import ChannelPickerModalForSearch from 'components/ChannelPickerModalForSearch/ChannelPickerModalForSearch';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';
import Loader from 'components/Loader/Loader';
import FileDetailsModal from 'components/FileDetailsModal/FileDetailsModal';

import {
  searchFiles,
  searchStories,
  clearResults,
  setFilter,
  setInteraction,
  deleteBookmark,
  addBookmark
} from 'redux/modules/supersearch';

import { setData as setShareData } from 'redux/modules/share';

import {
  loadOpenFile,
  loadFile,
  toggleDock,
  setActiveFile
} from 'redux/modules/viewer';

import {
  setReferrerPath as setStoryReferrerPath
} from 'redux/modules/story/story';

import {
  addTag,
  addTagToFile,
  removeTagToFile,
  searchTags,
} from 'redux/modules/tag';

import { createPrompt } from 'redux/modules/prompts';
import isEqual from 'lodash/isEqual';


const DEFAULT_TYPE = 'files';

const MAX_FILE_SIZE = 2147483647;

const MIN_SEARCH_CHAR_LENGTH = 2;

const messages = defineMessages({
  emptyHeading: { id: 'no-results', defaultMessage: 'No Results', },
  emptyMessage: { id: 'search-empty-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
  letsSearch: { id: 'let-s-search', defaultMessage: 'Let\'s search!' },

  tabs: { id: 'tabs', defaultMessage: '{tabs}' },
  channels: { id: 'channels', defaultMessage: '{channels}' },
  tags: { id: 'tags', defaultMessage: 'Tags' },
  fileFormat: { id: 'file-format', defaultMessage: 'File format' },
  created: { id: 'created', defaultMessage: 'Created' },

  search: { id: 'search', defaultMessage: 'Search' },
  add: { id: 'add', defaultMessage: 'Add' },
  close: { id: 'close', defaultMessage: 'Close' },
  all: { id: 'all', defaultMessage: 'All' },
  stories: { id: 'stories', defaultMessage: '{stories}' },
  files: { id: 'files', defaultMessage: 'Files' },
  people: { id: 'people', defaultMessage: 'People' },
  feeds: { id: 'feeds', defaultMessage: 'Feeds' },
  meetings: { id: 'meetings', defaultMessage: 'Meetings' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  notes: { id: 'notes', defaultMessage: 'Notes' },

  title: { id: 'title', defaultMessage: 'Title' },
  description: { id: 'description', defaultMessage: 'Description' },
  filename: { id: 'filename', defaultMessage: 'Filename' },
  content: { id: 'content', defaultMessage: 'Content' },
  extension: { id: 'extension', defaultMessage: 'Extension' },
  author: { id: 'author', defaultMessage: 'Author' },
  comment: { id: 'comment', defaultMessage: 'Comment' },
  user: { id: 'user', defaultMessage: 'User' },
  tag: { id: 'tag', defaultMessage: 'Tag' },
  noRelatedTags: { id: 'no-related-tags', defaultMessage: 'No Related Tags' },
  tagSearches: { id: 'tag-searches', 'defaultMessage': 'Tag Searches' },
  noResults: { id: 'no-results', 'defaultMessage': 'No Results' },
  switchSearch: { id: 'switch-search', 'defaultMessage': 'Do you want to switch to keywords search instead?' },

  fileTypes: { id: 'file-types', defaultMessage: 'File Types' },
  fileSize: { id: 'file-size-search', defaultMessage: 'File Size' },
  datePickerPlaceholder: { id: 'date-picker-placeholder', defaultMessage: 'Select Date' },

  dateModifiedFrom: { id: 'date-modified-from', defaultMessage: 'Date Modified From' },
  dateModifiedTo: { id: 'date-modified-to', defaultMessage: 'Date Modified To' },

  SearchingIn: { id: 'searching-in', defaultMessage: 'Searching In' },

  sort: { id: 'sort', defaultMessage: 'Sort' },

  allChannels: { id: 'all-channels', defaultMessage: 'All {channels}' },
  oneChannel: { id: 'one-channel', defaultMessage: '{channel}' },
  multipleChannels: { id: 'multiple-channels', defaultMessage: '{channels}' },

  searchWithIn: { id: 'search-within', defaultMessage: 'Search Within' },

  invalidFromDateSelectionForSearch: { id: 'invalid-from-date-selection-for-search', defaultMessage: 'Date modified from must be less than or equal to Date modified to' },
  invalidToDateSelectionForSearch: { id: 'invalid-to-date-selection-for-search', defaultMessage: 'Date modified to must be greater than or equal to Date modified from' },

  matching: { id: 'matching', defaultMessage: 'matching' },

  // File details modal
  fileDetails: { id: 'file-details', defaultMessage: 'File Details' },
  customMetadata: { id: 'custom-metadata', defaultMessage: 'Custom Metadata' },
  customisableLabel: { id: 'customisable-label', defaultMessage: 'Customisable Label' },
  expiry: { id: 'expiry', defaultMessage: 'Expiry' },
  shareStatus: { id: 'share-status', defaultMessage: 'Share Status' },
  optional: { id: 'optional', defaultMessage: 'Optional' },
  blocked: { id: 'blocked', defaultMessage: 'Blocked' },
  mandatory: { id: 'mandatory', defaultMessage: 'Mandatory' },
  fileType: { id: 'file-type', defaultMessage: 'File Type' },
  dateAdded: { id: 'date-added', defaultMessage: 'Date Added' },
  dateModified: { id: 'date-modified', defaultMessage: 'Date Modified' },
  tagDescription: { id: 'add-tag-description', defaultMessage: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.' },
  newTag: { id: 'new-tag', defaultMessage: 'New tag' },
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
});

function mapStateToProps(state) {
  const { tag, supersearch, viewer, entities, settings } = state;
  return {
    entities,
    ...viewer,
    tags: tag.allTags,
    fileTag: tag,
    fileSettings: settings.fileSettings,
    ...supersearch,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    searchFiles,
    searchStories,
    clearResults,
    loadFile,
    loadOpenFile,
    toggleDock,
    setActiveFile,
    setFilter,
    setInteraction,
    createPrompt,
    setStoryReferrerPath,
    addBookmark,
    deleteBookmark,
    setShareData,

    addTag,
    addTagToFile,
    removeTagToFile,
    searchTags,
  })
)
export default class Search extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // Set searchValue from query
    const { query } = props.location;
    const keyword = query.keyword ? query.keyword : '';
    const reftype = query.refType ? query.refType : '';

    this.state = {
      searchValue: reftype === 'tag' ? `tags:${keyword}` : keyword,

      selectedFileSize: props.selectedFileSize,
      selectedFileCategory: props.selectedFileCategory,

      dateAddedFromForFile: props.dateAddedFromForFile,
      dateAddedToForFile: props.dateAddedToForFile,

      dateModifiedFromForStory: props.dateModifiedFromForStory,
      dateModifiedToForStory: props.dateModifiedToForStory,

      channelPickerModalVisible: false,
      selectedChannelsForFileSearch: props.selectedChannelsForFileSearch,
      selectedChannelsForStorySearch: props.selectedChannelsForStorySearch,

      selectedSortAttributeForFile: props.selectedSortAttributeForFile,
      selectedSortAttributeForStory: props.selectedSortAttributeForStory,

      selectedSearchWithinAttributeForFile: props.selectedSearchWithinAttributeForFile,
      selectedSearchWithinAttributeForStory: props.selectedSearchWithinAttributeForStory,

      showFileDetailsModel: false,
    };
    autobind(this);
    // refs
    this.keywordInput = null;

    this.timer = null;
  }

  componentDidMount() {
    const { hasSearch } = this.context.settings.userCapabilities;
    const {
      files,
      stories
    } = this.props;
    const { query } = this.props.location;
    const type = query.type ? query.type : DEFAULT_TYPE;
    const results = type === 'stories' ? stories : files;

    if (hasSearch && !results.length) {
      this.handleSearch();
      this.keywordInput.focus();
      this.keywordInput.text.selectionStart = this.keywordInput.text.selectionEnd = this.keywordInput.text.value.length;  // eslint-disable-line
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Update current file details
    const { files } = nextProps;
    const { selectedFile } = this.state;

    if (selectedFile) {
      const nextActiveFile = files.find(file => selectedFile.id === file.id);
      const currentActiveFile = this.props.files.find(file => selectedFile.id === file.id);

      if (!isEqual(nextActiveFile, currentActiveFile) || (!isEqual(nextActiveFile.tags, currentActiveFile.tags))) {
        this.setState({
          selectedFile: nextActiveFile
        });
      }
    }
  }

  searchTag() {
    let searchValue = this.state.searchValue;
    if (searchValue) {
      searchValue = searchValue.replace(/tags:/g, ''); // just need to make sure tags special keywords is exclude
      if (searchValue.length > 0) {
        this.props.searchTags({
          keyword: searchValue
        });
      }
    }
  }

  handleCloseClick(event) {
    event.preventDefault();
    this.props.history.push(this.props.referrerPath);
    this.props.clearResults();
  }

  handleKeywordChange(event) {
    const value = event.currentTarget.value || '';

    this.setState({
      searchValue: value
    });

    const { query } = this.props.location;
    const type = query.type ? query.type : '';
    this.prepareQuery({ type, keyword: value });
  }

  handleSearch() {
    if (this.state.searchValue.length < MIN_SEARCH_CHAR_LENGTH || this.props.loading) {
      return;
    }

    const { query } = this.props.location;
    const type = query.type ? query.type : 'files';
    this.props.clearResults();

    if (type === 'files') {
      this.handleFileSearch();
    } else if (type === 'stories') {
      this.handleStorySearch();
    }
  }

  handleFileSearch() {
    if (this.state.searchValue.length < MIN_SEARCH_CHAR_LENGTH) {
      return;
    }
    const cloneQuery = {
      type: 'files',
      keyword: this.state.searchValue.trim(),
    };
    if (this.state.selectedFileCategory) {
      cloneQuery.category = this.state.selectedFileCategory.name.toLowerCase();
    }
    if (this.state.selectedFileSize) {
      cloneQuery.size = {
        'gte': this.state.selectedFileSize.lowerLimit * 1048576, // 1MB = 1,048,576 in bytes
        'lte': (this.state.selectedFileSize.upperLimit * 1048576) > MAX_FILE_SIZE ? MAX_FILE_SIZE : this.state.selectedFileSize.upperLimit * 1048576
      };
    }
    if (this.state.selectedChannelsForFileSearch) {
      const channelQuery = this.state.selectedChannelsForFileSearch.map(({ id }) => `channel.id:${id}`).join(' || ');
      cloneQuery.keyword += `(${channelQuery})`;
    } else {
      cloneQuery.showHidden = false;
    }
    if (this.state.dateAddedFromForFile || this.state.dateAddedToForFile) {
      cloneQuery.createdDate = {
        'gte': this.state.dateAddedFromForFile !== null ? moment(this.state.dateAddedFromForFile).set({ hour: 0, minute: 0, second: 0 }).format() : moment(new Date(1900, 0, 1)).set({ hour: 0, minute: 0, second: 0 }).format(),
        'lte': this.state.dateAddedToForFile !== null ? moment(this.state.dateAddedToForFile).set({ hour: 23, minute: 59, second: 59 }).format() : moment().set({ hour: 23, minute: 59, second: 59 }).format()
      };
    }
    if (this.state.selectedSortAttributeForFile) {
      cloneQuery.sortBy = {
        sort: this.state.selectedSortAttributeForFile.value,
        order: this.state.selectedSortAttributeForFile.order
      };
    }
    if (this.state.selectedSearchWithinAttributeForFile) {
      cloneQuery.keyword = `${this.state.selectedSearchWithinAttributeForFile.value}:${cloneQuery.keyword}`;
    }
    this.props.searchFiles({ ...cloneQuery, offset: 0 });
  }

  handleStorySearch() {
    if (this.state.searchValue.length < MIN_SEARCH_CHAR_LENGTH || this.props.loading) {
      return;
    }
    const cloneQuery = {
      type: 'stories',
      keyword: this.state.searchValue.trim(),
    };
    if (this.state.dateModifiedFromForStory || this.state.dateModifiedToForStory) {
      cloneQuery.ModifiedDate = {
        'gte': this.state.dateModifiedFromForStory !== null ? moment(this.state.dateModifiedFromForStory).set({ hour: 0, minute: 0, second: 0 }).format() : moment(new Date(1900, 0, 1)).set({ hour: 0, minute: 0, second: 0 }).format(),
        'lte': this.state.dateModifiedToForStory !== null ? moment(this.state.dateModifiedToForStory).set({ hour: 23, minute: 59, second: 59 }).format() : moment().set({ hour: 23, minute: 59, second: 59 }).format()
      };
    }
    if (this.state.selectedSortAttributeForStory) {
      cloneQuery.sortBy = {
        sort: this.state.selectedSortAttributeForStory.value,
        order: this.state.selectedSortAttributeForStory.order
      };
    }
    if (this.state.selectedChannelsForStorySearch) {
      const channelQuery = this.state.selectedChannelsForStorySearch.map(({ id }) => `channel.id:${id}`).join(' || ');
      cloneQuery.keyword += `(${channelQuery})`;
    } else {
      cloneQuery.showHidden = false;
    }
    if (this.state.selectedSearchWithinAttributeForStory) {
      cloneQuery.keyword = `${this.state.selectedSearchWithinAttributeForStory.value}:${cloneQuery.keyword}`;
    }
    if (!this.props.loading) this.props.searchStories({ ...cloneQuery, offset: 0 });
  }

  handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  handleLocationFilterClick() {
    this.setState({ channelPickerModalVisible: true });
  }

  handleChannelPickerCancel() {
    this.setState({ channelPickerModalVisible: false });
  }

  handleChannelPickerSave(type, selectedChannels) {
    const preStateSelectedChannels = type === 'file' ? (this.state.selectedChannelsForFileSearch || []) : (this.state.selectedChannelsForStorySearch || []);
    const nextStateSelectedChannels = unionBy(preStateSelectedChannels, selectedChannels, 'id');

    if (selectedChannels.length) {
      switch (type) {
        case 'file':
          this.setState({
            selectedChannelsForFileSearch: nextStateSelectedChannels,
            channelPickerModalVisible: false
          }, () => {
            this.handleFileSearch();
            this.props.setFilter(
              'selectedChannelsForFileSearch',
              this.state.selectedChannelsForFileSearch
            );
          });
          break;
        case 'story':
          this.setState({
            selectedChannelsForStorySearch: nextStateSelectedChannels,
            channelPickerModalVisible: false
          }, () => {
            this.handleStorySearch();
            this.props.setFilter(
              'selectedChannelsForStorySearch',
              this.state.selectedChannelsForStorySearch
            );
          });
          break;
        default:
          break;
      }
    }
  }

  prepareQuery(data) {
    const { query, pathname } = this.props.location;
    const newQuery = {};
    newQuery.type = data.type || DEFAULT_TYPE;
    newQuery.keyword = data.keyword || query.keyword;
    this.props.history.replace({
      pathname: pathname,
      query: newQuery,
      state: {
        modal: true
      }
    });
    return newQuery;
  }

  loadFileAndOpen(context) {
    const { id, category, downloadUrl } = context.props;
    if (this.props.isDocked) {
      this.props.toggleDock();
    }
    // load file because search result payload has not data enough to get from cache.
    if (category === 'web' || category === 'pdf' && !downloadUrl) {
      this.props.loadOpenFile(id);
    } else {
      this.props.loadFile(id);
    }
  }

  handleItemClicked(event, context) {
    event.preventDefault();
    const type = context.props.type;

    // Tracking search interaction
    this.props.setInteraction({
      searchDataId: type === 'file' ? this.props.searchDataFileId :  this.props.searchDataStoryId,
      resultOpenedId: context.props.id
    });

    switch (type) {
      case 'file':
        this.loadFileAndOpen(context);
        break;
      case 'story':
        this.props.onStoryClick(event, context);
        break;
      default:
        break;
    }
  }

  handleTagClick(tag) {
    this.setState({
      searchValue: `tags:${tag.name}`
    }, () => {
      this.handleSearch();
    });
  }

  handleTypeClick(event) {
    const {
      stories,
      files
    } = this.props;
    const newType = event.currentTarget.dataset.type;
    this.prepareQuery({ type: newType, keyword: this.state.searchValue });
    const results = newType === 'stories' ? stories : files;

    if (!results.length) {
      switch (newType) {
        case 'stories':
          this.handleStorySearch();
          break;
        case 'files':
          this.handleFileSearch();
          break;
        default:
          break;
      }
    }
  }

  renderTagsResults(styles, strings) {
    const {
      tags
    } = this.props;
    if (tags.length === 0) {
      return (<div className={styles.noTag}>
        <span className={styles.tagIcon} />
        <span className={styles.noRelatedTags}>{strings.noRelatedTags}</span>
      </div>);
    }
    return take(tags, 10).map((tag) => <SearchTagItem {...tag} key={tag.id} onClick={this.handleTagClick} />);
  }

  handleFileTypePick(data) {
    this.setState({
      selectedFileCategory: data
    }, () => {
      this.handleFileSearch();
      this.props.setFilter(
        'selectedFileCategory',
        this.state.selectedFileCategory
      );
    });
  }

  handleFileSizePick(value) {
    this.setState({
      selectedFileSize: value,
    }, () => {
      this.handleFileSearch();
      this.props.setFilter(
        'selectedFileSize',
        this.state.selectedFileSize
      );
    });
  }

  handleChannelSelectionClear(type) {
    switch (type) {
      case 'file':
        this.setState({
          selectedChannelsForFileSearch: null
        }, () => {
          this.handleFileSearch();
          this.props.setFilter('selectedChannelsForFileSearch', this.state.selectedChannelsForFileSearch);
        });
        break;
      case 'story':
        this.setState({
          selectedChannelsForStorySearch: null
        }, () => {
          this.handleStorySearch();
          this.props.setFilter('selectedChannelsForStorySearch', this.state.selectedChannelsForStorySearch);
        });
        break;
      default:
        break;
    }
  }

  handleDateAddedFromChange(dateAddedFromForFile) {
    if (this.handleDateValidation('DateAddedFrom', dateAddedFromForFile)) {
      this.setState({
        dateAddedFromForFile
      }, () => {
        this.handleFileSearch();
        this.props.setFilter('dateAddedFromForFile', this.state.dateAddedFromForFile);
      });
    }
  }

  handleDateModifiedFromChange(dateModifiedFromForStory) {
    if (this.handleDateValidation('DateModifiedFrom', dateModifiedFromForStory)) {
      this.setState({
        dateModifiedFromForStory
      }, () => {
        this.handleStorySearch();
        this.props.setFilter('dateModifiedFromForStory', this.state.dateModifiedFromForStory);
      });
    }
  }

  handleDateAddedToChange(dateAddedToForFile) {
    if (this.handleDateValidation('DateAddedTo', dateAddedToForFile)) {
      this.setState({
        dateAddedToForFile
      }, () => {
        this.handleFileSearch();
        this.props.setFilter('dateAddedToForFile', this.state.dateAddedToForFile);
      });
    }
  }

  handleDateModifiedToChange(dateModifiedToForStory) {
    if (this.handleDateValidation('DateModifiedTo', dateModifiedToForStory)) {
      this.setState({
        dateModifiedToForStory
      }, () => {
        this.handleStorySearch();
        this.props.setFilter('dateModifiedToForStory', this.state.dateModifiedToForStory);
      });
    }
  }

  handleDateClear(dateType) {
    switch (dateType) {
      case 'modified_from':
        this.setState({
          dateModifiedFromForStory: null
        }, () => {
          this.handleStorySearch();
          this.props.setFilter('dateModifiedFromForStory', this.state.dateModifiedFromForStory);
        });
        break;
      case 'modified_to':
        this.setState({
          dateModifiedToForStory: null
        }, () => {
          this.handleStorySearch();
          this.props.setFilter('dateModifiedToForStory', this.state.dateModifiedToForStory);
        });
        break;
      case 'added_from':
        this.setState({
          dateAddedFromForFile: null
        }, () => {
          this.handleFileSearch();
          this.props.setFilter('dateAddedFromForFile', this.state.dateAddedFromForFile);
        });
        break;
      case 'added_to':
        this.setState({
          dateAddedToForFile: null
        }, () => {
          this.handleFileSearch();
          this.props.setFilter('dateAddedToForFile', this.state.dateAddedToForFile);
        });
        break;
      default:
        break;
    }
  }

  handleSortAttributeChange(type, value) {
    switch (type) {
      case 'file':
        this.setState({
          selectedSortAttributeForFile: value,
        }, () => {
          this.handleFileSearch();
          this.props.setFilter('selectedSortAttributeForFile', this.state.selectedSortAttributeForFile);
        });
        break;
      case 'story':
        this.setState({
          selectedSortAttributeForStory: value,
        }, () => {
          this.handleStorySearch();
          this.props.setFilter('selectedSortAttributeForStory', this.state.selectedSortAttributeForStory);
        });
        break;
      default:
        break;
    }
  }

  handleSearchWithInChange(type, value) {
    switch (type) {
      case 'file':
        this.setState({
          selectedSearchWithinAttributeForFile: value
        }, () => {
          this.handleFileSearch();
          this.props.setFilter('selectedSearchWithinAttributeForFile', this.state.selectedSearchWithinAttributeForFile);
        });
        break;
      case 'story':
        this.setState({
          selectedSearchWithinAttributeForStory: value
        }, () => {
          this.handleStorySearch();
          this.props.setFilter('selectedSearchWithinAttributeForStory', this.state.selectedSearchWithinAttributeForStory);
        });
        break;
      default:
        break;
    }
  }

  handleDateValidation(validationType, dateToValidate) {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;

    const strings = generateStrings(messages, formatMessage, { ...naming });

    let validationResult = true;

    if (validationType === 'DateAddedFrom' && this.state.dateAddedToForFile !== null && moment(dateToValidate).isAfter(this.state.dateAddedToForFile, 'day')) {
      validationResult = false;
      this.handleErrorPrompt(strings.invalidFromDateSelectionForSearch);
    } else if (validationType === 'DateAddedTo' && this.state.dateAddedFromForFile !== null && moment(dateToValidate).isBefore(this.state.dateAddedFromForFile, 'day')) {
      validationResult = false;
      this.handleErrorPrompt(strings.invalidToDateSelectionForSearch);
    } else if (validationType === 'DateModifiedFrom' && this.state.dateModifiedToForStory !== null && moment(dateToValidate).isAfter(this.state.dateModifiedToForStory, 'day')) {
      validationResult = false;
      this.handleErrorPrompt(strings.invalidFromDateSelectionForSearch);
    } else if (validationType === 'DateModifiedTo' && this.state.dateModifiedFromForStory !== null && moment(dateToValidate).isBefore(this.state.dateModifiedFromForStory, 'day')) {
      validationResult = false;
      this.handleErrorPrompt(strings.invalidToDateSelectionForSearch);
    }
    return validationResult;
  }

  handleErrorPrompt(errorMessage) {
    this.props.createPrompt({
      id: 'invalid-date-selection',
      type: 'warning',
      title: 'Warning',
      message: errorMessage,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleFileInfoClick(event, context) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      showFileDetailsModel: true,
      selectedFile: context.props
    });
  }

  // File TAGS
  handleTagChange(event) {
    const value = event.currentTarget.value;
    if (value) {
      this.props.searchTags({
        keyword: value,
        limit: 10,
        offset: 0
      });
    }
  }

  handleCreateTag(context) {
    this.props.addTag({
      name: context.name,
      fileId: context.fileId
    });
  }

  handleAddTagFile(context) {
    this.props.addTagToFile({
      fileId: context.fileId,
      tagId: context.tagId,
      tagName: context.tagName
    });
  }

  handleTagDelete(context) {
    this.props.removeTagToFile({
      fileId: context.fileId,
      tagId: context.tagId,
      tagName: context.tagName
    });
  }

  handleFileDetailsClose() {
    this.setState({ showFileDetailsModel: false });
  }

  handleBookmarkClick(event, { bookmarkId, id, description, permId, story, filename }, isBookmarkSelf) {
    event.preventDefault();
    event.stopPropagation();

    // Delete Bookmark
    if (isBookmarkSelf) {
      this.props.deleteBookmark(id, bookmarkId);

    // Add Bookmark
    } else if (!isBookmarkSelf) {
      this.props.addBookmark(id, description, [{
        story_perm_id: permId || get(story, 'permId', null),
        filename: filename
      }]);
    }
  }

  handleShareFile(event, files) {
    event.preventDefault();
    event.stopPropagation();
    this.props.setShareData({
      id: 0,
      isVisible: true,
      name: '',
      showMoreOptions: true, // go to advance share when enabled
      files: files,
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  handleDownloadClick(event, downloadUrl, authString) {
    event.preventDefault();
    event.stopPropagation();
    if (downloadUrl && authString) {
      const newWindow = window.open(`${downloadUrl}${authString}`);
      newWindow.opener = null;
    }
  }

  renderCustomComponentWithImage(rest) {
    return <SelectItemWithImage {...rest} selectedValue={this.state.selectedFileCategory && this.state.selectedFileCategory.name} />;
  }

  renderCustomComponentForFileSize(rest) {
    return <SelectItemWithImage {...rest} selectedValue={this.state.selectedFileSize && this.state.selectedFileSize.label} />;
  }

  renderCustomComponentForSorting(type, rest) {
    return <SelectItemWithImage {...rest} selectedValue={type === 'file' ? this.state.selectedSortAttributeForFile && this.state.selectedSortAttributeForFile.label : this.state.selectedSortAttributeForStory && this.state.selectedSortAttributeForStory.label} />;
  }

  renderCustomComponentForSearchWithIn(type, rest) {
    return <SelectItemWithImage {...rest} selectedValue={type === 'file' ? this.state.selectedSearchWithinAttributeForFile && this.state.selectedSearchWithinAttributeForFile.label : this.state.selectedSearchWithinAttributeForStory && this.state.selectedSearchWithinAttributeForStory.label} />;
  }

  handleSetStoryReferrerPath(referrerPath) {
    this.props.setStoryReferrerPath(referrerPath);
  }

  render() {
    const { naming, userCapabilities } = this.context.settings;
    const { canCreateCustomFileDetails, hasAliases, hasShare } = userCapabilities;

    const {
      stories,
      files,
      fileSettings,
      fileTag,
    } = this.props;
    const { formatMessage } = this.context.intl;
    const style = require('./Search.less');
    const strings = generateStrings(messages, formatMessage, { ...naming });
    const { query } = this.props.location;
    const type = query.type ? query.type : DEFAULT_TYPE;

    const results = type === 'stories' ? stories : files;
    const total = results.length;
    const canSearch = this.state.searchValue.trim().length >= MIN_SEARCH_CHAR_LENGTH;

    const totalChannelSelected = type === 'files' ? this.state.selectedChannelsForFileSearch && Object.keys(this.state.selectedChannelsForFileSearch).length : this.state.selectedChannelsForStorySearch && Object.keys(this.state.selectedChannelsForStorySearch).length;

    const cx = classNames.bind(style);
    const firstItem = cx({
      searchItem: true,
    });

    const searchItemBySort = cx({
      searchSelectItem: true,
      right: true
    });

    const marginRightAutoForFile = cx({
      searchSelectItem: true,
      marginRightAuto: true
    });

    const marginRightAutoForStory = cx({
      searchSelectItem: true,
      marginRightAuto: type === 'stories'
    });

    const fileTypeCategories = [
      // More popular file types on the top of list
      { name: 'PDF', id: 0, type: 'withImage' },
      { name: 'Powerpoint', id: 1, type: 'withImage', isSVG: true },
      { name: 'Video', id: 2, type: 'withImage' },
      { name: 'Audio', id: 3, type: 'withImage' },
      { name: 'Word', id: 4, type: 'withImage', isSVG: true },
      { name: 'Excel', id: 5, type: 'withImage', isSVG: true },

      { name: 'App', id: 6, type: 'withImage' },
      { name: 'CAD', id: 7, type: 'withImage', isSVG: true },
      { name: 'CSV', id: 8, type: 'withImage' },
      { name: 'eBook', id: 9, type: 'withImage' },
      { name: 'ePub', id: 10, type: 'withImage' },
      { name: 'Form', id: 11, type: 'withImage' },
      { name: 'iBooks', id: 12, type: 'withImage' },
      { name: 'Image', id: 13, type: 'withImage' },
      { name: 'Keynote', id: 14, type: 'withImage' },
      { name: 'Numbers', id: 15, type: 'withImage' },
      { name: 'Oomph', id: 16, type: 'withImage' },
      { name: 'Pages', id: 17, type: 'withImage' },
      { name: 'Prov', id: 18, type: 'withImage' },
      { name: 'RTF', id: 19, type: 'withImage' },
      { name: 'Scrollmotion', id: 20, type: 'withImage', isSVG: true },
      { name: 'Twixl', id: 21, type: 'withImage' },
      { name: 'TXT', id: 22, type: 'withImage' },
      { name: 'Vcard', id: 23, type: 'withImage' },
      { name: 'Visio', id: 24, type: 'withImage', isSVG: true },
      { name: 'Web', id: 25, type: 'withImage' },
      { name: 'Zip', id: 26, type: 'withImage' }
    ];
    const fileSizeCategories = [
      { label: 'Any', value: 0, lowerLimit: 0, upperLimit: 2048 },
      { label: '0 - 1 MB', value: 1, lowerLimit: 0, upperLimit: 1 },
      { label: '1 - 5 MB', value: 2, lowerLimit: 1, upperLimit: 5 },
      { label: '5 - 25 MB', value: 3, lowerLimit: 5, upperLimit: 25 },
      { label: '25 - 100 MB', value: 4, lowerLimit: 25, upperLimit: 100 },
      { label: '1 GB+', value: 5, lowerLimit: 1024, upperLimit: 2048 }
    ];
    const sortAttributesForFiles = [
      { label: 'Date Modified', value: 'created_at', order: 'desc' },
      { label: 'Title', value: 'description', order: 'asc' }
    ];
    const sortAttributesForStories = [
      { label: 'Date Modified', value: 'updated_at', order: 'desc' },
      { label: 'Title', value: 'title', order: 'asc' }
    ];

    const searchWithinCategoriesForFile = [
      { label: 'File Name', value: 'description' },
      { label: 'File Content', value: 'text' },
      { label: 'File Tags', value: 'tags' }
    ];

    const searchWithinCategoriesForStory = [
      { label: 'Story Title', value: 'title' },
      { label: 'Story Description', value: 'description' },
      { label: 'Story Tags', value: 'tags' }
    ];


    const { dateAddedFromForFile, dateAddedToForFile, dateModifiedFromForStory, dateModifiedToForStory, selectedChannelsForFileSearch, selectedChannelsForStorySearch } = this.state;

    return (
      <div className={style.Search}>
        <Helmet>
          <title>{strings.search}</title>
        </Helmet>
        <div className={style.searchClose + ' icon-close'} onClick={this.handleCloseClick}>
          {strings.close}
        </div>
        <div className={style.keywordWrap}>
          <Text
            id="keywordInput"
            ref={(c) => { this.keywordInput = c; }}
            icon="search"
            tabIndex={1}
            placeholder={strings.letsSearch}
            value={this.state.searchValue}
            onChange={this.handleKeywordChange}
            onKeyPress={this.handleSearchKeyPress}
            className={style.keywordInput}
          />
          <Btn
            inverted
            small
            onClick={this.handleSearch}
            className={style.searcBtn}
            disabled={!canSearch}
          >{strings.search}</Btn>
        </div>
        <div className={style.searchContainer}>
          <div className={style.searchItems}>
            <div className={firstItem}>
              <ul className={style.searchType}>
                <li
                  className={type === 'files' ? style.searchTypeActive : null}
                  onClick={type === 'files' ? null : this.handleTypeClick}
                  data-type="files"
                >
                  {strings.files}
                </li>
                <li
                  className={type === 'stories' ? style.searchTypeActive : null}
                  onClick={type === 'stories' ? null : this.handleTypeClick}
                  data-type="stories"
                >
                  {strings.stories}
                </li>
              </ul>
            </div>
            {type === 'files' && <div className={style.searchSelectItemDatePicker}>
              <h4>{strings.dateModifiedFrom}</h4>
              {dateAddedFromForFile && <span className={style.selectClearZone}><span className={style.selectClear} onClick={this.handleDateClear.bind(this, 'added_from')} /></span>}
              <DateTimePicker
                datetime={dateAddedFromForFile}
                tz={null}
                placeholder={strings.datePickerPlaceholder}
                max={new Date()}
                format="DD MMM YYYY"
                showTime={false}
                showTz={false}
                onChange={this.handleDateAddedFromChange}
              />
            </div>}
            {type === 'files' && <div className={style.searchSelectItemDatePicker}>
              <h4>{strings.dateModifiedTo}</h4>
              {dateAddedToForFile && <span className={style.selectClearZone}><span className={style.selectClear} onClick={this.handleDateClear.bind(this, 'added_to')} /></span>}
              <DateTimePicker
                datetime={dateAddedToForFile}
                tz={null}
                placeholder={strings.datePickerPlaceholder}
                max={new Date()}
                format="DD MMM YYYY"
                showTime={false}
                showTz={false}
                onChange={this.handleDateAddedToChange}
              />
            </div>}
            {type === 'stories' && <div className={style.searchSelectItemDatePicker}>
              <h4>{strings.dateModifiedFrom}</h4>
              {dateModifiedFromForStory && <span className={style.selectClearZone}><span className={style.selectClear} onClick={this.handleDateClear.bind(this, 'modified_from')} /></span>}
              <DateTimePicker
                datetime={dateModifiedFromForStory}
                tz={null}
                placeholder={strings.datePickerPlaceholder}
                max={new Date()}
                format="DD MMM YYYY"
                showTime={false}
                showTz={false}
                onChange={this.handleDateModifiedFromChange}
              />
            </div>}
            {type === 'stories' && <div className={`${style.searchSelectItemDatePicker} ${style.dateTimeMargin}`}>
              <h4>{strings.dateModifiedTo}</h4>
              {dateModifiedToForStory && <span className={style.selectClearZone}><span className={style.selectClear} onClick={this.handleDateClear.bind(this, 'modified_to')} /></span>}
              <DateTimePicker
                datetime={dateModifiedToForStory}
                tz={null}
                placeholder={strings.datePickerPlaceholder}
                max={new Date()}
                format="DD MMM YYYY"
                showTime={false}
                showTz={false}
                onChange={this.handleDateModifiedToChange}
              />
            </div>}
            <div className={style.searchItemByLocation}>
              <h4>{strings.SearchingIn}</h4>
              {type === 'files' && selectedChannelsForFileSearch && <span className={style.selectClear} onClick={this.handleChannelSelectionClear.bind(this, 'file')} />}
              {type === 'stories' && selectedChannelsForStorySearch && <span className={style.selectClear} onClick={this.handleChannelSelectionClear.bind(this, 'story')} />}
              <div className={style.searchItemLocation} onClick={this.handleLocationFilterClick}>
                <FormattedMessage
                  id="count-channel-selected"
                  defaultMessage="{total, plural, =null {{allChannels}} one {# {channel}} other {# {channels}}}"
                  values={{
                    total: totalChannelSelected,
                    allChannels: strings.allChannels,
                    channel: strings.oneChannel,
                    channels: strings.multipleChannels
                  }}
                />
              </div>
            </div>
            {/* Channel Picker Modal */}
            {this.state.channelPickerModalVisible && <ChannelPickerModalForSearch
              allowMultiple={hasAliases}
              isVisible
              canShare
              selectedChannelsForSearch={type === 'files' ? this.state.selectedChannelsForFileSearch : this.state.selectedChannelsForStorySearch}
              onClose={this.handleChannelPickerCancel}
              onSave={type === 'files' ? this.handleChannelPickerSave.bind(this, 'file') : this.handleChannelPickerSave.bind(this, 'story')}
            />}
            <div className={marginRightAutoForStory}>
              <Select
                id="search-within"
                name="search-within"
                label={strings.searchWithIn}
                value={type === 'files' ? this.state.selectedSearchWithinAttributeForFile : this.state.selectedSearchWithinAttributeForStory}
                options={type === 'files' ? searchWithinCategoriesForFile : searchWithinCategoriesForStory}
                placeholder="Everything"
                optionRenderer={type === 'files' ? this.renderCustomComponentForSearchWithIn.bind(this, 'file') : this.renderCustomComponentForSearchWithIn.bind(this, 'story')}
                optionHeight={45}
                onChange={type === 'files' ? this.handleSearchWithInChange.bind(this, 'file') : this.handleSearchWithInChange.bind(this, 'story')}
              />
            </div>
            {type === 'files' && <div className={style.searchSelectItem}>
              <Select
                id="fileType"
                name="fileType"
                label={strings.fileTypes}
                labelKey="name"
                valueKey="id"
                value={this.state.selectedFileCategory}
                options={fileTypeCategories}
                optionRenderer={this.renderCustomComponentWithImage}
                placeholder="Choose type"
                onChange={this.handleFileTypePick}
                optionHeight={45}
                className={style.selectHeader}
                maxHeight={600}
              />
            </div>}
            {type === 'files' && <div className={marginRightAutoForFile}>
              <Select
                id="fileSize"
                name="fileSize"
                label={strings.fileSize}
                value={this.state.selectedFileSize}
                options={fileSizeCategories}
                placeholder="Choose size"
                optionRenderer={this.renderCustomComponentForFileSize}
                optionHeight={45}
                onChange={this.handleFileSizePick}
              />
            </div>}
            <div className={searchItemBySort}>
              <Select
                id="sort"
                name="sort"
                label={strings.sort}
                value={type === 'files' ? this.state.selectedSortAttributeForFile : this.state.selectedSortAttributeForStory}
                options={type === 'files' ? sortAttributesForFiles : sortAttributesForStories}
                placeholder="Relevance"
                optionRenderer={type === 'files' ? this.renderCustomComponentForSorting.bind(this, 'file') : this.renderCustomComponentForSorting.bind(this, 'story')}
                optionHeight={45}
                onChange={type === 'files' ? this.handleSortAttributeChange.bind(this, 'file') : this.handleSortAttributeChange.bind(this, 'story')}
              />
            </div>
          </div>
          <div className={style.searchResults}>
            <FormattedMessage
              id="item-n-search-result"
              defaultMessage={'{total} {type} {matching} {searchValue}'}
              tagName="h4"
              values={{
                type: strings[type],
                total,
                matching: strings.matching,
                searchValue: this.state.searchValue
              }}
            />
            {this.props.loadingContent && <div className={style.loading}>
              <Loader type="content" />
            </div>}
            <SearchList
              searchType={type}
              authString={this.context.settings.authString}
              list={results}
              itemProps={{
                fileSettings: this.props.fileSettings
              }}
              loading={!this.props.loaded && (this.props.loading || this.props.loadingStories || this.props.loadingFiles)}
              loadingMore={this.props.loaded && (this.props.loading || this.props.loadingStories || this.props.loadingFiles)}
              error={this.props.error}
              showThumb
              onItemClick={this.handleItemClicked}
              emptyHeading={strings.emptyHeading}
              emptyMessage={strings.emptyMessage}
              onInfoIconClick={this.handleFileInfoClick}
              searchKeyword={this.state.searchValue}
              onSetStoryReferrerPath={this.handleSetStoryReferrerPath}
              onHandleBookmarkClick={this.handleBookmarkClick}
              bookmarkLoading={this.props.bookmarkLoading}
              currentFileId={this.props.currentFileId}
              onHandleShareFileClick={this.handleShareFile}
              onDownloadClick={this.handleDownloadClick}
              hasShare={hasShare}
            />
          </div>
        </div>
        {this.state.showFileDetailsModel &&
          <FileDetailsModal
            {... {
              canCreateCustomFileDetails,
              fileSettings,
              fileTag,
              strings,
              ...this.state.selectedFile
            }}
            dateAdded={moment(this.state.selectedFile.createdAt).unix()}
            canEdit
            isVisible
            onAddTag={this.handleCreateTag}
            onAddTagToFile={this.handleAddTagFile}
            onTagChange={this.handleTagChange}
            onTagDeleteClick={this.handleTagDelete}
            onClose={this.handleFileDetailsClose}
          />
        }
      </div>
    );
  }
}
