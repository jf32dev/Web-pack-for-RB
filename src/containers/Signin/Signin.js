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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
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
import { login, loginLDAP } from 'redux/modules/auth';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import ColourScheme from 'components/ColourScheme/ColourScheme';
import Loader from 'components/Loader/Loader';
import Login from 'components/Login/Login';

const messages = defineMessages({
  blurb: {
    id: 'login-blurb',
    defaultMessage: 'One platform & one experience for mobile content enablement.'
  },
  signIn: { id: 'sign-in', defaultMessage: 'Sign In' },
  password: { id: 'password', defaultMessage: 'Password' },
  rememberMe: { id: 'remember-me', defaultMessage: 'Remember me' },
  recoverYourPassword: {
    id: 'forgot-your-password',
    defaultMessage: 'Forgot your password?'
  },
  cloud: { id: 'cloud', defaultMessage: 'Cloud' },
  agreements: { id: 'agreements', defaultMessage: 'Agreements' },
  mobileApps: { id: 'mobile-apps', defaultMessage: 'Mobile Apps' },
  apps: { id: 'apps', defaultMessage: 'Apps' },
  systemStatus: { id: 'system-status', defaultMessage: 'System Status' },
  email: { id: 'email', defaultMessage: 'Email' },
  username: { id: 'username', defaultMessage: 'Username' },
  corporateSignIn: {
    id: 'corporate-sign-in',
    defaultMessage: 'Corporate Sign in'
  },
  enterpriseSingleSignOn: {
    id: 'enterprise-single-sign-on',
    defaultMessage: 'Enterprise single sign-on'
  },
  ldap: { id: 'ldap', defaultMessage: 'LDAP' },
  saml: { id: 'saml', defaultMessage: 'SAML' },
  samlMsg: { id: 'saml-msg', defaultMessage: 'You will be redirected to the single sign-on page. You may be prompted to enter your credentials for authentication.' },
  unsupportedBrowserMsg: { id: 'unsupported-browser-msg', defaultMessage: ' Sorry, your browser is not supported by bigtincan hub. You may just need to update your current browser. Download the latest supported browsers below.' },

  unableToConnect: { id: 'unable-to-connect', defaultMessage: 'Unable to connect' },
  reload: { id: 'reload', defaultMessage: 'Reload' },
  unableToLogout: { id: 'unable-to-logout', defaultMessage: 'Unable to logout using a SAML identity provider' },
});

const webappV4Routes = ['#story/', '#file/', '#people/', '#tab/'];

function shouldLoginDisable(userValue, passValue) {
  if (userValue && passValue) {
    return false;
  }
  return true;
}

function mapStateToProps(state) {
  return state.auth;
}

@connect(mapStateToProps, bindActionCreatorsSafe({ login, loginLDAP }))
export default class Signin extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.browser = checkBrowser();
    this.state = {
      userValue: '',
      passValue: '',
      selectedLogin: 'cloud',
      rememberChecked: false,
      disableInputs: false,
      disableButton: true,
      disableForgot: false,
      unableToLogout: false
    };
    autobind(this);

    // Translate old webapp v4 hash URLs
    this.handleV4Route(props);
  }

  UNSAFE_componentWillMount() {
    const { loaded, loginSettings } = this.props;

    // Set LDAP default
    if (loaded && loginSettings.ldap === 'on') {
      this.setState({
        selectedLogin: 'ldap',
        disableForgot: true
      });

      // Set SAML default
    } else if (loaded && loginSettings.saml === 'on') {
      this.setState({
        selectedLogin: 'saml',
        disableButton: false,
        disableForgot: true
      });
    }

    if (window.location.href.indexOf('samlLogout?status=false') > -1) {
      this.setState({ unableToLogout: true });
    }
  }

  handleV4Route(nextProps) {
    // Translate old webapp v4 hash URLs
    webappV4Routes.forEach(page => {
      if (nextProps.location && nextProps.location.hash && nextProps.location.hash.indexOf(page) >= 0) {
        const tabPath = page.substring(1) === 'tab/' ? 'content' : '';
        const customPath = `${tabPath}/${page.substring(1)}${nextProps.location.hash.split(page)[1]}`;
        if (this.props.location.pathname !== nextProps.location.pathname && nextProps.history.action !== 'REPLACE') {
          this.previousLocation.pathname = customPath;
          window.previousLocation.pathname = customPath;
        }
        window.location.replace(customPath);
      }
    });
  }

  handleReloadClick() {
    window.location.reload();
  }

  handleUserChange(event) {
    this.setState({
      userValue: event.currentTarget.value,
      disableButton: shouldLoginDisable(event.currentTarget.value, this.state.passValue)
    });
  }

  handlePassChange(event) {
    this.setState({
      passValue: event.currentTarget.value,
      disableButton: shouldLoginDisable(this.state.userValue, event.currentTarget.value)
    });
  }

  handleLoginClick(event) {
    event.preventDefault();

    // LDAP
    if (this.state.selectedLogin === 'ldap') {
      this.props.loginLDAP(this.state.userValue, this.state.passValue);

    // SAML
    } else if (this.state.selectedLogin === 'saml') {
      let samlDomain = window.location.origin.replace(/appnext|app/, 'push');
      const origin = window.location.origin;

      // Test SAML on localhost pointing to localhost API
      if (window.BTC.BTCAPI && window.BTC.BTCAPI.includes('localhost') &&
        origin && (origin.includes('localhost') || origin.includes('localdev.btc'))) {
        const link = document.createElement('a');
        //  set href to any path
        link.setAttribute('href', window.BTC.BTCAPI);
        samlDomain = link.protocol + '//' + link.hostname + ':5000';
      }
      window.location.replace(samlDomain + '/v5/webapi/signin?auth_type=saml');

    // Cloud
    } else {
      this.props.login(this.state.userValue, this.state.passValue);
    }
  }

  handleOptionChange(event) {
    const newState = {
      selectedLogin: event.currentTarget.value
    };

    // SAML/LDAP hide forgot password
    newState.disableForgot = (newState.selectedLogin === 'saml' || newState.selectedLogin === 'ldap');

    // Disable inputs and enable button if SAML is selected
    if (newState.selectedLogin === 'saml') {
      newState.disableInputs = true;
      newState.userValue = '';
      newState.passValue = '';
      newState.disableButton = false;

      // Cloud/LDAP
    } else {
      newState.disableInputs = false;
      newState.disableButton = shouldLoginDisable(this.state.userValue, this.state.passValue);
    }

    this.setState(newState);
  }

  handleRememberChange(event) {
    this.setState({
      rememberChecked: event.currentTarget.checked
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { appLinks, cloud, ldap, saml } = this.props.loginSettings;
    const styles = require('./Signin.less');
    const year = new Date().getFullYear();

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Auth settings not yet loaded (show with CSS)
    if (!this.props.loaded && !this.props.error) {
      return (
        <div className={styles.loader} style={{ opacity: 0 }}>
          <Loader type="app" />
        </div>
      );

    // Loading error - not online?
    } else if (this.props.error) {
      return (
        <Blankslate
          icon="error"
          message={strings.unableToConnect}
          middle
        >
          <Btn small onClick={this.handleReloadClick}>{strings.reload}</Btn>
        </Blankslate>
      );
    }

    // Conditional strings
    let userPlaceholder = strings.email;
    let ldapText = strings.corporateSignIn;
    let samlText = strings.enterpriseSingleSignOn;

    // Username instead of email for LDAP
    if (this.state.selectedLogin === 'ldap') {
      userPlaceholder = strings.username;
    }

    // Use abbreviations if all options are enabled
    if (cloud === 'on' && ldap === 'on' && saml === 'on') {
      ldapText = strings.ldap;
      samlText = strings.saml;
    }

    // Login type settings
    const settings = {
      cloud: this.props.loginSettings.cloud,
      ldap: this.props.loginSettings.ldap,
      saml: this.props.loginSettings.saml
    };

    // Status link
    let statusLink = 'https://status.bigtincan.com';
    if (window.location.origin.indexOf('bigtincan.co') > -1) {
      statusLink = window.location.origin.replace(/appnext|app/, 'status');
    }
    return (
      <div className={styles.Signin}>
        <Helmet>
          <title>Bigtincan Hub v5</title>
        </Helmet>
        <ColourScheme
          varSelectors={window.BTC.scheme}
          vars={this.props.loginSettings.theme}
        />
        <Login
          focusOnMount
          image={this.props.loginSettings.image}
          logo={this.props.loginSettings.logo}
          text={this.props.loginSettings.text}
          textColour={this.props.loginSettings.textColour}
          settings={settings}
          loading={this.props.loggingIn}
          error={this.props.loginError}
          unsupportedBrowser={!this.browser.supported}
          onUserChange={this.handleUserChange}
          onPassChange={this.handlePassChange}
          onButtonClick={this.handleLoginClick}
          onOptionChange={this.handleOptionChange}
          onRememberChange={this.handleRememberChange}
          blurb={strings.blurb}
          btnText={strings.signIn}
          btnDesc={this.state.selectedLogin === 'saml' ? strings.samlMsg : ''}
          passPlaceholder={strings.password}
          rememberText={strings.rememberMe}
          recoverText={strings.recoverYourPassword}
          cloudText={strings.cloud}
          userPlaceholder={userPlaceholder}
          ldapText={ldapText}
          samlText={samlText}
          unsupportedBrowserText={strings.unsupportedBrowserMsg}
          unableToLogoutText={strings.unableToLogout}
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
