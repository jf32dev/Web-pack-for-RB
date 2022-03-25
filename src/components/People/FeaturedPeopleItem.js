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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import List from 'components/List/List';
import UserItemNew from 'components/UserItemNew/UserItemNew';

export default class FeaturedPeopleItem extends PureComponent {
  static propTypes = {
    author: PropTypes.object.isRequired,
    stories: PropTypes.array,

    showStoryBadges: PropTypes.bool,

    onFollowClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,
    onUserClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    stories: []
  };

  render() {
    const {
      author,
      stories,
      showStoryBadges,
      onUserClick,
      onFollowClick,
      onStoryClick
    } = this.props;
    const styles = require('./FeaturedPeopleItem.less');

    const newStoryItem = stories.map(storyItem =>  ({ ...storyItem, type: 'newStoryItem' }));

    return (
      <div className={styles.FeaturedPeopleItem}>
        <UserItemNew
          grid
          {...author}
          hasUserActions
          onClick={onUserClick}
          onFollowClick={onFollowClick}
          className={styles.featuredUser}
        />
        <span className={styles.separator} />
        <List
          list={newStoryItem}
          thumbSize="medium"
          itemProps={{
            showThumb: true,
            showIcons: true,
            showBadges: showStoryBadges
          }}
          grid
          onItemClick={onStoryClick}
        />
      </div>
    );
  }
}
