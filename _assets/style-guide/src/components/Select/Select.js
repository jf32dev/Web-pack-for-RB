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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import VirtualizedSelect from 'react-virtualized-select';

/**
 * Wraps <a href="https://github.com/bvaughn/react-virtualized-select">react-virtualized-select</a> with an optional label.
 */
export default class Select extends PureComponent {
  static propTypes = {
    /** id attribute for input, required when <code>label</code> is provided */
    id: function(props) {
      if (props.label && typeof props.id !== 'string') {
        return new Error('id is required when label is provided.');
      }
      return null;
    },
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.object, PropTypes.string]),
    options: PropTypes.array,

    /** Text to place above input */
    label: PropTypes.string,

    /** Passes className to react-virtualized-select */
    selectClassName: PropTypes.string,

    /** Passes style to react-virtualized-select */
    selectStyle: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.elem = null;
  }

  handleLabelClick(event) {
    event.preventDefault();
    this.elem.focus();
  }

  render() {
    const {
      label,
      selectClassName,
      selectStyle,
      className,
      style,
      ...others
    } = this.props;
    const styles = require('./Select.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Select: true,
      isDisabled: this.props.disabled
    }, className);

    return (
      <div className={classes} style={style}>
        {label && <label
          htmlFor={this.props.id}
          onClick={this.handleLabelClick}
        >
          {label}
        </label>}
        <VirtualizedSelect
          ref={(c) => { this.elem = c; }}
          className={selectClassName}
          style={selectStyle}
          {...others}
        />
      </div>
    );
  }
}
