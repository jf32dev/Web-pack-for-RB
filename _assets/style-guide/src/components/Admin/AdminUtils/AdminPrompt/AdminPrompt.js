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
import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
//https://reacttraining.com/react-router/web/example/preventing-transitions
import { Prompt } from 'react-router-dom';

const messages = defineMessages({
  leaveMessage: {
    id: 'leave-message',
    defaultMessage: 'You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes'
  }
});

/**
 * AdminPrompt, when navigate to another page gives warning.
 */
export default class AdminPrompt extends PureComponent {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    isDifferent: PropTypes.bool,
  };

  static defaultProps = {
    path: '/admin/security/authentication',
    isDifferent: false,
  };

  render() {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    const { adminUI } = this.context.settings;

    this.adminPaths = adminUI.reduce((obj, current) => {
      if (current.options.length > 0) {
        return [
          ...obj,
          ...current.options.map(option => `/admin/${current.name}/${option.name}`)
        ];
      }
      return [
        ...obj,
        `/admin/${current.name}`
      ];
    }, []);
    const currentPath = _get(this.context, 'router.history.location.pathname', '');
    return (
      <Prompt
        message={location => {
          if (this.props.isDifferent &&
            ((this.adminPaths.indexOf(location.pathname) > -1 &&
            location.pathname !== currentPath) ||
            location.pathname.indexOf('/admin') === -1)) {
            return strings.leaveMessage;
          }
          return true;
        }}
      />
    );
  }
}
