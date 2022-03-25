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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import _get from 'lodash/get';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
//redux
import {
  getSecurity,
  setCustomSecurityMultiKeys,
  APPLICATIONKEYS
} from 'redux/modules/admin/security';
import { createPrompt } from 'redux/modules/prompts';

import AdminFormField from 'components/Admin/AdminUtils/FormField/FormField';

const messages = defineMessages({
  applicationRestrictionsDesc: {
    id: 'application-restrictions-desc',
    defaultMessage: 'You can define keys here to limit access to the server to only allow applications that provide the correct key.'
  },
  applicationRestrictionsImportant: {
    id: 'application-restrictions-important',
    defaultMessage: '(Important: If adding a key for the first time please note that all logged in applications that don\'t provide the correct key will be logged out)',
  },
  applicationKeys: {
    id: 'application-keys',
    defaultMessage: 'Application Keys'
  },
  generateKey: {
    id: 'generate-key',
    defaultMessage: 'Generate Key'
  },
  comingSoon: { id: 'page-coming-soon-message', defaultMessage: 'We’re still building this page for you, please check back soon.' },
});

@connect(state => state.admin.security,
  bindActionCreatorsSafe({
    getSecurity,
    setCustomSecurityMultiKeys,
    createPrompt
  })
)
export default class AdminApplicationRestrictionsView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.fields = [{
      type: 'desc',
      labelKey: 'applicationRestrictionsDesc'
    }, {
      type: 'desc',
      labelKey: 'applicationRestrictionsImportant'
    }, {
      type: 'title',
      labelKey: 'applicationKeys'
    }, {
      type: 'create',
      labelKey: 'generateKey',
      key: 'generateKey'
    }];

    autobind(this);
  }

  componentDidMount() {
    if (this.props.getSecurity) {
      this.props.getSecurity(APPLICATIONKEYS);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'Application-restrictions-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  getKey() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const stringLength = 48;

    for (let i = 0; i < stringLength; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  handleChange(update) {
    let result = this.props.applicationKeys;
    if (Object.prototype.hasOwnProperty.call(update, 'text')) {
      result = result.filter((key, i) => Number(i) !== Number(update.text));
    } else if (Object.prototype.hasOwnProperty.call(update, 'create')) {
      result = result.concat(this.getKey());
    } else {
      const keyIndex = Object.keys(update)[0];
      const value = update[keyIndex];
      result = result.map((key, i) => {
        if (Number(i) === Number(keyIndex)) {
          return value;
        }

        return key;
      });
    }

    if (typeof this.props.setCustomSecurityMultiKeys === 'function') {
      this.props.setCustomSecurityMultiKeys(APPLICATIONKEYS, {
        applicationKeys: JSON.stringify(result.map(key => ({
          applicationKey: key
        })))
      });
    }
  }

  handleClearClick(key) {
    if (typeof this.props.setCustomSecurityMultiKeys === 'function') {
      const keyList = this.props.applicationKeys.filter(item => item !== key);

      this.props.setCustomSecurityMultiKeys(APPLICATIONKEYS, {
        applicationKeys: JSON.stringify(keyList.map(appKey => ({
          applicationKey: appKey
        })))
      });
    }
  }

  render() {
    const {
      className,
      style,
      applicationKeys
    } = this.props;

    const { formatMessage } = this.context.intl;

    const strings = generateStrings(messages, formatMessage);

    const styles = require('./AdminApplicationRestrictions.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      adminApplicationRestrictions: true
    }, className);

    return (
      <div className={classes} style={style}>
        {this.fields.map((data) => (
          <AdminFormField
            key={data.labelKey || data.label}
            type={data.type}
            label={strings[data.labelKey]}
            value={this.props[data.key]}
            dataKey={data.key}
            className={styles.formFieldCustom}
            onChange={this.handleChange}
          />
        ))}
        {applicationKeys && applicationKeys.map((key, i) => (<AdminFormField
          key={key}
          type="text"
          value={key}
          onChange={this.handleChange}
          showClear
          onClearClick={() => { this.handleClearClick(key); }}
          dataKey={i}
          className={styles.textFieldClear}
        />))}
      </div>
    );
  }
}
