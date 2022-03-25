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

//import createStore from '../create';

/* Action Types */
export const LOAD_CALENDAR_EVENTS = 'calendar/LOAD_CALENDAR_EVENTS';
export const LOAD_CALENDAR_EVENTS_SUCCESS = 'calendar/LOAD_CALENDAR_EVENTS_SUCCESS';
export const LOAD_CALENDAR_EVENTS_FAIL = 'calendar/LOAD_CALENDAR_EVENTS_FAIL';

/** Tags */
export const ADD_TAG = 'calendar/ADD_TAG';
export const DELETE_TAG = 'calendar/DELETE_TAG';
export const SEARCH_TAGS_SUCCESS = 'calendar/SEARCH_TAGS_SUCCESS';
export const CLEAR_TAG_SUGGESTIONS = 'calendar/CLEAR_TAG_SUGGESTIONS';

export const initialState = {
  events: [],
  tags: [],
  suggestedTags: [],
  eventsLoading: false,
  eventsLoaded: false,
  eventsError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_CALENDAR_EVENTS:
      return {
        ...state,
        eventsLoading: true
      };
    case LOAD_CALENDAR_EVENTS_SUCCESS: {
      return {
        ...state,
        events: action.result,  // event ids change when Story edited
        eventsLoading: false,
        eventsLoaded: true,
        eventsError: {}
      };
    }
    case LOAD_CALENDAR_EVENTS_FAIL:
      return {
        ...state,
        eventsLoading: false,
        eventsLoaded: false,
        eventsError: action.error
      };
    /**
     * Tags
     */
    case SEARCH_TAGS_SUCCESS:
      return { ...state,
        suggestedTags: action.result
      };
    case CLEAR_TAG_SUGGESTIONS:
      return { ...state,
        suggestedTags: []
      };
    case ADD_TAG:
      return { ...state,
        tags: [...state.tags, action.tag]
      };
    case DELETE_TAG:
      return { ...state,
        tags: state.tags.filter((t, idx) => (idx !== 1 * action.tagIndex))
      };
    default:
      return state;
  }
}

export function getEvents(startDate, endDate, tags) {
  return {
    types: [LOAD_CALENDAR_EVENTS, LOAD_CALENDAR_EVENTS_SUCCESS, LOAD_CALENDAR_EVENTS_FAIL],
    promise: (client) => {
      //const store = createStore(client);
      const params = {
        'between[start]': startDate,
        'between[end]': endDate
      };
      //const { tags } = store.getState().calendar;
      if (tags && tags.length) {
        params['tagIds[]'] = tags.map(t => t.id);
      }
      return client.get('/events', 'webapi', {
        params
      });
    }
  };
}

/**
 * Tags
 */
export function searchTags(string = '') {
  return {
    types: [null, SEARCH_TAGS_SUCCESS, null],
    promise: (client) => client.get('/tags/search', 'webapi', {
      params: {
        q: string
      }
    })
  };
}

export function addTag(tag) {
  return {
    type: ADD_TAG,
    tag
  };
}

export function deleteTag(tagIndex) {
  return {
    type: DELETE_TAG,
    tagIndex
  };
}

export function clearTagSuggestions() {
  return {
    type: CLEAR_TAG_SUGGESTIONS
  };
}
