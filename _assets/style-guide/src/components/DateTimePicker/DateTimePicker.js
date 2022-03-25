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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import moment from 'moment-timezone';
import momentLocalizer from 'react-widgets-moment';
import DateTimePickerWidget from 'react-widgets/lib/DateTimePicker';
import TimezoneSelect from 'components/TimezoneSelect/TimezoneSelect';

momentLocalizer();

/**
 * Makes use of <a href="https://jquense.github.io/react-widgets/docs/#/datetime-picker" target="_blank">DateTimePicker</a> and react-select.
 * Customised LESS file exists in component directory and is imported globally in <em>components.less</em>.
 *
 * All dates are stored on the server in UTC (seconds) and they must be paired with a valid timezone so the server knows when to schedule events. JavaScript requires timestamps to be in milliseconds so remember to multiply by 1000 for correct usage.
 *
 * When displaying a date returned from the server using <code>Date()</code>, <code>FormattedTime</code> or <code>FormattedRelative</code>, it will be displayed in the detected system timezone.
 */
export default class DateTimePicker extends Component {
  static propTypes = {
    /** UTC UNIX timestamp in milliseconds */
    datetime: PropTypes.number,

    /** Timezone of current datetime */
    tz: PropTypes.string,

    /* Format of date/time, defaults to <code>YYYY-MM-DD HH:mm</code> */
    format: PropTypes.string,

    /** Enable date selector */
    showDate: PropTypes.bool,

    /** Enable time selector */
    showTime: PropTypes.bool,

    /** Enable timezone selector */
    showTz: PropTypes.bool,

    /** Set minutes between each entry in the time list */
    step: PropTypes.number,

    min: PropTypes.instanceOf(Date),
    max: PropTypes.instanceOf(Date),
    currentDate: PropTypes.string,
    disabled: PropTypes.bool,

    /* Returns the current datetime in UTC ms and selected timezone string */
    onChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object,

    /** Set placeholder for datetimepicker component if value is empty */
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    tz: moment.tz.guess(),  // detect current timezone
    showDate: true,
    showTime: true,
    showTz: true,
    step: 15,
    format: 'YYYY-MM-DD HH:mm'
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleDateChange(dateObj) {
    // Propagate event if dateObj exists
    if (dateObj && typeof this.props.onChange === 'function') {
      this.props.onChange(dateObj.valueOf(), this.props.tz);
    }
  }

  handleTzChange(tz) {
    // Propagate event
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.props.datetime, tz);
    }
  }

  render() {
    const { datetime, tz, showDate, showTime, showTz } = this.props;
    const styles = require('./DateTimePicker.less');
    const dateObj = datetime !== null ? new Date(datetime) : null;

    return (
      <div className={styles.DateTimePicker} style={this.props.style}>
        {(showDate || showTime) && <DateTimePickerWidget
          value={dateObj}
          date={showDate}
          time={showTime}
          min={this.props.min}
          max={this.props.max}
          currentDate={this.props.currentDate}
          disabled={this.props.disabled}
          format={this.props.format}
          initialView="month"
          finalView="year"
          step={this.props.step}
          onChange={this.handleDateChange}
          className={styles.dateTimePicker}
          placeholder={this.props.placeholder}
        />}

        {showTz && <div className={styles.tz}>
          <TimezoneSelect
            value={tz}
            disabled={this.props.disabled}
            onChange={this.handleTzChange}
          />
        </div>}
      </div>
    );
  }
}
