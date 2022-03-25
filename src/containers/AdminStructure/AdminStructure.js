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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import generateStrings from 'helpers/generateStrings';
import { defineMessages, FormattedMessage } from 'react-intl';

import AdminChannelModal from 'components/Admin/AdminManageList/Modals/AdminChannelModal';
import AdminGroupModal from 'components/Admin/AdminManageList/Modals/AdminGroupModal';
import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminPanels from 'components/Admin/AdminPanels/AdminPanels';
import AdminTabModal from 'components/Admin/AdminManageList/Modals/AdminTabModal';
import AdminUserModal from 'components/Admin/AdminManageList/Modals/AdminUserModal';
import AdminVisualiseRelationships from 'components/Admin/AdminVisualiseRelationships/AdminVisualiseRelationships';
import Dialog from 'components/Dialog/Dialog';
import ImagePickerModal from 'components/ImagePickerModal/ImagePickerModal';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadTabs,
  loadGroups,
  loadChannels,
  loadMetadata,
  loadUsers,
  loadAllGroups,
  loadConfigurationBundles,
  loadCompleteStructure,
  deleteItem,
  saveDetail,
  setData,
  setRelationship,
} from 'redux/modules/admin/structure';
import {
  deleteEntity,
} from 'redux/modules/entities/entities';
import { createPrompt } from 'redux/modules/prompts';

const messages = defineMessages({
  delete: { id: 'delete', defaultMessage: 'Delete' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  confirmDelete: { id: 'confirm-delete', defaultMessage: 'Confirm Delete' },
  confirmDeleteTabMessage: { id: 'confirm-delete-tab-message', defaultMessage: 'Are you sure you want to delete this {tab}?' },
  confirmDeleteChannelMessage: { id: 'confirm-delete-channel-message', defaultMessage: 'Are you sure you want to delete this {channel}?' },
  confirmDeleteGroupMessage: { id: 'confirm-delete-group-message', defaultMessage: 'Are you sure you want to delete this Group?' },
  confirmDeleteUserMessage: { id: 'confirm-delete-user-message', defaultMessage: 'Are you sure you want to delete this User from the System?' },
  confirmRemoveChannelHeader: { id: 'confirm-remove-channel-header', defaultMessage: 'Are you sure you want to remove this {channel}?' },
  confirmRemoveGroupHeader: { id: 'confirm-remove-group-header', defaultMessage: 'Are you sure you want to remove this Group?' },

  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully' },
  successfullyDeleted: { id: 'successfully-deleted', defaultMessage: 'Successfully deleted' },

  addNewChannels: { id: 'add-new-channels', defaultMessage: 'Add new {channels}' },
  addExistingChannels: { id: 'add-existing-channels', defaultMessage: 'Add existing {channels}' },
  addNewGroups: { id: 'add-new-groups', defaultMessage: 'Add new groups' },
  addExistingGroups: { id: 'add-existing-groups', defaultMessage: 'Add existing groups' },
  addNewUsers: { id: 'add-new-users', defaultMessage: 'Add new users' },
  addExistingUsers: { id: 'add-existing-users', defaultMessage: 'Add existing users' },

  tabs: { id: 'tabs', defaultMessage: '{tabs}' },
  channels: { id: 'channels', defaultMessage: '{channels}' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  users: { id: 'users', defaultMessage: 'Users' },
  selectTab: { id: 'select-tab', defaultMessage: 'Select {tab}' },
  selectChannel: { id: 'select-channel', defaultMessage: 'Select {channel}' },
  selectGroup: { id: 'select-group', defaultMessage: 'Select group' },
  selectUser: { id: 'select-user', defaultMessage: 'Select user' },
  addChannel: { id: 'add-channel', defaultMessage: 'Add {channel}' },
  addGroup: { id: 'add-group', defaultMessage: 'Add group' },
  addUser: { id: 'add-user', defaultMessage: 'Add user' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  noTabsFound: { id: 'no-tabs-found', defaultMessage: 'No {tabs} found' },
  noChannelsFound: { id: 'no-channels-found', defaultMessage: 'No {channels} found' },
  noGroupsFound: { id: 'no-groups-found', defaultMessage: 'No groups found' },
  noUsersFound: { id: 'no-users-found', defaultMessage: 'No users found' },

  never: { id: 'never', defaultMessage: 'Never' },
  daily: { id: 'daily', defaultMessage: 'Daily' },
  weekly: { id: 'weekly', defaultMessage: 'Weekly' },
  monthly: { id: 'monthly', defaultMessage: 'Monthly' },

  active: { id: 'active', defaultMessage: 'Active' },
  inactive: { id: 'inactive', defaultMessage: 'Inactive' },
  pleaseProvideValidUrl: { id: 'please-provide-valid-url', defaultMessage: 'Please provide valid URL' },
});

function mapStateToProps(state) { //, ownProps
  const { entities } = state;
  const { settings } = state;
  const { structure } = state.admin;

  const tabs = structure.tabs.map(id => entities.tabs[id]);
  const tabSelected = tabs.find(obj => !obj.deleted && obj.id === structure.tabSelected.id) || {};
  const channelSelected = structure.channelSelected.deleted ? {} : structure.channelSelected;
  const groupSelected = structure.groupSelected.deleted ? {} : structure.groupSelected;
  //const userSelected = structure.userSelected;
  const channelsByTab = structure.channelsByTab[tabSelected.id];
  const channelSearchByTab = structure.channelSearchListByTab[tabSelected.id];
  const groupsByTabChannel = structure.groupsByTabChannel[tabSelected.id];
  const groupsSearchByTabChannel = structure.groupsSearchByTabChannel[tabSelected.id];
  const usersByGroup = structure.usersByGroup;
  const usersSearchByGroup = structure.usersSearchByGroup;

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

  let channels = [];
  if (channelsByTab && channelsByTab.channelsIds) {
    channels = channelsByTab.channelsIds.map(id => entities.channels[id]);

    if (channels && channels.length) channels = channels.filter(obj => !obj.deleted);
  }

  let channelSearchList = [];
  if (channelSearchByTab && channelSearchByTab.channelsIds) {
    channelSearchList = channelSearchByTab.channelsIds.map(id => entities.channels[id]);
  }

  let groups = [];
  if (channelSelected.id && groupsByTabChannel && groupsByTabChannel[channelSelected.id] && groupsByTabChannel[channelSelected.id].groupIds) {
    groups = groupsByTabChannel[channelSelected.id].groupIds.map(id => {
      const tmpGroup = entities.groups[id];
      delete tmpGroup.isActive; // remove selected flag
      return tmpGroup;
    });

    if (groups.length) groups = groups.filter(obj => !obj.deleted);
  }

  let groupSearchList = [];
  if (channelSelected.id && groupsSearchByTabChannel && groupsSearchByTabChannel[channelSelected.id] && groupsSearchByTabChannel[channelSelected.id].groupIds) {
    groupSearchList = groupsSearchByTabChannel[channelSelected.id].groupIds.map(id => entities.groups[id]);
  }

  let users = [];
  if (groupSelected.id && usersByGroup && usersByGroup[groupSelected.id] && usersByGroup[groupSelected.id].userIds) {
    users = usersByGroup[groupSelected.id].userIds.map(id => {
      const groupList = entities.users[id].groups;
      if (groupList && !groupList.find(obj => obj.id === groupSelected.id)) groupList.push({ ...groupSelected, colour: '#02e8d1', childCount: 1, isPersonal: true });

      return {
        ...entities.users[id],
        name: entities.users[id].firstname + ' ' + entities.users[id].lastname,
        note: entities.users[id].email,
        groups: groupList
      };
    });

    if (users.length) users = users.filter(obj => !obj.deleted);
  }

  let userSearchList = [];
  if (groupSelected.id && usersSearchByGroup && usersSearchByGroup[groupSelected.id] && usersSearchByGroup[groupSelected.id].userIds) {
    userSearchList = usersSearchByGroup[groupSelected.id].userIds.map(id => ({
      ...entities.users[id],
      note: entities.users[id].email,
      name: entities.users[id].name || entities.users[id].firstname + ' ' + entities.users[id].lastname
    }));
  }

  return {
    languages: Object.assign({}, settings.languages),

    tabs: tabs.filter(obj => !obj.deleted),
    tabSelected: tabSelected,
    tabsLoading: structure.tabsLoading,
    tabsComplete: structure.tabsComplete,
    tabsError: structure.tabsError,
    tabFilter: structure.tabFilter,

    channels: channels,

    channelSelected: channelSelected,
    channelsLoading: structure.channelsLoading,
    channelsComplete: structure.channelsComplete,
    channelsError: structure.channelsError,
    channelFilter: structure.channelFilter,

    channelSearch: structure.channelSearch,
    channelSearchListByTab: channelSearchList,
    channelsSearchLoading: structure.channelsSearchLoading,
    channelsSearchComplete: structure.channelsSearchComplete,

    groups: groups,
    groupSelected: groupSelected,
    groupsLoading: structure.groupsLoading,
    groupsComplete: structure.groupsComplete,
    groupsError: structure.groupsError,
    groupFilter: structure.groupFilter,

    groupSearch: structure.groupSearch,
    groupSearchList: groupSearchList,
    groupSearchLoading: structure.groupSearchLoading,
    groupSearchComplete: structure.groupSearchComplete,

    users: users,
    userSelected: structure.userSelected,
    usersLoading: structure.usersLoading,
    usersComplete: structure.usersComplete,
    usersError: structure.usersError,
    userFilter: structure.userFilter,

    userSearch: structure.userSearch,
    userSearchList: userSearchList,
    userSearchLoading: structure.userSearchLoading,
    userSearchComplete: structure.userSearchComplete,

    isChannelQuickLoading: structure.isChannelQuickLoading,
    toggleChannelInfo: structure.toggleChannelInfo,
    isGroupQuickLoading: structure.isGroupQuickLoading,
    toggleGroupInfo: structure.toggleGroupInfo,

    error: structure.error,
    saved: structure.saved,
    saving: structure.saving,
    deleted: structure.deleted,
    deleting: structure.deleting,
    graph: structure.graph,
    graphLoaded: structure.graphLoaded,
    graphLoading: structure.graphLoading,

    allGroupsComplete: structure.allGroupsComplete,
    allGroupsLoading: structure.allGroupsLoading,
    allGroupsLoaded: structure.allGroupsLoaded,
    allGroups: structure.allGroups.map(id => entities.groups[id]),
    confBundle: structure.confBundle,
    confBundleLoaded: structure.confBundleLoaded,
    confBundleLoading: structure.confBundleLoading,
    metadata: metadata,
    metadataValues: metadataValues,
    metadataLoaded: structure.metadataLoaded,
    metadataLoading: structure.metadataLoading,
    userDefaults: settings.userDefaults,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    deleteEntity,

    loadTabs,
    loadGroups,
    loadChannels,
    loadMetadata,
    loadUsers,
    loadAllGroups,
    loadConfigurationBundles,
    loadCompleteStructure,
    deleteItem,
    saveDetail,
    setData,
    setRelationship,
  })
)
export default class AdminStructureView extends Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    tabsLoading: PropTypes.bool,
    tabsComplete: PropTypes.bool,
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
      tabImagePickerModalVisible: false,
      isTabModalVisible: false,
      tabDetails: {},

      channelImagePickerModalVisible: false,
      isChannelModalVisible: false,
      channelDetails: {},

      groupImagePickerModalVisible: false,
      isGroupModalVisible: false,
      groupDetails: {},

      isUserModalVisible: false,
      userDetails: {},

      // Panels
      isGraphEnabled: false,
      graphType: '',
      graphId: 0,
      confirmTabDelete: false,
      confirmChannelDelete: false,
      confirmGroupDelete: false,
      confirmUserDelete: false,
      confirmRemoveChannel: false,
      confirmRemoveGroup: false,
      allGroupsKeyword: '',
      allGroups: props.allGroups,
    };
    autobind(this);
    this.handleLoadTabs = debounce(this.handleLoadTabs.bind(this), 500);
    this.handleLoadChannels = debounce(this.handleLoadChannels.bind(this), 500);
    this.handleLoadGroups = debounce(this.handleLoadGroups.bind(this), 500);
    this.handleLoadUsers = debounce(this.handleLoadUsers.bind(this), 500);
    this.listWrapper = null;
  }

  UNSAFE_componentWillMount() {
    // Load conf bundle for user Edit
    if (!this.props.confBundleLoaded) {
      this.props.loadConfigurationBundles();
    }

    if (!this.props.allGroupsLoaded) {
      this.props.loadAllGroups();
    }

    if (!this.props.metadataLoaded) {
      this.props.loadMetadata();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      channelsError,
      channelSelected,
      groupsError,
      groupsLoading,
      groupSelected,
      tabsError,
      tabSelected,
      usersError,
      usersLoading,
      saved,
      deleted,
      error,
    } = this.props;

    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);

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
    const prevGroupError = groupsError ? groupsError.message : '';
    if (nextProps.groupsError && nextProps.groupsError.message && (nextProps.groupsError.message !== prevGroupError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.groupsError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Channels error
    const prevChannelError = channelsError ? channelsError.message : '';
    if (nextProps.channelsError && nextProps.channelsError.message && (nextProps.channelsError.message !== prevChannelError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.channelsError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    const prevTabsError = tabsError ? tabsError.message : '';
    if (nextProps.tabsError && nextProps.tabsError.message && (nextProps.tabsError.message !== prevTabsError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.tabsError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    const prevUsersError = usersError ? usersError.message : '';
    if (nextProps.usersError && nextProps.usersError.message && (nextProps.usersError.message !== prevUsersError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.usersError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Load Channels if tab selected is changed
    if (tabSelected && tabSelected.id && tabSelected.id !== nextProps.tabSelected.id) {
      this.props.setData({
        channelSelected: {},
        channelsComplete: false
      });

      if (nextProps.tabSelected.id) this.props.loadChannels(0, nextProps.tabSelected.id, '');
    }

    // Load Groups if Channel selected is changed
    if (!groupsLoading && tabSelected && tabSelected.id && channelSelected.id && nextProps.channelSelected && nextProps.channelSelected.id && nextProps.channelSelected.id !== channelSelected.id) {
      this.props.setData({
        groupSelected: {},
        groupsComplete: false
      });

      this.props.loadGroups(0, tabSelected.id, nextProps.channelSelected.id, '');
    }

    // Load Users if Groups selected is changed
    if (!usersLoading && tabSelected.id && channelSelected.id && groupSelected.id && nextProps.groupSelected && nextProps.groupSelected.id && nextProps.groupSelected.id !== groupSelected.id) {
      this.props.setData({
        userSelected: {},
        usersComplete: false
      });

      this.props.loadUsers(0, nextProps.groupSelected.id, '');
    }

    // Close modal after save
    if ((!saved && nextProps.saved || !deleted && nextProps.deleted)) {
      if (this.state.isTabModalVisible) this.handleToggleTabModal();
      if (this.state.isChannelModalVisible) this.handleToggleChannelModal();
      if (this.state.isGroupModalVisible) this.handleToggleGroupModal();
      if (this.state.isUserModalVisible) this.handleToggleUserModal();

      // Channel Settings quick changes modal
      if (this.props.isChannelQuickLoading) {
        this.props.setData({
          toggleChannelInfo: false,
          isChannelQuickLoading: false
        });
      }

      // Group Settings quick changes modal
      if (this.props.isGroupQuickLoading || this.props.toggleGroupInfo) {
        this.props.setData({
          toggleGroupInfo: false,
          isGroupQuickLoading: false
        });
      }

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
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const {
      graphType,
      graphId,
      isGraphEnabled
    } = this.state;

    // Fetch graph data
    if (!isGraphEnabled && nextState.isGraphEnabled || (isGraphEnabled && graphType !== nextState.graphType) ||
      (isGraphEnabled && graphId !== nextState.graphId)) {
      const type = nextState.graphType || graphType;
      const id = nextState.graphId || graphId;
      this.props.loadCompleteStructure(type, id);
    }
  }

  // Tabs function
  handleLoadTabs(offset, keyword) {
    this.props.loadTabs(offset, keyword);
  }

  handleGetTabList(offset) {
    const { tabsLoading } = this.props;
    if (!tabsLoading) {
      this.props.loadTabs(offset, this.props.tabFilter);
    }
  }

  handleTabFilterChange(event) {
    this.props.setData({ tabFilter: event.currentTarget.value });
    this.handleLoadTabs(0, event.currentTarget.value);
  }

  handleTabFilterClear() {
    if (this.props.tabFilter) {
      this.handleLoadTabs(0, '');
    }
  }

  handleTabClick(event, context) {
    this.props.setData({
      tabSelected: {
        id: context.id,
        name: context.name,
        position: context.position
      },
    });

    this.setState({
      graphId: context.id,
      graphType: 'tab'
    });
  }

  // Channels function
  handleLoadChannels(offset, keyword, filterType) {
    const { tabSelected } = this.props;
    if (tabSelected.id) {
      this.props.loadChannels(offset, tabSelected.id, keyword, filterType);
    }
  }

  handleGetChannelList(offset) {
    const { channelsLoading, channelsError, tabSelected } = this.props;
    if (tabSelected.id && !channelsLoading && !(channelsError && channelsError.message)) {
      this.props.loadChannels(offset, tabSelected.id, this.props.channelFilter);
    }
  }

  handleGetChannelSearchList(offset) {
    const {
      channelsSearchLoading,
      channelsError,
      tabSelected
    } = this.props;

    if (tabSelected.id && !channelsSearchLoading && !(channelsError && channelsError.message)) {
      this.props.loadChannels(offset, tabSelected.id, this.props.channelSearch, 'unlinked');
    }
  }

  handleChannelFilterChange(event) {
    this.props.setData({ channelFilter: event.currentTarget.value });
    this.handleLoadChannels(0, event.currentTarget.value);
  }

  handleChannelFilterClear() {
    if (this.props.channelFilter) {
      this.handleLoadChannels(0, '');
    }
  }

  handleChannelClick(event, context) {
    // Check if we are not clicking on the options
    const dropdown = event.target;
    if (!dropdown.classList.contains('infoDropMenu')) {
      this.props.setData({
        channelSelected: {
          id: context.id,
          name: context.name,
          position: context.position,
          type: 'channel',
        }
      });

      this.setState({
        graphId: context.id,
        graphType: 'channel'
      });
    }
  }

  // Channel Search list
  handleChannelSearchInputChange(event) {
    this.props.setData({ channelSearch: event.currentTarget.value });
    this.handleLoadChannels(0, event.currentTarget.value, 'unlinked');
  }

  handleChannelSearchClear() {
    this.props.setData({ channelSearch: '' });
    this.handleLoadChannels(0, '', 'unlinked');
  }

  handleChannelAddSearchItems(event, contextList) {
    this.props.setRelationship({
      tab: [this.props.tabSelected.id],
      channel: contextList.map(obj => obj.id),
    }, 'channelList', 'add');
  }

  // Channel Info options
  handleInfoChannelToggle(status) {
    this.props.setData({ toggleChannelInfo: status });
  }

  handleToggleConfirmRemoveChannel(event, details) {
    let data = {};
    if (details) data = details.id ? details : details.channel;

    this.setState({
      channelDetails: data,
      confirmRemoveChannel: !this.state.confirmRemoveChannel
    });
  }

  handleRemoveChannelClick() {
    this.props.setRelationship({
      tab: [this.props.tabSelected.id],
      channel: [-this.state.channelDetails.id],
      cascade: 1,
    }, 'channelList', 'remove');

    this.setState({
      confirmRemoveChannel: !this.state.confirmRemoveChannel
    });
  }

  handleChannelQuickChanges(event, channel) {
    const data = {
      ...channel,
      tabId: this.props.tabSelected.id
    };

    this.props.setData({ isChannelQuickLoading: true });
    this.handleChannelSave(null, data);
  }

  // Group functions
  handleLoadGroups(offset, keyword, filterType) {
    const { channelSelected, groupsLoading, tabSelected } = this.props;
    if (tabSelected.id && channelSelected.id && !groupsLoading) {
      this.props.loadGroups(offset, tabSelected.id, channelSelected.id, keyword, filterType);
    }
  }

  handleGetGroupList(offset) {
    const { groupsError, groupsLoading, channelSelected, tabSelected } = this.props;

    if (tabSelected.id && channelSelected.id && !groupsLoading && !(groupsError && groupsError.message)) {
      this.props.loadGroups(offset, tabSelected.id, channelSelected.id, this.props.groupFilter);
    }
  }

  handleGetGroupSearchList(offset) {
    const {
      groupSearchLoading,
      groupsError,
      tabSelected,
      channelSelected
    } = this.props;

    if (tabSelected.id && channelSelected.id && !groupSearchLoading && !(groupsError && groupsError.message)) {
      this.props.loadGroups(offset, tabSelected.id, channelSelected.id, this.props.groupSearch, 'unlinked');
    }
  }

  handleGroupClick(event, context) {
    // Check if we are not clicking on the options
    const dropdown = event.target;
    if (!dropdown.classList.contains('infoDropMenu')) {
      this.props.setData({
        groupSelected: {
          id: context.id,
          name: context.name,
          position: context.position,
          childCount: context.childCount,
          type: 'group'
        }
      });

      this.setState({
        graphId: context.id,
        graphType: 'group'
      });
    }
  }

  handleGroupFilterChange(event) {
    this.props.setData({ groupFilter: event.currentTarget.value });
    this.handleLoadGroups(0, event.currentTarget.value);
  }

  handleGroupFilterClear() {
    if (this.props.groupFilter) {
      this.handleLoadGroups(0, '');
    }
  }

  // Group Info options
  handleInfoGroupToggle(status) {
    this.props.setData({ toggleGroupInfo: status });
  }

  handleToggleConfirmRemoveGroup(event, details) {
    let data = {};
    if (details) data = details.id ? details : details.group;

    this.setState({
      groupDetails: data, // Set item to be deleted
      confirmRemoveGroup: !this.state.confirmRemoveGroup
    });
  }

  handleRemoveGroupClick() {
    this.props.setRelationship({
      tab: [this.props.tabSelected.id],
      channel: [this.props.channelSelected.id],
      group: [-this.state.groupDetails.id],
    }, 'groupList', 'remove');

    this.setState({
      confirmRemoveGroup: !this.state.confirmRemoveGroup
    });
  }

  handleGroupQuickChanges(event, context) {
    this.props.setRelationship({
      tab: this.props.tabSelected.id,
      channel: this.props.channelSelected.id,
      group: context.id,
      permissions: context.permissions,
    }, 'groupEdit');
  }

  // Group Search list
  handleGroupSearchInputChange(event) {
    this.props.setData({ groupSearch: event.currentTarget.value });
    this.handleLoadGroups(0, event.currentTarget.value, 'unlinked');
  }

  handleGroupSearchClear() {
    this.props.setData({ groupSearch: '' });
    this.handleLoadGroups(0, '', 'unlinked');
  }

  handleGroupAddSearchItems(event, items) {
    const list = items.list || items;
    this.props.setRelationship({
      tab: [this.props.tabSelected.id],
      channel: [this.props.channelSelected.id],
      group: list.map(obj => obj.id),
      permissions: list.map(obj => (obj.permissions || 1)),
    }, 'groupList', 'add');
  }

  // User functions
  handleLoadUsers(offset, keyword, filterType) {
    const { channelSelected, groupSelected, tabSelected, usersLoading } = this.props;
    if (tabSelected.id && channelSelected.id && groupSelected.id && !usersLoading) {
      this.props.loadUsers(offset, groupSelected.id, keyword, filterType);
    }
  }

  handleGetUserList(offset) {
    const { usersError, usersLoading, channelSelected, groupSelected, tabSelected } = this.props;

    if (tabSelected.id && channelSelected.id && groupSelected.id && !usersLoading && !(usersError && usersError.message)) {
      this.props.loadUsers(offset, groupSelected.id, this.props.userFilter);
    }
  }

  handleGetUserSearchList(offset) {
    const {
      userSearchLoading,
      usersError,
      tabSelected,
      groupSelected,
      channelSelected
    } = this.props;

    if (tabSelected.id && channelSelected.id && groupSelected.id && !userSearchLoading && !(usersError && usersError.message)) {
      this.props.loadUsers(offset, groupSelected.id, this.props.userSearch, 'unlinked');
    }
  }

  handleUserClick(event, context) {
    this.props.setData({
      userSelected: {
        id: context.id,
        name: context.name,
        position: context.position,
        type: 'user'
      },
    });

    this.setState({
      graphId: context.id,
      graphType: 'user'
    });
  }

  handleUserFilterChange(event) {
    this.props.setData({ userFilter: event.currentTarget.value });
    this.handleLoadUsers(0, event.currentTarget.value);
  }

  handleUserFilterClear() {
    if (this.props.userFilter) {
      this.handleLoadUsers(0, '');
    }
  }

  // User Search list
  handleUserSearchInputChange(event) {
    this.props.setData({ userSearch: event.currentTarget.value });
    this.handleLoadUsers(0, event.currentTarget.value, 'unlinked');
  }

  handleUserSearchClear() {
    this.props.setData({ userSearch: '' });
    this.handleLoadUsers(0, '', 'unlinked');
  }

  handleUserAddSearchItems(event, items) {
    // Insert Items in userList
    this.props.setRelationship({
      group: [this.props.groupSelected.id],
      user: items.map(obj => obj.id),
    }, 'userList', 'add');
  }

  ////////////////////////
  // MODALS
  ////////////////////////

  // Tabs modal
  /* Tab section */
  handleTabChange(data) {
    const key = data.key;
    const value = data.value;

    const tmpTabDetails = Object.assign({}, this.state.tabDetails);
    tmpTabDetails[key] = value;

    this.setState({
      tabDetails: tmpTabDetails,
    });
  }

  handleTabSave(e, context) {
    const data = {
      colour: context.colour,
      description: context.description,
      name: context.name,
      thumbnail: context.thumbnail,
      thumbnailDownloadUrl: context.thumbnailDownloadUrl,
      type: 'regular'
    };
    if (context.id) data.id = context.id;

    this.props.saveDetail(data, 'tab');
  }

  handleTabDelete() {
    if (this.state.tabDetails.id) {
      this.props.deleteItem(this.state.tabDetails.id, 'tab');
      this.props.deleteEntity('tabs', this.state.tabDetails.id);
    }
    this.handleToggleConfirmTabDelete();
  }

  handleToggleConfirmTabDelete() {
    this.setState({
      confirmTabDelete: !this.state.confirmTabDelete
    });
  }

  handleToggleTabModal(event, context) {
    let details = {};
    if (context && context.props && context.props.id) {
      details = context.props;
    }

    this.setState({
      isTabModalVisible: !this.state.isTabModalVisible,
      tabDetails: details,
    });
  }

  handleTabThumbnailClick() {
    const tabDetails = Object.assign({}, this.state.tabDetails);

    if (tabDetails.thumbnail) {
      // Clear thumbnail if one is already set
      tabDetails.thumbnail = '';
      tabDetails.thumbnailDownloadUrl = '';

      this.setState({
        tabDetails: tabDetails,
        //toggle: !this.state.toggle
      });
      // just open Featured image picker to select image
    } else {
      this.setState({
        tabImagePickerModalVisible: true,
        isTabModalVisible: false,
      });
    }
  }

  handleDeleteModal() {
    console.log('Delete clicked'); //eslint-disable-line
  }

  //.--

  // Channels modal
  handleChannelChange(data) {
    const key = data.key;
    const value = data.value;

    const tmpDetails = Object.assign({}, this.state.channelDetails);
    tmpDetails[key] = value;

    this.setState({
      channelDetails: tmpDetails
    });
  }

  handleChannelSave(e, context) {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const urlRegexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    let isThereUrlError = false;

    const data = {
      colour: context.colour,
      description: context.description,
      name: context.name,
      thumbnail: context.thumbnail,
      thumbnailDownloadUrl: context.thumbnailDownloadUrl,
      defaultSortBy: context.defaultSortBy,
      fileEncryption: context.fileEncryption,
      hideThisChannel: context.hideThisChannel,
      isFeed: !!context.isFeed,
      tabId: this.props.tabSelected.id,
      showThumbnails: !!context.showThumbnails
    };
    if (context.id) data.id = context.id;
    if (context.feedLocation) {
      data.feedLocation = context.feedLocation;

      if (!urlRegexp.test(data.feedLocation)) {
        isThereUrlError = true;
        this.props.createPrompt({
          id: uniqueId('error-'),
          type: 'error',
          message: strings.pleaseProvideValidUrl,
          dismissible: true,
          autoDismiss: 5
        });
      }
    }

    if (!isThereUrlError) {
      this.props.saveDetail(data, 'channel');
    }
  }

  handleChannelDelete() {
    if (this.state.channelDetails.id) {
      this.props.deleteItem(this.state.channelDetails.id, 'channel', { tabId: this.props.tabSelected.id });
      this.props.deleteEntity('channels', this.state.channelDetails.id);
    }
    this.handleToggleConfirmChannelDelete();
  }

  handleToggleConfirmChannelDelete() {
    this.setState({
      confirmChannelDelete: !this.state.confirmChannelDelete
    });
  }

  handleToggleChannelModal(event, context) {
    let details = {};
    if (context && context.props && context.props.id) {
      details = context.props;
    }

    this.setState({
      isChannelModalVisible: !this.state.isChannelModalVisible,
      channelDetails: details,
    });
  }

  handleChannelThumbnailClick() {
    const channelDetails = Object.assign({}, this.state.channelDetails);

    if (channelDetails.thumbnail) {
      // Clear thumbnail if one is already set
      channelDetails.thumbnail = '';
      channelDetails.thumbnailDownloadUrl = '';

      this.setState({
        channelDetails: channelDetails,
      });
      // just open Featured image picker to select image
    } else {
      this.setState({
        channelImagePickerModalVisible: true,
        isChannelModalVisible: false,
      });
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
    if (context.isPersonal || context.email) {
      this.props.setRelationship({
        permissions: context.permissions || 1,
        group: [context.id],
        channel: [this.props.channelSelected.id],
        tab: [this.props.tabSelected.id],
      }, 'group', 'edit');
    } else {
      const data = {
        name: context.name,
        notes: context.notes,
        defaultSortBy: context.defaultSortBy,
        permissions: context.permissions || 1,
        thumbnail: context.thumbnail,
        thumbnailDownloadUrl: context.thumbnailDownloadUrl,
        canSubscribe: context.canSubscribe,
        colour: context.colour,
        tabId: this.props.tabSelected.id,
        channelId: this.props.channelSelected.id
      };
      if (context.id) data.id = context.id;

      this.props.saveDetail(data, 'group');
    }
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

    this.props.saveDetail(data, 'user');
  }

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
      const groupSelected = this.props.groups.find((obj) => (obj.id === this.props.groupSelected.id));
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

    // Reset Group list and load All groups on close
    if (this.state.isUserModalVisible) {
      this.props.loadAllGroups();
    }

    this.setState({
      isUserModalVisible: !this.state.isUserModalVisible,
      userDetails: details,
      allGroups: this.props.allGroups
    });
  }

  handleUserThumbnailClick() {
    const userDetails = Object.assign({}, this.state.userDetails);

    if (userDetails.thumbnail) {
      // Clear thumbnail if one is already set
      userDetails.thumbnail = '';
      userDetails.thumbnailDownloadUrl = '';

      this.setState({
        userDetails: userDetails,
      });
      // just open Featured image picker to select image
    } else {
      this.setState({
        isUserModalVisible: false,
      });
    }
  }

  /**
   * Cover Art
   */
  handleTabImagePickerCancel() {
    this.setState({
      tabImagePickerModalVisible: false,
      isTabModalVisible: true
    });
  }

  handleTabImagePickerSave(event, images) {
    if (images && images[0]) {
      // Cover Art
      this.setState({
        tabDetails: { ...this.state.tabDetails, thumbnail: images[0].url, thumbnailDownloadUrl: images[0].download_location },
        tabImagePickerModalVisible: false,
        isTabModalVisible: true,
      });
    }
  }

  // Channel Covert Art
  handleChannelImagePickerCancel() {
    this.setState({
      channelImagePickerModalVisible: false,
      isChannelModalVisible: true
    });
  }

  handleChannelImagePickerSave(event, images) {
    if (images && images[0]) {
      // Cover Art
      this.setState({
        channelDetails: { ...this.state.channelDetails, thumbnail: images[0].url, thumbnailDownloadUrl: images[0].download_location },
        channelImagePickerModalVisible: false,
        isChannelModalVisible: true,
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
    if (item) item.isSelected = false;
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
    const { userDetails } = this.state;
    const { allGroups } = this.props;
    const groups = userDetails.groups || [];
    const item = allGroups.find(obj => obj.id === Number(id));
    if (item) item.isSelected = true;

    this.setState({
      allGroups: [...allGroups],
      userDetails: {
        ...userDetails,
        groups: [...groups, item]
      }
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

  //.--

  /*
  * Panel Functions
  */
  handleOpenGraph(e, context) {
    this.setState({
      isGraphEnabled: true,
      graphType: context.itemSelected.type,
      graphId: context.itemSelected.id
    });
  }

  handleCloseGraph() {
    this.setState({
      isGraphEnabled: false,
      graphType: ''
    });
  }

  renderList() {
    const {
      tabs,
      tabsLoading,
      tabsComplete,
      tabSelected,

      channels,
      channelsLoading,
      channelsComplete,
      channelSelected,
      channelFilter,

      channelSearch,
      channelSearchListByTab,
      channelsSearchLoading,
      channelsSearchComplete,

      groups,
      groupsLoading,
      groupsComplete,
      groupSelected,
      groupFilter,

      groupSearch,
      groupSearchList,
      groupSearchLoading,
      groupSearchComplete,

      users,
      usersLoading,
      usersComplete,
      userSelected,
      userFilter,

      userSearch,
      userSearchList,
      userSearchLoading,
      userSearchComplete,

      className,
      style,
    } = this.props;
    const styles = require('./AdminStructure.less');
    const { formatMessage } = this.context.intl;
    const { authString, naming, user, userCapabilities } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const columnWidth = 300;

    // Set Permissions
    let canCreateTab = false;
    let canCreateChannel = false;
    let canCreateGroup = false;
    let canCreateUser = false;
    let canDelete = false;
    if ((userCapabilities.isAdmin && !userCapabilities.isGroupAdmin) ||
      (userCapabilities.isGroupAdminAdvanced)) {
      canCreateTab = true;
      canCreateChannel = true;
      canCreateGroup = true;
      if (userCapabilities.isAdmin) canDelete = true;
      if (userCapabilities.isGroupAdminAdvanced && !userCapabilities.isAdmin) canCreateGroup = false;
      if (userCapabilities.canAddUser || userCapabilities.isAdmin || userCapabilities.isGroupAdminAdvanced) {
        canCreateUser = true;
      }
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

    const listLeftPosition = 0;

    const tmpUsers = users.map(element => ({
      ...element,
      showEdit: element.roleId <= user.roleId || userCapabilities.isGroupAdmin
    }));

    let filterTabs  = [...tabs];
    if (userCapabilities.isGroupAdmin) {
      filterTabs  = tabs.filter((item) => item.childCount > 0);
    }

    return (
      <div
        ref={(node) => { this.listWrapper = node; }}
        className={className}
        style={style}
      >
        <AdminManageList
          authString={authString}
          list={filterTabs}
          headerTitle={strings.tabs}
          width={columnWidth}
          placeholder={strings.selectTab}
          itemSelected={tabSelected}

          showGraph={tabSelected.childCount > 0}
          onGraphClick={this.handleOpenGraph}
          showEdit
          onEditClick={this.handleToggleTabModal}

          onItemClick={this.handleTabClick}

          isLoaded={tabs.length > 1}
          isLoading={tabsLoading}
          isLoadingMore={tabsLoading && tabs.length > 1 && !tabsComplete}
          isComplete={tabsComplete}
          onGetList={this.handleGetTabList}

          showCreate={canCreateTab}
          onCreateClick={this.handleToggleTabModal}

          showFilter
          filterValue={this.props.tabFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleTabFilterChange}
          onFilterClear={this.handleTabFilterClear}

          style={{ position: 'absolute', left: listLeftPosition, top: 0 }}
          className={styles.CustomTab}

          noResultsPlaceholder={strings.noTabsFound}
        />

        <AdminManageList
          authString={authString}
          list={channels}
          headerTitle={strings.channels}
          width={columnWidth}
          placeholder={strings.selectChannel}
          itemSelected={channelSelected}

          initialState={!(tabSelected && tabSelected.id)}
          showGraph
          onGraphClick={this.handleOpenGraph}
          showEdit
          onEditClick={this.handleToggleChannelModal}

          onItemClick={this.handleChannelClick}

          isLoaded={channels.length > 1}
          isLoading={channelsLoading}
          isLoadingMore={channelsLoading && channels.length > 1 && !channelsComplete}
          isComplete={channelsComplete}
          onGetList={this.handleGetChannelList}

          addNewLabel={strings.addNewChannels}
          addExistingLabel={strings.addExistingChannels}
          showExisting
          showCreate={canCreateChannel}
          onCreateClick={this.handleToggleChannelModal}

          showFilter
          filterValue={channelFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleChannelFilterChange}
          onFilterClear={this.handleChannelFilterClear}

          showUnlink
          onUnlinkClick={this.handleToggleConfirmRemoveChannel}

          showSearch
          searchList={channelSearchListByTab}
          searchInputValue={channelSearch}
          searchInputPlaceholder={strings.addChannel}
          searchListHeader={strings.selectChannel}
          isSearchLoaded={channelSearchListByTab.length > 1}
          isSearchLoading={channelsSearchLoading}
          isSearchLoadingMore={channelsSearchLoading && channelSearchListByTab.length > 1 && !channelsSearchComplete}
          isSearchComplete={channelsSearchComplete}
          onGetSearchList={this.handleGetChannelSearchList}
          onSearchChange={this.handleChannelSearchInputChange}
          onSearchClear={this.handleChannelSearchClear}
          onAddClick={this.handleChannelAddSearchItems}
          addTotalItemType="channel"

          style={{ position: 'absolute', left: (300 + listLeftPosition), top: 0 }}
          className={styles.CustomChannel}
          noResultsPlaceholder={strings.noChannelsFound}
        />

        <AdminManageList
          authString={authString}
          list={groups}
          headerTitle={strings.groups}
          width={columnWidth}
          placeholder={strings.selectGroup}
          itemSelected={groupSelected}
          initialState={!(tabSelected && tabSelected.id) || !(channelSelected && channelSelected.id)}
          showGraph
          onGraphClick={this.handleOpenGraph}
          showEdit
          onEditClick={this.handleToggleGroupModal}

          onItemClick={this.handleGroupClick}

          isLoaded={groups.length > 1}
          isLoading={groupsLoading}
          isLoadingMore={groupsLoading && groups.length > 1 && !groupsComplete}
          isComplete={groupsComplete}
          onGetList={this.handleGetGroupList}

          addNewLabel={strings.addNewGroups}
          addExistingLabel={strings.addExistingGroups}
          showExisting
          showCreate={canCreateGroup}
          onCreateClick={this.handleToggleGroupModal}

          showFilter
          filterValue={groupFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleGroupFilterChange}
          onFilterClear={this.handleGroupFilterClear}

          showUnlink
          onUnlinkClick={this.handleToggleConfirmRemoveGroup}

          showSearch
          searchList={groupSearchList}
          searchInputValue={groupSearch}
          searchInputPlaceholder={strings.addGroup}
          searchListHeader={strings.selectGroup}
          isSearchLoaded={groupSearchList.length > 1}
          isSearchLoading={groupSearchLoading}
          isSearchLoadingMore={groupSearchLoading && groupSearchList.length > 1 && !groupSearchComplete}
          isSearchComplete={groupSearchComplete}
          onGetSearchList={this.handleGetGroupSearchList}
          onSearchChange={this.handleGroupSearchInputChange}
          onSearchClear={this.handleGroupSearchClear}
          onAddClick={this.handleGroupAddSearchItems}
          showSetPermissions
          saved={this.props.saved}
          saving={this.props.saving}
          addTotalItemType="group"

          style={{ position: 'absolute', left: (600 + listLeftPosition), top: 0 }}
          noResultsPlaceholder={strings.noGroupsFound}
        />

        <AdminManageList
          authString={authString}
          list={tmpUsers}
          headerTitle={strings.users}
          width={columnWidth}
          placeholder={strings.selectUser}
          itemSelected={userSelected}
          initialState={!(tabSelected && tabSelected.id) || !(channelSelected && channelSelected.id) || !(groupSelected && groupSelected.id)}
          showGraph
          onGraphClick={this.handleOpenGraph}
          onEditClick={this.handleToggleUserModal}

          onItemClick={this.handleUserClick}

          hidePlaceholderArrow
          isLoaded={users.length > 1}
          isLoading={usersLoading}
          isLoadingMore={usersLoading && users.length > 1 && !usersComplete}
          isComplete={usersComplete}
          onGetList={this.handleGetUserList}

          addNewLabel={strings.addNewUsers}
          addExistingLabel={strings.addExistingUsers}
          showExisting
          showCreate={canCreateUser}
          onCreateClick={this.handleToggleUserModal}

          showFilter
          filterValue={userFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleUserFilterChange}
          onFilterClear={this.handleUserFilterClear}

          showSearch
          searchList={userSearchList}
          searchInputValue={userSearch}
          searchInputPlaceholder={strings.addUser}
          searchListHeader={strings.selectUser}
          isSearchLoaded={userSearchList.length > 1}
          isSearchLoading={userSearchLoading}
          isSearchLoadingMore={userSearchLoading && userSearchList.length > 1 && !userSearchComplete}
          isSearchComplete={userSearchComplete}
          onGetSearchList={this.handleGetUserSearchList}
          onSearchChange={this.handleUserSearchInputChange}
          onSearchClear={this.handleUserSearchClear}
          onAddClick={this.handleUserAddSearchItems}
          addTotalItemType="user"

          style={{ position: 'absolute', left: (900 + listLeftPosition), top: 0 }}
          noResultsPlaceholder={strings.noUsersFound}
        />

        {/* Modals */}
        {this.state.isTabModalVisible && <AdminTabModal
          isVisible
          loading={this.props.saving || this.props.deleting}
          showDelete={canDelete && !!this.state.tabDetails.id && !this.state.tabDetails.childCount}
          onDelete={this.handleToggleConfirmTabDelete}
          onChange={this.handleTabChange}
          onClose={this.handleToggleTabModal}
          onSave={this.handleTabSave}
          onThumbnailClick={this.handleTabThumbnailClick}
          {...this.state.tabDetails}
        />}
        {this.state.isChannelModalVisible && <AdminChannelModal
          isVisible={this.state.isChannelModalVisible}
          loading={this.props.saving || this.props.deleting}
          showDelete={canDelete && !!this.state.channelDetails.id && !this.state.channelDetails.childCount}
          onDelete={this.handleToggleConfirmChannelDelete}
          onChange={this.handleChannelChange}
          onClose={this.handleToggleChannelModal}
          onSave={this.handleChannelSave}
          onThumbnailClick={this.handleChannelThumbnailClick}
          {...this.state.channelDetails}
        />}
        {this.state.isGroupModalVisible && <AdminGroupModal
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
          statusOptions={statusList}
          configurationBundleList={this.props.confBundle}
          isVisible
          onChange={this.handleUserChange}
          onClose={this.handleToggleUserModal}

          limitedView={this.state.userDetails.id && ((userCapabilities.isGroupAdmin && !(userCapabilities.isGroupAdminAdvanced || userCapabilities.isAdmin)) || this.state.userDetails.roleId > user.roleId)}
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
          onToggleIsAdministrator={this.handleToggleIsAdministrator}
        />}
        {/* Image Pickers */}
        {/* Tab Image Picker Modal */}
        {this.state.tabImagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleTabImagePickerCancel}
          onSave={this.handleTabImagePickerSave}
        />}
        {/* Channel Image Picker Modal */}
        {this.state.channelImagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleChannelImagePickerCancel}
          onSave={this.handleChannelImagePickerSave}
        />}
        {/* Group Image Picker Modal */}
        {this.state.groupImagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleGroupImagePickerCancel}
          onSave={this.handleGroupImagePickerSave}
        />}
        {/* Confirm Dialog */}
        {this.state.confirmTabDelete && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteTabMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmTabDelete}
          onConfirm={this.handleTabDelete}
        />}
        {this.state.confirmChannelDelete && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteChannelMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmChannelDelete}
          onConfirm={this.handleChannelDelete}
        />}
        {this.state.confirmGroupDelete && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteGroupMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmGroupDelete}
          onConfirm={this.handleGroupDelete}
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
        {this.state.confirmRemoveChannel && <Dialog
          title={strings.confirmRemoveChannelHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.remove}
          onCancel={this.handleToggleConfirmRemoveChannel}
          onConfirm={this.handleRemoveChannelClick}
        >
          <FormattedMessage
            id="confirm-remove-channel-message"
            defaultMessage={'This action only removes "{name}" from the "{tabName}". "{name}" will still be available in other {tabs} it is a member of.'}
            values={{ name: this.state.channelDetails.name, tabName: this.props.tabSelected.name, ...naming }}
            tagName="p"
          />
        </Dialog>}
        {this.state.confirmRemoveGroup && <Dialog
          title={strings.confirmRemoveGroupHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.remove}
          onCancel={this.handleToggleConfirmRemoveGroup}
          onConfirm={this.handleRemoveGroupClick}
        >
          <FormattedMessage
            id="confirm-remove-group-message"
            defaultMessage={'This action only removes "{name}" from the "{channelName}" {channel}. "{name}" will still be available in other {channels} it is a member of.'}
            values={{ name: this.state.groupDetails.name, channelName: this.props.channelSelected.name, ...naming }}
            tagName="p"
          />
        </Dialog>}
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
