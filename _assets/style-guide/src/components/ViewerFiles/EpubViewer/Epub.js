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

//lodash
import _get from 'lodash/get';
import _debounce from 'lodash/debounce';
//react
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
//component
import Epubjs from 'epubjs/dist/epub';
import JSZip from 'jszip/dist/jszip';
import Loader from 'components/Loader/Loader';

global.JSZip = JSZip; // Fix for JSZip not found error
global.ePub = Epubjs; // Fix for v3 branch of epub.js -> needs ePub to by a global var

const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
const b64DecodeUnicode = str => decodeURIComponent(atob(str).split('').map(
  c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
);

/**
 * Loads and displays an epub file by url.
 */
export default class Epub extends PureComponent {
  static propTypes = {
    /** Url of the epub file*/
    url: PropTypes.string,

    /** callback when update the location of the epub file  */
    onLocationUpdate: PropTypes.func,

    /** callback when epub file finish loading */
    onReady: PropTypes.func,

    /** callback when epub file is error */
    onError: PropTypes.func,

    onStart: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.book = null;
    this.rendition = null;
    this.init = false;

    autobind(this);

    // refs
    this.viewer = null;
  }

  componentDidMount() {
    this.book = new Epubjs({ restore: true, reload: false });
    if (typeof window !== 'undefined') {
      const btoa = window.btoa;
      global.btoa = (str) => btoa(unescape(encodeURIComponent(str)));
    } else {
      global.btoa = (str) => btoa(unescape(encodeURIComponent(str)));
    }

    /*
     * Error Handle
     * */
    this.book.open(this.props.url).catch((e) => {
      if (typeof this.props.onError === 'function' && this.props.onError) {
        this.props.onError({ ...e, message: e.message || 'File not supported: ' });
      }
    });

    this.book.opened.then(this.initReader);
    window.addEventListener('resize', _debounce(() => { this.handleResizeEvent(this.props.scale); }, 300));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.href !== nextProps.href && nextProps.href) {
      this.rendition.display(nextProps.href)
        .then(this.handleMethodUpdate);
    }

    if (this.props.scale !== nextProps.scale && nextProps.scale) {
      if (nextProps.loading) {
        this.book.destroy();
        this.book = new Epubjs();
        /*
         * Error Handle
         * */
        this.book.open(nextProps.url).catch((e) => {
          if (typeof this.props.onError === 'function' && this.props.onError) {
            this.props.onError({ ...e, message: e.message || 'File not supported: ' });
          }
        });
        this.book.opened.then(this.handleResizeEvent(nextProps.scale));
      } else {
        this.handleResizeEvent(nextProps.scale);
      }
    }
  }

  componentWillUnmount () {
    this.book = null;
    this.rendition = null;
    window.btoa = btoa;
    window.removeEventListener('resize', _debounce(() => { this.handleResizeEvent(this.props.scale); }, 300));
  }

  initReader () {
    this.rendition = this.book.renderTo(this.viewer, {
      height: '100%',
      spread: 'none',
      // orientation: 'portrait',
      layout: 'pre-paginated',
      // minSpreadWidth: viewer.offsetWidth + 0.1,
    });
    this.rendition.display().then(this.handleMethodUpdate);
  }

  /**
   * support zoom in and zoom out
   */
  handleResizeEvent(scale) {
    this.href = _get(this.rendition, 'location.href', this.href);

    this.rendition.destroy();
    this.rendition = this.book.renderTo(this.viewer, {
      height: 100 / scale + '%',
      width: this.viewer.offsetWidth / scale + 0.1,
      spread: 'none',
      layout: 'pre-paginated',
    });
    this.rendition.display(this.href || '').then(this.handleMethodUpdate);
  }

  /**
   * fix all the issue in showing the epub xhtml
   */
  handleMethodUpdate() {
    const { viewer } = this;
    // const { clientHeight, clientWidth } = this.rendition.manager.container;
    let epubHeight = '';
    let epubWidth = '';
    Array.from(viewer.getElementsByTagName('iframe')).forEach(iframeElement => {
      const iframeEle = iframeElement;
      /*
      * update link
      * */
      iframeEle.contentWindow.goToDestination = (location) => {
        const pat = /^https?:\/\//i;
        if (!pat.test(location)) {
          this.props.onLocationUpdate(location);
          this.rendition.display(location).then(this.handleMethodUpdate);
        } else {
          window.open(location);
        }
      };
      /*
       * update overflow scroll
       * */
      Array.from(iframeElement.contentWindow.document.getElementsByTagName('head')).forEach((element) => {
        const { urlCache } = this.book.archive;
        for (const key in urlCache) {
          // if (key.endsWith('.js')) {
          //   console.log(b64DecodeUnicode(urlCache[key].replace('data:application/javascript;base64,', '')));
          // }
          if (key.endsWith('.css')) {
            const cssString = b64DecodeUnicode(urlCache[key].replace('data:text/css;base64,', ''));
            let css = '';
            if (cssString.indexOf('*|') > -1) {
              css = cssString.replace(/\*\|/g, 'epub\\:');
            }

            if (cssString.indexOf('epub|') > -1) {
              css = css === '' ? cssString.replace(/epub\|/g, 'epub\\:') : css.replace(/epub\|/g, 'epub\\:');
            }

            if (css !== '') {
              const style = document.createElement('style');
              style.type = 'text/css';
              if (style.styleSheet) {
                style.styleSheet.cssText = css;
              } else {
                style.appendChild(document.createTextNode(css));
              }
              element.appendChild(style);
            }
          }
        }
      });
      /*
       * update html5 video
       * */
      Array.from(iframeElement.contentWindow.document.getElementsByTagName('video')).forEach((video) => {
        const myVideo = video;
        const myVideoSource = video.getElementsByTagName('source')[0];

        const blob = b64toBlob(myVideoSource.src.split('base64,')[1], myVideoSource.type);
        const blobUrl = URL.createObjectURL(blob);

        myVideo.src = blobUrl;
        myVideoSource.src = blobUrl;
      });

      /*
       * update html5 audio
       * */
      // Array.from(iframeElement.contentWindow.document.getElementsByTagName('audio')).forEach((audio) => {
      //   // const myAudio = audio;
      //   // const myAudioSource = myAudio.getElementsByTagName('source')[0];
      //   // myAudio.src = myAudioSource.src;
      //   const myAudio = audio;
      //   const myAudioSource = audio.getElementsByTagName('source')[0];
      //
      //   const blob = b64toBlob(myAudioSource.src.split('base64,')[1], myAudioSource.type);
      //   const blobUrl = URL.createObjectURL(blob);
      //
      //   myAudio.src = blobUrl;
      //   myAudioSource.src = blobUrl;
      // });

      //iframeElement.setAttribute('scrolling', 'yes');

      /*
       * update size
       * */
      const bodyElement = iframeElement.contentWindow.document.getElementsByTagName('body')[0];
      bodyElement.style.overflow = 'auto';
      bodyElement.style.margin = 0;
      // console.log(container, container.style.width);
      if (_get(bodyElement, 'style.width', false) && _get(bodyElement, 'style.height', false)) {
        Array.from(viewer.getElementsByClassName('epub-view')).forEach(epubView => {
          const element = epubView;
          //fix scroll
          if (bodyElement.style.width === viewer.offsetWidth + 'px' && bodyElement.style.height === viewer.offsetHeight + 'px') {
            element.style.width = iframeEle.style.width;
            element.style.height = iframeEle.style.height;
          } else if (parseInt(iframeEle.style.width, 10) === viewer.offsetWidth) {
            iframeEle.style.width = bodyElement.style.width;
            element.style.width = bodyElement.style.width;
            iframeEle.style.height = bodyElement.style.height;
            element.style.height = bodyElement.style.height;
          }
          epubHeight = bodyElement.style.height;
          epubWidth = bodyElement.style.width;
        });
      }

      let sectionWidth = 0;
      let sectionHeight = 0;
      Array.from(iframeElement.contentWindow.document.getElementsByTagName('section')).forEach((section) => {
        if (section.getAttribute('epub:type')) {
          sectionWidth = parseInt(window.getComputedStyle(section, null).getPropertyValue('width'), 10);
          sectionHeight = parseInt(window.getComputedStyle(section, null).getPropertyValue('height'), 10);
        }
      });
      const bodyWidth = parseInt(window.getComputedStyle(bodyElement, null).getPropertyValue('width'), 10);
      const bodyHeight = parseInt(window.getComputedStyle(bodyElement, null).getPropertyValue('height'), 10);
      if (sectionWidth > bodyWidth || sectionHeight > bodyHeight) {
        Array.from(viewer.getElementsByClassName('epub-view')).forEach(epubView => {
          const element = epubView;
          iframeEle.style.width = sectionWidth + 'px';
          element.style.width = sectionWidth + 'px';
          iframeEle.style.height = sectionHeight + 'px';
          element.style.height = sectionHeight + 'px';
          epubHeight = sectionHeight + 'px';
          epubWidth = sectionWidth + 'px';
        });
      }

      /*
       * fix the location
       * */
      Array.from(viewer.getElementsByClassName('epub-container')).forEach((container) => {
        const element = container;
        element.style.height = iframeElement.style.height || bodyElement.style.height;
        element.style.width = iframeElement.style.width || bodyElement.style.width;

        if (this.props.href && this.props.href.indexOf('#') > -1) {
          const urlSplit = this.props.href.split('#');
          const location = urlSplit[urlSplit.length - 1];

          if (location) {
            viewer.scrollLeft = iframeElement.contentWindow.document.getElementById(location).offsetLeft;
            viewer.scrollTop = iframeElement.contentWindow.document.getElementById(location).offsetTop;
          }
        } else {
          viewer.scrollLeft = 0;
          viewer.scrollTop = 0;
        }
      });


      /*
       * fix the link
       * */
      Array.from(iframeElement.contentWindow.document.getElementsByTagName('a')).forEach((link) => {
        const myLink = link;
        const pat = /^https?:\/\//i;
        if (!pat.test(myLink.getAttribute('href'))) {
          myLink.onclick = this.handleATagClick;
        }
      });
    });

    if (this.init || (epubHeight === '' && epubWidth === '')) {
      this.props.onReady(this.rendition);
    } else if (epubHeight !== '' || epubWidth !== '') {
      this.props.onStart(this.rendition, epubHeight, epubWidth);
    }

    if (!this.init) {
      this.init = true;
    }
  }

  /**
   * rewrite A tag click
   */
  handleATagClick(event) {
    this.rendition.display(event.currentTarget.getAttribute('href')).then(this.handleMethodUpdate);
    return false;
  }

  render() {
    const { className, style, loading, scale } = this.props;
    const styles = require('./Epub.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      viewer: true,
      hidden: false,
    }, className);
    const loadingClasses = cx({
      loading: true,
      hidden: !loading,
    });

    const loadingStyle = {
      transform: `translate(-50%, -50%) scale(${1 / scale})`,
    };

    return (
      <div
        ref={(c) => { this.viewer = c; }}
        className={classes}
        style={style}
      >
        <Loader type="content" className={loadingClasses} style={loadingStyle} />
      </div>
    );
  }
}
