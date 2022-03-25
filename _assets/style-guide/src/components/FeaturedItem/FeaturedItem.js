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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import StoryBadges from 'components/StoryBadges/StoryBadges';
import UserItem from 'components/UserItem/UserItem';

/**
 * An alternate Story tile intended for Featured Stories.
 */
export default class FeaturedItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    permId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    featuredImage: PropTypes.string,
    isProtected: PropTypes.bool,
    excerpt: PropTypes.string,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** displays Story badges (if badgeTitle is set) */
    showBadges: PropTypes.bool,

    /** displays indicator icons (like, comments etc.) */
    showIcons: PropTypes.bool,

    /** displays title and excerpt next to featured image */
    showExcerpt: PropTypes.bool,

    authString: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,
    showStoryAuthor: PropTypes.bool,
  };

  static defaultProps = {
    authString: '',
    thumbSize: 'large'
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();

    // Propagate props to onStoryClick handler
    const { onStoryClick } = this.props;
    if (typeof onStoryClick === 'function') {
      onStoryClick(event, this);
    }
  }

  handleQuickClick(event) {
    event.preventDefault();
    event.stopPropagation();  // stop event triggering onClick

    const { onStoryClick } = this.props;
    if (typeof onStoryClick === 'function') {
      onStoryClick(event, this);
    }
  }

  render() {
    const {
      permId,
      name,
      thumbnail,
      excerpt,
      featuredImage,
      isProtected,
      author,
      files,
      isQuicklink,
      isQuickfile,
      quicklinkUrl,
      thumbSize,
      showBadges,
      showExcerpt,
      authString,
      onAnchorClick,
      showStoryAuthor,
    } = this.props;
    const styles = require('./FeaturedItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FeaturedItem: true,
      listItemLarge: thumbSize === 'large',
      listItemMedium: thumbSize === 'medium',
      listItemSmall: thumbSize === 'small',
      showExcerpt: showExcerpt
    }, this.props.className);

    const thumbStyle = {
      backgroundImage: 'url(' + (featuredImage || thumbnail) + authString + ')'
    };

    // Story anchor URL
    const storyUrl = '/story/' + permId;
    let anchorUrl = storyUrl;

    // Quicklink
    if (!isProtected && isQuicklink && quicklinkUrl) {
      anchorUrl = quicklinkUrl;

    // Quickfile
    } else if (!isProtected && isQuickfile && files && files[0]) {
      anchorUrl = '/file/' + files[0].id;
    }

    const thumbElem = (
      <a href={anchorUrl} title={name} onClick={this.handleClick}>
        <div className={styles.thumbnail} style={thumbStyle}>
          {showBadges && <StoryBadges {...this.props} />}
        </div>
      </a>
    );

    const userElem = showStoryAuthor ? (
      <UserItem
        {...author}
        note={author.role}
        thumbSize={(thumbSize === 'small' || thumbSize === 'medium') ? 'tiny' : 'small'}
        showThumb
        onClick={onAnchorClick}
        className={styles.user}
      />
    ) : null;

    const titleElem = (
      <a
        href={(isQuickfile || isQuicklink) ? storyUrl : anchorUrl}
        title={name}
        onClick={onAnchorClick}
      >
        <h3 className={styles.name}>{name}</h3>
      </a>
    );

    if (showExcerpt) {
      return (
        <article className={classes}>
          <div>
            {thumbElem}
            {userElem}
          </div>
          <div className={styles.excerpt}>
            {titleElem}
            <p>{excerpt}</p>
          </div>
        </article>
      );
    }

    return (
      <article className={classes}>
        {thumbElem}
        {titleElem}
        {userElem}
      </article>
    );
  }
}
