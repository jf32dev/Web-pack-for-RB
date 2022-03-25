
import PropTypes from 'prop-types';
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
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { Fragment, PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Select from 'react-select';
import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Btn from 'components/Btn/Btn';

function validateEmail(email) {
  const re = /[^@]+@[^@]+\.[^@]+/;
  return re.test(email);
}
const TLSCertificate = 'tls-certificate';

/**
 * SMTP Component for edit smtp information
 */
export default class SMTPEdit extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Custom SMTP Server true or false */
    is_custom: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),

    /** host input string */
    host: PropTypes.string,

    /** port input string */
    port: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Certificate name input string */
    certificate_name: PropTypes.string,

    /** username input string */
    username: PropTypes.string,

    /** password input string or bool*/
    password: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),

    /** testAddress input string */
    testAddress: PropTypes.string,

    /** encryption selector input string */
    encryption: PropTypes.string,

    /** onChange method, trigger every time some input changes */
    onChange: PropTypes.func,

    /** call back method when user input the correct email format in testAddress and click the test settings button */
    onTestSettingClick: PropTypes.func,

    /** change the test email btn to loading mode when true */
    isTesting: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object,

    saveDisabled: PropTypes.bool,
    saveLoading: PropTypes.bool,

    onSave: PropTypes.func,
  };

  static defaultProps = {
    strings: {
      customSMTPServer: 'Custom SMTP Server',
      customSMTPServerMessage: 'Using a custom SMTP server is optional.',
      host: 'Host',
      port: 'Port',
      username: 'Username',
      password: 'Password',
      encryption: 'Encryption',
      testSMTPSettings: 'Test SMTP Settings',
      testAddress: 'Test address',
      testSettings: 'Test Settings',
      fromAddress: 'From Address',
      ssl: 'SSL',
      tls: 'TLS',
      emailErrorMessage: 'The Email Address is in an invalid format.',
      sendFrom: 'Send From',
      customFromAddress: 'Custom From Address',
      userEmail: 'User Email',
      sender: 'Sender',
      mailServer: 'Mail Server',
      authentication: 'Authentication'
    },
    isTesting: false,
    is_custom: '0',
    host: '',
    port: '',
    username: '',
    password: '',
    encryption: 'ssl',
    testAddress: '',
    certificate_name: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmailFormatError: false
    };
    this.smtpInputList = ['host', 'port', 'username', 'password', 'certificate_name'];
    this.encryptionList = ['ssl', 'tls', TLSCertificate];

    autobind(this);

    this.handleDebounceChange = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );
  }

  handleChange(event) {
    const { value, name } = event.currentTarget;

    let update = {};

    if (name === 'is_custom') {
      update = {
        [name]: !this.props[name],
      };
    } else if (name === 'testAddress' && this.state.isEmailFormatError) {
      this.setState({
        isEmailFormatError: false,
      });
    } else {
      update = {
        [name]: value,
      };
    }

    this.updateValues(update);
  }

  handleEncryption({ value }) {
    const update = {
      encryption: value,
    };
    this.updateValues(update);
  }

  handleSendFrom({ value }) {
    const update = {
      send_from: value,
    };
    this.updateValues(update);
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  handleTestAddressClick(event) {
    if (validateEmail(this.props.testAddress)) {
      this.props.onTestSettingClick(event);
    } else {
      this.setState({
        isEmailFormatError: true,
      });
    }
  }

  //FIXME work around for chrome auto fill
  handleRemoveReadOnly(e) {
    e.currentTarget.removeAttribute('readonly');
  }

  render() {
    const { strings, is_custom, encryption, isTesting, onSave, saveDisabled, saveLoading } = this.props;
    const { isEmailFormatError } = this.state;

    const styles = require('./AdminSMTPEdit.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SMTP: true
    }, this.props.className);

    const emailInputClasses = cx({
      emailInputError: isEmailFormatError,
    });

    const sendFromList = [{
      value: 'custom_from_address',
      label: strings.customFromAddress
    }, {
      value: 'user_email',
      label: strings.userEmail
    }];

    return (
      <div className={classes} style={this.props.style}>
        <header>
          <div className={styles.checkboxContainer}>
            <Checkbox
              label={strings.customSMTPServer}
              name="is_custom"
              checked={!!is_custom}
              data-type="is_custom"
              onChange={this.handleChange}
            />
            <div className={styles.normalLabel}>{strings.customSMTPServerMessage}</div>
          </div>
          <Btn
            borderless inverted disabled={saveDisabled}
            loading={saveLoading} onClick={onSave}
          >
            {strings.save}
          </Btn>
        </header>
        {is_custom && <div className={styles.inputContainer}>
          <h3>{strings.sender}</h3>
          <div>
            <label htmlFor="send_from">{strings.sendFrom}</label>
            <Select
              id="send_from"
              value={this.props.send_from}
              options={sendFromList}
              clearable={false}
              onChange={this.handleSendFrom}
            />
          </div>
          <Text
            id="from_address"
            label={strings.fromAddress}
            defaultValue={this.props.from_address}
            data-type="from_address"
            autoComplete="off"
            type="text"
            onChange={this.handleDebounceChange}
            name="from_address"
            readOnly
            onFocus={this.handleRemoveReadOnly}
          />

          <h3>{strings.mailServer}</h3>
          <Text
            id="host"
            key="host"
            name="host"
            label={strings.host}
            defaultValue={this.props.host}
            data-type="host"
            autoComplete="off"
            type="text"
            onChange={this.handleDebounceChange}
            readOnly
            placeholder=""
            onFocus={this.handleRemoveReadOnly}
          />
          <Text
            id="port"
            key="port"
            name="port"
            label={strings.port}
            defaultValue={this.props.port}
            data-type="port"
            autoComplete="off"
            type="number"
            onChange={this.handleDebounceChange}
            readOnly
            placeholder=""
            onFocus={this.handleRemoveReadOnly}
          />

          <h3>{strings.authentication}</h3>
          <div>
            <label htmlFor="encryption">{strings.encryption}</label>
            <Select
              id="encryption"
              name="encryption"
              value={encryption || 'ssl'}
              options={this.encryptionList.map(k => ({ value: k, label: strings[k] }))}
              clearable={false}
              onChange={this.handleEncryption}
            />
          </div>
          <div className={styles.encryptionInputs}>
            {encryption !== TLSCertificate && <Fragment>
              <Text
                id="username"
                key="username"
                name="username"
                label={strings.username}
                defaultValue={this.props.username}
                data-type="username"
                autoComplete="off"
                type="text"
                onChange={this.handleDebounceChange}
                readOnly
                placeholder=""
                onFocus={this.handleRemoveReadOnly}
              />
              <Text
                id="password"
                key="password"
                name="password"
                label={strings.password}
                defaultValue=""
                data-type="password"
                autoComplete="off"
                type="password"
                onChange={this.handleDebounceChange}
                readOnly
                placeholder={this.props.password ? strings.passwordIsSet : ''}
                onFocus={this.handleRemoveReadOnly}
              />
            </Fragment>}
            {encryption === TLSCertificate && <Text
              id="certificate_name"
              key="certificate_name"
              name="certificate_name"
              label={strings.subjectName}
              defaultValue={this.props.certificate_name}
              data-type="certificate_name"
              autoComplete="off"
              type="text"
              onChange={this.handleDebounceChange}
              readOnly
              onFocus={this.handleRemoveReadOnly}
            />}
          </div>
        </div>}
        {is_custom && <div className={styles.testContainer}>
          <h3>{strings.testSMTPSettings}</h3>
          <Text
            className={emailInputClasses}
            id="testAddress"
            label={strings.testAddress}
            data-type="testAddress"
            name="testAddress"
            onChange={this.handleDebounceChange}
          />
          {isEmailFormatError && <div className={styles.error}>{strings.emailErrorMessage}</div>}
          <Btn
            inverted className={styles.testAddressBtn} onClick={this.handleTestAddressClick}
            disabled={isTesting || !saveDisabled || saveLoading}
          >
            {isTesting && <span className={styles.loading} />}
            {isTesting ? strings.sendingEmail : strings.testSettings}
          </Btn>
        </div>}
      </div>
    );
  }
}
