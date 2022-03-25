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

import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import union from 'lodash/union';
import { normalize, Schema, arrayOf } from 'normalizr';

/**
 * Action Types
 */
export const GET_COURSE_URL = 'education/GET_COURSE_URL';
export const GET_COURSE_URL_SUCCESS = 'education/GET_COURSE_URL_SUCCESS';
export const GET_COURSE_URL_FAIL = 'education/GET_COURSE_URL_FAIL';

export const LOAD_LMS_COURSES = 'admin/structure/LOAD_LMS_COURSES';
export const LOAD_LMS_COURSES_SUCCESS = 'admin/structure/LOAD_LMS_COURSES_SUCCESS';
export const LOAD_LMS_COURSES_FAIL = 'admin/structure/LOAD_LMS_COURSES_FAIL';

export const LOAD_LMS_USERS = 'admin/structure/LOAD_LMS_USERS';
export const LOAD_LMS_USERS_SUCCESS = 'admin/structure/LOAD_LMS_USERS_SUCCESS';
export const LOAD_LMS_USERS_FAIL = 'admin/structure/LOAD_LMS_USERS_FAIL';

export const GET_LMS_CREATE_URL = 'admin/education/GET_LMS_CREATE_URL';
export const GET_LMS_CREATE_URL_SUCCESS = 'admin/education/GET_LMS_CREATE_URL_SUCCESS';
export const GET_LMS_CREATE_URL_FAIL = 'admin/education/GET_LMS_CREATE_URL_FAIL';

export const GET_LRS = 'admin/education/GET_LRS';
export const GET_LRS_SUCCESS = 'admin/education/GET_LRS_SUCCESS';
export const GET_LRS_FAIL = 'admin/education/GET_LRS_FAIL';

export const GET_ZUNOS_LMS = 'services/clui/GET_ZUNOS_LMS';
export const GET_ZUNOS_LMS_SUCCESS = 'services/clui/GET_ZUNOS_LMS_SUCCESS';
export const GET_ZUNOS_LMS_FAIL = 'services/clui/GET_ZUNOS_LMS_FAIL';

export const SET_USER_LINK = 'admin/education/SET_USER_LINK';
export const SET_USER_LINK_SUCCESS = 'admin/education/SET_USER_LINK_SUCCESS';
export const SET_USER_LINK_FAIL = 'admin/education/SET_USER_LINK_FAIL';

export const REMOVE_USER_LINK = 'admin/education/REMOVE_USER_LINK';
export const REMOVE_USER_LINK_SUCCESS = 'admin/education/REMOVE_USER_LINK_SUCCESS';
export const REMOVE_USER_LINK_FAIL = 'admin/education/REMOVE_USER_LINK_FAIL';

export const UPDATE_DATA = 'admin/education/UPDATE_DATA';
export const UPDATE_DATA_SUCCESS = 'admin/education/UPDATE_DATA_SUCCESS';
export const UPDATE_DATA_FAIL = 'admin/education/UPDATE_DATA_FAIL';

export const SET_DATA = 'admin/education/SET_DATA';

// Define schemes for our entities
const course = new Schema('courses', { idAttribute: 'courseId' });
const userEntity = new Schema('users');

/**
 * Initial State
 */
export const globalFetchLimit = 100;

export const initialState = {
  loaded: false,
  loading: false,
  updated: false,
  updating: false,
  modified: false,

  endpoint: '',
  authType: 'basic',
  user: '',
  password: '',
  apiKey: '',

  // end User course URL
  courseURL: '',
  courseLoading: '',
  courseLoaded: '',

  // Admin LMS URL
  lmsURL: '',
  lmsLoading: false,
  lmsLoaded: false,

  // LMS Courses List
  courses: [],
  coursesById: {},
  courseSelected: {},
  coursesFilter: '',
  coursesLoading: false,
  coursesComplete: false,

  // LMS Users List
  users: {},
  usersByCourse: {},
  userSelected: {},
  usersFilter: '',
  usersLoading: false,
  usersComplete: false,

  userSearchKeyword: '',
  //userSearch: {},
  userSearchByCourse: {},
  userSearchLoading: false,
  userSearchComplete: false,

  userSaved: false,
  userSaving: false,

  error: null,
};

/**
 * Reducer
 */
export default function education(state = initialState, action = {}) {
  switch (action.type) {
    /* COURSES */
    case LOAD_LMS_COURSES:
      return {
        ...state,
        coursesLoading: true,
        coursesFilter: action.search
      };
    case LOAD_LMS_COURSES_SUCCESS: {
      const { courses } = action.result;
      const normalized = normalize(courses, arrayOf(course));

      return {
        ...state,
        courses: normalized.result,
        coursesById: merge({}, state.coursesById, normalized.entities.courses),
        coursesLoading: false,
        //coursesComplete: action.result.length < globalFetchLimit,
        coursesComplete: true, // Server doesnt supprot fetch more yet
        error: null,
      };
    }
    case LOAD_LMS_COURSES_FAIL:
      return {
        ...state,
        coursesLoading: false,
        error: action.error
      };

    case LOAD_LMS_USERS: {
      const isSearchList = action.params.filter === 'unlinked';
      const userSearchKeyword = !action.params.filter && !action.params.offset ? '' : state.userSearchKeyword; // Reset search value

      return {
        ...state,
        usersLoading: !isSearchList ? true : state.usersLoading,
        usersFilter: action.params.search,

        // Search values are reset when new list is loaded
        userSearchKeyword: isSearchList ? action.params.search : userSearchKeyword,
        userSearchComplete: isSearchList ? state.userSearchComplete : false,
        userSearchLoading: isSearchList ? true : state.userSearchLoading,

        error: '',
      };
    }

    case LOAD_LMS_USERS_SUCCESS: {
      const { users } = action.result;
      const normalized = normalize(users || [], arrayOf(userEntity));

      const isSearchList = action.params.filter === 'unlinked';
      const listType = isSearchList ? 'userSearchByCourse' : 'usersByCourse';

      // Merge users array if loading more (offset > 0)
      const newOrderIds = action.params.offset ? union(state[listType][action.params.courseId].userIds, normalized.result) : normalized.result;

      const newList = {
        ...state[listType],
        [action.params.courseId]: {
          ...state[listType][action.params.courseId],
          userIds: uniq(newOrderIds),
        }
      };

      return {
        ...state,
        users: merge(state.users, normalized.entities.users),
        usersLoading: !isSearchList ? false : state.usersLoading,
        //usersComplete: !isSearchList ? action.result.length < globalFetchLimit : state.usersComplete,
        usersComplete: !isSearchList ? true : state.usersComplete, // Server doesnt supprot fetch more
        usersByCourse: !isSearchList ? newList : state.usersByCourse,

        //userSearch: isSearchList ? merge(state.userSearch, normalized.entities.users) : state.userSearch,
        userSearchLoading: isSearchList ? false : state.userSearchLoading,
        userSearchComplete: isSearchList ? true : state.userSearchComplete, // Server doesnt support fetch more
        userSearchByCourse: isSearchList ? newList : state.userSearchByCourse,

        error: null,
      };
    }
    case LOAD_LMS_USERS_FAIL: {
      const isSearchList = action.params.filter === 'unlinked';
      return {
        ...state,
        usersLoading: !isSearchList ? false : state.usersLoading,
        userSearchLoading: isSearchList ? false : state.userSearchLoading,
        error: action.error
      };
    }

    case GET_COURSE_URL:
    case GET_COURSE_URL_SUCCESS:
    case GET_COURSE_URL_FAIL:
      return {
        ...state,
        courseLoading: action.type === GET_COURSE_URL,
        courseLoaded: action.type === GET_COURSE_URL_SUCCESS,
        courseURL: action.type === GET_COURSE_URL_SUCCESS ? action.result.url : state.lmsURL,
        error: action.type === GET_COURSE_URL_FAIL ? action.error : null
      };

    case GET_LMS_CREATE_URL:
    case GET_LMS_CREATE_URL_SUCCESS:
    case GET_LMS_CREATE_URL_FAIL:
      return {
        ...state,
        lmsLoading: action.type === GET_LMS_CREATE_URL,
        lmsLoaded: action.type === GET_LMS_CREATE_URL_SUCCESS,
        lmsURL: action.type === GET_LMS_CREATE_URL_SUCCESS ? action.result.url : state.lmsURL,
        error: action.type === GET_LMS_CREATE_URL_FAIL ? action.error : null
      };

    case GET_ZUNOS_LMS:
      return {
        ...state
      };

    case GET_ZUNOS_LMS_SUCCESS:
      return {
        ...state,
        ...action.result,
        zunosLoaded: true
      };

    case GET_ZUNOS_LMS_FAIL:
      return {
        ...state,
        error: action
      };

    case GET_LRS:
    case UPDATE_DATA:
      return {
        ...state,
        loaded: false,
        loading: action.type === GET_LRS,
        updated: false,
        updating: action.type === UPDATE_DATA,
        error: null,
        ...action.params
      };

    case GET_LRS_SUCCESS:
    case UPDATE_DATA_SUCCESS:
      return {
        ...state,
        loaded: action.type === GET_LRS_SUCCESS,
        loading: false,
        updated: action.type === UPDATE_DATA_SUCCESS,
        updating: false,
        modified: false,
        ...action.result
      };
    case GET_LRS_FAIL:
    case UPDATE_DATA_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        error: action,
      };

    case SET_USER_LINK:
    case SET_USER_LINK_SUCCESS: {
      let newSearchOrderIds = [];
      let newList = [];
      const objectList = {};

      // Add
      newSearchOrderIds = [...state.userSearchByCourse[action.params.courseId].userIds];
      newSearchOrderIds = newSearchOrderIds.filter((obj) => (!action.params.users.find(item => item === obj)));
      newList = [
        ...action.params.users,
        ...state.usersByCourse[action.params.courseId].userIds
      ];

      objectList.usersByCourse = {
        ...state.usersByCourse,
        [action.params.courseId]: {
          ...state.usersByCourse[action.params.courseId],
          userIds: uniq(newList)
        }
      };
      objectList.userSearchByCourse = {
        ...state.userSearchByCourse,
        [action.params.courseId]: {
          ...state.userSearchByCourse[action.params.courseId],
          userIds: uniq(newSearchOrderIds)
        }
      };

      return {
        ...state,
        userSaved: action.type !== SET_USER_LINK,
        userSaving: action.type === SET_USER_LINK,
        ...objectList
      };
    }
    case SET_USER_LINK_FAIL:
      return {
        ...state,
        userSaved: false,
        userSaving: false,
        error: action.error,
      };

    case REMOVE_USER_LINK:
    case REMOVE_USER_LINK_SUCCESS: {
      let newList = [];
      const objectList = {};

      // Remove relationship
      const userId = Math.abs(action.params.userId);
      newList = state.usersByCourse[action.params.courseId].userIds.filter((obj) => (obj !== userId));

      if (state.userSelected && state.userSelected.id === userId) {
        objectList.userSelected = {}; // Reset selected group
      }

      objectList.usersByCourse = {
        ...state.usersByCourse,
        [action.params.courseId]: {
          ...state.usersByCourse[action.params.courseId],
          userIds: newList
        }
      };

      return {
        ...state,
        userSaved: action.type !== REMOVE_USER_LINK,
        userSaving: action.type === REMOVE_USER_LINK,
        ...objectList
      };
    }
    case REMOVE_USER_LINK_FAIL:
      return {
        ...state,
        userSaved: false,
        userSaving: false,
        error: action.error,
      };

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    default:
      return state;
  }
}
/**
 * Action Creators
 */

/* Load all CLUI Courses */
export function getUserCourseUrl(courseId) {
  return {
    types: [GET_COURSE_URL, GET_COURSE_URL_SUCCESS, GET_COURSE_URL_FAIL],
    params: {
      id: courseId
    },
    promise: (client) => client.post(`/services/clui/get_course_url?id=${courseId}`, 'webapi')
  };
}

export function loadCourses(companyId, offset = 0) {
  return {
    types: [LOAD_LMS_COURSES, LOAD_LMS_COURSES_SUCCESS, LOAD_LMS_COURSES_FAIL],
    params: {
      offset: offset,
      companyId: companyId
    },
    promise: (client) => client.get('/services/clui/proxy', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        url: `/manage/${companyId}/courses`
      }
    })
  };
}

export function getLmsCreateUrl(companyId, userId, courseId) {
  let url = `/manage/${companyId}/${userId}/courses`;
  if (courseId) {
    url += `/${courseId}`;
  }

  return {
    types: [GET_LMS_CREATE_URL, GET_LMS_CREATE_URL_SUCCESS, GET_LMS_CREATE_URL_FAIL],
    promise: (client) => client.post('/services/clui/proxy', 'webapi', {
      data: {
        url: url
      }
    })
  };
}

export function loadLMSUsers(companyId, courseId, offset = 0, filter = '') {
  let url = `/manage/${companyId}/courses/${courseId}/users`;
  if (filter) {
    url += `/${filter}`;
  }

  return {
    types: [LOAD_LMS_USERS, LOAD_LMS_USERS_SUCCESS, LOAD_LMS_USERS_FAIL],
    params: {
      offset: offset,
      companyId: companyId,
      courseId: courseId,
      filter: filter
    },
    promise: (client) => client.get('/services/clui/proxy', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        url: url
      }
    })
  };
}

export function setUserLink(companyId, courseId, list) {
  const path = `/services/clui/proxy?url=/manage/${companyId}/courses/${courseId}/users`;
  return {
    types: [SET_USER_LINK, SET_USER_LINK_SUCCESS, SET_USER_LINK_FAIL],
    params: {
      courseId: courseId,
      users: list
    },
    promise: (client) => client.post(path, 'webapi', {
      body: JSON.stringify({ users: list })
    })
  };
}

export function removeUserLink(companyId, courseId, userId) {
  const path = `/services/clui/proxy?url=/manage/${companyId}/courses/${courseId}/users/${userId}`;
  return {
    types: [REMOVE_USER_LINK, REMOVE_USER_LINK_SUCCESS, REMOVE_USER_LINK_FAIL],
    params: {
      courseId: courseId,
      userId: userId
    },
    promise: (client) => client.del(path, 'webapi')
  };
}

export function getData(name) {
  const path = `/admin/education/${name}/get`;
  const type = `admin/education/GET_${name.toUpperCase()}`;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function getZunosLmsSignin(token) {
  const path = `/services/clui/proxy?url=/sso/admin/${token}`;
  return {
    types: [GET_ZUNOS_LMS, GET_ZUNOS_LMS_SUCCESS, GET_ZUNOS_LMS_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function getLmsData(name, companyId, userId) {
  const path = `/services/clui/proxy?url=/manage/${name}/${companyId}/${userId}`;
  const type = `services/clui/GET_LMS_${name.toUpperCase()}`;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function updateData(update, name) {
  const path = `/admin/education/${name}/set`;

  return {
    types: [UPDATE_DATA, UPDATE_DATA_SUCCESS, UPDATE_DATA_FAIL],
    params: { ...update },
    promise: (client) => client.post(path, 'webapi', {
      data: {
        ...update
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
