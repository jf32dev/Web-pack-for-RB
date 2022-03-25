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
import { FormattedDate, FormattedMessage } from 'react-intl';

import UserItem from 'components/UserItem/UserItem';
import UserThumb from 'components/UserThumb/UserThumb';

/**
 * Clickable ShareRecipientItem generally displayed in a List.
 */
export default class ShareRecipientItem extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    email: PropTypes.string.isRequired,

    /** valid user object if shared with hub user */
    user: PropTypes.object,

    /** Number of files in share */
    fileCount: PropTypes.number,

    /** Number of files the user has viewed */
    fileViewed: PropTypes.number,

    /** Unix timestamp */
    viewedAt: PropTypes.number,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Allows nesting the default <code>/share/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** DEPRECATED - use isActive instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive instead.'
        );
      }
      return null;
    },

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    fileCount: 0,
    fileViewed: 0,
    viewedAt: 0,
    rootUrl: ''
  };

  constructor(props) {
    super(props);
    //this.state = {};
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const {
      id,
      email,
      user,
      fileCount,
      fileViewed,
      viewedAt,
      grid,
      isActive,
      noLink,
      className,
      style
    } = this.props;
    const anchorUrl = this.props.rootUrl + '/user/' + id;
    const styles = require('./ShareRecipientItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      ShareRecipientItem: true,
      isActive: isActive,
      listItem: !grid
    }, className);

    const itemContent = (
      <div className={styles.wrapper}>
        <div className={styles.user}>
          {user && <UserItem
            noLink
            thumbSize="small"
            {...this.props.user}
          />}
          {!user && <div className={styles.emailUser}>
            <UserThumb name={email} />
            <span className={styles.email}>{email}</span>
          </div>}
        </div>
        {viewedAt > 0 && <span className={styles.viewed}>
          <strong>
            <FormattedMessage
              id="viewed"
              defaultMessage="Viewed"
            />
          </strong>
          <FormattedDate
            value={viewedAt * 1000}
            day="numeric"
            month="short"
            year="numeric"
            hour="numeric"
            minute="numeric"
          />
        </span>}
        {fileCount > 0 && !fileViewed && <span className={styles.download}>
          <FormattedMessage
            id="no-files-downloaded"
            defaultMessage="No files downloaded"
          />
        </span>}
        {fileCount > 0 && fileViewed > 0 && <span className={styles.download}>
          <FormattedMessage
            id="x-of-n-files-downloaded"
            defaultMessage="{fileViewed} of {fileCount, plural, one {# file} other {# files}} downloaded"
            values={{ fileViewed, fileCount }}
          />
        </span>}
      </div>
    );

    if (noLink) {
      return (
        <div className={itemClasses} onClick={this.handleClick}>
          {itemContent}
        </div>
      );
    }

    return (
      <div className={itemClasses} style={style}>
        <a href={anchorUrl} onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
