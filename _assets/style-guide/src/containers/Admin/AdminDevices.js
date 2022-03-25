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

import _get from 'lodash/get';

import moment from 'moment';
import uuid from 'uuid';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Dialog from 'components/Dialog/Dialog';

import AdminDevices from 'components/Admin/AdminDevices/AdminDevices';
import DeviceModal from 'components/Admin/AdminDevices/Utils/DeviceModal';
import RestrictionsModal from 'components/Admin/AdminDevices/Utils/RestrictionsModal';

const deviceAssociationUsers = require('../../static/admin/deviceAssociationUsers.json');
const deviceAssociationsDevices = require('../../static/admin/deviceAssociationsDevices.json');
const deviceRestrictionsList = require('../../static/admin/deviceRestrictionsList.json');
const deviceRestrictionsListItem = require('../../static/admin/deviceRestrictionsListItem.json');
const deviceRestrictionsListAllItem = require('../../static/admin/deviceRestrictionsListAllItem.json');

const AdminDevicesDocs = require('!!react-docgen-loader!components/Admin/AdminDevices/AdminDevices.js');

export default class AdminDevicesView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      deviceUserName: '',
      message: '',
      deleteData: {},
      deleteName: '',
      isDeviceModalVisible: false,
      isDeleteVisible: false,
      isRestrictionsVisible: false,
      restrictionsModalValues: {
        items: [],
        groups: []
      }
    };

    autobind(this);
  }

  handleActiveModal(e) {
    const { dataset } = e.currentTarget;
    const dataSetName = _get(dataset, 'name', false);
    const dataSetUser = _get(dataset, 'user', false);
    const dataSetId = _get(dataset, 'id', false);
    const dataSetAction = _get(dataset, 'action', false);
    let stateUpdate = {};

    if (dataSetUser && dataSetAction && dataSetAction === 'isDeviceModalVisible') {
      stateUpdate = {
        deviceUserName: dataSetUser
      };
    } else if (dataSetAction && dataSetAction === 'isDeleteVisible') {
      let message = '';
      if (dataSetName === 'device') {
        message = 'Are you sure you want to disconnect these devices?';
      } else if (dataSetName === 'restrictionsList') {
        message = 'Are you sure you want to delete this Browser restriction?';
      }

      stateUpdate = {
        message,
        deleteData: dataSetId,
        deleteName: dataSetName,
      };
    } else if (dataSetName && dataSetName === 'restrictionsList') {
      if (dataSetId && dataSetAction === 'isRestrictionsVisible') {
        const restrictionsModalValues = Object.keys(deviceRestrictionsListItem).reduce(this.generateRestriction, {});
        stateUpdate = {
          restrictionsModalValues: {
            ...restrictionsModalValues,
            allGroupList: deviceRestrictionsListAllItem.map(this.generateGroups)
          }
        };
      } else if (dataSetAction === 'isRestrictionsVisible') {
        stateUpdate = {
          restrictionsModalValues: {
            allGroupList: deviceRestrictionsListAllItem.map(item => ({
              id: item.id,
              usersCount: item.users_count,
              name: item.title,
              thumbnail: item.thumbnail || '',
              colour: item.default_colour || '#ffd400',
              isSelected: false,
              type: 'group',
            }))
          }
        };
      }
    }

    if (dataSetAction) {
      this.setState({
        ...stateUpdate,
        [dataSetAction]: true,
      });
    }
  }

  handleUpdate(update) {
    this.setState({
      values: {
        ...this.state.values,
        ...update,
      }
    });
  }

  handleRestrictionsModalUpdate(update) {
    let newUpdate = update;
    if (Object.prototype.hasOwnProperty.call(update, 'items')) {
      if (update.action === 'add') {
        newUpdate = {
          items: this.state.restrictionsModalValues.items.concat({
            ...update.items,
            id: uuid.v4(),
          })
        };
      } else if (update.action === 'remove') {
        newUpdate = {
          items: this.state.restrictionsModalValues.items.filter(item => item.id !== update.items.id)
        };
      }
    }

    this.setState({
      restrictionsModalValues: {
        ...this.state.restrictionsModalValues,
        ...newUpdate,
      }
    });
  }

  handleModalConfirm(action, data) {
    console.log(action, data);
    this.handleCloseModal();
  }

  handleDeleteDialogConfirm(event) {
    event.preventDefault();
    const { deleteName, deleteData } = this.state;
    console.log(deleteName, deleteData);
    this.handleCloseModal();
  }

  handleCloseModal() {
    this.setState({
      isDeviceModalVisible: false,
      isDeleteVisible: false,
      isRestrictionsVisible: false
    });
  }

  handleGroupChange(e) {
    const { value, dataset } = e.currentTarget;
    const action = _get(dataset, 'action', false);
    const { restrictionsModalValues } = this.state;

    let allGroupList = deviceRestrictionsListAllItem.map(this.generateGroups);
    const groups = restrictionsModalValues.groups || [];

    if (action === 'search') {
      allGroupList = allGroupList.filter(item => item.name.indexOf(value) > -1);
    }

    this.updateGroups(allGroupList, groups);
  }

  handleRemoveGroupItem(id) {
    const { restrictionsModalValues } = this.state;
    const allGroupList = deviceRestrictionsListAllItem.map(this.generateGroups);
    let groups = restrictionsModalValues.groups || [];

    groups = groups.filter(item => item.id !== Number(id));

    this.updateGroups(allGroupList, groups);
  }

  handleAddGroupItem(id) {
    const { restrictionsModalValues } = this.state;
    const allGroupList = deviceRestrictionsListAllItem.map(this.generateGroups);
    let groups = restrictionsModalValues.groups || [];

    groups = groups.concat(allGroupList.find(item => item.id === Number(id)));

    this.updateGroups(allGroupList, groups);
  }

  updateGroups(oldAllGroupList, oldGroups) {
    const allGroupList = oldAllGroupList.map(item => ({
      ...item,
      isSelected: oldGroups.filter(activeItem => activeItem.id === item.id).length > 0,
    }));

    const stateUpdate = {
      restrictionsModalValues: {
        ...this.state.restrictionsModalValues,
        groups: oldGroups,
        allGroupList: allGroupList.map(item => ({ ...item, type: 'group' })),
      }
    };

    this.setState({
      ...stateUpdate,
    });
  }

  generateUsers(item) {
    return {
      id: item.user_id,
      name: `${item.firstname} ${item.lastname}`,
      email: item.email,
      totalDevices: `${item.device_count} Device${item.device_count > 1 ? 's' : ''}`,
      dateAdded: moment(item.last_date_added).format('DD/MM/YYYY'),
    };
  }

  generateDevices(item) {
    return {
      id: item.id,
      deviceId: item.device_id,
      userAgent: item.user_agent,
      dateAdded: moment(item.date_added).format('MMMM DD, YYYY'),
      deleted: item.deleted,
    };
  }

  generateGroups(item) {
    return {
      id: item.id,
      usersCount: item.users_count,
      name: item.title,
      thumbnail: item.thumbnail || '',
      colour: item.default_colour || '#ffd400',
      type: 'group',
      isSelected: deviceRestrictionsListItem.groups.filter(activeItem => activeItem.id === item.id).length > 0
    };
  }

  generateRestriction(preObj, key) {
    if (key === 'groups') {
      return {
        ...preObj,
        [key]: deviceRestrictionsListItem[key].map(item => ({
          id: Number(item.id),
          usersCount: item.users_count,
          name: item.title,
          thumbnail: item.thumbnail || '',
          colour: item.default_colour || '#ffd400',
          type: 'group',
        }))
      };
    }
    return {
      ...preObj,
      [key]: deviceRestrictionsListItem[key]
    };
  }

  render() {
    const users = deviceAssociationUsers.map(this.generateUsers);
    const devices = deviceAssociationsDevices.map(this.generateDevices);
    const {
      isDeviceModalVisible,
      deviceUserName,
      message,
      deleteData,
      deleteName,
      isDeleteVisible,
      isRestrictionsVisible,
      restrictionsModalValues
    } = this.state;
    const strings = {
      warning: 'Warning',
      delete: 'Delete',
      cancel: 'Cancel',
      createBrowserRestriction: 'Create Browser Restriction',
      restrictionName: 'Restriction Name',
      restrictionType: 'Restriction Type',
      allowlist: 'Allowlist',
      denylist: 'Denylist',
      matches: 'Matches',
      groupList: 'Group List',
      addGroups: 'Add Groups',
      add: 'Add',
      domain: 'Domain',
      url: 'URL',
      scheme: 'Scheme',
      eg: 'e.g',
      save: 'Save',
    };

    return (
      <section id="AdminDevicesView">
        <h1>Admin Settings Security Devices View</h1>
        <Docs {...AdminDevicesDocs} />
        <ComponentItem>
          <AdminDevices
            deviceAssociationUsers={users}
            onUpdate={this.handleUpdate}
            onActiveModal={this.handleActiveModal}
            whitelist={deviceRestrictionsList.filter(item => item.type === 'whitelist')}
            blacklist={deviceRestrictionsList.filter(item => item.type === 'blacklist')}
            {...this.state.values}
          />
          <DeviceModal
            onConfirm={this.handleModalConfirm}
            title={deviceUserName}
            list={devices}
            onClose={this.handleCloseModal}
            isVisible={isDeviceModalVisible}
          />
          <Dialog
            title={strings.warning}
            message={message}
            cancelText={strings.cancel}
            confirmText={strings.delete}
            isVisible={isDeleteVisible}
            onCancel={this.handleCloseModal}
            onConfirm={this.handleDeleteDialogConfirm}
          />
          <RestrictionsModal
            strings={strings}
            onClose={this.handleCloseModal}
            isVisible={isRestrictionsVisible}
            onRemoveGroupItem={this.handleRemoveGroupItem}
            onAddGroupItem={this.handleAddGroupItem}
            onGroupSearchChange={this.handleGroupChange}
            onChange={this.handleRestrictionsModalUpdate}
            {...restrictionsModalValues}
          />
        </ComponentItem>
      </section>
    );
  }
}
