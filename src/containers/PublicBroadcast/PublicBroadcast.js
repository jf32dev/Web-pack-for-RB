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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  loadStatus,
  joinBroadcast,
  close,
} from 'redux/modules/publicShare';
import { createPrompt } from 'redux/modules/prompts';

import Blankslate from 'components/Blankslate/Blankslate';
import Broadcast from 'components/Broadcast/Broadcast';
import BroadcastLogin from 'components/Broadcast/BroadcastLogin';
import Loader from 'components/Loader/Loader';
import Prompts from 'containers/Prompts/Prompts';

const Footer = (props) => (
  <ul className={props.styles.copyright}>
    <li>&copy; {new Date().getFullYear()} bigtincan</li>
    <li><a href="/agreements.html" onClick={props.onClick}>{props.strings.agreements}</a></li>
    <li><a href="/download.html" onClick={props.onClick}>{props.strings.mobileApps}</a></li>
  </ul>
);

const messages = defineMessages({
  agreements: { id: 'agreements', defaultMessage: 'Agreements' },
  mobileApps: { id: 'mobile-apps', defaultMessage: 'Mobile Apps' },
  broadcastNoPasswordMessage: {
    id: 'broadcast-no-password-message',
    defaultMessage: 'To view the broadcast, enter your email address:'
  },
  broadcastPasswordMessage: {
    id: 'broadcast-password-message',
    defaultMessage: 'To view the broadcast, enter your email address and the password you recieved'
  },
  broadcastOffLiveMessage: {
    id: 'broadcast-off-live-message',
    defaultMessage: 'There is currently no live broadcast.'
  },
  emailErrorMessage: {
    id: 'email-error-message',
    defaultMessage: 'The Email Address is in an invalid format.'
  },
  email: { id: 'email', defaultMessage: 'Email' },
  view: { id: 'view', defaultMessage: 'View' },
  roomId: { id: 'room-id', defaultMessage: 'Room Id' },
  password: { id: 'password', defaultMessage: 'Password' },
  live: { id: 'live', defaultMessage: 'live' },
  offline: { id: 'offline', defaultMessage: 'offline' },
});

function mapStateToProps(state) {
  const { publicShare } = state;

  return {
    broadcast: publicShare,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadStatus,
    joinBroadcast,
    createPrompt,
    close,
  })
)
export default class PublicBroadcast extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static childContextTypes = {
    settings: PropTypes.object
  };

  static defaultProps = {
    broadcast: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      //isViewersVisible: false,
      customStyle: {}
    };
    this.firstTime = true;
    autobind(this);
  }

  getChildContext() {
    return {
      settings: {}
    };
  }

  UNSAFE_componentWillMount() {
    this.handleGetStatus();

    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = window.setInterval(this.handleGetStatus, 5000);
    const isIPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); /* iPad OS 13 */
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i || isIPad)) {
      const viewportmeta = document.querySelector('meta[name="viewport"]');
      if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (_get(nextProps, 'broadcast.isBlankSlateError', false)) {
      this.handleClearInterval();
    }

    if (_get(nextProps, 'broadcast.isFormattedMessageError', false)) {
      this.props.createPrompt({
        id: 'warning',
        type: 'warning',
        title: 'Warning',
        message: nextProps.broadcast.error.message,
        dismissible: true,
        autoDismiss: 2
      });
    }

    /*
    if (!nextProps.broadcast.joined && this.state.isViewerVisible) {
      this.setState({
        isViewersVisible: false,
      });
    }
    */
  }

  // componentDidUpdate() {
  //   if (this.props.broadcast.joined && this.props.broadcast.indexFileData) {
  //     this.setupFrame();
  //   }
  // }

  componentWillUnmount() {
    this.handleClearInterval();
  }

  handleLogin(nickname, pwd) {
    this.handleClearInterval();
    const roomId = _get(this.props.match, 'params.publicBroadcastId', false);
    if (roomId) {
      this.props.joinBroadcast(nickname, roomId, pwd);
    }
  }

  handleAnchorClick(event) {
    const href = event.currentTarget.getAttribute('href');

    // Default browser action if static html clicked
    if (href.indexOf('.html') === -1) {
      event.preventDefault();
      this.props.history.push(href);
    }
  }

  handleBroadcastClick(event) {
    const action = _get(event, 'currentTarget.dataset.action', '');
    if (action === 'exit') {
      this.props.close();
      this.handleGetStatus();
      if (this.timer) {
        window.clearInterval(this.timer);
      }
      this.timer = window.setInterval(this.handleGetStatus, 5000);
    }
  }

  handleGetStatus() {
    if (this.props.loadStatus && this.props.match.params.publicBroadcastId) {
      this.props.loadStatus(this.props.match.params.publicBroadcastId, this.firstTime);
      if (this.firstTime) {
        this.firstTime = false;
      }
    }
  }

  handleClearInterval() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  handleFrameError(event) {
    event.preventDefault();
    return false;
  }

  // Recieve message from BTC iFrame
  // receiveMessage(event) {
  //   const data = event.data;
  //
  //   if (typeof data === 'string' && data.indexOf('slideshowtimeupdate') < 0) {
  //     // Total Slides
  //     console.log(data);
  //   }
  // }

  handleSizeChange(customStyle) {
    window.scrollTo(0, 0);
    this.setState({
      customStyle
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { broadcast } = this.props;
    const styles = require('./PublicBroadcast.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PublicBroadcast: true,
    });

    const centerMiddleClass = cx({
      centerMiddle: _get(broadcast, 'joined', false),
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);
    const isLogin = broadcast.loaded || broadcast.loading;
    // Test
    let htmlCode = '';

    if (broadcast.joined) {
      const { baseUrl, indexFileData, nickname } = broadcast;
      htmlCode = indexFileData;
      if (indexFileData.indexOf('<head>') > 0) {
        htmlCode = indexFileData.replace('<head>', `<head><base href="${baseUrl}" />`);
      } else {
        htmlCode = indexFileData.replace('</head>', `<base href="${baseUrl}" /></head>`);
      }

      htmlCode = htmlCode.replace('</body>', `</body><script type="text/javascript">audienceUser="${nickname}"</script>`);
    }

    return (
      <div className={classes} style={broadcast.joined ? this.state.customStyle : {}}>
        <Prompts />
        {broadcast.isBlankSlateError && <Blankslate
          icon="wheelbarrow"
          iconSize={128}
          message={broadcast.error.message}
        />}
        {isLogin && broadcast.companyLogo && !broadcast.isBlankSlateError && !broadcast.joined && <img src={broadcast.companyLogo} alt="logo" className={styles.logo} />}
        {!broadcast.isBlankSlateError && <div className={centerMiddleClass} style={broadcast.joined ? this.state.customStyle : {}}>
          {!isLogin && !broadcast.joined && <Loader type="page" />}
          {isLogin && !broadcast.joined && <BroadcastLogin {...broadcast} onLogin={this.handleLogin} strings={strings} />}
          <Broadcast
            broadcast={broadcast}
            watermark={broadcast.watermark}
            htmlCode={htmlCode}
            onClick={this.handleBroadcastClick}
            className={!broadcast.joined ? styles.moveHide : ''}
            strings={strings}
            onSizeChange={this.handleSizeChange}
            style={this.state.customStyle}
          />
        </div>}
        {isLogin && !broadcast.joined && <Footer styles={styles} strings={strings} onClick={this.handleAnchorClick} />}
      </div>
    );
  }
}
