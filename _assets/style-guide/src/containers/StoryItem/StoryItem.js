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
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import StoryItem from 'components/StoryItem/StoryItem';
import StoryItemArchived from 'components/StoryItemArchived/StoryItemArchived';

import StoryItemNew from 'components/StoryItemNew/StoryItemNew';

const StoryItemDocs = require('!!react-docgen-loader!components/StoryItem/StoryItem.js');

const stories = require('../../static/stories.json');

export default class StoryItemView extends Component {
  static contextTypes = {
    media: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      showCheckbox: false,
      showBadges: true,
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, story) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor StoryItem
    // Quicklink Detail Btn
    if (!href) {
      this.setState({ lastClick: story.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleShowCheckbox() {
    this.setState({ showCheckbox: !this.state.showCheckbox });
  }

  handleToggleBadgesClick() {
    this.setState({ showBadges: !this.state.showBadges });
  }

  handleToggleIconsClick() {
    this.setState({ showIcons: !this.state.showIcons });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  render() {
    const { grid, showCheckbox, showBadges, showIcons, width, lastClick } = this.state;

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
      <section id="StoryItemView">
        <h1>StoryItem</h1>
        <Docs {...StoryItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={showCheckbox} onClick={this.handleToggleShowCheckbox}>showCheckbox</Btn>
            <Btn small inverted={showBadges} onClick={this.handleToggleBadgesClick}>showBadges</Btn>
            <Btn small inverted={showIcons} onClick={this.handleToggleIconsClick}>showIcons</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>{grid ? 'Grid' : 'List'} - Small</h2>
        {!grid && <p>Story name restricted to one line.</p>}
        {grid && <p>Story info/badges are hidden and a tooltip is displayed on hover.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={smallStyle}>
            <StoryItem
              thumbSize="small"
              grid={grid}
              showCheckbox={showCheckbox}
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              showSubscribe
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...stories[2]}
            />
            <StoryItem
              onClick={this.handleClick}
              thumbSize="small"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              isActive
              {...stories[3]}
            />
            <StoryItem
              note="I have no anchor tag I have no anchor tag I have no anchor tag I have no anchor tag I have no anchor tag I have no anchor tag I have no anchor tag"
              thumbSize="small"
              grid={grid}
              showCheckbox={showCheckbox}
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              noLink
              showSubscribe
              isChecked
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...stories[4]}
            />
            <StoryItem
              thumbSize="small"
              grid={grid}
              showCheckbox={showCheckbox}
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              showSubscribe
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...stories[5]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium</h2>
        {!grid && <p>Story name restricted to two lines.</p>}
        {grid && <p>Story name is restricted to one line. Preview is shown on hover. Badge Titles are hidden.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={mediumStyle}>
            <StoryItem
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[0]}
            />
            <StoryItem
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[1]}
            />
            <StoryItem
              note="I have no anchor tag"
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              isActive
              noLink
              onClick={this.handleClick}
              {...stories[2]}
            />
            <StoryItem
              note="I am a normal Story"
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              showSubscribe
              grid={grid}
              showCheckbox={showCheckbox}
              isChecked
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...stories[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium - New 2020 Designs</h2>
        <ComponentItem>
          <div>
            <StoryItemNew
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[11]}
            />
            <StoryItemNew
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[0]}
            />
            <StoryItemNew
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[1]}
            />
            <StoryItemNew
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[2]}
            />
            <StoryItemNew
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>Story name is restricted to three lines.</p>}
        {grid && <p>Story name is restricted to one line. Preview is shown on hover. Quicklinks can be launched to Story Detail.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={largeStyle}>
            <StoryItem
              thumbSize="large"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[0]}
            />
            <StoryItem
              thumbSize="large"
              grid={grid}
              showCheckbox={showCheckbox}
              showThumb
              isChecked
              showBadges={showBadges}
              showIcons={showIcons}
              onClick={this.handleClick}
              {...stories[1]}
            />
            <StoryItem
              note="I have no anchor tag"
              grid={grid}
              showCheckbox={showCheckbox}
              thumbSize="large"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              noLink
              isActive
              onClick={this.handleClick}
              {...stories[2]}
            />
            <StoryItem
              note="I am a normal Story"
              grid={grid}
              showCheckbox={showCheckbox}
              thumbSize="large"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              onClick={this.handleClick}
              {...stories[3]}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Admin Archived</h2>
        {!grid && <p>Story with meta attributes showed. Thumb, title, Author and Archived date.</p>}
        {grid && <p>Story name is restricted to one line. Preview is shown on hover. Author is show on second line. Badge Titles are hidden.</p>}
        <ComponentItem style={{ width: width }}>
          <div style={mediumStyle}>
            <StoryItemArchived
              thumbSize="medium"
              showThumb
              grid={grid}
              onClick={this.handleClick}
              {...stories[0]}
            />
            <StoryItemArchived
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              onClick={this.handleClick}
              {...stories[1]}
            />
            <StoryItemArchived
              note="I have no anchor tag"
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              isActive
              noLink
              onClick={this.handleClick}
              {...stories[2]}
            />
            <StoryItemArchived
              note="I am a normal Story"
              thumbSize="medium"
              showThumb
              showBadges={showBadges}
              showIcons={showIcons}
              grid={grid}
              showCheckbox={showCheckbox}
              isChecked
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
              {...stories[3]}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
