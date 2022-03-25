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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

class LegendItem extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static propTypes = {
    type: PropTypes.string.isRequired,
  };

  getNodeColor(type) {
    const { naming } = this.context.settings;
    const { strings } = this.props;

    let darkColor = type ? '#454545' : '#e5e5e5';
    let lightColor = '#fafafa';
    let typeLabel = type;

    switch (type) {
      case 'tab':
        typeLabel = naming.tabs;
        lightColor = '#F5AABB'; //Light color bg
        darkColor = '#e2023a'; //Dark color border
        break;
      case 'channel':
        typeLabel = naming.channels;
        lightColor = '#FBCBB5';
        darkColor = '#f26724';
        break;
      case 'group':
        typeLabel = strings.groups;
        lightColor = '#B7E0F9';
        darkColor = '#0092ec';
        break;
      case 'user':
        typeLabel = strings.users;
        lightColor = '#B8F7CC';
        darkColor = '#04e44a';
        break;
      case 'interest-group':
        typeLabel = strings.interestArea;
        lightColor = '#DAD2C3';
        darkColor = '#7e622a';
        break;
      case 'link':
      case 'web':
        typeLabel = strings.webSites;
        lightColor = '#CCCCCC';
        darkColor = '#4c4c4c';
        break;
      default:
        break;
    }

    return { color: darkColor, bgColor: lightColor, label: typeLabel };
  }

  render() {
    const {
      type,
      className,
    } = this.props;
    const styles = require('./Tree.less');
    const cx = classNames.bind(styles);
    const cssClasses = {
      legendIcon: true,
    };
    cssClasses[type] = true;
    const itemClasses = cx(cssClasses, className);

    return (
      <div>
        <span className={itemClasses} />
        <span className={styles.legendName}>{this.getNodeColor(type).label}</span>
      </div>
    );
  }
}

export default class Legend extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,

    className: PropTypes.string,
    style: PropTypes.string,
    strings: PropTypes.object
  };

  static defaultProps = {
    icon: '',
    strings: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      list,
    } = this.props;
    const styles = require('./Tree.less');

    return (
      <ul className={styles.legend}>
        {list.map((item, index) => (
          <li key={'legend-' + index}>
            <LegendItem type={item} strings={this.props.strings} />
          </li>
        ))}
      </ul>
    );
  }
}
