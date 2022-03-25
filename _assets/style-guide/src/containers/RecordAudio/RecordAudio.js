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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import { RecordAudio } from 'components';

const RecordAudioDocs = require('!!react-docgen-loader!components/RecordAudio/RecordAudio.js');

export default class AudioRecorderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastEvent: null
    };
    autobind(this);
  }

  handleAttachClick(event, audio) {
    const obj = {
      size: audio.size,
      type: audio.type
    };
    this.setState({ lastEvent: JSON.stringify(obj) });
    console.log(audio);
  }

  handleCancelClick() {
    this.setState({ lastEvent: 'cancel' });
  }

  handleStart() {
    this.setState({ lastEvent: 'started' });
  }

  handleStop() {
    this.setState({ lastEvent: 'stopped' });
  }

  handleReset() {
    this.setState({ lastEvent: 'reset' });
  }

  handleError(error) {
    console.warn(error.message);
    this.setState({ lastEvent: error.message });
  }

  handlePlayStart() {
    this.setState({ lastEvent: 'play start' });
  }

  handlePlayStop() {
    this.setState({ lastEvent: 'play stop' });
  }

  render() {
    const { lastEvent } = this.state;

    return (
      <section id="RecordAudioView">
        <h1>RecordAudio</h1>
        <Docs {...RecordAudioDocs} />
        <Debug>
          <div>
            <code>lastEvent: {lastEvent}</code>
          </div>
        </Debug>
        <p>Latest Google Chrome or Mozilla Firefox would support this feature</p>
        <p>If the browser does not support this feature, the component would have warning message and disable all the buttons.</p>
        <p><a href="http://caniuse.com/#feat=mediarecorder" target="_blank">http://caniuse.com/#feat=mediarecorder</a></p>
        <p>This Component only support Chrome and Chrome for Android</p>
        <p><b>Caution:</b></p>
        <small><p>getUserMedia() no longer works on insecure origins.</p>
        <p>To use this feature, you should consider switching your application to a secure origin,</p>
        <p>such as HTTPS. See https://goo.gl/rStTGz for more details.</p></small>
        <ComponentItem>
          <RecordAudio
            onAttachClick={this.handleAttachClick}
            onCancelClick={this.handleCancelClick}
            onStart={this.handleStart}
            onStop={this.handleStop}
            onReset={this.handleReset}
            onError={this.handleError}
            onPlayStart={this.handlePlayStart}
            onPlayStop={this.handlePlayStop}
          />
        </ComponentItem>
      </section>
    );
  }
}
