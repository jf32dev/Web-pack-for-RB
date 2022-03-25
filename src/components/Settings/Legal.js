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
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  privacyPolicy: { id: 'privacy-policy', defaultMessage: 'Privacy Policy' },
  eula: { id: 'eula', defaultMessage: 'EULA' },
  acceptableUse: { id: 'acceptable-use', defaultMessage: 'Acceptable Use' },
  cookiePolicy: { id: 'cookie-policy', defaultMessage: 'Cookie Policy' },
});

export default class Legal extends Component {
  static propTypes = {
    url: PropTypes.string
  };

  static defaultProps = {
    url: '/agreements.html?content=noheader'
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabSelected: 'nav-privacy',
      show: true,
    };
    autobind(this);

    // refs
    this.legalIframe = null;
  }

  componentDidMount() {
    // Delay iframe visibility
    this.timer = window.setTimeout(() => {
      window.clearTimeout(this.timer);
      this.setState({ show: true });
    }, 400);
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  handleClick(event) {
    event.preventDefault();
    const element = event.currentTarget.id;
    this.setState({ tabSelected: element });

    const iframe = this.legalIframe;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow;

    // Get HTML element
    iframeDoc.getElementById(element).click();
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { tabSelected } = this.state;
    const styles = require('./Legal.less');
    const cx = classNames.bind(styles);

    const navClasses = cx({
      'horizontal-nav': true,
      navigation: true,
    });

    const iframeClasses = cx({
      LegalIframe: true,
      show: this.state.show,
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const menuActive = {
      privacy: tabSelected === 'nav-privacy' || '' ? 'active' : '',
      eula: tabSelected === 'nav-eula' ? 'active' : '',
      aup: tabSelected === 'nav-aup' ? 'active' : '',
      cp: tabSelected === 'nav-cp' ? 'active' : '',
    };

    return (
      <div className={styles.Legal}>
        <nav className={navClasses}>
          <ul>
            <li><a href="/agreements.html" id="nav-privacy" className={menuActive.privacy} onClick={this.handleClick}>
              {strings.privacyPolicy}
            </a></li>
            <li><a href="/agreements.html" id="nav-eula" className={menuActive.eula} onClick={this.handleClick}>
              {strings.eula}
            </a></li>
            <li><a href="/agreements.html" id="nav-aup" className={menuActive.aup} onClick={this.handleClick}>
              {strings.acceptableUse}
            </a></li>
            <li><a href="/agreements.html" id="nav-cp" className={menuActive.cp} onClick={this.handleClick}>
              {strings.cookiePolicy}
            </a></li>
          </ul>
        </nav>
        <iframe
          ref={(c) => { this.legalIframe = c; }}
          frameBorder={0}
          src={this.props.url}
          className={iframeClasses}
        />
      </div>
    );
  }
}
