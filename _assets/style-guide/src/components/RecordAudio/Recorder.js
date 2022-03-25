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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import _startCase from 'lodash/startCase';

/**
 * Recorder Component
 */
export default class Recorder extends PureComponent {
  static propTypes = {
    command: PropTypes.oneOf(['start', 'stop', 'pause', 'resume', 'none']),
    onError: PropTypes.func,
    onAudioOutPut: PropTypes.func,
    onDurationOutPut: PropTypes.func,
    onAudioProcessStart: PropTypes.func,
  };

  static defaultProps = {
    command: 'none',
  };

  constructor(props) {
    super(props);

    autobind(this);
  }

  componentDidMount() {
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.webkitGetUserMedia);

    if (!navigator.getUserMedia || !window.MediaRecorder) {
      /** browser support issue */
      const { onMissingAPIs } = this.props;
      if (typeof onMissingAPIs === 'function') {
        onMissingAPIs('Audio recording APIs not supported by this browser');
      }
    }
    this.chunks = [];

    navigator.getUserMedia = null;
  }

  componentDidUpdate (prevProps) {
    const { command } = this.props;
    //different command fire different function
    if (command && command !== 'none' && prevProps.command !== command) {
      this['on' + _startCase(command)]();
    }
  }

  componentWillUnmount() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stream.getTracks()[0].stop();
    }
    window.clearTimeout(this.recordTimeout);
  }

  onStart () {
    /** */
    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.webkitGetUserMedia);

    if (navigator.getUserMedia && window.MediaRecorder) {
      const constraints = { audio: true };
      const { onAudioOutPut, onDurationOutPut, onAudioProcessStart, onError } = this.props;

      // Propagate errors
      const onErr = (err) => {
        if (typeof onError === 'function') {
          onError(err.name);
        }
      };

      this.duration = {};

      const onSuccess = stream => {
        this.mediaRecorder = new window.MediaRecorder(stream);
        // mimeType: 'video/mpeg' s
        this.mediaRecorder.ondataavailable = e => {
          this.chunks.push(e.data);
          /** duration function */
          this.duration.current = e.timeStamp - this.duration.start;
          /** fire call back every second with updated duration */
          const previousInt = parseInt(this.duration.previous + this.duration.total, 10);
          const currentInt = parseInt(this.duration.current + this.duration.total, 10);

          if (currentInt > previousInt && this.props.command !== 'stop' && this.props.command !== 'pause') {
            onDurationOutPut(this.duration.previous + this.duration.total);
          }

          if (this.duration.current > this.duration.previous) {
            this.duration.previous = this.duration.current;
          }
        };
        /** empty the data */
        this.mediaRecorder.onstop = () => {
          this.chunks = [];
          this.duration.start = 0;
        };
        /** output the data when command is pause */
        this.mediaRecorder.onpause = () => {
          this.duration.total = this.duration.current + this.duration.total;

          if (onAudioOutPut) {
            onAudioProcessStart();
            this.recordTimeout = window.setTimeout(() => {
              const blob = new window.Blob(this.chunks, { mimeType: 'audio/wav' });
              if (this.duration.start !== 0) {
                onAudioOutPut(blob);
              }
            }, 0);
          }
        };

        this.mediaRecorder.onresume = (e) => {
          this.duration.start = e.timeStamp;
          this.duration.previous = 0;
        };

        this.mediaRecorder.onstart = (e) => {
          this.duration = {
            start: e.timeStamp,
            previous: 0,
            total: 0
          };
        };

        this.mediaRecorder.onerror = onErr;
        this.mediaRecorder.start(50);
      };

      navigator.getUserMedia(constraints, onSuccess, onErr);
      //navigator.mediaDevices.getUserMedia(constraints).then(onSuccess).catch(onErr);
    }
  }

  onStop () {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      // //turn off mediaRecorder when stop
      this.mediaRecorder.stream.getTracks()[0].stop();
    }
  }

  onPause () {
    if (this.mediaRecorder) {
      this.mediaRecorder.pause();
    }
  }

  onResume () {
    if (this.mediaRecorder) {
      this.mediaRecorder.resume();
    }
  }

  render() {
    return false;
  }
}
