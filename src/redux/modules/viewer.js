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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import union from 'lodash/union';

/**
 * Action Types
 */
export const ADD_FILES = 'viewer/ADD_FILES';
export const ADD_FILE = 'viewer/ADD_FILE';
export const REMOVE_FILES = 'viewer/REMOVE_FILES';
export const REMOVE_FILE = 'viewer/REMOVE_FILE';
export const SET_ACTIVE_FILE = 'viewer/SET_ACTIVE_FILE';
export const UPDATE_FILE = 'viewer/UPDATE_FILE';
export const TOGGLE_DOCK = 'viewer/TOGGLE_DOCK';
export const SET_INITIAL_PAGE = 'viewer/SET_INITIAL_PAGE';
export const SET_INITIAL_QUERY = 'viewer/SET_INITIAL_QUERY';

export const LOAD_OPEN_FILE = 'viewer/LOAD_OPEN_FILE';
export const LOAD_OPEN_FILE_SUCCESS = 'viewer/LOAD_OPEN_FILE_SUCCESS';
export const LOAD_OPEN_FILE_FAIL = 'viewer/LOAD_OPEN_FILE_FAIL';

export const LOAD_FILE = 'viewer/LOAD_FILE';
export const LOAD_FILE_SUCCESS = 'viewer/LOAD_FILE_SUCCESS';
export const LOAD_FILE_FAIL = 'viewer/LOAD_FILE_FAIL';

export const LOAD_HTML = 'viewer/LOAD_HTML';
export const LOAD_HTML_SUCCESS = 'viewer/LOAD_HTML_SUCCESS';
export const LOAD_HTML_FAIL = 'viewer/LOAD_HTML_FAIL';

export const ADD_FILE_BOOKMARK = 'viewer/ADD_FILE_BOOKMARK';
export const ADD_FILE_BOOKMARK_SUCCESS = 'viewer/ADD_FILE_BOOKMARK_SUCCESS';
export const ADD_FILE_BOOKMARK_FAIL = 'viewer/ADD_FILE_BOOKMARK_FAIL';

export const DELETE_FILE_BOOKMARK = 'viewer/DELETE_FILE_BOOKMARK';
export const DELETE_FILE_BOOKMARK_SUCCESS = 'viewer/DELETE_FILE_BOOKMARK_SUCCESS';
export const DELETE_FILE_BOOKMARK_FAIL = 'viewer/DELETE_FILE_BOOKMARK_FAIL';

export const ADD_BOOKMARK_STACK = 'viewer/ADD_BOOKMARK_STACK';
export const ADD_BOOKMARK_STACK_SUCCESS = 'viewer/ADD_BOOKMARK_STACK_SUCCESS';
export const ADD_BOOKMARK_STACK_FAIL = 'viewer/ADD_BOOKMARK_STACK_FAIL';

export const DELETE_BOOKMARK_STACK = 'viewer/DELETE_BOOKMARK_STACK';
export const DELETE_BOOKMARK_STACK_SUCCESS = 'viewer/DELETE_BOOKMARK_STACK_SUCCESS';
export const DELETE_BOOKMARK_STACK_FAIL = 'viewer/DELETE_BOOKMARK_STACK_FAIL';

export const RECORD_DATA = 'viewer/RECORD_DATA';
export const RECORD_DATA_SUCCESS = 'viewer/RECORD_DATA_SUCCESS';
export const RECORD_DATA_FAIL = 'viewer/RECORD_DATA_FAIL';

export const GET_LATEST_FILE_ID = 'viewer/GET_LATEST_FILE_ID';
export const GET_LATEST_FILE_ID_SUCCESS = 'viewer/GET_LATEST_FILE_ID_SUCCESS';
export const GET_LATEST_FILE_ID_FAIL = 'viewer/GET_LATEST_FILE_ID_FAIL';

/**
 * Reducer
 */
export const initialState = {
  activeFileId: null,
  isDocked: false,
  loading: false,
  loadingContent: false,
  order: [],  // file ids
  error: null,
  bookmarkId: null,
  initialQuery: '',
  initialPage: 1,
};
export default function filesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_FILES:
      return {
        ...state,
        activeFileId: action.files[0],
        order: union(state.order, action.files),
        isDocked: false
      };

    case ADD_FILE:
      return {
        activeFileId: action.id,
        isDocked: false,
        order: union(state.order, [action.id]),
      };
    case REMOVE_FILES:
      return {
        ...state,
        activeFileId: null,
        isDocked: false,
        order: [],
        initialQuery: '',
        initialPage: 1,
      };
    case REMOVE_FILE: {
      const fileIndex = state.order.findIndex(id => id === action.id);
      const newOrder = [...state.order];
      if (fileIndex > -1) {
        newOrder.splice(fileIndex, 1);
      }

      // Update activeFileId if removing currently active file
      let activeFileId = state.activeFileId;
      if (!newOrder.length) {
        activeFileId = null;
      } else if (activeFileId === action.id) {
        activeFileId = newOrder[newOrder.length - 1];
      }

      return {
        ...state,
        activeFileId: activeFileId,
        order: newOrder
      };
    }

    case TOGGLE_DOCK:
      return {
        ...state,
        isDocked: !state.isDocked
      };
    case SET_INITIAL_PAGE:
      return {
        ...state,
        initialPage: action.page
      };
    case SET_INITIAL_QUERY:
      return {
        ...state,
        initialQuery: action.text
      };
    case SET_ACTIVE_FILE:
      return {
        ...state,
        activeFileId: action.id
      };
    case LOAD_OPEN_FILE:
      return {
        ...state,
        loadingContent: true
      };
    case LOAD_OPEN_FILE_SUCCESS: {
      window.open(action.result.sourceUrl);  // diabolical
      return {
        ...state,
        loadingContent: false
      };
    }
    case LOAD_OPEN_FILE_FAIL:
      return {
        ...state,
        loaded: false,
        loadingContent: false,
        error: action.error
      };
    case LOAD_FILE:
      return {
        ...state,
        loading: true
      };
    case LOAD_FILE_SUCCESS:
      return {
        ...state,
        loading: false,
        activeFileId: action.setActive ? action.id : null,
        order: union(state.order, [action.id]),
        isDocked: false
      };
    case LOAD_FILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case RECORD_DATA:
      return {
        ...state
      };

    case GET_LATEST_FILE_ID:
      return {
        ...state,
        loadingLatestFileId: true
      };
    case GET_LATEST_FILE_ID_SUCCESS:
      return {
        ...state,
        loadingLatestFileId: false,
        latestFileId: action.result.id
      };
    case GET_LATEST_FILE_ID_FAIL:
      return {
        ...state,
        loadingLatestFileId: false,
        error: action.error
      };

    /**
     * Bookmarks
     */
    case ADD_FILE_BOOKMARK_SUCCESS:
      return {
        ...state,
      };
    case ADD_FILE_BOOKMARK_FAIL:
    case DELETE_FILE_BOOKMARK_FAIL:
    case DELETE_BOOKMARK_STACK_FAIL:
    case ADD_BOOKMARK_STACK_FAIL:
      return {
        ...state,
        error: action.error
      };

    default:
      return state;
  }
}

/* Action Creators */

export function addFiles(files = []) {
  return {
    type: ADD_FILES,
    files
  };
}

export function addFile(id) {
  return {
    type: ADD_FILE,
    id
  };
}

export function removeFiles() {
  return {
    type: REMOVE_FILES
  };
}

export function removeFile(id) {
  return {
    type: REMOVE_FILE,
    id
  };
}

export function setActiveFile(id) {
  return {
    type: SET_ACTIVE_FILE,
    id
  };
}

export function updateFile(id, update) {
  return {
    type: UPDATE_FILE,
    id,
    update
  };
}

export function toggleDock() {
  return {
    type: TOGGLE_DOCK
  };
}

export function setInitialPage(page) {
  return {
    type: SET_INITIAL_PAGE,
    page
  };
}

export function setInitialQuery(text) {
  return {
    type: SET_INITIAL_QUERY,
    text
  };
}

export function getLatestFileId(permId) {
  return {
    types: [GET_LATEST_FILE_ID, GET_LATEST_FILE_ID_SUCCESS, GET_LATEST_FILE_ID_FAIL],
    id: permId,
    promise: (client) => client.get('/file/getLatestFileId', 'webapi', {
      params: {
        id: permId,
      }
    })
  };
}
export function loadOpenFile(id) {
  return {
    types: [LOAD_OPEN_FILE, LOAD_OPEN_FILE_SUCCESS, LOAD_OPEN_FILE_FAIL],
    id,
    promise: (client) => client.get('/file/get', 'webapi', {
      params: {
        id: id,
        include_story: true,
        include_blocks: true,
      }
    })
  };
}

export function loadFile(id, setActive = true) {
  return {
    types: [LOAD_FILE, LOAD_FILE_SUCCESS, LOAD_FILE_FAIL],
    id,
    setActive,
    promise: (client) => client.get('/file/get', 'webapi', {
      params: {
        id: id,
        include_story: true,
        include_blocks: true,
      }
    })
  };
}

export function loadHtmlData(id) {
  return {
    types: [LOAD_HTML, LOAD_HTML_SUCCESS, LOAD_HTML_FAIL],
    id,
    promise: (client) => client.get('/file/getHtmlData', 'webapi', {
      params: {
        id: id
      }
    })
  };
}

/**
 * Bookmark Files
 */
export function addBookmark(id, name = null, data) {
  return {
    types: [ADD_FILE_BOOKMARK, ADD_FILE_BOOKMARK_SUCCESS, ADD_FILE_BOOKMARK_FAIL],
    id,
    data,
    promise: (client) => client.post('/me/addBookmark', 'webapi', {
      data: {
        name: name,
        type: 'files',
        data: JSON.stringify(data)
      }
    })
  };
}

export function deleteBookmark(id, bookmarkId) {
  return {
    types: [DELETE_FILE_BOOKMARK, DELETE_FILE_BOOKMARK_SUCCESS, DELETE_FILE_BOOKMARK_FAIL],
    id,
    bookmarkId,
    promise: (client) => client.post('/me/deleteBookmark', 'webapi', {
      params: {
        id: bookmarkId
      }
    })
  };
}

export function addBookmarkStack(name = null, data) {
  return {
    types: [ADD_BOOKMARK_STACK, ADD_BOOKMARK_STACK_SUCCESS, ADD_BOOKMARK_STACK_FAIL],
    promise: (client) => client.post('/me/addBookmark', 'webapi', {
      data: {
        name: name,
        type: 'files',
        data: JSON.stringify(data)
      }
    })
  };
}

export function deleteBookmarkStack(bookmarkId) {
  return {
    types: [DELETE_BOOKMARK_STACK, DELETE_BOOKMARK_STACK_SUCCESS, DELETE_BOOKMARK_STACK_FAIL],
    bookmarkId,
    promise: (client) => client.post('/me/deleteBookmark', 'webapi', {
      data: {
        id: bookmarkId
      }
    })
  };
}

export function recordData(data) {
  return {
    types: [RECORD_DATA, RECORD_DATA_SUCCESS, RECORD_DATA_FAIL],
    promise: (client) => client.post('/file/record_data', 'webapi4', {
      data
    })
  };
}
