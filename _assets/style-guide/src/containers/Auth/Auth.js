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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import Activate from 'components/Activate/Activate';
import Login from 'components/Login/Login';
import Recover from 'components/Recover/Recover';

const ActivateDocs = require('!!react-docgen-loader!components/Activate/Activate.js');
const LoginDocs = require('!!react-docgen-loader!components/Login/Login.js');
const RecoverDocs = require('!!react-docgen-loader!components/Recover/Recover.js');

function shouldActivateDisable(props) {
  if (props.userValue && props.passValue && props.passValue === props.passConfirmValue) {
    return false;
  }
  return true;
}

function shouldLoginDisable(props) {
  if (props.userValue && props.passValue) {
    return false;
  }
  return true;
}

function shouldRecoverDisable(props) {
  if (props.emailValue) {
    return false;
  }
  return true;
}

export default class AuthView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activateProps: {
        userValue: '',
        passValue: '',
        passConfirmValue: '',
        disableButton: true,
        loading: false,
        submitted: false
      },
      loginProps: {
        settings: {
          cloud: 'on',  // on, off, forced
          ldap: 'on',
          saml: 'on',
        },
        userValue: '',
        passValue: '',
        selectedLogin: 'cloud',
        rememberChecked: false,
        disableInputs: false,
        disableButton: true,
        disableForgot: false,
        loading: false,
        error: {},
        unsupportedBrowser: false
      },
      recoverProps: {
        emailValue: '',
        disableButton: true,
        loading: false,
        submitted: false
      },
    };

    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  /**
   * Activate Events
   */
  handleActivateClick(event) {
    event.preventDefault();
    console.log('Activate clicked');
  }

  handleActivateUserChange(event) {
    const props = { ...this.state.activateProps };
    props.userValue = event.currentTarget.value;
    props.disableButton = shouldActivateDisable(props);

    this.setState(
      ...this.state, {
        activateProps: props
      }
    );
  }

  handleActivatePassChange(event) {
    const props = { ...this.state.activateProps };
    props.passValue = event.currentTarget.value;
    props.disableButton = shouldActivateDisable(props);

    this.setState(
      ...this.state, {
        activateProps: props
      }
    );
  }

  handleActivatePassConfirmChange(event) {
    const props = { ...this.state.activateProps };
    props.passConfirmValue = event.currentTarget.value;
    props.disableButton = shouldActivateDisable(props);

    this.setState(
      ...this.state, {
        activateProps: props
      }
    );
  }

  toggleActivateLoading() {
    const props = { ...this.state.activateProps };
    props.loading = !props.loading;

    this.setState(
      ...this.state, {
        activateProps: props
      }
    );
  }

  toggleActivateSubmitted() {
    const props = { ...this.state.activateProps };
    props.submitted = !props.submitted;

    this.setState(
      ...this.state, {
        activateProps: props
      }
    );
  }

  /**
   * Login Events
   */
  handleLoginUserChange(event) {
    const props = { ...this.state.loginProps };
    props.userValue = event.currentTarget.value;
    props.disableButton = shouldLoginDisable(props);

    this.setState(
      ...this.state, {
        loginProps: props
      }
    );
  }

  handleLoginPassChange(event) {
    const props = { ...this.state.loginProps };
    props.passValue = event.currentTarget.value;
    props.disableButton = shouldLoginDisable(props);

    this.setState(
      ...this.state, {
        loginProps: props
      }
    );
  }

  handleLoginClick(event) {
    event.preventDefault();
    console.log('Login clicked');
  }

  handleLoginOptionChange(event) {
    const value = event.currentTarget.value;
    const props = { ...this.state.loginProps };
    props.selectedLogin = value;

    // SAML/LDAP hide forgot password
    props.disableForgot = props.selectedLogin === 'saml' || props.selectedLogin === 'ldap';

    // Disable inputs and enable button if SAML is selected
    if (value === 'saml') {
      props.disableInputs = true;
      props.userValue = '';
      props.passValue = '';
      props.disableButton = false;

    // Cloud/LDAP
    } else {
      props.disableInputs = false;
      props.disableButton = !(props.userValue && props.passValue);
    }

    this.setState(
      ...this.state, {
        loginProps: props
      }
    );
  }

  handleLoginRememberChange(event) {
    const props = { ...this.state.loginProps };
    props.rememberChecked = event.currentTarget.checked;

    this.setState(
      ...this.state, {
        loginProps: props
      }
    );
  }

  toggleLoginLoading() {
    const props = { ...this.state.loginProps };
    props.loading = !props.loading;

    this.setState(
      ...this.state, {
        loginProps: props
      }
    );
  }

  toggleLoginUnsupported() {
    const props = { ...this.state.loginProps };
    props.unsupportedBrowser = !props.unsupportedBrowser;

    this.setState(
      ...this.state, {
        loginProps: props
      }
    );
  }

  /**
   * Recover Events
   */
  handleRecoverEmailChange(event) {
    const props = { ...this.state.recoverProps };
    props.emailValue = event.currentTarget.value;
    props.disableButton = shouldRecoverDisable(props);

    this.setState(
      ...this.state, {
        recoverProps: props
      }
    );
  }

  handleRecoverClick(event) {
    event.preventDefault();
    console.log('Recover clicked');
  }

  toggleRecoverLoading() {
    const props = { ...this.state.recoverProps };
    props.loading = !props.loading;

    this.setState(
      ...this.state, {
        recoverProps: props
      }
    );
  }

  toggleRecoverSubmitted() {
    const props = { ...this.state.recoverProps };
    props.submitted = !props.submitted;

    this.setState(
      ...this.state, {
        recoverProps: props
      }
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { cloud, ldap, saml } = this.state.loginProps.settings;

    // Login strings
    const blurb = formatMessage({
      id: 'login-blurb',
      defaultMessage: 'One platform & one experience for mobile content enablement.'
    });
    const btnText = formatMessage({
      id: 'sign-in',
      defaultMessage: 'Sign in'
    });
    const passPlaceholder = formatMessage({
      id: 'password',
      defaultMessage: 'Password'
    });
    const rememberText = formatMessage({
      id: 'remember-me',
      defaultMessage: 'Remember me'
    });
    const recoverText = formatMessage({
      id: 'forgot-your-password',
      defaultMessage: 'Forgot your password?'
    });
    const cloudText = formatMessage({
      id: 'cloud',
      defaultMessage: 'Cloud'
    });

    // Conditional strings
    let userPlaceholder = formatMessage({
      id: 'email',
      defaultMessage: 'Email'
    });
    let ldapText = formatMessage({
      id: 'corporate-sign-in',
      defaultMessage: 'Corporate Sign In'
    });
    let samlText = formatMessage({
      id: 'enterprise-single-sign-on',
      defaultMessage: 'Enterprise single sign-on'
    });

    // Username instead of email for LDAP
    if (this.state.selectedLogin === 'ldap') {
      userPlaceholder = formatMessage({
        id: 'username',
        defaultMessage: 'Username'
      });
    }

    // Use abbreviations if all options are enabled
    if (cloud === 'on' && ldap === 'on' && saml === 'on') {
      ldapText = formatMessage({
        id: 'ldap',
        defaultMessage: 'LDAP'
      });
      samlText = formatMessage({
        id: 'saml',
        defaultMessage: 'SAML'
      });
    }

    return (
      <section id="AuthView">
        <h1>Auth</h1>
        <p>Components related to Auth.</p>

        <h2>Activate</h2>
        <Docs {...ActivateDocs} />
        <p><code>{JSON.stringify(this.state.activateProps, null, '  ')}</code></p>
        <p><Btn small onClick={this.toggleActivateLoading}>Toggle Loading</Btn></p>
        <p><Btn small onClick={this.toggleActivateSubmitted}>Toggle Submitted</Btn></p>
        <ComponentItem>
          <Activate
            image="https://upload.wikimedia.org/wikipedia/commons/b/b4/Sunset_on_V%C3%B5su_beach%2C_Lahemaa_National_Park%2C_Estonia.jpg"
            logo="/src/static/logo_with_text.png"
            text="Adhering to Guidelines and consistency consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            textColour="#fff"
            onAnchorClick={this.handleAnchorClick}
            onUserChange={this.handleActivateUserChange}
            onPassChange={this.handleActivatePassChange}
            onPassConfirmChange={this.handleActivatePassConfirmChange}
            onButtonClick={this.handleActivateClick}
            {...this.state.activateProps}
            style={{ margin: '0 auto' }}
          />
        </ComponentItem>

        <h2>Login</h2>
        <Docs {...LoginDocs} />
        <p><code>{JSON.stringify(this.state.loginProps, null, '  ')}</code></p>
        <p><Btn small onClick={this.toggleLoginLoading}>Toggle Loading</Btn></p>
        <p><Btn small onClick={this.toggleLoginUnsupported}>Toggle Unsupported</Btn></p>
        <ComponentItem>
          <Login
            image="https://upload.wikimedia.org/wikipedia/commons/b/b4/Sunset_on_V%C3%B5su_beach%2C_Lahemaa_National_Park%2C_Estonia.jpg"
            logo="/src/static/logo_with_text.png"
            text="Adhering to Guidelines and consistency consectetur adipiscing elit, sed do eiusmod tempor incididunt."
            textColour="#fff"

            blurb={blurb}
            btnText={btnText}
            passPlaceholder={passPlaceholder}
            rememberText={rememberText}
            recoverText={recoverText}
            cloudText={cloudText}
            userPlaceholder={userPlaceholder}
            ldapText={ldapText}
            samlText={samlText}

            onUserChange={this.handleLoginUserChange}
            onPassChange={this.handleLoginPassChange}
            onAnchorClick={this.handleAnchorClick}
            onButtonClick={this.handleLoginClick}
            onOptionChange={this.handleLoginOptionChange}
            onRememberChange={this.handleLoginRememberChange}
            {...this.state.loginProps}
            style={{ margin: '0 auto' }}
          />
        </ComponentItem>

        <h2>Recover</h2>
        <Docs {...RecoverDocs} />
        <p><code>{JSON.stringify(this.state.recoverProps, null, '  ')}</code></p>
        <p><Btn small onClick={this.toggleRecoverLoading}>Toggle Loading</Btn></p>
        <p><Btn small onClick={this.toggleRecoverSubmitted}>Toggle Submitted</Btn></p>
        <ComponentItem>
          <Recover
            logo="/src/static/logo_with_text.png"
            onAnchorClick={this.handleAnchorClick}
            onBtnClick={this.handleRecoverClick}
            onEmailChange={this.handleRecoverEmailChange}
            {...this.state.recoverProps}
            style={{ margin: '0 auto' }}
          />
        </ComponentItem>
      </section>
    );
  }
}
