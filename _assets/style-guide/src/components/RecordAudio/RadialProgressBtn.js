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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

/**
 * the px is hard code at the moment
 */
export default class RadialProgressBtn extends PureComponent {
  static propTypes = {
    /** max 100, min 0, number */
    percentage: PropTypes.number,

    /** progress bar width  */
    strokeWidth: PropTypes.number,

    /** border width */
    borderWidth: PropTypes.number,

    /** icon of the button */
    icon: PropTypes.string,

    onClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    percentage: 0,
    strokeWidth: 10,
    borderWidth: 3,
    initialAnimation: false,
    icon: 'alfresco',
  };

  render() {
    const { strokeWidth, borderWidth, icon, onClick, percentage, className, style } = this.props;

    const radius = (50 - strokeWidth / 2);
    const borderRadius = (50 - borderWidth / 2);
    const pathDescription = `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;

    const pathDescriptionDefault = `
      M 50,50 m 0,-${borderRadius}
      a ${borderRadius},${borderRadius} 0 1 1 0,${2 * borderRadius}
      a ${borderRadius},${borderRadius} 0 1 1 0,-${2 * borderRadius}
    `;

    const progressValue = percentage > 100 ? 100 : percentage;
    const diameter = Math.PI * 2 * radius;

    /** updating value */
    const progressStyle = {
      strokeDasharray: `${diameter}px ${diameter}px`,
      strokeDashoffset: `${((100 - progressValue) / 100 * diameter)}px`,
    };

    const styles = require('./RadialProgressBtn.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      main: true
    }, className);

    return (
      <div className={classes} onClick={onClick} style={style}>
        <svg
          viewBox="0 0 100 100"
        >
          <path
            className={styles.trail}
            d={pathDescriptionDefault}
            strokeWidth={borderWidth}
            fillOpacity={0}
          />
          <path
            className={styles.path}
            d={pathDescription}
            strokeWidth={strokeWidth}
            fillOpacity={0}
            style={progressStyle}
          />
        </svg>
        <div className={`${styles.icon} icon-${icon}`} />
      </div>
    );
  }
}
