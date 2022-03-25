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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

export default class ItemSelected extends Component {
  static propTypes = {
    index: PropTypes.number,
    canRemove: PropTypes.bool,
    label: PropTypes.string,
    status: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    onRemoveClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleRemoveClick(event) {
    this.props.onRemoveClick(event, this.props);
  }

  render() {
    const { canRemove, label, value, status } = this.props;
    const styles = require('./MultiSelect.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      item: true,
      error: status === 'error'
    });

    return (
      <li className={classes} data-name={value} title={label}>
        <span>{label}</span>
        {canRemove && <span className={styles.deleteItem} onClick={this.handleRemoveClick} />}
      </li>
    );
  }
}
