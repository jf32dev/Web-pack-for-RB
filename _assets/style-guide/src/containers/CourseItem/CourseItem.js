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

import Btn from 'components/Btn/Btn';
import CourseItem from 'components/CourseItem/CourseItem';

const CourseItemDocs = require('!!react-docgen-loader!components/CourseItem/CourseItem.js');
const groups = require('../../static/courses.json');

export default class CourseItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      width: 'auto',
      lastClick: null,
      group: groups[1],
      isSaveLoading: false
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

  handleCancel() {
    console.log('Canceling');
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
      <section id="CourseItemView">
        <h1>Clui CourseItem</h1>
        <Docs {...CourseItemDocs} />
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
        {!grid && <p>Course title restricted to one line.</p>}
        {grid && <p>Course info hidden and a tooltip is displayed on hover.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={smallStyle}>
            <CourseItem
              thumbSize="small"
              grid={grid}
              showThumb
              onClick={this.handleClick}
              {...groups[0]}
            />
            <CourseItem
              onClick={this.handleClick}
              thumbSize="small"
              isActive
              showThumb
              grid={grid}
              {...groups[1]}
            />
            <CourseItem
              note="I have no anchor tag"
              thumbSize="small"
              grid={grid}
              noLink
              onClick={this.handleClick}
              {...groups[2]}
            />
            <CourseItem
              thumbSize="small"
              grid={grid}
              showEdit
              showUnlink
              onEditClick={this.handleClick}
              onUnlinkClick={this.handleClick}
              onClick={this.handleClick}
              {...groups[3]}
            />

            <CourseItem
              {...groups[2]}
              type={'course'}
              note="I have no anchor tag"
              grid={grid}
              showEdit
              showUnlink
              noLink
              showThumb
              thumbSize="small"
              onClick={this.handleClick}
              onEditClick={this.handleClick}
              onUnlinkClick={this.handleClick}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium</h2>
        {!grid && <p>Group name restricted to two lines.</p>}
        {grid && <p>Group name is restricted to two lines.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={mediumStyle}>
            <CourseItem
              thumbSize="medium"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...groups[0]}
            />
            <CourseItem
              thumbSize="medium"
              isActive
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...groups[1]}
            />
            <CourseItem
              note="I have no anchor tag"
              thumbSize="medium"
              showArrow
              grid={grid}
              noLink
              onClick={this.handleClick}
              {...groups[2]}
            />
            <CourseItem
              note="I am a normal Group"
              thumbSize="medium"
              grid={grid}
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...groups[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>Course title name is restricted to three lines.</p>}
        {grid && <p>Course title is restricted to two line.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={largeStyle}>
            <CourseItem
              thumbSize="large"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...groups[0]}
            />
            <CourseItem
              thumbSize="large"
              grid={grid}
              isActive
              showThumb
              onClick={this.handleClick}
              {...groups[1]}
            />
            <CourseItem
              grid={grid}
              thumbSize="large"
              noLink
              onClick={this.handleClick}
              {...groups[2]}
            />
            <CourseItem
              grid={grid}
              thumbSize="large"
              onClick={this.handleClick}
              {...groups[3]}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
