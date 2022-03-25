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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import FeaturedPeopleItem from 'components/People/FeaturedPeopleItem';
import UserItemNew from 'components/UserItemNew/UserItemNew';

const messages = defineMessages({
  similarTitle: { id: 'similar-to-you', defaultMessage: 'Similar to you' },
  featuredTitle: { id: 'featured-people', defaultMessage: 'Featured people' },
});

export default class Recommendations extends Component {
  static propTypes = {
    featuredUsers: PropTypes.array.isRequired,
    similarUsers: PropTypes.array.isRequired,

    onCallClick: PropTypes.func,
    onChatClick: PropTypes.func,
    onFollowClick: PropTypes.func,
    onStoryClick: PropTypes.func,
    onUserClick: PropTypes.func
  };

  static defaultProps = {
    featuredUsers: [],
    similarUsers: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  render() {
    const { userCapabilities } = this.context.settings;
    const { hasStoryBadges } = userCapabilities;
    const { formatMessage } = this.context.intl;
    const { featuredUsers, similarUsers, } = this.props;
    const styles = require('./Recommendations.less');
    const cx = classNames.bind(styles);

    // Alt styling if similar users at limit
    const similarUsersClasses = cx({
      similarUsers: true,
      similarUsersMax: similarUsers.length > 4
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const hasSimilar = similarUsers.length > 0;
    const hasFeatured = featuredUsers.length > 0;

    return (
      <div className={styles.Recommendations}>
        {hasSimilar && <section className={similarUsersClasses}>
          <h4>{strings.similarTitle}</h4>
          {similarUsers.slice(0, 6).map(result => (
            <UserItemNew
              key={result.id}
              grid
              {...result}
              hasUserActions
              onClick={this.props.onUserClick}
              onFollowClick={this.props.onFollowClick}
              className={styles.similarUserItem}
            />
          ))}
        </section>}
        <section className={styles.featuredUsers}>
          <h4>{strings.featuredTitle}</h4>
          {hasFeatured && featuredUsers.map((result) => (
            <FeaturedPeopleItem
              key={result.id}
              author={result}
              stories={result.stories}
              showStoryBadges={hasStoryBadges}
              onCallClick={this.props.onCallClick}
              onChatClick={this.props.onChatClick}
              onStoryClick={this.props.onStoryClick}
              onUserClick={this.props.onUserClick}
              onFollowClick={this.props.onFollowClick}
            />
          ))}
        </section>
      </div>
    );
  }
}
