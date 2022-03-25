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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

export const GET_FILES_GENERAL = 'admin/filesGeneral/GET_FILES_GENERAL';
export const GET_FILES_GENERAL_SUCCESS = 'admin/filesGeneral/GET_FILES_GENERAL_SUCCESS';
export const GET_FILES_GENERAL_FAIL = 'admin/filesGeneral/GET_FILES_GENERAL_FAIL';

export const SET_FILES_GENERAL = 'admin/filesGeneral/SET_FILES_GENERAL';
export const SET_FILES_GENERAL_SUCCESS = 'admin/filesGeneral/SET_FILES_GENERAL_SUCCESS';
export const SET_FILES_GENERAL_FAIL = 'admin/filesGeneral/SET_FILES_GENERAL_FAIL';

export const CLOSE = 'admin/filesGeneral/CLOSE_GENERAL';
export const SET_DATA = 'admin/filesGeneral/SET_DATA';

export const initialState = {
  loaded: false,
  loading: false,
  updated: false,
  updating: false,
  error: null,

  dataOrig: {
    detailsFieldLabel: '',
    hintText: '',
    showCustomFileDetailsIcon: false
  },
  data: {
    detailsFieldLabel: '',
    hintText: '',
    showCustomFileDetailsIcon: false
  }
};

export default function contentRecommender(state = initialState, action = {}) {
  switch (action.type) {
    case GET_FILES_GENERAL:
    case SET_FILES_GENERAL:
      return {
        ...state,
        loaded: false,
        loading: action.type === GET_FILES_GENERAL,
        updated: false,
        updating: action.type === SET_FILES_GENERAL,
        error: null,
      };

    case GET_FILES_GENERAL_SUCCESS:
    case SET_FILES_GENERAL_SUCCESS: {
      return {
        ...state,
        loaded: action.type === GET_FILES_GENERAL_SUCCESS,
        loading: false,
        updated: action.type === SET_FILES_GENERAL_SUCCESS,
        updating: false,
        dataOrig: action.result,
        data: action.result

      };
    }
    case GET_FILES_GENERAL_FAIL:
    case SET_FILES_GENERAL_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        error: action.error,
      };

    case SET_DATA: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.params
        },
        updated: false
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
export function getCustomFilesMetadata() {
  const path = '/admin/file/general';
  return {
    types: [GET_FILES_GENERAL, GET_FILES_GENERAL_SUCCESS, GET_FILES_GENERAL_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function setCustomFilesMetadata(params) {
  const path = '/admin/file/general';
  const showIcon = !!params.showCustomFileDetailsIcon;
  return {
    types: [SET_FILES_GENERAL, SET_FILES_GENERAL_SUCCESS, SET_FILES_GENERAL_FAIL],
    promise: (client => client.post(path, 'webapi', {
      body: JSON.stringify({ ...params, showCustomFileDetailsIcon: showIcon })
    }))
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data
  };
}
