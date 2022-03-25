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

import moment from 'moment-timezone';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

const messages = defineMessages({
  addMeeting: { id: 'add-meeting', defaultMessage: 'Add {meetings}' },
  editMeeting: { id: 'edit-meeting', defaultMessage: 'Edit {meetings}' },

  add: { id: 'add', defaultMessage: 'Add' },
  save: { id: 'save', defaultMessage: 'Save' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  allDay: { id: 'all-day', defaultMessage: 'All Day' },

  titlePlaceholder: { id: 'meeting-name', defaultMessage: '{meeting} Name' },
  timeZone: { id: 'time-zone', defaultMessage: 'Time Zone' },
  start: { id: 'start', defaultMessage: 'Start' },
  end: { id: 'end', defaultMessage: 'End' },
});

class EventEditor extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    tz: PropTypes.string,
    allDay: PropTypes.bool,

    strings: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,

    onTitleChange: PropTypes.func.isRequired,
    onStartChange: PropTypes.func.isRequired,
    onEndChange: PropTypes.func.isRequired,
    onTzChange: PropTypes.func.isRequired,
    onAllDayChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    allDay: false
  };

  render() {
    const { title, start, end, tz, allDay, strings, styles } = this.props;

    // Convert times to ms
    const startTime = start * 1000;
    const endTime = end * 1000;

    // Round minimum start time to nearest 15m in future
    const minStart = moment().startOf('minute');
    const remainder = 15 - (minStart.minute() % 15);
    minStart.add(remainder, 'minutes');

    // Add 15m to end time
    const minEnd = minStart.clone().add(15, 'minutes');

    // TODO: default time format settings
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'h:mm A';

    const startFormat = allDay ? dateFormat : dateFormat + ' ' + timeFormat;
    const endFormat = dateFormat + ' ' + timeFormat;

    return (
      <div className={styles.EventEditor}>
        <Text placeholder={strings.titlePlaceholder} value={title} onChange={this.props.onTitleChange} />

        <div className={styles.eventWrapper}>
          <div data-id="tz" className={styles.tz}>
            <h4>{strings.timeZone}</h4>
            <DateTimePicker
              tz={tz}
              showDate={false}
              showTime={false}
              onChange={this.props.onTzChange}
            />
          </div>

          <div data-id="start" className={styles.start}>
            <h4>{strings.start}</h4>
            <DateTimePicker
              datetime={startTime}
              min={minStart.toDate()}
              format={startFormat}
              showTime={!allDay}
              showTz={false}
              tz={tz}
              onChange={this.props.onStartChange}
            />
            <Checkbox
              inputId="allDay"
              label={strings.allDay}
              name="allDay"
              value="allDay"
              checked={allDay}
              onChange={this.props.onAllDayChange}
              className={styles.allDayCheckbox}
            />
          </div>
          {!allDay && <div data-id="end" className={styles.end}>
            <h4>{strings.end}</h4>
            <DateTimePicker
              datetime={endTime}
              min={minEnd.toDate()}
              format={endFormat}
              showTz={false}
              tz={tz}
              onChange={this.props.onEndChange}
            />
          </div>}
        </div>
      </div>
    );
  }
}

export default class StoryEditEventModal extends PureComponent {
  static propTypes = {
    event: PropTypes.object,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      eventData: {},
      canSave: false
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.event && this.props.event.id) {
      const tzStart = this.revertTimezone(this.props.event.start, this.props.event.tz);
      const tzEnd = this.revertTimezone(this.props.event.end, this.props.event.tz);
      this.setState({
        eventData: {
          ...this.props.event,
          start: tzStart,
          end: tzEnd
        }
      });
    } else {
      // Round start time to nearest 15m in future
      const defaultStart = moment().startOf('minute');
      const remainder = 15 - (defaultStart.minute() % 15);
      defaultStart.add(remainder, 'minutes');

      // Add 15m to end time
      const defaultEnd = defaultStart.clone().add(15, 'minutes');
      const defaultTz = moment.tz.guess();

      // New event defaults
      this.setState({
        eventData: {
          title: '',
          start: defaultStart.unix(),  // seconds
          end: defaultEnd.unix(),      // seconds
          tz: defaultTz
        }
      });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const { title, start, end, tz, allDay } = this.state.eventData;

    if (nextState.eventData.title !== title ||
        nextState.eventData.start !== start ||
        nextState.eventData.end !== end ||
        nextState.eventData.tz !== tz ||
        nextState.eventData.allDay !== allDay) {
      this.checkSave(nextState);
    }
  }

  changeTimezone(datetime, tz) {
    const originDate = moment(datetime * 1000).format().substr(0, 19);
    const tzVal = moment.tz(datetime * 1000, tz).format('ZZ');
    const newDate = originDate + tzVal;
    return moment(newDate).unix();
  }

  revertTimezone(datetime, tz) {
    const originDate = moment(datetime * 1000).tz(tz).format().substr(0, 19);
    const tzVal = moment(datetime * 1000).format('ZZ');
    const newDate = originDate + tzVal;
    return moment(newDate).unix();
  }

  checkSave(state) {
    const { title, start, end, allDay } = state.eventData;
    let canSave = false;

    // Must have title
    // end time must be greater than start time if not all day
    if (title && ((end > start) || allDay)) {
      canSave = true;
    }

    this.setState({ canSave: canSave });
  }

  handleTitleChange(event) {
    const newEvent = {
      ...this.state.eventData,
      title: event.currentTarget.value
    };

    this.setState({ eventData: newEvent });
  }

  handleStartChange(datetime) {
    const newEvent = {
      ...this.state.eventData,
      start: datetime / 1000
    };

    if (newEvent.end <= newEvent.start) {
      newEvent.end = newEvent.start + 15 * 60;  // add 15 mins
    }

    this.setState({
      eventData: newEvent
    });
  }

  handleEndChange(datetime) {
    const newEvent = { ...this.state.eventData };
    newEvent.end = datetime / 1000;
    this.setState({ eventData: newEvent });
  }

  handleTzChange(datetime, tz) {
    const newEvent = {
      ...this.state.eventData,
      tz: tz
    };
    this.setState({ eventData: newEvent });
  }

  handleAllDayChange(event) {
    const newEvent = {
      ...this.state.eventData,
      allDay: event.currentTarget.checked
    };
    this.setState({ eventData: newEvent });
  }

  handleSaveClick(event) {
    // Propagate with event data
    if (typeof this.props.onSave === 'function') {
      const modEventData = this.state.eventData;
      modEventData.start = this.changeTimezone(modEventData.start, modEventData.tz);
      modEventData.end = this.changeTimezone(modEventData.end, modEventData.tz);
      this.props.onSave(event, modEventData);
    }
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { event, onClose } = this.props;
    const styles = require('./StoryEditEventModal.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, { meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    const headingText = (event && event.id) ? strings.editMeeting : strings.addMeeting;
    const saveText = (event && event.id) ? strings.save : strings.add;

    return (
      <Modal
        id="story-edit-event"
        autosize={false}
        escClosesModal
        isVisible
        headerTitle={headingText}
        headerCloseButton
        footerChildren={(
          <div>
            <Btn data-id="cancel" large alt onClick={onClose}>
              {strings.cancel}
            </Btn>
            <Btn data-id="save" large inverted disabled={!this.state.canSave} onClick={this.handleSaveClick}>
              {saveText}
            </Btn>
          </div>
        )}
        onClose={onClose}
        className={styles.modalWrap}
        bodyClassName={styles.modalBody}
      >
        <div className={styles.StoryEditEventModal}>
          <EventEditor
            strings={strings}
            styles={styles}
            onTitleChange={this.handleTitleChange}
            onStartChange={this.handleStartChange}
            onEndChange={this.handleEndChange}
            onTzChange={this.handleTzChange}
            onAllDayChange={this.handleAllDayChange}
            {...this.state.eventData}
          />
        </div>
      </Modal>
    );
  }
}
