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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import isEqual from 'lodash/isEqual';
import uniqBy from 'lodash/uniqBy';
import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';
import ApiClient from 'helpers/ApiClient';

import { defineMessages, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import generateStrings from 'helpers/generateStrings';
import prepareSearchFilters from 'helpers/prepareSearchFilters';
import prepareBrowserURL from 'helpers/prepareBrowserURL';
import PageSearchResultList from '../PageSearchResultList/PageSearchResultList';

import {
  setLastBlocksearchRoute
} from 'redux/modules/settings';

import {
  setData as setShareData
} from 'redux/modules/share';

import {
  addBookmark,
  deleteBookmark,
  getRecentSearch,
  searchFiles,
  searchStories,
  clearResults,
  setFilter,
  setInteraction,

  likeStory,
  addStoryBookmark,
  deleteStoryBookmark
} from 'redux/modules/supersearch';

import {
  addSlides,
  generateThumbnails,
  getThumbnails,
  setNewIndicator,
  saveActivity
} from 'redux/modules/canvas/canvas';

import {
  loadOpenFile,
  loadFile,
  toggleDock,
  setInitialQuery,
  setInitialPage,
} from 'redux/modules/viewer';

import {
  addTag,
  addTagToFile,
  removeTagToFile,
  searchTags,
} from 'redux/modules/tag';

import { setReferrerPath } from 'redux/modules/story/story';

import { createPrompt } from 'redux/modules/prompts';

import {
  setData as setPageSearchState,
} from 'redux/modules/pageSearch';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import ChannelPickerModalForSearch from 'components/ChannelPickerModalForSearch/ChannelPickerModalForSearch';
import Dialog from 'components/Dialog/Dialog';
import FileDetailsModal from 'components/FileDetailsModal/FileDetailsModal';
import Loader from 'components/Loader/Loader';
import PageSearchInput from 'components/PageSearchInput/PageSearchInput';
import PageSearchFilter from 'components/PageSearchFilter/PageSearchFilter';
import PageSearchResultsRow from 'components/PageSearchResultsRow/PageSearchResultsRow';

import {
  PageEditSelectMenu,
} from 'helpers/filterHelpers';
import mapFiles from 'helpers/pageSearch';
import getSearchFilterOptions from 'helpers/getSearchFilterOptions';
import moment from 'moment-timezone';

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  backToSearchResults: { id: 'back-to-search-results', defaultMessage: 'Back to Search Results' },
  whatCanWeHelpYouFind: { id: 'what-can-we-help-you-find', defaultMessage: 'What can we help you find?' },
  sortBy: { id: 'sort-by', defaultMessage: 'Sort by' },
  relevance: { id: 'relevance', defaultMessage: 'Relevance' },
  title: { id: 'title', defaultMessage: 'Title' },
  description: { id: 'description', defaultMessage: 'Description' },
  date: { id: 'date', defaultMessage: 'Date' },
  previous: { id: 'previous', defaultMessage: 'Previous' },
  next: { id: 'next', defaultMessage: 'Next' },
  file: { id: 'file', defaultMessage: 'File' },
  files: { id: 'files', defaultMessage: 'Files' },
  blocks: { id: 'blocks', defaultMessage: 'Blocks' },
  contentBlocks: { id: 'content-blocks', defaultMessage: 'Content Blocks' },
  allResults: { id: 'all-results', defaultMessage: 'All Results' },
  images: { id: 'images', defaultMessage: 'Images' },
  texts: { id: 'texts', defaultMessage: 'Texts' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  clearSelection: { id: 'clear-selection', defaultMessage: 'Clear Selection' },
  clearAll: { id: 'clear-all', defaultMessage: 'Clear All' },
  selectAll: { id: 'select-all', defaultMessage: 'Select all' },
  select: { id: 'select', defaultMessage: 'Select' },
  addToCanvas: { id: 'add-to-pitch-builder', defaultMessage: 'Add to Pitch Builder' },
  addAllToPitchBuilder: { id: 'add-all-pages-to-pitch-builder', defaultMessage: 'Add All Pages to Pitch Builder' },
  blockTooltip: { id: 'block-tooltip', defaultMessage: 'A block is a part or element of a file that communicates a specific concept or idea.' },
  pages: { id: 'pages', defaultMessage: 'Pages' },
  stories: { id: 'stories', defaultMessage: '{stories}' },
  viewAll: { id: 'view-all', defaultMessage: 'View All' },
  name: { id: 'name', defaultMessage: 'Name' },
  lastModified: { id: 'last-modified', defaultMessage: 'Last Modified' },

  clearSearchTitle: { id: 'content-search', defaultMessage: 'Content Search' },
  clearSearchMessage: { id: 'clear-content-search-message', defaultMessage: 'Enter a search query above to view matched pages, files and {stories}.' },
  emptyBlockSearchTitle: { id: 'empty-block-search-title', defaultMessage: 'No matched results' },
  emptyBlockSearchMessage: { id: 'empty-block-search-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
  emptyBlockSearchBlockTitle: { id: 'empty-block-search-block-title', defaultMessage: 'No matched block results' },
  emptyBlockSearchBlockMessage: { id: 'empty-block-search-block-message', defaultMessage: 'Your search criteria returned no matched block results. Please try again.' },
  noBlocksErrorTitle: { id: 'no-blocks-error-title', defaultMessage: 'Not able to add file at this time.' },
  pleaseTryAgainLater: { id: 'please-try-again-later', defaultMessage: 'Please try again later.' },

  addAllToCanvas: { id: 'add-all-to-canvas', defaultMessage: 'Add All to Canvas' },
  addToPitchBuilder: { id: 'add-to-pitch-builder', defaultMessage: 'Add to Pitch Builder' },

  all: { id: 'all', defaultMessage: 'All' },
  fileName: { id: 'file-name', defaultMessage: 'File Name' },
  tags: { id: 'tags', defaultMessage: 'Tags' },
  story: { id: 'story', defaultMessage: '{story}' },
  like: { id: 'like', defaultMessage: 'Like' },
  removeLike: { id: 'remove-like', defaultMessage: 'Remove Like' },

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
  fileAddedToPitchBuilder: { id: 'file-added-to-pitch-builder', defaultMessage: 'A file has been added to Pitch Builder' },
  view: { id: 'view', defaultMessage: 'View' },
  newTag: { id: 'new-tag', defaultMessage: 'New tag' },
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  close: { id: 'close', defaultMessage: 'Close' },
  content: { id: 'content', defaultMessage: 'Content' },
  noRelatedTags: { id: 'no-related-tags', defaultMessage: 'No Related Tags' },

  // fileter
  filters: { id: 'filters', defaultMessage: 'Filters' },
  applyFilters: { id: 'apply-filters', defaultMessage: 'Apply Filters' },
  resetAll: { id: 'reset-all', defaultMessage: 'Reset All' },
  resetAllFilters: { id: 'reset-all-filters', defaultMessage: 'Reset All Filters' },
  from: { id: 'from', defaultMessage: 'From' },
  to: { id: 'to', defaultMessage: 'To' },
  selectDate: { id: 'select-date', defaultMessage: 'Select Date' },
  displayResultsMatching: { id: 'display-results-matching', defaultMessage: 'Display Results Matching' },
  location: { id: 'location', defaultMessage: 'Location' },
  fileSize: { id: 'file-size', defaultMessage: 'File Size' },
  channel: { id: 'channel', defaultMessage: 'Channel' },
  filtersSelected: { id: 'filters-selected', defaultMessage: 'Filters Selected' },
  locationsSelected: { id: 'locations-selected', defaultMessage: 'Locations Selected' },
});

function mapStateToProps(state) {
  const { canvas, entities, settings, supersearch, tag, pagesearch } = state;
  const { blocksById, queuedThumbnails } = canvas;
  const thumbsToRequest = [];
  Object.keys(queuedThumbnails).forEach((fileId) => {
    if (queuedThumbnails[fileId]) {
      thumbsToRequest.push({
        fileId: fileId,
        locations: queuedThumbnails[fileId]
      });
    }
  });
  const allCanvasBlocks = Object.keys(canvas.slidesById).filter(sid => !canvas.slidesById[sid].deleted).map(sid => canvas.slidesById[sid].blocks).flat();

  return {
    ...supersearch,
    files: mapFiles(supersearch.files, allCanvasBlocks, blocksById),
    filesById: entities.files,
    blocksById,
    thumbsToRequest,
    companyId: settings.company.id,
    fileSettings: settings.fileSettings,
    fileTag: tag,
    tags: tag.allTags,
    userCapabilities: settings.userCapabilities,
    ...pagesearch
  };
}
@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addSlides,
    generateThumbnails,
    getRecentSearch,
    getThumbnails,
    setNewIndicator,
    saveActivity,
    searchFiles,
    searchStories,
    clearResults,
    setFilter,
    setInteraction,
    setLastBlocksearchRoute,

    setShareData,

    addBookmark,
    deleteBookmark,
    loadOpenFile,
    loadFile,
    toggleDock,
    setInitialQuery,
    setInitialPage,

    addTag,
    addTagToFile,
    removeTagToFile,
    searchTags,

    likeStory,
    addStoryBookmark,
    deleteStoryBookmark,
    setReferrerPath,
    setPageSearchState,

    createPrompt
  })
)
export default class PageSearch extends Component {
  static propTypes = {
    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    files: [],
    stories: [],
    pages: []
  };

  constructor(props) {
    super(props);

    autobind(this);

    this.scrollContainer = null;
    this.limitExcerptCharacters = 130;
  }

  UNSAFE_componentWillMount() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const { query } = this.props.location;
    const { params } = this.props.match;
    const { keyword, type, createdDate, ...others } = query;
    const term = keyword && keyword.split(':').pop() || keyword;

    // Parse URL query params
    if (term) {
      const filter = [];
      Object.keys(others).forEach((key) => {
        const context = key === 'category' ? decodeURIComponent(others[key]).split(',') : [others[key]];
        const newList = getSearchFilterOptions({ strings }).mapObjectsToName(key, context, true);
        newList.map((i) => filter.push(i));
      });
      const selectedFilters = others ? [...filter] : [];

      if (type) {
        this.props.setPageSearchState({
          searchTypeSelected: type
        });
        this.handleSearchClick(term, selectedFilters, null, params.fileId);
      } else {
        this.handleSearchClick(term, selectedFilters, null, params.fileId);
      }
    } else {
      this.props.setPageSearchState({
        hasSearch: false
      });
    }

    if (this.props.thumbsToRequest.length) {
      this.requestThumbnails(this.props.thumbsToRequest);
    }

    if (!this.props.recentSearches.length) {
      this.props.getRecentSearch();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Save current route
    if (nextProps.location !== this.props.location) {
      this.props.setLastBlocksearchRoute(nextProps.location.pathname + nextProps.location.search);
      if (nextProps.location.query.type === 'all' && this.props.location.query.type !== 'all') this.props.setPageSearchState({ searchTypeSelected: 'all' });
      // Navigated back from stack
      if (!nextProps.match.params.fileId && this.props.match.params.fileId) {
        this.props.setPageSearchState({
          selectedStackId: null,
          selectMode: false,
          selectedBlocks: [],
        });
        this.scrollContainer.scrollTop = 0;
      }
    }

    if (nextProps.thumbsToRequest.length && !this.props.thumbsToRequest.length) {
      this.requestThumbnails(nextProps.thumbsToRequest);
    }

    // Update current file details
    const { files } = nextProps;
    const { selectedFile } = this.props;

    if (selectedFile) {
      const nextActiveFile = files.find(file => selectedFile.id === file.id);
      const currentActiveFile = this.props.files.find(file => selectedFile.id === file.id);

      if (!isEqual(nextActiveFile, currentActiveFile) || (!isEqual(nextActiveFile.tags, currentActiveFile.tags))) {
        this.props.setPageSearchState({
          selectedFile: nextActiveFile
        });
      }
    }

    const { state, query } = nextProps.location;
    if (state && state.jsbridgeRequest) {
      const { keyword: nextPropsKeyword } = query;
      const { keyword } = this.props.location.query;
      if (nextPropsKeyword && nextPropsKeyword !== keyword) {
        const { selectedFilters, sortBy } = this.props;
        this.handleSearchClick(nextPropsKeyword, selectedFilters, sortBy);
      }
    }
  }

  componentWillUnmount() {
    if (this.thumbTimer) {
      clearTimeout(this.thumbTimer);
    }
  }

  prepareBrowserURL(term, filters, type) {
    let urlQuery = {
      keyword: term && term.split(':').pop().trim() || term.trim(),
      type: type || this.props.searchTypeSelected
    };

    if (filters && filters.length || filters.selectedFilterList && filters.selectedFilterList.length) {
      const { keyword, showHidden, date, createdDate, ...listFilters } = prepareSearchFilters({ ...filters, isForUrl: true });
      const data = {};

      if (keyword && keyword.split(':').length > 1) {
        data.searchWithIn = keyword.split(':')[0];
      }

      urlQuery =  {
        ...urlQuery,
        ...data,
        ...listFilters
      };
    }

    // Update URL
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: urlQuery,
    });
  }

  requestThumbnails(thumbsToRequest) {
    if (thumbsToRequest.length) {
      thumbsToRequest.forEach((item) => {
        this.props.getThumbnails(item.fileId, item.locations);
      });

      // check again in 3 seconds
      this.thumbTimer = setTimeout(() => {
        this.requestThumbnails(this.props.thumbsToRequest);
      }, 3000);
    }
  }

  handlePathClick(event) {
    event.preventDefault();

    // return to search results
    if (event.currentTarget.tagName === 'A') {
      this.props.setPageSearchState({
        selectedStackId: null,
        selectMode: false,
        selectedBlocks: []
      });
      if (this.props.searchTypeSelected.includes('only')) {
        // Update URL
        this.props.history.push({
          pathname: '/pagesearch',
          query: { ...this.props.location.query, type: 'all' }
        });
        this.props.setPageSearchState({
          searchTypeSelected: 'all'
        });
      } else {
        // Update URL
        this.props.history.push({
          pathname: '/pagesearch',
          query: this.props.location.query
        });
      }
    }
  }

  handleToggleFilter() {
    this.props.setPageSearchState({
      filterModalVisible: !this.props.filterModalVisible,
      selectedChannelsForFilterModal: {
        clearAll: false,
        channelList: []
      }
    });
  }

  handleApplyFilters(filters) {
    this.props.setPageSearchState({
      selectedFilters: [
        ...filters
      ],
      selectedChannelsForFilterModal: {
        clearAll: false,
        channelList: []
      }
    });
    this.handleSearchClick(this.props.keyword, filters, this.props.sortBy);
  }

  handleResetAllFilters() {
    this.props.setPageSearchState({
      selectedFilters: [],
      filterModalVisible: !this.props.filterModalVisible,
      selectedChannelsForFilterModal: {
        clearAll: false,
        channelList: []
      }
    });
    this.handleSearchClick(this.props.keyword, [], this.props.sortBy);
  }

  handleSetFiltersOnFirstPageSearch(filterList) {
    this.props.setPageSearchState({
      selectedFilters: filterList
    });
  }

  handleChannelPickerToggle() {
    this.props.setPageSearchState({
      channelPickerModalVisible: !this.props.channelPickerModalVisible,
    });
  }

  handleSearchTypeChange(value) {
    this.props.setPageSearchState({
      searchTypeSelected: value,
    });
  }

  handleChannelPickerSave(items) {
    const createNewState = () => {
      const initialSelectedChannels = this.props.selectedFilters.filter(filter => filter.type === 'channel');
      const otherSelectedFilters = this.props.selectedFilters.filter(filter => filter.type !== 'channel');

      const uniqueUpdatedChannels = uniqBy([...initialSelectedChannels, ...items], 'id');

      if (this.props.filterModalVisible) {
        return {
          selectedChannelsForFilterModal: {
            clearAll: false,
            channelList: [...otherSelectedFilters, ...uniqueUpdatedChannels]
          },
          channelPickerModalVisible: !this.props.channelPickerModalVisible,
        };
      }
      return {
        selectedFilters: [...otherSelectedFilters, ...uniqueUpdatedChannels],
        channelPickerModalVisible: !this.props.channelPickerModalVisible,
      };
    };
    this.props.setPageSearchState(createNewState());
  }

  handleClearClick() {
    this.props.clearResults();

    this.props.setPageSearchState({
      keyword: '',
      selectedFilters: [],
      //reset sorting
      sortBy: '',
      nameSortOrder: 'asc',
      lastModifiedSortOrder: 'desc',
    });

    // Update URL
    this.props.history.push(this.props.location.pathname);
  }

  handleDeleteFilterClick(item) {
    const { selectedFilters } = this.props;
    const list = selectedFilters.filter(i => !(i.id === item.id && i.type === item.type));
    this.props.setPageSearchState({
      selectedFilters: list,
    });

    // Update URL
    this.props.history.push(this.props.location.pathname);
  }

  handlePageCheckedChange(checked, id) {
    const newSelected = [...this.props.selectedBlocks];

    if (checked) {
      newSelected.push(id);
    } else {
      const i = newSelected.findIndex(b => b === id);
      newSelected.splice(i, 1);
    }

    this.props.setPageSearchState({
      selectedBlocks: newSelected
    });
  }

  /**
   * Eventhandler - using to handle the click events on ['All','Pages','Files','Stories'] Tabs or View-all Anchor tag
   * This function will
   * 1. update the searchTypeSelected value to `type` in `store.pageSearch`
   * 2. update browserURL
   * 3. scroll to top
   *
   * @function handleNavMenuClick
   * @param {Event} e
   * @param {strings} type
   */
  handleNavMenuClick(e, type) {
    e.preventDefault();
    const ALLOWED_TYPES = ['all', 'pages', 'files', 'stories'];

    if (ALLOWED_TYPES.indexOf(type) === -1) return;

    this.props.setPageSearchState({ searchTypeSelected: type });
    // Update URL
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: prepareBrowserURL(this.props.keyword, { selectedFilterList: this.props.selectedFilters }, type)
    });
    this.scrollContainer.scrollTop = 0;
  }

  handleSearchClick(keyword, filters, sortBy, fileId, sortOrder) {
    if (this.props.loading) {
      return;
    }

    this.props.clearResults();
    const data = {
      keyword: keyword,
      selectedFilterList: filters,
      sortBy: {
        value: sortBy || this.props.sortBy
      },
    };
    if (sortBy === '') {
      delete data.sortBy;
    } else if (data.sortBy.value === 'name') {
      data.sortBy.order = sortOrder || this.props.nameSortOrder;
    } else if (data.sortBy.value === 'updated_at') {
      data.sortBy.order = sortOrder || this.props.lastModifiedSortOrder;
    }

    this.props.setPageSearchState({
      hasSearch: true,
      keyword: keyword,
      selectedFilters: filters,
      selectedStackId: fileId ? parseInt(fileId, 10) : null
    });

    const fileQuery = prepareSearchFilters({
      ...data,
      type: 'files'
    });
    const storyQuery = prepareSearchFilters({
      ...data,
      type: 'stories'
    });

    const specificFilters = filters.filter(i => i.type === 'searchWithIn')[0];
    // Do not search if filter only applies to Stories
    if (!specificFilters || !(specificFilters.type === 'searchWithIn' && specificFilters.id === 'description')) {
      this.props.searchFiles({
        ...fileQuery,
        offset: 0,
        keywordOriginal: keyword
      });
    }

    // Do not search if filter only applies to Files
    if (!specificFilters || !(specificFilters.type === 'searchWithIn' && specificFilters.id === 'text')) {
      this.props.searchStories({
        ...storyQuery,
        offset: 0,
        keywordOriginal: keyword
      });
    }

    // Update URL
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: prepareBrowserURL(keyword, data, this.props.searchTypeSelected)
    });
  }

  handleSortChange({ value }) {
    const { selectedFilters, keyword, sortBy } = this.props;

    const nameSortOrder = (sortBy === value && this.props.nameSortOrder === 'asc') ? 'desc' : 'asc';
    const lastModifiedSortOrder = (sortBy === value && this.props.lastModifiedSortOrder === 'desc') ? 'asc' : 'desc';

    this.props.setPageSearchState({
      sortBy: value,
      nameSortOrder,
      lastModifiedSortOrder
    });
    this.handleSearchClick(keyword, selectedFilters, value, null, value === 'name' ? nameSortOrder : lastModifiedSortOrder);
  }

  loadFileAndOpen(file, openAtBlock) {
    const { id, category, downloadUrl } = file;
    if (this.props.isDocked) {
      this.props.toggleDock();
    }

    // Open at Page
    let initialPage = 1;
    let firstBlock = null;
    if (category === 'pdf') {
      const searchTerm = this.props.keyword.replace(/"/g, '');  // remove quotes
      this.props.setInitialQuery(searchTerm);

      const pages = [...file.matchedBlocks];
      // Sort by page number
      if (pages) pages.sort((a, b) => parseInt(a.page, 10) - parseInt(b.page, 10));

      firstBlock = pages ? pages[0] : null;

      if (firstBlock && openAtBlock) {
        initialPage = firstBlock.page;
        this.props.setInitialPage(initialPage);
      }
    } else if (category === 'powerpoint') {
      const pages = [...file.matchedBlocks];
      // Sort by page number
      if (pages) pages.sort((a, b) => parseInt(a.page, 10) - parseInt(b.page, 10));

      firstBlock = pages ? pages[0] : null;
      if (firstBlock) {
        initialPage = firstBlock.page;
        this.props.setInitialPage(initialPage);
      }
    }

    // load file because search result payload has not data enough to get from cache.
    if (category === 'web' || category === 'pdf' && !downloadUrl) {
      this.props.loadOpenFile(id);
    } else {
      this.props.loadFile(id);
    }
  }

  createShare(file) {
    this.props.setShareData({
      id: 0,
      isVisible: true,
      name: '',
      showMoreOptions: true, // go to advance share when enabled
      files: [{ ...file }],
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  toggleBookmark(file) {
    const ownBookmark = file.bookmarks && file.bookmarks.find(b => b.stackSize === 1);

    // Delete Bookmark
    if (ownBookmark) {
      this.props.deleteBookmark(file.id, ownBookmark.id);

      // Add Bookmark
    } else {
      this.props.addBookmark(file.id, file.description, [{
        story_perm_id: file.permId || file.storyId,
        filename: file.filename
      }]);
    }
  }

  handleNoBlocksClose() {
    this.props.setPageSearchState({
      showNoBlocksDialog: false,
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

  handleFileDetailsClick(file) {
    this.props.setPageSearchState({
      showFileDetailsModel: true,
      selectedFile: file
    });
  }

  handleFileDetailsClose() {
    this.props.setPageSearchState({ showFileDetailsModel: false });
  }

  handleStoryActionClick(event, action, context) {
    // Tracking search interaction
    this.props.setInteraction({
      searchDataId: this.props.searchDataStoryId,
      resultOpenedId: context.id
    });

    switch (action) {
      case 'open':
        this.props.onStoryClick(event, { props: context });
        break;
      case 'bookmark':
        if (context.isBookmark) {
          this.props.deleteStoryBookmark(context.bookmarkId, context.permId);
        } else {
          this.props.addStoryBookmark(context.title, context.permId);
        }
        break;
      case 'like':
        this.props.likeStory(context.permId, !context.isLiked);
        break;
      case 'share':
        this.handleStoryShare(context);
        break;
      default:
        console.info(`Unhandled action: ${action} ${context.id}`);  // eslint-disable-line
        break;
    }
  }

  handleActionClick(action, file) {
    switch (action) {
      case 'canvas': {
        if (file.matchedBlocks && file.matchedBlocks.length === 1 && file.category !== 'video') {
          this.addBlocksToCanvas(file);
        } else if (file.matchedBlocks && file.matchedBlocks.length > 1 && file.category !== 'video') {
          this.props.setPageSearchState({
            pendingFile: file,
            showBlocksDialog: true
          });
        } else {
          this.addFileToCanvas(file);
        }
        break;
      }
      case 'canvas-all':
        // Try loading file blocks if they don't exist on file (via search results)
        if (!file.blocks || !file.blocks.length) {
          this.props.loadFile(file.id, false).then(() => {
            const pendingFile = this.props.filesById[file.id];

            // No blocks -- display message
            if (!pendingFile || (pendingFile && !pendingFile.blocks.length)) {
              this.props.setPageSearchState({
                showNoBlocksDialog: true
              });

            // Has blocks -- display confirm dialog
            } else if (pendingFile && pendingFile.blocks.length) {
              this.props.setPageSearchState({
                pendingFile: pendingFile,
                showAllBlocksDialog: true
              });
            }
          });
        } else {
          this.props.setPageSearchState({
            pendingFile: file,
            showAllBlocksDialog: true
          });
        }
        break;
      case 'open':
      case 'open-page':
        // Tracking search interaction
        this.props.setInteraction({
          searchDataId: this.props.searchDataFileId,
          resultOpenedId: file.id
        });

        this.loadFileAndOpen(file, action === 'open-page');
        break;
      case 'bookmark':
        this.toggleBookmark(file);
        break;
      case 'share':
        this.createShare(file);
        break;
      case 'stack':
        this.props.setPageSearchState({ selectedStackId: file.id });
        this.scrollContainer.scrollTop = 0;

        // Update URL
        this.props.history.push({
          pathname: `${this.props.location.pathname}/${file.id}`,
          query: this.props.location.query
        });

        // Generate thumbnails if any matched blocks do not have a thumbnail
        if (file.matchedBlocks.find(b => !b.thumbnailUrl)) {
          this.props.generateThumbnails(file.id, file.matchedBlocks);
        }
        break;
      case 'file-details':
        this.handleFileDetailsClick(file);
        break;
      default:
        console.info(`Unhandled action: ${action} ${file.id}`);  // eslint-disable-line
        break;
    }
  }

  addBlocksToCanvas(file, blocksAttr = 'matchedBlocks') {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const { selectedBlocks } = this.props;

    // Page search only allows full page to be added to Pitch builder
    // and cannot be combined with other blocks
    const fullPage = true;

    // Unique blocks by page if adding full pages
    let matchedBlocks = uniqBy(file[blocksAttr], 'page');
    if (selectedBlocks.length) {
      matchedBlocks = matchedBlocks.filter(b => selectedBlocks.indexOf(b.id) > -1);
    }

    // Sort blocks by page
    matchedBlocks.sort((a, b) => a.page - b.page);

    const slides = [];
    const blocks = [];

    // Create slides from blocks
    matchedBlocks.forEach(block => {
      slides.push({
        title: '',
        fullPage: fullPage,
        template: fullPage ? 'one-col' : 'one-col-title',
        blocks: [{
          ...block,
          type: 'image',
          file: file,
          searchPhrase: this.props.keyword
        }]
      });
      blocks.push(block);
    });

    this.props.addSlides(slides, 0, null, file.description);
    this.props.generateThumbnails(file.id, blocks);
    this.props.setNewIndicator(true);

    // Save activity
    const data = {
      fileId: file.id,
      locations: blocks.map(b => b.location),
      searchPhrase: this.props.keyword,
      page: null,
      type: fullPage ? 'page' : 'block',
      action: 'add'
    };
    this.props.saveActivity(data);

    // Set nofitication prompt depending of whether page is added from File or Stack of page
    if (blocksAttr === 'matchedBlocks') {
      const message = (<FormattedMessage
        id="n-page"
        defaultMessage="{pageCount, plural, one {A page} other {Pages}} has been added to Pitch Builder"
        values={{ pageCount: matchedBlocks.length }}
      />);
      this.handleNotificationPrompt(message, strings.view);
    } else if (blocksAttr === 'blocks') {
      this.handleNotificationPrompt(strings.fileAddedToPitchBuilder, strings.view);
    }
  }

  addFileToCanvas(file) {
    const slide = {
      title: '',
      template: 'one-col-title',
      fullPage: true,
      slide: {
        file: file,
        thumbnail: file.coverArt.url
      },
      blocks: file.matchedBlocks,
      searchPhrase: this.props.keyword
    };

    this.props.addSlides([slide]);
    this.props.setNewIndicator(true);

    // Save activity
    const data = {
      fileId: file.id,
      locations: file.matchedBlocks.map(b => b.location),
      searchPhrase: this.props.keyword,
      page: null,
      type: 'page',
      action: 'add'
    };
    this.props.saveActivity(data);
  }

  //////////////////////////
  // Select mode actions
  //////////////////////////
  handleAddSelectedToCanvasClick(context) {
    const { selectedStackId } = this.props;
    const file = this.props.files.find(f => f.id === selectedStackId);
    // Show confirmation Dialog if more than 1 page is added
    if (this.props.selectedBlocks.length > 1 || context && context.action === 'addAll') {
      this.props.setPageSearchState({
        pendingFile: file,
        showBlocksDialog: true,
      });
    } else {
      this.addBlocksToCanvas(file);
      this.props.setPageSearchState({
        selectMode: false,
        selectedBlocks: []
      });
    }
  }

  handleAddBlocksCancel() {
    this.props.setPageSearchState({
      pendingFile: null,
      showBlocksDialog: false,
      showAllBlocksDialog: false,
    });
  }

  handleAddBlocksConfirm() {
    this.addBlocksToCanvas(this.props.pendingFile);

    this.props.setPageSearchState({
      pendingFile: null,
      showBlocksDialog: false,
      selectMode: false,
      selectedBlocks: []
    });
  }

  handleAddAllBlocksConfirm() {
    this.addBlocksToCanvas(this.props.pendingFile, 'blocks');

    this.props.setPageSearchState({
      pendingFile: null,
      showAllBlocksDialog: false,
    });
  }

  handleToggleSelectClick() {
    this.props.setPageSearchState({
      selectMode: !this.props.selectMode,
      selectedBlocks: []
    });
    this.props.setPageSearchState({
      selectMode: !this.props.selectMode,
      selectedBlocks: []
    });
  }

  handleClearSelectionClick() {
    this.props.setPageSearchState({
      selectedBlocks: []
    });
  }

  handleSelectAllClick() {
    const { selectedStackId } = this.props;
    const file = this.props.files.find(f => f.id === selectedStackId);
    const blockIds = [];
    file.matchedBlocks.forEach(b => {
      if (b.canAddToCanvas) {
        blockIds.push(b.id);
      }
    });

    this.props.setPageSearchState({
      selectedBlocks: blockIds
    });
  }

  getFilesDetails(files) {
    const client = new ApiClient();

    return Promise.all(files.map(file =>
      client.get('/file/get', 'webapi', {
        params: {
          id: file.id
        }
      }).then(fileResponse => (fileResponse && fileResponse.body))
    ));
  }

  async handleStoryShare(story) {
    const filesToShare = await this.getFilesDetails(story.files);
    this.props.setShareData({
      id: story.id,
      permId: story.permId,
      isVisible: true,
      name: story.title,
      showMoreOptions: true, // go to advance share when enabled
      files: filesToShare,
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  handleNotificationPrompt(message, actionText) {
    const addedToPitchMessage = (<p>{message}... <span>{actionText}</span></p>);
    this.props.createPrompt({
      id: uniqueId('pitch-'),
      type: 'notification',
      children: addedToPitchMessage,
      dismissible: false,
      autoDismiss: 5,
      link: '/canvas',
    });
  }

  handleClearAllSelectedChannel() {
    const createNewState = () => {
      const selectedFiltersOtherThanChannels = this.props.selectedFilters.filter(filter => filter.type !== 'channel');
      if (this.props.filterModalVisible) {
        return {
          selectedChannelsForFilterModal: {
            clearAll: true,
            channelList: []
          },
          channelPickerModalVisible: !this.props.channelPickerModalVisible,
        };
      }
      return {
        selectedFilters: [...selectedFiltersOtherThanChannels],
        channelPickerModalVisible: !this.props.channelPickerModalVisible,
      };
    };
    this.props.setPageSearchState(createNewState());
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      files,
      fileSettings,
      fileTag,
      loading,
      loadingStories,
      loadingFiles,
      loaded,
      location,
      stories,
      totalCount,
      totalStoriesCount,
      userCapabilities,
      recentSearches,
      hasSearch,
      sortBy,
      keyword,
      selectedFilters,
      selectedStackId,
      selectMode,
      selectedBlocks,
      selectedChannelsForFilterModal,
      nameSortOrder,
      lastModifiedSortOrder
    } = this.props;

    const { canCreateCustomFileDetails } = userCapabilities;
    const styles = require('./PageSearch.less');
    const cx = classNames.bind(styles);
    const wrapperClasses = cx({
      blocksearchWrapper: true,
      fullWrapper: !hasSearch,
      hasSearch: hasSearch,
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Separate files with matchedBlocks
    const filesWithMatchedBlocks = [];
    files.forEach(f => {
      if (f.matchedBlocks.length) {
        filesWithMatchedBlocks.push(f);
      }
    });

    // Breadcrumbs
    const breadcrumbPaths = [
      {
        name: selectedStackId || this.props.searchTypeSelected.includes('only') ? strings.backToSearchResults : strings.search,
        path: this.props.searchTypeSelected.includes('only') ? `/pagesearch?keyword=${this.props.keyword}&type=all` : `/pagesearch${location.search}`
      }
    ];

    // Selected Stack
    let allPagesAddedToPB = false;
    const imageMatches = [];
    const textMatches = [];
    let pageList = filesWithMatchedBlocks.slice(0, this.props.searchTypeSelected === 'all' ? 6 : 100);
    let selectedStackItem = null;
    if (selectedStackId) {
      // Filter match types
      selectedStackItem = filesWithMatchedBlocks.find(f => f.id === selectedStackId);
      breadcrumbPaths.push({
        name: selectedStackItem ? selectedStackItem.description : strings.pages,
        path: `/pagesearch/${selectedStackId}${location.search}`
      });
      if (selectedStackItem) {
        selectedStackItem.matchedBlocks.forEach(m => {
          let highlight = m.highlight.replace(/\s+/g, ' ').trim();
          // Remove initial 6 words if excerpt is too long for PAGES UI so  highlighted term is shown
          if (highlight.toLowerCase().indexOf('<mark>') > this.limitExcerptCharacters) {
            highlight = highlight.split(' ').slice(6).join(' ');
          }
          // Currently all matches are textMatches
          // image and video to follow
          textMatches.push({
            ...selectedStackItem,
            excerpt: highlight || selectedStackItem.excerpt.replace(/\s+/g, ' ').trim(),
            matchedBlocks: [m]
          });
        });

        // Are all pages added to canvas?
        allPagesAddedToPB = selectedStackItem.matchedBlocks.every(m => !m.canAddToCanvas);

        // Sort by page
        textMatches.sort((a, b) => a.matchedBlocks[0].page - b.matchedBlocks[0].page);
      }

      pageList = textMatches;
    } else {
      const list = [...pageList];
      pageList = list.map(item => {
        let highlight = item.matchedBlocks.length && item.matchedBlocks[0].highlight.replace(/\s+/g, ' ').trim();

        // Checks if highlighted text is within excerpt or in matchBlocks
        highlight = (highlight && highlight.indexOf('<mark>') >= 0) &&
          (item.excerpt && item.excerpt.indexOf('<mark>') <= 0 || !item.excerpt) ? highlight : (item.excerpt && item.excerpt.replace(/\s+/g, ' ').trim());

        // Remove initial 6 words if excerpt is too long for PAGES UI so  highlighted term is shown
        if (highlight && highlight.indexOf('<mark>') > this.limitExcerptCharacters) {
          highlight = highlight.split(' ').slice(6).join(' ');
        }

        return {
          ...item,
          excerpt: highlight
        };
      });
    }

    const totalFiles = parseInt(totalCount, 10) || files.length;
    const totalStories = parseInt(totalStoriesCount, 10) || stories.length;
    const hasResults = files.length > 0 || stories.length > 0;

    return (
      <div className={styles.PageSearch}>
        <Helmet>
          <title>{strings.search}</title>
        </Helmet>

        <AppHeader>
          <Breadcrumbs
            paths={breadcrumbPaths}
            onPathClick={this.handlePathClick}
          />
        </AppHeader>

        <div className={wrapperClasses}>
          {!selectedStackId && <PageSearchInput
            keyword={keyword}
            filtersApplied={selectedFilters}
            suggestions={recentSearches}
            isFull={!hasSearch}
            disabled={loading || loadingFiles || loadingStories}
            searchType={this.props.searchTypeSelected}
            onClearClick={this.handleClearClick}
            onDeleteFilterClick={this.handleDeleteFilterClick}
            onFilterClick={this.handleToggleFilter}
            onLocationClick={this.handleChannelPickerToggle}
            onSearchClick={this.handleSearchClick}
            onSearchTypeChange={this.handleSearchTypeChange}
            onSetFiltersOnFirstPageSearch={this.handleSetFiltersOnFirstPageSearch}
          />}
          {/* tabs and sorting Select */}
          <PageSearchResultsRow
            {...{
              strings,
              sortBy,
              styles,
            }}
            isVisible={hasSearch && hasResults && !selectedStackId && !this.props.searchTypeSelected.includes('only')}
            searchTypeSelected={this.props.searchTypeSelected}
            onHandleNavMenuClick={this.handleNavMenuClick}
            totalFilesCount={totalFiles}
            totalStoriesCount={totalStories}
            onHandleSortChange={this.handleSortChange}
            nameSortOrder={nameSortOrder}
            lastModifiedSortOrder={lastModifiedSortOrder}
          />

          {/* page eidt select menu */}
          <PageEditSelectMenu
            {...{
              allPagesAddedToPB,
              imageMatches,
              selectMode,
              selectedBlocks,
              selectedStackItem,
              strings,
              styles,
              textMatches
            }}
            isVisible={selectedStackId && userCapabilities.hasPitchBuilderWeb}
            onAddSelectedToCanvasClick={this.handleAddSelectedToCanvasClick}
            onClearSelectionClick={this.handleClearSelectionClick}
            onSelectAllClick={this.handleSelectAllClick}
            onToggleSelectClick={this.handleToggleSelectClick}
          />

          {(hasSearch && (loading || loadingFiles || loadingStories)) && <div className={styles.loadingWrapper}>
            <Loader type="content" />
          </div>}

          {(hasSearch && !loadingFiles && !loadingStories && !files.length && !stories.length) && <div className={styles.emptyWrapper}>
            <Blankslate
              icon={loaded ? 'content' : 'search'}
              heading={loaded ? strings.emptyBlockSearchTitle : strings.clearSearchTitle}
              message={loaded ? strings.emptyBlockSearchMessage : strings.clearSearchMessage}
            />
          </div>}

          {/* List of Items */}
          {(hasSearch && hasResults) && <PageSearchResultList
            addBlocksToCanvas={this.addBlocksToCanvas}
            addFileToCanvas={this.addFileToCanvas}
            onNavMenuClick={this.handleNavMenuClick}
            onStoryClick={this.props.onStoryClick}
            setRef={c => { this.scrollContainer = c; }}
            toggleBookmark={this.toggleBookmark}
            createShare={this.createShare}
            generateThumbnails={this.props.generateThumbnails}
          />}

        </div>

        {/* Channel Picker Modal */}
        {this.props.channelPickerModalVisible && <ChannelPickerModalForSearch
          allowMultiple
          isLocationHeader
          isVisible
          canShare
          selectedChannelsForSearch={selectedFilters.filter(i => i.type === 'channel') || []}
          onClose={this.handleChannelPickerToggle}
          onSave={this.handleChannelPickerSave}
          onClearAllSelectedChannels={this.handleClearAllSelectedChannel}
        />}

        {/* Filter Picker Modal */}
        {this.props.filterModalVisible && <PageSearchFilter
          isVisible
          escClosesModal
          backdropClosesModal
          searchType={this.props.searchTypeSelected}
          filtersApplied={selectedFilters}
          selectedChannelsForFilterModal={selectedChannelsForFilterModal || {}}
          onClose={this.handleToggleFilter}
          onApplyFilters={this.handleApplyFilters}
          onResetAllFilters={this.handleResetAllFilters}
          onLocationClick={this.handleChannelPickerToggle}
          strings={strings}
        />}

        <Dialog
          title={strings.addToPitchBuilder}
          isVisible={this.props.showBlocksDialog}
          cancelText={strings.cancel}
          confirmText={strings.confirm}
          onCancel={this.handleAddBlocksCancel}
          onConfirm={this.handleAddBlocksConfirm}
          className={styles.addToPitchDialog}
        >
          {this.props.pendingFile && <p className={styles.dialogMessage}>
            <FormattedMessage
              id="confirm-add-n-page-to-pitchbuilder-message"
              defaultMessage="Are you sure you want to add {count} {pages} from {fileName} to Pitch Builder?"
              values={{
                count: <b>{this.props.selectMode ? this.props.pendingFile.matchedBlocks.filter(i => i.canAddToCanvas && selectedBlocks.includes(i.id)).length : this.props.pendingFile.matchedBlocks.filter(i => i.canAddToCanvas).length}</b>,
                pages: <b>{strings.pages}</b>,
                fileName: <b>{this.props.pendingFile.description}</b>,
              }}
            />
          </p>}
        </Dialog>

        <Dialog
          title={strings.addToPitchBuilder}
          isVisible={this.props.showAllBlocksDialog}
          cancelText={strings.cancel}
          confirmText={strings.confirm}
          onCancel={this.handleAddBlocksCancel}
          onConfirm={this.handleAddAllBlocksConfirm}
          className={styles.addToPitchDialog}
        >
          {this.props.pendingFile && <p className={styles.dialogMessage}>
            <FormattedMessage
              id="confirm-add-all-to-pitchbuilder-message"
              defaultMessage="Are you sure you want to add the file {fileName} to Pitch Builder?"
              values={{
                fileName: <b>{this.props.pendingFile.description}</b>,
              }}
            />
          </p>}
        </Dialog>

        <Dialog
          title={strings.noBlocksErrorTitle}
          isVisible={this.props.showNoBlocksDialog}
          confirmText={strings.close}
          onConfirm={this.handleNoBlocksClose}
        >
          <p className={styles.dialogMessage}>
            {strings.pleaseTryAgainLater}
          </p>
        </Dialog>

        {this.props.showFileDetailsModel && <FileDetailsModal
          {... {
            canCreateCustomFileDetails,
            fileSettings,
            fileTag,
            strings,
            ...this.props.selectedFile
          }}
          dateAdded={moment(this.props.selectedFile.createdAt).unix()}
          isVisible
          onAddTag={this.handleCreateTag}
          onAddTagToFile={this.handleAddTagFile}
          onTagChange={this.handleTagChange}
          onTagDeleteClick={this.handleTagDelete}
          onClose={this.handleFileDetailsClose}
        />}
      </div>
    );
  }
}
