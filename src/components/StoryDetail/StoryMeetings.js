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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedRelative } from 'react-intl';

const MeetingItem = (props) => {
  const styles = require('./StoryMeetings.less');
  const anchorUrl = props.rootUrl + '/meeting/' + props.id;

  let dateElem;
  const startTime = props.start * 1000;
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const oneWeekFromNow = Date.now() + (86400000 * 7);

  // Meeting within in the next 7 days
  if (startTime > startOfToday && startTime < oneWeekFromNow) {
    dateElem = (
      <span className={styles.time}>
        <span style={{ marginRight: '0.25rem' }}>
          <FormattedDate
            value={startTime}
            weekday="short"
            day="2-digit"
            month="short"
            year="numeric"
            hour="numeric"
            minute="numeric"
            timeZone={props.userTz || props.tz}
            hour12
          />
        </span>
        <span>
          (<FormattedRelative
            value={startTime}
            style="best fit"
          />)
        </span>
      </span>
    );

  // Meeting in the past or more than 1 week in the future
  } else {
    dateElem = (
      <span className={styles.time}>
        <FormattedDate
          value={startTime}
          weekday="short"
          day="2-digit"
          month="short"
          year="numeric"
          hour="numeric"
          minute="numeric"
          timeZone={props.userTz || props.tz}
          hour12
        />
      </span>
    );
  }

  return (
    <li>
      <a href={anchorUrl} className={styles.title} onClick={props.onClick}>
        {props.title || props.storyTitle}
      </a>
      {dateElem}
    </li>
  );
};

export default class StoryMeetings extends PureComponent {
  static propTypes = {
    meetings: PropTypes.array.isRequired,
    rootUrl: PropTypes.string,
    strings: PropTypes.object,
    onMeetingClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    strings: {
      meetings: 'Meetings',
      meetingsDescription: 'This Story has a related meeting, click the meeting to view more details or view all upcoming meetings.'
    }
  };

  render() {
    const { meetings, rootUrl, strings } = this.props;
    const styles = require('./StoryMeetings.less');

    return (
      <div className={styles.StoryMeetings}>
        <h4>{strings.meetings}</h4>
        <p>{strings.meetingsDescription}</p>
        {meetings.length > 0 && <ul>
          {meetings.map(meeting => (
            <MeetingItem
              key={'meeting-' + meeting.id}
              rootUrl={rootUrl}
              onClick={this.props.onMeetingClick}
              {...meeting}
            />
          ))}
        </ul>}
      </div>
    );
  }
}
