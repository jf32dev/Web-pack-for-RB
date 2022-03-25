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

import BookmarkItem from 'components/BookmarkItem/BookmarkItem';
import BookmarkItemNew from 'components/BookmarkItemNew/BookmarkItemNew';


const BookmarkItemDocs = require('!!react-docgen-loader!components/BookmarkItem/BookmarkItem.js');

const bookmarks = require('../../static/bookmarks.json');

export default class BookmarkItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      width: 'auto',
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, context) {
    const firstItem = context.props.setData[0];
    this.setState({ lastClick: firstItem.type + ' ' + firstItem.id });
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleWidthClick() {
    this.setState({ width: this.state.width === 300 ? 'auto' : 300 });
  }

  render() {
    const { grid, width, lastClick } = this.state;

    return (
      <section id="BookmarkItemView">
        <h1>BookmarkItem</h1>
        <Docs {...BookmarkItemDocs} />
        <Debug>
          <div>
            <Btn small onClick={this.handleToggleGridClick}>Toggle Grid/List</Btn>
            <Btn small onClick={this.handleToggleWidthClick}>Toggle Width</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem style={{ width: width }}>
          <div style={{ margin: grid ? '0 -0.75rem -0.75rem' : '-0.5rem' }}>
            <BookmarkItem
              {...bookmarks[0]}
              grid={grid}
              showBadges
              showThumb
              thumbSize={grid ? 'medium' : 'small'}
              onClick={this.handleClick}
              onSubscribeClick={this.handleClick}
            />
            <BookmarkItem
              {...bookmarks[1]}
              grid={grid}
              showThumb
              showBadges
              thumbSize={grid ? 'medium' : 'small'}
              onClick={this.handleClick}
            />
            <BookmarkItem
              {...bookmarks[2]}
              grid={grid}
              showThumb
              showBadges
              thumbSize={grid ? 'medium' : 'small'}
              onClick={this.handleClick}
            />
          </div>
        </ComponentItem>

        <ComponentItem style={{ width: width }}>
          <div style={{ margin: grid ? '0 -0.75rem -0.75rem' : '-0.5rem' }}>
            <BookmarkItemNew
              {...bookmarks[0]}
              grid
              showBadges
              showThumb
              thumbSize="medium"
              onClick={this.handleClick}
            />
            <BookmarkItemNew
              {...bookmarks[1]}
              grid
              showThumb
              showBadges
              thumbSize="medium"
              onClick={this.handleClick}
            />
            <BookmarkItemNew
              {...bookmarks[2]}
              grid
              showThumb
              showBadges
              thumbSize="medium"
              onClick={this.handleClick}
              style={{ marginRight: '20px' }}
            />
            <BookmarkItemNew
              {...bookmarks[3]}
              grid
              showThumb
              showBadges
              thumbSize="medium"
              onClick={this.handleClick}
            />
          </div>
        </ComponentItem>
      </section>
    );
  }
}
