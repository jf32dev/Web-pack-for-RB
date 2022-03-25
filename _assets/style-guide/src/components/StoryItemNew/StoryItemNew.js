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
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';
import ShareItemContent from 'components/ShareItemContent/ShareItemContent';

const StoryItemNew = (props) => {
  const {
    author,
    badgeColour,
    badgeTitle,
    id,
    permId,
    name,
    childType,
    files,
    isProtected,
    rootUrl,
    grid,
    isQuickfile,
    isQuicklink,
    onClick,
    quicklinkUrl,
    showAuthor,
    strings,
    style,
    thumbSize,
    noLink,
    updated,
    isShare,
    customThumbSize
  } = props;

  const handleClick = e => {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(e, { ...{ props } });
    }
  };

  // TODO - Revisit sizes when design has given correct dimensions
  let thumbWidthSize = customThumbSize;
  const sizes = {
    small: grid ? 100 : 46,
    medium: grid ? 200 : 70,
    large: grid ? 300 : 90
  };
  if (!customThumbSize) thumbWidthSize = sizes[thumbSize];

  // Story anchor URL
  let anchorUrl = `${rootUrl}/story/${permId || id}`;
  // Ignore protected & archived stories
  if (!isProtected && childType !== 'revision') {
    // Quicklink
    if (isQuicklink && quicklinkUrl) {
      anchorUrl = quicklinkUrl;
      // Quickfile
    } else if (isQuickfile && files && files[0]) {
      anchorUrl = '/file/' + files[0].id;
    }
  }

  const styles = require('./StoryItemNew.less');

  const nameStyle = {
    width: grid ? `${thumbWidthSize}px` : '270px'
  };

  // Merge passed style with grid customThumbSize
  const itemStyle = {
    ...style,
    width: (style && !style.width || grid) ? `${thumbWidthSize}px` : 'auto'
  };

  const badgeStyle = {
    color: `${badgeColour}`,
  };

  const itemContent = (
    <Fragment>
      <StoryThumbNew {...props} />
      <div className={styles.nameItem}>
        <label className={styles.name} style={nameStyle}>
          {name}
        </label>
        {!showAuthor && <div>
          {badgeTitle && <span className={styles.badgeTitle} style={badgeStyle}>
            {badgeTitle}
          </span>}
          <FormattedDate
            value={updated * 1000}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </div>}
        {showAuthor && <div>
          <span className={styles.storyBadge}>{strings.story}</span>
          <span className={styles.author}>{author.role}</span>
        </div>}
      </div>
    </Fragment>
  );

  if (noLink) {
    return (
      <div
        aria-label={name}
        data-id={permId || id}
        className={styles.storyItem}
        style={itemStyle}
        onClick={handleClick}
      >
        {isShare ? <ShareItemContent anchorUrl={anchorUrl} {...props} /> : itemContent}
      </div>
    );
  }

  return (
    <div
      aria-label={name}
      data-id={permId || id}
      className={styles.storyItem}
      style={itemStyle}
    >
      <a href={anchorUrl} rel="noopener noreferrer" onClick={handleClick}>
        {itemContent}
      </a>
    </div>
  );
};

StoryItemNew.defaultProps = {
  author: {},
  authString: '',
  colour: '',
  customThumbSize: 0,
  disabled: false,
  isFeatured: false,
  isSelected: false,
  isShare: false,
  noLink: false,
  rootUrl: '',
  showQuicklinkEdit: true,
  thumbSize: 'large',
  showQuickEdit: false,
  showAuthor: false,
  strings: {},
  tab: {},
  channel: {}
};

StoryItemNew.propTypes = {
  id: PropTypes.number,
  permId: PropTypes.number,
  name: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  colour: PropTypes.string.isRequired,
  commentCount: PropTypes.number,
  author: PropTypes.object,
  excerpt: PropTypes.string,
  fileCount: PropTypes.number,
  updated: PropTypes.number,
  isFeatured: PropTypes.bool,
  isProtected: PropTypes.bool,
  isSubscribed: PropTypes.bool,
  note: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rootUrl: PropTypes.string,
  grid: PropTypes.bool,
  isActive: PropTypes.bool,
  isSelected: PropTypes.bool,

  /** Pass true to render as HubShareConsole layout */
  isShare: PropTypes.bool,
  ratingCount: PropTypes.number,
  showCheckbox: PropTypes.bool,
  showAuthor: PropTypes.bool,
  thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

  /** custom thumb height + width */
  customThumbSize: PropTypes.number,
  showThumb: PropTypes.bool,
  showBadges: PropTypes.bool,
  showIcons: PropTypes.bool,
  showSubscribe: PropTypes.bool,
  showQuicklinkEdit: PropTypes.bool,
  showQuickEdit: PropTypes.bool,
  strings: PropTypes.object,
  disabled: PropTypes.bool,

  /** do not render an enclosing anchor tag */
  noLink: PropTypes.bool,
  authString: PropTypes.string
};

export default StoryItemNew;
