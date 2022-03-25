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
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import { Btn, EventItem } from 'components';

const EventItemDocs = require('!!react-docgen-loader!components/EventItem/EventItem.js');

const events = require('../../static/events.json');

export default class EventItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.setState({ lastClick: href });
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  handlePrepareClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Prepare is clicked'); // eslint-disable-line
  }

  render() {
    const { grid, width, lastClick } = this.state;

    const smallStyle = {
      margin: grid ? '0 -0.5rem -0.5rem' : '-0.5rem'
    };

    const mediumStyle = {
      margin: grid ? '0 -0.75rem -0.75rem' : '-0.5rem'
    };

    const largeStyle = {
      margin: grid ? '0 -1rem -1rem' : '-0.5rem'
    };

    return (
      <section id="EventItemView">
        <h1>EventItem</h1>
        <Docs {...EventItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>{grid ? 'Grid' : 'List'} - Small</h2>
        {!grid && <p>Event name restricted to one line.</p>}
        {grid && <p>Event info is hidden and a tooltip is displayed on hover.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={smallStyle}>
            <EventItem
              thumbSize="small"
              grid={grid}
              showThumb
              onClick={this.handleClick}
              showPrepare={!grid}
              onPrepareClick={this.handlePrepareClick}
              {...events[0]}
            />
            <EventItem
              onClick={this.handleClick}
              thumbSize="small"
              showThumb
              grid={grid}
              showUpdate={!grid}
              onUpdateClick={this.handlePrepareClick}
              {...events[1]}
            />
            <EventItem
              thumbSize="small"
              grid={grid}
              isActive
              showThumb
              onClick={this.handleClick}
              {...events[2]}
            />
            <EventItem
              thumbSize="small"
              grid={grid}
              showThumb
              onClick={this.handleClick}
              {...events[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium</h2>
        {!grid && <p>Event name restricted to two lines.</p>}
        {grid && <p>Event name is restricted to one line.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={mediumStyle}>
            <EventItem
              thumbSize="medium"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...events[0]}
            />
            <EventItem
              thumbSize="medium"
              showThumb
              grid={grid}
              isActive
              onClick={this.handleClick}
              {...events[1]}
            />
            <EventItem
              thumbSize="medium"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...events[2]}
            />
            <EventItem
              thumbSize="medium"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...events[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>Event name is restricted to three lines.</p>}
        {grid && <p>Event name is restricted to one line.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={largeStyle}>
            <EventItem
              thumbSize="large"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...events[0]}
            />
            <EventItem
              thumbSize="large"
              grid={grid}
              isActive
              showThumb
              onClick={this.handleClick}
              {...events[1]}
            />
            <EventItem
              grid={grid}
              thumbSize="large"
              showThumb
              onClick={this.handleClick}
              {...events[2]}
            />
            <EventItem
              grid={grid}
              thumbSize="large"
              showThumb
              onClick={this.handleClick}
              {...events[3]}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
