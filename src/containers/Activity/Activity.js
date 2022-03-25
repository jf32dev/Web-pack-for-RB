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
import moment from 'moment';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getEvents,
  getNotifications
} from 'redux/modules/activity';
import {
  toggleUserFollow
} from 'redux/modules/user';
import { saveNotificationsRead } from 'redux/modules/settings';

import {
  loadFile,
} from 'redux/modules/viewer';

import {
  setReferrerPath as setStoryReferrerPath
} from 'redux/modules/story/story';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';
import List from 'components/List/List';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  activity: {
    id: 'activity',
    defaultMessage: 'Activity'
  },
  notificationsEmptyHeading: {
    id: 'notifications-empty-heading',
    defaultMessage: 'No Notifications',
  },
  notificationsEmptyMessage: {
    id: 'notifications-empty-message',
    defaultMessage: 'Subscribe to {stories}, {channels} or follow People to receive activity notifications.'
  },
  meetingsEmptyHeading: {
    id: 'meetings-empty-heading',
    defaultMessage: 'No Upcoming {meetings}'
  },
  meetingsEmptyMessage: {
    id: 'meetings-empty-message',
    defaultMessage: 'Your schedule is clear.'
  },
});

function mapStateToProps(state) {
  const { entities, activity } = state;

  // Split events to today/upcoming
  // need to adjust for timezone settings
  const now = new Date();
  const dayStart = now.setHours(0, 0, 0, 0) / 1000;
  const dayEnd = now.setHours(23, 59, 59, 999) / 1000;

  // Map to array
  const events = activity.events.map(id => entities.events[id]);
  const notifications = [];
  const notificationsWithDetails = activity.notifications.map(id => {
    const n = {
      ...entities.notifications[id]
    };

    if (n.user) {
      n.user = entities.users[n.user];
    }

    if (n.story) {
      n.story = entities.stories[n.story];
    }
    return n;
  });

  /**
   * Calculate how many days between expire date and now
   * @function getExpireDays
   * @param {timestamps} date
   * @returns {number} number of days
   */
  const getExpireDays = (date) => {
    const today = moment();
    const expireDate = moment(date * 1000);
    return expireDate.diff(today, 'days');
  };

  notificationsWithDetails
    .filter(notification => notification.code !== 'file-expiry') //todo: remove this filter, after the API return actual file expiry date in the response
    .forEach(notification => {
      const expireDays = getExpireDays(notification.date);
      if (notification.code !== 'file-expiry') {
        notifications.push(notification);
      } else if (notification.story.files.length) {
      // if notification is a 'file-expiry' notification & has non-empty files array, add expireDays for it
        notifications.push({ ...notification, expireDays: expireDays });
      }
    });

  return {
    // Split events to today/upcoming
    todaysEvents: events.filter(obj => obj.start >= dayStart && obj.start <= dayEnd),
    upcomingEvents: events.filter(obj => obj.start > dayEnd),

    // Split activity to read/unread
    unreadNotifications: notifications.filter(obj => !obj.read),
    readNotifications: notifications.filter(obj => obj.read),

    files: entities.files,

    hasUnreadNotifications: state.settings.user.hasUnreadNotifications,
    ...activity
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getEvents,
    getNotifications,
    toggleUserFollow,
    saveNotificationsRead,
    setStoryReferrerPath,
    loadFile
  })
)
export default class Activity extends Component {
  static propTypes = {
    todaysEvents: PropTypes.array,
    upcomingEvents: PropTypes.array,
    unreadNotifications: PropTypes.array,
    readNotifications: PropTypes.array,

    onAnchorClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    todaysEvents: [],
    upcomingEvents: [],
    unreadNotifications: [],
    readNotifications: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.getNotifications();

    if (this.context.settings.userCapabilities.hasMeetings) {
      this.props.getEvents();
    }
  }

  componentWillUnmount() {
    const { unreadNotifications } = this.props;

    // Set notifications read when leaving page
    const ids = Array.from(unreadNotifications, n => n.id);

    // Only triggers API if ids is populated
    this.props.saveNotificationsRead(ids);
  }

  handleFollowClick(event, component) {
    this.props.toggleUserFollow(component.props.id, !component.props.isFollowed);
  }

  handleAnchorClick(event) {
    if (typeof this.props.onAnchorClick === 'function') {
      // Set Story referrerPath
      const href = event.currentTarget.getAttribute('href');
      if (href.indexOf('/story') === 0) {
        const { pathname, search } = this.props.history.location;
        this.props.setStoryReferrerPath(pathname + search);
        this.props.onAnchorClick(event);
      }

      if (href.indexOf('/file') === 0) {
        const fileId = +href.replace('/file/', '');
        if (this.props.files[fileId]) {
          this.props.onAnchorClick(event);
        } else {
          event.preventDefault();
          this.props.loadFile(fileId);
        }
      }
    }
  }

  render() {
    const { naming, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const {
      notificationsLoaded,
      unreadNotifications,
      readNotifications,
      eventsLoaded,
      todaysEvents,
      upcomingEvents
    } = this.props;
    const style = require('./Activity.less');

    // Determine when page is loaded
    let bothLoaded = notificationsLoaded && eventsLoaded;
    if (!userCapabilities.hasMeetings) {
      bothLoaded = notificationsLoaded;
    }

    // Translations
    const strings = generateStrings(messages, formatMessage, { meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    return (
      <div>
        <Helmet>
          <title>{strings.activity}</title>
        </Helmet>
        <AppHeader>
          <div className={style.headingWrap}>
            <FormattedMessage
              id="notifications"
              defaultMessage="Notifications"
              tagName="h3"
            />
            {userCapabilities.hasMeetings && <FormattedMessage
              id="meetings"
              defaultMessage="{meetings}"
              tagName="h3"
              values={{ meeting: 'Meeting', meetings: 'Meetings',  ...naming }}
            />}
          </div>
        </AppHeader>
        <div className="scrollContainer">
          {!bothLoaded && <Loader type="page" />}
          {bothLoaded && <div className={style.Activity}>
            <section className={style.divider}>
              {notificationsLoaded && !unreadNotifications.length && !readNotifications.length &&
              <div className={style.emptyWrap}>
                <Blankslate
                  icon="earth"
                  heading={strings.notificationsEmptyHeading}
                  message={strings.notificationsEmptyMessage}
                />
              </div>}

              {unreadNotifications.length > 0 && <div>
                <FormattedMessage
                  id="unread"
                  defaultMessage="Unread"
                  tagName="h4"
                />
                <List
                  list={unreadNotifications}
                  loading={!this.props.notificationsLoaded && this.props.notificationsLoading}
                  showThumb
                  error={this.props.notificationsError}
                  onItemClick={this.handleAnchorClick}
                  onFollowClick={this.handleFollowClick}
                />
              </div>}

              {readNotifications.length > 0 && <div>
                {unreadNotifications.length > 0 && <FormattedMessage
                  id="older-notifications"
                  defaultMessage="Older Notifications"
                  tagName="h4"
                />}
                <List
                  list={readNotifications}
                  icon="notification"
                  showThumb
                  onFollowClick={this.handleFollowClick}
                  onItemClick={this.handleAnchorClick}
                />
              </div>}
            </section>

            {userCapabilities.hasMeetings && <section>
              {!todaysEvents.length && !upcomingEvents.length &&
              <div className={style.emptyWrap}>
                <Blankslate
                  icon="calendar"
                  heading={strings.meetingsEmptyHeading}
                  message={strings.meetingsEmptyMessage}
                />
              </div>}
              {todaysEvents.length > 0 && <div>
                <FormattedMessage
                  id="today"
                  defaultMessage="Today"
                  tagName="h4"
                />
                <List
                  list={todaysEvents}
                  thumbSize="small"
                  onItemClick={this.props.onAnchorClick}
                />
              </div>}
              {upcomingEvents.length > 0 && <div>
                <FormattedMessage
                  id="upcoming"
                  defaultMessage="Upcoming"
                  tagName="h4"
                />
                <List
                  list={upcomingEvents}
                  icon="calendar"
                  loading={!this.props.eventsLoaded && this.props.eventsLoading}
                  error={this.props.eventsError}
                  thumbSize="small"
                  onItemClick={this.props.onAnchorClick}
                />
              </div>}
            </section>}
          </div>}
        </div>
      </div>
    );
  }
}
