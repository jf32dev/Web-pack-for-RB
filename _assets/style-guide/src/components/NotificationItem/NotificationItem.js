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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedMessage, FormattedDate, defineMessages, FormattedRelative } from 'react-intl';
import UserItem from 'components/UserItem/UserItem';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  archived: {
    id: 'archived',
    defaultMessage: 'Archived'
  },
  haveExpired: {
    id: 'have-expired',
    defaultMessage: 'have expired'
  },
  hasExpired: {
    id: 'has-expired',
    defaultMessage: 'has expired'
  },
  areScheduledToExpire: {
    id: 'are-scheduled-to-expire',
    defaultMessage: 'are scheduled to expire'
  },
  isScheduledToExpire: {
    id: 'is-scheduled-to-expire',
    defaultMessage: 'is scheduled to expire'
  }
});

/**
 * List of notification items that a user could get.
 */
export default class NotificationItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,

    /** story object that receive the action */
    story: PropTypes.object,

    /** user object who create the action */
    user: PropTypes.object,

    /** avatar to be displayed depending on the action */
    thumbnail: PropTypes.string,

    /** Code to identify action */
    code: PropTypes.string,

    /** Object that receive the Action */
    actionId: PropTypes.number, // TODO - This should be replaced with object channel id, waiting API
    actionType: PropTypes.string,

    date: PropTypes.number,

    grid: PropTypes.bool,
    thumbWidth: PropTypes.string,
    showThumb: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,
    onFollowClick: PropTypes.func,
    isFollowLoading: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    authString: '',
    story: {},
  };

  constructor(props) {
    super(props);
    this.actionTypeAllowed = ['story', 'comment', 'user', 'channel', 'hubshare'];
    this.codeAllowed = [
      // comment
      'comment_replied',
      // story
      'story_annotated',
      'story_commented',
      'story_created',
      'story_promoted',
      'story_shared_author',
      'story_updated',
      'file-expiry',
      // user
      'user_flagged_story',
      'user_followed',
      'user_praised',
      'user_subscribed_to_story',
      'user_unflagged_story',
      // channel
      'user_shared_personal_channel',
      // Hubshare
      // TODO - Hiding until API && Me > Share UI is finished
      //'user_forwarded_hubshare',
      //'user_viewed_hubshare'
    ];
    autobind(this);
  }

  handleClick(e) {
    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(e, this);
    }
  }

  render() {
    const {
      user,
      actionType,
      story,
      code,
      grid,
      showThumb,
      authString,
      className,
      style
    } = this.props;

    if (this.actionTypeAllowed.indexOf(actionType) === -1 || this.codeAllowed.indexOf(code) === -1) {
      return true;
    }

    const { isProtected, isQuicklink, quicklinkUrl, isQuickfile, files, isArchived } = story;

    // Thumbnail
    let thumbnail = '';
    if (this.props.story && !isArchived) {
      thumbnail = this.props.story.thumbnail;
    }
    let thumbWidth = this.props.thumbWidth;
    if (!thumbWidth) thumbWidth = grid ? '200px' : '46px';

    const styles = require('./NotificationItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      NotificationItem: true,
      listItem: !grid,
      gridItem: grid,
      userItem: actionType === 'user',
      selected: this.props.selected
    }, className);

    const itemStyle = {
      ...style,
      width: grid ? thumbWidth + 'px' : 'auto'
    };

    const thumbClasses = cx({
      thumbnail: true,
      listThumbnail: !grid,
      gridThumbnail: grid
    });

    const bgColour = this.props.story && !isArchived ? this.props.story.colour : '#ccc';
    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? bgColour : false,
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : false
    };

    const dateAndTime = (
      <FormattedDate
        value={this.props.date * 1000}
        day="2-digit"
        month="short"
        year="numeric"
        hour="numeric"
        minute="numeric"
      />
    );

    const storyTitle = this.props.story ? this.props.story.title : '';
    const expireDays = this.props.expireDays;
    const expireDateTs = this.props.date * 1000;
    const actionName = this.props.code;
    const userName = this.props.user && this.props.user.name;
    const storyPermId = this.props.story && this.props.story.permId ? this.props.story.permId : 0;
    const userId = this.props.user && this.props.user.id ? this.props.user.id : 0;
    let identifierByType = (actionType === 'story' || actionType === 'comment') ? storyPermId : userId;

    switch (actionType) {
      case 'story':
      case 'comment':
        identifierByType = storyPermId;
        break;
      case 'user':
        identifierByType = userId;
        break;
      case 'channel':
        identifierByType = this.props.actionId;
        break;
      default:
        break;
    }

    let urlBase = actionType;
    if (actionType === 'comment') {
      urlBase = 'story';
    } else if (actionType === 'channel' && code === 'user_shared_personal_channel') {
      urlBase = 'content/personal/channel';
    }

    let anchorUrl = '/' + urlBase + '/' + identifierByType;

    let formattedItemTitle;

    const isArchivedUser = isArchived ? <span>{userName}</span> : <strong>{userName}</strong>;
    const isArchivedStory = isArchived ? <span>{storyTitle}</span> : <strong>{storyTitle}</strong>;

    const strings = generateStrings(messages);
    //#region Helper functions for generating file expiration notification messag;
    /**
     * Generate text for expiration notification according to the tense and quantifiers
     * @param {bool} hasMultipleFiles ie: this notification has more than one files or not
     * @returns {strings} ['have expired', 'has expired', 'is scheduled to expire', 'are scheduled to expire']
     */
    const getExpirePhrase = (hasMultipleFiles) => {
      if (expireDays < 0 && hasMultipleFiles) {
        return strings.haveExpired;
      }

      if (expireDays < 0 && !hasMultipleFiles) {
        return strings.hasExpired;
      }

      if (expireDays >= 0 && hasMultipleFiles) {
        return strings.areScheduledToExpire;
      }

      return strings.isScheduledToExpire;
    };

    /**
     * Generate FormattedString according to files and expire date
     * @function getExpireInfo
     * @returns {<FormattedMessage/>} instance of formatted message ie: String
     */
    const getExpireInfo = () => {
      const hasMultipleFiles = this.props.story.files.length > 1;
      const fileName = this.props.story.files[0] && this.props.story.files[0].description;

      const values = {
        n: this.props.story.files.length,
        action: actionName,
        storyTitle: <strong>{storyTitle}</strong>,
        expirePhrase: getExpirePhrase(hasMultipleFiles),
        expireDate: <FormattedRelative value={expireDateTs} />
      };


      if (!hasMultipleFiles && fileName) {
        return (<FormattedMessage
          id="file-name-expire"
          defaultMessage="{fileName} in {storyTitle} {expirePhrase} {expireDate}."
          values={values}
        />);
      }

      return (<FormattedMessage
        id="n-files-expire"
        defaultMessage="{n} {n, plural, one {file} other {files}} in {storyTitle} {expirePhrase} {expireDate}."
        values={values}
      />);
    };

    //#endregion
    switch (actionName) {
      case 'story_annotated':
        formattedItemTitle = (
          <FormattedMessage
            id="story-annotated-by-user"
            defaultMessage={'{heading}{story} annotated by {user}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'story_created':
        formattedItemTitle = (
          <FormattedMessage
            id="story-created-by-user"
            defaultMessage={'{heading}{story} was created by {user}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'story_shared_author':
        formattedItemTitle = (
          <FormattedMessage
            id="story-shared-by-user"
            defaultMessage={'{heading}{story} was shared by {user}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'story_updated':
        formattedItemTitle = (
          <FormattedMessage
            id="story-updated-by-user"
            defaultMessage={'{heading}{story} was updated by {user}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'user_subscribed_to_story':
        formattedItemTitle = (
          <FormattedMessage
            id="user-subscribed-to-story"
            defaultMessage={'{heading}{user} subscribed to your {story}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'story_promoted':
        formattedItemTitle = (
          <FormattedMessage
            id="story-was-promoted-by"
            defaultMessage={'{heading}{story} was promoted by {user}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'user_flagged_story':
        formattedItemTitle = (
          <FormattedMessage
            id="user-flagged-your-story"
            defaultMessage={'{heading}{user} flagged your {story}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'user_unflagged_story':
        formattedItemTitle = (
          <FormattedMessage
            id="user-unflagged-your-story"
            defaultMessage={'{heading}{user} unflagged your {story}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'comment_replied':
        formattedItemTitle = (
          <FormattedMessage
            id="user-replied-your-comment"
            defaultMessage={'{heading}{user} replied to your comment'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'story_commented':
        formattedItemTitle = (
          <FormattedMessage
            id="user-commented-on-story"
            defaultMessage={'{heading}{user} commented on {story}'}
            values={{
              heading: isArchived ? '{archived} ' : '',
              action: actionName,
              user: isArchivedUser,
              story: isArchivedStory,
              archived: <span className={styles.archived}>{strings.archived}</span>,
            }}
          />);
        break;
      case 'user_followed':
        formattedItemTitle = (
          <FormattedMessage
            id="user-started-following-you"
            defaultMessage="{user} started following you"
            values={{
              action: actionName,
              user: <strong>{userName}</strong>,
              story: <strong>{storyTitle}</strong>
            }}
          />);
        break;
      case 'user_praised':
        formattedItemTitle = (
          <FormattedMessage
            id="user-praised-you"
            defaultMessage="{user} praised you"
            values={{
              action: actionName,
              user: <strong>{userName}</strong>,
              story: <strong>{storyTitle}</strong>
            }}
          />);
        break;
      case 'user_shared_personal_channel':
        formattedItemTitle = (
          <FormattedMessage
            id="user-shared-personal-channel"
            defaultMessage="{user} shared a personal {channel}"
            values={{
              action: actionName,
              user: <strong>{userName}</strong>,
              story: <strong>{storyTitle}</strong>
            }}
          />);
        break;
      case 'file-expiry':
        formattedItemTitle = getExpireInfo();
        break;

      default:
        formattedItemTitle = (
          <FormattedMessage
            id="code-not-found"
            defaultMessage="{story} {action} {user}"
            values={{
              action: actionName,
              user: <strong>{userName}</strong>,
              story: <strong>{storyTitle}</strong>
            }}
          />);
        break;
    }

    // Alternate render for user
    if (actionType === 'user') {
      const userClass = grid ? itemClasses : styles.userItem;

      return (<UserItem
        className={userClass}
        onClick={this.props.onClick}
        authString={authString}
        inList
        showThumb
        showFollow
        thumbSize={grid ? 'large' : 'small'}
        onFollowClick={this.props.onFollowClick}
        isFollowLoading={user.isFollowLoading}
        {...user}
        grid={grid}
        note={dateAndTime}
        nameElement={formattedItemTitle}
      />);
    }

    // Quicklink
    if (!isProtected && isQuicklink && quicklinkUrl) {
      anchorUrl = quicklinkUrl;

      // Quickfile
    } else if (!isProtected && isQuickfile && files && files[0]) {
      anchorUrl = '/file/' + (files[0].id || files[0]);
    }

    const notificationInfo = (
      <Fragment>
        <div className={thumbClasses} style={thumbStyle} />
        <div className={styles.info}>
          <span className={styles.name}>
            {formattedItemTitle}
          </span>
          <span className={styles.note}>{dateAndTime}</span>
        </div>
      </Fragment>
    );

    const notificationListItem = isArchived ? (
      <div title={storyTitle} className={styles.disabled}>
        {notificationInfo}
      </div>
    ) : (
      <a href={anchorUrl} title={storyTitle} onClick={this.handleClick}>
        {notificationInfo}
      </a>
    );

    return (
      <div className={itemClasses} style={itemStyle}>
        {notificationListItem}
      </div>
    );
  }
}
