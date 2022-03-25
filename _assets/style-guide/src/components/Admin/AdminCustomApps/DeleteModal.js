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
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

/**
 * choose delete modal
 */
export default class DeleteModal extends PureComponent {
  static propTypes = {
    /** call back method to close modal*/
    onCancel: PropTypes.func,

    isVisible: PropTypes.bool,

    onConfirm: PropTypes.func,
    name: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      cancel: 'Cancel',
      delete: 'Delete',
      deleteApplication: 'Delete Application',
      deletePermanentInfo: 'Deleting your custom application is a permanent action that cannot be undone.',
      allUsersLoggedOut: 'All existing users will be logged out.',
      allTokenDestroyed: 'All access tokens will be revoked and destroyed.',
      confirmDeleteInfo: 'Are you sure you want to delete this application?',
      enterNameLabel: 'Enter Application name to confirm delete.',
    },
    name: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.choose = ['standardOAuth', 'apiOAuth'];
    autobind(this);
  }

  handleInput(e) {
    this.setState({
      value: e.currentTarget.value,
    });
  }

  handleDisable(e) {
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const styles = require('./DeleteModal.less');
    const { isVisible, onCancel, strings, name, onConfirm } = this.props;
    const { value } = this.state;
    const cx = classNames.bind(styles);
    const classes = cx({
      DeleteModal: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        onClose={onCancel}
        headerChildren={<p onCopy={this.handleDisable} onPaste={this.handleDisable} style={{ fontSize: '1.2rem', margin: 0 }}>{strings.deleteApplication}</p>}
        footerChildren={(<div>
          <Btn alt large onClick={onCancel}>{strings.cancel}</Btn>
          <Btn
            large inverted disabled={name.toLowerCase() !== value.toLowerCase()}
            onClick={onConfirm}
          >{strings.delete}</Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <p>{strings.deletePermanentInfo}</p>
          <ul>
            <li>{strings.allUsersLoggedOut}</li>
            <li>{strings.allTokenDestroyed}</li>
          </ul>
          <p>{strings.confirmDeleteInfo}</p>
          <Text
            id="name"
            name="name"
            label={strings.enterNameLabel}
            className={styles.text}
            placeholder={name}
            value={value}
            onChange={this.handleInput}
          />
        </div>
      </Modal>
    );
  }
}
