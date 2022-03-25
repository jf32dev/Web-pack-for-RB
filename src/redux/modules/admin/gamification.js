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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */
import merge from 'lodash/merge';

export const LOAD_SCORE = 'gamification/LOAD_SCORE';
export const LOAD_SCORE_SUCCESS = 'gamification/LOAD_SCORE_SUCCESS';
export const LOAD_SCORE_FAIL = 'gamification/LOAD_SCORE_FAIL';

export const RESET_SCORE = 'gamification/RESET_SCORE';
export const RESET_SCORE_SUCCESS = 'gamification/RESET_SCORE_SUCCESS';
export const RESET_SCORE_FAIL = 'gamification/RESET_SCORE_FAIL';

export const RESET_BADGES = 'gamification/RESET_BADGES';
export const RESET_BADGES_SUCCESS = 'gamification/RESET_BADGES_SUCCESS';
export const RESET_BADGES_FAIL = 'gamification/RESET_BADGES_FAIL';

export const SAVE_SCORE = 'gamification/SAVE_SCORE';
export const SAVE_SCORE_SUCCESS = 'gamification/SAVE_SCORE_SUCCESS';
export const SAVE_SCORE_FAIL = 'gamification/SAVE_SCORE_FAIL';

export const SAVE_BADGES = 'gamification/SAVE_BADGES';
export const SAVE_BADGES_SUCCESS = 'gamification/SAVE_BADGES_SUCCESS';
export const SAVE_BADGES_FAIL = 'gamification/SAVE_BADGES_FAIL';

export const SET_SCORE = 'gamification/SET_SCORE';
export const SET_DATA = 'gamification/SET_DATA';

export const REBASE_SCORE = 'gamification/REBASE_SCORE';
export const REBASE_SCORE_SUCESS = 'gamification/REBASE_SCORE_SUCESS';
export const REBASE_SCORE_FAIL = 'gamification/REBASE_SCORE_FAIL';

export const TEST_SCORE = 'gamification/TEST_SCORE';
export const TEST_SCORE_SUCESS = 'gamification/TEST_SCORE_SUCESS';
export const TEST_SCORE_FAIL = 'gamification/TEST_SCORE_FAIL';

export const LOAD_BADGE = 'gamification/LOAD_BADGE';
export const LOAD_BADGE_SUCCESS = 'gamification/LOAD_BADGE_SUCCESS';
export const LOAD_BADGE_FAIL = 'gamification/LOAD_BADGE_FAIL';

export const initialState = {
  scoreLoaded: false,
  scoreLoading: false,
  scoreError: '',
  contentScore: [],
  userScore: [],

  rebaselineLastRunContent: '',
  rebaselineLastRunUser: '',
  rebaseScoreStatus: '',
  isUserResetScoreLoading: false,
  isContentResetScoreLoading: false,

  testScores: [],
  testScoreLoading: false,
  testScoreLoaded: false,

  badgeLoaded: false,
  badgeLoading: false,
  badgeError: '',
  isUserResetBadgeLoading: false,
  isContentResetBadgeLoading: false,

  userBadgesMin: 3,
  userBadgesMax: 10,
  userBadges: [],

  contentBadgesMin: 3,
  contentBadgesMax: 10,
  contentBadges: [],
};

/**
 * reducer
 */
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_SCORE:
      return {
        ...state,
        scoreLoaded: false,
        scoreLoading: true,
        scoreError: null
      };
    case LOAD_SCORE_SUCCESS: {
      return {
        ...state,
        scoreLoaded: true,
        scoreLoading: false,
        scoreError: null,

        rebaselineLastRunContent: action.scoreType === 'content' ? action.result.rebaselineLastRun : state.rebaselineLastRunContent,
        rebaselineLastRunUser: action.scoreType === 'user' ? action.result.rebaselineLastRun : state.rebaselineLastRunUser,
        contentScore: action.scoreType === 'content' ? action.result.params : state.contentScore,
        userScore: action.scoreType === 'user' ? action.result.params : state.userScore,
      };
    }
    case LOAD_SCORE_FAIL:
      return {
        ...state,
        scoreLoaded: false,
        scoreLoading: false,
        scoreError: action.error
      };

    case RESET_SCORE: {
      const data = {};
      if (action.scoreType === 'user') data.isUserResetScoreLoading = true;
      if (action.scoreType === 'content') data.isContentResetScoreLoading = true;

      return {
        ...state,
        ...data,
        scoreError: null
      };
    }
    case RESET_SCORE_SUCCESS: {
      const data = {};
      if (action.scoreType === 'user') data.isUserResetScoreLoading = false;
      if (action.scoreType === 'content') data.isContentResetScoreLoading = false;

      return merge({}, state, {
        ...data,
        contentScore: action.scoreType === 'content' ? action.result.params : state.contentScore,
        userScore: action.scoreType === 'user' ? action.result.params : state.userScore,
        rebaselineLastRunContent: action.scoreType === 'content' ? action.result.rebaselineLastRun : state.rebaselineLastRunContent,
        rebaselineLastRunUser: action.scoreType === 'user' ? action.result.rebaselineLastRun : state.rebaselineLastRunUser,
      });
    }
    case RESET_SCORE_FAIL: {
      const data = {};
      if (action.scoreType === 'user') data.isUserResetScoreLoading = false;
      if (action.scoreType === 'content') data.isContentResetScoreLoading = false;

      return {
        ...state,
        ...data,
        scoreError: action.error
      };
    }

    case SET_SCORE: {
      let scoreList = [];
      const type = action.params.scoreType;

      switch (type) {
        case 'user':
          scoreList = state.userScore;
          break;
        case 'content':
          scoreList = state.contentScore;
          break;
        default:
          break;
      }

      const nList = Object.assign([], scoreList);
      const item = nList.find(x => x.name === action.params.key);
      item.value = action.params.value;

      return {
        ...state,
        userScore: type === 'user' ? nList : state.userScore,
        contentScore: type === 'content' ? nList : state.contentScore,
      };
    }

    case REBASE_SCORE:
      return {
        ...state,
        rebaseScoreStatus: '',
      };

    case REBASE_SCORE_SUCESS: {
      return {
        ...state,
        rebaseScoreStatus: action.result.status,
      };
    }
    case REBASE_SCORE_FAIL: {
      return {
        ...state,
        rebaseScoreStatus: '',
        scoreError: action.error
      };
    }

    case TEST_SCORE:
      return {
        ...state,
        testScoreLoading: true,
        testScoreLoaded: false,
      };

    case TEST_SCORE_SUCESS: {
      return {
        ...state,
        testScores: action.result,
        testScoreLoading: false,
        testScoreLoaded: true,
      };
    }
    case TEST_SCORE_FAIL: {
      return {
        ...state,
        testScoreLoading: false,
        testScoreLoaded: false,
        scoreError: action.error
      };
    }

    case SAVE_SCORE:
    case SAVE_SCORE_SUCCESS:
      return {
        ...state,
        scoreError: null
      };
    case SAVE_SCORE_FAIL:
      return {
        ...state,
        scoreError: action.error
      };

    // BADGES ACTIONS
    case LOAD_BADGE:
      return {
        ...state,
        badgeLoaded: false,
        badgeLoading: true,
        badgeError: null
      };
    case LOAD_BADGE_SUCCESS:
      return {
        ...state,
        badgeLoaded: true,
        badgeLoading: false,
        badgeError: null,

        contentBadgesMin: action.params.type === 'content' ? action.result.minimum : state.contentBadgesMin,
        contentBadgesMax: action.params.type === 'content' ? action.result.maximum : state.contentBadgesMax,
        contentBadges: action.params.type === 'content' ? action.result.badges : state.contentBadges,

        userBadgesMin: action.params.type === 'user' ? action.result.minimum : state.userBadgesMin,
        userBadgesMax: action.params.type === 'user' ? action.result.maximum : state.userBadgesMax,
        userBadges: action.params.type === 'user' ? action.result.badges : state.userBadges,
      };

    case LOAD_BADGE_FAIL:
      return {
        ...state,
        badgeLoaded: false,
        badgeLoading: false,
        badgeError: action.error
      };

    case SAVE_BADGES:
    case SAVE_BADGES_SUCCESS:
      return {
        ...state,
        badgeError: null
      };
    case SAVE_BADGES_FAIL:
      return {
        ...state,
        badgeError: action.error
      };

    case RESET_BADGES: {
      const data = {};
      if (action.params.type === 'user') data.isUserResetBadgeLoading = true;
      if (action.params.type === 'content') data.isContentResetBadgeLoading = true;

      return {
        ...state,
        ...data,
        badgeError: null
      };
    }
    case RESET_BADGES_SUCCESS: {
      const data = {};
      if (action.params.type === 'user') data.isUserResetBadgeLoading = false;
      if (action.params.type === 'content') data.isContentResetBadgeLoading = false;

      return {
        ...state,
        ...data,

        contentBadgesMin: action.params.type === 'content' ? action.result.minimum : state.contentBadgesMin,
        contentBadgesMax: action.params.type === 'content' ? action.result.maximum : state.contentBadgesMax,
        contentBadges: action.params.type === 'content' ? action.result.badges : state.contentBadges,

        userBadgesMin: action.params.type === 'user' ? action.result.minimum : state.userBadgesMin,
        userBadgesMax: action.params.type === 'user' ? action.result.maximum : state.userBadgesMax,
        userBadges: action.params.type === 'user' ? action.result.badges : state.userBadges,
      };
    }
    case RESET_BADGES_FAIL: {
      const data = {};
      if (action.params.type === 'user') data.isUserResetBadgeLoading = false;
      if (action.params.type === 'content') data.isContentResetBadgeLoading = false;

      return {
        ...state,
        ...data,
        badgeError: action.error
      };
    }

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    default:
      return state;
  }
}

/* Action Creators */
/**
 * Load User or Content Score depending on type
 */
export function loadScores(scoreType) {
  return {
    types: [LOAD_SCORE, LOAD_SCORE_SUCCESS, LOAD_SCORE_FAIL],
    scoreType: scoreType,
    promise: (client) => client.get('/admin/gamification/params/get', 'webapi', {
      params: {
        type: scoreType
      }
    })
  };
}

export function resetScore(scoreType) {
  return {
    types: [RESET_SCORE, RESET_SCORE_SUCCESS, RESET_SCORE_FAIL],
    scoreType: scoreType,
    promise: (client) => client.post('/admin/gamification/params/reset', 'webapi', {
      data: {
        type: scoreType
      }
    })
  };
}

export function setScore(scoreType, key, value) {
  return {
    type: SET_SCORE,
    params: {
      scoreType: scoreType,
      key: key,
      value: value
    },
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}

export function rebaseScore(type) {
  return {
    types: [REBASE_SCORE, REBASE_SCORE_SUCESS, REBASE_SCORE_FAIL],
    params: { scoreType: type },
    promise: (client) => client.post('/admin/gamification/params/rebaseline', 'webapi', {
      data: {
        type: type
      }
    })
  };
}

export function testScore(type) {
  return {
    types: [TEST_SCORE, TEST_SCORE_SUCESS, TEST_SCORE_FAIL],
    params: { scoreType: type },
    promise: (client) => client.post('/admin/gamification/params/test', 'webapi', {
      data: {
        type: type
      }
    })
  };
}

export function saveScore(scoreType, key, value) {
  return {
    types: [SAVE_SCORE, SAVE_SCORE_SUCCESS, SAVE_SCORE_FAIL],
    scoreType: scoreType,
    promise: (client) => client.post('/admin/gamification/params/set', 'webapi', {
      data: {
        type: scoreType,
        param: key,
        value: value
      }
    })
  };
}

export function loadBadges(value) {
  return {
    types: [LOAD_BADGE, LOAD_BADGE_SUCCESS, LOAD_BADGE_FAIL],
    params: { type: value },
    promise: (client) => client.get('/admin/gamification/badges/get', 'webapi', {
      params: {
        type: value
      }
    })
  };
}

export function resetBadges(type) {
  return {
    types: [RESET_BADGES, RESET_BADGES_SUCCESS, RESET_BADGES_FAIL],
    params: { type: type },
    promise: (client) => client.post('/admin/gamification/badges/reset', 'webapi', {
      data: {
        type: type
      }
    })
  };
}

export function saveBadges(type, values) {
  return {
    types: [SAVE_BADGES, SAVE_BADGES_SUCCESS, SAVE_BADGES_FAIL],
    promise: (client) => client.post('/admin/gamification/badges/set', 'webapi', {
      data: {
        type: type,
        badges: JSON.stringify(values)
      }
    })
  };
}
