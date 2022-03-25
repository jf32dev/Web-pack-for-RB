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

import StoryHeader from 'components/StoryHeader/StoryHeader';

const StoryHeaderDocs = require('!!react-docgen-loader!components/StoryHeader/StoryHeader.js');

const defaultStory = require('../../static/story.json');

export default class StoryHeaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultStory,

      hideMoreMenu: false,
      lastClick: null
    };
    autobind(this);
  }

  handleToggleProp(event) {
    const prop = event.target.dataset.id;
    this.setState({
      [prop]: !this.state[prop]
    });
  }

  handleToggleIsFeatured() {
    if (!this.state.isFeatured) {
      this.setState({
        isFeatured: true,
        featuredImage: 'src/static/images/story1.jpg',
        featuredStartsAt: 1487269603,
        featuredExpiresAt: 1490952397,
      });
    } else {
      this.setState({
        isFeatured: false,
        featuredImage: '',
        featuredStartsAt: 0,
        featuredExpiresAt: 0,
      });
    }
  }

  handleCloseClick() {
    this.setState({
      lastClick: 'handleCloseClick'
    });
  }
  handleLikeClick() {
    this.setState({
      lastClick: 'handleLikeClick',
      isLiked: !this.state.isLiked
    });
  }
  handleShareClick() {
    this.setState({
      lastClick: 'handleShareClick'
    });
  }
  handleLinkedinShareClick() {
    this.setState({
      lastClick: 'handleLinkedinShareClick'
    });
  }
  handleTwitterShareClick() {
    this.setState({
      lastClick: 'handleTwitterShareClick'
    });
  }
  handleFacebookShareClick() {
    this.setState({
      lastClick: 'handleFacebookShareClick'
    });
  }
  handleEditClick(event) {
    event.preventDefault();

    this.setState({
      lastClick: 'handleEditClick'
    });
  }
  handleBookmarkClick() {
    this.setState({
      lastClick: 'handleBookmarkClick',
      isBookmark: !this.state.isBookmark
    });
  }
  handleSubscribeClick() {
    this.setState({
      lastClick: 'handleSubscribeClick',
      isSubscribed: !this.state.isSubscribed
    });
  }
  handleHistoryClick() {
    this.setState({
      lastClick: 'handleHistoryClick'
    });
  }
  handlePromoteClick() {
    this.setState({
      lastClick: 'handlePromoteClick'
    });
  }
  handleFlagClick() {
    this.setState({
      lastClick: 'handleFlagClick'
    });
  }
  handleFlagListClick() {
    this.setState({
      lastClick: 'handleFlagListClick'
    });
  }
  handleArchiveClick() {
    this.setState({
      lastClick: 'handleArchiveClick'
    });
  }

  render() {
    const {
      hideMoreMenu,
      isFeatured,
      isFeed,
      isRevision,
      sharingPublic,
      lastClick
    } = this.state;

    const theme = {
      baseColor: '#00cc00'
    };

    return (
      <section id="StoryHeaderView">
        <h1>StoryHeader</h1>
        <Docs {...StoryHeaderDocs} />
        <Debug>
          <div>
            <Btn data-id="hideMoreMenu" inverted={hideMoreMenu} small onClick={this.handleToggleProp}>Toggle Menu</Btn>
            <Btn data-id="isFeatured" inverted={isFeatured} small onClick={this.handleToggleIsFeatured}>Toggle isFeatured</Btn>
            <Btn data-id="isFeed" inverted={isFeed} small onClick={this.handleToggleProp}>Toggle isFeed</Btn>
            <Btn data-id="isRevision" inverted={isRevision} small onClick={this.handleToggleProp}>Toggle isRevision</Btn>
            <Btn data-id="sharingPublic" inverted={sharingPublic} small onClick={this.handleToggleProp}>Toggle sharingPublic</Btn>
          </div>
          <div>

          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <ComponentItem>
          <StoryHeader
            {...this.state}
            theme={theme}
            channel={this.state.channels[0]}

            hideMoreMenu={hideMoreMenu}

            canDelete
            canEdit
            canFlag
            canLike
            canShare
            canSubscribe

            onCloseClick={this.handleCloseClick}
            onLikeClick={this.handleLikeClick}
            onShareClick={this.handleShareClick}
            onLinkedinShareClick={this.handleLinkedinShareClick}
            onTwitterShareClick={this.handleTwitterShareClick}
            onFacebookShareClick={this.handleFacebookShareClick}
            onEditClick={this.handleEditClick}
            onBookmarkClick={this.handleBookmarkClick}
            onSubscribeClick={this.handleSubscribeClick}
            onHistoryClick={this.handleHistoryClick}
            onPromoteClick={this.handlePromoteClick}
            onFlagClick={this.handleFlagClick}
            onFlagListClick={this.handleFlagListClick}
            onArchiveClick={this.handleArchiveClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
