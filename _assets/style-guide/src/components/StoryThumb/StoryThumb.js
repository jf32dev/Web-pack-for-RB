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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import StoryBadges from 'components/StoryBadges/StoryBadges';

/**
 * Story Thumbnail. Used by StoryItem.
 */
export default class StoryThumb extends PureComponent {
  static propTypes = {
    /** coloured tile if thumbnail not enabled or available */
    colour: PropTypes.string.isRequired,

    /** grid style */
    grid: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** show all Story badges */
    showBadges: PropTypes.bool,

    showIcons: PropTypes.bool,

    readonly: PropTypes.bool,

    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    thumbSize: 'large'
  };

  constructor(props) {
    super(props);

    // Randomise background-position
    const y = (Math.random() * 100).toFixed(0);
    this.bgPos = { bgPos: '0 ' + y + '%' };
  }

  render() {
    const {
      colour,
      thumbnail,
      grid,
      thumbSize,
      showThumb,
      showBadges,
      showIcons,
      badgeTitle,
      readonly,
      authString,
      className,
      style
    } = this.props;

    let thumbWidth = this.props.thumbWidth;

    // Grid sizes
    if (!thumbWidth) {
      if (grid) {
        switch (thumbSize) {
          case 'small':
            thumbWidth = 46;
            break;
          case 'medium':
            thumbWidth = 150;
            break;
          default:
            thumbWidth = 200;
            break;
        }

      // List sizes
      } else {
        switch (thumbSize) {
          case 'small':
            thumbWidth = 46;
            break;
          case 'medium':
            thumbWidth = 66;
            break;
          default:
            thumbWidth = 90;
            break;
        }
      }
    }

    const styles = require('./StoryThumb.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryThumb: true,
      listThumbnail: !grid,
      gridThumbnail: grid,
      readonly: readonly,
    }, className);

    // Only append authString is thumbnail is hosted on push
    const thumbUrl = thumbnail && thumbnail.indexOf('push.bigtincan') > -1 ? (thumbnail + authString) : thumbnail;

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? colour : false,
      backgroundPosition: (!showThumb || !thumbnail) ? this.bgPos : false,
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbUrl + ')' : false,
      backgroundSize: thumbnail ? 'cover' : '200%',
      ...style
    };

    // Badges are only shown for medium/large
    const renderBadges = thumbSize === 'medium' || thumbSize === 'large';
    const showBadgeTitle = renderBadges && grid && showBadges;

    return (
      <div className={classes} style={thumbStyle}>
        {renderBadges &&
          <StoryBadges
            badgeColour={this.props.badgeColour}
            badgeTitle={showBadgeTitle ? badgeTitle : ''}
            commentCount={grid ? this.props.commentCount : 0}
            ratingCount={grid ? this.props.ratingCount : 0}
            isBookmark={grid ? this.props.isBookmark : false}
            isGeoProtected={grid ? this.props.isGeoProtected : false}
            isLiked={this.props.isLiked}
            isProtected={this.props.isProtected}
            isQuicklink={this.props.isQuicklink}
            isQuickfile={this.props.isQuickfile}
            showIcons={showIcons}
          />
        }
      </div>
    );
  }
}
