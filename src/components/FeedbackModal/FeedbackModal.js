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
 * @package hub-web-app-v5
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  setBetaUser,
  setContactUser
} from 'redux/modules/settings';

import Select from 'react-select';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import Textarea from 'components/Textarea/Textarea';

@connect(
  state => ({
    betaUser: state.settings.userSettings.betaUser,
    contactUser: state.settings.userSettings.contactUser,
  }),
  bindActionCreatorsSafe({
    setBetaUser,
    setContactUser
  })
)
export default class FeedbackModal extends Component {
  static propTypes = {
    strings: PropTypes.object.isRequired,
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
  };

  static defaultProps = {
    betaUser: false,
    contactUser: false,

    strings: {
      header: 'Feedback',
      subject: 'Subject',
      message: 'Message',
      cancel: 'Cancel',
      send: 'Send',
      close: 'Close',

      generalFeedback: 'General Feedback',
      iFoundABug: 'I found a bug',
      iHaveASuggestion: 'I have a suggestion',

      description: 'Are you interested in helping to improve bigtincan hub?',
      betaOptInDescription: 'Yes, please include me when new features are available for testing.',
      contactOptInDescription: 'Yes, I am willing to participate in feedback sessions.',

      feedbackSentHeading: 'Your feedback has been sent!',
      feedbackSentMessage: 'Thank you for helping us to improve bigtincan hub. If we need more details from you we’ll be in touch soon.'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      subjectValue: { value: 'general', label: props.strings.generalFeedback },
      messageValue: '',
      betaOptIn: true,
      contactOptIn: true,
      sent: false
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Reset when closing
    if (!nextProps.isVisible && this.props.isVisible) {
      this.setState({
        sent: false,
        messageValue: ''
      });
    }
  }

  handleSubjectChange(value) {
    this.setState({
      subjectValue: value
    });
  }

  handleMessageChange(event) {
    this.setState({
      messageValue: event.target.value
    });
  }

  handleCheckboxChange(event) {
    this.setState({
      [event.target.name]: event.target.checked
    });
  }

  handleSend(event) {
    event.preventDefault();
    this.props.onSend(event, {
      subject: this.state.subjectValue,
      message: this.state.messageValue,
      betaOptIn: this.state.betaOptIn,
      contactOptIn: this.state.contactOptIn,
    });

    // Set beta opt-in
    if (this.state.betaOptIn !== this.props.betaUser) {
      this.props.setBetaUser(this.state.betaOptIn);
    }

    // Set contact opt-in
    if (this.state.contactOptIn !== this.props.contactUser) {
      this.props.setContactUser(this.state.contactOptIn);
    }

    this.setState({ sent: true });
  }

  render() {
    const { subjectValue, messageValue, sent } = this.state;
    const { strings, isVisible, onClose, betaUser, contactUser } = this.props;
    const styles = require('./FeedbackModal.less');
    const cx = classNames.bind(styles);
    const bodyClasses = cx({
      FeedbackModal: true,
      sent: sent
    });

    const footerClasses = cx({
      footer: true,
      sent: sent
    });

    return (
      <Modal
        backdropClosesModal
        escClosesModal
        isVisible={isVisible}
        width="medium"
        headerTitle={strings.header}
        footerChildren={(
          <div className={footerClasses}>
            <Btn large alt onClick={onClose}>
              {sent ? strings.close : strings.cancel}
            </Btn>
            {!sent && <Btn large inverted disabled={!messageValue} onClick={this.handleSend}>
              {strings.send}
            </Btn>}
          </div>
        )}
        onClose={onClose}
        className={bodyClasses}
      >
        <div>
          {!sent && <section>
            <Select
              name="feedback-subject"
              value={subjectValue}
              options={[
                { value: 'general', label: strings.generalFeedback },
                { value: 'bug', label: strings.iFoundABug },
                { value: 'suggestion', label: strings.iHaveASuggestion }
              ]}
              searchable={false}
              placeholder={strings.subject}
              onChange={this.handleSubjectChange}
            />
            <Textarea
              id="feedback-message"
              placeholder={strings.message}
              value={messageValue}
              rows={3}
              onChange={this.handleMessageChange}
            />
          </section>}
          {!sent && (!betaUser || !contactUser) && <section>
            <h3>{strings.description}</h3>
            {!betaUser && <Checkbox
              label={strings.betaOptInDescription}
              name="betaOptIn"
              value="betaOptIn"
              rows={4}
              checked={this.state.betaOptIn}
              onChange={this.handleCheckboxChange}
            />}
            {!contactUser && <Checkbox
              label={strings.contactOptInDescription}
              name="contactOptIn"
              value="contactOptIn"
              checked={this.state.contactOptIn}
              onChange={this.handleCheckboxChange}
            />}
          </section>}
          {sent && <section>
            <h3>{strings.feedbackSentHeading}</h3>
            <p>{strings.feedbackSentMessage}</p>
          </section>}
        </div>
      </Modal>
    );
  }
}
