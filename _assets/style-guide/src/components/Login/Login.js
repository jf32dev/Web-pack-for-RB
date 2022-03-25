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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import RadioGroup from 'components/RadioGroup/RadioGroup';

/**
 * Main web app login.
 */
export default class Login extends Component {
  static propTypes = {
    image: PropTypes.string,
    logo: PropTypes.string,
    text: PropTypes.string,
    textColour: PropTypes.string,

    selectedLogin: PropTypes.oneOf(['cloud', 'ldap', 'saml']),
    settings: PropTypes.object,
    userValue: PropTypes.string,
    passValue: PropTypes.string,
    rememberChecked: PropTypes.bool,

    /** Focus user input on mount */
    focusOnMount: PropTypes.bool,
    disableInputs: PropTypes.bool,
    disableButton: PropTypes.bool,
    disableForgot: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.object,
    unsupportedBrowser: PropTypes.bool,

    onUserChange: PropTypes.func.isRequired,
    onPassChange: PropTypes.func.isRequired,
    onAnchorClick: PropTypes.func,
    onButtonClick: PropTypes.func.isRequired,
    onOptionChange: PropTypes.func.isRequired,
    onRememberChange: PropTypes.func.isRequired,

    // Translations strings
    blurb: PropTypes.string.isRequired,
    btnText: PropTypes.string.isRequired,
    passPlaceholder: PropTypes.string.isRequired,
    rememberText: PropTypes.string.isRequired,
    recoverText: PropTypes.string.isRequired,
    cloudText: PropTypes.string.isRequired,
    userPlaceholder: PropTypes.string.isRequired,
    ldapText: PropTypes.string.isRequired,
    samlText: PropTypes.string.isRequired,
    unsupportedBrowserText: PropTypes.string.isRequired,
    unableToLogoutText: PropTypes.string.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    image: '',
    logo: '',
    selectedLogin: 'cloud',
    settings: {
      cloud: 'on',
      ldap: 'off',
      saml: 'off'
    }
  };

  constructor(props) {
    super(props);

    // refs
    this.userInput = null;
  }

  componentDidMount() {
    if (this.props.focusOnMount && this.userInput) {
      this.userInput.focus();
    }
  }

  render() {
    const {
      error,
      image,
      logo,
      text,
      textColour,
      settings,
      onAnchorClick,
      onButtonClick,
      blurb,
      btnText,
      btnDesc,
      passPlaceholder,
      rememberText,
      recoverText,
      cloudText,
      userPlaceholder,
      ldapText,
      samlText,
      selectedLogin,
      unsupportedBrowserText,
      unableToLogout,
      unableToLogoutText
    } = this.props;
    const styles = require('./Login.less');
    const cx = classNames.bind(styles);
    const classes = cx(
      {
        Login: true,
        loading: this.props.loading,
        unsupported: this.props.unsupportedBrowser
      },
      this.props.className
    );

    const imageStyle = {
      backgroundImage: 'url(' + image + ')'
    };

    const textStyle = {
      color: textColour
    };

    const logoStyle = {
      backgroundImage: 'url(' + logo + ')'
    };

    const inputFieldsClass = cx({
      saml: selectedLogin === 'saml',
    });

    // Create radio options object with labels
    const radioLabels = {
      cloud: cloudText,
      ldap: ldapText,
      saml: samlText
    };
    const radioOptions = [];
    Object.keys(settings).forEach(key => {
      if (settings[key] === 'on' || settings[key] === 'forced') {
        radioOptions.push({
          label: radioLabels[key],
          value: key
        });
      }
    });

    return (
      <div
        tabIndex="-1"
        className={classes}
        style={this.props.style}
      >
        <div className={styles.image} style={imageStyle}>
          {text && <p className={styles.text} style={textStyle}>{text}</p>}
        </div>
        <div className={styles.authWrap}>
          <div className={styles.logo} style={logoStyle} />
          {this.props.unsupportedBrowser &&
            <div className={styles.unsupportedBrowser}>
              <h3>Unsupported Browser</h3>
              <p>{unsupportedBrowserText}
              </p>
              <ul className={styles.browserList}>
                <li>
                  <a
                    title="Google Chrome"
                    className={styles.chromeLink}
                    href="https://www.google.com/chrome/browser/desktop/index.html"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Chrome
                  </a>
                </li>
                <li>
                  <a
                    title="Microsoft Edge"
                    className={styles.edgeLink}
                    href="https://www.microsoft.com/en-au/windows/microsoft-edge"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Edge
                  </a>
                </li>
                <li>
                  <a
                    title="Mozilla Firefox"
                    className={styles.firefoxLink}
                    href="https://www.mozilla.org/firefox"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Firefox
                  </a>
                </li>
                <li>
                  <a
                    title="Apple Safari"
                    className={styles.safariLink}
                    href="https://www.apple.com/safari"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Safari
                  </a>
                </li>
              </ul>
            </div>}
          {!this.props.unsupportedBrowser &&
            <div className={inputFieldsClass}>
              <p className={styles.blurb}>{blurb}</p>
              <form className={styles.form}>
                <input
                  ref={(c) => { this.userInput = c; }}
                  type="text"
                  name="username"
                  placeholder={userPlaceholder}
                  value={this.props.userValue}
                  disabled={this.props.disableInputs}
                  onChange={this.props.onUserChange}
                  className={styles.input}
                />
                <input
                  ref={(c) => { this.passInput = c; }}
                  type="password"
                  name="password"
                  placeholder={passPlaceholder}
                  value={this.props.passValue}
                  disabled={this.props.disableInputs}
                  onChange={this.props.onPassChange}
                  className={styles.input}
                />
                {radioOptions.length > 1 &&
                  <RadioGroup
                    name="loginType"
                    key={this.props.selectedLogin}
                    selectedValue={this.props.selectedLogin}
                    onChange={this.props.onOptionChange}
                    inline
                    options={radioOptions}
                    className={styles.optionWrap}
                  />}
                {error && error.message &&
                <p className={styles.errorMessage}>{error.message}</p>}
                <Btn
                  type="submit"
                  name="submit"
                  disabled={this.props.disableButton}
                  inverted
                  large
                  onClick={onButtonClick}
                >
                  {btnText}
                </Btn>
                {selectedLogin === 'saml' && unableToLogout && unableToLogoutText && <p className={styles.errorMessage}>{unableToLogoutText}</p>}
              </form>

              <div className={styles.rememberWrap}>
                {btnDesc && <span>{btnDesc}</span>}
                <Checkbox
                  label={rememberText}
                  name="remember"
                  value="remember"
                  checked={this.props.rememberChecked}
                  onChange={this.props.onRememberChange}
                  className={styles.rememberMe}
                />
                {!this.props.disableForgot &&
                <a
                  href="/recover.html"
                  data-id="recover"
                  onClick={onAnchorClick}
                  className={styles.recoverLink}
                >
                  {recoverText}
                </a>}
              </div>
            </div>}
        </div>
      </div>
    );
  }
}
