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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import ProgressControl from './ProgressControl';
import VolumeControl from './VolumeControl';

export default class MediaControls extends Component {
  static propTypes = {
    duration: PropTypes.number,
    elapsed: PropTypes.number,  // seconds
    buffer: function(props, propName) {
      if (isNaN(props[propName]) || props[propName] < 0 || props[propName] > 1) {
        return new Error(propName + ' must be a number between 0-1');
      }
      return null;
    },

    expanded: PropTypes.bool,
    playing: PropTypes.bool,
    volume: PropTypes.number,
    video: PropTypes.bool,

    // TODO: move to strings prop
    collapseLabel: PropTypes.string,
    expandLabel: PropTypes.string,
    fullscreenLabel: PropTypes.string,
    pauseLabel: PropTypes.string,
    playLabel: PropTypes.string,
    restartLabel: PropTypes.string,

    onExpandClick: PropTypes.func,
    onFullscreenClick: PropTypes.func,
    onPlayClick: PropTypes.func.isRequired,
    onProgressChange: PropTypes.func.isRequired,
    onVolumeClick: PropTypes.func.isRequired,
    onVolumeBarChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    collapseLabel: 'Collapse',
    expandLabel: 'Expand',
    fullscreenLabel: 'Fullscreen',
    playLabel: 'Play',
    pauseLabel: 'Pause',
    restartLabel: 'Restart'
  };

  constructor(props) {
    super(props);
    this.state = {
      showRemaining: false,
      volumeVisible: false
    };
    autobind(this);
  }

  // Returns time as hh:mm:ss or mm:ss
  getTime(seconds) {
    const duration = new Date(null);
    duration.setSeconds(seconds);

    // If seconds over 3600 (1 hour), include hour portion of time
    if (seconds >= 3600) {
      return duration.toISOString().substr(11, 8);
    }
    return duration.toISOString().substr(14, 5);
  }

  handleDurationClick() {
    this.setState({ showRemaining: !this.state.showRemaining });
  }

  handleVoulumeMouseEnter() {
    this.setState({ volumeVisible: true });
  }

  handleVolumeMouseLeave() {
    this.setState({ volumeVisible: false });
  }

  render() {
    const {
      duration,
      elapsed,
      buffer,
      expanded,
      playing,
      video,
      volume,
      collapseLabel,
      expandLabel,
      fullscreenLabel,
      pauseLabel,
      playLabel,
      restartLabel,
      onExpandClick,
      onFullscreenClick,
      onPlayClick,
      onProgressChange,
      onVolumeClick,
      onVolumeBarChange,
      className,
      style
    } = this.props;
    const { showRemaining, volumeVisible } = this.state;
    const styles = require('./MediaControls.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      MediaControls: true,
      isVideo: video
    }, className);

    const playClasses = cx({
      pause: playing,
      play: !playing && duration !== elapsed,
      restart: !playing && elapsed === duration
    });

    let thePlayLabel = playLabel;
    if (playing) {
      thePlayLabel = pauseLabel;
    } else if (!playing && elapsed === duration) {
      thePlayLabel = restartLabel;
    }

    const volumeClasses = cx({
      volume: true,
      mute: !volume
    });

    // Calculate percent/remaining
    const elapsedDecimal = (elapsed / duration) || 0;
    const durationOrRemaining = showRemaining ? '-' + this.getTime(duration - elapsed) : this.getTime(duration);

    return (
      <div className={classes} style={style} data-name="MediaControls">
        <span className={playClasses} title={thePlayLabel} onClick={onPlayClick} />
        <span className={styles.elapsed}>{this.getTime(elapsed)}</span>
        <ProgressControl
          onChange={onProgressChange} buffer={buffer} elapsed={elapsedDecimal}
          dark={video}
        />
        <span className={styles.duration} onClick={this.handleDurationClick}>{durationOrRemaining}</span>
        <div
          className={volumeClasses}
          onClick={onVolumeClick}
          onMouseEnter={this.handleVoulumeMouseEnter}
          onMouseLeave={this.handleVolumeMouseLeave}
        >
          <TransitionGroup>
            {volumeVisible && <CSSTransition
              classNames="fade"
              timeout={250}
              appear
            >
              <VolumeControl
                volume={volume}
                dark={video}
                onChange={onVolumeBarChange}
              />
            </CSSTransition>}
          </TransitionGroup>
        </div>
        {onExpandClick && <span
          className={expanded ? styles.collapse : styles.expand}
          title={expanded ? collapseLabel : expandLabel}
          onClick={onExpandClick}
        />}
        {onFullscreenClick && <span
          className={styles.fullscreen}
          title={fullscreenLabel}
          onClick={onFullscreenClick}
        />}
      </div>
    );
  }
}
