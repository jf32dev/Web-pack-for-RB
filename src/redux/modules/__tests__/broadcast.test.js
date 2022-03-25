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

  close,

  LOAD_STATUS,
  JOIN_BROADCAST,
  START_BROADCAST,
  INVITE_BROADCAST,
  BROADCAST_CLOSE,
} from '../broadcast';

const testBroadcast = {
  ...initialState,
};

describe('broadcast reducer actions', () => {
  it('should clean broadcast state', () => {
    const expectedAction = {
      type: BROADCAST_CLOSE,
    };
    expect(close()).to.eql(expectedAction);
  });
});

describe('note reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });
  //
  it('should load broadcast status', () => {
    const expectedState = {
      ...testBroadcast,
      loading: true,
      loaded: false
    };

    expect(
      reducer(testBroadcast, {
        type: LOAD_STATUS,
      })
    ).to.eql(expectedState);
  });
  //
  it('should join broadcast', () => {
    const expectedState = {
      ...initialState,
      joining: true,
      joined: false
    };
    expect(
      reducer(testBroadcast, {
        type: JOIN_BROADCAST,
      })
    ).to.eql(expectedState);
  });
  //
  it('should start broadcast', () => {
    const expectedState = {
      ...initialState,
      starting: true,
      started: false
    };
    expect(
      reducer(testBroadcast, {
        type: START_BROADCAST,
      })
    ).to.eql(expectedState);
  });
  //
  it('should invite broadcast', () => {
    const expectedState = {
      ...initialState,
      inviting: true,
      invited: false
    };
    expect(
      reducer(testBroadcast, {
        type: INVITE_BROADCAST,
      })
    ).to.eql(expectedState);
  });
});
