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
import MEDIA_TYPES from 'static/FileTypes/FileTypes';

import SVGIcon from 'components/SVGIcon/SVGIcon';

const FileThumbNew = props => {
  const {
    category,
    className,
    customThumbSize,
    grid,
    showThumb,
    style,
    thumbnail,
    thumbSize,
  } = props;

  const sizes = {
    small: grid ? 2 : 2.875, //rem, dummy grid size
    medium: grid ? 3 : 4, // dummy size
    large: grid ? 12.5 : 5 // dummy size !grid
  };

  let thumbWidth = customThumbSize;
  if (!customThumbSize) thumbWidth = sizes[thumbSize];

  const isFolder = category === 'folder';

  const thumbStyles = {
    height: `${thumbWidth}rem`,
    width: `${thumbWidth}rem`,
    ...!isFolder && category && (!thumbnail || !showThumb) && { backgroundColor: MEDIA_TYPES[category].color },
    ...!isFolder && thumbnail && showThumb && {
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: `${thumbWidth}rem`
    },
    ...style
  };

  const styles = require('./FileThumbNew.less');
  const cx = classNames.bind(styles);

  const classes = cx({
    noShrink: true,
    thumbnail: true,
    thumbnailWrapper: !isFolder
  }, className);

  return (
    <div
      className={classes}
      data-category={category}
      style={thumbStyles}
    >
      {!isFolder && category && (!thumbnail || !showThumb) && <span>{MEDIA_TYPES[category].shortLabel}</span>}
      {isFolder && <SVGIcon type={category} />}
    </div>
  );
};

FileThumbNew.proptTypes = {
  category: PropTypes.string,

  /** custom thumb height + width in rem */
  customThumbSize: PropTypes.number,

  grid: PropTypes.bool,

  /** Pass true/false to show/hide thumbnail */
  showThumb: PropTypes.bool,

  thumbnail: PropTypes.string,
  thumbSize: PropTypes.string
};

FileThumbNew.defaultProps = {
  category: '',
  customThumbSize: 0,
  grid: false,
  showThumb: true,
  thumbnail: '',
  thumbSize: 'small'
};

export default FileThumbNew;
