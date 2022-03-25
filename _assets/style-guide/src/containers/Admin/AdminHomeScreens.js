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

import AdminHomeScreens from 'components/Admin/AdminHomeScreens/AdminHomeScreens';
import InputModal from 'components/Admin/AdminHomeScreens/InputModal';

const AdminHomeScreensDocs = require('!!react-docgen-loader!components/Admin/AdminHomeScreens/AdminHomeScreens.js');

export default class AdminHomeScreensView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
    autobind(this);
  }

  handleChange(update) {
    const key = Object.keys(update)[0];
    if (key === 'edit') {
      this.setState({
        isVisible: true
      });
    }
    console.info(update);
  }

  handleClose() {
    this.setState({
      isVisible: false
    });
  }

  handleConfirm(update) {
    console.info(update);
    this.setState({
      isVisible: false
    });
  }

  render() {
    const { values } = this.state;
    const pages = [{
      name:'Standard Home Page',
      id: 1,
      checked: true
    }, {
      name:'Marketing Page',
      id: 2,
      checked: false
    }];
    const addOns = [{
      name: 'Top Sales',
      id: 1,
      info: '2 Home Screens',
      link: 'https://www.google.com'
    }, {
      name: 'Recent Files',
      id: 2,
      info: '1 Home Screen',
      link: 'https://www.google.com'
    }];
    const legacy = [{
      name: 'Bridge 2.0 Demo',
      id: 1,
      info: 'Bridge 2.0',
      link: 'https://www.google.com'
    }, {
      name: 'Marketing v1',
      id: 2,
      info: 'Bridge 2.0',
      link: 'https://www.google.com'
    }];

    return (
      <section id="AdminHomeScreensView">
        <h1>Admin Home Screens</h1>
        <Docs {...AdminHomeScreensDocs} />
        <ComponentItem>
          <AdminHomeScreens
            pages={pages}
            addOns={addOns}
            legacy={legacy}
            onChange={this.handleChange}
          />
          <InputModal
            isVisible={this.state.isVisible}
            onConfirm={this.handleConfirm}
            onClose={this.handleClose}
            dataKey="interesting"
            label="Name"
            title="BTCA"
          />
        </ComponentItem>
      </section>
    );
  }
}
