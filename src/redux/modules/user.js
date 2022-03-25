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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

const globalFetchLimit = 100;

export const LOAD_USER_PROFILE = 'user/LOAD_USER_PROFILE';
export const LOAD_USER_PROFILE_SUCCESS = 'user/LOAD_USER_PROFILE_SUCCESS';
export const LOAD_USER_PROFILE_FAIL = 'user/LOAD_USER_PROFILE_FAIL';

export const SET_USER_ATTRIBUTE = 'user/SET_USER_ATTRIBUTE';

export const SAVE_USER = 'user/SAVE_USER';
export const SAVE_USER_SUCCESS = 'user/SAVE_USER_SUCCESS';
export const SAVE_USER_FAIL = 'user/SAVE_USER_FAIL';

export const CLOSE = 'user/CLOSE';

/** Skills */
export const ADD_SKILL = 'story/ADD_SKILL';
export const DELETE_SKILL = 'story/DELETE_SKILL';
export const SEARCH_SKILLS_SUCCESS = 'story/SEARCH_SKILLS_SUCCESS';
export const CLEAR_SKILL_SUGGESTIONS = 'story/CLEAR_SKILL_SUGGESTIONS';

/** Praises */
export const SHOW_ALL_PRAISES = 'user/SHOW_ALL_PRAISES';
export const ADD_PRAISE = 'user/ADD_PRAISE';
export const ADD_PRAISE_SUCCESS = 'user/ADD_PRAISE_SUCCESS';
export const ADD_PRAISE_FAIL = 'user/ADD_PRAISE_FAIL';

export const DELETE_PRAISE = 'user/DELETE_PRAISE';
export const DELETE_PRAISE_SUCCESS = 'user/DELETE_PRAISE_SUCCESS';
export const DELETE_PRAISE_FAIL = 'user/DELETE_PRAISE_FAIL';

/** Published Stories */
export const LOAD_USER_PUBLISHED_STORIES = 'user/LOAD_USER_PUBLISHED_STORIES';
export const LOAD_USER_PUBLISHED_STORIES_SUCCESS = 'user/LOAD_USER_PUBLISHED_STORIES_SUCCESS';
export const LOAD_USER_PUBLISHED_STORIES_FAIL = 'user/LOAD_USER_PUBLISHED_STORIES_FAIL';


/** Scheduled Stories */
export const LOAD_USER_SCHEDULED_STORIES = 'user/LOAD_USER_SCHEDULED_STORIES';
export const LOAD_USER_SCHEDULED_STORIES_SUCCESS = 'user/LOAD_USER_SCHEDULED_STORIES_SUCCESS';
export const LOAD_USER_SCHEDULED_STORIES_FAIL = 'user/LOAD_USER_SCHEDULED_STORIES_FAIL';

/** Followers & Following lists  */
export const LOAD_USER_FOLLOWERS = 'user/LOAD_USER_FOLLOWERS';
export const LOAD_USER_FOLLOWERS_SUCCESS = 'user/LOAD_USER_FOLLOWERS_SUCCESS';
export const LOAD_USER_FOLLOWERS_FAIL = 'user/LOAD_USER_FOLLOWERS_FAIL';

export const LOAD_USER_FOLLOWING = 'user/LOAD_USER_FOLLOWING';
export const LOAD_USER_FOLLOWING_SUCCESS = 'user/LOAD_USER_FOLLOWING_SUCCESS';
export const LOAD_USER_FOLLOWING_FAIL = 'user/LOAD_USER_FOLLOWING_FAIL';

export const LOAD_USER_GROUPS = 'user/LOAD_USER_GROUPS';
export const LOAD_USER_GROUPS_SUCCESS = 'user/LOAD_USER_GROUPS_SUCCESS';
export const LOAD_USER_GROUPS_FAIL = 'user/LOAD_USER_GROUPS_FAIL';

/** Follow and Unfollow a User */
export const TOGGLE_USER_FOLLOW = 'user/TOGGLE_USER_FOLLOW';
export const TOGGLE_USER_FOLLOW_SUCCESS = 'user/TOGGLE_USER_FOLLOW_SUCCESS';
export const TOGGLE_USER_FOLLOW_FAIL = 'user/TOGGLE_USER_FOLLOW_FAIL';

/** Metadata */
export const ADD_USER_METADATA = 'user/ADD_USER_METADATA';
export const CHANGE_USER_METADATA = 'user/CHANGE_USER_METADATA';
export const DELETE_USER_METADATA = 'user/DELETE_USER_METADATA';

export const initialState = {
  loadError: {},

  saving: false,
  saved: false,
  saveError: {},

  hasUnsavedChanges: false,
  pendingPraise: null,

  // ui
  suggestedSkills: [],
  areAllPraisesVisibled: false,

  // user defaults
  id: null,
  type: 'user',
  name: '',

  firstname: '',
  lastname: '',
  email: '',
  initials: '',
  landlineNumber: '',
  mobileNumber: '',
  role: '',

  thumbnail: '',
  originalThumbnail: '',
  metadata: [],
  skills: [],
  social: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_USER_PROFILE:
      return {
        ...state,
        id: action.userId
      };
    case LOAD_USER_PROFILE_SUCCESS: {
      if (action.result.id !== state.id) {
        return state;
      }
      const profile = Object.assign({}, action.result);
      profile.groups = (profile.groups || []).map((groupItem) => groupItem.id);
      //sometime user groups being reset during the person profile view so just for the backdrop
      profile.groupCount = profile.groups.length;
      return {
        ...state,
        ...profile,
        originalThumbnail: action.result.thumbnail,
        loadError: {}
      };
    }
    case LOAD_USER_PROFILE_FAIL:
      return {
        ...state,
        loadError: action.error
      };

    case SET_USER_ATTRIBUTE: {
      const data = {};
      if (action.parentAttribute) {
        data[action.parentAttribute] = state[action.parentAttribute];
        data[action.parentAttribute][action.attribute] = action.value;
      } else {
        data[action.attribute] = action.value;
      }

      return {
        ...state,
        ...data,
        hasUnsavedChanges: true
      };
    }

    case SAVE_USER:
      return {
        ...state,
        saved: false,
        saving: true,
        saveError: {}
      };
    case SAVE_USER_SUCCESS:
      return {
        ...state,
        saved: true,
        saving: false,
        hasUnsavedChanges: false,
        saveError: {}
      };
    case SAVE_USER_FAIL:
      return {
        ...state,
        saved: false,
        saving: false,
        saveError: action.error,
      };

    /** Skills */
    case ADD_SKILL: {
      // Ignore duplicate
      if (state.skills.indexOf(action.name) > -1) {
        return state;
      }

      return {
        ...state,
        hasUnsavedChanges: true,
        skills: [...state.skills, action.name]
      };
    }
    case DELETE_SKILL: {
      const newSkills = [...state.skills];
      newSkills.splice(action.index, 1);

      return {
        ...state,
        hasUnsavedChanges: true,
        skills: newSkills
      };
    }
    case SEARCH_SKILLS_SUCCESS:
      return {
        ...state,
        suggestedSkills: action.result
      };
    case CLEAR_SKILL_SUGGESTIONS:
      return {
        ...state,
        suggestedSkills: []
      };

    /** Praises */
    case ADD_PRAISE:
      return {
        ...state,
        pendingPraise: {
          ...action.data,
          type: 'praise',
          status: 'loading'
        }
      };
    case ADD_PRAISE_SUCCESS:
      return {
        ...state,
        pendingPraise: null
      };
    case ADD_PRAISE_FAIL:
      return {
        ...state,
        pendingPraise: null,
        error: action.error,
      };
    case SHOW_ALL_PRAISES:
      return {
        ...state,
        areAllPraisesVisibled: action.params.isVisible,
      };

    /** List loading errors */
    case LOAD_USER_PUBLISHED_STORIES_FAIL:
    case LOAD_USER_FOLLOWING_FAIL:
    case LOAD_USER_FOLLOWERS_FAIL:
    case LOAD_USER_GROUPS_FAIL:
    case LOAD_USER_SCHEDULED_STORIES_FAIL:
      return {
        ...state,
        error: action.error,
      };

    case CLOSE:
      return {
        ...initialState
      };

    case ADD_USER_METADATA:
      return {
        ...state,
        hasUnsavedChanges: true,
        metadata: [...state.metadata, ...action.params.items]
      };
    case CHANGE_USER_METADATA: {
      let newMetadata = state.metadata;
      newMetadata = newMetadata.map(function (obj) {
        let item = obj;
        if (item.id === action.params.oldItem.id) {
          item = action.params.item;
        }
        return item;
      });

      return {
        ...state,
        hasUnsavedChanges: true,
        metadata: newMetadata
      };
    }
    case DELETE_USER_METADATA:
      return {
        ...state,
        hasUnsavedChanges: true,
        metadata: [...state.metadata.filter(obj => obj.id !== action.params.item.id)]
      };

    default:
      return state;
  }
}

export function loadProfile(userId, includeGroups) {
  const params = {
    id: userId,
  };
  if (includeGroups) {
    params.include_groups = 1;
  }
  return {
    types: [LOAD_USER_PROFILE, LOAD_USER_PROFILE_SUCCESS, LOAD_USER_PROFILE_FAIL],
    userId,
    promise: (client) => client.get('/user/profile', 'webapi', {
      params
    })
  };
}

export function loadPublishedStories(userId, offset = 0) {
  return {
    types: [LOAD_USER_PUBLISHED_STORIES, LOAD_USER_PUBLISHED_STORIES_SUCCESS, LOAD_USER_PUBLISHED_STORIES_FAIL],
    userId,
    promise: (client) => client.get('/user/storiesPublished', 'webapi', {
      params: {
        id: userId,
        limit: globalFetchLimit,
        offset: offset
      }
    }),
  };
}

export function loadScheduledStories(userId, offset = 0) {
  return {
    types: [LOAD_USER_SCHEDULED_STORIES, LOAD_USER_SCHEDULED_STORIES_SUCCESS, LOAD_USER_SCHEDULED_STORIES_FAIL],
    userId,
    promise: (client) => client.get('/user/' + userId + '/stories/scheduled', 'webapi', {
      params: {
        id: userId,
        limit: globalFetchLimit,
        offset: offset
      }
    }),
  };
}

// Followers - Following modal
export function loadFollowers(userId, offset = 0) {
  return {
    types: [LOAD_USER_FOLLOWERS, LOAD_USER_FOLLOWERS_SUCCESS, LOAD_USER_FOLLOWERS_FAIL],
    userId,
    promise: (client) => client.get('/user/followers', 'webapi', {
      params: {
        id: userId,
        limit: globalFetchLimit,
        offset: offset || 0,
      }
    })
  };
}

export function loadFollowing(userId, offset = 0) {
  return {
    types: [LOAD_USER_FOLLOWING, LOAD_USER_FOLLOWING_SUCCESS, LOAD_USER_FOLLOWING_FAIL],
    userId,
    promise: (client) => client.get('/user/following', 'webapi', {
      params: {
        id: userId,
        limit: globalFetchLimit,
        offset: offset || 0,
      }
    })
  };
}

export function loadUserGroups(userId, offset = 0) {
  return {
    types: [LOAD_USER_GROUPS, LOAD_USER_GROUPS_SUCCESS, LOAD_USER_GROUPS_FAIL],
    userId,
    promise: (client) => client.get('/user/' + userId + '/groups', 'webapi', {
      params: {
        id: userId,
        limit: globalFetchLimit,
        offset: offset || 0,
      }
    })
  };
}

export function toggleUserFollow(userId, isFollowed) {
  return {
    types: [TOGGLE_USER_FOLLOW, TOGGLE_USER_FOLLOW_SUCCESS, TOGGLE_USER_FOLLOW_FAIL],
    userId,
    promise: (client) => client.post('/user/follow', 'webapi', {
      params: {
        id: userId,
        follow: +isFollowed  // sent as 0/1
      }
    })
  };
}

export function toggleAllPraises(isVisible) {
  return {
    type: SHOW_ALL_PRAISES,
    params: {
      isVisible: isVisible
    }
  };
}

export function addPraise(data) {
  return {
    types: [ADD_PRAISE, ADD_PRAISE_SUCCESS, ADD_PRAISE_FAIL],
    data: {
      ...data,
      id: data.time
    },
    promise: (client) => client.post('/user/addPraise', 'webapi', {
      params: {
        id: data.userPraisedId,
        praise: data.message
      }
    })
  };
}

export function deletePraise(data) {
  return {
    params: data,
    id: data.id,
    types: [DELETE_PRAISE, DELETE_PRAISE_SUCCESS, DELETE_PRAISE_FAIL],
    promise: (client) => client.post('/user/deletePraise', 'webapi', {
      params: { id: data.id }
    })
  };
}

/**
 * Clears existing Profile data
 */
export function close() {
  return {
    type: CLOSE
  };
}

export function setAttributeValue(attribute, value, parentAttribute) {
  return {
    type: SET_USER_ATTRIBUTE,
    attribute: attribute,
    value: value,
    parentAttribute: parentAttribute,
  };
}

/**
 * Skills
 */
export function addSkill(name) {
  return {
    type: ADD_SKILL,
    name
  };
}

export function deleteSkill(index) {
  return {
    type: DELETE_SKILL,
    index
  };
}

export function searchSkills(string = '') {
  return {
    types: [null, SEARCH_SKILLS_SUCCESS, null],
    promise: (client) => client.get('/user/skills', 'webapi', {
      params: {
        search: string
      }
    })
  };
}

export function clearSkillSuggestions() {
  return {
    type: CLEAR_SKILL_SUGGESTIONS
  };
}

export function saveUser(userId, userData) {
  // stringify data
  const data = {
    ...userData,
    skills: JSON.stringify(userData.skills),
    social: JSON.stringify(userData.social),
    metadata: JSON.stringify(userData.metadata.map(({ id }) => id)),
    companyData: JSON.stringify({
      ...userData.companyData
    })
  };

  if (userData.thumbnail) {
    data.thumbnail = userData.thumbnail;
  }

  return {
    types: [SAVE_USER, SAVE_USER_SUCCESS, SAVE_USER_FAIL],
    userId: userId,
    data: userData,
    promise: (client) => client.post('/user/editProfile', 'webapi', {
      data: {
        ...data
      }
    })
  };
}

export function addUserMetadata(items) {
  return {
    type: ADD_USER_METADATA,
    params: { items: items }
  };
}

export function changeUserMetadata(newItem, oldItem) {
  return {
    type: CHANGE_USER_METADATA,
    params: { item: newItem, oldItem: oldItem }
  };
}

export function deleteUserMetadata(item) {
  return {
    type: DELETE_USER_METADATA,
    params: { item: item }
  };
}
