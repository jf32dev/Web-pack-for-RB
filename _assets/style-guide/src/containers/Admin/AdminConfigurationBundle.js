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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminUserModal from 'components/Admin/AdminManageList/Modals/AdminUserModal';

const ConfigurationBundleDocs = require('!!react-docgen-loader!components/ConfigurationBundleItem/ConfigurationBundleItem.js');
const ManageListDocs = require('!!react-docgen-loader!components/Admin/AdminManageList/AdminManageList.js');

const confBundleList = require('../../static/configurationBundles.json');
const userList = require('../../static/users.json');
const tabs = require('../../static/tabs.json');
const channels = require('../../static/channels.json');
const groups = require('../../static/groups.json');

const languages = {
  "en-us": "English (US)",
  "en-gb": "English (UK)",
  "da":"Dansk",
  "de":"Deutsch",
  "es":"Español",
  "fr":"Français",
  "it":"Italiano",
  "ja":"日本語",
  "ko":"한국어",
  "no":"Norsk",
  "pt-br":"Portuguese",
  "ru":"русский",
  "sv":"Svenska",
  "th":"ไทย",
  "tr": "Türkçe",
  "zh-cn": "中文(简体)",
  "zh-hk": "中文(繁體)"
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

export default class AdminConfigurationBundleView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    basePath: '/admin'
  };

  constructor(props) {
    super(props);
    this.state = {
      filterValue: '',
      itemSelected: {},
      lastClick: null,

      itemSelectedUser: {},
      filterValueUser: '',

      userList: userList.slice(0, 8),
      searchList: userList.slice(9, 20),

      userDetails: {
        id: 1,
        firstName: 'Pepe',
        lastName: 'Test',
        email: 'Test@test.com',
        defaultLanguage: 'en-us',
        role: 2,
        jobTitle: 'tester',
        status: 'active',
        storyPromoting: 0,
        digestEmail: 1,
        configurationBundle: confBundleList[2].id,
        timeZone: 'America/Boa_Vista',
        platforms: {
          ios: false,
          android: true,
          web: true,
          windows: false
        }
      },
      toggle: false,

      groupList: groups,
      selectedGroups: groups.slice(2, 5)
    };
    autobind(this);
  }

  handleOpenCreate() {
    console.log('Open Create modal');
  }
  handleClick(event, context) {
    this.setState({
      itemSelected: { id: context.id, name: context.name, position: context.position },
      lastClick: context.name,
    });
  }
  handleBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }
  handleEditClick(event) {
    console.log('Edit clicked open modal');
  }
  handleFilterChange(event) {
    this.setState({ filterValue: event.currentTarget.value });
  }
  handleFilterClear() {
    this.setState({ filterValue: '' });
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

  handleUserFilterChange(event) {
    this.setState({ filterValueUser: event.currentTarget.value });
  }
  handleUserFilterClear() {
    this.setState({ filterValueUser: '' });
  }
  handleUserAddInputChange(event) {
    this.setState({ searchInputValueUser: event.currentTarget.value });
  }
  handleUserAddClear() {
    this.setState({ searchInputValueUser: '' });
  }
  handleUserAddItems(items) {
    // Remove items from search
    // Insert Items in userList
    this.setState({
      userList: [ ...this.state.userList, ...items ],
      searchList: this.state.searchList.filter(obj => !items.find( item => item.id === obj.id))
    });
  }

  handleListScroll(event) {
    const target = event.currentTarget;
    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger) {
      // Load more
      console.log('scrolling again');
    }
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
    const { groupList, selectedGroups } = this.state;
    const groupListFiltered = selectedGroups.filter(item => item.id !== Number(id));
    groupList.find(item => item.id === Number(id)).isSelected = false;

    this.setState({
      selectedGroups: groupListFiltered
    });
  }

  handleAddGroup(id) {
    const { groupList, selectedGroups } = this.state;
    const item = groupList.find(item => item.id === Number(id));
    item.isSelected = true;
    const nGroups = selectedGroups.concat(item);

    this.setState({
      selectedGroups: nGroups
    });
  }

  render() {
    const {
      itemSelected,
      itemSelectedUser,
      lastClick
    } = this.state;

    return (
      <section id="NavMenuView">
        <h1>Configuration Bundle Lists</h1>
        <Docs {...ManageListDocs} />
        <Docs {...ConfigurationBundleDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>Manage Configuration bundle</h2>
        <p>Items used in Admin components.</p>

        <ComponentItem style={{ backgroundColor: '#ffffff', width: 660, height: 620, display: 'flex' }}>
          <AdminManageList
            list={confBundleList}
            headerTitle={'Configuration Bundles'}
            width={300}
            height={600}
            placeholder={'Select Conf. Bundle'}
            itemSelected={itemSelected}
            showEdit
            onGetList={() => {}}

            onBreadcrumbClick={this.handleBreadcrumbClick}
            onItemClick={this.handleClick}
            onEditClick={this.handleEditClick}

            showCreate
            onCreateClick={this.handleOpenCreate}

            showFilter
            filterValue={this.state.filterValue}
            filterPlaceholder="Filter"
            onFilterChange={this.handleFilterChange}
            onFilterClear={this.handleFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 30, top: 17 }}
          />

          <AdminManageList
            // Add email as note attribute to users
            list={this.state.userList.map(element => ({ note: element.email, roleId: 10, ...element }))}
            headerTitle={'Users'}
            width={300}
            height={600}
            placeholder={'Select User'}
            itemSelected={itemSelectedUser}
            showEdit
            onGetList={() => {}}

            onBreadcrumbClick={this.handleUserBreadcrumbClick}
            onItemClick={this.handleUserClick}
            onEditClick={this.handleUserEditClick}

            showSearch
            onGetSearchList={() => {}}
            searchList={this.state.searchList.map(element => ({ note: element.email, roleId: 10, ...element }))}
            searchInputValue={this.state.searchInputValueUser}
            searchInputPlaceholder={'Add User'}
            searchListHeader={'Select User'}
            onSearchChange={this.handleUserAddInputChange}
            onSearchClear={this.handleUserAddClear}
            onAddClick={this.handleUserAddItems}

            showFilter
            filterValue={this.state.filterValueUser}
            filterPlaceholder="Filter"
            onFilterChange={this.handleUserFilterChange}
            onFilterClear={this.handleUserFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 330, top: 17 }}

            noResultsPlaceholder={'No Users in Configuration Bundle'}
            noResultsInSearchPlaceholder={'No Users in Configuration Bundle'}
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
            selectedGroups={this.state.selectedGroups}
            onAddGroupItem={this.handleAddGroup}
            onRemoveGroupItem={this.handleRemoveGroup}
            onGroupSearchChange={this.handleGroupSearchChange}
          />

        </ComponentItem>
      </section>
    );
  }
}
