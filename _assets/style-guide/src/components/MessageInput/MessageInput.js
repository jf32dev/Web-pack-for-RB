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
import classNames from 'classnames/bind';
import Textarea from 'components/Textarea/Textarea';

/**
 * MessageInput is a wrapper for an autosizing <code>Textarea</code> with alternate styles.
 * It is currently used by <code>ChatMessageInput</code>, <code>CommentInput</code>, <code>PraiseInput</code>.
 */
export default class MessageInput extends Component {
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

    /** Number of rows to display - maxHeight set to 7rem  in CSS */
    rows: PropTypes.number,

    /** Value for input */
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    onChange: function(props) {
      if (props.value && typeof props.onChange !== 'function') {
        return new Error('onChange is required when value is provided.');
      }
      return null;
    },

    onKeyDown: PropTypes.func,

    /** Triggers on resize  */
    onResize: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    rows: 3
  };

  constructor(props) {
    super(props);

    // refs
    this.input = null;
  }

  render() {
    const styles = require('./MessageInput.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      MessageInput: true
    }, this.props.className);

    return (
      <Textarea
        {...this.props}
        ref={(c) => { this.input = c; }}
        maxLength={1000}
        autosize
        onResize={this.props.onResize}
        className={classes}
      />
    );
  }
}
