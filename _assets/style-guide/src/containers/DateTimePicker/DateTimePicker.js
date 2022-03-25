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

import React, { Component, Fragment } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import { Checkbox, DateTimePicker, TimezoneSelect, Accordion } from 'components';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live';
import parseLiveSourceEditor from 'helpers/parseLiveSourceEditor';

const DateTimePickerDocs = require('!!react-docgen-loader!components/DateTimePicker/DateTimePicker.js');

// UTC unix timestamp in ms (server returns s)
const startDate = 1472727600 * 1000;

export default class DateTimePickerView extends Component {
  render() {
    const scope = {Checkbox, Component, Fragment, autobind, ComponentItem, startDate, TimezoneSelect, DateTimePicker};
    const backgroundColor = { backgroundColor: '#333' };

    const dateTimeCode = `<Fragment>
            <p>Selected unix timestamp (ms): <code>{this.state.datetime}</code></p>
            <div style={{ marginLeft: '1rem' }}>
              <Checkbox label="Show Date" name="showDate" checked={this.state.showDate} onChange={this.handleDateToggle} />
              <Checkbox label="Show Time" name="showTime" checked={this.state.showTime} onChange={this.handleTimeToggle} />
              <Checkbox label="Show Timezone" name="showTz" checked={this.state.showTz} onChange={this.handleTzToggle} />
            </div>
            <ComponentItem>
              <DateTimePicker
                datetime={this.state.datetime}
                tz={this.state.showTz ? this.state.tz : null}
                format={this.state.format}
                showDate={this.state.showDate}
                showTime={this.state.showTime}
                showTz={this.state.showTz}
                onChange={this.handleChange}
              />
            </ComponentItem>
          </Fragment>`
    const dateTimeState = `datetime: startDate,
      format: 'H:mma DD/MM/YY',
      showDate: true,
      showTime: true,
      showTz: true`
    const handleDateToggle = `handleDateToggle() {
      this.setState({ showDate: !this.state.showDate });
    }`
    const handleTimeToggle = `handleTimeToggle() {
      this.setState({ showTime: !this.state.showTime });
    }`
    const handleTzToggle = `handleTzToggle() {
      this.setState({ showTz: !this.state.showTz });
    }`
    const handleChange = `handleChange(datetime, tz) {
      this.setState({
        datetime: datetime,
        tz: tz
      });
    }`

    const tzCode = `<TimezoneSelect
        value={this.state.tz}
        onChange={this.handleTzChange}
      />`;
    const handleTzChange = `handleTzChange(tz) {
        this.setState({ tz: tz });
      }`

    return (
      <section id="DateTimePickerView">
        <h1>DateTimePicker</h1>
        <Docs {...DateTimePickerDocs} />

        <h2>Date, time and timezone</h2>
        <h3>Playground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor(dateTimeState, [handleDateToggle, handleTimeToggle, handleTzToggle, handleChange], dateTimeCode, 'ColourPickerView')}>
          <LivePreview />
            <Accordion title="source" position="left" style={{ borderBottom: '1px solid #ddd', marginBottom: '3rem', paddingBottom: '1rem' }}>
              <div style={backgroundColor}>
                <LiveEditor />
              </div>
            </Accordion>
          <LiveError />
        </LiveProvider>

        <h3>TimezoneSelect</h3>
        <h3>Playground</h3>
        <LiveProvider scope={scope} code={parseLiveSourceEditor('', [handleTzChange], tzCode, 'TimezoneSelectView')}>
          <LivePreview />
            <Accordion title="source" position="left" style={{ borderBottom: '1px solid #ddd', marginBottom: '3rem', paddingBottom: '1rem' }}>
              <div style={backgroundColor}>
                <LiveEditor />
              </div>
            </Accordion>
          <LiveError />
        </LiveProvider>
      </section>
    );
  }
}
