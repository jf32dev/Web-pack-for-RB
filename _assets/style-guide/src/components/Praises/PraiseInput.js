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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import MessageInput from 'components/MessageInput/MessageInput';

/**
 * This is an <em>uncontrolled</em> component. It manages it's own message state.
 * Makes use of <code>MessageInput</code>.
 */
export default class PraiseInput extends Component {
  static propTypes = {
    title: PropTypes.string,
    onAddPraise: PropTypes.func.isRequired,
  };

  static defaultProps = {
    title: 'Write a praise'
  };

  constructor(props) {
    super(props);
    this.state = { message: '' };
    autobind(this);
  }

  focusInput() {
    this.messageInput.input.focus();
  }

  handleInputKeyDown(event) {
    // handle return clicked
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();

      this.messageInput.input.blur();
      this.setState({ message: '' });

      const { onAddPraise } = this.props;
      if (typeof onAddPraise === 'function') {
        onAddPraise(this.state.message);
      }
    }
  }

  handleInputChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    const styles = require('./Praises.less');

    return (
      <div className={styles.praiseContainerWrap}>
        <h4>{this.props.title}</h4>
        <div className={styles.inputWrap}>
          <div className={styles.input}>
            <MessageInput
              ref={(c) => { this.messageInput = c; }}
              rows={1}
              value={this.state.message}
              onChange={this.handleInputChange}
              onKeyDown={this.handleInputKeyDown}
            />
          </div>
        </div>
      </div>
    );
  }
}
