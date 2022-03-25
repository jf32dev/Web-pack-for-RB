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

import Blankslate from 'components/Blankslate/Blankslate';
import Loader from 'components/Loader/Loader';

import BookmarkItem from 'components/BookmarkItem/BookmarkItem';
import BookmarkItemNew from 'components/BookmarkItemNew/BookmarkItemNew';
import CategoryItem from 'components/CategoryItem/CategoryItem';
import ChannelItem from 'components/ChannelItem/ChannelItem';
import ConfigurationBundleItem from 'components/ConfigurationBundleItem/ConfigurationBundleItem';
import CourseItem from 'components/CourseItem/CourseItem';
import EventItem from 'components/EventItem/EventItem';
import FileItem from 'components/FileItem/FileItem';
import FormItem from 'components/FormItem/FormItem';
import GroupItem from 'components/GroupItem/GroupItem';
import InterestArea from 'components/InterestAreaItem/InterestAreaItem';
import NotificationItem from 'components/NotificationItem/NotificationItem';
import RevisionItem from 'components/RevisionItem/RevisionItem';
import RepoItem from 'components/RepoItem/RepoItem';
import ShareRecipientItem from 'components/ShareRecipientItem/ShareRecipientItem';
import StoryItem from 'components/StoryItem/StoryItem';
import StoryItemArchived from 'components/StoryItemArchived/StoryItemArchived';
import TabItem from 'components/TabItem/TabItem';
import UserItem from 'components/UserItem/UserItem';
import WebItem from 'components/WebItem/WebItem';
import WebItemLegacy from 'components/WebItemLegacy/WebItemLegacy';
import NoteItem from 'components/NoteItem/NoteItem';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import ShareItemNew from 'components/ShareItemNew/ShareItemNew';

/**
 * <code>List</code> will render the appropriate component based on <code>list</code> item <code>type</code>.
 */
export default class List extends PureComponent {
  static propTypes = {
    /** items must have a <code>type</code> */
    list: PropTypes.array,

    /** optional key prefix to add to list items - for cases when displaying multiple lists */
    keyPrefix: PropTypes.string,

    /** Displays loading indicator in place of list */
    loading: PropTypes.bool,

    /** Displays loading indicator at bottom of list */
    loadingMore: PropTypes.bool,

    /** Displays error.message */
    error: PropTypes.object,

    /** Valid btc-font icon - used for Blankslate */
    icon: PropTypes.string,

    /** Pass grid prop to List Item and applies alternate styles */
    grid: PropTypes.bool,

    /** Pass an array of lists to render titles, e.g. <code>[{ title: 'Title', list: [] }]</code> */
    nestedList: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Passed to List Item */
    showThumb: PropTypes.bool,

    /** Passed to UserItem */
    showFollow: PropTypes.bool,

    /** Passed to StoryItem */
    showBadges: PropTypes.bool,

    /** Passed to List Item */
    noLink: PropTypes.bool,

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

    /** Root URL if rendering an item with an anchor tag */
    rootUrl: PropTypes.string,

    /** heading to display if list is empty */
    emptyHeading: PropTypes.string,

    /** message to display if list is empty */
    emptyMessage: PropTypes.string,

    /** Passed to List Item's onClick prop */
    onItemClick: PropTypes.func.isRequired,

    /** List onScroll event */
    onScroll: PropTypes.func,

    /** Pass a custom Component to render each list item */
    itemComponent: PropTypes.func,

    /** Pass properties to list items */
    itemProps: PropTypes.object,

    // TO DO: remove these
    // any item specific props should be attached
    // directly to the item
    // itemProps replaces these
    currentUser: PropTypes.object,
    onDeleteClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onFollowClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,

    itemClassName: PropTypes.string,
    itemStyle: PropTypes.object
  };

  static defaultProps = {
    list: [],
    keyPrefix: '',
    icon: 'content',
    thumbSize: 'large',
    emptyHeading: 'No results',
    emptyMessage: 'Empty message has not been set'
  };

  static contextTypes = {
    settings: PropTypes.object
  };

  constructor(props) {
    super(props);

    // refs
    this.list = null;
  }

  renderItem(item) {
    let Comp = this.props.itemComponent;
    let isSameUser = false;

    if (!Comp) {
      switch (item.type) {
        case 'bookmark':
          Comp = BookmarkItem;
          break;
        case 'bookmarkNew':
          Comp = BookmarkItemNew;
          break;
        case 'category':
          Comp = CategoryItem;
          break;
        case 'channel':
          Comp = ChannelItem;
          break;
        case 'configurationBundle':
          Comp = ConfigurationBundleItem;
          break;
        case 'course':
          Comp = CourseItem;
          break;
        case 'event':
          Comp = EventItem;
          break;
        case 'file':
          Comp = FileItem;
          break;
        case 'form':
          Comp = FormItem;
          break;
        case 'group':
          Comp = GroupItem;
          break;
        case 'interestArea':
          Comp = InterestArea;
          break;
        case 'notification':
          Comp = NotificationItem;
          break;
        case 'repo':
          Comp = RepoItem;
          break;
        case 'revision':
          Comp = RevisionItem;
          break;
        case 'share':
          Comp = ShareItemNew;
          break;
        case 'shareRecipient':
          Comp = ShareRecipientItem;
          break;
        case 'story':
          Comp = StoryItem;
          break;
        case 'newStoryItem': // Type to use new StoryItem design
          Comp = StoryItemNew;
          break;
        case 'archivedStory':
          Comp = StoryItemArchived;
          break;
        case 'tab':
          Comp = TabItem;
          break;
        case 'people':
          Comp = UserItem;
          if (this.props.currentUser && this.props.currentUser.id === item.id) {
            isSameUser = true;
          }
          break;
        case 'web':
          Comp = WebItem;
          break;
        case 'webItemLegacy':
          Comp = WebItemLegacy;
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
          </div>
        );
      }
    }

    let isActive = false;
    const isShare = item.type === 'share' && item.shareSessionId && item.shareSessionId === this.props.activeId;
    const hasId = item.id && item.id === this.props.activeId;
    if (isShare || hasId) isActive = true;

    return (
      <Comp
        isActive={isActive}
        rootUrl={this.props.rootUrl}
        thumbSize={this.props.thumbSize}
        showBadges={this.props.showBadges}
        showThumb={this.props.showThumb}
        noLink={this.props.noLink}
        showFollow={!isSameUser && this.props.showFollow}
        onFollowClick={this.props.onFollowClick}
        onClick={this.props.onItemClick}
        onEditClick={this.props.onEditClick}
        onDeleteClick={this.props.onDeleteClick}
        grid={this.props.grid}
        inList
        authString={this.context.settings.authString}
        className={this.props.itemClassName}
        style={this.props.itemStyle}
        {...item}
        {...this.props.itemProps}
        searchTerm={this.props.searchTerm}
        baseColour={this.props.baseColour}
      />
    );
  }

  render() {
    const {
      list,
      keyPrefix,
      icon,
      loading,
      loadingMore,
      error,

      emptyHeading,
      emptyMessage,

      onScroll,

      style
    } = this.props;
    const styles = require('./List.less');
    const cx = classNames.bind(styles);
    const listClasses = cx({
      List: !this.props.grid,
      grid: this.props.grid,
      inline: this.props.inline,
    }, this.props.className);

    const loaderClasses = cx({
      listLoader: true
    }, this.props.className);

    // Loading
    if (loading) {
      return (
        <div className={loaderClasses} style={style}>
          <Loader type="content" style={{ margin: '0 auto' }} />
        </div>
      );

      // Error
    } else if (error && error.message && !list.length) {
      return (
        <Blankslate
          icon="error"
          heading={error.status || ''}
          message={error.message || 'Unknown error'}
          middle
          style={style}
        />
      );

      // Empty
    } else if (!list.length) {
      return (
        <Blankslate
          icon={icon}
          heading={emptyHeading}
          message={emptyMessage}
          middle
          style={style}
        />
      );
    }

    // Nested list with titles and actions
    if (this.props.nestedList) {
      return (
        <ul
          ref={(c) => { this.list = c; }} data-id="list" onScroll={onScroll}
          className={listClasses} style={style}
        >
          {list.map(nested => (
            <li key={nested.title}>
              <div className={styles.titleContainer}>
                {nested.title && nested.list.length > 0 && <h5 className={styles.listTitle}>
                  {nested.title}
                </h5>}
                { nested.title && nested.list.length > 0 && nested.actions && nested.actions.length > 0 &&
                <ul>
                  {nested.actions.map(item => (<li key={`${keyPrefix}${item.title}`}>
                    <div className={styles.actionItem} onClick={item.handleClick}>{item.title}</div>
                  </li>))}
                </ul>}
              </div>
              <ul className={styles.subList} style={style}>
                {nested.list.map(item => (<li key={`${keyPrefix}${item.type}-${(item.id || item.permId)}`}>
                  {this.renderItem(item)}
                </li>))}
              </ul>
            </li>
          ))}
          {loadingMore && <li className={styles.loadingMore}>
            <Loader type="content" />
          </li>}
        </ul>
      );
    }

    return (
      <ul
        ref={(c) => { this.list = c; }} data-id="list" onScroll={onScroll}
        className={listClasses} style={style}
      >
        {list.map((item, idx) => (
          <li key={`${keyPrefix}${item.type}-${(item.id || item.permId || item.shareSessionId)}-${idx}`}>{this.renderItem(item)}</li>
        ))}
        {loadingMore && <li className={styles.loadingMore}>
          <Loader type="content" />
        </li>}
      </ul>
    );
  }
}
