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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

export default class SelectSearchValue extends Component {
  static propTypes = {
    children: PropTypes.node,
    placeholder: PropTypes.string,
    value: PropTypes.object
  };

  render() {
    const { children, placeholder, value } = this.props;
    const styles = require('./UserMetadataItem.less');
    const cx = classNames.bind(styles);

    const classes = cx({
      isLocked: !!this.props.disabled,
      'icon-lock': !!this.props.disabled,
    });

    return (
      <div className={classes + ' Select-value'} title={value.attributeValue}>
        <span className="Select-value-label">
          {children && <b>{value.attribute.name}: </b>}
          {children ? value.attributeValue : placeholder}
        </span>
      </div>
    );
  }
}
