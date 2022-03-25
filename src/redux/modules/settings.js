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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import { normalize, Schema, arrayOf } from 'normalizr';
import merge from 'lodash/merge';

import superagent from 'superagent';
import generateScheme from '../../../_assets/style-guide/src/helpers/generateScheme';

import { SET_CUSTOMIZATION_SUCCESS } from './admin/general';
import { UPDATE_SECURITY_SUCCESS } from './admin/security';
import { SET_USER_DEFAULTS_SUCCESS } from './admin/structure';
import { GET_CRM_SETTING_SUCCESS } from './admin/crmIntegration';
import { SET_FILES_GENERAL_SUCCESS } from './admin/filesGeneral';
import { SET_FILES_DEFAULTS_SUCCESS } from './admin/filesDefaults';


// Define schemes for our entities
/* All type search */
const device = new Schema('devices', { idAttribute: 'recordId' });

// Metadata scheme
const metadataValue = new Schema('metadataValues');
const metadataAttribute = new Schema('metadataAttributes');
metadataValue.define({
  attribute: metadataAttribute,
});

export const LOAD_SETTINGS = 'settings/LOAD_SETTINGS';
export const LOAD_SETTINGS_SUCCESS = 'settings/LOAD_SETTINGS_SUCCESS';
export const LOAD_SETTINGS_FAIL = 'settings/LOAD_SETTINGS_FAIL';

export const SET_AUTH_STRING = 'settings/SET_AUTH_STRING';
export const SET_LOCATION = 'settings/SET_LOCATION';
export const SET_NOTIFICATIONS_READ = 'settings/SET_NOTIFICATIONS_READ';

export const SET_CONTENT_TABS_SORTBY = 'settings/SET_CONTENT_TABS_SORTBY';
export const SET_CONTENT_CHANNELS_SORTBY = 'settings/SET_CONTENT_CHANNELS_SORTBY';
export const SET_CONTENT_STORIES_SORTBY = 'settings/SET_CONTENT_STORIES_SORTBY';
export const TOGGLE_CONTENT_SHOW_HIDDEN_CHANNELS = 'settings/TOGGLE_CONTENT_SHOW_HIDDEN_CHANNELS';
export const TOGGLE_CONTENT_STORY_GRID = 'settings/TOGGLE_CONTENT_STORY_GRID';
export const SET_LAST_CONTENT_ROUTE = 'settings/SET_LAST_CONTENT_ROUTE';
export const TOGGLE_PERSONAL_CHANNELS_MODEL = 'settings/TOGGLE_PERSONAL_CHANNELS_MODEL';

export const SET_ARCHIVE_TABS_SORTBY = 'settings/SET_ARCHIVE_TABS_SORTBY';
export const SET_ARCHIVE_CHANNELS_SORTBY = 'settings/SET_ARCHIVE_CHANNELS_SORTBY';
export const SET_ARCHIVE_STORIES_SORTBY = 'settings/SET_ARCHIVE_STORIES_SORTBY';
export const TOGGLE_ARCHIVE_SHOW_HIDDEN_CHANNELS = 'settings/TOGGLE_ARCHIVE_SHOW_HIDDEN_CHANNELS';
export const TOGGLE_ARCHIVE_STORY_GRID = 'settings/TOGGLE_ARCHIVE_STORY_GRID';
export const SET_LAST_ARCHIVE_ROUTE = 'settings/SET_LAST_ARCHIVE_ROUTE';

export const SET_LAST_BLOCKSEARCH_ROUTE = 'settings/SET_LAST_BLOCKSEARCH_ROUTE';

export const SET_ME_NOTES_SORTBY = 'settings/SET_ME_NOTES_SORTBY';

export const SET_LAST_FORMS_ROUTE = 'settings/SET_LAST_FORMS_ROUTE';
export const SET_LAST_ADMIN_ROUTE = 'settings/SET_LAST_ADMIN_ROUTE';

export const SET_STORY_OPTION = 'settings/SET_STORY_OPTION';
export const SET_DEFAULT_CHANNEL = 'settings/SET_DEFAULT_CHANNEL';
export const CLEAR_DEFAULT_CHANNEL = 'settings/CLEAR_DEFAULT_CHANNEL';

export const SET_BETA_USER = 'settings/SET_BETA_USER';
export const SET_CONTACT_USER = 'settings/SET_CONTACT_USER';
export const CONFIRM_WELCOME = 'settings/CONFIRM_WELCOME';

export const SET_USER_DATA = 'settings/SET_USER_DATA';
export const SET_USER_DATA_SUCCESS = 'settings/SET_USER_DATA_SUCCESS';
export const SET_USER_DATA_FAIL = 'settings/SET_USER_DATA_FAIL';

export const SET_USER_PASSWORD = 'settings/SET_USER_PASSWORD';
export const SET_USER_PASSWORD_SUCCESS = 'settings/SET_USER_PASSWORD_SUCCESS';
export const SET_USER_PASSWORD_FAIL = 'settings/SET_USER_PASSWORD_FAIL';

export const DISCONNECT_DEVICE = 'settings/DISCONNECT_DEVICE';
export const DISCONNECT_DEVICE_SUCCESS = 'settings/DISCONNECT_DEVICE_SUCCESS';
export const DISCONNECT_DEVICE_FAIL = 'settings/DISCONNECT_DEVICE_FAIL';

export const GET_USER_GENERAL_SETTINGS = 'settings/GET_USER_GENERAL_SETTINGS';
export const GET_USER_GENERAL_SETTINGS_SUCCESS = 'settings/GET_USER_GENERAL_SETTINGS_SUCCESS';
export const GET_USER_GENERAL_SETTINGS_FAIL = 'settings/GET_USER_GENERAL_SETTINGS_FAIL';

export const GET_USER_METADATA = 'settings/GET_USER_METADATA';
export const GET_USER_METADATA_SUCCESS = 'settings/GET_USER_METADATA_SUCCESS';
export const GET_USER_METADATA_FAIL = 'settings/GET_USER_METADATA_FAIL';

export const GET_REPORTS = 'settings/GET_REPORTS';
export const GET_REPORTS_SUCCESS = 'settings/GET_REPORTS_SUCCESS';
export const GET_REPORTS_FAIL = 'settings/GET_REPORTS_FAIL';

export const DELETE_REPORTS = 'settings/DELETE_REPORTS';
export const DELETE_REPORTS_SUCCESS = 'settings/DELETE_REPORTS_SUCCESS';
export const DELETE_REPORTS_FAIL = 'settings/DELETE_REPORTS_FAIL';

export const RESET_USER_METADATA = 'settings/RESET_USER_METADATA';
export const SET_USER_METADATA = 'settings/SET_USER_METADATA';

export const SET_ATTRIBUTE = 'settings/SET_ATTRIBUTE';

export const initialState = {
  loaded: false,
  loading: false,

  crm: {},

  allowedExtensions: [],
  adminSettings: {
    lastRoute: '/admin'
  },
  archiveSettings: {
    lastRoute: '/archive',
    channelsSortBy: 'name',
    showHiddenChannels: true,
    storiesSortBy: 'date',
    storyGrid: true,
    tabsSortBy: 'name'
  },
  blocksearchSettings: {
    lastRoute: '/blocksearch',
  },
  authString: '',
  company: {
    defaultHomeScreen: null
  },
  contentSettings: {
    lastRoute: '/content',
    channelsSortBy: 'name',
    showHiddenChannels: false,
    storiesSortBy: 'date',
    storyGrid: true,
    tabsSortBy: 'name',
    showPersonalChannelModal: false,
  },
  flags: [
    {
      id: 3,
      name: 'Major Issue',
      colour: '#ed1c24',
      priority: 30
    },
    {
      id: 2,
      name: 'Minor Issue',
      colour: '#ffd200',
      priority: 20
    },
    {
      id: 1,
      name: 'Possible Issue',
      colour: '#26acde',
      priority: 10
    }
  ],
  fileSettings: {
    canCreateCustomFileDetailsSettings: {}
  },
  formDefaults: {},
  formsSettings: {
    lastRoute: '/forms'
  },
  geolocation: {
    latitude: null,
    longitude: null
  },
  metadata: {},
  meSettings: {
    notesSortBy: 'date_updated'
  },
  naming: {
    tab: 'Tab',
    tabs: 'Tabs',
    channel: 'Channel',
    channels: 'Channels',
    story: 'Story',
    stories: 'Stories'
  },
  platform: {},
  sharing: {},
  shareMenu: {
    isToVisible: true,
    isServiceVisible: true,
    isCcVisible: true,
    isSubjectVisible: true,
    isMessageVisible: true,
  },
  storyDefaults: {
    channels: null,
    locationConstraints: [],
    topTags: []
  },
  storySettings: {
    fileGrid: true,
    descriptionCollapsed: false,
    filesCollapsed: false,
    commentsCollapsed: false,
    tagsCollapsed: false,
    tabsSortBy: 'name',
    channelsSortBy: 'name',
    showHiddenChannels: false
  },
  theme: {
    baseColor: '#F26724',
    darkBaseColor: '#B03100',
    lightBaseColor: '#FBD4BF',
    accentColor: '#43b7f1',
    baseText: '#ffffff',
    backgroundColor: '#ffffff',
    textIcons: '#ffffff',

    primaryText: '#000000',
    secondaryText: '#666666',
    descriptonText: '#222222',
    dividerColor: '#dddddd',
    disabledColor: '#999999',

    infoColor: '#ffe5a7',
    errorColor: '#bf1515',
    destructiveColor: '#FF0000',
    successColor: '#04d97e',
    notificationColor: '#43B7F1'
  },
  user: {},
  userLoaded: false,
  userLoading: false,
  userError: '',

  userDataSaved: false,
  userDataSaving: false,
  userPasswordUpdated: false,
  userPasswordUpdating: false,
  userSignatureUpdated: false,
  userSignatureUpdating: false,

  userCapabilities: {},
  userSettings: {
    betaUser: false,
    contactUser: false
  },

  deviceById: {},
  devices: [],

  metadataAttributesById: {},
  metadataValuesById: {},
  metadataAttributes: [],
  metadataValues: [],

  languages: [],
  timezones: [],
  welcomeScreens: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_SETTINGS:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOAD_SETTINGS_SUCCESS: {
      const advanceSearchEnabled = action.result.userCapabilities.hasAdvancedSearch;
      const hasPageSearch = advanceSearchEnabled ? advanceSearchEnabled.isEnabled : false;
      const hasPitchBuilderWeb = advanceSearchEnabled.isEnabled ? advanceSearchEnabled.children.has_pitch_builder_web : false;

      return {
        ...state,
        ...action.result,
        loaded: true,
        loading: false,
        error: null,

        platform: require('platform'),

        // Generate new theme
        theme: generateScheme(action.result.theme),

        // Prevent geolocation override when reloading
        storyDefaults: {
          ...state.storyDefaults,
          ...action.result.storyDefaults
        },
        userCapabilities: {
          ...state.userCapabilities,
          ...action.result.userCapabilities,
          hasPageSearch: hasPageSearch,
          hasPitchBuilderWeb: hasPitchBuilderWeb
        }
      };
    }
    case LOAD_SETTINGS_FAIL:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.error
      };

    case SET_AUTH_STRING:
      return {
        ...state,
        authString: action.data
      };
    case SET_LOCATION:
      return {
        ...state,
        geolocation: action.location
      };
    case SET_USER_DATA: {
      const userData = {};
      const data = {};

      // Normalize timezone key
      if (action.key === 'timezone') {
        userData.tz = action.value;
      }
      if (action.key === 'signature') {
        data.userSignatureUpdated = false;
        data.userSignatureUpdating = true;
      }
      return {
        ...state,
        user: {
          ...state.user,
          [action.key]: action.value,
          ...userData,
        },
        ...data,
        userError: '',
      };
    }
    case SET_USER_DATA_SUCCESS: {
      const data = {};

      if (action.key === 'signature') {
        data.userSignatureUpdated = true;
        data.userSignatureUpdating = false;
      }
      return {
        ...state,
        ...data,
        userError: '',
      };
    }
    case SET_USER_DATA_FAIL:
      return {
        ...state,
        userSignatureUpdated: false,
        userSignatureUpdating: false,
        userError: action.error
      };
    case GET_USER_GENERAL_SETTINGS:
      return {
        ...state,
        userLoaded: false,
        userLoading: true,
        userError: '',
      };
    case GET_USER_GENERAL_SETTINGS_SUCCESS: {
      const { languages, timezones, ...resultObj } = action.result;
      const normalized = normalize(resultObj, {
        devices: arrayOf(device),
      });

      return {
        ...state,
        languages: languages,
        timezones: timezones,
        devicesById: merge({}, state.devicesById, normalized.entities.devices),
        devices: normalized.result.devices,
        user: {
          ...state.user,
          ...normalized.result,
        },
        userLoaded: true,
        userLoading: false,
      };
    }
    case GET_USER_GENERAL_SETTINGS_FAIL:
      return {
        ...state,
        userLoaded: true,
        userLoading: false,
        userError: action.error
      };
    case SET_USER_PASSWORD:
      return {
        ...state,
        userPasswordUpdated: false,
        userPasswordUpdating: true,
        userError: '',
      };
    case SET_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        userPasswordUpdated: true,
        userPasswordUpdating: false,
      };
    case SET_USER_PASSWORD_FAIL:
      return {
        ...state,
        userPasswordUpdated: false,
        userPasswordUpdating: false,
        userError: action.error
      };
    case DISCONNECT_DEVICE:
      return {
        ...state,
        devicesById: { ...state.devicesById,
          [action.id]: { ...state.devicesById[action.id],
            disconnected: true
          }
        }
      };
    case DISCONNECT_DEVICE_FAIL:
      return {
        ...state,
        devicesById: { ...state.devicesById,
          [action.id]: { ...state.devicesById[action.id],
            disconnected: false
          }
        }
      };

    case SET_NOTIFICATIONS_READ:
      return {
        ...state,
        user: { ...state.user,
          hasUnreadNotifications: false
        }
      };

    /** Content */
    case SET_CONTENT_TABS_SORTBY:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          tabsSortBy: action.value
        }
      };
    case SET_CONTENT_CHANNELS_SORTBY:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          channelsSortBy: action.value
        }
      };
    case SET_CONTENT_STORIES_SORTBY:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          storiesSortBy: action.value
        }
      };
    case TOGGLE_CONTENT_SHOW_HIDDEN_CHANNELS:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          showHiddenChannels: !state.contentSettings.showHiddenChannels
        }
      };
    case TOGGLE_CONTENT_STORY_GRID:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          storyGrid: !state.contentSettings.storyGrid
        }
      };
    case TOGGLE_PERSONAL_CHANNELS_MODEL:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          showPersonalChannelModal: !state.contentSettings.showPersonalChannelModal
        }
      };
    case SET_LAST_CONTENT_ROUTE:
      return {
        ...state,
        contentSettings: { ...state.contentSettings,
          lastRoute: action.path
        }
      };

    /** Archive */
    case SET_ARCHIVE_TABS_SORTBY:
      return {
        ...state,
        archiveSettings: { ...state.archiveSettings,
          tabsSortBy: action.value
        }
      };
    case SET_ARCHIVE_CHANNELS_SORTBY:
      return {
        ...state,
        archiveSettings: { ...state.archiveSettings,
          channelsSortBy: action.value
        }
      };
    case SET_ARCHIVE_STORIES_SORTBY:
      return {
        ...state,
        archiveSettings: { ...state.archiveSettings,
          storiesSortBy: action.value
        }
      };
    case TOGGLE_ARCHIVE_SHOW_HIDDEN_CHANNELS:
      return {
        ...state,
        archiveSettings: { ...state.archiveSettings,
          showHiddenChannels: !state.archiveSettings.showHiddenChannels
        }
      };
    case TOGGLE_ARCHIVE_STORY_GRID:
      return {
        ...state,
        archiveSettings: { ...state.archiveSettings,
          storyGrid: !state.archiveSettings.storyGrid
        }
      };
    case SET_LAST_ARCHIVE_ROUTE:
      return {
        ...state,
        archiveSettings: { ...state.archiveSettings,
          lastRoute: action.path
        }
      };

    /** Block Search */
    case SET_LAST_BLOCKSEARCH_ROUTE:
      return {
        ...state,
        blocksearchSettings: { ...state.blocksearchSettings,
          lastRoute: action.path
        }
      };

    /** Forms */
    case SET_LAST_FORMS_ROUTE:
      return {
        ...state,
        formsSettings: { ...state.formsSettings,
          lastRoute: action.path
        }
      };

    /** Admin */
    case SET_LAST_ADMIN_ROUTE:
      return {
        ...state,
        adminSettings: { ...state.adminSettings,
          lastRoute: action.path
        }
      };

    /** Me */
    case SET_ME_NOTES_SORTBY:
      return {
        ...state,
        meSettings: { ...state.meSettings,
          notesSortBy: action.value
        }
      };

    /** Story */
    case SET_STORY_OPTION:
      return {
        ...state,
        storySettings: { ...state.storySettings,
          [action.name]: action.value
        }
      };
    case SET_DEFAULT_CHANNEL:
      return {
        ...state,
        storyDefaults: { ...state.storyDefaults,
          channels: action.data
        }
      };
    case CLEAR_DEFAULT_CHANNEL:
      return {
        ...state,
        storyDefaults: { ...state.storyDefaults,
          channels: null
        }
      };
    case SET_FILES_GENERAL_SUCCESS:
      return {
        ...state,
        fileSettings: {
          ...state.fileSettings,
          fileGeneralSettings: {
            ...state.fileSettings.fileGeneralSettings,
            ...action.result
          }
        }
      };
    case SET_FILES_DEFAULTS_SUCCESS:
      return {
        ...state,
        fileSettings: {
          ...state.fileSettings,
          fileDefaultSettings: {
            ...state.fileSettings.fileDefaultSettings,
            ...action.result
          }
        }
      };

    /** Feedback */
    case SET_BETA_USER:
      return {
        ...state,
        userSettings: { ...state.userSettings,
          betaUser: action.value
        }
      };
    case SET_CONTACT_USER:
      return {
        ...state,
        userSettings: { ...state.userSettings,
          contactUser: action.value
        }
      };

    /** Onboarding */
    case CONFIRM_WELCOME:
      return {
        ...state,
        welcomeScreens: {}
      };

    case GET_USER_METADATA:
      return {
        ...state,
        userMetadataLoaded: false,
        userMetadataLoading: true,
        userMetadataError: '',
      };
    case GET_USER_METADATA_SUCCESS: {
      const normalized = normalize(action.result, arrayOf(metadataValue));

      return {
        ...state,
        metadataAttributesById: merge({}, state.metadataAttributesById, normalized.entities.metadataAttributes),
        metadataValuesById: merge({}, state.metadataValuesById, normalized.entities.metadataValues),
        metadataValues: [
          ...state.metadataValues,
          ...normalized.result,
        ],
        userMetadataLoaded: true,
        userMetadataLoading: false,
      };
    }
    case GET_USER_METADATA_FAIL:
      return {
        ...state,
        userMetadataLoaded: true,
        userMetadataLoading: false,
        userMetadataError: action.error
      };

    case SET_USER_METADATA:
      return {
        ...state,
        metadataValuesById: {
          ...state.metadataValuesById,
          [action.params.item.id]: {
            ...state.metadataValuesById[action.params.item.id],
            checked: action.params.toggle
          }
        }
      };

    case RESET_USER_METADATA: {
      const newMetadataValuesById = {};
      for (const [index, item] of Object.entries(state.metadataValuesById)) {  // eslint-disable-line
        item.checked = false;
        newMetadataValuesById[index] = item;
      }

      return {
        ...state,
        metadataValuesById: newMetadataValuesById
      };
    }

    case SET_ATTRIBUTE: {
      const data = {};
      if (action.params.parent) {
        data[action.params.parent] = { ...state[action.params.parent] };
        data[action.params.parent][action.params.attribute] = action.params.value;
      } else if (action.params.attribute) {
        data[action.params.attribute] = action.params.value;
      }

      return {
        ...state,
        ...data,
      };
    }

    case SET_CUSTOMIZATION_SUCCESS: {
      let themeUpdate = {};
      if (Object.prototype.hasOwnProperty.call(action.result, 'tintColour')) {
        themeUpdate = {
          darkBaseColor: action.result.darkTintColour,
          lightBaseColor: action.result.lightTintColour,
          baseColor: action.result.tintColour
        };
      }
      return {
        ...state,
        theme: {
          ...state.theme,
          ...themeUpdate
        }
      };
    }
    case UPDATE_SECURITY_SUCCESS: {
      const data = {};
      if (action.params.key === 'hideShareCcField') data.sharing = { hideShareCcField: !!action.params.value };

      return {
        ...state,
        ...data,
      };
    }

    case SET_USER_DEFAULTS_SUCCESS: {
      const tmpData = { ...action.params };
      const nPlatform = {};

      Object.keys(tmpData).map((tmpAttribute) => {
        switch (tmpAttribute) {
          case 'platform':
            // Parse platform data
            Object.keys(tmpData.platform.value).map((platformObj) => {
              const tmpObj = tmpData.platform.value[platformObj] || {};
              if (typeof (tmpObj.enabled) === 'undefined') {
                nPlatform[platformObj] = { enabled: tmpData.platform.value[platformObj] ? 1 : 0 }; // eslint-disable-line
              } else {
                nPlatform[platformObj] = { enabled: tmpData.platform.value[platformObj].enabled }; // eslint-disable-line
              }
              return platformObj;
            });
            tmpData.platforms = nPlatform;
            delete tmpData.platform;
            break;
          case 'tz':
            tmpData.timezone = tmpData.tz.value;
            delete tmpData.tz;
            break;
          case 'langCode':
            tmpData.language = tmpData.langCode.value;
            delete tmpData.langCode;
            break;
          default:
            tmpData[tmpAttribute] = tmpData[tmpAttribute].value;
            break;
        }
        return tmpAttribute;
      });

      return {
        ...state,
        userDefaults: {
          ...state.userDefaults,
          ...tmpData
        }
      };
    }

    case GET_CRM_SETTING_SUCCESS:
      return {
        ...state,
        crm: {
          ...state.crm,
          appId: action.result.cloud_app_id,
          authenticated: action.result.is_authenticated,
          contactFilter: +action.result.contact_filter === 1,
          crmAccountId: action.result.crm_id,
          override: action.result.override === 1,
          serviceDescription: action.params.crmDescription,
          source: action.params.crmSource,
          sandbox: action.result.enable_sandbox
        }
      };
    case GET_REPORTS_SUCCESS:
      return {
        ...state,
        reports: action.result,
      };

    case DELETE_REPORTS_SUCCESS:
      return {
        ...state,
        reports: state.reports.map(item => {
          if (item.name === 'custom' && item.type !== 'Create') {
            return {
              ...item,
              options: item.options.filter(
                option => {
                  const optionSide = option.reportLocation || option.dashboardLocation || -1;
                  const deleteItem = action.resourceLocation || -2;
                  return optionSide !== deleteItem;
                }
              ),
            };
          }
          return item;
        })
      };
    default:
      return state;
  }
}

/* Action Creators */

/**
 * Load App Settings (GET)
 * Use if location isn't available before signin.
 */
export function load() {
  return {
    types: [LOAD_SETTINGS, LOAD_SETTINGS_SUCCESS, LOAD_SETTINGS_FAIL],
    promise: (client) => client.get('/settings', 'webapi')
  };
}

/**
 * Load App Settings and save geolocation (POST)
 * Used if location is available before signin.
 * location: {"lat":"-33.871689","lng":"151.205606"}
 */
export function loadAndSaveLocation(location) {
  return {
    types: [LOAD_SETTINGS, LOAD_SETTINGS_SUCCESS, LOAD_SETTINGS_FAIL],
    promise: (client) => client.post('/settings', 'webapi', {
      data: {
        location: JSON.stringify({
          lat: location.latitude,
          lng: location.longitude
        })
      }
    })
  };
}

/**
 * Sets location data
 */
export function setLocation(location) {
  return {
    type: SET_LOCATION,
    location: location
  };
}

/**
 * Saves location data with API call
 */
export function saveLocationToServer(location) {
  return {
    types: [SET_LOCATION, null, null],
    location: location,
    promise: (client) => client.post('/set_geolocation', 'webapi', {
      data: {
        location: JSON.stringify({
          lat: location.latitude,
          lng: location.longitude,
          address: location.address,
        })
      }
    })
  };
}

/**
 * Get the address data from google api
 */
export function saveLocation(location, isChina = false) {
  const host = isChina ? 'http://maps.google.cn' : 'https://maps.googleapis.com';

  return (dispatch) => {
    superagent
      .get(`${host}/maps/api/geocode/json?latlng=${location.latitude}, ${location.longitude}&sensor=false`)
      .end((err, res) => {
        const locationWidthAddress = {
          latitude: location.latitude,
          longitude: location.longitude,
          address: !err && res.body.status === 'OK' && res.body.results[0].formatted_address,
          loaded: true,
        };
        dispatch(saveLocationToServer(locationWidthAddress));
      });
  };
}

/**
 * Set authString used for secure storage
 */
export function setAuthString(string) {
  return {
    type: SET_AUTH_STRING,
    data: string
  };
}

/**
 * Save notifications as read
 */
export function saveNotificationsRead(ids = []) {
  if (!ids.length) {
    return {
      type: SET_NOTIFICATIONS_READ
    };
  }

  return {
    types: [SET_NOTIFICATIONS_READ, null, null],
    promise: (client) => client.post('/activity/setNotifications', 'webapi', {
      data: {
        ids: JSON.stringify(ids)
      }
    })
  };
}

/**
 * Story Settings
 */

/**
 * Set Story options by name
 */
export function setStoryOption(name, value) {
  return {
    types: [SET_STORY_OPTION, null, null],
    name,
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'story',
        option: name,
        value: value
      }
    })
  };
}

/**
 * Save default Story Channel
 * TODO: rename saveDefaultChannel
 *
 * TODO: v5 API /settings/set_story_default
 * pass story prop in same format used for /story/save
 * channels: [1337, 1338]
 */
export function setDefaultChannel(data) {
  return {
    types: [SET_DEFAULT_CHANNEL, null, null],
    data,
    promise: (client) => client.post('/user/set_default_channel', 'webapi4', {
      data: {
        channel_id: data.id
      }
    })
  };
}

/**
 * Save default Channel to empty
 * TODO: v5 API
 */
export function clearDefaultChannel() {
  return {
    types: [CLEAR_DEFAULT_CHANNEL, null, null],
    promise: (client) => client.post('/user/set_default_channel', 'webapi4', {
      data: {
        channel_id: 0
      }
    })
  };
}

/**
 * Content Settings
 */

/**
 * Set Content Tabs sortBy value
 */
export function setContentTabsSortBy(value) {
  return {
    types: [SET_CONTENT_TABS_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'tabsSortBy',
        value: value
      }
    })
  };
}

/**
 * Set Content Channels sortBy value
 */
export function setContentChannelsSortBy(value) {
  return {
    types: [SET_CONTENT_CHANNELS_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'channelsSortBy',
        value: value
      }
    })
  };
}

/**
 * Set Content Stories sortBy value
 */
export function setContentStoriesSortBy(value) {
  return {
    types: [SET_CONTENT_STORIES_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'storiesSortBy',
        value: value
      }
    })
  };
}

/**
 * Set Content Show Hidden Channels
 */
export function toggleContentShowHiddenChannels(value) {
  return {
    types: [TOGGLE_CONTENT_SHOW_HIDDEN_CHANNELS, null, null],
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'showHiddenChannels',
        value: value
      }
    })
  };
}

/**
 * Set Content Show Hidden Channels
 */
export function toggleShowPersonalChannelModel(value) {
  return {
    types: [TOGGLE_PERSONAL_CHANNELS_MODEL, null, null],
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'showHiddenChannels',
        value: value
      }
    })
  };
}

/**
 * Set Content Story Grid true/false
 */
export function toggleContentStoryGrid(value) {
  return {
    types: [TOGGLE_CONTENT_STORY_GRID, null, null],
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'storyGrid',
        value: value
      }
    })
  };
}

/**
 * Set last /content route
 */
export function setLastContentRoute(path = '/content') {
  return {
    types: [SET_LAST_CONTENT_ROUTE, null, null],
    path: path,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'content',
        option: 'lastRoute',
        value: path
      }
    })
  };
}

/**
 * Archive Settings
 */

/**
 * Set Content Tabs sortBy value
 */
export function setArchiveTabsSortBy(value) {
  return {
    types: [SET_ARCHIVE_TABS_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'archive',
        option: 'tabsSortBy',
        value: value
      }
    })
  };
}

/**
 * Set Archive Channels sortBy value
 */
export function setArchiveChannelsSortBy(value) {
  return {
    types: [SET_ARCHIVE_CHANNELS_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'archive',
        option: 'channelsSortBy',
        value: value
      }
    })
  };
}

/**
 * Set Archive Stories sortBy value
 */
export function setArchiveStoriesSortBy(value) {
  return {
    types: [SET_ARCHIVE_STORIES_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'archive',
        option: 'storiesSortBy',
        value: value
      }
    })
  };
}

/**
 * Set Archive Show Hidden Channels
 */
export function toggleArchiveShowHiddenChannels(value) {
  return {
    types: [TOGGLE_ARCHIVE_SHOW_HIDDEN_CHANNELS, null, null],
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'archive',
        option: 'showHiddenChannels',
        value: value
      }
    })
  };
}

/**
 * Set Archive Story Grid true/false
 */
export function toggleArchiveStoryGrid(value) {
  return {
    types: [TOGGLE_ARCHIVE_STORY_GRID, null, null],
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'archive',
        option: 'storyGrid',
        value: value
      }
    })
  };
}

/**
 * Set last /blocksearch route
 */
export function setLastBlocksearchRoute(path = '/blocksearch') {
  return {
    type: SET_LAST_BLOCKSEARCH_ROUTE,
    path: path,
  };
}

/**
 * Set last /archive route
 */
export function setLastArchiveRoute(path = '/archive') {
  return {
    types: [SET_LAST_ARCHIVE_ROUTE, null, null],
    path: path,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'archive',
        option: 'lastRoute',
        value: path
      }
    })
  };
}

/**
 * Forms Settings
 */

// Set last /forms route
export function setLastFormsRoute(path = '/forms') {
  return {
    types: [SET_LAST_FORMS_ROUTE, null, null],
    path: path,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'forms',
        option: 'lastRoute',
        value: path
      }
    })
  };
}

/**
 * Admin Settings
 */

// Set last /admin route
export function setLastAdminRoute(path = '/admin') {
  return {
    types: [SET_LAST_ADMIN_ROUTE, null, null],
    path: path,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'admin',
        option: 'lastRoute',
        value: path
      }
    })
  };
}

/**
 * Me Settings
 */

/**
 * Set Me > Notes sortBy value
 */
export function setMeNotesSortBy(value) {
  return {
    types: [SET_ME_NOTES_SORTBY, null, null],
    value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'me',
        option: 'notesSortBy',
        value: value
      }
    })
  };
}

/**
 * Set beta access to User (Feedback form)
 */
export function setBetaUser(value) {
  return {
    types: [SET_BETA_USER, null, null],
    value: value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'user',
        option: 'betaUser',
        value: value
      }
    })
  };
}

/**
 * Set contactable to User (Feedback form)
 */
export function setContactUser(value) {
  return {
    types: [SET_CONTACT_USER, null, null],
    value: value,
    promise: (client) => client.post('/settings/set', 'webapi', {
      data: {
        type: 'user',
        option: 'contactUser',
        value: value
      }
    })
  };
}

/**
 * Post data to the feedback API
 */
export function sendFeedback(data) {
  return {
    types: [null, null, null],
    promise: (client) => client.post('/feedback', 'webapi', {
      data: {
        data
      }
    })
  };
}

/**
 * User has completed the Custom Welcome screens onboard experience
 */
export function confirmWelcome(data) {
  return {
    types: [CONFIRM_WELCOME, null, null],
    promise: (client) => client.post('/user/profileCompletion ', 'webapi', {
      data: {
        data
      }
    })
  };
}

/**
 * Get general user settings data
 */
export function getUserGeneralSettings(key, value) {
  const data = {};
  data[key] = value;

  return {
    types: [GET_USER_GENERAL_SETTINGS, GET_USER_GENERAL_SETTINGS_SUCCESS, GET_USER_GENERAL_SETTINGS_FAIL],
    key,
    value,
    promise: (client) => client.get('/usersettings/getGeneralSettings', 'webapi', {
      data: data
    })
  };
}

/**
 * Set User General settings data by key name
 */
export function setUserData(key, value) {
  const data = {};
  data[key] = value;
  if (key === 'privateActivity') data[key] = +value;

  return {
    types: [SET_USER_DATA, SET_USER_DATA_SUCCESS, SET_USER_DATA_FAIL],
    key,
    value,
    promise: (client) => client.post('/usersettings/setGeneralSettings', 'webapi', {
      data: data
    })
  };
}

/**
 * Change user password
 */
export function updatePassword(currentPassword, newPassword, confirmPassword) {
  return {
    types: [SET_USER_PASSWORD, SET_USER_PASSWORD_SUCCESS, SET_USER_PASSWORD_FAIL],
    currentPassword,
    newPassword,
    confirmPassword,
    promise: (client) => client.post('/usersettings/changePassword', 'webapi', {
      data: {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }
    })
  };
}

/**
 * Disconnect devices by ID
 */
export function disconnectDevice(id) {
  return {
    types: [DISCONNECT_DEVICE, DISCONNECT_DEVICE_SUCCESS, DISCONNECT_DEVICE_FAIL],
    id,
    promise: (client) => client.post('/usersettings/logoutDevice', 'webapi', {
      data: { id: id }
    })
  };
}

/**
 * Get user metadata attributes and values data
 */
export function getUserMetadata(search, limit, offset) {
  const data = {};
  if (search) data.search = search;
  if (limit) data.limit = limit;
  if (offset) data.limit = offset;

  return {
    types: [GET_USER_METADATA, GET_USER_METADATA_SUCCESS, GET_USER_METADATA_FAIL],
    promise: (client) => client.get('/user/metadataValues', 'webapi', {
      data: data
    })
  };
}

export function toggleUserMetadata(item, toggle) {
  return {
    params: { item: item, toggle: toggle },
    type: SET_USER_METADATA,
  };
}

export function resetNewUserMetadata() {
  return {
    type: RESET_USER_METADATA,
  };
}

export function setAttribute(attribute, value, parent) {
  return {
    params: { attribute: attribute, value: value, parent: parent },
    type: SET_ATTRIBUTE,
  };
}

/**
 * for new Report, would remove later.
 */
export function getReports() {
  return {
    types: [GET_REPORTS, GET_REPORTS_SUCCESS, GET_REPORTS_FAIL],
    promise: (client) => client.get('/reporting/get', 'webapi')
  };
}

export function deleteReports(data) {
  return {
    types: [DELETE_REPORTS, DELETE_REPORTS_SUCCESS, DELETE_REPORTS_FAIL],
    ...data,
    promise: (client) => client.post('/reporting/delete', 'webapi', {
      data: data
    })
  };
}
