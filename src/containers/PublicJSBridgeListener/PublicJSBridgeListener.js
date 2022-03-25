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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  openURL,
  postMessage,
  bridgeError
} from 'redux/modules/jsbridge/actions';

function mapStateToProps(state) {
  const { jsbridge } = state;
  const unsentResponses = [];

  // Map unsent responses
  Object.keys(jsbridge).forEach(app => {
    jsbridge[app].requests.forEach(id => {
      if (jsbridge[app].responsesById[id] && !jsbridge[app].responsesById[id].sent) {
        unsentResponses.push({
          response: jsbridge[app].responsesById[id],
          originalRequest: jsbridge[app].requestsById[id],
        });
      }
    });
  });

  return {
    ...jsbridge,
    unsentResponses
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    openURL,
    postMessage,
    bridgeError
  })
)
export default class PublicJSBridgeListener extends PureComponent {
  static propTypes = {
    unsentResponses: PropTypes.array,
    postMessage: PropTypes.func,
    bridgeError: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // window sources for postMessage
    this.source = {};

    // Define valid actions
    this.validActions = [
      'openURL',
      'sendEmail',
      'getSystemConfig',
      'getStoryDescription',
      'storyDescriptionHeight'
    ];

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('message', this.handleMessage);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.unsentResponses.length) {
      nextProps.unsentResponses.forEach(r => {
        this.sendBridgeResponse(r);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  sendBridgeResponse(r) {
    const handle = r.originalRequest.handle;
    if (handle && this.source[handle]) {
      this.handleMessageCallback(
        r.response,
        r.originalRequest,
        this.source[handle].source,
        this.source[handle].origin
      );
    }
  }

  openInNewWindow(url) {
    // If we're missing a protocol, assume http
    let fixedUrl = url;
    if (fixedUrl.indexOf('://') === -1) {
      fixedUrl = 'http://' + url;
    }

    // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
    const newWindow = window.open(fixedUrl);
    newWindow.opener = null;
  }

  handleMessage(event) {
    const data = event.data;

    // Parse btca.js source
    if (data.source === 'btc-js-bridge' && data.action && data.data && data.data.action) {
      // Check source and valid data is passed
      if (this.validActions.indexOf(data.data.action) > -1) {
        const { action } = data.data;

        // app window source
        if (!this.source[data.handle]) {
          this.source[data.handle] = {
            source: event.source,
            origin: event.origin
          };
        }

        switch (action) {
          case 'openURL':
            this.props.onOpenURL(data, this.handleBridgeResult);
            break;
          case 'sendEmail':
            this.props.onSendEmail(data, this.handleBridgeResult);
            break;
          case 'getSystemConfig':
            this.props.onGetSystemConfig(data, this.handleBridgeResult);
            break;
          case 'getStoryDescription':
            this.props.onGetStoryDescription(data, this.handleBridgeResult);
            break;
          case 'storyDescriptionHeight':
            this.props.onStoryDescriptionHeight(data, this.handleBridgeResult);
            break;
          default:
            console.info(action + ' not handled');  // eslint-disable-line
            break;
        }

      //  Invalid action passed
      } else {
        this.handleInvalidAction(data);
      }
    }
  }

  handleInvalidAction(data) {
    const { action } = data.data;
    console.warn('Invalid Request: ' + action)  // eslint-disable-line
    this.props.bridgeError(data, {
      code: 100,
      message: 'Invalid Request'
    });
  }

  handleGetSystemConfig(data) {
    const result = this.props.systemConfig;
    this.props.getSystemConfig(data, result);
  }

  handleBridgeResult(result, originalRequest) {
    const r = {
      response: result,
      originalRequest: originalRequest
    };
    this.sendBridgeResponse(r);
  }

  handleMessageCallback(response, originalRequest, source, origin) {
    const data = {
      result: response.result,
      error: response.error,
      originalRequest: originalRequest
    };

    // postMessage handled in reducer
    this.props.postMessage(data, source, origin);
  }

  render() {
    return null;
  }
}
