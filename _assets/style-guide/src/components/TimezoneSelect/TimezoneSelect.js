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

import moment from 'moment-timezone';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Select from 'react-select';

// Timezone list
const timezones = require('./timezones.json');

const tzOptions = Object.keys(timezones).map(k => ({ value: k, label: timezones[k] }));

/**
 * Displays a select list of timezones
 */
export default class TimezoneSelect extends PureComponent {
  static propTypes = {
    /* Currently selected timezone */
    value: PropTypes.string,

    /* Override defaults */
    options: PropTypes.array,

    disabled: PropTypes.bool,

    /* Returns the current timezone string */
    onChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    value: moment.tz.guess(),  // detect current timezone
    options: tzOptions
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(obj) {
    // Propagate event
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(obj.value);
    }
  }

  render() {
    const styles = require('./TimezoneSelect.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TimezoneSelect: true,
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <Select
          ref={(c) => { this.elem = c; }}
          name="fixed"
          value={this.props.value}
          options={this.props.options}
          disabled={this.props.disabled}
          clearable={false}
          searchable
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
