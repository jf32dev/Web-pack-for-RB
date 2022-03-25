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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadAuthSettings,
  activateUser,
  verifyActivateToken
} from 'redux/modules/auth';

import Activate from 'components/Activate/Activate';
import ColourScheme from 'components/ColourScheme/ColourScheme';

const messages = defineMessages({
  blurb: {
    id: 'activate-user-blurb',
    defaultMessage: 'Welcome to Bigtincan Hub, to complete your registration please create a password.'
  },
  continue: { id: 'continue', defaultMessage: 'Continue' },
  email: { id: 'email', defaultMessage: 'Email' },
  password: { id: 'password', defaultMessage: 'Password' },
  confirmPassword: { id: 'confirm-password', defaultMessage: 'Confirm Password' },
  congratulations: { id: 'congratulations', defaultMessage: 'Congratulations' },
  submittedBlurb: { id: 'activate-user-submitted-blurb', defaultMessage: 'You can now sign in to Bigtincan Hub. Don’t miss a beat by downloading Bigtincan Hub on your devices.' },
  goToSignIn: { id: 'go-to-sign-in', defaultMessage: 'Go to Sign In' },
  android: { id: 'android', defaultMessage: 'Android' },
  ios: { id: 'ios', defaultMessage: 'iOS' },
  windows: { id: 'windows', defaultMessage: 'Windows' }
});

function shouldActivateDisable(props) {
  if (props.passValue && props.passValue === props.passConfirmValue) {
    return false;
  }
  return true;
}

function mapStateToProps(state) {
  return state.auth;
}

@connect(mapStateToProps, bindActionCreatorsSafe({
  loadAuthSettings,
  activateUser,
  verifyActivateToken
}))
export default class ActivateContainer extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    media: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      userValue: '',
      passValue: '',
      passConfirmValue: '',
      disableButton: true,
      token: false
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.verifyActivateToken(this.props.token);
    this.props.loadAuthSettings();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.invalidToken) {
      window.location = '/';
    }
  }

  handleAnchorClick(event) {
    event.preventDefault();
    const newWindow = window.open(event.currentTarget.href);
    newWindow.opener = null;
  }

  handleActivateUserChange(event) {
    const newState = { ...this.state };
    newState.userValue = event.currentTarget.value;
    newState.disableButton = shouldActivateDisable(newState);

    this.setState(newState);
  }

  handleActivatePassChange(event) {
    const newState = { ...this.state };
    newState.passValue = event.currentTarget.value;
    newState.disableButton = shouldActivateDisable(newState);

    this.setState(newState);
  }

  handleActivatePassConfirmChange(event) {
    const newState = { ...this.state };
    newState.passConfirmValue = event.currentTarget.value;
    newState.disableButton = shouldActivateDisable(newState);

    this.setState(newState);
  }

  handleActivateClick(event) {
    event.preventDefault();
    const { passValue, passConfirmValue } = this.state;
    this.props.activateUser(this.props.token, passValue, passConfirmValue);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const styles = require('./Activate.less');
    const year = new Date().getFullYear();

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.Activate}>
        <ColourScheme
          //varSelectors={window.BTC.scheme}
          vars={this.props.loginSettings.theme}
        />
        <Activate
          image={this.props.loginSettings.image}
          logo={this.props.loginSettings.logo}
          loading={this.props.loading || this.props.authLoading}
          strings={strings}
          submitted={this.props.activateSubmitted}
          showAppLinks={this.props.loginSettings.appLinks === 'on'}
          iosAppDownload={this.props.loginSettings.iosAppDownload}
          androidAppDownload={this.props.loginSettings.androidAppDownload}
          windowsAppDownload={this.props.loginSettings.windowsAppDownload}
          onAnchorClick={this.handleAnchorClick}
          //onUserChange={this.handleActivateUserChange}
          onPassChange={this.handleActivatePassChange}
          onPassConfirmChange={this.handleActivatePassConfirmChange}
          onButtonClick={this.handleActivateClick}
          {...this.state}
        />
        <p className={styles.copyright}>&copy; {year} Bigtincan</p>
      </div>
    );
  }
}
