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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import AdminMetadataList from 'components/Admin/AdminUtils/AdminMetadataList/AdminMetadataList';
import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import GroupList from 'components/Admin/AdminUtils/GroupList/GroupList';
import Modal from 'components/Modal/Modal';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Select from 'components/Select/Select';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';
import TimezoneSelect from 'components/TimezoneSelect/TimezoneSelect';

const messages = defineMessages({
  sendInvitationEmail: { id: 'send-invitation-email', defaultMessage: 'Send invitation Email' },
  invited: { id: 'invited', defaultMessage: 'Invited' },
  yes: { id: 'yes', defaultMessage: 'Yes' },
  no: { id: 'no', defaultMessage: 'No' },
  createNewUser: { id: 'create-new-user', defaultMessage: 'Create new user' },
  editUser: { id: 'edit-user', defaultMessage: 'Edit user' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },
  delete: { id: 'delete', defaultMessage: 'Delete' },

  user: { id: 'user', defaultMessage: 'User' },
  structureAdministrator: { id: 'structure-administrator', defaultMessage: 'Structure administrator' },
  administrator: { id: 'administrator', defaultMessage: 'Administrator' },
  companyManager: { id: 'company-manager', defaultMessage: 'Company manager' },
  superUser: { id: 'super-user', defaultMessage: 'Super user' },

  forcePasswordChange: { id: 'force-password-change', defaultMessage: 'Force Password Change' },
  metadataAttributes: { id: 'metadata-attributes', defaultMessage: 'Metadata Attributes' },
  firstname: { id: 'first-name', defaultMessage: 'First Name' },
  lastname: { id: 'last-name', defaultMessage: 'Last Name' },
  email: { id: 'email', defaultMessage: 'Email' },
  langCode: { id: 'default-language', defaultMessage: 'Default Language' },
  role: { id: 'role', defaultMessage: 'Role' },
  configurationBundle: { id: 'configuration-bundle', defaultMessage: 'Configuration Bundle' },
  jobTitle: { id: 'job-title', defaultMessage: 'Job Title' },
  timeZone: { id: 'time-zone', defaultMessage: 'Time Zone' },
  password: { id: 'password', defaultMessage: 'Password' },
  confirmPassword: { id: 'confirm-password', defaultMessage: 'Confirm Password' },
  status: { id: 'status', defaultMessage: 'Status' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  storyPromoting: { id: 'story-promoting', defaultMessage: '{story} Promoting' },
  allow: { id: 'allow', defaultMessage: 'Allow' },
  deny: { id: 'deny', defaultMessage: 'Deny' },
  sendDigestEmail: { id: 'send-digest-email', defaultMessage: 'Send Digest Email' },
  platform: { id: 'platform', defaultMessage: 'Platform' },
  web: { id: 'web', defaultMessage: 'Web' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  noGroupsSelected: { id: 'no-groups-selected', defaultMessage: 'No Groups Selected' },
  reportingBi: { id: 'reporting-bi', defaultMessage: 'Reporting/BI' },
  enablePersonalReports: { id: 'personal-reports', defaultMessage: 'Personal Reports' },
  enableCompanyReports: { id: 'company-reports', defaultMessage: 'Company Reports' },
  enableAdvancedReports: { id: 'company-reports-with-private-data', defaultMessage: 'Company Reports with Private Data' },
  enableScheduledReports: { id: 'scheduled-reports', defaultMessage: 'Scheduled Reports' },

  lmsAdmin: { id: 'lms-admin', defaultMessage: 'LMS admin' },

  deviceStorageLimit: { id: 'device-storage-limit', defaultMessage: 'Device Storage Limit' },
  limitCacheSize: { id: 'limit-cache-size', defaultMessage: 'Limit Cache Size' },
  availableForBigtincanHub: { id: 'available-for-bigtincan-hub', defaultMessage: 'Available for Bigtincan Hub' }
});

/**
 * Create/Edit user Admin modal
 */
export default class AdminUserModal extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    langCode: PropTypes.string,
    roleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    jobTitle: PropTypes.string,
    tz: PropTypes.string,
    status: PropTypes.string,
    digestEmail: PropTypes.number,

    enablePersonalReports: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    enableCompanyReports: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    enableAdvancedReports: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    enableScheduledReports: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    lmsPermissions: PropTypes.number,

    /** All groups */
    groupList: PropTypes.array,
    /** Active or selected groups */
    groups: PropTypes.array,
    onGroupSearchChange: PropTypes.func,

    /** Configuration bundle selected */
    configurationBundle: PropTypes.number,
    storyPromoting: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),

    /** Object with the Platforms <code{ios: true, web: false, android: false, windows: true}></code>*/
    platform: PropTypes.object,

    /* When enabled only allows to change group field */
    limitedView: PropTypes.bool,

    languageList: PropTypes.object,
    configurationBundleList: PropTypes.array,
    roleOptions: PropTypes.array,
    statusOptions: PropTypes.array,
    digestEmailOptions: PropTypes.array,

    isVisible: PropTypes.bool,
    showDelete: PropTypes.bool,
    userDefaults: PropTypes.object,

    metadataAttributes: PropTypes.array,
    metadataListSelected: PropTypes.array,
    metadataValues: PropTypes.array,

    onDelete: function(props) {
      if (props.showDelete && typeof props.onDelete !== 'function') {
        return new Error('onDelete is required when showDelete is enabled');
      }
      return null;
    },

    onChange: function(props) {
      if (typeof props.onChange !== 'function') {
        return new Error('onChange is required');
      }
      return null;
    },

    onToggleIsAdministrator: PropTypes.func,
    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    firstname: '',
    lastname: '',
    email: '',
    jobTitle: '',
    newPassword: '',
    sendInvite: true,
    confirmPassword: '',
    enablePersonalReports: false,
    enableCompanyReports: false,
    enableAdvancedReports: false,
    enableScheduledReports: false,
    configurationBundleList: [],
    platform: {
      ios: false,
      android: false,
      web: false,
      windows: false
    },
    metadataAttributes: [],
    metadataListSelected: [],
    roleId: 0,
    lmsPermissions: 0
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (!this.props.configurationBundle) {
      const configBundle = this.props.configurationBundleList.find(obj => obj.name === 'Standard Privileges');
      this.props.onChange({
        key: 'configurationBundle',
        value: configBundle.id
      });
    }
  }

  handleInputChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.value
    });
  }

  handleLanguageChange(context) {
    this.props.onChange({
      key: 'langCode',
      value: context.id
    });
  }

  handleRoleChange(context) {
    this.props.onChange({
      key: 'roleId',
      value: context.id
    });
  }

  handleTzChange(context) {
    this.props.onChange({
      key: 'tz',
      value: context
    });
  }

  handleStatusChange(context) {
    this.props.onChange({
      key: 'status',
      value: context.id
    });
  }

  handleConfigurationBundleChange(context) {
    this.props.onChange({
      key: 'configurationBundle',
      value: context.id
    });
  }

  handleSendDigestEmailChange(context) {
    this.props.onChange({
      key: 'digestEmail',
      value: context.id
    });
  }

  handleTextAreaChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.value
    });
  }

  handleRadioChange(event) {
    this.props.onChange({
      key: 'storyPromoting',
      value: JSON.parse(event.currentTarget.value)
    });
  }

  handleInviteChange(event) {
    this.props.onChange({
      key: 'sendInvite',
      value: JSON.parse(event.currentTarget.value)
    });
  }

  handlePlatformChange(event) {
    this.props.onChange({
      key: 'platform',
      type: event.currentTarget.value,
      value: event.currentTarget.checked
    });
  }

  handleCheckboxChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.checked
    });
  }

  handleLmsAdminChange(event) {
    this.props.onChange({
      key: event.currentTarget.name,
      value: event.currentTarget.checked ? 1 : 0
    });
  }

  handleSave(e) {
    if (typeof this.props.onSave === 'function') {
      this.props.onSave(e, this.props);
    }
  }

  handleDelete(e) {
    if (typeof this.props.onDelete === 'function') {
      this.props.onDelete(e, this.props);
    }
  }

  handleToggleIsAdministrator(e) {
    if (typeof this.props.onToggleIsAdministrator === 'function') {
      this.props.onToggleIsAdministrator(e, this.props);
    }
  }

  // Metadata functions
  handleAddMetadata(data) {
    const item = this.props.metadataValues.find((obj) => obj.id === data.id);
    const list = [...this.props.metadataListSelected, item];

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        key: 'metadata',
        value: list
      });
    }
  }

  handleRemoveMetadata(event, context) {
    const list = this.props.metadataListSelected.filter((obj) => obj.id !== context.valueSelected.id);
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        key: 'metadata',
        value: list
      });
    }
  }

  handleChangeMetadata(nextValue, prevValue) {
    const list = [...this.props.metadataListSelected];
    const item = list.find((obj) => obj.id === prevValue.id);
    item.id = nextValue.id;
    item.attributeValue = nextValue.attributeValue;

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        key: 'metadata',
        value: [...list]
      });
    }
  }

  handleDeviceStorageLimitChange(event) {
    const value = event.currentTarget.value === '' ? '' : parseFloat(event.currentTarget.value);
    this.props.onChange({
      key: event.currentTarget.name,
      value
    });
    this.props.onHandleUserLimitCacheValueChange(value);
    this.props.onHandleToggleUserLimitCacheValueManualChange();
  }

  handleBlur() {
    this.props.onHandleBlur(this.props.userLimitCacheSizeValue, 'userLimitCacheSizeValue');
  }

  render() {
    const { naming, user, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const {
      id,
      firstname,
      lastname,
      email,
      langCode,
      roleId,
      jobTitle,
      tz,
      configurationBundle,
      status,
      storyPromoting,
      configurationBundleList,
      digestEmailOptions,
      languageList,
      isVisible,
      statusOptions,
      limitedView,
      showDelete,

      groups,
      groupList,
      onAddGroupItem,
      onRemoveGroupItem,
      onGroupSearchChange,

      userLimitCacheSizeCheckbox,
      userLimitCacheSizeValue
    } = this.props;
    const styles = require('./AdminUserModal.less');
    const strings = generateStrings(messages, formatMessage, naming);

    const headerTitle = id ? strings.editUser : strings.createNewUser;
    const saveButton = id ? strings.save : strings.create;
    const inputWidth = '16.5rem';
    const fullFlexClass = limitedView ? styles.fullFlex : null;

    const languages = Object.keys(languageList).map((k) => ({
      id: k,
      name: languageList[k]
    }));

    const promotingOptions = [
      { value: true, label: strings.allow },
      { value: false, label: strings.deny }
    ];

    const inviteOptions = [
      { value: true, label: strings.yes },
      { value: false, label: strings.no }
    ];

    let roles = [
      { id: 0, name: strings.user },
      { id: 2, name: strings.structureAdministrator },
      { id: 4, name: strings.administrator },
      { id: 7, name: strings.companyManager },
      { id: 10, name: strings.superUser }
    ];

    // Filter available roles based on current admin's roleId
    const adminRoleId = user ? user.roleId : 0;

    // Disable role select if user roleId is higher than current adminRoleId
    const selectRoleDisabled = roleId > adminRoleId || id === user ? user.id : 0;

    // Do not show roles higher than current admin roleId
    if (!selectRoleDisabled || !id) {
      roles = roles.filter(role => role.id <= adminRoleId);
    }

    // Conditionally apply status options
    const tmpStatus = [...statusOptions];

    // Invited User
    if (status === 'invited' || !id) {
      tmpStatus.unshift({ id: 'invited', name: strings.invited });
    }

    // Existing User
    if (this.props.authType === 'db' && id) {
      tmpStatus.push({ id: 'renew_password', name: strings.forcePasswordChange });
    }
    const isLmsEnable = userCapabilities && !!userCapabilities.hasLmsEnabled;

    return (
      <Modal
        isVisible={isVisible}
        headerChildren={
          <span>
            <span className={styles.headerTitle}>{headerTitle}</span>
            {showDelete && <Btn
              warning
              className={styles.deleteBtn}
              onClick={this.handleDelete}
              loading={this.props.loading}
            >
              {strings.delete}
            </Btn>}
          </span>
        }
        escClosesModal
        width="large"
        footerChildren={(<div>
          <Btn
            alt large onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.handleSave}
            loading={this.props.loading} style={{ marginLeft: '0.5rem' }}
          >{saveButton}</Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div className={fullFlexClass}>
          {!limitedView && <div>
            <Text
              id="firstname"
              name="firstname"
              inline
              width={inputWidth}
              label={strings.firstname}
              value={firstname}
              className={styles.inputClass}
              onChange={this.handleInputChange}
            />

            <Text
              id="lastname"
              name="lastname"
              inline
              width={inputWidth}
              label={strings.lastname}
              value={lastname}
              className={styles.inputClass}
              onChange={this.handleInputChange}
            />

            <Textarea
              id="jobTitle"
              name="jobTitle"
              label={strings.jobTitle}
              value={jobTitle}
              className={styles.inputClass}
              onChange={this.handleTextAreaChange}
            />

            <Text
              id="email"
              name="email"
              inline
              width={inputWidth}
              label={strings.email}
              value={email}
              className={styles.inputClass}
              onChange={this.handleInputChange}
            />

            <div className={styles.selectWrapper}>
              <label htmlFor="langCode">{strings.langCode}</label>
              <Select
                name="langCode"
                value={{ id: langCode, name: languageList[langCode] }}
                clearable={false}
                options={languages}
                onChange={this.handleLanguageChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className={styles.selectWrapper}>
              <label htmlFor="tz">{strings.timeZone}</label>
              <TimezoneSelect
                name="tz"
                value={tz}
                onChange={this.handleTzChange}
                className={styles.select}
              />
            </div>
            <div className={styles.selectWrapper}>
              <label htmlFor="roleId">{strings.role}</label>
              <Select
                name="roleId"
                value={roles.find((obj) => obj.id === roleId)}
                clearable={false}
                disabled={!!selectRoleDisabled}
                options={roles}
                onChange={this.handleRoleChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />
            </div>
            <div className={styles.selectWrapper}>
              <label htmlFor="status">{strings.status}</label>
              <Select
                name="status"
                value={tmpStatus.find((obj) => obj.id === status) || tmpStatus[0]}
                clearable={false}
                options={tmpStatus}
                onChange={this.handleStatusChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />
            </div>
          </div>}
          <div className={styles.selectWrapper}>
            <label>{strings.groups}</label>
            <GroupList
              className={styles.groupList}
              style={{ maxWidth: limitedView ? '80%' : null }}
              activeGroups={groups}
              all={groupList}

              showAdministratorCheckbox
              onAdministratorCheckboxClick={this.handleToggleIsAdministrator}

              onAddGroupItem={onAddGroupItem}
              onRemoveGroupItem={onRemoveGroupItem}
              onSearchInputChange={onGroupSearchChange}
              onScroll={this.props.onScroll}
              noResultsInSearchPlaceholder={strings.noGroupsSelected}
            />
          </div>
        </div>

        {/* Second column */}
        <div>
          {!limitedView && <div>
            <div className={styles.selectWrapper}>
              <label htmlFor="status">{strings.configurationBundle}</label>
              <Select
                name="configurationBundle"
                value={configurationBundleList.find((obj) => obj.id === configurationBundle)}
                clearable={false}
                options={configurationBundleList}
                onChange={this.handleConfigurationBundleChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />
            </div>

            <RadioGroup
              name="storyPromoting"
              inlineLegend
              legend={strings.storyPromoting}
              selectedValue={storyPromoting}
              onChange={this.handleRadioChange}
              inline
              options={promotingOptions}
              className={styles.radioWrap}
            />

            {!id && <RadioGroup
              name="sendInvite"
              inlineLegend
              legend={strings.sendInvitationEmail}
              selectedValue={!!this.props.sendInvite}
              onChange={this.handleInviteChange}
              inline
              options={inviteOptions}
              className={styles.radioWrap}
            />}

            <div className={styles.selectWrapper}>
              <label>{strings.reportingBi}</label>

              <div className={styles.checkboxGroupWrap}>
                <Checkbox
                  label={strings.enablePersonalReports}
                  name="enablePersonalReports"
                  value={1}
                  checked={!!this.props.enablePersonalReports}
                  onChange={this.handleCheckboxChange}
                />

                <Checkbox
                  label={strings.enableCompanyReports}
                  name="enableCompanyReports"
                  value={1}
                  checked={!!this.props.enableCompanyReports}
                  onChange={this.handleCheckboxChange}
                />

                <Checkbox
                  label={strings.enableAdvancedReports}
                  name="enableAdvancedReports"
                  value={1}
                  checked={!!this.props.enableAdvancedReports}
                  style={{ marginLeft: '1.2rem' }}
                  onChange={this.handleCheckboxChange}
                />

                <Checkbox
                  label={strings.enableScheduledReports}
                  name="enableScheduledReports"
                  value={1}
                  checked={!!this.props.enableScheduledReports}
                  style={{ marginLeft: '1.2rem' }}
                  onChange={this.handleCheckboxChange}
                />
              </div>

              <div className={styles.flexPadding} />
            </div>
            { isLmsEnable &&
            <div className={styles.selectWrapper}>
              <label>{strings.lmsAdmin}</label>

              <div className={styles.checkboxGroupWrap}>
                <Checkbox
                  label={strings.lmsAdmin}
                  name="lmsPermissions"
                  value={1}
                  checked={this.props.lmsPermissions === 1}
                  onChange={this.handleLmsAdminChange}
                />
              </div>

              <div className={styles.flexPadding} />
            </div>
            }

            <div className={styles.selectWrapper}>
              <label htmlFor="digestEmail">{strings.sendDigestEmail}</label>
              <Select
                name="digestEmail"
                value={digestEmailOptions.find((obj) => obj.id === this.props.digestEmail)}
                clearable={false}
                options={digestEmailOptions}
                onChange={this.handleSendDigestEmailChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />
            </div>

            <div className={styles.selectWrapper}>
              <label>{strings.platform}</label>

              <div className={styles.checkboxGroupWrap}>
                <Checkbox
                  label="iOS"
                  name="platform"
                  value="ios"
                  checked={!!this.props.platform.ios}
                  onChange={this.handlePlatformChange}
                />

                <Checkbox
                  label="Android"
                  name="platform"
                  value="android"
                  checked={!!this.props.platform.android}
                  onChange={this.handlePlatformChange}
                />

                <Checkbox
                  label={strings.web}
                  name="platform"
                  value="web"
                  checked={!!this.props.platform.web}
                  onChange={this.handlePlatformChange}
                />

                <Checkbox
                  label="Windows"
                  name="platform"
                  value="windows"
                  checked={!!this.props.platform.windows}
                  onChange={this.handlePlatformChange}
                />
              </div>
            </div>

            <div className={styles.selectWrapper}>
              <label>{strings.deviceStorageLimit}</label>
              <div className={styles.checkboxGroupWrap} style={{ height: '7.5rem' }}>
                <Checkbox
                  label={strings.limitCacheSize}
                  name="deviceCacheLimit"
                  value={this.props.userLimitCacheSizeCheckbox}
                  checked={userLimitCacheSizeCheckbox}
                  onChange={this.props.onHandleUserToggleLimitCacheSize}
                />
                {userLimitCacheSizeCheckbox && <p>{strings.availableForBigtincanHub}</p>}
                {userLimitCacheSizeCheckbox && <Text
                  id="deviceCacheLimit"
                  name="deviceCacheLimit"
                  inline
                  width="4.5rem"
                  type="number"
                  value={userLimitCacheSizeValue}
                  onChange={this.handleDeviceStorageLimitChange}
                  onBlur={this.handleBlur}
                />}
                {userLimitCacheSizeCheckbox && <span className={styles.textInlineLabel}>GB</span>}
              </div>
            </div>

            {(this.props.authType === 'db' || !id) && <div>
              <Text
                id="newPassword"
                name="newPassword"
                inline
                type="password"
                width={inputWidth}
                label={strings.password}
                value={this.props.newPassword}
                className={styles.inputClass}
                onChange={this.handleTextAreaChange}
              />

              <Text
                id="confirmPassword"
                name="confirmPassword"
                inline
                type="password"
                width={inputWidth}
                label={strings.confirmPassword}
                value={this.props.confirmPassword}
                className={styles.inputClass}
                onChange={this.handleTextAreaChange}
              />
            </div>}

            <div className={styles.metadataWrap}>
              <span className={styles.metadataLabel}>{strings.metadataAttributes}</span>
              <AdminMetadataList
                attributeList={this.props.metadataAttributes}
                valuesSelectedList={this.props.metadataListSelected}
                loaded
                loading={false}
                onAdd={this.handleAddMetadata}
                onDelete={this.handleRemoveMetadata}
                onChange={this.handleChangeMetadata}
                listClassName={styles.metadataList}
              />
            </div>

            <div className={styles.flexPadding} />
            </div>
          }

        </div>
      </Modal>
    );
  }
}
