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

const general = require('../../static/admin/general.json');
const currency = require('../../static/admin/currency.json');
import AdminGeneralGeneral from 'components/Admin/AdminGeneralGeneral/AdminGeneralGeneral';

const AdminGeneralGeneralDocs = require('!!react-docgen-loader!components/Admin/AdminGeneralGeneral/AdminGeneralGeneral.js');

export default class AdminGeneralGeneralView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: {}
    };
    autobind(this);
  }

  handleChange(update) {
    event.preventDefault();
    this.setState({
      update: {
        ...this.state.update,
        ...update,
      }
    })
  }

  render() {
    let customGeneral = Object.keys(general).reduce((obj, key) => {
      if(general[key] === 1 || general[key] === 0) {
        return {
          ...obj,
          [key]: general[key] === 1 ? true : false
        };
      }
      return {
        ...obj,
        [key]: general[key]
      };
    }, {});

    return (
      <section id="BlankView">
        <h1>Admin General General View</h1>
        <Docs {...AdminGeneralGeneralDocs} />

        <ComponentItem>
          <AdminGeneralGeneral
            onChange={this.handleChange}
            {...customGeneral}
            currency={currency.map((item, i) => ({
              value: i,
              label: item.entity,
            }))}
            {...this.state.update}
          />
        </ComponentItem>
      </section>
    );
  }
}
