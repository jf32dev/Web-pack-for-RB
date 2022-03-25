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

import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminPanels from 'components/Admin/AdminPanels/AdminPanels';
import AdminWebsiteModal from 'components/Admin/AdminManageList/Modals/AdminWebsiteModal';
import AdminVisualiseRelationships from 'components/Admin/AdminVisualiseRelationships/AdminVisualiseRelationships';
import Dialog from 'components/Dialog/Dialog';
import ImagePickerModal from 'components/ImagePickerModal/ImagePickerModal';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadWebsites,
  loadGroupsByWebsite,
  loadGroupsByWebsiteGraph,
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
  confirmDeleteWebsiteMessage: { id: 'confirm-delete-website-message', defaultMessage: 'Are you sure you want to delete this Website?' },
  confirmDeleteGroupMessage: { id: 'confirm-delete-group-message', defaultMessage: 'Are you sure you want to delete this Group?' },
  confirmRemoveGroupHeader: { id: 'confirm-remove-group-header', defaultMessage: 'Are you sure you want to remove this Group?' },

  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully' },
  successfullyDeleted: { id: 'successfully-deleted', defaultMessage: 'Successfully deleted' },

  addExistingGroups: { id: 'add-existing-groups', defaultMessage: 'Add existing groups' },
  websites: { id: 'websites', defaultMessage: 'Websites' },
  tabs: { id: 'tabs', defaultMessage: '{tabs}' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  selectWebsite: { id: 'select-website', defaultMessage: 'Select Website' },
  selectGroup: { id: 'select-group', defaultMessage: 'Select group' },
  addGroup: { id: 'add-group', defaultMessage: 'Add group' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  noWebsitesFound: { id: 'no-websites-found', defaultMessage: 'No Websites found' },
  noGroupsFound: { id: 'no-groups-found', defaultMessage: 'No groups found' },

  active: { id: 'active', defaultMessage: 'Active' },
  inactive: { id: 'inactive', defaultMessage: 'Inactive' },
  pleaseProvideValidUrl: { id: 'please-provide-valid-url', defaultMessage: 'Please provide valid URL' },
});

function mapStateToProps(state) {
  const { entities } = state;
  const { structure } = state.admin;

  const websites = structure.websites.map(id => {
    const entity = entities.websites[id];
    entity.showUrl = true;
    entity.type = 'webItemLegacy';
    return entity;
  });
  const websiteSelected = websites.find(obj => !obj.deleted && obj.id === structure.websiteSelected.id) || {};
  const groupSelected = structure.groupsByWebsiteSelected.deleted ? {} : structure.groupsByWebsiteSelected;
  const groupsByWebsite = structure.groupsByWebsite[websiteSelected.id];
  const groupsSearchByWebsite = structure.groupsSearchByWebsite[websiteSelected.id];

  let groups = [];
  if (websiteSelected.id && groupsByWebsite && groupsByWebsite.groupIds) {
    groups = groupsByWebsite.groupIds.map(id => entities.groups[id]);

    if (groups.length) groups = groups.filter(obj => !obj.deleted);
  }

  let groupSearchList = [];
  if (websiteSelected.id && groupsSearchByWebsite && groupsSearchByWebsite.groupIds) {
    groupSearchList = groupsSearchByWebsite.groupIds.map(id => entities.groups[id]);
  }

  return {
    websites: websites.filter(obj => !obj.deleted),
    websiteSelected: websiteSelected,
    websitesLoading: structure.websitesLoading,
    websitesComplete: structure.websitesComplete,
    websitesError: structure.websitesError,
    websiteFilter: structure.websiteFilter,

    groups: groups,
    groupSelected: groupSelected,
    groupsLoading: structure.groupsByWebsiteLoading,
    groupsComplete: structure.groupsByWebsiteComplete,
    groupsError: structure.groupsByWebsiteError,
    groupFilter: structure.groupsByWebsiteFilter,

    groupsSearchKeyword: structure.groupsByWebsiteSearchKeyword,
    groupSearchList: groupSearchList,
    groupSearchLoading: structure.groupsSearchByWebsiteLoading,
    groupSearchComplete: structure.groupsSearchByWebsiteComplete,

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
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
    deleteEntity,

    loadWebsites,
    loadGroupsByWebsite,
    loadGroupsByWebsiteGraph,
    deleteItem,
    saveDetail,
    setData,
    setRelationship,
  })
)
export default class AdminWebsitesView extends Component {
  static propTypes = {
    websites: PropTypes.array.isRequired,
    websitesLoading: PropTypes.bool,
    websitesComplete: PropTypes.bool,
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
      websiteImagePickerModalVisible: false,
      isWebsiteModalVisible: false,
      websiteDetails: {},

      isGroupModalVisible: false,
      groupDetails: {},

      // Panels
      isGraphEnabled: false,
      graphId: 0,
      confirmWesbiteDelete: false,
      confirmRemoveGroup: false,
    };
    autobind(this);
    this.handleLoadWebsites = debounce(this.handleLoadWebsites.bind(this), 500);
    this.handleLoadGroups = debounce(this.handleLoadGroups.bind(this), 500);
    this.listWrapper = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      groupsError,
      groupsLoading,
      websitesError,
      websiteSelected,
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

    const prevWebsitesError = websitesError ? websitesError.message : '';
    if (nextProps.websitesError && nextProps.websitesError.message && (nextProps.websitesError.message !== prevWebsitesError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.websitesError.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Load Groups if Website selected is changed
    if (!groupsLoading && websiteSelected && websiteSelected.id && nextProps.websiteSelected && nextProps.websiteSelected.id && nextProps.websiteSelected.id !== websiteSelected.id) {
      this.props.setData({
        groupSelected: {},
        groupsComplete: false
      });

      this.props.loadGroupsByWebsite(0, nextProps.websiteSelected.id, '');
    }

    // Close modal after save
    if ((!saved && nextProps.saved || !deleted && nextProps.deleted)) {
      if (this.state.isWebsiteModalVisible) this.handleToggleWebsiteModal();
      if (this.state.isGroupModalVisible) this.handleToggleGroupModal();

      // Group Settings quick changes modal
      if (this.props.isGroupQuickLoading || this.props.toggleGroupInfo) {
        this.props.setData({
          toggleGroupInfo: false,
          isGroupQuickLoading: false
        });
      }

      if (!this.props.saved && nextProps.saved) {
        this.props.createPrompt({
          id: uniqueId('saved-'),
          type: 'success',
          message: strings.savedSuccessfully,
          dismissible: true,
          autoDismiss: 5
        });
      } else if (!this.props.deleted && nextProps.deleted) {
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
      graphId,
      isGraphEnabled
    } = this.state;

    // Fetch graph data
    if (!isGraphEnabled && nextState.isGraphEnabled || (isGraphEnabled && graphId !== nextState.graphId)) {
      const id = nextState.graphId || graphId;
      this.props.loadGroupsByWebsiteGraph(id);
    }
  }

  // Tabs function
  handleLoadWebsites(offset, keyword) {
    this.props.loadWebsites(offset, keyword);
  }

  handleGetWebsitesList(offset) {
    const { websitesLoading } = this.props;
    if (!websitesLoading) {
      this.props.loadWebsites(offset, this.props.websiteFilter);
    }
  }

  handleWebsiteFilterChange(event) {
    this.props.setData({ websiteFilter: event.currentTarget.value });
    this.handleLoadWebsites(0, event.currentTarget.value);
  }

  handleWebsiteFilterClear() {
    if (this.props.websiteFilter) {
      this.handleLoadWebsites(0, '');
    }
  }

  handleWebsiteClick(event, context) {
    this.props.setData({
      websiteSelected: {
        id: context.id,
        name: context.name,
        position: context.position
      },
    });

    this.setState({
      isGraphEnabled: false,
    });
  }

  // Group functions
  handleLoadGroups(offset, keyword, filterType) {
    const { websiteSelected, groupsLoading } = this.props;
    if (websiteSelected.id && !groupsLoading) {
      this.props.loadGroupsByWebsite(offset, websiteSelected.id, keyword, filterType);
    }
  }

  handleGetGroupList(offset) {
    const { groupsError, groupsLoading, websiteSelected } = this.props;

    if (websiteSelected.id && !groupsLoading && !(groupsError && groupsError.message)) {
      this.props.loadGroupsByWebsite(offset, websiteSelected.id, '', this.props.groupFilter);
    }
  }

  handleGetGroupSearchList(offset) {
    const {
      groupSearchLoading,
      groupsError,
      websiteSelected,
    } = this.props;

    if (websiteSelected.id && !groupSearchLoading && !(groupsError && groupsError.message)) {
      this.props.loadGroupsByWebsite(offset, websiteSelected.id, this.props.groupsSearchKeyword, 1); // unlinked
    }
  }

  handleGroupClick(event, context) {
    // Check if we are not clicking on the options
    const dropdown = event.target;
    if (!dropdown.classList.contains('infoDropMenu')) {
      this.props.setData({
        groupsByWebsiteSelected: {
          id: context.id,
          name: context.name,
          position: context.position,
          type: 'group'
        }
      });

      this.setState({
        graphId: context.id,
      });
    }
  }

  handleGroupFilterChange(event) {
    this.props.setData({ groupsByWebsiteFilter: event.currentTarget.value });
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
      link: [this.props.websiteSelected.id],
      group: [-this.state.groupDetails.id],
    }, 'groupByWebsiteList', 'remove');

    this.setState({
      confirmRemoveGroup: !this.state.confirmRemoveGroup
    });
  }

  // Group Search list
  handleGroupSearchInputChange(event) {
    this.props.setData({ groupsByWebsiteSearchKeyword: event.currentTarget.value });
    this.handleLoadGroups(0, event.currentTarget.value, 1); // unlinked
  }

  handleGroupSearchClear() {
    this.props.setData({ groupsByWebsiteSearchKeyword: '' });
    this.handleLoadGroups(0, '', 1); // unlinked
  }

  handleGroupAddSearchItems(event, items) {
    const list = items.list || items;
    this.props.setRelationship({
      link: [this.props.websiteSelected.id],
      group: list.map(obj => obj.id),
    }, 'groupByWebsiteList', 'add');
  }

  ////////////////////////
  // MODALS
  ////////////////////////

  // Website modal
  /* Website section */
  handleWebsiteChange(data) {
    const key = data.key;
    const value = data.value;

    const tmpWebsiteDetails = Object.assign({}, this.state.websiteDetails);
    tmpWebsiteDetails[key] = value;

    this.setState({
      websiteDetails: tmpWebsiteDetails,
    });
  }

  handleWebsiteSave(e, context) {
    const data = {
      colour: context.colour,
      url: context.url,
      name: context.name,
      thumbnail: context.thumbnail,
      thumbnailDownloadUrl: context.thumbnailDownloadUrl,
      type: 'web'
    };
    if (context.id) data.id = context.id;

    this.props.saveDetail(data, 'tab');
  }

  handleWebsiteDelete() {
    if (this.state.websiteDetails.id) {
      this.props.deleteItem(this.state.websiteDetails.id, 'tab');
      this.props.deleteEntity('websites', this.state.websiteDetails.id);
    }
    this.handleToggleConfirmWesiteDelete();
  }

  handleToggleConfirmWesiteDelete() {
    this.setState({
      confirmWesbiteDelete: !this.state.confirmWesbiteDelete
    });
  }

  handleToggleWebsiteModal(event, context) {
    let details = {};
    if (context && context.props && context.props.id) {
      details = context.props;
    }

    this.setState({
      isWebsiteModalVisible: !this.state.isWebsiteModalVisible,
      websiteDetails: details,
    });
  }

  handleWebsiteThumbnailClick() {
    const websiteDetails = Object.assign({}, this.state.websiteDetails);

    if (websiteDetails.thumbnail) {
      // Clear thumbnail if one is already set
      websiteDetails.thumbnail = '';
      websiteDetails.thumbnailDownloadUrl = '';

      this.setState({
        websiteDetails: websiteDetails
      });
      // just open Featured image picker to select image
    } else {
      this.setState({
        websiteImagePickerModalVisible: true,
        isWebsiteModalVisible: false,
      });
    }
  }

  /**
   * Cover Art
   */
  handleWebsiteImagePickerCancel() {
    this.setState({
      websiteImagePickerModalVisible: false,
      isWebsiteModalVisible: true
    });
  }

  handleWebsiteImagePickerSave(event, images) {
    if (images && images[0]) {
      let item = {};
      if (this.state.websiteDetails && this.state.websiteDetails.id) {
        item = {
          ...this.state.websiteDetails,
          thumbnail: images[0].url,
          thumbnailDownloadUrl: images[0].download_location
        };
      } else {
        item = {
          ...this.state.websiteDetails,
          authString: this.context.settings.authString,
          type: 'web',
          thumbnail: images[0].url,
          thumbnailDownloadUrl: images[0].download_location
        };
      }

      // Cover Art
      this.setState({
        websiteDetails: item,
        websiteImagePickerModalVisible: false,
        isWebsiteModalVisible: true,
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

  handleLaunchLink() {
    const newWindow = window.open(this.state.websiteDetails.url);
    if (newWindow && newWindow.opener) newWindow.opener = null;
  }

  renderList() {
    const {
      websites,
      websitesLoading,
      websitesComplete,
      websiteSelected,

      groups,
      groupsLoading,
      groupsComplete,
      groupSelected,
      groupFilter,

      groupsSearchKeyword,
      groupSearchList,
      groupSearchLoading,
      groupSearchComplete,

      className,
      style,
    } = this.props;
    const styles = require('./AdminWebsites.less');
    const { formatMessage } = this.context.intl;
    const { authString, naming, userCapabilities } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const columnWidth = 300;

    // Set Permissions
    let canCreateWebsite = false;
    let canDelete = false;
    if ((userCapabilities.isAdmin && !userCapabilities.isGroupAdmin) ||
      (userCapabilities.isGroupAdminAdvanced)) {
      canCreateWebsite = true;
      if (userCapabilities.isAdmin) canDelete = true;
    }

    const listLeftPosition = 0;

    return (
      <div
        ref={(node) => { this.listWrapper = node; }}
        className={className}
        style={style}
      >
        <AdminManageList
          authString={authString}
          list={websites}
          headerTitle={strings.websites}
          width={columnWidth}
          placeholder={strings.selectWebsite}
          itemSelected={websiteSelected}

          showEdit
          onEditClick={this.handleToggleWebsiteModal}

          onItemClick={this.handleWebsiteClick}

          isLoaded={websites.length > 1}
          isLoading={websitesLoading}
          isLoadingMore={websitesLoading && websites.length > 1 && !websitesComplete}
          isComplete={websitesComplete}
          onGetList={this.handleGetWebsitesList}

          showCreate={canCreateWebsite}
          onCreateClick={this.handleToggleWebsiteModal}

          showFilter
          filterValue={this.props.websiteFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleWebsiteFilterChange}
          onFilterClear={this.handleWebsiteFilterClear}

          style={{ position: 'absolute', left: listLeftPosition, top: 0 }}
          className={styles.CustomTab}

          noResultsPlaceholder={strings.noWebsitesFound}
        />

        <AdminManageList
          authString={authString}
          list={groups}
          headerTitle={strings.groups}
          width={columnWidth}
          placeholder={strings.selectGroup}
          itemSelected={groupSelected}
          initialState={!(websiteSelected && websiteSelected.id)}
          showGraph
          onGraphClick={this.handleOpenGraph}

          onItemClick={this.handleGroupClick}

          isLoaded={groups.length > 1}
          isLoading={groupsLoading}
          isLoadingMore={groupsLoading && groups.length > 1 && !groupsComplete}
          isComplete={groupsComplete}
          onGetList={this.handleGetGroupList}

          showFilter
          filterValue={groupFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleGroupFilterChange}
          onFilterClear={this.handleGroupFilterClear}

          showUnlink
          onUnlinkClick={this.handleToggleConfirmRemoveGroup}

          hidePlaceholderArrow
          addExistingLabel={strings.addExistingGroups}
          showExisting

          showSearch
          searchList={groupSearchList}
          searchInputValue={groupsSearchKeyword}
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
          saved={this.props.saved}
          saving={this.props.saving}
          addTotalItemType="group"

          style={{ position: 'absolute', left: (300 + listLeftPosition), top: 0 }}
          noResultsPlaceholder={strings.noGroupsFound}
        />

        {/* Modals */}
        {this.state.isWebsiteModalVisible && <AdminWebsiteModal
          isVisible
          loading={this.props.saving || this.props.deleting}
          showDelete={canDelete && !!this.state.websiteDetails.id && !this.state.websiteDetails.childCount}
          onDelete={this.handleToggleConfirmWesiteDelete}
          onChange={this.handleWebsiteChange}
          onClose={this.handleToggleWebsiteModal}
          onSave={this.handleWebsiteSave}
          onThumbnailClick={this.handleWebsiteThumbnailClick}
          onLaunchLinkClick={this.handleLaunchLink}
          {...this.state.websiteDetails}
        />}

        {/* Image Pickers */}
        {/* Tab Image Picker Modal */}
        {this.state.websiteImagePickerModalVisible && <ImagePickerModal
          isVisible
          category="cover_art"
          onClose={this.handleWebsiteImagePickerCancel}
          onSave={this.handleWebsiteImagePickerSave}
        />}
        {/* Confirm Dialog */}
        {this.state.confirmWesbiteDelete && <Dialog
          title={strings.confirmDelete}
          message={strings.confirmDeleteWebsiteMessage}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleToggleConfirmWesiteDelete}
          onConfirm={this.handleWebsiteDelete}
        />}
        {this.state.confirmRemoveGroup && <Dialog
          title={strings.confirmRemoveGroupHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.remove}
          onCancel={this.handleToggleConfirmRemoveGroup}
          onConfirm={this.handleRemoveGroupClick}
        >
          <FormattedMessage
            id="confirm-remove-website-group-message"
            defaultMessage={'This action only removes "{name}" from the "{websiteName}" Website. "{name}" will still be available in other Websites it is a member of.'}
            values={{ name: this.state.groupDetails.name, websiteName: this.props.websiteSelected.name, ...naming }}
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
