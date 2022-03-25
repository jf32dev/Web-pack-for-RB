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

import merge from 'lodash/merge';
import union from 'lodash/union';
import _unionBy from 'lodash/unionBy';
import { normalize, Schema, arrayOf } from 'normalizr';

import { ADD_FILE_BOOKMARK_SUCCESS } from './viewer';

const globalFetchLimit = 50;

const share = new Schema('shares', { idAttribute: 'shareSessionId', defaults: { type: 'share' } });

/* Action Types */
export const LOAD_ME = 'me/LOAD_ME';
export const LOAD_ME_SUCCESS = 'me/LOAD_ME_SUCCESS';
export const LOAD_ME_FAIL = 'me/LOAD_ME_FAIL';

export const LOAD_BOOKMARKS = 'me/LOAD_BOOKMARKS';
export const LOAD_BOOKMARKS_SUCCESS = 'me/LOAD_BOOKMARKS_SUCCESS';
export const LOAD_BOOKMARKS_FAIL = 'me/LOAD_BOOKMARKS_FAIL';

export const LOAD_RECENT_FILES = 'me/LOAD_RECENT_FILES';
export const LOAD_RECENT_FILES_SUCCESS = 'me/LOAD_RECENT_FILES_SUCCESS';
export const LOAD_RECENT_FILES_FAIL = 'me/LOAD_RECENT_FILES_FAIL';

export const LOAD_RECOMMENDED_FILES = 'me/LOAD_RECOMMENDED_FILES';
export const LOAD_RECOMMENDED_FILES_SUCCESS = 'me/LOAD_RECOMMENDED_FILES_SUCCESS';
export const LOAD_RECOMMENDED_FILES_FAIL = 'me/LOAD_RECOMMENDED_FILES_FAIL';

export const LOAD_LIKED_STORIES = 'me/LOAD_LIKED_STORIES';
export const LOAD_LIKED_STORIES_SUCCESS = 'me/LOAD_LIKED_STORIES_SUCCESS';
export const LOAD_LIKED_STORIES_FAIL = 'me/LOAD_LIKED_STORIES_FAIL';

export const LOAD_RECENT_STORIES = 'me/LOAD_RECENT_STORIES';
export const LOAD_RECENT_STORIES_SUCCESS = 'me/LOAD_RECENT_STORIES_SUCCESS';
export const LOAD_RECENT_STORIES_FAIL = 'me/LOAD_RECENT_STORIES_FAIL';

export const LOAD_RECOMMENDED_STORIES = 'me/LOAD_RECOMMENDED_STORIES';
export const LOAD_RECOMMENDED_STORIES_SUCCESS = 'me/LOAD_RECOMMENDED_STORIES_SUCCESS';
export const LOAD_RECOMMENDED_STORIES_FAIL = 'me/LOAD_RECOMMENDED_STORIES_FAIL';

export const LOAD_RECOMMENDED_USERS = 'me/LOAD_RECOMMENDED_USERS';
export const LOAD_RECOMMENDED_USERS_SUCCESS = 'me/LOAD_RECOMMENDED_USERS_SUCCESS';
export const LOAD_RECOMMENDED_USERS_FAIL = 'me/LOAD_RECOMMENDED_USERS_FAIL';

export const LOAD_NOTES = 'me/LOAD_NOTES';
export const LOAD_NOTES_SUCCESS = 'me/LOAD_NOTES_SUCCESS';
export const LOAD_NOTES_FAIL = 'me/LOAD_NOTES_FAIL';

export const LOAD_STORIES_WITH_COMMENTS = 'me/LOAD_STORIES_WITH_COMMENTS';
export const LOAD_STORIES_WITH_COMMENTS_SUCCESS = 'me/LOAD_STORIES_WITH_COMMENTS_SUCCESS';
export const LOAD_STORIES_WITH_COMMENTS_FAIL = 'me/LOAD_STORIES_WITH_COMMENTS_FAIL';

export const LOAD_SHARES = 'me/LOAD_SHARES';
export const LOAD_SHARES_SUCCESS = 'me/LOAD_SHARES_SUCCESS';
export const LOAD_SHARES_FAIL = 'me/LOAD_SHARES_FAIL';

export const LOAD_SHARE_DETAILS = 'me/LOAD_SHARE_DETAILS';
export const LOAD_SHARE_DETAILS_SUCCESS = 'me/LOAD_SHARE_DETAILS_SUCCESS';
export const LOAD_SHARE_DETAILS_FAIL = 'me/LOAD_SHARE_DETAILS_FAIL';

export const LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES = 'me/LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES';
export const LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_SUCCESS = 'me/LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_SUCCESS';
export const LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_FAIL = 'me/LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_FAIL';

export const LOAD_USERS_TIME_ON_PAGE = 'me/LOAD_USERS_TIME_ON_PAGE';
export const LOAD_USERS_TIME_ON_PAGE_SUCCESS = 'me/LOAD_USERS_TIME_ON_PAGE_SUCCESS';
export const LOAD_USERS_TIME_ON_PAGE_FAIL = 'me/LOAD_USERS_TIME_ON_PAGE_FAIL';
export const SET_HUBSHARE_THUMBNAILS = 'me/SET_HUBSHARE_THUMBNAILS';

export const SET_SUMMARY_SCROLL_POSITION = 'me/SET_SUMMARY_SCROLL_POSITION';

export const initialState = {
  ui: {
    summaryScrollY: 0
  },

  loaded: false,
  loading: false,
  error: null,

  bookmarks: [],
  bookmarksLoaded: false,
  bookmarksLoading: false,
  bookmarksComplete: false,
  bookmarksError: null,

  likedStories: [],
  likedStoriesLoaded: false,
  likedStoriesLoading: false,
  likedStoriesComplete: false,
  likedStoriesError: null,

  notes: [],
  notesLoaded: false,
  notesLoading: false,
  notesComplete: false,
  notesError: null,

  publishedStories: [],
  publishedStoriesLoaded: false,
  publishedStoriesLoading: false,
  publishedStoriesComplete: false,
  publishedStoriesError: null,

  scheduledStories: [],
  scheduledStoriesLoaded: false,
  scheduledStoriesLoading: false,
  scheduledStoriesComplete: false,
  scheduledStoriesError: null,

  recentFiles: [],
  recentFilesLoaded: false,
  recentFilesLoading: false,
  recentFilesComplete: false,
  recentFilesError: null,

  recentStories: [],
  recentStoriesLoaded: false,
  recentStoriesLoading: false,
  recentStoriesComplete: false,
  recentStoriesError: null,

  recentShares: [],
  recentSharesLoaded: false,
  recentSharesLoading: false,
  recentSharesComplete: false,
  recentSharesError: null,

  recommendedFiles: [],
  recommendedFilesLoaded: false,
  recommendedFilesLoading: false,
  recommendedFilesComplete: false,
  recommendedFilesError: null,

  recommendedStories: [],
  recommendedStoriesLoaded: false,
  recommendedStoriesLoading: false,
  recommendedStoriesComplete: false,
  recommendedStoriesError: null,

  recommendedUsers: [],
  recommendedUsersLoaded: false,
  recommendedUsersLoading: false,
  recommendedUsersComplete: false,
  recommendedUsersError: null,

  storiesWithComments: [],
  storiesWithCommentsLoaded: false,
  storiesWithCommentsLoading: false,
  storiesWithCommentsComplete: false,
  storiesWithCommentsError: null,

  shares: [],
  sharesById: {},
  sharesLoaded: false,
  sharesLoading: false,
  sharesComplete: false,
  sharesError: null,

  stats: {},

  usersTimeOnPageStats: {},
  userTimeOnPageStatsForFiles: {},

  hubShareFileThumbnails: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_ME:
      return {
        ...state,
        loading: true
      };
    case LOAD_ME_SUCCESS: {
      const bookmarkIds = action.result.bookmarks.map(b => b.id);
      const noteIds = action.result.notes.map(n => n.id);
      const publishedStoryIds = action.result.publishedStories.map(s => s.permId);
      const recentFileIds = action.result.recentFiles.map(f => f.id);
      const recentStoryIds = action.result.recentStories.map(s => s.permId);
      const recentShareIds = action.result.recentShares.map(s => s.shareSessionId);

      return {
        ...state,
        loaded: true,
        loading: false,
        error: null,

        bookmarks: bookmarkIds,
        bookmarksLoaded: true,
        bookmarksComplete: action.result.bookmarks.length < 6,

        notes: noteIds,
        notesLoaded: true,
        notesComplete: action.result.notes.length < 6,

        publishedStories: publishedStoryIds,
        publishedStoriesLoaded: true,
        publishedStoriesComplete: action.result.publishedStories.length < 6,

        recentFiles: recentFileIds,
        recentFilesLoaded: true,
        recentFilesComplete: action.result.recentFiles.length < 6,

        recentStories: recentStoryIds,
        recentStoriesLoaded: true,
        recentStoriesComplete: action.result.recentStories.length < 6,

        recentShares: recentShareIds,
        recentSharesLoaded: true,
        recentSharesComplete: action.result.recentShares.length < 6,

        stats: action.result.stats
      };
    }
    case LOAD_ME_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error
      };

    /* Bookmarks */
    case LOAD_BOOKMARKS:
      return {
        ...state,
        bookmarksLoading: true
      };
    case LOAD_BOOKMARKS_SUCCESS: {
      const bookmarkIds = action.result.map(b => b.id);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.bookmarks, bookmarkIds) : bookmarkIds;

      return {
        ...state,
        bookmarks: newOrder,
        bookmarksLoaded: true,
        bookmarksLoading: false,
        bookmarksComplete: action.result.length < globalFetchLimit,
        bookmarksError: null
      };
    }
    case LOAD_BOOKMARKS_FAIL:
      return {
        ...state,
        bookmarksLoaded: false,
        bookmarksLoading: false,
        bookmarksError: action.error
      };

    /* Recent Files */
    case LOAD_RECENT_FILES:
      return {
        ...state,
        recentFilesLoading: true
      };
    case LOAD_RECENT_FILES_SUCCESS: {
      const fileIds = action.result.map(f => f.id);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.recentFiles, fileIds) : fileIds;

      return {
        ...state,
        recentFiles: newOrder,
        recentFilesLoaded: true,
        recentFilesLoading: false,
        recentFilesComplete: action.result.length < globalFetchLimit,
        recentFilesError: null
      };
    }
    case LOAD_RECENT_FILES_FAIL:
      return {
        ...state,
        recentFilesLoaded: false,
        recentFilesLoading: false,
        recentFilesError: action.error,
      };

    /* Recommended Files */
    case LOAD_RECOMMENDED_FILES:
      return {
        ...state,
        recommendedFilesLoading: true
      };
    case LOAD_RECOMMENDED_FILES_SUCCESS: {
      const fileIds = action.result.map(f => f.id);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.recommendedFiles, fileIds) : fileIds;

      return {
        ...state,
        recommendedFiles: newOrder,
        recommendedFilesLoaded: true,
        recommendedFilesLoading: false,
        recommendedFilesComplete: action.result.length < globalFetchLimit,
        recommendedFilesError: null
      };
    }
    case LOAD_RECOMMENDED_FILES_FAIL:
      return {
        ...state,
        recommendedFilesLoaded: false,
        recommendedFilesLoading: false,
        recommendedFilesError: action.error,
      };

    /* Liked Stories */
    case LOAD_LIKED_STORIES:
      return {
        ...state,
        likedStoriesLoading: true
      };
    case LOAD_LIKED_STORIES_SUCCESS: {
      const storyIds = action.result.map(s => s.permId);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.likedStories, storyIds) : storyIds;

      return {
        ...state,
        likedStories: newOrder,
        likedStoriesLoaded: true,
        likedStoriesLoading: false,
        likedStoriesComplete: action.result.length < globalFetchLimit,
        likedStoriesError: null
      };
    }
    case LOAD_LIKED_STORIES_FAIL:
      return {
        ...state,
        likedStoriesLoaded: false,
        likedStoriesLoading: false,
        likedStoriesError: action.error,
      };

    /* Recent Stories */
    case LOAD_RECENT_STORIES:
      return {
        ...state,
        recentStoriesLoading: true
      };
    case LOAD_RECENT_STORIES_SUCCESS: {
      const storyIds = action.result.map(s => s.permId);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.recentStories, storyIds) : storyIds;

      return {
        ...state,
        recentStories: newOrder,
        recentStoriesLoaded: true,
        recentStoriesLoading: false,
        recentStoriesComplete: action.result.length < globalFetchLimit,
        recentStoriesError: null
      };
    }
    case LOAD_RECENT_STORIES_FAIL:
      return {
        ...state,
        recentStoriesLoaded: false,
        recentStoriesLoading: false,
        recentStoriesError: action.error,
      };

    /* Recommended Stories */
    case LOAD_RECOMMENDED_STORIES:
      return {
        ...state,
        recommendedStoriesLoading: true
      };
    case LOAD_RECOMMENDED_STORIES_SUCCESS: {
      const fileIds = action.result.map(f => f.id);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.recommendedStories, fileIds) : fileIds;

      return {
        ...state,
        recommendedStories: newOrder,
        recommendedStoriesLoaded: true,
        recommendedStoriesLoading: false,
        recommendedStoriesComplete: action.result.length < globalFetchLimit,
        recommendedStoriesError: null
      };
    }
    case LOAD_RECOMMENDED_STORIES_FAIL:
      return {
        ...state,
        recommendedStoriesLoaded: false,
        recommendedStoriesLoading: false,
        recommendedStoriesError: action.error,
      };

    /* Recommended Users */
    case LOAD_RECOMMENDED_USERS:
      return {
        ...state,
        recommendedUsersLoading: true
      };
    case LOAD_RECOMMENDED_USERS_SUCCESS: {
      const fileIds = action.result.map(f => f.id);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.recommendedUsers, fileIds) : fileIds;

      return {
        ...state,
        recommendedUsers: newOrder,
        recommendedUsersLoaded: true,
        recommendedUsersLoading: false,
        recommendedUsersComplete: action.result.length < globalFetchLimit,
        recommendedUsersError: null
      };
    }
    case LOAD_RECOMMENDED_USERS_FAIL:
      return {
        ...state,
        recommendedUsersLoaded: false,
        recommendedUsersLoading: false,
        recommendedUsersError: action.error,
      };

    /* Notes */
    case LOAD_NOTES:
      return {
        ...state,
        loaded: false,
        loading: true,
        notesLoading: true
      };
    case LOAD_NOTES_SUCCESS: {
      const noteIds = action.result.map(s => s.id);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.notes, noteIds) : noteIds;

      return {
        ...state,
        notes: newOrder,
        loaded: true,
        loading: false,
        notesLoaded: true,
        notesLoading: false,
        notesComplete: action.result.length < globalFetchLimit,
        notesError: null
      };
    }
    case LOAD_NOTES_FAIL:
      return {
        ...state,
        notesLoaded: false,
        notesLoading: false,
        notesError: action.error
      };

    /* Stories with Comments */
    case LOAD_STORIES_WITH_COMMENTS:
      return {
        ...state,
        storiesWithCommentsLoading: true
      };
    case LOAD_STORIES_WITH_COMMENTS_SUCCESS: {
      const storyIds = action.result.map(s => s.permId);

      // Merge array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.storiesWithComments, storyIds) : storyIds;

      return {
        ...state,
        storiesWithComments: newOrder,
        storiesWithCommentsLoaded: true,
        storiesWithCommentsLoading: false,
        storiesWithCommentsComplete: action.result.length < globalFetchLimit,
        storiesWithCommentsError: null
      };
    }
    case LOAD_STORIES_WITH_COMMENTS_FAIL:
      return {
        ...state,
        storiesWithCommentsLoaded: false,
        storiesWithCommentsLoading: false,
        storiesWithCommentsError: action.error
      };

    /* Shares */
    case LOAD_SHARES:
      return {
        ...state,
        sharesLoading: true
      };
    case LOAD_SHARES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(share));

      // Merge if loading more (offset > 0)
      const newOrder = action.offset ? union(state.shares, normalized.result) : normalized.result;

      return {
        ...state,
        shares: newOrder,
        sharesById: merge({}, { ...state.sharesById }, { ...normalized.entities.shares }),
        sharesLoaded: true,
        sharesLoading: false,
        sharesComplete: action.result.length < globalFetchLimit,
        sharesError: null
      };
    }
    case LOAD_SHARES_FAIL:
      return {
        ...state,
        sharesLoaded: false,
        sharesLoading: false,
        sharesError: action.error,
      };

    /* Share Details */
    case LOAD_SHARE_DETAILS: {
      return {
        ...state,
        sharesById: {
          ...state.sharesById,
          [action.shareId]: {
            ...state.sharesById[action.shareId],
            shareDetailsLoading: true
          }
        }
      };
    }
    case LOAD_SHARE_DETAILS_SUCCESS: {
      return {
        ...state,
        sharesById: {
          ...state.sharesById,
          [action.shareId]: {
            ...state.sharesById[action.shareId],
            ...action.result,
            shareDetailsLoading: false,
          }
        },
      };
    }
    case LOAD_SHARE_DETAILS_FAIL:
      return {
        ...state,
        sharesById: {
          ...state.sharesById,
          [action.shareId]: {
            ...state.sharesById[action.shareId],
            shareDetailsLoading: false,
          }
        }
      };

    /* Time on page of all users for selected file */
    case LOAD_USERS_TIME_ON_PAGE: {
      return {
        ...state,
        usersTimeOnPageStats: {
          ...state.usersTimeOnPageStats,
          [action.shareSessionId]: {
            ...state.usersTimeOnPageStats[action.shareSessionId],
            [action.fileId]: {
              usersTimeOnPageStatsLoading: true
            }
          }
        }
      };
    }

    case LOAD_USERS_TIME_ON_PAGE_SUCCESS: {
      return {
        ...state,
        usersTimeOnPageStats: {
          ...state.usersTimeOnPageStats,
          [action.shareSessionId]: {
            ...state.usersTimeOnPageStats[action.shareSessionId],
            [action.fileId]: {
              usersTimeOnPageStatsLoading: false,
              filePageStats: [...action.result]
            }
          }
        }
      };
    }

    case LOAD_USERS_TIME_ON_PAGE_FAIL: {
      return {
        ...state
      };
    }
    /* Selected User Time On Page Stats For Files */
    case LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES: {
      return {
        ...state,
        userTimeOnPageStatsForFiles: {
          ...state.userTimeOnPageStatsForFiles,
          [action.shareSessionId]: {
            ...state.userTimeOnPageStatsForFiles[action.shareSessionId],
            [action.userShareId]: {
              userTimeOnPageStatsForFilesLoading: true,
            }
          }
        },
      };
    }
    case LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_SUCCESS: {
      return {
        ...state,
        userTimeOnPageStatsForFiles: {
          ...state.userTimeOnPageStatsForFiles,
          [action.shareSessionId]: {
            ...state.userTimeOnPageStatsForFiles[action.shareSessionId],
            [action.userShareId]: {
              ...action.result,
              userTimeOnPageStatsForFilesLoading: false,
            }
          }
        },
      };
    }
    case LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_FAIL:
      return {
        ...state,
        userTimeOnPageStatsForFiles: {
          ...state.userTimeOnPageStatsForFiles,
          [action.shareSessionId]: {
            ...state.userTimeOnPageStatsForFiles[action.shareSessionId],
            [action.userShareId]: {
              userTimeOnPageStatsForFilesLoading: false,
            }
          }
        },
      };

    case SET_HUBSHARE_THUMBNAILS: {
      const {
        sharedFileId,
        thumbnails,
        fileCategory
      } = action;

      return {
        ...state,
        hubShareFileThumbnails: {
          ...state.hubShareFileThumbnails,
          [action.sharedFileId]: fileCategory === 'pdf' && state.hubShareFileThumbnails[sharedFileId] && _unionBy([...state.hubShareFileThumbnails[sharedFileId]], [...thumbnails], 'page') || [...thumbnails]
        }
      };
    }
    /**
     * UI only
     */
    case SET_SUMMARY_SCROLL_POSITION:
      return {
        ...state,
        ui: {
          ...state.ui,
          summaryScrollY: action.yPos
        }
      };

    case ADD_FILE_BOOKMARK_SUCCESS:
      return {
        ...state,
        bookmarks: [...state.bookmarks, action.result.id]
      };

    default:
      return state;
  }
}


/**
 * Me action creators
 */
export function load() {
  return {
    types: [LOAD_ME, LOAD_ME_SUCCESS, LOAD_ME_FAIL],
    promise: (client) => client.get('/me', 'webapi')
  };
}

export function loadBookmarks(offset = 0, limit = globalFetchLimit) {
  return {
    types: [LOAD_BOOKMARKS, LOAD_BOOKMARKS_SUCCESS, LOAD_BOOKMARKS_FAIL],
    offset,
    promise: (client) => client.get('/me/bookmarks', 'webapi', {
      params: {
        limit,
        offset: offset
      }
    }),
  };
}

export function loadNotes(offset = 0, sortBy = 'date_updated') {
  return {
    types: [LOAD_NOTES, LOAD_NOTES_SUCCESS, LOAD_NOTES_FAIL],
    offset,
    promise: (client) => client.get('/me/notes', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        sortBy: sortBy
      }
    }),
  };
}

export function loadRecentFiles(offset = 0, limit = globalFetchLimit) {
  return {
    types: [LOAD_RECENT_FILES, LOAD_RECENT_FILES_SUCCESS, LOAD_RECENT_FILES_FAIL],
    promise: (client) => client.get('/me/recentFiles', 'webapi', {
      params: {
        limit,
        offset: offset
      }
    }),
  };
}

export function loadRecommendedFiles(offset = 0, limit = globalFetchLimit) {
  return {
    types: [LOAD_RECOMMENDED_FILES, LOAD_RECOMMENDED_FILES_SUCCESS, LOAD_RECOMMENDED_FILES_FAIL],
    promise: (client) => client.get('/recommendation/get', 'webapi', {
      params: {
        type: 'file',
        limit,
        offset: offset
      }
    }),
  };
}

export function loadLikedStories(userId, offset = 0, limit = globalFetchLimit) {
  return {
    types: [LOAD_LIKED_STORIES, LOAD_LIKED_STORIES_SUCCESS, LOAD_LIKED_STORIES_FAIL],
    promise: (client) => client.get('/me/getLikedStories', 'webapi', {
      params: {
        id: userId,
        limit,
        offset: offset
      }
    }),
  };
}

export function loadRecentStories(offset = 0, limit = globalFetchLimit) {
  return {
    types: [LOAD_RECENT_STORIES, LOAD_RECENT_STORIES_SUCCESS, LOAD_RECENT_STORIES_FAIL],
    promise: (client) => client.get('/me/recentStories', 'webapi', {
      params: {
        limit,
        offset: offset
      }
    }),
  };
}

export function loadRecommendedStories(offset = 0) {
  return {
    types: [LOAD_RECOMMENDED_STORIES, LOAD_RECOMMENDED_STORIES_SUCCESS, LOAD_RECOMMENDED_STORIES_FAIL],
    promise: (client) => client.get('/recommendation/get', 'webapi', {
      params: {
        type: 'story',
        limit: globalFetchLimit,
        offset: offset
      }
    }),
  };
}

export function loadStoriesWithComments(offset = 0) {
  return {
    types: [LOAD_STORIES_WITH_COMMENTS, LOAD_STORIES_WITH_COMMENTS_SUCCESS, LOAD_STORIES_WITH_COMMENTS_FAIL],
    promise: (client) => client.get('/me/comments', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset
      }
    }),
  };
}

export function loadRecommendedUsers(offset = 0, limit = globalFetchLimit) {
  return {
    types: [LOAD_RECOMMENDED_USERS, LOAD_RECOMMENDED_USERS_SUCCESS, LOAD_RECOMMENDED_USERS_FAIL],
    promise: (client) => client.get('/recommendation/get', 'webapi', {
      params: {
        type: 'user',
        limit,
        offset: offset
      }
    }),
  };
}

/**
 * List of Shares
 */
export function loadShares(offset = 0) {
  return {
    types: [LOAD_SHARES, LOAD_SHARES_SUCCESS, LOAD_SHARES_FAIL],
    offset: offset,
    promise: (client) => client.get('/hubshareConsole/shares', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset
      }
    }),
  };
}

/**
 * Set Me (Summary) page scroll position
 */
export function setSummaryScrollPosition(yPos = 0) {
  return {
    type: SET_SUMMARY_SCROLL_POSITION,
    yPos
  };
}

/**
 * Load Selected Share details - time on page - Content Shared
 */
export function loadUsersTimeOnPageStatsForFile(shareId, fileId) {
  return {
    types: [LOAD_USERS_TIME_ON_PAGE, LOAD_USERS_TIME_ON_PAGE_SUCCESS, LOAD_USERS_TIME_ON_PAGE_FAIL],
    shareSessionId: shareId,
    fileId,
    promise: (client) => client.get('/timeOnPage/usersTimeOnPageStatsForFile', 'webapi', {
      params: {
        share_session_id: shareId,
        file_id: fileId
      }
    })
  };
}

/**
 * Load Selected Share details
 */
export function loadShareDetails(shareSessionId) {
  return {
    types: [LOAD_SHARE_DETAILS, LOAD_SHARE_DETAILS_SUCCESS, LOAD_SHARE_DETAILS_FAIL],
    shareId: shareSessionId,
    promise: (client) => client.get('/hubshareConsole/getShareDetails', 'webapi', {
      params: {
        share_session_id: shareSessionId,
      }
    }),
  };
}

/**
 * Load Selected User Time On Page Stats For Files - Viewers
 */
export function loadSelectedUserTimeOnPageStatsForFiles(shareSessionId, selectedUserShareId) {
  return {
    types: [LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES, LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_SUCCESS, LOAD_USER_TIME_ON_PAGE_STATS_FOR_FILES_FAIL],
    shareSessionId,
    userShareId: selectedUserShareId,
    promise: (client) => client.get('/timeOnPage/userTimeOnPageStatsForFiles', 'webapi', {
      params: {
        share_session_id: shareSessionId,
        user_share_id: selectedUserShareId
      }
    }),
  };
}

/**
 * Set Generated HubShare File Thumbnails
 */
export function setHubShareFileThumbnails(sharedFileId, thumbnails, fileCategory) {
  return {
    type: SET_HUBSHARE_THUMBNAILS,
    sharedFileId: sharedFileId,
    thumbnails,
    fileCategory
  };
}
