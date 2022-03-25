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

import TabItem from 'components/TabItem/TabItem';
import TabSettings from 'components/TabSettings/TabSettings';

const TabItemDocs = require('!!react-docgen-loader!components/TabItem/TabItem.js');
const TabSettingsDocs = require('!!react-docgen-loader!components/TabSettings/TabSettings.js');

const tabs = require('../../static/tabs.json');

export default class TabItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: false,
      width: 'auto',
      lastClick: null,

      tab: tabs[0],
      sortOrder: 'name'
    };
    autobind(this);
  }

  handleClick(event, tab) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor TabItem
    if (!href) {
      this.setState({ lastClick: tab.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  handleEditClick(event, context) {
    event.preventDefault();
    this.setState({
      lastClick: 'edit: ' + context.props.id
    });
  }

  handleSortOrderChange(selected) {
    this.setState({
      sortOrder: selected.value,
      lastClick: 'sort order: ' + selected.value
    });
  }

  render() {
    const { grid, width, lastClick } = this.state;

    return (
      <section id="TabItemView">
        <h1>TabItem</h1>
        <Docs {...TabItemDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={width === 300} onClick={this.handleToggleWidthClick}>width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem style={{ width: width }}>
          <TabItem
            {...tabs[0]}
            grid={grid}
            onClick={this.handleClick}
          />
          <TabItem
            {...tabs[1]}
            note="Example note..."
            grid={grid}
            isActive
            showEdit
            showThumb
            onClick={this.handleClick}
          />
          <TabItem
            {...tabs[2]}
            note="I have no anchor tag"
            grid={grid}
            noLink
            showThumb
            onClick={this.handleClick}
            showAdmin
            showEdit
            onEditClick={this.handleEditClick}
          />
        </ComponentItem>

        <h2>TabSettings</h2>
        <Docs {...TabSettingsDocs} />
        <ComponentItem>
          <TabSettings
            tab={this.state.tab}
            sortOrder={this.state.sortOrder}
            onAnchorClick={this.handleClick}
            onEditClick={this.handleEditClick}
            onSortOrderChange={this.handleSortOrderChange}
          />
        </ComponentItem>
      </section>
    );
  }
}
