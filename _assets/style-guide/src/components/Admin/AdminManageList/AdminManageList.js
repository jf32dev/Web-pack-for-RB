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
 * @copyright 2010-2016 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

// Common list
//import List from 'components/List/List';
import TriggerList from 'components/TriggerList/TriggerList';

// Admin List
import CustomFilter from './CustomFilter';
import AdminGroupAdd from 'components/Admin/AdminGroupAdd/AdminGroupAdd';
import ListHeader from './ListHeader';
import ListBreadcrumb from './ListBreadcrumb';
import Text from 'components/Text/Text';

const messages = defineMessages({
  addNChannels: { id: 'add-n-channels', defaultMessage: 'Add {n} {channels}' },
  addNGroups: { id: 'add-n-groups', defaultMessage: 'Add {n} Groups' },
  addNUsers: { id: 'add-n-users', defaultMessage: 'Add {n} Users' },
});

/**
 * Manage lists
 * TODO: use Modal component
 */
export default class AdminManageList extends Component {
  static propTypes = {
    /** items must have a <code>type</code> */
    list: PropTypes.array,
    searchList: PropTypes.array,

    /** Placeholder to be placed on Search list header */
    searchListHeader: PropTypes.string,

    /** Displays title in header */
    headerTitle: PropTypes.string,
    authString: PropTypes.string,

    /** Explicitly set a numeric width */
    width: PropTypes.number,

    /** Explicitly set a numeric height */
    height: PropTypes.number,

    /** Placeholder to be placed on breadcrumb */
    placeholder: PropTypes.string,
    noResultsPlaceholder: PropTypes.string,
    hidePlaceholderArrow: PropTypes.bool,
    hidePlaceholder: PropTypes.bool,

    /** Item selected object <code>id, name...</code> */
    itemSelected: PropTypes.object,

    /** Handle click event on list item */
    onItemClick: PropTypes.func.isRequired,

    /** Value set in input filter **/
    filterValue: PropTypes.string,
    /** used when showFilterlist list is enabled */
    filterValueType: PropTypes.string,
    filterPlaceholder: PropTypes.string,

    /** Header submenu */
    addNewLabel: PropTypes.string,
    addExistingLabel: PropTypes.string,

    /** When a filter option must be selected before do a search
     *   A dropdown list would be displayed before do the search
     */
    showFilterlist: PropTypes.bool,
    filterList: PropTypes.array,

    /** Show only the header - Used when no parent has been selected **/
    initialState: PropTypes.bool,

    showCreate: PropTypes.bool,
    showEdit: PropTypes.bool,
    showFilter: PropTypes.bool,
    showGraph: PropTypes.bool,
    showUnlink: PropTypes.bool,

    /** Shows a search input to add more items **/
    showSearch: PropTypes.bool,

    /** Value set in Search more items input **/
    searchInputValue: PropTypes.string,
    /** Placeholder set in Search more items input <code>Ex: Add Channel</code> **/
    searchInputPlaceholder: PropTypes.string,

    /** Shows a Set Permission modal for Group admin after onAddClick is pressed **/
    showSetPermissions: PropTypes.bool,

    // Listing options
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    isComplete: PropTypes.bool,
    onGetList: PropTypes.func.isRequired,

    // Search Listing options
    isSearchLoaded: PropTypes.bool,
    isSearchLoading: PropTypes.bool,
    isSearchLoadingMore: PropTypes.bool,
    isSearchComplete: PropTypes.bool,
    onGetSearchList: function(props) {
      if (props.showSearch && typeof props.onGetSearchList !== 'function') {
        return new Error('onGetSearchList is required when showSearch is provided.');
      }
      return null;
    },

    onBreadcrumbClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onGraphClick: PropTypes.func,

    /** Handler when a click is done on unlink/ remove relationship **/
    onUnlinkClick: PropTypes.func,
    onBulkUploadClick: PropTypes.func,
    onUserDefaultsClick: PropTypes.func,

    onCreateClick: function(props) {
      if (props.showCreate && typeof props.onCreateClick !== 'function') {
        return new Error('onCreateClick is required when showCreate is provided.');
      }
      return null;
    },

    /** Handle event `add` when a searched item is clicked */
    onAddClick: function(props) {
      if (props.showSearch && typeof props.onAddClick !== 'function') {
        return new Error('onAddClick is required when showSearch is provided.');
      }
      return null;
    },
    onFilterChange: function(props) {
      if (props.showFilter && typeof props.onFilterChange !== 'function') {
        return new Error('onFilterChange is required when showFilter is provided.');
      }
      return null;
    },
    onFilterClear: function(props) {
      if (props.showFilter && typeof props.onFilterClear !== 'function') {
        return new Error('onFilterClear is required when showFilter is provided.');
      }
      return null;
    },

    /** Handle `addInput` value */
    onSearchChange: function(props) {
      if (props.showSearch && typeof props.onSearchChange !== 'function') {
        return new Error('onSearchChange is required when showSearch is provided.');
      }
      return null;
    },
    onSearchClear: function(props) {
      if (props.showSearch && typeof props.onSearchClear !== 'function') {
        return new Error('onSearchClear is required when showSearch is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    width: 300,
    headerTitle: 'List',
    filterPlaceholder: 'Filter',
    searchListHeader: 'Select items',
    addNewLabel: 'Add new',
    addExistingLabel: 'Add existing',
    searchList: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      isFilterEnabled: false,
      showAddList: false,
      preSelectItems: [],
      toggleSetPermission: false
    };

    // refs
    this.listContainer = null;
    this.searchContainer = null;
    this.addInput = null;

    autobind(this);
  }

  UNSAFE_componentWillMount () {
    this.addWindowKeydownEvent();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      saved,
    } = this.props;

    // Close modal after save
    if (!saved && nextProps.saved && this.state.toggleSetPermission) {
      this.setState({
        toggleSetPermission: !this.state.toggleSetPermission,
        preSelectItems: [],
        showAddList: false
      });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Add window event listener
    if (((this.props.showSearch || !this.state.showAddList) && nextState.showAddList) ||
      !this.state.toggleSetPermission && nextState.toggleSetPermission) {
      setTimeout(() => {
        this.addWindowClickEvent();
      }, 300);
    } else if (((this.props.showSearch || this.state.showAddList) && !nextState.showAddList) ||
      this.state.toggleSetPermission && !nextState.toggleSetPermission) {
      this.removeWindowClickEvent();
    }

    if ((this.props.showSearch || !this.state.showAddList) && nextState.showAddList) {
      setTimeout(() => {
        if (this.addInput) this.addInput.focus();
      }, 300);
    }
  }

  componentWillUnmount() {
    this.removeWindowClickEvent();
    this.removeWindowKeydownEvent();
  }

  addWindowClickEvent() {
    window.addEventListener('click', this.handleWindowClick);
  }

  removeWindowClickEvent() {
    window.removeEventListener('click', this.handleWindowClick);
  }

  addWindowKeydownEvent() {
    window.addEventListener('keydown', this._handleKeyDown);
  }

  removeWindowKeydownEvent() {
    window.removeEventListener('keydown', this._handleKeyDown);
  }

  handleWindowClick(event) {
    // Check if we are not clicking on the list
    const list = this.searchContainer;
    const addInput = this.addInput ? this.addInput.text : null;
    const isList = list === event.target || list === event.target.offsetParent;
    const isInput = addInput === event.target || addInput === event.target.offsetParent;
    if (!isList && !isInput && (!event.target.type || (list && !list.contains(event.target)) && (!addInput.contains(event.target)))) {
      this.setState({ toggleSetPermission: false, showAddList: false, preSelectItems: [] });
      event.stopPropagation();
    }
  }

  handleGraphClick(e) {
    if (typeof this.props.onGraphClick === 'function') {
      this.props.onGraphClick(e, this.props);
    }
  }

  handleBreadcrumbClick(event, context) {
    this.listContainer.list.list.scrollTop = context.position || this.state.position;
  }

  handleFilter() {
    if (this.state.isFilterEnabled) {
      this.props.onFilterClear();
    }
    this.setState({ isFilterEnabled: !this.state.isFilterEnabled });
  }

  handleInputKeyUp(event) {
    // Trigger filter close on ESC
    if (event.keyCode === 27) {
      this.props.onFilterClear();
      this.handleFilter();
    }
  }

  // List Item Clicked
  handleItemClick(event, context) {
    if (typeof this.props.onItemClick === 'function') {
      // Scroll to item position
      const position = event.currentTarget.offsetTop - this.listContainer.list.list.offsetTop;
      const props = context.props || context;
      this.props.onItemClick(event, { ...props, position: position });
      this.setState({ position: position });
    }
  }

  /* Search List */
  handleListContainerClick(event) {
    const componentContainer = this.searchContainer;

    // Avoid to close list on click on any item but overlay
    if (componentContainer && componentContainer.contains(event.target) && componentContainer !== event.target) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  _handleKeyDown (event) {
    // Trigger close permisions on ESC only for group permission
    if (event.keyCode === 27 && this.state.toggleSetPermission) {
      this.handleToggleGroupPermission();
    } else if (event.keyCode === 27 && this.state.showAddList) {
      this.handleOverlayClick();
    }
  }

  handlePermissionOverlayClick(e) {
    e.preventDefault();
    e.stopPropagation();
    //this.setState({ showAddList: false, preSelectItems: [] });
  }

  handleOverlayClick() {
    this.setState({ showAddList: false, preSelectItems: [] });
  }

  handleShowAddList() {
    this.setState({ showAddList: true });
  }

  handleSearchClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleSearchClearClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSearchClear();
  }

  handleSearchInputKeyUp(event) {
    // Trigger filter close on ESC
    if (event.keyCode === 27) {
      this.props.onSearchClear();
      this.handleOverlayClick();
    } else if (!this.state.showAddList) {
      event.stopPropagation();
      this.handleShowAddList(event);
    }
  }

  handleSearchItemClick(event, context) {
    const selected = context.props.selected || context.props.isActive;
    const searchList = this.props.searchList;
    const item = searchList.find(obj => obj.id === context.props.id);

    if (selected) { // unSelect
      this.setState({ 'preSelectItems': [...this.state.preSelectItems.filter(obj => obj.id !== context.props.id)] });
    } else { // Select
      this.setState({ 'preSelectItems': [...this.state.preSelectItems, item] });
    }
  }

  handleAddClick(event) {
    if (this.props.showSetPermissions) {
      this.handleToggleGroupPermission();
    } else {
      this.handleSaveItem(event, this.state.preSelectItems);
    }
  }

  handleDblClick(event, context) {
    const searchList = this.props.searchList;
    const item = searchList.find(obj => obj.id === context.props.id);

    if (this.props.showSetPermissions) {
      this.setState({ 'preSelectItems': [item] }); // set only dblClick item
      this.handleToggleGroupPermission();
    } else if (!this.state.preSelectItems.find(obj => obj.id === item.id)) {
      this.handleSaveItem(event, [item]);
    }
  }

  handleToggleGroupPermission() {
    this.setState({
      toggleSetPermission: !this.state.toggleSetPermission,
      showAddList: !this.state.showAddList
    });
  }

  handlePermissionChange(event, context) {
    const group = [...this.state.preSelectItems];
    const item = group.find((obj) => obj.id === context.group.id);
    item.permissions = context.id || 1;
    this.setState({ preSelectItems: group });
  }

  handleSaveItem(event, list = this.state.preSelectItems) {
    if (typeof this.props.onAddClick === 'function') {
      this.props.onAddClick(event, list);
    }
    this.setState({ showAddList: false, 'preSelectItems': [] }); // reset selected items
  }

  // Filter list functions
  handleResetFilterList(event) {
    if (typeof this.props.onFilterClear === 'function') {
      this.props.onFilterClear(event);
    }
  }

  handleOnFilterChange(newFilter, filterType) {
    if (typeof this.props.onFilterChange === 'function') {
      this.props.onFilterChange(newFilter, filterType);
    }
  }

  render() {
    const {
      authString,
      className,
      filterPlaceholder,
      filterValue,
      headerTitle,
      itemSelected,
      list,
      searchList,
      placeholder,
      initialState,
      showExisting,
      showCreate,
      showEdit,
      showFilter,
      showGraph,
      showUnlink,
      showSearch,
      width,
      height,
      searchInputPlaceholder,
      searchInputValue,
      searchListHeader,
      onCreateClick,
      onEditClick,
      onUnlinkClick,
      style,
    } = this.props;
    const styles = require('./AdminManageList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ManageList: true,
    }, className);

    const listSearchClasses = cx({
      ListSearch: true,
    }, className);

    const searchListClass = cx({
      SearchList: showSearch,
      SearchListFullHeight: !showSearch,
    });

    // Translations
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { ...naming, n: this.state.preSelectItems.length });

    const searchListSelected = searchList.map(element => ({
      ...element,
      isActive: !!this.state.preSelectItems.find(obj => obj.id === element.id),
    }));

    const additionalProps = {
      authString: authString,
      thumbSize: 'small',
      showAdmin: true,
      showUnlink: showUnlink,
      showThumb: true,
      showFollow: false,
      onEditClick: onEditClick,
      onUnlinkClick: showUnlink && onUnlinkClick,
      noLink: true,
      className: styles.itemList,
    };
    if (showEdit) additionalProps.showEdit = showEdit;

    return (
      <aside
        className={classes}
        style={{
          width: width && !isNaN(width) ? width : null,
          height: height || null,
          ...style
        }}
      >
        <ListHeader
          name={headerTitle}
          addNewLabel={this.props.addNewLabel}
          addExistingLabel={this.props.addExistingLabel}
          showAdd={showCreate && !initialState}
          showExisting={showExisting && !initialState}
          showFilter={showFilter && !initialState}
          isFilterEnabled={this.state.isFilterEnabled}
          onAddClick={onCreateClick}
          onExistingClick={this.handleShowAddList}
          onFilterClick={this.handleFilter}
        />
        {!this.props.hidePlaceholder && !initialState && <ListBreadcrumb
          id={itemSelected && itemSelected.id}
          initialState={initialState}
          name={itemSelected && itemSelected.name}
          position={itemSelected && itemSelected.position}
          placeholder={placeholder}
          onClick={this.handleBreadcrumbClick}
          showGraph={showGraph}
          onGraphClick={this.handleGraphClick}
          hideArrow={this.props.hidePlaceholderArrow}
        />}

        {/* Filter */}
        <TransitionGroup component="span">
          {!this.props.showFilterlist && this.state.isFilterEnabled && <CSSTransition
            classNames={{
              appear: styles['slide-appear'],
              appearActive: styles['slide-appear-active'],
              enter: styles['slide-enter'],
              enterActive: styles['slide-enter-active'],
              exit: styles['slide-exit'],
              exitActive: styles['slide-exit-active']
            }}
            timeout={{
              enter: 160,
              exit: 150
            }}
            appear
          >
            <Text
              autoFocus
              placeholder={filterPlaceholder}
              value={filterValue}
              showClear={!!filterValue}
              onChange={this.props.onFilterChange}
              onClearClick={this.props.onFilterClear}
              onKeyUp={this.handleInputKeyUp}
              className={styles.filterInput}
            />
          </CSSTransition>}

          {this.props.showFilterlist && this.state.isFilterEnabled && <CSSTransition
            classNames={{
              appear: styles['slide-appear'],
              appearActive: styles['slide-appear-active'],
              enter: styles['slide-enter'],
              enterActive: styles['slide-enter-active'],
              exit: styles['slide-exit'],
              exitActive: styles['slide-exit-active']
            }}
            timeout={{
              enter: 160,
              exit: 150
            }}
            appear
          >
            <div className={styles.filterList}>
              <CustomFilter
                placeholder={filterPlaceholder}
                filterList={this.props.filterList}
                onFilterChange={this.handleOnFilterChange}
                onReset={this.handleResetFilterList}
                filterType={this.props.filterValueType}
                filterValue={filterValue}
                showEmptyList
              />
            </div>
          </CSSTransition>}
        </TransitionGroup>

        {!initialState && <TriggerList
          ref={(c) => { this.listContainer = c; }}
          list={list}
          isLoaded={this.props.isLoaded}
          isLoading={this.props.isLoading}
          isLoadingMore={this.props.isLoadingMore}
          isComplete={this.props.isComplete}
          onGetList={this.props.onGetList}
          listProps={{
            activeId: itemSelected.id,
            onItemClick: this.handleItemClick,
            className: styles.List,
            emptyHeading: this.props.noResultsPlaceholder,
            emptyMessage: '',
            icon: '',
            itemProps: additionalProps
          }}
        />}

        <TransitionGroup
          className={styles.overlayList}
          style={{ visibility: this.state.showAddList ? 'visible' : null }}
        >
          {this.state.showAddList && !this.state.toggleSetPermission && <CSSTransition
            classNames="Modal"
            timeout={250}
            appear
            onClick={this.handleOverlayClick}
          >
            <div className={searchListClass}>
              {/* Add existing items / search input */}
              {showSearch && this.state.showAddList && !this.state.toggleSetPermission && !initialState && <Text
                ref={(c) => { this.addInput = c; }}
                placeholder={searchInputPlaceholder}
                value={searchInputValue}
                icon="search"
                showClear={!!searchInputValue}
                onChange={this.props.onSearchChange}
                onClick={this.handleSearchClick}
                onFocus={this.handleSearchClick}
                onClearClick={this.handleSearchClearClick}
                onKeyUp={this.handleSearchInputKeyUp}
                className={styles.headerInput}
              />}

              <div ref={(c) => { this.searchContainer = c; }} className={styles.wrapper} onClick={this.handleListContainerClick}>
                <h3>{searchListHeader}
                  {this.state.preSelectItems.length > 0 &&
                  <span
                    className={styles.addLink}
                    onClick={this.handleAddClick}
                  >
                    {this.props.addTotalItemType === 'channel' && strings.addNChannels}
                    {this.props.addTotalItemType === 'group' && strings.addNGroups}
                    {this.props.addTotalItemType === 'user' && strings.addNUsers}
                  </span>}
                </h3>

                <TriggerList
                  ref={(c) => { this.listSeachContainer = c; }}
                  list={searchListSelected}
                  isLoaded={this.props.isSearchLoaded}
                  isLoading={this.props.isSearchLoading}
                  isLoadingMore={this.props.isSearchLoadingMore}
                  isComplete={this.props.isSearchComplete}
                  onGetList={this.props.onGetSearchList}
                  listProps={{
                    onItemClick: this.handleSearchItemClick,
                    className: listSearchClasses,
                    emptyHeading: this.props.noResultsInSearchPlaceholder,
                    emptyMessage: '',
                    icon: '',
                    itemProps: {
                      authString: authString,
                      thumbSize: 'small',
                      showAdmin: true,
                      showAdd: true,
                      showFollow: false,
                      showThumb: true,
                      noLink: true,
                      className: styles.itemList,
                      onDoubleClick: this.handleDblClick,
                      onAddClick: this.handleSearchItemClick,
                      onTickClick: this.handleSearchItemClick
                    }
                  }}
                />
              </div>
            </div>
          </CSSTransition>}
        </TransitionGroup>

        <TransitionGroup
          onClick={this.handlePermissionOverlayClick}
          className={styles.overlayList}
          style={{ visibility: this.state.toggleSetPermission ? 'visible' : null }}
        >
          {this.state.toggleSetPermission && <CSSTransition
            classNames="Modal"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={150}
            timeout={250}
            appear
          >
            <div className={styles.AddGroupList} style={{ width: this.props.width }}>
              <AdminGroupAdd
                className={styles.wrapper}
                list={this.state.preSelectItems}
                showAdd
                isLoading={this.props.saving}
                onAddClick={this.handleSaveItem}
                onChange={this.handlePermissionChange}
                onCancel={this.handleToggleGroupPermission}
              />
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </aside>
    );
  }
}
