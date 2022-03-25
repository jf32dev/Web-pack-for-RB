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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import moment from 'moment';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import { createPrompt } from 'redux/modules/prompts';
import {
  getSecurityList,
  setCustomSecurityMultiKeys,
  getSecurity,
  setSetting,
  getSetting,
  deleteSecurity,
  globalFetchLimit,
  setCustomSecurity,
  GET_USERS,
  GET_DEVICES,
  ASSOCIATIONLOCK,
  BROWSERRESTRICTIONS,
  DEVICEPINRULES,
} from 'redux/modules/admin/security';
import {
  loadAllGroups,
  globalFetchLimit as globalStructureFetchLimit
} from 'redux/modules/admin/structure';

import Dialog from 'components/Dialog/Dialog';

import AdminDevices from 'components/Admin/AdminDevices/AdminDevices';
import DeviceModal from 'components/Admin/AdminDevices/Utils/DeviceModal';
import RestrictionsModal from 'components/Admin/AdminDevices/Utils/RestrictionsModal';
import withSave from 'components/Admin/AdminUtils/AdminHOC/withSave';

const messages = defineMessages({
  associationLock: {
    id: 'association-lock',
    defaultMessage: 'Association lock'
  },
  browserRestrictions: {
    id: 'browser-restrictionse',
    defaultMessage: 'Browser restrictions',
  },
  pinComplexity: {
    id: 'pin-complexity',
    defaultMessage: 'Pin complexity'
  },
  enableDeviceBrowserRestrictions: {
    id: 'enable-device-browser-restrictions',
    defaultMessage: 'Enable device browser restrictions'
  },
  browserRestrictionGeneralInfo: {
    id: 'browser-restrictions-general-info',
    defaultMessage: 'Assign restriction lists to multiple groups. Note: Allowlists take precedence over denylists.'
  },
  allowlist: {
    id: 'allowlist',
    defaultMessage: 'Allowlist'
  },
  denylist: {
    id: 'denylist',
    defaultMessage: 'Denylist'
  },
  edit: {
    id: 'edit',
    defaultMessage: 'Edit',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  createBrowserRestriction: {
    id: 'create-browser-restriction',
    defaultMessage: 'Create Browser Restriction'
  },
  restrictionName: {
    id: 'restriction-name',
    defaultMessage: 'Restriction Name'
  },
  restrictionType: {
    id: 'restriction-yype',
    defaultMessage: 'Restriction Type'
  },
  matches: {
    id: 'matches',
    defaultMessage: 'Matches'
  },
  add: {
    id: 'add',
    defaultMessage: 'Add'
  },
  domain: {
    id: 'domain',
    defaultMessage: 'Domain'
  },
  scheme: {
    id: 'scheme',
    defaultMessage: 'Scheme',
  },
  url: {
    id: 'url',
    defaultMessage: 'URL'
  },
  groupList: {
    id: 'group-list',
    defaultMessage: 'Group List'
  },
  addGroups: {
    id: 'add-groups',
    defaultMessage: 'Add Groups'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save',
  },
  minimumCharacters: {
    id: 'minimum-characters',
    defaultMessage: 'Have at least this many total characters',
  },
  minimumSix: {
    id: 'minimum-six',
    defaultMessage: 'Minimum complexity requirement: 6 characters',
  },
  minimumAlphabetic: {
    id: 'minimum-alphabetic',
    defaultMessage: 'Have at least this many Alphabetic Letters (a-z, A-Z)',
  },
  minimum1: {
    id: 'minimum-1',
    defaultMessage: 'Minimum: 1',
  },
  minimumCapital: {
    id: 'minimum-capital',
    defaultMessage: 'Have at least this many Capital Letters (A-Z)',
  },
  minimumNumbers: {
    id: 'minimum-numbers',
    defaultMessage: 'Have at least this many Numbers (0-9)',
  },
  minimumSpecial: {
    id: 'minimum-special',
    defaultMessage: 'Have at least this many Special Characters (!@#..etc)',
  },
  no: {
    id: 'no',
    defaultMessage: 'No',
  },
  oneDevice: {
    id: 'one-device',
    defaultMessage: '1 device',
  },
  twoDevices: {
    id: 'two-devices',
    defaultMessage: '2 devices',
  },
  threeDevices: {
    id: 'three-devices',
    defaultMessage: '3 devices',
  },
  fourDevices: {
    id: 'four-devices',
    defaultMessage: '4 devices',
  },
  fiveDevices: {
    id: 'five-devices',
    defaultMessage: '5 devices',
  },
  sixDevices: {
    id: 'six-devices',
    defaultMessage: '6 devices',
  },
  sevenDevices: {
    id: 'seven-devices',
    defaultMessage: '7 devices',
  },
  eightDevices: {
    id: 'eight-devices',
    defaultMessage: '8 devices',
  },
  nightDevices: {
    id: 'night-devices',
    defaultMessage: '9 devices',
  },
  enableDeviceLimit: {
    id: 'enable-deviceLimit',
    defaultMessage: 'Enable device limit',
  },
  associationLockGeneralInfos: {
    id: 'association-dock-general-info',
    defaultMessage: 'When device association lock is enabled, users will be locked to the first N devices they log in with.',
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning',
  },
  add2allowlist: {
    id: 'add-2-allowlist',
    defaultMessage: 'Add to Allowlist',
  },
  add2denylist: {
    id: 'add-2-denylist',
    defaultMessage: 'Add to Denylist',
  },
  device: {
    id: 'device',
    defaultMessage: 'Device',
  },
  devices: {
    id: 'devices',
    defaultMessage: 'Devices',
  },
  name: {
    id: 'name',
    defaultMessage: 'Name',
  },
  totalDevices: {
    id: 'total-devices',
    defaultMessage: 'Total Devices',
  },
  dateAdded: {
    id: 'date-ddded',
    defaultMessage: 'Date Added',
  },
  userAgent: {
    id: 'user-agent',
    defaultMessage: 'User agent',
  },
  added: {
    id: 'added',
    defaultMessage: 'Added',
  },
  done: {
    id: 'done',
    defaultMessage: 'Done',
  },
  warnings: {
    id: 'warning',
    defaultMessage: 'Warning',
  },
  eg: {
    id: 'eg',
    defaultMessage: 'e.g',
  },
  disconnectDevicesMsg: {
    id: 'disconnect-devices-msg',
    defaultMessage: 'Are you sure you want to disconnect these devices?',
  },
  deleteBrowserRestriction: {
    id: 'delete-browser-restriction',
    defaultMessage: 'Are you sure you want to delete this browser restriction?',
  },
  search: {
    id: 'search',
    defaultMessage: 'Search'
  }
});

const pinProperties = {
  characters: 'totalCharacters',
  alphabetic: 'totalAlphabetic',
  capital: 'totalCapital',
  numbers: 'totalNumbers',
  specials: 'totalSpecials',
};

@connect(state => ({
  ...state.admin.security,
  associationLock: state.admin.security.associationLock.map(item => ({
    name: `${item.firstname} ${item.lastname}`,
    email: item.email,
    dateAdded: moment(item.lastDateAdded).format('MMM DD, YYYY'),
    totalDevices: item.deviceCount,
    id: item.userId,
  })),
  browserRestrictions: state.admin.security.browserRestrictions.map(item => ({
    id: item.id,
    items: item.items.map(obj => ({
      type: obj.type,
      match: obj.match
    })),
    name: item.name,
    type: item.type,
    groups: item.groups.map(group => ({
      id: +group.id,
      colour: group.colour || group.defaultColour,
      name: group.name,
      thumbnail: group.thumbnail,
      type: group.type,
      childCount: group.childCount || group.usersCount,
      isSelected: true,
    }))
  })),
  devices: state.admin.security.devices.map(item => ({
    ...item,
    deleted: 0
  })),
  characters: state.admin.security.totalCharacters,
  alphabetic: state.admin.security.totalAlphabetic,
  capital: state.admin.security.totalCapital,
  numbers: state.admin.security.totalNumbers,
  specials: state.admin.security.totalSpecials,
  allGroups: state.admin.structure.allGroups.map(id => (
    state.entities.groups[id]
  )),
  allGroupsLoading: state.admin.structure.allGroupsLoading,
  allGroupsComplete: state.admin.structure.allGroupsComplete,
  allGroupsError: state.admin.structure.allGroupsError,
  allGroupsOffset: state.admin.structure.allGroupsOffset,
  routing: state.routing,
}), bindActionCreatorsSafe({
  createPrompt,
  getSecurity,
  getSetting,
  getSecurityList,
  loadAllGroups,

  put: item => {
    const key = Object.keys(item)[0];
    if (Object.prototype.hasOwnProperty.call(pinProperties, key)) {
      return setCustomSecurity(DEVICEPINRULES, {
        [pinProperties[key]]: item[key]
      });
    }
    if (typeof (item[key]) === 'boolean') {
      return setSetting({
        [key]: +item[key]
      });
    }
    return setSetting(item);
  },
  putBrowserRestrictions: item => setCustomSecurityMultiKeys(BROWSERRESTRICTIONS, Object.keys(item).reduce((accumulator, key) => {
    if (key === 'groups') {
      return {
        ...accumulator,
        groups: JSON.stringify(item.groups.map(group => group.id))
      };
    } else if (key === 'items') {
      return {
        ...accumulator,
        items: JSON.stringify(item.items.map(obj =>
          (obj.id > 0 ? {
            type: obj.type,
            match: obj.match,
          } : obj)
        ))
      };
    } else if (key === 'lastUpdated') {
      return accumulator;
    }

    return { ...accumulator, [key]: item[key] };
  }, {})),
  postBrowserRestrictions: item => setCustomSecurityMultiKeys(BROWSERRESTRICTIONS, Object.keys(item).reduce((accumulator, key) => {
    if (key === 'groups') {
      return {
        ...accumulator,
        groups: JSON.stringify(item.groups.map(group => group.id))
      };
    } else if (key === 'items') {
      return {
        ...accumulator,
        items: JSON.stringify(item.items.map(obj =>
          (obj.id > 0 ? {
            type: obj.type,
            match: obj.match,
          } : obj)
        ))
      };
    } else if (key === 'lastUpdated') {
      return accumulator;
    }

    return { ...accumulator, [key]: item[key] };
  }, {})),
  deleteBrowserRestrictions: id => deleteSecurity(BROWSERRESTRICTIONS, {
    id: id,
  }),
  putAssociationLock: (item, associationIds) => deleteSecurity(ASSOCIATIONLOCK, {
    userId: item.id,
    associationIds: associationIds
  }),
  deleteAssociationLock: id => deleteSecurity(ASSOCIATIONLOCK, {
    userId: id,
  }),
}))
@withSave
export default class AdminDevicesView extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.defaultRestrictions = {
      items: [],
      groups: [],
      type: 'whitelist'
    };

    this.state = {
      values: {},
      deviceUserName: '',
      message: '',
      deleteData: {},
      deleteName: '',
      isDeviceModalVisible: false,
      isDeleteVisible: false,
      isRestrictionsVisible: false,
      restrictionsModalValues: this.defaultRestrictions,
      selectedMenuItem: 'associationLock'
    };

    this.userListProperties = {
      offset: 0,
      key: 'name',
      order: 'asc',
      search: '',
    };

    this.groupsProperties = {
      search: '',
    };

    this.deletedDevicesIds = {};

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.getSecurityList) {
      this.props.getSecurityList(GET_USERS, 0, 'name');
    }

    if (this.props.getSetting) {
      this.props.getSetting();
    }

    const name = this.getNameFromSearch(this.props.location.search);
    this.setState({
      selectedMenuItem: name,
    });
    this.updateSetting(this.props.location.search);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'security-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
    if (this.props.location.search !== nextProps.location.search) {
      const search = nextProps.location.search;
      this.updateSetting(search);
    }
  }

  componentWillUnmount()  {
    this.deletedDevicesIds = null;
  }

  getNameFromSearch(search) {
    let result = 'associationLock';
    if (search.indexOf('type=browserRestrictions') > -1) {
      result = 'browserRestrictions';
    } else if (search.indexOf('type=pinComplexity') > -1) {
      result = 'pinComplexity';
    }

    return result;
  }

  updateSetting(search) {
    const name = this.getNameFromSearch(search);
    if (name === 'associationLock') {
      if (this.props.getSecurityList) {
        this.props.getSecurityList(GET_USERS, 0, 'name');
      }

      if (this.props.getSetting) {
        this.props.getSetting();
      }
    } else if (name === 'browserRestrictions' && this.props.getSecurity) {
      this.props.getSecurity(BROWSERRESTRICTIONS);

      if (this.props.getSetting) {
        this.props.getSetting();
      }
    } else if (name === 'pinComplexity' && this.props.getSecurity) {
      this.props.getSecurity(DEVICEPINRULES);
    }
  }

  handleActiveModal(e) {
    const { dataset } = e.currentTarget;
    const dataSetName = _get(dataset, 'name', false);
    const dataSetUser = _get(dataset, 'user', false);
    const dataSetId = _get(dataset, 'id', false);
    const dataSetAction = _get(dataset, 'action', false);
    const dataSetType = _get(dataset, 'type', false);
    let stateUpdate = {};

    if (dataSetUser && dataSetAction && dataSetAction === 'isDeviceModalVisible') {
      if (this.props.getSecurityList) {
        this.props.getSecurityList(GET_DEVICES, 0, false, {
          userId: dataSetId
        });
      }
      stateUpdate = {
        deviceUserName: dataSetUser
      };
    } else if (dataSetAction && dataSetAction === 'isDeleteVisible') {
      let message = '';
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage);
      if (dataSetName === 'device') {
        message = strings.disconnectDevicesMsg;
      } else if (dataSetName === 'restrictionsList') {
        message = strings.deleteBrowserRestriction;
      }

      stateUpdate = {
        message,
        deleteData: dataSetId,
        deleteName: dataSetName,
      };
    } else if (dataSetName && dataSetName === 'restrictionsList') {
      if (this.props.loadAllGroups) {
        this.props.loadAllGroups(0);
      }
      if (dataSetId && dataSetAction === 'isRestrictionsVisible') {
        const restrictionsModalValues = this.props.browserRestrictions.find(item => +item.id === +dataSetId);
        stateUpdate = {
          restrictionsModalValues: {
            ...restrictionsModalValues,
            groups: restrictionsModalValues.groups.map(this.generateGroups),
          }
        };
      } else if (dataSetAction === 'isRestrictionsVisible') {
        stateUpdate = {
          restrictionsModalValues: {
            ...this.defaultRestrictions,
            type: dataSetType
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
    const key = Object.keys(update)[0];
    if (Object.prototype.hasOwnProperty.call(pinProperties, key) && this.props.put) {
      this.props.put(update);
    }

    if (['deviceAssociationLock', 'deviceBrowserRestrictions'].indexOf(key) > -1 && this.props.put) {
      this.props.put(update);
    }
  }

  handleRestrictionsModalUpdate(update) {
    let newUpdate = update;
    if (Object.prototype.hasOwnProperty.call(update, 'items')) {
      if (update.action === 'add') {
        newUpdate = {
          items: this.state.restrictionsModalValues.items.concat({
            ...update.items,
            id: `new-${this.state.restrictionsModalValues.items.length + 1}`,
          })
        };
      } else if (update.action === 'remove') {
        newUpdate = {
          items: this.state.restrictionsModalValues.items.filter((item, i) => i !== +update.items.id)
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
    if (action === 'devices' && this.props.putAssociationLock) {
      const associationIds = data.filter(item => item.deleted === 1).map(item => item.id);
      const associationLockItem = this.props.associationLock.find(obj => +obj.id === +this.props.currentUserId);
      const totalDevices = data.filter(item => item.deleted === 0).length;
      if (totalDevices > 0) {
        this.props.putAssociationLock({
          ...associationLockItem,
          totalDevices: data.filter(item => item.deleted === 0).length,
        }, JSON.stringify(associationIds));
      } else {
        this.props.deleteAssociationLock(+this.props.currentUserId);
      }
      this.deletedDevicesIds[this.props.currentUserId] = associationIds;
    }

    this.handleCloseModal();
  }

  handleDeleteDialogConfirm(event) {
    event.preventDefault();
    const { deleteName, deleteData } = this.state;

    if (deleteName === 'device') {
      this.props.deleteAssociationLock(deleteData);
    } else if (deleteName === 'restrictionsList') {
      this.props.deleteBrowserRestrictions(deleteData);
    }

    this.setState({
      isDeleteVisible: false
    });
  }

  handleCloseModal() {
    this.setState({
      isDeviceModalVisible: false,
      isDeleteVisible: false,
      isRestrictionsVisible: false
    });
  }

  handleGroupChange(e) {
    const { value } = e.currentTarget;
    if (this.props.loadAllGroups) {
      this.props.loadAllGroups(0, value);
      this.groupsProperties = {
        search: value
      };
    }
    this.resetAllProperties();
  }

  resetAllProperties() {
    this.groupsProperties = {
      search: '',
    };

    this.userListProperties = {
      offset: 0,
      key: 'name',
      order: 'asc',
      search: '',
    };
  }

  handleRemoveGroupItem(id) {
    this.setState({
      restrictionsModalValues: {
        ...this.state.restrictionsModalValues,
        groups: this.state.restrictionsModalValues.groups.filter(item => +item.id !== +id)
      }
    });
  }

  handleAddGroupItem(id) {
    const groupItem = this.props.allGroups.map(this.generateGroups).find(item => +item.id === +id);
    this.setState({
      restrictionsModalValues: {
        ...this.state.restrictionsModalValues,
        groups: this.state.restrictionsModalValues.groups.concat(groupItem).sort((a, b) => a.name.localeCompare(b.name))
      }
    });
  }

  handleHeaderSelect(name) {
    this.resetAllProperties();
    this.setState({
      selectedMenuItem: name,
    });
    this.props.history.push(`/admin/security/devices?type=${name}`);
  }

  generateGroups(item) {
    return {
      id: item.id,
      colour: item.colour || item.defaultColour,
      name: item.name,
      thumbnail: item.thumbnail,
      type: item.type,
      childCount: item.childCount || item.usersCount,
      isSelected: true,
    };
  }

  handleScroll(e) {
    const target = e.target;
    const {
      associationLockComplete,
      associationLockLoading,
    } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    if (scrollBottom >= loadTrigger && !associationLockComplete && !associationLockLoading) {
      // Load more
      if (this.props.getSecurityList) {
        this.props.getSecurityList(GET_USERS, this.userListProperties.offset + globalFetchLimit,
          this.userListProperties.key === 'totalDevices' ? 'deviceCount' : this.userListProperties.key, {
            order: this.userListProperties.order
          });
        this.userListProperties = {
          ...this.userListProperties,
          offset: this.userListProperties.offset + globalFetchLimit,
        };
      }
    }
  }

  handleGroupScroll(e) {
    const target = e.target;
    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left
    const {
      allGroupsLoading,
      allGroupsComplete,
    } = this.props;
    if (scrollBottom >= loadTrigger && !allGroupsComplete && !allGroupsLoading) {
      // Load more
      if (this.props.loadAllGroups) {
        this.props.loadAllGroups(this.props.allGroupsOffset + globalStructureFetchLimit, this.groupsProperties.search);
      }
    }
  }

  handleSaveRestriction() {
    const { restrictionsModalValues } = this.state;
    const groups = [].concat(restrictionsModalValues.groups).sort((a, b) => +a.id - +b.id);
    const update = {
      ...restrictionsModalValues,
      items: restrictionsModalValues.items.map(obj => ({
        type: obj.type,
        match: obj.match,
      })),
      groups: groups
    };

    if (Object.prototype.hasOwnProperty.call(update, 'id') && this.props.putBrowserRestrictions) {
      this.props.putBrowserRestrictions(update);
    } else if (this.props.postBrowserRestrictions) {
      this.props.postBrowserRestrictions(update);
    }

    this.setState({
      isRestrictionsVisible: false
    });

    this.resetAllProperties();
  }

  handleSort(list, key, reverse, search) {
    let newKey = key === undefined ? this.userListProperties.key : key;
    newKey = newKey === 'totalDevices' ? 'deviceCount' : key;
    if (this.props.getSecurityList) {
      this.props.getSecurityList(GET_USERS, 0, newKey, {
        order: reverse ? 'desc' : 'asc',
        search,
      });

      this.userListProperties = {
        ...this.userListProperties,
        key,
        order: reverse ? 'desc' : 'asc',
        offset: 0,
        search,
      };
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      isDeviceModalVisible,
      deviceUserName,
      message,
      isDeleteVisible,
      isRestrictionsVisible,
      restrictionsModalValues,
      selectedMenuItem,
    } = this.state;
    const {
      devices,
      currentUserId,
      associationLock,
      associationLockComplete,
      browserRestrictions,
      allGroups,
      allGroupsLoading,
      allGroupsComplete,
      ...others
    } = this.props;
    const styles = require('./AdminDevices.less');
    const strings = generateStrings(messages, formatMessage);

    return (
      <div id="AdminDevicesView" className={styles.AdminDevices}>
        <div className={styles.AdminDevicesViewInnerDiv} onScroll={this.handleScroll}>
          <AdminDevices
            deviceAssociationUsers={associationLock}
            onUpdate={this.handleUpdate}
            selectedMenuItem={selectedMenuItem}
            onActiveModal={this.handleActiveModal}
            whitelist={browserRestrictions.filter(item => item.type === 'whitelist')}
            blacklist={browserRestrictions.filter(item => item.type === 'blacklist')}
            strings={strings}
            onHeaderSelect={this.handleHeaderSelect}
            onAssociationLockListSort={this.handleSort}
            deviceAssociationLockLoadingMore={!associationLockComplete}
            {...others}
            {...this.state.values}
          />
        </div>
        <DeviceModal
          onConfirm={this.handleModalConfirm}
          title={deviceUserName}
          list={devices.map(item => (_get(this.deletedDevicesIds, currentUserId, []).indexOf(item.id) > -1 ? {
            ...item,
            deleted: 1,
          } : item))}
          onClose={this.handleCloseModal}
          strings={strings}
          isVisible={isDeviceModalVisible && !_isEmpty(currentUserId)}
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
          onSave={this.handleSaveRestriction}
          onScroll={this.handleGroupScroll}
          loading={allGroupsLoading}
          loadingMore={!allGroupsComplete}
          groupListPlaceHolder={`${strings.search} ...`}
          allGroupList={allGroups.map(this.generateGroups)}
        />
      </div>
    );
  }
}
