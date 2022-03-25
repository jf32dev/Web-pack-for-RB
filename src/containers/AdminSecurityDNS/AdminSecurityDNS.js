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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import {
  getSecurity,
  getDnsAlias,
  updateDnsAlias,
  deleteDnsAlias,
  validateDnsAlias,
  resetDnsValidation,
  updateHasUnSavedDnsAlias,
  setData,
  setDnsAlias,
} from 'redux/modules/admin/security';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';
import AdminSecurityDNSAlias from 'components/Admin/AdminSecurityDNSAlias/AdminSecurityDNSAlias';

const messages = defineMessages({
  dnsAlias: { id: 'dns-alias', defaultMessage: 'DNS Alias' },
  dnsAliasInfo: { id: 'dns-alias-info', defaultMessage: 'DNS Aliases are used to customize your landing page, and are necessary for the proper functioning of both the LDAP and SAML features.' },
  dnsAliasInfoRequest: { id: 'dns-alias-info-request', defaultMessage: 'Please provide the DNS prefix you would like to use for your unique company landing page in the fields provided below.' },
  save: { id: 'save', defaultMessage: 'Save' },
  saveDnsWarningMessage: { id: 'save-dns-warning-message', defaultMessage: 'Changing the DNS Alias will impact your landing page, LDAP, and SAML features. Are you sure you want to make these changes? For more information on this feature contact Bigtincan Support' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  addDnsAlias: { id: 'add-dns-alias', defaultMessage: 'Add DNS Alias' },
  dnsValidationFail: { id: 'dns-alias-is-taken', defaultMessage: 'This alias is already in use.' },
  warning: { id: 'warning', defaultMessage: 'Warning' },
  removeDNSAliasWarningMessage: { id: 'remove-dns-alias-warning-message', defaultMessage: 'All URLs and SAML configurations associated with this alias will be removed. Users attempting to load these URLs will be redirected to the standard cloud login screen.' }
});

@connect(
  state => ({
    ...state.admin.security
  }),
  bindActionCreatorsSafe({
    getSecurity,
    setData,
    setDnsAlias,
    getDnsAlias,
    updateDnsAlias,
    deleteDnsAlias,
    validateDnsAlias,
    resetDnsValidation,
    updateHasUnSavedDnsAlias,

    createPrompt
  })
)
export default class AdminSecurityDNS extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    alias: [],
    dnsAliasUrl: [],
  };

  constructor(props) {
    super(props);

    this.state = { setDNSAliasSuccessed: false };

    autobind(this);
  }

  componentDidMount() {
    // load DNS aliases
    this.props.getDnsAlias();
    // reset hasUnsavedDnsAlias
    this.props.setData({ hasUnsavedDnsAlias: { new: false } });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      error,
      updated,
    } = nextProps;

    // Handle save errors
    if (error && error.message && (!this.props.error || error.message !== this.props.error.message)) {
      this.props.createPrompt({
        id: 'dns-error',
        type: 'error',
        title: 'Error',
        message: error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if (updated && this.props.updated === false) {
      this.props.getDnsAlias();
      this.setState({ setDNSAliasSuccessed: true });
    }
  }

  getDomain() {
    const link = document.createElement('a');

    //  set href to any path
    link.setAttribute('href', window.BTC.BTCAPI);

    return link.hostname;
  }

  handleDnsDialogueCancel(event) {
    if (event) event.preventDefault();
    this.props.setData({ showingSaveDnsDialogue: false });
  }

  handleDnsDialoguePopup(event) {
    if (event) event.preventDefault();
    this.props.setData({ showingSaveDnsDialogue: true });
  }

  handleSaveDNSAlias(event) {
    if (event) event.preventDefault();
    // Save to DB
    if (this.props.modified) {
      this.props.setDnsAlias({ alias: this.props.alias });
      this.props.setData({ showingSaveDnsDialogue: false });
    }
  }

  handleChangeText(context) {
    const data = {};
    data[context.target.id] = context.target.value;
    // Refresh UI
    this.props.setData({ ...data, modified: true });
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case 32: //space
        event.stopPropagation();
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  handleCreateNewDNSAlias(alias) {
    if (this.props.updating || this.props.loading) return;
    this.handleDnsDialoguePopup();
    this.setState({ setDNSAliasSuccessed: false });
    this.props.setDnsAlias(alias);
  }

  handleDNSAliasValidate(params) {
    this.props.validateDnsAlias(params);
  }

  handleEditDNSAlias({ id, newAlias }) {
    if (this.props.updating || this.props.loading) return;
    this.props.updateDnsAlias({ id, newAlias });
  }

  handleDeleteDnsAlias(id) {
    if (this.props.updating || this.props.loading) return;
    this.props.deleteDnsAlias(id);
  }

  setHasUnsavedDnsAlias(status, id) {
    this.props.updateHasUnSavedDnsAlias({ status, id });
  }

  render() {
    const {
      loading,
      alias,
      style,
      className,
    } = this.props;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const styles = require('./AdminSecurityDNS.less');

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && (
          <div className={styles.Container}>
            <div className={styles.infoWrapper}>
              <p>{strings.dnsAliasInfo}</p>
              <p>{strings.dnsAliasInfoRequest}</p>
            </div>

            {alias && alias.map && alias
              .map((dnsAlias, idx) => (
                <AdminSecurityDNSAlias
                  type="EDIT"
                  alias={dnsAlias}
                  onSave={this.handleEditDNSAlias}
                  onValidation={this.handleDNSAliasValidate}
                  styles={styles}
                  key={`dns-alias-list-item-${idx}`}
                  strings={strings}
                  dnsAvailability={this.props.dnsAliasAvailabilities[dnsAlias.id] === undefined ? true : this.props.dnsAliasAvailabilities[dnsAlias.id]}
                  onDeleteClick={() => this.handleDeleteDnsAlias(dnsAlias.id)}
                  isBtnDisabled={this.props.loading || this.props.updating}
                  resetErrorMessage={this.props.resetDnsValidation}
                  setHasUnsavedDnsAlias={(status) => this.setHasUnsavedDnsAlias(status, dnsAlias.id)}
                />
              ))}
            <AdminSecurityDNSAlias
              type="CREATE"
              onValidation={this.handleDNSAliasValidate}
              onSave={this.handleCreateNewDNSAlias}
              strings={strings}
              styles={styles}
              dnsAvailability={this.props.dnsAliasAvailabilities.new}
              isBtnDisabled={this.props.loading || this.props.updating}
              resetErrorMessage={this.props.resetDnsValidation}
              setHasUnsavedDnsAlias={(status) => this.setHasUnsavedDnsAlias(status, 'new')}
              setDNSAliasSuccessed={this.state.setDNSAliasSuccessed}
            />
          </div>
        )}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={Object.values(this.props.hasUnsavedDnsAlias).some(status => status)} />}
      </div>
    );
  }
}
