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

import StoryDescription from 'components/StoryDescription/StoryDescription';

const StoryDescriptionDocs = require('!!react-docgen-loader!components/StoryDescription/StoryDescription.js');

const story = require('../../static/story.json');

export default class StoryDescriptionView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  handleOnScrollTo(offsetTop) {
    if (offsetTop >= 0) {
      window.scrollTo(0, offsetTop);
    }
  }

  render() {
    return (
      <section id="StoryDescriptionView">
        <h1>StoryDescription</h1>
        <Docs {...StoryDescriptionDocs} />

        <ComponentItem>
          <StoryDescription
            message={story.message}
            baseColor="#00cc00"
            onScrollTo={this.handleOnScrollTo}
          />
        </ComponentItem>
      </section>
    );
  }
}
