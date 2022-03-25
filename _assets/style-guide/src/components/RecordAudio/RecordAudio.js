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
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import moment from 'moment';

import Btn from 'components/Btn/Btn';
import RadialProgressBtn from './RadialProgressBtn';
import RecorderMoz from './RecorderMoz';

/** convert seconds to 23:59:59 format */
function convertTime(ms) {
  if (ms >= 3600000) {
    return moment.utc(moment.duration(ms).asMilliseconds()).format('H:mm:ss.SS');
  }
  return moment.utc(moment.duration(ms).asMilliseconds()).format('mm:ss.SS');
}

/**
 * Press the "mic" button to start recording and the "mic" button would convert to "stop" button,
 * when you want to stop recording, press the "stop",
 * the "stop" button would convert back to "mic" button and the "play" button and "reset" button would show up.
 * You could then play the audio, keep recording or reset the recording.
 * When you stop recording, the "attach" button below would become active and then you could get your audio file.
 */
export default class RecordAudio extends Component {
  static propTypes = {
    /** Return event, and audio blob */
    onAttachClick: PropTypes.func,

    /** Click cancel would reset the component and return event and context */
    onCancelClick: PropTypes.func,

    onStart: PropTypes.func,
    onStop: PropTypes.func,
    onReset: PropTypes.func,

    onPlayStart: PropTypes.func,
    onPlayStop: PropTypes.func,

    /** Handle error from Recorder */
    onError: PropTypes.func,

    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      recordAudio: 'Record Audio',
      reset: 'Reset',
      attach: 'Attach',
      cancel: 'Cancel',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      /** control recorder 'none', 'start', 'suspend', 'reset', 'resume' */
      recordCommand: 'none',

      /** audio player start playing or not */
      playerStart: false,
      duration: 0,

      /** audio data file */
      audio: null,

      /** audio ongoing time */
      playProgress: 0,

      /** audio total time duration */
      audioDuration: 0,
      disableRecordBtn: false,
      error: false,
    };
    autobind(this);

    // refs
    this.audioPlayer = null;
  }

  componentDidMount() {
    const audioPlayer = this.audioPlayer;
    /** increase the frequency of the callback */
    audioPlayer.addEventListener('play', (e) => {
      this.audioClock = window.setInterval(() => {
        this.handlePlayerTimeUpdate(e);
      }, 70);
    });

    audioPlayer.addEventListener('pause', () => {
      window.clearInterval(this.audioClock);
    });

    audioPlayer.addEventListener('load', () => {
      window.clearInterval(this.audioClock);
    });
  }

  componentWillUnmount() {
    window.clearTimeout(this.playTimeout);
    window.clearInterval(this.audioClock);
  }

  handleStart(event) {
    if (this.audioPlayer) {
      this.audioPlayer.load();
    }
    if (!this.state.disableRecordBtn) {
      this.setState({
        playerStart: false,
        playProgress: 0,
        recordCommand: this.state.recordCommand === 'pause' ? 'resume' : 'start'
      });
    }
    if (typeof this.props.onStart === 'function') {
      this.props.onStart(event, this.audioPlayer);
    }
  }

  /** Pause recording */
  handlePause(event) {
    if (!this.state.disableRecordBtn && !this.state.error) {
      this.setState({ recordCommand: 'pause', playerStart: false });
    }

    if (typeof this.props.onStop === 'function') {
      this.props.onStop(event, this.audioPlayer);
    }
  }

  /** Reset recording */
  handleReset(event) {
    if (this.audioPlayer) {
      this.audioPlayer.load();
    }

    this.setState({ recordCommand: 'stop', playerStart: false, duration: 0 });

    if (typeof this.props.onReset === 'function') {
      this.props.onReset(event, this.audioPlayer);
    }
  }

  /** set the audio file when RecordAudio reply audio file */
  handleRecordAudioOutput(audio) {
    this.setState({ audio, audioDuration: this.state.duration, disableRecordBtn: false, });
    if (this.audioPlayer) {
      this.audioPlayer.load();
    }
  }

  /** set the ongoing duration time when recording and show it in the component */
  handleRecordDuration(duration) {
    this.setState({ duration });
  }

  /** when clicking the left side button (small button for play audio and stop audio),
   * stop or play the audio and update the duration time
   */
  handlePlayerControl(event) {
    if (this.state.playerStart) {
      this.audioPlayer.load();
      this.setState({
        duration: 0
      });

      if (typeof this.props.onPlayStop === 'function') {
        this.props.onPlayStop(event, this.audioPlayer);
      }
    } else {
      this.audioPlayer.play();

      if (typeof this.props.onPlayStart === 'function') {
        this.props.onPlayStart(event, this.audioPlayer);
      }
    }

    this.setState({ playerStart: !this.state.playerStart, playProgress: 0 });
  }

  /** when audio is finished,
   * update the left side button to play button and reset the duration.
   */
  handlePlayerEnded(event) {
    // Add delay when ending playing to allow progress display to complete
    this.playTimeout = window.setTimeout(() => {
      this.setState({ playerStart: false, playProgress: 0 });

      if (typeof this.props.onPlayStop === 'function') {
        this.props.onPlayStop(event, this.audioPlayer);
      }
    }, 500);
  }

  /** update duration time when playing audio.*/
  handlePlayerTimeUpdate(event) {
    if (this.state.recordCommand === 'pause' && this.state.playerStart) {
      this.setState({
        playProgress: event.target.currentTime / this.state.audioDuration * 100 * 1000,
        duration: event.target.currentTime * 1000
      });
    }
  }

  /** Recorder throws error if feature is unsupported */
  handleRecorderError(error) {
    this.setState({
      error: true,
      playerStart: false,
      playProgress: 0,
      duration: 0,
      recordCommand: 'none',
      disableRecordBtn: false,
    });
    if (typeof this.props.onError === 'function') {
      this.props.onError(error);
    }
    console.warn(error);
  }

  // handleMissingAPIs(error) {
  //   this.setState({ error: true, disableRecordBtn: true });
  //   if (typeof this.props.onError === 'function') {
  //     this.props.onError(error);
  //   }
  //   console.warn(error);
  // }

  /** callback to return audio blob.*/
  handleAttachClick(event) {
    this.setState({
      playerStart: false,
      playProgress: 0,
      duration: 0,
      recordCommand: 'stop',
      disableRecordBtn: false,
    });

    if (this.audioPlayer) {
      this.audioPlayer.load();
    }

    this.props.onAttachClick(event, this.state.audio);
  }

  /** when clicking the cancel button, reset the values. */
  handleCancelClick(event) {
    if (!this.state.error) {
      this.setState({
        playerStart: false,
        playProgress: 0,
        duration: 0,
        recordCommand: 'stop',
        //disableRecordBtn: false,
      });
    }

    if (this.audioPlayer) {
      this.audioPlayer.load();
    }

    this.props.onCancelClick(event, this);
  }

  handleWaitForAudio() {
    this.setState({ disableRecordBtn: true });
  }

  render() {
    const { strings: { recordAudio, reset, attach, cancel }, style, className } = this.props;
    const { recordCommand, playerStart, duration, playProgress, error, disableRecordBtn } = this.state;
    const styles = require('./RecordAudio.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AudioRecorder: true
    }, className);
    const btnLeftClasses = cx({
      roundMedium: true,
      hidden: recordCommand !== 'pause' || disableRecordBtn,
      displayNone: playerStart
    });

    const btnRightClasses = cx({
      borderLessCustom: true,
      hidden: recordCommand !== 'pause' || disableRecordBtn,
    });

    const btnHiddenClasses = cx({
      hidden: recordCommand !== 'pause' || disableRecordBtn,
      displayNone: !playerStart
    });

    const attachBtnClasses = cx({
      disabledBtn: recordCommand !== 'pause' || disableRecordBtn,
    });

    const isStopOrResume = error ? !error : recordCommand === 'start' || recordCommand === 'resume';

    const btnCenterClasses = cx({
      micIconBtn: !isStopOrResume,
      stopIconBtn: isStopOrResume,
      disabledBtn: disableRecordBtn,
    });
    //TODO need to use just one recorder for all the browser in the future
    return (
      <div className={classes} style={style}>
        <div className={styles.title}>{recordAudio}</div>
        <div className={styles.time}>{convertTime(duration)}</div>
        <div className={styles.icon}>
          <div className={styles.btnHeight}>
            <Btn
              icon="play"
              className={btnLeftClasses}
              onClick={this.handlePlayerControl}
            />
            <RadialProgressBtn
              className={btnHiddenClasses}
              onClick={this.handlePlayerControl}
              icon="stop-fill"
              percentage={playProgress}
            />
          </div>
          <Btn
            icon={isStopOrResume ? 'stop' : 'microphone'}
            inverted
            className={btnCenterClasses}
            disabled={disableRecordBtn}
            onClick={isStopOrResume ? this.handlePause : this.handleStart}
          />
          <div>
            <Btn
              borderless large className={btnRightClasses}
              onClick={this.handleReset}
            >{reset}</Btn>
          </div>
        </div>
        <div className={styles.btns}>
          <Btn
            borderless alt large
            onClick={this.handleCancelClick}
          >{cancel}</Btn>
          <Btn
            inverted
            large
            disabled={recordCommand !== 'pause' || disableRecordBtn}
            onClick={this.handleAttachClick}
            className={attachBtnClasses}
          >{attach}</Btn>
        </div>
        <div style={{ display: 'none' }}>
          <RecorderMoz
            onAudioOutPut={this.handleRecordAudioOutput}
            onDurationOutPut={this.handleRecordDuration}
            command={recordCommand}
            onAudioProcessStart={this.handleWaitForAudio}
            onError={this.handleRecorderError}
          />
          <audio
            preload="auto"
            ref={(c) => { this.audioPlayer = c; }}
            onEnded={this.handlePlayerEnded}
          >
            {this.state.audio && <source
              src={this.state.audio && (window.URL || window.webkitURL).createObjectURL(this.state.audio)}
              type="audio/wav"
            />}
          </audio>
        </div>
      </div>
    );
  }
}
