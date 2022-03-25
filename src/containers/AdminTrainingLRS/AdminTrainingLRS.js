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
  getData,
  setData,
  updateData,
} from 'redux/modules/admin/education';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import Text from 'components/Text/Text';
import Select from 'components/Select/Select';

const messages = defineMessages({
  learningRecordStore: { id: 'learning-record-store', defaultMessage: 'Learning Record Store' },
  endPointUrl: { id: 'end-point-url', defaultMessage: 'End point URL' },
  authenticationType: { id: 'authentication-type', defaultMessage: 'Authentication type' },
  apiKey: { id: 'api-key', defaultMessage: 'API key' },
  basic: { id: 'basic', defaultMessage: 'Basic' },
  username: { id: 'username', defaultMessage: 'Username' },
  password: { id: 'password', defaultMessage: 'Password' },
});

@connect(
  state => ({
    ...state.admin.education,
  }),
  bindActionCreatorsSafe({
    getData,
    updateData,
    setData,

    createPrompt
  })
)
export default class AdminTrainingLRS extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    endpoint: '',
    authType: 'basic',
    user: '',
    password: '',
    passwordIsSet: false,
    apiKey: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    const {
      loaded,
      loading
    } = this.props;

    if (!loaded && !loading) {
      this.props.getData('lrs');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      error
    } = nextProps;

    // Handle save errors
    if (error && error.message && (!this.props.error || error.message !== this.props.error.message)) {
      this.props.createPrompt({
        id: 'lrs-error',
        type: 'error',
        title: 'Error',
        message: error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChangeText(context) {
    const data = {};
    data[context.target.id] = context.target.value;
    // Refresh UI
    this.props.setData({ ...data, modified: true });
  }

  handleOnBlur(event) {
    const data = {};
    data[event.target.id] = event.target.value;

    // Save to DB
    if (this.props.modified) {
      this.props.updateData(data, 'lrs');
    }
  }

  handleSelectChange(context) {
    // Save to DB
    this.props.updateData({
      authType: context.value
    }, 'lrs');
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      endpoint,
      authType,
      user,
      password,
      apiKey,
      style,
      className,
    } = this.props;
    const strings = generateStrings(messages, formatMessage);
    const styles = require('./AdminTrainingLRS.less');

    const authTypeOptions = [
      { value: 'basic', label: strings.basic },
      { value: 'api_key', label: strings.apiKey },
    ];

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <div className={styles.Container}>
          <h3 style={{ marginTop: 0 }}>{strings.learningRecordStore}</h3>
          <div className={styles.wrapper}>
            <h4 style={{ marginTop: 0 }}>{strings.endPointUrl}</h4>
            <Text
              id="endpoint"
              name="endpoint"
              value={endpoint}
              onChange={this.handleChangeText}
              onBlur={this.handleOnBlur}
            />
          </div>

          <div className={styles.typeWrap}>
            <h4>{strings.authenticationType}</h4>
            <Select
              name="authType"
              value={authType}
              options={authTypeOptions}
              searchable={false}
              clearable={false}
              onChange={this.handleSelectChange}
            />
          </div>

          {authType === 'api_key' && <div>
            <h4>{strings.apiKey}</h4>
            <Text
              id="apiKey"
              name="apiKey"
              value={apiKey}
              onChange={this.handleChangeText}
              onBlur={this.handleOnBlur}
            />
          </div>}

          {authType === 'basic' && <div>
            <h4>{strings.username}</h4>
            <Text
              id="user"
              name="user"
              value={user}
              onChange={this.handleChangeText}
              onBlur={this.handleOnBlur}
            />
            <h4>{strings.password}</h4>
            <Text
              id="password"
              name="password"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={this.handleChangeText}
              onBlur={this.handleOnBlur}
            />
          </div>}
        </div>}
      </div>
    );
  }
}
