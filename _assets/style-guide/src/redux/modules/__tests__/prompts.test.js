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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { expect } from 'chai';

import reducer, {
  initialState,
  CREATE_PROMPT,
  DISMISS_PROMPT,
  createPrompt,
  dismissPrompt
} from '../prompts';

const testPrompt = {
  id: 1,
  title: 'test prompt'
};

/**
 * Action creator tests
 */
describe('prompts actions', () => {
  it('should create an action to create prompt', () => {
    const expectedAction = {
      type: CREATE_PROMPT,
      data: testPrompt
    };
    expect(createPrompt(testPrompt)).to.eql(expectedAction);
  });

  it('should create an action to dismiss prompt', () => {
    const expectedAction = {
      type: DISMISS_PROMPT,
      id: 1
    };
    expect(dismissPrompt(1)).to.eql(expectedAction);
  });
});

/**
 * Reducer tests
 */
describe('prompts reducer', () => {
  it('should create prompt', () => {
    const expectedState = {
      promptsById: {
        1: testPrompt
      },
      order: [1]
    };

    expect(
      reducer(initialState, {
        type: CREATE_PROMPT,
        data: testPrompt,
      })
    ).to.eql(expectedState);
  });

  it('should set prompt to dismissed', () => {
    const populatedState = {
      promptsById: {
        1: testPrompt
      },
      order: [1]
    };

    const expectedState = {
      promptsById: {
        1: {
          ...testPrompt,
          dismissed: true
        }
      },
      order: [1]
    };

    expect(
      reducer(populatedState, {
        type: DISMISS_PROMPT,
        id: 1
      })
    ).to.eql(expectedState);
  });
});
