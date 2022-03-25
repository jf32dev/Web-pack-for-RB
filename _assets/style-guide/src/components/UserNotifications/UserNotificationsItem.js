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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';

export default class UserNotificationsItem extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number,
    showDetails: PropTypes.bool,
    isSubItem: PropTypes.bool,
    parentId: PropTypes.string,
    options: PropTypes.array,
    notifications: PropTypes.object,
    hideEmailCheckbox: PropTypes.bool,
    hidePushCheckbox: PropTypes.bool,
    hideUserCheckbox: PropTypes.bool,

    isAdmin: PropTypes.bool,

    onToggleDetails: PropTypes.func,
    onChange: PropTypes.func.isRequired,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    hideEmailCheckbox: false,
    hidePushCheckbox: false,
    hideUserCheckbox: false,
    isAdmin: false,
    options: [],
    strings: {
      details: 'Details'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  getCheckboxValue(value, type) {
    if (type === 'email') {
      return value !== 1 && value !== 3 && value !== 5 && value !== 7;
    } else if (type === 'push') {
      return value !== 2 && value !== 3 && value !== 6 && value !== 7;
    } else if (type === 'user') {
      return value !== 4 && value !== 5 && value !== 6 && value !== 7;
    }
    return false;
  }

  handleCheckboxChange(event) {
    const {
      onChange
    } = this.props;

    if (typeof onChange === 'function') {
      onChange(event, this.props);
    }
  }

  handleToggleDetails(event) {
    const {
      onToggleDetails
    } = this.props;

    if (typeof onToggleDetails === 'function') {
      onToggleDetails(event, this.props);
    }
  }

  render() {
    const {
      id,
      name,
      value,
      showDetails,
      isSubItem,
      options,
      admin,
      notifications,
      hideEmailCheckbox,
      hidePushCheckbox,
      hideUserCheckbox,
      strings,
      className,
      //style
    } = this.props;
    const styles = require('./UserNotifications.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      item: true,
      subitem: !!isSubItem
    }, className);

    let uncheckEmail = this.getCheckboxValue(value, 'email');
    let uncheckPush = this.getCheckboxValue(value, 'push');
    let uncheckUser = this.getCheckboxValue(value, 'user');
    let indeterminateEmail = false;
    let indeterminatePush = false;
    let indeterminateUser = false;

    // Calculate if parent should be checked based on children items
    if (options && options.length > 0) {
      uncheckEmail = options.every(item => this.getCheckboxValue(notifications[item.id], 'email'));
      uncheckPush = options.every(item => this.getCheckboxValue(notifications[item.id], 'push'));
      uncheckUser = options.every(item => this.getCheckboxValue(notifications[item.id], 'user'));

      options.map((opt) => {
        indeterminateEmail = this.getCheckboxValue(notifications[opt.id], 'email') ? true : indeterminateEmail;
        indeterminatePush = this.getCheckboxValue(notifications[opt.id], 'push') ? true : indeterminatePush;
        indeterminateUser = this.getCheckboxValue(notifications[opt.id], 'user') ? true : indeterminateUser;
        return opt;
      });
    }

    return (
      <div key={id} className={itemClasses}>
        <div className={styles.itemLabel}>
          {name}{showDetails && <span className={styles.detailIcon} onClick={this.handleToggleDetails} />}
        </div>
        <div className={styles.iconsWrapper}>
          <div className={styles.checkboxContainer}>
            {!hideEmailCheckbox && <Checkbox
              name={id}
              value={1}
              indeterminateValue={indeterminateEmail}
              checked={!uncheckEmail}
              onChange={this.handleCheckboxChange}
              className={styles.checkbox + ' ' + styles.emailCheckbox}
            />}
            {!hidePushCheckbox && <Checkbox
              name={id}
              value={2}
              indeterminateValue={indeterminatePush}
              checked={!uncheckPush}
              onChange={this.handleCheckboxChange}
              className={styles.checkbox}
            />}
            {!hideUserCheckbox && admin && <Checkbox
              name={id}
              value={4}
              indeterminateValue={indeterminateUser}
              checked={!uncheckUser}
              onChange={this.handleCheckboxChange}
              className={styles.checkbox}
            />}
          </div>
          <div className={styles.action}>
            {showDetails &&
              <Btn inverted small onClick={this.handleToggleDetails}>{strings.details}</Btn>
            }
          </div>
        </div>
      </div>
    );
  }
}
