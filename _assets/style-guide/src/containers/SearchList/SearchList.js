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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import ComponentItem from '../../views/ComponentItem';
import { SearchList } from 'components';

const storiesSearch = require('../../static/storiesSearch.json');
const commentSearch = require('../../static/commentSearch.json');
const usersSearch = require('../../static/usersSearch.json');
const filesSearch = require('../../static/filesSearch.json');

export default class SearchListView extends Component {

  handleClick(component, event) {
    event.preventDefault();
    console.log(component.props);
  }

  render() {
    const mixed = storiesSearch.slice(0, 2)
      .concat(usersSearch.slice(0, 2))
      .concat(filesSearch.slice(0, 2))
      .concat(commentSearch.slice(0, 2));

    return (
      <section id="List">
        <h1>SearchList</h1>
        <p><code>SearchList</code> will render the appropriate component based on <code>searchList</code> item <code>type</code>:</p>
        <ul>
          <li><strong>story</strong> - <code>StorySearchItem</code></li>
          <li><strong>feed</strong> - <code>StorySearchItem</code></li>
          <li><strong>comment</strong> - <code>CommentSearchItem</code></li>
          <li><strong>people</strong> - <code>UserSearchItem</code></li>
          <li><strong>file</strong> - <code>FileSearchItem</code></li>
        </ul>

        <h3>PropTypes</h3>
        <ul>
          <li><strong>list</strong> <code>array</code> - items must have a <code>type</code></li>
          <li><strong>selectedId</strong> <code>bool</code> - sets <code>selected</code> on list item if ID matches</li>
          <li><strong>emptyHeading</strong> <code>string</code> - heading to display if list is empty</li>
          <li><strong>emptyMessage</strong> <code>string</code> - message to display if list is empty</li>
          <li><strong>onItemClick</strong> <code>func</code> - required</li>
          <li><strong>onScroll</strong> <code>func</code></li>
        </ul>
        <h3>PropTypes passed to list items</h3>
        <ul>
          <li><strong>thumbWidth</strong> <code>number</code></li>
          <li><strong>showThumb</strong> <code>bool</code></li>
          <li><strong>rootUrl</strong> <code>string</code></li>
          <li><strong>itemClassName</strong> <code>string</code></li>
          <li><strong>itemStyle</strong> <code>object</code></li>
        </ul>


        <h2>Mixed list</h2>
        <ComponentItem>
          <SearchList list={mixed} onItemClick={this.handleClick} onInfoIconClick={this.handleClick} showThumb />
        </ComponentItem>

        <h2>Story Search View</h2>
        <ComponentItem>
          <SearchList list={storiesSearch} onItemClick={this.handleClick} onInfoIconClick={this.handleClick} showThumb />
        </ComponentItem>

        <h2>Comment Search View</h2>
        <ComponentItem>
          <SearchList list={commentSearch} onItemClick={this.handleClick} onInfoIconClick={this.handleClick} showThumb />
        </ComponentItem>

        <h2>People Search View</h2>
        <ComponentItem>
          <SearchList list={usersSearch} onItemClick={this.handleClick} onInfoIconClick={this.handleClick} showThumb />
        </ComponentItem>

        <h2>Files Search View</h2>
        <ComponentItem>
          <SearchList list={filesSearch} onItemClick={this.handleClick} onInfoIconClick={this.handleClick} showThumb />
        </ComponentItem>

        <h2>Empty List</h2>
        <p>If an empty or no <code>list</code> is passed. A <code>Blankslate</code> will display. Pass <code>emptyHeading</code> and <code>emptyMessage</code> to set a custom empty state.</p>
        <ComponentItem>
          <SearchList
            emptyHeading="I am empty"
            emptyMessage="You can customise the message displayed here."
            onItemClick={this.handleClick}
            onInfoIconClick={this.handleClick}
          />
        </ComponentItem>

      </section>
    );
  }
}
