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

import CheckboxInput from 'components/Admin/AdminUtils/CheckboxInput/CheckboxInput';
import Select from 'react-select';

/**
 * Admin security password rules
 */
export default class AdminPasswordRulesView extends PureComponent {
  static propTypes = {
    /** input value passwordExpiry */
    passwordExpiry: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    passwordRemember: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    characters: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    alphabetic: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    capital: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    numbers: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    specials: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    lockTimeout: PropTypes.number,

    defaultRules: PropTypes.array,

    additionalRules: PropTypes.array,

    /** use in admin security devices, please don't use it */
    pin: PropTypes.bool,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: [],
    strings: {
      forceUpdateMsg: 'Force users to change passwords after this many days',
      cloudOnlyMsg: 'This setting only applies to Cloud authentication and does not affect Enterprise or Corporate login.',
      rememberPasswordDays: 'Remember used passwords for this many days.',
      insertNumberMinimumMaximum: 'Insert number minimum = 1 and maximum = 180',
      additionalRules: 'Additional Rules',
      minimumCharacters: 'Have at least this many total characters',
      minimumSix: 'Minimum complexity requirement: 6 characters',
      minimumAlphabetic: 'Have at least this many Alphabetic Letters (a-z, A-Z)',
      minimum1: 'Minimum: 1',
      minimumCapital: 'Have at least this many Capital Letters (A-Z)',
      minimumNumbers: 'Have at least this many Numbers (0-9)',
      minimumSpecial: 'Have at least this many Special Characters (!@#..etc)',
      other: 'Other',
      accountLockTimeout: 'Account lock timeout',
      never: 'Never',
      tenMinutes: '10 minutes',
      twentyMinutes: '20 minutes',
      thirtyMinutes: '30 minutes',
      fortyMinutes: '40 minutes',
      fiftyMinutes: '50 minutes',
      sixtyMinutes: '60 minutes',
    },
    defaultRules: [{
      id: 'passwordExpiry',
      title: 'forceUpdateMsg',
      desc: 'cloudOnlyMsg',
      min: 0,
      max: 0,
      checkbox: true,
    }, {
      id: 'passwordRemember',
      title: 'rememberPasswordDays',
      desc: 'insertNumberMinimumMaximum',
      min: 1,
      max: 180,
      checkbox: true,
    }],
    additionalRules: [{
      id: 'characters',
      title: 'minimumCharacters',
      desc: 'minimumSix',
      min: 6,
      max: 0,
      checkbox: false,
    }, {
      id: 'alphabetic',
      title: 'minimumAlphabetic',
      min: 1,
      max: 0,
      checkbox: true,
    }, {
      id: 'capital',
      title: 'minimumCapital',
      min: 1,
      max: 0,
      checkbox: true,
    }, {
      id: 'numbers',
      title: 'minimumNumbers',
      min: 1,
      max: 0,
      checkbox: true,
    }, {
      id: 'specials',
      title: 'minimumSpecial',
      min: 1,
      max: 0,
      checkbox: true,
    }],
    lock_timeout: 0,
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleSelect({ value }) {
    const { onChange } = this.props;
    if (onChange && typeof onChange === 'function') {
      onChange({ lockTimeout: value });
    }
  }

  render() {
    const styles = require('./AdminPasswordRules.less');
    const { defaultRules, additionalRules, className, strings, onChange, lockTimeout, pin } = this.props;
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminPasswordRules: true
    }, className);

    const list = [{
      value: 0,
      label: strings.never
    }, {
      value: 10,
      label: strings.tenMinutes
    }, {
      value: 20,
      label: strings.twentyMinutes,
    }, {
      value: 30,
      label: strings.thirtyMinutes,
    }, {
      value: 40,
      label: strings.fortyMinutes,
    }, {
      value: 50,
      label: strings.fiftyMinutes,
    }, {
      value: 60,
      label: strings.sixtyMinutes,
    }];

    return (
      <div className={classes} style={this.props.style}>
        {!pin && defaultRules.map(rule => (<CheckboxInput
          key={rule.id}
          {...rule}
          value={this.props[rule.id]}
          title={strings[rule.title]}
          desc={strings[rule.desc]}
          onChange={onChange}
        />))}
        {!pin && <div className={styles.additionalRules}>{strings.additionalRules}</div>}
        {additionalRules.map(rule => (<CheckboxInput
          key={rule.id}
          {...rule}
          value={this.props[rule.id]}
          title={strings[rule.title]}
          desc={strings[rule.desc]}
          onChange={onChange}
        />))}
        {!pin && <div className={styles.other}>
          <div className={styles.otherText}>{strings.other}</div>
          <div className={styles.accountLockTimeout}>{strings.accountLockTimeout}</div>
          <Select
            id="lockTimeout"
            name="lockTimeout"
            value={lockTimeout}
            options={list}
            className={styles.lock_timeput}
            clearable={false}
            onChange={this.handleSelect}
          />
        </div>}
      </div>
    );
  }
}
