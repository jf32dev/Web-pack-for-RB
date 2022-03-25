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

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Frame from 'components/Frame/Frame';

import BroadcastToolbar from './BroadcastToolbar';
import BroadcastViewers from './BroadcastViewers';

export default class Broadcast extends Component {
  static propTypes = {

    /** html string for ppt */
    htmlCode: PropTypes.string,

    /** onClick event function for all the button click */
    onClick: PropTypes.func,

    onSizeChange: PropTypes.func,

    watermark: PropTypes.shape({
      text: PropTypes.string,
      opacity: PropTypes.string,
      colour: PropTypes.string,

      userFirstName: PropTypes.string,
      userLastName: PropTypes.string,
      userEmail: PropTypes.string,
    }),

    /** the broadcast object*/
    broadcast: PropTypes.object,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      exit: 'Exit',
      live: 'LIVE',
      offLive: 'OFFLIVE',
    },
    watermark: {
      text: '',
      opacity: '0.2',
      colour: '#444444',

      userFirstName: 'Public',
      userLastName: 'Viewer',
      userEmail: 'public@viewer'
    }
  };

  constructor(props) {
    super(props);
    this.hideToolbar = null;
    this.state = {
      isViewersVisible: false,
      clients: [],
      isToolbarVisible: false,
      rightItems: [{ name: 'user', value: 0 }],
      height: '100%',
      width: '100%',
    };

    // refs
    this.frame = null;
    this.btcFrame = null;

    const isIPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); /* iPad OS 13 */
    this.isMobile = isIPad || /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || false;
    autobind(this);
  }

  componentDidMount() {
    this.setupFrame();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.height !== prevState.height) {
      window.scrollTo(0, 0);
    }

    if (prevProps.htmlCode !== this.props.htmlCode) {
      this.handleFrameResize();
      this.applyWatermark();
    }
  }

  componentWillUnmount() {
    clearInterval(this.counter);
    clearTimeout(this.hideToolbar);
    this.counter = null;
    window.removeEventListener('message', this.receiveMessage, false);
    window.removeEventListener('resize', this.handleFrameResize.bind(this));
  }

  setupFrame() {
    // Reference to BTC iframe
    if (!this.btcFrame) {
      this.btcFrame = this.frame.iframe;
      // Listen for BTC events
      window.addEventListener('message', this.receiveMessage, false);
      window.addEventListener('resize', this.handleFrameResize.bind(this));
      // Focus for built-in keyboard shortcuts
      this.btcFrame.focus();

      this.handleFrameResize();
    }
  }

  applyWatermark() {
    const { watermark } = this.props;

    if (this.watermark) {
      const canvas = this.watermark;
      const ctx = canvas.getContext('2d');
      const font = '24pt "HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif';
      let text = watermark.text;

      // Watermark variables
      switch (text) {
        case '__firstnamelastname__':
          text = watermark.userFirstName + ' ' + watermark.userLastName;
          break;
        case '__lastnamefirstname__':
          text = watermark.userLastName + ' ' + watermark.userFirstName;
          break;
        case '__email__':
          text = watermark.userEmail;
          break;
        default:
          break;
      }

      // Set canvas dimensions equal to window
      canvas.height = window.innerHeight - 95;
      canvas.width = window.innerWidth;

      // Calculate text width to use as watermark text width
      ctx.font = font;
      const textWidth = ctx.measureText(text).width || 300;

      // Create watermark text
      const watermarkText = document.createElement('canvas');
      const ctx2 = watermarkText.getContext('2d');

      // Set dimensions of text
      watermarkText.width = textWidth + 30;  // add some padding
      watermarkText.height = 100;

      // Write to canvas
      ctx2.globalAlpha = watermark.opacity;
      ctx2.font = font;
      ctx2.fillStyle = watermark.colour;
      ctx2.fillText(text, 0, 50);

      // Create pattern from text
      const watermarkPattern = document.createElement('canvas');
      const watermarkCtx = watermarkPattern.getContext('2d');
      const pattern = watermarkCtx.createPattern(watermarkText, 'repeat');

      // Add pattern to image canvas
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = pattern;
      ctx.rotate(-45 * Math.PI / 180);
      ctx.fill();
    }
  }

  handleFrameResize() {
    if (this.isMobile) {
      if (this.props.onSizeChange) {
        this.props.onSizeChange({
          height: document.body.offsetHeight + 'px',
          width: document.body.offsetWidth <= 736 ? document.body.offsetWidth + 'px' : '100%'
        });
      }
      this.setState({
        height: document.body.offsetHeight + 'px',
        width: document.body.offsetWidth <= 736 ? document.body.offsetWidth + 'px' : '100%'
      });
    }
  }

  handleToolbarClick(event) {
    const action = _get(event, 'currentTarget.dataset.action', '');
    if (action === 'user') {
      this.setState({
        isViewersVisible: !this.state.isViewersVisible,
      });
    }
    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }

  receiveMessage(event) {
    const data = event.data;

    if (typeof data === 'string' && data.indexOf('slideshowtimeupdate') < 0) {
      // Get the updated live user list, exclude the presenter
      if (data.indexOf('liveUserList:') === 0) {
        const clients = JSON.parse(decodeURIComponent(data.replace('liveUserList:', '')));
        this.setState({
          clients,
          rightItems: [{ name: 'user', value: clients.length }],
        });
      }
    }
  }

  handleMouse() {
    clearTimeout(this.hideToolbar);
    if (!this.state.isToolbarVisible) {
      this.setState({
        isToolbarVisible: true
      });
    }

    this.hideToolbar = setTimeout(() => {
      if (this.state.isToolbarVisible && !this.state.isViewersVisible) {
        this.setState({
          isToolbarVisible: false
        });
      }
    }, 3000);
  }

  render() {
    const {
      htmlCode,
      broadcast,
      className,
      style,
      watermark,
    } = this.props;

    const {
      isViewersVisible,
      isToolbarVisible,
      clients,
      rightItems,
      height,
      width
    } = this.state;

    const styles = require('./Broadcast.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Broadcast: true,
    }, className);

    const toolbarClasses = cx({
      fadeIn: this.isMobile || isToolbarVisible,
      fadeOut: !this.isMobile && !isToolbarVisible,
    });

    return (
      <div className={classes} style={style} onMouseMove={this.handleMouse}>
        <BroadcastToolbar
          {...broadcast}
          onItemClick={this.handleToolbarClick}
          className={toolbarClasses}
          rightItems={rightItems}
        />
        {false && <div className={styles.mouseMoveChecker} />}
        <div className={styles.iframeSize} style={{ height, width }}>
          <canvas
            ref={(c) => { this.watermark = c; }}
            className={styles.watermark}
            style={{ display: watermark ? 'block' : 'none' }}
          />
          <Frame
            ref={(c) => { this.frame = c; }}
            html={htmlCode}
            height={height}
            width={width}
            className={styles.broadcastIframe}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            allowFullScreen
            onFrameError={this.handleFrameError}
            style={{ height, width }}
          />
        </div>
        {broadcast.joined && <BroadcastViewers isVisible={isViewersVisible} clients={clients} />}
      </div>
    );
  }
}
