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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
// import Debug from '../../views/Debug';

import AdminSMTPEdit from 'components/Admin/AdminSMTPEdit/AdminSMTPEdit';

const AdminSMTPEditDocs = require('!!react-docgen-loader!components/Admin/AdminSMTPEdit/AdminSMTPEdit.js');

export default class SMTPServerSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        isCustom: false,
        host: '',
        port: '',
        username: '',
        password: '',
        encryption: 'ssl',
        testAddress: '',
      },
      update: {},
    };
    autobind(this);
  }

  handleTestSettingClick(event) {
    event.preventDefault();
    console.info('click');
  }

  handleChange(update) {
    this.setState({
      values: {
        ...this.state.values,
        ...update,
      },
      update,
    });
  }

  render() {
    const { values } = this.state;

    return (
      <section id="BlankView">
        <h1>Admin SMTP Server Setup</h1>
        <Docs {...AdminSMTPEditDocs} />
        <ComponentItem>
          <AdminSMTPEdit
            onTestSettingClick={this.handleTestSettingClick}
            onChange={this.handleChange}
            {...values}
          />
        </ComponentItem>
      </section>
    );
  }
}
