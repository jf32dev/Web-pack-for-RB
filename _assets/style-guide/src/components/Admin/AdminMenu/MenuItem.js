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

export default class MenuItem extends PureComponent {
  static propTypes = {
    basePath: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    selectedUrl: PropTypes.string,
    optionSelected: PropTypes.array,

    onClick: PropTypes.func.isRequired,

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
    this.state = { url: '' };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { basePath, name, optionSelected } = this.props;

    // Composed URL
    this.setState({ 'url': optionSelected.length ? basePath + '/' + optionSelected[0].name + '/' + name : basePath + '/' + name });
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
      case 'stories':
        icon = 'story';
        break;
      case 'structure':
        icon = 'folders';
        break;
      case 'websites':
        icon = 'websites';
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
      case 'learning':
        icon = 'education';
        break;
      case 'interest-areas':
        icon = 'copy';
        break;
      case 'custom-apps':
        icon = 'custom-apps';
        break;
      case 'content-recommender':
        icon = 'genie';
        break;
      default:
        break;
    }
    return icon;
  }

  handleClick(event) {
    event.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event, { ...this.props, path: this.state.url });
    }
  }

  render() {
    const {
      name,
      type,
      selectedUrl,
      isMenuCollapse,
      strings,
      className,
      style
    } = this.props;
    const { url } = this.state;
    const styles = require('./AdminMenu.less');
    const cx = classNames.bind(styles);
    const icon = this.setIcon(name);
    const itemClasses = cx({
      MenuItem: true,
      selected: selectedUrl === url,
      fullWidth: !isMenuCollapse,
      ['icon-' + icon]: !!icon && type
    }, className);

    return (
      <a
        href={url}
        aria-label={strings[name] || name}
        title={strings[name] || name}
        className={itemClasses}
        style={style}
        onClick={this.handleClick}
      >
        <span>{strings[name] || name}</span>
      </a>
    );
  }
}
