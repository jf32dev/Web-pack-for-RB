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
import { emojify } from 'react-emojione';
import { FormattedDate, FormattedRelative } from 'react-intl';

import UserItem from 'components/UserItem/UserItem';

export default class ChatRosterItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    presence: PropTypes.number,
    messages: PropTypes.array,

    noteType: PropTypes.oneOf(['message', 'email']),

    isActive: PropTypes.bool,
    unreadCount: PropTypes.number,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    roster: [],
    presence: 0,
    noteType: 'message'
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.elem = null;
  }

  handleClick(event) {
    event.preventDefault();
    this.props.onClick(this, event);
  }

  handlePreventClick(event) {
    event.stopPropagation();
  }

  render() {
    const {
      id,
      name,
      thumbnail,
      presence,
      messages,
      noteType,
      unreadCount,
      isActive
    } = this.props;
    const styles = require('./ChatRosterItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatRosterItem: true
    }, this.props.className);

    const countClass = cx({
      count: true,
      countOver99: unreadCount > 99
    });

    let lastMessage;
    let fixedMessage;
    if (messages && messages.length) {
      lastMessage = messages[messages.length - 1];
      fixedMessage = lastMessage.body;

      if (fixedMessage && fixedMessage.length > 50) {
        fixedMessage = lastMessage.body.substring(0, 50) + '...';
      }
    }

    let dateElem;
    if (noteType === 'message' && lastMessage && lastMessage.time) {
      const startOfToday = new Date().setHours(0, 0, 0, 0);
      //const oneDayAgo = Date.now() - (86400000);
      const twoDaysAgo = Date.now() - (86400000 * 2);

      // Message before midnight of current day
      // e.g. 4:20 PM
      if (lastMessage.time > startOfToday) {
        dateElem = (
          <span className={styles.time} style={{ textTransform: 'uppercase' }}>
            <FormattedDate
              value={lastMessage.time}
              hour="numeric"
              minute="numeric"
              hour12
            />
          </span>
        );

      // Message sent between previous day and two days ago
      // e.g. Yesterday
      } else if (lastMessage.time < startOfToday && lastMessage.time > twoDaysAgo) {
        dateElem = (
          <span className={styles.time} style={{ textTransform: 'capitalize' }}>
            <FormattedRelative
              value={lastMessage.time}
              style="best fit"
            />
          </span>
        );

      // Message older than 2 days
      // e.g. 17 Mar 2016
      } else {
        dateElem = (
          <span className={styles.time}>
            <FormattedDate
              value={lastMessage.time}
              day="2-digit"
              month="short"
              year="numeric"
            />
          </span>
        );
      }
    }

    let noteElem;
    if (noteType === 'email') {
      noteElem = <span className={styles.email}>{this.props.email}</span>;
    } else {
      noteElem = (<div>
        {lastMessage && fixedMessage && <span className={styles.message}>{emojify(fixedMessage, { output: 'unicode' })}</span>}
        {dateElem}
        {unreadCount > 0 && <span className={countClass}>{unreadCount > 99 ? '*' : unreadCount}</span>}
      </div>);
    }

    return (
      <div ref={(c) => { this.elem = c; }} className={classes} onClick={this.handleClick}>
        <UserItem
          id={id}
          name={name}
          thumbnail={thumbnail}
          isActive={isActive}
          inList
          noLink
          showThumb
          thumbSize="small"
          onClick={this.handlePreventClick}
        >
          <div className={styles.info}>
            <div aria-label={name} className={styles.name}>
              {name}
              <span className={styles.presence} data-presence={presence} />
            </div>
            {noteElem}
          </div>
        </UserItem>
      </div>
    );
  }
}
