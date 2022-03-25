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

import AdminCloudServices from 'components/Admin/AdminFiles/AdminCloudServices';
const cloudServices = require('../../static/admin/cloudServices.json');

const AdminCloudServicesDocs = require('!!react-docgen-loader!components/Admin/AdminFiles/AdminCloudServices.js');

export default class AdminCloudServicesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: cloudServices
    };
    autobind(this);
  }

  handleChange(update, data) {
    console.log(data);
    this.setState({
      update
    })
  }

  render() {
    return (
      <section id="BlankView">
        <h1>Admin Cloud Services View</h1>
        <Docs {...AdminCloudServicesDocs} />
        <ComponentItem>
          <AdminCloudServices onChange={this.handleChange} cloudServices={this.state.update} />
        </ComponentItem>
      </section>
    );
  }
}
