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
import classNames from 'classnames/bind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import CountBadge from 'components/CountBadge/CountBadge';
import List from 'components/List/List';
import Praises from 'components/Praises/Praises';
import UserActivity from 'components/UserActivity/UserActivity';
import UserDetails from 'components/UserDetails/UserDetails';

const messages = defineMessages({
  publishedStories: { id: 'published-stories', defaultMessage: 'Published {stories}' },
  follow: { id: 'follow', defaultMessage: 'Follow' },
  followers: { id: 'followers', defaultMessage: 'Followers' },
  following: { id: 'following', defaultMessage: 'Following' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  editProfile: { id: 'edit-profile', defaultMessage: 'Edit Profile' },
  published: { id: 'published', defaultMessage: 'Published' },

  recentlyFollowed: { id: 'recently-followed', defaultMessage: 'Recently Followed' },
  recentlyShared: { id: 'recently-shared', defaultMessage: 'Recently Shared' },
  mostUsedStories: { id: 'most-used-stories', defaultMessage: 'Most Used {stories}' },
  mostUsedFiles: { id: 'most-used-files', defaultMessage: 'Most Used Files' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  confirmDeletePraise: { id: 'confirm-delete-praise', defaultMessage: 'Are you sure you want to delete this praise?' },
  metadataAttributes: { id: 'metadata-attributes', defaultMessage: 'Metadata Attributes' },
  more: { id: 'more', defaultMessage: 'More' },

  writeAPraise: { id: 'write-a-praise', defaultMessage: 'Write a praise' },
  praiseEmptyHeading: { id: 'no-praises', defaultMessage: 'No praises' },
  praiseEmptyMessage: { id: 'be-the-first-to-praise', defaultMessage: 'Be the first to praise' },

  activityEmptyHeading: { id: 'no-activity-heading', defaultMessage: 'No Activity' },
  activityEmptyMessage: { id: 'no-activity-message', defaultMessage: '{name} has not been active recently' },
});

export default class ProfileDetails extends Component {
  static propTypes = {
    id: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    type: PropTypes.string,
    thumbnail: PropTypes.string,
    isFollowed: PropTypes.bool,
    mobileNumber: PropTypes.string,
    landlineNumber: PropTypes.string,
    role: PropTypes.string,

    mostVisitedFiles: PropTypes.array,
    mostVisitedStories: PropTypes.array,
    publishedStories: PropTypes.array,
    recentlyFollowed: PropTypes.array,
    recentShares: PropTypes.array,
    groups: PropTypes.array,

    badge: PropTypes.object,
    companyData: PropTypes.object,
    skills: PropTypes.array,
    metadata: PropTypes.array,
    social: PropTypes.object,
    stats: PropTypes.object,

    isVisibleAllPraises: PropTypes.bool,
    showingPraises: PropTypes.array,
    praises: PropTypes.array,

    profileLoaded: PropTypes.bool,
    profileError: PropTypes.string,

    showCall: PropTypes.bool,
    showChat: PropTypes.bool,

    onAddPraise: PropTypes.func,
    onDeletePraise: PropTypes.func,
    onShowMore: PropTypes.func,
    onClose: PropTypes.func,
    onCallClick: PropTypes.func,
    onStoryClick: PropTypes.func,
    onSocialClick: PropTypes.func,
    onFollowClick: PropTypes.func,
    onFileClick: PropTypes.func,
    onOpenModalClick: PropTypes.func,

    className: PropTypes.string
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    mostVisitedFiles: [],
    mostVisitedStories: [],
    publishedStories: [],
    recentlyFollowed: [],
    recentShares: [],
    groups: []
  };

  handleNoCountBadgeClick(event) {
    event.preventDefault();
  }

  render() {
    const { naming, user, userCapabilities } = this.context.settings;
    const { hasStoryBadges } = userCapabilities;
    const { formatMessage } = this.context.intl;
    const {
      id,
      firstname,
      lastname,
      email,
      type,
      thumbnail,
      isFollowed,
      mobileNumber,
      landlineNumber,
      role,
      recentlyFollowed,
      recentShares,
      mostVisitedStories,
      mostVisitedFiles,
      publishedStories,
      badge,
      companyData,
      skills,
      metadata,
      social,
      stats,
      showCall,
      showChat,
      className,
      groupCount
    } = this.props;
    const styles = require('./ProfileDetails.less');
    const person = {
      id: id,
      name: firstname + ' ' + lastname,
      email: email,
      type: type,
      thumbnail: thumbnail,
      isFollowed: isFollowed,
      mobileNumber: mobileNumber,
      landlineNumber: landlineNumber,
      role: role,
    };

    const pageRootUrl = id === user.id ? '/' : '/people/' + id + '/';
    const modalRootUrl = id === user.id ? '/profile/' : '/people/' + id + '/';

    const publishedPath = pageRootUrl + 'published';
    const followersPath = modalRootUrl + 'followers';
    const followingPath = modalRootUrl + 'following';
    const groupPath = modalRootUrl + 'groups';

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, name: firstname + ' ' + lastname });

    if (this.props.profileLoaded && this.props.profileError) {
      return (
        <div className={styles.errorMessage}>
          <Blankslate
            icon="error"
            message={this.props.profileError}
          >
            <p><Btn onClick={this.props.onClose} small><FormattedMessage id="close" defaultMessage="Close" /></Btn></p>
          </Blankslate>
        </div>
      );
    }

    const cx = classNames.bind(styles);
    const mainClasses = cx({
      ProfileDetail: true,
    }, className);

    const withMetadataClasses = cx({
      content: true,
      contentWithMetadata: metadata.length > 0,
    });

    const mainListClasses = cx({
      listsWrap: true,
      metadataEnabled: metadata.length > 0,
    });

    // No Activity?
    let noAcivity = false;
    if (!recentlyFollowed.length && !recentShares.length && !mostVisitedStories.length && !mostVisitedFiles.length) {
      noAcivity = true;
    }

    const groupClasses = cx({
      disablePointer: groupCount === 0,
    });
    const publishedStoriesClasses = cx({
      disablePointer: stats.publishedCount === 0,
    });
    const followersClasses = cx({
      disablePointer: stats.followersCount === 0,
    });
    const followingClasses = cx({
      disablePointer: stats.followingCount === 0,
    });
    return (
      <div className={mainClasses}>
        <UserDetails
          id={person.id}
          type={user.id === person.id ? 'personal' : 'public'}
          user={person}
          social={social}
          badge={badge}
          companyData={companyData}
          showCall={showCall}
          showChat={showChat}
          showFollow
          authString={this.context.settings.authString}
          strings={{
            editProfile: strings.editProfile,
            follow: strings.follow,
            following: strings.following
          }}
          onAnchorClick={this.props.onAnchorClick}
          onCallClick={this.props.onCallClick}
          onFollowClick={this.props.onFollowClick}
        >
          <ul className={styles.statsList}>
            <li><CountBadge className={publishedStoriesClasses} href={publishedPath} title={strings.publishedStories} value={stats.publishedCount} onClick={this.props.onAnchorClick} /></li>
            <li><CountBadge className={followersClasses} href={followersPath} title={strings.followers} value={stats.followersCount} onClick={this.props.onOpenModalClick} /></li>
            <li><CountBadge className={followingClasses} href={followingPath} title={strings.following} value={stats.followingCount} onClick={this.props.onOpenModalClick} /></li>
            {user.id === person.id &&
              <li><CountBadge className={groupClasses} href={groupPath} title={strings.groups} value={groupCount} onClick={this.props.onOpenModalClick} /></li>
            }
          </ul>
        </UserDetails>

        <section className={mainListClasses}>
          {metadata.length > 0 && <div className={styles.metadataContainer}>
            <h5>{strings.metadataAttributes}</h5>
            <ul className={styles.metadataList}>
              {metadata.map((result, index) => (
                <li key={index}><strong>{result.attribute.name}: </strong>{result.attributeValue}</li>  // eslint-disable-line
              ))}
            </ul>
          </div>}

          <div className={withMetadataClasses}>
            {skills.length > 0 && <section>
              <FormattedMessage id="skills" defaultMessage="Skills" tagName="h4" />
              <ul className={styles.skills}>
                {skills.map((result, index) => (
                  <li key={index}>{result}</li>  // eslint-disable-line
                ))}
              </ul>
            </section>}

            {publishedStories.length > 0 && <section className={styles.publishedList}>
              <header>
                <h4>{strings.published}</h4>
                {publishedStories.length > 5 && <a href={publishedPath} onClick={this.props.onAnchorClick} className={styles.more}>
                  {strings.more}
                </a>}
              </header>
              <List
                list={publishedStories.slice(0, 6)}
                grid
                thumbSize="medium"
                itemProps={{
                  showThumb: true,
                  showIcons: true,
                  showBadges: hasStoryBadges
                }}
                onItemClick={this.props.onStoryClick}
              />
            </section>}

            <section>
              {!noAcivity && <FormattedMessage id="activity" defaultMessage="Activity" tagName="h4" />}
              <UserActivity
                recentlyFollowed={recentlyFollowed}
                recentlyShared={recentShares}
                mostUsedStories={mostVisitedStories}
                mostUsedFiles={mostVisitedFiles}
                strings={{
                  emptyHeading: strings.activityEmptyHeading,
                  emptyMessage: strings.activityEmptyMessage,
                  recentlyFollowed: strings.recentlyFollowed,
                  recentlyShared: strings.recentlyShared,
                  mostUsedStories: strings.mostUsedStories,
                  mostUsedFiles: strings.mostUsedFiles
                }}
                authString={this.context.settings.authString}
                onAnchorClick={this.props.onAnchorClick}
                onFileClick={this.props.onFileClick}
              />
            </section>

            <section>
              <h4><FormattedMessage id="praises" defaultMessage="Praises" />
                {!this.props.isVisibleAllPraises && this.props.praises && this.props.praises.length > 3 &&
                <span className={styles.showMore} onClick={this.props.onShowMore}>
                  <FormattedMessage id="more" defaultMessage="More" />
                </span>
                }
              </h4>
              <Praises
                praises={this.props.showingPraises}
                canAddPraise={user.id !== person.id}
                canDeletePraise={user.id === person.id}
                strings={{
                  writeAPraise: strings.writeAPraise,
                  emptyHeading: strings.praiseEmptyHeading,
                  emptyMessage: strings.praiseEmptyMessage,
                  delete: strings.delete,
                  cancel: strings.cancel,
                  confirmDeleteMessage: strings.confirmDeletePraise
                }}
                authString={this.context.settings.authString}
                onUserClick={this.props.onAnchorClick}
                onAddPraise={this.props.onAddPraise}
                onDeletePraise={this.props.onDeletePraise}
              />
            </section>
          </div>
        </section>
      </div>
    );
  }
}
