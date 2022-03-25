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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _camelCase from 'lodash/camelCase';

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import AdminSyncEngine from 'components/Admin/AdminFiles/AdminSyncEngine';
import SyncCreateModal from 'components/Admin/AdminFiles/SyncCreateModal';

const AdminSyncEngineDocs = require('!!react-docgen-loader!components/Admin/AdminFiles/AdminSyncEngine.js');
const syncEngine = require('../../static/admin/syncEngine.json');
const cloudServices = require('../../static/admin/cloudServices.json');
const folderConnection = require('../../static/admin/folderConnection.json');
const deviceRestrictionsListAllItem = require('../../static/admin/deviceRestrictionsListAllItem.json');
const deviceRestrictionsListItem = require('../../static/admin/deviceRestrictionsListItem.json');
const syncEngine_groups = require('../../static/admin/syncEngine_groups.json');

const camelcaseTransfer = item => (Object.keys(item).reduce((obj, key) => {
  if (Array.isArray(item[key])) {
    return {
      ...obj,
      [_camelCase(key)]: item[key].map(arrayItem => Object.keys(arrayItem).reduce((arrayObj, arrayKey) => ({
        ...arrayObj,
        [_camelCase(arrayKey)]: arrayItem[arrayKey]
      }), {}))
    }
  } else {
    return {
      ...obj,
      [_camelCase(key)]: item[key]
    }
  }
}, {}))

export default class AdminSyncEngineView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      allGroupList: deviceRestrictionsListAllItem.map(this.handleGenerateGroups)
    };
    autobind(this);
  }

  handleChange(update) {
    console.log(update);
    if (update.action === 'create') {
      this.setState({
        isVisible: true
      });
    }
  }

  handleCloseModal() {
    this.setState({
      isVisible: false
    });
  }

  handleGenerateGroups(item) {
    return {
      id: item.id,
      childCount: item.users_count,
      name: item.title,
      thumbnail: item.thumbnail || '',
      colour: item.default_colour || '#ffd400',
      type: 'group',
      isSelected: deviceRestrictionsListItem.groups.filter(activeItem => activeItem.id === item.id).length > 0
    };
  }

  render() {
    const { isVisible, allGroupList } = this.state;

    return (
      <section id="BlankView">
        <h1>Admin Sync Engine View</h1>
        <Docs {...AdminSyncEngineDocs} />
        <ComponentItem>
          <AdminSyncEngine onChange={this.handleChange} syncEngine={syncEngine} />
          <SyncCreateModal
            isVisible={isVisible}
            onClose={this.handleCloseModal}
            cloudServices={cloudServices}
            folderConnection={folderConnection}
            allGroupList={allGroupList}
            users={syncEngine_groups.team}
          />
        </ComponentItem>
      </section>
    );
  }
}
