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

export default class ProgressBar extends Component {
  static propTypes = {
    id: PropTypes.number,

    /** pass to render the number of completed records */
    completedRecords: PropTypes.number,

    /** pass to render the number of total records */
    totalRecords: PropTypes.number,

    /** pass to render the number status as a percentage */
    percentage: PropTypes.bool,

    /** pass to show what the current action is e.g. Importing users, uploading etc */
    action: PropTypes.string,
  };

  static defaultProps = {
    id: null,
    completedRecords: 1,
    totalRecords: 1,
    percentage: false,
    action: '',
  }

  render() {
    const {
      id,
      completedRecords,
      totalRecords,
      percentage,
      action
    } = this.props;
    const styles = require('./ProgressBar.less');

    const progressWidth = Math.floor(completedRecords / totalRecords * 100);

    const isPercent = percentage ? (
      <p>{progressWidth}%</p>
    ) : (
      <p>{completedRecords} / {totalRecords}</p>
    );

    return (
      <div key={id} className={styles.progressContainer}>
        <div className={styles.progressText}>
          <p>{action}</p>
          {isPercent}
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressBarBackground} style={{ width: `${progressWidth}%` }} />
        </div>
      </div>
    );
  }
}
