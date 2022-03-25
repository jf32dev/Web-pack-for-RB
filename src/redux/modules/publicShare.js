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
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

/**
 * Action Types
 */
export const LOAD_BROADCAST_STATUS = 'broadcast/LOAD_STATUS';
export const LOAD_BROADCAST_STATUS_SUCCESS = 'broadcast/LOAD_STATUS_SUCCESS';
export const LOAD_BROADCAST_STATUS_FAIL = 'broadcast/LOAD_STATUS_FAIL';

export const JOIN_BROADCAST = 'broadcast/JOIN_BROADCAST';
export const JOIN_BROADCAST_SUCCESS = 'broadcast/JOIN_BROADCAST_SUCCESS';
export const JOIN_BROADCAST_FAIL = 'broadcast/JOIN_BROADCAST_FAIL';

export const START_BROADCAST = 'broadcast/START_BROADCAST';
export const START_BROADCAST_SUCCESS = 'broadcast/START_BROADCAST_SUCCESS';
export const START_BROADCAST_FAIL = 'broadcast/START_BROADCAST_FAIL';

export const STOP_BROADCAST = 'broadcast/STOP_BROADCAST';
export const STOP_BROADCAST_SUCCESS = 'broadcast/STOP_BROADCAST_SUCCESS';
export const STOP_BROADCAST_FAIL = 'broadcast/STOP_BROADCAST_FAIL';

export const INVITE_BROADCAST = 'broadcast/INVITE_BROADCAST';
export const INVITE_BROADCAST_SUCCESS = 'broadcast/INVITE_BROADCAST_SUCCESS';
export const INVITE_BROADCAST_FAIL = 'broadcast/INVITE_BROADCAST_FAIL';

export const LOAD_SHARE = 'public/LOAD_SHARE';
export const LOAD_SHARE_SUCCESS = 'public/LOAD_SHARE_SUCCESS';
export const LOAD_SHARE_FAIL = 'public/LOAD_SHARE_FAIL';

export const LOAD_HTML = 'public/LOAD_HTML';
export const LOAD_HTML_SUCCESS = 'public/LOAD_HTML_SUCCESS';
export const LOAD_HTML_FAIL = 'public/LOAD_HTML_FAIL';

export const FORWARD = 'public/FORWARD';
export const FORWARD_SUCCESS = 'public/FORWARD_SUCCESS';
export const FORWARD_FAIL = 'public/FORWARD_FAIL';

export const INTERACTION = 'public/INTERACTION';
export const INTERACTION_SUCCESS = 'public/INTERACTION_SUCCESS';
export const INTERACTION_FAIL = 'public/INTERACTION_FAIL';

export const UPDATE_FILES = 'public/UPDATE_FILES';
export const UPDATE_FILE = 'public/UPDATE_FILE';

export const BROADCAST_CLOSE = 'broadcast/BROADCAST_CLOSE';

export const RESET_HISTORY_ID = 'broadcast/RESET_HISTORY_ID';

export const RECORD_HUBSHARE_DATA = 'public/RECORD_HUBSHARE_DATA';
export const RECORD_HUBSHARE_DATA_SUCCESS = 'public/RECORD_HUBSHARE_DATA_SUCCESS';
export const RECORD_HUBSHARE_DATA_FAIL = 'public/RECORD_HUBSHARE_DATA_FAIL';

/**
 * Initial State
 */
export const initialState = {
  loaded: false,
  loading: false,
  joined: false,
  joining: false,
  started: false,
  starting: false,
  invited: false,
  inviting: false,
  loadedHtml: false,
  loadingHtml: false,
  forwarded: false,
  forwarding: false,
  isBlankSlateError: false,
  isFormattedMessageError: false,
};

/**
 * Reducer
 */
export default function broadcast(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_BROADCAST_STATUS:
    case JOIN_BROADCAST:
    case START_BROADCAST:
    case INVITE_BROADCAST:
    case LOAD_SHARE:
    case LOAD_HTML:
    case INTERACTION: {
      let loadProperty = action.type === LOAD_BROADCAST_STATUS || action.type === LOAD_SHARE ? {
        loaded: false,
        loading: true,
      } : {};

      if (action.firstTime) {
        loadProperty = {
          loaded: false,
          loading: false,
        };
      }
      return {
        ...state,
        ...loadProperty,
        joined: false,
        joining: action.type === JOIN_BROADCAST,
        started: false,
        starting: action.type === START_BROADCAST,
        invited: false,
        inviting: action.type === INVITE_BROADCAST,
        loadedHtml: false,
        loadingHtml: action.type === LOAD_HTML,
        forwarded: false,
        forwarding: action.type === FORWARD,
        interactioned: false,
        interactioning: action.type === INTERACTION,
        isBlankSlateError: false,
        isFormattedMessageError: false,
      };
    }
    case UPDATE_FILES:
      return {
        ...state,
        files: action.files
      };

    case UPDATE_FILE:
      return {
        ...state,
        files: state.files.map(file => (file.id === action.file.id ? { ...file, ...action.file } : file))
      };
    case LOAD_BROADCAST_STATUS_SUCCESS:
    case JOIN_BROADCAST_SUCCESS:
    case START_BROADCAST_SUCCESS:
    case INVITE_BROADCAST_SUCCESS:
    case LOAD_SHARE_SUCCESS:
    case FORWARD_SUCCESS:
    case INTERACTION_SUCCESS: {
      const loadProperty = action.type === LOAD_BROADCAST_STATUS_SUCCESS || action.type === LOAD_SHARE_SUCCESS || action.type === FORWARD_SUCCESS ? {
        loaded: true,
        loading: false,
      } : {};

      const newFiles = {};
      if (action.result && action.result.files && action.result.files.length) {
        newFiles.files = action.result.files.map(file => {
          return {
            ...file,
            url: file.dataUrl || file.url,
          };
        });
      }

      return {
        ...state,
        ...loadProperty,
        joined: action.type === JOIN_BROADCAST_SUCCESS,
        joining: false,
        started: action.type === START_BROADCAST_SUCCESS,
        starting: false,
        invited: action.type === INVITE_BROADCAST_SUCCESS,
        inviting: false,
        forwarded: action.type === FORWARD_SUCCESS,
        forwarding: false,
        interactioned: action.type === INTERACTION_SUCCESS,
        interactioning: false,
        isBlankSlateError: false,
        isFormattedMessageError: false,
        ...action.result,
        ...newFiles
      };
    }
    case LOAD_HTML_SUCCESS: {
      const { id, baseUrl, data } = action.result;
      // BTCP file needs a <base> tag inserted
      // is file/user id still required for analytics?
      // can this be done during conversion?
      let parsedData;
      const baseString = '<base href="' + baseUrl + '?fileid=' + id + '&uid=' + action.userId + '">';

      // Check <head> exists
      if (data.indexOf('<head>') > -1) {
        parsedData = data.replace('<head>', '<head>' + baseString);
        // Assuming <html> exists
      } else {
        parsedData = data.replace('<html>', '<html><head>' + baseString + '</head>');
      }

      // Some BTC files clear localStorage, we need to remove this to avoid access token being cleared
      if (parsedData.indexOf('localStorage.clear()') > -1) {
        parsedData = parsedData.replace(/localStorage.clear\(\);*/g, '');
      }

      const fixedFile = {
        baseUrl: baseUrl,
        data: parsedData
      };

      return {
        ...state,
        loadingHtml: false,
        loadedHtml: true,
        files: state.files.map(file => (file.id === action.fileId ? { ...file, ...fixedFile } : file))
      };
    }
    case LOAD_BROADCAST_STATUS_FAIL:
    case JOIN_BROADCAST_FAIL:
    case START_BROADCAST_FAIL:
    case INVITE_BROADCAST_FAIL:
    case LOAD_SHARE_FAIL:
    case LOAD_HTML_FAIL:
    case FORWARD_FAIL:
    case STOP_BROADCAST_FAIL:
      return {
        ...state,
        loaded: action.type === JOIN_BROADCAST_FAIL || action.type === LOAD_SHARE_FAIL || action.type === LOAD_HTML_FAIL,
        loading: false,
        joined: false,
        joining: false,
        started: false,
        starting: false,
        error: action.error,
        isBlankSlateError: action.type === LOAD_BROADCAST_STATUS_FAIL,
        isFormattedMessageError: action.type === JOIN_BROADCAST_FAIL,
        files: state.files && state.files.length ? state.files.map(file => (file.id === action.fileId ? { ...file, error: action.error } : file)) : []
      };

    case BROADCAST_CLOSE:
      return initialState;

    case RESET_HISTORY_ID:
      return {
        ...state,
        historyId: null
      };

    case RECORD_HUBSHARE_DATA:
      return {
        ...state
      };

    default:
      return state;
  }
}

/**
 * Action Creators
 */
export function loadStatus(id, firstTime) {
  return {
    types: [LOAD_BROADCAST_STATUS, LOAD_BROADCAST_STATUS_SUCCESS, LOAD_BROADCAST_STATUS_FAIL],
    firstTime,
    promise: (client) => client.post('/broadcast/status', 'webapi', {
      params: {
        broadcastRoomId: id,
      }
    })
  };
}

export function joinBroadcast(nickname, broadcastRoomId, password) {
  return {
    types: [JOIN_BROADCAST, JOIN_BROADCAST_SUCCESS, JOIN_BROADCAST_FAIL],
    promise: (client) => client.post('/broadcast/join', 'webapi', {
      params: Object.assign({
        broadcastRoomId,
        nickname,
      }, password ? { password } : {})
    })
  };
}

export function startBroadcast(fileId, password) {
  return {
    types: [START_BROADCAST, START_BROADCAST_SUCCESS, START_BROADCAST_FAIL],
    promise: (client) => client.post('/broadcast/start', 'webapi', {
      params: Object.assign({
        fileId,
      }, password ? { password } : {})
    })
  };
}

export function stopBroadcast(broadcastRoomId) {
  return {
    types: [STOP_BROADCAST, STOP_BROADCAST_SUCCESS, STOP_BROADCAST_FAIL],
    promise: (client) => client.post('/broadcast/stop', 'webapi', {
      data: {
        broadcastRoomId,
      }
    })
  };
}

export function inviteBroadcast(broadcastRoomId, emails, subject, body, passwordInBody) {
  return {
    types: [INVITE_BROADCAST, INVITE_BROADCAST_SUCCESS, INVITE_BROADCAST_FAIL],
    promise: (client) => client.post('/broadcast/invite', 'webapi', {
      params: {
        broadcastRoomId,
        emails,
        subject,
        body,
        passwordInBody,
      }
    })
  };
}

/** Public share APIs **/
export function loadHtmlData(userId, shareId, storyId, fileId) {
  return {
    types: [LOAD_HTML, LOAD_HTML_SUCCESS, LOAD_HTML_FAIL],
    fileId,
    userId,
    promise: (client) => client.get(`/public/share/${shareId}/getHtmlData`, 'webapi', {
      params: {
        id: storyId,
        fileId,
      }
    })
  };
}

export function forward(shareId, to, subject, note, langCode) {
  return {
    types: [FORWARD, FORWARD_SUCCESS, FORWARD_FAIL],
    promise: (client) => client.post(`/public/share/${shareId}/forward`, 'webapi', {
      params: {
        id: shareId,
        to,
        subject,
        note,
        langCode,
      }
    })
  };
}

export function getShare(id) {
  return {
    types: [LOAD_SHARE, LOAD_SHARE_SUCCESS, LOAD_SHARE_FAIL],
    id,
    promise: (client) => client.get(`/public/share/${id}`, 'webapi')
  };
}

export function updateFiles(files) {
  return {
    type: UPDATE_FILES,
    files,
  };
}

export function updateFile(file) {
  return {
    type: UPDATE_FILE,
    file,
  };
}

export function interaction(shareId, data) {
  return {
    types: [INTERACTION, INTERACTION_SUCCESS, INTERACTION_FAIL],
    promise: (client) => client.post(`/public/share/${shareId}/interaction`, 'webapi', {
      params: {
        data,
      }
    })
  };
}

/** New PAFS - Public API Sharing **/
export function getPafsShare(id) {
  return {
    types: [LOAD_SHARE, LOAD_SHARE_SUCCESS, LOAD_SHARE_FAIL],
    id,
    promise: (client) => client.get(`/shares/${id}`, 'webapi')
  };
}

export function loadPafsHtmlData(shareId, fileId, url) {
  return {
    types: [LOAD_HTML, LOAD_HTML_SUCCESS, LOAD_HTML_FAIL],
    fileId,
    promise: (client) => client.get(url, 'custom')
  };
}

export function interactionPafs(shareId, fileId, historyId) {
  return {
    types: [INTERACTION, INTERACTION_SUCCESS, INTERACTION_FAIL],
    promise: (client) => client.put(`/shares/${shareId}/files/${fileId}/interaction`, 'webapi', {
      body: {
        historyId: historyId,
      }
    })
  };
}

export function resetHistoryId() {
  return {
    type: RESET_HISTORY_ID
  };
}

/**
 * Clears existing Note data
 */
export function close() {
  return {
    type: BROADCAST_CLOSE
  };
}

/**
 * Save Hub Share Page Data
 */
export function recordHubShareData(data) {
  return {
    types: [RECORD_HUBSHARE_DATA, RECORD_HUBSHARE_DATA_SUCCESS, RECORD_HUBSHARE_DATA_FAIL],
    promise: (client) => client.post('/files/recordDataPublic', 'webapi', {
      data
    })
  };
}
