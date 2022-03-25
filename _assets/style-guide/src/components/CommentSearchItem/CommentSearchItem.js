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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import UserItem from 'components/UserItem/UserItem';

export default class CommentSearchItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    message: PropTypes.string,
    searchResult: PropTypes.object,

    /** Valid comment user data */
    author: PropTypes.object,

    /** Valid story data */
    story: PropTypes.object,

    showThumb: PropTypes.bool,
    selected: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    searchResult: {},
    authString: ''
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, this);
    }
  }

  render() {
    const {
      id,
      message,
      searchResult,
      author,
      story,
      showThumb,
      selected,
      authString,
      className,
      style
    } = this.props;
    const anchorUrl = '/story/' + (story.permId || story.id) + '&comment=' + id;
    const styles = require('./CommentSearchItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      CommentSearchItem: true,
      selected: selected
    }, className);

    return (
      <div className={itemClasses} style={style}>
        <UserItem
          {...author}
          inList
          showThumb={showThumb}
          thumbSize="small"
          authString={authString}
          onClick={this.props.onClick}
        >
          {author.name && <div className={styles.info}>
            <a
              href={anchorUrl}
              title={author.name}
              className={styles.name}
              onClick={this.handleClick}
              dangerouslySetInnerHTML={{ __html: author.name }}
            />
            {author.title && <span className={styles.title}>{author.title}</span>}
          </div>}
          {message && <div
            className={styles.comment}
            dangerouslySetInnerHTML={{ __html: searchResult.message || message }}
          />}
        </UserItem>
      </div>
    );
  }
}
