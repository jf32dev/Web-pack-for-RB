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
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import AppViewer from 'components/ViewerFiles/AppViewer/AppViewer';

const AppViewerDocs = require('!!react-docgen-loader!components/ViewerFiles/AppViewer/AppViewer.js');

const tabs = require('../../static/tabs.json');
const channels = require('../../static/channels.json');
const stories = require('../../static/stories.json');

export default class AppViewerView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  handleFrameLoad() {
    console.log('iframe loaded');
  }

  handleFrameError() {
    console.log('iframe error');
  }

  handleMessage(event) {
    const data = event.data;

    // Check source and valid data is passed
    if (
      data.source === 'btc-js-bridge' &&
      data.action &&
      data.data &&
      data.data.action
    ) {
      const response = this.handleRequest.call(this, data, event);
      this.handleMessageCallback(response, event);
    }
  }

  handleMessageCallback(response, event) {
    const data = {
      result: response.result,
      error: response.error,
      originalRequest: event.data,
      requestParameter: {
        requestId: event.data.data.requestId,
        originalJsListener: event.data.data.jsListener
      }
    };
    event.source.postMessage(data, '*');
  }

  handleRequest(event) {
    const response = {
      result: [],
      error: null
    };

    switch (event.data.action) {
      case 'getAccessToken':
        response.result = 'f4k34cc355t0k3nf0rth3hu8';
        break;
      case 'getList':
        switch (event.data.data.entityName) {
          case 'tab':
            response.result = tabs;
            break;
          case 'channel':
            response.result = channels;
            break;
          case 'story':
            response.result = stories;
            break;
          default:
            response.error = {
              code: null,
              message: 'Invalid entityName specified: ' + event.data.data.entityName
            };
            break;
        }
        break;
      default:
        response.error = {
          code: null,
          message: 'Invalid action specified: ' + event.data.action
        };
        break;
    }
    return response;
  }

  render() {
    return (
      <section id="AppViewerView">
        <h1>AppViewer</h1>
        <Docs {...AppViewerDocs} />

        <ComponentItem style={{ height: 640 }}>
          <AppViewer
            baseUrl="https://localhost:2000/examples/tester"
            referrer={document.location.origin}
            handle="AppViewer"
            onLoad={this.handleFrameLoad}
            onError={this.handleFrameError}
          />
        </ComponentItem>
      </section>
    );
  }
}
