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

import Select from 'react-select';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';

/**
 * OAuth interface
 */
export default class OAuth extends PureComponent {
  static propTypes = {
    /** access Token Lifetime selected value*/
    accessTokenLifetime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /** refresh Token Lifetime input value*/
    refreshTokenLifetime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onSelectUpdate: PropTypes.func,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: []
  };

  constructor(props) {
    super(props);

    this.handleDebounceChange = _compose(
      _debounce(props.onChange.bind(this), 300),
      _clone
    );

    autobind(this);
  }

  handleSelectChange(update) {
    if (this.props.onSelectUpdate) {
      this.props.onSelectUpdate({
        accessTokenLifetime: update.value,
      });
    }
  }

  render() {
    const {
      accessTokenLifetime,
      refreshTokenLifetime,
      strings,
    } = this.props;
    const styles = require('./OAuth.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      OAuth: true
    }, this.props.className);

    const options = [
      { value: 1, label: strings.oneHour },
      { value: 2, label: strings.twoHours },
      { value: 3, label: strings.threeHours },
      { value: 4, label: strings.fourHours },
      { value: 5, label: strings.fiveHours },
      { value: 6, label: strings.sixHours },
      { value: 7, label: strings.sevenHours },
      { value: 8, label: strings.eightHours },
    ];

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.accessTokenExpiry}>
          <label>{strings.accessTokenExpiry}</label>
          <Select
            className={styles.oAuthSelect}
            name="fixed"
            value={accessTokenLifetime}
            options={options}
            searchable={false}
            clearable={false}
            placeholder="Choose one value!"
            onChange={this.handleSelectChange}
          />
        </div>
        <div className={styles.refreshTokenLifetime}>
          <label>{strings.refreshToken}</label>
          <Text
            defaultValue={refreshTokenLifetime}
            type="number"
            name="refreshTokenLifetime"
            min={0}
            onChange={this.handleDebounceChange}
          />
          <label>{strings.days}</label>
        </div>
      </div>
    );
  }
}
