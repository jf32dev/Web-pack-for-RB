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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import {
  getHomeScreens,
  setHomeScreens,
  deleteHomeScreens,
  uploadFile,
  uploadBTCAHomescreenForDevice,
  ADD_ONS,
  PAGES,
  LEGACY,
} from 'redux/modules/admin/homeScreens';
import { createPrompt } from 'redux/modules/prompts';
import {
  load as loadSettings
} from 'redux/modules/settings';
import {
  updateTemplate,
  clearTemplate,
  editName,
} from 'redux/modules/templateEditor';

import TemplateEditor from 'containers/TemplateEditor/TemplateEditor';

import AdminHomeScreens from 'components/Admin/AdminHomeScreens/AdminHomeScreens';
import AppViewer from 'components/ViewerFiles/AppViewer/AppViewer';
import Dialog from 'components/Dialog/Dialog';
import InputModal from 'components/Admin/AdminHomeScreens/InputModal';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import HomeScreenPickerModel from '../../components/HomeScreenPickerModel/HomeScreenPickerModel';

const messages = defineMessages({
  createHomeScreens: {
    id: 'create-home-screens',
    defaultMessage: 'Create Home Screen'
  },
  homeScreens: {
    id: 'home-screens',
    defaultMessage: 'Home Screens',
  },
  none: {
    id: 'None',
    defaultMessage: 'None',
  },
  webHomeScreens: {
    id: 'web-home-screens',
    defaultMessage: 'Web Home Screens',
  },
  webHomeScreenDescription: {
    id: 'web-home-screen-description',
    defaultMessage: 'Create and assign your JS Bridge 3.0 home screens to one or more Configuration Bundles below.',
  },
  homeScreen: {
    id: 'home-screen',
    defaultMessage: 'Home Screen',
  },
  name: {
    id: 'name',
    defaultMessage: 'Name'
  },
  renameAddOn: {
    id: 'rename-add-on',
    defaultMessage: 'Rename Add-On'
  },
  default: {
    id: 'default',
    defaultMessage: 'Default'
  },
  edit: {
    id: 'edit',
    defaultMessage: 'Edit'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  homeScreenAddOns: {
    id: 'home-screen-add-ons',
    defaultMessage: 'Home Screen Add-ons'
  },
  homeScreenAddOnsDescription: {
    id: 'home-screen-add-ons-description',
    defaultMessage: 'Upload your Home Screen add-ons below.',
  },
  uploadAddOn: {
    id: 'upload-add-on',
    defaultMessage: 'Upload Add-on',
  },
  uploadHomeScreen: {
    id: 'upload-home-screen',
    defaultMessage: 'Upload Home Screen',
  },
  attached: {
    id: 'attached',
    defaultMessage: 'Attached'
  },
  downloadSource: {
    id: 'download-source',
    defaultMessage: 'Download Source'
  },
  deviceHomeScreens: {
    id: 'device-home-screens',
    defaultMessage: 'Device Home Screens'
  },
  deviceHomeScreenDescription: {
    id: 'device-home-screen-description',
    defaultMessage: 'Only Home Screens that support JS Bridge 3.0 can be uploaded.',
  },
  deviceHomeScreenOldDescription: {
    id: 'device-home-screen-old-description',
    defaultMessage: 'Note: only JS Bridge 2.0 Home Screens are supported on devices.',
  },
  homeScreenType: {
    id: 'home-screen-type',
    defaultMessage: 'Home Screen Type'
  },
  confirm: {
    id: 'confirm',
    defaultMessage: 'Confirm'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  deleteHomeScreen: {
    id: 'delete-home-screen',
    defaultMessage: 'Delete Home Screen'
  },
  confirmDeleteHomeScreensMessage: {
    id: 'confirm-delete-home-screens-message',
    defaultMessage: 'Are you sure you want to delete {name}?'
  },
  confirmDeleteHomeScreensMessageWithWarning: {
    id: 'confirm-delete-home-screens-message-with-warning',
    defaultMessage: 'Are you sure you want to delete {name}? Deleting this homescreen will automatically assign default homescreen to the Configuration Bundle.'
  },
  deleteAddOn: {
    id: 'delete-add-on',
    defaultMessage: 'Delete Add-On'
  },
  confirmDeleteAddOnMessage: {
    id: 'confirm-delete-add-on-message',
    defaultMessage: 'Are you sure you want to delete {name}?'
  },
  warning: {
    id: 'warning',
    defaultMessage: 'Warning'
  },
  bridge: {
    id: 'bridge',
    defaultMessage: 'Bridge'
  },
  configurationBundle: {
    id: 'configurationBundle',
    defaultMessage: 'Configuration Bundle'
  },
  assign: {
    id: 'assign',
    defaultMessage: 'Assign'
  },
  assigned: {
    id: 'assigned',
    defaultMessage: 'Assigned'
  },
  bridgeVersion: {
    id: 'bridge-version',
    defaultMessage: 'Type'
  },
  preview: {
    id: 'preview',
    defaultMessage: 'Preview'
  },
  rename: {
    id: 'rename',
    defaultMessage: 'Rename'
  }
});
@connect(state => {
  const {
    addOns = [],
    pages = [],
    legacy = [],
    legacyLoaded,
    legacyLoading,
    pagesUpdated,
    pagesUpdating,
    pagesLoaded,
    pagesLoading,
    error
  } = state.admin.homeScreens;
  return {
    pages: pages.map(item => ({
      id: item.id,
      name: item.name,
      checked: item.isDefault,
      items: item.items,
      numberOfConfigBundleAssign: item.configurationBundleAssignmentCount
    })),
    addOns: addOns.map(item => ({
      id: item.id,
      baseUrl: item.baseUrl,
      name: item.description,
      count: item.homescreenCount,
      progress: item.progress,
      link: item.url
    })),
    legacy: legacy.map(item => ({
      id: item.id,
      name: item.name,
      link: item.url,
      version: item.version,
      progress: item.progress,
      numberOfConfigBundleAssign: item.configurationBundleAssignmentCount
    })),
    loaded: legacyLoaded && pagesLoaded,
    loading: pagesLoading || legacyLoading,
    pagesUpdated,
    pagesUpdating,
    error,
  };
}, bindActionCreatorsSafe({
  loadSettings,
  getHomeScreens,
  setHomeScreens,
  deleteHomeScreens,
  uploadFile,
  uploadBTCAHomescreenForDevice,
  editName,
  updateTemplate,
  clearTemplate,
  createPrompt
}))
export default class AdminHomeScreensView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeFile: null,
      isInputModalVisible: false,
      isDeleteAddOnModalVisible: false,
      isDeleteHomeScreenModalVisible: false,
      isTemplateEditorVisible: false,
      selected: {},
      isHomeScreenPickerModelVisibe: false,
      currentSelectedHomeScreen: null,
      isDeviceHomescreen: false,
      showDeviceHSUploadButton: true
    };

    autobind(this);

    this.fileUpload = null;
    this.timer = null;
  }

  UNSAFE_componentWillMount() {
    if (this.props.getHomeScreens) {
      this.props.getHomeScreens(ADD_ONS);
      this.props.getHomeScreens(PAGES);
      this.props.getHomeScreens(LEGACY);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'home-screens-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
    if (!_get(this.props, 'pagesUpdated', false) && _get(nextProps, 'pagesUpdated', false)) {
      this.props.getHomeScreens(PAGES);
      this.props.getHomeScreens(LEGACY);
    }

    if (this.props.pagesUpdating && nextProps.pagesUpdated) {
      this.props.getHomeScreens(ADD_ONS);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  loadSettings() {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.props.loadSettings();
    }, 1000);
  }

  handleChange(update) {
    const key = Object.keys(update)[0];
    const info = update[key].split('-');

    if (key === 'edit') {
      if (info[0] === ADD_ONS) {
        this.setState({
          isInputModalVisible: true,
          dataKey: info[1],
          value: this.props.addOns.find(item => Number(item.id) === Number(info[1])).name
        });
      }
      if (info[0] === PAGES) {
        const template = this.props.pages.find(item => Number(item.id) === Number(info[1]));
        this.setState({
          isTemplateEditorVisible: true,
          selected: template,
        });
        this.props.editName(template.name);
        this.props.updateTemplate({
          items: template.items
        });
      }
    } else if (key === 'view') {
      this.setState({
        activeFile: this.props.addOns.find(item => Number(item.id) === Number(info[1]))
      });
    } else if (key === 'remove') {
      this.setState({
        isDeleteHomeScreenModalVisible: info[0] === 'pages' || info[0] === 'legacy',
        isDeleteAddOnModalVisible: info[0] === 'addOns',
        selected: {
          ...this.props[info[0]].find(item => Number(item.id) === Number(info[1])),
          tableName: info[0]
        },
      });
    } else if (update[key] === 'createHomeScreens') {
      this.handleToggleEditor();
    } else if (update[key] === 'uploadAddOn') {
      this.setState({
        isDeviceHomescreen: false
      }, () => this.fileUpload.click());
    } else if (update[key] === 'uploadHomeScreen') {
      this.setState({
        isDeviceHomescreen: true
      }, () => this.fileUpload.click());
    } else if (key === 'radio' && this.props.setHomeScreens) {
      this.props.setHomeScreens({
        id: info[1],
        isDefault: true
      }, PAGES);

      this.loadSettings();
    }
  }


  handleClose() {
    this.setState({
      isInputModalVisible: false,
      isDeleteHomeScreenModalVisible: false,
      isDeleteAddOnModalVisible: false
    });
  }

  handleModalConfirm(update) {
    const {
      isInputModalVisible,
      isDeleteHomeScreenModalVisible,
      isDeleteAddOnModalVisible
    } = this.state;
    if (isInputModalVisible) {
      const key = Object.keys(update)[0];
      if (this.props.setHomeScreens) {
        this.props.setHomeScreens({
          id: key,
          name: update[key]
        }, ADD_ONS);
      }
    } else if ((isDeleteHomeScreenModalVisible || isDeleteAddOnModalVisible) && this.props.deleteHomeScreens) {
      this.props.deleteHomeScreens({
        id: this.state.selected.id
      }, this.state.selected.tableName);
    }
    this.handleCloseModal(update);
  }

  handleCloseModal() {
    this.setState({
      isInputModalVisible: false,
      isDeleteHomeScreenModalVisible: false,
      isDeleteAddOnModalVisible: false,
      selected: {}
    });
  }

  handleAssignClick(event, context) {
    const { id } = context;
    const idTypes = id.split('-');
    const hsId = idTypes[1];
    const hsTyle = idTypes[0];
    this.setState({
      currentSelectedHomeScreen: Object.assign({}, context, { id: +hsId, type: hsTyle }),
      isHomeScreenPickerModelVisibe: true
    });
  }

  handleUploadChange(event) {
    if (event.target.files[0]) {
      const files = event.target.files;
      if (this.state.isDeviceHomescreen) {
        this.handleDeviceHSUpload(files);
      } else {
        this.handleAddOnsUpload(files);
      }
    }

    //re-upload the file
    this.fileUpload.value = '';
  }

  handleDeviceHSUpload(files) {
    if (files.length && this.props.uploadBTCAHomescreenForDevice && files[0].size <= 1024 * 1024 * 50) { // not bigger than 50MB for device HS
      // upload the file
      this.props.uploadBTCAHomescreenForDevice(LEGACY, {
        name: files[0].name.replace(/\.[^/.]+$/, ''),
        file: files[0]
      }, this.props.legacy.length, this.context.store.dispatch);
    } else {
      const fileSizeErrorMesage = (<FormattedMessage
        id="file-size-must-be-less-n"
        defaultMessage="File size must be less than {size} MB"
        values={{ size: '50' }}
      />);
      this.props.createPrompt({
        id: 'file-upload-error',
        type: 'warning',
        title: 'Warning',
        message: fileSizeErrorMesage,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleAddOnsUpload(files) {
    if (files.length && this.props.uploadFile && files[0].size <= 1024 * 1024 * 25) { // not bigger than 25MB for web HS
      // upload the file
      this.props.uploadFile(ADD_ONS, {
        name: files[0].name.replace(/\.[^/.]+$/, ''),
        file: files[0]
      }, this.props.addOns.length, this.context.store.dispatch);
    } else {
      const fileSizeErrorMesage = (<FormattedMessage
        id="file-size-must-be-less-n"
        defaultMessage="File size must be less than {size} MB"
        values={{ size: '25' }}
      />);
      this.props.createPrompt({
        id: 'file-upload-error',
        type: 'warning',
        title: 'Warning',
        message: fileSizeErrorMesage,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleToggleEditor(item) {
    this.props.clearTemplate();
    if (item && this.props.setHomeScreens) {
      this.props.setHomeScreens({
        ...item,
        id: this.state.selected.id
      }, PAGES);

      // Reload app settings if default
      if (this.state.selected.checked) {
        this.loadSettings();
      }
    }

    this.setState({
      isTemplateEditorVisible: !this.state.isTemplateEditorVisible,
      selected: {}
    });
  }

  handleAppModalClose() {
    this.setState({
      activeFile: null
    });
  }

  handleHomeScreenPickerClose() {
    this.props.getHomeScreens(PAGES);
    this.props.getHomeScreens(LEGACY);
    this.setState({ isHomeScreenPickerModelVisibe: false });
  }

  render() {
    const {
      activeFile,
      isInputModalVisible,
      isDeleteHomeScreenModalVisible,
      isDeleteAddOnModalVisible,
      selected,
      dataKey,
      value,
      isTemplateEditorVisible,
      isHomeScreenPickerModelVisibe,
      currentSelectedHomeScreen,
      showDeviceHSUploadButton
    } = this.state;
    const {
      pages,
      addOns,
      legacy,
      className,
      style,
      loaded
    } = this.props;
    const { formatMessage } = this.context.intl;
    const { authString } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, {
      homeScreen: selected.name,
      name: selected.name
    });
    return (
      <div id="AdminHomeScreensView" className={className} style={style}>
        {!loaded && <Loader type="page" />}
        {loaded && <div>
          <AdminHomeScreens
            pages={pages}
            addOns={addOns.map(item => ({
              ...item,
              info: item.count > 0 ? item.count + ' ' + (item.count > 1 ? strings.homeScreens : strings.homeScreen) : strings.none,
              link: item.link + '?nr' + authString
            }))}
            legacy={legacy.map(item => ({
              ...item,
              info: `${strings.bridge} ${item.version}`,
              link: item.link + '?nr' + authString
            }))}
            onChange={this.handleChange}
            onAssignClick={this.handleAssignClick}
            strings={strings}
            showDeviceHSUploadButton={showDeviceHSUploadButton}
          />
          <input
            ref={(c) => { this.fileUpload = c; }}
            type="file"
            accept=".btca"
            style={{ display: 'none' }}
            onChange={this.handleUploadChange}
          />
          <InputModal
            isVisible={isInputModalVisible}
            onConfirm={this.handleModalConfirm}
            onClose={this.handleCloseModal}
            dataKey={dataKey}
            value={value}
            label={strings.name}
            title={strings.renameAddOn}
            strings={strings}
          />

          <Dialog
            title={strings.deleteHomeScreen}
            message={selected.numberOfConfigBundleAssign > 0 ? strings.confirmDeleteHomeScreensMessageWithWarning : strings.confirmDeleteHomeScreensMessage}
            isVisible={isDeleteHomeScreenModalVisible}
            confirmText={strings.delete}
            onCancel={this.handleCloseModal}
            onConfirm={this.handleModalConfirm}
          />
          <Dialog
            title={strings.deleteAddOn}
            message={strings.confirmDeleteAddOnMessage}
            isVisible={isDeleteAddOnModalVisible}
            confirmText={strings.delete}
            onCancel={this.handleCloseModal}
            onConfirm={this.handleModalConfirm}
          />
          <TemplateEditor
            isVisible={isTemplateEditorVisible}
            onToggle={this.handleToggleEditor}
            addOns={addOns}
          />
          <Modal
            isVisible={!!activeFile}
            headerTitle={activeFile ? activeFile.name : ''}
            escClosesModal
            headerCloseButton
            width="large"
            onClose={this.handleAppModalClose}
            bodyStyle={{ minHeight: window.innerHeight * 0.8 }}
          >
            {activeFile && <AppViewer
              baseUrl={activeFile.baseUrl}
              referrer={document.location.origin}
              handle={`addon-${activeFile.id}`}
            />}
          </Modal>
          {isHomeScreenPickerModelVisibe &&
            <HomeScreenPickerModel
              {...currentSelectedHomeScreen}
              pages={pages}
              legacy={legacy}
              isVisible
              onClose={this.handleHomeScreenPickerClose}
            />
          }
        </div>}
      </div>
    );
  }
}
