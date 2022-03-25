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
import List from 'components/List/List';
import ResponsiveList from 'components/ResponsiveList/ResponsiveList';
import TriggerList from 'components/TriggerList/TriggerList';

const ListDocs = require('!!react-docgen-loader!components/List/List.js');
const ResponsiveListDocs = require('!!react-docgen-loader!components/ResponsiveList/ResponsiveList.js');
const TriggerListDocs = require('!!react-docgen-loader!components/TriggerList/TriggerList.js');

// Dummy data
const tabs = require('../../static/tabs.json');
//const channels = require('../../static/channels.json');
const stories = require('../../static/stories.json');
//const categories = require('../../static/categories.json');
//const forms = require('../../static/forms.json');
//const users = require('../../static/users.json');
//const groups = require('../../static/groups.json');
//const notifications = require('../../static/notifications.json');
//const events = require('../../static/events.json');

export default class ListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: false,
      showThumb: true,
      triggerList: [],
      triggerListLoaded: false,
      triggerListLoading: true,
      triggerListLoadingMore: false,
      triggerListIsComplete: false
    };
    autobind(this);
  }

  handleToggleGridClick() {
    this.setState({
      grid: !this.state.grid
    });
  }

  handleToggleThumbClick() {
    this.setState({
      showThumb: !this.state.showThumb
    });
  }

  handleClick(event, props) {
    event.preventDefault();
    this.setState({
      lastClick: props.type + ': ' + props.id
    });
  }

  handleGetList(offset) {
    const newList = tabs.slice(offset, 5);

    this.setState({
      triggerList: [...this.state.triggerList, ...newList],
      triggerListLoaded: true,
      triggerListLoading: false,
      triggerListLoadingMore: offset > 0,
      triggerListIsComplete: newList.length > 8
    });
  }

  render() {
    const {
      grid,
      showThumb,
      lastClick,
      triggerList,
      triggerListLoaded,
      triggerListLoading,
      triggerListLoadingMore,
      triggerListIsComplete
    } = this.state;

    /*
    const mixed = tabs.slice(0, 2)
                  .concat(channels.slice(0, 2))
                  .concat(stories.slice(0, 2))
                  .concat(categories.slice(0, 2))
                  .concat(forms.slice(0, 2))
                  .concat(groups.slice(0, 2))
                  .concat(notifications.slice(0, 2))
                  .concat(events.slice(0, 2))
                  .concat(users.slice(0, 2));
                  */

    const tabsWithTitles = [{
      title: '',
      list: tabs.slice(0, 1),
      actions:[]
    }, {
      title: 'Company Tabs',
      list: tabs.slice(1, 5),
      actions:[{ //List of action added right side of the title.
        title:'Add',
        handleClick: () => { console.log("Add") }
      }, {
        title:'Edit',
        handleClick: () => { console.log("edit") }
      }]
    }];

    // Responsive Rules
    const rules = {
      'mobile-xs': grid ? 'medium' : 'small',
      'mobile': grid ? 'medium' : 'small',
      'tablet': 'medium',
      'desktop': 'large',
      'desktop-xl': 'large'
    };

    return (
      <section id="List">
        <h1>List</h1>
        <Docs {...ListDocs} />
        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>Toggle grid</Btn>
            <Btn small inverted={showThumb} onClick={this.handleToggleThumbClick}>Toggle showThumb</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>List View</h2>
        <ComponentItem style={{ height: '18rem' }}>
          <List
            list={stories}
            thumbSize="small"
            onItemClick={this.handleClick}
            grid={grid}
            showThumb={showThumb}
          />
        </ComponentItem>

        <h2>Nested list with titles</h2>
        <ComponentItem style={{ height: '18rem' }}>
          <List
            list={tabsWithTitles}
            thumbSize="small"
            onItemClick={this.handleClick}
            nestedList
            grid={grid}
            showThumb={showThumb}
          />
        </ComponentItem>

        <h2>Empty List</h2>
        <p>If an empty or no <code>list</code> is passed. A <code>Blankslate</code> will display. Pass <code>emptyHeading</code> and <code>emptyMessage</code> to set a custom empty state.</p>
        <ComponentItem>
          <List
            emptyHeading="I am empty"
            emptyMessage="You can customise the message displayed here."
            onItemClick={this.handleClick}
          />
        </ComponentItem>

        <h2>TriggerList</h2>
        <Docs {...TriggerListDocs} />
        <ComponentItem style={{ height: '16rem' }}>
          <TriggerList
            list={triggerList}
            isLoaded={triggerListLoaded}
            isLoading={triggerListLoading}
            isLoadingMore={triggerListLoadingMore}
            isComplete={triggerListIsComplete}
            onGetList={this.handleGetList}
            listProps={{
              thumbSize: 'small',
              showThumb: showThumb,
              grid: grid,
              onItemClick: this.handleClick
            }}
          />
        </ComponentItem>

        <h2>ResponsiveList</h2>
        <Docs {...ResponsiveListDocs} />
        <ComponentItem style={{ height: '25rem' }}>
          <ResponsiveList
            rules={rules}
            list={stories}
            grid={grid}
            showThumb={showThumb}
            onItemClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
