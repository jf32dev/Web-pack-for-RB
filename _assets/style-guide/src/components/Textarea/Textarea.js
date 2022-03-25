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
import TextareaAutosize from 'react-autosize-textarea';

/**
 * Textareas are used for capturing multi-line user submitted data
 */
export default class Textarea extends PureComponent {
  static propTypes = {
    /** id attribute for input, required when <code>label</code> is provided */
    id: function(props) {
      if (props.label && typeof props.id !== 'string') {
        return new Error('id is required when label is provided.');
      }
      return null;
    },

    /** Text to place above input */
    label: PropTypes.string,

    /** Placeholder to display when value is empty */
    placeholder: PropTypes.string,

    /** Number of rows to display */
    rows: PropTypes.number,

    /** Value for input */
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    /** Autosizes textarea */
    autosize: PropTypes.bool,

    disabled: PropTypes.bool,
    width: PropTypes.string,
    resize: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

    onChange: function(props) {
      if (props.value && typeof props.onChange !== 'function') {
        return new Error('onChange is required when value is provided.');
      }
      return null;
    },

    /** Triggers on resize when using autosize  */
    onResize: PropTypes.func,

    /** style prop passed to <textarea> - useful to set maxHeight */
    textareaStyles: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    rows: 2,
    width: '100%'
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.textarea = null;
  }

  getValue() {
    return this.textarea.value;
  }

  blur() {
    if (this.props.autosize) {
      this.textarea.textarea.blur();
    } else {
      this.textarea.blur();
    }
  }

  focus() {
    if (this.props.autosize) {
      this.textarea.textarea.focus();
    } else {
      this.textarea.focus();
    }
  }

  render() {
    const {
      id,
      label,
      autosize,
      disabled,
      width,
      resize,
      textareaStyle,
      onResize,
      className,
      style,
      ...other
    } = this.props;
    const styles = require('./Textarea.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Textarea: true,
      disabled: disabled
    }, className);

    const textareaStyles = {
      ...textareaStyle,
      width: width,
      resize: resize
    };

    return (
      <div className={classes} style={style}>
        {label && <label htmlFor={id}>{label}</label>}
        {!autosize && <textarea
          ref={(c) => { this.textarea = c; }}
          id={id}
          style={textareaStyles}
          {...other}
        />}
        {autosize && <TextareaAutosize
          ref={(c) => { this.textarea = c; }}
          id={id}
          style={textareaStyles}
          {...other}
          onResize={onResize}
        />}
      </div>
    );
  }
}
