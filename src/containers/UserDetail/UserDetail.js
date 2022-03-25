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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';
import { Route } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  addPraise,
  deletePraise,
  loadFollowers,
  loadFollowing,
  loadUserGroups,
  loadProfile,
  loadPublishedStories,
  close,
  toggleAllPraises,
  toggleUserFollow,
} from 'redux/modules/user';
import { mapFiles, mapPraises, mapStories, mapUsers, mapGroups } from 'redux/modules/entities/helpers';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import AppHeader from 'components/AppHeader/AppHeader';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import ProfileDetails from 'components/People/ProfileDetails';
import TriggerList from 'components/TriggerList/TriggerList';

const messages = defineMessages({
  me: { id: 'me', defaultMessage: 'Me' },
  people: { id: 'people', defaultMessage: 'People' },
  profile: { id: 'profile', defaultMessage: 'Profile' },

  followers: { id: 'followers', defaultMessage: 'Followers' },
  following: { id: 'following', defaultMessage: 'Following' },
  groups: { id: 'groups', defaultMessage: 'Groups' },

  followersEmptyHeading: { id: 'followers-empty-heading', defaultMessage: 'No one has followed {name} yet' },
  followersEmptyMessage: { id: 'followers-empty-message', defaultMessage: 'Be the first to follow {name}' },

  followingEmptyHeading: { id: 'following-empty-heading', defaultMessage: '{name} is not following anyone' },

  groupsEmptyHeading: { id: 'groups-empty-heading', defaultMessage: '{name} is not belong to any group' },

  published: { id: 'published', defaultMessage: 'Published' },
  pubishedEmptyHeading: { id: 'published-stories-empty-heading', defaultMessage: '{name} has no published {stories}' },

  scheduledStories: { id: 'scheduled-stories', defaultMessage: 'Scheduled {stories}' },
});

function mapStateToProps(state) {
  const { entities, chat, people, user } = state;
  const id = user.id;

  let userProfile = {};
  let praises = [];

  if (id) {
    // Merge user profile
    userProfile = {
      ...user,
      ...entities.users[id],
      mostVisitedFiles: mapFiles(entities.users[id].mostVisitedFiles, entities),
      mostVisitedStories: mapStories(entities.users[id].mostVisitedStories, entities),
      publishedStories: mapStories(entities.users[id].publishedStories, entities),
      recentlyFollowed: mapUsers(entities.users[id].recentlyFollowed, entities),
      //recentShares - TODO: mapShares

      following: mapUsers(entities.users[id].following, entities),
      followers: mapUsers(entities.users[id].followers, entities),
      groups: mapGroups(entities.users[id].groups, entities),
      groupComplete: entities.users[id].groupComplete,
      groupLoading: entities.users[id].groupLoading,
      groupLoaded: entities.users[id].groupLoaded,
    };
    // Map praises
    praises = mapPraises(entities.users[id].praises, entities, user.pendingPraise);

    // Filter deleted
    praises = praises.filter(p => p.status !== 'deleted');
  }

  return {
    ...people,
    ...user,
    profileLoaded: userProfile.profileLoaded,
    profileLoading: userProfile.profileLoading,
    userProfile: userProfile,
    praises: praises,
    showingPraises: user.areAllPraisesVisibled ? praises.reverse() : praises.reverse().slice(-3),

    audioSupported: chat.audioSupported,
    videoSupported: chat.videoSupported
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addPraise,
    deletePraise,
    loadFollowers,
    loadFollowing,
    loadUserGroups,
    loadPublishedStories,
    close,

    loadProfile,
    toggleAllPraises,
    toggleUserFollow,
  })
)
export default class UserDetail extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isCurrentUser: false
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { hasPeople } = this.context.settings.userCapabilities;
    const { id } = this.props.match.params;
    const currentUserId = this.context.settings.user.id;

    // Loading own profile
    if (this.props.location.pathname.indexOf('/profile') > -1 || id === currentUserId) {
      this.setState({ isCurrentUser: true });
      this.props.loadProfile(currentUserId, true);

    // Loading other user
    } else if (hasPeople) {
      this.props.loadProfile(id);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    const currentUserId = this.context.settings.user.id;

    const loadedId = parseInt(this.props.match.params.id, 10);
    const nextId = parseInt(nextProps.match.params.id, 10);

    // Navigating away from current user profile
    if (!this.props.loading && nextProps.location.pathname === '/profile' && location.pathname !== '/profile') {
      this.setState({ isCurrentUser: true });
      this.props.loadProfile(currentUserId, true);

    // Navigate to new user profile by id
    } else if (!this.props.loading && nextId && nextId !== loadedId) {
      this.setState({ isCurrentUser: false });
      this.props.loadProfile(nextId);
    }
  }

  componentWillUnmount() {
    // Close Story if navigating away from Profile Detail/Edit
    if (this.props.location.pathname.indexOf('profile') === -1) {
      this.props.close();
    }
  }

  // Praises
  handleShowMore() {
    this.props.toggleAllPraises(true);
  }

  handleAddPraise(message) {
    const { user } = this.context.settings;
    const currentUser = user;

    const data = {
      id: null,
      time: Math.round(new Date().getTime() / 1000),
      message: message,
      praisedBy: currentUser.id,
      userPraisedId: this.props.userProfile.id,
    };

    this.props.addPraise(data);
  }

  handleDeletePraise(context) {
    this.props.deletePraise(context.props);
  }

  handleCloseModal() {
    this.props.history.push(this.props.match.url);
  }

  handleOpenModal(event) {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleFollowersLoad() {
    const { id, followers } = this.props.userProfile;
    this.props.loadFollowers(id, followers.length);
  }

  handleFollowingLoad() {
    const { id, following } = this.props.userProfile;
    this.props.loadFollowing(id, following.length);
  }

  handleGroupsLoad() {
    const { id, groups } = this.props.userProfile;
    this.props.loadUserGroups(id, groups.length);
  }

  handleFollowClick(event, context) {
    event.preventDefault();
    this.props.toggleUserFollow(context.props.id, !context.props.isFollowed);
  }

  handlePublishedStoriesLoad(offset = 0) {
    this.props.loadPublishedStories(this.props.userProfile.id, offset);
  }

  handleClose(event) {
    event.preventDefault();
    if (!window.previousLocation || window.previousLocation.pathname === this.props.location.pathname) {
      this.props.history.push.push('/');
    } else {
      this.props.history.push.goBack();
    }
  }

  renderSummary(strings) {
    const { hasTextChat, hasVideoChat } = this.context.settings.userCapabilities;
    const { match, userProfile } = this.props;
    const {
      following,
      followingLoaded,
      followingLoading,
      followingComplete,
      groups,
      groupLoaded,
      groupLoading,
      groupComplete,

      followers,
      followersLoaded,
      followersLoading,
      followersComplete
    } = userProfile;
    const styles = require('./UserDetail.less');
    const canVideoChat = hasVideoChat && (this.props.audioSupported || this.props.videoSupported);

    return (
      <div className={styles.userSummary}>
        <ProfileDetails
          {...userProfile}
          isVisibleAllPraises={this.props.areAllPraisesVisibled}
          showingPraises={this.props.showingPraises}
          praises={this.props.praises}

          profileLoaded={this.props.profileLoaded}
          profileError={this.props.profileError}

          showCall={canVideoChat}
          showChat={hasTextChat}

          onOpenModalClick={this.handleOpenModal}
          onAddPraise={this.handleAddPraise}
          onDeletePraise={this.handleDeletePraise}
          onShowMore={this.handleShowMore}
          onClose={this.handleClose}

          onAnchorClick={this.props.onAnchorClick}
          onCallClick={this.props.onCallClick}
          onFileClick={this.props.onFileClick}
          onStoryClick={this.props.onStoryClick}
          onFollowClick={this.handleFollowClick}
        />

        {/* Followers Modal */}
        <Route
          path={`${match.url}/followers`}
          render={() => (<Modal
            headerTitle={strings.followers}
            isVisible
            width="medium"
            backdropClosesModal
            escClosesModal
            headerCloseButton
            onClose={this.handleCloseModal}
            bodyClassName={styles.userModal}
          >
            <TriggerList
              list={followers}
              isLoaded={followersLoaded}
              isLoading={followersLoading}
              isLoadingMore={followersLoading && followers.length > 0}
              isComplete={followersComplete}
              onGetList={this.handleFollowersLoad}
              listProps={{
                thumbSize: 'small',
                showFollow: true,
                showThumb: true,
                emptyHeading: strings.followersEmptyHeading,
                emptyMessage: strings.followersEmptyMessage,
                onItemClick: this.props.onAnchorClick,
                onFollowClick: this.handleFollowClick,
                className: styles.userList
              }}
            />
          </Modal>)}
        />

        {/* Following Modal */}
        <Route
          path={`${match.url}/following`}
          render={() => (<Modal
            headerTitle={strings.following}
            isVisible
            width="medium"
            backdropClosesModal
            escClosesModal
            headerCloseButton
            onClose={this.handleCloseModal}
            bodyClassName={styles.userModal}
          >
            <TriggerList
              list={following}
              isLoaded={followingLoaded}
              isLoading={followingLoading}
              isLoadingMore={followingLoading && following.length > 0}
              isComplete={followingComplete}
              onGetList={this.handleFollowingLoad}
              listProps={{
                thumbSize: 'small',
                showFollow: true,
                showThumb: true,
                emptyHeading: strings.followingEmptyHeading,
                emptyMessage: '',
                onItemClick: this.props.onAnchorClick,
                onFollowClick: this.handleFollowClick,
                className: styles.userList
              }}
            />
          </Modal>)}
        />
        {/* Groups Modal */}
        <Route
          path={`${match.url}/groups`}
          render={() => (<Modal
            headerTitle={strings.groups}
            isVisible
            width="medium"
            backdropClosesModal
            escClosesModal
            headerCloseButton
            onClose={this.handleCloseModal}
            bodyClassName={styles.userModal}
          >
            <TriggerList
              list={groups}
              isLoaded={groupLoaded}
              isLoading={groupLoading}
              isLoadingMore={groupLoading && groups.length > 0}
              isComplete={groupComplete}
              onGetList={this.handleGroupsLoad}
              listProps={{
                thumbSize: 'small',
                showFollow: true,
                showThumb: true,
                emptyHeading: strings.groupsEmptyHeading,
                emptyMessage: '',
                onItemClick: () => {},
                className: styles.userList
              }}
            />
          </Modal>)}
        />
      </div>
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming, userCapabilities } = this.context.settings;
    const { hasPeople, hasStoryBadges } = userCapabilities;
    const { userProfile } = this.props;
    const {
      publishedStoriesLoaded,
      publishedStoriesLoading,
      publishedStoriesComplete
    } = userProfile;
    const pathname = this.props.location.pathname;
    const styles = require('./UserDetail.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, name: userProfile.name });

    // Check user permission
    if (!hasPeople && !this.state.isCurrentUser) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="You are not allowed to view People"
          onCloseClick={this.handleClose}
        />
      );
    }

    // Header breadcrumbs
    let paths = [];

    // Profile route displays as Me > Profile
    if (this.props.location.pathname === '/profile') {
      paths = [{
        name: strings.me,
        path: '/me'
      }, {
        name: strings.profile,
        path: '/profile'
      }];

    // People and sub paths
    } else {
      paths = [{
        name: strings.people,
        path: '/people'
      }, {
        name: userProfile.name || '',
        path: '/people/' + this.props.match.params.id
      }];
    }

    // Sub paths include /published
    if (pathname.indexOf('published') > -1) {
      paths.push({
        name: strings.published,
        path: '/people/' + this.props.match.params.id,
        component: (
          <TriggerList
            list={userProfile.publishedStories}
            isLoaded={publishedStoriesLoaded}
            isLoading={publishedStoriesLoading}
            isLoadingMore={publishedStoriesLoading && userProfile.publishedStories && userProfile.publishedStories.length > 0}
            isComplete={publishedStoriesComplete}
            onGetList={this.handlePublishedStoriesLoad}
            listProps={{
              grid: true,
              itemsProps: {
                showBadges: hasStoryBadges,
                showIcons: true,
                showThumb: true
              },
              emptyHeading: strings.pubishedEmptyHeading,
              emptyMessage: '',
              onItemClick: this.props.onStoryClick
            }}
          />
        )
      });
    }

    const pageTitle = paths[paths.length - 1].name;

    if (!this.props.profileLoaded) {
      return <Loader type="page" />;
    }

    return (
      <div className={styles.UserDetail} id="user-detail">
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <AppHeader paths={paths} showBreadcrumbs />
        {paths.length === 2 && this.renderSummary(strings)}
        {paths.length > 2 && paths[2].component && <div className={styles.listContainer}>
          {paths[2].component}
        </div>}
      </div>
    );
  }
}
