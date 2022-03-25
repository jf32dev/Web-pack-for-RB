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
 * @author Jason Huang <rubenson.barrios@bigtincan.com>
 */
//import union from 'lodash/union';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import AdminCrmIntegration from 'components/Admin/AdminCrmIntegration/AdminCrmIntegration';
const AdminCrmIntegrationDocs = require('!!react-docgen-loader!components/Admin/AdminCrmIntegration/AdminCrmIntegration.js');

const sampleData = require('../../static/admin/crmIntegration.json');

export default class AdminCrmIntegrationView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const settings = {
      inUseOptions: sampleData.crmList.map(item => ({
        id: item.crm,
        name: item.description,
      })),
      stagesOptions: []
    }

    const values = {
      crmSource: 'salesforce',
      type: 'admin',
      cloudAccountId: 8299110,
      contactFilter: false,
      updateUsers: 0,
      override: 0,
      dueDate: null,
      opportunityFilter: ['Qualification', 'Value Proposition'],
      enableReminder: 1,
      followupDueDate: 2,
      reminderDueDate: 1,
      enableFollowupTask: 1,
    };

    return (
      <section id="NavMenuView">
        <h1>Admin CRM Integration View</h1>
        <Docs {...AdminCrmIntegrationDocs} />

        <h2>Bulk upload Drag N Drop/ Browse File</h2>
        <p>Admin user bulk upload modal</p>
        <ComponentItem>
          <AdminCrmIntegration
            settings={settings}
            values={values}
          />
        </ComponentItem>
      </section>
    );
  }
}
