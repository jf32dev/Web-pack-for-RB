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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';

/**
 * A dialog window is used to confirm a user action.
 */
export default class Dialog extends PureComponent {
  static propTypes = {
    /** child elements can be passed in place of <code>message</code> */
    children: PropTypes.node,

    /** title to display */
    title: PropTypes.string.isRequired,

    /** message to display */
    message: PropTypes.string,

    isVisible: PropTypes.bool,

    cancelText: PropTypes.string,
    confirmText: PropTypes.string,

    className: PropTypes.string,

    /** displays a 'Cancel' button */
    onCancel: PropTypes.func,

    /** displays a 'Confirm' button */
    onConfirm: PropTypes.func
  };

  static defaultProps = {
    title: '',
    message: '',
    isVisible: false,

    cancelText: 'Cancel',
    confirmText: 'Confirm'
  };

  render() {
    const {
      children,
      title,
      message,
      isVisible,
      onCancel,
      onConfirm,
      cancelText,
      confirmText,
      className,
    } = this.props;
    const style = require('./Dialog.less');

    return (
      <Modal
        backdropClosesModal
        escClosesModal
        isVisible={isVisible}
        width="medium"
        className={className}
        footerChildren={(
          <div>
            {onCancel && <Btn
              borderless alt large
              onClick={onCancel}
            >
              {cancelText}
            </Btn>}
            {onConfirm && <Btn
              borderless inverted large
              onClick={onConfirm}
            >
              {confirmText}
            </Btn>}
          </div>
        )}
        onClose={onCancel || onConfirm}
      >
        <div className={style.Dialog}>
          {title && <div className={style.Header}>{title}</div>}
          {!children && <p className={style.message}>{message}</p>}
          {children && children}
        </div>
      </Modal>
    );
  }
}
