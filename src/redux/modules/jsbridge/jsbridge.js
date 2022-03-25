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

import union from 'lodash/union';
import parseResult, {
  parseEntity,
  parseEventsResult,
  parseSearchResult,
  parseFilesGetListResult,
  parseFileSearchResult,
  parseStorySearchResult,
  parseGetFeaturedList,
  parseGetListResult
} from './helpers/helpers';

import {
  JSBRIDGE_REQUEST,
  JSBRIDGE_SUCCESS,
  JSBRIDGE_ERROR,
  POST_MESSAGE,
  POST_MESSAGE_ERROR
} from './actions';

export const appState = {
  requests: [],
  requestsById: {},
  responsesById: {}
};

export function appReducer(state = appState, action = {}) {
  const { requestId } = action.data.data;

  switch (action.type) {
    case JSBRIDGE_REQUEST:
      return {
        ...state,
        requests: union(state.requests, [requestId]),
        requestsById: {
          ...state.requestsById,
          [requestId]: {
            ...action.data
          }
        }
      };
    case JSBRIDGE_SUCCESS: {
      // Make sure we are dealing with valid data
      if (!action.data.data || !action.data.data.action) {
        return state;
      }

      // reducer action creator success
      // request has not been stored
      let newRequests = state.requests;
      if (!state.requests[requestId]) {
        newRequests = {
          requests: union(state.requests, [requestId]),
          requestsById: {
            ...state.requestsById,
            [requestId]: {
              ...action.data
            }
          }
        };
      }

      // Parse result
      let result = action.result;
      const apiAction = action.data.data.action;
      const params = action.data.data.params ? action.data.data.params : null;
      switch (apiAction) {
        case 'openEntity':
          if (params.entityName === 'channel') {
            result = action.result;
          } else {
            result = parseEntity(action.result, true);  // returns full record
          }
          break;
        case 'createComment':
        case 'createCommentReply':
          result = {
            id: action.result.id,
            isPending: false
          };
          break;
        case 'createStory':
        case 'editStory':
          result = {
            ...parseEntity(action.result, true),
            isPending: false
          };
          break;

        case 'getDraftList':
          result = [];  // not supported on web
          break;
        case 'getEntity':
          result = parseEntity(action.result, true);  // returns full record
          break;
        case 'getEvents':
          result = parseEventsResult(action.result, false);
          break;
        case 'getList':
        case 'getBookmarkList':
        case 'getNewList':
        case 'getRecommendedList':
        case 'getInterestAreas':
          // Parse files from /story/get result
          if (apiAction === 'getList' && params.entityName === 'file') {
            result = parseFilesGetListResult(action.result.files.slice(params.offset, params.limit), action.result, true);

            // Parse story using new Story objects
          } else if (apiAction === 'getList' && params.entityName === 'story' && params.includeAttributes) {
            result = parseGetListResult(action.result, false, params.includeAttributes);

            // ALl other results
          } else {
            result = parseResult(apiAction, params, action.result, true);
          }

          break;
        case 'searchResult': {
          let searchResults = {};
          if (params.type && params.type !== 'all' || !params.type) {
            const type = params.type === 'tags' || !params.type ? 'stories' : params.type;
            searchResults[type] = action.result;
          } else {
            searchResults = action.result;
          }
          result = parseSearchResult(searchResults);
          break;
        }

        case 'addInterestArea':
        case 'removeInterestArea':
          result = {
            id: params.id,
            isSubscribed: !!action.result.selected  // 0/1 => true/false
          };
          break;
        case 'followUser':
        case 'unfollowUser':
          result = {
            id: params.userId,
            isFollowed: !!action.result.follow  // 0/1 => true/false
          };
          break;
        case 'subscribeStory':
        case 'unsubscribeStory':
          result = {
            id: action.result.permId,
            isSubscribed: action.result.isSubscribed
          };
          break;
        case 'likeStory':
        case 'unlikeStory':
          result = {
            id: action.result.permId,
            isLiked: action.result.isLiked
          };
          break;
        case 'rateStory':
          result = {
            id: action.result.permId,
            score: action.result.rating
          };
          break;
        case 'searchStories': {
          result = parseStorySearchResult(action.result);
          break;
        }
        case 'searchFiles': {
          result = parseFileSearchResult(action.result);
          break;
        }
        case 'getFeaturedList': {
          result = parseGetFeaturedList(params, action.result);
          break;
        }

        default:
          break;
      }

      return {
        ...state,
        ...newRequests,
        responsesById: {
          ...state.responsesById,
          [requestId]: {
            result: result,
            error: action.error,
            sent: false
          }
        }
      };
    }

    case JSBRIDGE_ERROR: {
      // reducer action creator error
      // request has not been stored
      let newRequests = state.requests;
      if (!state.requests[requestId]) {
        newRequests = {
          requests: union(state.requests, [requestId]),
          requestsById: {
            ...state.requestsById,
            [requestId]: {
              ...action.data
            }
          }
        };
      }

      // API error
      const newState = {
        ...state,
        ...newRequests,

        // New responses
        responsesById: {
          ...state.responsesById,
          [requestId]: {
            result: null,
            error: action.error
          }
        }
      };

      return newState;
    }

    case POST_MESSAGE:
      return {
        ...state,
        responsesById: {
          ...state.responsesById,
          [requestId]: {
            ...state.responsesById[requestId],
            sent: true
          }
        }
      };

    case POST_MESSAGE_ERROR:
      return {
        ...state,
        responsesById: {
          ...state.responsesById,
          [requestId]: {
            ...state.responsesById[requestId],
            result: [],
            error: action.error,
            sent: true
          }
        }
      };

    default:
      return state;
  }
}

export default function reducer(state = {}, action = {}) {
  if (action.data && action.data.handle) {
    return {
      ...state,
      [action.data.handle]: appReducer(state[action.data.handle], action)
    };
  }
  return state;
}
