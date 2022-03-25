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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import union from 'lodash/union';

const globalFetchLimit = 100;

export const LOAD_PEOPLE = 'people/LOAD_PEOPLE';
export const LOAD_PEOPLE_SUCCESS = 'people/LOAD_PEOPLE_SUCCESS';
export const LOAD_PEOPLE_FAIL = 'people/LOAD_PEOPLE_FAIL';

export const LOAD_RECOMMENDATIONS = 'RECOMMENDATIONS/LOAD_RECOMMENDATIONS';
export const LOAD_RECOMMENDATIONS_SUCCESS = 'RECOMMENDATIONS/LOAD_RECOMMENDATIONS_SUCCESS';
export const LOAD_RECOMMENDATIONS_FAIL = 'RECOMMENDATIONS/LOAD_RECOMMENDATIONS_FAIL';

export const CLEAR_RESULTS = 'people/CLEAR_RESULTS';
export const SET_KEYWORD = 'people/SET_KEYWORD';

export const initialState = {
  keyword: '',

  // sets people
  peopleLoaded: false,
  peopleLoading: false,
  peopleLoadingMore: false,
  peopleComplete: false,

  // sets featured & similar
  recommendationsLoaded: false,
  recommendationsLoading: false,

  people: [],
  featured: [],
  similar: [],

  allPeopleLoaded: false // will not fetch users if allPeopleLoaded is `true`
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_PEOPLE:
      return {
        ...state,
        peopleLoading: !state.peopleLoaded,
        peopleLoadingMore: state.peopleLoaded
      };
    case LOAD_PEOPLE_SUCCESS: {
      const userIds = action.result.map(u => u.id);

      // Merge users array if loading more (offset > 0)
      const newOrder = action.params.offset ? union(state.people, userIds) : userIds;

      return {
        ...state,
        people: newOrder,
        peopleLoaded: true,
        peopleLoading: false,
        peopleLoadingMore: false,
        peopleComplete: action.result.length < globalFetchLimit,
        error: null,
        allPeopleLoaded: userIds.length === 0 // stop sending new API request to fetch users
      };
    }
    case LOAD_PEOPLE_FAIL:
      return {
        ...state,
        peopleLoading: false,
        peopleLoaded: false,
        peopleError: action.error,
      };

    case LOAD_RECOMMENDATIONS:
      return {
        ...state,
        recommendationsLoading: true
      };
    case LOAD_RECOMMENDATIONS_SUCCESS: {
      const featuredUserIds = action.result.featured_users.map(u => u.id);
      const similarUserIds = action.result.similar_users.map(u => u.id);

      return {
        ...state,
        recommendationsLoading: false,
        recommendationsLoaded: true,
        featured: featuredUserIds,
        similar: similarUserIds
      };
    }
    case LOAD_RECOMMENDATIONS_FAIL:
      return {
        ...state,
        recommendationsLoading: false,
        recommendationsLoaded: false,
        recommendationsError: action.error
      };

    case CLEAR_RESULTS:
      return {
        ...state,
        people: [],

        peopleComplete: false,
        peopleLoadingMore: false,
        peopleLoading: false,
        peopleLoaded: false,
        peopleError: null
      };
    case SET_KEYWORD:
      return {
        ...state,
        keyword: action.keyword,
      };
    default:
      return state;
  }
}

export function loadRecommendations() {
  return {
    types: [LOAD_RECOMMENDATIONS, LOAD_RECOMMENDATIONS_SUCCESS, LOAD_RECOMMENDATIONS_FAIL],
    promise: (client) => client.get('/user/recommendations', 'webapi')
  };
}

export function loadPeople(params) {
  return {
    types: [LOAD_PEOPLE, LOAD_PEOPLE_SUCCESS, LOAD_PEOPLE_FAIL],
    params: params,
    promise: (client) => client.get('/user/all', 'webapi', {
      params: {
        search: params.keyword,
        limit: globalFetchLimit,
        offset: params.offset || 0,
      }
    })
  };
}

export function clearResults() {
  return {
    type: CLEAR_RESULTS
  };
}

export function setPeopleKeyword(keyword) {
  return {
    type: SET_KEYWORD,
    keyword: keyword,
  };
}
