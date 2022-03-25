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
/**
 * Normalize results
 * https://github.com/gaearon/normalizr
 */
import { normalize, Schema, arrayOf } from 'normalizr';
import merge from 'lodash/merge';

// Define schemes for our entities
const interestArea = new Schema('interestArea');
const channel = new Schema('channels', { defaults: { type: 'channel' } });
const story = new Schema('stories', { idAttribute: 'permId', defaults: { type: 'story' } });

/* Action Types */
export const LOAD_INTEREST_AREA = 'userSettings/LOAD_INTEREST_AREA';
export const LOAD_INTEREST_AREA_SUCCESS = 'userSettings/LOAD_INTEREST_AREA_SUCCESS';
export const LOAD_INTEREST_AREA_FAIL = 'userSettings/LOAD_INTEREST_AREA_FAIL';

export const TOGGLE_NOTIFICATIONS = 'userSettings/TOGGLE_NOTIFICATIONS';
export const TOGGLE_NOTIFICATIONS_SUCCESS = 'userSettings/TOGGLE_NOTIFICATIONS_SUCCESS';
export const TOGGLE_NOTIFICATIONS_FAIL = 'userSettings/TOGGLE_NOTIFICATIONS_FAIL';

export const TOGGLE_INTEREST_AREA = 'userSettings/TOGGLE_INTEREST_AREA';
export const TOGGLE_INTEREST_AREA_SUCCESS = 'userSettings/TOGGLE_INTEREST_AREA_SUCCESS';
export const TOGGLE_INTEREST_AREA_FAIL = 'userSettings/TOGGLE_INTEREST_AREA_FAIL';

export const LOAD_NOTIFICATIONS = 'userSettings/LOAD_NOTIFICATIONS';
export const LOAD_NOTIFICATIONS_SUCCESS = 'userSettings/LOAD_NOTIFICATIONS_SUCCESS';
export const LOAD_NOTIFICATIONS_FAIL = 'userSettings/LOAD_NOTIFICATIONS_FAIL';

export const LOAD_CHANNEL_SUBSCRIPTIONS = 'userSettings/LOAD_CHANNEL_SUBSCRIPTIONS';
export const LOAD_CHANNEL_SUBSCRIPTIONS_SUCCESS = 'userSettings/LOAD_CHANNEL_SUBSCRIPTIONS_SUCCESS';
export const LOAD_CHANNEL_SUBSCRIPTIONS_FAIL = 'userSettings/LOAD_CHANNEL_SUBSCRIPTIONS_FAIL';

export const LOAD_STORY_SUBSCRIPTIONS = 'userSettings/LOAD_STORY_SUBSCRIPTIONS';
export const LOAD_STORY_SUBSCRIPTIONS_SUCCESS = 'userSettings/LOAD_STORY_SUBSCRIPTIONS_SUCCESS';
export const LOAD_STORY_SUBSCRIPTIONS_FAIL = 'userSettings/LOAD_STORY_SUBSCRIPTIONS_FAIL';

export const SEND_MESSAGE = 'userSettings/SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'userSettings/SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'userSettings/SEND_MESSAGE_FAIL';

export const SET_MESSAGE_VALUE = 'userSettings/SET_MESSAGE_VALUE';

export const LOAD_CRM_SETTINGS = 'userSettings/LOAD_CRM_SETTINGS';
export const LOAD_CRM_SETTINGS_SUCCESS = 'userSettings/LOAD_CRM_SETTINGS_SUCCESS';
export const LOAD_CRM_SETTINGS_FAIL = 'userSettings/LOAD_CRM_SETTINGS_FAIL';

export const SAVE_CRM_SETTINGS = 'userSettings/SAVE_CRM_SETTINGS';
export const SAVE_CRM_SETTINGS_FAIL = 'userSettings/SAVE_CRM_SETTINGS_FAIL';

export const LOAD_OPPORTUNITY_STAGES = 'userSettings/LOAD_OPPORTUNITY_STAGES';
export const LOAD_OPPORTUNITY_STAGES_SUCCESS = 'userSettings/LOAD_OPPORTUNITY_STAGES_SUCCESS';
export const LOAD_OPPORTUNITY_STAGES_FAIL = 'userSettings/LOAD_OPPORTUNITY_STAGES_FAIL';

export const SAVE_CRM_ACCOUNT = 'userSettings/SAVE_CRM_ACCOUNT';
export const SAVE_CRM_ACCOUNT_SUCCESS = 'userSettings/SAVE_CRM_ACCOUNT_SUCCESS';
export const SAVE_CRM_ACCOUNT_FAIL = 'userSettings/SAVE_CRM_ACCOUNT_FAIL';

export const SET_ATTRIBUTE = 'userSettings/SET_ATTRIBUTE';

export const REVOKE_CRM_ACCOUNT = 'userSettings/REVOKE_CRM_ACCOUNT';
export const REVOKE_CRM_ACCOUNT_FAIL = 'userSettings/REVOKE_CRM_ACCOUNT_FAIL';

export const LOAD_CRM_ENTITY_LIST = 'userSettings/LOAD_CRM_ENTITY_LIST';
export const LOAD_CRM_ENTITY_LIST_SUCCESS = 'userSettings/LOAD_CRM_ENTITY_LIST_SUCCESS';
export const LOAD_CRM_ENTITY_LIST_FAIL = 'userSettings/LOAD_CRM_ENTITY_LIST_FAIL';

const globalFetchLimit = 100;

export const initialState = {
  interestAreaError: '',
  interestArea: [],
  interestAreaById: {},
  interestAreaLoaded: false,
  interestAreaLoading: false,
  interestAreaMoreLoading: false,
  interestAreaComplete: false,

  notificationsError: '',
  notifications: {},
  notificationsLoaded: false,
  notificationsLoading: false,

  usersById: {},
  //channelsById: {},
  storiesById: {},
  filesById: {},

  stories: [],
  storiesLoaded: false,
  storiesLoading: false,
  storiesLoadingMore: false,
  storiesComplete: false,

  channels: [],
  channelsLoaded: false,
  channelsLoading: false,
  channelsLoadingMore: false,
  channelsComplete: false,

  crmSaved: {},
  crmSettings: {},
  crmSettingsLoaded: false,
  crmSettingsLoading: false,
  crmSettingsError: '',

  crmAccountSaved: '',

  opportunityStages: [],
  opportunityStagesLoading: false,
  opportunityStagesLoaded: false,
  opportunityStagesError: '',

  entityCrmList: {},
  entityCrmListLoading: false,
  entityCrmListLoaded: false,
  entityCrmListError: '',

  subject: '',
  description: '',
  platform: '',
  toggle: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_INTEREST_AREA:
      return { ...state, interestAreaLoading: true };
    case LOAD_INTEREST_AREA_SUCCESS: {
      const normalizedInterestArea = normalize(action.result, arrayOf(interestArea));
      return {
        ...state,
        interestAreaLoaded: true,
        interestAreaLoading: false,
        interestAreaComplete: action.result.length < globalFetchLimit,
        interestAreaError: null,

        // Merge interest area array if offset is set
        interestAreaById: merge({}, state.interestAreaById, normalizedInterestArea.entities.interestArea),
        interestArea: [...state.interestArea, ...normalizedInterestArea.result],
        //interestArea: !action.offset ? action.result : union(state.interestArea, action.result)
      };
    }
    case LOAD_INTEREST_AREA_FAIL:
      return {
        ...state,
        interestAreaLoaded: false,
        interestAreaLoading: false,
        interestAreaError: action.error
      };

    case TOGGLE_INTEREST_AREA:
    case TOGGLE_INTEREST_AREA_FAIL:
      return { ...state,
        interestAreaError: action.error,
        interestAreaById: { ...state.interestAreaById,
          [action.id]: {
            ...state.interestAreaById[action.id],
            selected: !state.interestAreaById[action.id].selected
          }
        }
      };

    case LOAD_NOTIFICATIONS:
      return { ...state, notificationsLoading: true };
    case LOAD_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        notificationsLoaded: true,
        notificationsLoading: false,
        notificationsError: null,
        notifications: action.result,
      };
    }
    case LOAD_NOTIFICATIONS_FAIL:
      return {
        ...state,
        notificationsLoaded: false,
        notificationsLoading: false,
        notificationsError: action.error
      };

    case TOGGLE_NOTIFICATIONS:
    case TOGGLE_NOTIFICATIONS_SUCCESS: {
      const parsedObj = {};
      if (action.params.list && action.params.list.length) {
        // parse array to object
        action.params.list.map(obj => {
          parsedObj[obj.code] = obj.value;
          return obj;
        });
      }

      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...parsedObj,
        }
      };
    }
    case TOGGLE_NOTIFICATIONS_FAIL:
      return { ...state,
        notificationsError: action.error,
        notifications: {
          ...state.notifications,
        }
      };

    case LOAD_CHANNEL_SUBSCRIPTIONS:
      return { ...state,
        channelsLoading: !action.offset,
        channelsLoadingMore: action.offset
      };
    case LOAD_CHANNEL_SUBSCRIPTIONS_SUCCESS: {
      const normalizedChannels = normalize(action.result, arrayOf(channel));

      return {
        ...state,
        channelsLoaded: true,
        channelsLoading: false,
        channelsLoadingMore: false,
        channelsComplete: action.result.length < globalFetchLimit,
        channelsError: null,

        channels: !action.offset ? normalizedChannels.result : [...state.channels, ...normalizedChannels.result]
      };
    }
    case LOAD_CHANNEL_SUBSCRIPTIONS_FAIL:
      return {
        ...state,
        channelsLoaded: false,
        channelsLoading: false,
        channelsLoadingMore: false,
        channelsError: action.error
      };

    case LOAD_STORY_SUBSCRIPTIONS:
      return { ...state, storiesLoading: true };
    case LOAD_STORY_SUBSCRIPTIONS_SUCCESS: {
      const normalizedStories = normalize(action.result, arrayOf(story));
      return {
        ...state,
        storiesLoaded: true,
        storiesLoading: false,
        storiesComplete: action.result.length < globalFetchLimit,
        storiesError: null,
        stories: !action.offset ? normalizedStories.result : [...state.stories, ...normalizedStories.result]
      };
    }
    case LOAD_STORY_SUBSCRIPTIONS_FAIL:
      return {
        ...state,
        storiesLoaded: false,
        storiesLoading: false,
        storiesError: action.error
      };

    case LOAD_CRM_SETTINGS:
      return { ...state, crmSettingsLoading: true };
    case LOAD_CRM_SETTINGS_SUCCESS: {
      return {
        ...state,
        crmSettings: action.result,
        crmSettingsLoaded: true,
        crmSettingsLoading: false,
        crmSettingsError: null,
      };
    }
    case LOAD_CRM_SETTINGS_FAIL:
      return {
        ...state,
        crmSettingsLoaded: false,
        crmSettingsLoading: false,
        crmSettingsError: action.error
      };

    case LOAD_OPPORTUNITY_STAGES:
      return { ...state, opportunityStagesLoading: true };
    case LOAD_OPPORTUNITY_STAGES_SUCCESS: {
      return {
        ...state,
        opportunityStages: action.result,
        opportunityStagesLoaded: true,
        opportunityStagesLoading: false,
        opportunityStagesError: null,
      };
    }
    case LOAD_OPPORTUNITY_STAGES_FAIL:
      return {
        ...state,
        opportunityStagesLoaded: false,
        opportunityStagesLoading: true,
        opportunityStagesError: action.error,
      };

    case LOAD_CRM_ENTITY_LIST:
      return { ...state, entityCrmListLoading: true };
    case LOAD_CRM_ENTITY_LIST_SUCCESS: {
      return {
        ...state,
        entityCrmList: action.result,
        entityCrmListLoaded: true,
        entityCrmListLoading: false,
        entityCrmListError: null,
      };
    }
    case LOAD_CRM_ENTITY_LIST_FAIL:
      return {
        ...state,
        entityCrmListLoaded: false,
        entityCrmListLoading: true,
        entityCrmListError: action.error,
      };

    case SAVE_CRM_SETTINGS: {
      return {
        ...state,
        crmSaved: true,
        crmSettings: { ...state.crmSettings,
          [action.params.attribute]: action.params.value
        }
      };
    }
    case SAVE_CRM_SETTINGS_FAIL:
      return {
        ...state,
        crmSaved: false,
        crmSettingsError: action.error
      };

    case SET_ATTRIBUTE: {
      const data = {};
      if (action.params.parent) {
        data[action.params.parent] = {
          ...state[action.params.parent],
          [action.params.attribute]: action.params.value
        };
      } else {
        data[action.params.attribute] = action.params.value;
      }
      return {
        ...state,
        ...data
      };
    }

    case SAVE_CRM_ACCOUNT:
      return {
        ...state,
        crmAccountSaved: false,
      };
    case SAVE_CRM_ACCOUNT_SUCCESS:
      return {
        ...state,
        crmAccountSaved: true,
      };
    case SAVE_CRM_ACCOUNT_FAIL:
      return {
        ...state,
        crmAccountSaved: false,
        crmSettingsError: action.error
      };
    case REVOKE_CRM_ACCOUNT:
      return {
        ...state
      };
    case REVOKE_CRM_ACCOUNT_FAIL:
      return {
        ...state,
        crmSettingsError: action.error
      };

    case SEND_MESSAGE:
      return { ...state,
        sending: true,
        sent: false,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        sending: false,
        sent: true,
        subject: '',
        description: '',
        platform: '',
      };
    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        sending: false,
        sent: false,
      };

    case SET_MESSAGE_VALUE:
      return { ...state,
        [action.attribute]: action.value
      };
    default:
      return state;
  }
}


/**
 * User settings action creators
 */
export function loadInterestArea(offset) {
  return {
    types: [LOAD_INTEREST_AREA, LOAD_INTEREST_AREA_SUCCESS, LOAD_INTEREST_AREA_FAIL],
    offset,
    promise: (client) => client.get('/usersettings/getInterestAreas', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset || 0
      }
    }),
  };
}

export function toggleInterestArea(id, isSelected) {
  return {
    types: [TOGGLE_INTEREST_AREA, TOGGLE_INTEREST_AREA_SUCCESS, TOGGLE_INTEREST_AREA_FAIL],
    id: id,
    promise: (client) => client.post('/usersettings/setInterestAreas', 'webapi', {
      data: {
        id: id,
        selected: +isSelected
      }
    })
  };
}

export function getNotifications() {
  return {
    types: [LOAD_NOTIFICATIONS, LOAD_NOTIFICATIONS_SUCCESS, LOAD_NOTIFICATIONS_FAIL],
    promise: (client) => client.get('/usersettings/getNotifications', 'webapi'),
  };
}

export function setNotifications(data) {
  const parsedData = data.filter(obj => !obj.hasChildren); // Remove custom parent - toggle
  return {
    types: [TOGGLE_NOTIFICATIONS, TOGGLE_NOTIFICATIONS_SUCCESS, TOGGLE_NOTIFICATIONS_FAIL],
    params: { list: data },
    promise: (client) => client.post('/usersettings/setNotifications', 'webapi', {
      data: {
        values: JSON.stringify(parsedData)
      }
    })
  };
}

export function loadChannelSubscriptions(offset) {
  return {
    types: [LOAD_CHANNEL_SUBSCRIPTIONS, LOAD_CHANNEL_SUBSCRIPTIONS_SUCCESS, LOAD_CHANNEL_SUBSCRIPTIONS_FAIL],
    offset,
    promise: (client) => client.get('/usersettings/getChannelSubscriptions', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset || 0
      }
    }),
  };
}

export function loadStorySubscriptions(offset) {
  return {
    types: [LOAD_STORY_SUBSCRIPTIONS, LOAD_STORY_SUBSCRIPTIONS_SUCCESS, LOAD_STORY_SUBSCRIPTIONS_FAIL],
    offset,
    promise: (client) => client.get('/usersettings/getStorySubscriptions', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset || 0
      }
    }),
  };
}

export function sendSupportMessage(subject, description, platform) {
  return {
    types: [SEND_MESSAGE, SEND_MESSAGE_SUCCESS, SEND_MESSAGE_FAIL],
    promise: (client) => client.post('/usersettings/contactSupport', 'webapi', {
      data: {
        subject: subject,
        description: description,
        platform: platform,
      }
    }),
  };
}

export function updateInputValue(attribute, value) {
  return {
    type: SET_MESSAGE_VALUE,
    attribute: attribute,
    value: value,
  };
}

export function loadCrmSettings(crmSource) {
  return {
    types: [LOAD_CRM_SETTINGS, LOAD_CRM_SETTINGS_SUCCESS, LOAD_CRM_SETTINGS_FAIL],
    promise: (client) => client.get('/crm/settings', 'webapi', {
      params: {
        source: crmSource,
      }
    }),
  };
}

export function setCrmAttribute(attribute, value, parent) {
  return {
    params: { attribute: attribute, value: value, parent: parent },
    type: SET_ATTRIBUTE,
  };
}
export function setCrmSettings(source, attribute, value) {
  //Normalize attributes
  const data = {};
  if (attribute) {
    if (attribute === 'opportunityFilter') {
      data[attribute] = JSON.stringify(value);
    } else {
      data[attribute] = value;
    }
  }

  return {
    params: { attribute: attribute, value: value },
    types: [SAVE_CRM_SETTINGS, null, SAVE_CRM_SETTINGS_FAIL],
    promise: (client) => client.post('/crm/saveSettings', 'webapi', {
      data: {
        source: source,
        ...data
      }
    }),
  };
}

export function saveCrmAccount(cloudAccountId, crmSource) {
  return {
    types: [SAVE_CRM_ACCOUNT, SAVE_CRM_ACCOUNT_SUCCESS, SAVE_CRM_ACCOUNT_FAIL],
    promise: (client) => client.post('/crm/saveAccount', 'webapi', {
      data: {
        cloudAccountId: cloudAccountId,
        source: crmSource,
      }
    }),
  };
}

export function revokeCrmAccount(crmSource) {
  return {
    types: [REVOKE_CRM_ACCOUNT, null, REVOKE_CRM_ACCOUNT_FAIL],
    promise: (client) => client.post('/crm/revokeAuthentication', 'webapi', {
      data: {
        source: crmSource,
      }
    }),
  };
}

export function loadOpportunityStages(cloudAccountId) {
  return {
    types: [LOAD_OPPORTUNITY_STAGES, LOAD_OPPORTUNITY_STAGES_SUCCESS, LOAD_OPPORTUNITY_STAGES_FAIL],
    promise: (client) => client.get('/crm/getOpportunityStages', 'webapi', {
      params: {
        cloudAccountId: cloudAccountId,
      }
    }),
  };
}

export function loadCrmEntityList(source) { //, view
  return {
    types: [LOAD_CRM_ENTITY_LIST, LOAD_CRM_ENTITY_LIST_SUCCESS, LOAD_CRM_ENTITY_LIST_FAIL],
    promise: (client) => client.get('/crm/getEntityList', 'webapi', {
      params: {
        source: source,
        //view: view
      }
    }),
  };
}
