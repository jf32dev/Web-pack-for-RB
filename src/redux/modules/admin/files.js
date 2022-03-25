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

/**
 * Action Types
 */
export const GET = 'admin/files/GET';
export const GET_SUCCESS = 'admin/files/GET_SUCCESS';
export const GET_FAIL = 'admin/files/GET_FAIL';

export const GET_MORE = 'admin/files/GET_MORE';
export const GET_MORE_SUCCESS = 'admin/files/GET_MORE_SUCCESS';
export const GET_MORE_FAIL = 'admin/files/GET_MORE_FAIL';

export const SET = 'admin/files/SET';
export const SET_SUCCESS = 'admin/files/SET_SUCCESS';
export const SET_FAIL = 'admin/files/SET_FAIL';

export const PUT = 'admin/files/PUT';
export const PUT_SUCCESS = 'admin/files/PUT_SUCCESS';
export const PUT_FAIL = 'admin/files/PUT_FAIL';

export const POST = 'admin/files/POST';
export const POST_SUCCESS = 'admin/files/POST_SUCCESS';
export const POST_FAIL = 'admin/files/POST_FAIL';

export const DEL = 'admin/files/DEL';
export const DEL_SUCCESS = 'admin/files/DEL_SUCCESS';
export const DEL_FAIL = 'admin/files/DEL_FAIL';

export const SET_RES = 'admin/files/SET_RES';
export const SET_RES_SUCCESS = 'admin/files/SET_RES_SUCCESS';
export const SET_RES_FAIL = 'admin/files/SET_RES_FAIL';

export const CLOSE = 'admin/files/CLOSE';
export const SET_DATA = 'admin/files/SET_DATA';

export const FILE_UPLOADS = 'fileUploads';
export const CLOUD_SERVICES = 'cloudServices';
export const SYNC_ENGINE = 'syncEngine';

const jsonFormatList = ['allowedExtensions', 'cloudServices'];

/**
 * Initial State
 */
export const initialState = {
  loaded: false,
  loading: false,
  error: null,
};

/**
 * Reducer
 */
export default function adminFiles(state = initialState, action = {}) {
  const loaded = (action.customLoad || 'load') + 'ed';
  const loading = (action.customLoad || 'load') + 'ing';

  switch (action.type) {
    case GET:
    case GET_MORE:
    case SET_RES:
      return {
        ...state,
        [loaded]: false,
        [loading]: action.type === GET || action.type === GET_MORE,
        error: null,
      };

    case GET_SUCCESS:
    case GET_MORE_SUCCESS:
    case SET_RES_SUCCESS: {
      const hasStateContent = Object.prototype.hasOwnProperty.call(state, 'contents') && state.contents;
      // if user is still in the same folder AND there are old contents, combine old and new contents and return it
      // otherwise return new contents
      const contentList = action.type === GET_MORE_SUCCESS && (state.currentFolderId === action.result.folderId) && hasStateContent.length > 0 ? { ...action.result, contents: [...hasStateContent, ...action.result.contents] } : { ...action.result };
      return {
        ...state,
        [loaded]: action.type === GET_SUCCESS || action.type === GET_MORE_SUCCESS,
        [loading]: false,
        ...contentList,
        hasMoreContent: !!action.result.nextPage,
        currentFolderId: action.result.folderId,
        nextPage: action.result.nextPage,
      };
    }
    case SET:
    case POST:
      return {
        ...state,
        [loaded]: false,
        [loading]: true,
        [`${action.name}Updated`]: false,
        ...action.set,
      };
    case SET_SUCCESS:
      return {
        ...state,
        [`${action.name}Updated`]: true,
      };
    case PUT:
      return {
        ...state,
        ...action.set,
      };
    case POST_SUCCESS:
      return {
        ...state,
        [loaded]: true,
        [loading]: false,
        services: action.set.services.map(item => (item.id !== 'new' ? item : {
          ...item,
          id: action.result.repoId
        })).slice().sort((a, b) => {
          const textA = a.description.toUpperCase();
          const textB = b.description.toUpperCase();
          if (textA < textB) {
            return -1;
          } else if (textA > textB) {
            return 1;
          }
          return 0;
        })
      };
    case DEL:
      return {
        ...state,
        [action.set.tableName]: state[action.set.tableName].filter(item => +item.id !== +action.set.id)
      };
    case GET_FAIL:
    case GET_MORE_FAIL:
    case POST_FAIL:
    case PUT_FAIL:
    case SET_FAIL:
    case SET_RES_FAIL:
    case DEL_FAIL:
      return {
        ...state,
        [loaded]: false,
        [loading]: false,
        error: action.error,
      };

    case SET_DATA: {
      return {
        ...state,
        ...action.params,
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
export function getFiles(name, params) {
  const path = `/admin/file/${name}/get`;
  return {
    types: [GET, GET_SUCCESS, GET_FAIL],
    promise: (client) => client.get(path, 'webapi', {
      params,
    })
  };
}

export function setFiles(name, update, set, res = false, customLoad = 'set') {
  const path = `/admin/file/${name}/set`;
  const data = Object.keys(update).reduce((accumulator, key) => (
    jsonFormatList.indexOf(key) > -1 ? {
      ...accumulator,
      [key]: JSON.stringify(update[key])
    } : {
      ...accumulator,
      [key]: update[key]
    }
  ), {});

  return {
    types: res ? [SET_RES, SET_RES_SUCCESS, SET_RES_FAIL] : [SET, SET_SUCCESS, SET_FAIL],
    set: set || update,
    name,
    customLoad,
    promise: (client) => client.post(path, 'webapi', {
      data,
    })
  };
}


/**
 * Action Creators
 */
export function crudFiles(name, params, method, customLoad = 'load', set) {
  const path = `/admin/file/${name}`;
  const METHOD = `admin/files/${method.toUpperCase()}`;
  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    set,
    customLoad,
    params,
    promise: (client) => client[method](path, 'webapi', {
      params: (method === 'get' || method === 'del') && params,
      data: method === 'post' && params,
      body: method === 'put' && params,
    })
  };
}

export function getMoreContent(currentFolderId, nextPage, currentAccountId, asUser) {
  const path = `/admin/file/${SYNC_ENGINE}/repository`;
  return {
    types: [GET_MORE, GET_MORE_SUCCESS, GET_MORE_FAIL],
    promise: (client) => client.get(path, 'webapi', {
      params: {
        accountId: currentAccountId,
        page: nextPage,
        folderId: currentFolderId,
        asUser: asUser
      }
    })
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
