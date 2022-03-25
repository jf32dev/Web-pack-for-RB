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

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import getKloudlessConfig from 'helpers/getKloudlessConfig';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';
import {
  loadCrmSettings,
  loadOpportunityStages,
  revokeCrmAccount,
  setCrmAttribute,
  setCrmSettings,
  saveCrmAccount
} from 'redux/modules/userSettings';
import {
  setAttribute
} from 'redux/modules/settings';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Select from 'react-select';
import Text from 'components/Text/Text';

const messages = defineMessages({
  crm: { id: 'crm', defaultMessage: 'CRM' },
  authenticate: { id: 'authenticate', defaultMessage: 'Authenticate' },
  revokeAuthentication: { id: 'revoke-authentication', defaultMessage: 'Revoke authentication' },
  authenticationForCRM: { id: 'authentication-for-crm', defaultMessage: 'Authentication for {crm}' },
  crmUsername: { id: 'crm-username', defaultMessage: '{crm} username' },
  crmEmail: { id: 'crm-email', defaultMessage: '{crm} email' },
  username: { id: 'username', defaultMessage: 'Username' },
  email: { id: 'email', defaultMessage: 'Email' },
  select: { id: 'select', defaultMessage: 'Select' },
  crmContactFilter: { id: 'crm-contact-filter', defaultMessage: 'CRM contact filter' },
  hideOpportunityStages: { id: 'hide-opportunity-stages', defaultMessage: 'Hide opportunity stages' },
  enableFollowUpTask: { id: 'enable-follow-up-task', defaultMessage: 'Enable Follow-up Task' },
  enable: { id: 'enable', defaultMessage: 'Enable' },
  disable: { id: 'disable', defaultMessage: 'Disable' },
  enableReminder: { id: 'enable-reminder', defaultMessage: 'Enable reminder' },
  reminderDueDate: { id: 'reminder-due-date', defaultMessage: 'Reminder due date' },
  followUpDueDate: { id: 'follow-up-due-date', defaultMessage: 'Follow-Up task due date' },
});

function mapStateToProps(state) {
  const { settings, userSettings } = state;

  return {
    ...settings.crm,
    ...userSettings.crmSettings,
    crmSettingsLoaded: userSettings.crmSettingsLoaded,
    crmSettingsLoading: userSettings.crmSettingsLoading,
    crmSettingsError: userSettings.crmSettingsError,
    crmAccountSaved: userSettings.crmAccountSaved,

    opportunityStages: userSettings.opportunityStages,
    opportunityStagesLoaded: userSettings.opportunityStagesLoaded,
    opportunityStagesLoading: userSettings.opportunityStagesLoading,
    opportunityStagesError: userSettings.opportunityStagesError,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    loadCrmSettings,
    loadOpportunityStages,
    revokeCrmAccount,
    setCrmAttribute,
    setCrmSettings,
    saveCrmAccount,

    setAttribute,
  })
)
export default class Crm extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    source: 'salesforce',
    serviceDescription: 'Salesforce',
    serverUrl: '',
    sandbox: false,
    authenticated: false,
    appId: '',
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.authenticatorScript = document.createElement('script');
    this.authBtnRef = React.createRef();
  }

  UNSAFE_componentWillMount() {
    if (!this.props.crmSettingsLoaded && !this.props.crmSettingsLoading) {
      this.props.loadCrmSettings(this.props.source);
    }
  }

  componentDidMount() {
    if (window.Kloudless === undefined && !document.getElementById('kloudless')) {
      const { source, id, async } = getKloudlessConfig();
      this.authenticatorScript.src = source;
      this.authenticatorScript.id = id;
      this.authenticatorScript.async = async;
      this.authenticatorScript.onload = () => this.initializeKloudless(this.props.source, this.props.sandbox);

      document.body.appendChild(this.authenticatorScript);
    } else {
      this.initializeKloudless(this.props.source, this.props.sandbox);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { crmSettingsError } = nextProps;

    // Handle save errors
    if (crmSettingsError && crmSettingsError.message && (!this.props.crmSettingsError && crmSettingsError.message !== this.props.crmSettingsError.message)) {
      this.props.createPrompt({
        id: uniqueId('settings-'),
        type: 'error',
        title: 'Error',
        message: crmSettingsError.message,
        dismissible: true,
        autoDismiss: 10
      });
    }

    if (nextProps.cloudAccountId && !this.props.cloudAccountId && nextProps.authenticated || (nextProps.crmAccountSaved && !this.props.crmAccountSaved && this.props.cloudAccountId)) {
      this.props.loadOpportunityStages(nextProps.cloudAccountId || this.props.cloudAccountId);
    }
  }

  componentDidUpdate() {
    if (!this.props.authenticated && this.authBtnRef.current !== null) {
      this.initializeKloudless(this.props.source, this.props.sandbox);
    }
  }

  initializeKloudless = (crmSource, sandbox) => {
    if (window.Kloudless !== undefined && this.authBtnRef.current !== null) {
      const options = {
        client_id: this.props.appId,
        scope: crmSource,
        developer: sandbox === 1 || sandbox === true
      };
      // Launch the Authenticator when the button is clicked
      window.Kloudless.authenticator(this.authBtnRef.current.btn, options, this.handleOnAuthenticateClick);
    }
  }

  handleCrmContactFilterChange(event) {
    this.props.setCrmSettings(this.props.source, 'contactFilter', parseInt(event.currentTarget.value, 10));
    this.props.setAttribute('contactFilter', parseInt(event.currentTarget.value, 10), 'crm'); //
  }

  handleEnableReminderChange(event) {
    this.props.setCrmSettings(this.props.source, 'enableReminder', parseInt(event.currentTarget.value, 10));
  }

  handleFollowUpTaskChange(event) {
    this.props.setCrmSettings(this.props.source, 'enableFollowupTask', parseInt(event.currentTarget.value, 10));
  }

  handleCrmTypeChange(item) {
    this.props.setCrmSettings(this.props.source, 'crmIdType', item.value);
  }

  handleReminderDueDateChange(item) {
    this.props.setCrmSettings(this.props.source, 'reminderDueDate', parseInt(item.value, 10));
  }

  handleFollowUpDueDateChange(item) {
    this.props.setCrmSettings(this.props.source, 'followupDueDate', parseInt(item.value, 10));
  }

  handleOpportunityStageChange(item) {
    this.props.setCrmSettings(this.props.source, 'opportunityFilter', item.map(({ value }) => value));
  }

  handleInputChange(event) {
    this.props.setCrmAttribute(event.currentTarget.name, event.currentTarget.value, 'crmSettings');
  }

  handleInputBlur(event) {
    this.props.setCrmSettings(this.props.source, event.currentTarget.name, event.currentTarget.value);
  }

  handleOnAuthenticateClick = (result) => {
    this.props.saveCrmAccount(result.account.id, result.account.service);
    this.props.setAttribute('authenticated', true, 'crm');
  }

  handleRevokeAuthentication = () => {
    this.props.setAttribute('authenticated', false, 'crm');
    this.props.revokeCrmAccount(this.props.source);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      override,
      authenticated,
      serviceDescription,
      crmId,
      crmIdType,
      contactFilter,
      opportunityFilter,
      opportunityStages,
      enableFollowupTask,
      followupDueDate,
      enableReminder,
      reminderDueDate,
    } = this.props;
    const styles = require('./Crm.less');

    // Loading indicator
    if (!this.props.crmSettingsLoaded || this.props.crmSettingsLoading) {
      return <Loader type="page" />;
    }

    // Translations
    const strings = generateStrings(messages, formatMessage, { crm: serviceDescription });

    const crmIdTypeList = [
      { value: 'username', label: strings.crmUsername },
      { value: 'email', label: strings.crmEmail },
    ];
    const reminderDueDateList = [
      { value: 1, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 1 }} /> },
      { value: 2, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 2 }} /> },
      { value: 3, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 3 }} /> },
      { value: 4, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 4 }} /> },
      { value: 5, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 5 }} /> },
      { value: 7, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 7 }} /> },
      { value: 14, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 14 }} /> },
      { value: 21, label: <FormattedMessage id="n-days" defaultMessage="{n} days" values={{ n: 21 }} /> },
    ];
    const followupDueDateList = reminderDueDateList;
    followupDueDateList.push({ value: 30, label: <FormattedMessage id="n-months" defaultMessage="{n} months" values={{ n: 1 }} /> });

    let opportunityFilterParsed = [];
    if (opportunityFilter) {
      opportunityFilterParsed = Array.isArray(opportunityFilter) ? opportunityFilter : JSON.parse(opportunityFilter);
    }

    let opportunityStagesList = [];
    if (opportunityStages.length) {
      opportunityStagesList = opportunityStages.map(function (id) {
        return { 'value': id, 'label': id };
      });
    } else if (opportunityFilterParsed && Array.isArray(opportunityFilterParsed)) {
      opportunityStagesList = opportunityFilterParsed.map(function (id) {
        return { 'value': id, 'label': id };
      });
    } else if (opportunityFilterParsed) {
      opportunityStagesList.push({ 'value': opportunityFilterParsed, 'label': opportunityFilterParsed });
    }

    return (
      <div className={styles.Crm}>
        <header className={styles.listHeader}>
          <div className={styles.titleWrap}>
            <Breadcrumbs
              paths={[{ 'name': strings.crm, 'path': '/settings/crm' }]}
              className={styles.listCrumbs}
            />
          </div>
        </header>

        <div className={styles.Wrapper}>
          {/* Authenticate */}
          <h3>{strings.authenticationForCRM}</h3>
          {!authenticated && <Btn
            ref={this.authBtnRef}
            inverted
            disabled={authenticated}
          >
            {strings.authenticate}
          </Btn>}
          {authenticated && <Btn
            inverted
            onClick={this.handleRevokeAuthentication}
            disabled={!authenticated}
          >
            {strings.revokeAuthentication}
          </Btn>}
          <h3>{strings.crmUsername}</h3>
          <Select
            disabled={override}
            name="crmIdType"
            value={crmIdType}
            options={crmIdTypeList}
            onChange={this.handleCrmTypeChange}
            placeholder="-- Select --"
            clearable={false}
            className={styles.select}
          />
          <Text
            disabled={override}
            name="crmId"
            value={crmId || ''}
            placeholder={crmIdType !== 'email' ? strings.username : strings.email}
            onBlur={this.handleInputBlur}
            onChange={this.handleInputChange}
            width="350px"
            className={styles.marginTop}
          />

          <h3>{strings.crmContactFilter}</h3>
          <RadioGroup
            name="contactFilter"
            selectedValue={contactFilter}
            onChange={this.handleCrmContactFilterChange}
            inlineInputs
            options={[{
              label: strings.enable,
              value: 1,
              disabled: override
            }, {
              label: strings.disable,
              value: 0,
              disabled: override
            }]}
          />

          <h3>{strings.hideOpportunityStages}</h3>
          <Select
            disabled={!authenticated || override}
            isLoading={authenticated && this.props.opportunityStagesLoading}
            name="opportunityFilter"
            value={opportunityFilterParsed}
            multi
            options={opportunityStagesList}
            onChange={this.handleOpportunityStageChange}
            placeholder={'-- ' + strings.select + ' --'}
            clearable={false}
            className={styles.select}
          />

          <h3>{strings.enableFollowUpTask}</h3>
          <RadioGroup
            name="enableFollowupTask"
            selectedValue={enableFollowupTask}
            onChange={this.handleFollowUpTaskChange}
            inlineInputs
            options={[{
              label: strings.enable,
              value: 1,
              disabled: override
            }, {
              label: strings.disable,
              value: 0,
              disabled: override
            }]}
          />
          {enableFollowupTask > 0 && <div>

            <h3>{strings.followUpDueDate}</h3>
            <Select
              disabled={override}
              name="followupDueDate"
              value={followupDueDate}
              options={followupDueDateList}
              onChange={this.handleFollowUpDueDateChange}
              placeholder="-- Select --"
              clearable={false}
              className={styles.select}
            />

            <h3>{strings.enableReminder}</h3>
            <RadioGroup
              name="enableReminder"
              selectedValue={enableReminder}
              onChange={this.handleEnableReminderChange}
              inlineInputs
              options={[{
                label: strings.enable,
                value: 1,
                disabled: override
              }, {
                label: strings.disable,
                value: 0,
                disabled: override
              }]}
            />

            {enableReminder > 0 && <div>
              <h3>{strings.reminderDueDate}</h3>
              <Select
                disabled={override}
                name="reminderDueDate"
                value={reminderDueDate}
                options={reminderDueDateList}
                onChange={this.handleReminderDueDateChange}
                placeholder="-- Select --"
                clearable={false}
                className={styles.select}
              />
            </div>}
          </div>}

        </div>
      </div>
    );
  }
}
