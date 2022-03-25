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
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

/**
 * Action Types
 */
export const CREATE_PROMPT = 'prompts/CREATE_PROMPT';
export const DISMISS_PROMPT = 'prompts/DISMISS_PROMPT';

/**
 * Initial State
 */
export const initialState = {
  promptsById: {},
  order: []
};

/**
 * Reducer
 */
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CREATE_PROMPT:
      return {
        promptsById: {
          ...state.promptsById,
          [action.data.id]: action.data
        },
        order: [...state.order, action.data.id]
      };
    case DISMISS_PROMPT:
      return { ...state,
        promptsById: {
          ...state.promptsById,
          [action.id]: {
            ...state.promptsById[action.id],
            dismissed: true
          }
        }
      };
    default:
      return state;
  }
}

/**
 * Action Creators
 */
export function createPrompt(data) {
  return {
    type: CREATE_PROMPT,
    data
  };
}

export function dismissPrompt(id) {
  return {
    type: DISMISS_PROMPT,
    id
  };
}
