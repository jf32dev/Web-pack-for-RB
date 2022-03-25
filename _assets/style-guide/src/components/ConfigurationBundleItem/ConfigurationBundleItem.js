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
import { FormattedDate, FormattedMessage } from 'react-intl';

/**
 * Clickable ConfigurationBundleItem generally displayed in a List.
 */
export default class ConfigurationBundleItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    childCount: PropTypes.number,

    /** Last updated timestamp to display underneath Item name */
    lastUpdated: PropTypes.number,

    /** displays indicator icons */
    showIcons: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Show Edit button */
    showEdit: PropTypes.bool,

    onClick: PropTypes.func.isRequired,

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    /** Show Admin options like Remove button */
    showAdmin: PropTypes.bool,

    onRemoveClick: function(props) {
      if (props.showAdmin && typeof props.onRemoveClick !== 'function') {
        return new Error('onRemoveClick is required when showAdmin is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.string
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    showIcons: true,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this.props);
    }
  }

  handleEditClick(event) {
    event.stopPropagation();
    const { onEditClick } = this.props;

    if (typeof onEditClick === 'function') {
      onEditClick(event, this.props);
    }
  }

  handleDeleteClick(event) {
    event.stopPropagation();
    const { onRemoveClick } = this.props;

    if (typeof onRemoveClick === 'function') {
      onRemoveClick(event, this.props);
    }
  }

  renderCountNote() {
    const { childCount, lastUpdated } = this.props;
    const styles = require('./ConfigurationBundleItem.less');

    return (
      <span className={styles.note}>
        {(childCount >= 0) && <FormattedMessage
          id="n-users"
          defaultMessage="{itemCount, plural, one {# user} other {# users}}"
          values={{ itemCount: childCount }}
        />}
        {lastUpdated && <span>{' - '}
          <FormattedDate
            value={(lastUpdated * 1000)}
            day="2-digit"
            month="2-digit"
            year="numeric"
          />
        </span>}
      </span>
    );
  }

  render() {
    const {
      name,
      showEdit,
      showAdmin,
      showIcons,
      className,
      style
    } = this.props;

    const styles = require('./ConfigurationBundleItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      ConfigurationBundleItem: true,
      listItem: true,
      showEdit: showEdit,
      selected: this.props.isActive
    }, className);

    const thumbClasses = cx({
      showIcon: showIcons,
    }, className);

    const thumbStyle = {
      height: 46,
      width: 46,
    };

    return (
      <div className={itemClasses} style={style} onClick={this.handleClick}>
        <div className={thumbClasses} style={thumbStyle} />
        <div className={styles.info} title={name}>
          <span className={styles.name}>{name}</span>
          {this.renderCountNote()}
          {showEdit && <span className={styles.edit} onClick={this.handleEditClick} />}
          {showAdmin && <span className={styles.trashBtn} onClick={this.handleDeleteClick} />}
        </div>
        {this.props.children}
      </div>
    );
  }
}
