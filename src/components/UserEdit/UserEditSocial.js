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

import Text from 'components/Text/Text';

const messages = defineMessages({
  yourProfile: { id: 'your-profile', defaultMessage: 'Your Profile' },
});

export default class UserEditSocial extends Component {
  static propTypes = {
    appleId: PropTypes.string,
    facebookUrl: PropTypes.string,
    linkedin: PropTypes.string,
    skypeId: PropTypes.string,
    twitterUrl: PropTypes.string,
    custom1: PropTypes.string,
    custom2: PropTypes.string,

    onChange: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      facebookPath: 'https://www.facebook.com/',
      linkedinPath: 'https://www.linkedin.com/in/',
      twitterPath: 'https://twitter.com/'
    };
    autobind(this);
  }

  handleOnChange(event) {
    const { onChange } = this.props;
    const attribute = event.currentTarget.name;
    let value = event.currentTarget.value.trim();

    if (value) {
      switch (attribute) {
        case 'linkedin':
          value = value.indexOf('linkedin.com') === -1 ? this.state.linkedinPath + value : value;
          break;
        case 'facebookUrl':
          value = value.indexOf('facebook.com') === -1 ? this.state.facebookPath + value : value;
          break;
        case 'twitterUrl':
          value = value.indexOf('twitter.com') === -1 ? this.state.twitterPath + value : value;
          break;
        default:
          break;
      }
    }

    // Propagate event
    if (typeof onChange === 'function') {
      onChange(event, { attribute: attribute, value: value });
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const styles = require('./UserEditSocial.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Check if URL has full path or only username
    const linkedin = this.props.linkedin.indexOf('linkedin.com') === -1 ? this.props.linkedin : this.props.linkedin.substr(this.props.linkedin.lastIndexOf('/') + 1);
    const facebook = this.props.facebookUrl.indexOf('facebook.com') === -1 ? this.props.facebookUrl : this.props.facebookUrl.substr(this.props.facebookUrl.lastIndexOf('/') + 1);
    const twitter = this.props.twitterUrl.indexOf('twitter.com') === -1 ? this.props.twitterUrl : this.props.twitterUrl.substr(this.props.twitterUrl.lastIndexOf('/') + 1);

    return (
      <div className={styles.UserEditSocial}>
        <div className={styles.prependInput}>
          <div style={{ 'display': 'inline', 'minWidth': '11.9rem' }}>
            {this.state.linkedinPath}
          </div>
          <Text
            name="linkedin"
            value={linkedin}
            placeholder={strings.yourProfile.toUpperCase()}
            onChange={this.handleOnChange}
            title="LinkedIn"
            style={{ 'flex': '1 1 auto' }}
          />
        </div>
        <div className={styles.prependInput}>
          <div style={{ 'display': 'inline', 'minWidth': '11.25rem' }}>
            {this.state.facebookPath}
          </div>
          <Text
            name="facebookUrl"
            value={facebook}
            placeholder={strings.yourProfile.toUpperCase()}
            onChange={this.handleOnChange}
            title="Facebook"
            style={{ 'flex': '1 1 auto' }}
          />
        </div>
        <div className={styles.prependInput}>
          <div>{this.state.twitterPath}</div>
          <Text
            name="twitterUrl"
            value={twitter}
            placeholder={strings.yourProfile.toUpperCase()}
            onChange={this.handleOnChange}
            title="Twitter"
            style={{ 'flex': '1 1 auto' }}
          />
        </div>
        <Text
          name="skypeId"
          value={this.props.skypeId}
          placeholder="Skype"
          onChange={this.handleOnChange}
          width="22rem"
        />
        <Text
          name="appleId"
          value={this.props.appleId}
          placeholder="Apple ID"
          onChange={this.handleOnChange}
          width="22rem"
        />
      </div>
    );
  }
}
