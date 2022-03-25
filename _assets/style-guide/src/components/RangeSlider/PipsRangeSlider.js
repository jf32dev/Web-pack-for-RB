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
import RangeSlider from 'components/RangeSlider/RangeSlider';

/**
 * SecurityGeneral Component for edit Security General information
 */
export default class PipsRangeSlider extends PureComponent {
  static propTypes = {

    maxPips: PropTypes.number,

    longPipInterval: PropTypes.number,

    shortPipClassName: PropTypes.string,

    longPipClassName: PropTypes.string,

    minPipNumberClassName: PropTypes.string,

    maxPipNumberClassName: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    maxPips: 20,
    longPipInterval: 5,
    shortPipClassName: '',
    longPipClassName: '',
    minPipNumberClassName: '',
    maxPipNumberClassName: '',
  };

  render() {
    const {
      maxPips,
      longPipInterval,
      shortPipClassName,
      longPipClassName,
      minPipNumberClassName,
      maxPipNumberClassName,
      ...restProps
    } = this.props;
    const styles = require('./RangeSlider.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PipsRangeSlider: true
    }, this.props.className);

    const pips = [];
    for (let i = 0; i <= maxPips; i += 1) {
      pips.push(
        <span className={styles.Pips} key={i} style={{ left: `${100 / maxPips * i}%` }}>
          {i % longPipInterval === 0 && <span className={`${styles.longPinps} ${longPipClassName}`} />}
          {i % longPipInterval !== 0 && <span className={`${styles.shortPinps} ${shortPipClassName}`} />}
          {i === 0 && <span className={`${styles.minPinps} ${minPipNumberClassName}`}>0</span>}
          {i === maxPips && <span className={`${styles.maxPinps} ${maxPipNumberClassName}`}>100</span>}
        </span>
      );
    }

    return (
      <div className={classes} style={this.props.style}>
        <RangeSlider
          {...restProps}
          min={0}
          max={100}
          withBars
          pushable
          showTooltip
        />
        <div className={styles.pipsContainer}>
          {pips}
        </div>
      </div>
    );
  }
}
