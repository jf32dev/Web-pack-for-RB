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

import uniqueId from 'lodash/uniqueId';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

/**
 * Radio inputs are controlled components, an onChange handler must be provided to change the checked state.
 */
export default class Radio extends PureComponent {
  static propTypes = {
    /** id attribute for input and label */
    inputId: PropTypes.string,

    /** label text that appears after the radio */
    label: PropTypes.string,

    /** name attribute for input - must be unique if not grouped */
    name: PropTypes.string,

    /** value attribute for input */
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    /** checked attribute for <em>controlled</em> component */
    checked: PropTypes.bool,

    /** checked attribute for <em>uncontrolled</em> component */
    defaultChecked: PropTypes.bool,

    /** disabled attribute for input */
    disabled: PropTypes.bool,

    /** sets to <code>inline-block</code> */
    inline: PropTypes.bool,

    /** Radio colour - used to indicate share status */
    colour: PropTypes.oneOf(['red', 'orange', 'green']),

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
    value: uniqueId()
  };

  render() {
    const {
      inputId,
      label,
      name,
      value,
      disabled,
      inline,
      colour,
      className,
      style,
      ...others
    } = this.props;
    const styles = require('./Radio.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Radio: true,
      disabled: disabled,
      inline: inline,
      red: colour === 'red',
      orange: colour === 'orange',
      green: colour === 'green'
    }, className);

    // Generate inputId if none passed
    let id = inputId;
    if (!id) {
      id = name ? (name + '-' + value) : ('radio-' + value);
    }

    return (
      <div className={classes} style={style}>
        <input
          type="radio"
          id={id}
          value={value}
          disabled={disabled}
          {...others}
        />
        <label htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }
}
