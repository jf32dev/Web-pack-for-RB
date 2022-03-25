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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import moment from 'moment';
import ProgressBar from 'components/ProgressBar/ProgressBar';

export default class BulkListItem extends Component {
  static propTypes = {
    /** pass to render the progress bar */
    completedRecords: PropTypes.number,
    hasErrors: PropTypes.bool,
    fileName: PropTypes.string,
    id: PropTypes.number,

    /** pass to show the current status of the job */
    status: PropTypes.string,

    /** pass to render the progress bar */
    totalRecords: PropTypes.number,

    /** pass to render the date */
    uploadedAt: PropTypes.string,
    user: PropTypes.string,
    strings: PropTypes.object,
  };

  static defaultProps = {
    completedRecords: null,
    hasErrors: false,
    fileName: '',
    id: null,
    status: '',
    totalRecords: null,
    uploadedAt: '',
    user: '',
    strings: {}
  }

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleResultClick() {
    this.props.onResultClick(this.props.id);
  }

  render() {
    const {
      completedRecords,
      hasErrors,
      fileName,
      id,
      status,
      totalRecords,
      uploadedAt,
      user,
      strings,
      type
    } = this.props;
    const styles = require('./BulkListItem.less');
    const date = moment(uploadedAt).format('DD MMM YYYY hh:mm A');
    const isProcessing = status === 'pending';
    const isCompleted = status === 'completed';
    const processing = isProcessing && (
      <ProgressBar
        id={id}
        completedRecords={completedRecords}
        totalRecords={totalRecords}
        action={type === 'user_import' ? strings.importingUsers : strings.importingMetadata}
      />
    );

    const completed = isCompleted && hasErrors ? (
      <span className={styles.warning}>
        <a className={styles.viewResults} onClick={this.handleResultClick}>{strings.viewErrors}</a>
      </span>
    ) : (
      <a className={styles.viewResults} onClick={this.handleResultClick}>{strings.viewResults}</a>
    );

    return (
      <div id={id} className={styles.bulkListItemContainer}>
        <div>
          <p className={styles.filename}>{fileName}</p>
          <p className={styles.dateUser}>{date} - {user}</p>
        </div>
        <div className={isProcessing ? styles.status : undefined}>
          {processing || completed}
        </div>
      </div>
    );
  }
}
