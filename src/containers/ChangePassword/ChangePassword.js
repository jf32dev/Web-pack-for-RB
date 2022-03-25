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
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import checkBrowser from 'helpers/checkBrowser';
import { login, loadAuthSettings, resetPassword } from 'redux/modules/auth';
import PasswordReset from 'components/PasswordReset/PasswordReset';

import { updatePassword } from 'redux/modules/settings';

const messages = defineMessages({
  blurb: {
    id: 'change-password-blurb',
    defaultMessage: 'To change your password complete the fields, and then click Submit.'
  },
  submit: { id: 'submit', defaultMessage: 'Submit' },
  currentPassword: { id: 'current-password', defaultMessage: 'Current Password' },
  newPassword: { id: 'new-password', defaultMessage: 'New Password' },
  confirmPassword: { id: 'confirm-password', defaultMessage: 'Confirm Password' },
  agreements: { id: 'agreements', defaultMessage: 'Agreements' },
  mobileApps: { id: 'mobile-apps', defaultMessage: 'Mobile Apps' },
  apps: { id: 'apps', defaultMessage: 'Apps' },
  systemStatus: { id: 'system-status', defaultMessage: 'System Status' },
  email: { id: 'email', defaultMessage: 'Email' },
  confirmPassValue: { id: 'username', defaultMessage: 'Username' },
  unableToConnect: { id: 'unable-to-connect', defaultMessage: 'Unable to connect' },
  reload: { id: 'reload', defaultMessage: 'Reload' },
  changeSuccessTitle: { id: 'change-success-title', defaultMessage: 'Success' },
  changeSuccessBlurb: { id: 'changeSuccessBlurb', defaultMessage: 'Your Password has been changed.' },
  signIn: { id: 'sign-in', defaultMessage: 'Sign In' },
  unsupportedBrowserMsg: { id: 'unsupported-browser-msg', defaultMessage: ' Sorry, your browser is not supported by bigtincan hub. You may just need to update your current browser. Download the latest supported browsers below.' },

});

function shouldResetDisable(passValue, confirmPassValue) {
  if (confirmPassValue && passValue && passValue === confirmPassValue) {
    return false;
  }
  return true;
}
function mapStateToProps(state) {
  const { settings, auth } = state;
  return {
    ...settings,
    ...auth
  };
}

@connect(mapStateToProps, bindActionCreatorsSafe({ login, loadAuthSettings, resetPassword, updatePassword }))
export default class ChangePassword extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    if (props.userPasswordUpdated !== state.passwordChanged) {
      return {
        passwordChanged: props.userPasswordUpdated
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.browser = checkBrowser();
    this.state = {
      currentPasswordValue: '',
      passValue: '',
      confirmPassValue: '',
      rememberChecked: false,
      disableInputs: false,
      disableButton: true,
      redirectUrl: '',
      passwordChanged: false
    };
    autobind(this);
  }

  componentDidUpdate() {
    if (this.state.passwordChanged) {
      this.props.history.push(window.previousLocation || '/');
    }
  }

  handleConfirmPassChange(event) {
    this.setState({
      confirmPassValue: event.currentTarget.value,
      disableButton: shouldResetDisable(event.currentTarget.value, this.state.passValue)
    });
  }

  handleCurrentPasswordChange(event) {
    this.setState({
      currentPasswordValue: event.currentTarget.value,
    });
  }

  handlePassChange(event) {
    this.setState({
      passValue: event.currentTarget.value,
      disableButton: shouldResetDisable(this.state.confirmPassValue, event.currentTarget.value)
    });
  }


  handlePasswordChangeClick(event) {
    event.preventDefault();
    this.props.updatePassword(this.state.currentPasswordValue, this.state.passValue, this.state.confirmPassValue);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { appLinks } = this.props.loginSettings;
    const styles = require('./ChangePassword.less');
    const year = new Date().getFullYear();

    // Translations
    const strings = generateStrings(messages, formatMessage);


    // Status link
    let statusLink = 'https://status.bigtincan.com';
    if (window.location.origin.indexOf('bigtincan.co') > -1) {
      statusLink = window.location.origin.replace(/appnext|app/, 'status');
    }
    return (
      <div className={styles.Reset}>
        <Helmet>
          <title>Bigtincan Hub v5</title>
        </Helmet>
        <PasswordReset
          showCurrentPasswordField
          focusOnMount
          image={this.props.loginSettings.image}
          logo={this.props.loginSettings.logo}
          text={this.props.loginSettings.text}
          textColour={this.props.loginSettings.textColour}
          loading={this.props.userPasswordUpdating}
          error={this.props.userError || {}}
          unsupportedBrowser={!this.browser.supported}
          onPassChange={this.handlePassChange}
          onCurrentPasswordChange={this.handleCurrentPasswordChange}
          onConfirmPassChange={this.handleConfirmPassChange}
          onButtonClick={this.handlePasswordChangeClick}
          blurb={strings.blurb}
          btnText={strings.submit}
          btnDesc=""
          currentPasswordPlaceholder={strings.currentPassword}
          passwordPlaceholder={strings.newPassword}
          confirmPasswordPlaceholder={strings.confirmPassword}
          changeSuccessTitle={strings.changeSuccessTitle}
          changeSuccessBlurb={strings.changeSuccessBlurb}
          changeSuccessBtnText={strings.signIn}
          changeSuccess={this.props.resetDone}
          redirectUri={this.redirectUri}
          unsupportedBrowserText={strings.unsupportedBrowserMsg}
          {...this.state}
          style={{ zIndex: 1 }}
        />
        <footer className={styles.copyright}>
          <ul>
            <li data-id="copyright">&copy; {year} Bigtincan</li>
            <li data-id="agreements">
              <a href="/agreements.html" aria-label={strings.agreements}>
                {strings.agreements}
              </a>
            </li>
            {appLinks === 'on' && <li data-id="download">
              <a href="/download.html" aria-label={strings.apps}>
                {strings.apps}
              </a>
            </li>}
            <li data-id="status">
              <a href={statusLink} rel="noopener noreferrer" target="_blank" aria-label={strings.systemStatus}>
                {strings.systemStatus}
              </a>
            </li>
          </ul>
        </footer>
      </div>
    );
  }
}
