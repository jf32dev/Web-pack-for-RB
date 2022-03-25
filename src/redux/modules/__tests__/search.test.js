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

import { expect } from 'chai';
import reducer, {
  CLEAR_RESULTS,
  ADD_FILTER,

  clearResults,
  addToFilterList,

  initialState
} from '../search';

describe('search reducer actions', () => {
  it('should create an action to clear results', () => {
    const expectedAction = {
      type: CLEAR_RESULTS
    };
    expect(clearResults()).to.eql(expectedAction);
  });

  it('should create an action to add filter', () => {
    const testItem = {
      id: 1,
      term: 'Test term',
      count: 2,
      type: 'channel'
    };
    const expectedAction = {
      type: ADD_FILTER,
      key: 0,
      item: testItem
    };
    expect(addToFilterList(0, testItem)).to.eql(expectedAction);
  });
});

describe('search reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should add filter to list by key name', () => {
    const testItem = {
      id: 1,
      term: 'Test term',
      count: 2,
      type: 'channel'
    };

    const expectedState = { ...initialState,
      initialFilters: {
        tab: [],
        channel: [testItem],
        tag: [],
        author: [],
        range: [],
        date: [],
      },
    };

    expect(
      reducer(initialState, {
        type: ADD_FILTER,
        key: 'channel',  // key name
        item: testItem
      })
    ).to.eql(expectedState);
  });
});
