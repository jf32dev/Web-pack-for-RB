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

import AdminFileUploads from 'components/Admin/AdminFiles/AdminFileUploads';

const AdminFileUploadsDocs = require('!!react-docgen-loader!components/Admin/AdminFiles/AdminFileUploads.js');
const allowedExtensions = require('../../static/admin/allowedExtensions.json');

export default class AdminFileUploadsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false,
    };
    autobind(this);
  }

  handleChange(update) {
    if (update.dialog) {
      console.log('show Dialog', update);
    }
  }

  render() {
    return (
      <section id="BlankView">
        <h1>Admin File Uploads View</h1>
        <Docs {...AdminFileUploadsDocs} />

        <ComponentItem>
          <AdminFileUploads
            onChange={this.handleChange}
            allowedExtensions={allowedExtensions}
            videoTranscode={true}
          />
        </ComponentItem>
      </section>
    );
  }
}
