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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincan.com>
 */

export const SET_DATA = 'pagesearch/setState';
export const RESET = 'pagesearch/resetState';

const initialState = {
  hasSearch: false,
  sortBy: '',
  nameSortOrder: 'asc', //asc is default
  lastModifiedSortOrder: 'desc', //desc is defaul
  keyword: '',
  searchTypeSelected: 'all',
  selectedFilters: [],
  selectedBlocks: [],
  selectedStackId: null,
  channelPickerModalVisible: false,
  filterModalVisible: false,
  selectMode: false,
  showFileDetailsModel: false,
  showNoBlocksDialog: false,
  selectedChannelsForFilterModal: {
    clearAll: false,
    channelList: []
  },
};

export default function reducer(state = initialState, action = {}) {
  let newState = {};
  switch (action.type) {
    case SET_DATA:
      newState = { ...state, ...action.payload };
      if (action.payload.selectedStackId === null && state.selectedStackId) {
        newState = { ...newState, selectedStackItem: null };
      }

      return newState;

    case RESET:
      return initialState;
    default:
      return state;
  }
}

export const setData = (payload) => {
  return {
    type: SET_DATA,
    payload
  };
};
