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

import tinycolor from 'tinycolor2';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedNumber } from 'react-intl';

/**
 * Renders Story Badges. Used by StoryItem & StoryThumb.
 */
export default class StoryBadges extends Component {
  static propTypes = {
    badgeColour: PropTypes.string,
    badgeTitle: PropTypes.string,

    commentCount: PropTypes.number,
    ratingCount: PropTypes.number,

    isBookmark: PropTypes.bool,
    isGeoProtected: PropTypes.bool,

    /** sets filled like icon */
    isLiked: PropTypes.bool,
    isProtected: PropTypes.bool,
    isQuicklink: PropTypes.bool,
    isQuickfile: PropTypes.bool,

    /** toggle icon visibility */
    showIcons: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const {
      badgeColour,
      badgeTitle,
      commentCount,
      isBookmark,
      isGeoProtected,
      isProtected,
      isLiked,
      isQuicklink,
      isQuickfile,
      ratingCount,
      showIcons,
      className,
      style
    } = this.props;
    let showTopRow = false;
    let showBottomRow = false;

    // Determine which rows of icons will be displayed
    if (showIcons && (commentCount || ratingCount)) {
      showTopRow = true;
    }
    if (showIcons && (isQuicklink || isQuickfile || isGeoProtected || isProtected || isBookmark)) {
      showBottomRow = true;
    }

    // Wrapper styles
    const styles = require('./StoryBadges.less');
    const cx = classNames.bind(styles);
    const badgesClasses = cx({
      StoryBadges: true,
      topActive: showTopRow && !showBottomRow,
      bottomActive: !showTopRow && showBottomRow,
      topAndBottomActive: showTopRow && showBottomRow
    }, className);
    const ratingClasses = cx({
      ratingCount: true,
      isLiked: isLiked
    });

    // Badge label text color should constrast with bg colour
    const contrast = tinycolor.readability(badgeColour, '#fff');
    const limit = 1.65;  // contrast before switching from light/dark text
    const labelColor = contrast < limit ? '#222222' : '#FFFFFF';

    // badge label style
    const labelStyle = {
      backgroundColor: badgeColour,
      color: labelColor
    };

    // Render sections?
    const showLeftIcon = showIcons && (isQuicklink || isQuickfile || isGeoProtected || isProtected);
    const showRightIcons = showIcons && (isBookmark);

    return (
      <div className={badgesClasses} style={style}>
        {badgeTitle && <span className={styles.badgeLabel} style={labelStyle}>{badgeTitle}</span>}
        {(showIcons && (ratingCount > 0 || commentCount > 0)) && <div className={styles.counts}>
          {ratingCount > 0 &&
          <span className={ratingClasses}>
            <FormattedNumber value={ratingCount} />
          </span>}
          {commentCount > 0 &&
          <span className={styles.commentCount}>
            <FormattedNumber value={commentCount} />
          </span>}
        </div>}
        {showLeftIcon && <div className={styles.leftIcons}>
          {isQuicklink && <span onClick={this.handleQuickClick} className={styles.quicklinkIcon} />}
          {isQuickfile && <span onClick={this.handleQuickClick} className={styles.quickfileIcon} />}
          {isGeoProtected && <span className={styles.locationIcon} />}
          {isProtected && <span className={styles.protectedIcon} />}
        </div>}
        {showRightIcons && <div className={styles.rightIcons}>
          {isBookmark && <span className={styles.bookmarkIcon} />}
        </div>}
      </div>
    );
  }
}
