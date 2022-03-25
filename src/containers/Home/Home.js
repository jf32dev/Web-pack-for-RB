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
import _uniqBy from 'lodash/uniqBy';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadCompanyStories,
  loadCompanyUsers,
  setFeaturedScrollPosition,
  recordHomeScreenViews,
} from 'redux/modules/company';
import {
  loadRecommendedFiles,
  loadRecentFiles,
  loadRecommendedUsers,
  loadRecentStories,
  loadLikedStories,
  loadBookmarks,
} from 'redux/modules/me';
import {
  toggleUserFollow
} from 'redux/modules/user';
import {
  addFile as addFileToViewer
} from 'redux/modules/viewer';
import {
  mapFiles,
  mapStories,
  mapUsers,
  mapBookmarks,
} from 'redux/modules/entities/helpers';

import HomeTemplate from 'components/HomeTemplate/HomeTemplate';

const globalLimitForHomescreenSection = 20;
const VIEW_TYPE = 'homescreen';


// Fallback default homescreen
const defaultHomeScreen = require('static/defaultHomeScreen.json');

const messages = defineMessages({
  featured: { id: 'featured', defaultMessage: 'Featured' }
});

function mapStateToProps(state) {
  const { company, entities, me, settings } = state;

  // Add data to homeTemplate items
  const homeScreen = (settings.company.defaultHomeScreen && settings.company.defaultHomeScreen.items.length > 0) ? settings.company.defaultHomeScreen : defaultHomeScreen;
  const itemsWithData = [];

  // Remove Leaderboard from default template when userCapabilities is disabled
  if (settings.userCapabilities && !settings.userCapabilities.hasLeaderboard) {
    const itemsTmp = homeScreen.items.filter(obj => obj.source !== 'leaderboard');
    homeScreen.items = [...itemsTmp];
  }

  homeScreen.items.forEach(item => {
    switch (true) {
      // file
      case item.type === 'file-list' && item.source === 'recommended':
        itemsWithData.push({
          ...item,
          list: mapFiles(me.recommendedFiles, entities),
          loaded: me.recommendedFilesLoaded,
          error: me.recommendedFilesError
        });
        break;
      case item.type === 'file-list' && item.source === 'recentlyViewed':
        itemsWithData.push({
          ...item,
          list: mapFiles(me.recentFiles, entities),
          loaded: me.recentFilesLoaded,
          error: me.recentFilesError
        });
        break;

      // story (company)
      case item.type === 'featured-list':
        itemsWithData.push({
          ...item,
          list: mapStories(company.featuredStories, entities),
          loaded: company.featuredStoriesLoaded,
          error: company.featuredStoriesError
        });
        break;
      case item.type === 'story-list' && item.source === 'top':
        itemsWithData.push({
          ...item,
          list: mapStories(company.topStories, entities),
          loaded: company.topStoriesLoaded,
          error: company.topStoriesError
        });
        break;
      case item.type === 'story-list' && item.source === 'latest':
        itemsWithData.push({
          ...item,
          list: mapStories(company.latestStories, entities),
          loaded: company.latestStoriesLoaded,
          error: company.latestStoriesError,
        });
        break;
      case item.type === 'story-list' && item.source === 'recommended':
        itemsWithData.push({
          ...item,
          list: mapStories(company.myRecommendedStories, entities),
          loaded: company.myRecommendedStoriesLoaded,
          error: company.myRecommendedStoriesError
        });
        break;
      case item.type === 'story-list' && item.source === 'mostViewed':
        itemsWithData.push({
          ...item,
          list: mapStories(company.myMostViewedStories, entities),
          loaded: company.myMostViewedStoriesLoaded,
          error: company.myMostViewedStoriesError
        });
        break;
      case item.type === 'story-list' && item.source === 'popular':
        itemsWithData.push({
          ...item,
          list: mapStories(company.popularStories, entities),
          loaded: company.popularStoriesLoaded,
          error: company.popularStoriesError
        });
        break;

      // story (me)
      case item.type === 'story-list' && item.source === 'liked':
        itemsWithData.push({
          ...item,
          list: mapStories(me.likedStories, entities),
          loaded: me.likedStoriesLoaded,
          error: me.likedStoriesError
        });
        break;
      case item.type === 'story-list' && item.source === 'recentlyViewed':
        itemsWithData.push({
          ...item,
          list: mapStories(me.recentStories, entities),
          loaded: me.recentStoriesLoaded,
          error: me.recentStoriesError
        });
        break;

      // user (company)
      case item.type === 'user-list' && item.source === 'leaderboard':
        itemsWithData.push({
          ...item,
          list: mapUsers(company.leaderboard, entities),
          loaded: company.leaderboardLoaded,
          error: company.leaderboardError
        });
        break;
      case item.type === 'user-list' && item.source === 'top':
        itemsWithData.push({
          ...item,
          list: mapUsers(company.myTopUsers, entities),
          loaded: company.myTopUsersLoaded,
          error: company.myTopUsersError
        });
        break;

      // user (me)
      case item.type === 'user-list' && item.source === 'recommended':
        itemsWithData.push({
          ...item,
          list: mapUsers(me.recommendedUsers, entities),
          loaded: me.recommendedUsersLoaded,
          error: me.recommendedUsersError
        });
        break;

        // user (bookmarks)
      case item.type === 'bookmark-list':
        itemsWithData.push({
          ...item,
          list: mapBookmarks(me.bookmarks, entities),
          loaded: me.bookmarksLoaded,
          error: me.bookmarksError
        });
        break;

      default:
        itemsWithData.push(item);
        break;
    }
  });

  return {
    ...company.homeTemplate,
    items: _uniqBy(itemsWithData, 'i'),
    featuredScrollY: company.ui.featuredScrollY,
    homeScreenId: homeScreen.id
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadCompanyStories,
    loadCompanyUsers,
    loadRecommendedFiles,
    loadRecentFiles,
    loadRecommendedUsers,
    loadRecentStories,
    loadLikedStories,
    loadBookmarks,

    toggleUserFollow,
    addFileToViewer,

    setFeaturedScrollPosition,
    recordHomeScreenViews
  })
)
export default class Home extends Component {
  static propTypes = {
    name: PropTypes.string,
    items: PropTypes.array,
    featuredScrollY: PropTypes.number,
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    featuredStories: [],
    topStories: [],
    latestStories: [],
    myRecommendedStories: [],
    myMostViewedStories: [],
    myTopUsers: [],
    leaderboard: []
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.container = null;
  }

  componentDidMount() {
    const { featuredScrollY, homeScreenId } = this.props;

    // Restore scroll position if loaded
    if (featuredScrollY && this.container && this.container.parentElement) {
      this.container.parentElement.scrollTop = featuredScrollY;
    }

    // Record Homescreen views
    this.props.recordHomeScreenViews(VIEW_TYPE, homeScreenId);
  }

  componentWillUnmount() {
    // Save scroll position
    if (this.container && this.container.parentElement) {
      this.props.setFeaturedScrollPosition(this.container.parentElement.scrollTop);
    }
  }

  handleFollowClick(event, component) {
    this.props.toggleUserFollow(component.props.id, !component.props.isFollowed);
  }

  handleUserClick(event, context) {
    this.props.history.push('/people/' + context.props.id);
  }

  handleGetItemData(i) {
    const { items } = this.props;
    const item = items.find(e => e.i === i);

    switch (item.type) {
      case 'featured-list':
        this.handleGetStoryList('featured');
        break;
      case 'story-list':
        this.handleGetStoryList(item.source);
        break;
      case 'user-list':
        this.handleGetUserList(item.source);
        break;
      case 'file-list':
        this.handleGetFileList(item.source);
        break;
      case 'bookmark-list':
        this.handleGetBookmarkList(item.source);
        break;
      default:
        break;
    }
  }

  handleGetFileList(source) {
    switch (source) {
      case 'recommended':
        this.props.loadRecommendedFiles(0, globalLimitForHomescreenSection);
        break;
      case 'recentlyViewed':
        this.props.loadRecentFiles(0, globalLimitForHomescreenSection);
        break;
      default:
        console.info('Invalid File list source: ' + source);  // eslint-disable-line
        break;
    }
  }

  handleGetBookmarkList() {
    this.props.loadBookmarks(0, globalLimitForHomescreenSection);
  }

  handleGetUserList(source) {
    switch (source) {
      case 'leaderboard':
        this.props.loadCompanyUsers('leaderboard');
        break;
      case 'recommended':
        this.props.loadRecommendedUsers(0, globalLimitForHomescreenSection);
        break;
      case 'top':
        this.props.loadCompanyUsers('myTopUsers');
        break;
      default:
        console.info('Invalid User list source: ' + source);  // eslint-disable-line
        break;
    }
  }

  handleGetStoryList(source) {
    switch (source) {
      case 'featured':
        this.props.loadCompanyStories('featuredStories');
        break;
      case 'latest':
        this.props.loadCompanyStories('latestStories');
        break;
      case 'liked':
        this.props.loadLikedStories(null, 0, globalLimitForHomescreenSection);
        break;
      case 'mostViewed':
        this.props.loadCompanyStories('myMostViewedStories');
        break;
      case 'recommended':
        this.props.loadCompanyStories('myRecommendedStories');
        break;
      case 'recentlyViewed':
        this.props.loadRecentStories(0, globalLimitForHomescreenSection);
        break;
      case 'top':
        this.props.loadCompanyStories('topStories');
        break;
      case 'popular':
        this.props.loadCompanyStories('popularStories');
        break;
      default:
        console.info('Invalid Story list source: ' + source);  // eslint-disable-line
        break;
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming, userCapabilities } = this.context.settings;
    const {
      items,
      onAnchorClick,
      onFileClick,
      onFilesClick,
      onStoryClick
    } = this.props;
    const styles = require('./Home.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);
    return (
      <div
        ref={(c) => { this.container = c; }}
        className={styles.Home}
      >
        <Helmet>
          <title>{strings.featured}</title>
        </Helmet>
        <HomeTemplate
          items={items}
          hasStoryBadges={userCapabilities.hasStoryBadges}
          onGetItemData={this.handleGetItemData}
          onAnchorClick={onAnchorClick}
          onFileClick={onFileClick}
          {...{ onFilesClick }}
          onStoryClick={onStoryClick}
          onUserClick={this.handleUserClick}
          onFollowClick={this.handleFollowClick}
          showStoryAuthor={userCapabilities.showStoryAuthor}
        />
      </div>
    );
  }
}
