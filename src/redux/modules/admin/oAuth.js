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
import _uniqBy from 'lodash/uniqBy';
/**
 * Action Types
 */
export const GET_LIST = 'admin/oAuthClients/GET_LIST';
export const GET_LIST_SUCCESS = 'admin/oAuthClients/GET_LIST_SUCCESS';
export const GET_LIST_FAIL = 'admin/oAuthClients/GET_LIST_FAIL';

export const GET_SCOPES = 'admin/oAuthClients/GET_SCOPES';
export const GET_SCOPES_SUCCESS = 'admin/oAuthClients/GET_SCOPES_SUCCESS';
export const GET_SCOPES_FAIL = 'admin/oAuthClients/GET_SCOPES_FAIL';

export const GET = 'admin/oAuthClients/GET';
export const GET_SUCCESS = 'admin/oAuthClients/GET_SUCCESS';
export const GET_FAIL = 'admin/oAuthClients/GET_FAIL';

export const PUT = 'admin/oAuthClients/PUT';
export const PUT_SUCCESS = 'admin/oAuthClients/PUT_SUCCESS';
export const PUT_FAIL = 'admin/oAuthClients/PUT_FAIL';

export const POST = 'admin/foAuthClients/POST';
export const POST_SUCCESS = 'admin/oAuthClients/POST_SUCCESS';
export const POST_FAIL = 'admin/oAuthClients/POST_FAIL';

export const DEL = 'admin/oAuthClients/DEL';
export const DEL_SUCCESS = 'admin/oAuthClients/DEL_SUCCESS';
export const DEL_FAIL = 'admin/oAuthClients/DEL_FAIL';

export const CLOSE = 'admin/files/CLOSE';
export const SET_DATA = 'admin/files/SET_DATA';

const globalFetchLimit = 100;
const clientsPath = '/oauth2/clients';
/**
 * Initial State
 */
export const initialState = {
  getListLoaded: false,
  getListLoading: false,
  getListComplete: false,
  getLoaded: false,
  getLoading: false,
  putting: false,
  putted: false,
  deleting: false,
  deleted: false,
  error: null,
};

/**
 * Reducer
 */
export default function oAuth(state = initialState, action = {}) {
  switch (action.type) {
    case GET_LIST:
    case GET:
      return {
        ...state,
        getListLoaded: false,
        getListLoading: action.type === GET_LIST,
        getLoaded: false,
        getLoading: action.type === GET,
        error: null,
      };
    case GET_LIST_SUCCESS:
    case GET_SUCCESS: {
      let clients = state.clients || [];
      if (action.type === GET_LIST_SUCCESS) {
        clients = _uniqBy(clients.concat(action.result), 'clientId');
      } else {
        clients = clients.map(item => (item.clientId === action.result.clientId ? action.result : item));
      }
      return {
        ...state,
        clients,
        getListLoaded: action.type === GET_LIST_SUCCESS,
        getListLoading: false,
        getListComplete: action.result.length < globalFetchLimit,
        getLoaded: action.type === GET_SUCCESS,
        getLoading: false,
        error: null,
      };
    }
    case GET_SCOPES_SUCCESS: {
      return {
        ...state,
        [action.authMethod]: action.result
      };
    }
    case POST:
      return {
        ...state,
        error: null,
      };
    case POST_SUCCESS:
      return {
        ...state,
        ...initialState,
        clients: [{
          ...action.result,
          id: action.result.clientId,
        }, ...state.clients]
      };
    case PUT:
      return {
        ...state,
        ...initialState,
        putting: true,
        putted: false,
      };
    case PUT_SUCCESS:
      return {
        ...state,
        ...initialState,
        putting: false,
        putted: true,
        clients: state.clients.map(item => (item.clientId === action.clientId ? action.result : item))
      };
    case DEL:
      return {
        ...state,
        ...initialState,
        deleting: true,
        deleted: false,
        clients: state.clients.filter(item => item.clientId !== action.clientId)
      };
    case DEL_SUCCESS:
      return {
        ...state,
        ...initialState,
        deleting: false,
        deleted: true,
      };
    case GET_LIST_FAIL:
    case GET_FAIL:
    case POST_FAIL:
    case PUT_FAIL:
    case DEL_FAIL:
    case GET_SCOPES_FAIL:
      return {
        ...state,
        ...initialState,
        clients: state.clients,
        scopes: state.scopes,
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
export function getOAuthClientsList(offset = 0) {
  return {
    types: [GET_LIST, GET_LIST_SUCCESS, GET_LIST_FAIL],
    promise: (client) => client.get(clientsPath, 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

export function getOAuthClient(id) {
  return {
    types: [GET, GET_SUCCESS, GET_FAIL],
    promise: (client) => client.get(`${clientsPath}/${id}`, 'webapi')
  };
}

export function createOAuthClient(data) {
  return {
    types: [POST, POST_SUCCESS, POST_FAIL],
    data,
    promise: (client) => client.post(clientsPath, 'webapi', {
      body: data,
    })
  };
}

export function editOAuthClient(data) {
  return {
    types: [PUT, PUT_SUCCESS, PUT_FAIL],
    data,
    clientId: data.id,
    promise: (client) => client.put(`${clientsPath}/${data.id}`, 'webapi', {
      body: data
    })
  };
}

export function deleteOAuthClient(clientId) {
  return {
    types: [DEL, DEL_SUCCESS, DEL_FAIL],
    clientId,
    promise: (client) => client.del(`${clientsPath}/${clientId}`, 'webapi', {
      params: {
        id: clientId
      }
    })
  };
}

export function getOAuthScopes(authMethod) {
  return {
    types: [GET_SCOPES, GET_SCOPES_SUCCESS, GET_SCOPES_FAIL],
    authMethod,
    promise: (client) => client.get(`/oauth2/clients/${authMethod}/scopes`, 'webapi')
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
