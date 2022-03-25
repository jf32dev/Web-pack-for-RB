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
 * Used to display and modify the progress of audio &amp; video files.
 * Uses <a href="https://github.com/mzabriskie/react-draggable" target="_blank"><code>react-draggable</code></a> for the progress indicator.
 */
export default class ProgressControl extends Component {
  static propTypes = {
    /** value between 0-1 */
    buffer: function(props, propName) {
      if (isNaN(props[propName]) || props[propName] < 0 || props[propName] > 1) {
        return new Error(propName + ' must be a number between 0-1');
      }
      return null;
    },

    /**  value between 0-1 */
    elapsed: function(props, propName) {
      if (isNaN(props[propName]) || props[propName] < 0 || props[propName] > 1) {
        return new Error(propName + ' must be a number between 0-1');
      }
      return null;
    },

    /** theme to use with a dark background */
    dark: PropTypes.bool,

    /** returns a decimal indicating the new elapsed state after drag or click */
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    buffer: 0,
    elapsed: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      dragDec: this.props.elapsed
    };
    autobind(this);

    // refs
    this.control = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.elapsed !== this.state.dragDec) {
      this.setState({ dragDec: nextProps.elapsed });
    }
  }

  handleClick(event) {
    const width = this.control.offsetWidth;
    const xPos = event.nativeEvent.offsetX;
    const value = (xPos / width);
    this.props.onChange(value, event);  // Pass decimal value (0-1)
  }

  handleHandleClick(event) {
    event.stopPropagation();  // stop draggable triggering event
  }

  handleStart() {
    this.setState({ isDragging: true });
  }

  handleDrag(event, ui) {
    const dragPx = ui.node.offsetLeft + ui.deltaX;
    let dragDec = dragPx / this.control.offsetWidth;  // decimal (0-1)

    if (dragDec < 0) {
      dragDec = 0;
    } else if (dragDec > 1) {
      dragDec = 1;
    }

    this.setState({ dragDec: dragDec });
  }

  handleStop(event) {
    this.setState({ isDragging: false });
    this.props.onChange(this.state.dragDec, event);  // Pass decimal value (0-1)
  }

  render() {
    const { buffer, elapsed, dark } = this.props;
    const styles = require('./ProgressControl.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ProgressControl: true,
      isDragging: this.state.isDragging
    });

    const progressStyle = {
      background: dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    };

    const bufferBarStyle = {
      background: dark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      width: (buffer * 100) + '%'
    };

    const elapsedBarStyle = {
      background: dark ? '#fff' : '#000',
      width: (elapsed * 100) + '%'
    };

    const elapsedBallClasses = cx({
      elapsedBall: true,
      isDragging: this.state.isDragging
    });

    const elapsedBallStyle = {
      background: dark ? '#fff' : '#000',
      left: (this.state.dragDec * 100) + '%'  // convert decimal to %
    };

    return (
      <div
        ref={(c) => { this.control = c; }}
        className={classes}
        onClick={this.handleClick}
      >
        <div className={styles.progress} style={progressStyle}>
          <span className={styles.bufferBar} style={bufferBarStyle} />
          <span className={styles.elapsedBar} style={elapsedBarStyle} />
          <DraggableCore
            handle=".handle"
            grid={[10, 10]}
            onStart={this.handleStart}
            onDrag={this.handleDrag}
            onStop={this.handleStop}
          >
            <span className={elapsedBallClasses + ' handle'} onClick={this.handleHandleClick} style={elapsedBallStyle} />
          </DraggableCore>
        </div>
      </div>
    );
  }
}
