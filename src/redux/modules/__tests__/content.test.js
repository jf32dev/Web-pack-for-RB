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
  initialState,
  LOAD_TABS_SUCCESS
} from '../content';

const tabs = [{
  id: 1,
  name: 'Tab 1'
}, {
  id: 2,
  name: 'Tab 2',
  channels: []
}];

describe('content reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should set tab ids from result', () => {
    const expectedState = {
      ...initialState,
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(initialState, {
        type: LOAD_TABS_SUCCESS,
        result: tabs,
      })
    ).to.eql(expectedState);
  });

  it('should should union with existing tab ids', () => {
    const state = {
      ...initialState,
      tabs: [1, 2],
      tabsLoading: false,
      tabsComplete: true
    };

    const testResult = [{
      id: 1,
      name: 'Tab 1 - edited',
      channels: []
    }, {
      id: 3,
      name: 'Tab 3'
    }];

    const expectedState = {
      ...initialState,
      tabs: [1, 2, 3],
      tabsLoading: false,
      tabsComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_TABS_SUCCESS,
        result: testResult,
      })
    ).to.eql(expectedState);
  });
});
