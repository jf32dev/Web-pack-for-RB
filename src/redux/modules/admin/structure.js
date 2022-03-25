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

import merge from 'lodash/merge';
import union from 'lodash/union';
import { normalize, Schema, arrayOf } from 'normalizr';

export const LOAD_USER_DEFAULTS = 'admin/structure/LOAD_USER_DEFAULTS';
export const LOAD_USER_DEFAULTS_SUCCESS = 'admin/structure/LOAD_USER_DEFAULTS_SUCCESS';
export const LOAD_USER_DEFAULTS_FAIL = 'admin/structure/LOAD_USER_DEFAULTS_FAIL';

export const SET_USER_DEFAULTS = 'admin/structure/SET_USER_DEFAULTS';
export const SET_USER_DEFAULTS_SUCCESS = 'admin/structure/SET_USER_DEFAULTS_SUCCESS';
export const SET_USER_DEFAULTS_FAIL = 'admin/structure/SET_USER_DEFAULTS_FAIL';

export const LOAD_USER_DEFAULT_NOTIFICATIONS = 'admin/structure/LOAD_USER_DEFAULT_NOTIFICATIONS';
export const LOAD_USER_DEFAULT_NOTIFICATIONS_SUCCESS = 'admin/structure/LOAD_USER_DEFAULT_NOTIFICATIONS_SUCCESS';
export const LOAD_USER_DEFAULT_NOTIFICATIONS_FAIL = 'admin/structure/LOAD_USER_DEFAULT_NOTIFICATIONS_FAIL';

export const SET_USER_DEFAULT_NOTIFICATIONS = 'admin/structure/SET_USER_DEFAULT_NOTIFICATIONS';
export const SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS = 'admin/structure/SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS';
export const SET_USER_DEFAULT_NOTIFICATIONS_FAIL = 'admin/structure/SET_USER_DEFAULT_NOTIFICATIONS_FAIL';

export const LOAD_GROUPS_IA = 'admin/structure/LOAD_GROUPS_IA';
export const LOAD_GROUPS_IA_SUCCESS = 'admin/structure/LOAD_GROUPS_IA_SUCCESS';
export const LOAD_GROUPS_IA_FAIL = 'admin/structure/LOAD_GROUPS_IA_FAIL';

export const LOAD_INTEREST_AREAS_GRAPH = 'admin/structure/LOAD_INTEREST_AREAS_GRAPH';
export const LOAD_INTEREST_AREAS_GRAPH_SUCCESS = 'admin/structure/LOAD_INTEREST_AREAS_GRAPH_SUCCESS';
export const LOAD_INTEREST_AREAS_GRAPH_FAIL = 'admin/structure/LOAD_INTEREST_AREAS_GRAPH_FAIL';

export const LOAD_INTEREST_AREAS = 'admin/structure/LOAD_INTEREST_AREAS';
export const LOAD_INTEREST_AREAS_SUCCESS = 'admin/structure/LOAD_INTEREST_AREAS_SUCCESS';
export const LOAD_INTEREST_AREAS_FAIL = 'admin/structure/LOAD_INTEREST_AREAS_FAIL';

export const SET_INTEREST_AREA_LINK = 'admin/structure/SET_INTEREST_AREA_LINK';
export const SET_INTEREST_AREA_LINK_SUCCESS = 'admin/structure/SET_INTEREST_AREA_LINK_SUCCESS';
export const SET_INTEREST_AREA_LINK_FAIL = 'admin/structure/SET_INTEREST_AREA_LINK_FAIL';

export const REMOVE_INTEREST_AREA_LINK = 'admin/structure/REMOVE_INTEREST_AREA_LINK';
export const REMOVE_INTEREST_AREA_LINK_SUCCESS = 'admin/structure/REMOVE_INTEREST_AREA_LINK_SUCCESS';
export const REMOVE_INTEREST_AREA_LINK_FAIL = 'admin/structure/REMOVE_INTEREST_AREA_LINK_FAIL';

export const LOAD_WEBSITES = 'admin/structure/LOAD_WEBSITES';
export const LOAD_WEBSITES_SUCCESS = 'admin/structure/LOAD_WEBSITES_SUCCESS';
export const LOAD_WEBSITES_FAIL = 'admin/structure/LOAD_WEBSITES_FAIL';

export const LOAD_WEBSITE_GROUPS = 'admin/structure/LOAD_WEBSITE_GROUPS';
export const LOAD_WEBSITE_GROUPS_SUCCESS = 'admin/structure/LOAD_WEBSITE_GROUPS_SUCCESS';
export const LOAD_WEBSITE_GROUPS_FAIL = 'admin/structure/LOAD_WEBSITE_GROUPS_FAIL';

export const LOAD_GROUPS_BY_WEBSITE_GRAPH = 'admin/structure/LOAD_GROUPS_BY_WEBSITE_GRAPH';
export const LOAD_GROUPS_BY_WEBSITE_GRAPH_SUCCESS = 'admin/structure/LOAD_GROUPS_BY_WEBSITE_GRAPH_SUCCESS';
export const LOAD_GROUPS_BY_WEBSITE_GRAPH_FAIL = 'admin/structure/LOAD_GROUPS_BY_WEBSITE_GRAPH_FAIL';

export const LOAD_TABS = 'admin/structure/LOAD_TABS';
export const LOAD_TABS_SUCCESS = 'admin/structure/LOAD_TABS_SUCCESS';
export const LOAD_TABS_FAIL = 'admin/structure/LOAD_TABS_FAIL';

export const LOAD_CHANNELS = 'admin/structure/LOAD_CHANNELS';
export const LOAD_CHANNELS_SUCCESS = 'admin/structure/LOAD_CHANNELS_SUCCESS';
export const LOAD_CHANNELS_FAIL = 'admin/structure/LOAD_CHANNELS_FAIL';

export const LOAD_GROUPS = 'admin/structure/LOAD_GROUPS';
export const LOAD_GROUPS_SUCCESS = 'admin/structure/LOAD_GROUPS_SUCCESS';
export const LOAD_GROUPS_FAIL = 'admin/structure/LOAD_GROUPS_FAIL';

export const LOAD_USERS = 'admin/structure/LOAD_USERS';
export const LOAD_USERS_SUCCESS = 'admin/structure/LOAD_USERS_SUCCESS';
export const LOAD_USERS_FAIL = 'admin/structure/LOAD_USERS_FAIL';

export const GET_USER_TOTAL = 'admin/structure/GET_USER_TOTAL';
export const GET_USER_TOTAL_SUCCESS = 'admin/structure/GET_USER_TOTAL_SUCCESS';
export const GET_USER_TOTAL_FAIL = 'admin/structure/GET_USER_TOTAL_FAIL';

export const SEND_USER_INVITATION = 'admin/structure/SEND_USER_INVITATION';
export const SEND_USER_INVITATION_SUCCESS = 'admin/structure/SEND_USER_INVITATION_SUCCESS';
export const SEND_USER_INVITATION_FAIL = 'admin/structure/SEND_USER_INVITATION_FAIL';

export const LOAD_ALL_GROUPS = 'admin/structure/LOAD_ALL_GROUPS';
export const LOAD_ALL_GROUPS_SUCCESS = 'admin/structure/LOAD_ALL_GROUPS_SUCCESS';
export const LOAD_ALL_GROUPS_FAIL = 'admin/structure/LOAD_ALL_GROUPS_FAIL';

export const LOAD_ALL_GROUPS_LIST = 'admin/structure/LOAD_ALL_GROUPS_LIST';
export const LOAD_ALL_GROUPS_LIST_SUCCESS = 'admin/structure/LOAD_ALL_GROUPS_LIST_SUCCESS';
export const LOAD_ALL_GROUPS_LIST_FAIL = 'admin/structure/LOAD_ALL_GROUPS_LIST_FAIL';

export const LOAD_GRAPH = 'admin/structure/LOAD_GRAPH';
export const LOAD_GRAPH_SUCCESS = 'admin/structure/LOAD_GRAPH_SUCCESS';
export const LOAD_GRAPH_FAIL = 'admin/structure/LOAD_GRAPH_FAIL';

export const LOAD_BUNDLE_USERS = 'admin/structure/LOAD_BUNDLE_USERS';
export const LOAD_BUNDLE_USERS_SUCCESS = 'admin/structure/LOAD_BUNDLE_USERS_SUCCESS';
export const LOAD_BUNDLE_USERS_FAIL = 'admin/structure/LOAD_BUNDLE_USERS_FAIL';

export const LOAD_METADATA = 'admin/structure/LOAD_METADATA';
export const LOAD_METADATA_SUCCESS = 'admin/structure/LOAD_METADATA_SUCCESS';
export const LOAD_METADATA_FAIL = 'admin/structure/LOAD_METADATA_FAIL';

export const SAVE_TAB = 'admin/structure/SAVE_TAB';
export const SAVE_TAB_SUCCESS = 'admin/structure/SAVE_TAB_SUCCESS';
export const SAVE_TAB_FAIL = 'admin/structure/SAVE_TAB_FAIL';

export const SAVE_CHANNEL = 'admin/structure/SAVE_CHANNEL';
export const SAVE_CHANNEL_SUCCESS = 'admin/structure/SAVE_CHANNEL_SUCCESS';
export const SAVE_CHANNEL_FAIL = 'admin/structure/SAVE_CHANNEL_FAIL';

export const SAVE_GROUP = 'admin/structure/SAVE_GROUP';
export const SAVE_GROUP_SUCCESS = 'admin/structure/SAVE_GROUP_SUCCESS';
export const SAVE_GROUP_FAIL = 'admin/structure/SAVE_GROUP_FAIL';

export const SAVE_USER = 'admin/structure/SAVE_USER';
export const SAVE_USER_SUCCESS = 'admin/structure/SAVE_USER_SUCCESS';
export const SAVE_USER_FAIL = 'admin/structure/SAVE_USER_FAIL';

export const DELETE_TAB = 'admin/structure/DELETE_TAB';
export const DELETE_TAB_SUCCESS = 'admin/structure/DELETE_TAB_SUCCESS';
export const DELETE_TAB_FAIL = 'admin/structure/DELETE_TAB_FAIL';

export const DELETE_CHANNEL = 'admin/structure/DELETE_CHANNEL';
export const DELETE_CHANNEL_SUCCESS = 'admin/structure/DELETE_CHANNEL_SUCCESS';
export const DELETE_CHANNEL_FAIL = 'admin/structure/DELETE_CHANNEL_FAIL';

export const DELETE_GROUP = 'admin/structure/DELETE_GROUP';
export const DELETE_GROUP_SUCCESS = 'admin/structure/DELETE_GROUP_SUCCESS';
export const DELETE_GROUP_FAIL = 'admin/structure/DELETE_GROUP_FAIL';

export const DELETE_USER = 'admin/structure/DELETE_USER';
export const DELETE_USER_SUCCESS = 'admin/structure/DELETE_USER_SUCCESS';
export const DELETE_USER_FAIL = 'admin/structure/DELETE_USER_FAIL';

export const SET_RELATIONSHIP = 'admin/structure/SET_RELATIONSHIP';
export const SET_RELATIONSHIP_SUCCESS = 'admin/structure/SET_RELATIONSHIP_SUCCESS';
export const SET_RELATIONSHIP_FAIL = 'admin/structure/SET_RELATIONSHIP_FAIL';

export const GET_CONFIGURATION_BUNDLE = 'admin/structure/GET_CONFIGURATION_BUNDLE';
export const GET_CONFIGURATION_BUNDLE_SUCCESS = 'admin/structure/GET_CONFIGURATION_BUNDLE_SUCCESS';
export const GET_CONFIGURATION_BUNDLE_FAIL = 'admin/structure/GET_CONFIGURATION_BUNDLE_FAIL';

export const SET_CONFIGURATION_BUNDLE = 'admin/structure/SET_CONFIGURATION_BUNDLE';
export const SET_CONFIGURATION_BUNDLE_SUCCESS = 'admin/structure/SET_CONFIGURATION_BUNDLE_SUCCESS';
export const SET_CONFIGURATION_BUNDLE_FAIL = 'admin/structure/SET_CONFIGURATION_BUNDLE_FAIL';

export const LOAD_CONFIGURATION_BUNDLES = 'admin/structure/LOAD_CONFIGURATION_BUNDLES';
export const LOAD_CONFIGURATION_BUNDLES_SUCCESS = 'admin/structure/LOAD_CONFIGURATION_BUNDLES_SUCCESS';
export const LOAD_CONFIGURATION_BUNDLES_FAIL = 'admin/structure/LOAD_CONFIGURATION_BUNDLES_FAIL';

export const DELETE_CONFIGURATION_BUNDLE = 'admin/structure/DELETE_CONFIGURATION_BUNDLE';
export const DELETE_CONFIGURATION_BUNDLE_SUCCESS = 'admin/structure/DELETE_CONFIGURATION_BUNDLE_SUCCESS';
export const DELETE_CONFIGURATION_BUNDLE_FAIL = 'admin/structure/DELETE_CONFIGURATION_BUNDLE_FAIL';

export const CSV_FILE_VALIDATE = 'admin/structure/CSV_FILE_VALIDATE';
export const CSV_FILE_VALIDATE_SUCCESS = 'admin/structure/CSV_FILE_VALIDATE_SUCCESS';
export const CSV_FILE_VALIDATE_FAIL = 'admin/structure/CSV_FILE_VALIDATE_FAIL';

export const CSV_USER_CREATE = 'admin/structure/CSV_USER_CREATE';
export const CSV_USER_CREATE_SUCCESS = 'admin/structure/CSV_USER_CREATE_SUCCESS';
export const CSV_USER_CREATE_FAIL = 'admin/structure/CSV_USER_CREATE_FAIL';

export const CSV_USER_DELETE = 'admin/structure/CSV_USER_DELETE';
export const CSV_USER_DELETE_SUCCESS = 'admin/structure/CSV_USER_DELETE_SUCCESS';
export const CSV_USER_DELETE_FAIL = 'admin/structure/CSV_USER_DELETE_FAIL';

export const GET_BULK_IMPORT_STATUS = 'admin/structure/GET_BULK_IMPORT_STATUS';
export const GET_BULK_IMPORT_STATUS_SUCCESS = 'admin/structure/GET_BULK_IMPORT_STATUS_SUCCESS';
export const GET_BULK_IMPORT_STATUS_FAIL = 'admin/structure/GET_BULK_IMPORT_STATUS_FAIL';

export const RESET_USER_DEFAULTS = 'structure/RESET_USER_DEFAULTS';
export const SET_DATA = 'structure/SET_DATA';

/**
 * Initial State
 */
export const globalFetchLimit = 100;

export const initialState = {
  userDefaultSettings: {},
  userDefaultSettingsLoading: false,
  userDefaultSettingsLoaded: false,

  userDefaultNotificationsLoading: false,
  userDefaultNotificationsLoaded: false,

  // Interest Areas Groups
  groupsIA: [],
  groupsIASelected: {},
  groupsIAError: '',
  groupsIAFilter: '',
  groupsIALoading: false,

  interestAreasByGroup: [],
  interestAreasByGroupSelected: {},
  interestAreasByGroupLoading: false,
  interestAreasByGroupComplete: false,
  interestAreasByGroupError: '',
  interestAreasByGroupFilter: '',

  interestAreasSearchByGroupKeyword: '',
  interestAreasSearchByGroup: [],
  interestAreasSearchByGroupComplete: false,
  interestAreasSearchByGroupLoading: false,

  // Websites
  websites: [],
  websiteSelected: {},
  websitesLoading: false,
  websitesComplete: false,
  websitesError: '',
  websitesFilter: '',

  groupsByWebsite: [],
  groupsByWebsiteSelected: {},
  groupsByWebsiteError: '',
  groupsByWebsiteFilter: '',
  groupsByWebsiteLoading: false,

  groupsByWebsiteSearchKeyword: '',
  groupsSearchByWebsite: [],
  groupsSearchByWebsiteComplete: false,
  groupsSearchByWebsiteLoading: false,

  // Structure
  tabs: [],
  tabSelected: {},
  tabsLoading: false,
  tabsComplete: false,
  tabsError: '',
  tabFilter: '',

  channelsByTab: [],
  channelSelected: {},
  channelsLoading: false,
  channelsComplete: false,
  channelsError: '',
  channelFilter: '',

  channelSearch: '',
  channelSearchListByTab: [],
  channelsSearchLoading: false,
  channelsSearchComplete: false,

  groupsByTabChannel: [],
  groupSelected: {},
  groupsLoading: false,
  groupsComplete: false,
  groupsError: '',
  groupFilter: '',

  groupSearch: '',
  groupsSearchByTabChannel: [],
  groupSearchLoading: false,
  groupSearchComplete: false,

  allGroupsLoading: false,
  allGroupsLoaded: false,
  allGroupsComplete: false,
  allGroupsOffset: 0,
  allGroupSearch: '',
  allGroups: [],

  // Second instance allGroups
  allGroupsList: [],
  allGroupsListOffset: 0,
  allGroupsListLoaded: false,
  allGroupsListLoading: false,
  allGroupsListComplete: false,
  allGroupListSearch: '',
  allGroupsListError: false,

  usersByGroup: [],
  userSelected: {},
  usersLoading: false,
  usersComplete: false,
  usersError: null,
  userFilter: '',

  allUserTotal: 0,
  invitationSent: false,
  invitationSending: false,
  resetOnboardingExperienceLoading: false,
  unlockPasswordSaved: false,

  userSearch: '',
  usersSearchByGroup: [],
  userSearchLoading: false,
  userSearchComplete: false,

  error: '',
  saved: false,
  saving: false,

  deleted: false,
  deleting: false,

  toggleChannelInfo: false,
  isChannelQuickLoading: false,
  toggleGroupInfo: false,
  isGroupQuickLoading: false,

  metadataLoading: false,
  metadataLoaded: false,
  metadataList: [],
  metadataAttributeIds: [],

  graph: {},
  graphLoading: false,
  graphLoaded: false,

  // Configuration Bundle
  confBundleLoading: false,
  confBundleLoaded: false,
  confBundleSaved: false,
  confBundle: [],
  confBundleSelected: {},
  confBundleFilter: '',
  confBundleFilterType: '',
  hasUnsavedChanges: false,

  confBundleDetails: {},
  confBundleDetailsLoading: false,
  confBundleDetailsLoaded: false,
  confBundleDetailsSaving: false,
  confBundleDetailsSaved: false,
  accordionState: {},

  usersByBundle: [],
  usersByBundleFilter: '',
  userByBundleSelected: {},
  usersByBundleLoading: false,
  usersByBundleComplete: false,
  usersByBundleError: '',
};

// Define schemes for our entities
const attribute = new Schema('attributes', { defaults: { type: 'attribute', values: [] } });
const value = new Schema('values', { defaults: { type: 'value', attribute: {} } });

// Define nesting rules
attribute.define({
  values: arrayOf(value)
});

/**
 * Reducer
 */
export default function adminStructure(state = initialState, action = {}) {
  switch (action.type) {
    /* LOAD USER DEFAULT SETTINGS */
    case LOAD_USER_DEFAULTS:
      return {
        ...state,
        userDefaultSettingsLoading: true,
        userDefaultSettingsLoaded: false,
      };
    case LOAD_USER_DEFAULTS_SUCCESS: {
      return {
        ...state,
        userDefaultSettings: action.result,
        userDefaultSettingsLoading: false,
        userDefaultSettingsLoaded: true,
      };
    }
    case LOAD_USER_DEFAULTS_FAIL:
      return {
        ...state,
        userDefaultSettingsLoading: false,
        userDefaultSettingsLoaded: false,
        error: action.error
      };

    case LOAD_USER_DEFAULT_NOTIFICATIONS:
      return {
        ...state,
        userDefaultNotificationsLoading: true,
        userDefaultNotificationsLoaded: false,
      };
    case LOAD_USER_DEFAULT_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        userDefaultNotifications: action.result,
        userDefaultNotificationsLoading: false,
        userDefaultNotificationsLoaded: true,
      };
    }
    case LOAD_USER_DEFAULT_NOTIFICATIONS_FAIL:
      return {
        ...state,
        userDefaultNotificationsLoading: false,
        userDefaultNotificationsLoaded: false,
        error: action.error
      };

    case SET_USER_DEFAULTS:
    case SET_USER_DEFAULTS_SUCCESS: {
      return {
        ...state,
        userDefaultSettingsSaved: action.type === SET_USER_DEFAULTS_SUCCESS,
        userDefaultSettingsSaving: action.type !== SET_USER_DEFAULTS_SUCCESS,
        userDefaultSettings: action.params
      };
    }
    case SET_USER_DEFAULTS_FAIL:
      return {
        ...state,
        userDefaultSettingsSaved: false,
        userDefaultSettingsSaving: false,
        error: action.error,
      };
    case SET_USER_DEFAULT_NOTIFICATIONS:
    case SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS: {
      return {
        ...state,
        userDefaultNotificationsSaved: action.type === SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS,
        userDefaultNotificationsSaving: action.type !== SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS,
        userDefaultNotifications: action.type === SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS ? action.result : action.params
      };
    }
    case SET_USER_DEFAULT_NOTIFICATIONS_FAIL:
      return {
        ...state,
        userDefaultNotificationsSaved: false,
        userDefaultNotificationsSaving: false,
        error: action.error,
      };

    case RESET_USER_DEFAULTS: {
      const userDefaultSettingsTmp = {};
      for (const [index, item] of Object.entries(state.userDefaultSettings)) {  // eslint-disable-line
        if (item && item.value) item.update = false;
        userDefaultSettingsTmp[index] = item;
      }

      return {
        ...state,
        userDefaultSettings: userDefaultSettingsTmp
      };
    }

    /* INTEREST AREAS */
    case LOAD_GROUPS_IA:
      return {
        ...state,
        groupsIALoading: true,
        groupsIAFilter: action.search
      };
    case LOAD_GROUPS_IA_SUCCESS: {
      const ids = action.result.map(t => t.id);

      // Merge interestAreas array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.groupsIA, ids) : ids;

      return {
        ...state,
        groupsIA: newOrder,
        groupsIALoading: false,
        groupsIAComplete: action.result.length < globalFetchLimit,
        groupsIAError: null,
      };
    }
    case LOAD_GROUPS_IA_FAIL:
      return {
        ...state,
        groupsIALoading: false,
        groupsIAError: action.error
      };

    case LOAD_INTEREST_AREAS: {
      const isSearchList = action.params.filter === 'unlinked';
      const interestAreasSearchByGroup = !action.params.filter && !action.params.offset ? [] : state.interestAreasSearchByGroup; // Reset search value

      return {
        ...state,
        interestAreasByGroupSelected: !isSearchList ? {} : state.interestAreasByGroupSelected, // Reset group selected
        interestAreasByGroupError: '',
        interestAreasByGroupFilter: !isSearchList ? action.params.search : state.interestAreasByGroupFilter,
        interestAreasByGroupLoading: !isSearchList ? true : state.interestAreasByGroupLoading,

        // Search values are reset when new list is loaded
        interestAreasSearchByGroup: isSearchList ? state.interestAreasSearchByGroup : interestAreasSearchByGroup,
        interestAreasSearchByGroupComplete: isSearchList ? state.interestAreasSearchByGroupComplete : false,
        interestAreasSearchByGroupLoading: isSearchList ? true : state.interestAreasSearchByGroupLoading,
      };
    }
    case LOAD_INTEREST_AREAS_SUCCESS: {
      const groupIds = [];
      action.result.map((t) => {
        groupIds.push(t.id);
        return true;
      });

      const isSearchList = action.params.filter === 'unlinked';
      const listType = isSearchList ? 'interestAreasSearchByGroup' : 'interestAreasByGroup';

      // Merge channels array if loading more (offset > 0)
      const newOrderIds = action.params.offset ? union(state[listType][action.params.id].groupIds, groupIds) : groupIds;

      const newList = {
        ...state[listType],
        [action.params.id]: {
          ...state[listType][action.params.id],
          groupIds: newOrderIds,
        }
      };

      return {
        ...state,
        interestAreasByGroupLoading: !isSearchList ? false : state.interestAreasByGroupLoading,
        interestAreasByGroupComplete: !isSearchList ? action.result.length < globalFetchLimit : state.interestAreasByGroupComplete,
        interestAreasByGroup: !isSearchList ? newList : state.interestAreasByGroup,

        interestAreasSearchByGroupLoading: isSearchList ? false : state.interestAreasSearchByGroupLoading,
        interestAreasSearchByGroupComplete: isSearchList ? action.result.length < globalFetchLimit : state.interestAreasSearchByGroupComplete,
        interestAreasSearchByGroup: isSearchList ? newList : state.interestAreasSearchByGroup,

        groupsError: null,
      };
    }
    case LOAD_INTEREST_AREAS_FAIL:
      return {
        ...state,
        interestAreasByGroupLoading: false,
        interestAreasByGroupError: action.error
      };

    case SET_INTEREST_AREA_LINK:
      return {
        ...state,
        interestAreaSaved: false,
        interestAreaSaving: true,
        error: null,
      };
    case SET_INTEREST_AREA_LINK_SUCCESS: {
      let newSearchOrderIds = [];
      let newList = [];
      const objectList = {};

      // Add
      newSearchOrderIds = [...state.interestAreasSearchByGroup[action.params.id].groupIds];
      newSearchOrderIds = newSearchOrderIds.filter((obj) => (!action.params.interestAreas.find(item => item === obj)));
      newList = union(action.params.interestAreas, state.interestAreasByGroup[action.params.id].groupIds);

      objectList.interestAreasByGroup = {
        ...state.interestAreasByGroup,
        [action.params.id]: {
          ...state.interestAreasByGroup[action.params.id],
          groupIds: newList
        }
      };
      objectList.interestAreasSearchByGroup = {
        ...state.interestAreasSearchByGroup,
        [action.params.id]: {
          ...state.interestAreasSearchByGroup[action.params.id],
          groupIds: newSearchOrderIds
        }
      };

      return {
        ...state,
        interestAreaSaved: true,
        interestAreaSaving: false,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? false : state.isGroupQuickLoading,
        ...objectList
      };
    }
    case SET_INTEREST_AREA_LINK_FAIL:
      return {
        ...state,
        interestAreaSaved: false,
        interestAreaSaving: false,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? false : state.isGroupQuickLoading,
        error: action.error,
      };

    case REMOVE_INTEREST_AREA_LINK:
      return {
        ...state,
        interestAreaSaved: false,
        interestAreaSaving: true,
        error: null,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? true : state.isGroupQuickLoading,
      };
    case REMOVE_INTEREST_AREA_LINK_SUCCESS: {
      let newList = [];
      const objectList = {};

      // Remove relationship
      const interestAreaId = Math.abs(action.params.interestAreaId);
      newList = state.interestAreasByGroup[action.params.id].groupIds.filter((obj) => (obj !== interestAreaId));

      if (state.interestAreasByGroupSelected && state.interestAreasByGroupSelected.id === interestAreaId) {
        objectList.interestAreasByGroupSelected = {}; // Reset selected group
      }

      objectList.interestAreasByGroup = {
        ...state.interestAreasByGroup,
        [action.params.id]: {
          ...state.interestAreasByGroup[action.params.id],
          groupIds: newList
        }
      };

      return {
        ...state,
        interestAreaSaved: true,
        interestAreaSaving: false,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? false : state.isGroupQuickLoading,
        ...objectList
      };
    }
    case REMOVE_INTEREST_AREA_LINK_FAIL:
      return {
        ...state,
        interestAreaSaved: false,
        interestAreaSaving: false,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? false : state.isGroupQuickLoading,
        error: action.error,
      };

    /* WEBSITES */
    case LOAD_WEBSITES:
      return {
        ...state,
        websitesLoading: true,
        websiteFilter: action.search
      };
    case LOAD_WEBSITES_SUCCESS: {
      const ids = action.result.map(t => t.id);

      // Merge tabs array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.websites, ids) : ids;

      return {
        ...state,
        websites: newOrder,
        websitesLoading: false,
        websitesComplete: action.result.length < globalFetchLimit,
        websitesError: null,
      };
    }
    case LOAD_WEBSITES_FAIL:
      return {
        ...state,
        websitesLoading: false,
        websitesError: action.error
      };

    case LOAD_WEBSITE_GROUPS: {
      const isSearchList = action.params.filter === 'unlinked';
      const groupsSearchByWebsite = !action.params.filter && !action.params.offset ? [] : state.groupsSearchByWebsite; // Reset search value

      return {
        ...state,
        groupsByWebsiteSelected: !isSearchList ? {} : state.groupsByWebsiteSelected, // Reset group selected
        groupsByWebsiteError: '',
        groupsByWebsiteFilter: !isSearchList ? action.params.search : state.groupsByWebsiteFilter,
        groupsByWebsiteLoading: !isSearchList ? true : state.groupsByWebsiteLoading,

        // Search values are reset when new list is loaded
        groupsSearchByWebsite: isSearchList ? state.groupsSearchByWebsite : groupsSearchByWebsite,
        groupsSearchByWebsiteComplete: isSearchList ? state.groupsSearchByWebsiteComplete : false,
        groupsSearchByWebsiteLoading: isSearchList ? true : state.groupsSearchByWebsiteLoading,
      };
    }
    case LOAD_WEBSITE_GROUPS_SUCCESS: {
      const groupIds = [];
      action.result.map((t) => {
        groupIds.push(t.id);
        return true;
      });

      const isSearchList = action.params.filter === 'unlinked';
      const listType = isSearchList ? 'groupsSearchByWebsite' : 'groupsByWebsite';

      // Merge channels array if loading more (offset > 0)
      const newOrderIds = action.params.offset ? union(state[listType][action.params.id].groupIds, groupIds) : groupIds;

      const newList = {
        ...state[listType],
        [action.params.id]: {
          ...state[listType][action.params.id],
          groupIds: newOrderIds,
        }
      };

      return {
        ...state,
        groupsByWebsiteLoading: !isSearchList ? false : state.groupsByWebsiteLoading,
        groupsByWebsiteComplete: !isSearchList ? action.result.length < globalFetchLimit : state.groupsByWebsiteComplete,
        groupsByWebsite: !isSearchList ? newList : state.groupsByWebsite,

        groupsSearchByWebsiteLoading: isSearchList ? false : state.groupsSearchByWebsiteLoading,
        groupsSearchByWebsiteComplete: isSearchList ? action.result.length < globalFetchLimit : state.groupsSearchByWebsiteComplete,
        groupsSearchByWebsite: isSearchList ? newList : state.groupsSearchByWebsite,

        groupsError: null,
      };
    }
    case LOAD_WEBSITE_GROUPS_FAIL:
      return {
        ...state,
        groupsByWebsiteLoading: false,
        groupsByWebsiteError: action.error
      };

    /* Tabs */
    case LOAD_TABS:
      return {
        ...state,
        tabsLoading: true,
        tabFilter: action.search
      };
    case LOAD_TABS_SUCCESS: {
      const tabIds = action.result.map(t => t.id);

      // Merge tabs array if loading more (offset > 0)
      const newOrder = action.offset ? union(state.tabs, tabIds) : tabIds;

      return {
        ...state,
        tabs: newOrder,
        tabsLoading: false,
        tabsComplete: action.result.length < globalFetchLimit,
        tabsError: null,
      };
    }
    case LOAD_TABS_FAIL:
      return {
        ...state,
        tabsLoading: false,
        tabsError: action.error
      };

    /* Channels */
    case LOAD_CHANNELS: {
      const isSearchList = action.filter === 'unlinked';
      const channelSearch = !action.filter && !action.offset ? '' : state.channelSearch; // Reset search value

      return {
        ...state,
        groupSelected: !state.channelSelected.id && !isSearchList ? {} : state.groupSelected,
        channelsError: '',
        channelFilter: !isSearchList ? action.search : state.channelFilter,
        channelsLoading: !isSearchList ? true : state.channelsLoading,

        // Search values are reset when new list is loaded
        channelSearch: isSearchList ? action.search : channelSearch,
        channelSearchListByTab: !isSearchList && !action.offset ? [] : state.channelSearchListByTab,
        channelsSearchComplete: isSearchList ? state.channelsSearchComplete : false,
        channelsSearchLoading: isSearchList ? true : state.channelsSearchLoading,
      };
    }
    case LOAD_CHANNELS_SUCCESS: {
      //const channelsById = {};
      const channelsIds = [];
      action.result.map((t) => {
        //channelsById[t.id] = { id: t.id };
        channelsIds.push(t.id);
        return true;
      });

      const isSearchList = action.filter === 'unlinked';
      const listType = isSearchList ? 'channelSearchListByTab' : 'channelsByTab';

      // Merge channels array if offset > 0
      //const newOrder = Object.assign({}, state[listType][action.tabId].channels, channelsById);
      const newOrderIds = action.offset ? union(state[listType][action.tabId].channelsIds, channelsIds) : channelsIds;

      const newList = {
        ...state[listType],
        [action.tabId]: {
          ...state[listType][action.tabId],
          //channels: newOrder,
          channelsIds: newOrderIds,
        }
      };

      return {
        ...state,
        channelsLoading: !isSearchList ? false : state.channelsLoading,
        channelsComplete: !isSearchList ? action.result.length < globalFetchLimit : state.channelsComplete,
        channelsByTab: !isSearchList ? newList : state.channelsByTab,

        channelsSearchLoading: isSearchList ? false : state.channelsSearchLoading,
        channelsSearchComplete: isSearchList ? action.result.length < globalFetchLimit : state.channelsSearchComplete,
        channelSearchListByTab: isSearchList ? newList : state.channelSearchListByTab,

        channelsError: null,
      };
    }
    case LOAD_CHANNELS_FAIL:
      return {
        ...state,
        channelsLoading: false,
        channelsError: action.error
      };

    /* Groups */
    case LOAD_GROUPS: {
      const isSearchList = action.filter === 'unlinked';
      const groupSearch = !action.filter && !action.offset ? '' : state.groupSearch; // Reset search value

      return {
        ...state,
        userSelected: state.groupSelected.id && !isSearchList ? state.userSelected : {},
        groupsError: '',
        groupFilter: !isSearchList ? action.search : state.groupFilter,
        groupsLoading: !isSearchList ? true : state.groupsLoading,

        // Search values are reset when new list is loaded
        groupSearch: isSearchList ? action.search : groupSearch,
        groupSearchComplete: isSearchList ? state.groupSearchComplete : false,
        groupSearchLoading: isSearchList ? true : state.groupSearchLoading,
      };
    }
    case LOAD_GROUPS_SUCCESS: {
      const groupIds = [];
      action.result.map((t) => {
        groupIds.push(t.id);
        return true;
      });

      const isSearchList = action.filter === 'unlinked';
      const listType = isSearchList ? 'groupsSearchByTabChannel' : 'groupsByTabChannel';

      // Merge channels array if loading more (offset > 0)
      const newOrderIds = action.offset ? union(state[listType][action.tabId][action.channelId].groupIds, groupIds) : groupIds;

      const newList = {
        ...state[listType],
        [action.tabId]: {
          ...state[listType][action.tabId],
          [action.channelId]: {
            groupIds: newOrderIds,
          }
        }
      };

      return {
        ...state,
        groupsLoading: !isSearchList ? false : state.groupsLoading,
        groupsComplete: !isSearchList ? action.result.length < globalFetchLimit : state.groupsComplete,
        groupsByTabChannel: !isSearchList ? newList : state.groupsByTabChannel,

        groupSearchLoading: isSearchList ? false : state.groupSearchLoading,
        groupSearchComplete: isSearchList ? action.result.length < globalFetchLimit : state.groupSearchComplete,
        groupsSearchByTabChannel: isSearchList ? newList : state.groupsSearchByTabChannel,

        groupsError: null,
      };
    }

    case LOAD_GROUPS_FAIL:
      return {
        ...state,
        groupsLoading: false,
        groupsError: action.error
      };

    case LOAD_ALL_GROUPS:
    case LOAD_ALL_GROUPS_SUCCESS:
    case LOAD_ALL_GROUPS_FAIL: {
      const allGroupSearch = !action.search && !action.offset ? '' : state.allGroupSearch; // Reset search value

      const groupIds = [];
      if (action.type === LOAD_ALL_GROUPS_SUCCESS) {
        action.result.map((t) => {
          groupIds.push(t.id);
          return true;
        });
      }

      // Merge array if loading more (offset > 0)
      const newOrderIds = action.offset ? union(state.allGroups, groupIds) : groupIds;

      return {
        ...state,
        allGroups: action.type === LOAD_ALL_GROUPS_SUCCESS ? newOrderIds : state.allGroups,
        allGroupsLoaded: action.type === LOAD_ALL_GROUPS_SUCCESS,
        allGroupsComplete: action.result && action.result.length < globalFetchLimit,
        allGroupsOffset: action.offset,

        // Search values are reset when new list is loaded
        allGroupSearch: action.type === LOAD_ALL_GROUPS ? allGroupSearch : state.allGroupSearch,
        allGroupsLoading: action.type === LOAD_ALL_GROUPS,
        allGroupsError: action.type === LOAD_ALL_GROUPS_FAIL ? action.error : null,
      };
    }

    // Need a second instance to list all groups
    // TODO - re implement redux instances
    case LOAD_ALL_GROUPS_LIST:
    case LOAD_ALL_GROUPS_LIST_SUCCESS:
    case LOAD_ALL_GROUPS_LIST_FAIL: {
      const allGroupListSearch = !action.search && !action.offset ? '' : state.allGroupListSearch; // Reset search value

      const groupIds = [];
      if (action.type === LOAD_ALL_GROUPS_LIST_SUCCESS) {
        action.result.map((t) => {
          groupIds.push(t.id);
          return true;
        });
      }

      // Merge array if loading more (offset > 0)
      const newOrderIds = action.offset ? union(state.allGroupsList, groupIds) : groupIds;

      return {
        ...state,
        allGroupsList: action.type === LOAD_ALL_GROUPS_LIST_SUCCESS ? newOrderIds : state.allGroupsList,
        allGroupsListLoading: action.type === LOAD_ALL_GROUPS_LIST,
        allGroupsListLoaded: action.type === LOAD_ALL_GROUPS_LIST_SUCCESS,
        allGroupsListComplete: action.result && action.result.length < globalFetchLimit,
        allGroupsListOffset: action.offset,

        // Search values are reset when new list is loaded
        allGroupListSearch: action.type === LOAD_ALL_GROUPS_LIST ? allGroupListSearch : state.allGroupListSearch,
        allGroupsError: action.type === LOAD_ALL_GROUPS_LIST_FAIL ? action.error : null,
      };
    }

    /* Users */
    case GET_USER_TOTAL:
    case GET_USER_TOTAL_SUCCESS:
    case GET_USER_TOTAL_FAIL: {
      return {
        ...state,
        allUserTotal: action.type === GET_USER_TOTAL_SUCCESS ? action.result.total : state.allUserTotal,
        error: action.type === GET_USER_TOTAL_FAIL ? action.error : null,
      };
    }

    case SEND_USER_INVITATION:
    case SEND_USER_INVITATION_SUCCESS:
    case SEND_USER_INVITATION_FAIL: {
      return {
        ...state,
        invitationSending: action.type === SEND_USER_INVITATION,
        invitationSent: action.type === SEND_USER_INVITATION_SUCCESS,
        error: action.type === SEND_USER_INVITATION_FAIL ? action.error : null,
      };
    }

    case LOAD_USERS: {
      const isSearchList = action.filter === 'unlinked';
      const userSearch = !action.filter && !action.offset ? '' : state.userSearch; // Reset search value

      return {
        ...state,
        usersError: null,
        userFilter: !isSearchList ? action.search : state.userFilter,
        usersLoading: !isSearchList ? true : state.usersLoading,

        // Search values are reset when new list is loaded
        userSearch: isSearchList ? action.search : userSearch,
        userSearchComplete: isSearchList ? state.userSearchComplete : false,
        userSearchLoading: isSearchList ? true : state.userSearchLoading,
      };
    }
    case LOAD_USERS_SUCCESS: {
      const userIds = [];
      action.result.map((t) => {
        userIds.push(t.id);
        return true;
      });

      const isSearchList = action.filter === 'unlinked';
      const listType = isSearchList ? 'usersSearchByGroup' : 'usersByGroup';

      // Merge users array if loading more (offset > 0)
      const newOrderIds = action.offset ? union(state[listType][action.groupId].userIds, userIds) : userIds;

      const newList = {
        ...state[listType],
        [action.groupId]: {
          userIds: newOrderIds,
        }
      };

      return {
        ...state,
        usersLoading: !isSearchList ? false : state.usersLoading,
        usersComplete: !isSearchList ? action.result.length < globalFetchLimit : state.usersComplete,
        usersByGroup: !isSearchList ? newList : state.usersByGroup,

        userSearchLoading: isSearchList ? false : state.userSearchLoading,
        userSearchComplete: isSearchList ? action.result.length < globalFetchLimit : state.userSearchComplete,
        usersSearchByGroup: isSearchList ? newList : state.usersSearchByGroup,

        usersError: null,
      };
    }
    case LOAD_USERS_FAIL:
      return {
        ...state,
        usersLoading: false,
        usersError: action.error
      };

    case LOAD_CONFIGURATION_BUNDLES:
    case LOAD_CONFIGURATION_BUNDLES_SUCCESS:
    case LOAD_CONFIGURATION_BUNDLES_FAIL: {
      return {
        ...state,
        confBundleLoading: action.type === LOAD_CONFIGURATION_BUNDLES,
        confBundleLoaded: action.type === LOAD_CONFIGURATION_BUNDLES_SUCCESS,
        confBundle: action.type === LOAD_CONFIGURATION_BUNDLES_SUCCESS ? action.result : state.confBundle,
        error: action.type === LOAD_CONFIGURATION_BUNDLES_FAIL ? action.error : null,
      };
    }

    case GET_CONFIGURATION_BUNDLE:
    case GET_CONFIGURATION_BUNDLE_SUCCESS:
    case GET_CONFIGURATION_BUNDLE_FAIL: {
      return {
        ...state,
        confBundleDetailsLoading: action.type === GET_CONFIGURATION_BUNDLE,
        confBundleDetailsLoaded: action.type === GET_CONFIGURATION_BUNDLE_SUCCESS,
        confBundleDetails: action.type === GET_CONFIGURATION_BUNDLE_SUCCESS ? action.result : state.confBundleDetails,
        error: action.type === GET_CONFIGURATION_BUNDLE_FAIL ? action.error : null,
      };
    }

    case SET_CONFIGURATION_BUNDLE:
    case SET_CONFIGURATION_BUNDLE_SUCCESS:
    case SET_CONFIGURATION_BUNDLE_FAIL: {
      const list = [...state.confBundle];
      const item = list.find(obj => obj.id === action.params.id);

      // Update conf bundle listing details
      if (action.type === SET_CONFIGURATION_BUNDLE_SUCCESS) {
        item.name = action.params.data.current.details.find(obj => obj.id === 'name').value;
        item.description = action.params.data.current.details.find(obj => obj.id === 'description').value;
      }

      return {
        ...state,
        confBundleDetailsSaving: action.type === SET_CONFIGURATION_BUNDLE,
        confBundleDetailsSaved: action.type === SET_CONFIGURATION_BUNDLE_SUCCESS,
        confBundleDetails: action.type === SET_CONFIGURATION_BUNDLE_SUCCESS ? action.result : state.confBundleDetails,
        confBundle: action.type === SET_CONFIGURATION_BUNDLE_SUCCESS ? list : state.confBundle,
        error: action.type === SET_CONFIGURATION_BUNDLE_FAIL ? action.error : null,
        hasUnsavedChanges: action.type === SET_CONFIGURATION_BUNDLE_SUCCESS ? false : state.hasUnsavedChanges,
      };
    }

    case LOAD_METADATA:
    case LOAD_METADATA_SUCCESS:
    case LOAD_METADATA_FAIL: {
      let metadata = state.metadataList;
      let metadataAttributeIds = state.metadataAttributeIds;

      if (action.type === LOAD_METADATA_SUCCESS) {
        const normalized = normalize(action.result, arrayOf(attribute));
        metadata = merge({}, state.metadataList, { ...normalized.entities });
        metadataAttributeIds = action.result.map(t => t.id);
      }

      return {
        ...state,
        metadataLoading: action.type === LOAD_METADATA,
        metadataLoaded: action.type === LOAD_METADATA_SUCCESS,
        metadataList: metadata,
        metadataAttributeIds: metadataAttributeIds,
        error: action.type === LOAD_METADATA_FAIL ? action.error : null,
      };
    }

    case SET_DATA: {
      return {
        ...state,
        ...action.params
      };
    }

    // Create / Edit
    case SAVE_TAB:
    case SAVE_CHANNEL:
    case SAVE_GROUP:
    case SAVE_USER: {
      return {
        ...state,
        saved: false,
        saving: true,
        error: null,
        //...action.params
      };
    }
    case SAVE_TAB_SUCCESS: {
      const type = action.params.type === 'web' ? 'websites' : 'tabs';
      const list = {};
      list[type] = state[type];
      if (!action.params.id) {
        list[type] = [action.result.id, ...list[type]];
      }

      return {
        ...state,
        saved: true,
        saving: false,
        ...list,
      };
    }
    case SAVE_CHANNEL_SUCCESS: {
      let newOrderIds = [...state.channelsByTab[action.params.tabId].channelsIds];
      // Merge array and new item
      if (!action.params.id) {
        newOrderIds = [action.result.id, ...state.channelsByTab[action.params.tabId].channelsIds];
      }

      const newList = {
        ...state.channelsByTab,
        [action.params.tabId]: {
          ...state.channelsByTab[action.params.tabId],
          channelsIds: newOrderIds,
        }
      };

      return {
        ...state,
        saved: true,
        saving: false,
        channelsByTab: newList,
      };
    }
    case SAVE_GROUP_SUCCESS: {
      let newList = {};
      let newOrderIds = [];

      if (action.params.optionType === 'onlyGroup') {
        newOrderIds = [...state.allGroups];

        // Merge array and new item
        if (!action.params.id) {
          newOrderIds = [action.result.id, ...state.allGroups];
        }
      } else {
        newOrderIds = [...state.groupsByTabChannel[action.params.tabId][action.params.channelId].groupIds];
        // Merge array and new item
        if (!action.params.id) {
          newOrderIds = [action.result.id, ...state.groupsByTabChannel[action.params.tabId][action.params.channelId].groupIds];
        }

        newList = {
          ...state.groupsByTabChannel,
          [action.params.tabId]: {
            ...state.groupsByTabChannel[action.params.tabId],
            [action.params.channelId]: {
              groupIds: newOrderIds,
            }
          }
        };
      }

      return {
        ...state,
        saved: true,
        saving: false,
        groupsByTabChannel: action.params.optionType === 'onlyGroup' ? state.groupsByTabChannel : newList,
        allGroups: action.params.optionType === 'onlyGroup' ? newOrderIds : state.allGroups,
      };
    }
    case SAVE_USER_SUCCESS: {
      const parentType = action.params.parentType === 'configurationBundle' ? 'usersByBundle' : 'usersByGroup';
      const parentId = action.params.parentType === 'configurationBundle' ? action.params.configurationBundle : action.params.groupId;
      const newData = {};
      let newOrderIds = [...state[parentType][parentId].userIds];

      // Merge array and new item
      if (!action.params.id) {
        newOrderIds = [action.result.id, ...state[parentType][parentId].userIds];
        newData.allUserTotal = state.allUserTotal + 1;
      } else {
        const userGroups = action.params.groups;
        if (!action.params.resetOnboarding) {
          // Wether Selected group has been removed from user
          const isNotRemoved = parentId === 0 || userGroups.find((obj) => obj.id === parentId);
          if (!isNotRemoved) newOrderIds = newOrderIds.filter((obj) => obj !== action.params.id);
        }
      }

      const newList = {
        ...state[parentType],
        [parentId]: {
          ...state[parentType][parentId],
          userIds: newOrderIds,
        }
      };

      // update user selected
      let userSelected = state.userSelected;
      if (action.params.accountUnlock && state.userSelected.id === action.params.id) {
        userSelected = { ...userSelected, isLocked: false };
      }

      return {
        ...state,
        ...newData,
        userSelected: userSelected,
        saved: !action.params.accountUnlock,
        saving: false,
        unlockPasswordSaved: !!action.params.accountUnlock,
        resetOnboardingExperienceLoading: !!action.params.resetOnboarding,
        [parentType]: newList,
      };
    }
    case SAVE_TAB_FAIL:
    case SAVE_CHANNEL_FAIL:
    case SAVE_GROUP_FAIL:
    case SAVE_USER_FAIL:
      return {
        ...state,
        saved: false,
        saving: false,
        resetOnboardingExperienceLoading: false,
        error: action.error,
      };

    case SET_RELATIONSHIP:
      return {
        ...state,
        saved: false,
        saving: true,
        error: null,
        isChannelQuickLoading: action.params.type === 'channelEdit' ? true : state.isChannelQuickLoading,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? true : state.isGroupQuickLoading,
      };
    case SET_RELATIONSHIP_SUCCESS: {
      let newSearchOrderIds = [];
      let newList = [];
      const objectList = {};

      switch (action.params.type) {
        case 'channelList':
          // Add item from search array
          if (action.params.action === 'add') {
            newSearchOrderIds = [...state.channelSearchListByTab[action.params.tab].channelsIds];
            newSearchOrderIds = newSearchOrderIds.filter((obj) => (obj !== (!action.params.channel.find(item => item === obj))));
            newList = union(action.params.channel, state.channelsByTab[action.params.tab].channelsIds);

            // Remove relationship
          } else {
            const channelId = Math.abs(action.params.channel);
            newList = state.channelsByTab[action.params.tab].channelsIds.filter((obj) => (obj !== channelId));
          }

          objectList.channelsByTab = {
            ...state.channelsByTab,
            [action.params.tab]: {
              ...state.channelsByTab[action.params.tab],
              channelsIds: newList
            }
          };
          objectList.channelSearchListByTab = {
            ...state.channelSearchListByTab,
            [action.params.tab]: {
              ...state.channelSearchListByTab[action.params.tab],
              channelsIds: newSearchOrderIds
            }
          };
          break;
        case 'groupList':
          // Add item from search array
          if (action.params.action === 'add') {
            newSearchOrderIds = [...state.groupsSearchByTabChannel[action.params.tab][action.params.channel].groupIds];
            newSearchOrderIds = newSearchOrderIds.filter((obj) => (!action.params.group.find(item => item === obj)));
            newList = union(action.params.group, state.groupsByTabChannel[action.params.tab][action.params.channel].groupIds);

            // Remove relationship
          } else {
            const groupId = Math.abs(action.params.group);
            newList = state.groupsByTabChannel[action.params.tab][action.params.channel].groupIds.filter((obj) => (obj !== groupId));

            if (state.groupSelected && state.groupSelected.id === groupId) {
              objectList.groupSelected = {}; // Reset selected group
            }
          }

          objectList.groupsByTabChannel = {
            ...state.groupsByTabChannel,
            [action.params.tab]: {
              ...state.groupsByTabChannel[action.params.tab],
              [action.params.channel]: {
                ...state.groupsByTabChannel[action.params.channel],
                groupIds: newList
              }
            }
          };
          objectList.groupsSearchByTabChannel = {
            ...state.groupsSearchByTabChannel,
            [action.params.tab]: {
              ...state.groupsSearchByTabChannel[action.params.tab],
              [action.params.channel]: {
                ...state.groupsSearchByTabChannel[action.params.channel],
                groupIds: newSearchOrderIds
              }
            }
          };
          break;
        case 'groupByWebsiteList':
          // Add item from search array - Manage Websites
          if (action.params.action === 'add') {
            newSearchOrderIds = [...state.groupsSearchByWebsite[action.params.link[0]].groupIds];
            newSearchOrderIds = newSearchOrderIds.filter((obj) => (obj !== (!action.params.group.find(item => item === obj))));
            newList = union(action.params.group, state.groupsByWebsite[action.params.link[0]].groupIds);

            // Remove relationship
          } else {
            const groupId = Math.abs(action.params.group);
            newList = state.groupsByWebsite[action.params.link[0]].groupIds.filter((obj) => (obj !== groupId));

            if (state.groupsByWebsiteSelected && state.groupsByWebsiteSelected.id === groupId) {
              objectList.groupsByWebsiteSelected = {}; // Reset selected group
            }
          }

          objectList.groupsByWebsite = {
            ...state.groupsByWebsite,
            [action.params.link[0]]: {
              ...state.groupsByWebsite[action.params.link[0]],
              groupIds: newList
            }
          };
          objectList.groupsSearchByWebsite = {
            ...state.groupsSearchByWebsite,
            [action.params.link[0]]: {
              ...state.groupsSearchByWebsite[action.params.link[0]],
              groupIds: newSearchOrderIds
            }
          };
          break;
        case 'userList':
          // Add item from search array
          if (action.params.action === 'add') {
            newSearchOrderIds = [...state.usersSearchByGroup[action.params.group].userIds];
            newSearchOrderIds = newSearchOrderIds.filter((obj) => (obj !== (!action.params.user.find(item => item === obj))));
            newList = union(action.params.user, state.usersByGroup[action.params.group].userIds);
          } else if (action.params.action === 'remove') {
            // Unlink users from manage users
            const userId = Math.abs(action.params.user);
            newList = state.usersByGroup[action.params.group].userIds.filter((obj) => (obj !== userId));

            if (state.userSelected && state.userSelected.id === userId) {
              objectList.userSelected = {}; // Reset selected group
            }
          }

          objectList.usersByGroup = {
            ...state.usersByGroup,
            [action.params.group]: {
              ...state.usersByGroup[action.params.group],
              userIds: newList
            }
          };
          objectList.usersSearchByGroup = {
            ...state.usersSearchByGroup,
            [action.params.group]: {
              ...state.usersSearchByGroup[action.params.group],
              userIds: newSearchOrderIds
            }
          };
          break;

        default:
          break;
      }

      return {
        ...state,
        saved: true,
        saving: false,
        isChannelQuickLoading: action.params.type === 'channelEdit' ? false : state.isChannelQuickLoading,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? false : state.isGroupQuickLoading,
        ...objectList
      };
    }
    case SET_RELATIONSHIP_FAIL:
      return {
        ...state,
        saved: false,
        saving: false,
        isChannelQuickLoading: action.params.type === 'channelEdit' ? false : state.isChannelQuickLoading,
        isGroupQuickLoading: action.params.type === 'groupEdit' ? false : state.isGroupQuickLoading,
        error: action.error,
      };

    // Delete
    case DELETE_TAB:
    case DELETE_CHANNEL:
    case DELETE_GROUP:
    case DELETE_USER:
    case DELETE_CONFIGURATION_BUNDLE:
      return {
        ...state,
        deleted: false,
        deleting: true,
        error: null,
      };

    case DELETE_TAB_SUCCESS:
    case DELETE_CHANNEL_SUCCESS:
    case DELETE_GROUP_SUCCESS:
    case DELETE_USER_SUCCESS: {
      const data = {};

      // decrease Conf Bundle childCounter when user is deleted
      if (action.params.parentType === 'configurationBundle') {
        const bundles = [...state.confBundle];
        const bundle = bundles.find(item => item.id === action.params.parentId);
        if (bundle) {
          bundle.childCount -= 1;
          data.confBundle = bundles;
        }
      } else if (action.params.type === 'user' && state.allUserTotal) {
        data.allUserTotal = state.allUserTotal - 1;
      }

      return {
        ...state,
        deleted: true,
        deleting: false,
        ...action.result,
        ...data
      };
    }

    case DELETE_CONFIGURATION_BUNDLE_SUCCESS: {
      const bundles = [...state.confBundle];
      const bundle = bundles.find(item => item.id === action.params.id);
      bundle.status = 'deleted';

      return {
        ...state,
        deleted: true,
        deleting: false,
        confBundle: bundles
      };
    }

    case DELETE_TAB_FAIL:
    case DELETE_CHANNEL_FAIL:
    case DELETE_GROUP_FAIL:
    case DELETE_USER_FAIL:
    case DELETE_CONFIGURATION_BUNDLE_FAIL:
      return {
        ...state,
        deleted: false,
        deleting: false,
        error: action.error,
      };

    // Load Graph data
    case LOAD_GROUPS_BY_WEBSITE_GRAPH:
    case LOAD_INTEREST_AREAS_GRAPH:
    case LOAD_GRAPH:
      return {
        ...state,
        graphLoading: true,
        graphLoaded: false,
        //graph: action.result
      };
    case LOAD_GROUPS_BY_WEBSITE_GRAPH_SUCCESS:
    case LOAD_INTEREST_AREAS_GRAPH_SUCCESS:
    case LOAD_GRAPH_SUCCESS: {
      return {
        ...state,
        graph: action.result,
        graphLoading: false,
        graphLoaded: true,
        error: null,
      };
    }
    case LOAD_GROUPS_BY_WEBSITE_GRAPH_FAIL:
    case LOAD_INTEREST_AREAS_GRAPH_FAIL:
    case LOAD_GRAPH_FAIL:
      return {
        ...state,
        graphLoaded: false,
        graphLoading: false,
        error: action.error
      };

    //Configuration Bundle
    case LOAD_BUNDLE_USERS: {
      return {
        ...state,
        usersByBundleError: '',
        usersByBundleLoading: true,
      };
    }
    case LOAD_BUNDLE_USERS_SUCCESS: {
      const userIds = [];
      action.result.map((t) => {
        userIds.push(t.id);
        return true;
      });

      // Merge users array if loading more (offset > 0)
      const newOrderIds = action.params.offset ? union(state.usersByBundle.userIds, userIds) : userIds;

      const newList = {
        ...state.usersByBundle,
        [action.params.id]: {
          userIds: newOrderIds,
        }
      };

      return {
        ...state,
        usersByBundleLoading: false,
        usersByBundleComplete: action.result.length < globalFetchLimit,
        usersByBundle: newList,
        usersByBundleError: null,
      };
    }
    case LOAD_BUNDLE_USERS_FAIL:
      return {
        ...state,
        usersByBundleLoading: false,
        usersByBundleError: action.error
      };
    case CSV_FILE_VALIDATE:
    case CSV_FILE_VALIDATE_SUCCESS:
    case CSV_FILE_VALIDATE_FAIL:
      return {
        ...state,
        csvFileValidating: action.type === CSV_FILE_VALIDATE,
        csvFileValidated: action.type === CSV_FILE_VALIDATE_SUCCESS,
        csvFileValidateError: action.error || null,
        error: action.error || null,
        ...action.result,
      };
    case GET_BULK_IMPORT_STATUS_SUCCESS:
      return {
        ...state,
        bulkImportStatus: action.result,
      };
    case CSV_USER_CREATE:
    case CSV_USER_CREATE_SUCCESS:
    case CSV_USER_CREATE_FAIL:
    case CSV_USER_DELETE:
    case CSV_USER_DELETE_SUCCESS:
    case CSV_USER_DELETE_FAIL:
      return {
        ...state,
        csvUserCreating: action.type === CSV_USER_CREATE,
        csvUserCreated: action.type === CSV_USER_CREATE_SUCCESS,
        csvUserDeleting: action.type === CSV_USER_DELETE,
        csvUserDeleted: action.type === CSV_USER_DELETE_SUCCESS,
        csvUserCreatedError: action.error || null,
        error: action.error || null,
        ...action.result,
      };
    default:
      return state;
  }
}
/**
 * Action Creators
 */

/* Load User Default settings */
export function loadUserDefaultSettings() {
  return {
    types: [LOAD_USER_DEFAULTS, LOAD_USER_DEFAULTS_SUCCESS, LOAD_USER_DEFAULTS_FAIL],
    promise: (client) => client.get('/admin/users/defaults', 'webapi')
  };
}

export function setUserDefaultSettings(data) {
  const nPlatform = {};
  const tmpData = { ...data };
  if (tmpData.platform.value) {
    Object.keys(tmpData.platform.value).map((obj) => {
      const tmpObj = tmpData.platform.value[obj] || {};
      if (typeof (tmpObj.enabled) === 'undefined') {
        nPlatform[obj] = { enabled: tmpData.platform.value[obj] ? 1 : 0 } // eslint-disable-line
      } else {
        nPlatform[obj] = { enabled: tmpData.platform.value[obj].enabled }; // eslint-disable-line
      }
      return obj;
    });
    tmpData.platform.value = nPlatform;
  }

  return {
    types: [SET_USER_DEFAULTS, SET_USER_DEFAULTS_SUCCESS, SET_USER_DEFAULTS_FAIL],
    params: data,
    promise: (client) => client.post('/admin/users/defaults', 'webapi', {
      body: { ...tmpData }
    })
  };
}

export function resetUserDefaultSettings() {
  return {
    type: RESET_USER_DEFAULTS
  };
}

export function loadUserDefaultNotifications() {
  return {
    types: [LOAD_USER_DEFAULT_NOTIFICATIONS, LOAD_USER_DEFAULT_NOTIFICATIONS_SUCCESS, LOAD_USER_DEFAULT_NOTIFICATIONS_FAIL],
    promise: (client) => client.get('/admin/users/defaultnotifications', 'webapi')
  };
}

export function setUserDefaultNotifications(data) {
  return {
    types: [SET_USER_DEFAULT_NOTIFICATIONS, SET_USER_DEFAULT_NOTIFICATIONS_SUCCESS, SET_USER_DEFAULT_NOTIFICATIONS_FAIL],
    params: data,
    promise: (client) => client.put('/admin/users/defaultnotifications', 'webapi', {
      body: data
    })
  };
}

/* Load all groups for Interest Areas */
export function loadInterestAreasGroups(offset = 0, search = '') {
  return {
    types: [LOAD_GROUPS_IA, LOAD_GROUPS_IA_SUCCESS, LOAD_GROUPS_IA_FAIL],
    offset: offset,
    search: search,
    promise: (client) => client.get('/admin/interestareas/groups', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        search: search
      }
    })
  };
}

/* Load all Interest Areas */
export function loadInterestAreas(offset = 0, groupId, search = '', filter = 0) {
  return {
    types: [LOAD_INTEREST_AREAS, LOAD_INTEREST_AREAS_SUCCESS, LOAD_INTEREST_AREAS_FAIL],
    params: {
      offset: offset,
      search: search,
      unlinked: filter,
      filter: filter ? 'unlinked' : '',
      id: groupId
    },
    promise: (client) => client.get('/admin/interestareas', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        groupId: groupId,
        search: search,
        unlinked: filter
      }
    })
  };
}

export function setInterestAreaLink(id, list) {
  const path = `/admin/interestareas/${id}/link`;
  return {
    types: [SET_INTEREST_AREA_LINK, SET_INTEREST_AREA_LINK_SUCCESS, SET_INTEREST_AREA_LINK_FAIL],
    params: {
      id: id,
      interestAreas: list
    },
    promise: (client) => client.post(path, 'webapi', {
      data: {
        parentId: id,
        interestAreas: JSON.stringify(list)
      }
    })
  };
}

export function removeInterestAreaLink(id, interestAreaId) {
  const path = `/admin/interestareas/${id}/link/${interestAreaId}`;
  return {
    types: [REMOVE_INTEREST_AREA_LINK, REMOVE_INTEREST_AREA_LINK_SUCCESS, REMOVE_INTEREST_AREA_LINK_FAIL],
    params: {
      id: id,
      interestAreaId: interestAreaId
    },
    promise: (client) => client.del(path, 'webapi')
  };
}

/* Load interest areas Data for Graph */
export function loadInterestAreasGraph(parentId) {
  const data = {
    parentId: parentId
  };

  return {
    types: [LOAD_INTEREST_AREAS_GRAPH, LOAD_INTEREST_AREAS_GRAPH_SUCCESS, LOAD_INTEREST_AREAS_GRAPH_FAIL],
    params: data,
    promise: (client) => client.get(`/admin/interestareas/${parentId}/structure`, 'webapi', {
      params: data
    })
  };
}

/* Load all Websites */
export function loadWebsites(offset = 0, search = '') {
  return {
    types: [LOAD_WEBSITES, LOAD_WEBSITES_SUCCESS, LOAD_WEBSITES_FAIL],
    offset: offset,
    search: search,
    promise: (client) => client.get('/admin/websites', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        search: search
      }
    })
  };
}

/* Load Groups by Websites Data for Graph */
export function loadGroupsByWebsiteGraph(parentId) {
  const data = {
    parentId: parentId
  };

  return {
    types: [LOAD_GROUPS_BY_WEBSITE_GRAPH, LOAD_GROUPS_BY_WEBSITE_GRAPH_SUCCESS, LOAD_GROUPS_BY_WEBSITE_GRAPH_FAIL],
    params: data,
    promise: (client) => client.get(`/admin/websites/structure/${parentId}`, 'webapi', {
      params: data
    })
  };
}

/* Load all Tabs */
export function loadTabs(offset = 0, search = '') {
  return {
    types: [LOAD_TABS, LOAD_TABS_SUCCESS, LOAD_TABS_FAIL],
    offset: offset,
    search: search,
    promise: (client) => client.get('/admin/structure/tabs/get', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        search: search
      }
    })
  };
}

/* Load all CHANNELS */
export function loadChannels(offset = 0, tabId, search = '', filter = '') {
  return {
    types: [LOAD_CHANNELS, LOAD_CHANNELS_SUCCESS, LOAD_CHANNELS_FAIL],
    tabId: tabId,
    offset: offset,
    search: search,
    filter: filter,
    promise: (client) => client.get('/admin/structure/channels/get', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        tabId: tabId,
        search: search,
        filter: filter,
      }
    })
  };
}

/* Load all GROUPS */
export function loadGroups(offset = 0, tabId, channelId, search = '', filter = '') {
  return {
    types: [LOAD_GROUPS, LOAD_GROUPS_SUCCESS, LOAD_GROUPS_FAIL],
    tabId: tabId,
    channelId: channelId,
    offset: offset,
    search: search,
    filter: filter,
    promise: (client) => client.get('/admin/structure/groups/get', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        tabId: tabId,
        channelId: channelId,
        search: search,
        filter: filter,
      }
    })
  };
}

export function loadGroupsByWebsite(offset = 0, id, search = '', filter = 0) {
  const data = {
    limit: globalFetchLimit,
    offset: offset,
    search: search,
    unlinked: filter,
  };

  return {
    types: [LOAD_WEBSITE_GROUPS, LOAD_WEBSITE_GROUPS_SUCCESS, LOAD_WEBSITE_GROUPS_FAIL],
    params: {
      id: id,
      filter: filter ? 'unlinked' : '',
      ...data,
    },
    promise: (client) => client.get(`/admin/websites/${id}/groups`, 'webapi', {
      params: data
    })
  };
}

/* Load list of USERS */
export function loadUsers(offset = 0, groupId, search = '', filter = '') {
  return {
    types: [LOAD_USERS, LOAD_USERS_SUCCESS, LOAD_USERS_FAIL],
    groupId: groupId,
    offset: offset,
    search: search,
    filter: filter,
    promise: (client) => client.get('/admin/structure/users/get', 'webapi', {
      params: {
        limit: globalFetchLimit,
        offset: offset,
        groupId: groupId,
        search: search,
        filter: filter,
      }
    })
  };
}

export function getUserTotal() {
  return {
    types: [GET_USER_TOTAL, GET_USER_TOTAL_SUCCESS, GET_USER_TOTAL_FAIL],
    promise: (client) => client.get('/admin/users/total', 'webapi')
  };
}

export function sendUserInvitation(id) {
  return {
    types: [SEND_USER_INVITATION, SEND_USER_INVITATION_SUCCESS, SEND_USER_INVITATION_FAIL],
    promise: (client) => client.post('/admin/users/invite', 'webapi', {
      data: {
        id: id
      }
    })
  };
}

export function loadAllGroups(offset = 0, search = '', includePersonalGroups, namespace = 'ALL_GROUPS') {
  const type = `admin/structure/LOAD_${namespace.toUpperCase()}`;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    includePersonalGroups,
    offset,
    search,
    promise: (client) => client.get('/admin/structure/groups/all/get', 'webapi', {
      params: {
        limit: globalFetchLimit,
        includePersonalGroups,
        offset,
        search,
      }
    })
  };
}

export function saveDetail(data, name, parentType, options) {
  const path = `/admin/structure/${name}/set`;
  const type = `admin/structure/SAVE_${name.toUpperCase()}`;

  const { roleId, ...tmpData } = data;

  // Parse user attributes
  if (name.toUpperCase() === 'USER' && !tmpData.accountUnlock) {
    if (tmpData.groups && tmpData.groups.length) {
      const tmpGroup = tmpData.groups.filter(obj => !obj.isPersonal);
      tmpData.groups = JSON.stringify(
        tmpGroup.map((obj) => ({ id: obj.id, is_group_admin: !!obj.isGroupAdmin }))
      );
    } else if (!tmpData.resetOnboarding) {
      tmpData.groups = JSON.stringify([]); //Remove all groups
    }

    if (tmpData.metadata && tmpData.metadata.length) {
      tmpData.metadata = JSON.stringify(tmpData.metadata);
    } else if (!tmpData.resetOnboarding) {
      tmpData.metadata = JSON.stringify([]);
    }

    const nPlatform = {};
    if (tmpData.platform) {
      Object.keys(tmpData.platform).map((obj) => {
        nPlatform[obj] = {enabled: tmpData.platform[obj] ? 1 : 0} // eslint-disable-line
        return obj;
      });
      tmpData.platform = JSON.stringify(
        nPlatform
      );
    }
    tmpData.role = roleId;
    tmpData.sendInvite = +tmpData.sendInvite;
    tmpData.storyPromoting = +tmpData.storyPromoting;
  }

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    params: { ...data, ...options, parentType: parentType },
    promise: (client) => client.post(path, 'webapi', {
      data: {
        ...tmpData,
        thumbnail: tmpData.thumbnailDownloadUrl ? tmpData.thumbnailDownloadUrl : tmpData.thumbnail
      }
    })
  };
}

export function setRelationship(data, name, action) {
  const path = '/admin/structure/relationship/set';
  return {
    types: [SET_RELATIONSHIP, SET_RELATIONSHIP_SUCCESS, SET_RELATIONSHIP_FAIL],
    params: { ...data, type: name, action: action },
    promise: (client) => client.post(path, 'webapi', {
      data: {
        ...data,
        channel: JSON.stringify(data.channel),
        group: JSON.stringify(data.group),
        user: JSON.stringify(data.user),
        link: JSON.stringify(data.link),
        permissions: JSON.stringify(data.permissions)
      }
    })
  };
}

export function deleteItem(id, name, options) {
  const path = `/admin/structure/${name}/delete`;
  const type = `admin/structure/DELETE_${name.toUpperCase()}`;

  return {
    types: [type, `${type}_SUCCESS`, `${type}_FAIL`],
    params: { id: id, type: name, ...options },
    promise: (client) => client.post(path, 'webapi', {
      data: {
        id: id
      }
    })
  };
}

/* Load all Conf Bundles */
export function loadConfigurationBundles(data = {}) {
  const tmpData = {};
  if (data.Config) tmpData.bundle = data.Config;
  if (data.User) tmpData.user = data.User;

  return {
    types: [LOAD_CONFIGURATION_BUNDLES, LOAD_CONFIGURATION_BUNDLES_SUCCESS, LOAD_CONFIGURATION_BUNDLES_FAIL],
    promise: (client) => client.get('/admin/structure/configBundles/get', 'webapi', {
      params: tmpData
    })
  };
}

export function deleteConfigurationBundle(id) {
  return {
    types: [DELETE_CONFIGURATION_BUNDLE, DELETE_CONFIGURATION_BUNDLE_SUCCESS, DELETE_CONFIGURATION_BUNDLE_FAIL],
    params: { id: id },
    promise: (client) => client.post('/admin/configbundle/delete', 'webapi', {
      data: {
        id: id
      }
    })
  };
}

export function getConfBundle(id) {
  return {
    types: [GET_CONFIGURATION_BUNDLE, GET_CONFIGURATION_BUNDLE_SUCCESS, GET_CONFIGURATION_BUNDLE_FAIL],
    id: id,
    promise: (client) => client.get('/admin/configbundle/get', 'webapi', {
      params: {
        id: id,
      }
    })
  };
}

export function setConfBundle(id, data) {
  return {
    types: [SET_CONFIGURATION_BUNDLE, SET_CONFIGURATION_BUNDLE_SUCCESS, SET_CONFIGURATION_BUNDLE_FAIL],
    params: {
      id: id,
      data: data
    },
    promise: (client) => client.post('/admin/configbundle/set', 'webapi', {
      data: {
        id: id,
        data: JSON.stringify(data),
      }
    })
  };
}

/* Load list of USERS by Conf Bundle */
export function loadBundleUsers(offset = 0, id = 0, search = '', parentSearch = '', filter = '') {
  const data = {
    id: id,
    limit: globalFetchLimit,
    offset: offset,
    search: search,
    parentSearch: parentSearch,
    filter: filter,
  };

  return {
    types: [LOAD_BUNDLE_USERS, LOAD_BUNDLE_USERS_SUCCESS, LOAD_BUNDLE_USERS_FAIL],
    params: data,
    promise: (client) => client.get('/admin/configbundle/users/get', 'webapi', {
      params: data
    })
  };
}

/* Load all Metadata */
export function loadMetadata() {
  return {
    types: [LOAD_METADATA, LOAD_METADATA_SUCCESS, LOAD_METADATA_FAIL],
    promise: (client) => client.get('/admin/structure/user/metadata/get', 'webapi')
  };
}

/* Load list of Data for Graph */
export function loadCompleteStructure(parentType = 'tab', parentId, c = '') {
  const data = {
    parentType: parentType,
    parentId: parentId,
    c: c
  };

  return {
    types: [LOAD_GRAPH, LOAD_GRAPH_SUCCESS, LOAD_GRAPH_FAIL],
    params: data,
    promise: (client) => client.get('/admin/structure/completeStructure/get', 'webapi', {
      params: data
    })
  };
}
//TODO update api to v5
/* csv users bulk upload function*/
export function validateCsvUsers(arg) {
  let enablePersonalReports = 'from_csv';
  if (Object.prototype.hasOwnProperty.call(arg, 'personalReports')) {
    enablePersonalReports = arg.personalReports.enable ? 1 : 0;
  }

  let access = 0;
  access = arg.role === 'structure-administrator' ? 2 : access;
  access = arg.role === 'administrator' ? 4 : access;

  let update = {
    existing_users: arg.existingUsers || 'skip',
    send_invite: arg.sendInvite ? 1 : 0,
    user_lang: arg.defaultLanguage || 'from_csv',
    group_options: Array.isArray(arg.group) ? 'from_form' : 'from_csv',
    metadata_options: Array.isArray(arg.metadataListSelected) ? 'from_form' :  'from_csv',
  };

  if (Array.isArray(arg.metadataListSelected)) {
    update.metadata_enabled = arg.metadataListSelected.map(item => item.id);
  }

  update = {
    ...update,
    config_bundle: arg.configurationBundle || 'from_csv',
    platform_options: Object.prototype.hasOwnProperty.call(arg, 'platformToggle') ? arg.platformToggle : 'from_csv',
    platforms: ['ios', 'android', 'web', 'windows'].filter(item => !Object.prototype.hasOwnProperty.call(arg, 'platform') || arg.platform[item]),
    personal_reports: arg.personalReportsToggle || 'from_csv',
    access,
    digest_email: Object.prototype.hasOwnProperty.call(arg, 'sendDigestEmail') ? arg.sendDigestEmail : 'from_csv',
    user_timezone: arg.timezone || 'from_csv',
    csvFile: arg.file,
    dry_run: Object.prototype.hasOwnProperty.call(arg, 'dry_run') ? arg.dry_run : 1,
    bulkType: 'edit',
    formId: 'data-form',
    enable_personal_reports: enablePersonalReports,
  };

  if (!arg.sendInvite) {
    update.set_password_using = arg.setPassword || 'from_csv';
    if (arg.setPassword === 'from_form') {
      update.password = arg.newPassword;
      update.confirm_password = arg.confirmPassword;
    }
  }
  if (Array.isArray(arg.group)) {
    update.group_enabled = arg.group.map(item => item.id);
  }

  if (arg.existingUsers === 'update') {
    update.existing_users_groups = arg.existingUsersGroups || 'skip';
    update.existing_users_passwords = arg.existingUsersPasswords || 'skip';
  }

  if (Array.isArray(arg.metadataListSelected)) {
    update['metadata[]'] = arg.metadataListSelected.map(item => item.id);
  }

  if (Object.prototype.hasOwnProperty.call(arg, 'platformToggle') && arg.platformToggle === 'from_form') {
    update.user_platforms = JSON.stringify({
      ios: { enabled: arg.platform.ios ? 1 : 0 },
      windows: { enabled: arg.platform.windows ? 1 : 0 },
      android: { enabled: arg.platform.android ? 1 : 0 },
      web: { enabled: arg.platform.web ? 1 : 0 }
    });
  }
  // Attach file as FormData
  const formData = new FormData();
  for (const prop in update) {
    if (Object.prototype.hasOwnProperty.call(update, prop)) {
      if (Array.isArray(update[prop])) {
        for (const i in update[prop]) {
          if (Object.prototype.hasOwnProperty.call(update[prop], i)) {
            formData.append(prop, update[prop][i]);
          }
        }
      } else {
        formData.append(prop, update[prop]);
      }
    }
  }

  if (Array.isArray(arg.group)) {
    for (const index in arg.group) {
      if (arg.group[index].id) {
        formData.append(`groups[${index}][id]`, arg.group[index].id);
      }
    }
  }

  let types = [CSV_FILE_VALIDATE, CSV_FILE_VALIDATE_SUCCESS, CSV_FILE_VALIDATE_FAIL];
  if (arg.dry_run === 0) {
    types = [CSV_USER_CREATE, CSV_USER_CREATE_SUCCESS, CSV_USER_CREATE_FAIL];
  }

  return {
    types,
    params: update,
    promise: (client) => client.post('/user/bulk_import', 'webapi4', {
      body: formData
    })
  };
}
//TODO update api to v5
export function validateDeleteUsers(arg) {
  let update = {
    formId: 'bulk-form',
    bulkType: 'delete',
    csvFile: arg.file,
  };

  let types = [CSV_FILE_VALIDATE, CSV_FILE_VALIDATE_SUCCESS, CSV_FILE_VALIDATE_FAIL];
  if (Object.prototype.hasOwnProperty.call(arg, 'user_emails')) {
    update = arg;
    types = [CSV_USER_DELETE, CSV_USER_DELETE_SUCCESS, CSV_USER_DELETE_FAIL];
  }

  const formData = new FormData();

  for (const prop in update) {
    if (Object.prototype.hasOwnProperty.call(update, prop)) {
      if (Array.isArray(update[prop])) {
        formData.append(prop, JSON.stringify(update[prop]));
      } else {
        formData.append(prop, update[prop]);
      }
    }
  }

  return {
    types,
    params: update,
    promise: (client) => client.post('/user/bulk_delete', 'webapi4', {
      body: formData
    })
  };
}
//TODO update api to v5
export function getBulkImportStatus() {
  const types = [GET_BULK_IMPORT_STATUS, GET_BULK_IMPORT_STATUS_SUCCESS, GET_BULK_IMPORT_STATUS_FAIL];
  return {
    types,
    promise: (client) => client.get('/user/bulk_import_status', 'webapi4')
  };
}

export function setData(data) {
  return {
    type: SET_DATA,
    params: data,
  };
}
