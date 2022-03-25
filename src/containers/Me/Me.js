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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import ScheduledStories from 'components/ScheduledStories/ScheduledStories';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  load,
  loadBookmarks,
  loadLikedStories,
  loadRecentStories,
  loadRecentFiles,

  setSummaryScrollPosition
} from 'redux/modules/me';
import {
  loadPublishedStories,
  loadScheduledStories
} from 'redux/modules/user';
import {
  mapBookmarks,
  mapFiles,
  mapStories,
  mapNotes,
  mapShares
} from 'redux/modules/entities/helpers';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import CountBadge from 'components/CountBadge/CountBadge';
import Loader from 'components/Loader/Loader';
import TriggerList from 'components/TriggerList/TriggerList';
import UserItem from 'components/UserItem/UserItem';
import Carousel from 'components/Carousel/Carousel';
import ShareItemNew from 'components/ShareItemNew/ShareItemNew';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import FileItemNew from 'components/FileItemNew/FileItemNew';
import BookmarkItemNew from 'components/BookmarkItemNew/BookmarkItemNew';
import NoteItemNew from 'components/NoteItemNew/NoteItemNew';

const messages = defineMessages({
  error: { id: 'error', defaultMessage: 'Error' },
  me: { id: 'me', defaultMessage: 'Me' },

  likedStories: { id: 'liked-stories', defaultMessage: 'Liked {stories}' },
  shares: { id: 'shares', defaultMessage: 'Shares' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  drafts: { id: 'drafts', defaultMessage: 'Drafts' },

  story: { id: 'story', defaultMessage: '{story}' },
  bookmarks: { id: 'bookmarks', defaultMessage: 'Bookmarks' },
  recentStories: { id: 'recently-viewed-stories', defaultMessage: 'Recently Viewed {stories}' },
  recentShares: { id: 'recently-shared', defaultMessage: 'Recently Shared' },
  recentFiles: { id: 'recently-viewed-files', defaultMessage: 'Recently Viewed Files' },
  publishedStories: { id: 'published-stories', defaultMessage: 'Published {stories}' },
  scheduledStories: { id: 'scheduled-stories', defaultMessage: 'Scheduled {stories}' },
  notes: { id: 'notes', defaultMessage: 'Notes' },

  noSubject: { id: 'no-subject', defaultMessage: 'No Subject' },
  seeAll: { id: 'see-all', defaultMessage: 'See All' },

  // shares
  recentSharesEmptyHeading: {
    id: 'recent-shares-empty-heading',
    defaultMessage: 'No shares'
  },
  recentSharesEmptyMessage: {
    id: 'recent-shares-empty-message',
    defaultMessage: 'Your shared {stories} and files will appear here'
  },

  // Bookmarks
  bookmarksEmptyHeading: {
    id: 'bookmarks-empty-heading',
    defaultMessage: 'No Bookmarks'
  },
  bookmarksEmptyMessage: {
    id: 'bookmarks-empty-message',
    defaultMessage: 'Your bookmarked {stories} and Files will appear here'
  },

  // Published Stories
  publishedEmptyHeading: {
    id: 'no-published-stories-empty-heading',
    defaultMessage: 'No Published {stories}'
  },
  publishedEmptyMessage: {
    id: 'no-published-stories-empty-message',
    defaultMessage: '{stories} you have published with appear here'
  },
  // Published Stories
  scheduledEmptyHeading: {
    id: 'no-scheduled-stories-empty-heading',
    defaultMessage: 'No scheduled {stories}'
  },
  scheduledEmptyMessage: {
    id: 'no-scheduled-stories-empty-message',
    defaultMessage: '{stories} you have scheduled with appear here'
  },

  // Recent Stories
  recentStoriesEmptyHeading: {
    id: 'recent-stories-empty-heading',
    defaultMessage: 'No Recently Viewed {stories}'
  },
  recentStoriesEmptyMessage: {
    id: 'recent-stories-empty-message',
    defaultMessage: '{stories} you have recently viewed will appear here'
  },

  // Recent Files
  recentFilesEmptyHeading: {
    id: 'recent-files-empty-heading',
    defaultMessage: 'No Recently Viewed Files'
  },
  recentFilesEmptyMessage: {
    id: 'recent-files-empty-message',
    defaultMessage: 'Files you have recently viewed will appear here'
  }
});

function mapStateToProps(state) {
  const { entities, me, settings, share } = state;
  const id = settings.user.id;

  // Merge me and user store
  const details = {
    ...entities.users[id],
    ...me,
  };

  // Merge stats
  const loadedStats = entities.users[id] ? entities.users[id].stats : {};
  const stats = {
    ...loadedStats,
    ...me.stats
  };

  // Filter deleted bookmarks
  const allBookmarks = mapBookmarks(details.bookmarks, entities);
  const bookmarks = allBookmarks.filter(b => !b.deleted);
  const likedStories = mapStories(details.likedStories, entities);
  const publishedStories = mapStories(details.publishedStories, entities);
  const recentFiles = mapFiles(details.recentFiles, entities);
  const recentStories = mapStories(details.recentStories, entities);
  const notes = mapNotes(details.notes, entities);
  const recentShares = mapShares(details.recentShares, entities);

  return {
    ...details,
    userId: id,
    stats,

    bookmarks,
    fileSettings: settings.fileSettings,
    likedStories,
    publishedStories,
    recentStories,
    recentFiles,
    recentShares,
    notes,

    error: me.error,

    shareSent: share.sent,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    load,
    loadBookmarks,
    loadLikedStories,
    loadPublishedStories,
    loadRecentStories,
    loadRecentFiles,

    setSummaryScrollPosition,
    loadScheduledStories
  })
)
export default class Me extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    loading: PropTypes.bool,

    bookmarks: PropTypes.array,
    likedStories: PropTypes.array,
    publishedStories: PropTypes.array,
    recentStories: PropTypes.array,
    recentFiles: PropTypes.array,
    recentShares: PropTypes.array,
    notes: PropTypes.array,

    stats: PropTypes.object,

    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onFilesClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    bookmarks: [],
    likedStories: [],
    publishedStories: [],
    recentStories: [],
    recentFiles: [],
    recentShares: [],
    notes: []
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.summaryContainer = null;
  }

  UNSAFE_componentWillMount() {
    if (this.props.location.pathname === '/me') {
      this.props.load();
    }
  }

  componentDidMount() {
    const { loaded, ui } = this.props;

    // Restore scroll position if loaded
    if (loaded && ui.summaryScrollY &&
        this.summaryContainer && this.summaryContainer) {
      this.summaryContainer.scrollTop = ui.summaryScrollY;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname === '/me' && this.props.location.pathname !== '/me') {
      this.props.load();
    }

    // updated share section after new share created successfully
    if (nextProps.shareSent === true && this.props.shareSent === false) {
      this.props.load();
    }
  }

  componentWillUnmount() {
    // Save scroll position
    if (this.summaryContainer) {
      this.props.setSummaryScrollPosition(this.summaryContainer.scrollTop);
    }
  }

  handleLoadBookmarks(offset) {
    this.props.loadBookmarks(offset);
  }

  handleLoadLikedStories(offset = 0) {
    this.props.loadLikedStories(this.props.userId, offset);
  }

  handleLoadPublishedStories(offset = 0) {
    this.props.loadPublishedStories(this.props.userId, offset);
  }

  handleLoadScheduledStories(offset = 0) {
    this.props.loadScheduledStories(this.props.userId, offset);
  }

  handleLoadRecentFiles(offset = 0) {
    this.props.loadRecentFiles(offset);
  }

  handleLoadRecentStories(offset = 0) {
    this.props.loadRecentStories(offset);
  }

  handleBookmarkClick(event, context) {
    const firstItem = context.props.setData[0];

    // File/Quickfile Bookmark
    if (firstItem.type === 'file') {
      this.props.onFilesClick(event, context.props.setData);

    // Story Bookmark
    } else if (firstItem.type === 'story') {
      this.props.onStoryClick(event, context);
    }
  }

  handleShareClick({ shareSessionId }) {
    this.props.history.push(`/share/${shareSessionId}`);
  }

  handleBreadcrumbsClick(event) {
    event.preventDefault();
    let path = event.currentTarget.getAttribute('href');
    if (!path) {
      path = event.currentTarget.dataset.path;
    }
  }

  handleReloadClick() {
    this.props.load();
  }

  renderSummary(strings) {
    const { authString, user, userCapabilities } = this.context.settings;
    const { canComment, canLikeStory, hasNotes, hasShare, showStoryAuthor } = userCapabilities;
    const {
      stats,
      bookmarks,
      loaded,
      fileSettings,
      notes,
      publishedStories,
      recentFiles,
      recentShares,
      recentStories,
      onAnchorClick,
      onStoryClick,
    } = this.props;
    const styles = require('./Me.less');

    const LIMIT = 6;

    // Available sections
    const sections = [{
      id: 'recent-shares',
      name: strings.recentShares,
      enabled: hasShare,
      morePath: '/shares',
      component: (
        <Carousel
          startingX={50}
          dots
          itemSize={200}
          itemMargin={20}
          icon="story"
          emptyHeading={strings.recentSharesEmptyHeading}
          emptyMessage={strings.recentSharesEmptyMessage}
          loading={!loaded}
        >
          {recentShares.slice(0, LIMIT).map((item, ix) => (
            <ShareItemNew
              key={ix}
              grid
              thumbSize="medium"
              onClick={this.handleShareClick}
              fileSettings={fileSettings}
              strings={{
                noSubject: `(${strings.noSubject})`,
                story: strings.story
              }}
              {...item}
            />
          ))}
        </Carousel>
      )
    }, {
      id: 'published-stories',
      name: strings.publishedStories,
      enabled: true,
      morePath: '/published',
      component: (
        <Carousel
          startingX={50}
          dots
          itemSize={200}
          itemMargin={20}
          icon="story"
          emptyHeading={strings.publishedEmptyHeading}
          emptyMessage={strings.publishedEmptyMessage}
          loading={!loaded}
        >
          {publishedStories.slice(0, LIMIT).map((item, ix) => (
            <StoryItemNew
              key={ix}
              grid
              thumbSize="medium"
              onClick={onStoryClick}
              showAuthor={showStoryAuthor}
              strings={{
                story: strings.story
              }}
              {...item}
            />
          ))}
        </Carousel>
      )
    }, {
      id: 'bookmarks',
      name: strings.bookmarks,
      enabled: true,
      morePath: '/bookmarks',
      component: (
        <Carousel
          startingX={50}
          dots
          itemSize={200}
          itemMargin={20}
          icon="story"
          emptyHeading={strings.bookmarksEmptyHeading}
          emptyMessage={strings.bookmarksEmptyMessage}
          loading={!loaded}
        >
          {bookmarks.slice(0, LIMIT).map((item, ix) => (
            <BookmarkItemNew
              key={ix}
              {...item}
              grid
              {...{ authString }}
              fileSettings={fileSettings}
              showAuthor={showStoryAuthor}
              strings={{
                story: strings.story
              }}
              showBadges
              showThumb
              thumbSize="medium"
              onFilesClick={this.props.onFilesClick}
              onStoryClick={this.props.onStoryClick}
            />
          ))}
        </Carousel>
      )
    }, {
      id: 'recent-stories',
      name: strings.recentStories,
      enabled: true,
      morePath: '/recent/stories',
      component: (
        <Carousel
          startingX={50}
          dots
          itemSize={200}
          itemMargin={20}
          icon="story"
          emptyHeading={strings.recentStoriesEmptyHeading}
          emptyMessage={strings.recentStoriesEmptyMessage}
          loading={!loaded}
        >
          {recentStories.slice(0, LIMIT).map((item, ix) => (
            <StoryItemNew
              key={ix}
              grid
              thumbSize="medium"
              onClick={onStoryClick}
              showAuthor={showStoryAuthor}
              strings={{
                story: strings.story
              }}
              {...item}
            />
          ))}
        </Carousel>
      )
    }, {
      id: 'recent-files',
      name: strings.recentFiles,
      enabled: true,
      morePath: '/recent/files',
      component: (
        <Carousel
          startingX={50}
          dots
          itemSize={200}
          itemMargin={20}
          icon="story"
          emptyHeading={strings.recentFilesEmptyHeading}
          emptyMessage={strings.recentFilesEmptyMessage}
          loading={!loaded}
        >
          {recentFiles.slice(0, LIMIT).map((item, ix) => (
            <FileItemNew
              key={ix}
              grid
              showFileSize
              onClick={this.props.onFilesClick}
              fileSettings={fileSettings}
              {...item}
            />
          ))}
        </Carousel>
      )
    }, {
      id: 'notes',
      name: strings.notes,
      enabled: hasNotes && notes.length > 0,
      morePath: '/notes',
      component: (
        <Carousel
          startingX={50}
          dots
          itemSize={200}
          itemMargin={20}
          icon="story"
          emptyHeading={strings.notesEmptyHeading}
          emptyMessage={strings.notesEmptyMessage}
          loading={!loaded}
        >
          {notes.slice(0, LIMIT).map((item, ix) => (
            <NoteItemNew
              key={ix}
              grid
              showFileSize
              showThumb
              onClick={onAnchorClick}
              {...item}
            />
          ))}
        </Carousel>
      )
    }];

    return (
      <div ref={(c) => { this.summaryContainer = c; }}>
        <section className={styles.userInfo}>
          <div className={styles.userBadge}>
            <UserItem
              {...user}
              name={user.firstname + ' ' + user.lastname}
              anchorLink="/profile"
              note={user.role}
              className={styles.userProfile}
              onClick={onAnchorClick}
              grid
              showThumb
            />
            <Btn type="link" href="/profile" onClick={onAnchorClick}>
              <FormattedMessage id="view-profile" defaultMessage="View Profile" />
            </Btn>
          </div>
          <ul className={styles.statsList}>
            <li>
              <CountBadge href="/published" title={strings.publishedStories} value={stats.storiesPublished} size="large" onClick={onAnchorClick} />
            </li>
            <li>
              <CountBadge href="/scheduled" title={strings.scheduledStories} value={stats.storiesScheduled} size="large" onClick={onAnchorClick} />
            </li>
            {canLikeStory && <li>
              <CountBadge href="/liked" title={strings.likedStories} value={stats.storiesLiked} size="large" onClick={onAnchorClick} />
            </li>}
            {canComment && <li>
              <CountBadge href="/comments" title={strings.comments} value={stats.comments} size="large" onClick={onAnchorClick} />
            </li>}
          </ul>
        </section>

        <section className={styles.listsWrap}>
          {sections.map(s => (s.enabled &&
            <section key={s.id} data-id={s.id} className={styles.dividerStyle}>
              <header>
                <h4 className={styles.heading}>{s.name}</h4>
                {s.morePath && <a className={styles.seeAllLink} href={s.morePath} onClick={onAnchorClick}>
                  {strings.seeAll}
                </a>}
              </header>
              {s.component}
            </section>
          ))}
        </section>
      </div>
    );
  }

  render() {
    const { naming, userCapabilities } = this.context.settings;
    const { hasStoryBadges, showStoryAuthor } = userCapabilities;
    const { formatMessage } = this.context.intl;
    const { error, loaded, location } = this.props;
    const styles = require('./Me.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Header breadcrumbs
    const paths = [{
      name: strings.me,
      path: '/me'
    }];

    switch (location.pathname) {
      case '/bookmarks':
        paths.push({
          name: strings.bookmarks,
          path: location.pathname,
          component: (
            <TriggerList
              list={this.props.bookmarks}
              isLoaded={this.props.bookmarksLoaded}
              isLoading={this.props.bookmarksLoading}
              isLoadingMore={this.props.bookmarksLoading && this.props.bookmarks.length > 0}
              isComplete={this.props.bookmarksComplete}
              error={this.props.bookmarksError}
              onGetList={this.handleLoadBookmarks}
              listProps={{
                thumbSize: 'medium',
                grid: true,
                itemProps: {
                  showBadges: hasStoryBadges,
                  showIcons: true,
                  showThumb: true,
                  showAuthor: showStoryAuthor,
                  fileSettings: this.props.fileSettings
                },
                onItemClick: this.handleBookmarkClick
              }}
            />
          )
        });
        break;
      case '/liked':
        paths.push({
          name: strings.likedStories,
          path: location.pathname,
          component: (
            <TriggerList
              list={this.props.likedStories}
              isLoaded={this.props.likedStoriesLoaded}
              isLoading={this.props.likedStoriesLoading}
              isLoadingMore={this.props.likedStoriesLoading && this.props.likedStories.length > 0}
              isComplete={this.props.likedStoriesComplete}
              error={this.props.likedStoriesError}
              onGetList={this.handleLoadLikedStories}
              listProps={{
                grid: true,
                itemProps: {
                  showBadges: hasStoryBadges,
                  showIcons: true,
                  showThumb: true,
                  showAuthor: showStoryAuthor,
                },
                onItemClick: this.props.onStoryClick
              }}
            />
          )
        });
        break;
      case '/published':
      case 'published':
        paths.push({
          name: strings.publishedStories,
          path: '/published',
          component: (
            <TriggerList
              list={this.props.publishedStories}
              isLoaded={this.props.publishedStoriesLoaded}
              isLoading={this.props.publishedStoriesLoading}
              isLoadingMore={this.props.publishedStoriesLoading && this.props.publishedStories.length > 0}
              isComplete={this.props.publishedStoriesComplete}
              error={this.props.publishedStoriesError}
              onGetList={this.handleLoadPublishedStories}
              listProps={{
                grid: true,
                itemProps: {
                  showBadges: hasStoryBadges,
                  showIcons: true,
                  showThumb: true,
                  showAuthor: showStoryAuthor,
                },
                emptyHeading: strings.publishedEmptyHeading,
                emptyMessage: strings.publishedEmptyMessage,
                onItemClick: this.props.onStoryClick
              }}
            />
          )
        });
        break;
      case '/scheduled':
      case 'scheduled':
        paths.push({
          name: strings.scheduledStories,
          path: '/scheduled',
          showPopupIcon: false,
          onPopupClick: () => { },
          component: (
            <ScheduledStories onStoryClick={this.props.onStoryClick} />
          )
        });
        break;
      case '/recent/files':
        paths.push({
          name: strings.recentFiles,
          path: location.pathname,
          component: (
            <TriggerList
              list={this.props.recentFiles}
              isLoaded={this.props.recentFilesLoaded}
              isLoading={this.props.recentFilesLoading}
              isLoadingMore={this.props.recentFilesLoading && this.props.recentFiles.length > 0}
              isComplete={this.props.recentFilesComplete}
              error={this.props.recentFilesError}
              onGetList={this.handleLoadRecentFiles}
              listProps={{
                grid: true,
                showThumb: true,
                emptyHeading: strings.recentFilesEmptyHeading,
                emptyMessage: strings.recentFilesEmptyMessage,
                onItemClick: this.props.onFileClick,
                className: styles.fileList,
                itemProps: {
                  fileSettings: this.props.fileSettings
                },
              }}
            />
          )
        });
        break;
      case '/recent/stories':
        paths.push({
          name: strings.recentStories,
          path: location.pathname,
          component: (
            <TriggerList
              list={this.props.recentStories}
              isLoaded={this.props.recentStoriesLoaded}
              isLoading={this.props.recentStoriesLoading}
              isLoadingMore={this.props.recentStoriesLoading && this.props.recentStories.length > 0}
              isComplete={this.props.recentStoriesComplete}
              error={this.props.recentStoriesError}
              onGetList={this.handleLoadRecentStories}
              listProps={{
                grid: true,
                itemProps: {
                  showBadges: hasStoryBadges,
                  showIcons: true,
                  showThumb: true,
                  showAuthor: showStoryAuthor,
                },
                emptyHeading: strings.recentStoriesEmptyHeading,
                onItemClick: this.props.onStoryClick
              }}
            />
          )
        });
        break;
      default:
        break;
    }

    const pageTitle = paths[paths.length - 1].name;

    // Loading
    if (paths.length === 1 && !loaded && !error) {
      return <Loader type="page" />;

    // Error
    } else if (paths.length === 1 && !loaded && error) {
      return (
        <Blankslate
          icon="error"
          heading={strings.error}
          message={error.message}
          middle
        >
          <Btn onClick={this.handleReloadClick}>Reload</Btn>
        </Blankslate>
      );
    }
    return (
      <div className={styles.Me} id="me-section">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <AppHeader paths={paths} showBreadcrumbs showTriangle />
        {paths.length === 1 && this.renderSummary(strings)}
        {paths.length > 1 && <div className={styles.listContainer}>
          {paths[1].component}
        </div>}
      </div>
    );
  }
}
