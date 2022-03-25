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
  LOAD_COMPANY_ALL_SUCCESS
} from '../company';

const story1 = {
  permId: 1
};
const story2 = {
  permId: 2
};
const story3 = {
  permId: 3
};
const story4 = {
  permId: 4
};
const story5 = {
  permId: 5
};

const user1 = {
  id: 101
};
const user2 = {
  id: 102
};

describe('content reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should set company data', () => {
    const result = {
      featured_stories: [story1],
      top_stories: [story2],
      latest_stories: [story3],
      my_recommended_stories: [story4],
      my_most_viewed_stories: [story5],
      leaderboard: [user1],
      my_top_users: [user2],
    };

    const expectedState = {
      ...initialState,
      allLoaded: true,
      allLoading: false,
      allError: null,

      featuredStories: [1],
      latestStories: [2],
      myRecommendedStories: [3],
      myMostViewedStories: [4],
      topStories: [5],
      leaderboard: [101],
      myTopUsers: [102]
    };

    expect(
      reducer(initialState, {
        type: LOAD_COMPANY_ALL_SUCCESS,
        result: result
      })
    ).to.eql(expectedState);
  });
});
