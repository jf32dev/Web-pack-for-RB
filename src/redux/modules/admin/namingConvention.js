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
const reduceName = 'namingConvention';

export const GET_LANGUAGE = `admin/${reduceName}/GET_LANGUAGE`;
export const GET_LANGUAGE_SUCCESS = `admin/${reduceName}/GET_LANGUAGE_SUCCESS`;
export const GET_LANGUAGE_FAIL = `admin/${reduceName}/GET_LANGUAGE_FAIL`;

export const GET_NAMING = `admin/${reduceName}/GET_NAMING`;
export const GET_NAMING_SUCCESS = `admin/${reduceName}/GET_NAMING_SUCCESS`;
export const GET_NAMING_FAIL = `admin/${reduceName}/GET_NAMING_FAIL`;

export const POST_NAMING = `admin/${reduceName}/POST_NAMING`;
export const POST_NAMING_SUCCESS = `admin/${reduceName}/POST_NAMING_SUCCESS`;
export const POST_NAMING_FAIL = `admin/${reduceName}/POST_NAMING_FAIL`;

export const CLOSE = `admin/${reduceName}/CLOSE`;
export const SET_DATA = `admin/${reduceName}/SET_DATA`;

/**
 * Initial State
 */
export const initialState = {
  error: null,
};

/**
 * Reducer
 */
export default function reduceData(state = initialState, action = {}) {
  const loaded = (action.customLoad || 'load') + 'ed';
  const loading = (action.customLoad || 'load') + 'ing';

  switch (action.type) {
    case GET_LANGUAGE:
    case GET_NAMING:
      return {
        ...state,
        [loaded]: false,
        [loading]: action.type === GET_LANGUAGE || action.type === GET_NAMING,
        error: null,
      };
    case GET_LANGUAGE_SUCCESS:
    case GET_NAMING_SUCCESS: {
      return {
        ...state,
        [loaded]: action.type === GET_LANGUAGE_SUCCESS || action.type === GET_NAMING_SUCCESS,
        [loading]: false,
        [action.tableName]: action.result
      };
    }
    case POST_NAMING: {
      return {
        ...state,
        [loaded]: false,
        [loading]: action.type === POST_NAMING,
        error: null,
      };
    }
    case POST_NAMING_SUCCESS: {
      if (action.notUpdate) {
        return {
          ...state,
          [loaded]: action.type === POST_NAMING_SUCCESS,
          [loading]: false,
        };
      }
      return {
        ...state,
        [loaded]: action.type === POST_NAMING_SUCCESS,
        [loading]: false,
        [action.tableName]: action.result
      };
    }
    case GET_LANGUAGE_FAIL:
    case GET_NAMING_FAIL:
    case POST_NAMING_FAIL:
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
export function getLanguage(customLoad = 'LanguageLoad', tableName = 'language') {
  const path = '/system/languages';
  const METHOD = `admin/${reduceName}/GET_LANGUAGE`;
  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    promise: (client) => client.get(path, 'webapi4')
  };
}

export function getNaming(params, customLoad = 'NamingLoad', tableName = 'naming') {
  const path = '/company/naming';
  const METHOD = `admin/${reduceName}/GET_NAMING`;
  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    promise: (client) => client.get(path, 'webapi4', {
      params,
    })
  };
}

export function postNaming(params, notUpdate = false, customLoad = 'NamingPost', tableName = 'naming') {
  const path = '/company/naming';
  const METHOD = `admin/${reduceName}/POST_NAMING`;
  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    notUpdate,
    promise: (client) => client.post(path, 'webapi4', {
      data: params,
    })
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
