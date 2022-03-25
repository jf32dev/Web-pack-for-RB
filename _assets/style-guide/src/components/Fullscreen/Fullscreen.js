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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

/**
 * Wrapper component: toggles fullscreen on child.
 */
export default class Fullscreen extends PureComponent {
  static propTypes = {
    /** sub component */
    children: PropTypes.node,

    /** set full screen or exit full screen */
    fullScreenToggle: PropTypes.bool,

    /** set full screen or exit full screen */
    onExitFullScreen: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
    };
    autobind(this);

    // refs
    this.fullScreen = null;
  }

  componentDidMount() {
    // When the component is mounted, grab a reference and add a DOM listener;
    this.fullScreen.addEventListener('webkitfullscreenchange', this.handleFullScreenListener);
    this.fullScreen.addEventListener('mozfullscreenchange', this.handleFullScreenListener);
    this.fullScreen.addEventListener('fullscreenchange', this.handleFullScreenListener);
    this.fullScreen.addEventListener('MSFullscreenChange', this.handleFullScreenListener);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.fullScreenToggle !== nextProps.fullScreenToggle && nextProps.fullScreenToggle !== this.state.fullScreen) {
      this.handleFullScreenToggle(this.fullScreen);
    }
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted
    this.fullScreen.removeEventListener('webkitfullscreenchange', this.handleFullScreenListener);
    this.fullScreen.removeEventListener('mozfullscreenchange', this.handleFullScreenListener);
    this.fullScreen.removeEventListener('fullscreenchange', this.handleFullScreenListener);
    this.fullScreen.removeEventListener('MSFullscreenChange', this.handleFullScreenListener);
  }

  handleFullScreenListener() {
    const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement
      || document.msFullscreenElement;

    if (!isFullScreen) {
      this.setState({ fullScreen: false }, () => {
        if (typeof this.props.onExitFullScreen === 'function') {
          this.props.onExitFullScreen();
        }
      });
    } else {
      this.setState({ fullScreen: true });
    }
  }

  handleFullScreenToggle(elem) {
    const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement
      || document.msFullscreenElement;

    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitRequestFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    return null;
  }

  render() {
    return (
      <div
        ref={(c) => { this.fullScreen = c; }}
        className={this.props.className}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}
