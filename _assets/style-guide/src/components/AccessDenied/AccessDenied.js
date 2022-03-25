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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';

const messages = defineMessages({
  close: { id: 'close', defaultMessage: 'Close' },
});

/**
 * AccessDenied wraps a <code>Blankslate</code and is used
 * to indicate an area the current user cannot access.
 */
export default class AccessDenied extends Component {
  static propTypes = {
    heading: PropTypes.string,
    message: PropTypes.string,

    onCloseClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    heading: 'Access Denied',
    message: 'You do not have permission to view this page.',
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { onCloseClick } = this.props;
    const styles = require('./AccessDenied.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AccessDenied: true
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={classes} style={this.props.style}>
        <Blankslate
          icon="gear"
          iconSize={96}
          inline
          heading={this.props.heading}
          message={this.props.message}
        >
          {onCloseClick && <Btn onClick={onCloseClick}>{strings.close}</Btn>}
        </Blankslate>
      </div>
    );
  }
}
