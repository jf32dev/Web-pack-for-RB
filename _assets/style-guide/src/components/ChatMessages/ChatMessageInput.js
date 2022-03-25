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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import Textarea from 'components/Textarea/Textarea';

/**
 * Provides a <code>Textarea</code> for Chat messages.
 */
export default class ChatMessageInput extends Component {
  static propTypes = {
    /** userId or roomId of recipient */
    userId: PropTypes.number,

    value: PropTypes.string,

    showAttachMenu: PropTypes.bool,
    focusInputOnMount: PropTypes.bool,

    /** alternate styles */
    size: PropTypes.oneOf(['compact', 'full']),

    attachText: PropTypes.string,
    attachFileText: PropTypes.string,
    attachStoryText: PropTypes.string,
    sendLabel: PropTypes.string,

    onAttachClick: PropTypes.func,
    onChange: PropTypes.func,
    onSendClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    focusInputOnMount: true,
    attachText: 'Attach',
    attachFileText: 'Attach File',
    attachStoryText: 'Attach Story',
    sendLabel: 'Send'
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.messageInput = null;
  }

  componentDidMount() {
    if (this.props.focusInputOnMount) {
      this.messageInput.textarea.textarea.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId && this.props.focusInputOnMount) {
      this.messageInput.textarea.textarea.focus();
    }
  }

  handleKeyDown(event) {
    // handle return clicked
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();

      // trigger send if shift key not held
      // and field not empty
      if (this.props.value.trim() !== '') {
        this.props.onSendClick(event);
      }
    }
  }

  render() {
    const { showAttachMenu, size, attachText, attachFileText, attachStoryText, sendLabel, className } = this.props;
    const styles = require('./ChatMessageInput.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatMessageInput: true,
      isCompact: size === 'compact'
    }, className);

    return (
      <div className={classes} onClick={this.handleClick}>
        {showAttachMenu && <DropMenu
          icon="link"
          title={attachText}
          position={{ top: 'auto', bottom: '2rem', left: 0 }}
          className={styles.attachMenu}
        >
          <ul>
            <li className="icon-file" data-type="file" onClick={this.props.onAttachClick}>{attachFileText}</li>
            <li className="icon-content" data-type="story" onClick={this.props.onAttachClick}>{attachStoryText}</li>
          </ul>
        </DropMenu>}
        <Textarea
          ref={(c) => { this.messageInput = c; }}
          autosize
          maxLength={1000}
          rows={1}
          value={this.props.value}
          onChange={this.props.onChange}
          onKeyDown={this.handleKeyDown}
          className={styles.textarea}
        />
        <div className={styles.btnWrap}>
          <Btn
            title={sendLabel}
            disabled={!this.props.value}
            alt
            borderless
            onClick={this.props.onSendClick}
          >
            {sendLabel}
          </Btn>
        </div>
      </div>
    );
  }
}
