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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import union from 'lodash/union';
import { normalize, Schema, arrayOf } from 'normalizr';

const story = new Schema('stories', { idAttribute: 'permId' });

/**
 * Action Types
 */
export const LOAD_ARCHIVED_STORIES = 'admin/stories/LOAD_ARCHIVED_STORIES';
export const LOAD_ARCHIVED_STORIES_SUCCESS = 'admin/stories/LOAD_ARCHIVED_STORIES_SUCCESS';
export const LOAD_ARCHIVED_STORIES_FAIL = 'admin/stories/LOAD_ARCHIVED_STORIES_FAIL';

export const GET_TAGGING_GUIDELINES = 'admin/stories/GET_TAGGING_GUIDELINES';
export const GET_TAGGING_GUIDELINES_SUCCESS = 'admin/stories/GET_TAGGING_GUIDELINES_SUCCESS';
export const GET_TAGGING_GUIDELINES_FAIL = 'admin/stories/GET_TAGGING_GUIDELINES_FAIL';

export const GET_ARCHIVING = 'admin/stories/GET_ARCHIVING';
export const GET_ARCHIVING_SUCCESS = 'admin/stories/GET_ARCHIVING_SUCCESS';
export const GET_ARCHIVING_FAIL = 'admin/stories/GET_ARCHIVING_FAIL';

export const GET_DEFAULTS = 'admin/stories/GET_DEFAULTS';
export const GET_DEFAULTS_SUCCESS = 'admin/stories/GET_DEFAULTS_SUCCESS';
export const GET_DEFAULTS_FAIL = 'admin/stories/GET_DEFAULTS_FAIL';

export const UPDATE_STORIES = 'admin/UPDATE_STORIES';
export const UPDATE_STORIES_SUCCESS = 'admin/UPDATE_STORIES_SUCCESS';
export const UPDATE_STORIES_FAIL = 'admin/UPDATE_STORIES_FAIL';

export const GET_GENERAL = 'admin/stories/GET_GENERAL';
export const GET_GENERAL_SUCCESS = 'admin/stories/GET_GENERAL_SUCCESS';
export const GET_GENERAL_FAIL = 'admin/stories/GET_GENERAL_FAIL';

export const SET_DATA = 'admin/education/SET_DATA';

export const CLOSE = 'admin/stories/CLOSE';

export const GENERAL = 'general';

// Reduce to 60 to improve server performance in archived
const globalFetchLimit = 60;

/**
 * Initial State
 */
export const initialState = {
  archivedStories: [],
  archivedStoriesComplete: false,
  filterValue: '',

  loaded: false,
  loading: true,
  updated: false,
  updating: false,
  error: null,
};

/**
 * Reducer
 */
export default function adminStories(state = initialState, action = {}) {
  const loadingTrueList = [
    GET_GENERAL,
    GET_ARCHIVING,
    GET_DEFAULTS,
    LOAD_ARCHIVED_STORIES,
    GET_TAGGING_GUIDELINES
  ];

  const loadedTrueList = [
    GET_GENERAL_SUCCESS,
    GET_ARCHIVING_SUCCESS,
    GET_DEFAULTS_SUCCESS
  ];

  switch (action.type) {
    case GET_ARCHIVING:
    case UPDATE_STORIES:
    case GET_DEFAULTS:
    case GET_GENERAL:
    case LOAD_ARCHIVED_STORIES:
    case GET_TAGGING_GUIDELINES:
      return {
        ...state,
        loaded: !!action.offset,
        loading: loadingTrueList.indexOf(action.type) > -1,
        updated: false,
        updating: action.type === UPDATE_STORIES,
        error: null,
        filterValue: action.type === LOAD_ARCHIVED_STORIES ? action.filterValue : state.filterValue
      };
    case GET_ARCHIVING_SUCCESS:
    case UPDATE_STORIES_SUCCESS:
    case GET_DEFAULTS_SUCCESS:
    case GET_TAGGING_GUIDELINES_SUCCESS:
    case GET_GENERAL_SUCCESS: {
      return {
        ...state,
        loaded: loadedTrueList.indexOf(action.type) > -1,
        loading: false,
        updated: action.type === UPDATE_STORIES_SUCCESS,
        updating: false,
        ...action.result
      };
    }
    case GET_ARCHIVING_FAIL:
    case UPDATE_STORIES_FAIL:
    case GET_DEFAULTS_FAIL:
    case GET_GENERAL_FAIL:
    case LOAD_ARCHIVED_STORIES_FAIL:
    case GET_TAGGING_GUIDELINES_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        error: action.error,
      };

    case LOAD_ARCHIVED_STORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));

      // Merge stories array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.archivedStories, normalized.result) : normalized.result;

      return {
        ...state,
        error: null,
        loaded: true,
        loading: false,

        archivedStoriesComplete: action.result.length < globalFetchLimit,
        archivedStories: newOrder
      };
    }

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    case CLOSE:
      return initialState;

    default:
      return state;
  }
}
/**
 * Action Creators
 */
export function getArchivedStories(offset = 0, filterValue) {
  const path = '/admin/stories/archived';
  return {
    types: [LOAD_ARCHIVED_STORIES, LOAD_ARCHIVED_STORIES_SUCCESS, LOAD_ARCHIVED_STORIES_FAIL],
    offset: offset,
    filterValue: filterValue,
    promise: (client) => client.get(path, 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        filter: filterValue
      }
    })
  };
}

export function getStories(name) {
  const path = `/admin/stories/${name}/get`;
  const type = `admin/stories/GET_${name.toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function updateStories(update) {
  const path = '/admin/stories/setsetting';

  return {
    types: [UPDATE_STORIES, UPDATE_STORIES_SUCCESS, UPDATE_STORIES_FAIL],
    ...update,
    promise: (client) => client.post(path, 'webapi', {
      params: {
        param: Object.keys(update)[0],
        value: update[Object.keys(update)[0]],
      },
    })
  };
}

export function updateStoriesByName(update, name) {
  const path = `/admin/stories/${name}/set`;

  return {
    types: [UPDATE_STORIES, UPDATE_STORIES_SUCCESS, UPDATE_STORIES_FAIL],
    ...update,
    promise: (client) => client.post(path, 'webapi', {
      params: {
        param: Object.keys(update)[0],
        value: update[Object.keys(update)[0]],
      },
    })
  };
}

export function setSetting(update) {
  const path = '/admin/stories/setsetting';

  return {
    types: [UPDATE_STORIES, UPDATE_STORIES_SUCCESS, UPDATE_STORIES_FAIL],
    promise: (client) => client.post(path, 'webapi', {
      params: {
        param: Object.keys(update)[0],
        value: update[Object.keys(update)[0]],
      },
    })
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}

export function getTaggingGuidelines() {
  const path = '/companies/tagging-guidelines';

  return {
    types: [GET_TAGGING_GUIDELINES, GET_TAGGING_GUIDELINES_SUCCESS, GET_TAGGING_GUIDELINES_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function updateTaggingGuidelines(data) {
  const path = '/companies/tagging-guidelines';

  return {
    types: [GET_TAGGING_GUIDELINES, GET_TAGGING_GUIDELINES_SUCCESS, GET_TAGGING_GUIDELINES_FAIL],
    promise: (client => client.patch(path, 'webapi', {
      body: JSON.stringify({ taggingGuidelines: data })
    }))
  };
}
