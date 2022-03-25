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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  sendSupportMessage,
  updateInputValue,
} from 'redux/modules/userSettings';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

const messages = defineMessages({
  subject: { id: 'subject', defaultMessage: 'Subject' },
  platform: { id: 'platform', defaultMessage: 'Platform' },
  optional: { id: 'optional', defaultMessage: 'Optional' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  send: { id: 'send', defaultMessage: 'Send' },
  sentSuccessfully: { id: 'message-sent-successfully', defaultMessage: 'Message sent successfully' },
  contactSupport: { id: 'contact-support', defaultMessage: 'Contact support' },
});

function mapStateToProps(state) {
  return {
    ...state.userSettings,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    sendSupportMessage,
    updateInputValue,
  })
)
export default class ContactSupport extends Component {
  static propTypes = {
    subject: PropTypes.string,
    description: PropTypes.string,
    platform: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.sent && !this.props.sent) {
      // Hide message after a few seconds
      this.timer = window.setTimeout(() => {
        window.clearTimeout(this.timer);
        this.props.updateInputValue('sent', false);
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  handleClick(event) {
    event.preventDefault();
    const { subject, description, platform } = this.props;

    this.props.sendSupportMessage(subject, description, platform);
  }

  handleOnChange(event) {
    const attribute = event.currentTarget.name;
    const value = event.currentTarget.value;

    this.props.updateInputValue(attribute, value);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const styles = require('./ContactSupport.less');

    if (this.props.notificationsLoading) {
      return (<Loader type="page" />);
    }

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.ContactSupport}>
        <header className={styles.listHeader}>
          <div className={styles.titleWrap}>
            <Breadcrumbs
              paths={[{ 'name': strings.contactSupport, 'path': 'settings/support' }]}
              className={styles.listCrumbs}
            />
          </div>
        </header>

        <div className={styles.wrapper}>
          <Text
            placeholder={strings.subject}
            value={this.props.subject}
            name="subject"
            onChange={this.handleOnChange}
          />
          <Text
            placeholder={strings.platform + ' (' + strings.optional + ')'}
            value={this.props.platform}
            name="platform"
            onChange={this.handleOnChange}
          />
          <Textarea
            placeholder={strings.comments}
            value={this.props.description}
            name="description"
            onChange={this.handleOnChange}
            rows={10}
            autosize
          />
          <Btn
            onClick={this.handleClick}
            inverted
            large
            loading={this.props.sending}
            disabled={!this.props.subject || !this.props.description}
          >
            {strings.send}
          </Btn>
          {this.props.sent && <span className={styles.confirmation}>{strings.sentSuccessfully}</span>}
        </div>
      </div>
    );
  }
}
