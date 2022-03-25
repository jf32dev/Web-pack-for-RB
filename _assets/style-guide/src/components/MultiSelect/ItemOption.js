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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';

export default class ItemSelected extends Component {
  static propTypes = {
    index: PropTypes.number,
    label: PropTypes.string,
    focus: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    onValueClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseDown: PropTypes.func,

    thumbnail: PropTypes.string,
    /** optional type to display */
    type: PropTypes.oneOf(['user', 'group', 'crm', 'crm_account', 'crm_contact', 'crm_opportunity', 'crm_lead', 'crm_campaign', 'crm_product']),
    source: PropTypes.string,
  };

  static defaultProps = {
    maxInitials: 2,
  };

  constructor(props) {
    super(props);
    this.state = { initials: '' };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { label, thumbnail } = this.props;
    if (label && !thumbnail) {
      this.getInitials(this.props);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.label !== this.props.label || nextProps.maxInitials !== this.props.maxInitials) {
      this.getInitials(nextProps);
    }
  }

  getInitials(props) {
    const { label, maxInitials } = props;
    const fixedName = label.replace(/ +(?= )/g, '');  // remove double spaces
    const nameArray = fixedName.split(' ');
    let initials = '';

    if (nameArray.length > 1 && maxInitials > 1) {
      initials = nameArray[0][0] + nameArray[1][0];
    } else {
      initials = nameArray[0][0];
    }

    this.setState({ initials: initials });
  }

  handleClick(event) {
    this.props.onValueClick(event, this.props);
  }

  handleMouseOver() {
    this.props.onMouseOver(this.props);
  }

  render() {
    const { index, label, value, type, thumbnail, defaultColour, ...other } = this.props;
    const styles = require('./MultiSelect.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      optionItem: true,
      focusOption: this.props.focus,
      avatar: ['user', 'group', 'crm_account', 'crm_contact'].find(t => t === type)
    });

    const thumbnailClass = cx({
      thumbnail: true,
      backgroundColor: !thumbnail && !defaultColour,
    });

    const style = {
      backgroundImage: thumbnail ? 'url(' + thumbnail + ')' : 'none',
    };

    if (defaultColour) style.backgroundColor = defaultColour;

    const crmSource = this.props.source || 'salesforce';
    let crmIcon = '';
    switch (crmSource) {
      case 'salesforce':
        crmIcon = ' icon-cloud-sf';
        break;
      default:
        crmIcon = ' icon-' + crmSource;
        break;
    }

    let comp;
    switch (type) {
      case 'user': {
        comp = (
          <div>
            <div className={thumbnailClass} style={style}>{!thumbnail && this.state.initials}</div>
            <span>{label}</span>
            <span>{other.email}</span>
          </div>
        );
        break;
      }
      case 'group': {
        comp = (
          <div>
            <div className={thumbnailClass + ' icon-group'} style={style} />
            <span>{label}</span>
            <span>
              <FormattedMessage
                id="n-users"
                defaultMessage="{itemCount, plural, one {# user} other {# users}}"
                values={{ itemCount: other.usersCount || 0 }}
              />
            </span>
          </div>
        );
        break;
      }
      case 'crm_contact': {
        comp = (
          <div className={styles.crmFlag + crmIcon}>
            <div className={thumbnailClass} style={style}>{!thumbnail && this.state.initials}</div>
            <span>{label}</span>
            <span>{other.email}</span>
          </div>
        );
        break;
      }
      case 'crm_account':
        comp = (
          <div className={styles.crmFlag + crmIcon}>
            <div className={thumbnailClass + ' icon-company-fill'} style={style} />
            <span>{label}</span>
            <span>
              <FormattedMessage
                id="n-users"
                defaultMessage="{itemCount, plural, one {# user} other {# users}}"
                values={{ itemCount: other.usersCount || 0 }}
              />
            </span>
          </div>
        );
        break;
      case 'crm_opportunity': {
        comp = (
          <span>{label + ' - ' + this.props.stage}</span>
        );
        break;
      }
      default:
        comp = (
          <span>{label}</span>
        );
        break;
    }

    return (
      <li
        key={value + '-' + index} title={label} className={classes}
        onClick={this.handleClick} onMouseDown={this.props.onMouseDown} onMouseOver={this.handleMouseOver}
      >
        {comp}
      </li>
    );
  }
}
