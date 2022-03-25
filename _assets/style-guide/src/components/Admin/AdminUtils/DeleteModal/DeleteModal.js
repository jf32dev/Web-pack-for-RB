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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';

/**
 * Simple delete modal with message, cancel button and delete button
 */
export default class DeleteModal extends PureComponent {
  static propTypes = {
    /** delete message */
    message: PropTypes.string,

    /** delete data */
    data: PropTypes.string,

    /** delete name */
    name: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onClose: PropTypes.func,

    /** modal popup or not */
    isVisible: PropTypes.bool,

    onDelete: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleDelete() {
    const { onDelete, item, name } = this.props;
    if (onDelete && typeof onDelete === 'function') {
      onDelete('delete', item, name);
    }
  }

  render() {
    const styles = require('./DeleteModal.less');
    const { isVisible, onClose, message, strings } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      DeleteModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="small"
        backdropClosesModal
        escClosesModal
        onClose={onClose}
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.warning}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.handleDelete}
            data-action="confirm" data-name="device" style={{ marginLeft: '0.5rem' }}
          >
            {strings.delete}
          </Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          {message}
        </div>
      </Modal>
    );
  }
}
