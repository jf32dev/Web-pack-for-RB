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
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';

/**
 * Main web app login.
 */
export default class PasswordReset extends Component {
  static propTypes = {
    image: PropTypes.string,
    logo: PropTypes.string,
    text: PropTypes.string,
    textColour: PropTypes.string,
    currentPasswordValue: PropTypes.string,
    passValue: PropTypes.string,
    confirmPassValue: PropTypes.string,
    rememberChecked: PropTypes.bool,
    showCurrentPasswordField: PropTypes.bool,

    /** Focus user input on mount */
    focusOnMount: PropTypes.bool,
    disableInputs: PropTypes.bool,
    disableButton: PropTypes.bool,
    disableForgot: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.object,
    unsupportedBrowser: PropTypes.bool,

    onConfirmPassChange: PropTypes.func.isRequired,
    onPassChange: PropTypes.func.isRequired,
    onCurrentPasswordChange: PropTypes.func,
    onButtonClick: PropTypes.func.isRequired,

    // Translations strings
    blurb: PropTypes.string.isRequired,
    btnText: PropTypes.string.isRequired,
    confirmPasswordPlaceholder: PropTypes.string.isRequired,
    passwordPlaceholder: PropTypes.string.isRequired,
    changeSuccessTitle: PropTypes.string.isRequired,
    changeSuccessBlurb: PropTypes.string.isRequired,
    changeSuccessBtnText: PropTypes.string.isRequired,
    currentPasswordPlaceholder: PropTypes.string,
    redirectUri: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object,

    changeSuccess: PropTypes.bool,
    unsupportedBrowserText: PropTypes.string.isRequired
  };

  static defaultProps = {
    image: '',
    logo: '',
    changeSuccess: false,
    showCurrentPasswordField: false
  };

  constructor(props) {
    super(props);

    // refs
    this.passwordInput = null;
    this.currentPasswordInput = null;
  }

  componentDidMount() {
    if (this.props.focusOnMount && this.passwordInput) {
      this.passwordInput.focus();
    }
    if (this.props.showCurrentPasswordField && this.props.focusOnMount && this.currentPasswordInput) {
      this.currentPasswordInput.focus();
    }
  }

  render() {
    const {
      error,
      logo,
      onButtonClick,
      blurb,
      btnText,
      confirmPasswordPlaceholder,
      passwordPlaceholder,
      currentPasswordPlaceholder,
      changeSuccess,
      changeSuccessBtnText,
      changeSuccessBlurb,
      changeSuccessTitle,
      unsupportedBrowserText,
    } = this.props;
    const styles = require('./PasswordReset.less');
    const cx = classNames.bind(styles);
    const classes = cx(
      {
        resetPassword: !changeSuccess,
        resetDone: changeSuccess,
        loading: this.props.loading,
        unsupported: this.props.unsupportedBrowser,
        currentPassword: this.props.showCurrentPasswordField
      },
      this.props.className
    );

    const logoStyle = {
      backgroundImage: 'url(' + logo + ')'
    };

    return (
      <div
        tabIndex="-1"
        className={classes}
        style={this.props.style}
      >
        <div className={styles.authWrap}>
          <div className={styles.logo} style={logoStyle} />
          {this.props.unsupportedBrowser &&
            <div className={styles.unsupportedBrowser}>
              <h3>Unsupported Browser</h3>
              <p>{unsupportedBrowserText}</p>
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
            <div className={styles.rootoAuthContainer}>
              {!changeSuccess && <p className={styles.blurb}>{blurb}</p>}
              {!changeSuccess && <form className={styles.form}>
                {this.props.showCurrentPasswordField &&
                <input
                  ref={(c) => { this.currentPasswordInput = c; }}
                  type="password"
                  name="currentPassword"
                  placeholder={currentPasswordPlaceholder}
                  value={this.props.currentPasswordValue}
                  onChange={this.props.onCurrentPasswordChange}
                  className={styles.input}
                />}
                <input
                  ref={(c) => { this.passwordInput = c; }}
                  type="password"
                  name="password"
                  placeholder={passwordPlaceholder}
                  value={this.props.passValue}
                  disabled={this.props.disableInputs}
                  onChange={this.props.onPassChange}
                  className={styles.input}
                />
                <input
                  ref={(c) => { this.passInput = c; }}
                  type="password"
                  name="confirm-password"
                  placeholder={confirmPasswordPlaceholder}
                  value={this.props.confirmPassValue}
                  disabled={this.props.disableInputs}
                  onChange={this.props.onConfirmPassChange}
                  className={styles.input}
                />
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
              </form>}
              {changeSuccess && <div className={styles.submitted}>
                <div className={styles.middleContainer}>
                  <p className={styles.blurb}>{changeSuccessTitle}</p>
                  <p className={styles.blurb}>{changeSuccessBlurb}</p>
                </div>
                <Btn
                  href={this.props.redirectUri}
                  className={styles.submittedButton}
                  alt
                  borderless
                  large
                >
                  {changeSuccessBtnText}
                </Btn>
              </div>}
            </div>}
        </div>
      </div>
    );
  }
}
