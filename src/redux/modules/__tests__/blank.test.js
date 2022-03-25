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
  increment,
  INCREMENT
} from '../blank';

describe('blank reducer actions', () => {
  it('should create an action to increment', () => {
    const expectedAction = {
      type: INCREMENT
    };
    expect(increment()).to.eql(expectedAction);
  });
});

describe('blank reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should increment', () => {
    const expectedState = {
      loaded: false,
      loading: false,
      count: 1,
      result: []
    };
    expect(
      reducer(initialState, {
        type: INCREMENT
      })
    ).to.eql(expectedState);
  });
});
