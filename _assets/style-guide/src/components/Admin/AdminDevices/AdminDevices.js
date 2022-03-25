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

import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import AdminPasswordRules from 'components/Admin/AdminPasswordRules/AdminPasswordRules';
import Loader from 'components/Loader/Loader';
import Btn from 'components/Btn/Btn';

import AssociationLock from './AssociationLock';
import BrowserRestrictions from './BrowserRestrictions';

/**
 * Component for security device, want to know how to use it please check the container's adminDevice
 */
export default class AdminDevices extends PureComponent {
  static propTypes = {
    deviceAssociationUsers: PropTypes.array,

    deviceBrowserRestrictions: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),

    deviceAssociationLock: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    onUpdate: PropTypes.func,

    onActiveModal: PropTypes.func,

    onHeaderSelect: PropTypes.func,

    deviceAssociationLockScroll: PropTypes.func,

    deviceAssociationLockLoadingMore: PropTypes.bool,

    onAssociationLockListSort: PropTypes.func,

    whitelist: PropTypes.array,

    blacklist: PropTypes.array,

    selectedMenuItem: PropTypes.oneOf(['associationLock', 'browserRestrictions', 'pinComplexity']),

    onExecute: PropTypes.func,

    executeDisabled: PropTypes.bool,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      associationLock: 'Association lock',
      browserRestrictions: 'Browser restrictions',
      pinComplexity: 'Pin complexity',
      enableDeviceBrowserRestrictions: 'Enable device browser restrictions',
      browserRestrictionGeneralInfo: 'Assign restriction lists to multiple groups. Note: Allowlists take precedence over Denylists.',
      allowlist: 'allowlist',
      denylist: 'denylist',
      edit: 'Edit',
      delete: 'Delete',
      createBrowserRestriction: 'Create Browser Restriction',
      restrictionName: 'Restriction Name',
      restrictionType: 'Restriction Type',
      matches: 'Matches',
      add: 'Add',
      domain: 'Domain',
      scheme: 'Scheme',
      url: 'URL',
      groupList: 'Group List',
      addGroups: 'Add Groups',
      cancel: 'Cancel',
      save: 'Save',
      minimumCharacters: 'Have at least this many total characters',
      minimumSix: 'Minimum complexity requirement: 6 characters',
      minimumAlphabetic: 'Have at least this many Alphabetic Letters (a-z, A-Z)',
      minimum1: 'Minimum: 1',
      minimumCapital: 'Have at least this many Capital Letters (A-Z)',
      minimumNumbers: 'Have at least this many Numbers (0-9)',
      minimumSpecial: 'Have at least this many Special Characters (!@#..etc)',
      no: 'No',
      oneDevice: '1 device',
      twoDevices: '2 devices',
      threeDevices: '3 devices',
      fourDevices: '4 devices',
      fiveDevices: '5 devices',
      sixDevices: '6 devices',
      sevenDevices: '7 devices',
      eightDevices: '8 devices',
      nightDevices: '9 devices',
      enableDeviceLimit: 'Enable device limit',
      associationLockGeneralInfo: 'When device association lock is enabled, users will be locked to the first N devices they log in with.',
      warning: 'Warning',
      add2allowlist: 'Add to Allowlist',
      add2denylist: 'Add to Denylist',
      device: 'Device',
      devices: 'Devices',
    },
    selectedMenuItem: 'associationLock'
  }

  constructor(props) {
    super(props);
    // this.state = {
    //   selectedMenuItem: 'associationLock'
    // };
    this.menu = ['associationLock', 'browserRestrictions', 'pinComplexity'];
    autobind(this);
  }

  handleClick(e) {
    const { dataset } = e.currentTarget;
    const name = _get(dataset, 'name', false);

    if (name && this.menu.indexOf(name) > -1 && name !== this.props.selectedMenuItem) {
      // this.setState({
      //   selectedMenuItem: name,
      // });
      const { onHeaderSelect } = this.props;

      if (onHeaderSelect && typeof onHeaderSelect === 'function') {
        onHeaderSelect(name);
      }
    }
  }

  render() {
    const {
      strings,
      deviceAssociationUsers,
      deviceBrowserRestrictions,
      deviceAssociationLock,
      onUpdate,
      onActiveModal,
      whitelist,
      blacklist,
      isLoading,
      onAssociationLockListSort,
      selectedMenuItem,
      deviceAssociationLockLoadingMore,
      onExecute,
      executeDisabled,
      ...others
    } = this.props;
    const styles = require('./AdminDevices.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminDevices: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.header}>
          <div className={styles.menuHeader}>
            {this.menu.map(item => (
              <div
                data-name={item}
                key={item}
                className={item === selectedMenuItem ? styles.menuItemActive : styles.menuItemInactive}
                onClick={this.handleClick}
              >
                {strings[item]}
              </div>
            ))}
          </div>
          <Btn
            borderless inverted disabled={executeDisabled}
            onClick={onExecute}
          >
            {strings.save}
          </Btn>
        </div>
        {isLoading && <Loader type="content" />}
        {!isLoading && <TransitionGroup>
          {selectedMenuItem === 'associationLock' && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <AssociationLock
              list={deviceAssociationUsers}
              onUpdate={onUpdate}
              onClick={onActiveModal}
              onSort={onAssociationLockListSort}
              strings={strings}
              deviceLimitValue={deviceAssociationLock}
              loadingMore={deviceAssociationLockLoadingMore}
            />
          </CSSTransition>}
          {selectedMenuItem === 'browserRestrictions' && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <BrowserRestrictions
              strings={strings}
              onUpdate={onUpdate}
              whitelist={whitelist}
              blacklist={blacklist}
              deviceBrowserRestrictions={Number.isInteger(deviceBrowserRestrictions) ? deviceBrowserRestrictions === 1 : deviceBrowserRestrictions}
              onClick={onActiveModal}
            />
            </CSSTransition>}
          {selectedMenuItem === 'pinComplexity' && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <AdminPasswordRules pin onChange={onUpdate} {...others} />
          </CSSTransition>}
        </TransitionGroup>}
      </div>
    );
  }
}
