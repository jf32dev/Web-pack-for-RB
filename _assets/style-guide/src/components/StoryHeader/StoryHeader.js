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

import { defineMessages, FormattedMessage, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import DropMenu from 'components/DropMenu/DropMenu';
import UserThumb from 'components/UserThumb/UserThumb';

const messages = defineMessages({
  close: { id: 'close', defaultMessage: 'Close' },
  share: { id: 'share', defaultMessage: 'Share' },
  republish: { id: 'republish', defaultMessage: 'Republish' },
  publisAsNew: { id: 'publish-as-new', defaultMessage: 'Publish As New' },
  linkedin: { id: 'linkedin', defaultMessage: 'LinkedIn' },
  facebook: { id: 'facebook', defaultMessage: 'Facebook' },
  twitter: { id: 'twitter', defaultMessage: 'Twitter' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  more: { id: 'more', defaultMessage: 'More' }
});

/**
 * Required by StoryDetail and StoryPublic components.
 */
export default class StoryHeader extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    author: function(props) {
      if (!props.isFeed && typeof props.author !== 'object') {
        return new Error('author is required for non-feed Stories.');
      }
      return null;
    },

    /** Colour fallback if thumbnailSmall not provided */
    colour: PropTypes.string.isRequired,

    /** Expects a 10x10 image that stretches across the header to create a blur effect */
    thumbnailSmall: PropTypes.string.isRequired,

    /** Unix timestamp */
    updated: PropTypes.number.isRequired,

    /** Valid tab object - shows Tab > Channel path */
    tab: PropTypes.object,

    /* Valid channel object - shows Tab > Channel path */
    channel: PropTypes.object,

    /* Shows featured indicator */
    isFeatured: PropTypes.bool,

    /* Disables some options if Story is a feed */
    isFeed: PropTypes.bool,

    /** Disables some options if Story is a revision (archived) */
    isRevision: PropTypes.bool,

    /** Sets bookmark icon to active */
    isBookmark: PropTypes.bool,

    /** Sets like icon to active */
    isLiked: PropTypes.bool,

    /** Sets subscribed icon to active */
    isSubscribed: PropTypes.bool,

    /** Sharing button/menu enabed */
    sharing: PropTypes.bool,

    /** Share button has a menu with more sharing options */
    sharingPublic: PropTypes.bool,

    /** Number of Likes */
    ratingCount: PropTypes.number,

    /** Array of flags */
    flags: PropTypes.arrayOf(PropTypes.shape({
      storyFlagId: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      user: PropTypes.object.isRequired,
      date: PropTypes.number.isRequired
    })),

    /** Show archive in menu */
    canDelete: PropTypes.bool,

    /* Show edit button */
    canEdit: PropTypes.bool,

    /* Show flag in menu */
    canFlag: PropTypes.bool,

    /* Show like button */
    canLike: PropTypes.bool,

    /* Show share button */
    canShare: PropTypes.bool,

    /* Show social share options */
    canSocialShare: PropTypes.bool,

    /* Show subscribe in menu */
    canSubscribe: PropTypes.bool,

    /* Show promote in menu */
    canPromote: PropTypes.bool,

    /** Hides the 'more' menu, used for Public Stories */
    hideMoreMenu: PropTypes.bool,

    /** Hides the 'more' menu, used for Public Stories */
    showStoryAuthor: PropTypes.bool,

    /** href of edit link */
    editUrl: PropTypes.string,

    /** Required to display images behind secure storage */
    authString: PropTypes.string,

    /** Handle normal anchor links (Tab/Channel/People) */
    onAnchorClick: PropTypes.func,

    /** Renders a close button if passed */
    onCloseClick: PropTypes.func,

    onArchiveClick: function(props) {
      if (props.canDelete && typeof props.onArchiveClick !== 'function') {
        return new Error('`onArchiveClick` is required when `canDelete` is provided.');
      }
      return null;
    },

    onEditClick: function(props) {
      if (props.canEdit && typeof props.onEditClick !== 'function') {
        return new Error('`onEditClick` is required when `canEdit` is provided.');
      }
      return null;
    },

    onLikeClick: function(props) {
      if (props.canLike && typeof props.onLikeClick !== 'function') {
        return new Error('`onLikeClick` is required when `canLike` is provided.');
      }
      return null;
    },

    onShareClick: function(props) {
      if (props.canShare && typeof props.onShareClick !== 'function') {
        return new Error('`onShareClick` is required when `canShare` is provided.');
      }
      return null;
    },

    onLinkedinShareClick: function(props) {
      if (props.sharingPublic && typeof props.onLinkedinShareClick !== 'function') {
        return new Error('`onLinkedinShareClick` is required when `sharingPublic` is provided.');
      }
      return null;
    },

    onTwitterShareClick: function(props) {
      if (props.sharingPublic && typeof props.onTwitterShareClick !== 'function') {
        return new Error('`onTwitterShareClick` is required when `sharingPublic` is provided.');
      }
      return null;
    },

    onFacebookShareClick: function(props) {
      if (props.sharingPublic && typeof props.onFacebookShareClick !== 'function') {
        return new Error('`onFacebookShareClick` is required when `sharingPublic` is provided.');
      }
      return null;
    },

    onBookmarkClick: PropTypes.func,
    onSubscribeClick: PropTypes.func,
    onHistoryClick: PropTypes.func,
    onPromoteClick: PropTypes.func,
    onFlagClick: PropTypes.func,
    onFlagListClick: PropTypes.func,

    height: PropTypes.number,
    infoOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    titleOpacity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    theme: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    colour: '#ccc',
    thumbnailSmall: '',
    updated: 0,
    flags: [],
    editUrl: '/edit',
    authString: '',
    height: 250,
    infoOpacity: 1,
    titleOpacity: 1,
    showStoryAuthor: true
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // Randomise background-position
    const bgPos = (Math.random() * 100).toFixed(0);
    this.bgPos = '0 ' + bgPos + '%';
  }

  handleArchiveClick = () => {
    if (this.props.flags.length) {
      this.props.onArchiveError();
    } else {
      this.props.onArchiveClick();
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      name,
      author,
      tab,
      channel,
      updated,
      isBookmark,
      isFeatured,
      isFeed,
      isLiked,
      sharing,
      sharingPublic,
      isRevision,
      isSubscribed,

      ratingCount,
      flags,
      thumbnailSmall,
      colour,

      canDelete,
      canEdit,
      canFlag,
      canLike,
      canShare,
      canSocialShare,
      canSubscribe,
      canPromote,

      hideMoreMenu,

      editUrl,
      authString,

      onAnchorClick,
      onCloseClick,
      onLikeClick,

      onShareClick,
      onLinkedinShareClick,
      onTwitterShareClick,
      onFacebookShareClick,

      onEditClick,
      onBookmarkClick,
      onSubscribeClick,
      onHistoryClick,
      onPromoteClick,
      onFlagClick,
      onFlagListClick,
      height,
      infoOpacity,
      titleOpacity,

      theme,

      showStoryAuthor
    } = this.props;
    const styles = require('./StoryHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryHeader: true
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const headerStyles = {
      backgroundColor: !thumbnailSmall ? colour : 'transparent',
      backgroundImage: thumbnailSmall ? 'url(' + thumbnailSmall + authString + ')' : null,
      backgroundPosition: !thumbnailSmall ? this.bgPos : null,
      height: height + 'px',
      ...this.props.style
    };

    const containerStyles = {
      width: infoOpacity <= 0 ? '40%' : '80%'
    };

    const infoStyles = {
      opacity: infoOpacity < 1 ? infoOpacity : null,
      display: infoOpacity <= 0 ? 'none' : null
    };

    const titleStyles = {
      opacity: titleOpacity,
      fontSize: infoOpacity <= 0 ? '1.25rem' : null,
      width: infoOpacity <= 0 ? '350px' : null,
      whiteSpace: infoOpacity <= 0 ? 'nowrap' : null
    };

    const likeClass = isLiked ? 'icon-like-fill' : 'icon-like';
    const bookmarkClass = isBookmark ? 'icon-bookmark-fill' : 'icon-bookmark';
    const subscribedClass = isSubscribed ? 'icon-subscribe-fill' : 'icon-subscribe';
    const flagClass = flags.length ? 'icon-flag-fill' : 'icon-flag';

    // Share button conditions
    const showShare = canShare && sharing && (!sharingPublic || !canSocialShare);

    // Edit button conditions
    const showEdit = canEdit && !isFeed && !flags.length;

    // More menu conditions
    const showBookmark = !isFeed;
    const showSubscribe = !isFeed && canSubscribe;
    const showHistory = !isFeed;
    const showPromote = !isFeed && canPromote;
    const showFlag = !isFeed && canFlag;
    const showDelete = !isFeed && canDelete;
    const showMoreMenu = !hideMoreMenu && (showBookmark || showSubscribe || showHistory || showPromote || showFlag || showDelete);

    // Tab/Channel relationship?
    const showTab = tab && tab.id && tab.name;
    const showChannel = channel && channel.id && channel.name;

    return (
      <header className={classes} style={headerStyles}>
        <div className={styles.controlBar}>
          {thumbnailSmall && <div className={styles.imageOverlay} />}
          {onCloseClick && <div className={styles.storyClose} onClick={onCloseClick}>
            {strings.close}
          </div>}

          {isRevision && <div className={styles.storyActions}>
            <a href={editUrl} className="icon-story" onClick={onEditClick}>
              <span>{strings.publisAsNew}</span>
            </a>
          </div>}

          {!isRevision && <div className={styles.storyActions}>
            {canLike && !isFeed && <span data-id="like" className={likeClass} onClick={onLikeClick}>
              {ratingCount > 0 && ratingCount}
              {!ratingCount && <FormattedMessage id="like" defaultMessage="Like" />}
            </span>}

            {sharingPublic && canSocialShare && <DropMenu
              data-id="share-menu"
              heading={strings.share}
              icon="share-fill"
              iconColour="#fff"
              activeIconColour={theme.baseColor}
              headingColour="#fff"
              activeHeadingColour={theme.baseColor}
              className={styles.dropMenu}
              activeClassName={styles.dropMenuActive}
            >
              <ul>
                {canShare && <li title={strings.share} className="icon-share" onClick={onShareClick}>{strings.share}</li>}
                {canSocialShare && <li title={strings.linkedin} className={styles.linkedin} onClick={onLinkedinShareClick}>{strings.linkedin}</li>}
                {canSocialShare && <li title={strings.facebook} className={styles.facebook} onClick={onFacebookShareClick}>{strings.facebook}</li>}
                {canSocialShare && <li title={strings.twitter} className={styles.twitter} onClick={onTwitterShareClick}>{strings.twitter}</li>}
              </ul>
            </DropMenu>}

            {showShare && <span data-id="share" className="icon-share" onClick={onShareClick}>
              {strings.share}
            </span>}

            {showEdit && <a
              href={editUrl} data-id="edit" className="icon-edit"
              onClick={onEditClick}
            >
              <span>{strings.edit}</span>
            </a>}

            {showMoreMenu && <DropMenu
              data-id="more-menu"
              heading={strings.more}
              icon="more-fill"
              iconColour="#fff"
              activeIconColour={theme.baseColor}
              headingColour="#fff"
              activeHeadingColour={theme.baseColor}
              className={styles.dropMenu}
              activeClassName={styles.dropMenuActive}
            >
              <ul>
                {showBookmark && <li data-id="bookmark" className={bookmarkClass} onClick={onBookmarkClick}>
                  <FormattedMessage id="bookmark" defaultMessage="Bookmark" />
                </li>}
                {showSubscribe && <li data-id="subscribe" className={subscribedClass} onClick={onSubscribeClick}>
                  <FormattedMessage id="subscribe" defaultMessage="Subscribe" />
                </li>}
                {showPromote && <li data-id="promote" className="icon-promote" onClick={onPromoteClick}>
                  <FormattedMessage id="promote" defaultMessage="Promote" />
                </li>}
                {showHistory && <li data-id="history" className="icon-history" onClick={onHistoryClick}>
                  <FormattedMessage id="view-history" defaultMessage="View History" />
                </li>}
                {showFlag && <li data-id="flag" className={flagClass} onClick={onFlagClick}>
                  <FormattedMessage id="flag" defaultMessage="Flag" />
                </li>}
                {showDelete && <li data-id="archive" className="icon-archive" onClick={this.handleArchiveClick}>
                  <FormattedMessage id="archive" defaultMessage="Archive" />
                </li>}
              </ul>
            </DropMenu>}
          </div>}
        </div>

        <div className={styles.centerContainer} style={containerStyles}>
          {!isFeed && !isRevision && isFeatured && !flags.length && <div className={styles.featuredBadge} style={infoStyles}>
            <FormattedMessage id="featured" defaultMessage="Featured" />
          </div>}
          <div className={styles.storyTitle}>
            <h1 style={titleStyles}>{name}</h1>
            {flags.length > 0 && <ul className={styles.flagList} style={infoStyles} onClick={onFlagListClick}>
              {flags.map(f => (
                <li key={f.storyFlagId} aria-label={f.comment}>
                  <span data-flag-id={f.flagId} />
                </li>
              ))}
            </ul>}
          </div>
          {(!!showTab && !!showChannel) && <div data-id="location-path" className={styles.locationPath} style={infoStyles}>
            <a href={'/content/tab/' + tab.id} data-location="storyHeader" onClick={onAnchorClick}>{tab.name}</a>
            <span>&rsaquo;</span>
            <a href={'/content/tab/' + tab.id + '/channel/' + channel.id} data-location="storyHeader" onClick={onAnchorClick}>{channel.name}</a>
          </div>}
          <div className={styles.author} style={infoStyles}>
            {isFeed && <div className={styles.updated}>
              <FormattedDate
                value={updated * 1000}
                day="2-digit"
                month="short"
                year="numeric"
              />
            </div>}
            {!isFeed && showStoryAuthor && <a href={`/people/${author.id}`} className={styles.authorItem} onClick={onAnchorClick}>
              <UserThumb {...author} className={styles.authorThumb} />
              <div className={styles.authorInfo}>
                <span>{author.role || author.name}</span>
                <FormattedDate
                  value={updated * 1000}
                  day="2-digit"
                  month="short"
                  year="numeric"
                />
              </div>
            </a>}
          </div>
        </div>
      </header>
    );
  }
}
