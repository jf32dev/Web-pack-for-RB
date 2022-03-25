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
import _get from 'lodash/get';

export const GET_HOMESCREEN = 'admin/homeScreens/GET_HOMESCREEN';
export const GET_HOMESCREEN_SUCCESS = 'admin/homeScreens/GET_HOMESCREEN_SUCCESS';
export const GET_HOMESCREEN_FAIL = 'admin/homeScreens/GET_HOMESCREEN_FAIL';

export const GET_CONFIGURATION_BUNDLES = 'admin/homeScreens/GET_CONFIGURATION_BUNDLES';
export const GET_CONFIGURATION_SUCCESS = 'admin/homeScreens/GET_CONFIGURATION_SUCCESS';
export const GET_CONFIGURATION_FAIL = 'admin/homeScreens/GET_CONFIGURATION_FAIL';


export const SET_HOMESCREEN_TO_CONFIG_BUNDLE = 'admin/homeScreens/SET_HOMESCREEN_TO_CONFIG_BUNDLE';
export const SET_HOMESCREEN_TO_CONFIG_BUNDLE_SUCCESS = 'admin/homeScreens/SET_HOMESCREEN_TO_CONFIG_BUNDLE_SUCCESS';
export const SET_HOMESCREEN_TO_CONFIG_BUNDLE_FAIL = 'admin/homeScreens/SET_HOMESCREEN_TO_CONFIG_BUNDLE_FAIL';

export const SET_HOMESCREEN = 'admin/homeScreens/SET_HOMESCREEN';
export const SET_HOMESCREEN_SUCCESS = 'admin/homeScreens/SET_HOMESCREEN_SUCCESS';
export const SET_HOMESCREEN_FAIL = 'admin/homeScreens/SET_HOMESCREEN_FAIL';

export const DELETE_HOMESCREEN = 'admin/homeScreens/DELETE_HOMESCREEN';
export const DELETE_HOMESCREEN_SUCCESS = 'admin/homeScreens/DELETE_HOMESCREEN_SUCCESS';
export const DELETE_HOMESCREEN_FAIL = 'admin/homeScreens/DELETE_HOMESCREEN_FAIL';

export const UPLOAD_FILES_PROGRESS = 'admin/homeScreens/UPLOAD_FILES_PROGRESS';

export const INSTANT_UPDATE = 'admin/homeScreens/INSTANT_UPDATE';
export const CLEAR_CONFIGURATION_STATE = 'admin/homeScreens/CLEAR_CONFIGURATION_STATE';

export const ADD_ONS = 'addOns';
export const PAGES = 'pages';
export const LEGACY = 'legacy';

export const initialState = {
  configuratonBundles: [],
  configuratonBundlesLoaded: false,
  configuratonBundlesLoading: false,

  pages: [],
  pagesLoaded: false,
  pagesLoading: false,
  pagesUpdated: false,
  pagesUpdating: false,

  addOns: [],
  addOnsLoaded: false,
  addOnsLoading: false,
  addOnsUpdated: false,
  addOnsUpdating: false,

  legacy: [],
  legacyLoaded: false,
  legacyLoading: false,
  legacyUpdated: false,
  legacyUpdating: false,

  instantUpdate: false,

  error: null,
  homeScreenAssignComplete: 0
};

export default function homeScreens(state = initialState, action = {}) {
  switch (action.type) {
    case INSTANT_UPDATE:
      return {
        ...state,
        instantUpdate: true,
        error: null
      };
    case GET_HOMESCREEN:
    case SET_HOMESCREEN: {
      let returnValues = state[action.name];

      if (action.isUpload) {
        returnValues = returnValues.concat({
          id: action.params.name + action.index,
          name: action.params.name,
          progress: 1
        });
      }

      return {
        ...state,
        [action.name + 'Loaded']: action.type === GET_HOMESCREEN ? true : state[action.name + 'Loaded'],
        [action.name + 'Loading']: action.type === GET_HOMESCREEN,
        [action.name + 'Updated']: false,
        [action.name + 'Updating']: action.type === SET_HOMESCREEN,
        [action.name]: returnValues,
        error: null
      };
    }
    case GET_HOMESCREEN_SUCCESS:
    case SET_HOMESCREEN_SUCCESS: {
      let returnValues = action.result;

      if (action.result && typeof action.result === 'object' && !Array.isArray(action.result) && action.actionType === 'edit') {
        returnValues = state[action.name].map(item => {
          if (item.id === action.result.id) {
            return action.result;
          } else if (action.name === PAGES) {
            return {
              ...item,
              isDefault: false
            };
          }
          return item;
        });
      } else if (action.actionType === 'create' && action.isUpload) {
        returnValues = state[action.name];
        returnValues[action.index] = action.result;
      } else if (action.actionType === 'create') {
        returnValues = state[action.name].concat(action.result);
      }
      return {
        ...state,
        [action.name + 'Loaded']: action.type === GET_HOMESCREEN_SUCCESS ? true : state[action.name + 'Loaded'],
        [action.name + 'Loading']: false,
        [action.name + 'Updated']: action.type === SET_HOMESCREEN_SUCCESS,
        [action.name + 'Updating']: false,
        [action.name]: returnValues
      };
    }
    case UPLOAD_FILES_PROGRESS: {
      const returnValues = state[action.name].slice();
      returnValues[action.index] = {
        id: action.params.name + action.index,
        name: action.params.name,
        progress: action.progress || 1
      };
      return {
        ...state,
        [action.name]: returnValues
      };
    }
    case DELETE_HOMESCREEN_SUCCESS:
      return {
        ...state,
        [action.name]: state[action.name].filter(item => Number(item.id) !== Number(action.params.id)),
      };
    case GET_HOMESCREEN_FAIL:
    case SET_HOMESCREEN_FAIL:
    case DELETE_HOMESCREEN_FAIL:
      if (action.actionType === 'create') {
        const returnValues = state[action.name];
        return {
          ...state,
          [action.name + 'Loaded']: false,
          [action.name + 'Loading']: false,
          [action.name + 'Updated']: false,
          [action.name + 'Updating']: false,
          [action.name]: returnValues.splice(0, returnValues.length - 1),
          loaded: false,
          loading: false,
          error: action.error,
        };
      }
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error,
      };

    case GET_CONFIGURATION_BUNDLES: {
      return {
        ...state,
        configuratonBundlesLoaded: false,
        configuratonBundlesLoading: true,
        error: null
      };
    }
    case GET_CONFIGURATION_SUCCESS: {
      const bundles = action.result.map((item) => {
        const clone = Object.assign({}, item);
        clone.id = +clone.id;
        clone.currentHomeScreenId = +_get(clone.items, 'home_screen_v3_0', '0');
        clone.currentLegacyHomeScreenId = +_get(clone.items, 'home_screen_v2_0', '0');
        return clone;
      });
      return {
        ...state,
        configuratonBundlesLoaded: true,
        configuratonBundlesLoading: false,
        configuratonBundles: bundles,
        error: null
      };
    }
    case GET_CONFIGURATION_FAIL: {
      return {
        ...state,
        configuratonBundlesLoaded: false,
        configuratonBundlesLoading: false,
        error: action.error
      };
    }
    case SET_HOMESCREEN_TO_CONFIG_BUNDLE: {
      return {
        ...state,
        error: null,
        homeScreenAssignComplete: 0
      };
    }
    case SET_HOMESCREEN_TO_CONFIG_BUNDLE_SUCCESS: {
      return {
        ...state,
        homeScreenAssignComplete: action.params.configBundleId,
        error: null
      };
    }
    case SET_HOMESCREEN_TO_CONFIG_BUNDLE_FAIL: {
      return {
        ...state,
        error: action.error,
        homeScreenAssignComplete: 0
      };
    }
    case CLEAR_CONFIGURATION_STATE:
      return {
        ...state,
        homeScreenAssignComplete: 0
      };
    default:
      return state;
  }
}

export function getHomeScreens(name) {
  const path = `/admin/homescreens/${name}/get`;
  const type = GET_HOMESCREEN;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    name,
    promise: (client) => client.get(path, 'webapi')
  };
}

export function setHomeScreens(update, name) {
  const path = `/admin/homescreens/${name}/set`;
  const type = SET_HOMESCREEN;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    params: { ...update },
    name,
    actionType: update.id ? 'edit' : 'create',
    promise: (client) => client.post(path, 'webapi', {
      data: {
        ...update
      },
    })
  };
}

export function deleteHomeScreens(update, name) {
  const path = `/admin/homescreens/${name}/delete`;
  const type = DELETE_HOMESCREEN;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    params: update,
    name,
    promise: (client) => client.post(path, 'webapi', {
      data: update,
    })
  };
}

function uploadFilesProgress(update, name, index, progress) {
  return {
    type: UPLOAD_FILES_PROGRESS,
    params: update,
    name,
    index,
    progress
  };
}

export function uploadFile(name, update, index, dispatch) {
  const path = `/admin/homescreens/${name}/uploadfile`;
  const type = SET_HOMESCREEN;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    name,
    isUpload: true,
    actionType: 'create',
    index,
    params: update,
    promise: (client) => client.post(path, 'webapi', {
      params: {
        name: update.name,
        uploadData: {
          file: [update.file]
        }
      },
      progress: (e) => {
        dispatch(uploadFilesProgress(update, name, index, e.percent));
      }
    })
  };
}

export function updateEntity(name, value) {
  return {
    type: INSTANT_UPDATE,
    name,
    value
  };
}

export function getConfigurationBundles() {
  const path = '/configuration-bundles';
  return {
    types: [GET_CONFIGURATION_BUNDLES, GET_CONFIGURATION_SUCCESS, GET_CONFIGURATION_FAIL],
    promise: (client) => client.get(path, 'webapi')
  };
}

export function assignHomeScreenToConfigBundle(id, homeScreenId, type) {
  const path = '/configuration-bundles/' + id;
  let homeScreenKey = 'home_screen_v3_0';
  if (type === 'legacy') {
    homeScreenKey = 'home_screen_v2_0';
  }
  return {
    types: [SET_HOMESCREEN_TO_CONFIG_BUNDLE, SET_HOMESCREEN_TO_CONFIG_BUNDLE_SUCCESS, SET_HOMESCREEN_TO_CONFIG_BUNDLE_FAIL],
    params: {
      configBundleId: id,
      homeScreenId
    },
    promise: (client) => client.patch(path, 'webapi', {
      body: JSON.stringify([{
        key: homeScreenKey,
        value: homeScreenId
      }])
    })
  };
}
export function clearConfigurationState() {
  return {
    type: CLEAR_CONFIGURATION_STATE
  };
}

export function uploadBTCAHomescreenForDevice(name, update, index, dispatch) {
  const path = '/admin/homescreens/legacy/set';
  const type = SET_HOMESCREEN;
  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    name,
    isUpload: true,
    actionType: 'create',
    index,
    params: update,
    promise: (client) => client.post(path, 'webapi', {
      params: {
        customParams: {
          version: '3.0',
          name: update.name,
        },
        uploadData: {
          file: [update.file],
        }
      },
      progress: (e) => {
        dispatch(uploadFilesProgress(update, name, index, e.percent));
      }
    })
  };
}
