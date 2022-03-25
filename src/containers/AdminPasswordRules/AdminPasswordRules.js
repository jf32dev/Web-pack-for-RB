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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import {
  getSecurity,
  setCustomSecurity,
} from 'redux/modules/admin/security';
import { createPrompt } from 'redux/modules/prompts';

import { convertObjFromServer } from 'components/Admin/AdminUtils/Methods/Methods';
import AdminPasswordRules from 'components/Admin/AdminPasswordRules/AdminPasswordRules';
import Loader from 'components/Loader/Loader';

const PASSWORDRULES = 'passwordrules';

const messages = defineMessages({
  forceUpdateMsg: {
    id: 'force-update-msg',
    defaultMessage: 'Force users to change passwords after this many days'
  },
  cloudOnlyMsg: {
    id: 'cloud-only-msg',
    defaultMessage: 'This setting only applies to Cloud authentication and does not affect Enterprise or Corporate login.',
  },
  rememberPasswordDays: {
    id: 'remember-passwordDays',
    defaultMessage: 'Remember used passwords for this many days.'
  },
  insertNumberMinimumMaximum: {
    id: 'insert-number-minimum-maximum',
    defaultMessage: 'Insert number minimum = 1 and maximum = 180'
  },
  additionalRules: {
    id: 'additional-rules',
    defaultMessage: 'Additional Rules'
  },
  minimumCharacters: {
    id: 'minimum-characters',
    defaultMessage: 'Have at least this many total characters'
  },
  minimumSix: {
    id: 'minimum-six',
    defaultMessage: 'Minimum complexity requirement: 6 characters'
  },
  minimumAlphabetic: {
    id: 'minimum-alphabetic',
    defaultMessage: 'Have at least this many Alphabetic Letters (a-z, A-Z)',
  },
  minimum1: {
    id: 'minimum-1',
    defaultMessage: 'Minimum: 1'
  },
  minimumCapital: {
    id: 'minimum-capital',
    defaultMessage: 'Have at least this many Capital Letters (A-Z)',
  },
  minimumNumbers: {
    id: 'minimum-numbers',
    defaultMessage: 'Have at least this many Numbers (0-9)',
  },
  minimumSpecial: {
    id: 'minimum-special',
    defaultMessage: 'Have at least this many Special Characters (!@#..etc)',
  },
  other: {
    id: 'other',
    defaultMessage: 'Other'
  },
  accountLockTimeout: {
    id: 'account-lock-timeout',
    defaultMessage: 'Account lock timeout'
  },
  never: {
    id: 'never',
    defaultMessage: 'Never'
  },
  tenMinutes: {
    id: 'ten-minutes',
    defaultMessage: '10 minutes',
  },

  twentyMinutes: {
    id: 'twenty-minutes',
    defaultMessage: '20 minutes',
  },
  thirtyMinutes: {
    id: 'thirty-minutes',
    defaultMessage: '30 minutes',
  },
  fortyMinutes: {
    id: 'forty-minutes',
    defaultMessage: '40 minutes',
  },
  fiftyMinutes: {
    id: 'fifty-minutes',
    defaultMessage: '50 minutes',
  },
  sixtyMinutes: {
    id: 'sixty-minutes',
    defaultMessage: '60 minutes',
  },
});

@connect(state => state.admin.security, bindActionCreatorsSafe({
  getSecurity,
  setCustomSecurity,
  createPrompt
}))
export default class AdminPasswordRulesView extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.format = {
      passwordExpiry: 'passwordExpiry',
      passwordRemember: 'passwordRemember',
      characters: 'totalCharacters',
      alphabetic: 'totalAlphabetic',
      capital: 'totalCapital',
      numbers: 'totalNumbers',
      specials: 'totalSpecials',
      lockTimeout: 'lockTimeout',
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.getSecurity) {
      this.props.getSecurity(PASSWORDRULES);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'security-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChange(update) {
    const key = Object.keys(update)[0];
    if (this.props.setCustomSecurity) {
      this.props.setCustomSecurity(PASSWORDRULES, {
        [this.format[key]]: update[key]
      });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      className,
      style,
    } = this.props;

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading &&
        <AdminPasswordRules
          onChange={this.handleChange}
          strings={generateStrings(messages, formatMessage)}
          {...convertObjFromServer(this.props, this.format)}
        />}
      </div>
    );
  }
}
