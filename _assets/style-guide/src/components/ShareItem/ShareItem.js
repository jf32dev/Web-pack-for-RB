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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedDate, FormattedMessage } from 'react-intl';

/**
 * Clickable ShareItem generally displayed in a List.
 */
export default class ShareItem extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,

    /** Number of shares */
    count: PropTypes.number,

    /** Unix timestamp */
    date: PropTypes.number.isRequired,

    /** Allows nesting the default <code>/share/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** DEPRECATED - use isActive instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive instead.'
        );
      }
      return null;
    },

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.string
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    count: 0,
    rootUrl: '',
    thumbSize: 'small'
  };

  constructor(props) {
    super(props);
    this.state = {
      fixedCount: this.props.count
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { count } = this.props;
    let newCount;

    /**
     * Abbreviate count if required
     * e.g.
     * 1000 => 1K
     * 9100 => 9.1K
     * 10000 => 10K
     * 11000 => 10K (no decimals)
     * 1000000 => 1M
     */
    if (count > 999 && count < 10000) {
      newCount = (count / 1000).toFixed(1).replace('.0', '') + 'K';
      this.setState({ fixedCount: newCount });
    } else if (count >= 10000 && count < 1000000) {
      newCount = (count / 1000).toFixed(0) + 'K';
      this.setState({ fixedCount: newCount });
    } else if (count >= 1000000) {
      newCount = (count / 1000000).toFixed(0) + 'M';
      this.setState({ fixedCount: newCount });
    }
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const { fixedCount } = this.state;
    const {
      id,
      count,
      date,
      grid,
      isActive,
      thumbSize,
      noLink,
      className,
      style
    } = this.props;
    const anchorUrl = this.props.rootUrl + '/share/' + id;

    // Grid sizes
    let thumbWidth;
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

    const styles = require('./ShareItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      ShareItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small',

      noLink: noLink
    }, className);

    // Merge passed style with grid thumbWidth
    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    const thumbClasses = cx({
      thumbnail: true,
      listThumbnail: !grid,
      gridThumbnail: grid
    });

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth
    };

    const itemContent = (
      <div className={styles.wrapper}>
        <div data-count={fixedCount} className={thumbClasses} style={thumbStyle} />
        <div className={styles.info}>
          <span className={styles.title}>
            <FormattedMessage
              id="shared-with-n-people"
              defaultMessage="Shared with {count, plural, one {# person} other {# people}}"
              values={{ count: count }}
            />
          </span>
          <span className={styles.date}>
            <FormattedDate
              value={date * 1000}
              day="2-digit"
              month="short"
              year="numeric"
              hour="numeric"
              minute="numeric"
            />
          </span>
        </div>
      </div>
    );

    if (noLink) {
      return (
        <div className={itemClasses} style={itemStyle} onClick={this.handleClick}>
          {itemContent}
        </div>
      );
    }

    return (
      <div className={itemClasses} style={itemStyle}>
        <a href={anchorUrl} onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
