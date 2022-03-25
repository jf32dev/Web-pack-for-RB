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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';

/**
 * choose delete modal
 */
export default class DiscardModal extends PureComponent {
  static propTypes = {
    /** call back method to close modal*/
    onCancel: PropTypes.func,
    onDiscard: PropTypes.func,
    isVisible: PropTypes.bool,
    onConfirm: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      discard: 'Discard',
      save: 'Save',
      unSaveChanges: 'Unsaved Changes',
      discardMessage: 'If you change languages you will lose any unsaved changes you have made. Would you like to save your changes?',
    },
    name: '',
  };

  render() {
    const { isVisible, onCancel, strings, onDiscard, onConfirm } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        onClose={onCancel}
        headerChildren={<p onCopy={this.handleDisable} onPaste={this.handleDisable} style={{ fontSize: '1.2rem', margin: 0 }}>{strings.unSaveChanges}</p>}
        footerChildren={(<div>
          <Btn alt large onClick={onDiscard}>{strings.discard}</Btn>
          <Btn large inverted onClick={onConfirm}>{strings.save}</Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }}>
          <p>{strings.discardMessage}</p>
        </div>
      </Modal>
    );
  }
}
