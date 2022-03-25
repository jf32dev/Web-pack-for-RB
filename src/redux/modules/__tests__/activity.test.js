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

  LOAD_NOTIFICATIONS,
  LOAD_NOTIFICATIONS_SUCCESS
} from '../activity';

const testNotifications = [
  {
    'id': 1,
    'type': 'notification',
    'actionType': 'user',
    'actionId': 198,
    'code': 'user_followed',
    'date': 1465184274,
    'read': true,
    'user': {
      'id': 198,
      'email': 'sameera.perera@bigtincan.com',
      'type': 'people',
      'name': 'Sameera Perera',
      'thumbnail': '',
      'role': '',
      'isFollowed': true
    },
    'story': {}
  },
  {
    'id': 2,
    'type': 'notification',
    'actionType': 'story',
    'actionId': 687243,
    'code': 'story_updated',
    'date': 1464919198,
    'read': true,
    'user': {
      'id': 213,
      'email': 'simon@bigtincan.com',
      'type': 'people',
      'name': 'Simon Seeber',
      'thumbnail': '',
      'role': 'Designer',
      'isFollowed': false
    },
    'story': {
      'id': 2344382,
      'title': 'All Access Story',
      'colour': '#E2023A',
      'thumbnail': '',
      'permId': 687243
    }
  }
];

describe('activity reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should set notifications to loading', () => {
    const expectedState = {
      ...initialState,
      notificationsLoading: true,
      notificationsLoaded: false
    };

    expect(
      reducer(initialState, {
        type: LOAD_NOTIFICATIONS
      })
    ).to.eql(expectedState);
  });

  it('should normalize notifications data', () => {
    const expectedState = {
      ...initialState,
      notificationsLoading: false,
      notificationsLoaded: true,
      notificationsById: {
        1: {
          'id': 1,
          'type': 'notification',
          'actionType': 'user',
          'actionId': 198,
          'code': 'user_followed',
          'date': 1465184274,
          'read': true,
          'user': 198,
          'story': undefined
        },
        2: {
          'id': 2,
          'type': 'notification',
          'actionType': 'story',
          'actionId': 687243,
          'code': 'story_updated',
          'date': 1464919198,
          'read': true,
          'user': 213,
          'story': 2344382
        },
      },
      notifications: [1, 2],
      usersById: {
        198: {
          'id': 198,
          'email': 'sameera.perera@bigtincan.com',
          'type': 'people',
          'name': 'Sameera Perera',
          'thumbnail': '',
          'role': '',
          'isFollowed': true
        },
        213: {
          'id': 213,
          'email': 'simon@bigtincan.com',
          'type': 'people',
          'name': 'Simon Seeber',
          'thumbnail': '',
          'role': 'Designer',
          'isFollowed': false
        }
      },
      storiesById: {
        undefined: {},
        2344382: {
          'id': 2344382,
          'title': 'All Access Story',
          'colour': '#E2023A',
          'thumbnail': '',
          'permId': 687243
        }
      }
    };

    expect(
      reducer(initialState, {
        type: LOAD_NOTIFICATIONS_SUCCESS,
        result: testNotifications
      })
    ).to.eql(expectedState);
  });
});
