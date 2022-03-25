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
import { FormattedMessage } from 'react-intl';

import Btn from 'components/Btn/Btn';

export default class ModalFooter extends Component {
  static propTypes = {
    children: PropTypes.node,
    showCloseButton: PropTypes.bool,

    /** Explicitly set a numeric width or provide one of three sizes */
    width: PropTypes.oneOfType([
      PropTypes.oneOf(['small', 'medium', 'large']),
      PropTypes.number,
    ]),

    onClose: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { showCloseButton, onClose, style } = this.props;
    const styles = require('./Modal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ModalFooter: true
    }, this.props.className);

    return (
      <div data-id="footer" className={classes} style={style}>
        {this.props.children}
        {showCloseButton && <Btn
          onClick={onClose}
          borderless
          alt
          large
        >
          <FormattedMessage id="close" defaultMessage="Close" />
        </Btn>}
      </div>
    );
  }
}
