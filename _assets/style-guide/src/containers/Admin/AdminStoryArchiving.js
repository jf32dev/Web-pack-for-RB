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
import AdminStoryArchiving from 'components/Admin/AdminStoryArchiving/AdminStoryArchiving';

const AdminStoryArchivingDocs = require('!!react-docgen-loader!components/Admin/AdminStoryArchiving/AdminStoryArchiving.js');

export default class StoryArchivingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      securityGeneralValues: {
        inactivateLimitMonths: 0,
        inactiveContentscoreLimit: 0,
        waitTimeBeforeArchivingDays: 0,
        archiveExpiryDays: 0,
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
    });
  }

  render() {
    return (
      <section id="StoryArchivingView">
        <h1>Story Archiving</h1>
        <Docs {...AdminStoryArchivingDocs} />
        <ComponentItem>
          <AdminStoryArchiving
            onChange={this.handleChange}
            {...this.state.securityGeneralValues}
          />
        </ComponentItem>
      </section>
    );
  }
}
