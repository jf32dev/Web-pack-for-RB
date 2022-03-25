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
import AutosizeInput from 'react-input-autosize';

/**
 * Text inputs are used for capturing single-line user submitted data. For multiple lines use a <a href="/Textarea">Textarea</a>.
 * Text is a <a href="https://facebook.github.io/react/docs/forms.html" target="_blank">Controlled Component</a>, an onChange handler must be provided to change the value.
 */
export default class Text extends PureComponent {
  static propTypes = {
    /** id attribute for input, required when <code>label</code> is provided */
    id: function(props) {
      if (props.label && typeof props.id !== 'string') {
        return new Error('id is required when label is provided.');
      }
      return null;
    },

    /** 'plain-text' will render <span/> rather than <input/>, could be useful for non-editable form filed */
    type: PropTypes.oneOf(['email', 'number', 'password', 'tel', 'text', 'plain-text']),

    /** Text to place above input */
    label: PropTypes.string,

    /** Placeholder to display when value is empty */
    placeholder: PropTypes.string,

    /** value for input */
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    /** Autosizes input */
    autosize: PropTypes.bool,

    /** disabled property for input */
    disabled: PropTypes.bool,

    /** valid btc-font icon */
    icon: PropTypes.string,

    /** Requires a width to be set */
    inline: function(props) {
      if (props.inline && typeof props.width !== 'string') {
        return new Error('width is required when inline is provided.');
      }
      return null;
    },

    /** displays a 'x', onClearClick must be provided for controlled component */
    showClear: PropTypes.bool,

    /** displays a 'copy' button, onCopyClick must be provided for controlled component */
    showCopy: PropTypes.bool,

    /** set fixed width */
    width: PropTypes.string,

    /** Callback to update value for controlled component */
    onChange: function(props) {
      if (props.value && typeof props.onChange !== 'function') {
        return new Error('onChange is required when value is provided.');
      }
      return null;
    },

    /** Callback to update value for controlled component */
    onClearClick: function(props) {
      if (props.showClear && typeof props.onClearClick !== 'function') {
        return new Error('onClearClick is required when showClear is enabled.');
      } else if (props.showClear && typeof props.onChange !== 'function') {
        return new Error('showClear can only be used as a controlled component.');
      }
      return null;
    },

    /** Callback to copy value for controlled component */
    onCopyClick: function(props) {
      if (props.showCopy && typeof props.onCopyClick !== 'function') {
        return new Error('onCopyClick is required when showCopy is enabled.');
      } else if (props.showCopy && typeof props.onChange !== 'function') {
        return new Error('showCopy can only be used as a controlled component.');
      }
      return null;
    },

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    type: 'text',
    width: '100%',
    strings: {
      copy: 'Copy'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.text = null;
  }

  blur() {
    this.text.blur();
  }

  focus() {
    this.text.focus();
  }

  select() {
    this.text.select();
  }

  render() {
    const {
      id,
      label,
      autosize,
      disabled,
      icon,
      inline,
      showClear,
      showCopy,
      showWarning,
      width,
      onClearClick,
      onCopyClick,
      className,
      style,
      strings,
      ...other
    } = this.props;
    const styles = require('./Text.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Text: true,
      autosize: autosize,
      disabled: disabled,
      inline: inline,
      hasIcon: icon,
      hasClear: showClear,
      hasCopy: showCopy,
      hasWarning: showWarning
    }, className);

    const inputStyles = {
      width: width
    };

    const CustomTag = autosize ? AutosizeInput : 'input';

    return (
      <div className={classes + (icon ? ' icon-' + icon : '')} style={style}>
        {label && <label htmlFor={id}>{label}</label>}
        {other.type === 'plain-text' && <span
          className={styles.plainText}
          style={inputStyles}
        >{other.value}</span>}
        {other.type !== 'plain-text' && <CustomTag
          autoComplete="off"
          ref={(c) => { this.text = c; }}
          id={id}
          disabled={disabled}
          style={inputStyles}
          {...other}
        />}
        {showClear && <span
          data-action="clear"
          className={styles.clear}
          onClick={onClearClick}
        />}
        {showCopy && <span
          data-action="copy"
          className={styles.copy}
          onClick={onCopyClick}
        >{strings.copy || 'Copy'}</span>}
        {showWarning && <span
          data-action="warning"
          className={styles.warning}
        />}
      </div>
    );
  }
}
