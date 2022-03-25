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

/* eslint-disable react/no-array-index-key */

import Papa from 'papaparse';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import PropTypes from 'prop-types';

export default class Csv extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    url: PropTypes.string,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,

    hasHeaderRow: PropTypes.bool,
    rowLimit: PropTypes.bool,
    rowsPerPage: PropTypes.number,

    authString: PropTypes.string,

    onLoad: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    rowsPerPage: 50,
    currentPage: 1,
    totalPages: 1,
    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = { parsedData: null };
    autobind(this);

    // refs
    this.elem = null;
    this.frame = null;
  }

  UNSAFE_componentWillMount() {
    Papa.parse(this.props.url + this.props.authString, {
      header: this.props.hasHeaderRow,
      complete: this.parseResults,
      download: true,
      error: this.props.onError,
      dynamicTyping: true,
      preview: this.props.rowLimit
    });
  }

  parseResults(results) {
    const parsedResults = {
      data: results.data,
      errors: results.errors,
      meta: results.meta
    };

    this.setState({ parsedData: parsedResults });

    // Propagate evemt
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad({
        id: this.props.id,
        totalPages: Math.floor(results.data.length / this.props.rowsPerPage)
      });
    }
  }

  renderTable() {
    const { currentPage, hasHeaderRow, rowsPerPage } = this.props;
    const { parsedData } = this.state;
    const styles = require('./Csv.less');
    const activeRowIndex = Math.abs(rowsPerPage - (currentPage * rowsPerPage));
    const rowsToParse = parsedData.data.slice(activeRowIndex, activeRowIndex + rowsPerPage);

    // With header
    if (hasHeaderRow) {
      return (
        <div
          ref={(c) => { this.elem = c; }}
          className={styles.tableContainer}
        >
          <table className={styles.csvTable}>
            <thead>
              <tr>
                <th className={styles.rowNumber}>#</th>
                {parsedData.meta.fields.map(field => (
                  <th key={'heading-' + field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsToParse.map((row, index) => (
                <tr key={'row-' + index}>
                  <td className={styles.rowNumber}>{activeRowIndex + index + 1}</td>
                  {this.state.parsedData.meta.fields.map(field => (
                    <td key={'field-' + index + field}>{row[field]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Without header
    return (
      <div
        ref={(c) => { this.elem = c; }}
        className={styles.tableContainer}
      >
        <table className={styles.csvTable}>
          <tbody>
            {rowsToParse.map((row, index) => (
              <tr key={'row-' + index}>
                <td className={styles.rowNumber}>{index + 1}</td>
                {row.map(field => (
                  <td key={'field-' + field}>{field}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { parsedData } = this.state;
    const styles = require('./Csv.less');

    return (
      <div ref={(c) => { this.frame = c; }} tabIndex="-1" className={styles.Csv}>
        {this.props.children}
        {parsedData && this.renderTable()}
      </div>
    );
  }
}
