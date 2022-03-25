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

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import StoryBadgesNew from 'components/StoryBadgesNew/StoryBadgesNew';

/**
 * Story Thumbnail. Used by StoryItemNew and StoryCard.
 */

const StoryThumbNew = ({
  authString,
  className,
  colour,
  commentCount,
  fileCount,
  isCard,
  grid,
  ratingCount,
  thumbSize,
  showThumb,
  style,
  thumbnail,
  customThumbSize
}) => {
  // Randomise background-position
  const y = (Math.random() * 100).toFixed(0);
  const bgPos = { bgPos: `0 ${y}%` };

  // Default thumbwidth fallback
  let thumbWidthHeightSize = customThumbSize;
  if (isCard && !customThumbSize) {
    // Revisit sizes when design have given correct dimensions
    const sizes = {
      small: 124,
      medium: 150, // dummy dimension
      large: 200 // dummy dimension
    };
    thumbWidthHeightSize = sizes[thumbSize];
  } else if (!isCard && !customThumbSize) {
    const sizes = {
      small: grid ? 100 : 46, // dummy dimension for grid
      medium: grid ? 200 : 100, // dummy dimension for !grid
      large: grid ? 200 : 150 // dummy dimension for !grid
    };
    thumbWidthHeightSize = sizes[thumbSize];
  }

  const styles = require('./StoryThumbNew.less');
  const cx = classNames.bind(styles);

  const storyThumbClasses = cx({
    StoryThumb: true,
    gridThumbnail: grid,
    listThumbnail: !grid
  }, className);

  // Only append authString is thumbnail is hosted on push
  const thumbUrl = thumbnail && thumbnail.indexOf('push.bigtincan') > -1 ? `${thumbnail}${authString}` : thumbnail;

  const thumbStyle = {
    height: thumbWidthHeightSize,
    width: thumbWidthHeightSize,
    backgroundColor: (!showThumb || !thumbnail) ? colour : false,
    backgroundPosition: (!showThumb || !thumbnail) ? bgPos : false,
    backgroundImage: (showThumb && thumbnail) ? `url(${thumbUrl})` : false,
    backgroundSize: thumbnail ? 'cover' : '200%',
    ...style
  };

  // Badges are only shown for medium/large
  const renderBadges = thumbSize === 'medium' || thumbSize === 'large';

  return (
    <div className={storyThumbClasses} style={thumbStyle} role="img">
      {renderBadges && <StoryBadgesNew
        commentCount={commentCount}
        fileCount={fileCount}
        ratingCount={ratingCount}
      />}
    </div>
  );
};

StoryThumbNew.propTypes = {
  /** coloured tile if thumbnail not enabled or available */
  colour: PropTypes.string.isRequired,

  /** grid style */
  grid: PropTypes.bool,

  isCard: PropTypes.bool,

  /** Valid size: <code>small, medium, large</code> */
  thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

  /** custom thumb height + width */
  customThumbSize: PropTypes.number,

  /** display thumbnail if available */
  showThumb: PropTypes.bool,

  /** show all Story badges */
  showBadges: PropTypes.bool,

  showIcons: PropTypes.bool,

  authString: PropTypes.string,

  className: PropTypes.string,
  style: PropTypes.object
};

StoryThumbNew.defaultProps = {
  authString: '',
  colour: '',
  customThumbSize: 0,
  grid: false,
  isCard: false,
  showThumb: true,
  style: {},
  thumbSize: 'small'
};

export default StoryThumbNew;
