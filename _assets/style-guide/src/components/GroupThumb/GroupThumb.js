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

/**
 * Group Thumbnail. Used by GroupItem.
 */
export default class GroupThumb extends PureComponent {
  static propTypes = {
    thumbnail: PropTypes.string,

    /** Hex colour code to use in place of thumbnail */
    colour: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    authString: '',
    thumbSize: 'large'
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      thumbnail,
      colour,
      thumbSize,
      showThumb,
      grid,
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
            thumbWidth = 66;
            break;
          default:
            thumbWidth = 84;
            break;
        }

      // List sizes
      } else {
        switch (thumbSize) {
          case 'small':
            thumbWidth = 46;
            break;
          case 'medium':
            thumbWidth = 64;
            break;
          default:
            thumbWidth = 84;
            break;
        }
      }
    }

    const styles = require('./GroupThumb.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      GroupThumb: true,
      listThumbnail: !grid,
      gridThumbnail: grid,

      listThumbLarge: !grid && thumbSize === 'large',
      listThumbMedium: !grid && thumbSize === 'medium',
      listThumbSmall: !grid && thumbSize === 'small',

      gridThumbLarge: grid && thumbSize === 'large',
      gridThumbMedium: grid && thumbSize === 'medium',
      gridThumbSmall: grid && thumbSize === 'small',

      hasThumb: thumbnail && thumbnail.length > 0
    }, className);

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth,
      backgroundColor: (!showThumb || !thumbnail) ? colour : 'transparent',
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : 'none',
      ...style
    };

    return (
      <span data-size={thumbSize} className={classes} style={thumbStyle} />
    );
  }
}
