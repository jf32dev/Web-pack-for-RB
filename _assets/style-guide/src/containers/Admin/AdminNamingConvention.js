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
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
// import Debug from '../../views/Debug';

import AdminNamingConvention from 'components/Admin/AdminNamingConvention/AdminNamingConvention';

const AdminNamingConventionDocs = require('!!react-docgen-loader!components/Admin/AdminNamingConvention/AdminNamingConvention.js');

export default class AdminNamingConventionView extends Component {
  render() {
    return (
      <section id="BlankView">
        <h1>Admin Naming Convention</h1>
        <Docs {...AdminNamingConventionDocs} />
        <ComponentItem>
          <AdminNamingConvention />
        </ComponentItem>
      </section>
    );
  }
}
