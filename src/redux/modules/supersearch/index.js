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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import { mapSearchFilePayloadToFileSchema, mapSearchStoryPayloadToStorySchema } from '../../../helpers/searchResultMap';

import { ADD_TAGS_TO_FILE_SUCCESS, REMOVE_TAGS_FROM_FILE_SUCCESS } from '../tag';

import { ADD_FILE_BOOKMARK_SUCCESS as ADD_FILE_VIEW_BOOKMARK_SUCCESS, DELETE_FILE_BOOKMARK_SUCCESS as DELETE_FILE_VIEW_BOOKMARK_SUCCESS } from '../viewer';

import {
  ADD_STORY_BOOKMARK as ADD_STORY_VIEW_BOOKMARK,
  ADD_STORY_BOOKMARK_SUCCESS as ADD_STORY_VIEW_BOOKMARK_SUCCESS,
  DELETE_STORY_BOOKMARK as DELETE_STORY_VIEW_BOOKMARK,
  LIKE_STORY as LIKE_STORY_VIEW,
} from '../story/story';

const globalFetchLimit = 50;

export const LOAD_SEARCH = 'search/LOAD_SEARCH';
export const SEARCH_STORY = 'search/SEARCH_STORY';
export const SEARCH_STORY_SUCCESS = 'search/SEARCH_STORY_SUCCESS';
export const SEARCH_STORY_FAIL = 'search/SEARCH_STORY_FAIL';

export const SEARCH_FILE = 'search/SEARCH_FILE';
export const SEARCH_FILE_SUCCESS = 'search/SEARCH_FILE_SUCCESS';
export const SEARCH_FILE_FAIL = 'search/SEARCH_FILE_FAIL';

export const CLEAR_RESULTS = 'search/CLEAR_RESULTS';
export const SET_REFERRER_PATH = 'search/SET_REFERRER_PATH';

export const SET_FILTER = 'search/SET_FILTER';
export const SET_INTERACTION = 'search/SET_INTERACTION';

export const DELETE_FILE_BOOKMARK = 'search/DELETE_FILE_BOOKMARK';
export const DELETE_FILE_BOOKMARK_SUCCESS = 'search/DELETE_FILE_BOOKMARK_SUCCESS';
export const DELETE_FILE_BOOKMARK_FAIL = 'search/DELETE_FILE_BOOKMARK_FAIL';

export const ADD_FILE_BOOKMARK = 'search/ADD_FILE_BOOKMARK';
export const ADD_FILE_BOOKMARK_SUCCESS = 'search/ADD_FILE_BOOKMARK_SUCCESS';
export const ADD_FILE_BOOKMARK_FAIL = 'search/ADD_FILE_BOOKMARK_FAIL';

export const LOAD_RECENT_SEARCH = 'search/LOAD_RECENT_SEARCH';
export const LOAD_RECENT_SEARCH_SUCCESS = 'search/LOAD_RECENT_SEARCH_SUCCESS';
export const LOAD_RECENT_SEARCH_FAIL = 'search/LOAD_RECENT_SEARCH_FAIL';

export const DELETE_STORY_BOOKMARK = 'search/DELETE_STORY_BOOKMARK';
export const DELETE_STORY_BOOKMARK_SUCCESS = 'search/DELETE_STORY_BOOKMARK_SUCCESS';
export const DELETE_STORY_BOOKMARK_FAIL = 'search/DELETE_STORY_BOOKMARK_FAIL';

export const ADD_STORY_BOOKMARK = 'search/ADD_STORY_BOOKMARK';
export const ADD_STORY_BOOKMARK_SUCCESS = 'search/ADD_STORY_BOOKMARK_SUCCESS';
export const ADD_STORY_BOOKMARK_FAIL = 'search/ADD_STORY_BOOKMARK_FAIL';

export const LIKE_STORY = 'search/LIKE_STORY';

export const initialState = {
  stories: [],
  files: [],
  referrerPath: '/',
  loaded: false,
  loading: false,
  loadingComplete: false,
  loadingStories: false,
  loadingFiles: false,
  isLoadingMoreStories: false,
  isStoriesComplete: false,
  isLoadingMoreFiles: false,
  isFilesComplete: false,

  selectedFileSize: null,
  selectedFileCategory: null,

  dateAddedFromForFile: null,
  dateAddedToForFile: null,

  selectedSearchWithinAttributeForFile: null,
  selectedChannelsForFileSearch: null,

  selectedSortAttributeForFile: null,

  dateModifiedFromForStory: null,
  dateModifiedToForStory: null,

  selectedSearchWithinAttributeForStory: null,
  selectedChannelsForStorySearch: null,

  selectedSortAttributeForStory: null,
  selectedFilters: [],

  searchDataFileId: 0, // tracking user search interactions
  searchDataStoryId: 0, // tracking user search interactions
  resultOpenedId: 0, // tracking file/story opened from search

  bookmarkLoading: false,
  currentFileId: null,
  limit: globalFetchLimit,
  offset: 0,
  totalCount: 0,
  totalStoriesCount: 0,

  recentSearches: [],
  loadedRecentSearch: false,
  loadingRecentSearch: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_FILE_BOOKMARK:
    case DELETE_FILE_BOOKMARK: {
      const bookmarkFile = state.files.find(f => f.id === action.id);
      return {
        ...state,
        bookmarkLoading: true,
        currentFileId: bookmarkFile.id
      };
    }
    case ADD_FILE_VIEW_BOOKMARK_SUCCESS:
    case ADD_FILE_BOOKMARK_SUCCESS: {
      const tempFiles = [...state.files];
      if (!tempFiles.length) {
        return {
          ...state
        };
      }
      const bookmarkFile = tempFiles.find(f => f.id === action.id);
      bookmarkFile.bookmarks.push({
        id: action.result.id,
        name: action.result.name,
        stackSize: action.result.setData[0].bookmarks[0].stackSize
      });
      bookmarkFile.is_bookmarked = true;
      return {
        ...state,
        files: [
          ...tempFiles
        ],
        bookmarkLoading: false,
        currentFileId: bookmarkFile.id
      };
    }
    case DELETE_FILE_VIEW_BOOKMARK_SUCCESS:
    case DELETE_FILE_BOOKMARK_SUCCESS: {
      const tempFiles = [...state.files];
      if (!tempFiles.length) {
        return {
          ...state
        };
      }
      const bookmarkFile = tempFiles.find(f => f.id === action.id);
      const newBookmarks = [...bookmarkFile.bookmarks];
      const bookmarkIndex = newBookmarks.findIndex(bid => bid.id === action.bookmarkId);
      if (bookmarkIndex > -1) {
        newBookmarks.splice(bookmarkIndex, 1);
        bookmarkFile.bookmarks = newBookmarks;
        bookmarkFile.is_bookmarked = newBookmarks.length > 0;
      }
      return {
        ...state,
        files: [
          ...tempFiles
        ],
        bookmarkLoading: false,
        currentFileId: bookmarkFile.id
      };
    }
    case ADD_FILE_BOOKMARK_FAIL:
    case DELETE_FILE_BOOKMARK_FAIL:
      return {
        ...state,
        bookmarkLoading: false,
        currentFileId: null
      };
    case SEARCH_STORY:
      return {
        ...state,
        loaded: false,
        loadingStories: true,
        isLoadingMoreStories: !!action.params.offset,
      };
    case LOAD_SEARCH:
    case SEARCH_FILE:
      return {
        ...state,
        loaded: false,
        loading: true,
        loadingFiles: action.type === SEARCH_FILE,
        isLoadingMoreFiles: !!action.params.offset,
        recentSearches: [
          ...new Set([action.params.keyword, ...state.recentSearches])
        ]
      };
    case SEARCH_STORY_SUCCESS: {
      const listItems = action.result.map((item) => mapSearchStoryPayloadToStorySchema(item));
      return {
        ...state,
        searchDataStoryId: action.headers && action.headers['search-data-id'],
        stories: action.params.offset ? [...state.stories, ...listItems] : listItems,
        loaded: true,
        loading: false,
        loadingStories: false,
        isLoadingMoreStories: false,
        isStoriesComplete: action.result.length < globalFetchLimit,
        totalStoriesCount: action.headers && action.headers['total-count'],
      };
    }
    case SEARCH_FILE_SUCCESS: {
      const listItems = action.result.map((item) => mapSearchFilePayloadToFileSchema(item));
      return {
        ...state,
        searchDataFileId: action.headers && action.headers['search-data-id'],
        files: action.params.offset ? [...state.files, ...listItems] : listItems,
        loaded: true,
        loading: false,
        loadingFiles: false,
        isLoadingMoreFiles: false,
        isFilesComplete: action.result.length < globalFetchLimit,
        totalCount: action.headers && action.headers['total-count'],
        offset: action.params.offset,
        limit: action.params.limit,
      };
    }
    case SEARCH_STORY_FAIL: {
      return {
        ...state,
        searchDataStoryId: 0,
        stories: [],
        loaded: false,
        loading: false,
        loadingStories: false,
        isLoadingMoreStories: false,
      };
    }
    case SEARCH_FILE_FAIL: {
      return {
        ...state,
        searchDataFileId: 0,
        files: [],
        loaded: false,
        loading: false,
        loadingFiles: false,
        isLoadingMoreFiles: false,
      };
    }
    case SET_REFERRER_PATH:
      return {
        ...state,
        referrerPath: action.path,
      };
    case CLEAR_RESULTS:
      return {
        ...initialState,
        recentSearches: [...state.recentSearches]
      };
    case SET_FILTER:
      return {
        ...state,
        [action.filterType]: action.value,
      };
    case SET_INTERACTION: {
      const searchOptions = {};
      switch (action.searchType) {
        case 'file':
          searchOptions.searchDataFileId = action.searchDataId;
          break;
        case 'story':
          searchOptions.searchDataStoryId = action.searchDataId;
          break;
        default:
          break;
      }
      return {
        ...state,
        resultOpenedId: action.resultOpenedId,
        ...searchOptions
      };
    }
    case ADD_TAGS_TO_FILE_SUCCESS: {
      const indexOfUpdatedFile = state.files.findIndex(file => file.id === action.params.fileId);
      const arrayOfTags = [...state.files].length ? [...state.files[indexOfUpdatedFile].tags, { id: action.params.tagId, name: action.params.tagName }] : [{ id: action.params.tagId, name: action.params.tagName }];
      const updatedFileWithTags = {
        ...state.files[indexOfUpdatedFile],
        tags: arrayOfTags
      };

      const updatedFiles = [...state.files];
      updatedFiles[indexOfUpdatedFile] = updatedFileWithTags;

      return {
        ...state,
        files: updatedFiles,
        loaded: true,
        loading: false
      };
    }
    case REMOVE_TAGS_FROM_FILE_SUCCESS: {
      const indexOfUpdatedFile = state.files.findIndex(file => file.id === action.params.fileId);
      const updatedFileWithTags = {
        ...state.files[indexOfUpdatedFile],
        tags: [...state.files[indexOfUpdatedFile].tags.filter(tag => tag.id !== action.params.tagId)]
      };

      const updatedFiles = [...state.files];
      updatedFiles[indexOfUpdatedFile] = updatedFileWithTags;

      return {
        ...state,
        files: updatedFiles,
        loaded: true,
        loading: false
      };
    }

    case LOAD_RECENT_SEARCH:
      return {
        ...state,
        loadedRecentSearch: false,
        loadingRecentSearch: false,
      };
    case LOAD_RECENT_SEARCH_SUCCESS: {
      return {
        ...state,
        recentSearches: action.result.map((item) => item.phrase),
        loadedRecentSearch: false,
        loadingRecentSearch: false,
      };
    }
    case LOAD_RECENT_SEARCH_FAIL: {
      return {
        ...state,
        recentSearches: [],
        loadedRecentSearch: false,
        loadingRecentSearch: false,
      };
    }

    /**
     * Page Search
     */
    case LIKE_STORY:
    case ADD_STORY_BOOKMARK:
    case DELETE_STORY_BOOKMARK:
    case ADD_STORY_BOOKMARK_SUCCESS:
    case DELETE_STORY_BOOKMARK_SUCCESS: {
      const indexOfUpdatedStory = state.stories.findIndex(story => story.permId === action.permId);
      const updatedStoryWithNewValue = {
        ...state.stories[indexOfUpdatedStory],
      };

      if (action.type === LIKE_STORY) {
        updatedStoryWithNewValue.isLiked = action.isLiked;
      } else if (action.type === ADD_STORY_BOOKMARK || action.type === DELETE_STORY_BOOKMARK) {
        updatedStoryWithNewValue.isBookmark = action.type === ADD_STORY_BOOKMARK;
      } else if (action.type === ADD_STORY_BOOKMARK_SUCCESS) {
        updatedStoryWithNewValue.bookmarkId = action.result.id;
      } else if (action.type === DELETE_STORY_BOOKMARK_SUCCESS) {
        updatedStoryWithNewValue.bookmarkId = 0;
      }

      const updatedStories = [...state.stories];
      updatedStories[indexOfUpdatedStory] = updatedStoryWithNewValue;
      return {
        ...state,
        stories: updatedStories,
      };
    }

    /**
     * Story View
     */
    case LIKE_STORY_VIEW:
    case ADD_STORY_VIEW_BOOKMARK:
    case DELETE_STORY_VIEW_BOOKMARK:
    case ADD_STORY_VIEW_BOOKMARK_SUCCESS: {
      const indexOfUpdatedStory = state.stories.findIndex(story => story.permId === action.permId);
      if (indexOfUpdatedStory > -1) {
        const updatedStoryWithNewValue = {
          ...state.stories[indexOfUpdatedStory],
        };

        if (action.type === LIKE_STORY_VIEW) {
          updatedStoryWithNewValue.isLiked = action.isLiked;
        } else if (action.type === ADD_STORY_VIEW_BOOKMARK) {
          updatedStoryWithNewValue.isBookmark = true;
        } else if (action.type === ADD_STORY_VIEW_BOOKMARK_SUCCESS) {
          updatedStoryWithNewValue.bookmarkId = action.result.id;
        } else if (action.type === DELETE_STORY_VIEW_BOOKMARK) {
          updatedStoryWithNewValue.isBookmark = false;
          updatedStoryWithNewValue.bookmarkId = 0;
        }

        const updatedStories = [...state.stories];
        updatedStories[indexOfUpdatedStory] = updatedStoryWithNewValue;
        return {
          ...state,
          stories: updatedStories,
        };
      }
      return state;
    }

    default:
      return state;
  }
}

export function searchFiles(params, highlighted_excerpt_length = 160) {
  const clonedParams = {
    q: params.keyword,
    limit: globalFetchLimit,
    offset: params.offset || 0,
    highlighted_excerpt_length
  };
  if (params.category) {
    clonedParams.category = params.category;
  }
  if (params.size) {
    clonedParams['size[gte]'] = params.size.gte;
    clonedParams['size[lte]'] = params.size.lte;
  }
  if (params.createdDate) {
    clonedParams['created_at[gte]'] = params.createdDate.gte;
    clonedParams['created_at[lte]'] = params.createdDate.lte;
  }
  if (params.sortBy) {
    clonedParams['sort[key]'] = params.sortBy.sort;
    clonedParams['sort[order]'] = params.sortBy.order;
  }
  if (!params.showHidden) {
    clonedParams.hidden = params.showHidden;
  }
  return {
    types: [SEARCH_FILE, SEARCH_FILE_SUCCESS, SEARCH_FILE_FAIL],
    params: { ...clonedParams, keyword: params.keywordOriginal },
    promise: (client) => client.get('/search/files', 'webapi', {
      params: clonedParams
    })
  };
}

export function searchStories(params) {
  const clonedParams = {
    q: params.keyword,
    limit: globalFetchLimit,
    offset: params.offset || 0,
  };
  if (params.ModifiedDate) {
    clonedParams['updated_at[gte]'] = params.ModifiedDate.gte;
    clonedParams['updated_at[lte]'] = params.ModifiedDate.lte;
  }
  if (params.sortBy) {
    clonedParams['sort[key]'] = params.sortBy.sort;
    clonedParams['sort[order]'] = params.sortBy.order;
  }
  if (!params.showHidden) {
    clonedParams.hidden = params.showHidden;
  }
  return {
    types: [SEARCH_STORY, SEARCH_STORY_SUCCESS, SEARCH_STORY_FAIL],
    params: { ...clonedParams, keyword: params.keywordOriginal },
    promise: (client) => client.get('/search/stories', 'webapi', {
      params: clonedParams
    })
  };
}

export function clearResults() {
  return {
    type: CLEAR_RESULTS
  };
}

export function setReferrerPath(path) {
  return {
    type: SET_REFERRER_PATH,
    path
  };
}

export function setFilter(filterType, value) {
  return {
    type: SET_FILTER,
    filterType,
    value
  };
}

export function setInteraction(data) {
  return {
    types: [SET_INTERACTION, null, null],
    ...data,
    promise: (client) => client.post('/search/interaction', 'webapi', {
      body: {
        searchDataId: parseInt(data.searchDataId, 10),
        resultOpenedId: data.resultOpenedId
      }
    })
  };
}

export function addBookmark(id, name = null, data) {
  return {
    types: [ADD_FILE_BOOKMARK, ADD_FILE_BOOKMARK_SUCCESS, ADD_FILE_BOOKMARK_FAIL],
    id,
    data,
    promise: (client) => client.post('/me/addBookmark', 'webapi', {
      data: {
        name: name,
        type: 'files',
        data: JSON.stringify(data)
      }
    })
  };
}

export function deleteBookmark(id, bookmarkId) {
  return {
    types: [DELETE_FILE_BOOKMARK, DELETE_FILE_BOOKMARK_SUCCESS, DELETE_FILE_BOOKMARK_FAIL],
    id,
    bookmarkId,
    promise: (client) => client.post('/me/deleteBookmark', 'webapi', {
      params: {
        id: bookmarkId
      }
    })
  };
}

export function getRecentSearch(limit = 100, type = 'all') {
  return {
    types: [LOAD_RECENT_SEARCH, LOAD_RECENT_SEARCH_SUCCESS, LOAD_RECENT_SEARCH_FAIL],
    params: { limit, type },
    promise: (client) => client.get('/user/search/recent', 'webapi', {
      params: {
        limit: limit,
        type: type
      }
    })
  };
}

export function likeStory(permId, isLiked = true) {
  return {
    types: [LIKE_STORY, null, null],
    permId,
    isLiked,
    promise: (client) => client.post('/story/like', 'webapi', {
      params: {
        permId: permId,
        like: +!!isLiked  // 0/1
      }
    })
  };
}

export function addStoryBookmark(name, permId) {
  return {
    types: [ADD_STORY_BOOKMARK, ADD_STORY_BOOKMARK_SUCCESS, ADD_STORY_BOOKMARK_FAIL],
    permId,
    promise: (client) => client.post('/me/addBookmark', 'webapi', {
      params: {
        name: name,
        type: 'story',
        data: JSON.stringify([{ story_perm_id: permId }])
      }
    })
  };
}

export function deleteStoryBookmark(bookmarkId, permId) {
  return {
    types: [DELETE_STORY_BOOKMARK, DELETE_STORY_BOOKMARK_SUCCESS, DELETE_STORY_BOOKMARK_FAIL],
    permId,
    bookmarkId,
    promise: (client) => client.post('/me/deleteBookmark', 'webapi', {
      params: {
        id: bookmarkId
      }
    })
  };
}
