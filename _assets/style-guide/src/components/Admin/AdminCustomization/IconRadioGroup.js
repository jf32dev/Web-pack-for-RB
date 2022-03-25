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

import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import SVGIcon from './SVGIcon';

/**
 * IconRadioGroup description
 */
export default class IconRadioGroup extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    selectedValue: PropTypes.string,

    /** Description of customProp2 */
    onChange: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onAnchorClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    selectedValue: 'default',
    strings: {}
  };

  constructor(props) {
    super(props);

    this.list1 = ['default', 'red', 'pink', 'purple'];
    this.list2 = ['blue', 'skyBlue', 'green', 'yellow'];
    autobind(this);

    // refs
    this.input = null;
  }

  handleClick(e) {
    const { dataset } = e.currentTarget;
    const type = _get(dataset, 'type', false);

    if (type) {
      this.input[type].click();
    }
  }

  render() {
    const styles = require('./IconRadioGroup.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      IconRadioGroup: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div>
          {this.list1.map(k => (
            <div key={k}>
              {k === 'default' && <div className={styles[k]} onClick={this.handleClick} data-type={k}><SVGIcon type="deviceAppIcon" /></div>}
              {k !== 'default' && <div
                className={styles[k]} htmlFor={k} onClick={this.handleClick}
                data-type={k}
              />}
              <input
                ref={k}
                type="radio"
                id={k}
                value={k}
                checked={k === this.props.selectedValue}
                onChange={this.props.onChange}
              />
            </div>
          ))}
        </div>
        <div>
          {this.list2.map(k => (
            <div key={k}>
              <div
                className={styles[k]} htmlFor={k} onClick={this.handleClick}
                data-type={k}
              />
              <input
                ref={(c) => { this.input[k] = c; }}
                type="radio"
                id={k}
                value={k}
                checked={k === this.props.selectedValue}
                onChange={this.props.onChange}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
