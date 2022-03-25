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
import { FormattedNumber, FormattedDate, FormattedMessage } from 'react-intl';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';

const StoryCard = (props) => {
  const {
    badgeColour,
    badgeTitle,
    childType,
    commentCount,
    files,
    fileCount,
    id,
    isLiked,
    isProtected,
    isQuickfile,
    isQuicklink,
    name,
    noLink,
    onClick,
    permId,
    quicklinkUrl,
    ratingCount,
    rootUrl,
    style,
    updated
  } = props;

  const handleClick = e => {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(e, { ...{ props } });
    }
  };

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

  const styles = require('./StoryCard.less');

  const storyCardMetadataSize = {
    width: '248px',
    textLines: 3
  };

  const nameStyle = {
    width: storyCardMetadataSize.width,
    WebkitLineClamp: storyCardMetadataSize.textLines,
  };

  const badgeStyle = {
    color: `${badgeColour}`,
    marginRight: '0.5rem',
    fontWeight: '600',
  };

  // Merge passed style with grid thumbWidth
  const itemStyle = {
    ...style,
    width: '420px'
  };

  const itemContent = (
    <div className={styles.storyContent}>
      <StoryThumbNew
        isCard
        {...props}
      />
      <div className={styles.listContent}>
        <div className={styles.nameItem}>
          {badgeTitle && <span style={badgeStyle}>
            {badgeTitle}
          </span>}
          <FormattedDate
            value={updated * 1000}
            day="2-digit"
            month="long"
            year="numeric"
          />
          <span className={styles.name} style={nameStyle}>
            {name}
          </span>
        </div>
        <div className={styles.iconsContainer}>
          <div>
            {fileCount > 0 && <Fragment>
              <i className={styles.fileIcon} />
              <FormattedNumber value={fileCount} />
              <FormattedMessage
                id="files"
                defaultMessage="Files"
              />
            </Fragment>}
          </div>
          <div>
            {isLiked && <Fragment>
              <i className={styles.isLikedIcon} />
              <FormattedNumber value={ratingCount} />
            </Fragment>}
            {commentCount > 0 && <Fragment>
              <i className={styles.commentCountIcon} />
              <FormattedNumber value={commentCount} />
            </Fragment>}
          </div>
        </div>
      </div>
    </div>
  );

  if (noLink) {
    return (
      <div
        aria-label={name}
        data-id={permId || id}
        className={styles.listItem}
        style={itemStyle}
        onClick={handleClick}
      >
        {itemContent}
      </div>
    );
  }

  return (
    <div
      aria-label={name}
      data-id={permId || id}
      className={styles.listItem}
      style={itemStyle}
    >
      <a href={anchorUrl} rel="noopener noreferrer" onClick={handleClick}>
        {itemContent}
      </a>
    </div>
  );
};

StoryCard.defaultProps = {
  authString: '',
  disabled: false,
  isLiked: false,
  isSelected: false,
  isQuickfile: false,
  isQuicklink: false,
  rootUrl: '',
  strings: {
    files: 'Files'
  },
  thumbSize: 'small',
};

StoryCard.propTypes = {
  id: PropTypes.number,
  permId: PropTypes.number.isRequired,
  badgeColour: PropTypes.string,
  badgeTitle: PropTypes.string,
  files: PropTypes.array,
  fileCount: PropTypes.number,
  name: PropTypes.string.isRequired,
  commentCount: PropTypes.number,
  updated: PropTypes.number,
  isLiked: PropTypes.bool,
  isProtected: PropTypes.bool.isRequired,
  isQuickfile: PropTypes.bool.isRequired,
  isQuicklink: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  quicklinkUrl: PropTypes.string,

  /** Allows nesting the default <code>/story/{id}</code> anchor href */
  rootUrl: PropTypes.string,

  ratingCount: PropTypes.number,

  strings: PropTypes.object,

  /** Valid size: <code>small, medium, large</code> */
  thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

  /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
  thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  noLink: PropTypes.bool,
};

export default StoryCard;
