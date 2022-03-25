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
import { Btn, List } from 'components';

const RepoItemDocs = require('!!react-docgen-loader!components/RepoItem/RepoItem.js');

const repos = require('../../static/repos.json');

export default class RepoItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
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

  handleForceRenderClick() {
    this.forceUpdate();
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  render() {
    const { grid, lastClick } = this.state;

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
      <section id="RepoItemView">
        <h1>RepoItem</h1>
        <p>Total services: {repos.length}</p>
        <Docs {...RepoItemDocs} />

        <Debug>
          <div>
            <Btn small onClick={this.handleForceRenderClick}>Force Render</Btn>
            <Btn small onClick={this.handleToggleGridClick}>Toggle Grid/List</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>{grid ? 'Grid' : 'List'} - Small</h2>
        {!grid && <p>Repo Name restricted to one line.</p>}
        {grid && <p>Repo info is hidden and a tooltip is displayed on hover.</p>}
        <ComponentItem style={{ width: grid ? 'auto' : '300px' }}>
          <div style={smallStyle}>
            <List
              list={repos}
              thumbSize="small"
              grid={grid}
              onItemClick={this.handleClick}
              style={{ overflow: 'visible' }}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Medium</h2>
        {!grid && <p>Repo Name restricted to two lines.</p>}
        {grid && <p>Repo Name is restricted to one line.</p>}
        <ComponentItem style={{ width: grid ? 'auto' : '300px' }}>
          <div style={mediumStyle}>
            <List
              list={repos}
              thumbSize="medium"
              grid={grid}
              onItemClick={this.handleClick}
            />
          </div>
        </ComponentItem>

        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>Repo Name is restricted to three lines.</p>}
        {grid && <p>Repo Name is restricted to one line.</p>}
        <ComponentItem style={{ width: grid ? 'auto' : '300px' }}>
          <div style={largeStyle}>
            <List
              list={repos}
              thumbSize="large"
              grid={grid}
              onItemClick={this.handleClick}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
