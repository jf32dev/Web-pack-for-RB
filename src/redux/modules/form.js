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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

export const LOAD = 'form/LOAD';
export const LOAD_SUCCESS = 'form/LOAD_SUCCESS';
export const LOAD_FAIL = 'form/LOAD_FAIL';

export const SET_DATA = 'form/SET_DATA';
export const CLOSE = 'form/CLOSE';

export const initialState = {
  loaded: false,
  loading: false,
  loadError: {},

  saving: false,
  saved: false,
  saveError: {},

  id: null,
  name: '',
  formData: [],

  autoPublishChannels: [],
  categoryId: null,
  companyId: null,
  customCSS: [],
  dataSources: [],
  groups: [],
  multipleSubmissions: false,
  outputFilename: [],
  randomiseQA: false,
  routes: [],
  status: 'draft',
  submitValue: null,
  submissionCount: 0
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return { ...state, loading: true };
    case LOAD_SUCCESS:
      return { ...state, loading: false, loaded: true, ...action.result };
    case LOAD_FAIL:
      return { ...state, loading: false, loaded: false, loadError: action.error };

    case SET_DATA:
      return { ...state, ...action.data };
    case CLOSE:
      return { ...initialState };

    default:
      return state;
  }
}

export function load(id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/form/' + id, 'webapi4')
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    data
  };
}

export function close() {
  return {
    type: CLOSE
  };
}
