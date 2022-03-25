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
  setInteraction,
  SET_INTERACTION,
  POST_INTERACTION_SUCCESS
} from '../interactions';

describe('interactions reducer actions', () => {
  it('should create an action to set interaction', () => {
    const data = {
      fileId: 1,
      storyId: 2
    };

    const expectedAction = {
      type: SET_INTERACTION,
      data: data
    };

    expect(setInteraction(data)).to.eql(expectedAction);
  });
});

describe('interactions reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should start new interaction at 5s', () => {
    const now = parseInt(new Date().getTime() / 1000, 10);  // UTC seconds
    const data = {
      fileId: 1
    };

    const expectedState = {
      ...initialState,
      files: {
        1: {
          id: 1,
          opened: now,
          duration: 5
        }
      }
    };

    expect(
      reducer(initialState, {
        type: SET_INTERACTION,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should start another new interaction at 5s', () => {
    const now = parseInt(new Date().getTime() / 1000, 10);  // UTC seconds
    const data = {
      storyId: 202
    };

    const startState = {
      ...initialState,
      files: {
        1: {
          id: 1,
          opened: now,
          duration: 5
        }
      }
    };

    const expectedState = {
      ...startState,
      stories: {
        202: {
          id: 202,
          opened: now,
          duration: 5
        }
      }
    };

    expect(
      reducer(startState, {
        type: SET_INTERACTION,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should increment existing interations by 5s', () => {
    const now = parseInt(new Date().getTime() / 1000, 10);  // UTC seconds

    const data = {
      fileId: 1,
      storyId: 202
    };

    const existingState = {
      ...initialState,
      files: {
        1: {
          id: 1,
          opened: now,
          duration: 5
        }
      },
      stories: {
        202: {
          id: 202,
          opened: now,
          duration: 5
        }
      }
    };

    const expectedState = {
      ...initialState,
      files: {
        1: {
          id: 1,
          opened: now,
          duration: 10
        }
      },
      stories: {
        202: {
          id: 202,
          opened: now,
          duration: 10
        }
      }
    };

    expect(
      reducer(existingState, {
        type: SET_INTERACTION,
        data: data
      })
    ).to.eql(expectedState);
  });

  it('should clear interactions on POST success', () => {
    const existingState = {
      ...initialState,
      files: {
        1: {
          id: 1,
          opened: 123456789,
          duration: 5
        }
      }
    };

    expect(
      reducer(existingState, {
        type: POST_INTERACTION_SUCCESS
      })
    ).to.eql(initialState);
  });
});
