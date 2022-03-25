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

/* Action Types */
export const LOAD_EVENTS = 'activity/LOAD_EVENTS';
export const LOAD_EVENTS_SUCCESS = 'activity/LOAD_EVENTS_SUCCESS';
export const LOAD_EVENTS_FAIL = 'activity/LOAD_EVENTS_FAIL';

export const LOAD_NOTIFICATIONS = 'activity/LOAD_NOTIFICATIONS';
export const LOAD_NOTIFICATIONS_SUCCESS = 'activity/LOAD_NOTIFICATIONS_SUCCESS';
export const LOAD_NOTIFICATIONS_FAIL = 'activity/LOAD_NOTIFICATIONS_FAIL';

export const TOGGLE_USER_FOLLOW = 'activity/TOGGLE_USER_FOLLOW';
export const TOGGLE_USER_FOLLOW_SUCCESS = 'activity/TOGGLE_USER_FOLLOW_SUCCESS';
export const TOGGLE_USER_FOLLOW_FAIL = 'activity/TOGGLE_USER_FOLLOW_FAIL';

export const initialState = {
  notifications: [],
  notificationsLoading: false,
  notificationsLoaded: false,
  notificationsError: {},

  events: [],
  eventsLoading: false,
  eventsLoaded: false,
  eventsError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_EVENTS:
      return {
        ...state,
        eventsLoading: true
      };
    case LOAD_EVENTS_SUCCESS: {
      const ids = action.result.map(e => e.id);

      return {
        ...state,
        events: ids,  // event ids change when Story edited
        eventsLoading: false,
        eventsLoaded: true,
        eventsError: {}
      };
    }
    case LOAD_EVENTS_FAIL:
      return {
        ...state,
        eventsLoading: false,
        eventsLoaded: false,
        eventsError: action.error
      };

    case LOAD_NOTIFICATIONS:
      return {
        ...state,
        notificationsLoading: true,
        notificationsError: {}
      };
    case LOAD_NOTIFICATIONS_SUCCESS: {
      const ids = action.result.map(n => n.id);

      return {
        ...state,
        notifications: union(state.notifications, ids),
        notificationsLoading: false,
        notificationsLoaded: true,
        notificationsError: {}
      };
    }
    case LOAD_NOTIFICATIONS_FAIL:
      return {
        ...state,
        notificationsLoading: false,
        notificationsLoaded: false,
        notificationsError: action.error
      };
    default:
      return state;
  }
}

export function getEvents() {
  return {
    types: [LOAD_EVENTS, LOAD_EVENTS_SUCCESS, LOAD_EVENTS_FAIL],
    promise: (client) => client.get('/activity/events', 'webapi')
  };
}

export function getNotifications(sinceTime) {  // eslint-disable-line
  return {
    types: [LOAD_NOTIFICATIONS, LOAD_NOTIFICATIONS_SUCCESS, LOAD_NOTIFICATIONS_FAIL],
    promise: (client) => client.get('/activity/getNotifications', 'webapi')
  };
}
