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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

/**
 * Normalize results
 * https://github.com/gaearon/normalizr
 */
import { normalize, Schema, arrayOf } from 'normalizr';
import merge from 'lodash/merge';
import jquery from 'jquery';  // let's remove this
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';

// Define schemes for our entities
/* All type search */
const file = new Schema('files');
const user = new Schema('users');
const story = new Schema('stories');
const note = new Schema('notes');
const meeting = new Schema('meetings');
const comment = new Schema('comments');

// Specify the name of the attribute that determines the schema
const allResult = {
  file: file,
  people: user,
  story: story,
  feed: story,
  meeting: meeting,
  comment: comment,
  note: note
};

// Search by type
// Generate custom id for range
function generateSlug(entity) {
  return entity.value + '' + entity.unit;
}

// Filter schemes
//const user = new Schema('users');
const range = new Schema('ranges', { idAttribute: generateSlug });
const channel = new Schema('channels');
const tab = new Schema('tabs');
const tag = new Schema('tags');
const mime = new Schema('mimes', { idAttribute: 'term' });
const result = new Schema('results');

// Specify the name of the attribute that determines the schema
const resultFilter = {
  author: arrayOf(user),
  story_author: arrayOf(user), // only for notes
  channel: arrayOf(channel),
  tab: arrayOf(tab),
  tag: arrayOf(tag),
  range: arrayOf(range),
  mime: arrayOf(mime), // only for files
};

const globalFetchLimit = 20;

export const MODAL_STATE = 'search/MODAL_STATE';
export const SET_REFERRER_PATH = 'search/SET_REFERRER_PATH';

export const LOAD_SEARCH = 'search/LOAD_SEARCH';
export const LOAD_SEARCH_SUCCESS = 'search/LOAD_SEARCH_SUCCESS';
export const LOAD_SEARCH_FAIL = 'search/LOAD_SEARCH_FAIL';

export const LOAD_SEARCH_ALL = 'search/LOAD_SEARCH_ALL';
export const LOAD_SEARCH_ALL_SUCCESS = 'search/LOAD_SEARCH_ALL_SUCCESS';
export const LOAD_SEARCH_ALL_FAIL = 'search/LOAD_SEARCH_ALL_FAIL';

export const CLEAR_RESULTS = 'search/CLEAR_RESULTS';
export const ADD_FILTER = 'search/ADD_FILTER';

export const POPULAR_LOAD = 'search/LOAD';
export const POPULAR_LOAD_SUCCESS = 'search/LOAD_SUCCESS';
export const POPULAR_LOAD_FAIL = 'search/LOAD_FAIL';

export const CLEAR_POPULAR_SEARCHES = 'search/CLEAR_POPULAR_SEARCHES';
export const CLEAR_RECENT_SEARCHES = 'search/CLEAR_RECENT_SEARCHES';

export const initialState = {
  filesById: {},
  storiesById: {},
  feedsById: {},
  usersById: {},
  meetingsById: {},
  commentsById: {},

  channelsById: {},
  rangesById: {},
  tabsById: {},
  tagsById: {},
  mimesById: {},

  resultsById: {},
  results: [],
  total: 0,
  filters: [],

  loaded: false,
  loading: false,
  loadingComplete: false,
  referrerPath: '/',

  // Filter lists
  filterAdded: false,
  filtersEnabledKeyname: [],

  initialFilters: {
    tab: [],
    channel: [],
    tag: [],
    author: [],
    story_author: [], // only for notes
    range: [],
    mime: []
  },
  searchableFilters: {
    tab: [],
    channel: [],
    tag: [],
    author: [],
    story_author: [],
    range: [],
    mime: []
  },
  filtersEnabled: {
    tab: [],
    channel: [],
    tag: [],
    author: [],
    story_author: [],
    range: [],
    mime: []
  },

  // Loading all list of items
  allResults: {
    stories: [],
    files: [],
    people: [],
    feeds: [],
    meetings: [],
    comments: [],
    notes: [],
  },
  allResultsTotal: {
    stories: 0,
    files: 0,
    people: 0,
    feeds: 0,
    meetings: 0,
    comments: 0,
    notes: 0,
  },
  loadingStories: false,
  loadingFiles: false,
  loadingPeople: false,
  loadingFeeds: false,
  loadingMeetings: false,
  loadingComments: false,
  loadingNotes: false,

  // Popular list modal
  popularLoaded: false,
  popularLoading: false,
  popularSearches: [],
  recentSearches: [],
};

export default function reducer(state = initialState, action = {}) {
  const totalInitialItems = 5;
  const newState = Object.assign({}, state);

  const resetArr = {
    tab: [],
    channel: [],
    tag: [],
    author: [],
    story_author: [],
    range: [],
    mime: []
  };

  switch (action.type) {
    case MODAL_STATE:
      return {
        ...state,
        isModalVisible: action.isModalVisible,
      };
    case SET_REFERRER_PATH:
      return {
        ...state,
        referrerPath: action.path,
      };

    // Load All list
    case LOAD_SEARCH_ALL:
      return {
        ...state,
        loadingStories: action.params.type === 'stories' ? true : state.loadingStories,
        loadingFiles: action.params.type === 'files' ? true : state.loadingFiles,
        loadingPeople: action.params.type === 'people' ? true : state.loadingPeople,
        loadingFeeds: action.params.type === 'feeds' ? true : state.loadingFeeds,
        loadingMeetings: action.params.type === 'meetings' ? true : state.loadingMeetings,
        loadingComments: action.params.type === 'comments' ? true : state.loadingComments,
        loadingNotes: action.params.type === 'notes' ? true : state.loadingNotes,
      };
    case LOAD_SEARCH_ALL_SUCCESS: {
      const normalized = normalize(action.result, {
        results: arrayOf(allResult, { schemaAttribute: 'type' }),
      });
      return {
        ...state,
        error: null,
        allResults: {
          ...state.allResults,
          [action.params.type]: normalized.result.results.map(({ id }) => id)
        },
        allResultsTotal: {
          ...state.allResultsTotal,
          [action.params.type]: action.result.total
        },
        storiesById: merge({}, state.storiesById, normalized.entities.stories),
        filesById: merge({}, state.filesById, normalized.entities.files),
        usersById: merge({}, state.usersById, normalized.entities.users),
        feedsById: merge({}, state.feedsById, normalized.entities.feeds),
        meetingsById: merge({}, state.meetingsById, normalized.entities.meetings),
        commentsById: merge({}, state.commentsById, normalized.entities.comments),
        notesById: merge({}, state.notesById, normalized.entities.notes),
        loadingStories: action.params.type === 'stories' ? false : state.loadingStories,
        loadingFiles: action.params.type === 'files' ? false : state.loadingFiles,
        loadingPeople: action.params.type === 'people' ? false : state.loadingPeople,
        loadingFeeds: action.params.type === 'feeds' ? false : state.loadingFeeds,
        loadingMeetings: action.params.type === 'meetings' ? false : state.loadingMeetings,
        loadingComments: action.params.type === 'comments' ? false : state.loadingComments,
        loadingNotes: action.params.type === 'notes' ? false : state.loadingNotes,
      };
    }
    case LOAD_SEARCH_ALL_FAIL:
      return {
        ...state,
        error: action.error,
        loadingStories: action.params.type === 'stories' ? false : state.loadingStories,
        loadingFiles: action.params.type === 'files' ? false : state.loadingFiles,
        loadingPeople: action.params.type === 'people' ? false : state.loadingPeople,
        loadingFeeds: action.params.type === 'feeds' ? false : state.loadingFeeds,
        loadingMeetings: action.params.type === 'meetings' ? false : state.loadingMeetings,
        loadingComments: action.params.type === 'comments' ? false : state.loadingComments,
        loadingNotes: action.params.type === 'notes' ? false : state.loadingNotes,
      };

    // Search by Type
    case LOAD_SEARCH:
      return {
        ...state,
        results: action.params && action.params.reset ? [] : state.results,
        filtersEnabled: action.params && action.params.reset ? [] : state.filtersEnabled,
        loaded: action.params && action.params.reset ? false : state.loaded,
        loading: Boolean(action.params),
        isModalVisible: false,
      };
    case LOAD_SEARCH_SUCCESS: {
      let itemList = [];
      const normalized = normalize(action.result, {
        results: arrayOf(result),
        filters: resultFilter,
      });

      // Set initial filter
      const filtersEnabledKeyname = [];
      const filtersEnabled = Object.assign({}, resetArr);
      const initFilter = Object.assign({}, resetArr);
      const searchableFilters = Object.assign({}, resetArr);
      const tmpFilter = Object.assign({}, resetArr);

      if (normalized.result.filters) {
        // get keyName of the filters available from API
        for (const fe of Object.keys(normalized.result.filters)) {
          filtersEnabledKeyname.push(fe);
        }
        // Set initial filters to display 5 plus any selected
        for (const value of Object.keys(normalized.result.filters)) {
          initFilter[value] = normalized.result.filters[value].slice(0, totalInitialItems);

          let mapType;
          switch (value) {
            case 'author': mapType = 'users'; break;
            case 'story_author': mapType = 'users'; break;
            case 'channel': mapType = 'channels'; break;
            case 'tab': mapType = 'tabs'; break;
            case 'tag': mapType = 'tags'; break;
            case 'range': mapType = 'ranges'; break;
            case 'mime': mapType = 'mimes'; break;
            default: break;
          }

          // Add any filter selected to Initial List and Filters Enabled List
          let itemsFiltered = 0;  // eslint-disable-line
          for (const items of normalized.result.filters[value].map(id => normalized.entities[mapType][id])) {
            // Set custom id to range, mime, tags filter
            if (mapType === 'ranges') items.id = items.value + '' + items.unit;
            if (mapType === 'mimes') items.id = items.term;
            if (items && items.id && items.isSelected) { //avoid undefined items
              initFilter[value].push(items.id);
              filtersEnabled[value].push(items.id);
            }

            if ((mapType === 'tags' || mapType === 'mime') && !items.tmpId) {
              items.tmpId = items.id;
              items.id = items.term;
            }

            itemsFiltered += 1;
          }

          // Searchable filters everything not included in initialFilters
          searchableFilters[value] = normalized.result.filters[value].filter(function (sf) {
            return sf && initFilter[value].indexOf(sf) === -1;
          });

          tmpFilter[value] = normalized.result.filters[value].filter(id => id !== undefined);

          // Avoid duplicates id
          initFilter[value] = uniq(initFilter[value].filter(id => id !== undefined));
          searchableFilters[value] = uniq(searchableFilters[value]);
          tmpFilter[value] = uniq(tmpFilter[value]);
        }

        // merge results if searching for more
        if (action.params.offset > 0) {
          itemList = [...state.results, ...normalized.result.results];
        } else {
          itemList = normalized.result.results;
        }
      }

      // Remove undefined items from tags
      const tmpEntities = Object.assign({}, normalized.entities);
      if (tmpEntities.tags) {
        delete tmpEntities.tags.undefined;
      } else if (tmpEntities.mimes) {
        delete tmpEntities.mimes.undefined;
      }

      const tmTotal = !normalized.result.total && itemList.length ? state.total : normalized.result.total;

      return {
        ...state,
        loaded: true,
        loading: false,
        loadingComplete: normalized.result.results < globalFetchLimit,

        // Results
        results: itemList,
        resultsById: merge({}, state.resultsById, normalized.entities.results),
        total: tmTotal,

        // Filters
        filters: tmpFilter,
        initialFilters: initFilter,
        searchableFilters: searchableFilters,
        filtersEnabled: filtersEnabled,
        filtersEnabledKeyname: filtersEnabledKeyname,

        channelsById: normalized.entities.channels || {},
        rangesById: normalized.entities.ranges || {},
        tabsById: normalized.entities.tabs || {},
        tagsById: tmpEntities.tags || {},
        usersById: normalized.entities.users || {},
        mimesById: tmpEntities.mimes || {},

        error: null,
      };
    }
    case LOAD_SEARCH_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error,
      };

    case CLEAR_RESULTS:
      return {
        ...state,
        filesById: {},
        storiesById: {},
        feedsById: {},
        usersById: {},
        meetingsById: {},
        commentsById: {},

        channelsById: {},
        rangesById: {},
        tabsById: {},
        tagsById: {},
        mimesById: {},

        resultsById: {},
        results: [],
        total: 0,
        filters: [],

        loaded: false,
        loading: false,
        loadingComplete: false,

        filtersEnabledKeyname: [],

        initialFilters: Object.assign({}, resetArr),
        searchableFilters: Object.assign({}, resetArr),
        filtersEnabled: Object.assign({}, resetArr),
        error: null,

        allResults: {
          stories: [],
          files: [],
          people: [],
          feeds: [],
          meetings: [],
          comments: [],
          notes: [],
          storiesTotal: 0,
          filesTotal: 0,
          peopleTotal: 0,
          feedsTotal: 0,
          meetingsTotal: 0,
          commentsTotal: 0,
          notesTotal: 0
        },
      };

    case ADD_FILTER: {
      const iList = newState.initialFilters[action.key];
      const sList = newState.searchableFilters[action.key];
      let fEnabled = newState.filtersEnabled[action.key];
      let id = action.item.id;

      switch (action.key) {
        case 'tag':
          for (const key in newState.tagsById) {
            if (newState.tagsById[key].term === action.item.id) id = newState.tagsById[key].tmpId;
          }
          break;
        case 'mime':
          for (const key in newState.mimesById) {
            if (newState.mimesById[key].term === action.item.id) id = newState.mimesById[key].term;
          }
          break;
        default:
          break;
      }

      // add to initial filter and Filters Enabled list
      iList.push(id);

      if (action.item.isUnSelected) {
        // remove from enabled list
        fEnabled.splice(fEnabled.indexOf(id), 1);
      } else {
        // add to enabled list
        fEnabled.push(id);

        if (action.key === 'range') {
          fEnabled = [id];
        }
      }

      // remove from searchable list
      sList.splice(sList.indexOf(action.item.id), 1);

      // Enables items temporarily before fetch from server side
      newState.filtersEnabled[action.key] = fEnabled;

      let isAuthorReset = false; // Avoid to reset author twice
      const unSelectAllOptions = function (key, value, mapType) {
        if (key && newState.filtersEnabled[value].indexOf(key) === -1 || (value === 'range' && key)) {
          newState[mapType][key].isSelected = false;
          if (mapType === 'usersById') isAuthorReset = true;
        }
      };
      for (const value of Object.keys(newState.filtersEnabled)) {
        let mapType;
        switch (value) {
          case 'author': mapType = 'usersById'; break;
          case 'story_author': mapType = 'usersById'; break;
          case 'channel': mapType = 'channelsById'; break;
          case 'tab': mapType = 'tabsById'; break;
          case 'tag': mapType = 'tagsById'; break;
          case 'range': mapType = 'rangesById'; break;
          case 'mime': mapType = 'mimesById'; break;
          default: break;
        }

        // Disable all
        if (mapType !== 'usersById' || !isAuthorReset) {
          Object.keys(newState[mapType]).forEach(function (key) { unSelectAllOptions(key, value, mapType); });
        }

        // Enables
        for (const items of newState.filtersEnabled[value].map(index => newState[mapType][index])) {
          if (items && items.id) items.isSelected = true;
        }
      }

      return {
        ...state,
        initialFilters: {
          ...state.initialFilters,
          [action.key]: uniq(iList)
        },
        searchableFilters: {
          ...state.searchableFilters,
          [action.key]: uniq(sList)
        },
        filtersEnabled: {
          ...state.filtersEnabled,
          [action.key]: uniq(fEnabled)
        },
        filterAdded: !state.filterAdded,

        channelsById: newState.channelsById,
        rangesById: newState.rangesById,
        tabsById: newState.tabsById,
        tagsById: newState.tagsById,
        usersById: newState.usersById,
        mimesById: newState.mimesById,
      };
    }

    case POPULAR_LOAD:
      return {
        ...state,
        popularLoading: true,
        popularError: null,
        popularSearches: state.popularSearches,
        recentSearches: state.recentSearches
      };
    case POPULAR_LOAD_SUCCESS:
      return {
        ...state,
        popularLoaded: true,
        popularLoading: false,
        popularError: null,
        popularSearches: action.result.popularSearches,
        recentSearches: action.result.recentSearches,
        ...action.result
      };
    case POPULAR_LOAD_FAIL:
      return {
        ...state,
        popularLoaded: false,
        popularLoading: false,
        popularError: action.error,
      };

    case CLEAR_POPULAR_SEARCHES:
      return {
        ...state,
        popularSearches: []
      };
    case CLEAR_RECENT_SEARCHES:
      return {
        ...state,
        recentSearches: []
      };

    default:
      return state;
  }
}

export function load(params, reset) {
  // Normalized parameters
  const clonedParams = {
    type: params.type,
    keyword: params.keyword,
    limit: globalFetchLimit,
    offset: params.offset || 0,
    reset: reset,
  };

  if (params.fields) clonedParams.fields = params.fields;

  const filters = {};

  // Convert to array if it is a string
  if (params.tab && params.tab.length) filters.tab = !Array.isArray(params.tab) ? [parseInt(params.tab, 10)] : params.tab;
  if (params.channel && params.channel.length) filters.channel = !Array.isArray(params.channel) ? [parseInt(params.channel, 10)] : params.channel;
  if (params.author && params.author.length) filters.author = !Array.isArray(params.author) ? [parseInt(params.author, 10)] : params.author;
  if (params.story_author && params.story_author.length) filters.story_author = !Array.isArray(params.story_author) ? [parseInt(params.story_author, 10)] : params.story_author;

  if (params.rangeObj && params.rangeObj.length) filters.range = !Array.isArray(params.rangeObj) ? [params.rangeObj] : params.rangeObj;
  if (params.tag && params.tag.length) filters.tag = !Array.isArray(params.tag) ? [params.tag] : params.tag;
  if (params.mime && params.mime.length) filters.mime = !Array.isArray(params.mime) ? [params.mime] : params.mime;

  if (!isEmpty(filters)) clonedParams.filters = JSON.stringify(filters);

  // Only for actions - do no send to api
  if (params.range && params.range.length) filters.range = !Array.isArray(params.range) ? [params.range] : params.range;
  return {
    types: [LOAD_SEARCH, LOAD_SEARCH_SUCCESS, LOAD_SEARCH_FAIL],
    params: { ...params, filtersEnabled: filters, reset: reset },
    promise: (client) => client.get('/search/all?' + jquery.param(clonedParams), 'webapi')
  };
}

export function loadAll(params) {
  // Normalized parameters
  const clonedParams = {
    type: params.type,
    keyword: params.keyword,
  };

  clonedParams.limit = 6;
  clonedParams.offset = 0;

  return {
    types: [LOAD_SEARCH_ALL, LOAD_SEARCH_ALL_SUCCESS, LOAD_SEARCH_ALL_FAIL],
    params: clonedParams,
    promise: (client) => client.get('/search/all', 'webapi', {
      params: clonedParams
    })
  };
}

export function clearResults() {
  return {
    type: CLEAR_RESULTS
  };
}

export function addToFilterList(key, item) {
  return {
    type: ADD_FILTER,
    key,
    item
  };
}

export function setModalState(isModalVisible) {
  return {
    type: MODAL_STATE,
    isModalVisible
  };
}

export function setReferrerPath(path) {
  return {
    type: SET_REFERRER_PATH,
    path
  };
}

export function clearPopularSearches() {
  return {
    type: CLEAR_POPULAR_SEARCHES
  };
}

export function clearRecentSearches() {
  return {
    type: CLEAR_RECENT_SEARCHES
  };
}
