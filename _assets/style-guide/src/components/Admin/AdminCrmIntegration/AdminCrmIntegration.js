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
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import getKloudlessConfig from 'helpers/getKloudlessConfig';

import Btn from 'components/Btn/Btn';
import CheckboxSelect from './CheckboxSelect';
import Checkbox from 'components/Checkbox/Checkbox';
import Select from 'components/Select/Select';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';

const messages = defineMessages({
  CRMIntegration: { id: 'CRM-integration', defaultMessage: 'CRM Integration' },
  save: { id: 'save', defaultMessage: 'Save' },
  saving: { id: 'saving', defaultMessage: 'Saving...' },
  CRMInUse: { id: 'CRM-in-use', defaultMessage: 'CRM in use' },
  CRMIntegrationDetails: { id: 'CRM-integration-details', defaultMessage: 'CRM Integration Details' },
  CRMContactFilter: { id: 'CRM-contact-filter', defaultMessage: 'CRM contact filter' },
  CRMSandbox: { id: 'CRM-sandbox', defaultMessage: 'Allow users to log in to Sandbox' },
  CRMSandboxDesc: { id: 'CRM-sandbox-desc', defaultMessage: 'When enabled, any user can choose to log in to the sandbox environment.' },
  filterStagesLabel: { id: 'filter-stages-label', defaultMessage: 'Opportunity stages to filter out' },
  authenticate: { id: 'authenticate', defaultMessage: 'Authenticate' },
  revokeAuthentication: { id: 'revoke-authentication', defaultMessage: 'Revoke Authentication' },
  enableFollowUpTask: { id: 'enable-follow-up-task', defaultMessage: 'Enable follow up task' },
  enableFollowUpTaskInfo: { id: 'enable-follow-up-task-info', defaultMessage: 'When enabled, creates a follow-up task in the Salesforce system.' },
  followUpTaskDueDate: { id: 'follow-up-task-due-date', defaultMessage: 'Follow-up task due date' },
  oneDay: { id: 'one-day', defaultMessage: '1 day' },
  twoDays: { id: 'two-days', defaultMessage: '2 days' },
  threeDays: { id: 'three-days', defaultMessage: '3 days' },
  fourDays: { id: 'four-days', defaultMessage: '4 days' },
  fiveDays: { id: 'five-days', defaultMessage: '5 days' },
  oneWeek: { id: 'one-week', defaultMessage: '1 week' },
  twoWeeks: { id: 'two-weeks', defaultMessage: '2 weeks' },
  threeWeeks: { id: 'three-weeks', defaultMessage: '3 weeks' },
  oneMonth: { id: 'one-month', defaultMessage: '1 month' },
  enableReminder: { id: 'enable-reminder', defaultMessage: 'Enable Reminder' },
  enableReminderInfo: { id: 'enable-reminder-info', defaultMessage: 'When enabled, creates a reminder in the {crm} system.' },
  reminderDueDate: { id: 'reminder-due-date', defaultMessage: 'Reminder due date' },
  prohibitUsers: { id: 'prohibit-users', defaultMessage: 'Prohibit users from overwriting company settings' },
  updateAllExistingUsers: { id: 'update-all-existing-users', defaultMessage: 'Update all existing users with new settings' },
  dueDate: { id: 'due-date', defaultMessage: 'Due date' },
  dueDateError: { id: 'due-date-error', defaultMessage: 'Reminder due date should be before Follow-Up task due date' },
});

export const SALESFORCE = 'salesforce';
export const DYNAMICS = 'dynamics';

export default class AdminCrmIntegration extends PureComponent {
  static propTypes = {
    settings: PropTypes.object,
    values: PropTypes.object,

    loaded: PropTypes.bool,
    crmSource: PropTypes.string,
    crmDescription: PropTypes.string,

    authenticated: PropTypes.bool,

    onAuthenticateClick: PropTypes.func,
    onExecute: PropTypes.func,
    onCRMSourceUpdate: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,

    appId: PropTypes.string
  };

  static defaultProps = {
    authenticated: false,
    values: {},
    settings: {},
    strings: {},
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      update: {},
      isSaving: false,
    };
    this.authenticatorScript = document.createElement('script');

    this.followupDueDateOption = [{
      id: 1,
      stringKey: 'oneDay',
    }, {
      id: 2,
      stringKey: 'twoDays',
    }, {
      id: 3,
      stringKey: 'threeDays',
    }, {
      id: 4,
      stringKey: 'fourDays',
    }, {
      id: 5,
      stringKey: 'fiveDays',
    }, {
      id: 7,
      stringKey: 'oneWeek',
    }, {
      id: 14,
      stringKey: 'twoWeeks',
    }, {
      id: 21,
      stringKey: 'threeWeeks',
    }, {
      id: 30,
      stringKey: 'oneMonth',
    }];

    this.reminderDueDateOption = [{
      id: 1,
      stringKey: 'oneDay',
    }, {
      id: 2,
      stringKey: 'twoDays',
    }, {
      id: 3,
      stringKey: 'threeDays',
    }, {
      id: 4,
      stringKey: 'fourDays',
    }, {
      id: 5,
      stringKey: 'fiveDays',
    }, {
      id: 7,
      stringKey: 'oneWeek',
    }, {
      id: 14,
      stringKey: 'twoWeeks',
    }, {
      id: 21,
      stringKey: 'threeWeeks',
    }];
  }

  componentDidMount() {
    if (window.Kloudless === undefined && !document.getElementById('kloudless')) {
      const { source, id, async } = getKloudlessConfig();
      this.authenticatorScript.src = source;
      this.authenticatorScript.id = id;
      this.authenticatorScript.async = async;
      document.body.appendChild(this.authenticatorScript);

      this.authenticatorScript.onload = () => this.initializeKloudless(this.props.crmSource, this.props.sandbox);
    } else {
      this.initializeKloudless(this.props.crmSource, this.props.sandbox);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.loaded && nextProps.loaded) {
      this.timer = window.setTimeout(() => {
        this.setState({
          update: {},
          isSaving: false
        });
        window.clearInterval(this.timer);
      }, 200);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.crmSource !== prevProps.crmSource) {
      this.initializeKloudless(this.props.crmSource, this.props.sandbox);
    }
  }

  componentWillUnmount() {
    if (this.timer) window.clearInterval(this.timer);
  }

  initializeKloudless = (crmSource, sandbox) => {
    if (window.Kloudless !== undefined && document.getElementById('authenticator-btn') !== null) {
      const options = {
        client_id: this.props.appId,
        scope: crmSource,
        developer: sandbox === 1 || sandbox === true
      };
      // Launch the Authenticator when the button is clicked
      window.Kloudless.authenticator(document.getElementById('authenticator-btn'), options, this.props.onAuthenticateClick);
    }
  }

  handleInUseChange(context) {
    if (context.id !== this.props.crmSource && this.props.onCRMSourceUpdate) {
      this.props.onCRMSourceUpdate(context.id);
    }
  }

  handleCheckboxBinaryChange(event) {
    const data = {};
    data[event.currentTarget.name] = event.currentTarget.checked ? 1 : 0;
    if (event.currentTarget.name === 'enableReminder' && !this.compareDueDate()) {
      data.reminderDueDate = 1;
      const { naming } = this.context.settings;
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, naming);
      this.props.onError(strings.dueDateError);
    }
    this.setState(data);
    this.updateData(data);
  }

  handleOpportunityFilterChange(values) {
    this.updateData({
      opportunityFilter: values
    });
  }

  handleFollowupDueDateSelectChange(context) {
    if (this.compareDueDate({ followupDueDate: context.id }) || _get(this.state.update, 'enableReminder', this.props.values.enableReminder) === 0) {
      this.updateData({
        followupDueDate: context.id
      });
    } else {
      const { naming } = this.context.settings;
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, naming);
      this.props.onError(strings.dueDateError);
    }
  }

  handleEnableReminderSelectChange(context) {
    if (this.compareDueDate({ reminderDueDate: context.id })) {
      this.updateData({
        reminderDueDate: context.id
      });
    } else {
      const { naming } = this.context.settings;
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, naming);
      this.props.onError(strings.dueDateError);
    }
  }

  compareDueDate(arg = {}) {
    const followupDueDate = this.state.update.followupDueDate || this.props.values.followupDueDate;
    const reminderDueDate = this.state.update.reminderDueDate || this.props.values.reminderDueDate;
    if (Object.prototype.hasOwnProperty.call(arg, 'reminderDueDate') && arg.reminderDueDate > followupDueDate) {
      return false;
    }
    if (Object.prototype.hasOwnProperty.call(arg, 'followupDueDate') && arg.followupDueDate < reminderDueDate) {
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(arg, 'followupDueDate') && !Object.prototype.hasOwnProperty.call(arg, 'reminderDueDate')) {
      return followupDueDate >= reminderDueDate;
    }
    return true;
  }

  handleDueDateSelectChange(context) {
    this.updateData({
      dueDate: context.id
    });
  }

  updateData(arg) {
    if (!_isEmpty(arg)) {
      this.setState({
        update: {
          ...this.state.update,
          ...arg,
        }
      });
    }
  }

  handleExecute() {
    if (this.props.onExecute) {
      this.props.onExecute(this.state.update);
      this.setState({
        isSaving: true
      });
    }
  }

  renderCheckbox(label, keyName) {
    const { values } = this.props;
    const { update } = this.state;
    return (<Checkbox
      inline
      label={label}
      name={keyName}
      value={keyName}
      checked={Object.prototype.hasOwnProperty.call(update, keyName) ? update[keyName] === 1 : values[keyName] === 1}
      onChange={this.handleCheckboxBinaryChange}
    />);
  }

  toggleAuthenticateBtn() {
    if (document.getElementById('authenticator-btn')) {
      document.getElementById('authenticator-btn').style.display = this.props.authenticated ? 'none' : 'block';
    }
  }

  render() {
    const {
      settings,
      values,
      onRevokeAuthenticationClick,
      crmSource,
      crmDescription,
      authenticated
    } = this.props;

    const {
      update,
      isSaving
    } = this.state;
    const styles = require('./AdminCrmIntegration.less');
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { ...naming, crm: crmDescription });

    const cx = classNames.bind(styles);
    const classes = cx({
      AdminCrmIntegration: true,
    }, this.props.className);

    const opportunityFilter = values.opportunityFilter.filter(item => settings.stagesOptions.find(obj => obj.id === item.id));
    const isDifferent = JSON.stringify(values) !== JSON.stringify({
      ...values,
      ...update,
    });

    return (
      <div className={classes}>
        <header>
          <h3>{strings.CRMIntegration}</h3>
          <Btn
            borderless
            inverted
            loading={isSaving}
            disabled={!isDifferent}
            onClick={this.handleExecute}
          >
            {isSaving ? strings.saving : strings.save}
          </Btn>
        </header>
        <Select
          id="inUse"
          name="inUse"
          label={strings.CrmInUse}
          value={crmSource}
          options={settings.inUseOptions}
          searchable={false}
          clearable={false}

          onChange={this.handleInUseChange}
          className={styles.selectWrap}
          valueKey="id"
          labelKey="name"
        />
        {crmSource === SALESFORCE && <Checkbox
          label={strings.CRMSandbox}
          name="enableSandbox"
          value="enableSandbox"
          checked={Object.prototype.hasOwnProperty.call(update, 'enableSandbox') ? update.enableSandbox === 1 : values.enableSandbox === 1}
          onChange={this.handleCheckboxBinaryChange}
          className={styles.checkboxInput}
        />}
        {crmSource === SALESFORCE && <h5>{strings.CRMSandboxDesc}</h5>}
        <div className={styles.details}>
          <h3>{strings.CRMIntegrationDetails}</h3>
          <Checkbox
            inline
            label={strings.CRMContactFilter}
            name="contactFilter"
            value="contactFilter"
            checked={Object.prototype.hasOwnProperty.call(update, 'contactFilter') ? update.contactFilter === 1 : values.contactFilter === 1}
            onChange={this.handleCheckboxBinaryChange}
            className={styles.checkboxInput}
          />
          <Select
            label={strings.filterStagesLabel}
            name="async"
            id="opportunityFilter"
            value={update.opportunityFilter || opportunityFilter || []}
            options={settings.stagesOptions}
            onChange={this.handleOpportunityFilterChange}
            clearable={false}
            valueKey="id"
            labelKey="name"
            className={styles.opportunityFilter}
            multi
            disabled={!authenticated}
          />
          <Btn
            id="authenticator-btn"
            inverted
            disabled={authenticated}
          >
            {strings.authenticate}
          </Btn>

          {authenticated && <Btn
            inverted
            onClick={onRevokeAuthenticationClick}
            disabled={!authenticated}
          >
            {strings.revokeAuthentication}
          </Btn>}
          {this.toggleAuthenticateBtn() } { /* Using Toggle in order to keep event handler active for Authenticator script */ }
          {crmSource === SALESFORCE && <CheckboxSelect
            className={styles.enableFollowUpTask}
            checkboxLabel={strings.enableFollowUpTask}
            checkboxDesc={strings.enableFollowUpTaskInfo}
            checkboxKey="enableFollowupTask"
            checked={Object.prototype.hasOwnProperty.call(update, 'enableFollowupTask') ? update.enableFollowupTask === 1 : values.enableFollowupTask === 1}
            selectLabel={strings.followUpTaskDueDate}
            selectKey="followupDueDate"
            selectOptions={this.followupDueDateOption.map(item => ({
              id: item.id,
              name: strings[item.stringKey]
            }))}
            selectValue={update.followupDueDate || values.followupDueDate}
            onCheckboxChange={this.handleCheckboxBinaryChange}
            onSelectChange={this.handleFollowupDueDateSelectChange}
          >
            <CheckboxSelect
              checkboxLabel={strings.enableReminder}
              checkboxDesc={strings.enableReminderInfo}
              checkboxKey="enableReminder"
              checked={Object.prototype.hasOwnProperty.call(update, 'enableReminder') ? update.enableReminder === 1 : values.enableReminder === 1}
              selectLabel={strings.reminderDueDate}
              selectKey="reminderDueDate"
              selectOptions={this.reminderDueDateOption.map(item => ({
                id: item.id,
                name: strings[item.stringKey]
              }))}
              selectValue={update.reminderDueDate || values.reminderDueDate}
              onCheckboxChange={this.handleCheckboxBinaryChange}
              onSelectChange={this.handleEnableReminderSelectChange}
            />
          </CheckboxSelect>}
          {crmSource === DYNAMICS && <Select
            id="due_date"
            name="due_date"
            label={strings.dueDate}
            value={update.dueDate || values.dueDate}
            options={this.followupDueDateOption.map(item => ({
              id: item.id,
              name: strings[item.stringKey]
            }))}
            searchable={false}
            clearable={false}

            onChange={this.handleDueDateSelectChange}
            className={styles.dueDateWrap}
            valueKey="id"
            labelKey="name"
          />}
          {this.renderCheckbox(strings.prohibitUsers, 'override')}
        </div>
        {this.renderCheckbox(strings.updateAllExistingUsers, 'updateUsers')}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={isDifferent} />}
      </div>
    );
  }
}
