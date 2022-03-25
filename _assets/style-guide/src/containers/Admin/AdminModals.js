import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';
import AdminTabModal from 'components/Admin/AdminManageList/Modals/AdminTabModal';
import AdminChannelModal from 'components/Admin/AdminManageList/Modals/AdminChannelModal';
import AdminGroupModal from 'components/Admin/AdminManageList/Modals/AdminGroupModal';
import AdminUserModal from 'components/Admin/AdminManageList/Modals/AdminUserModal';
import AdminUserDetails from 'components/Admin/AdminManageList/AdminUserDetails';
import AdminUserDefaultsModal from 'components/Admin/AdminManageList/Modals/AdminUserDefaultsModal';
import AdminUserDefaultNotificationModal from 'components/Admin/AdminManageList/Modals/AdminUserDefaultNotificationModal';
import AdminWebsiteModal from 'components/Admin/AdminManageList/Modals/AdminWebsiteModal';
import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';

const ManageListDocs = require('!!react-docgen-loader!components/Admin/AdminManageList/AdminManageList.js');

const websites = require('../../static/websites.json');
const tabs = require('../../static/tabs.json');
const channels = require('../../static/channels.json');
const groups = require('../../static/groups.json');
const users = require('../../static/users.json');
const confBundleList = require('../../static/configurationBundles.json');
const userNotifications = require('../../static/userNotifications.json');
const userDefaultNotifications = require('../../static/admin/userDefaultNotification.json');

// User Modal
const languages = {
  'en-us': 'English (US)',
  'en-gb': 'English (UK)',
  'da':'Dansk',
  'de':'Deutsch',
  'es':'Español',
  'fr':'Français',
  'it':'Italiano',
  'ja':'日本語',
  'ko':'한국어',
  'no':'Norsk',
  'pt-br':'Portuguese',
  'ru':'русский',
  'sv':'Svenska',
  'th':'ไทย',
  'tr': 'Türkçe',
  'zh-cn': '中文(简体)',
  'zh-hk': '中文(繁體)'
}

const roles = [
  {id: 0, name: 'User'},
  {id: 2, name: 'Structure Administrator'},
  {id: 4, name: 'Administrator'},
  {id: 7, name: 'Company Manager'},
  {id: 10, name: 'Super User'},
];

const statusList = [
  {id: 'invited', name: 'Invited'}, //shows only if user status is invited
  {id: 'active', name: 'Active'},
  {id: 'inactive', name: 'Inactive'},
  {id: 'renew_password', name: 'Force Password Change'}, //auth_type == 'db'
];

const digestEmailOptions = [
  {id: 0, name: 'Never'},
  {id: 1, name: 'Daily'},
  {id: 2, name: 'Weekly'},
  {id: 3, name: 'Monthly'}
];
// .--

export default class AdminModalsView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    const allUsers = {
      id: -1,
      type: 'group',
      name: 'All users',
      colour: '#222',
      childCount: 20,
      childType: 'user',
      showGlobalAvatar: true,
      showBulkUpload: true,
      showUserDefault: true,
      showUserDefaultNotifications: true,
      showDefaultMetadata: true,
      onUserDefaultsClick: this.handleUserDefaultsClick,
      onBulkUploadClick: this.handleBulkUploadClick,
      onUserDefaultNotificationsClick: () => {},
      onDefaultMetadataClick: () => {},
    };
    const tmpGroup = [allUsers].concat(groups);

    const userDetails = {
      type: 'people',
      id: 1,
      firstName: 'Pepe',
      lastName: 'Test',
      email: 'Test@test.com',
      phone: '+585636969',
      thumbnail: 'src/static/images/user1.png',
      defaultLanguage: 'en-us',
      role: 2,
      jobTitle: 'tester',
      status: 'active',
      storyPromoting: 0,
      digestEmail: 1,
      configurationBundle: confBundleList[2].id,
      timezone: 'America/Boa_Vista',
      platform: {
        value: {
          ios: false,
          android: false,
          web: false,
          windows: false
        },
        update: false
      },
      groups: groups.slice(0, 20),
      metadata: [
        {
          'id': 382,
          'attribute': {
            'id': 111,
            'name': 'Role',
            'locked': 0,
            'visibility': 1,
            'sequence': 0
          },
          'attributeValue': 'Developer'
        },
        {
          'id': 396,
          'attribute': {
            'id': 115,
            'name': 'test1',
            'locked': 0,
            'visibility': 0,
            'sequence': 0
          },
          'attributeValue': 'b'
        }
      ]
    };

    const userDetailsObject = {};
    Object.entries(userDetails).forEach(function (item, key) {
      userDetailsObject[item[0]] = { value: item[1] };
    });

    userDetailsObject.langCode = { value: 'en-us' };
    userDetailsObject.configurationBundle = { value: 397 };

    this.state = {
      manageListGroups: tmpGroup,
      itemSelectedGroup: {},
      itemSelectedUser: {},
      toggle: false,

      confBundleListDefaults: confBundleList.map((item) => ({ value: item })),

      // Website modal
      websiteDetails: websites[1],
      isWebsiteModalVisible: false,

      // Tab modal
      tabDetails: tabs[1],
      isTabModalVisible: false,

      // Channel modal
      channelDetails: channels[1],
      isChannelModalVisible: false,

      // Group modal
      groupDetails: groups[1],
      isGroupModalVisible: false,

      // User modal
      userDetails: userDetails,

      userDefaultDetails: {
        langCode: { value: 'en-us', update: false },
        status: { value: 'active', update: false },
        storyPromoting: { value: 0, update: false },
        digestEmail: { value: 1, update: false },
        configurationBundle: { value: confBundleList[2].id, update: false },
        timezone: { value: 'America/Boa_Vista', update: false },
        reporting: {
          value: {
            enablePersonalReports:false,
            enableCompanyReports: false,
            enableAdvancedReports: false,
          },
          update: false
        },
        /*platforms: {
          value: {
            ios: false,
            android: false,
            false: false,
            windows: false
          },
          update: false
        },*/
        platform: {
          value: {
            ios: false,
            android: false,
            web: false,
            windows: false
          },
          update: false
        },
      },
      editUserModalVisible: false,
      userDefaultSettingsModalVisible: false,
      userDefaultNotificationModalVisible: false,
      userDefaultNotifications: userDefaultNotifications,
      groupList: groups,
      groups: groups.slice(2, 5),
    };
    autobind(this);
  }

  /* User Section */
  handleUserDefaultSettingsClick() {
    this.setState({
      userDefaultSettingsModalVisible: !this.state.userDefaultSettingsModalVisible
    });
  }
  handleUserDefaultNotificationClick() {
    this.setState({
      userDefaultNotificationModalVisible: !this.state.userDefaultNotificationModalVisible
    });
  }
  handleUserEditClick(event, context) {
    this.setState({
      editUserModalVisible: !this.state.editUserModalVisible
    });
  }
  toggleUserModal() {
    this.setState({
      editUserModalVisible: !this.state.editUserModalVisible
    });
  }
  toggleUserDefaultModal() {
    this.setState({
      userDefaultSettingsModalVisible: !this.state.userDefaultSettingsModalVisible
    });
  }
  toggleUserDefaultNotificationModal() {
    this.setState({
      userDefaultNotificationModalVisible: !this.state.userDefaultNotificationModalVisible
    });
  }

  // User modal functions
  handleUserChange(data) {
    const key = data.key;
    let value = data.value;

    if (data.key === 'platforms') {
      const tmpPlatforms = Object.assign({}, this.state.userDetails.platforms);
      tmpPlatforms[data.type] = !!data.value;
      value = tmpPlatforms;
    }

    if (data.key === 'storyPromoting') {
      value = parseInt(data.value, 10);
    }

    const tmpUserDetails = this.state.userDetails;
    tmpUserDetails[key] = value;

    this.setState({
      userDetails: tmpUserDetails,
      toggle: !this.state.toggle
    })
  }

  handleUserDefaultChange(data) {
    const key = data.key;
    let value = {
      value: data.value,
      update: this.state.userDefaultDetails[key].update
    };

    switch(data.key) {
      case 'platforms':
        // Update platforms object
        const tmpPlatforms = Object.assign({}, this.state.userDefaultDetails.platforms);
        if (data.attribute === 'update') {
          tmpPlatforms.update = !!data.value;
        } else {
          tmpPlatforms.value[data.type] = !!data.value;
        }
        value = tmpPlatforms;
        break;
      case 'reporting':
        // Update reporting object
        const tmpData = Object.assign({}, this.state.userDefaultDetails.reporting);
        if (data.attribute === 'update') {
          tmpData.update = !!data.value;
        } else {
          tmpData.value[data.type] = !!data.value;
        }
        value = tmpData;
        break;
      default:
        if (data.attribute === 'update') {
          // Set update flag
          value.value = this.state.userDefaultDetails[key].value;
          value.update = data.value;
        }
        break;
    }

    const tmpUserDetails = this.state.userDefaultDetails;
    tmpUserDetails[key] = value;

    this.setState({
      userDefaultDetails: tmpUserDetails,
      toggle: !this.state.toggle
    });
  }

  // Group list actions
  handleGroupSearchChange(e) {
    const { value } = e.currentTarget;

    let groupListFiltered = groups; // Shows all items
    if (value) {
      groupListFiltered = this.state.groupList.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }

    this.setState({
      groupList: groupListFiltered
    });
  }

  handleRemoveGroup(id) {
    const { groupList, groups } = this.state;
    const groupListFiltered = groups.filter(item => item.id !== Number(id));
    groupList.find(item => item.id === Number(id)).selected = false;

    this.setState({
      groups: groupListFiltered
    });
  }

  handleAddGroup(id) {
    const { groupList, groups } = this.state;
    const item = groupList.find(item => item.id === Number(id));
    item.selected = true;
    const nGroups = groups.concat(item);

    this.setState({
      groups: nGroups
    });
  }

  /* Website section */
  handleWebsiteChange(data) {
    const key = data.key;
    let value = data.value;

    const websiteDetails = this.state.websiteDetails;
    websiteDetails[key] = value;

    this.setState({
      websiteDetails: websiteDetails,
      toggle: !this.state.toggle
    })
  }

  toggleWebsiteModal() {
    this.setState({
      isWebsiteModalVisible: !this.state.isWebsiteModalVisible
    });
  }

  /* Tab section */
  handleTabChange(data) {
    const key = data.key;
    let value = data.value;

    const tmpTabDetails = this.state.tabDetails;
    tmpTabDetails[key] = value;

    this.setState({
      tabDetails: tmpTabDetails,
      toggle: !this.state.toggle
    })
  }
  toggleTabModal() {
    this.setState({
      isTabModalVisible: !this.state.isTabModalVisible
    });
  }

  handleThumbnailClick() {
    const { tabDetails } = this.state;
    // Clear thumbnail if one is already set
    if (tabDetails.thumbnail) {
      tabDetails.thumbnail = '';

      this.setState({
        tabDetails: tabDetails,
        toggle: !this.state.toggle
      });

      // Show image browser
    } else {
      this.setState({
        isTabModalVisible: false,
      });
      console.log('Hide modal to show Image Picker')
    }
  }

  handleWebThumbnailClick() {
    const { websiteDetails } = this.state;
    // Clear thumbnail if one is already set
    if (websiteDetails.thumbnail) {
      websiteDetails.thumbnail = '';

      this.setState({
        websiteDetails: websiteDetails,
        toggle: !this.state.toggle
      });

      // Show image browser
    } else {
      this.setState({
        isWebsiteModalVisible: false,
      });
      console.log('Hide modal to show Image Picker')
    }
  }

  handleDeleteModal() {
    console.log('Delete clicked');
  }

  /* Channel modal */
  toggleChannelModal() {
    this.setState({
      isChannelModalVisible: !this.state.isChannelModalVisible
    });
  }
  handleChannelChange(data) {
    const key = data.key;
    let value = data.value;

    const tmpDetails = this.state.channelDetails;
    tmpDetails[key] = value;

    this.setState({
      channelDetails: tmpDetails,
      toggle: !this.state.toggle
    })
  }
  handleChannelThumbnailClick() {
    const { channelDetails } = this.state;
    // Clear thumbnail if one is already set
    if (channelDetails.thumbnail) {
      channelDetails.thumbnail = '';

      this.setState({
        channelDetails: channelDetails,
        toggle: !this.state.toggle
      });

      // Show image browser
    } else {
      this.setState({
        isChannelModalVisible: false,
      });
      console.log('Hide modal to show Image Picker')
    }
  }

  /* Group modal */
  toggleGroupModal() {
    this.setState({
      isGroupModalVisible: !this.state.isGroupModalVisible
    });
  }
  handleGroupChange(data) {
    const key = data.key;
    let value = data.value;

    const tmpDetails = this.state.groupDetails;
    tmpDetails[key] = value;

    this.setState({
      groupDetails: tmpDetails,
      toggle: !this.state.toggle
    })
  }
  handleGroupThumbnailClick() {
    const { groupDetails } = this.state;
    // Clear thumbnail if one is already set
    if (groupDetails.thumbnail) {
      groupDetails.thumbnail = '';

      this.setState({
        groupDetails: groupDetails,
        toggle: !this.state.toggle
      });

      // Show image browser
    } else {
      this.setState({
        isGroupModalVisible: false,
      });
      console.log('Hide modal to show Image Picker')
    }
  }

  handleResendInvitation() {
    console.log('Resend invitation');
  }
  handleResetBoardingExperience() {
    console.log('Reset on boarding exp');
  }

  /** Group functions **/
  handleOpenCreate() {
    console.log('Open Create modal');
  }
  handleGroupClick(event, context) {
    const parentContainer = event.target.parentElement.nodeName;
    if (parentContainer.toLowerCase() !== 'li') { // it isn't the info icon clicked
      this.setState({
        itemSelectedGroup: {id: context.id, name: context.name, position: context.position},
        lastClick: context.name,
      });
    }
  }
  handleUserDefaultsClick() {
    console.log('onUserDefaultsClick');
  }
  handleBulkUploadClick() {
    console.log('Bulk upload clicked');
  }
  handleGroupBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }
  handleGroupFilterChange(event) {
    this.setState({ filterValueGroup: event.currentTarget.value });
  }
  handleGroupFilterClear() {
    this.setState({ filterValueGroup: '' });
  }

  /** User functions dummy **/
  handleUserClick(event, context) {
    this.setState({
      itemSelectedUser: { id: context.id, name: context.name, position: context.position },
      lastClick: context.name,
    });
  }
  handleUserBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }
  handleUserFilterChange(event) {
    this.setState({ filterValueUser: event.currentTarget.value });
  }
  handleUserFilterClear() {
    this.setState({ filterValueUser: '' });
  }

  render() {
    const {
      itemSelectedGroup,
      itemSelectedUser,
      userDefaultNotifications,
    } = this.state;

    return (
      <section id="NavMenuView">
        <h1>Manage Lists Modals</h1>
        <Docs {...ManageListDocs} />

        <h2>Add or Edit Modals</h2>
        <p>Items used in Manage Structure.</p>

        <ComponentItem style={{ backgroundColor: '#ffffff', height: 60, display: 'flex' }}>
          <Btn alt onClick={this.toggleWebsiteModal}>Website Modal</Btn>
          <Btn alt onClick={this.toggleTabModal}>Tab Modal</Btn>
          <Btn alt onClick={this.toggleChannelModal}>Channel Modal</Btn>
          <Btn alt onClick={this.toggleGroupModal}>Group Modal</Btn>
          <Btn alt onClick={this.handleUserEditClick}>User Modal</Btn>
          <Btn alt onClick={this.handleUserDefaultSettingsClick}>User Default Settings Modal</Btn>
          <Btn alt onClick={this.handleUserDefaultNotificationClick}>User Default Notifications Modal</Btn>

          {/* Modals */}
          <AdminTabModal
            isVisible={this.state.isTabModalVisible}
            showDelete
            onDelete={this.handleDeleteModal}
            onChange={this.handleTabChange}
            onClose={this.toggleTabModal}
            onThumbnailClick={this.handleThumbnailClick}
            {...this.state.tabDetails}
          />

          <AdminWebsiteModal
            isVisible={this.state.isWebsiteModalVisible}
            showDelete
            onDelete={this.handleDeleteModal}
            onChange={this.handleWebsiteChange}
            onClose={this.toggleWebsiteModal}
            onThumbnailClick={this.handleWebThumbnailClick}
            {...this.state.websiteDetails}
          />

          <AdminChannelModal
            isVisible={this.state.isChannelModalVisible}
            showDelete
            onDelete={this.handleDeleteModal}
            onChange={this.handleChannelChange}
            onClose={this.toggleChannelModal}
            onThumbnailClick={this.handleChannelThumbnailClick}
            {...this.state.channelDetails}
          />

          <AdminGroupModal
            isVisible={this.state.isGroupModalVisible}
            showDelete
            onDelete={this.handleDeleteModal}
            onChange={this.handleGroupChange}
            onClose={this.toggleGroupModal}
            onThumbnailClick={this.handleGroupThumbnailClick}
            {...this.state.groupDetails}
          />

          <AdminUserModal
            languageList={languages}
            roleOptions={roles}
            digestEmailOptions={digestEmailOptions}
            statusOptions={statusList}
            configurationBundleList={confBundleList}
            isVisible={this.state.editUserModalVisible}
            onChange={this.handleUserChange}
            onClose={this.toggleUserModal}
            {...this.state.userDetails}

            groupList={this.state.groupList}
            groups={this.state.groups}
            onAddGroupItem={this.handleAddGroup}
            onRemoveGroupItem={this.handleRemoveGroup}
            onGroupSearchChange={this.handleGroupSearchChange}
          />

          <AdminUserDefaultsModal
            notifications={userNotifications}
            languageList={languages}
            digestEmailOptions={digestEmailOptions}
            configurationBundleList={confBundleList}
            isVisible={this.state.userDefaultSettingsModalVisible}
            onChange={this.handleUserDefaultChange}
            onClose={this.toggleUserDefaultModal}
            langCode={{}}
            privateActivity={{}}
            {...this.state.userDefaultDetails}
          />

          <AdminUserDefaultNotificationModal
            notifications={userDefaultNotifications}
            languageList={languages}
            digestEmailOptions={digestEmailOptions}
            configurationBundleList={confBundleList}
            isVisible={this.state.userDefaultNotificationModalVisible}
            onChange={this.handleUserDefaultChange}
            onClose={this.toggleUserDefaultNotificationModal}
            {...this.state.userDefaultDetails}
          />
        </ComponentItem>


        <h2>User Details</h2>
        <p>Items used in Manage Users.</p>
        <ComponentItem style={{ backgroundColor: '#ffffff', display: 'flex', height: '620px' }}>

          <AdminManageList
            list={this.state.manageListGroups.filter(obj => !obj.deleted)}
            headerTitle={'Groups'}
            width={300}
            height={600}
            placeholder={'Select Group'}
            itemSelected={itemSelectedGroup}

            showEdit
            onGetList={() => {}}
            onGetSearchList={() => {}}
            onBreadcrumbClick={this.handleUserBreadcrumbClick}
            onItemClick={this.handleGroupClick}
            onEditClick={this.toggleGroupModal}

            showCreate
            onCreateClick={this.handleOpenCreate}

            showFilter
            filterValue={this.state.filterValueGroup}
            filterPlaceholder="Filter"
            onFilterChange={this.handleGroupFilterChange}
            onFilterClear={this.handleGroupFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 20, top: 17 }}

            noResultsPlaceholder={'No Groups Found'}
          />

          <AdminManageList
            list={users.map(element => ({ note: element.email, ...element }))}
            headerTitle={'Users'}
            width={300}
            height={600}
            placeholder={'Select User'}
            itemSelected={itemSelectedUser}
            showEdit
            onGetList={() => {}}
            onGetSearchList={() => {}}
            onBreadcrumbClick={this.handleUserBreadcrumbClick}
            onItemClick={this.handleUserClick}
            onEditClick={this.handleUserEditClick}

            addNewLabel={'Add new Users'}
            addExistingLabel={'Add existing Users'}
            showExisting

            showCreate
            onCreateClick={this.handleOpenCreate}

            hidePlaceholderArrow

            showSearch
            searchList={users.map(element => ({ note: element.email, ...element }))}
            searchInputValue={this.state.searchInputValueUser}
            searchInputPlaceholder={'Add User'}
            searchListHeader={'Select User'}
            onSearchChange={() => {}}
            onSearchClear={() => {}}
            onAddClick={() => {}}

            showFilter
            filterValue={this.state.filterValueUser}
            filterPlaceholder="Filter"
            onFilterChange={this.handleUserFilterChange}
            onFilterClear={this.handleUserFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 320, top: 17 }}

            noResultsPlaceholder={'No Users in Group'}
          />

          <AdminUserDetails
            width={300}
            height={600}
            style={{ position: 'absolute', left: 620, top: 17 }}

            {...this.state.userDetails}
            role={roles.find(item => item.id === Number(this.state.userDetails.role)).name}
            status={statusList.find(item => item.id === this.state.userDetails.status).name}
            configurationBundle={confBundleList.find(item => item.id === Number(this.state.userDetails.configurationBundle))}

            showResetBoardingExperience
            showResendInvitation
            onResetBoardingExperienceClick={this.handleResetBoardingExperience}
            onResendInvitationClick={this.handleResendInvitation}
          />

        </ComponentItem>
      </section>
    );
  }
}
