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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import SpreadsheetViewer from 'components/ViewerFiles/SpreadsheetViewer/SpreadsheetViewer';

const SpreadsheetViewerDocs = require('!!react-docgen-loader!components/ViewerFiles/SpreadsheetViewer/SpreadsheetViewer.js');

//const s1 = require('../../static/spreadsheet1.json');
//const s2 = require('../../static/spreadsheet2.json');
const s3 = require('../../static/spreadsheet3.json');

export default class SpreadsheetViewerView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleLoad() {
    console.info('loaded');
  }

  handleError(event) {
    console.log(event);
  }

  render() {
    return (
      <section id="SpreadsheetViewerView">
        <h1>SpreadsheetViewer</h1>
        <Docs {...SpreadsheetViewerDocs} />

        <ComponentItem style={{ height: '500px' }}>
          <SpreadsheetViewer
            {...s3}
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
        </ComponentItem>
      </section>
    );
  }
}
