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
import { DraggableCore } from 'react-draggable';

/**
 * Used to adjust the volume of auido &amp; video files.
 * Uses <a href="https://github.com/mzabriskie/react-draggable" target="_blank"><code>react-draggable</code></a> for the volume indicator.
 * Note that Volume can be modified by using the mouse wheel. The change event if also triggered during drag, unlike ProgressControl which triggers when the drag is complete.
 */
export default class VolumeControl extends Component {
  static propTypes = {
    /** value between 0-1 */
    volume: function(props, propName) {
      if (isNaN(props[propName]) || props[propName] < 0 || props[propName] > 1) {
        return new Error(propName + ' must be a number between 0-1');
      }
      return null;
    },

    /** theme to use with a dark background */
    dark: PropTypes.bool,

    /** returns a decimal indicating the new volume state during drag or click */
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    volume: 0.7
  };

  constructor(props) {
    super(props);
    this.state = {
      isDragging: false
    };
    autobind(this);

    // refs
    this.control = null;
  }

  handleWheel(event) {
    event.preventDefault();  // stop page scrolling
    const x = 75;  // adjust scroll rate
    let value = this.props.volume - (event.deltaY / x);

    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }

    this.props.onChange(value, event);  // Pass decimal value (0-1)
  }

  handleClick(event) {
    event.stopPropagation();
    const height = this.control.offsetHeight;
    const yPos = event.nativeEvent.offsetY;
    const value = 1 - (yPos / height);

    this.props.onChange(value, event);  // Pass decimal value (0-1)
  }

  handleStart() {
    this.setState({ isDragging: true });
  }

  handleDrag(event, ui) {
    const x = 10;  // adjust scroll rate
    let value = (this.props.volume - (ui.deltaY / 10) / x);

    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }

    this.props.onChange(value, event);
  }

  handleStop() {
    this.setState({ isDragging: false });
  }

  handleHandleClick(event) {
    event.stopPropagation();
  }

  render() {
    const { volume, dark } = this.props;
    const styles = require('./VolumeControl.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      VolumeControl: true,
      isDragging: this.state.isDragging
    });

    const volumeSliderStyle = {
      background: dark ? '#ddd' : '#ddd'
    };

    const volumeBarStyle = {
      background: dark ? '#fff' : '#000',
      top: (100 - (volume * 100)) + '%'
    };

    const volumeBallClasses = cx({
      volumeBall: true,
      isDragging: this.state.isDragging
    });

    const volumeBallStyle = {
      background: dark ? '#fff' : '#000',
      top: (100 - (volume * 100)) + '%'  // convert decimal to %
    };

    return (
      <div
        ref={(c) => { this.control = c; }}
        className={classes}
        onClick={this.handleClick}
        onWheel={this.handleWheel}
      >
        <div className={styles.volumeSlider} style={volumeSliderStyle}>
          <span className={styles.volumeBar} style={volumeBarStyle} />
          <DraggableCore
            handle=".handle"
            grid={[1, 1]}
            onStart={this.handleStart}
            onDrag={this.handleDrag}
            onStop={this.handleStop}
          >
            <span
              className={volumeBallClasses + ' handle'}
              onClick={this.handleHandleClick}
              style={volumeBallStyle}
            />
          </DraggableCore>
        </div>
      </div>
    );
  }
}
