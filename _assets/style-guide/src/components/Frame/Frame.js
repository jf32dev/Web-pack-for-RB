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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import platform from 'platform';

/**
 * Renders an iFrame with custom HTML
 * Used for Story Description
 */
export default class Frame extends Component {
  static propTypes = {
    /** inserted in <code>&lt;title&gt;</code> in document <code>&lt;head&gt;</code> */
    title: PropTypes.string,

    /** inserted in <code>&lt;style&gt;</code> in document <code>&lt;head&gt;</code> */
    headStyle: PropTypes.string,

    /** inserted in <code>&lt;script&gt;</code> in document <code>&lt;head&gt;</code> */
    headScript: PropTypes.string,

    /** document <code>&lt;body&gt;</code> */
    body: PropTypes.string,

    /** ignores title/style/script/body if passed */
    html: PropTypes.string,

    /** height in pixels (can also be set with CSS) */
    height: PropTypes.string,

    /** width in pixels (can also be set with CSS) */
    width: PropTypes.string,

    /** HTML5 sandbox attribute */
    sandbox: PropTypes.string,

    /** HTML5 allowFullScreen attribute */
    allowFullScreen: PropTypes.bool,

    /** HTML5 seamless attribute */
    seamless: PropTypes.bool,

    onFrameError: PropTypes.func,
    onFrameLoaded: PropTypes.func,

    /** Handle anchor click events */
    onAnchorClick: PropTypes.func,

    /** Prevent default action and handle internal anchor (#hash) click events */
    onInternalAnchorClick: PropTypes.func,

    containerClassName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    body: '',
    headStyle: '',
    headScript: '',
    title: '',
    height: '300px',
    seamless: true
  };

  constructor(props) {
    super(props);
    this.state = {
      src: '',
      loaded: false
    };

    autobind(this);

    // refs
    this.iframe = null;
  }

  componentDidMount() {
    this.renderFrameContent();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextState.src && nextState.src !== this.state.src) {
      this.iframe.addEventListener('load', this.createDocumentEvents);
    }
  }

  componentDidUpdate(prevProps) {
    const { body, html, headScript, headStyle } = this.props;

    if (typeof body === 'string' && prevProps.body !== body) {
      this.renderFrameContent();
    } else if (typeof html === 'string' && prevProps.html !== html) {
      this.renderFrameContent();
    } else if (typeof headScript === 'string' && prevProps.headScript !== headScript) {
      this.renderFrameContent();
    } else if (typeof headStyle === 'string' && prevProps.headStyle !== headStyle) {
      this.renderFrameContent();
    }
  }

  componentWillUnmount() {
    if (this.iframe) {
      this.iframe.contentWindow.removeEventListener('resize', this.handleFrameResize);
    }

    if (this.iframe.contentDocument && this.iframe.contentDocument.head) {
      ReactDOM.unmountComponentAtNode(this.iframe.contentDocument.head);
    }
    if (this.iframe.contentDocument && this.iframe.contentDocument.body) {
      ReactDOM.unmountComponentAtNode(this.iframe.contentDocument.body);
    }

    if (this.state.src.indexOf('blob:') === 0) {
      URL.revokeObjectURL(this.props.src);
    }
  }

  getContentHeight() {
    const body = this.iframe.contentDocument.body;
    const html = this.iframe.contentDocument.documentElement;
    let height = 0;
    let heightDiff = 0;

    if (body && html) {
      height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

      // Dynamically resized content shows a discrepency between
      // body and height heights, attempt to adjust
      heightDiff = height - html.scrollHeight;
      if (heightDiff > 100) {
        height -= heightDiff;
      }

      // Edge/Safari height calculation off?
      if (platform.name === 'Microsoft Edge' || platform.name === 'Safari') {
        height += 50;
      }
    }
    return height;
  }

  injectErrorHandler(string) {
    const d = new Date().getTime();
    const functionString = '<script>function errorFunction() { console.info("iFrame error!") }</script>';
    const scriptString = '<script onerror="errorFunction()" src="ping.js?+ ' + d + '"></script>';
    const insertAt = string.indexOf('</html>');
    const newString = [string.slice(0, insertAt), functionString + scriptString, string.slice(insertAt)].join('');

    return newString;
  }

  /**
   * Write HTML to iframe
   * For IE-only (no iFrame src Blob support)
   */
  writeFrameContents(pageTemplate) {
    const doc = this.iframe.contentDocument;
    this.iframe.addEventListener('load', this.createDocumentEvents);

    doc.write(pageTemplate);
    doc.close();
  }

  /**
   * Creates a Blob document for non-IE browsers
   * to use as iFrame src
   */
  createFrameBlob(pageTemplate) {
    const frameBlob = new Blob([pageTemplate], { type: 'text/html' });
    const frameSrc = URL.createObjectURL(frameBlob);
    this.setState({ src: frameSrc });
  }

  /**
   * Create event listeners on iFrame document
   * Listens for <a> click events
   * and <img> load events
   */
  createDocumentEvents() {
    const doc = this.iframe.contentDocument;

    if (doc && doc.readyState === 'complete') {
      // Listen for click events
      doc.addEventListener('click', this.handleFrameClick);

      // Listen for anchor click events
      const anchors = doc.body.getElementsByTagName('A');
      if (anchors.length) {
        Array.prototype.forEach.call(anchors, function(a) {
          a.addEventListener('click', this.handleAnchorClick);
        }.bind(this));
      }

      // Listen for image load events
      const images = doc.body.getElementsByTagName('IMG');
      if (images.length) {
        Array.prototype.forEach.call(images, function(img) {
          if (!img.complete) {
            img.addEventListener('load', this.handleImageLoad);
          }
        }.bind(this));
      }

      // Propagate event
      if (this.props.onFrameLoaded) {
        this.props.onFrameLoaded(doc, this.getContentHeight());
      }

      this.setState({ loaded: true });

      // Listen to event once
      this.iframe.removeEventListener('load', this.createDocumentEvents);
    } else {
      setTimeout(this.createDocumentEvents, 100);
    }
  }

  /**
   * TO DO
   * detect if frame contents throws error?
   */
  handleFrameError(event) {
    console.log(event);  // eslint-disable-line
    // Propagate event
    if (this.props.onFrameError) {
      this.props.onFrameError(event);
    }
  }

  handleAnchorClick(event) {
    const {
      onAnchorClick,
      onInternalAnchorClick
    } = this.props;
    const href = event.currentTarget.getAttribute('href');
    let anchor;

    // Internal anchor in content
    if (!href.split('#')[0].length) {
      // Check if link exists within page: <a name="whatever">
      const name = href.split('#')[1];
      if (name && name !== '#') {
        anchor = this.iframe.contentDocument.querySelectorAll('a[name=' + name + ']');
      }

      // Pass event and target to parent
      if (anchor && anchor[0] && typeof anchor[0].offsetTop === 'number' && typeof onInternalAnchorClick === 'function') {
        onInternalAnchorClick(event, anchor[0]);
        event.preventDefault();
      }

      // Propagate other anchor clicks
    } else if (typeof onAnchorClick === 'function') {
      onAnchorClick(event);
    }
  }

  /**
   * Propagates a click event to the parent window
   * Used to close any active menus
   */
  handleFrameClick() {
    const fakeClickEvent = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
    window.dispatchEvent(fakeClickEvent);
  }

  handleImageLoad() {
    //console.log(event);  // eslint-disable-line
  }

  renderFrameContent() {
    let pageTemplate;

    // If html prop is passed, use it as page content
    if (this.props.html) {
      pageTemplate = this.props.html;
    } else {
      pageTemplate = [
        '<!DOCTYPE html><html><head><base target="_blank">',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />',
        '<title>' + this.props.title + '</title>',
        '<style type="text/css">' + this.props.headStyle + '</style>',
        '<script type="text/javascript">' + this.props.headScript + '</script>',
        '</head><body>',
        this.props.body,
        '</body></html>'
      ].join('');
    }

    //pageTemplate = this.injectErrorHandler(pageTemplate);

    if (platform.name === 'Chrome' || platform.name === 'Firefox' || platform.name === 'Safari') {
      this.createFrameBlob(pageTemplate);
    } else {
      this.writeFrameContents(pageTemplate);
    }
  }

  render() {
    const { loaded } = this.state;
    const frameStyle = Object.assign({
      visibility: loaded ? 'visible' : 'hidden'
    }, this.props.style);

    return (
      <div style={{ height: '100%' }} className={this.props.containerClassName}>
        <iframe
          ref={(c) => { this.iframe = c; }}
          src={this.state.src}
          height={loaded ? this.props.height : '0'}
          width={this.props.width}
          seamless={this.props.seamless}
          allowFullScreen={this.props.allowFullScreen}
          sandbox={this.props.sandbox}
          className={this.props.className}
          style={frameStyle}
        />
      </div>
    );
  }
}
