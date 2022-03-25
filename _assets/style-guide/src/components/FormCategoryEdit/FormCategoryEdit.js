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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import List from 'components/List/List';
import SelectSearch from 'components/SelectSearch/SelectSearch';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

import PermissionItem from './PermissionItem';

/**
 * Provides all editable settings related to a Form Category
 */
export default class FormCategoryEdit extends PureComponent {
  static propTypes = {
    /** Category ID */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** Category name */
    name: PropTypes.string,

    /** Category description */
    description: PropTypes.string,

    /** Category thumbnail */
    thumbnail: PropTypes.string,

    /** Groups and Users who can create Forms in this Category */
    permissions: PropTypes.array,

    /** Default permissions applied to new Forms in this Category */
    formPermissions: PropTypes.array,

    /** Value of search input */
    searchValue: PropTypes.string,

    /** Groups & Users to display in Search list */
    searchList: PropTypes.array,

    /** Set `isLoading` on Category permissions SelectSearch */
    permissionsSearchIsLoading: PropTypes.bool,

    /** Set `isLoading` on Form permissions SelectSearch */
    formPermissionsSearchIsLoading: PropTypes.bool,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Handle name input change */
    onNameChange: PropTypes.func.isRequired,

    /** Handle description input change */
    onDescriptionChange: PropTypes.func.isRequired,

    /** Handle set permission (group/user) delete click */
    onPermissionDeleteClick: PropTypes.func.isRequired,

    /** Handle set permission (group/user) change event */
    onPermissionChange: PropTypes.func.isRequired,

    /** Handle search input change, set as `searchValue` */
    onSearchInputChange: PropTypes.func.isRequired,

    /** Handle Search list change event, returns `selectedItems` and `id` */
    onSearchListChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    permissions: [],
    formPermissions: [],
    searchList: [],
    searchValue: ''
  };

  static defaultProps = {
    name: '',
    description: '',
    thumbnail: '',
    strings: {
      name: 'Name',
      description: 'Description',
      categoryPermissions: 'Category Permissions',
      categoryPermissionsDescription: 'Groups and users who can create Forms in this Category.',
      defaultFormPermissions: 'Default Form Permissions',
      defaultFormPermissionsDescription: 'Forms created in this Category will be created with these permissions.',
      group: 'Group',
      formPermissions: 'Form Permissions',
      dataPermissions: 'Data Permissions',
      noGroupsSelected: 'No Groups selected',
      addGroupsOrPeople: 'Add Groups or People'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      selectOpen: false
    };
    autobind(this);
  }

  handleItemClick(event) {
    event.preventDefault();
  }

  handleSelectOpen() {
    // add small delay in case clicking from one select to another
    setTimeout(() => {
      this.setState({
        selectOpen: true
      });
    }, 5);
  }

  handleSelectClose() {
    this.setState({
      selectOpen: false
    });
  }

  render() {
    const {
      id,
      name,
      description,
      permissions,
      formPermissions,
      searchList,
      searchValue,
      permissionsSearchIsLoading,
      formPermissionsSearchIsLoading,
      onPermissionDeleteClick,
      onPermissionChange,
      onSearchInputChange,
      onSearchListChange,
      strings
    } = this.props;
    const { selectOpen } = this.state;
    const styles = require('./FormCategoryEdit.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FormCategoryEdit: true
    }, this.props.className);

    // Search lists
    const listHeight = 186;
    const width = 320;

    return (
      <div className={classes} style={this.props.style}>
        <section data-id="category-name">
          <Text
            id={`edit-cat-name-${id}`}
            label={strings.name}
            value={name}
            onChange={this.props.onNameChange}
          />
          <Textarea
            id={`edit-cat-description-${id}`}
            label={strings.description}
            value={description}
            onChange={this.props.onDescriptionChange}
          />
        </section>
        <section data-id="category-permissions">
          <h3>{strings.categoryPermissions}</h3>
          <p>{strings.categoryPermissionsDescription}</p>
          <SelectSearch
            id={`edit-category-permissions-${id}`}
            items={searchList}
            inputValue={searchValue}
            selectedItems={permissions}
            isLoading={permissionsSearchIsLoading}
            listHeight={listHeight}
            width={width}
            placeholder={strings.addGroupsOrPeople}
            zIndex={3}
            //noResultsInSearchPlaceholder={strings.noGroupsSelected}
            onChange={onSearchListChange}
            onInputChange={onSearchInputChange}
            //onScroll={this.handleGroupSearchScroll}
          />
          <List
            list={permissions}
            icon="users"
            thumbSize="small"
            showThumb
            itemComponent={PermissionItem}
            itemProps={{
              permissionType: 'category',
              onDeleteClick: onPermissionDeleteClick
            }}
            emptyHeading="Set Me"
            emptyMessage="Set Me"
            onItemClick={this.handleItemClick}
            className={styles.permissionsList}
          />
        </section>
        <section data-id="form-permissions">
          <h3>{strings.defaultFormPermissions}</h3>
          <p>{strings.defaultFormPermissionsDescription}</p>
          <SelectSearch
            id={`edit-form-permissions-${id}`}
            items={searchList}
            inputValue={searchValue}
            selectedItems={formPermissions}
            isLoading={formPermissionsSearchIsLoading}
            listHeight={listHeight}
            width={width}
            placeholder={strings.addGroupsOrPeople}
            //noResultsInSearchPlaceholder={strings.noGroupsSelected}
            onChange={onSearchListChange}
            onInputChange={onSearchInputChange}
            //onScroll={this.handleGroupSearchScroll}
          />
          {formPermissions.length > 0 && <header className={styles.formPermissionsHeader}>
            <span>{strings.group}</span>
            <span>{strings.formPermissions}</span>
            <span>{strings.dataPermissions}</span>
            <span>&nbsp;</span>
          </header>}
          <List
            list={formPermissions}
            icon="group"
            thumbSize="small"
            showThumb
            itemComponent={PermissionItem}
            itemProps={{
              permissionType: 'form',
              showPermissions: true,
              onSelectOpen: this.handleSelectOpen,
              onSelectClose: this.handleSelectClose,
              onPermissionChange: onPermissionChange,
              onDeleteClick: onPermissionDeleteClick
            }}
            emptyHeading="Set Me"
            emptyMessage="Set Me"
            onItemClick={this.handleItemClick}
            className={styles.permissionsList}
            style={{ overflow: selectOpen ? 'visible' : null }}
          />
        </section>
      </div>
    );
  }
}
