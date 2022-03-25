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
import _range from 'lodash/range';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Simple stepper with animation
 */
export default class Stepper extends PureComponent {
  static propTypes = {
    labels: PropTypes.array,

    activeStep: PropTypes.number,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    labels: ['Cloud Service', 'Folder Connection', 'User Groups'],
    activeStep: 2,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const styles = require('./Stepper.less');
    const { labels, activeStep } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      Stepper: true
    }, this.props.className);

    const total = labels.length;

    return (
      <div className={classes}>
        {_range(1, total + 1).map(item => (<div key={item}>
          <div className={styles[(item < activeStep && 'tick') || (item === activeStep && 'active') || (item > activeStep && 'number')]}>
            <span>{(item > (activeStep - 1)) && item}</span>
            <label className={styles.label}>{labels[item - 1]}</label>
          </div>
          {(item !== total) && <div className={styles[(item <= (activeStep - 1)) ? 'lineFinished' : 'lineUnFinished']} /> }
        </div>))}
      </div>
    );
  }
}
