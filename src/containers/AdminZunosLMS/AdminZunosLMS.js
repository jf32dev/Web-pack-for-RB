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
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import generateStrings from 'helpers/generateStrings';
import { defineMessages } from 'react-intl';

import Btn from 'components/Btn/Btn';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  getZunosLmsSignin
} from 'redux/modules/admin/education';

const messages = defineMessages({
  signin: { id: 'signin', defaultMessage: 'Sign In' },
  pleaseWait: { id: 'pleaseWait', defaultMessage: 'Please Wait...' },
});

function mapStateToProps(state) {
  const { education } = state.admin;
  return {
    url: education.url,
    zunosLoaded: education.zunosLoaded,
    error: education.error
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getZunosLmsSignin
  })
)
export default class AdminZunosLMSView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.props.getZunosLmsSignin(localStorage.getItem('BTCTK_A'));
  }

  handleSignIn() {
    window.open(this.props.url, 'Zunos');
  }

  render() {
    const styles = require('./AdminZunosLMS.less');
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.signinBlock}>
        <Btn
          className={styles.btnWrap}
          disabled={!this.props.zunosLoaded || this.props.error}
          inverted
          id="signin"
          onClick={this.handleSignIn}
        >
          {this.props.zunosLoaded && this.props.url && strings.signin}
          {this.props.zunosLoaded && this.props.error && ('Error: ' + this.props.error)}
          {!this.props.zunosLoaded && strings.pleaseWait}
        </Btn>
      </div>
    );
  }
}
