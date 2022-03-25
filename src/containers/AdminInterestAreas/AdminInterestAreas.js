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
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import generateStrings from 'helpers/generateStrings';
import { defineMessages, FormattedMessage } from 'react-intl';

import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import AdminPanels from 'components/Admin/AdminPanels/AdminPanels';
import AdminVisualiseRelationships from 'components/Admin/AdminVisualiseRelationships/AdminVisualiseRelationships';
import Dialog from 'components/Dialog/Dialog';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  deleteItem,
  loadGroupsByWebsite,
  loadInterestAreas,
  loadInterestAreasGraph,
  loadInterestAreasGroups,
  removeInterestAreaLink,
  saveDetail,
  setData,
  setRelationship,
  setInterestAreaLink,
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

  groups: { id: 'groups', defaultMessage: 'Groups' },
  interestAreas: { id: 'interest-areas', defaultMessage: 'Interest Areas' },
  selectInterestArea: { id: 'select-interest-area', defaultMessage: 'Select Interest Area' },
  selectGroup: { id: 'select-group', defaultMessage: 'Select Group' },
  findInterestArea: { id: 'find-interest-areas', defaultMessage: 'Find Interest Areas' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  noInterestAreasFound: { id: 'no-interest-areas-found', defaultMessage: 'No Interest Areas found' },
  noGroupsFound: { id: 'no-groups-found', defaultMessage: 'No groups found' },

  active: { id: 'active', defaultMessage: 'Active' },
  inactive: { id: 'inactive', defaultMessage: 'Inactive' },
  pleaseProvideValidUrl: { id: 'please-provide-valid-url', defaultMessage: 'Please provide valid URL' },
});

function mapStateToProps(state) {
  const { entities } = state;
  const { structure } = state.admin;

  const groupsIA = structure.groupsIA.map(id => {
    const entity = entities.groups[id];
    entity.showUrl = true;
    return entity;
  });
  const groupsIASelected = groupsIA.find(obj => !obj.deleted && obj.id === structure.groupsIASelected.id) || {};
  const groupSelected = structure.interestAreasByGroupSelected.deleted ? {} : structure.interestAreasByGroupSelected;
  const interestAreasByGroup = structure.interestAreasByGroup[groupsIASelected.id];
  const interestAreasSearchByGroup = structure.interestAreasSearchByGroup[groupsIASelected.id];

  let groups = [];
  if (groupsIASelected.id && interestAreasByGroup && interestAreasByGroup.groupIds) {
    groups = interestAreasByGroup.groupIds.map(id => entities.groups[id]);

    if (groups.length) groups = groups.filter(obj => !obj.deleted);
  }

  let groupSearchList = [];
  if (groupsIASelected.id && interestAreasSearchByGroup && interestAreasSearchByGroup.groupIds) {
    groupSearchList = interestAreasSearchByGroup.groupIds.map(id => entities.groups[id]);
  }

  return {
    groupsIA: groupsIA.filter(obj => !obj.deleted),
    groupsIASelected: groupsIASelected,
    groupsIALoading: structure.groupsIALoading,
    groupsIAComplete: structure.groupsIAComplete,
    groupsIAError: structure.groupsIAError,
    groupsIAFilter: structure.groupsIAFilter,

    groups: groups,
    groupSelected: groupSelected,
    groupsLoading: structure.interestAreasByGroupLoading,
    groupsComplete: structure.interestAreasByGroupComplete,
    groupsError: structure.interestAreasByGroupError,
    groupFilter: structure.interestAreasByGroupFilter,

    groupsSearchKeyword: structure.interestAreasSearchByGroupKeyword,
    groupSearchList: groupSearchList,
    groupSearchLoading: structure.interestAreasSearchByGroupLoading,
    groupSearchComplete: structure.interestAreasSearchByGroupComplete,

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

    deleteItem,
    loadGroupsByWebsite,
    loadInterestAreas,
    loadInterestAreasGraph,
    loadInterestAreasGroups,
    removeInterestAreaLink,
    saveDetail,
    setData,
    setRelationship,
    setInterestAreaLink,
  })
)
export default class AdminInterestAreasView extends Component {
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
      groupDetails: {},

      // Panels
      isGraphEnabled: false,
      graphId: 0,
      confirmRemoveGroup: false,
    };
    autobind(this);
    this.handleLoadGroupsIA = debounce(this.handleLoadGroupsIA.bind(this), 500);
    this.handleLoadGroups = debounce(this.handleLoadGroups.bind(this), 500);
    this.listWrapper = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      groupsError,
      groupsLoading,
      groupsIAError,
      groupsIASelected,
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

    // Load Groups if Website selected is changed
    if (!groupsLoading && groupsIASelected && groupsIASelected.id && nextProps.groupsIASelected && nextProps.groupsIASelected.id && nextProps.groupsIASelected.id !== groupsIASelected.id) {
      this.props.setData({
        interestAreasByGroupSelected: {},
        interestAreasByGroupComplete: false
      });

      this.props.loadInterestAreas(0, nextProps.groupsIASelected.id, '');
    }

    // Close modal after save
    if ((!saved && nextProps.saved || !deleted && nextProps.deleted)) {
      // Group Settings quick changes modal
      if (this.props.isGroupQuickLoading || this.props.toggleGroupInfo) {
        this.props.setData({
          toggleGroupInfo: false,
          isGroupQuickLoading: false
        });
      }

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

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const {
      graphId,
      isGraphEnabled
    } = this.state;

    // Fetch graph data
    if (nextProps.groupsIASelected && nextProps.groupsIASelected.childCount > 0 &&
      (!isGraphEnabled && nextState.isGraphEnabled || (isGraphEnabled && graphId !== nextState.graphId))
    ) {
      const id = nextState.graphId || graphId;
      this.props.loadInterestAreasGraph(id);
    }
  }

  // Tabs function
  handleLoadGroupsIA(offset, keyword) {
    this.props.loadInterestAreasGroups(offset, keyword);
  }

  handleGetGroupIAList(offset) {
    const { websitesLoading } = this.props;
    if (!websitesLoading) {
      this.props.loadInterestAreasGroups(offset, this.props.groupsIAFilter);
    }
  }

  handleGroupIAFilterChange(event) {
    this.props.setData({ groupsIAFilter: event.currentTarget.value });
    this.handleLoadGroupsIA(0, event.currentTarget.value);
  }

  handleGroupIAFilterClear() {
    if (this.props.groupsIAFilter) {
      this.handleLoadGroupsIA(0, '');
    }
  }

  handleGroupIAClick(event, context) {
    this.props.setData({
      groupsIASelected: {
        id: context.id,
        name: context.name,
        position: context.position,
        childCount: context.childCount
      },
    });

    this.setState({
      graphId: context.id,
      isGraphEnabled: context.childCount ? this.state.isGraphEnabled : false
    });
  }

  // Group functions
  handleLoadGroups(offset, keyword, filterType) {
    const { groupsIASelected, interestAreasByGroupLoading } = this.props;
    if (groupsIASelected.id && !interestAreasByGroupLoading) {
      this.props.loadInterestAreas(offset, groupsIASelected.id, keyword, filterType);
    }
  }

  handleGetInterestAreaList(offset) {
    const { groupsError, interestAreasByGroupLoading, groupsIASelected } = this.props;

    if (groupsIASelected.id && !interestAreasByGroupLoading && !(groupsError && groupsError.message)) {
      this.props.loadInterestAreas(offset, groupsIASelected.id, '', this.props.groupsIAFilter);
    }
  }

  handleGetGroupSearchList(offset) {
    const {
      interestAreasSearchByGroupLoading,
      interestAreasByGroupError,
      groupsIASelected,
    } = this.props;

    if (groupsIASelected.id && !interestAreasSearchByGroupLoading && !(interestAreasByGroupError && interestAreasByGroupError.message)) {
      this.props.loadInterestAreas(offset, groupsIASelected.id, this.props.interestAreasSearchByGroupKeyword, 1); // unlinked
    }
  }

  handleInterestAreaClick(event, context) {
    // Check if we are not clicking on the options
    const dropdown = event.target;
    if (!dropdown.classList.contains('infoDropMenu')) {
      this.props.setData({
        interestAreasByGroupSelected: {
          id: context.id,
          name: context.name,
          position: context.position,
          type: context.type
        }
      });
    }
  }

  handleInterestAreaFilterChange(event) {
    this.props.setData({ interestAreasByGroupFilter: event.currentTarget.value });
    this.handleLoadGroups(0, event.currentTarget.value);
  }

  handleInterestAreaFilterClear() {
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
    this.props.removeInterestAreaLink(
      this.props.groupsIASelected.id,
      this.state.groupDetails.id
    );

    this.setState({
      confirmRemoveGroup: !this.state.confirmRemoveGroup
    });
  }

  // Group Search list
  handleGroupSearchInputChange(event) {
    this.props.setData({ interestAreasSearchByGroupKeyword: event.currentTarget.value });
    this.handleLoadGroups(0, event.currentTarget.value, 1); // unlinked
  }

  handleGroupSearchClear() {
    this.props.setData({ interestAreasSearchByGroupKeyword: '' });
    this.handleLoadGroups(0, '', 1); // unlinked
  }

  handleGroupAddSearchItems(event, items) {
    const list = items.list || items;
    this.props.setInterestAreaLink(
      this.props.groupsIASelected.id,
      list.map(obj => obj.id)
    );
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

  renderList() {
    const {
      groupsIA,
      groupsIALoading,
      groupsIAComplete,
      groupsIASelected,

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
    const styles = require('./AdminInterestAreas.less');
    const { formatMessage } = this.context.intl;
    const { authString, naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const columnWidth = 300;
    const listLeftPosition = 0;

    return (
      <div
        ref={(node) => { this.listWrapper = node; }}
        className={className}
        style={style}
      >
        <AdminManageList
          authString={authString}
          list={groupsIA}
          headerTitle={strings.groups}
          width={columnWidth}
          placeholder={strings.selectGroup}
          itemSelected={groupsIASelected}

          showGraph={groupsIASelected.childCount > 0}
          onGraphClick={this.handleOpenGraph}
          onItemClick={this.handleGroupIAClick}

          isLoaded={groupsIA.length > 1}
          isLoading={groupsIALoading}
          isLoadingMore={groupsIALoading && groupsIA.length > 1 && !groupsIAComplete}
          isComplete={groupsIAComplete}
          onGetList={this.handleGetGroupIAList}

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
          list={groups}
          headerTitle={strings.interestAreas}
          width={columnWidth}
          placeholder={strings.selectInterestArea}
          itemSelected={groupSelected}
          initialState={!(groupsIASelected && groupsIASelected.id)}
          //showGraph
          //onGraphClick={this.handleOpenGraph}

          onItemClick={this.handleInterestAreaClick}

          isLoaded={groups.length > 1}
          isLoading={groupsLoading}
          isLoadingMore={groupsLoading && groups.length > 1 && !groupsComplete}
          isComplete={groupsComplete}
          onGetList={this.handleGetInterestAreaList}

          hidePlaceholderArrow
          addExistingLabel={strings.addExistingGroups}
          showExisting

          showFilter
          filterValue={groupFilter}
          filterPlaceholder={strings.filter}
          onFilterChange={this.handleInterestAreaFilterChange}
          onFilterClear={this.handleInterestAreaFilterClear}

          showUnlink
          onUnlinkClick={this.handleToggleConfirmRemoveGroup}

          showSearch
          searchList={groupSearchList}
          searchInputValue={groupsSearchKeyword}
          searchInputPlaceholder={strings.findInterestArea}
          searchListHeader={strings.selectInterestArea}
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
          noResultsPlaceholder={strings.noInterestAreasFound}
        />

        {/* Modals */}
        {this.state.confirmRemoveGroup && <Dialog
          title={strings.confirmRemoveGroupHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.remove}
          onCancel={this.handleToggleConfirmRemoveGroup}
          onConfirm={this.handleRemoveGroupClick}
        >
          <FormattedMessage
            id="confirm-remove-interest-area-from-group-message"
            defaultMessage={'This action only removes "{name}" from the "{groupName}" Group. "{name}" will still be available in other Groups it is a member of.'}
            values={{ name: this.state.groupDetails.name, groupName: this.props.groupsIASelected.name, ...naming }}
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
