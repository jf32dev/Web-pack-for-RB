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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Text from 'components/Text/Text';

const messages = defineMessages({
  department: { id: 'department', defaultMessage: 'Department' },
  officeName: { id: 'officeName', defaultMessage: 'Office name' },
  costCode: { id: 'cost-code', defaultMessage: 'Cost code' },
  shareBCCEmail: { id: 'bcc-email-address', defaultMessage: 'BCC email address' },
  landlineNumber: { id: 'landline-number', defaultMessage: 'Landline Number' },
  mobileNumber: { id: 'mobile-number', defaultMessage: 'Mobile Number' },
});

export default class UserEditDetails extends PureComponent {
  static propTypes = {
    department: PropTypes.string,
    officeName: PropTypes.string,
    postCode: PropTypes.string,
    shareBCCEmail: PropTypes.string,
    landlineNumber: PropTypes.string,
    mobileNumber: PropTypes.string,

    onChange: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleOnChange(event) {
    const { onChange } = this.props;
    const attribute = event.currentTarget.name;
    const value = event.currentTarget.value;

    // Propagate event
    if (typeof onChange === 'function') {
      onChange(event, { attribute: attribute, value: value });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const styles = require('./UserEditDetails.less');

    // Strings
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.UserEditDetails}>
        <Text
          name="department"
          value={this.props.department}
          placeholder={strings.department}
          onChange={this.handleOnChange}
          width="22rem"
        />
        <Text
          name="officeName"
          value={this.props.officeName}
          placeholder={strings.officeName}
          onChange={this.handleOnChange}
          width="14rem"
          style={{ display: 'inline-block' }}
        />
        <Text
          name="costCode"
          value={this.props.costCode}
          placeholder={strings.costCode}
          onChange={this.handleOnChange}
          width="7rem"
          style={{ display: 'inline-block', marginLeft: '1rem' }}
        />
        <Text
          name="shareBCCEmail"
          value={this.props.shareBCCEmail}
          placeholder={strings.shareBCCEmail}
          onChange={this.handleOnChange}
          width="22rem"
        />
        <Text
          name="landlineNumber"
          value={this.props.landlineNumber}
          placeholder={strings.landlineNumber}
          onChange={this.handleOnChange}
          width="22rem"
        />
        <Text
          name="mobileNumber"
          value={this.props.mobileNumber}
          placeholder={strings.mobileNumber}
          onChange={this.handleOnChange}
          width="22rem"
        />
      </div>
    );
  }
}
