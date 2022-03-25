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

// TODO: Deprecated. Use Home.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadCompanyAll,
  loadCompanyStories,
  loadCompanyUsers,
  setFeaturedScrollPosition
} from 'redux/modules/company';
import {
  toggleUserFollow
} from 'redux/modules/user';
import { addFile as addFileToViewer } from 'redux/modules/viewer';
import { mapStories } from 'redux/modules/entities/helpers';

import FeaturedList from 'components/FeaturedList/FeaturedList';
import FeaturedSlider from 'components/FeaturedSlider/FeaturedSlider';
import List from 'components/List/List';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  featured: { id: 'featured', defaultMessage: 'Featured' },
  topStories: { id: 'top-stories', defaultMessage: 'Top {stories}' },
  latestStories: { id: 'latest-stories', defaultMessage: 'Latest {stories}' },
  recommendedStories: { id: 'recommended-stories', defaultMessage: 'Recommended {stories}' },
  myMostViewedStories: { id: 'my-most-viewed-stories', defaultMessage: 'My Most Viewed {stories}' },
  leaderboard: { id: 'leaderboard', defaultMessage: 'Leaderboard' },
  myTopPeople: { id: 'my-top-people', defaultMessage: 'My Top People' },
});

function mapStateToProps(state) {
  const { entities, company } = state;

  // Map arrays
  const featuredStories = mapStories(company.featuredStories, entities);
  const topStories = mapStories(company.topStories, entities);
  const latestStories = mapStories(company.latestStories, entities);
  const myRecommendedStories = mapStories(company.myRecommendedStories, entities);
  const myMostViewedStories = mapStories(company.myMostViewedStories, entities);

  const myTopUsers = company.myTopUsers.map(id => entities.users[id]);
  const leaderboard = company.leaderboard.map(id => entities.users[id]);

  return {
    ...company,
    featuredStories: featuredStories,
    topStories: topStories,
    latestStories: latestStories,
    myRecommendedStories: myRecommendedStories,
    myMostViewedStories: myMostViewedStories,
    myTopUsers: myTopUsers,
    leaderboard: leaderboard,

    // Settings
    showHiddenChannels: state.settings.contentSettings.showHiddenChannels
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadCompanyAll,
    loadCompanyStories,
    loadCompanyUsers,

    toggleUserFollow,
    addFileToViewer,

    setFeaturedScrollPosition
  })
)
export default class Featured extends Component {
  static propTypes = {
    featuredLoaded: PropTypes.bool,
    leaderboardLoaded: PropTypes.bool,

    featuredStories: PropTypes.array,
    topStories: PropTypes.array,
    latestStories: PropTypes.array,
    myRecommendedStories: PropTypes.array,
    myMostViewedStories: PropTypes.array,

    showHiddenChannels: PropTypes.bool,

    myTopUsers: PropTypes.array,
    leaderboard: PropTypes.array
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

  UNSAFE_componentWillMount() {
    const {
      hasLeaderboard,
      hasTopPeople  // should be named hasMyTopUsers
    } = this.context.settings.userCapabilities;
    const {
      allLoaded,
      topStoriesLoaded,
      latestStoriesLoaded,
      featuredStoriesLoaded,
      myRecommendedStoriesLoaded,
      myMostViewedStoriesLoaded,
      leaderboardLoaded,
      myTopUsersLoaded,
      showHiddenChannels
    } = this.props;
    const anyLoaded = allLoaded || topStoriesLoaded || latestStoriesLoaded ||
                      featuredStoriesLoaded || myRecommendedStoriesLoaded ||
                      myMostViewedStoriesLoaded || leaderboardLoaded || myTopUsersLoaded;

    // Load each list individually on initial load
    if (!anyLoaded) {
      if (!this.props.topStoriesLoaded) {
        this.props.loadCompanyStories('topStories', showHiddenChannels);
      }
      if (!this.props.latestStoriesLoaded) {
        this.props.loadCompanyStories('latestStories', showHiddenChannels);
      }
      if (!this.props.featuredStoriesLoaded) {
        this.props.loadCompanyStories('featuredStories', showHiddenChannels);
      }
      if (!this.props.myRecommendedStoriesLoaded) {
        this.props.loadCompanyStories('myRecommendedStories', showHiddenChannels);
      }
      if (!this.props.myMostViewedStoriesLoaded) {
        this.props.loadCompanyStories('myMostViewedStories', showHiddenChannels);
      }

      if (hasLeaderboard && !this.props.leaderboardLoaded) {
        this.props.loadCompanyUsers('leaderboard');
      }
      if (hasTopPeople && !this.props.myTopUsersLoaded) {
        this.props.loadCompanyUsers('myTopUsers');
      }

    // Load all content in the background
    } else if (anyLoaded) {
      this.props.loadCompanyAll(showHiddenChannels);
    }
  }

  componentDidMount() {
    const { ui } = this.props;

    // Restore scroll position if loaded
    if (ui.featuredScrollY && this.container && this.container.parentElement) {
      this.container.parentElement.scrollTop = ui.featuredScrollY;
    }
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

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, user, userCapabilities } = this.context.settings;
    const { hasLeaderboard, hasTopPeople } = userCapabilities;
    const {
      allLoaded,

      featuredStories,
      featuredStoriesLoaded,
      featuredStoriesLoading,

      topStories,
      topStoriesLoaded,

      latestStories,
      latestStoriesLoaded,

      myRecommendedStories,
      myRecommendedStoriesLoaded,

      myTopUsers,
      myTopUsersLoaded,

      myMostViewedStories,
      myMostViewedStoriesLoaded,

      leaderboard,
      leaderboardLoaded,

      onAnchorClick,
      onStoryClick
    } = this.props;
    const styles = require('./Featured.less');
    const minFeaturedCount = 3;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Story Lists
    const featuredStoriesEmpty = (allLoaded || featuredStoriesLoaded) && featuredStories.length < minFeaturedCount;
    const latestStoriesEmpty = (allLoaded || latestStoriesLoaded) && !latestStories.length;
    const mostViewedStoriesEmpty = (allLoaded || myMostViewedStoriesLoaded) && !myMostViewedStories.length;
    const recommendedStoriesEmpty = (allLoaded || myRecommendedStoriesLoaded) && !myRecommendedStories.length;
    const topStoriesEmpty = (allLoaded || topStoriesLoaded) && !topStories.length;

    // User Lists
    const myTopUsersboardEmpty = (allLoaded || myTopUsersLoaded) && !myTopUsers.length;
    const leaderboardEmpty = (allLoaded || leaderboardLoaded) && !leaderboard.length;

    // Are minimum Featured Stories available?
    const minFeatured = featuredStories.filter(s => s.isFeatured).length >= minFeaturedCount;

    // Display 'My Hub' section when >1 list is available
    const showMyHub = !mostViewedStoriesEmpty || (hasTopPeople && !myTopUsersboardEmpty) || !recommendedStoriesEmpty;

    // Determine column width as %
    let colWidth = '33%';
    const cols = [!topStoriesEmpty, !latestStoriesEmpty, !leaderboardEmpty];
    const activeCols = cols.filter(v => v);
    if (activeCols.length > 1) {
      colWidth = (100 / activeCols.length) + '%';
    }

    return (
      <div
        ref={(c) => { this.container = c; }}
        className={styles.Featured}
      >
        <Helmet>
          <title>{strings.featured}</title>
        </Helmet>
        {!featuredStoriesEmpty && <section>
          {featuredStoriesLoading && <div className={styles.featuredListLoader}>
            <Loader type="content" />
          </div>}
          {!featuredStoriesLoading && minFeatured && <FeaturedSlider
            list={featuredStories}
            slideWidth={640}
            autoSlide
            showBadges={userCapabilities.hasStoryBadges}
            authString={authString}
            onSlideChange={this.handleFeaturedSlideChange}
            onAnchorClick={onAnchorClick}
            onStoryClick={onStoryClick}
          />}
          {!featuredStoriesLoading && !minFeatured && <FeaturedList
            list={featuredStories}
            showBadges={userCapabilities.hasStoryBadges}
            authString={authString}
            onAnchorClick={onAnchorClick}
            onStoryClick={onStoryClick}
            className={styles.featuredListWrapper}
          />}
        </section>}

        {activeCols.length > 0 &&
        <section className={styles.columns}>
          {!topStoriesEmpty && <div data-id="top-stories" className={styles.topStories} style={{ width: colWidth }}>
            <h4>{strings.topStories}</h4>
            <List
              list={topStories && topStories.slice(0, 6)}
              loading={this.props.topStoriesLoading}
              thumbSize="medium"
              showThumb
              itemProps={{
                showIcons: false
              }}
              className={styles.featuredList}
              onItemClick={onStoryClick}
            />
          </div>}
          {!latestStoriesEmpty && <div data-id="latest-stories" className={styles.latestStories} style={{ width: colWidth }}>
            <h4>{strings.latestStories}</h4>
            <List
              list={latestStories && latestStories.slice(0, 6)}
              loading={this.props.latestStoriesLoading}
              thumbSize="medium"
              showThumb
              className={styles.featuredList}
              onItemClick={onStoryClick}
            />
          </div>}
          {hasLeaderboard && !leaderboardEmpty && <div data-id="leaderboard" className={styles.leaderboard} style={{ width: colWidth }}>
            <h4>{strings.leaderboard}</h4>
            <List
              list={leaderboard && leaderboard.slice(0, 6)}
              loading={this.props.leaderboardLoading}
              error={this.props.leaderboardError}
              thumbSize="medium"
              showThumb
              showFollow
              className={styles.featuredList}
              currentUser={user}
              onItemClick={onAnchorClick}
              onFollowClick={this.handleFollowClick}
            />
          </div>}
        </section>}

        {showMyHub && <section className={styles.rows}>
          {!recommendedStoriesEmpty && <div data-id="recommended-stories" className={styles.storyGridList}>
            <h4>{strings.recommendedStories}</h4>
            <List
              list={myRecommendedStories.slice(0, 6)}
              loading={this.props.myRecommendedStoriesLoading}
              grid
              thumbSize="medium"
              itemProps={{
                showThumb: true,
                showIcons: true,
                showBadges: userCapabilities.hasStoryBadges
              }}
              className={this.props.myRecommendedStoriesLoading ? styles.rowLoader : null}
              itemClassName={styles.featuredStoryGridItem}
              onItemClick={onStoryClick}
            />
          </div>}
          {hasTopPeople && !myTopUsersboardEmpty && <div data-id="top-people" className={styles.featuredUserGridItem}>
            <h4>{strings.myTopPeople}</h4>
            <List
              list={myTopUsers.slice(0, 6)}
              loading={this.props.myTopUsersLoading}
              grid
              thumbSize="medium"
              itemProps={{
                showThumb: true
              }}
              className={this.props.myTopUsersLoading ? styles.rowLoader : null}
              onItemClick={onAnchorClick}
            />
          </div>}
          {!mostViewedStoriesEmpty && <div data-id="most-viewed-stories" className={styles.storyGridList}>
            <h4>{strings.myMostViewedStories}</h4>
            <List
              list={myMostViewedStories.slice(0, 6)}
              loading={this.props.myMostViewedStoriesLoading}
              grid
              itemProps={{
                showThumb: true,
                showIcons: true,
                showBadges: userCapabilities.hasStoryBadges
              }}
              thumbSize="medium"
              showBadges={userCapabilities.hasStoryBadges}
              itemClassName={styles.featuredStoryGridItem}
              className={this.props.myMostViewedStoriesLoading ? styles.rowLoader : null}
              onItemClick={onStoryClick}
            />
          </div>}
        </section>}
      </div>
    );
  }
}
