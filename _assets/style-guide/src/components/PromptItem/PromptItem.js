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

/**
 * Displayed by the Prompts smart-component, connected to the prompts store.
 */
export default class PromptItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    children: PropTypes.node,

    /** Prompt style */
    type: PropTypes.oneOf(['chat', 'error', 'info', 'notification', 'success', 'warning']),

    /** Delay in seconds */
    autoDismiss: PropTypes.number,

    /** Dispays a 'x' and can be dismissed by user */
    dismissible: PropTypes.bool,

    /** Pass a string URL if you want the prompt to redirect on click */
    link: PropTypes.string,

    /** Handler for the <code>link</code> prop. Returns prompt ID and link string. */
    onLinkClick: PropTypes.func,
    onDismiss: PropTypes.func.isRequired,

    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const { autoDismiss, onDismiss } = this.props;

    if (typeof autoDismiss === 'number' && typeof onDismiss === 'function') {
      this.timer = window.setTimeout(this.handleDismissTimeout, autoDismiss * 1000);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  handleClick(event) {
    event.preventDefault();

    const { id, link, onLinkClick } = this.props;
    if (typeof link === 'string' && typeof onLinkClick === 'function') {
      onLinkClick(id, link);
    }
  }

  handleDismissTimeout(event) {
    this.props.onDismiss(event, this.props.id);
  }

  handleDismissClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const { onDismiss } = this.props;
    if (typeof onDismiss === 'function') {
      onDismiss(event, this.props.id);
    }
  }

  render() {
    const { title, message, children, type, dismissible, link } = this.props;
    const styles = require('./PromptItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PromptItem: true,
      chatPrompt: type === 'chat',
      errorPrompt: type === 'error',
      infoPrompt: type === 'info',
      notificationPrompt: type === 'notification',
      successPrompt: type === 'success',
      warningPrompt: type === 'warning',
      isLink: link
    });

    return (
      <div
        className={classes} data-id="prompts" style={this.props.style}
        onClick={this.handleClick}
      >
        {title && <h4>{title}</h4>}
        {message && <p>{message}</p>}
        {children && children}
        {dismissible && <span onClick={this.handleDismissClick} className={styles.dismiss} />}
      </div>
    );
  }
}
