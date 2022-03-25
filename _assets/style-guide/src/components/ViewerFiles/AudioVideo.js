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

/* eslint-disable no-restricted-globals */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Combokeys from 'combokeys';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Blankslate from 'components/Blankslate/Blankslate';
import Loader from 'components/Loader/Loader';
import MediaControls from 'components/Viewer/MediaControls';
import SVGIcon from 'components/SVGIcon/SVGIcon';

/**
 * Displays an <code>audio</code> or <code>video</code> file with playback controls.
 */
export default class AudioVideo extends Component {
  static propTypes = {
    /** expects a mp4 for video/audio */
    url: PropTypes.string,

    /** expects a webm fallback for video */
    alternateUrl: PropTypes.string,
    title: PropTypes.string,

    /** displays as a placeholder before video playback */
    thumbnail: PropTypes.string,

    /** defaults to 50% (video only) */
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** defaults to 50% (video only) */
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Required for iOS Safari */
    autoPlay: PropTypes.bool,

    /** Start playback at time in seconds */
    startTime: PropTypes.number,

    /** Alternate styling and controls applied */
    isVideo: PropTypes.bool,
    errorMessage: PropTypes.string,

    authString: PropTypes.string,

    onFullscreenClick: function validateFullScreenClick(props, propName) {
      if (props.isVideo && !props[propName]) {
        return new Error('onFullscreenClick is required for video');
      }
      return null;
    },

    onLoadedData: PropTypes.func,
    onLoadedMetadata: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    errorMessage: '404 (Not Found)',
    width: '50%',
    height: '50%',
    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      elapsed: 0,
      expanded: false,
      playing: false,
      buffer: 0,
      volume: 0.7,
      loaded: false
    };
    autobind(this);

    // refs
    this.elem = null;
    this.frame = null;
  }

  componentDidMount() {
    // Bind shortcut keys
    if (this.frame) {
      this.combokeys = new Combokeys(this.frame);

      this.combokeys.bind(['space', 'k'], this.handlePlayClick);
      this.combokeys.bind(['f'], this.props.onFullscreenClick);
      this.combokeys.bind(['left'], this.skipBackward);
      this.combokeys.bind(['right'], this.skipForward);

      this.frame.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.activeFileId !== prevProps.activeFileId) {
      this.handlePause();
      this.elem.pause();
    }
  }

  componentWillUnmount() {
    if (this.combokeys) {
      this.combokeys.detach();
    }
  }

  skipForward() {
    this.elem.currentTime = this.elem.currentTime + 10;
  }

  skipBackward() {
    this.elem.currentTime = this.elem.currentTime - 10;
  }

  handleLoadedData(event) {
    this.setState({ loaded: true });

    if (this.props.onLoadedData) {
      this.props.onLoadedData(event);
    }
  }

  handleLoadedMetadata(event) {
    const duration = event.target.duration;
    this.setState({ duration: duration });

    if (this.props.onLoadedMetadata) {
      this.props.onLoadedMetadata(event);
    }
  }

  handleError(event) {
    if (this.props.onError) {
      this.props.onError(event);
    }
  }

  handlePause() {
    this.setState({ playing: false });
  }

  handlePlay() {
    this.setState({ playing: true });
  }

  handleProgress() {
    // Check file has begun downloading
    if (this.elem.buffered.length > 0 && this.elem.duration !== Infinity) {
      const bufferEnd = this.elem.buffered.end(0);  // time in seconds buffered till
      const bufferedDecimal = (bufferEnd / this.state.duration);
      if (!isNaN(bufferedDecimal) && bufferedDecimal > 0 && bufferedDecimal < 1) {
        this.setState({ buffer: bufferedDecimal });
      }
    }
  }

  handleTimeUpdate(event) {
    this.setState({ elapsed: event.target.currentTime });
  }

  handleVolumeChange(event) {
    this.setState({ volume: event.target.volume });
  }

  handlePlayClick() {
    if (this.state.playing) {
      this.elem.pause();
    } else {
      this.elem.play();
    }
  }

  handleProgressChange(value) {
    const time = parseInt((this.state.duration * value), 10);
    this.elem.currentTime = time;
  }

  handleVolumeClick() {
    if (!this.state.volume) {
      this.elem.volume = this.state.prevVolume || 0.7;
    } else {
      this.setState({ prevVolume: this.elem.volume });
      this.elem.volume = 0;
    }
  }

  handleVolumeBarChange(value) {
    this.elem.volume = value;
  }

  handleVolumeWheel(event) {
    const x = 50;  // adjust scroll rate
    let newVolume = parseFloat(this.state.volume - (event.deltaY / x), 10);

    if (newVolume > 1) {
      newVolume = 1;
    } else if (newVolume < 0) {
      newVolume = 0;
    }

    if (this.elem.volume !== newVolume) {
      this.elem.volume = newVolume;
    }
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { url, width, height, isVideo, startTime, inViewer, authString } = this.props;
    const { loaded } = this.state;
    const styles = require('./AudioVideo.less');
    const cx = classNames.bind(styles);
    const frameClasses = cx({
      AudioVideo: true,
      inViewer: inViewer,
      isVideo: isVideo
    });

    const videoClasses = cx({
      video: true,
      loaded: loaded
    });
    const audioClasses = cx({
      audio: true,
      loaded: loaded
    });

    const loadingElem = (
      <div className={styles.loading}>
        <Loader type="content" />
      </div>);

    // Set up MediaControl props
    const mediaControlsProps = {
      duration: this.state.duration,
      elapsed: this.state.elapsed,
      buffer: this.state.buffer,
      //expanded: this.state.expanded,
      playing: this.state.playing,
      volume: this.state.volume,

      onPlayClick: this.handlePlayClick,
      onProgressChange: this.handleProgressChange,
      onVolumeClick: this.handleVolumeClick,
      onVolumeBarChange: this.handleVolumeBarChange,
    };

    // Video
    let mainUrl;
    let alternateUrl;
    if (isVideo) {
      mainUrl = url.replace('.webm', '.mp4') + authString;

      // Fallback to alternate url with same path as url if none is passed
      alternateUrl = this.props.alternateUrl || url.replace('.mp4', '.webm');
      alternateUrl += authString;

      // Append start time
      if (startTime) {
        mainUrl += `#t=${startTime}`;
        alternateUrl += `#t=${startTime}`;
      }

      //mediaControlsProps.onExpandClick = this.handleExpandClick;
      mediaControlsProps.onFullscreenClick = this.props.onFullscreenClick;
      mediaControlsProps.video = true;
      mediaControlsProps.style = inViewer ? { position: 'fixed' } : {};

    // Audio
    } else {
      mainUrl = url + authString;

      // Append start time
      if (startTime) {
        mainUrl += `#t=${startTime}`;
      }
    }

    if (this.props.error) {
      return (
        <div className={styles.error}>
          <Blankslate
            icon="error"
            message={this.props.errorMessage}
            middle
          />
        </div>
      );
    } else if (!this.props.url) {
      return (
        <div className={styles.error}>
          <Blankslate
            icon={<SVGIcon type="warning" />}
            message={this.props.errorMessage}
            middle
          />
        </div>
      );
    }

    // Fix for chrome - Show media controls for video if fullScreen
    const showNativeControls = document.webkitFullscreenElement &&
      !(/^((?!chrome|android).)*safari/igm.test(navigator.userAgent));

    // Fix for chrome on iPad not loading data
    const isDeviceOnChrome = navigator.userAgent.indexOf('CriOS') !== -1;

    // Fix for iPadOS iOS 13 not loading data
    const isIpadOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return (
      <div
        ref={(c) => { this.frame = c; }}
        tabIndex="-1"
        className={frameClasses}
      >
        {this.props.children}
        {isVideo && <div className={videoClasses}>
          {!loaded && loadingElem}
          <video
            ref={(c) => { this.elem = c; }}
            width={this.state.expanded ? '100%' : width}
            height={this.state.expanded ? '100%' : height}
            title={this.props.title}
            poster={this.props.thumbnail + authString}
            autoPlay={this.props.autoPlay || isDeviceOnChrome || isIpadOS}
            preload="auto"
            onDoubleClick={this.props.onFullscreenClick}
            onPause={this.handlePause}
            onPlay={this.handlePlay}
            onProgress={this.handleProgress}
            onTimeUpdate={this.handleTimeUpdate}
            onVolumeChange={this.handleVolumeChange}
            onLoadedData={this.handleLoadedData}
            onLoadedMetadata={this.handleLoadedMetadata}
            onError={this.handleError}
            controls={showNativeControls}
            controlsList="nodownload"
            disablepictureinpicture="true"
          >
            <source src={alternateUrl} type="video/webm" />
            <source src={mainUrl} type="video/mp4" />
          </video>
        </div>}
        {!isVideo && <div className={audioClasses}>
          {!loaded && loadingElem}
          <audio
            ref={(c) => { this.elem = c; }}
            title={this.props.title}
            autoPlay={this.props.autoPlay || isIpadOS}
            preload="auto"
            onPause={this.handlePause}
            onPlay={this.handlePlay}
            onProgress={this.handleProgress}
            onTimeUpdate={this.handleTimeUpdate}
            onVolumeChange={this.handleVolumeChange}
            onLoadedData={this.handleLoadedData}
            onLoadedMetadata={this.handleLoadedMetadata}
            onError={this.handleError}
          >
            <source src={mainUrl} type="audio/mp4" />
            <source src={mainUrl} type="audio/mpeg" />
          </audio>
        </div>}
        <TransitionGroup>
          {loaded && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <MediaControls {...mediaControlsProps} />
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
