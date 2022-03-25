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
import classNames from 'classnames/bind';

/**
 * Checkbox
 */
export default class Checkbox extends PureComponent {
  static propTypes = {
    /** id attribute for input and label */
    inputId: PropTypes.string,

    /** label text that appears after the checkbox */
    label: PropTypes.string,

    /** name attribute for input */
    name: PropTypes.string.isRequired,

    /** value attribute for input */
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    /** checked attribute for <em>controlled</em> component */
    checked: PropTypes.bool,

    /** whether checkbox should display an indeterminate state.  */
    indeterminateValue: PropTypes.bool,

    /** checked attribute for input if an <em>uncontrolled</em> component */
    defaultChecked: PropTypes.bool,

    /** disabled attribute for input */
    disabled: PropTypes.bool,

    /** sets to <code>inline-block */
    inline: PropTypes.bool,

    /** displays a required indicator */
    required: PropTypes.bool,

    /** Render children in wrapper (useful for tooltips) */
    children: PropTypes.node,

    /** must be provided if a <em>controlled</em> component */
    onChange: function(props) {
      if (props.value && typeof props.onChange !== 'function') {
        return new Error('onChange is required when value is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    value: '',
  };

  render() {
    const {
      inputId,
      label,
      name,
      value,
      inline,
      required,
      children,
      indeterminateValue,
      className,
      style,
      ...others
    } = this.props;
    const styles = require('./Checkbox.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Checkbox: true,
      disabled: this.props.disabled,
      inline: inline,
      required: required,
      showIndeterminateValue: indeterminateValue
    }, className);

    // Generate inputId if none passed
    let id = inputId;
    if (!id) {
      id = name ? (name + '-' + value) : ('checkbox-' + value);
    }

    return (
      <div className={classes} style={style}>
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          {...others}
        />
        <label htmlFor={id}>
          {label && label}
        </label>
        {children}
      </div>
    );
  }
}
