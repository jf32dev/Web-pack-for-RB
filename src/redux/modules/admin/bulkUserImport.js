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
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

/**
 * Action Types
 */
export const GET_ALL_JOBS = 'admin/userBulkImport/GET_ALL_JOBS';
export const GET_ALL_JOBS_SUCCESS = 'admin/userBulkImport/GET_ALL_JOBS_SUCCESS';
export const GET_ALL_JOBS_FAIL = 'admin/userBulkImport/GET_ALL_JOBS_FAIL';

export const GET_JOB = 'admin/userBulkImport/GET_JOB_LIST';
export const GET_JOB_SUCCESS = 'admin/userBulkImport/GET_JOB_SUCCESS';
export const GET_JOB_FAIL = 'admin/userBulkImport/GET_JOB_FAIL';

export const UPLOAD_FILE = 'admin/userBulkImport/UPLOAD_FILE';
export const UPLOAD_FILE_SUCCESS = 'admin/userBulkImport/UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_FAIL = 'admin/userBulkImport/UPLOAD_FILE_FAIL';
export const UPLOAD_FILE_PROGRESS = 'admin/userBulkImport/UPLOAD_FILE_PROGRESS';
export const SET_DATA = 'admin/userBulkImport/SET_DATA';

/**
 * Initial State
 */
export const initialState = {
  bulkImportJobs: [],
  selectedJob: null,
  error: null,
};

/**
 * Reducer
 */
export default function adminUserBulkImport(state = initialState, action = {}) {
  switch (action.type) {
    case GET_ALL_JOBS:
      return {
        ...state,
        loadingResult: true,
        firstLoad: action.firstLoad,
        error: null,
        loading: true,
        loaded: false
      };
    case GET_JOB:
      return {
        ...state,
        loadingResult: true,
        error: null,
      };
    case GET_ALL_JOBS_SUCCESS:
      return {
        ...state,
        loadingResult: false,
        loading: false,
        loaded: true,
        firstLoad: false,
        bulkImportJobs: action.result
      };
    case GET_JOB_SUCCESS:
      return {
        ...state,
        loadingResult: false,
        selectedJob: action.result,
        error: null,
      };
    case GET_ALL_JOBS_FAIL:
    case GET_JOB_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        loadingResult: false,
        firstLoad: false,
        bulkImportJobs: [],
        error: action.error,
      };
    case UPLOAD_FILE: {
      return {
        ...state,
        uploading: true,
        error: null,
        files: action.files
      };
    }
    case UPLOAD_FILE_SUCCESS: {
      return {
        ...state,
        uploading: false,
        progress: 100,
        error: null,
        files: action.files,
      };
    }
    case UPLOAD_FILE_FAIL: {
      return {
        ...state,
        uploading: false,
        progress: 0,
        error: action.error
      };
    }
    case UPLOAD_FILE_PROGRESS: {
      return {
        ...state,
        files: action.files,
        error: null,
        progress: action.progress || 100
      };
    }

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    default:
      return state;
  }
}
//TODO update api to v5
/**
 * Action Creators
 */
export function getAllBulkImportJobs(type = 'user_import', firstLoad = false) {
  const types = [GET_ALL_JOBS, GET_ALL_JOBS_SUCCESS, GET_ALL_JOBS_FAIL];
  return {
    types,
    firstLoad,
    promise: (client) => client.get('/jobs?type=' + type, 'webapi')
  };
}

export function getBulkImportJob(id) {
  const types = [GET_JOB, GET_JOB_SUCCESS, GET_JOB_FAIL];
  return {
    types,
    promise: (client) => client.get('/jobs/' + id, 'webapi')
  };
}

export function uploadFilesProgress(files, progress) {
  return {
    type: UPLOAD_FILE_PROGRESS,
    files,
    progress
  };
}

export function uploadFile(files, dispatch, type = 'user_import') {
  return {
    types: [UPLOAD_FILE, UPLOAD_FILE_SUCCESS, UPLOAD_FILE_FAIL],
    files,
    promise: (client) => client.post('/jobs', 'webapi', {
      params: {
        type: type,
        uploadData: {
          file: files
        }
      },
      progress: (e) => {
        dispatch(uploadFilesProgress(files, e.percent));
      }
    })
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
