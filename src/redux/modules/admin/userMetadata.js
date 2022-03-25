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
 * @copyright 2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

/**
 * Action Types
 */
import _isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { normalize, Schema, arrayOf } from 'normalizr';

const reduceName = 'userMetadata';
const pathName = 'company-metadata';

export const GET = `admin/${reduceName}/GET`;
export const GET_SUCCESS = `admin/${reduceName}/GET_SUCCESS`;
export const GET_FAIL = `admin/${reduceName}/GET_FAIL`;

export const PUT = `admin/${reduceName}/PUT`;
export const PUT_SUCCESS = `admin/${reduceName}/PUT_SUCCESS`;
export const PUT_FAIL = `admin/${reduceName}/PUT_FAIL`;

export const PATCH = `admin/${reduceName}/PATCH`;
export const PATCH_SUCCESS = `admin/${reduceName}/PATCH_SUCCESS`;
export const PATCH_FAIL = `admin/${reduceName}/PATCH_FAIL`;

export const POST = `admin/${reduceName}/POST`;
export const POST_SUCCESS = `admin/${reduceName}/POST_SUCCESS`;
export const POST_FAIL = `admin/${reduceName}/POST_FAIL`;

export const DEL = `admin/${reduceName}/DEL`;
export const DEL_SUCCESS = `admin/${reduceName}/DEL_SUCCESS`;
export const DEL_FAIL = `admin/${reduceName}/DEL_FAIL`;

export const CLOSE = `admin/${reduceName}/CLOSE`;
export const ADD_ITEM = `admin/${reduceName}/ADD_ITEM`;
export const SET_DATA = `admin/${reduceName}/SET_DATA`;
export const SET_VALUE = `admin/${reduceName}/SET_VALUE`;
export const RESET = `admin/${reduceName}/RESET`;

/**
 * Initial State
 */
export const initialState = {
  reduceName: reduceName,
  userMetadata: [],
  valueById: [],
  userMetadataById: {},
  userMetadataById_orig: {},
  loaded: false,
  loading: false,
  deleted: false,
  deleting: false,
  patchLoaded: false,
  patchLoading: false,
  putLoaded: false,
  putLoading: false,
  postLoaded: false,
  postLoading: false,
  error: null,
};

// Define schemes for our entities
const metadata = new Schema('metadatas', { idAttribute: 'id', defaults: { values: [] } });
const value = new Schema('values');

// Define nesting rules
metadata.define({
  values: arrayOf(value)
});

/**
 * Reducer
 */
export default function reduceData(state = initialState, action = {}) {
  const loaded = (action.customLoad || 'load') + 'ed';
  const loading = (action.customLoad || 'load') + 'ing';

  switch (action.type) {
    case GET:
    case PATCH:
    case PUT:
    case POST:
      return {
        ...state,
        [loaded]: false,
        [loading]: action.type === GET || action.type === PATCH || action.type === POST || action.type === PUT,
        error: null,
      };
    case GET_SUCCESS: {
      // Normalize response
      const list = action.result.map(item => ({ ...item, isHidden: !item.visibility }));
      const normalized = normalize(list, arrayOf(metadata));

      return {
        ...state,
        [loaded]: action.type === GET_SUCCESS,
        [loading]: false,
        valueById: normalized.entities.values,
        userMetadataById: {
          ...state.userMetadataById,
          ...normalized.entities.metadatas,
        },
        userMetadataById_orig: {
          ...state.userMetadataById,
          ...normalized.entities.metadatas,
        },
        userMetadata: normalized.result,
      };
    }
    case PATCH_SUCCESS: {
      return {
        ...state,
        [loaded]: action.type === PATCH_SUCCESS,
        [loading]: false,
        userMetadataById: {
          ...state.userMetadataById,
          [action.result.id]: {
            ...action.result,
            isHidden: !action.result.visibility,
            isModified: false
          }
        },
        userMetadataById_orig: {
          ...state.userMetadataById,
          [action.result.id]: {
            ...action.result,
            isHidden: !action.result.visibility,
            isModified: false
          }
        }
      };
    }
    case PUT_SUCCESS: {
      const normalized = normalize(action.result, metadata);

      return {
        ...state,
        [loaded]: action.type === PUT_SUCCESS,
        [loading]: false,
        valueById: merge({}, state.valueById, normalized.entities.values),
        userMetadataById: {
          ...state.userMetadataById,
          [action.result.id]: {
            ...normalized.entities.metadatas[normalized.result],
            isHidden: !action.result.visibility,
            isModified: false
          }
        },
        userMetadataById_orig: {
          ...state.userMetadataById,
          [action.result.id]: {
            ...normalized.entities.metadatas[normalized.result],
            isHidden: !action.result.visibility,
            isModified: false
          }
        }
      };
    }
    case POST_SUCCESS: {
      const normalized = normalize(action.result, metadata);
      const ids = [...state.userMetadata, action.result.id];

      return {
        ...state,
        [loaded]: action.type === POST_SUCCESS,
        [loading]: false,
        valueById: merge({}, state.valueById, normalized.entities.values),
        userMetadata: ids.filter(i => i !== 'new' + action.params.tmpId),
        userMetadataById: {
          ...state.userMetadataById,
          ['new' + action.params.tmpId]: {
            ...state.userMetadataById['new' + action.params.tmpId],
            deleted: true,
          },
          [action.result.id]: {
            ...normalized.entities.metadatas[normalized.result],
            isHidden: !action.result.visibility,
            isModified: false
          }
        },
        userMetadataById_orig: {
          ...state.userMetadataById_orig,
          ['new' + action.params.tmpId]: {
            ...state.userMetadataById_orig['new' + action.params.tmpId],
            deleted: true,
          },
          [action.result.id]: {
            ...normalized.entities.metadatas[normalized.result],
            isHidden: !action.result.visibility,
            isModified: false
          }
        }
      };
    }

    case GET_FAIL:
    case POST_FAIL:
    case PUT_FAIL:
    case PATCH_FAIL:
      return {
        ...state,
        [loaded]: false,
        [loading]: false,
        error: action.error,
      };

    case DEL: {
      return {
        ...state,
        deleted: false,
        deleting: true,
        userMetadataById: {
          ...state.userMetadataById,
          [action.id]: {
            ...state.userMetadataById[action.id],
            deleted: true
          }
        }
      };
    }
    case DEL_SUCCESS: {
      return {
        ...state,
        deleted: true,
        deleting: false,
        // Remove from Original list
        userMetadataById_orig: {
          ...state.userMetadataById_orig,
          [action.id]: {
            ...state.userMetadataById_orig[action.id],
            deleted: true
          }
        }
      };
    }
    case DEL_FAIL:
      return {
        ...state,
        deleted: false,
        deleting: false,
        userMetadataById: {
          ...state.userMetadataById,
          [action.id]: {
            ...state.userMetadataById[action.id],
            deleted: false
          }
        },
        error: action.error,
      };

    case ADD_ITEM: {
      const list = { ...state.userMetadataById };
      const sequence = Math.max(...Object.keys(list).map(item => list[item].sequence)) + 1;

      let minId = Math.min(...Object.keys(list).map(item => list[item].tmpId || list[item].id));
      minId += -1;
      if (minId >= 0) minId = -1;

      const newAttribute = {
        id: 'new' + minId,
        tmpId: minId,
        attribute: '',
        visibility: true,
        locked: false,
        sequence: parseInt(sequence, 10) || 1,
        values: [],
      };

      list[newAttribute.id] = newAttribute;
      return {
        ...state,
        userMetadataById: list,
        userMetadata: [...state.userMetadata, newAttribute.id]
      };
    }

    case SET_DATA: {
      // Compare and Update values in temporal
      const newValue = { ...state.userMetadataById[action.params.id] };
      const oldValue = { ...state.userMetadataById_orig[action.params.id] };
      newValue[action.params.param] = action.params.value;
      delete newValue.isModified;

      // Set flag for modified attributes
      const isModified = !_isEqual(oldValue, newValue);

      return {
        ...state,
        userMetadataById: {
          ...state.userMetadataById,
          [action.params.id]: {
            ...state.userMetadataById[action.params.id],
            [action.params.param]: action.params.value,
            isModified: isModified
          }
        },
      };
    }

    case SET_VALUE: {
      // Compare and Update values in temporal
      const newValue = { ...state.userMetadataById[action.params.id] };
      const oldValue = { ...state.userMetadataById_orig[action.params.id] };
      const data = {};
      delete newValue.isModified;
      delete oldValue.isModified;

      const valueIds = [...action.params.value.map(item => item.id)];
      data.valueById = { ...state.valueById };

      action.params.value.map(item => {
        data.valueById[item.id] = item;
        return data.valueById[item.id];
      });

      // Set flag for modified attributes
      const newIds = Math.min(...action.params.value.map(item => item.tmpId || item.id));
      const isModified = !_isEqual(oldValue, newValue) || newIds < 0 || !_isEqual(state.userMetadataById_orig[action.params.id].values, valueIds);

      return {
        ...state,
        ...data,
        userMetadataById: {
          ...state.userMetadataById,
          [action.params.id]: {
            ...state.userMetadataById[action.params.id],
            values: valueIds,
            isModified: !!isModified
          }
        },
      };
    }

    case RESET: {
      return {
        ...state,
        userMetadataById: state.userMetadataById_orig,
        userMetadata: state.userMetadata.filter(i => i.tmpId)
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
export function getList(customLoad = 'load', method = 'get') {
  const path = `/admin/${pathName}`;
  const METHOD = `admin/${reduceName}/${method.toUpperCase()}`;
  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    promise: (client) => client[method](path, 'webapi')
  };
}

export function post(params, tableName = reduceName, customLoad = 'postLoad', method = 'post') {
  const path = `/admin/${pathName}`;
  const METHOD = `admin/${reduceName}/${method.toUpperCase()}`;
  const { isModified, tmpId, isHidden, ...tmpParams } = params;

  const data = tmpParams;
  data.visibility = !isHidden;

  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    params: params,
    promise: (client) => client[method](path, 'webapi', {
      body: data,
    })
  };
}

export function patch(params, tableName = reduceName, customLoad = 'patchLoad', method = 'patch') {
  const path = `/admin/${pathName}/${params.id}`;
  const METHOD = `admin/${reduceName}/${method.toUpperCase()}`;
  const { isModified, tmpId, isHidden, ...tmpParams } = params;

  const data = tmpParams;
  data.visibility = !isHidden;

  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    params: params,
    promise: (client) => client[method](path, 'webapi', {
      body: data
    })
  };
}

export function put(params, tableName = reduceName, customLoad = 'putLoad', method = 'put') {
  const path = `/admin/${pathName}/${params.id}`;
  const METHOD = `admin/${reduceName}/${method.toUpperCase()}`;
  const { isModified, tmpId, isHidden, ...tmpParams } = params;

  const data = tmpParams;
  data.visibility = !isHidden;

  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    params: params,
    promise: (client) => client[method](path, 'webapi', {
      body: data
    })
  };
}
//
export function deleteById(id, tableName = reduceName, customLoad = 'deleteLoad', method = 'del') {
  const path = `/admin/${pathName}/${id}`;
  const METHOD = `admin/${reduceName}/${method.toUpperCase()}`;
  return {
    types: [METHOD, `${METHOD}_SUCCESS`, `${METHOD}_FAIL`],
    customLoad,
    tableName,
    id,
    promise: (client) => client[method](path, 'webapi')
  };
}

// Remove temporal data
export function removeById(id, tableName = reduceName) {
  return {
    type: DEL,
    tableName,
    id
  };
}

// Create an empty item
export function addItem(data) {
  return {
    type: ADD_ITEM,
    params: data,
  };
}

// Update userMetadata attributes
export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}

export function setValue(data) {
  return {
    type: SET_VALUE,
    params: data,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}
