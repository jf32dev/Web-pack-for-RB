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

/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-plusplus */

import _startCase from 'lodash/startCase';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import exportWAV from './EncodeWav';

/**
 * My Firefox browser doesn't support mediaRecorder's resume and pause function, so I use the old way to record audio.
 * Without resume and pause, the audio file would have empty sound during the pause time.
 * I use audioContext, make the kpbs lower and use single channel so the output wav could be smaller.
 * this component is only use for Moz.
 */
export default class RecorderMoz extends PureComponent {
  static propTypes = {
    /** callback when the record function stop recording and return the audio buffer and other related data */
    onAudioOutPut: PropTypes.func,
    /** callback the time every second when the recorder is recording */
    onDurationOutPut: PropTypes.func,
    onAudioProcessStart: PropTypes.func,
    onError: PropTypes.func,
    /** control recording audio */
    command: PropTypes.oneOf(['none', 'start', 'pause', 'stop', 'resume']),
  };

  static defaultProps = {
    stop: false,
    prevLength: 0,
  };

  constructor(props) {
    super(props);

    this.buffers = [[], []];
    this.bufferLength = 0;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sampleRate = this.audioContext.sampleRate;
    this.recordingStream = null;
    this.prevTime = 0;

    autobind(this);
  }

  componentDidUpdate (prevProps) {
    const { command } = this.props;

    if (command && command !== 'none' && prevProps.command !== command) {
      this['on' + _startCase(command)]();
    }
  }

  componentWillUnmount() {
    if (this.recordingStream) {
      this.recordingStream.getTracks()[0].stop();
    }

    if (this.audioContext) {
      this.audioContext.close();
    }
    this.audioContext = null;
    this.recordingStream = null;
    this.buffers = null;
    this.sampleRate = null;
    this.bufferLength = null;
    window.clearTimeout(this.recordTimeout);
  }

  onStart() {
    if (this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const volume = this.audioContext.createGain();
      const audioSource = this.audioContext.createMediaStreamSource(stream);
      volume.gain.value = 0.7;
      audioSource.connect(volume);

      const bufferSize = 2048;
      //only use single channel to record audio, make the size smaller
      const recorder = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      let currentTime = 0;
      recorder.onaudioprocess = (event) => {
        // save left and right buffers
        for (let i = 0; i < 1; i++) {
          const channel = event.inputBuffer.getChannelData(i);
          if (this.buffers) {
            this.buffers[i].push(new Float32Array(channel));
          }
        }
        this.bufferLength += bufferSize;

        currentTime = parseInt(this.bufferLength / this.sampleRate * 1000, 10);
        if (this.prevTime / 70 < currentTime / 70) {
          this.prevTime = currentTime;
          this.props.onDurationOutPut(this.prevTime);
        }
      };

      volume.connect(recorder);
      recorder.connect(this.audioContext.destination);
      this.recordingStream = stream;
      this.audioContext.resume();
    }).catch((err) => {
      this.props.onError(err.name);
    });
  }

  onPause() {
    this.audioContext.suspend().then(
      () => {
        if (this.props.onAudioOutPut) {
          this.props.onAudioProcessStart();
          this.recordTimeout = window.setTimeout(() => {
            //use lower kpbs to make the size smaller
            const audioData = exportWAV(this.buffers, this.bufferLength, this.sampleRate, 44100 / 6);
            this.props.onAudioOutPut(audioData);
          }, 0);
        }
      }
    );
  }

  onResume() {
    this.audioContext.resume();
  }

  onStop() {
    this.recordingStream.getTracks()[0].stop();
    this.audioContext.close();
    navigator.getUserMedia = null;
    this.buffers = [[], []];
    this.bufferLength = 0;
    this.recordingStream = null;
    this.prevTime = 0;
  }

  render() {
    return false;
  }
}
