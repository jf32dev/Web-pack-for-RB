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
import { normalize, Schema } from 'normalizr';
import { getFileCategory } from './story/helpers';

const note = new Schema('notes');
/**
 * Action Types
 */
export const LOAD_NOTE = 'note/LOAD_NOTE';
export const LOAD_NOTE_SUCCESS = 'note/LOAD_NOTE_SUCCESS';
export const LOAD_NOTE_FAIL = 'note/LOAD_NOTE_FAIL';

export const ADD_NOTE = 'note/ADD_NOTE';
export const ADD_NOTE_SUCCESS = 'note/ADD_NOTE_SUCCESS';
export const ADD_NOTE_FAIL = 'note/ADD_NOTE_FAIL';

export const DELETE_NOTES = 'note/DELETE_NOTES';
export const DELETE_NOTES_SUCCESS = 'note/DELETE_NOTES_SUCCESS';
export const DELETE_NOTES_FAIL = 'note/DELETE_NOTES_FAIL';

/* Files */
export const UPLOAD_FILES = 'note/UPLOAD_FILES';
export const UPLOAD_FILES_SUCCESS = 'note/UPLOAD_FILES_SUCCESS';
export const UPLOAD_FILES_FAIL = 'note/UPLOAD_FILES_FAIL';
export const UPLOAD_FILES_PROGRESS = 'note/UPLOAD_FILES_PROGRESS';

/* Files */
export const LOG = 'note/LOG';
export const LOG_SUCCESS = 'note/LOG_SUCCESS';
export const LOG_FAIL = 'note/LOG_FAIL';

export const CLOSE = 'note/CLOSE';

/**
 * Reducer
 */
export const initialState = {
  error: null,
  loading: false,
  loaded: false,
  loadError: {},
  adding: false,
  added: false,
  deleting: false,
  deleted: false,
  logging: false,
  logged: false,
  uploading: false,
  uploaded: false,
  newFiles: {},
};
export default function noteReducer(state = initialState, action = {}) {
  let newState;

  switch (action.type) {
    case LOAD_NOTE:
    case ADD_NOTE:
    case DELETE_NOTES:
    case LOG:
    case LOAD_NOTE_SUCCESS:
    case DELETE_NOTES_SUCCESS:
    case ADD_NOTE_SUCCESS:
    case LOG_SUCCESS: {
      let newNote = {};
      const noteId = _get(action, 'result.id', false);
      if (noteId) {
        const normalized = normalize(action.result, note);
        newNote = normalized.entities.notes[noteId];
      }

      const newFiles = action.type === ADD_NOTE_SUCCESS ? [] : state.newFiles;

      return {
        ...state,
        loading: action.type === LOAD_NOTE,
        loaded: action.type === LOAD_NOTE_SUCCESS,
        loadError: {},
        adding: action.type === ADD_NOTE,
        added: action.type === ADD_NOTE_SUCCESS,
        deleting: action.type === DELETE_NOTES,
        deleted: action.type === DELETE_NOTES_SUCCESS,
        logging: action.type === LOG,
        logged: action.type === LOG_SUCCESS,
        uploading: false,
        uploaded: false,
        ...newNote,
        newFiles: { ...newFiles }
      };
    }

    /**
     * Files
     */
    case UPLOAD_FILES: {
      newState = {
        ...state,
        ...initialState,
        uploading: true,
        uploaded: false,
        newFiles: { ...state.newFiles }
      };
      // Add each file
      action.files.forEach((f) => {
        newState.newFiles[f.id] = {
          id: f.id,
          category: getFileCategory(f),
          description: f.name,
          filename: f.name,
          size: f.size,
          uploading: true
        };
      });

      return newState;
    }
    case UPLOAD_FILES_SUCCESS: {
      if (!action.result || action.errors) {
        return state;
      }

      newState = { ...state,
        uploading: false,
        uploaded: true,
        hasUnsavedChanges: true,
        newFiles: { ...state.newFiles }
      };
      // Merge returned data in to file object
      // We assume the retuned data is in the same order
      // as the original upload
      action.result.forEach((f, i) => {
        newState.newFiles[action.files[i].id] = {
          ...newState.newFiles[action.files[i].id],
          uploading: false,
          progress: 100,
          // Add url property by Jason Huang 2016-12-16
          url: action.files[i].url,
          // Display options on file complete
          showOptions: true,
          ...f
        };
      });

      return newState;
    }
    case UPLOAD_FILES_FAIL: {
      newState = { ...state,
        newFiles: { ...state.newFiles }
      };

      // Merge returned data in to file object
      // We assume the retuned data is in the same order
      // as the original upload
      action.files.forEach((f, i) => {
        newState.newFiles[action.files[i].id] = {
          ...newState.newFiles[action.files[i].id],
          uploading: false,
          progress: 0,
          error: action.error
        };
      });

      return newState;
    }
    case UPLOAD_FILES_PROGRESS: {
      newState = { ...state,
        newFiles: { ...state.newFiles }
      };

      // Merge returned data in to file object
      // We assume the retuned data is in the same order
      // as the original upload
      action.files.forEach((f, i) => {
        newState.newFiles[action.files[i].id] = {
          ...newState.newFiles[action.files[i].id],
          // If progress is undefined, assume complete
          progress: action.progress || 100,

          // Use preview as thumbnail if image file
          thumbnail: newState.newFiles[action.files[i].id].category === 'image' ? f.preview : ''
        };
      });

      return newState;
    }

    case CLOSE:
      return initialState;

    /**
     * fails
     */
    case LOAD_NOTE_FAIL:
    case ADD_NOTE_FAIL:
    case DELETE_NOTES_FAIL:
    case LOG_FAIL:
      return {
        ...state,
        newFiles: Object.keys(state.newFiles).reduce((obj, key) => {
          if (state.newFiles[key].category !== 'web') {
            return { ...obj, [key]: state.newFiles[key] };
          }
          return obj;
        }, {}),
        error: action.error
      };

    default:
      return state;
  }
}

/* Action Creators */

export function loadNote(id) {
  return {
    types: [LOAD_NOTE, LOAD_NOTE_SUCCESS, LOAD_NOTE_FAIL],
    id,
    promise: (client) => client.get('/note/get', 'webapi', {
      params: {
        id: id
      }
    })
  };
}

export function addNote(data) {
  return {
    types: [ADD_NOTE, ADD_NOTE_SUCCESS, ADD_NOTE_FAIL],
    id: data.userNoteId,
    promise: (client) => client.post('/note/add', 'webapi', {
      data: {
        ...data
      }
    })
  };
}

export function deleteNotes(ids) {
  return {
    types: [DELETE_NOTES, DELETE_NOTES_SUCCESS, DELETE_NOTES_FAIL],
    ids: ids,
    promise: (client) => client.post('/note/delete', 'webapi', {
      params: {
        ids: JSON.stringify(ids)
      }
    })
  };
}

export function uploadFilesProgress(files = [], progress) {
  return {
    type: UPLOAD_FILES_PROGRESS,
    files,
    progress
  };
}

export function uploadFiles(files = [], dispatch) {
  return {
    types: [UPLOAD_FILES, UPLOAD_FILES_SUCCESS, UPLOAD_FILES_FAIL],
    files,
    promise: (client) => client.post('/note/fileUpload', 'webapi', {
      params: {
        upload_type: 'file',
        uploadData: {
          file: files
        }
      },
      progress: (e) => {
        dispatch(uploadFilesProgress([...files], e.percent));
      }
    })
  };
}

export function logCRM(id, crmEntity, crmSource) {
  return {
    types: [LOG, LOG_SUCCESS, LOG_FAIL],
    promise: (client) => client.post('/note/log', 'webapi', {
      params: {
        id,
        crmEntity,
        crmSource
      }
    })
  };
}

/**
 * Clears existing Note data
 */
export function close() {
  return {
    type: CLOSE
  };
}
