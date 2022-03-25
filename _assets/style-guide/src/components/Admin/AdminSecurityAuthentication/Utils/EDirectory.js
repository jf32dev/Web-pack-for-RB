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

import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';

/**
 * EDirectory description
 */
export default class EDirectory extends PureComponent {
  static propTypes = {
    stings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: [],
    ldapServer: '',
    adAccountSuffix: '',
    adBaseDn: '',
    adUsernamePrefix: '',
    manageViaAdGroups: false,
    adAdminDn: '',
    adAdminPassword: '',
    adFilter: '',
    adPort: '',
    adSecure: false,
  };

  constructor(props) {
    super(props);
    this.fields = [
      'ldapServer-text',
      'edAccountSuffix-text',
      'edBaseDn-text',
      'edUsernamePrefix-text',
      'manageViaEdGroups-checkbox',
      'edAdminDn-text',
      'edAdminPassword-password',
      'edFilter-text',
      'edPort-text',
      'edSecure-checkbox',
    ].map(item => ({
      key: item.split('-')[0],
      type: item.split('-')[1]
    }));

    this.handleDebounceChange = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  render() {
    const {
      strings,
      onChange
    } = this.props;
    const styles = require('./EDirectory.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EDirectory: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        {this.fields.map(item => (
          item.type !== 'checkbox' ? <Text
            label={strings[item.key]}
            key={item.key}
            name={item.key}
            id={item.key}
            type={item.type}
            className={styles.EDirectoryText}
            data-name={item.key}
            onChange={this.handleDebounceChange}
            defaultValue={this.props[item.key]}
          /> : <Checkbox
            label={strings[item.key]}
            key={item.key}
            name={item.key}
            className={styles.EDirectoryCheckbox}
            data-name={item.key}
            onChange={onChange}
            checked={this.props[item.key]}
          />
        ))}
      </div>
    );
  }
}
