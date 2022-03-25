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
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';

import StoryCard from 'components/StoryCard/StoryCard';

const StoryCardDocs = require('!!react-docgen-loader!components/StoryCard/StoryCard.js');

const stories = require('../../static/stories.json');

const StoryCardView = (props) => {
  const [isFeatured, setIsFeatured] = useState(false);

  const handleToggleIsFeaturedClick = () => {
    setIsFeatured(!isFeatured);
  };

  const handleClick = (event, story) => {
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

  return (
    <section id="StoryCardView">
      <h1>StoryCard</h1>
      <Docs {...StoryCardDocs} />
      <Debug>
        <div>
          <Btn small inverted={isFeatured} onClick={handleToggleIsFeaturedClick}>isFeatured</Btn>
        </div>
      </Debug>
      <p>isFeatured? {isFeatured ? <span>True</span> : <span>False</span>}</p>
      <ComponentItem>
        <StoryCard
          isFeatured={isFeatured}
          onClick={handleClick}
          {...stories[11]}
        />
        <StoryCard
          isFeatured={isFeatured}
          onClick={handleClick}
          {...stories[1]}
        />
        <StoryCard
          isFeatured={isFeatured}
          onClick={handleClick}
          {...stories[2]}
        />
        <StoryCard
          isFeatured={isFeatured}
          onClick={handleClick}
          {...stories[3]}
        />
        <StoryCard
          isFeatured={isFeatured}
          onClick={handleClick}
          {...stories[4]}
        />
      </ComponentItem>
    </section>
  )
}

export default StoryCardView;
