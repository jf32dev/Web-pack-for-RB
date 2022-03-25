import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import AdminChannelSettings from 'components/Admin/AdminChannelSettings/AdminChannelSettings';
import AdminGroupSettings from 'components/Admin/AdminGroupSettings/AdminGroupSettings';
import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminTabModal from 'components/Admin/AdminManageList/Modals/AdminTabModal';

const ManageListDocs = require('!!react-docgen-loader!components/Admin/AdminManageList/AdminManageList.js');

const userList = require('../../static/users.json');
const tabs = require('../../static/tabs.json');
const channels = require('../../static/channels.json');
const groups = require('../../static/groups.json');

export default class AdminManageListView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    basePath: '/admin'
  };

  constructor(props) {
    super(props);
    this.state = {
      lastClick: null,

      userList: userList.slice(0, 8),
      searchList: userList.slice(9, 20),

      channelList: channels.slice(0, 8),
      searchChannelList: channels.slice(9, 20),

      groupList: groups.slice(0, 5),
      searchGroupList: groups.slice(6, 20),

      itemSelectedTab: {},
      filterValueTab: '',

      itemSelectedChannel: {},
      filterValueChannel: '',

      itemSelectedGroup: {},
      filterValueGroup: '',

      itemSelectedUser: {},
      filterValueUser: '',

      searchInputValueChannel: '',
      searchInputValueGroup: '',
      searchInputValueUser: '',

      isSaveLoading: false,
      toggleInfo: false,
      toggleGroupInfo: false,

      // Modals
      tabDetails: {},
      isTabModalVisible: false,
      toggle: false,
    };
    autobind(this);
  }

  handleOpenCreate() {
    console.log('Open Create modal');
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
  handleUserEditClick(event) {
    console.log('Edit clicked open modal');
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

  /* Tab section */
  handleTabGraphClick(e, context) {
    const item = context.list.find(obj => obj.id === context.itemSelected.id);
    //const id = item.id;
    //const type = item.type;
    console.log(item);
  }
  handleTabClick(event, context) {
    this.setState({
      itemSelectedTab: { id: context.id, name: context.name, position: context.position },
      lastClick: context.name,
    });
  }
  handleTabBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }

  handleTabCreateClick() {
    this.setState({
      tabDetails: {
        'id': 0,
        'name': '',
        'description': '',
        'type': 'tab',
        'isPersonal': false,
        'thumbnailId': 21596,
        'colour': '#7e00b9',
        'thumbnail': '',
        'childCount': 19
      },
      isTabModalVisible: !this.state.isTabModalVisible
    });
  }
  handleTabEditClick(event, context) {
    this.setState({
      tabDetails: context.props,
      isTabModalVisible: !this.state.isTabModalVisible
    });
  }
  handleTabFilterChange(event) {
    this.setState({ filterValueTab: event.currentTarget.value });
  }
  handleTabFilterClear() {
    this.setState({ filterValueTab: '' });
  }

  /** Channel functions dummy **/
  handleChannelClick(event, context) {
    const parentContainer = event.target.parentElement.nodeName;
    if (parentContainer.toLowerCase() !== 'li') { // it isn't the info icon clicked
      this.setState({
        itemSelectedChannel: {id: context.id, name: context.name, position: context.position},
        lastClick: context.name,
      });
    }
  }
  handleChannelBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }
  handleChannelEditClick(event) {
    console.log('Edit clicked open modal');
  }
  handleUnlinkChannelClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Unlink clicked');
  }
  handleRemoveChannelClick(event, context) {
    const channel = context.channel || context;
    console.log('Remove Channel:' + channel.name);
    const nList = Object.assign([], this.state.channelList);
    const obj = nList.find(x => x.id === channel.id);
    obj.deleted = true;
    this.setState({ channelList: nList });
  }
  handleChannelFilterChange(event) {
    this.setState({ filterValueChannel: event.currentTarget.value });
  }
  handleChannelFilterClear() {
    this.setState({ filterValueChannel: '' });
  }
  handleChannelAddInputChange(event) {
    this.setState({ searchInputValueChannel: event.currentTarget.value });
  }
  handleChannelAddClear() {
    this.setState({ searchInputValueChannel: '' });
  }
  handleChannelAddItems(items) {
    // Remove items from search
    // Insert Items in userList
    this.setState({
      channelList: [ ...this.state.channelList, ...items ],
      searchChannelList: this.state.searchChannelList.filter(obj => !items.find( item => item.id === obj.id))
    });
  }

  /** Group functions **/
  handleGroupClick(event, context) {
    const parentContainer = event.target.parentElement.nodeName;
    if (parentContainer.toLowerCase() !== 'li') { // it isn't the info icon clicked
      this.setState({
        itemSelectedGroup: {id: context.id, name: context.name, position: context.position},
        lastClick: context.name,
      });
    }
  }
  handleGroupBreadcrumbClick(event, context) {
    console.log('Scroll to:' + context.name);
  }
  handleGroupEditClick(event) {
    console.log('Edit clicked open modal');
  }
  handleUnlinkGroupClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Unlink clicked');
  }
  handleGroupFilterChange(event) {
    this.setState({ filterValueGroup: event.currentTarget.value });
  }
  handleGroupFilterClear() {
    this.setState({ filterValueGroup: '' });
  }
  handleGroupAddInputChange(event) {
    this.setState({ searchInputValueGroup: event.currentTarget.value });
  }
  handleGroupAddClear() {
    this.setState({ searchInputValueGroup: '' });
  }
  handleGroupAddItems(items) {
    // Remove items from search
    // Insert Items in userList
    this.setState({
      groupList: [ ...this.state.groupList, ...items ],
      searchGroupList: this.state.searchGroupList.filter(obj => !items.find( item => item.id === obj.id))
    });
  }
  handleGroupSettingsChange(e, context) {
    const nList = Object.assign([], this.state.groupList);
    const obj = nList.find(x => x.id === context.group.id);
    obj.permissions = parseInt(e.currentTarget.value, 10);

    this.setState({ groupList: nList });
  }
  handleRemoveGroupClick(event, context) {
    const group = context.group || context;
    console.log('Remove Group:' + group.name);
    const nList = Object.assign([], this.state.groupList);
    const obj = nList.find(x => x.id === group.id);
    obj.deleted = true;
    this.setState({ groupList: nList });
  }
  /* /-- */

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

  /* Modals */
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
    const tmpDetails = Object.assign({}, tabDetails);

    // Clear thumbnail if one is already set
    if (tmpDetails.thumbnail) {
      tmpDetails.thumbnail = '';
      tmpDetails.colour = tabDetails.colour || '#ccc';

      this.setState({
        tabDetails: tmpDetails,
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

  render() {
    const {
      itemSelectedTab,
      itemSelectedChannel,
      itemSelectedGroup,
      itemSelectedUser,
      lastClick
    } = this.state;

    return (
      <section id="NavMenuView">
        <h1>Manage Lists</h1>
        <Docs {...ManageListDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>Manage Structure List Items</h2>
        <p>Items used in Admin components.</p>

        <ComponentItem style={{ backgroundColor: '#ffffff', overflowY: 'hidden', overflowX: 'auto', height: 620, display: 'flex' }}>
          <AdminManageList
            list={tabs}
            headerTitle={'Tabs'}
            width={300}
            height={600}
            placeholder={'Select Tab'}
            itemSelected={itemSelectedTab}
            showEdit

            onGetList={() => {}}
            onGetSearchList={() => {}}
            onBreadcrumbClick={this.handleTabBreadcrumbClick}
            onItemClick={this.handleTabClick}
            onEditClick={this.handleTabEditClick}

            addNewLabel={'Add new Tab'}
            showCreate
            onCreateClick={this.handleTabCreateClick}

            showGraph
            onGraphClick={this.handleTabGraphClick}

            showFilter
            filterValue={this.state.filterValueTab}
            filterPlaceholder="Filter"
            onFilterChange={this.handleTabFilterChange}
            onFilterClear={this.handleTabFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 30, top: 17 }}
          />

          <AdminManageList
            list={this.state.channelList.filter(obj => !obj.deleted)}
            headerTitle={'Channels'}
            width={300}
            height={600}
            placeholder={'Select Channel'}
            itemSelected={itemSelectedChannel}
            showEdit
            onGetList={() => {}}
            onGetSearchList={() => {}}

            showUnlink
            onUnlinkClick={this.handleUnlinkChannelClick}

            onBreadcrumbClick={this.handleChannelBreadcrumbClick}
            onItemClick={this.handleChannelClick}
            onEditClick={this.handleChannelEditClick}
            onRemoveClick={this.handleRemoveChannelClick}

            addNewLabel={'Add new Channel'}
            addExistingLabel={'Add existing Channel'}
            showExisting
            showCreate
            onCreateClick={this.handleOpenCreate}

            showSearch
            searchList={this.state.searchChannelList}
            searchInputValue={this.state.searchInputValueChannel}
            searchInputPlaceholder={'Add Channel'}
            searchListHeader={'Select Channel'}
            onSearchChange={this.handleChannelAddInputChange}
            onSearchClear={this.handleChannelAddClear}
            onAddClick={this.handleChannelAddItems}

            showFilter
            filterValue={this.state.filterValueUser}
            filterPlaceholder="Filter"
            onFilterChange={this.handleChannelFilterChange}
            onFilterClear={this.handleChannelFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 330, top: 17 }}

            noResultsPlaceholder={'No Channels in Tab'}
          />

          <AdminManageList
            list={this.state.groupList.filter(obj => !obj.deleted)}
            headerTitle={'Groups'}
            width={300}
            height={600}
            placeholder={'Select Group'}
            itemSelected={itemSelectedGroup}
            showEdit
            onGetList={() => {}}
            onGetSearchList={() => {}}
            showUnlink
            onUnlinkClick={this.handleUnlinkGroupClick}

            onBreadcrumbClick={this.handleUserBreadcrumbClick}
            onItemClick={this.handleGroupClick}
            onEditClick={this.handleGroupEditClick}

            addNewLabel={'Add new Group'}
            addExistingLabel={'Add existing Group'}
            showExisting
            showCreate
            onCreateClick={this.handleOpenCreate}

            showSearch
            searchList={this.state.searchGroupList}
            searchInputValue={this.state.searchInputValueGroup}
            searchInputPlaceholder={'Add Group'}
            searchListHeader={'Select Group'}
            onSearchChange={this.handleGroupAddInputChange}
            onSearchClear={this.handleGroupAddClear}
            onAddClick={this.handleGroupAddItems}

            showFilter
            filterValue={this.state.filterValueGroup}
            filterPlaceholder="Filter"
            onFilterChange={this.handleGroupFilterChange}
            onFilterClear={this.handleGroupFilterClear}

            onScroll={this.handleListScroll}
            style={{ position: 'absolute', left: 630, top: 17 }}

            noResultsPlaceholder={'No Groups in Channel'}
            //noResultsInSearchPlaceholder={'No Users in Configuration Bundle'}
          />

          <AdminManageList
            list={this.state.userList.map(element => ({ note: element.email, ...element }))}
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
            hidePlaceholderArrow

            addNewLabel={'Add new Users'}
            addExistingLabel={'Add existing Users'}
            showExisting
            showCreate
            onCreateClick={this.handleOpenCreate}

            showSearch
            searchList={this.state.searchList.map(element => ({ note: element.email, ...element }))}
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
            style={{ position: 'absolute', left: 930, top: 17 }}

            noResultsPlaceholder={'No Users in Group'}
            //noResultsInSearchPlaceholder={'No Users in Configuration Bundle'}
          />

          {/* Modals */}
          <AdminTabModal
            isVisible={this.state.isTabModalVisible}
            onChange={this.handleTabChange}
            onClose={this.toggleTabModal}
            onThumbnailClick={this.handleThumbnailClick}
            showDelete
            onDelete={()=> (console.log('deleting'))}

            {...this.state.tabDetails}
          />

        </ComponentItem>
      </section>
    );
  }
}
