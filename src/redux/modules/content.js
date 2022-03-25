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

import union from 'lodash/union';

export const LOAD_TABS = 'content/LOAD_TABS';
export const LOAD_TABS_SUCCESS = 'content/LOAD_TABS_SUCCESS';
export const LOAD_TABS_FAIL = 'content/LOAD_TABS_FAIL';

export const LOAD_TAB = 'content/LOAD_TAB';
export const LOAD_TAB_SUCCESS = 'content/LOAD_TAB_SUCCESS';
export const LOAD_TAB_FAIL = 'content/LOAD_TAB_FAIL';

export const LOAD_CHANNELS = 'content/LOAD_CHANNELS';
export const LOAD_CHANNELS_SUCCESS = 'content/LOAD_CHANNELS_SUCCESS';
export const LOAD_CHANNELS_FAIL = 'content/LOAD_CHANNELS_FAIL';

export const LOAD_STORIES = 'content/LOAD_STORIES';
export const LOAD_STORIES_SUCCESS = 'content/LOAD_STORIES_SUCCESS';
export const LOAD_STORIES_FAIL = 'content/LOAD_STORIES_FAIL';

export const LOAD_PERSONAL_CONTENT_CHANNELS = 'content/LOAD_PERSONAL_CONTENT_CHANNELS';
export const LOAD_PERSONAL_CONTENT_CHANNELS_SUCCESS = 'content/LOAD_PERSONAL_CONTENT_CHANNELS_SUCCESS';
export const LOAD_PERSONAL_CONTENT_CHANNELS_FAIL = 'content/LOAD_PERSONAL_CONTENT_CHANNELS_FAIL';

export const SUBSCRIBE_CHANNEL = 'content/SUBSCRIBE_CHANNEL';
export const SUBSCRIBE_CHANNEL_FAIL = 'content/SUBSCRIBE_CHANNEL_FAIL';

export const SET_STORIES_SCROLL_POSITION = 'content/SET_STORIES_SCROLL_POSITION';
export const CLEAR_LAST_CHANNEL = 'content/CLEAR_LAST_CHANNEL';

export const SAVE_PERSONAL_CHANNEL = 'content/SAVE_PERSONAL_CHANNEL';
export const SAVE_PERSONAL_CHANNEL_SUCCESS = 'content/SAVE_PERSONAL_CHANNEL_SUCCESS';
export const SAVE_PERSONAL_CHANNEL_FAIL = 'content/SAVE_PERSONAL_CHANNEL_FAIL';

export const DELETE_PERSONAL_CHANNEL = 'content/DELETE_PERSONAL_CHANNEL';
export const DELETE_PERSONAL_CHANNEL_SUCCESS = 'content/DELETE_PERSONAL_CHANNEL_SUCCESS';
export const DELETE_PERSONAL_CHANNEL_FAIL = 'content/DELETE_PERSONAL_CHANNEL_FAIL';


export const LEAVE_PERSONAL_SHARED_CHANNEL = 'content/LEAVE_PERSONAL_SHARED_CHANNEL';
export const LEAVE_PERSONAL_SHARED_CHANNEL_SUCCESS = 'content/LEAVE_PERSONAL_SHARED_CHANNEL_SUCCESS';
export const LEAVE_PERSONAL_SHARED_CHANNEL_FAIL = 'content/LEAVE_PERSONAL_SHARED_CHANNEL_FAIL';

export const TOGGLE_CLEAR_CHANNEL_FILTER = 'content/TOGGLE_CLEAR_CHANNEL_FILTER';

const globalFetchLimit = 100;

export const initialState = {
  ui: {
    storyScrollY: 0
  },

  lastChannel: 0,
  newChannelId: 0,
  tabs: ['personal'],  // personal content always visible
  tabsLoading: false,
  tabsError: null,
  tabsComplete: false,
  saved: false,
  saving: false,
  deleted: false,
  deleting: false,
  leaved: false,
  leaving: false,
  error: '',
  clearChannelFilter: false,
};

export default function content(state = initialState, action = {}) {
  switch (action.type) {
    /* Tabs */
    case LOAD_TABS:
    case LOAD_TAB:
      return {
        ...state,
        tabsLoading: true
      };
    case LOAD_TABS_SUCCESS: {
      const tabIds = action.result.map(t => t.id);

      // Merge tabs array if loading more (offset > 0)
      // Note we are merging initialState.tabs to include the static 'personal' tab at the top
      const newOrder = action.offset ? union(state.tabs, tabIds) : union(initialState.tabs, tabIds);

      return {
        ...state,
        tabs: newOrder,
        tabsLoading: false,
        tabsComplete: action.result.length < globalFetchLimit,
        tabsError: null,
        tabSearchTerm: action.searchTerm,
      };
    }
    case LOAD_TAB_SUCCESS: {
      return {
        ...state,
        tabsLoading: false,
        tabsError: null
      };
    }
    case LOAD_TABS_FAIL:
    case LOAD_TAB_FAIL:

      return {
        ...state,
        tabsLoading: false,
        tabsError: action.error
      };

    /* Channels */
    case LOAD_CHANNELS:
      return state;
    case LOAD_CHANNELS_SUCCESS:
      return {
        ...state,
        channelSearchTerm: action.searchTerm,
      };
    case LOAD_CHANNELS_FAIL:
      return state;

    /* Stories */
    case LOAD_STORIES: {
      return {
        ...state,
        lastChannel: action.channelId
      };
    }
    case LOAD_STORIES_SUCCESS:
      return state;
    case LOAD_STORIES_FAIL:
      return state;

    case CLEAR_LAST_CHANNEL:
      return { ...state,
        lastChannel: 0
      };
    /*
    SAVE Personal Channel
    */
    case SAVE_PERSONAL_CHANNEL: {
      return {
        ...state,
        saved: false,
        saving: true,
        error: null,
        newChannelId: 0
      };
    }
    case SAVE_PERSONAL_CHANNEL_SUCCESS: {
      const result = action.result;
      const error = result.error;
      let saved = true;
      if (error) {
        saved = false;
      }
      return {
        ...state,
        saved,
        saving: false,
        error: error,
        newChannelId: result.id
      };
    }

    case SAVE_PERSONAL_CHANNEL_FAIL: {
      return {
        ...state,
        saved: false,
        saving: false,
        error: action.error,
        newChannelId: 0
      };
    }

    /*
    delete Personal Channel
    */
    case DELETE_PERSONAL_CHANNEL: {
      return {
        ...state,
        deleted: false,
        deleting: true,
        error: null,
        newChannelId: 0
      };
    }
    case DELETE_PERSONAL_CHANNEL_SUCCESS: {
      const result = action.result;
      const error = result.error;
      let deleted = true;
      if (error) {
        deleted = false;
      }
      return {
        ...state,
        deleted,
        deleting: false,
        error: error
      };
    }

    case DELETE_PERSONAL_CHANNEL_FAIL: {
      return {
        ...state,
        deleted: false,
        deleting: false,
        error: action.error
      };
    }

    /*
    Leave Shared Channel
    */
    case LEAVE_PERSONAL_SHARED_CHANNEL: {
      return {
        ...state,
        leaved: false,
        leaving: true,
        error: null
      };
    }
    case LEAVE_PERSONAL_SHARED_CHANNEL_SUCCESS: {
      const result = action.result;
      const error = result && result.error;
      let leaved = true;
      if (error) {
        leaved = false;
      }
      return {
        ...state,
        leaved,
        leaving: false,
        error: error
      };
    }

    case LEAVE_PERSONAL_SHARED_CHANNEL_FAIL: {
      return {
        ...state,
        leaved: false,
        leaving: false,
        error: action.error
      };
    }

    case TOGGLE_CLEAR_CHANNEL_FILTER: {
      return {
        ...state,
        clearChannelFilter: action.value
      };
    }

    /**
     * UI only
     */
    case SET_STORIES_SCROLL_POSITION:
      return { ...state,
        ui: { ...state.ui,
          storyScrollY: action.yPos
        }
      };
    default:
      return state;
  }
}

/* Load all Tabs */
export function loadTabs(offset = 0, sortBy = 'name', includeHidden = false, search = '') {
  return {
    types: [LOAD_TABS, LOAD_TABS_SUCCESS, LOAD_TABS_FAIL],
    offset: offset,
    sortBy: sortBy,
    searchTerm: search,
    promise: (client) => client.get('/content/tabs', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset,
        sort_by: sortBy,
        show_hidden_channels: +!!includeHidden,  // 0/1,
        search
      }
    })
  };
}

/* Load Channel by Tab ID */
export function loadChannels(tabId, offset = 0, sortBy = 'name', includeHidden = false, search = '') {
  let path = '/content/channels';
  if (tabId === 'personal') {
    path = '/content/personalContentChannels';
  }

  return {
    types: [LOAD_CHANNELS, LOAD_CHANNELS_SUCCESS, LOAD_CHANNELS_FAIL],
    tabId: tabId,
    offset: offset,
    sortBy: sortBy,
    searchTerm: search,
    promise: (client) => client.get(path, 'webapi', {
      params: {
        tab_id: tabId,
        limit: globalFetchLimit,
        offset,
        sort_by: sortBy,
        show_hidden_channels: +!!includeHidden,  // 0/1
        search
      }
    })
  };
}

/* Load Story by Channel ID */
export function loadStories(channelId, offset = 0, sortBy = 'date', limit) {
  return {
    types: [LOAD_STORIES, LOAD_STORIES_SUCCESS, LOAD_STORIES_FAIL],
    channelId: channelId,
    offset: offset,
    sortBy: sortBy,
    promise: (client) => client.get('/content/stories', 'webapi', {
      params: {
        channel_id: channelId,
        limit: limit || globalFetchLimit,
        offset: offset,
        sort_by: sortBy,
      }
    })
  };
}

export function subscribeChannel(id, isSubscribed = true) {
  return {
    types: [SUBSCRIBE_CHANNEL, null, SUBSCRIBE_CHANNEL_FAIL],
    id,
    isSubscribed,
    promise: (client) => client.post('/channel/subscribe', 'webapi', {
      params: {
        id: id,
        subscribe: +!!isSubscribed  // 0/1
      }
    })
  };
}

/* Set Story scroll position */
export function setStoriesScrollPosition(yPos = 0) {
  return {
    type: SET_STORIES_SCROLL_POSITION,
    yPos
  };
}

export function clearLastChannel() {
  return {
    type: CLEAR_LAST_CHANNEL
  };
}

/* Save Personal Channel */
export function savePersonalChannel(data) {
  const { ...tmpData } = data;
  return {
    types: [SAVE_PERSONAL_CHANNEL, SAVE_PERSONAL_CHANNEL_SUCCESS, SAVE_PERSONAL_CHANNEL_FAIL],
    params: data,
    promise: (client) => client.post('/channel/add', 'webapi', {
      data: {
        ...tmpData,
        thumbnail: tmpData.thumbnailDownloadUrl ? tmpData.thumbnailDownloadUrl : tmpData.thumbnail
      }
    })
  };
}

/* Delete Personal Channel */
export function deletePersonalChannel(id) {
  const url = '/channel/' + id;
  return {
    types: [DELETE_PERSONAL_CHANNEL, DELETE_PERSONAL_CHANNEL_SUCCESS, DELETE_PERSONAL_CHANNEL_FAIL],
    promise: (client) => client.del(url, 'webapi')
  };
}
export function leaveSharedChannel(channelId, userId) {
  const url = `/shared-channels/${channelId}/users/${userId}`;
  return {
    types: [LEAVE_PERSONAL_SHARED_CHANNEL, LEAVE_PERSONAL_SHARED_CHANNEL_SUCCESS, LEAVE_PERSONAL_SHARED_CHANNEL_FAIL],
    promise: (client) => client.del(url, 'webapi')
  };
}

/* Load Tab by ID */
export function loadTabById(tabID) {
  const url = '/tabs/' + tabID;
  return {
    types: [LOAD_TAB, LOAD_TAB_SUCCESS, LOAD_TAB_FAIL],
    promise: (client) => client.get(url, 'webapi')
  };
}

export function toggleClearChannelFilter(value) {
  return {
    type: TOGGLE_CLEAR_CHANNEL_FILTER,
    value
  };
}
