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

import { expect } from 'chai';
import reducer, {
  VALIDATE_DNSALIAS_SUCCESS,
  RESET_DNS_VALIDATION,

  resetDnsValidation,
  initialState
} from '../admin/security';

describe('search reducer actions', () => {
  it('should create an action to reset DnsValidation', () => {
    const expectedAction = {
      type: RESET_DNS_VALIDATION,
      id: 1
    };
    expect(resetDnsValidation(1)).to.eql(expectedAction);
  });
});

describe('admin/security reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('reset DNS alias validation should set property value to true by id', () => {
    const preState = {
      ...initialState,
      dnsAliasAvailabilities: {
        new: false,
        1: false
      }
    };

    const expectedState = { ...initialState,
      dnsAliasAvailabilities: {
        new: false,
        1: true
      },
    };

    expect(
      reducer(preState, {
        type: RESET_DNS_VALIDATION,
        id: 1
      })
    ).to.eql(expectedState);
  });

  it('should update dns alias validation result', () => {
    const preState = initialState;

    const expectedState = {
      ...initialState,
      dnsAliasAvailabilities: {
        new: true,
        1: true
      }
    };

    expect(
      reducer(preState, {
        type: VALIDATE_DNSALIAS_SUCCESS,
        id: 1,
        result: { isAvailable: true }
      })
    ).to.eql(expectedState);
  });
});
