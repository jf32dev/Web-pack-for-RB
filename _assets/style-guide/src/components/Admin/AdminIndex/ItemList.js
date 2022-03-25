import PropTypes from 'prop-types';
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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

export default class ItemList extends PureComponent {
  static propTypes = {
    basePath: PropTypes.string.isRequired,
    path: PropTypes.array.isRequired,
    icon: PropTypes.string,

    onClick: PropTypes.func,

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

  UNSAFE_componentWillMount() {
    const { basePath, path } = this.props;
    const fullPath = path.length > 1 ? path[0].value + '/' + path[1].value : path[0].value;

    // Composed URL
    this.setState({ 'url': basePath + '/' + fullPath });
  }

  setIcon(key) {
    let icon = key;
    switch (key) {
      case 'general':
        icon = 'gear';
        break;
      case 'crm-integration':
        icon = 'crm-integration';
        break;
      case 'custom-naming-convention':
        icon = 'custom-naming';
        break;
      case 'home-screens':
        icon = 'home-screens';
        break;
      case 'security':
        icon = 'keyhole';
        break;
      case 'structure':
        icon = 'folders';
        break;
      case 'web-sites':
        icon = 'web';
        break;
      case 'users':
        icon = 'users';
        break;
      case 'configuration-bundles':
        icon = 'package';
        break;
      case 'custom-user-metadata':
        icon = 'user-metadata';
        break;
      case 'user-self-enrolment':
        icon = 'user-edit';
        break;
      case 'email':
        icon = 'email-envelope';
        break;
      case 'stories':
        icon = 'story';
        break;
      case 'training':
        icon = 'education';
        break;
      case 'interest-areas':
        icon = 'copy';
        break;
      case 'custom-apps':
        icon = 'app';
        break;
      default:
        break;
    }
    return icon;
  }

  handleClick(event) {
    event.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, { ...this.props, url: this.state.url });
    }
  }

  render() {
    const {
      path,
      className,
      style
    } = this.props;
    const { url } = this.state;
    const icon = this.setIcon(path[0].value);
    const styles = require('./AdminIndex.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      ItemList: true,
      ['icon-' + icon]: !!icon
    }, className);

    if (path.length === 1) {
      return (
        <div className={itemClasses}>
          <a
            href={url} aria-label={path[0].label} title={path[0].label}
            style={style} onClick={this.handleClick}
          >
            {path[0].label || path[0].value}
          </a>
        </div>
      );
    }

    return (
      <div className={itemClasses}>
        <span>{path[0].label || path[0].value}</span>
        <a
          href={url} aria-label={path[1].label} title={path[1].label}
          style={style} onClick={this.handleClick}
        >
          {path[1].label || path[1].value}
        </a>
      </div>
    );
  }
}
