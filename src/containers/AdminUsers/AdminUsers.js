/* eslint-disable react/no-did-update-set-state */
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
 * @package style-guide
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import generateStrings from 'helpers/generateStrings';
import { defineMessages, FormattedMessage } from 'react-intl';

import AdminGroupModal from 'components/Admin/AdminManageList/Modals/AdminGroupModal';
import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminPanels from 'components/Admin/AdminPanels/AdminPanels';
import AdminUserDetails from 'components/Admin/AdminManageList/AdminUserDetails';
import AdminUserDefaultsModal from 'components/Admin/AdminManageList/Modals/AdminUserDefaultsModal';
import AdminUserModal from 'components/Admin/AdminManageList/Modals/AdminUserModal';
import AdminVisualiseRelationships from 'components/Admin/AdminVisualiseRelationships/AdminVisualiseRelationships';
import AdminUserDefaultNotificationModal from 'components/Admin/AdminManageList/Modals/AdminUserDefaultNotificationModal';
import Dialog from 'components/Dialog/Dialog';
import ImagePickerModal from 'components/ImagePickerModal/ImagePickerModal';
import AdminBulkUserImport from '../AdminBulkUserImport/AdminBulkUserImport';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  deleteItem,
  getUserTotal,
  loadAllGroups,
  loadConfigurationBundles,
  loadInterestAreasGraph,
  loadMetadata,
  loadUsers,
  loadUserDefaultSettings,
  loadUserDefaultNotifications,
  resetUserDefaultSettings,
  removeInterestAreaLink,
  setUserDefaultSettings,
  saveDetail,
  sendUserInvitation,
  setData,
  setRelationship,
  setInterestAreaLink,
  setUserDefaultNotifications,
  validateCsvUsers,
  validateDeleteUsers,
  getBulkImportStatus,
} from 'redux/modules/admin/structure';
import {
  deleteEntity,
} from 'redux/modules/entities/entities';
import { createPrompt } from 'redux/modules/prompts';

// Make user bulk upload accessible by url only, remove this after feature is completed
import {
  Route,
  Switch
} from 'react-router-dom';

const messages = defineMessages({
  emailHasBeenSent: { id: 'email-has-been-sent-successfully', defaultMessage: 'Email has been sent successfully' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  confirmDelete: { id: 'confirm-delete', defaultMessage: 'Confirm Delete' },
  confirmDeleteUserMessage: { id: 'confirm-delete-user-message', defaultMessage: 'Are you sure you want to delete this User from the System?' },
  addExistingUsers: { id: 'add-existing-users', defaultMessage: 'Add existing users' },

  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully' },
  successfullyDeleted: { id: 'successfully-deleted', defaultMessage: 'Successfully deleted' },

  never: { id: 'never', defaultMessage: 'Never' },
  daily: { id: 'daily', defaultMessage: 'Daily' },
  weekly: { id: 'weekly', defaultMessage: 'Weekly' },
  monthly: { id: 'monthly', defaultMessage: 'Monthly' },

  allUsers: { id: 'all-users', defaultMessage: 'All users' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  users: { id: 'users', defaultMessage: 'Users' },
  selectUser: { id: 'select-user', defaultMessage: 'Select User' },
  selectGroup: { id: 'select-group', defaultMessage: 'Select Group' },
  addUsers: { id: 'find-interest-areas', defaultMessage: 'Add Users' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  noUsersFound: { id: 'no-users-found', defaultMessage: 'No users found' },
  noGroupsFound: { id: 'no-groups-found', defaultMessage: 'No groups found' },

  user: { id: 'user', defaultMessage: 'User' },
  structureAdministrator: { id: 'structure-administrator', defaultMessage: 'Structure Administrator' },
  administrator: { id: 'administrator', defaultMessage: 'Administrator' },
  companyManager: { id: 'company-manager', defaultMessage: 'Company Manager' },
  superUser: { id: 'super-user', defaultMessage: 'Super User' },

  invited: { id: 'invited', defaultMessage: 'Invited' },
  forcePasswordChange: { id: 'force-password-change', defaultMessage: 'Force Password Change' },
  active: { id: 'active', defaultMessage: 'Active' },
  inactive: { id: 'inactive', defaultMessage: 'Inactive' },
  pleaseProvideValidUrl: { id: 'please-provide-valid-url', defaultMessage: 'Please provide valid URL' },
  confirmDeleteGroupMessage: { id: 'confirm-delete-group-message', defaultMessage: 'Are you sure you want to delete this Group?' },
  fileSizeError: { id: 'file-size-error', defaultMessage: 'File size should be less than 1MB' },
  userAccountUnlocked: { id: 'user-account-unlocked', defaultMessage: 'User account has been unlocked' },

  deviceCacheLimitMinimum: { id: 'device-cache-limit-minimum', defaultMessage: 'Device cache limit must have minimum of 1.' }
});

function mapStateToProps(state) {
  const { admin, entities, settings } = state;
  const { structure } = admin;

  // All Users Item
  const allUsers = {
    id: 0,
    type: 'group',
    name: 'All users',
    isActive: structure.groupSelected.id === 0,
    childCount: structure.allUserTotal || 0,
    showGlobalAvatar: true,
    showBulkUpload: false,
    showUserDefault: true,
    showUserDefaultNotifications: true,
    showDefaultMetadata: false
  };

  // Mapping metadata ATTRIBUTE
  const metadata = structure.metadataAttributeIds.map(id => {
    const metadataTmp = { ...structure.metadataList.attributes[id] };
    metadataTmp.values = metadataTmp.values.map(attrId => structure.metadataList.values[attrId]);
    return metadataTmp;
  });

  // Mapping metadata VALUES and setting parent Attribute
  let metadataValues = [];
  if (structure.metadataList && structure.metadataList.values) {
    metadataValues = Object.keys(structure.metadataList.values).map((k) => {
      const valueList = {
        ...structure.metadataList.values[k]
      };
      Object.keys(structure.metadataList.attributes).map(atts => {
        if (structure.metadataList.attributes[atts].values.includes(valueList.id)) {
          const {
            values,
            ...others
          } = structure.metadataList.attributes[atts];
          valueList.attribute = {
            ...others,
            name: others.attribute
          };
        }
        return atts;
      });
      return valueList;
    });
  }

  const allGroups = structure.allGroups.map(id => {
    const { isActive, ...item } = entities.groups[id];
    return ({ ...item });
  });
  const allGroupsList = structure.allGroupsList.map(id => ({ ...entities.groups[id] }));
  let groupSelected = allGroups.find(obj => !obj.deleted && obj.id === structure.groupSelected.id) || {};
  if (structure.groupSelected.id === 0) groupSelected = allUsers;

  const userSelected = structure.userSelected.deleted ? {} : structure.userSelected;
  const usersByGroup = structure.usersByGroup[groupSelected.id];
  const usersSearchByGroup = structure.usersSearchByGroup[groupSelected.id];

  let users = [];
  if (groupSelected.name && usersByGroup && usersByGroup.userIds) {
    users = usersByGroup.userIds.map(id => {
      const nUser = entities.users[id];
      nUser.name = nUser.firstname + ' ' + nUser.lastname;
      nUser.note = entities.users[id].email;
      return nUser;
    });

    if (users.length) users = users.filter(obj => !obj.deleted);
  }

  let userSearchList = [];
  if (groupSelected.name && usersSearchByGroup && usersSearchByGroup.userIds) {
    userSearchList = usersSearchByGroup.userIds.map(id => {
      const nUser = entities.users[id];
      nUser.name = nUser.firstname + ' ' + nUser.lastname;
      nUser.note = entities.users[id].email;
      return nUser;
    });
  }

  // User defaults
  const { notifications, ...userDefaults } = structure.userDefaultSettings;
  const notificationsTemp = {};

  for (const key in notifications) {
    if (notifications) notificationsTemp[key] = notifications[key].value;
  }

  return {
    allUsers: allUsers,
    groupsIA: allGroups.filter(obj => !obj.deleted && !obj.isPersonal),
    groupSelected: groupSelected,
    groupsIALoading: structure.allGroupsLoading,
    groupsIAComplete: structure.allGroupsComplete,
    groupsIAError: structure.allGroupsError,
    groupsIAFilter: structure.allGroupSearch,

    allGroupsList: allGroupsList.filter(obj => !obj.deleted && !obj.isPersonal),
    allGroupsListLoading: structure.allGroupsListLoading,
    allGroupsListLoaded: structure.allGroupsListLoaded,
    allGroupsListComplete: structure.allGroupsListComplete,
    allGroupsListOffset: structure.allGroupsListOffset,
    allGroupListSearch: structure.allGroupListSearch,

    users: users,
    userSelected: userSelected,
    usersLoading: structure.usersLoading,
    usersComplete: structure.usersComplete,
    usersError: structure.usersError,
    userFilter: structure.userFilter,

    userSearch: structure.userSearch,
    userSearchList: userSearchList,
    userSearchLoading: structure.userSearchLoading,
    userSearchComplete: structure.userSearchComplete,

    confBundle: structure.confBundle,
    confBundleLoaded: structure.confBundleLoaded,
    confBundleLoading: structure.confBundleLoading,

    userDefaultSettings: {
      ...userDefaults
    },
    userDefaultSettingsNotifications: notificationsTemp,
    userDefaultSettingsLoading: structure.userDefaultSettingsLoading,
    userDefaultSettingsLoaded: structure.userDefaultSettingsLoaded,
    userDefaultSettingsSaving: structure.userDefaultSettingsSaving,
    userDefaultSettingsSaved: structure.userDefaultSettingsSaved,
    userDefaultNotificationsSaved: structure.userDefaultNotificationsSaved,

    userDefaultNotifications: structure.userDefaultNotifications,

    error: structure.error,
    saved: structure.saved,
    saving: structure.saving,
    deleted: structure.deleted,
    deleting: structure.deleting,
    graph: structure.graph,
    graphLoaded: structure.graphLoaded,
    graphLoading: structure.graphLoading,
    invitationSending: structure.invitationSending,
    invitationSent: structure.invitationSent,
    unlockPasswordSaved: structure.unlockPasswordSaved,
    resetOnboardingExperienceLoading: structure.resetOnboardingExperienceLoading,
    metadata: metadata,
    metadataValues: metadataValues,
    metadataLoaded: structure.metadataLoaded,
    metadataLoading: structure.metadataLoading,
    userDefaults: settings.userDefaults,
    languages: Object.assign({}, settings.languages),

    summary: _isEmpty(structure.summary) ? {} : structure.summary,
    errors: structure.errors,
    validEmails: structure.valid_emails,
    isCsvFileValidated: structure.csvFileValidated,
    isCsvUserCreated: structure.csvUserCreated,
    isCsvUserDeleted: structure.csvUserDeleted,
    bulkImportStatus: structure.bulkImportStatus
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    deleteEntity,

    deleteItem,
    getUserTotal,
    loadAllGroups,
    loadConfigurationBundles,
    loadInterestAreasGraph,
    loadMetadata,
    loadUsers,
    loadUserDefaultSettings,
    loadUserDefaultNotifications,
    removeInterestAreaLink,
    resetUserDefaultSettings,
    setUserDefaultSettings,
    saveDetail,
    setData,
    sendUserInvitation,
    setRelationship,
    setInterestAreaLink,
    setUserDefaultNotifications,

    validateCsvUsers,
    validateDeleteUsers,
    getBulkImportStatus,
  })
)
export default class AdminUsersView extends Component {
  static propTypes = {
    groupsIA: PropTypes.array.isRequired,
    groupsIALoading: PropTypes.bool,
    groupsIAComplete: PropTypes.bool,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      // Modals
      groupImagePickerModalVisible: false,
      isGroupModalVisible: false,
      groupDetails: {},
      allGroupsList: Object.assign([], props.allGroupsList),

      isUserModalVisible: false,
      userDetails: {},
      confirmRemoveUser: false,

      userDefaultSettingsModalVisible: false,
      userDefaultNotificationModalVisible: false,
      userDefaultSettings: props.userDefaultSettings,
      userDefaultNotifications: {},
      userDefaultBulkUploadModalVisible: false,
      // Panels
      isGraphEnabled: false,
      graphId: 0,
      // for accessing bulk user uploader by url
      adminBulkUserImportVisibleUrl: true,

      // for resetting limitCacheSize states if user closes modal without saving
      initialLimitCacheSizeCheckbox: false,
      initialLimitCacheSizeValue: '1.00',

      // for the deviceLimitCache input ui
      limitCacheSizeCheckbox: false,
      limitCacheSizeValue: '1.00',
      userLimitCacheSizeCheckbox: false,
      userLimitCacheSizeValue: '1.00',
      userLimitCacheSizeValueManualChange: false,
      firstLoad: true
    };
    autobind(this);
    this.handleLoadGroupsIA = debounce(this.handleLoadGroupsIA.bind(this), 500);
    this.handleLoadUsers = debounce(this.handleLoadUsers.bind(this), 500);
    this.handleGroupSearchChange = debounce(this.handleGroupSearchChange.bind(this), 500);
    this.listWrapper = null;
    this.checkBulkUploadInterval = null;
  }

  UNSAFE_componentWillMount() {
    // Load conf bundle for user Edit/ Details
    if (!this.props.confBundleLoaded) {
      this.props.loadConfigurationBundles();
    }

    if (!this.props.allUserTotal) {
      this.props.getUserTotal();
    }

    if (!this.props.metadataLoaded) {
      this.props.loadMetadata();
    }

    if (!this.props.allGroupsListLoaded) {
      this.props.loadAllGroups(0, null, null, 'ALL_GROUPS_LIST');
    }

    if (!this.props.userDefaultSettingsLoaded) {
      this.props.loadUserDefaultSettings();
    }

    if (this.props.loadUserDefaultNotifications) {
      this.props.loadUserDefaultNotifications();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      usersError,
      groupsIAError,
      groupSelected,
      saved,
      deleted,
      error,
    } = this.props;

    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);

    if (!nextProps.allGroupsListLoading && this.props.allGroupsListLoading) {
      this.setState({
        allGroupsList: Object.assign([], nextProps.allGroupsList)
      });
    }

    // Groups error
    const prevError = error ? error.message : '';
    if (nextProps.error && nextProps.error.message && (nextProps.error.message !== prevError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Groups error
    const prevGroupError = usersError ? usersError.message : '';
    if (nextProps.usersError && nextProps.usersError.message && (nextProps.usersError.message !== prevGroupError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.usersError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    const prevGroupsIAError = groupsIAError ? groupsIAError.message : '';
    if (nextProps.groupsIAError && nextProps.groupsIAError.message && (nextProps.groupsIAError.message !== prevGroupsIAError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.groupsIAError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Resend invitation email
    if (!this.props.invitationSent && nextProps.invitationSent) {
      this.props.createPrompt({
        id: uniqueId('sent-'),
        type: 'success',
        message: strings.emailHasBeenSent,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // User password unlocked
    if (!this.props.unlockPasswordSaved && nextProps.unlockPasswordSaved) {
      this.props.createPrompt({
        id: uniqueId('unlocked-'),
        type: 'success',
        message: strings.userAccountUnlocked,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Load Users if Group selected is changed
    if (!nextProps.usersLoading && !this.props.loading && groupSelected && nextProps.groupSelected && nextProps.groupSelected.name && nextProps.groupSelected.name !== groupSelected.name) {
      this.props.setData({
        userSelected: {},
        usersComplete: false
      });
      this.props.loadUsers(0, nextProps.groupSelected.id, '');
    }

    // User defaults - close modal
    if (!this.props.userDefaultSettingsSaved && nextProps.userDefaultSettingsSaved) {
      if (this.state.userDefaultSettingsModalVisible) this.handleToggleUserDefaultModal();
      if (groupSelected.name) {
        this.props.loadUsers(0, groupSelected.id, ''); // Reload user details
      }
    }

    // Close modal after save
    if ((!saved && nextProps.saved || !deleted && nextProps.deleted)) {
      if (this.state.isGroupModalVisible) this.handleToggleGroupModal();
      if (this.state.isUserModalVisible) this.handleToggleUserModal();

      if (!saved && nextProps.saved) {
        this.props.createPrompt({
          id: uniqueId('saved-'),
          type: 'success',
          message: strings.savedSuccessfully,
          dismissible: true,
          autoDismiss: 5
        });
      } else if (!deleted && nextProps.deleted) {
        this.props.createPrompt({
          id: uniqueId('deleted-'),
          type: 'success',
          message: strings.successfullyDeleted,
          dismissible: true,
          autoDismiss: 5
        });
      }
    }

    if ((!this.props.isCsvUserCreated && nextProps.isCsvUserCreated) || (!this.props.isCsvUserDeleted && nextProps.isCsvUserDeleted)) {
      this.props.getUserTotal();
      this.props.loadAllGroups(0, null, null, 'ALL_GROUPS_LIST');
      if (groupSelected.name) {
        this.props.loadUsers(0, groupSelected.id, ''); // Reload user details
      }
      this.props.setData({
        userSelected: {},
        usersComplete: false
      });
    }

    if (!this.props.userDefaultNotificationsSaved && nextProps.userDefaultNotificationsSaved) {
      this.setState({
        userDefaultNotifications: {}
      });
    }

    if (_get(this.props, 'bulkImportStatus.status', '') !== 'processing' &&
        _get(nextProps, 'bulkImportStatus.status', '') === 'processing' &&
        (this.state.userDefaultBulkUploadModalVisible || this.state.adminBulkUserImportVisibleUrl)) {
      this.handleClearInterval();
      this.checkBulkUploadInterval = window.setInterval(this.handleGetStatus, 5000);
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const {
      graphId,
      isGraphEnabled
    } = this.state;

    // Fetch graph data
    if (nextProps.groupSelected && nextProps.groupSelected.childCount > 0 &&
      (!isGraphEnabled && nextState.isGraphEnabled || (isGraphEnabled && graphId !== nextState.graphId))
    ) {
      const id = nextState.graphId || graphId;
      this.props.loadInterestAreasGraph(id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isEnabledDeviceCacheLimit = _get(this.state, 'userDetails.deviceCacheLimit', false);
    const hasDeviceCacheLimit = _get(this.state, 'userDetails.deviceCacheLimit', false) !== null;
    const hasChangeDeviceCacheLimit = prevState.userDetails.deviceCacheLimit !== this.state.userDetails.deviceCacheLimit;

    // If create/edit user successfully saves
    if (prevProps.saving && this.props.saved && !this.props.saving) {
      this.setState({
        userLimitCacheSizeCheckbox: this.state.initialLimitCacheSizeCheckbox
      });
    }

    // set edit user modal states for limit cache size
    if (isEnabledDeviceCacheLimit !== false && hasDeviceCacheLimit && hasChangeDeviceCacheLimit) {
      const parsed = this.state.userLimitCacheSizeValueManualChange ? parseFloat(this.state.userDetails.deviceCacheLimit) : parseFloat(this.state.userDetails.deviceCacheLimit).toFixed(2);
      const tempObj = { userLimitCacheSizeValue: this.state.userDetails.deviceCacheLimit === '' ? '' : parsed };

      if (!this.state.userLimitCacheSizeValueManualChange) tempObj.userLimitCacheSizeCheckbox = true;

      this.setState({ ...tempObj });

      // set user modal deviceCacheLimit states to minimum 1 for ui
    } else if (isEnabledDeviceCacheLimit === null && hasChangeDeviceCacheLimit) {
      this.setState({
        userLimitCacheSizeCheckbox: false,
        userLimitCacheSizeValue: '1.00'
      });
    }

    const hasPrevDefaultDeviceCacheLimit = _get(prevProps, 'userDefaultSettings.deviceCacheLimit.value', false);
    const hasDefaultDeviceCacheLimit = _get(this.props, 'userDefaultSettings.deviceCacheLimit.value', false);

    // on firstLoad, set state in user default settings for limit cache size ui
    if (this.state.firstLoad && hasPrevDefaultDeviceCacheLimit !== false && hasDefaultDeviceCacheLimit !== false) {
      const newValue = hasDefaultDeviceCacheLimit === null ? '1.00' : hasDefaultDeviceCacheLimit.toFixed(2);
      this.setState({
        initialLimitCacheSizeCheckbox: !!hasDefaultDeviceCacheLimit,
        initialLimitCacheSizeValue: newValue,
        limitCacheSizeCheckbox: !!hasDefaultDeviceCacheLimit,
        limitCacheSizeValue: newValue,
        firstLoad: false
      });
    }

    // After successful user default save, set initialLimitCacheSize and userLimitCacheSize states to new user default deviceCacheLimit values
    if (hasDefaultDeviceCacheLimit !== false &&
      prevProps.userDefaultSettingsSaved !== this.props.userDefaultSettingsSaved &&
      (this.state.limitCacheSizeValue !== this.state.initialLimitCacheSizeValue ||
      this.state.limitCacheSizeValue !== hasDefaultDeviceCacheLimit ||
      this.state.limitCacheSizeCheckbox !== this.state.initialLimitCacheSizeCheckbox)) {
      const newValue = hasDefaultDeviceCacheLimit === null ? '1.00' : parseFloat(hasDefaultDeviceCacheLimit).toFixed(2);
      const tempObj = { ...this.state.userDefaultSettings };
      tempObj.deviceCacheLimit.update = false;
      this.setState({
        limitCacheSizeCheckbox: !!hasDefaultDeviceCacheLimit,
        limitCacheSizeValue: newValue,
        initialLimitCacheSizeCheckbox: !!hasDefaultDeviceCacheLimit,
        initialLimitCacheSizeValue: newValue,
        userDefaultSettings: { ...tempObj }
      });
    }

    if (this.state.firstLoad && hasPrevDefaultDeviceCacheLimit === null) {
      this.setState({
        firstLoad: false
      });
    }
  }

  componentWillUnmount() {
    this.handleClearInterval();
  }

  // All users actions
  handleUserDefaultsClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.handleToggleUserDefaultModal();
  }

  handleUserDefaultNotificationClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.handleToggleUserDefaultNotificationModal();
  }

  handleDefaultMetadataClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('User default Metadata'); // eslint-disable-line
  }

  // Groups function
  handleLoadGroupsIA(offset, keyword) {
    this.props.loadAllGroups(offset,  keyword);
  }

  handleGetGroupIAList(offset) {
    let actualOffset = offset;

    // offset reduced by 1 because of default group called All Users
    if (actualOffset > 0) {
      actualOffset = offset - 1;
    }
    const { groupsIALoading } = this.props;
    if (!groupsIALoading) {
      this.props.loadAllGroups(actualOffset, this.props.groupsIAFilter);
    }
  }

  handleGroupIAFilterChange(event) {
    this.props.setData({ allGroupSearch: event.currentTarget.value });
    this.handleLoadGroupsIA(0, event.currentTarget.value);
  }

  handleGroupIAFilterClear() {
    if (this.props.groupsIAFilter) {
      this.handleLoadGroupsIA(0, '');
    }
  }

  handleGroupIAClick(event, context) {
    this.props.setData({
      groupSelected: {
        id: context.id,
        name: context.name,
        position: context.position,
        childCount: context.childCount,
      },
      userSelected: {}
    });

    this.setState({
      graphId: context.id,
      isGraphEnabled: context.childCount ? this.state.isGraphEnabled : false
    });
  }

  // Group functions
  handleLoadUsers(offset, keyword, filterType) {
    const { groupSelected, usersLoading } = this.props;
    if (groupSelected.name && !usersLoading) {
      this.props.loadUsers(offset, groupSelected.id, keyword, filterType);
    }
  }

  handleUserList(offset) {
    const { usersError, usersLoading, groupSelected } = this.props;

    if (groupSelected.name && !usersLoading && !(usersError && usersError.message)) {
      this.props.loadUsers(offset, groupSelected.id, this.props.userFilter);
    }
  }

  handleGetUserSearchList(offset) {
    const {
      userSearchLoading,
      usersError,
      groupSelected,
    } = this.props;

    if (groupSelected.name && !userSearchLoading && !(usersError && usersError.message)) {
      this.props.loadUsers(offset, groupSelected.id, this.props.userSearch, 'unlinked');
    }
  }

  handleUsersClick(event, context) {
    // Check if we are not clicking on the options
    const dropdown = event.target;
    if (!dropdown.classList.contains('infoDropMenu')) {
      this.props.setData({
        userSelected: {
          ...context,
          id: context.id,
          name: context.name || context.firstname + ' ' + context.lastname,
          position: context.position,
          type: context.type,
          role: context.roleId,
          status: context.status,
          configurationBundle: context.configurationBundle
        }
      });
    }
  }

  handleFilterUserChange(event) {
    this.props.setData({ userFilter: event.currentTarget.value });
    this.handleLoadUsers(0, event.currentTarget.value);
  }

  handleUserFilterClear() {
    if (this.props.userFilter) {
      this.handleLoadUsers(0, '');
    }
  }

  // Group Search list
  handleUserSearchInputChange(event) {
    this.props.setData({ userSearch: event.currentTarget.value });
    this.handleLoadUsers(0, event.currentTarget.value, 'unlinked');
  }

  handleUserSearchClear() {
    this.props.setData({ userSearch: '' });
    this.handleLoadUsers(0, '', 'unlinked');
  }

  handleGroupAddSearchItems(event, items) {
    const list = items.list || items;
    // Insert Items in userList
    this.props.setRelationship({
      group: [this.props.groupSelected.id],
      user: list.map(obj => obj.id),
    }, 'userList', 'add');
  }

  handleResetBoardingExperience() {
    if (this.props.userSelected.id) {
      this.props.saveDetail({
        id: this.props.userSelected.id,
        groupId: this.props.groupSelected.id,
        resetOnboarding: 1
      }, 'user');
    }
  }

  handleResendInvitation() {
    if (this.props.userSelected.id) {
      this.props.sendUserInvitation(this.props.userSelected.id);
    }
  }

  handleUnlockPassword() {
    if (this.props.userSelected.id) {
      this.props.saveDetail({
        id: this.props.userSelected.id,
        groupId: this.props.groupSelected.id,
        accountUnlock: 1
      }, 'user');
    }
  }

  // Groups modal
  handleGroupChange(data) {
    const key = data.key;
    const value = data.value;

    const tmpDetails = Object.assign({}, this.state.groupDetails);
    tmpDetails[key] = value;

    this.setState({
      groupDetails: tmpDetails,
    });
  }

  handleGroupSave(e, context) {
    const data = {
      name: context.name,
      notes: context.notes,
      defaultSortBy: context.defaultSortBy,
      permissions: context.permissions,
      thumbnail: context.thumbnail,
      thumbnailDownloadUrl: context.thumbnailDownloadUrl,
      canSubscribe: context.canSubscribe,
      colour: context.colour,
    };
    if (context.id) data.id = context.id;

    this.props.saveDetail(data, 'group', null, { optionType: 'onlyGroup' });
  }

  handleGroupDelete() {
    if (this.state.groupDetails.id) {
      this.props.deleteItem(this.state.groupDetails.id, 'group');
      this.props.deleteEntity('groups', this.state.groupDetails.id);
    }
    this.handleToggleConfirmGroupDelete();
  }

  handleToggleConfirmGroupDelete() {
    this.setState({
      confirmGroupDelete: !this.state.confirmGroupDelete
    });
  }

  handleToggleGroupModal(event, context) {
    let details = {};
    if (context && context.props && context.props.id) {
      details = context.props;
    }

    this.setState({
      isGroupModalVisible: !this.state.isGroupModalVisible,
      groupDetails: details,
    });
  }

  handleGroupThumbnailClick() {
    const groupDetails = Object.assign({}, this.state.groupDetails);

    if (groupDetails.thumbnail) {
      // Clear thumbnail if one is already set
      groupDetails.thumbnail = '';
      groupDetails.thumbnailDownloadUrl = '';

      this.setState({
        groupDetails: groupDetails,
      });
      // just open Featured image picker to select image
    } else {
      this.setState({
        groupImagePickerModalVisible: true,
        isGroupModalVisible: false,
      });
    }
  }

  // Group Covert Art
  handleGroupImagePickerCancel() {
    this.setState({
      groupImagePickerModalVisible: false,
      isGroupModalVisible: true
    });
  }

  handleGroupImagePickerSave(event, images) {
    if (images && images[0]) {
      // Cover Art
      this.setState({
        groupDetails: { ...this.state.groupDetails, thumbnail: images[0].url, thumbnailDownloadUrl: images[0].download_location },
        groupImagePickerModalVisible: false,
        isGroupModalVisible: true,
      });
    }
  }

  // Unlink users
  handleToggleConfirmRemoveUser(event, details) {
    let data = {};
    if (details) data = details.id ? details : details.channel;

    this.setState({
      userDetails: data,
      confirmRemoveUser: !this.state.confirmRemoveUser
    });
  }

  handleRemoveUserClick() {
    this.props.setRelationship({
      group: [this.props.groupSelected.id],
      user: [-this.state.userDetails.id],
    }, 'userList', 'remove');

    this.setState({
      confirmRemoveUser: !this.state.confirmRemoveUser
    });
  }

  // User Modal
  handleToggleUserModal(event, context, action = '') {
    const {
      enablePersonalReports,
      enableCompanyReports,
      enableAdvancedReports,
      enableScheduledReports,
      configurationBundle,
      language,
      platforms,
      privateActivity,
      digestEmail,
      storyPromoting,
      timezone,
    } = this.props.userDefaults;

    let details = {};
    if (context && context.props && context.props.id) {
      details = { ...context.props };
      details.deviceCacheLimit = context.props.deviceCacheLimit ? parseFloat(details.deviceCacheLimit) : null;
    } else {
      // Set userDefaults
      const groupSelected = this.state.allGroupsList ? this.state.allGroupsList.find((obj) => (obj.id === this.props.groupSelected.id)) : {};

      const nPlatform = {};
      Object.keys(platforms).map((obj) => {
        nPlatform[obj] = platforms[obj].enabled; // eslint-disable-line
        return obj;
      });

      let isUserAdvancedReports = enableAdvancedReports;
      let isUserScheduledReports = enableScheduledReports;
      if (!_isEmpty(this.state.userDefaultSettings)) {
        if (!this.state.userDefaultSettings.enableCompanyReports.value) isUserAdvancedReports = false;
        if (!this.state.userDefaultSettings.enableCompanyReports.value) isUserScheduledReports = false;
      }

      details = {
        enablePersonalReports: enablePersonalReports,
        enableCompanyReports: enableCompanyReports,
        enableAdvancedReports: isUserAdvancedReports,
        enableScheduledReports: isUserScheduledReports,
        roleId: 0,
        configurationBundle: configurationBundle,
        langCode: language,
        platform: nPlatform,
        privateActivity: privateActivity,
        digestEmail: digestEmail,
        storyPromoting: storyPromoting,
        tz: timezone,
        groups: groupSelected ? [groupSelected] : [], // pre select group
        deviceCacheLimit: this.props.userDefaultSettings.deviceCacheLimit.value
      };
    }

    // Reset Group list and load All groups on close
    if (this.state.isUserModalVisible) {
      this.props.loadAllGroups(0, null, null, 'ALL_GROUPS_LIST');
    }

    this.setState({
      isUserModalVisible: !this.state.isUserModalVisible,
      userDetails: details,
      userLimitCacheSizeValueManualChange: false
    });

    if (action === 'cancel') {
      this.setState({
        userLimitCacheSizeCheckbox: !!this.state.userDetails.deviceCacheLimit
      });
    }
  }

  handleUserSave(e, context) {
    const data = {
      firstname: context.firstname,
      lastname: context.lastname,
      email: context.email,
      jobTitle: context.jobTitle,
      langCode: context.langCode,
      tz: context.tz,
      roleId: context.roleId,
      groups: context.groups,
      status: context.status,
      configurationBundle: context.configurationBundle,
      storyPromoting: context.storyPromoting,
      digestEmail: context.digestEmail,
      platform: context.platform,
      sendInvite: context.sendInvite,

      enablePersonalReports: context.enablePersonalReports,
      enableCompanyReports: context.enableCompanyReports,
      enableAdvancedReports: context.enableAdvancedReports,
      enableScheduledReports: context.enableScheduledReports,
      groupId: this.props.groupSelected.id,
      lmsPermissions: context.lmsPermissions,

      deviceCacheLimit: this.state.userLimitCacheSizeCheckbox ? (context.deviceCacheLimit || this.state.userLimitCacheSizeValue) : null
    };
    if (context.id) data.id = context.id;
    if (context.newPassword || context.confirmPassword) {
      data.newPassword = context.newPassword;
      data.confirmPassword = context.confirmPassword;
    }
    if (context.metadata) {
      data.metadata = context.metadata.map(obj => obj.id);
    }

    if (this.state.userLimitCacheSizeValue < 1) {
      const { formatMessage } = this.context.intl;
      const { naming } = this.context.settings;
      const strings = generateStrings(messages, formatMessage, naming);
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: strings.deviceCacheLimitMinimum,
        dismissible: true,
        autoDismiss: 5
      });
    } else {
      this.props.saveDetail(data, 'user');
    }
  }

  // User Modal internal functions
  handleGroupSearchChange(event) {
    const { value } = event.currentTarget;

    if (typeof this.props.loadAllGroups === 'function') {
      this.props.loadAllGroups(0, value, null, 'ALL_GROUPS_LIST');
      this.setState({ allGroupsListKeyword: value });
    }
  }

  handleUserGroupListScroll(event) {
    const {
      allGroupsList,
      allGroupsListComplete,
      allGroupsListLoading,
    } = this.props;
    const target = event.currentTarget;
    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger) {
      // Load more
      if (scrollBottom >= loadTrigger && !allGroupsListComplete && !allGroupsListLoading) {
        // Load more
        if (this.props.loadAllGroups) {
          this.props.loadAllGroups(allGroupsList.length, this.state.allGroupsListKeyword, null, 'ALL_GROUPS_LIST');
        }
      }
    }
  }

  handleRemoveUserGroup(id) {
    const { allGroupsList, userDetails } = this.state; // User groups selected
    const item = Object.assign({}, allGroupsList.find((obj) => obj.id === id));
    if (item) {
      item.isSelected = false;
    }
    let groups = userDetails.groups;

    groups = groups.filter(obj => Number(obj.id) !== Number(id)); // Un-select group

    this.setState({
      allGroupsList: Object.assign([], allGroupsList),
      userDetails: {
        ...userDetails,
        groups: groups
      }
    });
  }

  handleAddUserGroup(id) {
    const { allGroupsList, userDetails } = this.state;
    const groups = userDetails.groups || [];
    const item = Object.assign({}, allGroupsList.find(obj => obj.id === Number(id)));

    if (item) item.isSelected = true;

    this.setState({
      allGroupsList: Object.assign([], allGroupsList),
      userDetails: {
        ...userDetails,
        groups: [...groups, item]
      }
    });
  }

  handleUserChange(data) {
    const key = data.key;
    const value = data.value;
    const type = data.type;

    const tmpDetails = Object.assign({}, this.state.userDetails);
    if (key === 'platform') {
      if (!tmpDetails[key]) tmpDetails[key] = {};
      tmpDetails[key][type] = value;
    } else {
      tmpDetails[key] = value;
    }

    if (key === 'enableCompanyReports' && !value) {
      tmpDetails.enableAdvancedReports = false;
      tmpDetails.enableScheduledReports = false;
    }
    if (key === 'enableAdvancedReports' && value || key === 'enableScheduledReports') tmpDetails.enableCompanyReports = true;

    this.setState({
      userDetails: tmpDetails,
    });
  }

  handleToggleIsAdministrator(event) {
    const { userDetails } = this.state;
    const groups = userDetails.groups || [];
    const item = groups.find(obj => obj.id === Number(event.currentTarget.value));
    if (item) item.isGroupAdmin = !!event.currentTarget.checked;

    this.setState({
      userDetails: {
        ...userDetails,
        groups: [...groups]
      }
    });
  }

  // Delete users
  handleUserDelete() {
    if (this.state.userDetails.id) {
      this.props.deleteItem(this.state.userDetails.id, 'user', { groupId: this.props.groupSelected.id });
      this.props.deleteEntity('users', this.state.userDetails.id);
    }
    this.handleToggleConfirmUserDelete();
  }

  handleToggleConfirmUserDelete() {
    this.setState({
      confirmUserDelete: !this.state.confirmUserDelete
    });
  }

  // User defaults Modal
  handleToggleUserDefaultModal(action = '') {
    const {
      initialLimitCacheSizeCheckbox,
      initialLimitCacheSizeValue,
      userDefaultSettingsModalVisible
    } = this.state;
    const {
      userDefaultSettingsSaved,
      userDefaultSettings
    } = this.props;

    if (action === 'cancel') {
      const tempObj = { ...this.state.userDefaultSettings };
      tempObj.deviceCacheLimit.value = initialLimitCacheSizeCheckbox ? initialLimitCacheSizeValue : null;
      tempObj.deviceCacheLimit.update = false;
      this.setState({
        limitCacheSizeCheckbox: initialLimitCacheSizeCheckbox,
        limitCacheSizeValue: initialLimitCacheSizeValue
      });
    }
    // Reset update checkboxes
    if (userDefaultSettingsModalVisible && !userDefaultSettingsSaved) {
      this.props.resetUserDefaultSettings();
    }

    this.setState({
      userDefaultSettings: userDefaultSettings,
      userDefaultSettingsModalVisible: !userDefaultSettingsModalVisible,
    });
  }

  handleToggleUserDefaultNotificationModal() {
    this.setState({
      userDefaultNotificationModalVisible: !this.state.userDefaultNotificationModalVisible,
      userDefaultNotifications: {},
    });
  }

  handleUserDefaultNotificationSave() {
    if (this.props.setUserDefaultNotifications && !_isEmpty(this.state.userDefaultNotifications)) {
      this.props.setUserDefaultNotifications(this.state.userDefaultNotifications);
    }
    this.handleToggleUserDefaultNotificationModal();
  }

  handleUserDefaultNotificationUpdate(userDefaultNotifications) {
    this.setState({
      userDefaultNotifications,
    });
  }

  handleUserDefaultChange(data) {
    const key = data.key;
    let defaultValue = {};
    if (key !== 'deviceCacheLimit') {
      defaultValue = {
        value: data.value,
        update: this.props.userDefaultSettings[data.key] ? this.props.userDefaultSettings[data.key].update : false
      };
    }

    switch (data.key) {
      case 'platform': {
        // Update platform object
        const tmpPlatforms = Object.assign({}, this.props.userDefaultSettings.platform);
        if (data.attribute === 'update') {
          tmpPlatforms.update = !!data.value;
        } else {
          tmpPlatforms.value[data.type].enabled = !!data.value;
        }
        defaultValue = tmpPlatforms;
        break;
      }
      case 'reporting': {
        // Update reporting object
        const tmpData = Object.assign({}, this.props.userDefaultSettings[key]);
        if (data.attribute === 'update') {
          tmpData.update = !!data.value;
        } else {
          tmpData.value[data.type] = !!data.value;
        }
        defaultValue = tmpData;
        break;
      }
      case 'deviceCacheLimit': {
        const tempData = { ...this.props.userDefaultSettings.deviceCacheLimit };
        if (data.attribute === 'update') {
          tempData.update = data.value;
        } else if (typeof data.value === 'number') {
          const parsed = parseFloat(data.value);
          this.handleLimitCacheValueChange(parsed);
          if (this.state.limitCacheSizeCheckbox) {
            tempData.value = parseFloat(data.value);
          }
        } else if (this.props.userDefaultSettings.deviceCacheLimit.value === null) {
          tempData.value = 1.00;
        }
        defaultValue = tempData;
        break;
      }
      default:
        if (data.attribute === 'update') {
          // Set update flag
          defaultValue.value = this.props.userDefaultSettings[key].value;
          defaultValue.update = data.value;
        }
        break;
    }

    const tmpUserDetails = this.props.userDefaultSettings;
    tmpUserDetails[key] = defaultValue;

    const isCompanyReport = data.key === 'enableCompanyReports';
    const isScheduledReport = data.key === 'enableScheduledReports';
    const isAdvancedReport = data.key === 'enableAdvancedReports';
    if (isCompanyReport && !data.value) {
      tmpUserDetails.enableAdvancedReports = { value: false, update: false };
      tmpUserDetails.enableScheduledReports = { value: false, update: false };
    } else if ((isScheduledReport || isAdvancedReport) && data.value) {
      tmpUserDetails.enableCompanyReports = { value: true, update: false };
    }

    this.setState({
      userDefaultSettings: tmpUserDetails,
    });
  }

  handleUserDefaultSave() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    if (this.state.limitCacheSizeValue < 1) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: strings.deviceCacheLimitMinimum,
        dismissible: true,
        autoDismiss: 5
      });
    } else if (typeof this.props.setUserDefaultSettings === 'function') {
      this.props.setUserDefaultSettings(this.state.userDefaultSettings);
    }
  }

  handleLimitCacheValueChange(value) {
    this.setState({
      limitCacheSizeValue: value
    });
  }

  handleToggleLimitCacheSize() {
    const {
      limitCacheSizeCheckbox,
      limitCacheSizeValue
    } = this.state;
    this.setState({
      limitCacheSizeCheckbox: !limitCacheSizeCheckbox
    }, () => {
      const tempObj = { ...this.state.userDefaultSettings };
      tempObj.deviceCacheLimit.value = this.state.limitCacheSizeCheckbox ? limitCacheSizeValue : null;
      this.setState({
        userDefaultSettings: { ...tempObj }
      });
    });
  }

  handleUserLimitCacheValueChange(value) {
    this.setState({
      userLimitCacheSizeValue: value
    });
  }

  handleUserToggleLimitCacheSize() {
    this.setState({
      userLimitCacheSizeCheckbox: !this.state.userLimitCacheSizeCheckbox
    });
  }

  handleToggleUserLimitCacheValueManualChange() {
    this.setState({
      userLimitCacheSizeValueManualChange: true
    });
  }

  handleBlur(value, state) {
    if (typeof value === 'number') {
      this.setState({
        [state]: parseFloat(value).toFixed(2)
      });
    }
  }


  //Panel Functions
  handleOpenGraph(e, context) {
    this.setState({
      isGraphEnabled: true,
      graphId: context.itemSelected.id
    });
  }

  handleCloseGraph() {
    this.setState({
      isGraphEnabled: false,
    });
  }

  /*
   * bulk upload function
   */
  handleToggleUserDefaultBulkUploadModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.state.userDefaultBulkUploadModalVisible && this.props.getBulkImportStatus) {
      this.props.getBulkImportStatus();
    }

    if (this.state.userDefaultBulkUploadModalVisible) {
      this.handleClearInterval();
    }
    this.setState({
      userDefaultBulkUploadModalVisible: !this.state.userDefaultBulkUploadModalVisible,
    });
  }

  // for accessing bulk user uploader by url
  handleToggleAdminBulkUserImportUrl(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.state.adminBulkUserImportVisibleUrl) {
      this.handleClearInterval();
    }

    this.setState({
      adminBulkUserImportVisibleUrl: !this.state.adminBulkUserImportVisibleUrl
    });
  }

  handleCsvValidate(overrideSettings, isDelete) {
    if (isDelete) {
      this.props.validateDeleteUsers(overrideSettings);
    } else {
      this.props.validateCsvUsers(overrideSettings);
    }
  }

  handleCsvSave(overrideSettings, isDelete) {
    if (isDelete) {
      this.props.validateDeleteUsers({
        user_emails: this.props.validEmails
      });
    } else {
      this.props.validateCsvUsers({
        ...overrideSettings,
        dry_run: 0
      });
    }
  }

  handleFileDropRejected() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    this.props.createPrompt({
      id: uniqueId('error-'),
      type: 'error',
      message: strings.fileSizeError,
      dismissible: true,
      autoDismiss: 5
    });
  }

  handleGetStatus() {
    if (_get(this.props, 'bulkImportStatus.status', '') === 'processing' &&
        this.props.getBulkImportStatus &&
        this.state.userDefaultBulkUploadModalVisible) {
      this.props.getBulkImportStatus();
    }
  }

  handleClearInterval() {
    if (this.checkBulkUploadInterval) {
      window.clearInterval(this.checkBulkUploadInterval);
    }
  }

  renderList() {
    const {
      groupsIA,
      groupsIALoading,
      groupsIAComplete,
      groupSelected,

      users,
      usersLoading,
      usersComplete,
      userSelected,
      userFilter,

      userSearch,
      userSearchList,
      userSearchLoading,
      userSearchComplete,

      userDefaultNotifications,

      className,
      style,
    } = this.props;
    const styles = require('./AdminUsers.less');
    const { formatMessage } = this.context.intl;
    const { authString, naming, user, userCapabilities } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const columnWidth = 300;

    const listLeftPosition = this.state.isGraphEnabled ? 0 : 15;

    let canDelete = false;
    let canCreateGroup = false;
    let canCreateUser = false;
    if ((userCapabilities.isAdmin && !userCapabilities.isGroupAdmin) || (userCapabilities.isGroupAdminAdvanced)) {
      canCreateGroup = true;
      if (userCapabilities.isGroupAdminAdvanced && !userCapabilities.isAdmin) canCreateGroup = false;
      if (userCapabilities.isAdmin) canDelete = true;
    }
    if (userCapabilities.canAddUser || userCapabilities.isAdmin || userCapabilities.isGroupAdminAdvanced) {
      canCreateUser = true;
    }
    // User details arrays
    const roles = [
      { id: 0, name: strings.user },
      { id: 2, name: strings.structureAdministrator },
      { id: 4, name: strings.administrator },
      { id: 7, name: strings.companyManager },
      { id: 10, name: strings.superUser },
    ];

    const digestEmailOptions = [
      { id: 0, name: strings.never },
      { id: 1, name: strings.daily },
      { id: 2, name: strings.weekly },
      { id: 3, name: strings.monthly }
    ];

    const statusList = [
      { id: 'invited', name: strings.invited, disable: true }, //shows only if user status is invited
      { id: 'active', name: strings.active },
      { id: 'inactive', name: strings.inactive },
      { id: 'renew_password', name: strings.forcePasswordChange, disable: true }, //auth_type == 'db'
    ];

    // All users buttons
    const tmpAllUsers = { ...this.props.allUsers };
    tmpAllUsers.name = strings.allUsers;
    tmpAllUsers.onUserDefaultsClick = this.handleUserDefaultsClick;
    tmpAllUsers.onUserDefaultNotificationsClick = this.handleUserDefaultNotificationClick;
    tmpAllUsers.onDefaultMetadataClick = this.handleDefaultMetadataClick;
    tmpAllUsers.onBulkUploadClick = this.handleToggleUserDefaultBulkUploadModal;

    const tmpGroups = [tmpAllUsers].concat(groupsIA);
    return (
      <div
        ref={(node) => { this.listWrapper = node; }}
        className={className}
        style={style}
      >
        <AdminManageList
          authString={authString}
          list={tmpGroups}
          headerTitle={strings.groups}
          width={columnWidth}
          placeholder={strings.selectGroup}
          itemSelected={groupSelected}

          //showGraph={groupSelected.childCount > 0}
          onGraphClick={this.handleOpenGraph}
          onItemClick={this.handleGroupIAClick}

          isLoaded={groupsIA.length > 1}
          isLoading={groupsIALoading}
          isLoadingMore={groupsIALoading && groupsIA.length > 1 && !groupsIAComplete}
          isComplete={groupsIAComplete}
          onGetList={this.handleGetGroupIAList}

          showCreate={canCreateGroup}
          onCreateClick={this.handleToggleGroupModal}

          showEdit
          onEditClick={this.handleToggleGroupModal}
          showFilter
          filterValue={this.props.groupsIAFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleGroupIAFilterChange}
          onFilterClear={this.handleGroupIAFilterClear}

          style={{ position: 'absolute', left: listLeftPosition, top: 0 }}
          className={styles.CustomTab}

          noResultsPlaceholder={strings.noGroupsFound}
        />

        <AdminManageList
          authString={authString}
          list={users}
          headerTitle={strings.users}
          width={columnWidth}
          placeholder={strings.selectUser}
          itemSelected={userSelected}
          initialState={!(groupSelected && groupSelected.name)}
          hidePlaceholderArrow
          //showGraph
          //onGraphClick={this.handleOpenGraph}

          onItemClick={this.handleUsersClick}

          isLoaded={users.length > 1}
          isLoading={usersLoading}
          isLoadingMore={usersLoading && users.length > 1 && !usersComplete}
          isComplete={usersComplete}
          onGetList={this.handleUserList}

          addExistingLabel={strings.addExistingUsers}
          showExisting={!!groupSelected.id}

          showFilter
          filterValue={userFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleFilterUserChange}
          onFilterClear={this.handleUserFilterClear}

          showCreate={canCreateUser}
          onCreateClick={this.handleToggleUserModal}

          showEdit
          onEditClick={this.handleToggleUserModal}

          showUnlink={this.props.groupSelected && !!this.props.groupSelected.id}
          onUnlinkClick={this.handleToggleConfirmRemoveUser}

          showSearch={!!groupSelected.id}
          searchList={userSearchList}
          searchInputValue={userSearch}
          searchInputPlaceholder={strings.addUsers}
          searchListHeader={strings.selectUser}
          isSearchLoaded={userSearchList.length > 1}
          isSearchLoading={userSearchLoading}
          isSearchLoadingMore={userSearchLoading && userSearchList.length > 1 && !userSearchComplete}
          isSearchComplete={userSearchComplete}
          onGetSearchList={this.handleGetUserSearchList}
          onSearchChange={this.handleUserSearchInputChange}
          onSearchClear={this.handleUserSearchClear}
          onAddClick={this.handleGroupAddSearchItems}
          saved={this.props.saved}
          saving={this.props.saving}
          addTotalItemType="user"

          style={{ position: 'absolute', left: (300 + listLeftPosition), top: 0 }}
          noResultsPlaceholder={strings.noUsersFound}
        />

        {userSelected && userSelected.id && <AdminUserDetails
          {...userSelected}
          timezone={userSelected.tz}
          role={roles.find(item => item.id === Number(userSelected.roleId)).name}
          status={statusList.find(item => item.id === userSelected.status).name}
          configurationBundle={this.props.confBundle.find(item => item.id === Number(userSelected.configurationBundle)) || {}}

          showResetBoardingExperience
          showResendInvitation
          showUnlockPassword={userSelected.isLocked}
          unlockPasswordSaving={this.props.unlockPasswordSaving}
          resendInvitationLoading={this.props.invitationSending}
          resetOnboardingExperienceLoading={this.props.resetOnboardingExperienceLoading}
          unlockPasswordLoading={this.props.unlockPasswordLoading}
          onResetBoardingExperienceClick={this.handleResetBoardingExperience}
          onResendInvitationClick={this.handleResendInvitation}
          onUnlockPasswordClick={this.handleUnlockPassword}

          style={{ position: 'absolute', left: 600 + listLeftPosition, top: 0 }}
        />}

        {this.state.isGroupModalVisible && <AdminGroupModal
          showPermissions={false}
          isVisible={this.state.isGroupModalVisible}
          loading={this.props.saving || this.props.deleting}
          showDelete={canDelete && !!this.state.groupDetails.id && !this.state.groupDetails.childCount}
          onDelete={this.handleToggleConfirmGroupDelete}
          onChange={this.handleGroupChange}
          onClose={this.handleToggleGroupModal}
          onSave={this.handleGroupSave}
          onThumbnailClick={this.handleGroupThumbnailClick}
          {...this.state.groupDetails}
        />}
        {this.state.isUserModalVisible && <AdminUserModal
          languageList={this.props.languages}
          digestEmailOptions={digestEmailOptions}
          statusOptions={statusList.filter(item => !item.disable)}
          configurationBundleList={this.props.confBundle}
          isVisible
          onChange={this.handleUserChange}
          onClose={(e) => this.handleToggleUserModal(e, null, 'cancel')}

          limitedView={this.state.userDetails.id && ((userCapabilities.isGroupAdmin && !(userCapabilities.isGroupAdminAdvanced || userCapabilities.isAdmin)) || this.state.userDetails.roleId > user.roleId)}
          loading={this.props.saving || this.props.deleting}
          showDelete={canDelete && !!this.state.userDetails && !!this.state.userDetails.id}
          onDelete={this.handleToggleConfirmUserDelete}

          groupList={this.state.allGroupsList}
          {...this.state.userDetails}

          metadataAttributes={this.props.metadata}
          metadataListSelected={this.state.userDetails.metadata}
          metadataValues={this.props.metadataValues}

          userLimitCacheSizeCheckbox={this.state.userLimitCacheSizeCheckbox}
          userLimitCacheSizeValue={this.state.userLimitCacheSizeValue}
          onHandleUserToggleLimitCacheSize={this.handleUserToggleLimitCacheSize}
          onHandleUserLimitCacheValueChange={this.handleUserLimitCacheValueChange}
          onHandleToggleUserLimitCacheValueManualChange={this.handleToggleUserLimitCacheValueManualChange}
          onHandleBlur={this.handleBlur}

          onSave={this.handleUserSave}
          onScroll={this.handleUserGroupListScroll}
          onAddGroupItem={this.handleAddUserGroup}
          onRemoveGroupItem={this.handleRemoveUserGroup}
          onGroupSearchChange={this.handleGroupSearchChange}
          onToggleIsAdministrator={this.handleToggleIsAdministrator}
        />}
        {this.state.confirmUserDelete && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteUserMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmUserDelete}
          onConfirm={this.handleUserDelete}
        />}
        {this.state.confirmRemoveUser && <Dialog
          title={strings.confirmRemoveUserHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.remove}
          onCancel={this.handleToggleConfirmRemoveUser}
          onConfirm={this.handleRemoveUserClick}
        >
          <FormattedMessage
            id="confirm-remove-user-message"
            defaultMessage={'This action only removes "{name}" from the "{groupName}". "{name}" will still be available in other Groups it is a member of.'}
            values={{ name: this.state.userDetails.name, groupName: this.props.groupSelected.name, ...naming }}
            tagName="p"
          />
        </Dialog>}
        {/* Image Pickers */}
        {/* Group Image Picker Modal */}
        {this.state.groupImagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleGroupImagePickerCancel}
          onSave={this.handleGroupImagePickerSave}
        />}
        {this.state.userDefaultSettingsModalVisible && <AdminUserDefaultsModal
          languageList={this.props.languages}
          digestEmailOptions={digestEmailOptions}
          configurationBundleList={this.props.confBundle}
          isVisible={this.state.userDefaultSettingsModalVisible}
          onChange={this.handleUserDefaultChange}
          onSave={this.handleUserDefaultSave}
          onClose={() => this.handleToggleUserDefaultModal('cancel')}
          loading={this.props.userDefaultSettingsLoading || this.props.userDefaultSettingsSaving}
          onToggleLimitCacheSize={this.handleToggleLimitCacheSize}
          onHandleLimitCacheValueChange={this.handleLimitCacheValueChange}
          onHandleBlur={this.handleBlur}
          limitCacheSizeCheckbox={this.state.limitCacheSizeCheckbox}
          limitCacheSizeValue={this.state.limitCacheSizeValue}
          {...this.props.userDefaultSettings}
          notifications={this.props.userDefaultSettingsNotifications}
        />}
        <AdminUserDefaultNotificationModal
          isVisible={this.state.userDefaultNotificationModalVisible}
          onSave={this.handleUserDefaultNotificationSave}
          onClose={this.handleToggleUserDefaultNotificationModal}
          onChange={this.handleUserDefaultNotificationUpdate}
          notifications={{
            ...userDefaultNotifications,
            ...this.state.userDefaultNotifications
          }}
        />
        {this.state.confirmGroupDelete && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteGroupMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmGroupDelete}
          onConfirm={this.handleGroupDelete}
        />}
        {/* While this feature is still being developed, changed this to be accessable by url only */}
        {/* {this.state.userDefaultBulkUploadModalVisible &&
        <AdminBulkUserImport
          type="user_import"
          showSampleFiles
          onModalUploadClose={this.handleToggleUserDefaultBulkUploadModal}
          getUserTotal={this.props.getUserTotal}
        />} */}

        {/* Allow users to access bulk user upload by url */}
        <Switch>
          <Route
            exact
            path="/admin/users/admin-bulk-user-import"
          >
            {this.state.adminBulkUserImportVisibleUrl &&
            <AdminBulkUserImport
              type="user_import"
              showSampleFiles
              onModalUploadClose={this.handleToggleAdminBulkUserImportUrl}
              getUserTotal={this.props.getUserTotal}
            />}
          </Route>
        </Switch>
      </div>
    );
  }

  renderGraph() {
    const columnWidth = 300;

    return (
      <AdminVisualiseRelationships
        list={this.props.graph}
        width={columnWidth}
        loading={this.props.graphLoading}
        showLegend
        showZoom
      />
    );
  }

  render() {
    const {
      isGraphEnabled
    } = this.state;

    if (isGraphEnabled) {
      return (
        <AdminPanels
          primaryPanel={this.renderList()}
          secondaryPanel={this.renderGraph()}
          onClose={this.handleCloseGraph}
        />
      );
    }

    return (
      this.renderList()
    );
  }
}
