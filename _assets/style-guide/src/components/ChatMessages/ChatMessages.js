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
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Btn from 'components/Btn/Btn';
import Blankslate from 'components/Blankslate/Blankslate';

import ChatMessageItem from './ChatMessageItem';
import ChatMessageInput from './ChatMessageInput';

/**
 * Displays messages between you and a recipient
 */
export default class ChatMessages extends PureComponent {
  static propTypes = {
    /** userId or roomId of recipient */
    userId: PropTypes.number.isRequired,

    messages: PropTypes.array,

    /** body of message currently being typed */
    messageBody: PropTypes.string,

    /** shows pin button - not currently used */
    showPin: PropTypes.bool,

    /** user is currently pinned */
    userIsPinned: PropTypes.bool,

    /** alternate styles */
    size: PropTypes.oneOf(['compact', 'full']),

    /** passed to ChatMessageInput */
    showAttachMenu: PropTypes.bool,

    /** passed to ChatMessageInput */
    focusInputOnMount: PropTypes.bool,

    /** Required when showPin is enabled */
    onPinClick: function(props) {
      if (props.showPin && typeof props.onPinClick !== 'function') {
        return new Error('onPinClick is required when showPin enabled.');
      }
      return null;
    },

    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,
    onAttachClick: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSendClick: PropTypes.func.isRequired,

    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,

    showAuthor: PropTypes.bool,
  };

  static defaultProps = {
    messages: [],
    size: 'full',
    showAttachMenu: true,
    focusInputOnMount: true,
    authString: '',
    showAuthor: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedMessages: this.sortByTime(this.props.messages)
    };

    // refs
    this.messageWrap = null;
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Sort messages
    if (nextProps.messages !== this.props.messages) {
      this.setState({
        sortedMessages: this.sortByTime(nextProps.messages)
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.messages && this.props.messages !== prevProps.messages) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.messageWrap) {
      this.messageWrap.scrollTop = this.messageWrap.scrollHeight;
    }
  }

  // Sort messages by time (latest last)
  sortByTime(list) {
    return list.slice(0).sort((a, b) => a.time - b.time);
  }

  render() {
    const {
      userId,
      messages,
      messageBody,
      showPin,
      userIsPinned,
      size,
      onPinClick,
      onAnchorClick,
      onFileClick,
      onStoryClick,
      authString,
      style,
      showAuthor,
    } = this.props;
    const styles = require('./ChatMessages.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatMessages: true,
      isCompact: size === 'compact'
    }, this.props.className);

    const pinBtnClasses = cx({
      pinBtn: true,
      active: userIsPinned
    }, this.props.className);

    return (
      <div className={classes} style={style}>
        {!messages.length && <div className={styles.empty}>
          <Blankslate icon="chat" iconSize={192} middle />
        </div>}
        {messages.length > 0 && <div
          ref={(c) => { this.messageWrap = c; }}
          className={styles.messageWrap}
        >
          <TransitionGroup>
            {this.state.sortedMessages.map((msg, index) => (
              <CSSTransition
                key={userId + '-' + index}
                classNames="fade"
                timeout={250}
                exit={false}
              >
                <ChatMessageItem
                  size={size}
                  showAuthor={showAuthor}
                  authString={authString}
                  onAnchorClick={onAnchorClick}
                  onFileClick={onFileClick}
                  onStoryClick={onStoryClick}
                  {...msg}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>}
        {userId > 0 && <div className={styles.inputWrap}>
          {showPin && <Btn
            icon="pin"
            inverted={userIsPinned}
            onClick={onPinClick}
            className={pinBtnClasses}
          />}
          <ChatMessageInput
            userId={userId}
            value={messageBody}
            size={size}
            showAttachMenu={this.props.showAttachMenu}
            focusInputOnMount={this.props.focusInputOnMount}
            onAttachClick={this.props.onAttachClick}
            onChange={this.props.onInputChange}
            onSendClick={this.props.onSendClick}
          />
        </div>}
      </div>
    );
  }
}
