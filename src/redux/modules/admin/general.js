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

export const GET_CUSTOMIZATION = 'admin/general/GET_CUSTOMIZATION';
export const GET_CUSTOMIZATION_SUCCESS = 'admin/general/GET_CUSTOMIZATION_SUCCESS';
export const GET_CUSTOMIZATION_FAIL = 'admin/general/GET_CUSTOMIZATION_FAIL';

export const GET_ALL = 'admin/general/GET_ALL';
export const GET_ALL_SUCCESS = 'admin/general/GET_ALL_SUCCESS';
export const GET_ALL_FAIL = 'admin/general/GET_ALL_FAIL';

export const SET_CURRENT = 'admin/general/SET_CURRENT';
export const SET_CURRENT_SUCCESS = 'admin/general/SET_CURRENT_SUCCESS';
export const SET_CURRENT_FAIL = 'admin/general/SET_CURRENT_FAIL';

export const UPLOAD_CUSTOMIZATION = 'admin/general/UPLOAD_CUSTOMIZATION';
export const UPLOAD_CUSTOMIZATION_SUCCESS = 'admin/general/UPLOAD_CUSTOMIZATION_SUCCESS';
export const UPLOAD_CUSTOMIZATION_FAIL = 'admin/general/UPLOAD_CUSTOMIZATION_FAIL';

export const SET_CUSTOMIZATION = 'admin/general/SET_CUSTOMIZATION';
export const SET_CUSTOMIZATION_SUCCESS = 'admin/general/SET_CUSTOMIZATION_SUCCESS';
export const SET_CUSTOMIZATION_FAIL = 'admin/general/SET_CUSTOMIZATION_FAIL';


export const GET_WELCOMESCREENS = 'admin/general/GET_WELCOMESCREENS';
export const GET_WELCOMESCREENS_SUCCESS = 'admin/general/GET_WELCOMESCREENS_SUCCESS';
export const GET_WELCOMESCREENS_FAIL = 'admin/general/GET_WELCOMESCREENS_FAIL';

export const SET_WELCOMESCREENS = 'admin/general/SET_WELCOMESCREENS';
export const SET_WELCOMESCREENS_SUCCESS = 'admin/general/SET_WELCOMESCREENS_SUCCESS';
export const SET_WELCOMESCREENS_FAIL = 'admin/general/SET_WELCOMESCREENS_FAIL';

export const GET_HUBSHARECUSTOMTEXT = 'admin/general/GET_HUBSHARECUSTOMTEXT';
export const GET_HUBSHARECUSTOMTEXT_SUCCESS = 'admin/general/GET_HUBSHARECUSTOMTEXT_SUCCESS';
export const GET_HUBSHARECUSTOMTEXT_FAIL = 'admin/general/GET_HUBSHARECUSTOMTEXT_FAIL';

export const SET_HUBSHARECUSTOMTEXT = 'admin/general/SET_HUBSHARECUSTOMTEXT';
export const SET_HUBSHARECUSTOMTEXT_SUCCESS = 'admin/general/SET_HUBSHARECUSTOMTEXT_SUCCESS';
export const SET_HUBSHARECUSTOMTEXT_FAIL = 'admin/general/SET_HUBSHARECUSTOMTEXT_FAIL';

export const POST_PURGE_POPULAR_SEARCH_DATA = 'admin/general/POST_PURGE_POPULAR_SEARCH_DATA';
export const POST_PURGE_POPULAR_SEARCH_DATA_SUCCESS = 'admin/general/POST_PURGE_POPULAR_SEARCH_DATA_SUCCESS';
export const POST_PURGE_POPULAR_SEARCH_DATA_FAIL = 'admin/general/POST_PURGE_POPULAR_SEARCH_DATA_FAIL';

export const GET_HUBSHARE_SETTINGS = 'admin/general/GET_HUBSHARE_SETTINGS';
export const GET_HUBSHARE_SETTINGS_SUCCESS = 'admin/general/GET_HUBSHARE_SETTINGS_SUCCESS';
export const GET_HUBSHARE_SETTINGS_FAIL = 'admin/general/GET_HUBSHARE_SETTINGS_FAIL';

export const SET_HUBSHARE_SETTINGS = 'admin/general/SET_HUBSHARE_SETTINGS';
export const SET_HUBSHARE_SETTINGS_SUCCESS = 'admin/general/SET_HUBSHARE_SETTINGS_SUCCESS';
export const SET_HUBSHARE_SETTINGS_FAIL = 'admin/general/SET_HUBSHARE_SETTINGS_FAIL';

export const CLOSE = 'admin/general/CLOSE_GENERAL';

export const ALL = 'all';
export const CURRENT = 'current';
export const PURGE_POPULAR_SEARCH_DATA = 'purge/popular/search/data';

export const initialState = {
  loaded: false,
  loading: false,
  updated: false,
  updating: false,
  error: null,
  wallpaperSelfEnrol: 'disabled',
  ldap: {
    activeForest: [{
      domainController: [{}]
    }]
  }
};

export default function adminGeneral(state = initialState, action = {}) {
  const loading = [
    GET_CUSTOMIZATION,
    GET_WELCOMESCREENS,
    GET_HUBSHARECUSTOMTEXT,
    GET_HUBSHARE_SETTINGS,
    GET_ALL,
  ];

  const loaded = [
    GET_CUSTOMIZATION_SUCCESS,
    GET_WELCOMESCREENS_SUCCESS,
    GET_HUBSHARECUSTOMTEXT_SUCCESS,
    GET_HUBSHARE_SETTINGS_SUCCESS,
    GET_ALL_SUCCESS,
  ];

  const updating = [
    SET_CUSTOMIZATION,
    SET_WELCOMESCREENS,
    SET_HUBSHARECUSTOMTEXT,
    SET_HUBSHARE_SETTINGS,
  ];

  const updated = [
    SET_CUSTOMIZATION_SUCCESS,
    SET_WELCOMESCREENS_SUCCESS,
    SET_HUBSHARECUSTOMTEXT_SUCCESS,
    SET_HUBSHARE_SETTINGS_SUCCESS
  ];

  switch (action.type) {
    case GET_CUSTOMIZATION:
    case SET_CUSTOMIZATION:
    case UPLOAD_CUSTOMIZATION:
    case GET_WELCOMESCREENS:
    case SET_WELCOMESCREENS:
    case GET_HUBSHARECUSTOMTEXT:
    case SET_HUBSHARECUSTOMTEXT:
    case GET_HUBSHARE_SETTINGS:
    case SET_HUBSHARE_SETTINGS:
    case GET_ALL:
    case SET_CURRENT: {
      const uploadStatus = action.type === UPLOAD_CUSTOMIZATION && action.uploadId ? {
        [action.uploadId]: 'loading'
      } : {};
      return {
        ...state,
        loaded: false,
        loading: loading.indexOf(action.type) > -1,
        updated: false,
        updating: updating.indexOf(action.type) > -1,
        error: null,
        toAddress: null,
        ...uploadStatus
      };
    }
    case GET_CUSTOMIZATION_SUCCESS:
    case SET_CUSTOMIZATION_SUCCESS:
    case UPLOAD_CUSTOMIZATION_SUCCESS:
    case GET_WELCOMESCREENS_SUCCESS:
    case SET_WELCOMESCREENS_SUCCESS:
    case GET_ALL_SUCCESS:
    case SET_CURRENT_SUCCESS:
    case GET_HUBSHARE_SETTINGS_SUCCESS:
    case SET_HUBSHARE_SETTINGS_SUCCESS: {
      return {
        ...state,
        loaded: loaded.indexOf(action.type) > -1,
        loading: false,
        updated: updated.indexOf(action.type) > -1,
        updating: false,
        ...action.result
      };
    }
    case GET_HUBSHARECUSTOMTEXT_SUCCESS:
      return {
        ...state,
        ...action.result
      };
    case SET_HUBSHARECUSTOMTEXT_SUCCESS:
      return {
        ...state,
        customText: action.value,
        loaded: loaded.indexOf(action.type) > -1,
        loading: false,
        updated: updated.indexOf(action.type) > -1,
        updating: false,
      };
    case GET_CUSTOMIZATION_FAIL:
    case SET_CUSTOMIZATION_FAIL:
    case UPLOAD_CUSTOMIZATION_FAIL:
    case GET_WELCOMESCREENS_FAIL:
    case SET_WELCOMESCREENS_FAIL:
    case GET_HUBSHARECUSTOMTEXT_FAIL:
    case SET_HUBSHARECUSTOMTEXT_FAIL:
    case GET_HUBSHARE_SETTINGS_FAIL:
    case SET_HUBSHARE_SETTINGS_FAIL:
    case GET_ALL_FAIL:
    case SET_CURRENT_FAIL:
    case POST_PURGE_POPULAR_SEARCH_DATA_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        updated: false,
        updating: false,
        error: action.error,
      };

    case CLOSE:
      return initialState;

    default:
      return state;
  }
}
/**
 * Action Creators
 */
export function getGeneral(name) {
  const path = `/admin/general/${name}/get`;
  const type = `admin/general/GET_${name.split('/').join('_').toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function setCustomGeneralJson(name, update) {
  const path = `/admin/general/${name}/set`;
  const type = `admin/general/SET_${name.toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.post(path, 'webapi', {
      params: update,
    })
  };
}


export function setGeneralData(name, update) {
  const path = `/admin/general/${name}/set`;
  const type = `admin/general/SET_${name.toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.post(path, 'webapi', {
      data: update,
    })
  };
}

export function postGeneral(name) {
  const path = `/admin/general/${name}`;
  const type = `admin/general/POST_${name.split('/').join('_').toUpperCase()}`;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.post(path, 'webapi')
  };
}

export function getHubshareConfiguration() {
  const pathHubShareCustomText = '/admin/general/hubshare-custom-text';
  const typeHubShareCustomText = GET_HUBSHARECUSTOMTEXT;

  const pathHubShareSetting = '/companies/hubshare-settings';
  const typeHubShareSetting = GET_HUBSHARE_SETTINGS;

  return function (dispatch) {
    dispatch({
      types: [typeHubShareCustomText, `${typeHubShareCustomText}_SUCCESS`, `${typeHubShareCustomText}_FAIL`],
      promise: client => client.get(pathHubShareCustomText, 'webapi')
    }).then(() =>
      dispatch({
        types: [typeHubShareSetting, `${typeHubShareSetting}_SUCCESS`, `${typeHubShareSetting}_FAIL`],
        promise: (client) => client.get(pathHubShareSetting, 'webapi')
      })
    );
  };
}

export function setHubshareCustomText(customText) {
  const path = '/admin/general/hubshare-custom-text';
  const type = SET_HUBSHARECUSTOMTEXT;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    value: customText,
    promise: (client) => client.patch(path, 'webapi', {
      body: { 'customText': customText }
    })
  };
}

export function uploadFileCustomization(param, files = []) {
  return {
    types: [UPLOAD_CUSTOMIZATION, UPLOAD_CUSTOMIZATION_SUCCESS, UPLOAD_CUSTOMIZATION_FAIL],
    uploadId: param,
    promise: (client) => client.post('/admin/general/customization/uploadfiles', 'webapi', {
      params: {
        param: param,
        uploadData: {
          image: files
        }
      },
    })
  };
}

export function setHubshareSettings(hubShareSetting) {
  const path = '/companies/hubshare-settings';
  const type = SET_HUBSHARE_SETTINGS;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    promise: (client) => client.patch(path, 'webapi', {
      body: hubShareSetting
    })
  };
}
