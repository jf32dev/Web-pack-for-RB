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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import moment from 'moment-timezone';
import Loader from 'components/Loader/Loader';
import TagFilter from 'components/TagFilter/TagFilter';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getEvents,
  addTag,
  deleteTag,
  searchTags,
  clearTagSuggestions,
} from 'redux/modules/calendar';

import {
  setReferrerPath as setStoryReferrerPath
} from 'redux/modules/story/story';

import AppHeader from 'components/AppHeader/AppHeader';

require('!style-loader!css-loader!./fullcalendar.css');
require('!style-loader!css-loader!./daygrid.css');
require('!style-loader!css-loader!./timegrid.css');

const messages = defineMessages({
  calendar: {
    id: 'calendar',
    defaultMessage: 'Calendar'
  }
});

function mapStateToProps(state) {
  const { calendar } = state;
  return {
    events: calendar.events,
    eventsLoading: calendar.eventsLoading,
    eventsLoaded: calendar.eventsLoaded,
    tags: calendar.tags,
    suggestedTags: calendar.suggestedTags
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getEvents,
    addTag,
    deleteTag,
    searchTags,
    clearTagSuggestions,
    setStoryReferrerPath
  })
)

/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-param-reassign */
export default class Calendar extends Component {
  static propTypes = {
    tags: PropTypes.array,
    suggestedTags: PropTypes.array,
    events: PropTypes.array,
    onAnchorClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    events: []
  };

  constructor(props) {
    super(props);
    this.state = {
      dateStart: '',
      dateEnd: ''
    };
    props.clearTagSuggestions();
    autobind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tags && (!prevProps.tags || prevProps.tags.length !== this.props.tags.length)) {
      const { dateStart, dateEnd } = this.state;
      this.props.getEvents(dateStart, dateEnd, this.props.tags);
    }
  }

  handleAnchorClick(info) {
    const { pathname, search } = this.props.history.location;
    this.props.setStoryReferrerPath(pathname + search);
    info.jsEvent.currentTarget.setAttribute('href', info.event.url);
    this.props.onAnchorClick(info.jsEvent);
  }

  handleDatesRender(info) {
    const { user } = this.context.settings;
    const { tags } = this.props;
    let tz = '+00:00';

    if (user.tz) {
      tz = moment.tz(user.tz).format('ZZ');
    }
    const activeStart = moment(info.view.activeStart).add(-1, 'days').format('YYYY-MM-DDT00:00:00') + tz;
    const activeEnd = moment(info.view.activeEnd).add(1, 'days').format('YYYY-MM-DDT00:00:00') + tz;
    if (activeStart && (this.state.dateStart !== activeStart || this.state.dateEnd !== activeEnd)) {
      this.setState({
        dateStart: activeStart,
        dateEnd: activeEnd
      });
      this.props.getEvents(activeStart, activeEnd, tags);
    }
  }

  handleEventRender(evt) {
    const { user, authString } = this.context.settings;
    const el = evt.el;

    //swap title and time
    if (evt.view.type !== 'dayGridMonth') {
      const contentEl = el.firstElementChild;
      contentEl.appendChild(contentEl.children[0]);
    }

    if (evt.view.type === 'timeGridDay') {
      evt.view.viewSpec.options.slotEventOverlap = false;
    }

    if (evt.event.extendedProps.htmlTitle) {
      el.firstChild.innerHTML = evt.event.extendedProps.htmlTitle;
    } else {
      const tooltipTimeFormat = evt.event.allDay ? 'M/D h:mma' : 'h:mma';
      el.setAttribute('title',
        moment(evt.event.extendedProps.srcStart * 1000).tz(user.tz).format(tooltipTimeFormat) +
        ' - ' +
        moment(evt.event.extendedProps.srcEnd * 1000).tz(user.tz).format(tooltipTimeFormat) +
        '\n' +
        evt.event.title
      );
    }

    const thumbnail = evt.event.extendedProps.storyThumbnail;
    const access_token = (thumbnail && thumbnail.indexOf('?') > 0 ? '&' : '?') + authString;
    const storyIcon = (
      <div
        className={`fc-event-image ${evt.view.type} ${evt.event.allDay ? 'all-day' : ''}`}
        style={{
          backgroundImage: thumbnail && 'url(' + thumbnail + access_token + ')',
          backgroundColor: !thumbnail && evt.event.extendedProps.storyColour
        }}
      />
    );
    const storyIconContainer = document.createElement('DIV');
    el.querySelector('div.fc-content').insertAdjacentElement('afterBegin', storyIconContainer);
    ReactDOM.render(storyIcon, storyIconContainer);
  }

  handleTagAdd(event, newTag) {
    const { tags } = this.props;
    if (!tags.find(tag => tag.id === newTag.id)) {
      this.props.addTag(newTag);
      this.props.clearTagSuggestions();
    }
  }

  handleTagDelete(event, tagIndex) {
    this.props.deleteTag(tagIndex);
    this.props.clearTagSuggestions();
  }

  handleTagSearchChange(event, value) {
    if (!value) {
      this.props.clearTagSuggestions();
    } else {
      this.props.searchTags(value);
    }
  }

  render() {
    const { naming, user } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const {
      events,
      tags,
      eventsLoading,
      suggestedTags,
    } = this.props;

    //take out suggested tags that has been selected
    const filteredSuggested = suggestedTags.filter(s => !tags.find(t => 1 * t.id === 1 * s.id));

    const style = require('./Calendar.less');

    const formatEvents = events.map(e => {
      const unixEnd = moment(e.end).unix();
      const unixStart = moment(e.start).unix();
      const toConvertAlldayEvent = !e.isAllDay && (unixEnd - unixStart >= 3600 * 24);
      const mEnd = moment(unixEnd * 1000);
      return {
        ...e,
        srcStart: unixStart,
        srcEnd: unixEnd,
        start: moment(unixStart * 1000).format(),
        end: toConvertAlldayEvent ? mEnd.add(1, 'days').startOf('day').format() : mEnd.format(),
        allDay: e.isAllDay || toConvertAlldayEvent,
        url: e.storyPermId ? '/story/' + e.storyPermId + '/meeting/' + e.id : '',
      };
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <div>
        <Helmet>
          <title>{strings.calendar}</title>
        </Helmet>
        <AppHeader>
          <div className={style.headingWrap}>
            <FormattedMessage
              id="calendar"
              defaultMessage="Calendar"
              tagName="h3"
            />
          </div>
        </AppHeader>
        <div className="scrollContainer">
          <div className={style.Calendar}>
            {eventsLoading && <Loader type="content" className={style.Loader} />}
            <FullCalendar
              height="parent"
              defaultView="dayGridMonth"
              header={{ left: 'dayGridMonth, timeGridWeek, timeGridDay', center: 'title', right: 'today prev,next' }}
              plugins={[dayGridPlugin, timeGridPlugin, momentTimezonePlugin]}
              timeGridEventMinHeight={36}
              timeZone={user.tz}
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short'
              }}
              navLinks
              slotDuration="00:15:00"
              eventLimit={5}
              events={formatEvents}
              datesRender={this.handleDatesRender}
              eventClick={this.handleAnchorClick}
              eventRender={this.handleEventRender}
            />
            <TagFilter
              tags={tags}
              suggestedTags={filteredSuggested}
              onTagAdd={this.handleTagAdd}
              onTagDelete={this.handleTagDelete}
              onTagSearchChange={this.handleTagSearchChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
