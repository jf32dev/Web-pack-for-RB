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

import Checkbox from 'components/Checkbox/Checkbox';
import FileItem from 'components/FileItem/FileItem';
import GroupList from 'components/Admin/AdminUtils/GroupList/GroupList';
import Select from 'components/Select/Select';
import Text from 'components/Text/Text';
import AdminMetadataList from 'components/Admin/AdminUtils/AdminMetadataList/AdminMetadataList';
// Timezone list
const timezones = require('components/TimezoneSelect/timezones.json');

const tzOptions = Object.keys(timezones).map(k => ({ id: k, name: timezones[k] }));

import { CSSTransition, TransitionGroup } from 'react-transition-group';

const messages = defineMessages({
  bulkEditUserSettings: { id: 'bulk-edit-user-settings', defaultMessage: 'Bulk Edit User Settings' },
  existingUsers: { id: 'existing-users', defaultMessage: 'Existing Users' },
  defaultLanguage: { id: 'default-language', defaultMessage: 'Default Language' },
  sendInvititationEmail: { id: 'send-invititation-email', defaultMessage: 'Send invititation Email' },
  existingUsersGroups: { id: 'existing-users-groups', defaultMessage: 'Existing users groups' },
  existingUsersPasswords: { id: 'existing-users-password', defaultMessage: 'Existing users password' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  password: { id: 'password', defaultMessage: 'Password' },
  newPassword: { id: 'new-password', defaultMessage: 'New password' },
  confirmPassword: { id: 'confirm-password', defaultMessage: 'Confirm password' },
  configurationBundle: { id: 'configuration-bundle', defaultMessage: 'Configuration Bundle' },
  platform: { id: 'platform', defaultMessage: 'Platform' },
  web: { id: 'web', defaultMessage: 'Web' },
  windows: { id: 'windows', defaultMessage: 'Windows' },
  role: { id: 'role', defaultMessage: 'Role' },
  sendDigestEmail: { id: 'send-digest-email', defaultMessage: 'Send digest email' },
  timezone: { id: 'timezone', defaultMessage: 'Timezone' },

  never: { id: 'never', defaultMessage: 'Never' },
  daily: { id: 'daily', defaultMessage: 'Daily' },
  weekly: { id: 'weekly', defaultMessage: 'Weekly' },
  monthly: { id: 'monthly', defaultMessage: 'Monthly' },

  user: { id: 'user', defaultMessage: 'User' },
  structureAdministrator: { id: 'structure-administrator', defaultMessage: 'Structure Administrator' },
  administrator: { id: 'administrator', defaultMessage: 'Administrator' },
  skip: { id: 'skip', defaultMessage: 'Skip' },
  update: { id: 'update', defaultMessage: 'Update' },
  append: { id: 'append', defaultMessage: 'Append' },
  overwrite: { id: 'overwrite', defaultMessage: 'Overwrite' },
  importFromCsv: { id: 'import-from-csv', defaultMessage: 'Import from Csv' },
  setDefault: { id: 'set-default', defaultMessage: 'Set default' },
  setHere: { id: 'set-here', defaultMessage: 'Set here' },
  personalReports: { id: 'personal-reports', defaultMessage: 'Personal reports' },
  enable: { id: 'enable', defaultMessage: 'Enable' },

  metadataAttributes: { id: 'metadata-attributes', defaultMessage: 'Metadata Attributes' },
});

export default class BulkUploadForm extends PureComponent {
  static propTypes = {
    fileName: PropTypes.string,
    existingUsers: PropTypes.string,
    defaultLanguage: PropTypes.string,
    group: PropTypes.string,
    platformToggle: PropTypes.string,
    platform: PropTypes.object,
    currentUserRole: PropTypes.number,
    role: PropTypes.string,
    timezone: PropTypes.string,
    sendDigestEmail: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    languageList: PropTypes.object,
    groupList: PropTypes.array,
    configurationBundleList: PropTypes.array,

    loading: PropTypes.bool,
    isVisible: PropTypes.bool,
    showDelete: PropTypes.bool,
    isUploading: PropTypes.bool,

    onClose: PropTypes.func,
    onFileDropAccepted: PropTypes.func,
    onFileDropRejected: PropTypes.func,
    onSampleCsvClick: PropTypes.func,
    onSampleDeleteCsvClick: PropTypes.func,
    onAllUsersCsvClick: PropTypes.func,

    // GroupList functions
    onAddGroupItem: PropTypes.func,
    onRemoveGroupItem: PropTypes.func,
    onGroupSearchChange: PropTypes.func,
    onGroupScroll: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    existingUsers: 'skip',
    existingUsersGroups: 'skip',
    existingUsersPasswords: 'skip',
    defaultLanguage: 'from_csv',
    group: 'from_csv',
    sendInvite: false,
    setPassword: 'from_csv',
    groupList: [],
    configurationBundle: 'from_csv',
    configurationBundleList: [],
    platformToggle: 'from_csv',
    platform: {
      ios: false,
      android: false,
      web: false,
      windows: false
    },
    personalReportsToggle: 'from_csv',
    personalReports: {
      enable: false,
    },
    role: 'user',
    sendDigestEmail: 'from_csv',
    timezone: 'from_csv',
    metadataAttributes: [],
    metadataListSelected: [],
    newPassword: '',
    confirmPassword: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      hideOverflowClass: false,
      defaultLanguage: props.defaultLanguage,
      existingUsers: props.existingUsers,
      existingUsersGroups: props.existingUsersGroups,
      existingUsersPasswords: props.existingUsersPasswords,
      sendInvite: props.sendInvite,
      setPassword: props.setPassword,
      configurationBundle: props.configurationBundle,
      platformToggle: props.platformToggle,
      platform: props.platform,
      personalReports: props.personalReports,
      personalReportsToggle: props.personalReportsToggle,
      role: props.role,
      sendDigestEmail: props.sendDigestEmail,
      timezone: props.timezone,
      groupSelectedList: props.groupSelectedList || [],
    };

    this.form = null;
    autobind(this);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Removing overflow class on toggle dropdown options
    if (nextState.existingUsers === 'update') {
      this.timer = setTimeout(() => {
        this.setState({ hideOverflowClass: true });
      }, 200);
    } else if (nextState.existingUsers === 'skip') {
      this.setState({ hideOverflowClass: false }); // eslint-disable-line
    }

    if (nextState.sendInvite) {
      this.timer = setTimeout(() => {
        this.setState({ passwordHideOverflowClass: false });
      }, 200);
    } else {
      this.setState({ passwordHideOverflowClass: true }); // eslint-disable-line
    }
  }

  handleCheckboxChange(event) {
    const data = {};
    data[event.currentTarget.name] = event.currentTarget.checked;
    this.setState(data);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data);
    }
  }

  handlePlatformToggleChange(context) {
    this.setState({
      platformToggle: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ platformToggle: context.id });
    }
  }

  handlePlatformCheckboxChange(event) {
    const data = { platform: this.state.platform };
    data.platform[event.currentTarget.name] = event.currentTarget.checked;
    this.setState({
      toggle: !this.state.toggle,
      ...data
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data);
    }
  }

  handleLanguageChange(context) {
    this.setState({
      defaultLanguage: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ defaultLanguage: context.id });
    }
  }

  handleExistingUsersChange(context) {
    this.setState({
      existingUsers: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ existingUsers: context.id });
    }
  }

  handleExistingUsersGroupChange(context) {
    this.setState({
      existingUsersGroups: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ existingUsersGroups: context.id });
    }
  }

  handleConfigurationBundleChange(context) {
    this.setState({
      configurationBundle: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ configurationBundle: context.id });
    }
  }

  handleDigestEmailChange(context) {
    this.setState({
      sendDigestEmail: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ sendDigestEmail: context.id });
    }
  }

  handleRoleChange(context) {
    this.setState({
      role: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ role: context.id });
    }
  }

  handleTzChange(context) {
    this.setState({
      timezone: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ timezone: context.id });
    }
  }

  handleExistingUsersPasswordsChange(context) {
    this.setState({
      existingUsersPasswords: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ existingUsersPasswords: context.id });
    }
  }

  handleSetPasswordChange(context) {
    this.setState({
      setPassword: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ setPassword: context.id });
    }
  }

  handleGroupChange(context) {
    this.setState({
      group: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ group: context.id });
    }
  }

  // Metadata functions
  handleAddMetadata(data) {
    const item = this.props.metadataValues.find((obj) => obj.id === data.id);
    const list = [...this.props.metadataListSelected, item];

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        metadataListSelected: list
      });
    }
  }

  handleRemoveMetadata(event, context) {
    const list = this.props.metadataListSelected.filter((obj) => obj.id !== context.valueSelected.id);
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        metadataListSelected: list
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
        metadataListSelected: [...list]
      });
    }
  }

  handlePersonalReportsCheckboxChange(event) {
    this.setState({
      personalReports: {
        [event.currentTarget.name]: event.currentTarget.checked
      }
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        personalReports: {
          [event.currentTarget.name]: event.currentTarget.checked
        }
      });
    }
  }

  handlePersonalReportsToggleChange(context) {
    this.setState({
      personalReportsToggle: context.id
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ personalReportsToggle: context.id });
    }
  }

  /*
  * GroupList Method
  */
  handleAddUserGroup(id) {
    const { groupList } = this.props;
    const item = Object.assign({}, groupList.find(obj => obj.id === Number(id)));

    if (item) item.isSelected = true;
    const groupSelectedList = [...this.state.groupSelectedList, item];

    this.setState({
      groupSelectedList,
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ group: groupSelectedList });
    }
  }

  handleRemoveUserGroup(id) {
    const { groupList } = this.props; // User groups selected
    const item = Object.assign({}, groupList.find((obj) => obj.id === id));
    if (item) {
      item.isSelected = false;
    }
    const groupSelectedList = this.state.groupSelectedList.filter(obj => Number(obj.id) !== Number(id)); // Un-select group

    this.setState({
      groupSelectedList
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ group: groupSelectedList });
    }
  }

  handleScrollItoView() {
    this.timer = window.setTimeout(() => {
      window.clearTimeout(this.timer);
      this.timer = undefined;
      this.form.scrollTop = this.form.scrollHeight;
    }, 100);
  }

  handleTextAreaChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({ [e.currentTarget.id]: e.currentTarget.value });
    }
  }

  render() {
    const {
      currentUserRole,
      fileName,
      groupList,
      languageList,
      configurationBundleList,
    } = this.props;
    const styles = require('./BulkUploadForm.less');

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const inputWidth = '16.5rem';

    const file = {
      id: 0,
      description: fileName,
      category: 'csv'
    };

    // Dropdown list options
    const languages = Object.keys(languageList).map((k) => ({
      id: k,
      name: languageList[k]
    }));

    const roleList = [
      { id: 'user', name: strings.user }
    ];
    if (currentUserRole >= 2) roleList.push({ id: 'structure-administrator', name: strings.structureAdministrator });
    if (currentUserRole >= 4) roleList.push({ id: 'administrator', name: strings.administrator });

    const skipUpdateOptions = [
      { id: 'skip', name: strings.skip },
      { id: 'update', name: strings.update }
    ];

    const importCsvOrDefaultOptions = [
      { id: 'from_csv', name: strings.importFromCsv },
      { id: 'from_default', name: strings.setDefault },
    ];

    const importCsvOrSetHereOptions = [
      { id: 'from_csv', name: strings.importFromCsv },
      { id: 'from_form', name: strings.setHere },
    ];

    const importCsvDefaultOrFormOptions = [
      { id: 'from_csv', name: strings.importFromCsv },
      { id: 'from_default', name: strings.setDefault },
      { id: 'from_form', name: strings.setHere },
    ];

    const existingUsersGroupsOptions = [
      { id: 'skip', name: strings.skip },
      { id: 'append', name: strings.append },
      { id: 'overwrite', name: strings.overwrite }
    ];

    const digestEmailOptions = [
      { id: 0, name: strings.never },
      { id: 1, name: strings.daily },
      { id: 2, name: strings.weekly },
      { id: 3, name: strings.monthly },
    ];

    // Group actives
    const groupSelectedListTmp = this.state.groupSelectedList.map(item => ({
      ...item,
      isActive: false,
    }));

    return (
      <div className={styles.contentWrap} ref={(el) => { this.form = el; }}>
        <FileItem
          thumbSize="medium"
          grid
          className={styles.fileItem}
          {...file}
        />
        <div className={styles.formWrapper}>
          <h5>{strings.bulkEditUserSettings}</h5>

          <Select
            id="existingUsers"
            name="existingUsers"
            label={strings.existingUsers}
            value={this.state.existingUsers}
            options={skipUpdateOptions}
            searchable={false}
            clearable={false}

            onChange={this.handleExistingUsersChange}
            className={styles.selectWrap}
            valueKey="id"
            labelKey="name"
          />

          <TransitionGroup component="span">
            {this.state.existingUsers === 'update' && <CSSTransition
              classNames={{
                appear: styles['slide-appear'],
                appearActive: styles['slide-appear-active'],
                enter: styles['slide-enter'],
                enterActive: styles['slide-enter-active'],
                exit: styles['slide-exit'],
                exitActive: styles['slide-exit-active']
              }}
              timeout={{
                enter: 600,
                exit: 180
              }}
              appear
            >
              <div
                style={{
                  overflow: this.state.hideOverflowClass ? 'initial' : 'hidden'
                }}
              >
                <Select
                  id="existingUsersGroups"
                  name="existingUsersGroups"
                  label={strings.existingUsersGroups}
                  value={this.state.existingUsersGroups}
                  options={existingUsersGroupsOptions}
                  searchable={false}
                  clearable={false}

                  onChange={this.handleExistingUsersGroupChange}
                  className={styles.selectWrap}

                  valueKey="id"
                  labelKey="name"
                />

                <Select
                  id="existingUsersPasswords"
                  name="existingUsersPasswords"
                  label={strings.existingUsersPasswords}
                  value={this.state.existingUsersPasswords}
                  options={skipUpdateOptions}
                  searchable={false}
                  clearable={false}

                  onChange={this.handleExistingUsersPasswordsChange}
                  className={styles.selectWrap}

                  valueKey="id"
                  labelKey="name"
                />
              </div>
            </CSSTransition>}
          </TransitionGroup>

          <div className={styles.selectWrap}>
            <label>{strings.sendInvititationEmail}</label>
            <Checkbox
              inline
              name="sendInvite"
              value="sendInvite"
              checked={!!this.state.sendInvite}
              onChange={this.handleCheckboxChange}
              className={styles.checkboxInput}
            />
          </div>

          <TransitionGroup component="span">
            {!this.state.sendInvite && <CSSTransition
              classNames={{
                appear: styles['slide-appear'],
                appearActive: styles['slide-appear-active'],
                enter: styles['slide-enter'],
                enterActive: styles['slide-enter-active'],
                exit: styles['slide-exit'],
                exitActive: styles['slide-exit-active']
              }}
              timeout={{
                enter: 150,
                exit: 180
              }}
              appear
            >
              <div
                style={{
                  marginTop: 0,
                  overflow: this.state.passwordHideOverflowClass ? 'initial' : 'hidden'
                }}
              >
                <Select
                  id="setPassword"
                  name="setPassword"
                  label={strings.password}
                  value={this.state.setPassword}
                  options={importCsvOrSetHereOptions}
                  searchable={false}
                  clearable={false}

                  onChange={this.handleSetPasswordChange}
                  className={styles.selectWrap}

                  valueKey="id"
                  labelKey="name"
                />

                <TransitionGroup component="span">
                  {this.state.setPassword === 'from_form' && <CSSTransition
                    classNames={{
                      appear: styles['slide-appear'],
                      appearActive: styles['slide-appear-active'],
                      enter: styles['slide-enter'],
                      enterActive: styles['slide-enter-active'],
                      exit: styles['slide-exit'],
                      exitActive: styles['slide-exit-active']
                    }}
                    timeout={{
                      enter: 150,
                      exit: 180
                    }}
                    appear
                  >
                    <div
                      className={styles.passwordWrap}
                      style={{
                        overflow: this.state.setPassword === 'from_form' ? 'initial' : 'hidden'
                      }}
                    >
                      <Text
                        id="newPassword"
                        name="newPassword"
                        inline
                        type="password"
                        width={inputWidth}
                        label={strings.newPassword}
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
                    </div>
                  </CSSTransition>}
                </TransitionGroup>

              </div>
            </CSSTransition>}
          </TransitionGroup>

          <Select
            id="defaultLanguage"
            name="defaultLanguage"
            label={strings.defaultLanguage}
            value={this.state.defaultLanguage}
            options={[
              ...importCsvOrDefaultOptions,
              ...languages
            ]}
            searchable={false}
            clearable={false}

            onChange={this.handleLanguageChange}
            className={styles.selectWrap}

            valueKey="id"
            labelKey="name"
          />

          <Select
            id="groups"
            name="groups"
            label={strings.groups}
            value={this.state.group}
            options={importCsvOrSetHereOptions}
            searchable={false}
            clearable={false}

            onChange={this.handleGroupChange}
            className={styles.selectWrap}
            valueKey="id"
            labelKey="name"
          />

          <TransitionGroup component="span">
            {this.state.group === 'from_form' && <CSSTransition
              classNames={{
                appear: styles['slide-appear'],
                appearActive: styles['slide-appear-active'],
                enter: styles['slide-enter'],
                enterActive: styles['slide-enter-active'],
                exit: styles['slide-exit'],
                exitActive: styles['slide-exit-active']
              }}
              timeout={{
                enter: 150,
                exit: 180
              }}
              appear
            >
              <div>
                <div className={styles.selectWrapper}>
                  <GroupList
                    className={styles.groupList}
                    all={groupList}
                    activeGroups={groupSelectedListTmp}

                    onAddGroupItem={this.handleAddUserGroup}
                    onRemoveGroupItem={this.handleRemoveUserGroup}
                    onSearchInputChange={this.props.onGroupSearchChange}
                    onScroll={this.props.onGroupScroll}
                    noResultsInSearchPlaceholder={strings.noGroupsSelected}
                  />
                </div>
              </div>
            </CSSTransition>}
          </TransitionGroup>
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
          <Select
            id="configurationBundle"
            name="configurationBundle"
            label={strings.configurationBundle}
            value={this.state.configurationBundle}
            options={[
              ...importCsvOrDefaultOptions,
              ...configurationBundleList
            ]}
            searchable={false}
            clearable={false}

            onChange={this.handleConfigurationBundleChange}
            className={styles.selectWrap}

            valueKey="id"
            labelKey="name"
          />

          <Select
            id="platformToggle"
            name="platformToggle"
            label={strings.platform}
            value={this.state.platformToggle}
            options={[
              ...importCsvDefaultOrFormOptions,
            ]}
            searchable={false}
            clearable={false}

            onChange={this.handlePlatformToggleChange}
            className={styles.selectWrap}

            valueKey="id"
            labelKey="name"
          />

          <TransitionGroup component="span">
            {this.state.platformToggle === 'from_form' && <CSSTransition
              classNames={{
                appear: styles['slide-appear'],
                appearActive: styles['slide-appear-active'],
                enter: styles['slide-enter'],
                enterActive: styles['slide-enter-active'],
                exit: styles['slide-exit'],
                exitActive: styles['slide-exit-active']
              }}
              timeout={{
                enter: 150,
                exit: 180
              }}
              appear
            >
              <div className={styles.platformWrap}>
                <Checkbox
                  inline
                  label="iOS"
                  name="ios"
                  value="ios"
                  checked={!!this.state.platform.ios}
                  onChange={this.handlePlatformCheckboxChange}
                  className={styles.checkboxInput}
                />

                <Checkbox
                  inline
                  label="Android"
                  name="android"
                  value="android"
                  checked={!!this.state.platform.android}
                  onChange={this.handlePlatformCheckboxChange}
                  className={styles.checkboxInput}
                />

                <Checkbox
                  inline
                  label={strings.web}
                  name="web"
                  value="web"
                  checked={!!this.state.platform.web}
                  onChange={this.handlePlatformCheckboxChange}
                  className={styles.checkboxInput}
                />

                <Checkbox
                  inline
                  label={strings.windows}
                  name="windows"
                  value="windows"
                  checked={!!this.state.platform.windows}
                  onChange={this.handlePlatformCheckboxChange}
                  className={styles.checkboxInput}
                />
              </div>
            </CSSTransition>}
          </TransitionGroup>

          <Select
            id="personalReportsToggle"
            name="personalReportsToggle"
            label={strings.personalReports}
            value={this.state.personalReportsToggle}
            options={[
              ...importCsvOrSetHereOptions,
            ]}
            searchable={false}
            clearable={false}

            onChange={this.handlePersonalReportsToggleChange}
            className={styles.selectWrap}

            valueKey="id"
            labelKey="name"
          />

          <TransitionGroup component="span">
            {this.state.personalReportsToggle === 'from_form' && <CSSTransition
              classNames={{
                appear: styles['slide-appear'],
                appearActive: styles['slide-appear-active'],
                enter: styles['slide-enter'],
                enterActive: styles['slide-enter-active'],
                exit: styles['slide-exit'],
                exitActive: styles['slide-exit-active']
              }}
              timeout={{
                enter: 150,
                exit: 180
              }}
              appear
            >
              <div className={styles.platformWrap}>
                <Checkbox
                  inline
                  label={strings.enable}
                  name="enable"
                  value="enable"
                  checked={!!this.state.personalReports.enable}
                  onChange={this.handlePersonalReportsCheckboxChange}
                  className={styles.checkboxInput}
                />
              </div>
            </CSSTransition>}
          </TransitionGroup>

          <Select
            id="role"
            name="role"
            label={strings.role}
            value={this.state.role}
            options={[
              ...roleList
            ]}
            searchable={false}
            clearable={false}

            onChange={this.handleRoleChange}
            className={styles.selectWrap}

            valueKey="id"
            labelKey="name"
          />

          <Select
            id="sendDigestEmail"
            name="sendDigestEmail"
            label={strings.sendDigestEmail}
            value={this.state.sendDigestEmail}
            options={[
              ...importCsvOrDefaultOptions,
              ...digestEmailOptions
            ]}
            searchable={false}
            clearable={false}

            onChange={this.handleDigestEmailChange}
            className={styles.selectWrap}
            onFocus={this.handleScrollItoView}

            valueKey="id"
            labelKey="name"
          />
          <Select
            id="timezone"
            name="timezone"
            label={strings.timezone}
            value={this.state.timezone}
            options={[
              ...importCsvOrDefaultOptions,
              ...tzOptions
            ]}
            searchable={false}
            clearable={false}
            onChange={this.handleTzChange}
            className={styles.selectWrap}
            onFocus={this.handleScrollItoView}

            valueKey="id"
            labelKey="name"
          />
        </div>
      </div>
    );
  }
}
