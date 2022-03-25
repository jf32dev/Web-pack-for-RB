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
 * @package hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import StoryBadgesNew from 'components/StoryBadgesNew/StoryBadgesNew';

/**
 * An alternate Story tile intended for Featured Stories.
 */
const FeaturedStoryItem = ({
  permId,
  name,
  featuredImage,
  isProtected,
  isQuicklink,
  isQuickfile,
  quicklinkUrl,
  files,
  updated,
  badgeTitle,
  badgeColour,
  commentCount,
  fileCount,
  ratingCount,
  authString,
  onAnchorClick
}) => {
  const styles = require('./FeaturedStoryItem.less');
  const badgeStyle = {
    color: `${badgeColour}`,
  };

  const featuredImageUrl = `${featuredImage}${authString}`;

  // Story anchor URL
  const storyUrl = `/story/${permId}`;
  let anchorUrl = storyUrl;

  // Quicklink
  if (!isProtected && isQuicklink && quicklinkUrl) {
    anchorUrl = quicklinkUrl;

  // Quickfile
  } else if (!isProtected && isQuickfile && files && files[0]) {
    anchorUrl = `/file/${files[0].id}`;
  }

  return (
    <a
      href={anchorUrl}
      className={styles.featuredItem}
      aria-label={name}
      onClick={onAnchorClick}
    >
      <StoryBadgesNew
        commentCount={commentCount}
        fileCount={fileCount}
        ratingCount={ratingCount}
        className={styles.storyBadge}
      />
      <img src={featuredImageUrl} alt={name} />
      <div className={styles.storyMetadata}>
        <h3 title={name}>{name}</h3>
        <div className={styles.footNoteWrapper}>
          <span className={styles.badgeTitle} style={badgeStyle}>
            {badgeTitle}
          </span>
          <FormattedDate
            value={updated * 1000}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </div>
      </div>
    </a>
  );
};

FeaturedStoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  permId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  featuredImage: PropTypes.string,
  isProtected: PropTypes.bool,
  authString: PropTypes.string,
  onAnchorClick: PropTypes.func.isRequired,
};

FeaturedStoryItem.defaultProps = {
  authString: '',
};

export default FeaturedStoryItem;
