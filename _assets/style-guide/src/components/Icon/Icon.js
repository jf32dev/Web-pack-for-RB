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
import classNames from 'classnames';

/**
 * Renders an Icon.
 */
export default class Icon extends Component {
  static propTypes = {
    /** Vaid btc-font icon name */
    name: PropTypes.string.isRequired,

    /** CSS color property */
    colour: PropTypes.string,

    /** Valid size */
    size: PropTypes.oneOf([32, 48, 64, 96, 112, 128, 144, 160, 176, 192]),

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { name, colour, size, className, style, ...rest } = this.props;
    const classes = classNames({
      [`icon-${name}`]: true,
      [`icon-${size}`]: size
    }, className);

    const iconStyle = {
      ...style,
      color: colour
    };

    return (
      <span className={classes} style={iconStyle} {...rest} />
    );
  }
}
