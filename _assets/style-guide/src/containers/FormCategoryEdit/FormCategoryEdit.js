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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import FormCategoryEdit from 'components/FormCategoryEdit/FormCategoryEdit';

const FormCategoryEditDocs = require('!!react-docgen-loader!components/FormCategoryEdit/FormCategoryEdit.js');

const category = require('../../static/category.json');
const groups = require('../../static/groups.json');
const users = require('../../static/users.json');

export default class FormCategoryEditView extends Component {
  constructor(props) {
    super(props);
    this.defaultList = [...groups, ...users];

    this.state = {
      ...category,
      searchList: this.defaultList,
      searchValue: ''
    };
    autobind(this);
  }

  searchList(list, keyword = '') {
    let newList = list;
    if (keyword) {
      newList = list.filter(i => i.name.indexOf(keyword) > -1);
    }
    return newList;
  }

  removeItem(index, arrayName) {
    this.setState((prevState) => ({
      [arrayName]: [...prevState[arrayName].slice(0,index), ...prevState[arrayName].slice(index+1)]
    }))
  }

  handleNameChange(event) {
    this.setState({
      name: event.currentTarget.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      name: event.currentTarget.value
    });
  }

  handlePermissionChange(event) {
    console.log(event);
  }

  handlePermissionDeleteClick(props) {
    const { id, type, permissionType } = props;
    const arrayName = permissionType === 'category' ? 'permissions' : 'formPermissions';
    const index = this.state[arrayName].findIndex(obj => obj.id === id && obj.type === type);
    this.removeItem(index, arrayName);
  }

  handleSearchListChange(selectedItems, id) {
    const newPermissions = [];
    this.defaultList.forEach(obj => {
      const match = selectedItems.findIndex(sobj => sobj.id === obj.id && sobj.type === obj.type) > -1;
      if (match) {
        newPermissions.push(obj);
      }
    });

    if (id.indexOf('form') > -1) {
      return this.setState({
        formPermissions: newPermissions
      });
    }

    return this.setState({
      permissions: newPermissions
    });
  }

  handleSearchInputChange(event) {
    const value = event.currentTarget.value;
    this.setState({
      searchList: this.searchList(this.defaultList, value),
      searchValue: value
    });
  }

  render() {
    return (
      <section id="FormCategoryEditView">
        <h1>FormCategoryEdit</h1>
        <Docs {...FormCategoryEditDocs} />

        <ComponentItem>
          <FormCategoryEdit
            {...this.state}
            onNameChange={this.handleNameChange}
            onDescriptionChange={this.handleDescriptionChange}
            onSearchInputChange={this.handleSearchInputChange}
            onSearchListChange={this.handleSearchListChange}
            onPermissionChange={this.handlePermissionChange}
            onPermissionDeleteClick={this.handlePermissionDeleteClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
