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

/* eslint-disable no-bitwise */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { loadAuthSettings } from 'redux/modules/auth';

import Btn from 'components/Btn/Btn';
import ColourScheme from 'components/ColourScheme/ColourScheme';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  signIn: { id: 'sign-in', defaultMessage: 'Sign In' },
  mobileApps: { id: 'mobile-apps', defaultMessage: 'Mobile Apps' },
  apps: { id: 'apps', defaultMessage: 'Apps' },
  download: { id: 'download', defaultMessage: 'Download' },
  android: { id: 'android', defaultMessage: 'Android' },
  ios: { id: 'ios', defaultMessage: 'iOS' },
  windows: { id: 'windows', defaultMessage: 'Windows' },
  plugins: { id: 'plugins', defaultMessage: 'Plugins' },
  powerpointPlugin: { id: 'powerpoint-plugin', defaultMessage: 'Powerpoint Plugin' },
  outlookPlugin: { id: 'outlook-plugin', defaultMessage: 'Outlook Plugin' },
  forWindows: { id: 'for-windows-7-and-office', defaultMessage: 'for Windows 7+ and Office 2013+' },
  forOffice: { id: 'for-office-2016', defaultMessage: 'for Office 2016+ (Cross Platfrom)' },

  agreements: { id: 'agreements', defaultMessage: 'Agreements' },
  systemStatus: { id: 'system-status', defaultMessage: 'System Status' },

  availableForiOSVersion: { id: 'available-for-ios-version', defaultMessage: 'Available for iPhone and iPad iOS 9+' },
  availableForAndroidVersion: { id: 'available-for-android-version', defaultMessage: 'Available for Android 5.1+' },
  availableForWindowsVersion: { id: 'available-for-windows-version', defaultMessage: 'Available for Windows 10+' },
});

function mapStateToProps(state) {
  return {
    ...state.auth.loginSettings,
    loaded: state.auth.loaded
  };
}

@connect(mapStateToProps, bindActionCreatorsSafe({
  loadAuthSettings
}))
export default class DownloadContainer extends Component {
  static propTypes = {
    appstoreBitmask: PropTypes.number,
    appLinks: PropTypes.oneOf(['off', 'on']),
    iosAppDownload: PropTypes.string,
    androidAppDownload: PropTypes.string,
    windowsAppDownload: PropTypes.string,
    companyName: PropTypes.string,
    logo: PropTypes.string,
    theme: PropTypes.shape({
      baseColor: PropTypes.string,
      darkBaseColor: PropTypes.string,
      lightBaseColor: PropTypes.string
    })
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    media: PropTypes.array.isRequired
  };

  static defaultProps = {
    iosAppDownload: 'https://itunes.apple.com/us/app/bigtincan-hub/id1057042059?mt=8',
    androidAppDownload: 'https://play.google.com/store/apps/details?id=com.bigtincan.mobile.hub',
    windowsAppDownload: 'http://www.windowsphone.com/en-us/store/app/bigtincan-hub/6644204c-501e-4624-beee-c51fbcf4a2ff',
    companyName: 'Bigtincan',
    logo: '/static/img/logo_with_text.png',
    theme: {
      baseColor: '#F26724',
      darkBaseColor: '#be450b',
      lightBaseColor: '#fcdccc'
    }
  };

  UNSAFE_componentWillMount() {
    this.props.loadAuthSettings();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.appLinks === 'off') {
      window.location = '/';
    }
  }

  handleNewWindowAnchorCLick(event) {
    event.preventDefault();
    const newWindow = window.open(event.currentTarget.href);
    newWindow.opener = null;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const year = new Date().getFullYear();

    const {
      appstoreBitmask,
      iosAppDownload,
      androidAppDownload,
      windowsAppDownload,
      companyName,
      logo,
      theme
    } = this.props;

    if (!this.props.loaded) {
      return (
        <Loader type="app" />
      );
    }

    // Enabled links
    const iosEnabled = (appstoreBitmask & 1) > 0;
    const androidEnabled = (appstoreBitmask & 2) > 0;
    const windowsEnabled = (appstoreBitmask & 4) > 0;
    //const blackberryEnabled = (appstoreBitmask & 8) > 0;

    const styles = require('./Download.less');
    const cx = classNames.bind(styles);
    const downloadWrapClasses = cx({
      downloadWrap: true,
      [`total-${[iosEnabled, androidEnabled, windowsEnabled].filter(v => v).length}`]: true
    });

    const strings = generateStrings(messages, formatMessage);

    // Status link
    let statusLink = 'https://status.bigtincan.com';
    if (window.location.origin.indexOf('bigtincan.co') > -1) {
      statusLink = window.location.origin.replace(/appnext|app/, 'status');
    }

    return (
      <div className={styles.Download}>
        <ColourScheme
          //varSelectors={window.BTC.scheme}
          vars={theme}
        />
        <header className={styles.header}>
          <div className={styles.logo}>
            <a href="/" title={companyName} style={{ backgroundImage: `url(${logo})` }}>{companyName}</a>
          </div>
          <h1>{strings.apps}</h1>
          <div className={styles.signIn}>
            <Btn
              alt
              large
              href="/"
            >
              {strings.signIn}
            </Btn>
          </div>
        </header>

        <div className={downloadWrapClasses}>
          {iosEnabled && <section className={styles.ios} data-id="ios">
            <h2>{strings.ios}</h2>
            <p>{strings.availableForiOSVersion}</p>
            <Btn
              href={iosAppDownload}
              inverted
              large
              onClick={this.handleNewWindowAnchorCLick}
              className={styles.download}
            >
              {strings.download}
            </Btn>
          </section>}

          {androidEnabled && <section className={styles.android} data-id="android">
            <h2>{strings.android}</h2>
            <p>{strings.availableForAndroidVersion}</p>
            <Btn
              href={androidAppDownload}
              inverted
              large
              onClick={this.handleNewWindowAnchorCLick}
              className={styles.download}
            >
              {strings.download}
            </Btn>
          </section>}

          {windowsEnabled && <section className={styles.windows} data-id="web">
            <h2>{strings.windows}</h2>
            <p>{strings.availableForWindowsVersion}</p>
            <Btn
              href={windowsAppDownload}
              inverted
              large
              onClick={this.handleNewWindowAnchorCLick}
              className={styles.download}
            >
              {strings.download}
            </Btn>
          </section>}
        </div>

        {/* TODO - Hiding until DevOps Set a repository for the app links */}
        <div className={styles.pluginsWrapper}>
          <h2>{strings.plugins}</h2>
          <section>
            <div className={styles.powerpointPlugin}>
              <h3>{strings.powerpointPlugin}</h3>
              <p><a href="/windows">{strings.download}</a> {strings.forWindows}</p>
            </div>
            <div className={styles.outlookPlugin}>
              <h3>{strings.outlookPlugin}</h3>
              <p><a href="/office">{strings.download}</a> {strings.forOffice}</p>
            </div>
          </section>
        </div>

        <footer className={styles.copyright}>
          <ul>
            <li data-id="copyright">&copy; {year} Bigtincan</li>
            <li data-id="agreements">
              <a href="/agreements.html" aria-label={strings.agreements}>
                {strings.agreements}
              </a>
            </li>
            <li data-id="status">
              <a href={statusLink} rel="noopener noreferrer" target="_blank" aria-label={strings.systemStatus}>
                {strings.systemStatus}
              </a>
            </li>
          </ul>
        </footer>
      </div>
    );
  }
}
