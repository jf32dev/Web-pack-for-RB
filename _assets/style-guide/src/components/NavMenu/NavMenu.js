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

class NavMenuItem extends PureComponent {
  static propTypes = {
    dataName: PropTypes.string,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    icon: PropTypes.string,
    selected: PropTypes.bool,
    horizontal: PropTypes.bool,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    dataName: '',
    icon: 'none'
  };

  render() {
    const {
      dataName,
      name,
      url,
      icon,
      selected,
      horizontal,
      onClick,
      className,
      style
    } = this.props;
    const styles = require('./NavMenu.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      NavMenuItem: true,
      selected: selected,
      ['icon-' + icon]: !horizontal
    }, className);

    return (
      <a
        data-name={dataName}
        href={url} aria-label={name} title={name}
        className={itemClasses} style={style} onClick={onClick}
      >
        {name}
      </a>
    );
  }
}

/**
 * A list of links.
 */
export default class NavMenu extends PureComponent {
  static propTypes = {
    /** Array of menu items with <code>name</code>, <code>url</code> and <code>icon</code> attributes */
    list: PropTypes.array,

    /** url of menu item to set as selected */
    selectedUrl: PropTypes.string,

    /** horizontal style */
    horizontal: PropTypes.bool,

    /** secondary style applied -- currently used only with <code>horizontal</code> */
    secondary: PropTypes.bool,

    onItemClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: []
  };

  render() {
    const { list, selectedUrl, horizontal, secondary, onItemClick } = this.props;
    const styles = require('./NavMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      NavMenu: true,
      vertical: !horizontal,
      horizontal: horizontal,
      secondary: horizontal && secondary
    }, this.props.className);

    return (
      <nav className={classes} style={this.props.style}>
        <ul>
          {list.map(opt => (
            <li key={opt.url}>
              <NavMenuItem
                {...opt}
                selected={opt.url === selectedUrl}
                horizontal={horizontal}
                onClick={onItemClick}
              />
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
