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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import uniqBy from 'lodash/uniqBy';
import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  addSlides,
  generateThumbnails,
  getThumbnails,
  setNewIndicator,
  saveActivity,
} from 'redux/modules/canvas/canvas';

import {
  setData as setShareData
} from 'redux/modules/share';

import {
  setLastBlocksearchRoute
} from 'redux/modules/settings';

import {
  addBookmark,
  deleteBookmark,
  searchFiles,
  clearResults,
  setFilter,
} from 'redux/modules/supersearch';

import {
  loadOpenFile,
  loadFile,
  toggleDock,
  setInitialQuery,
  setInitialPage,
} from 'redux/modules/viewer';

import { createPrompt } from 'redux/modules/prompts';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';
import BlockSearchInput from 'components/BlockSearchInput/BlockSearchInput';
import BlockSearchBlockItem from 'components/BlockSearchBlockItem/BlockSearchBlockItem';
import BlockSearchFileItem from 'components/BlockSearchFileItem/BlockSearchFileItem';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';
import Loader from 'components/Loader/Loader';
import Select from 'components/Select/Select';

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  whatCanWeHelpYouFind: { id: 'what-can-we-help-you-find', defaultMessage: 'What can we help you find?' },
  sortBy: { id: 'sort-by', defaultMessage: 'Sort by' },
  relevance: { id: 'relevance', defaultMessage: 'Relevance' },
  title: { id: 'title', defaultMessage: 'Title' },
  description: { id: 'description', defaultMessage: 'Description' },
  date: { id: 'date', defaultMessage: 'Date' },
  viewAll: { id: 'view-all', defaultMessage: 'View All' },
  previous: { id: 'previous', defaultMessage: 'Previous' },
  next: { id: 'next', defaultMessage: 'Next' },
  file: { id: 'file', defaultMessage: 'File' },
  files: { id: 'files', defaultMessage: 'Files' },
  blocks: { id: 'blocks', defaultMessage: 'Blocks' },
  allResults: { id: 'all-results', defaultMessage: 'All Results' },
  images: { id: 'images', defaultMessage: 'Images' },
  texts: { id: 'texts', defaultMessage: 'Texts' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  close: { id: 'close', defaultMessage: 'Close' },
  clearAll: { id: 'clear-all', defaultMessage: 'Clear All' },
  selectAll: { id: 'select-all', defaultMessage: 'Select all' },
  select: { id: 'select', defaultMessage: 'Select' },
  addToCanvas: { id: 'add-to-canvas', defaultMessage: 'Add to Canvas' },
  addAllPagesToCanvas: { id: 'add-all-pages-to-canvas', defaultMessage: 'Add All Pages to Canvas' },
  blockTooltip: { id: 'block-tooltip', defaultMessage: 'A block is a part or element of a file that communicates a specific concept or idea.' },
  whatIsABlock: { id: 'what-is-a-block', defaultMessage: 'What is a block?' },

  clearSearchTitle: { id: 'content-block-search', defaultMessage: 'Content Block Search' },
  clearSearchMessage: { id: 'clear-search-message', defaultMessage: 'Enter a search query above to view matched blocks and files.' },
  emptyBlockSearchTitle: { id: 'empty-block-search-title', defaultMessage: 'No matched results' },
  emptyBlockSearchMessage: { id: 'empty-block-search-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
  emptyBlockSearchBlockTitle: { id: 'empty-block-search-block-title', defaultMessage: 'No matched block results' },
  emptyBlockSearchBlockMessage: { id: 'empty-block-search-block-message', defaultMessage: 'Your search criteria returned no matched block results. Please try again.' },
  noBlocksErrorTitle: { id: 'no-blocks-error-title', defaultMessage: 'Not able to add file at this time.' },
  pleaseTryAgainLater: { id: 'please-try-again-later', defaultMessage: 'Please try again later.' },

  pagesAddedToCanvasMessage: { id: 'pages-added-to-canvas-message', defaultMessage: '{count} {count, plural, one {page has} other {pages have}} been added to Canvas... View' }
});

// Hard-coded filters
const STATIC_SEARCH_FILTERS_MASTERCARD = [
  {
    id: 'source',
    name: 'Source',
    options: [
      {
        id: 'source-psc',
        name: 'PSC',
        type: 'tag'
      },
      {
        id: 'source-ice',
        name: 'ICE',
        type: 'tag'
      },
      {
        id: 'source-newsroom',
        name: 'Newsroom',
        type: 'tag'
      },
    ]
  },
  {
    id: 'file-type',
    name: 'File Type',
    options: [
      {
        id: 'certified',
        name: 'Certified',
        type: 'tag'
      },
      {
        id: 'pdf',
        name: 'PDF',
        type: 'category'
      },
      {
        id: 'powerpoint',
        name: 'Powerpoint',
        type: 'category'
      },
      {
        id: 'video',
        name: 'Videos',
        type: 'category'
      },
      {
        id: 'image',
        name: 'Images',
        type: 'category'
      },
      {
        id: 'rfp',
        name: 'RFP',
        type: 'tag'
      },
    ]
  },
  {
    id: 'region',
    name: 'Region',
    options: [
      {
        id: 'global',
        name: 'Global',
      },
      {
        id: 'asia-pacific',
        name: 'Asia Pacific',
      },
      {
        id: 'canada',
        name: 'Canada',
      },
      {
        id: 'europe',
        name: 'Europe',
      },
      {
        id: 'latin-america-and-caribbean',
        name: 'Latin America & the Caribbean',
      },
      {
        id: 'middle-east-and-africa',
        name: 'Middle East and Africa',
      },
      {
        id: 'united-states',
        name: 'United States',
      },
      {
        id: 'north-america-markets-nam',
        name: 'North America Markets (NAM)',
      },
    ]
  },
  {
    id: 'product-line-service',
    name: 'Product Line/Service',
    options: [
      {
        id: 'commercial',
        name: 'Commercial',
      },
      {
        id: 'core-products',
        name: 'Core Products',
      },
      {
        id: 'cyber-and-intelligence-solutions',
        name: 'Cyber & Intelligence Solutions',
      },
      {
        id: 'data-and-services',
        name: 'Data & Services',
      },
      {
        id: 'digital-payments',
        name: 'Digital Payments',
      },
      {
        id: 'communications',
        name: 'Communications',
      },
      {
        id: 'new-payment-platforms',
        name: 'New Payment Platforms',
      },
      {
        id: 'processing-services',
        name: 'Processing Services',
      },
      {
        id: 'strategic-growth',
        name: 'Strategic Growth',
      },
    ]
  },
  {
    id: 'stakeholders',
    name: 'Stakeholders',
    options: [
      {
        id: 'acquirer',
        name: 'Acquirer',
      },
      {
        id: 'government',
        name: 'Government'
      },
      {
        id: 'issuer',
        name: 'Issuer',
      },
      {
        id: 'merchant',
        name: 'Merchant',
      },
      {
        id: 'processor',
        name: 'Processor',
      },
    ]
  },
  {
    id: 'audience-consumer-segments',
    name: 'Audience/Consumer Segments',
    options: [
      {
        id: 'affluent',
        name: 'Affluent'
      },
      {
        id: 'centennials',
        name: 'Centennials'
      },
      {
        id: 'mass-affluent',
        name: 'Mass Affluent'
      },
      {
        id: 'millenials',
        name: 'Millenials'
      },
    ]
  },
];
const STATIC_SEARCH_FILTERS_AMAZON = [
  {
    id: 'file-type',
    name: 'File Type',
    options: [
      {
        id: 'pdf',
        name: 'PDF',
        type: 'category'
      },
      {
        id: 'powerpoint',
        name: 'Powerpoint',
        type: 'category'
      },
      {
        id: 'video',
        name: 'Videos',
        type: 'category'
      },
    ]
  },
  {
    id: 'content-type',
    name: 'Content Type',
    options: [
      {
        id: 'casestudy',
        name: 'Case Study'
      },
      {
        id: 'categoryinsights',
        name: 'Category Insights'
      },
      {
        id: 'pitchdeck',
        name: 'Pitch Deck'
      },
      {
        id: 'webinar',
        name: 'Webinar'
      },
      {
        id: 'salesnarrative',
        name: 'Sales Narrative'
      },
    ]
  },
];
const STATIC_SEARCH_FILTERS_SALESHUB = [
  {
    id: 'file-type',
    name: 'File Type',
    options: [
      {
        id: 'pdf',
        name: 'PDF',
        type: 'category'
      },
      {
        id: 'powerpoint',
        name: 'Powerpoint',
        type: 'category'
      },
      {
        id: 'video',
        name: 'Videos',
        type: 'category'
      },
    ]
  },
  {
    id: 'bigtincan-platform',
    name: 'Bigtincan Platform',
    options: [
      {
        id: 'hub',
        name: 'Hub',
      },
      {
        id: 'zunos',
        name: 'Zunos',
      },
      {
        id: 'automation',
        name: 'Automation',
      },
      {
        id: 'catalog-fatstax',
        name: 'Catalog-FatStax',
      },
      {
        id: 'veelo',
        name: 'Veelo',
      },
    ]
  },
  {
    id: 'content-type',
    name: 'Content Type',
    options: [
      {
        id: 'presentation',
        name: 'Presentation',
      },
      {
        id: 'case-studies',
        name: 'Case-Studies',
      },
      {
        id: 'training',
        name: 'Training',
      },
      {
        id: 'release-notes',
        name: 'Release-Notes',
      },
      {
        id: 'demos',
        name: 'Demos',
      },
    ]
  },
];

function mapStateToProps(state) {
  const { canvas, supersearch, entities } = state;
  const { blocksById, queuedThumbnails } = canvas;

  const allCanvasBlocks = Object.keys(canvas.slidesById).filter(sid => !canvas.slidesById[sid].deleted).map(sid => canvas.slidesById[sid].blocks).flat();

  // Add 'canAddToCanvas' property to matched blocks
  const files = supersearch.files.map(f => {
    if (f.matchedBlocks.length) {
      return {
        ...f,
        matchedBlocks: f.matchedBlocks.map(b => {
          return {
            ...b,
            canAddToCanvas: allCanvasBlocks.indexOf(b.id) === -1,
            thumbnailUrl: b.thumbnailUrl || (blocksById[b.id] && blocksById[b.id].thumbnail)
          };
        })
      };

    // Diplay Video results as blocks -- temporary until API is returning video blocks
    } else if (f.category === 'video') {
      return {
        ...f,
        matchedBlocks: [{
          id: f.id,
          location: null,
          page: 0,
          text: f.description,
          highlight: f.description,
          canAddToCanvas: allCanvasBlocks.indexOf(f.id) === -1,
        }]
      };
    }

    return f;
  });

  const thumbsToRequest = [];
  Object.keys(queuedThumbnails).forEach((fileId) => {
    if (queuedThumbnails[fileId]) {
      thumbsToRequest.push({
        fileId: fileId,
        locations: queuedThumbnails[fileId]
      });
    }
  });

  return {
    ...supersearch,
    files,
    filesById: entities.files,
    blocksById,
    thumbsToRequest,
    companyId: state.settings.company.id
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addSlides,
    generateThumbnails,
    getThumbnails,
    setNewIndicator,
    saveActivity,

    searchFiles,
    clearResults,
    setFilter,
    setLastBlocksearchRoute,

    setShareData,

    addBookmark,
    deleteBookmark,
    loadOpenFile,
    loadFile,
    toggleDock,
    setInitialQuery,
    setInitialPage,
    createPrompt,
  })
)
export default class BlockSearch extends Component {
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

  constructor(props) {
    super(props);

    this.state = {
      hasSearch: false,
      sortBy: '',
      keyword: '',
      selectedFilters: [],
      selectedTab: 'all',
      selectedStackId: null,
      selectMode: false,
      selectedBlocks: [],
      blocksDialogVisible: false,
      allBlocksDialogVisible: false,
      noBlocksDialogVisible: false,
      pendingFile: null,
    };
    autobind(this);

    // Set our hard-coded filters by company id
    let STATIC_SEARCH_FILTERS = STATIC_SEARCH_FILTERS_MASTERCARD;
    switch (props.companyId) {
      case 1552:
        STATIC_SEARCH_FILTERS = STATIC_SEARCH_FILTERS_SALESHUB;
        break;
      case 2088:
        STATIC_SEARCH_FILTERS = STATIC_SEARCH_FILTERS_AMAZON;
        break;
      default:
        break;
    }
    this.STATIC_SEARCH_FILTERS = STATIC_SEARCH_FILTERS;
    this.STATIC_FILE_CATEGORIES = STATIC_SEARCH_FILTERS.find(f => f.id === 'file-type').options.filter(f => f.type === 'category').map(f => f.id);

    this.scrollContainer = null;
  }

  UNSAFE_componentWillMount() {
    const { query } = this.props.location;
    const { params } = this.props.match;
    const keyword = query.keyword;

    // Parse URL query params
    if (keyword) {
      const selectedFilters = Array.isArray(query.filters) ? query.filters : [];
      let searchParams = {
        ...this.prepareSearchQuery(keyword, selectedFilters)
      };

      if (this.state.sortBy) {
        searchParams = {
          ...searchParams,
          sortBy: {
            sort: this.state.sortBy,
            order: 'asc'
          },
        };
      }
      this.props.searchFiles(searchParams);

      this.setState({
        hasSearch: true,
        keyword: keyword,
        selectedFilters: selectedFilters,
        selectedStackId: params.fileId ? parseInt(params.fileId, 10) : null,
        selectedTab: params.tab || 'all'
      });
    }

    if (this.props.thumbsToRequest.length) {
      this.requestThumbnails(this.props.thumbsToRequest);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Save current route
    if (nextProps.location !== this.props.location) {
      this.props.setLastBlocksearchRoute(nextProps.location.pathname + nextProps.location.search);
    }

    // Navigated back from stack
    if (!nextProps.match.params.fileId && this.props.match.params.fileId) {
      this.setState({
        selectedStackId: null,
        selectMode: false,
        selectedBlocks: [],
      });
      this.scrollContainer.scrollTop = 0;
    }

    if (nextProps.thumbsToRequest.length && !this.props.thumbsToRequest.length) {
      this.requestThumbnails(nextProps.thumbsToRequest);
    }

    if (nextProps.location.query.tab !== this.props.location.query.tab) {
      this.setState({
        selectedTab: nextProps.location.query.tab
      });
    }
  }

  componentWillUnmount() {
    if (this.thumbTimer) {
      clearTimeout(this.thumbTimer);
    }
  }

  prepareSearchQuery(keyword, filters = []) {
    const catFilters = [];
    const tagFilters = [];
    let tagSearchString = '';

    filters.forEach(f => {
      if (this.STATIC_FILE_CATEGORIES.indexOf(f) === -1) {
        tagFilters.push(f);
      } else {
        catFilters.push(f);
      }
    });

    if (tagFilters.length) {
      tagSearchString = ` tags:(${tagFilters.join('&&')})`;
    }

    return {
      keyword: `${keyword}${tagSearchString}`,
      category: catFilters[0]
    };
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
      const searchTerm = this.state.keyword.replace(/"/g, '');  // remove quotes
      this.props.setInitialQuery(searchTerm);
      firstBlock = file.matchedBlocks ? file.matchedBlocks[0] : null;
      if (firstBlock && openAtBlock) {
        initialPage = firstBlock.page + 1;
        this.props.setInitialPage(initialPage);
      }
    } else if (category === 'powerpoint') {
      firstBlock = file.matchedBlocks ? file.matchedBlocks[0] : null;
      if (firstBlock) {
        initialPage = firstBlock.page + 1;
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

  createShare(file) {
    this.props.setShareData({
      id: 0,
      isVisible: true,
      name: '',
      showMoreOptions: true, // go to advance share when enabled
      files: [file],
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  addBlocksToCanvas(file, blocksAttr = 'matchedBlocks') {
    const { selectedBlocks } = this.state;

    // PDFs are handled as a full page
    // and cannot be combined with other blocks
    const fullPage = file.category === 'pdf' || blocksAttr === 'blocks';

    // Unique blocks by page if adding blocks
    let matchedBlocks = blocksAttr === 'blocks' ? uniqBy(file[blocksAttr], 'page') : file[blocksAttr];

    // Filter if selectedBlocks is set
    if (selectedBlocks && selectedBlocks.length) {
      matchedBlocks = matchedBlocks.filter(b => selectedBlocks.indexOf(b.id) > -1);
    }

    // Sort blocks by page
    if (matchedBlocks.length) {
      matchedBlocks.sort((a, b) => a.page - b.page);
    }

    const slides = [];
    const blocks = [];

    // Create slides from blocks
    matchedBlocks.forEach(block => {
      slides.push({
        title: '',
        fullPage: fullPage,
        template: fullPage ? 'one-col' : 'one-col-title',
        showAsFullPage: true,  // show blocks as full page by default
        blocks: [{
          ...block,
          type: 'image',
          file: file,
          searchPhrase: this.state.keyword
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
      searchPhrase: this.state.keyword,
      page: null,
      type: fullPage ? 'page' : 'block',
      action: 'add'
    };
    this.props.saveActivity(data);

    // Show prompt
    if (slides.length) {
      const strings = generateStrings(messages, this.context.intl.formatMessage, {
        count: slides.length
      });

      this.props.createPrompt({
        id: uniqueId('blocksearch-'),
        type: 'success',
        message: strings.pagesAddedToCanvasMessage,
        link: '/canvas',
        dismissible: true,
        autoDismiss: 5
      });
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
      searchPhrase: this.state.keyword
    };

    this.props.addSlides([slide]);
    this.props.setNewIndicator(true);

    // Save activity
    const data = {
      fileId: file.id,
      locations: file.matchedBlocks.map(b => b.location),
      searchPhrase: this.state.keyword,
      page: null,
      type: 'page',
      action: 'add'
    };
    this.props.saveActivity(data);
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

  handleSearchClick(keyword, filters) {
    this.props.clearResults();

    let searchParams = {
      ...this.prepareSearchQuery(keyword, filters)
    };

    if (this.state.sortBy) {
      searchParams = {
        ...searchParams,
        sortBy: {
          sort: this.state.sortBy,
          order: 'asc'
        },
      };
    }
    this.props.searchFiles(searchParams);

    this.setState({
      hasSearch: true,
      keyword: keyword,
      selectedFilters: filters,
    });

    const urlQuery = {
      keyword: keyword
    };

    if (filters && filters.length) {
      urlQuery.filters = filters;
    }

    // Update URL
    this.updateRouteQuery(urlQuery);
  }

  handleClearClick() {
    this.props.clearResults();

    this.setState({
      keyword: '',
      selectedFilters: [],
      selectedTab: 'all',
    });

    // Update URL
    this.resetRoute();
  }

  resetRoute() {
    this.props.history.push('/blocksearch');
  }

  updateRouteQuery(args) {
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: {
        ...this.props.location.query,
        ...args
      },
    });
  }

  updateRoutePath(path) {
    this.props.history.push({
      pathname: path,
      query: this.props.location.query
    });
  }

  handleTabClick(event) {
    const tabId = event.target.dataset.id;
    this.updateRouteQuery({
      tab: tabId,
    });
  }

  handleSortChange(value) {
    const { selectedFilters, keyword } = this.state;
    let searchParams = {
      ...this.prepareSearchQuery(keyword, selectedFilters)
    };

    if (value.value) {
      searchParams = {
        ...searchParams,
        sortBy: {
          sort: value.value,
          order: 'asc'
        },
      };
    }
    this.props.searchFiles(searchParams);

    this.setState({
      sortBy: value.value
    });
  }

  handlePathClick(event) {
    event.preventDefault();

    // return to search results
    if (event.currentTarget.tagName === 'A') {
      this.resetRoute();
    }
  }

  handleViewAllClick() {
    const tabId = 'blocks';
    this.updateRouteQuery({
      tab: tabId,
    });
  }

  handlePrevClick(event) {
    event.preventDefault();
    const { selectedFilters, keyword } = this.state;
    const newOffset = this.props.offset - this.props.limit;
    let searchParams = {
      ...this.prepareSearchQuery(keyword, selectedFilters),
      offset: newOffset,
    };

    if (this.state.sortBy) {
      searchParams = {
        ...searchParams,
        sortBy: {
          sort: this.state.sortBy,
          order: 'asc'
        },
      };
    }

    this.props.searchFiles(searchParams);
  }

  handleNextClick(event) {
    event.preventDefault();
    const { selectedFilters, keyword } = this.state;
    const newOffset = this.props.offset + this.props.limit;
    let searchParams = {
      ...this.prepareSearchQuery(keyword, selectedFilters),
      offset: newOffset,
    };

    if (this.state.sortBy) {
      searchParams = {
        ...searchParams,
        sortBy: {
          sort: this.state.sortBy,
          order: 'asc'
        },
      };
    }

    this.props.searchFiles(searchParams);
  }

  handleActionClick(action, file) {
    switch (action) {
      // add file's matchedBlocks to canvas
      case 'canvas': {
        if (file.matchedBlocks && file.matchedBlocks.length === 1 && file.category !== 'video') {
          this.addBlocksToCanvas(file);
        } else if (file.matchedBlocks && file.matchedBlocks.length > 1 && file.category !== 'video') {
          this.setState({
            pendingFile: file,
            blocksDialogVisible: true
          });
        } else {
          this.addFileToCanvas(file);
        }
        break;
      }

      // add file's blocks to canvas
      case 'canvas-all':
        // Try loading file blocks if they don't exist on file (via search results)
        if (!file.blocks || !file.blocks.length) {
          this.props.loadFile(file.id, false).then(() => {
            const pendingFile = this.props.filesById[file.id];

            // No blocks -- display message
            if (!pendingFile || (pendingFile && !pendingFile.blocks.length)) {
              this.setState({
                noBlocksDialogVisible: true
              });

            // Has blocks -- display confirm dialog
            } else if (pendingFile && pendingFile.blocks.length) {
              this.setState({
                pendingFile: pendingFile,
                allBlocksDialogVisible: true
              });
            }
          });
        } else {
          this.setState({
            pendingFile: file,
            allBlocksDialogVisible: true
          });
        }
        break;
      case 'open':
      case 'open-block':
        this.loadFileAndOpen(file, action === 'open-block');
        break;
      case 'bookmark':
        this.toggleBookmark(file);
        break;
      case 'share':
        this.createShare(file);
        break;
      case 'stack':
        this.setState({ selectedStackId: file.id });
        this.scrollContainer.scrollTop = 0;

        // Update URL
        this.updateRoutePath(`${this.props.location.pathname}/${file.id}`);

        // Generate thumbnails if any matched blocks do not have a thumbnail
        if (file.matchedBlocks.find(b => !b.thumbnailUrl)) {
          this.props.generateThumbnails(file.id, file.matchedBlocks);
        }
        break;
      default:
        console.info(`Unhandled action: ${action} ${file.id}`);  // eslint-disable-line
        break;
    }
  }

  handleAddBlocksCancel() {
    this.setState({
      pendingFile: null,
      blocksDialogVisible: false,
      allBlocksDialogVisible: false,
    });
  }

  handleAddBlocksConfirm() {
    this.addBlocksToCanvas(this.state.pendingFile);

    this.setState({
      pendingFile: null,
      blocksDialogVisible: false,
    });
  }

  handleAddAllBlocksConfirm() {
    this.addBlocksToCanvas(this.state.pendingFile, 'blocks');

    this.setState({
      pendingFile: null,
      allBlocksDialogVisible: false,
    });
  }

  handleNoBlocksClose() {
    this.setState({
      noBlocksDialogVisible: false,
    });
  }

  handleToggleSelectClick() {
    this.setState({
      selectMode: !this.state.selectMode,
      selectedBlocks: []
    });
  }

  handleClearSelectionClick() {
    this.setState({
      selectedBlocks: []
    });
  }

  handleSelectAllClick() {
    const { selectedStackId } = this.state;
    const file = this.props.files.find(f => f.id === selectedStackId);
    const blockIds = [];
    file.matchedBlocks.forEach(b => {
      if (b.canAddToCanvas) {
        blockIds.push(b.id);
      }
    });

    this.setState({
      selectedBlocks: blockIds
    });
  }

  handleAddSelectedToCanvasClick() {
    const { selectedStackId } = this.state;
    const file = this.props.files.find(f => f.id === selectedStackId);
    this.addBlocksToCanvas(file);

    this.setState({
      selectMode: false,
      selectedBlocks: []
    });
  }

  handleCheckedChange(checked, id) {
    const newSelectedBlocks = [...this.state.selectedBlocks];

    if (checked) {
      newSelectedBlocks.push(id);
    } else {
      const i = newSelectedBlocks.findIndex(b => b === id);
      newSelectedBlocks.splice(i, 1);
    }

    this.setState({
      selectedBlocks: newSelectedBlocks
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      files,
      loading,
      loaded,
      location,
      offset,
      limit,
    } = this.props;
    const {
      hasSearch,
      sortBy,
      keyword,
      selectedFilters,
      selectedTab,
      selectedStackId,
      selectMode,
      selectedBlocks,
    } = this.state;
    const styles = require('./BlockSearch.less');
    const cx = classNames.bind(styles);
    const wrapperClasses = cx({
      blocksearchWrapper: true,
      fullWrapper: !hasSearch,
      hasSearch: hasSearch,
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, {
      count: 0
    });

    // Source tags to display on results
    const sourceFilter = this.STATIC_SEARCH_FILTERS.find(f => f.id === 'source');
    let sourceTags = [];
    if (sourceFilter) {
      sourceTags = sourceFilter.options;
    }

    // Separate files with matchedBlocks
    let filesWithMatchedBlocks = [];
    files.forEach(f => {
      if (f.matchedBlocks.length) {
        filesWithMatchedBlocks.push(f);
      }
    });

    const filesWithMatchedBlocksTotal = filesWithMatchedBlocks.length;

    // If "all" tab is selected, only show first 6 block items
    const blockItemsToDisplay = 6;
    let visibleBlockCount = filesWithMatchedBlocks.length < blockItemsToDisplay ? filesWithMatchedBlocks.length : blockItemsToDisplay;
    let viewAllBlocksEnabled = false;
    if (selectedTab === 'all') {
      filesWithMatchedBlocks = filesWithMatchedBlocks.splice(0, blockItemsToDisplay);
      viewAllBlocksEnabled = filesWithMatchedBlocksTotal > blockItemsToDisplay;
    } else if (selectedTab === 'blocks') {
      visibleBlockCount = filesWithMatchedBlocks.length;
    }

    // Breadcrumbs
    const breadcrumbPaths = [
      {
        name: selectedStackId ? 'Back to Search Results' : 'Search',
        path: `/blocksearch${location.search}`
      }
    ];

    // Selected Stack
    const imageMatches = [];
    const textMatches = [];
    let selectedStackItem = null;
    let anyPagesAddedToCanvas = false;
    let allPagesAddedToCanvas = false;
    if (selectedStackId) {
      // Filter match types
      selectedStackItem = filesWithMatchedBlocks.find(f => f.id === selectedStackId);
      if (selectedStackItem) {
        selectedStackItem.matchedBlocks.forEach(m => {
          // Currently all matches are textMatches
          // image and video to follow
          textMatches.push({
            ...selectedStackItem,
            matchedBlocks: [m]
          });

          // Are any pages added to canvas?
          if (!m.canAddToCanvas) {
            anyPagesAddedToCanvas = true;
          }
        });

        // Are all pages added to canvas?
        allPagesAddedToCanvas = selectedStackItem.matchedBlocks.every(m => !m.canAddToCanvas);

        // Sort by page
        textMatches.sort((a, b) => a.matchedBlocks[0].page - b.matchedBlocks[0].page);

        // Update Breadcrumbs
        breadcrumbPaths.push({
          name: selectedStackItem.description,
          path: `/blocksearch/${selectedStackId}${location.search}`
        });
      }
    }

    // Pagination
    const prevEnabled = offset > 0;
    const nextEnabled = files.length === limit;

    return (
      <div className={styles.BlockSearch}>
        <Helmet>
          <title>{strings.search}</title>
        </Helmet>

        <AppHeader>
          <Breadcrumbs
            paths={breadcrumbPaths}
            onPathClick={this.handlePathClick}
            className={styles.breadcrumbs}
          />
        </AppHeader>

        <div className={wrapperClasses}>
          {/* Search Input */}
          {!selectedStackId && <BlockSearchInput
            keyword={keyword}
            filters={this.STATIC_SEARCH_FILTERS}
            selectedFilters={selectedFilters}
            full={!hasSearch}
            disabled={loading}
            onSearchClick={this.handleSearchClick}
            onClearClick={this.handleClearClick}
          />}

          {/* Search Results */}
          {(hasSearch && files.length > 0 && !selectedStackId) && <div className={styles.resultsRow}>
            {/* Tabs */}
            <ul className={styles.tabs}>
              <li
                data-id="all"
                onClick={this.handleTabClick}
                className={selectedTab === 'all' || !selectedTab ? styles.tabItemActive : null}
              >
                {strings.allResults} ({filesWithMatchedBlocksTotal + files.length})
              </li>
              <li
                data-id="blocks"
                onClick={this.handleTabClick}
                className={selectedTab === 'blocks' ? styles.tabItemActive : null}
              >
                {strings.blocks} ({filesWithMatchedBlocksTotal})
              </li>
              <li
                data-id="files"
                onClick={this.handleTabClick}
                className={selectedTab === 'files' ? styles.tabItemActive : null}
              >
                {strings.files} ({files.length})
              </li>
            </ul>

            <Select
              id="sortBy"
              name="sortBy"
              label={`${strings.sortBy}:`}
              value={sortBy}
              options={[{
                value: '',
                label: strings.relevance
              }, {
                value: 'description',
                label: strings.title
              }, {
                value: 'updated_at',
                label: strings.date,
              }]}
              clearable={false}
              searchable={false}
              className={styles.sortBy}
              onChange={this.handleSortChange}
            />
          </div>}

          {/* Open Stack Actions */}
          {selectedStackId && <div className={styles.openStackActions}>
            {/* Default Stack view */}
            {(!selectMode && selectedStackItem) && <header>
              <h3>
                <FormattedMessage
                  id="showing-n-results-in-x"
                  defaultMessage="Viewing {count} {count, plural, one {result} other {results}} in {filename}"
                  values={{
                    count: textMatches.length,
                    filename: selectedStackItem.description
                  }}
                />
              </h3>

              <div>
                <Btn
                  icon="canvas-add"
                  small
                  onClick={this.handleAddSelectedToCanvasClick}
                  className={styles.addAllButton}
                  disabled={anyPagesAddedToCanvas}
                >
                  {strings.addAllPagesToCanvas}
                </Btn>
                <Btn
                  small
                  disabled={allPagesAddedToCanvas}
                  onClick={this.handleToggleSelectClick}
                >
                  {strings.select}
                </Btn>
              </div>
            </header>}

            {/* Select Mode */}
            {selectMode && <header>
              <div>
                <FormattedMessage
                  id="n-pages-selected"
                  defaultMessage="{itemCount, plural, one {# Page} other {# Pages}} Selected"
                  values={{ itemCount: selectedBlocks.length }}
                />

                <Btn
                  borderless
                  small
                  inverted
                  warning={selectedBlocks.length > 0}
                  disabled={!selectedBlocks.length}
                  className={styles.cancelBtn}
                  onClick={this.handleClearSelectionClick}
                >
                  {strings.clearAll}
                </Btn>
                <Btn
                  borderless
                  small
                  disabled={selectedBlocks.length === (imageMatches.length + textMatches.length)}
                  className={styles.selectAllBtn}
                  onClick={this.handleSelectAllClick}
                >
                  {strings.selectAll}
                </Btn>
              </div>

              <div>
                <Btn
                  inverted
                  disabled={!selectedBlocks.length}
                  onClick={this.handleAddSelectedToCanvasClick}
                >
                  {strings.addToCanvas}
                </Btn>
                <Btn
                  warning
                  inverted
                  onClick={this.handleToggleSelectClick}
                >
                  {strings.cancel}
                </Btn>
              </div>
            </header>}
          </div>}

          {/* Search loading indicator */}
          {(hasSearch && loading) && <div className={styles.loadingWrapper}>
            <Loader type="content" />
          </div>}

          {/* Empty results */}
          {(hasSearch && loaded && !files.length) && <div className={styles.emptyWrapper}>
            <Blankslate
              icon="content"
              heading={strings.emptyBlockSearchTitle}
              message={strings.emptyBlockSearchMessage}
            />
          </div> }

          {/* No Search performed yet */}
          {(hasSearch && !loaded && !loading && !files.length) && <div className={styles.emptyWrapper}>
            <Blankslate
              icon="search"
              heading={strings.clearSearchTitle}
              message={strings.clearSearchMessage}
            />
          </div>}

          {/* Lists */}
          {(hasSearch && files.length > 0) && <div ref={(c) => { this.scrollContainer = c; }} className={styles.scrollContainer}>
            {/* Open Stack */}
            {selectedStackId && <div className={styles.openStack}>
              {textMatches.length > 0 && <div className={styles.blockResults}>
                <div className={styles.list}>
                  {textMatches.map((item, index) => (
                    <BlockSearchBlockItem
                      key={`${item.id}-${index}`}
                      {...item}
                      sourceTags={sourceTags}
                      select={selectMode}
                      checked={selectedBlocks.indexOf(item.matchedBlocks[0].id) > -1}
                      highlight={keyword}
                      onActionClick={this.handleActionClick}
                      onCheckedChange={this.handleCheckedChange}
                    />
                  ))}
                </div>
              </div>}
            </div>}

            {/* Block Results */}
            {((selectedTab === 'blocks' || selectedTab === 'all' || !selectedTab) && !selectedStackId) && <div className={styles.blockResults}>
              <header>
                <h3 aria-label={strings.blockTooltip} className={styles.hasTooltip}>
                  {strings.blocks}
                  <span>{strings.whatIsABlock}</span>
                </h3>

                {filesWithMatchedBlocks.length > 0 && <div className={styles.pagination}>
                  <FormattedMessage
                    id="showing-n-of-x-results"
                    defaultMessage="Showing {count} of {total} {count, plural, one {result} other {results}}"
                    values={{
                      count: visibleBlockCount,
                      total: filesWithMatchedBlocksTotal,
                    }}
                  />
                  {viewAllBlocksEnabled && <span
                    onClick={this.handleViewAllClick}
                    className={styles.viewAll}
                  >
                    {strings.viewAll}
                  </span>}
                  {prevEnabled && <a
                    href="#previous"
                    title={strings.previous}
                    onClick={this.handlePrevClick}
                    className={styles.previous}
                  >
                    {strings.previous}
                  </a>}
                  {nextEnabled && <a
                    href="#next"
                    title={strings.next}
                    onClick={this.handleNextClick}
                    className={styles.next}
                  >
                    {strings.next}
                  </a>}
                </div>}
              </header>

              {!filesWithMatchedBlocks.length && <Blankslate
                icon="content"
                heading={strings.emptyBlockSearchBlockTitle}
                message={strings.emptyBlockSearchBlockMessage}
              />}

              <div className={styles.list}>
                {filesWithMatchedBlocks.map(item => (
                  <BlockSearchBlockItem
                    key={item.id}
                    {...item}
                    sourceTags={sourceTags}
                    canAddToCanvas={!this.props.blocksById[item.id]}
                    highlight={keyword}
                    onActionClick={this.handleActionClick}
                    onCheckedChange={this.handleCheckedChange}
                  />
                ))}
              </div>
            </div>}

            {/* File Results */}
            {(selectedTab === 'files' || selectedTab === 'all' || !selectedTab) && <div className={styles.fileResults}>
              <header>
                {!selectedStackId && <h3>{strings.files}</h3>}
                {selectedStackId && <h3>{strings.file}</h3>}
                {!selectedStackId && <div className={styles.pagination}>
                  <FormattedMessage
                    id="showing-n-of-x-results"
                    defaultMessage="Showing {count} of {total} {count, plural, one {result} other {results}}"
                    values={{
                      count: files.length,
                      total: files.length,
                    }}
                  />
                  {prevEnabled && <a
                    href="#previous"
                    title={strings.previous}
                    onClick={this.handlePrevClick}
                    className={styles.previous}
                  >
                    {strings.previous}
                  </a>}
                  {nextEnabled && <a
                    href="#next"
                    disabled={!nextEnabled}
                    title={strings.next}
                    onClick={this.handleNextClick}
                    className={styles.next}
                  >
                    {strings.next}
                  </a>}
                </div>}
              </header>

              <div className={styles.list}>
                {!selectedStackId && files.map(item => (
                  <BlockSearchFileItem
                    key={item.id}
                    {...item}
                    sourceTags={sourceTags}
                    onActionClick={this.handleActionClick}
                  />
                ))}
                {(selectedStackId && selectedStackItem) && <BlockSearchFileItem
                  key={selectedStackItem.id}
                  {...selectedStackItem}
                  sourceTags={sourceTags}
                  onActionClick={this.handleActionClick}
                />}
              </div>
            </div>}
          </div>}
        </div>

        <Dialog
          title={strings.addToCanvas}
          isVisible={this.state.blocksDialogVisible}
          cancelText={strings.cancel}
          confirmText={strings.addToCanvas}
          onCancel={this.handleAddBlocksCancel}
          onConfirm={this.handleAddBlocksConfirm}
        >
          {this.state.pendingFile && <p className={styles.dialogMessage}>
            <FormattedMessage
              id="confirm-add-all-to-canvas-message"
              defaultMessage="Are you sure you want to add {count} pages to Canvas?"
              values={{
                count: this.state.pendingFile.matchedBlocks.length,
              }}
            />
          </p>}
        </Dialog>

        <Dialog
          title={strings.addToCanvas}
          isVisible={this.state.allBlocksDialogVisible}
          cancelText={strings.cancel}
          confirmText={strings.addToCanvas}
          onCancel={this.handleAddBlocksCancel}
          onConfirm={this.handleAddAllBlocksConfirm}
        >
          {this.state.pendingFile && <p className={styles.dialogMessage}>
            <FormattedMessage
              id="confirm-add-all-to-canvas-message"
              defaultMessage="Are you sure you want to add {count} pages to Canvas?"
              values={{
                count: uniqBy(this.state.pendingFile.blocks, 'page').length,
              }}
            />
          </p>}
        </Dialog>

        <Dialog
          title={strings.noBlocksErrorTitle}
          isVisible={this.state.noBlocksDialogVisible}
          confirmText={strings.close}
          onConfirm={this.handleNoBlocksClose}
        >
          <p className={styles.dialogMessage}>
            {strings.pleaseTryAgainLater}
          </p>
        </Dialog>
      </div>
    );
  }
}
