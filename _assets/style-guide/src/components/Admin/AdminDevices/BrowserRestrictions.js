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

import Checkbox from 'components/Checkbox/Checkbox';

import RestrictionsList from './Utils/RestrictionsList';

/**
 * BrowserRestrictions description
 */
export default class BrowserRestrictions extends PureComponent {
  static propTypes = {
    /** Checkbox value for device Browser Restrictions  */
    deviceBrowserRestrictions: PropTypes.bool,

    onClick: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    deviceBrowserRestrictions: false
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleUpdate(e) {
    const { type, name } = e.currentTarget;
    let update = {};
    if (type === 'checkbox') {
      update = {
        [name]: !this.props[name]
      };
    }
    this.updateValues(update);
  }

  updateValues(update) {
    const { onUpdate } = this.props;

    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate(update);
    }
  }

  render() {
    const styles = require('./BrowserRestrictions.less');
    const { className, strings, deviceBrowserRestrictions, onClick } = this.props;
    const cx = classNames.bind(styles);
    const classes = cx({
      BrowserRestrictions: true
    }, className);

    const listGroups = [
      { strKey: 'allowlist', resKey: 'whitelist' },
      { strKey: 'denylist', resKey: 'blacklist' }
    ];

    return (
      <div className={classes} style={this.props.style}>
        <Checkbox
          label={strings.enableDeviceBrowserRestrictions}
          name="deviceBrowserRestrictions"
          checked={deviceBrowserRestrictions}
          onChange={this.handleUpdate}
          className={styles.deviceBrowserRestrictions}
        />
        <p className={styles.info}>{strings.browserRestrictionGeneralInfo}</p>
        <div className={styles.list}>
          {listGroups.map(({ strKey, resKey }) => (
            <RestrictionsList
              key={strKey}
              onClick={onClick}
              list={this.props[resKey]}
              title={strings[strKey]}
              type={resKey}
              strings={strings}
              addBtnLabel={strings[`add2${strKey}`]}
            />
          ))}
        </div>
      </div>
    );
  }
}
