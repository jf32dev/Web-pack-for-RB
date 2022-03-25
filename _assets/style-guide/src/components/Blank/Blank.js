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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';

/**
 * Blank description
 */
export default class Blank extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    customProp1: PropTypes.string,

    /** Description of customProp2 */
    customProp2: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: []
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const styles = require('./Blank.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Blank: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <p>{this.props.customProp1}</p>
        <Btn onClick={this.props.onClick}>Click Me</Btn>
      </div>
    );
  }
}
