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

import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import AdminConfBundleEdit from 'containers/AdminConfBundleEdit/AdminConfBundleEdit';
import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminUserModal from 'components/Admin/AdminManageList/Modals/AdminUserModal';
import Dialog from 'components/Dialog/Dialog';

//redux
import {
  deleteConfigurationBundle,
  deleteItem,
  loadAllGroups,
  loadBundleUsers,
  loadConfigurationBundles,
  loadMetadata,
  saveDetail,
  setData,
} from 'redux/modules/admin/structure';
import {
  deleteEntity,
} from 'redux/modules/entities/entities';
import { createPrompt } from 'redux/modules/prompts';

const messages = defineMessages({
  configurationBundles: { id: 'configuration-bundles', defaultMessage: 'Configuration Bundles' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  selectConfBundle: { id: 'select-conf-bundle', defaultMessage: 'Select Conf. Bundle' },
  config: { id: 'config', defaultMessage: 'Config' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  user: { id: 'user', defaultMessage: 'User' },
  users: { id: 'users', defaultMessage: 'Users' },
  selectUser: { id: 'select-user', defaultMessage: 'Select user' },
  confirmDelete: { id: 'confirm-delete', defaultMessage: 'Confirm Delete' },
  confirmDeleteBundleMessage: { id: 'confirm-delete-conf-bundle-message', defaultMessage: 'This Configuration Bundle contains {n} Users. Are you sure you want to delete this Configuration Bundle and reassign all users in it?' },
  confirmDeleteUserMessage: { id: 'confirm-delete-user-message', defaultMessage: 'Are you sure you want to delete this User from the System?' },
  successfullyDeleted: { id: 'successfully-deleted', defaultMessage: 'Successfully deleted' },
  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully' },

  never: { id: 'never', defaultMessage: 'Never' },
  daily: { id: 'daily', defaultMessage: 'Daily' },
  weekly: { id: 'weekly', defaultMessage: 'Weekly' },
  monthly: { id: 'monthly', defaultMessage: 'Monthly' },

  active: { id: 'active', defaultMessage: 'Active' },
  inactive: { id: 'inactive', defaultMessage: 'Inactive' },
});

function mapStateToProps(state) {
  const { entities, settings } = state;
  const { structure } = state.admin;
  const confBundleSelected = structure.confBundleSelected.deleted ? {} : structure.confBundleSelected;
  const usersByBundle = structure.usersByBundle;
  const groupSelected = structure.groupSelected.deleted ? {} : structure.groupSelected;

  let users = [];
  if (confBundleSelected.id && usersByBundle && usersByBundle[confBundleSelected.id] && usersByBundle[confBundleSelected.id].userIds) {
    users = usersByBundle[confBundleSelected.id].userIds.map(id => ({
      ...entities.users[id],
      name: entities.users[id].name || entities.users[id].firstname + ' ' + entities.users[id].lastname,
      note: entities.users[id].email
    }));

    if (users.length) users = users.filter(obj => !obj.deleted);
  }

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

  // All groups mapping
  const allGroups = structure.allGroups.map(id => {
    const entity = entities.groups[id];
    entity.showUrl = true;
    return entity;
  });

  return {
    error: structure.error,
    saved: structure.saved,
    saving: structure.saving,
    deleted: structure.deleted,
    deleting: structure.deleting,

    users: users,
    usersComplete: structure.usersByBundleComplete,
    usersError: structure.usersByBundleError,
    usersFilter: structure.usersByBundleFilter,
    usersLoading: structure.usersByBundleLoading,
    userSelected: structure.userByBundleSelected,

    confBundle: structure.confBundle.filter(item => item.status !== 'deleted'),
    confBundleSelected: structure.confBundleSelected,
    confBundleFilter: structure.confBundleFilter,
    confBundleFilterType: structure.confBundleFilterType,
    confBundleLoaded: structure.confBundleLoaded,
    confBundleLoading: structure.confBundleLoading,

    confBundleDetailsSaved: structure.confBundleDetailsSaved,
    confBundleDetailsSaving: structure.confBundleDetailsSaving,

    allGroupsComplete: structure.allGroupsComplete,
    allGroupsLoading: structure.allGroupsLoading,
    allGroupsLoaded: structure.allGroupsLoaded,
    allGroups: allGroups,
    groupSelected: groupSelected,

    metadata: metadata,
    metadataValues: metadataValues,
    metadataLoaded: structure.metadataLoaded,
    metadataLoading: structure.metadataLoading,

    languages: Object.assign({}, settings.languages),
    userDefaults: settings.userDefaults,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    deleteConfigurationBundle,
    deleteItem,
    loadAllGroups,
    loadBundleUsers,
    loadConfigurationBundles,
    loadMetadata,
    saveDetail,
    setData,

    deleteEntity,

    createPrompt,
  })
)
export default class AdminConfBundle extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfBundleEditVisible: false,
      confBundleId: 0,
      showDeleteConfirmation: false,
      confBundleToDelete: 0,
      totalUsersInBundle: 0,
      userDetails: {},
    };
    autobind(this);
    this.handleFilterChange = debounce(this.handleFilterChange.bind(this), 500);
    this.handleLoadUsers = debounce(this.handleLoadUsers.bind(this), 500);
  }

  UNSAFE_componentWillMount() {
    // Load conf bundle for user Edit
    if (!this.props.confBundleLoaded) {
      this.props.loadConfigurationBundles();
    }

    if (!this.props.allGroupsLoaded) {
      this.props.loadAllGroups(0);
    }

    if (!this.props.metadataLoaded) {
      this.props.loadMetadata();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      confBundleSelected,
      error,
      usersLoading,
    } = nextProps;

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { n: '0' });

    // Handle save errors
    if (error && error.message && (!this.props.error || error.message !== this.props.error.message)) {
      this.props.createPrompt({
        id: 'conf-bundle-error',
        type: 'error',
        title: 'Error',
        message: error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    const prevUsersError = this.props.usersError ? this.props.usersError.message : '';
    if (nextProps.usersError && nextProps.usersError.message && (nextProps.usersError.message !== prevUsersError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.usersError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Load Users if Conf Bundle item selected is changed
    if ((!usersLoading && confBundleSelected.id &&
        this.props.confBundleSelected &&
        this.props.confBundleSelected.id && this.props.confBundleSelected.id !== confBundleSelected.id) ||
      (this.props.confBundleSelected.id && this.props.confBundleFilter !== nextProps.confBundleFilter)
    ) {
      this.props.setData({
        userByBundleSelected: {},
        usersByBundleComplete: false
      });

      const confBundleFilter = this.props.confBundleFilterType === 'User' ? nextProps.confBundleFilter : '';
      if (nextProps.confBundleSelected.id) {
        this.props.loadBundleUsers(0, nextProps.confBundleSelected.id, this.props.usersFilter, confBundleFilter);
      }
    }

    // Close modal after save
    if ((!this.props.saved && nextProps.saved || !this.props.deleted && nextProps.deleted)) {
      if (this.state.isUserModalVisible) this.handleToggleUserModal();

      if (nextProps.saved) {
        this.props.createPrompt({
          id: uniqueId('saved-'),
          type: 'success',
          message: strings.savedSuccessfully,
          dismissible: true,
          autoDismiss: 5
        });
      } else if (nextProps.deleted) {
        this.props.createPrompt({
          id: uniqueId('deleted-'),
          type: 'success',
          message: strings.successfullyDeleted,
          dismissible: true,
          autoDismiss: 5
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { n: '0' });

    // Redirect to Conf Bundle Listing if saved
    if (!prevProps.confBundleDetailsSaved && this.props.confBundleDetailsSaved) {
      // Close edit UI
      this.handleEditClose();

      this.props.createPrompt({
        id: uniqueId('saved-conf-'),
        type: 'success',
        message: strings.savedSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleOpenCreate() {
    this.setState({
      isConfBundleEditVisible: !this.state.isConfBundleEditVisible,
      confBundleId: 0
    });
  }

  handleEditClick(event, context) {
    this.setState({
      isConfBundleEditVisible: !this.state.isConfBundleEditVisible,
      confBundleId: context.id
    });
  }

  handleEditClose() {
    this.setState({
      isConfBundleEditVisible: !this.state.isConfBundleEditVisible,
      confBundleId: 0
    });

    // Collapse accordions
    this.props.setData({
      accordionState: {}
    });
  }

  handleClick(event, context) {
    this.props.setData({
      confBundleSelected: {
        id: context.id,
        name: context.name,
        position: context.position,
        type: 'configurationBundle'
      }
    });
  }

  // Delete Bundle
  handleDeleteClick(event, context) {
    this.setState({
      confBundleToDelete: context.id,
      totalUsersInBundle: context.childCount,
      showDeleteConfirmation: !this.state.showDeleteConfirmation
    });
  }

  handleConfirmDeleteBundle() {
    this.props.deleteConfigurationBundle(this.state.confBundleToDelete);

    // Remove selected item from breadcrumb
    if (this.props.confBundleSelected && this.props.confBundleSelected.id === this.state.confBundleToDelete) {
      this.props.setData({
        confBundleSelected: {},
      });
    }

    this.setState({
      confBundleToDelete: 0,
      totalUsersInBundle: 0,
      showDeleteConfirmation: !this.state.showDeleteConfirmation
    });
  }

  handleToggleDialog() {
    this.setState({
      confBundleToDelete: 0,
      showDeleteConfirmation: !this.state.showDeleteConfirmation
    });
  }

  handleFilterChange(filterValue, filterType) {
    const data = {};
    if (filterType) data[filterType] = filterValue;
    this.props.setData({
      confBundleFilter: filterValue,
      confBundleFilterType: filterType,
      confBundleSelected: {},
      usersByBundleFilter: '',
    });
    this.props.loadConfigurationBundles(data);
  }

  handleFilterClear() {
    this.props.setData({
      confBundleFilter: '',
      confBundleFilterType: ''
    });
    this.props.loadConfigurationBundles();
  }

  // User functions
  handleLoadUsers(offset, keyword = null) {
    const {
      confBundleFilter,
      confBundleSelected,
      usersLoading,
    } = this.props;

    if (confBundleSelected.id && !usersLoading) {
      const parentFilter = this.props.confBundleFilterType === 'User' ? confBundleFilter : '';
      this.props.loadBundleUsers(offset, confBundleSelected.id, keyword, parentFilter);
    }
  }

  handleGetUserList(offset) {
    const {
      confBundleFilter,
      confBundleSelected,
      usersError,
      userFilter,
      usersLoading,
    } = this.props;

    if (confBundleSelected.id && !usersLoading && !(usersError && usersError.message)) {
      const parentFilter = this.props.confBundleFilterType === 'User' ? confBundleFilter : '';
      this.props.loadBundleUsers(offset, confBundleSelected.id, userFilter, parentFilter);
    }
  }

  handleUserFilterChange(event) {
    this.props.setData({ usersByBundleFilter: event.currentTarget.value });
    this.handleLoadUsers(0, event.currentTarget.value);
  }

  handleUserFilterClear() {
    this.props.setData({ usersByBundleFilter: '' });
    this.handleLoadUsers(0);
  }

  handleUserClick(event, context) {
    this.props.setData({
      userByBundleSelected: {
        id: context.id,
        name: context.name,
        position: context.position,
        type: 'user'
      },
    });
  }

  // Users modal
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

    if (key === 'enableCompanyReports' && !value) tmpDetails.enableAdvancedReports = false;
    if (key === 'enableAdvancedReports' && value) tmpDetails.enableCompanyReports = true;

    this.setState({
      userDetails: tmpDetails,
    });
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
      groupId: this.props.groupSelected.id,
      lmsPermissions: context.lmsPermissions,
    };
    if (context.id) data.id = context.id;
    if (context.newPassword || context.confirmPassword) {
      data.newPassword = context.newPassword;
      data.confirmPassword = context.confirmPassword;
    }
    if (context.metadata) {
      data.metadata = context.metadata.map(obj => obj.id);
    }

    this.props.saveDetail(data, 'user', 'configurationBundle');
  }

  handleUserDelete() {
    if (this.state.userDetails.id) {
      this.props.deleteItem(this.state.userDetails.id, 'user', {
        parentId: this.state.userDetails.configurationBundle,
        parentType: 'configurationBundle'
      });
      this.props.deleteEntity('users', this.state.userDetails.id);
    }
    this.handleToggleConfirmUserDelete();
  }

  handleToggleConfirmUserDelete() {
    this.setState({
      confirmUserDelete: !this.state.confirmUserDelete
    });
  }

  handleToggleUserModal(event, context) {
    const {
      configurationBundle,
      language,
      platform,
      privateActivity,
      digestEmail,
      storyPromoting,
      timezone,
    } = this.props.userDefaults;

    let details = {};
    if (context && context.props && context.props.id) {
      details = context.props;
    } else {
      // Set userDefaults
      const groupSelected = this.props.allGroups.find((obj) => (obj.id === this.props.groupSelected.id));

      details = {
        roleId: 0,
        configurationBundle: configurationBundle,
        langCode: language,
        platform: platform,
        privateActivity: privateActivity,
        digestEmail: digestEmail,
        storyPromoting: storyPromoting,
        timezone: timezone,
        groups: groupSelected ? [groupSelected] : [] // pre select group
      };
    }

    // Reset Group list and load All groups on open
    if (!this.state.isUserModalVisible) {
      this.props.loadAllGroups(0);
    }

    this.setState({
      isUserModalVisible: !this.state.isUserModalVisible,
      userDetails: details,
      allGroups: this.props.allGroups
    });
  }

  // User Modal internal functions
  handleGroupSearchChange(event) {
    const { value } = event.currentTarget;

    if (typeof this.props.loadAllGroups === 'function') {
      this.props.loadAllGroups(0, value);
      this.setState({ allGroupsKeyword: value });
    }
  }

  handleUserGroupListScroll(event) {
    const {
      allGroups,
      allGroupsComplete,
      allGroupsLoading,
    } = this.props;
    const target = event.currentTarget;
    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger) {
      // Load more
      if (scrollBottom >= loadTrigger && !allGroupsComplete && !allGroupsLoading) {
        // Load more
        if (this.props.loadAllGroups) {
          this.props.loadAllGroups(allGroups.length, this.state.allGroupsKeyword);
        }
      }
    }
  }

  handleRemoveUserGroup(id) {
    const { allGroups, userDetails } = this.state; // User groups selected
    const item = allGroups.find((obj) => obj.id === id);
    if (item) item.selected = false;
    let groups = userDetails.groups;

    groups = groups.filter(obj => Number(obj.id) !== Number(id)); // Un-select group

    this.setState({
      allGroups: [...allGroups],
      userDetails: {
        ...userDetails,
        groups: groups
      }
    });
  }

  handleAddUserGroup(id) {
    const { allGroups, userDetails } = this.state;
    const groups = userDetails.groups || [];
    const item = allGroups.find(obj => obj.id === Number(id));
    if (item) item.selected = true;

    this.setState({
      allGroups: [...allGroups],
      userDetails: {
        ...userDetails,
        groups: [...groups, item]
      }
    });
  }

  render() {
    const {
      confBundle,
      confBundleSelected,
      users,
      usersComplete,
      usersFilter,
      usersLoading,
      userSelected,
      style,
      className,
    } = this.props;
    const { authString, user, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { n: '' + this.state.totalUsersInBundle });
    const columnWidth = 300;

    let canDelete = false;
    if ((userCapabilities.isAdmin && !userCapabilities.isGroupAdmin) ||
      (userCapabilities.isGroupAdminAdvanced)) {
      if (userCapabilities.isAdmin) canDelete = true;
    }

    const digestEmailOptions = [
      { id: 0, name: strings.never },
      { id: 1, name: strings.daily },
      { id: 2, name: strings.weekly },
      { id: 3, name: strings.monthly }
    ];

    const statusList = [
      { id: 'active', name: strings.active },
      { id: 'inactive', name: strings.inactive },
    ];

    const tmpUsers = users.map(element => ({
      ...element,
      showEdit: element.roleId <= user.roleId || userCapabilities.isGroupAdmin
    }));

    return (
      <div
        ref={(node) => { this.listWrapper = node; }}
        className={className}
        style={style}
      >
        <AdminManageList
          list={confBundle}
          headerTitle={strings.configurationBundles}
          width={columnWidth}
          placeholder={strings.selectConfBundle}
          itemSelected={confBundleSelected}
          showEdit
          onGetList={() => {}}
          hidePlaceholderArrow

          onItemClick={this.handleClick}
          onEditClick={this.handleEditClick}

          showInfo
          onRemoveClick={this.handleDeleteClick}

          showCreate
          onCreateClick={this.handleOpenCreate}

          isLoading={this.props.confBundleLoading}
          isLoaded={this.props.confBundleLoaded}
          showFilter
          filterValue={this.props.confBundleFilter}
          filterValueType={this.props.confBundleFilterType}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleFilterChange}
          onFilterClear={this.handleFilterClear}
          showFilterlist
          filterList={[
            { id: 'config', name: strings.config },
            { id: 'user', name: strings.user },
          ]}
          style={{ position: 'absolute', left: 30, top: 0 }}
        />

        <AdminManageList
          authString={authString}
          list={tmpUsers}
          headerTitle={strings.users}
          width={columnWidth}
          placeholder={strings.selectUser}
          itemSelected={userSelected}
          initialState={!(confBundleSelected && confBundleSelected.id)}
          onEditClick={this.handleToggleUserModal}

          onItemClick={this.handleUserClick}

          isLoaded={users.length > 1}
          isLoading={usersLoading}
          isLoadingMore={usersLoading && users.length > 1 && !usersComplete}
          isComplete={usersComplete}
          onGetList={this.handleGetUserList}

          showFilter
          filterValue={usersFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleUserFilterChange}
          onFilterClear={this.handleUserFilterClear}

          addTotalItemType="user"
          noResultsPlaceholder={strings.noUsersFound}
          style={{ position: 'absolute', left: 330, top: 0 }}
        />

        {this.state.showDeleteConfirmation && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteBundleMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleDialog}
          onClose={this.handleToggleDialog}
          onConfirm={this.handleConfirmDeleteBundle}
        />}

        {this.state.isUserModalVisible && <AdminUserModal
          languageList={this.props.languages}
          digestEmailOptions={digestEmailOptions}
          statusOptions={statusList}
          configurationBundleList={this.props.confBundle}
          isVisible
          onChange={this.handleUserChange}
          onClose={this.handleToggleUserModal}

          limitedView={userCapabilities.isGroupAdmin || user.roleId <= this.state.userDetails.roleId}
          loading={this.props.saving || this.props.deleting}
          showDelete={canDelete && !!this.state.userDetails && !!this.state.userDetails.id}
          onDelete={this.handleToggleConfirmUserDelete}

          groupList={this.props.allGroups}
          {...this.state.userDetails}

          metadataAttributes={this.props.metadata}
          metadataListSelected={this.state.userDetails.metadata}
          metadataValues={this.props.metadataValues}

          onSave={this.handleUserSave}
          onScroll={this.handleUserGroupListScroll}
          onAddGroupItem={this.handleAddUserGroup}
          onRemoveGroupItem={this.handleRemoveUserGroup}
          onGroupSearchChange={this.handleGroupSearchChange}
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
        {this.state.isConfBundleEditVisible && <AdminConfBundleEdit
          id={this.state.confBundleId}
          onClose={this.handleEditClose}
        />}
      </div>
    );
  }
}
