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

export const GET_RECOMMENDER_SETTINGS = 'admin/contentRecommender/GET_RECOMMENDER_SETTINGS';
export const GET_RECOMMENDER_SETTINGS_SUCCESS = 'admin/contentRecommender/GET_RECOMMENDER_SETTINGS_SUCCESS';
export const GET_RECOMMENDER_SETTINGS_FAIL = 'admin/contentRecommender/GET_RECOMMENDER_SETTINGS_FAIL';

export const SET_RECOMMENDER_SETTINGS = 'admin/contentRecommender/SET_RECOMMENDER_SETTINGS';
export const SET_RECOMMENDER_SETTINGS_SUCCESS = 'admin/contentRecommender/SET_RECOMMENDER_SETTINGS_SUCCESS';
export const SET_RECOMMENDER_SETTINGS_FAIL = 'admin/contentRecommender/SET_RECOMMENDER_SETTINGS_FAIL';

export const CLOSE = 'admin/contentRecommender/CLOSE_GENERAL';
export const SET_DATA = 'admin/contentRecommender/SET_DATA';

export const initialState = {
  loaded: false,
  loading: false,
  updated: false,
  updating: false,
  error: null,

  dataOrig: {
    turnedOn: false,
    frequency: 'none'
  },
  data: {
    turnedOn: false,
    frequency: 'none'
  }
};

export default function contentRecommender(state = initialState, action = {}) {
  switch (action.type) {
    case GET_RECOMMENDER_SETTINGS:
    case SET_RECOMMENDER_SETTINGS:
      return {
        ...state,
        loaded: false,
        loading: action.type === GET_RECOMMENDER_SETTINGS,
        updated: false,
        updating: action.type === SET_RECOMMENDER_SETTINGS,
        error: null,
      };

    case GET_RECOMMENDER_SETTINGS_SUCCESS:
    case SET_RECOMMENDER_SETTINGS_SUCCESS: {
      return {
        ...state,
        loaded: action.type === GET_RECOMMENDER_SETTINGS_SUCCESS,
        loading: false,
        updated: action.type === SET_RECOMMENDER_SETTINGS_SUCCESS,
        updating: false,
        dataOrig: action.result,
        data: action.result

      };
    }
    case GET_RECOMMENDER_SETTINGS_FAIL:
    case SET_RECOMMENDER_SETTINGS_FAIL:
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
export function getRecommenderSettings() {
  const path = '/admin/content-recommender';
  return {
    types: [GET_RECOMMENDER_SETTINGS, GET_RECOMMENDER_SETTINGS_SUCCESS, GET_RECOMMENDER_SETTINGS_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function setRecommenderSettings(params) {
  const path = '/admin/content-recommender';
  return {
    types: [SET_RECOMMENDER_SETTINGS, SET_RECOMMENDER_SETTINGS_SUCCESS, SET_RECOMMENDER_SETTINGS_FAIL],
    promise: (client => client.patch(path, 'webapi', {
      body: JSON.stringify(params)
    }))
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data
  };
}
