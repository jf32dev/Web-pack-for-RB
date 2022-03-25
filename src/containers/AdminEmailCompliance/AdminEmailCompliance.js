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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

//redux
import {
  getEmails,
  updateEmails,
  setData,
} from 'redux/modules/admin/emails';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import Text from 'components/Text/Text';

const messages = defineMessages({
  fromFriendlyName: { id: 'from-friendly-name', defaultMessage: 'From friendly name' },
  companyName: { id: 'company-name', defaultMessage: 'Company name' },
  address: { id: 'address', defaultMessage: 'Address' },
  senderInformation: { id: 'sender-information', defaultMessage: 'Sender information' },
  footer: { id: 'footer', defaultMessage: 'Footer' },
});

@connect(
  state => ({
    ...state.admin.emails,
    ...state.admin.emails.compliance,
  }),
  bindActionCreatorsSafe({
    getEmails,
    updateEmails,
    setData,
    createPrompt
  })
)
export default class AdminEmailCompliance extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    name: '',
    senderName: '',
    address: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const {
      complianceLoaded,
      complianceLoading
    } = this.props;

    if (!complianceLoaded && !complianceLoading) {
      this.props.getEmails('compliance');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      error
    } = nextProps;

    // Handle save errors
    if (error && error.message && (!this.props.error || error.message !== this.props.error.message)) {
      this.props.createPrompt({
        id: 'compliance-error',
        type: 'error',
        title: 'Error',
        message: error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChangeText(context) {
    // Parse attributes in compliance object
    const data = { compliance: { ...this.props.compliance } };
    data.compliance[context.target.id] = context.target.value;
    data.compliance.modified = true;
    this.props.setData(data);
  }

  handleOnBlur(event) {
    const data = {};
    data[event.target.id] = event.target.value;

    if (this.props.modified) {
      this.props.updateEmails(data, 'compliance');
      this.props.setData({ compliance: { ...this.props.compliance, modified: false } });
    }
  }

  render() {
    const {
      complianceLoading,
      address,
      name: companyName,
      senderName,
      className,
      style,
    } = this.props;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const styles = require('./AdminEmailCompliance.less');

    return (
      <div className={className} style={style}>
        {complianceLoading && <Loader type="page" />}
        {!complianceLoading && <div className={styles.Container}>
          <h3>{strings.senderInformation}</h3>
          <Text
            id="senderName"
            name="senderName"
            label={strings.fromFriendlyName}
            value={senderName}
            onChange={this.handleChangeText}
            onBlur={this.handleOnBlur}
          />

          <h3>{strings.footer}</h3>
          <Text
            id="name"
            name="name"
            label={strings.companyName}
            value={companyName}
            onChange={this.handleChangeText}
            onBlur={this.handleOnBlur}
          />

          <Text
            id="address"
            name="address"
            label={strings.address}
            value={address}
            onChange={this.handleChangeText}
            onBlur={this.handleOnBlur}
          />
        </div>}
      </div>
    );
  }
}
