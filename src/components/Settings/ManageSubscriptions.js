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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import union from 'lodash/union';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import {
  NavLink,
  Route,
  Switch
} from 'react-router-dom';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadChannelSubscriptions,
  loadStorySubscriptions,
} from 'redux/modules/userSettings';
import {
  subscribeChannel,
} from 'redux/modules/content';
import { subscribe as subscribeStory } from 'redux/modules/story/story';
import { mapChannels, mapStories } from 'redux/modules/entities/helpers';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import List from 'components/List/List';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  emptyHeading: { id: 'no-results', defaultMessage: 'No Results' },
  emptyMessageChannel: { id: 'no-subscribed-to-channels', defaultMessage: 'You have not subscribed to any {channels}' },
  emptyMessageStory: { id: 'no-subscribed-to-stories', defaultMessage: 'You have not subscribed to any {stories}' },
  manageSubscriptions: { id: 'manage-subscriptions', defaultMessage: 'Manage Subscriptions' },
});

function mapStateToProps(state) {
  const { entities, userSettings } = state;
  const storiesById = [];
  const channelsById = [];

  // Merge any other subscribed channel
  for (const key in entities.channels) {
    if (entities.channels[key].isSubscribed) channelsById.push(parseInt(key, 10));
  }
  const mergedChannels = union([], userSettings.channels, channelsById);

  let channels = mapChannels(mergedChannels, entities);
  channels = channels.filter(channel => channel.isSubscribed);

  // Merge any other subscribed story
  for (const key in entities.stories) {
    if (entities.stories[key].isSubscribed) storiesById.push(parseInt(key, 10));
  }
  const mergedStories = union([], userSettings.stories, storiesById);

  let stories = mapStories(mergedStories, entities);
  stories = stories.filter(story => story.isSubscribed);

  return {
    ...userSettings,
    channels: channels,
    stories: stories,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadChannelSubscriptions,
    loadStorySubscriptions,

    subscribeChannel,
    subscribeStory,
  })
)
export default class ManageSubscriptions extends Component {
  static propTypes = {
    stories: PropTypes.array,
    channels: PropTypes.array
  };

  static contextTypes = {
    events: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.channelsLoading && !this.props.channelsLoaded && !this.props.channels || !this.props.channels.length) {
      this.props.loadChannelSubscriptions();
    }
    if (!this.props.storiesLoaded && !this.props.storiesLoading && (!this.props.stories || !this.props.stories.length)) {
      this.props.loadStorySubscriptions();
    }
  }

  handleScroll(event) {
    event.preventDefault();
  }

  // Subscribe to a Channel
  toggleChannelSubscription(event, item) {
    event.preventDefault();
    if (item.props.isSubscribed) {
      this.props.subscribeChannel(item.props.id, !item.props.isSubscribed);
    }
  }

  toggleStorySubscription(event, item) {
    event.preventDefault();
    if (item.props.isSubscribed) {
      this.props.subscribeStory(item.props.permId, !item.props.isSubscribed);
    }
  }

  handleItemClick(event) {
    event.preventDefault();
  }

  render() {
    //const { onAnchorClick } = this.context.events;
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { match, channelsLoaded, channelsLoading } = this.props;
    const styles = require('./ManageSubscriptions.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const cx = classNames.bind(styles);
    const navClasses = cx({
      'horizontal-nav': true,
      'secondary-nav': true,
      navigation: true,
    });

    if (!channelsLoaded && channelsLoading) {
      return (<Loader type="page" />);
    }

    return (
      <div className={styles.ManageSubscriptions}>
        <header className={styles.listHeader}>
          <div className={styles.titleWrap}>
            <Breadcrumbs
              paths={[{ 'name': strings.manageSubscriptions, 'path': 'settings/subscriptions' }]}
              className={styles.listCrumbs}
            />
          </div>
        </header>

        <nav className={navClasses}>
          <ul>
            <li>
              <NavLink exact to="/settings/subscriptions" activeClassName="active">
                {naming.channels}
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings/subscriptions/stories" activeClassName="active">
                {naming.stories}
              </NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route
            path={`${match.url}/stories`}
            render={() => (<List
              className={styles.itemListing}
              list={this.props.stories}
              icon="story"
              loading={this.props.storiesLoading}
              loadingMore={this.props.storiesLoadingMore}
              error={this.props.storiesError}
              showThumb
              itemProps={{
                showSubscribe: true,
                thumbSize: 'small',
                showIcons: false,
                showBadges: false,
                onSubscribeClick: this.toggleStorySubscription
              }}
              thumbSize="small"
              emptyHeading={strings.emptyHeading}
              emptyMessage={strings.emptyMessageStory}
              onScroll={this.handleScroll}
              onItemClick={this.handleItemClick}
            />)}
          />
          <Route
            path={`${match.url}`}
            render={() => (<List
              className={styles.itemListing}
              list={this.props.channels}
              loading={this.props.channelsLoading}
              loadingMore={this.props.channelsLoadingMore}
              error={this.props.channelsError}
              itemProps={{
                showSubscribe: true,
                thumbSize: 'small',
                onSubscribeClick: this.toggleChannelSubscription
              }}
              showThumb
              emptyHeading={strings.emptyHeading}
              emptyMessage={strings.emptyMessageChannel}
              onScroll={this.handleScroll}
              onItemClick={this.handleItemClick}
            />)}
          />
        </Switch>
      </div>
    );
  }
}
