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

import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import Modal from 'components/Modal/Modal';
import Btn from 'components/Btn/Btn';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

/**
 * InviteGuestsModal description
 */
export default class InviteGuestsModal extends Component {
  static propTypes = {
    /** Description of customProp1 */
    isVisible: PropTypes.bool,

    onShareClick: PropTypes.func,

    onModalClose: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      inviteGuests: 'Invite Guests',
      cancel: 'Cancel',
      invite: 'Invite',
      message: 'Message',
      to: 'To',
      emailFormatDesc: 'Seperate email addresses with spaces',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      emails: '',
      message: '',
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      this.setState({
        emails: '',
        message: '',
      });
    }
  }

  handleInputChange(event) {
    const type = event.currentTarget.dataset.type;
    this.setState({
      [type]: event.currentTarget.value,
    });
  }

  handleShareClick(event) {
    this.props.onShareClick(event, this, this.state.emails, this.state.message);
  }

  render() {
    const {
      isVisible,
      onModalClose,
      strings,
    } = this.props;

    const {
      message,
      emails
    } = this.state;

    const styles = require('./InviteGuestsModal.less');

    return (
      <Modal
        isVisible={isVisible}
        width="medium"
        backdropClosesModal
        escClosesModal
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.inviteGuests}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onModalClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={this.handleShareClick}
            data-type="invite-share" disabled={_isEmpty(emails)} style={{ marginLeft: '0.5rem' }}
          >{strings.invite}</Btn>
        </div>)}
        onClose={onModalClose}
      >
        <div style={{ padding: '1rem 1.5rem' }}>
          <Text
            placeholder={strings.to}
            data-type="emails"
            value={emails}
            onChange={this.handleInputChange}
          />
          <div className={styles.emailFormatDesc}>{strings.emailFormatDesc}</div>
          <Textarea
            placeholder={strings.message}
            data-type="message"
            rows={3}
            value={message}
            onChange={this.handleInputChange}
          />
        </div>
      </Modal>
    );
  }
}
