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

/**
 * Recover Password.
 */
export default class Recover extends Component {
  static propTypes = {
    logo: PropTypes.string,
    emailValue: PropTypes.string,

    disableButton: PropTypes.bool,
    loading: PropTypes.bool,
    submitted: PropTypes.bool,
    error: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,
    onBtnClick: PropTypes.func.isRequired,
    onEmailChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    logo: ''
  };

  render() {
    const { logo, emailValue, error, submitted, onAnchorClick, onBtnClick } = this.props;
    const styles = require('./Recover.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Recover: true,
      loading: this.props.loading
    }, this.props.className);

    const logoStyle = {
      backgroundImage: 'url(' + logo + ')'
    };

    const title = 'Forgot your password';
    const blurb = 'To reset your password, enter your email address';
    const emailPlaceholder = 'Email address';
    const cancelText = 'Cancel';
    const recoverText = 'Continue';

    const submittedTitle = 'Email Sent';
    const submittedBurb = 'An email has been sent to ' + emailValue + ' with a link to reset your password. It may take a minute for you to receive the email.';
    const submittedBtnText = 'Back to Sign In';

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.logo} style={logoStyle} />

        {!submitted && <div className={styles.wrapper}>
          <h1>{title}</h1>
          <p className={styles.blurb}>{blurb}</p>

          <form>
            <input
              type="text"
              placeholder={emailPlaceholder}
              value={emailValue}
              onChange={this.props.onEmailChange}
              onKeyUp={this.handleKeyUp}
              className={styles.input}
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.buttonWrap}>
              <Btn
                href="/"
                onClick={onAnchorClick}
                className={styles.button}
                alt
                borderless
                large
              >
                {cancelText}
              </Btn>
              <Btn
                type="submit"
                disabled={this.props.disableButton}
                inverted
                borderless
                large
                onClick={onBtnClick}
                className={styles.button}
              >
                {recoverText}
              </Btn>
            </div>
          </form>
        </div>}

        {submitted && <div className={styles.submitted}>
          <h1>{submittedTitle}</h1>
          <p className={styles.blurb}>{submittedBurb}</p>
          <Btn
            href="/"
            onClick={onAnchorClick}
            className={styles.submittedButton}
            alt
            borderless
            large
          >
            {submittedBtnText}
          </Btn>
        </div>}
      </div>
    );
  }
}
