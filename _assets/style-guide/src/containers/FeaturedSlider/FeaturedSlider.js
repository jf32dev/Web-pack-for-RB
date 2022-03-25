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
import Docs from '../../views/Docs';
import RadioGroup from 'components/RadioGroup/RadioGroup';

import FeaturedList from 'components/FeaturedList/FeaturedList';
import FeaturedSlider from 'components/FeaturedSlider/FeaturedSlider';
import FeaturedItem from 'components/FeaturedItem/FeaturedItem';
import FeaturedStoryItem from 'components/FeaturedStoryItem/FeaturedStoryItem';


const FeaturedListDocs = require('!!react-docgen-loader!components/FeaturedList/FeaturedList.js');
const FeaturedSliderDocs = require('!!react-docgen-loader!components/FeaturedSlider/FeaturedSlider.js');
const FeaturedItemDocs = require('!!react-docgen-loader!components/FeaturedItem/FeaturedItem.js');

const featuredStories = require('../../static/featuredStories.json');

export default class FeaturedSliderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredCount: 0,
      featuredListStories: featuredStories
    };
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  handleFeaturedCountChange(event) {
    const { featuredListStories } = this.state;
    const featuredCount = parseInt(event.currentTarget.value, 10);

    const newList = [];
    featuredListStories.forEach((s, i) => {
      newList.push({
        ...s,
        isFeatured: i + 1 <= featuredCount
      });
    });

    this.setState({
      featuredCount: featuredCount,
      featuredListStories: newList
    });
  }

  render() {
    const { featuredListStories } = this.state;

    return (
      <section id="FeaturedSliderView">
        <h1>FeaturedSlider</h1>
        <Docs {...FeaturedSliderDocs} />

        <ComponentItem disablePadding style={{ border: 'none' }}>
          <FeaturedSlider
            list={featuredStories}
            autoSlide
            showBadges
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>FeaturedList</h2>
        <Docs {...FeaturedListDocs} />

        <RadioGroup
          legend="Featured Count"
          name="featuredCount"
          selectedValue={this.state.featuredCount}
          onChange={this.handleFeaturedCountChange}
          inlineInputs
          inlineLegend
          required
          options={[{
            label: '0',
            value: 0
          }, {
            label: '1',
            value: 1
          }, {
            label: '2',
            value: 2
          }]}
        />

        <ComponentItem disablePadding style={{ border: 'none' }}>
          <FeaturedList
            list={featuredListStories}
            showBadges
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>FeaturedItem</h2>
        <Docs {...FeaturedItemDocs} />

        <h3>Large</h3>
        <ComponentItem style={{ display: 'inline-block' }}>
          <FeaturedItem
            {...featuredStories[0]}
            thumbSize="large"
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h3>Medium</h3>
        <ComponentItem style={{ display: 'inline-block' }}>
          <FeaturedItem
            {...featuredStories[0]}
            thumbSize="medium"
            showExcerpt
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h3>Small</h3>
        <ComponentItem style={{ display: 'inline-block' }}>
          <FeaturedItem
            {...featuredStories[0]}
            thumbSize="small"
            showExcerpt
            onAnchorClick={this.handleAnchorClick}
            onStoryClick={this.handleAnchorClick}
          />
        </ComponentItem>

        <h2>FeaturedStoryItem</h2>
        <ComponentItem style={{ display: 'inline-block' }}>
          <FeaturedStoryItem
            {...featuredStories[7]}
            onAnchorClick={this.handleAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
