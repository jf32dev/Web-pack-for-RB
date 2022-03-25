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
 * @package style-guide
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

import autobind from 'class-autobind';
import React, { Component } from 'react';
import ComponentItem from '../../views/ComponentItem';
import { TagFilter } from 'components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

require('!style-loader!css-loader!./fullcalendar.css');
require('!style-loader!css-loader!./daygrid.css');
require('!style-loader!css-loader!./timegrid.css');

/* eslint-disable react/jsx-handler-names */
export default class CalendarView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestedTags: [],
      events: [],
      dateStart: '', //stored current date range start
      dateEnd: '' //stored current date range end
    };
    autobind(this);
  }

  handleAnchorClick(info) {
    if (info.event && info.event.url) {
      window.open(info.event.url);
    }
  }

  handleDatesRender(info) {
    /* this event occurs when date range change. Use this to obtain new events from server based on new date range */
    const activeStart = new Date(info.view.activeStart).toISOString();
    const activeEnd = new Date(info.view.activeEnd).toISOString();
    if (activeStart && (this.state.dateStart !== activeStart || this.state.dateEnd !== activeEnd)) {
      this.setState({
        dateStart: activeStart,
        dateEnd: activeEnd
      });
    }
  }

  handleEventRender(evt) {
    /* if need to change event display (change font, add thumbnail etc), use this handle can call evt.event to obtain event element */
    const el = evt.el;
    /* for eample, we can add a new property to event with HTML tag to make it display with styles */
    if (evt.event.extendedProps.htmlTitle) {      
      el.firstChild.innerHTML = evt.event.extendedProps.htmlTitle;
    }
  }

  handleTagAdd(event, newTag) {
    /* add a tag for filering */
    const { tags } = this.state;
    this.setState({
      tags: [...tags, newTag]
    })
  }

  handleTagDelete(event, tagIndex) {
    /* remove (unfilter) selected tags */
    const tags = this.state.tags.slice();
    tags.splice(tagIndex, 1);
    this.setState({
      tags: tags
    });
  }

  handleTagSearchChange(event, value) {
    /* get a new suggestion for new value, then replace it with existing suggested tags */
    const { tags } = this.state;
    const newSuggestion = [{ id: tags.length, name: value }]; //when implenting, should call redux to retieve real tags
    this.setState({
      suggestedTags: newSuggestion
    })
  }

  render() {
    const { events, tags, suggestedTags } = this.state;
    return (
      <section id="CalendarView">
        <h1>Calendar</h1>
        <p>Used to display calendar of meeting events, with ability to filter by tags. Complete usage sample is in hub-web-app-v5</p>
        <ComponentItem>
          <div>
            <FullCalendar
              height="parent"
              defaultView="dayGridMonth"
              header={{ left: 'dayGridMonth, timeGridWeek, timeGridDay', center: 'title', right: 'today prev,next' }}
              plugins={[dayGridPlugin, timeGridPlugin, momentTimezonePlugin]}
              timeGridEventMinHeight={36}
              timeZone='Australia/Sydney'
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short'
              }}
              navLinks
              eventLimit={5}
              events={events}
              datesRender={this.handleDatesRender}
              eventClick={this.handleAnchorClick}
              eventRender={this.handleEventRender}
            />
            <TagFilter
              style={{ top: '80px' }}
              tags={tags}
              suggestedTags={suggestedTags}
              onTagAdd={this.handleTagAdd}
              onTagDelete={this.handleTagDelete}
              onTagSearchChange={this.handleTagSearchChange}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
