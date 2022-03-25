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
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import UserList from 'components/ViewerFiles/PresentationViewer/UserList';

/**
 * Blank description
 */
export default class BroadcastViewers extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,

    clients: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    isVisible: false,
    clients: [],
    strings: {
      viewers: 'Viewers',
    },
  };

  render() {
    const {
      isVisible,
      clients,
      strings,
      style,
      className
    } = this.props;

    const styles = require('./BroadcastViewers.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BroadcastViewers: true,
      hidden: !isVisible,
    }, className);


    return (
      <div className={classes} style={style}>
        <div className={styles.BroadcastContainer}>
          <div className={styles.title}>
            {strings.viewers}
          </div>
          <UserList clients={clients} />
        </div>
      </div>
    );
  }
}
