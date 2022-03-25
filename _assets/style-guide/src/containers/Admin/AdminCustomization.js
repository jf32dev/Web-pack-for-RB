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

import AdminCustomization from 'components/Admin/AdminCustomization/AdminCustomization';

const MyDocs = require('!!react-docgen-loader!components/Admin/AdminCustomization/AdminCustomization.js');

export default class CustomizationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        colors: {
          base: "#a42a2a",
          darkBase: "#000000",
          lightBase: "#000000",
          checked: false,
        }
      },
    };
    autobind(this);
  }

  handleChange(update) {
    this.setState({
      values: {
        ...this.state.values,
        ...update
      }
    });
  }

  handleImageUpload(file, itemId) {
    this.setState({
      values: {
        ...this.state.values,
        [itemId]: 'loading',
      }
    });

    this.timer = window.setTimeout(() => {
      this.setState({
        values: {
          ...this.state.values,
          [itemId]: (window.URL || window.webkitURL).createObjectURL(file),
        }
      });
    }, 5000);
  }

  handleError(error) {
    console.warn(error.message);
  }

  render() {
    return (
      <section id="BlankView">
        <h1>Admin Customization</h1>
        <Docs {...MyDocs} />
        <ComponentItem>
          <AdminCustomization
            {...this.state.values}
            onChange={this.handleChange}
            onImageUpload={this.handleImageUpload}
            onError={this.handleError}
          />
        </ComponentItem>
      </section>
    );
  }
}
