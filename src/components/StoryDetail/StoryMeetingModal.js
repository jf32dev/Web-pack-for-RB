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
import { FormattedDate } from 'react-intl';

import Modal from 'components/Modal/Modal';
import autobind from 'class-autobind';

export default class StoryMeetingModal extends PureComponent {
  static propTypes = {
    // List of story events
    meetings: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    strings: {
      allDay: 'All day',
      meetingInfo: 'Meeting Info'
    }
  };

  constructor(props) {
    super(props);
    const customState = {
      selectedMeeting: false,
      isVisible: !!props.match.params.meetingId
    };

    if (props.match.params.meetingId) {
      customState.selectedMeeting = props.meetings.find(event =>
        event.id === parseInt(props.match.params.meetingId, 10)
      );
    }

    this.state = {
      ...customState
    };
    autobind(this);
  }

  renderBody() {
    const { allDay, start, storyTitle, title, tz, userTz } = this.state.selectedMeeting;
    const { strings } = this.props;
    const style = require('./StoryMeetingModal.less');

    let dateElem = (<FormattedDate
      value={start * 1000}
      day="2-digit"
      month="long"
      year="numeric"
      hour="numeric"
      minute="numeric"
      hour12
      timeZone={userTz || tz}
    />);

    if (allDay) {
      dateElem = (<FormattedDate
        value={start * 1000}
        day="2-digit"
        month="long"
        year="numeric"
        hour12
        timeZone={userTz || tz}
      />);
    }

    return (
      <div className={style.StoryMeetingModal}>
        <div className={style.dateBlock}>
          <span>{new Date(start * 1000).getDate()}</span>
        </div>

        <div className={style.infoBlock}>
          <h4 className={style.title}>{title || storyTitle}</h4>
          <p className={style.time}>
            {dateElem}{allDay && <span> - {strings.allDay}</span>}
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        headerTitle={this.props.strings.meetingInfo}
        width="medium"
        backdropClosesModal
        escClosesModal
        headerCloseButton
        footerCloseButton
        onClose={this.props.onClose}
      >
        {this.renderBody()}
      </Modal>
    );
  }
}
