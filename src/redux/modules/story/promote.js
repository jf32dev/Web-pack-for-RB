
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
import union from 'lodash/union';

const globalFetchLimit = 100;

export const SET_DATA = 'promote/SET_DATA';

export const PROMOTE = 'promote/PROMOTE_SHARE';
export const PROMOTE_SUCCESS = 'promote/PROMOTE_SUCCESS';
export const PROMOTE_FAIL = 'promote/PROMOTE_FAIL';

export const SEARCH_GROUPS = 'promote/SEARCH_GROUPS';
export const SEARCH_GROUPS_SUCCESS = 'promote/SEARCH_GROUPS_SUCCESS';
export const SEARCH_GROUPS_FAIL = 'promote/SEARCH_GROUPS_FAIL';

export const SEARCH_USERS = 'promote/SEARCH_USERS';
export const SEARCH_USERS_SUCCESS = 'promote/SEARCH_USERS_SUCCESS';
export const SEARCH_USERS_FAIL = 'promote/SEARCH_USERS_FAIL';

export const ADD_CONTACT = 'promote/ADD_CONTACT';
export const ADD_MULTIPLE_CONTACT = 'promote/ADD_MULTIPLE_CONTACT';
export const REMOVE_CONTACT_BY_ID = 'promote/REMOVE_CONTACT_BY_ID';

export const RESET = 'promote/RESET';
export const RESET_LIST = 'promote/RESET_LIST';

export const initialState = {
  id: 0,
  toAll: true,
  toAddress: [],
  title: '',
  message: '',

  isVisible: false,

  saving: false,
  saved: false,
  error: {},

  groups: [],
  groupsLoaded: false,
  groupsLoading: false,
  groupsLoadingMore: false,
  groupsComplete: false,

  users: [],
  usersLoaded: false,
  usersLoading: false,
  usersLoadingMore: false,
  usersComplete: false,
};

export default function promote(state = initialState, action = {}) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        ...action.data
      };

    case PROMOTE:
      return { ...state,
        sending: true,
        sent: false,
      };
    case PROMOTE_SUCCESS:
      return { ...state,
        saving: false,
        saved: true,
        title: '',
        message: '',
        toAddress: [],
        isVisible: false,
      };
    case PROMOTE_FAIL:
      return {
        ...state,
        saving: false,
        saved: false,
        error: action.error
      };

    case RESET_LIST:
      return { ...state,
        users: [],
        usersLoaded: false,
        usersLoading: false,
        usersError: false,

        groups: [],
        groupsLoaded: false,
        groupsLoading: false,
        groupsError: false,
      };

    case RESET:
      return { ...initialState,
        id: 0,
        toAll: true,
        toAddress: [],
        title: '',
        message: '',

        isVisible: false,

        saving: false,
        saved: false,
        error: {},

        users: [],
        usersLoaded: false,
        usersLoading: false,
        usersError: false,

        groups: [],
        groupsLoaded: false,
        groupsLoading: false,
        groupsError: false,
      };

    case ADD_CONTACT: {
      let list = [...state[action.attribute]];
      const contact = list.find(item => item.id === action.data.id && item.type === action.data.type);
      if (contact) {
        contact.deleted = false;
      } else {
        list = [...state[action.attribute], action.data];
      }
      return {
        ...state,
        [action.attribute]: list
      };
    }

    case ADD_MULTIPLE_CONTACT:
      return {
        ...state,
        [action.attribute]: [...state[action.attribute], ...action.data]
      };

    case REMOVE_CONTACT_BY_ID: {
      const list = state.toAddress;
      const data = {};
      const contact = list.find(item => +item.id === +action.params.id && item.type === action.params.type);
      contact.deleted = true;
      data.toAddress = [...list];

      return {
        ...state,
        ...data,
      };
    }

    case SEARCH_USERS:
    case SEARCH_GROUPS:
      return {
        ...state,
        usersLoading: action.type === SEARCH_USERS ? !state.usersLoaded : state.usersLoading,
        usersLoadingMore: action.type === SEARCH_USERS && action.params.offset ? true : state.usersLoadingMore,
        groupsLoading: action.type === SEARCH_GROUPS ? !state.groupsLoaded : state.groupsLoading,
        groupsLoadingMore: action.type === SEARCH_GROUPS && action.params.offset ? true : state.groupsLoadingMore
      };
    case SEARCH_GROUPS_SUCCESS: {
      return {
        ...state,
        groups: action.params.offset ? union(state.groups, action.result) : action.result,
        groupsLoaded: true,
        groupsLoading: false,
        groupsLoadingMore: false,
        groupsComplete: action.result.length < globalFetchLimit,
        error: {}
      };
    }
    case SEARCH_USERS_SUCCESS: {
      return {
        ...state,
        users: action.params.offset ? union(state.users, action.result) : action.result,
        usersLoaded: true,
        usersLoading: false,
        usersLoadingMore: false,
        usersComplete: action.result.length < globalFetchLimit,
        error: {}
      };
    }
    case SEARCH_USERS_FAIL:
    case SEARCH_GROUPS_FAIL:
      return {
        ...state,
        usersLoading: action.type === SEARCH_USERS_FAIL ? false : state.usersLoading,
        usersLoaded: action.type === SEARCH_USERS_FAIL ? false : state.usersLoaded,
        groupsLoading: action.type === SEARCH_GROUPS_FAIL ? false : state.groupsLoading,
        groupsLoaded: action.type === SEARCH_GROUPS_FAIL ? false : state.groupsLoaded,
        error: action.error,
      };

    default:
      return state;
  }
}

export function setData(data) {
  return {
    type: SET_DATA,
    data
  };
}

export function sendPromote(data) {
  // Attach Story ID
  const promoteData = {
    id: data.id
  };
  const toEmailList = [];
  const groupIds = [];

  const setType = function (id, email, type) {
    switch (type) {
      case 'group':
        groupIds.push(id);
        break;
      case 'user':
      default:
        toEmailList.push(email || id);
        break;
    }
  };

  if (data.toAddress && data.toAddress.length) {
    data.toAddress.forEach(({ id, email, type }) => {
      setType(id, email, type);
    });
  }

  if (!data.toAll) {
    if (toEmailList.length) promoteData.emails = JSON.stringify(toEmailList);
    if (groupIds.length) promoteData.groupIds = JSON.stringify(groupIds);
  }
  if (data.title) promoteData.title = data.title;
  if (data.message) promoteData.note = data.message;

  return {
    types: [PROMOTE, PROMOTE_SUCCESS, PROMOTE_FAIL],
    promise: (client) => client.post('/story/promote', 'webapi', {
      data: promoteData
    }),
  };
}
export function reset() {
  return {
    type: RESET
  };
}

export function resetLists() {
  return {
    type: RESET_LIST
  };
}

export function searchUsers(params) {
  return {
    types: [SEARCH_USERS, SEARCH_USERS_SUCCESS, SEARCH_USERS_FAIL],
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

export function searchGroups(params) {
  return {
    types: [SEARCH_GROUPS, SEARCH_GROUPS_SUCCESS, SEARCH_GROUPS_FAIL],
    params: params,
    promise: (client) => client.get(`/user/${params.userId}/groups`, 'webapi', {
      params: {
        id: params.userId,
        search: params.keyword,
        limit: globalFetchLimit,
        offset: params.offset || 0,
      }
    })
  };
}

export function addContact(data, attribute) {
  return {
    type: ADD_CONTACT,
    data,
    attribute: attribute,
  };
}
export function addMultipleContact(data, attribute) {
  return {
    type: ADD_MULTIPLE_CONTACT,
    data,
    attribute: attribute,
  };
}

export function removeContactById(id, type) {
  return {
    type: REMOVE_CONTACT_BY_ID,
    params: {
      id: id,
      type: type
    }
  };
}
