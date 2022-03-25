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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import MessageInput from 'components/MessageInput/MessageInput';
import UserThumb from 'components/UserThumb/UserThumb';

/**
 * This is an <em>uncontrolled</em> component. It manages it's own message state.
 * Makes use of <code>MessageInput</code>.
 */
export default class CommentInput extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,

    /** Required if a comment reply */
    parentId: PropTypes.number,
    placeholderText: PropTypes.string,
    noteText: PropTypes.string,

    authString: PropTypes.string,

    /** Callback when comment is submitted (press enter). <code>parentId</code> and <code>message</code> are passed in the callback. */
    onSubmit: PropTypes.func.isRequired,
    onEmptyBlur: PropTypes.func
  };

  static defaultProps = {
    parentId: 0,
    placeholderText: 'Write a comment...',
    noteText: 'Shift + Enter for line break'
  };

  constructor(props) {
    super(props);
    this.state = { message: '', showNote: false };
    autobind(this);

    this.focusInput = debounce(this.focusInput.bind(this), 150);

    // Clicking 'reply' toggles the comment input
    // and triggers a blur event
    // set a timeout equal to the animation delay to
    // stop both toggling at the same time
    // not perfect but it works
    this.handleInputBlur = debounce(this.handleInputBlur.bind(this), 150);

    // refs
    this.messageInput = null;
  }

  componentDidMount() {
    if (this.props.parentId) {
      this.messageInput.input.focus();
    }
  }

  focusInput() {
    this.messageInput.input.focus();
  }

  handleInputBlur(event) {
    if (!this.state.message) {
      const { onEmptyBlur } = this.props;
      if (typeof onEmptyBlur === 'function') {
        onEmptyBlur(event);
      }
    }
    this.setState({ showNote: false });
  }

  handleInputFocus() {
    this.setState({ showNote: true });
  }

  handleInputChange(event) {
    this.setState({ message: event.target.value });
  }

  handleInputKeyDown(event) {
    // handle return clicked
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();

      this.messageInput.input.blur();
      this.setState({ message: '' });

      const { onSubmit } = this.props;
      if (typeof onSubmit === 'function') {
        onSubmit(this.props.parentId, this.state.message);
      }
    }
  }

  render() {
    const { showNote } = this.state;
    const { user, parentId, placeholderText, noteText } = this.props;
    const styles = require('./CommentInput.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CommentInput: true,
      commentReply: parentId
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.inputWrap}>
          <div className={styles.user}>
            <UserThumb {...user} width={36} authString={this.props.authString} />
          </div>
          <MessageInput
            ref={(c) => { this.messageInput = c; }}
            rows={parentId ? 1 : 3}
            placeholder={placeholderText}
            value={this.state.message}
            onBlur={this.handleInputBlur}
            onFocus={this.handleInputFocus}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            className={styles.input}
          />
        </div>
        <p className={styles.note} style={{ display: showNote ? 'block' : 'none' }}>{noteText}</p>
      </div>
    );
  }
}
