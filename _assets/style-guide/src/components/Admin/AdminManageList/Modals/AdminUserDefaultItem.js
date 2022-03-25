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

import Checkbox from 'components/Checkbox/Checkbox';
import Accordion from 'components/Accordion/Accordion';

export default class AdminUserDefaultItem extends PureComponent {
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
    disabled: PropTypes.bool,
    showInitialCheckbox: PropTypes.bool,

    onToggleDetails: PropTypes.func,
    onChange: PropTypes.func.isRequired,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    hideEmailCheckbox: false,
    hidePushCheckbox: false,
    options: [],
    strings: {
      details: 'Details'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
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
      disabled,
      name,
      value,
      showDetails,
      isSubItem,
      options,
      notifications,
      hideEmailCheckbox,
      hidePushCheckbox,
      showInitialCheckbox,
      className,
      //style
    } = this.props;
    const styles = require('./AdminUserDefaultItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      item: true,
      subitem: !!isSubItem && !showInitialCheckbox
    }, className);

    let uncheckEmail = value !== 1 && value !== 3;
    let uncheckPush = value !== 2 && value !== 3;
    let indeterminateEmail = false;
    let indeterminatePush = false;

    // Calculate if parent should be checked based on children items
    if (options && options.length > 0) {
      uncheckEmail = options.every(item => notifications[item.id] !== 1 && notifications[item.id] !== 3);
      uncheckPush = options.every((item) => notifications[item.id] !== 2 && notifications[item.id] !== 3);

      options.map((opt) => {
        indeterminateEmail = !(notifications[opt.id] === 1 || notifications[opt.id] === 3) ? true : indeterminateEmail;
        indeterminatePush = !(notifications[opt.id] === 2 || notifications[opt.id] === 3) ? true : indeterminatePush;
        return opt;
      });
    }

    const checkboxes = (<div className={styles.iconsWrapper}>
      <div className={styles.checkboxContainer}>
        {!hideEmailCheckbox && <Checkbox
          name={id}
          value={1}
          indeterminateValue={indeterminateEmail}
          checked={!uncheckEmail}
          disabled={disabled}
          onChange={this.handleCheckboxChange}
          className={styles.checkbox + ' ' + styles.emailCheckbox}
        />}
        {!hidePushCheckbox && <Checkbox
          name={id}
          value={2}
          indeterminateValue={indeterminatePush}
          checked={!uncheckPush}
          disabled={disabled}
          onChange={this.handleCheckboxChange}
          className={styles.checkbox}
        />}
      </div>
    </div>);

    if (showDetails) {
      return (<Accordion title={name} position="left" defaultOpen>
        {checkboxes}
      </Accordion>);
    }

    return (
      <div key={id} className={itemClasses}>
        {!showInitialCheckbox && <div className={styles.itemLabel}>{name}</div>}
        {showInitialCheckbox &&
          <Checkbox
            label={name}
            name={'update_' + id}
            value={1}
            onChange={this.handleCheckboxChange}
            className={styles.itemLabelCheckbox}
          />
        }
        {checkboxes}
      </div>
    );
  }
}
