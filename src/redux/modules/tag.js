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
 * @author Shibu Bhattarai <rubenson.barrios@bigtincan.com>
 */

import _uniq from 'lodash/uniq';

export const LOAD_TAGS = 'tag/LOAD_TAGS';
export const LOAD_TAGS_SUCCESS = 'tag/LOAD_TAGS_SUCCESS';
export const LOAD_TAGS_FAIL = 'tag/LOAD_TAGS_FAIL';

export const GET_FILE_TAGS = 'tag/LOAD_TAGS';
export const GET_FILE_TAGS_SUCCESS = 'tag/GET_FILE_TAGS_SUCCESS';
export const GET_FILE_TAGS_FAIL = 'tag/GET_FILE_TAGS_FAIL';

export const ADD_TAGS = 'tag/ADD_TAGS';
export const ADD_TAGS_SUCCESS = 'tag/ADD_TAGS_SUCCESS';
export const ADD_TAGS_FAIL = 'tag/ADD_TAGS_FAIL';

export const ADD_TAGS_TO_FILE = 'tag/ADD_TAGS_TO_FILE';
export const ADD_TAGS_TO_FILE_SUCCESS = 'tag/ADD_TAGS_TO_FILE_SUCCESS';
export const ADD_TAGS_TO_FILE_FAIL = 'tag/ADD_TAGS_TO_FILE_FAIL';

export const REMOVE_TAGS_FROM_FILE = 'tag/REMOVE_TAGS_FROM_FILE';
export const REMOVE_TAGS_FROM_FILE_SUCCESS = 'tag/REMOVE_TAGS_FROM_FILE_SUCCESS';
export const REMOVE_TAGS_FROM_FILE_FAIL = 'tag/REMOVE_TAGS_FROM_FILE_FAIL';

export const CLEAR_TAGS = 'tags/CLEAR_TAGS';


export const initialState = {
  keyword: '',
  tagsLoaded: false,
  tagsLoading: false,
  tagsLoadComplete: false,
  allTags: [],
  tags: [],
  currentTag: null,
  saving: false,
  saved: false,
  error: null,

  fileTagAdded: false,
  fileTagAdding: false,

  fileTagRemoved: false,
  fileTagRemoving: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_TAGS:
      return {
        ...state,
        tagsLoaded: false,
        tagsLoading: true
      };
    case LOAD_TAGS_SUCCESS: {
      return {
        ...state,
        allTags: action.result,
        tagsLoaded: true,
        tagsLoading: false,
        error: null
      };
    }
    case LOAD_TAGS_FAIL:
      return {
        ...state,
        tagsLoading: false,
        tagsLoaded: false,
        error: action.error,
      };
    case ADD_TAGS:
      return {
        ...state,
        saving: true,
        saved: false
      };
    case ADD_TAGS_SUCCESS: {
      return {
        ...state,
        currentTag: { ...action.result, fileId: action.params.fileId },
        saved: true,
        saving: false,
        error: null
      };
    }
    case ADD_TAGS_FAIL:
      return {
        ...state,
        saving: false,
        saved: false,
        error: action.error,
      };
    case ADD_TAGS_TO_FILE: {
      const tags = [...state.tags, { id: action.params.tagId, name: action.params.tagName }];
      return {
        ...state,
        tags: _uniq(tags, 'id'),
        fileTagAdded: false,
        fileTagAdding: true
      };
    }
    case ADD_TAGS_TO_FILE_SUCCESS: {
      return {
        ...state,
        fileTagAdded: true,
        fileTagAdding: false,
        error: null
      };
    }
    case ADD_TAGS_TO_FILE_FAIL:
      return {
        ...state,
        fileTagAdding: false,
        fileTagAdded: false,
        error: action.error,
      };
    case REMOVE_TAGS_FROM_FILE:
      return {
        ...state,
        fileTagRemoved: false,
        fileTagRemoving: true
      };
    case REMOVE_TAGS_FROM_FILE_SUCCESS: {
      const allTags = state.allTags.filter(item => item.id !== action.params.tagId);
      const tags = state.tags.filter(item => item.id !== action.params.tagId);

      return {
        ...state,
        allTags: allTags,
        tags: tags,
        currentTag: null,
        fileTagRemoved: true,
        fileTagRemoving: false,
        error: null
      };
    }
    case REMOVE_TAGS_FROM_FILE_FAIL:
      return {
        ...state,
        fileTagRemoved: false,
        fileTagRemoving: false,
        error: action.error,
      };
    case GET_FILE_TAGS:
      return {
        ...state,
      };
    case GET_FILE_TAGS_SUCCESS: {
      return {
        ...state,
        tags: action.result,
        error: null
      };
    }
    case GET_FILE_TAGS_FAIL:
      return {
        ...state,
        error: action.error,
      };
    case CLEAR_TAGS:
      return initialState;
    default:
      return state;
  }
}

export function searchTags(params) {
  return {
    types: [LOAD_TAGS, LOAD_TAGS_SUCCESS, LOAD_TAGS_FAIL],
    params: params,
    promise: (client) => client.get('/tags/search?q=' + params.keyword, 'webapi')
  };
}
export function addTag(data) {
  const { fileId, ...others } = data;
  return {
    types: [ADD_TAGS, ADD_TAGS_SUCCESS, ADD_TAGS_FAIL],
    params: { fileId, ...others },
    promise: (client) => client.post('/tags', 'webapi', {
      body: others
    })
  };
}

export function addTagToFile(data) {
  return {
    types: [ADD_TAGS_TO_FILE, ADD_TAGS_TO_FILE_SUCCESS, ADD_TAGS_TO_FILE_FAIL],
    params: {
      ...data
    },
    promise: (client) => client.patch('/files/' + data.fileId + '/tags', 'webapi', {
      body: {
        id: data.tagId
      }
    })
  };
}

export function removeTagToFile(data) {
  return {
    types: [REMOVE_TAGS_FROM_FILE, REMOVE_TAGS_FROM_FILE_SUCCESS, REMOVE_TAGS_FROM_FILE_FAIL],
    params: {
      tagId: data.tagId,
      fileId: data.fileId
    },
    promise: (client) => client.del('/files/' + data.fileId + '/tags/' + data.tagId, 'webapi')
  };
}
export function getStoryFileTags(storyId, fileId) {
  return {
    types: [GET_FILE_TAGS, GET_FILE_TAGS_SUCCESS, GET_FILE_TAGS_FAIL],
    params: {
      permId: storyId,
      fileId: fileId
    },
    promise: (client) => client.get('/files/' + fileId + '/tags', 'webapi')
  };
}
/**
 * Clears existing tags data
 */
export function clear() {
  return {
    type: CLEAR_TAGS
  };
}
