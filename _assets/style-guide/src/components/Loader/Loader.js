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
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

/**
 * Used to indicate content is being requested from the server.
 */
export default class Loader extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['app', 'content', 'page']).isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { type, style } = this.props;
    const styles = require('./Loader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Loader: true,
      app: type === 'app' || type === 'page',
      content: type === 'content',
      page: type === 'page_old',
    }, this.props.className);

    if (type === 'app' || type === 'page') {
      return (
        <div className={classes} style={style}>
          <svg className={styles.orange} viewBox="0 0 102 102">
            <circle
              cx="50%" cy="50%" r="44"
              opacity="1"
            />
          </svg>
          <svg className={styles.midGrey} viewBox="0 0 96 96">
            <circle
              cx="50%" cy="50%" r="44"
              opacity="1"
            />
          </svg>
          <svg className={styles.smallGrey} viewBox="0 0 82 82">
            <circle
              cx="50%" cy="50%" r="39"
              opacity="1"
            />
          </svg>
        </div>
      );
    } else if (type === 'content') {
      return (
        <div className={classes} style={style}>
          <svg className={styles.orange} viewBox="0 0 100 100">
            <circle
              cx="50%" cy="50%" r="51"
              opacity="0.65"
            />
          </svg>
          <svg className={styles.midGrey} viewBox="0 0 100 100">
            <circle
              cx="50%" cy="50%" r="48"
              opacity="0.65"
            />
          </svg>
          <svg className={styles.smallGrey} viewBox="0 0 100 100">
            <circle
              cx="50%" cy="50%" r="51"
              opacity="0.65"
            />
          </svg>
        </div>
      );
    } else if (type === 'page_old') {
      return (
        <div className={classes} style={style}>
          <svg className={styles.orange} viewBox="0 0 102 102">
            <circle
              cx="50%" cy="50%" r="51"
              opacity="0.85"
            />
          </svg>
          <svg className={styles.midGrey} viewBox="0 0 96 96">
            <circle
              cx="50%" cy="50%" r="48"
              opacity="0.65"
            />
          </svg>
          <svg className={styles.smallGrey} viewBox="0 0 82 82">
            <circle
              cx="50%" cy="50%" r="41"
              opacity="0.5"
            />
          </svg>
        </div>
      );
    }

    return <div className={classes} style={style} />;
  }
}
