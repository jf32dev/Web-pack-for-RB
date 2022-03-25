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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Blankslate from 'components/Blankslate/Blankslate';
import Loader from 'components/Loader/Loader';

import CommentSearchItem from 'components/CommentSearchItem/CommentSearchItem';
import FileSearchItem from 'components/FileSearchItem/FileSearchItem';
import MeetingSearchItem from 'components/MeetingSearchItem/MeetingSearchItem';
import NoteItem from 'components/NoteItem/NoteItem';
import StorySearchItem from 'components/StorySearchItem/StorySearchItem';
import UserSearchItem from 'components/UserSearchItem/UserSearchItem';

export default class SearchList extends PureComponent {
  static propTypes = {
    list: PropTypes.array,
    loading: PropTypes.bool,
    loadingMore: PropTypes.bool,
    error: PropTypes.object,

    grid: PropTypes.bool,
    thumbWidth: PropTypes.string,
    showThumb: PropTypes.bool,
    showFollow: PropTypes.bool,
    onFollowClick: PropTypes.func,

    rootUrl: PropTypes.string,

    /** Sets <code>isActive</code> on list item if ID matches */
    activeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /** DEPRECATED - use activeId instead */
    selectedId: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use activeId.'
        );
      }
      return null;
    },

    emptyHeading: PropTypes.string,
    emptyMessage: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,

    itemClassName: PropTypes.string,
    itemStyle: PropTypes.object,

    authString: PropTypes.string,
    currentUser: PropTypes.object,

    onItemClick: PropTypes.func.isRequired,
    onScroll: PropTypes.func,
    searchType: PropTypes.string,
  };

  static defaultProps = {
    list: [],
    emptyHeading: 'No results',
    emptyMessage: 'Empty message has not been set'
  };

  renderItem(item) {
    let Comp;
    let isSameUser = false;
    switch (item.type) {
      case 'story':
      case 'feed':
        Comp = StorySearchItem;
        break;
      case 'comment':
        Comp = CommentSearchItem;
        break;
      case 'people':
        Comp = UserSearchItem;
        if (this.props.currentUser && this.props.currentUser.id === item.id) {
          isSameUser = true;
        }
        break;
      case 'file':
        Comp = FileSearchItem;
        break;
      case 'meeting':
        Comp = MeetingSearchItem;
        break;
      case 'note':
        Comp = NoteItem;
        break;
      default:
        break;
    }

    if (!Comp) {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <code>{JSON.stringify(item)}</code>
        </div>);
    }

    return (
      <Comp
        searchType={this.props.searchType}
        rootUrl={this.props.rootUrl}
        authString={this.props.authString}
        showThumb={item.type !== 'file' && this.props.showThumb} // Overflow list can not show thumbnail
        showFollow={!isSameUser && this.props.showFollow && typeof this.props.onFollowClick === 'function'}
        onFollowClick={this.props.onFollowClick}
        isActive={item.id && item.id === this.props.activeId}
        onClick={this.props.onItemClick}
        onInfoIconClick={this.props.onInfoIconClick}
        grid={this.props.grid}
        inList
        className={this.props.itemClassName}
        style={this.props.itemStyle}
        searchKeyword={this.props.searchKeyword}
        {...item}
        {...this.props.itemProps}
        onSetStoryReferrerPath={this.props.onSetStoryReferrerPath}
        onHandleBookmarkClick={this.props.onHandleBookmarkClick}
        bookmarkLoading={this.props.bookmarkLoading}
        currentFileId={this.props.currentFileId}
        onHandleShareFileClick={this.props.onHandleShareFileClick}
        onDownloadClick={this.props.onDownloadClick}
        hasShare={this.props.hasShare}
      />
    );
  }

  render() {
    const {
      list,
      loading,
      loadingMore,
      error,

      emptyHeading,
      emptyMessage,

      onScroll,

      style
    } = this.props;
    const styles = require('./SearchList.less');
    const cx = classNames.bind(styles);
    const listClasses = cx({
      List: !this.props.grid,
      grid: this.props.grid,
      inline: this.props.inline
    }, this.props.className);

    // Loading
    if (loading) {
      return (
        <div className={styles.listLoader}>
          <Loader type="content" />
        </div>
      );

      // Error
    } else if (error && error.message && !list.length) {
      return <Blankslate icon="error" message={error.message || 'Unknown error'} />;

      // Empty
    } else if (!loading && !list.length) {
      return <Blankslate icon="content" heading={emptyHeading} message={emptyMessage} />;
    }

    return (
      <ul className={listClasses} onScroll={onScroll} style={style}>
        {list.length > 0 && list.map((item, index) => (
          <li key={index}>{this.renderItem(item)}</li>
        ))}
        {loadingMore && <li className={styles.loadingMore}>
          <Loader type="content" />
        </li>}
      </ul>
    );
  }
}
