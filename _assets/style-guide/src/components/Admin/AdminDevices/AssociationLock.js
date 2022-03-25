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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Select from 'react-select';

import AssociationList from './Utils/AssociationList';

/**
 * Association Lock
 */
export default class AssociationLock extends PureComponent {
  static propTypes = {
    /** Description of customProp2 */
    list: PropTypes.array,

    onClick: PropTypes.func,

    onSort: PropTypes.func,

    deviceLimitValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onUpdate: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleSelect(result) {
    const update = {
      deviceAssociationLock: result.value,
    };

    this.updateValues(update);
  }

  updateValues(update) {
    const { onUpdate } = this.props;

    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate(update);
    }
  }

  render() {
    const styles = require('./AssociationLock.less');
    const { list, onClick, strings, deviceLimitValue, onSort, loadingMore } = this.props;
    const cx = classNames.bind(styles);
    const classes = cx({
      AssociationLock: true
    }, this.props.className);

    const deviceLimits = [{
      value: 0,
      label: strings.no,
    }, {
      value: 1,
      label: strings.oneDevice,
    }, {
      value: 2,
      label: strings.twoDevices,
    }, {
      value: 3,
      label: strings.threeDevices,
    }, {
      value: 4,
      label: strings.fourDevices,
    }, {
      value: 5,
      label: strings.fiveDevices,
    }, {
      value: 6,
      label: strings.sixDevices,
    }, {
      value: 7,
      label: strings.sevenDevices,
    }, {
      value: 8,
      label: strings.eightDevices,
    }, {
      value: 9,
      label: strings.nightDevices,
    }];

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.limitSelect}>
          <label htmlFor="deviceAssociationLock">{strings.enableDeviceLimit}</label>
          <Select
            id="deviceAssociationLock"
            name="deviceAssociationLock"
            value={deviceLimitValue || 0}
            options={deviceLimits}
            clearable={false}
            className={styles.select}
            onChange={this.handleSelect}
          />
          <div className={styles.info}>{strings.associationLockGeneralInfo}</div>
        </div>
        <AssociationList
          list={list}
          onClick={onClick}
          strings={strings}
          onSort={onSort}
          loadingMore={loadingMore}
        />
      </div>
    );
  }
}
