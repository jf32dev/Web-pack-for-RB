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

import { REHYDRATE } from 'redux-persist/constants';

export const SET_INTERACTION = 'interactions/SET_INTERACTION';
export const POST_INTERACTION_SUCCESS = 'interactions/POST_INTERACTION_SUCCESS';

export const initialState = {
  files: {},
  stories: {}
};

export default function blank(state = initialState, action = {}) {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.interactions;
      if (incoming) {
        return {
          ...state,
          files: incoming.files,
          stories: incoming.stories
        };
      }
      return state;
    }

    case SET_INTERACTION: {
      const { fileId, storyId } = action.data;

      // UTC seconds
      const now = parseInt(new Date().getTime() / 1000, 10);

      // File interaction
      let files = state.files;
      if (fileId) {
        // Default to now as open time
        const opened = files[fileId] ? files[fileId].opened : now;

        // Increment duration by 1s or start at 1
        const duration = files[fileId] ? files[fileId].duration + 1 : 1;

        files = {
          ...files,
          [fileId]: {
            ...files[fileId],
            id: fileId,
            opened: opened,
            duration: duration
          }
        };
      }

      // Story interaction
      let stories = state.stories;
      if (storyId) {
        // Default to now as open time
        const opened = stories[storyId] ? stories[storyId].opened : now;

        // Increment duration by 1s or start at 1
        const duration = stories[storyId] ? stories[storyId].duration + 1 : 1;

        stories = {
          ...stories,
          [storyId]: {
            ...stories[storyId],
            id: storyId,
            opened: opened,
            duration: duration
          }
        };
      }

      return {
        ...state,
        files: files,
        stories: stories
      };
    }

    case POST_INTERACTION_SUCCESS: {
      // clear on success
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
}

/**
 * Post data to the interaction API
 */
export function postInteraction(data) {
  return {
    types: [null, POST_INTERACTION_SUCCESS, null],
    promise: (client) => client.post('/interactions', 'webapi', {
      data: {
        data: JSON.stringify(data)
      }
    })
  };
}

/**
 * Set file/story interaction
 */
export function setInteraction(data) {
  return {
    type: SET_INTERACTION,
    data
  };
}
