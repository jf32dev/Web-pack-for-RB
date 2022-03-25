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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  NavLink
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment-timezone';
import autobind from 'class-autobind';

import AppHeader from 'components/AppHeader/AppHeader';
import Home from 'containers/Home/Home';
import People from 'containers/People/People';
import Web from 'containers/Web/Web';
import Btn from 'components/Btn/Btn';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  getEvents
} from 'redux/modules/calendar';
import {
  loadPeople,
} from 'redux/modules/people';

@connect(state => {
  const { calendar, settings, people } = state;
  return {
    events: calendar.events,
    eventsLoaded: calendar.eventsLoaded,
    isCompanyDefaultHomescreen: settings.company.defaultHomeScreen !== null ? settings.company.defaultHomeScreen.isCompanyDefault : true,
    offset: people.people.length,
    keyword: people.keyword,
    loading: people.peopleLoadingMore,
    allPeopleLoaded: people.allPeopleLoaded
  };
}, bindActionCreatorsSafe({
  getEvents,
  loadPeople
}))

export default class Company extends Component {
  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (this.props.isCompanyDefaultHomescreen) {
      const { user } = this.context.settings;

      const fromDate = moment().set({ hour: 0, minute: 0, second: 0 }).tz(user.tz).format();
      const toDate = moment().set({ hour: 23, minute: 59, second: 59 }).tz(user.tz).format();

      this.props.getEvents(fromDate, toDate);
    }
  }

  handleOnScroll(event) {
    const target = event.target;
    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger && !this.props.loading && !this.props.allPeopleLoaded) {
      // Load more
      this.props.loadPeople({ keyword: this.props.keyword, offset: this.props.offset });
    }
  }

  render() {
    const { hasPeople, hasWeb } = this.context.settings.userCapabilities;
    const styles = require('./Company.less');
    const isHome = window.location.pathname === '/';
    const { naming, userCapabilities } = this.context.settings;
    const {
      events,
      eventsLoaded,
      isCompanyDefaultHomescreen
    } = this.props;

    return (
      <div className={styles.company}>
        <AppHeader>
          <nav className="horizontal-nav">
            <ul>
              <li>
                <NavLink to="/" exact activeClassName="active">
                  <FormattedMessage id="featured" defaultMessage="Featured" />
                </NavLink>
              </li>
              {hasWeb && <li>
                <NavLink to="/links" activeClassName="active">
                  <FormattedMessage id="links" defaultMessage="Links" />
                </NavLink>
              </li>}
              {hasPeople && <li>
                <NavLink to="/people" activeClassName="active">
                  <FormattedMessage id="people" defaultMessage="People" />
                </NavLink>
              </li>}
            </ul>
          </nav>
        </AppHeader>
        {isHome && isCompanyDefaultHomescreen && <div className={styles.appHeaderDate}>
          <h2>{moment().format('dddd, MMMM Do')}</h2>
          {userCapabilities.hasCalendar && <NavLink to="/calendar">
            <Btn icon="calendar">
              <FormattedMessage
                id="todays-meetings"
                defaultMessage="{todaysMeetingsCount, plural,one {# {meeting} Today} other {# {meetings} Today}}"
                values={{
                  todaysMeetingsCount: eventsLoaded && events.length || 0,
                  meetings: naming.meetings,
                  meeting: naming.meeting
                }}
              />
            </Btn>
          </NavLink>}
        </div>}
        <div className={isHome && isCompanyDefaultHomescreen && styles.scrollContainer || 'scrollContainer'} onScroll={this.handleOnScroll}>
          <Route path="/" exact render={() => <Home {...this.props} />} />
          {hasWeb && <Route path="/links" render={() => <Web {...this.props} />} />}
          {/**JUST for fallback*/}
          {hasWeb && <Route path="/web" render={() => <Web {...this.props} />} />}
          {hasPeople && <Route path="/people" render={() => <People {...this.props} />} />}
        </div>
      </div>
    );
  }
}
