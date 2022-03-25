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

import snakeCase from 'lodash/snakeCase';
import union from 'lodash/union';

const globalFetchLimit = 100;

export const LOAD_COMPANY_ALL = 'company/LOAD_COMPANY_ALL';
export const LOAD_COMPANY_ALL_SUCCESS = 'company/LOAD_COMPANY_ALL_SUCCESS';
export const LOAD_COMPANY_ALL_FAIL = 'company/LOAD_COMPANY_ALL_FAIL';

export const LOAD_COMPANY_STORIES = 'company/LOAD_COMPANY_STORIES';
export const LOAD_COMPANY_STORIES_SUCCESS = 'company/LOAD_COMPANY_STORIES_SUCCESS';
export const LOAD_COMPANY_STORIES_FAIL = 'company/LOAD_COMPANY_STORIES_FAIL';

export const LOAD_COMPANY_USERS = 'company/LOAD_COMPANY_USERS';
export const LOAD_COMPANY_USERS_SUCCESS = 'company/LOAD_COMPANY_USERS_SUCCESS';
export const LOAD_COMPANY_USERS_FAIL = 'company/LOAD_COMPANY_USERS_FAIL';

export const LOAD_WEBSITES = 'company/LOAD_WEBSITES';
export const LOAD_WEBSITES_SUCCESS = 'company/LOAD_WEBSITES_SUCCESS';
export const LOAD_WEBSITES_FAIL = 'company/LOAD_WEBSITES_FAIL';

export const DELETE_WEBSITE = 'company/DELETE_WEBSITE';

export const SET_FEATURED_SCROLL_POSITION = 'company/SET_FEATURED_SCROLL_POSITION';

export const CAPTURE_HOMESCREEN_VIEWS = 'company/CAPTURE_HOMESCREEN_VIEWS';

export const initialState = {
  ui: {
    featuredScrollY: 0
  },

  allLoaded: false,
  allLoading: false,
  allError: null,

  // Stories
  featuredStoriesLoading: false,
  featuredStoriesLoaded: false,
  featuredStoriesError: null,
  featuredStories: [],

  latestStoriesStoriesLoading: false,
  latestStoriesStoriesLoaded: false,
  latestStoriesStoriesError: null,
  latestStoriesStories: [],

  myMostViewedStoriesLoading: false,
  myMostViewedStoriesLoaded: false,
  myMostViewedStoriesError: null,
  myMostViewedStories: [],

  topStoriesLoading: false,
  topStoriesLoaded: false,
  topStoriesError: null,
  topStories: [],

  // Users
  leaderboardLoading: false,
  leaderboardLoaded: false,
  leaderboardError: null,
  leaderboard: [],

  myTopUsersLoading: false,
  myTopUsersLoaded: false,
  myTopUsersError: null,
  myTopUsers: [],

  // Web
  webComplete: false,
  webLoaded: false,
  webLoading: false,
  websites: []
};

export default function company(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_COMPANY_ALL:
      return {
        ...state,
        allLoading: true
      };
    case LOAD_COMPANY_ALL_SUCCESS: {
      // Stories - note permId
      const featuredStories = action.result.featured_stories.map(s => s.permId);
      const latestStories = action.result.latest_stories.map(s => s.permId);
      const myRecommendedStories = action.result.my_recommended_stories.map(s => s.permId);
      const myMostViewedStories = action.result.my_most_viewed_stories.map(s => s.permId);
      const topStories = action.result.top_stories.map(s => s.permId);

      // Users
      const leaderboard = action.result.leaderboard.map(u => u.id);
      const myTopUsers = action.result.my_top_users.map(u => u.id);

      return {
        ...state,
        allLoaded: true,
        allLoading: false,
        allError: null,

        featuredStories,
        latestStories,
        myRecommendedStories,
        myMostViewedStories,
        topStories,
        leaderboard,
        myTopUsers
      };
    }
    case LOAD_COMPANY_ALL_FAIL:
      return {
        ...state,
        allLoaded: false,
        allLoading: false,
        allError: action.error
      };

    case LOAD_COMPANY_STORIES:
      return {
        ...state,
        [action.name + 'Loading']: true
      };
    case LOAD_COMPANY_STORIES_SUCCESS: {
      const storyIds = action.result.map(s => s.permId);
      return {
        ...state,
        [action.name]: storyIds,
        [action.name + 'Loaded']: true,
        [action.name + 'Loading']: false,
        [action.name + 'Error']: null
      };
    }
    case LOAD_COMPANY_STORIES_FAIL:
      return {
        ...state,
        [action.name + 'Loading']: false,
        [action.name + 'Error']: action.error
      };

    case LOAD_COMPANY_USERS:
      return {
        ...state,
        [action.name + 'Loading']: true
      };
    case LOAD_COMPANY_USERS_SUCCESS: {
      const userIds = action.result.map(u => u.id);
      return {
        ...state,
        [action.name]: userIds,
        [action.name + 'Loaded']: true,
        [action.name + 'Loading']: false,
        [action.name + 'Error']: null
      };
    }
    case LOAD_COMPANY_USERS_FAIL:
      return {
        ...state,
        [action.name + 'Loading']: false,
        [action.name + 'Error']: action.error
      };

    case LOAD_WEBSITES:
      return {
        ...state,
        webLoading: true
      };
    case LOAD_WEBSITES_SUCCESS: {
      const ids = action.result.map(w => w.id);
      return {
        ...state,
        websites: union(state.websites, ids),
        webComplete: action.result.length < globalFetchLimit,
        webLoaded: true,
        webLoading: false,
        webError: null
      };
    }
    case LOAD_WEBSITES_FAIL:
      return {
        ...state,
        webLoaded: false,
        webLoading: false,
        webError: action.error
      };

    /**
     * UI only
     */
    case SET_FEATURED_SCROLL_POSITION:
      return {
        ...state,
        ui: {
          ...state.ui,
          featuredScrollY: action.yPos
        }
      };

    default:
      return state;
  }
}

/* Action Creators */

/**
 * Load Featured Company Content (Stories/Users)
 */
export function loadCompanyAll(showHiddenChannels = false) {
  return {
    types: [LOAD_COMPANY_ALL, LOAD_COMPANY_ALL_SUCCESS, LOAD_COMPANY_ALL_FAIL],
    promise: (client) => client.get('/company/home', 'webapi', {
      params: {
        show_hidden_channels: +showHiddenChannels  // 0/1
      }
    })
  };
}

/**
 * Stories Lists
 * valid types:
 *   featuredStories
 *   latestStories
 *   myMostViewedStories
 *   myRecommendedStories
 *   topStories
 *   popularStories
 */
export function loadCompanyStories(name = 'featuredStories', showHiddenChannels = false) {
  //Use new Story Recommender api for myRecommendedStories
  const path = name === 'myRecommendedStories' ? '/recommendation/stories' : '/company/' + snakeCase(name);

  return {
    types: [LOAD_COMPANY_STORIES, LOAD_COMPANY_STORIES_SUCCESS, LOAD_COMPANY_STORIES_FAIL],
    name,
    promise: (client) => client.get(path, 'webapi', {
      params: {
        show_hidden_channels: +showHiddenChannels  // 0/1
      }
    })
  };
}

/**
 * Users Lists
 * valid types:
 *   leaderboard
 *   myTopUsers
 */
export function loadCompanyUsers(name = 'leaderboard') {
  const path = '/company/' + snakeCase(name);
  return {
    types: [LOAD_COMPANY_USERS, LOAD_COMPANY_USERS_SUCCESS, LOAD_COMPANY_USERS_FAIL],
    name,
    promise: (client) => client.get(path, 'webapi')
  };
}

/**
 * Load Websites
 */
export function loadWeb(offset) {
  return {
    types: [LOAD_WEBSITES, LOAD_WEBSITES_SUCCESS, LOAD_WEBSITES_FAIL],
    promise: (client) => client.get('/company/web', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset || 0
      }
    })
  };
}

/**
 * Delete Website
 * TODO: move to entities reducer
 */
export function deleteWebSite(id) {
  return {
    types: [DELETE_WEBSITE, null, null],
    id: id,
    attrs: { deleted: true },
    promise: (client) => client.post('/me/deleteWebSite', 'webapi', {
      params: {
        id: id
      }
    })
  };
}

/**
 * Set Featured page scroll position
 */
export function setFeaturedScrollPosition(yPos = 0) {
  return {
    type: SET_FEATURED_SCROLL_POSITION,
    yPos
  };
}

/**
 * @param  {} viewType
 * @param  {} relatedRecordId
 */
export function recordHomeScreenViews(viewType, relatedRecordId) {
  return {
    types: [CAPTURE_HOMESCREEN_VIEWS, null, null],
    promise: (client) => client.post('/view/interaction', 'webapi', {
      body: {
        viewType,
        relatedRecordId
      }
    })
  };
}
