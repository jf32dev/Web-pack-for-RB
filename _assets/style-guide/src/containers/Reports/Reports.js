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

import Reports from 'components/Reports/Reports';
import ReportItem from 'components/ReportItem/ReportItem';

const ReportsDocs = require('!!react-docgen-loader!components/Reports/Reports.js');
const ReportItemDocs = require('!!react-docgen-loader!components/ReportItem/ReportItem.js');

const reports = require('../../static/reports.json');

export default class ReportsView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    console.log(e);
  }

  handleOpenReports(openList) {
    console.log(openList);
  }

  render() {
    const newReports = [
      {
        name: 'personal',
        type: 'myContent',
        options: reports.personal.slice(0, 4)
      }, {
        name: 'personal',
        type: 'myActivity',
        options: reports.personal.slice(5, 7).map(item => ({
          ...item,
          desc: 'Choosing this opens a new window to choose the colors used for highlighting elements. The current item types and hex color codes are displayed, along with a sample of the color. To change a color, click the item type you wish to change, then “Select Color” in the lower left corner of the window. A new window will appear, offering a number of basic colors, in addition to a full editing option to create and save custom colors.'
        }))
      }, {
        name: 'company',
        type: 'users',
        options: reports.company.slice(0, 8)
      }, {
        name: 'company',
        type: 'systemContent',
        options: reports.company.slice(9, 13)
      }, {
        name: 'company',
        type: 'systemActivity',
        options: reports.company.slice(14, 20)
      }, {
        name: 'custom',
        type: '',
        options: reports.company.slice(3, 7).map(item => ({
          ...item,
          canDelete: true
        }))
      }
    ];

    return (
      <section id="ReportsView">
        <h1>Reports</h1>
        <Docs {...ReportsDocs} />
        <ComponentItem>
          <Reports
            list={newReports}
            onOpenReports={this.handleOpenReports}
          />
        </ComponentItem>

        <h2>ReportItem</h2>
        <Docs {...ReportItemDocs} />
        <ComponentItem>
          <ReportItem
            id="1"
            icon="numbers"
            iconColor="base"
            title="Title"
            desc="Desc"
            showCheckbox
            onClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
