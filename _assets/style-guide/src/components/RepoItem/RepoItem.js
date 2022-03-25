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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

export default class RepoItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    service: PropTypes.string,
    folderId: PropTypes.string,
    note: PropTypes.string,

    /** Allows nesting the default <code>/repo/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive or isSelected instead.'
        );
      }
      return null;
    },

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    thumbSize: 'large',
    rootUrl: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const {
      id,
      name,
      note,
      grid,
      isActive,
      thumbSize,
      noLink,
      className,
      style
    } = this.props;
    const anchorUrl = this.props.rootUrl + '/repo/' + id;
    let thumbWidth = this.props.thumbWidth;

    // Grid sizes
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

    const styles = require('./RepoItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      RepoItem: true,
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

    // Treat some services as equivalents
    let service = this.props.service;
    if (service === 'alfresco_cloud') {
      service = 'alfresco';
    } else if (service === 'onedrivebiz') {
      service = 'onedrive';
    }

    const itemContent = (
      <div className={styles.wrapper}>
        <div
          data-service={service}
          className={thumbClasses + ' icon-' + service}
          style={thumbStyle}
        />
        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          {note && <span className={styles.note}>{note}</span>}
        </div>
      </div>
    );

    if (noLink) {
      return (
        <div
          aria-label={name}
          data-id={id}
          className={itemClasses}
          style={itemStyle}
          onClick={this.handleClick}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div
        aria-label={name}
        data-id={id}
        className={itemClasses}
        style={itemStyle}
      >
        <a href={anchorUrl} title={name} onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
