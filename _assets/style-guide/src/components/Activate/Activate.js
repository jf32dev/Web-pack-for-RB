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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';

/**
 * Activate a new user account.
 */
export default class Activate extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    logo: PropTypes.string,
    text: PropTypes.string,
    textColour: PropTypes.string,

    userValue: PropTypes.string,
    passValue: PropTypes.string,
    passConfirmValue: PropTypes.string,

    disableButton: PropTypes.bool,
    loading: PropTypes.bool,
    submitted: PropTypes.bool,
    showAppLinks: PropTypes.bool,

    iosAppDownload: PropTypes.string,
    androidAppDownload: PropTypes.string,
    windowsAppDownload: PropTypes.string,

    strings: PropTypes.object,

    onAnchorClick: PropTypes.func.isRequired,
    //onUserChange: PropTypes.func.isRequired,
    onPassChange: PropTypes.func.isRequired,
    onPassConfirmChange: PropTypes.func.isRequired,
    onButtonClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    image: '',
    logo: '',
    textColour: '#fff',
    showAppLinks: true,
    iosAppDownload: 'https://itunes.apple.com/us/app/bigtincan-hub/id1057042059?mt=8',
    androidAppDownload: 'https://play.google.com/store/apps/details?id=com.bigtincan.mobile.hub',
    windowsAppDownload: 'http://www.windowsphone.com/en-us/store/app/bigtincan-hub/6644204c-501e-4624-beee-c51fbcf4a2ff',
    strings: {
      blurb: 'Welcome to Bigtincan Hub, to complete your registration please create a password.',
      continue: 'Continue',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      congratulations: 'Congratulations',
      submittedBlurb: 'You can now sign in to Bigtincan Hub. Don’t miss a beat by downloading Bigtincan Hub on your devices.',
      goToSignIn: 'Go to Sign In',
      android: 'Android',
      ios: 'iOS',
      windows: 'Windows',
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleKeyUp(event) {
    // Trigger button click on 'enter'
    if (event.keyCode === 13 && !this.props.disableButton) {
      this.props.onButtonClick(event);
    }
  }

  render() {
    const { image, logo, text, textColour, submitted, showAppLinks, onButtonClick, strings } = this.props;
    const styles = require('./Activate.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Activate: true,
      loading: this.props.loading
    }, this.props.className);

    const imageStyle = {
      backgroundImage: 'url(' + image + ')'
    };

    const textStyle = {
      color: textColour
    };

    const logoStyle = {
      backgroundImage: 'url(' + logo + ')'
    };

    return (
      <div tabIndex="-1" className={classes} style={this.props.style}>
        <div className={styles.image} style={imageStyle}>
          {text && <p className={styles.text} style={textStyle}>{text}</p>}
        </div>
        <div className={styles.authWrap}>
          <div className={styles.logo} style={logoStyle} />
          {!submitted && <div>
            <p className={styles.blurb}>{strings.blurb}</p>
            {/*<input
              type="text"
              placeholder={strings.email}
              value={this.props.userValue}
              onChange={this.props.onUserChange}
              onKeyUp={this.handleKeyUp}
              className={styles.input}
            />*/}
            <input
              type="password"
              placeholder={strings.password}
              value={this.props.passValue}
              onChange={this.props.onPassChange}
              onKeyUp={this.handleKeyUp}
              className={styles.input}
            />
            <input
              type="password"
              placeholder={strings.confirmPassword}
              value={this.props.passConfirmValue}
              onChange={this.props.onPassConfirmChange}
              onKeyUp={this.handleKeyUp}
              className={styles.input}
            />
            <Btn
              onClick={onButtonClick}
              className={styles.button}
              disabled={this.props.disableButton}
              borderless
              inverted
              large
            >
              {strings.continue}
            </Btn>
          </div>}
          {submitted && <div className={styles.submitted}>
            <h1 className={styles.heading}>{strings.congratulations}!</h1>
            <p className={styles.blurb}>{strings.submittedBlurb}</p>
            {showAppLinks && <ul className={styles.appList}>
              <li
                aria-label={strings.iOS}
                className={styles.ios}
              >
                <a
                  href={this.props.iosAppDownload}
                  onClick={this.props.onAnchorClick}
                >
                  {strings.ios}
                </a>
              </li>
              <li
                aria-label={strings.android}
                className={styles.android}
              >
                <a
                  href={this.props.androidAppDownload}
                  onClick={this.props.onAnchorClick}
                >
                  {strings.android}
                </a>
              </li>
              <li
                aria-label={strings.windows}
                className={styles.windows}
              >
                <a
                  href={this.props.windowsAppDownload}
                  onClick={this.props.onAnchorClick}
                >
                  {strings.windows}
                </a>
              </li>
            </ul>}
            <Btn
              href="/"
              className={styles.submittedButton}
              inverted
              borderless
              large
            >
              {strings.goToSignIn}
            </Btn>
          </div>}
        </div>
      </div>
    );
  }
}
