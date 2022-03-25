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
import FileItem from 'components/FileItem/FileItem';
import ProgressBar from 'components/ProgressBar/ProgressBar';

export default class BulkUserImportUploadProgress extends Component {
  static propTypes = {
    currentFileName: PropTypes.string,
    strings: PropTypes.object,
    completedRecords: PropTypes.number,
    totalRecords: PropTypes.number
  }

  render() {
    const {
      currentFileName,
      strings,
      completedRecords,
      totalRecords
    } = this.props;
    const styles = require('./BulkUserImportUploadProgress.less');

    return (
      <div className={styles.uploadProgressContainer}>
        <div className={styles.uploadProgressThumbnailContainer}>
          <FileItem
            thumbSize="large"
            grid
            id={1}
            category="csv"
            description=""
          />
          <p className={styles.currentFileName}>{currentFileName}</p>
        </div>
        <div className={styles.uploadProgressBarContainer}>
          <ProgressBar
            completedRecords={completedRecords}
            totalRecords={totalRecords}
            action={strings.uploading}
            percentage
          />
        </div>
      </div>
    );
  }
}
