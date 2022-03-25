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
import FormField from 'components/Admin/AdminUtils/FormField/FormField';

/**
 * Simple delete modal with message, cancel button and delete button
 */
export default class InputModal extends PureComponent {
  static propTypes = {
    /** delete message */
    message: PropTypes.string,

    value: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onClose: PropTypes.func,

    /** modal popup or not */
    isVisible: PropTypes.bool,

    onConfirm: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      update: {}
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        update: {
          [nextProps.dataKey]: nextProps.value
        }
      });
    }
  }

  handleConfirm() {
    const { onConfirm } = this.props;
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(this.state.update);
    }
  }

  handleChange(update) {
    this.setState({
      update
    });
  }

  render() {
    const styles = require('./InputModal.less');
    const { isVisible, onClose, strings, dataKey, value, title, label } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      InputModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="small"
        backdropClosesModal
        escClosesModal
        onClose={onClose}
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{title}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel || 'Cancel'}</Btn>
          <Btn
            inverted large onClick={this.handleConfirm}
            data-action="confirm" data-name="device" style={{ marginLeft: '0.5rem' }}
          >
            {strings.confirm || 'Confirm'}
          </Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <FormField
            type="text"
            onChange={this.handleChange}
            dataKey={dataKey}
            value={value}
            label={label}
          />
        </div>
      </Modal>
    );
  }
}
