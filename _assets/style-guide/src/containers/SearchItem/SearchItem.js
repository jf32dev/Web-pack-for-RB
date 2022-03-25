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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import {
  UserSearchItem,
  CommentSearchItem,
  StorySearchItem,
  FileSearchItem,
  MeetingSearchItem,
} from 'components';

const UserSearchItemDocs = require('!!react-docgen-loader!components/UserSearchItem/UserSearchItem.js');
const CommentSearchItemDocs = require('!!react-docgen-loader!components/CommentSearchItem/CommentSearchItem.js');
const StorySearchItemDocs = require('!!react-docgen-loader!components/StorySearchItem/StorySearchItem.js');
const FileSearchItemDocs = require('!!react-docgen-loader!components/FileSearchItem/FileSearchItem.js');
const MeetingSearchItemDocs = require('!!react-docgen-loader!components/MeetingSearchItem/MeetingSearchItem.js');

const usersSearch = require('../../static/usersSearch.json');
const commentSearch = require('../../static/commentSearch.json');
const storiesSearch = require('../../static/storiesSearch.json');
const filesSearch = require('../../static/filesSearch.json');
const eventsSearch = require('../../static/eventsSearch.json');

export default class SearchItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, context) {
    event.preventDefault();
    let action = event.currentTarget.getAttribute('href');
    if (!action) {
      action = context.props.type + ' ' + context.props.id;
    }

    this.setState({ lastClick: 'onClick: ' + action });
  }

  handleCallClick(event, user) {
    this.setState({ lastClick: 'onCallClick: ' + user.props.id });
  }

  handleChatClick(event, user) {
    this.setState({ lastClick: 'onChatClick: ' + user.props.id });
  }

  handleFollowClick(event, user) {
    this.setState({ lastClick: 'onFollowClick: ' + user.props.id });
  }

  render() {
    const { lastClick } = this.state;

    return (
      <section id="SearchItem">
        <h1>Search Items</h1>
        <p>Search Items differ slightly to their ListItem counter parts.</p>

        <Debug>
          <div>
            <code>{lastClick}</code>
          </div>
        </Debug>

        <h2>UserSearchItem</h2>
        <Docs {...UserSearchItemDocs} />
        <ComponentItem>
          <UserSearchItem
            showCall
            showChat
            showThumb
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...usersSearch[0]}
          />
          <UserSearchItem
            showCall
            showChat
            showThumb
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...usersSearch[1]}
          />
          <UserSearchItem
            showCall
            showChat
            showThumb
            onClick={this.handleClick}
            onCallClick={this.handleCallClick}
            onChatClick={this.handleChatClick}
            onFollowClick={this.handleFollowClick}
            {...usersSearch[2]}
          />
        </ComponentItem>

        <h2>CommentSearchItem</h2>
        <Docs {...CommentSearchItemDocs} />
        <ComponentItem>
          <CommentSearchItem
            showThumb
            onClick={this.handleClick}
            {...commentSearch[0]}
          />
          <CommentSearchItem
            showThumb
            onClick={this.handleClick}
            {...commentSearch[1]}
          />
          <CommentSearchItem
            showThumb
            onClick={this.handleClick}
            {...commentSearch[2]}
          />
        </ComponentItem>

        <h2>StorySearchItem</h2>
        <Docs {...StorySearchItemDocs} />
        <ComponentItem>
          <StorySearchItem
            showThumb
            onClick={this.handleClick}
            onInfoIconClick={this.handleClick}
            {...storiesSearch[0]}
          />
          <StorySearchItem
            showThumb
            onClick={this.handleClick}
            onInfoIconClick={this.handleClick}
            {...storiesSearch[1]}
          />
          <StorySearchItem
            showThumb
            onClick={this.handleClick}
            onInfoIconClick={this.handleClick}
            {...storiesSearch[2]}
          />
        </ComponentItem>

        <h2>FileSearchItem</h2>
        <Docs {...FileSearchItemDocs} />
        <ComponentItem>
          <FileSearchItem
            onClick={this.handleClick}
            onInfoIconClick={this.handleClick}
            {...filesSearch[0]}
          />
          <FileSearchItem
            onClick={this.handleClick}
            onInfoIconClick={this.handleClick}
            {...filesSearch[1]}
          />
          <FileSearchItem
            onClick={this.handleClick}
            onInfoIconClick={this.handleClick}
            {...filesSearch[2]}
          />
        </ComponentItem>

        <h2>MeetingSearchItem</h2>
        <Docs {...MeetingSearchItemDocs} />
        <ComponentItem>
          <MeetingSearchItem
            onClick={this.handleClick}
            {...eventsSearch[0]}
          />
          <MeetingSearchItem
            onClick={this.handleClick}
            {...eventsSearch[1]}
          />
          <MeetingSearchItem
            onClick={this.handleClick}
            {...eventsSearch[2]}
          />
          <MeetingSearchItem
            onClick={this.handleClick}
            {...eventsSearch[3]}
          />
          <MeetingSearchItem
            onClick={this.handleClick}
            {...eventsSearch[4]}
          />
          <MeetingSearchItem
            onClick={this.handleClick}
            {...eventsSearch[5]}
          />
        </ComponentItem>
      </section>
    );
  }
}
