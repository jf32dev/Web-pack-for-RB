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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getEmails,
  updateEmails,
  testSMTP,
} from 'redux/modules/admin/emails';
import { createPrompt } from 'redux/modules/prompts';

import AdminSMTPEdit from 'components/Admin/AdminSMTPEdit/AdminSMTPEdit';
import Loader from 'components/Loader/Loader';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';

const SMTP = 'smtp';

const messages = defineMessages({
  customSMTPServer: {
    id: 'custom-SMTP-server',
    defaultMessage: 'Custom SMTP Server'
  },
  customSMTPServerMessage: {
    id: 'custom-SMTP-server-message',
    defaultMessage: 'Using a custom SMTP server is optional.',
  },
  host: {
    id: 'host',
    defaultMessage: 'Host'
  },
  port: {
    id: 'port',
    defaultMessage: 'Port'
  },
  username: {
    id: 'username',
    defaultMessage: 'Username'
  },
  password: {
    id: 'password',
    defaultMessage: 'Password'
  },
  encryption: {
    id: 'encryption',
    defaultMessage: 'Encryption'
  },
  testSMTPSettings: {
    id: 'test-SMTP-settings',
    defaultMessage: 'Test SMTP Settings',
  },
  testAddress: {
    id: 'test-address',
    defaultMessage: 'Test address'
  },
  testSettings: {
    id: 'test-settings',
    defaultMessage: 'Test Settings'
  },
  ssl: {
    id: 'ssl',
    defaultMessage: 'SSL'
  },
  tls: {
    id: 'tls',
    defaultMessage: 'TLS'
  },
  emailErrorMessage: {
    id: 'email-error-message',
    defaultMessage: 'The Email Address is in an invalid format.'
  },
  testSMTPSendMsg: {
    id: 'test-SMTP-send-msg',
    defaultMessage: 'The test email is sent to the address you added in the Test Addresses field, please check.'
  },
  passwordIsSet: {
    id: 'password-is-set',
    defaultMessage: 'Password is set'
  },
  sendingEmail: {
    id: 'sending-email',
    defaultMessage: 'Sending Email'
  },
  fromAddress: {
    id: 'ffrom-address',
    defaultMessage: 'From Address'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  sendFrom: {
    id: 'send-from',
    defaultMessage: 'Send From'
  },
  customFromAddress: {
    id: 'custom-from-address',
    defaultMessage: 'Custom From Address'
  },
  userEmail: {
    id: 'user-email',
    defaultMessage: 'User Email'
  },
  passwordError: {
    id: 'password-error',
    defaultMessage: 'Password cannot be empty'
  },
  portError: {
    id: 'port-error',
    defaultMessage: 'Port cannot be empty'
  },
  hostError: {
    id: 'host-error',
    defaultMessage: 'Host cannot be empty'
  },
  certificateNameError: {
    id: 'certificate-name-error',
    defaultMessage: 'Certificate Name cannot be empty'
  },
  sender: {
    id: 'sender',
    defaultMessage: 'Sender'
  },
  mailServer: {
    id: 'mail-server',
    defaultMessage: 'Mail Server'
  },
  authentication: {
    id: 'authentication',
    defaultMessage: 'Authentication'
  },
  'tls-certificate': {
    id: 'tls-certificate',
    defaultMessage: 'TLS Certificate'
  },
  subjectName: {
    id: 'subject-name',
    defaultMessage: 'Subject Name'
  },
});

@connect(state => state.admin.emails,
  bindActionCreatorsSafe({
    getEmails,
    updateEmails,
    testSMTP,
    createPrompt
  })
)

export default class AdminSMTPSetup extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      testAddress: '',
      isDifferent: false,
      updatedData: {}
    };
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getEmails) {
      this.props.getEmails(SMTP);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.state.isDifferent) {
      this.setState({
        updatedData: {
          is_custom: nextProps.is_custom === '1',
          host: nextProps.host,
          port: nextProps.port,
          username: nextProps.username,
          password: nextProps.password,
          encryption: nextProps.encryption,
          from_address: nextProps.from_address,
          send_from: nextProps.send_from,
          certificate_name: nextProps.certificate_name
        },
        saveLoading: false
      });
    } else if (nextProps.updated) {
      this.setState({
        isDifferent: false,
        saveLoading: false
      });
    }

    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'SMTP-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
      this.setState({
        saveLoading: false
      });
    }

    /*test email success*/
    if (!_get(this.props, 'toAddress', false) && _get(nextProps, 'toAddress', false)) {
      const date = new Date();
      const testAddressMsg = (<FormattedMessage
        id="test-SMTP-send-msg"
        defaultMessage="The test email is sent to the address you added in the Test Addresses field, please check."
      />);
      this.props.createPrompt({
        id: `test-SMTP-${date.toISOString()}`,
        type: 'info',
        message: testAddressMsg,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleTestSettingClick(event) {
    event.preventDefault();
    this.props.testSMTP(this.state.testAddress);
  }

  isSaveEnabled() {
    let isDifferent = false;

    Object.keys(this.state.updatedData).forEach(key => {
      if (!isDifferent) {
        if (key === 'port') {
          isDifferent = JSON.stringify(parseInt(this.state.updatedData.port, 0)) !== JSON.stringify(this.props[key]);
        } else if (key === 'is_custom') {
          isDifferent = JSON.stringify(this.state.updatedData.is_custom) !== JSON.stringify(this.props.is_custom === '1');
        } else {
          isDifferent = JSON.stringify(this.state.updatedData[key]) !== JSON.stringify(this.props[key]);
        }
      }
    });
    this.setState({
      isDifferent
    });
  }

  handleChange(update) {
    if (Object.prototype.hasOwnProperty.call(update, 'testAddress')) {
      this.setState(update);
    } else {
      this.setState({
        updatedData: {
          ...this.state.updatedData,
          ...update
        }
      }, () => this.isSaveEnabled());
    }
  }

  handleSave() {
    const { updatedData } = this.state;
    const TLSCertificate = 'tls-certificate';

    if (updatedData.is_custom && !_isEmpty(updatedData)) {
      const { formatMessage } = this.context.intl;
      const strings = generateStrings(messages, formatMessage);
      let errorMsg = '';

      switch (true) {
        case (updatedData.username !== '' && (updatedData.password === false || updatedData.password === '')):
          errorMsg = strings.passwordError;
          break;
        case (updatedData.port === '' || updatedData.host === ''):
          errorMsg = updatedData.port === '' ? strings.portError : strings.hostError;
          break;
        case (updatedData.encryption === TLSCertificate && !updatedData.certificate_name):
          errorMsg = strings.certificateNameError;
          break;
        default:
          break;
      }

      if (errorMsg) {
        this.props.createPrompt({
          id: 'SMTP-error',
          type: 'error',
          title: 'Error',
          message: errorMsg,
          dismissible: true,
          autoDismiss: 5
        });
      } else {
        updatedData.is_custom = '1';
        updatedData.password = updatedData.password === false ? '' : updatedData.password;
        this.props.updateEmails(updatedData);
        this.setState({
          saveLoading: true,
          isDifferent: false
        });
      }
    } else {
      const location = window.location.hostname;
      let from_address = 'noreply@hub.bigtincan.com';

      if (location.includes('org')) {
        from_address = `noreply@hub.bigtincan.${'org'}`;
      } else if (location.includes('info')) {
        from_address = `noreply@hub.bigtincan.${'info'}`;
      }

      const defaultSMTPValues = {
        host: '',
        port: 25,
        username: '',
        password: '',
        encryption: 'ssl',
        from_address,
        send_from: 'custom_from_address',
        is_custom: '0',
        certificate_name: ''
      };
      this.props.updateEmails(defaultSMTPValues);
      this.setState({
        saveLoading: true,
        isDifferent: false
      });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { updatedData, isDifferent, saveLoading } = this.state;
    const {
      loading,
      testing,
      className,
      style,
      executeDisabled,
    } = this.props;

    const propsValue = !_isEmpty(updatedData) ? updatedData : this.props;
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminSMTPEdit
          {...propsValue}
          strings={strings}
          onTestSettingClick={this.handleTestSettingClick}
          onChange={this.handleChange}
          isTesting={testing}
          testAddress={this.state.testAddress}
          executeDisabled={executeDisabled}
          saveDisabled={!isDifferent}
          saveLoading={saveLoading}
          onSave={this.handleSave}
        />}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={isDifferent} />}
      </div>
    );
  }
}
