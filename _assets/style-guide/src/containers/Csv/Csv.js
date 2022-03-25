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
import ComponentItem from '../../views/ComponentItem';
import PropList from '../../views/PropList';
import ViewerToolbar from 'components/Viewer/ViewerToolbar';
import Csv from 'components/ViewerFiles/Csv';

const csv = require('../../static/files.json')[0];

export default class CsvView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      loading: true,
      totalPages: 1,
      rowsPerPage: 10
    };

    this.handleLoad = this.handleLoad.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleToolbarItemClick = this.handleToolbarItemClick.bind(this);
  }

  handleLoad(results) {
    this.setState({
      loading: false,
      totalPages: Math.floor(results.data.length / this.state.rowsPerPage),
    });
  }

  handleError(event) {
    console.log(event);
  }

  handleToolbarItemClick(event, action) {
    switch (action) {
      case 'prevPage': {
        let newPage = this.state.currentPage - 1;
        if (newPage < 1) {
          newPage = this.state.totalPages;
        }
        this.setState({ currentPage: newPage });
        break;
      }
      case 'nextPage': {
        let newPage = this.state.currentPage + 1;
        if (newPage > this.state.totalPages) {
          newPage = 1;
        }
        this.setState({ currentPage: newPage });
        break;
      }
      default:
        console.info('Unknown action: ' + action);
        break;
    }
  }

  render() {
    return (
      <section id="CsvView">
        <h1>Csv</h1>
        <p>Displays an <code>Csv</code> file.</p>

        <PropList
          items={[{
            name: 'url',
            type: 'string',
            description: '',
            required: true
          }, {
            name: 'currentPage',
            type: 'number',
            description: '',
            required: false
          }, {
            name: 'totalPages',
            type: 'number',
            description: '',
            required: false
          }, {
            name: 'hasHeaderRow',
            type: 'number',
            description: 'renders table with a header row',
            required: false
          }, {
            name: 'rowLimit',
            type: 'number',
            description: 'limit number of rows to parse',
            required: false
          }, {
            name: 'rowsPerPage',
            type: 'number',
            description: 'number of rows to display per page (default 50)',
            required: false
          }, {
            name: 'onLoad',
            type: 'func',
            description: 'Returns file id and totalPages',
            required: false
          }, {
            name: 'onError',
            type: 'func',
            description: '',
            required: false
          }]}
        />

        <ComponentItem style={{ height: '500px', overflow: 'auto' }}>
          <Csv
            url={csv.url}
            currentPage={this.state.currentPage}
            totalPages={this.state.totalPages}
            hasHeaderRow={csv.hasHeaderRow}
            rowsPerPage={25}
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
          {!this.state.loading && <ViewerToolbar
            currentPage={this.state.currentPage}
            totalPages={this.state.totalPages}
            onItemClick={this.handleToolbarItemClick}
          />}
        </ComponentItem>
      </section>
    );
  }
}
