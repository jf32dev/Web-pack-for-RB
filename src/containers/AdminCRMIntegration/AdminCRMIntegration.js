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
import _isEmpty from 'lodash/isEmpty';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getCrmList,
  getCrmSetting,
  getOpportunityStage,
  setCrmSetting,
  setCrmAccount,
  revokeAuthentication,
} from 'redux/modules/admin/crmIntegration';
import {
  saveCrmAccount,
} from 'redux/modules/userSettings';
import {
  setAttribute
} from 'redux/modules/settings';
import { createPrompt } from 'redux/modules/prompts';

import AdminCrmIntegration, { SALESFORCE, DYNAMICS } from 'components/Admin/AdminCrmIntegration/AdminCrmIntegration';
import Dialog from 'components/Dialog/Dialog';

const OPPORTUNITY_FILTER = 'opportunityFilter';

const messages = defineMessages({
  contentSecurityPolicy: { id: 'content-security-policy', defaultMessage: 'Content Security Policy' },
  confirmChanges: { id: 'confirm-changes', defaultMessage: 'Confirm changes' },
  yes: { id: 'yes', defaultMessage: 'Yes' },
  no: { id: 'no', defaultMessage: 'No' },
  confirmChangesDesc: {
    id: 'confirm-changes-desc',
    defaultMessage: 'You are about to change the CRM system in use, doing so will disconnect all users from {crm}.  Are you sure you want to proceed?'
  },
  contentSecurityPolicyDesc: {
    id: 'content-security-policy-desc',
    defaultMessage: 'This Whitelist allows you to make certain URLs available in the Hub. Add the relevant URLs to this list and specify one or more options you would like to make available in the dropdown provided.'
  },
  url: {
    id: 'url',
    defaultMessage: 'URL',
  },
  saveCRMSuccessMessage: {
    id: 'save-crm-success-message',
    defaultMessage: 'Company wide {crm} settings are saved successfully',
  },
});

@connect(state => ({
  ...state.settings.crm,
  ...state.admin.crmIntegration,
  toggleAttributes: state.settings.toggleAttributes,
  crmAccountSaved: state.userSettings.crmAccountSaved,
  settings: {
    inUseOptions: state.admin.crmIntegration.crmList.map(item => ({
      id: item.crm,
      name: item.description,
    })),
    stagesOptions: state.admin.crmIntegration.stages.map(item => ({
      id: item,
      name: item,
    }))
  },
  authenticated: state.admin.crmIntegration.is_authenticated,
  values: {
    contactFilter: state.admin.crmIntegration.contact_filter,
    opportunityFilter: JSON.parse(state.admin.crmIntegration.opportunity_filter || '[]').map(item => ({
      id: item,
      name: item,
    })),
    enableFollowupTask: state.admin.crmIntegration.enable_followup_task,
    enableSandbox: state.admin.crmIntegration.enable_sandbox,
    followupDueDate: state.admin.crmIntegration.followup_due_date,
    enableReminder: state.admin.crmIntegration.enable_reminder,
    reminderDueDate: state.admin.crmIntegration.reminder_due_date === 0 ? 1 : state.admin.crmIntegration.reminder_due_date,
    override: state.admin.crmIntegration.override,
    updateUsers: state.admin.crmIntegration.update_users,
    dueDate: state.admin.crmIntegration.due_date,
  }
}), bindActionCreatorsSafe({
  getCrmList,
  getCrmSetting,
  getOpportunityStage,
  setCrmSetting,
  setCrmAccount,
  revokeAuthentication,
  setAttribute,
  createPrompt,
  saveCrmAccount
}))
export default class AdminCRMIntegration extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      crmSource: null,
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.getCrmList) {
      this.props.getCrmList();
    }

    if (this.props.getCrmSetting) {
      this.props.getCrmSetting(this.context.settings.crm.source, this.context.settings.crm.serviceDescription);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'crm-integration-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
      this.newName = '';
    }
    if (!this.props.crmSettingLoaded && nextProps.crmSettingLoaded &&
        this.props.getOpportunityStage &&
        nextProps.cloud_account_id &&
        nextProps.is_authenticated) {
      this.props.getOpportunityStage(nextProps.cloud_account_id);
    }
    //Oauth
    if ((!this.props.setCrmAccountLoaded && nextProps.setCrmAccountLoaded) ||
      (!this.props.revokeAuthenticationLoaded && nextProps.revokeAuthenticationLoaded) ||
      (nextProps.crmAccountSaved && !this.props.crmAccountSaved)) {
      //messages
      const currentCRM = this.props.settings.inUseOptions.find(item => item.id === this.context.settings.crm.source) || {};
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, { crm: currentCRM.name || '' });
      this.props.createPrompt({
        id: 'success',
        type: 'success',
        title: 'success',
        message: strings.saveCRMSuccessMessage,
        dismissible: true,
        autoDismiss: 5
      });
      this.props.getCrmSetting(this.context.settings.crm.source, this.context.settings.crm.serviceDescription);
    }

    if (!this.props.setCrmSettingLoaded &&
        nextProps.setCrmSettingLoaded) {
      const crmSource = this.state.crmSource || this.context.settings.crm.source;
      //messages
      const currentCRM = this.props.settings.inUseOptions.find(item => item.id === crmSource) || {};
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage, {
        crm: currentCRM.name || ''
      });
      this.props.createPrompt({
        id: 'success',
        type: 'success',
        title: 'success',
        message: strings.saveCRMSuccessMessage,
        dismissible: true,
        autoDismiss: 5
      });
      this.handleDialogCloseClick();
      this.props.getCrmSetting(currentCRM.id, currentCRM.name);
    }
  }

  getValues(update) {
    return keyName => {
      if (Object.prototype.hasOwnProperty.call(update, keyName)) {
        if (keyName === OPPORTUNITY_FILTER) {
          return JSON.stringify(update[keyName].map(item => item.id));
        }
        return update[keyName];
      }

      if (keyName === OPPORTUNITY_FILTER) {
        return JSON.stringify(this.props.values[keyName].map(item => item.id));
      }
      return this.props.values[keyName];
    };
  }

  handleAuthenticateClick = (result) => {
    this.props.saveCrmAccount(result.account.id, result.account.service);
    this.props.setAttribute('authenticated', true, 'crm');
  }

  handleRevokeAuthentication = () => {
    if (this.props.revokeAuthentication) {
      this.props.revokeAuthentication({
        cloud_account_id: this.props.cloud_account_id,
        crm_source: this.context.settings.crm.source
      });
    }
    this.props.setAttribute('authenticated', false, 'crm');
  }

  handleCRMSourceUpdate(crmSource) {
    this.setState({
      crmSource,
    });
  }

  handleDialogCloseClick() {
    if (!_isEmpty(this.state.crmSource)) {
      this.setState({
        crmSource: null
      });
    }
  }

  handleDialogConfirmClick() {
    if (this.props.setCrmSetting) {
      const currentCRM = this.props.settings.inUseOptions.find(item => item.id === this.state.crmSource) || {};
      this.props.setCrmSetting({
        type: 'admin',
        system: true,
        crm_source: currentCRM.id,
      });

      this.props.setAttribute('source', currentCRM.id, 'crm');
      this.props.setAttribute('serviceDescription', currentCRM.name, 'crm');
    }
  }

  handleCrmSave(update) {
    if (this.props.setCrmSetting) {
      const { crm } = this.context.settings;
      const getValues = this.getValues(update);
      let result = {
        crm_source: crm.source,
        type: 'admin',
        contact_filter: getValues('contactFilter'),
        override: getValues('override'),
        update_users: getValues('updateUsers'),
      };
      if (crm.source === SALESFORCE) {
        result = {
          ...result,
          cloud_account_id: crm.appId,
          opportunity_filter: getValues('opportunityFilter'),
          enable_reminder: getValues('enableReminder'),
          followup_due_date: getValues('followupDueDate'),
          reminder_due_date: getValues('reminderDueDate'),
          enable_followup_task: getValues('enableFollowupTask'),
          enable_sandbox: getValues('enableSandbox'),
        };
      } else if (crm.source === DYNAMICS) {
        result = {
          ...result,
          cloud_account_id: crm.appId,
          opportunity_filter: getValues('opportunityFilter'),
          due_date: getValues('dueDate'),
        };
      }
      this.props.setCrmSetting(result);
    }
  }

  handleError(message) {
    this.props.createPrompt({
      id: 'crm-integration-error',
      type: 'error',
      title: 'Error',
      message: message,
      dismissible: true,
      autoDismiss: 5
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const appId = this.context.settings.crm.appId;
    const {
      setCrmSettingLoaded,
      settings,
      values,
      authenticated,
    } = this.props;
    const currentCRM = settings.inUseOptions.find(item => item.id === this.context.settings.crm.source) || {};
    const strings = generateStrings(messages, formatMessage, {
      crm: currentCRM.name || ''
    });
    return (
      <div>
        <AdminCrmIntegration
          settings={settings}
          authenticated={authenticated}
          values={values}
          onError={this.handleError}
          loaded={setCrmSettingLoaded}
          onAuthenticateClick={this.handleAuthenticateClick}
          onRevokeAuthenticationClick={this.handleRevokeAuthentication}
          crmSource={this.context.settings.crm.source}
          crmDescription={this.context.settings.crm.serviceDescription}
          onCRMSourceUpdate={this.handleCRMSourceUpdate}
          onExecute={this.handleCrmSave}
          appId={appId}
          sandbox={this.context.settings.crm.sandbox}
        />
        <Dialog
          isVisible={!_isEmpty(this.state.crmSource)}
          title={strings.confirmChanges}
          message={strings.confirmChangesDesc}
          cancelText={strings.no}
          confirmText={strings.yes}
          onCancel={this.handleDialogCloseClick}
          onConfirm={this.handleDialogConfirmClick}
        />
      </div>
    );
  }
}
