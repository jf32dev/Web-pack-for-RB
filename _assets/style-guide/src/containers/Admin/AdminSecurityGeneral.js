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
import AdminSecurityGeneralEdit from 'components/Admin/AdminSecurityGeneralEdit/AdminSecurityGeneralEdit';

const AdminSecurityGeneralEditDocs = require('!!react-docgen-loader!components/Admin/AdminSecurityGeneralEdit/AdminSecurityGeneralEdit.js');

export default class AdminSecurityGeneralView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      securityGeneralValues: {
        isShareCCHidden: false,
        shareBccAddressList: [],
        shareBCCAddresses: '',
        isJsInFileDisable: false,
        isJsInStoryDescDisable: false,
        overlayText: '__firstnamelastname__',
        tintColour: '#dddddd',
        opacity: '0',
        userFirstName: 'Jason',
        userLastName: 'Huang',
        userEmail: 'email@bigtincan.com',
        isBlurEmailThumbnails: false,
      },
      update: {},
    };
    autobind(this);
  }

  handleChange(update) {
    this.setState({
      securityGeneralValues: {
        ...this.state.securityGeneralValues,
        ...update,
      },
      update,
    })
  }

  render() {
    return (
      <section id="BlankView">
        <h1>Admin Security General</h1>
        <Docs {...AdminSecurityGeneralEditDocs} />
        <ComponentItem>
          <AdminSecurityGeneralEdit
            onChange={this.handleChange}
            {...this.state.securityGeneralValues}
          />
        </ComponentItem>
      </section>
    );
  }
}
