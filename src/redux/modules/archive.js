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

import { normalize, Schema, arrayOf } from 'normalizr';
import merge from 'lodash/merge';
import union from 'lodash/union';

// Define schemes for our entities
const tab = new Schema('tabs');
const channel = new Schema('channels');
const story = new Schema('stories', { idAttribute: 'permId' });
const revision = new Schema('revisions');

// Define nesting rules
tab.define({
  channels: arrayOf(channel)
});

channel.define({
  stories: arrayOf(story)
});

story.define({
  revisions: arrayOf(revision)
});

export const LOAD_TABS = 'archive/LOAD_TABS';
export const LOAD_TABS_SUCCESS = 'archive/LOAD_TABS_SUCCESS';
export const LOAD_TABS_FAIL = 'archive/LOAD_TABS_FAIL';

export const LOAD_CHANNELS = 'archive/LOAD_CHANNELS';
export const LOAD_CHANNELS_SUCCESS = 'archive/LOAD_CHANNELS_SUCCESS';
export const LOAD_CHANNELS_FAIL = 'archive/LOAD_CHANNELS_FAIL';

export const LOAD_STORIES = 'archive/LOAD_STORIES';
export const LOAD_STORIES_SUCCESS = 'archive/LOAD_STORIES_SUCCESS';
export const LOAD_STORIES_FAIL = 'archive/LOAD_STORIES_FAIL';

export const LOAD_REVISIONS = 'archive/LOAD_REVISIONS';
export const LOAD_REVISIONS_SUCCESS = 'archive/LOAD_REVISIONS_SUCCESS';
export const LOAD_REVISIONS_FAIL = 'archive/LOAD_REVISIONS_FAIL';

export const CLEAR_LAST_CHANNEL_AND_STORY = 'archive/CLEAR_LAST_CHANNEL_AND_STORY';

const globalFetchLimit = 100;

export const initialState = {
  storiesSortBy: 'date',

  lastChannel: 0,
  lastStory: 0,

  tabsById: {},
  channelsById: {},
  storiesById: {},
  revisionsById: {},

  tabs: [],
  tabsLoading: false,
  tabsError: null,
  tabsComplete: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    /* Tabs */
    case LOAD_TABS:
      return {
        ...state,
        tabsLoading: true
      };
    case LOAD_TABS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(tab));

      // Merge tabs array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.tabs, normalized.result) : normalized.result;

      const newState = merge({}, state, {
        channelsById: normalized.entities.channels,
        tabsById: normalized.entities.tabs,
        revisionsById: normalized.entities.revisions,
        storiesById: normalized.entities.stories,

        tabs: newOrder,
        tabsLoading: false,
        tabsComplete: action.result.length < globalFetchLimit,
        tabsError: null
      });

      return newState;
    }
    case LOAD_TABS_FAIL:
      return {
        ...state,
        tabsLoading: false,
        tabsError: action.error
      };

    /* Channels */
    case LOAD_CHANNELS:
      return {
        ...state,
        tabsById: { ...state.tabsById,
          [action.tabId]: {
            ...state.tabsById[action.tabId],
            channelsLoading: true
          }
        }
      };
    case LOAD_CHANNELS_SUCCESS: {
      // In normalizr 3 we can use processStrategy
      // or we can update API to include this data
      const fixedChannels = action.result.map(c => {  // eslint-disable-line
        return {
          ...c,
          tabId: parseInt(action.tabId, 10)
        };
      });

      const normalized = normalize(fixedChannels, arrayOf(channel));

      // Merge channels array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.tabsById[action.tabId].channels, normalized.result) : normalized.result;

      return {
        ...state,
        tabsById: {
          ...state.tabsById,
          [action.tabId]: {
            ...state.tabsById[action.tabId],
            channels: newOrder,
            channelsLoading: false,
            channelsComplete: action.result.length < globalFetchLimit,
            channelsError: null
          }
        },
        channelsById: merge({}, state.channelsById, {
          ...normalized.entities.channels
        })
      };
    }
    case LOAD_CHANNELS_FAIL:
      return {
        ...state,
        tabsById: { ...state.tabsById,
          [action.tabId]: {
            ...state.tabsById[action.tabId],
            channelsLoading: false,
            channelsError: action.error
          }
        }
      };

    /* Stories */
    case LOAD_STORIES: {
      return {
        ...state,
        lastChannel: action.channelId,
        lastStory: 0,
        storiesSortBy: action.sortBy,
        channelsById: { ...state.channelsById,
          [action.channelId]: {
            ...state.channelsById[action.channelId],
            storiesLoading: true
          }
        }
      };
    }
    case LOAD_STORIES_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(story));

      // Merge stories array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.channelsById[action.channelId].stories, normalized.result) : normalized.result;

      return {
        ...state,
        channelsById: {
          ...state.channelsById,
          [action.channelId]: {
            ...state.channelsById[action.channelId],
            stories: newOrder,
            storiesLoading: false,
            storiesComplete: action.result.length < globalFetchLimit,
            storiesError: null
          }
        },
        storiesById: merge({}, state.storiesById, {
          ...normalized.entities.stories
        })
      };
    }
    case LOAD_STORIES_FAIL:
      return {
        ...state,
        channelsById: { ...state.channelsById,
          [action.channelId]: {
            ...state.channelsById[action.channelId],
            storiesLoading: false,
            storiesError: action.error
          }
        }
      };

    /* Revisions */
    case LOAD_REVISIONS:
      return {
        ...state,
        lastStory: action.permId,
        storiesById: { ...state.storiesById,
          [action.permId]: {
            ...state.storiesById[action.permId],
            revisionsLoading: true
          }
        }
      };
    case LOAD_REVISIONS_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(revision));

      // Merge revisions array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.storiesById[action.permId].revisions, normalized.result) : normalized.result;

      const newState = merge({}, state, {
        revisionsById: normalized.entities.revisions,
        storiesById: { ...state.storiesById,
          [action.permId]: {
            ...state.storiesById[action.permId],
            revisions: newOrder,
            revisionsLoading: false,
            revisionsComplete: action.result.length < globalFetchLimit,
            revisionsError: null
          }
        }
      });

      return newState;
    }
    case LOAD_REVISIONS_FAIL:
      return {
        ...state,
        storiesById: { ...state.storiesById,
          [action.permId]: {
            ...state.storiesById[action.permId],
            revisionsLoading: false,
            revisionsError: action.error
          }
        }
      };

    case CLEAR_LAST_CHANNEL_AND_STORY:
      return { ...state,
        lastChannel: 0,
        lastStory: 0
      };

    default:
      return state;
  }
}

/* Load all Tabs */
export function loadTabs(offset = 0, sortBy = 'name', includeHidden = false) {
  return {
    types: [LOAD_TABS, LOAD_TABS_SUCCESS, LOAD_TABS_FAIL],
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get('/archive/tabs', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
        show_hidden_channels: +!!includeHidden  // 0/1
      }
    })
  };
}

/* Load Channel by Tab ID */
export function loadChannels(tabId, offset = 0, sortBy = 'name', includeHidden = false) {
  return {
    types: [LOAD_CHANNELS, LOAD_CHANNELS_SUCCESS, LOAD_CHANNELS_FAIL],
    tabId: tabId,
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get('/archive/channels', 'webapi', {
      params: {
        tab_id: tabId,
        limit: globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
        show_hidden_channels: +!!includeHidden  // 0/1
      }
    })
  };
}

/* Load Story by Channel ID */
export function loadStories(channelId, offset = 0, sortBy = 'date') {
  return {
    types: [LOAD_STORIES, LOAD_STORIES_SUCCESS, LOAD_STORIES_FAIL],
    channelId: channelId,
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get('/archive/stories', 'webapi', {
      params: {
        channel_id: channelId,
        limit: globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
      }
    })
  };
}

/* Load Revision by Story ID */
export function loadRevisions(permId, offset = 0) {
  return {
    types: [LOAD_REVISIONS, LOAD_REVISIONS_SUCCESS, LOAD_REVISIONS_FAIL],
    permId: permId,
    offset: offset,
    promise: (client) => client.get('/archive/revisions', 'webapi', {
      params: {
        perm_id: permId,
        limit: globalFetchLimit,
        offset: offset
      }
    })
  };
}

export function clearLastChannelAndStory() {
  return {
    type: CLEAR_LAST_CHANNEL_AND_STORY
  };
}
