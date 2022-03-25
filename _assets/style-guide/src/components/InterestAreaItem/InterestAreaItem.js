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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Interest Area are used on settings to defined a collection of favorites groups.
 */
export default class InterestAreaItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    colour: PropTypes.string,

    grid: PropTypes.bool,
    showThumb: PropTypes.bool,
    selected: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    authString: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.onClick(event, this);
  }

  render() {
    const {
      name,
      thumbnail,
      colour,
      showThumb,
      selected,
      authString,
      className,
      style
    } = this.props;

    const styles = require('./InterestAreaItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      InterestAreaItem: true,
      //listItem: !grid,
      gridItem: true, //grid,
      selected: selected
    }, className);

    const thumbClasses = cx({
      thumbnail: true, //!grid,
      gridThumbnail: true, //grid,
    });

    const thumbStyle = {
      backgroundColor: (!showThumb || !thumbnail) ? colour : 'transparent',
      backgroundImage: (showThumb && thumbnail) ? 'url(' + thumbnail + authString + ')' : 'none',
    };

    return (
      <div className={itemClasses} style={style}>
        <div
          title={name} onClick={this.handleClick} className={thumbClasses}
          style={thumbStyle}
        />
        <div title={name} className={styles.name} onClick={this.handleClick}>
          {name}
        </div>
      </div>
    );
  }
}
