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
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Blankslate from 'components/Blankslate/Blankslate';
import Epub from './Epub';
import Fullscreen from 'components/Fullscreen/Fullscreen';
import ViewerToolbar from '../../Viewer/ViewerToolbar';

const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.25;
const MAX_SCALE = 4.0;
const DEFAULT_SCALE = 1.0;

/**
 * View the epub file.
 * Full screen epub file.
 * Change pages.
 * Zoom feature
 * If the epub file has size, it would have the fit screen option.
 */
export default class EpubViewer extends Component {
  static propTypes = {
    /** auth*/
    authString: PropTypes.string,
    /** Url of the epub file*/
    url: PropTypes.string,
    /** error handler for the epub viewer */
    onError: PropTypes.func,
    /** class name */
    className: PropTypes.string,
    /** style*/
    style: PropTypes.object
  };

  static defaultProps = {
    url: '',
    authString: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      isFullScreen: false,
      isToolbarVisible: false,
      currentPage: 1,
      pages: [],
      loading: true,
      scale: DEFAULT_SCALE,
      isZoomMenuVisible: false,
    };

    this.zoomPageFitScale = 0;
    this.zoomPageWidthScale = 0;
    this.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

    autobind(this);

    // refs
    this.epubViewer = null;
    this.viewerToolbar = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url && nextProps.url) {
      this.setState({
        loading: true
      });
    }
  }

  handleExitFullScreen() {
    this.setState({ isFullScreen: false });
  }

  handleToolbarItemClick(e, action) {
    const { currentPage, isFullScreen, pages, loading, scale } = this.state;
    let updateState = { loading: true };

    if (!loading) {
      switch (action) {
        case 'fullscreen':
          updateState = {
            ...updateState,
            isFullScreen: !isFullScreen,
            isToolbarVisible: false,
          };
          break;
        case 'prevPage': {
          if (pages.length > 1) {
            let newPage = currentPage - 1;
            if (newPage < 1) {
              newPage = pages.length;
            }
            updateState = {
              ...updateState,
              currentPage: newPage
            };
          } else {
            updateState = {};
          }
          break;
        }
        case 'nextPage': {
          if (pages.length > 1) {
            let newPage = currentPage + 1;
            if (newPage > pages.length) {
              newPage = 1;
            }
            updateState = {
              ...updateState,
              currentPage: newPage
            };
          } else {
            updateState = {};
          }
          break;
        }
        case 'zoomIn': {
          if (scale !== MAX_SCALE) {
            let newScale = scale;
            newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.ceil(newScale * 10) / 10;
            newScale = Math.min(MAX_SCALE, newScale);
            updateState = {
              // ...updateState,
              scale: newScale
            };
          } else {
            updateState = {};
          }
          break;
        }
        case 'zoomOut': {
          if (scale !== MIN_SCALE) {
            let newScale = scale;
            newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
            newScale = Math.floor(newScale * 10) / 10;
            newScale = Math.max(MIN_SCALE, newScale);
            updateState = {
              // ...updateState,
              scale: newScale
            };
          } else {
            updateState = {};
          }
          break;
        }
        case 'zoom25': {
          updateState = { scale: 0.25 };
          break;
        }
        case 'zoom50': {
          updateState = { scale: 0.5 };
          break;
        }
        case 'zoom75': {
          updateState = { scale: 0.75 };
          break;
        }
        case 'zoom100': {
          updateState = { scale: 1 };
          break;
        }
        case 'zoomPageFit': {
          updateState = { scale: this.zoomPageFitScale };
          break;
        }
        case 'zoomPageWidth': {
          updateState = { scale: this.zoomPageWidthScale };
          break;
        }
        default:
          console.info('Unknown action: ' + action);
          break;
      }
    }
    // console.log(updateState, loading);
    if (updateState !== {} && !loading) {
      this.setState({
        ...updateState,
      });
    }
    this.viewerToolbar.handleZoomMenuClose();
  }

  handleEpubReady(rendition) {
    const pages = _get(rendition, 'book.spine.items', []);
    this.setState({
      pages: _isEmpty(pages) ? _get(rendition, 'book.toc', []) : pages,
      loading: false,
      isToolbarVisible: true,
    });
  }

  handleEpubStart(rendition, epubHeight, epubWidth) {
    let isSizeExist = false;
    const pages = _get(rendition, 'book.spine.items', []);
    if (epubHeight && epubWidth && this.zoomPageFitScale === 0 && this.zoomPageWidthScale === 0) {
      const containerHeight = parseInt(window.getComputedStyle(this.epubViewer, null).getPropertyValue('height'), 10);
      const containerWidth = parseInt(window.getComputedStyle(this.epubViewer, null).getPropertyValue('width'), 10);
      this.zoomPageFitScale = containerHeight / parseInt(epubHeight, 10);
      this.zoomPageWidthScale = containerWidth / parseInt(epubWidth, 10);
      if (this.zoomPageFitScale !== 1 || this.zoomPageWidthScale !== 1) {
        isSizeExist = true;
        this.setState({
          scale: this.zoomPageWidthScale,
        });
      }
    }

    this.setState({
      pages: _isEmpty(pages) ? _get(rendition, 'book.toc', []) : pages,
      isZoomMenuVisible: this.state.isZoomMenuVisible || isSizeExist
    });
  }

  handleLocationUpdate(location) {
    const currentPage = this.state.pages.findIndex((page) => page.href === location) + 1;
    this.setState({ currentPage, loading: true });
  }

  handleError(error) {
    this.setState({ loading: false });
    console.error(error.message, error);
  }

  render() {
    const { style, className, url, authString } = this.props;
    const { isFullScreen, currentPage, pages, loading, scale, isToolbarVisible, isZoomMenuVisible } = this.state;
    const styles = require('./EpubViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EpubViewer: true,
      center: this.isIE11
    }, className);

    const epubStyle = {
      transform: 'scale(' + scale + ')',
      height: 100 / scale + '%',
      width: 100 / scale + '%',
    };

    return (
      <div
        ref={(c) => { this.epubViewer = c; }}
        className={classes}
        style={style}
      >
        {this.isIE11 && <Blankslate
          icon="info"
          heading="Not Supported"
          message="IE 11 and lower is not supported, please try Edge or other browser like Chrome."
        />}
        {!this.isIE11 && <Fullscreen
          fullScreenToggle={isFullScreen}
          onExitFullScreen={this.handleExitFullScreen}
          className={styles.fullScreen}
        >
          <div style={epubStyle} className={styles.epub}>
            {url && <Epub
              url={url + authString}
              scale={scale}
              loading={loading}
              href={_get(pages, `${currentPage - 1}.href`, '')}
              onReady={this.handleEpubReady}
              onStart={this.handleEpubStart}
              onLocationUpdate={this.handleLocationUpdate}
              onError={this.handleError}
            />}
          </div>
          {isToolbarVisible && <ViewerToolbar
            ref={(c) => { this.viewerToolbar = c; }}
            currentPage={currentPage}
            totalPages={pages.length}
            fullscreen
            prevPageDisabled={loading || pages.length === 1}
            nextPageDisabled={loading || pages.length === 1}
            zoomOutDisabled={loading || scale === MIN_SCALE}
            zoomInDisabled={loading || scale === MAX_SCALE}
            zoom={scale}
            zoomMenuDisabled={!isZoomMenuVisible}
            onItemClick={this.handleToolbarItemClick}
          />}
        </Fullscreen>}
      </div>
    );
  }
}
