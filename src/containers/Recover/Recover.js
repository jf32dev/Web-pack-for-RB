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
import autobind from 'class-autobind';
import request from 'superagent';
import Recover from '../../../_assets/style-guide/src/components/Recover/Recover';

export default class RecoverContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailValue: '',
      disableButton: true,
      loading: false,
      submitted: false
    };
    autobind(this);
  }

  handleAnchorClick() {
    // Allow default browser event
  }

  handleRecoverEmailChange(event) {
    const val = event.currentTarget.value;

    this.setState({
      emailValue: val,
      disableButton: !val
    });
  }

  handleRecoverClick(event) {
    event.preventDefault();
    const url = window.BTC.BTCAPI + '/forgotPassword';
    const email = this.state.emailValue;

    this.setState({ loading: true });

    request.post(url)
      .type('form')
      .send({ email: email })
      .end(this.handleFormSuccess);
  }

  handleFormSuccess(err, res) {
    if (err || !res.ok) {
      this.setState({ loading: false, error: res.body.message });
    } else {
      this.setState({ loading: false, submitted: true });
    }
  }

  render() {
    const styles = require('./Recover.less');
    const year = new Date().getFullYear();

    return (
      <div className={styles.Recover}>
        <Recover
          logo="/static/img/logo_with_text.png"
          onAnchorClick={this.handleAnchorClick}
          onBtnClick={this.handleRecoverClick}
          onEmailChange={this.handleRecoverEmailChange}
          {...this.state}
        />
        <p className={styles.copyright}>&copy; {year} Bigtincan</p>
      </div>
    );
  }
}
