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

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { logout } from 'redux/modules/auth';
import { confirmWelcome } from 'redux/modules/settings';

import WelcomeScreens from 'components/WelcomeScreens/WelcomeScreens';

function mapStateToProps(state) {
  return {
    welcomeScreens: state.settings.welcomeScreens
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    logout,
    confirmWelcome
  })
)
export default class Onboard extends Component {
  static propTypes = {
    welcomeScreens: PropTypes.object,
    logout: PropTypes.func.isRequired,
    confirmWelcome: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleWelcomeAcceptClick(event) {
    event.preventDefault();
    this.props.confirmWelcome();
  }

  handleWelcomeDenyClick(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const { welcomeScreens } = this.props;
    const hasScreens = welcomeScreens && welcomeScreens.slides && welcomeScreens.slides.length;
    if (!hasScreens) {
      return false;
    }

    return (
      <WelcomeScreens
        {...welcomeScreens}
        isVisible
        onAcceptClick={this.handleWelcomeAcceptClick}
        onDenyClick={this.handleWelcomeDenyClick}
      />
    );
  }
}
