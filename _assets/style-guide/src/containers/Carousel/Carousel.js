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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios  <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Carousel from 'components/Carousel/Carousel';

import FeaturedStoryItem from 'components/FeaturedStoryItem/FeaturedStoryItem';
import UserItemNew from 'components/UserItemNew/UserItemNew';

const CarouselDocs = require('!!react-docgen-loader!components/Carousel/Carousel.js');
const FeaturedItemDocs = require('!!react-docgen-loader!components/FeaturedStoryItem/FeaturedStoryItem.js');
const UserItemDocs = require('!!react-docgen-loader!components/UserItemNew/UserItemNew.js');

const featuredStories = require('../../static/featuredStories.json');
const users = require('../../static/users.json');

export default class CarouselView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  render() {
    return (
      <section id="CarouselView">
        <h1>Carousel</h1>
        <Docs {...CarouselDocs} />
        <ComponentItem disablePadding style={{ border: 'none' }}>
          <Carousel
            dots
            loaded
            onItemClick={this.handleAnchorClick}
          >
            {featuredStories.slice(0, 5).map((item, ix) => (
              <FeaturedStoryItem
                key={ix}
                {...item}
                onAnchorClick={this.handleAnchorClick}
              />
            ))}
          </Carousel>
        </ComponentItem>

        <h1>Carousel with User items</h1>
        <ComponentItem disablePadding style={{ border: 'none' }}>
          <Carousel
            dots
            loaded
            itemSize={'200px'}
            itemMargin={'2rem'}
            onItemClick={this.handleAnchorClick}
          >
            {users.slice(0, 6).map((item, ix) => (
              <UserItemNew
                key={ix}
                grid
                presence={100}
                {...item}
              />
            ))}
          </Carousel>
        </ComponentItem>

        <h2>FeaturedStoryItem</h2>
        <Docs {...FeaturedItemDocs} />
        <ComponentItem style={{ display: 'inline-block' }}>
          <FeaturedStoryItem
            {...featuredStories[7]}
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>UserItemItem</h2>
        <Docs {...UserItemDocs} />
        <ComponentItem style={{ display: 'inline-block' }}>
          <UserItemNew
            grid
            presence={100}
            {...users[2]}
          />
        </ComponentItem>
      </section>
    );
  }
}
