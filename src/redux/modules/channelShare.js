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
 * @author Shibu Bhattarai <Shibu.Bhattarai@bigtincan.com>
 */

import union from 'lodash/union';

const globalFetchLimit = 100;

export const SEARCH_PEOPLE = 'channelShare/SEARCH_PEOPLE';
export const SEARCH_PEOPLE_SUCCESS = 'channelShare/SEARCH_PEOPLE_SUCCESS';
export const SEARCH_PEOPLE_FAIL = 'channelShare/SEARCH_PEOPLE_FAIL';

export const SHARE_CHANNEL = 'channelShare/SEARCH_PEOPLE';
export const SHARE_CHANNEL_SUCCESS = 'channelShare/SHARE_CHANNEL_SUCCESS';
export const SHARE_CHANNEL_FAIL = 'channelShare/SHARE_CHANNEL_FAIL';

export const GET_SHARE_CHANNEL_USERS = 'channelShare/GET_SHARE_CHANNEL_USERS';
export const GET_SHARE_CHANNEL_USERS_SUCCESS = 'channelShare/GET_SHARE_CHANNEL_USERS_SUCCESS';
export const GET_SHARE_CHANNEL_USERS_FAIL = 'channelShare/GET_SHARE_CHANNEL_USERS_FAIL';


export const REMOVE_CHANNEL_SHARING = 'channelShare/REMOVE_CHANNEL_SHARING';
export const REMOVE_CHANNEL_SHARING_SUCCESS = 'channelShare/REMOVE_CHANNEL_SHARING_SUCCESS';
export const REMOVE_CHANNEL_SHARING_FAIL = 'channelShare/REMOVE_CHANNEL_SHARING_FAIL';
export const initialState = {
  keyword: '',
  peopleLoaded: false,
  peopleLoading: false,
  searchPeople: [],

  saving: false,
  saved: false,
  share: [],
  channelShareCompleteUserId: 0,


  shareUsersLoaded: false,
  shareUsersLoading: false,
  shareUsers: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH_PEOPLE:
      return {
        ...state,
        peopleLoading: true,
        peopleLoaded: false,
        channelShareCompleteUserId: 0
      };
    case SEARCH_PEOPLE_SUCCESS: {
      const userIds = action.result.map(u => u.id);
      const newOrder = action.params.offset ? union(state.people, userIds) : userIds;
      return {
        ...state,
        searchPeople: newOrder,
        peopleLoaded: true,
        peopleLoading: false,
        error: null
      };
    }
    case SEARCH_PEOPLE_FAIL:
      return {
        ...state,
        peopleLoading: false,
        peopleLoaded: false,
        error: action.error
      };
    case REMOVE_CHANNEL_SHARING:
    case SHARE_CHANNEL:
      return {
        ...state,
        channelShareCompleteUserId: 0
      };
    case REMOVE_CHANNEL_SHARING_SUCCESS:
    case SHARE_CHANNEL_SUCCESS: {
      return {
        ...state,
        channelShareCompleteUserId: action.params.userId,
        error: null
      };
    }
    case REMOVE_CHANNEL_SHARING_FAIL:
    case SHARE_CHANNEL_FAIL:
      return {
        ...state,
        channelShareCompleteUserId: 0,
        error: action.error
      };
    case GET_SHARE_CHANNEL_USERS:
      return {
        ...state,
        channelShareCompleteUserId: 0,
        shareUsersLoading: true,
        shareUsersLoaded: false
      };
    case GET_SHARE_CHANNEL_USERS_SUCCESS: {
      return {
        ...state,
        shareUsersLoading: false,
        shareUsersLoaded: true,
        shareUsers: action.result,
        error: null
      };
    }
    case GET_SHARE_CHANNEL_USERS_FAIL:
      return {
        ...state,
        channelShareCompleteUserId: 0,
        error: action.error
      };
    default:
      return state;
  }
}
export function searchPeople(params) {
  return {
    types: [SEARCH_PEOPLE, SEARCH_PEOPLE_SUCCESS, SEARCH_PEOPLE_FAIL],
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
export function shareChannel(params) {
  const url = `/shared-channels/${params.channelId}/users/${params.userId}`;
  return {
    types: [SHARE_CHANNEL, SHARE_CHANNEL_SUCCESS, SHARE_CHANNEL_FAIL],
    params: params,
    promise: (client) => client.put(url, 'webapi', {
      params: {
        canPublish: params.canPublish,
        canInvite: params.canInvite
      }
    })
  };
}
export function getShareChannelUsers(channelId) {
  const url = `/shared-channels/${channelId}/users`;
  return {
    types: [GET_SHARE_CHANNEL_USERS, GET_SHARE_CHANNEL_USERS_SUCCESS, GET_SHARE_CHANNEL_USERS_FAIL],
    params: {
      channelId: channelId
    },
    promise: (client) => client.get(url, 'webapi')
  };
}
export function removeChannelSharing(channelId, userId) {
  const url = `/shared-channels/${channelId}/users/${userId}`;
  return {
    types: [REMOVE_CHANNEL_SHARING, REMOVE_CHANNEL_SHARING_SUCCESS, REMOVE_CHANNEL_SHARING_FAIL],
    params: {
      userId
    },
    promise: (client) => client.del(url, 'webapi')
  };
}
