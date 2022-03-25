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
 * @package hub-web-app-v5
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';
import {
  getNotifications,
  setNotifications,
} from 'redux/modules/userSettings';

import {
  disconnectDevice,
  getUserGeneralSettings,
  setUserData,
  updatePassword,
} from 'redux/modules/settings';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';
import Editor from 'components/Editor/Editor';
import Loader from 'components/Loader/Loader';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Select from 'react-select';
import Text from 'components/Text/Text';

const messages = defineMessages({
  general: { id: 'general', defaultMessage: 'General' },
  privateActivityStream: { id: 'private-activity-stream', defaultMessage: 'Private activity stream' },
  language: { id: 'language', defaultMessage: 'Language' },
  timeZone: { id: 'time-zone', defaultMessage: 'Time Zone' },
  sendDigestEmail: { id: 'send-digest-email', defaultMessage: 'Send digest email' },
  socialDataSharing: { id: 'social-data-sharing', defaultMessage: 'Social data sharing' },
  signature: { id: 'signature', defaultMessage: 'Signature' },
  password: { id: 'password', defaultMessage: 'Password' },
  devices: { id: 'devices', defaultMessage: 'Devices' },
  connectedDevices: { id: 'connected-devices', defaultMessage: 'Connected devices' },
  changePassword: { id: 'change-password', defaultMessage: 'Change password' },
  currentPassword: { id: 'current-password', defaultMessage: 'Current password' },
  newPassword: { id: 'new-password', defaultMessage: 'New password' },
  confirmPassword: { id: 'confirm-password', defaultMessage: 'Confirm password' },
  enable: { id: 'enable', defaultMessage: 'Enable' },
  disable: { id: 'disable', defaultMessage: 'Disable' },
  saveChanges: { id: 'save-changes', defaultMessage: 'Save changes' },
  save: { id: 'save', defaultMessage: 'Save' },
  updatePassword: { id: 'update-password', defaultMessage: 'Update password' },
  updateSignature: { id: 'update-signature', defaultMessage: 'Update signature' },
  noDevicesConnected: { id: 'no-devices-connected', defaultMessage: 'No Devices Connected' },

  never: { id: 'never', defaultMessage: 'Never' },
  daily: { id: 'daily', defaultMessage: 'Daily' },
  weekly: { id: 'weekly', defaultMessage: 'Weekly' },
  monthly: { id: 'monthly', defaultMessage: 'Monthly' },

  everyone: { id: 'everyone', defaultMessage: 'Everyone' },
  usersImFollowing: { id: 'users-im-following', defaultMessage: 'Users I\'m following' },
  noOne: { id: 'no-one', defaultMessage: 'No one' },

  location: { id: 'location', defaultMessage: 'Location' },
  lastActivity: { id: 'last-activity', defaultMessage: 'Last Activity' },
  id: { id: 'id', defaultMessage: 'Id' },
  confirmTitle: { id: 'sign-out-of-device', defaultMessage: 'Sign Out Of Device' },
  confirmMessage: { id: 'sign-out-confirmation-message', defaultMessage: 'Are you sure you want to sign out of this device?' },
  passwordsDoNotMatch: { id: 'passwords-do-not-match', defaultMessage: 'Passwords don\'t match' },
});

class DeviceItem extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    location: PropTypes.string,
    activity: PropTypes.string,
    osVersion: PropTypes.string,
    onDisconnect: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDialog: false
    };
    autobind(this);
  }

  handleToggleDialog() {
    this.setState({ confirmDialog: !this.state.confirmDialog });
  }

  handleConfirmDisconnect(event) {
    this.setState({ confirmDialog: !this.state.confirmDialog });
    this.props.onDisconnect(event, this);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { id, title, location, activity, osVersion } = this.props;
    const styles = require('./General.less');
    const cx = classNames.bind(styles);

    //devices
    const isAndroid = osVersion.toLowerCase().indexOf('android') > -1;
    const isApple = title.toLowerCase().indexOf('ipad') > -1 || title.toLowerCase().indexOf('iphone') > -1;
    const isWindow = title.toLowerCase().indexOf('window') > -1 || osVersion.toLowerCase().indexOf('window') > -1;
    const unknowDevice = !isWindow && !isAndroid && !isApple;

    const classes = cx({
      deviceItem: true,
      'icon-none': unknowDevice,
      'icon-android': osVersion.toLowerCase().indexOf('android') > -1,
      'icon-apple': title.toLowerCase().indexOf('ipad') > -1 || title.toLowerCase().indexOf('iphone') > -1,
      'icon-window': title.toLowerCase().indexOf('window') > -1 || osVersion.toLowerCase().indexOf('window') > -1,
    });

    const disconnectClasses = cx({
      disconnect: true,
      'icon-close': true,
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={classes}>
        <h4 className={styles.deviceTitle}>{title}</h4>
        <span>{strings.location}: {location}</span>
        <span>{strings.lastActivity}: {activity}</span>
        <span>{strings.id}: {id}</span>
        <i className={disconnectClasses} onClick={this.handleToggleDialog} />

        {this.state.confirmDialog && <Dialog
          title={strings.confirmTitle}
          message={strings.confirmMessage}
          isVisible={this.state.confirmDialog}
          cancelText={strings.cancel}
          confirmText={strings.disconnect}
          onCancel={this.handleToggleDialog}
          onConfirm={this.handleConfirmDisconnect}
        />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { settings } = state;

  const languages = [];
  const timezones = [];

  // Format language list for drop down element
  for (const key of Object.keys(settings.languages)) {
    languages.push({ value: key, label: settings.languages[key] });
  }

  // Format timezone list for drop down element
  for (const key of Object.keys(settings.timezones)) {
    timezones.push({ value: key, label: settings.timezones[key] });
  }

  //Devices connected
  let devices = settings.devices.map(id => settings.devicesById[id]);
  devices = devices.filter(device => device.disconnected !== true);
  return {
    ...settings.user,
    devices: devices,
    userLoaded: settings.userLoaded,
    userLoading: settings.userLoading,
    userError: settings.userError,
    userPasswordUpdated: settings.userPasswordUpdated,
    userPasswordUpdating: settings.userPasswordUpdating,

    userSignatureUpdated: settings.userSignatureUpdated,
    userSignatureUpdating: settings.userSignatureUpdating,

    languages: languages,
    timezones: timezones,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    getNotifications,
    setNotifications,

    disconnectDevice,
    getUserGeneralSettings,
    setUserData,
    updatePassword,
  })
)
export default class General extends Component {
  static propTypes = {
    privateActivity: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),

    digestEmail: PropTypes.number,
    showSocial: PropTypes.string,
    signature: PropTypes.string,
    langCode: PropTypes.string,
    timezone: PropTypes.string,

    languages: PropTypes.array,
    timezones: PropTypes.array,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    privateActivity: 0,
    digestEmail: 0,
    showSocial: 'none',
    devices: []
  };

  constructor(props) {
    super(props);
    this.state = {
      showConnectedDevices: false,
      enableSavePassword: false,
      enableSaveSignature: false,
      signature: this.props.signature,
      passwordMsg: '',
    };
    autobind(this);

    // refs
    this.confirmPassword = null;
    this.currentPassword = null;
    this.newPassword = null;
  }

  UNSAFE_componentWillMount() {
    if (!this.props.userLoaded && !this.props.userLoading) {
      this.props.getUserGeneralSettings();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { userError, userPasswordUpdated, userSignatureUpdated } = nextProps;

    // Handle save errors
    if (userError && userError.message && userError.message !== this.props.userError.message) {
      this.props.createPrompt({
        id: uniqueId('settings-'),
        type: 'error',
        title: 'Save Error',
        message: userError.message,
        dismissible: true,
        autoDismiss: 10
      });
    }

    if (userPasswordUpdated && userPasswordUpdated !== this.props.userPasswordUpdated) {
      this.props.createPrompt({
        id: uniqueId('settings-saved'),
        type: 'info',
        title: 'Save successfully',
        message: 'New password saved!',
        dismissible: true,
        autoDismiss: 10
      });

      this.currentPassword.text.value = '';
      this.newPassword.text.value = '';
      this.confirmPassword.text.value = '';
    }

    if (userSignatureUpdated && userSignatureUpdated !== this.props.userSignatureUpdated) {
      this.props.createPrompt({
        id: uniqueId('settings-saved'),
        type: 'info',
        title: 'Save successfully',
        message: 'Signature updated!',
        dismissible: true,
        autoDismiss: 10
      });
    }
  }

  handlePrivateActivityChange(event) {
    this.props.setUserData('privateActivity', JSON.parse(event.currentTarget.value));
  }

  handleTimezoneChange(item) {
    this.props.setUserData('timezone', item.value);
  }

  handleLanguageChange(item) {
    this.props.setUserData('langCode', item.value);
  }

  handleDigestEmailChange(item) {
    this.props.setUserData('digestEmail', item.value);
  }

  handleSocialDataSharingChange(item) {
    this.props.setUserData('showSocial', item.value);
  }

  // Depends if the buttons are displayed
  handleToggleDeviceList() {
    this.setState({ 'showConnectedDevices': true });
  }

  handleDisconnectDevice(event, context) {
    this.props.disconnectDevice(context.props.id);
  }

  handlePasswordOnChange(e) {
    const { formatMessage } = this.context.intl;
    // Translations
    const strings = generateStrings(messages, formatMessage);

    if (this.newPassword.text.value !== this.confirmPassword.text.value) {
      if (e.currentTarget.name === 'confirmPassword' || (e.currentTarget.name === 'newPassword' && this.confirmPassword.text.value !== '')) {
        this.setState({
          enableSavePassword: false,
          passwordMsg: strings.passwordsDoNotMatch
        });
      } else {
        this.setState({
          enableSavePassword: false,
          passwordMsg: ''
        });
      }
    } else {
      this.setState({
        enableSavePassword: false,
        passwordMsg: ''
      });

      if (this.newPassword.text.value && this.confirmPassword.text.value && this.currentPassword.text.value) {
        this.setState({ 'enableSavePassword': true });
      }
    }
  }

  handleUpdatePasswordClick() {
    this.setState({ enableSavePassword: false });
    this.props.updatePassword(
      this.currentPassword.text.value,
      this.newPassword.text.value,
      this.confirmPassword.text.value
    );
  }

  handleOnSignatureChange(value) {
    this.setState({ signature: value, enableSaveSignature: true });
  }

  handleOnSignatureClick() {
    this.props.setUserData('signature', this.state.signature);
    this.setState({ enableSaveSignature: false });
  }

  handleFroalaInit() {
    // Adding id supports for NightWatch tests
    document.getElementById('editor-container').querySelector('iframe').setAttribute('id', 'FroalaEditorGeneral');
  }

  render() {
    const { formatMessage, locale } = this.context.intl;
    const { showConnectedDevices } = this.state;
    const {
      langCode,
      languages,
      timezone,
      timezones,
      privateActivity,
      digestEmail,
      showSocial,
      devices
    } = this.props;
    const styles = require('./General.less');
    const reset = require('../StoryEdit/editorReset.min.css.raw');

    // Loading indicator
    if (this.props.userLoading) {
      return <Loader type="page" />;
    }

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Customise Froala options
    const editorOptions = {
      //height: 300,
      language: locale,
      linkAlwaysBlank: true,
      linkAlwaysNoFollow: true,
      linkConvertEmailAddress: true,
      linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
      linkInsertButtons: ['linkBack'],
      linkList: [],
      linkStyles: {},
      tabSpaces: 4,
      toolbarButtons: ['bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'color', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'insertLink', 'insertTable', 'insertHR', 'clearFormatting', 'html'],
    };

    const digestEmailList = [
      { value: 0, label: strings.never },
      { value: 1, label: strings.daily },
      { value: 2, label: strings.weekly },
      { value: 3, label: strings.monthly },
    ];

    const socialSharingList = [
      { value: 'all', label: strings.everyone },
      { value: 'following', label: strings.usersImFollowing },
      { value: 'none', label: strings.noOne }
    ];

    return (
      <div className={styles.General}>
        <header className={styles.listHeader}>
          <div className={styles.titleWrap}>
            <Breadcrumbs
              paths={[{ 'name': strings.general, 'path': '/settings/general' }]}
              className={styles.listCrumbs}
            />
          </div>
        </header>

        <div className={styles.Wrapper}>
          <h3>{strings.privateActivityStream}</h3>
          <RadioGroup
            name="privateActivity"
            selectedValue={privateActivity}
            onChange={this.handlePrivateActivityChange}
            inlineInputs
            options={[{
              label: strings.enable,
              value: true
            }, {
              label: strings.disable,
              value: false
            }]}
          />

          <h3>{strings.language}</h3>
          <Select
            name="langCode"
            value={langCode}
            options={languages}
            onChange={this.handleLanguageChange}
            clearable={false}
            className={styles.select}
          />

          <h3>{strings.timeZone}</h3>
          <Select
            name="timezone"
            value={timezone}
            options={timezones}
            onChange={this.handleTimezoneChange}
            clearable={false}
            className={styles.select}
          />

          <h3>{strings.sendDigestEmail}</h3>
          <Select
            name="digestEmail"
            value={digestEmail}
            options={digestEmailList}
            onChange={this.handleDigestEmailChange}
            clearable={false}
            className={styles.select}
          />

          <h3>{strings.socialDataSharing}</h3>
          <Select
            name="showSocial"
            value={showSocial}
            options={socialSharingList}
            onChange={this.handleSocialDataSharingChange}
            clearable={false}
            className={styles.select}
          />

          {!!showConnectedDevices &&
            <Btn inverted className={styles.marginTop} onClick={this.handleToggleDeviceList}>{strings.connectedDevices}</Btn>
          }

          {!showConnectedDevices && <div>
            <h3 className={styles.marginTop}>
              {strings.connectedDevices} {devices.length === 0 && <span className={styles.deviceConnection}>({strings.noDevicesConnected})</span>}
            </h3>
            {devices.length > 0 && <ul className={styles.deviceList}>
              {devices.map((result, i) => (
                <li key={result.deviceLabel + i}>
                  <DeviceItem
                    title={result.deviceLabel}
                    location={result.location}
                    activity={result.lastActivityD}
                    id={result.deviceIdentifier}
                    osVersion={result.osVersion}
                    onDisconnect={this.handleDisconnectDevice}
                  />
                </li>
              ))}
            </ul>}
          </div>}

          {this.props.authType === 'db' && <div>
            <h3 className={styles.marginTop}>{strings.changePassword}</h3>
            <Text
              ref={(c) => { this.currentPassword = c; }}
              type="password"
              name="currentPassword"
              placeholder={strings.currentPassword}
              width="22rem"
              onChange={this.handlePasswordOnChange}
            />
            <Text
              ref={(c) => { this.newPassword = c; }}
              type="password"
              name="newPassword"
              placeholder={strings.newPassword}
              width="22rem"
              onChange={this.handlePasswordOnChange}
            />
            <Text
              ref={(c) => { this.confirmPassword = c; }}
              type="password"
              name="confirmPassword"
              placeholder={strings.confirmPassword}
              width="22rem"
              onChange={this.handlePasswordOnChange}
            />
            <Btn
              inverted
              loading={this.props.userPasswordUpdating}
              disabled={!this.state.enableSavePassword}
              onClick={this.handleUpdatePasswordClick}
            >
              {strings.updatePassword}
            </Btn>
            {this.state.passwordMsg && <span className={styles.error}>{this.state.passwordMsg}</span>}
          </div>}

          <div id="editor-container" className={styles.signatureEditor}>
            <h3 className={styles.marginTop}>{strings.signature}</h3>
            {this.props.userLoaded && <Editor
              id="signature"
              placeholder={strings.signature}
              defaultValue={this.props.signature}
              editorStyle={reset}
              froalaOptions={editorOptions}
              onChange={this.handleOnSignatureChange}
              onInit={this.handleFroalaInit}
            />}
            <Btn
              inverted
              disabled={!this.state.enableSaveSignature}
              className={styles.saveSignature}
              onClick={this.handleOnSignatureClick}
            >
              {strings.updateSignature}
            </Btn>
          </div>
        </div>
      </div>
    );
  }
}
