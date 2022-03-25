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
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Blankslate from 'components/Blankslate/Blankslate';
import Fullscreen from 'components/Fullscreen/Fullscreen';
import ViewerPages from 'components/Viewer/ViewerPages';
import ViewerToolbar from 'components/Viewer/ViewerToolbar';

import Image from './Image';

/**
 * Click and drag scroll for the image.
 * Full screen image.
 * Loading view for the image.
 * One component for single image and multi images.
 */
export default class ImageViewer extends PureComponent {
  static propTypes = {
    /** Url of the single image, if you want to show only one image, don't put the multi in the component and don't use pages for the url */
    url: PropTypes.string,

    /** Value will be 'fileurl' if created via Web Link */
    source: PropTypes.string,

    /** show multi images, by using this value, the component would determine use url or use pages to show the image */
    multi: PropTypes.bool,

    /** toggle the left side menu */
    showPages: PropTypes.bool,

    /** the collection of images */
    pages: PropTypes.array,

    /** required to display files in secure storage */
    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    pages: []
  };

  constructor(props) {
    super(props);
    this.zoomSteps = [0.5, 0.75, 1, 1.5, 2, 3, 4];
    this.rotateSteps = [0, 90, 180, 270];
    this.state = {
      scale: 1.0,
      rotate: 0,
      currentPage: 1,
      toolBarVisible: false,
      zoomInDisabled: false,
      zoomOutDisabled: false,
      fullScreenToggle: false,
      loaded: false
    };

    autobind(this);
  }

  handleToolbarItemClick(event, action) {
    let newZoomIndex;
    let newZoomValue;
    let newRotateIndex;
    let newRotateValue;
    const zoomIndex = this.zoomSteps.indexOf(this.state.scale);
    const rotateIndex = this.rotateSteps.indexOf(this.state.rotate);

    switch (action) {
      case 'fullscreen':
        this.setState({ fullScreenToggle: !this.state.fullScreenToggle });
        break;
      case 'zoomIn':
        newZoomIndex = zoomIndex + 1;
        newZoomValue = this.zoomSteps[newZoomIndex];
        if (newZoomValue) {
          this.setState({
            scale: newZoomValue,
            zoomInDisabled: (newZoomIndex === this.zoomSteps.length - 1),
            zoomOutDisabled: false
          });
        }
        break;
      case 'zoomOut':
        newZoomIndex = zoomIndex - 1;
        newZoomValue = this.zoomSteps[newZoomIndex];
        if (newZoomValue) {
          this.setState({
            scale: newZoomValue,
            zoomInDisabled: false,
            zoomOutDisabled: (newZoomIndex <= 0)
          });
        }
        break;
      case 'prevPage': {
        let newPage = this.state.currentPage - 1;
        if (newPage < 1) {
          newPage = this.props.pages.length;
        }
        this.setState({ currentPage: newPage });
        break;
      }
      case 'nextPage': {
        let newPage = this.state.currentPage + 1;
        if (newPage > this.props.pages.length) {
          newPage = 1;
        }
        this.setState({ currentPage: newPage });
        break;
      }
      case 'rotate':
        newRotateIndex = rotateIndex + 1;
        newRotateValue = this.rotateSteps[newRotateIndex];
        if (!newRotateValue) {
          newRotateIndex = 0;
          newRotateValue = 0;
        }
        this.setState({
          rotate: newRotateValue,
        });
        break;
      default:
        console.info('Unknown action: ' + action);
        break;
    }
  }

  handlePageClick(event, page) {
    this.setState({ currentPage: page });
  }

  handleLoad() {
    this.setState({ loaded: true });
  }

  handleError(event, error) {
    this.setState({ error: error });
  }

  handleMouseMove(isVisible) {
    if (this.state.toolBarVisible !== isVisible) {
      this.setState({ toolBarVisible: isVisible });
    }
  }

  handleMouseOver() {
    if (!this.state.toolBarVisible) {
      this.setState({ toolBarVisible: true });
    }
  }

  handleMouseOut() {
    if (this.state.toolBarVisible) {
      this.setState({ toolBarVisible: false });
    }
  }

  handleExitFullScreen() {
    this.setState({ fullScreenToggle: false });
  }

  render() {
    const {
      toolBarVisible,
      zoomInDisabled,
      zoomOutDisabled,
      scale,
      currentPage,
      fullScreenToggle,
      loaded,
      error,
      rotate
    } = this.state;
    const { multi, pages, showPages } = this.props;
    const styles = require('./ImageViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ImageViewer: true
    }, this.props.className);

    const wrapperClasses = cx({
      wrapper: true,
      isFullScreen: fullScreenToggle
    });

    let url = this.props.url;
    if (multi && pages[currentPage - 1]) {
      url = pages[currentPage - 1].url;
    }

    // Append auth string for all files except "fileurl" (weblink)
    if (this.props.source !== 'fileurl') {
      url += this.props.authString;
    }

    return (
      <div
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        className={classes}
        style={this.props.style}
      >
        <Fullscreen
          fullScreenToggle={fullScreenToggle}
          onExitFullScreen={this.handleExitFullScreen}
          style={{ height: '100%' }}
        >
          {this.props.children}
          <div className={wrapperClasses}>
            <TransitionGroup>
              {showPages && !fullScreenToggle && <CSSTransition
                classNames="slide-left"
                timeout={250}
                appear
              >
                <ViewerPages
                  key="pages"
                  currentPage={currentPage}
                  pages={pages}
                  onPageClick={this.handlePageClick}
                />
              </CSSTransition>}
            </TransitionGroup>
            {error && <Blankslate
              icon="error"
              heading="404"
              message="Image Not Found"
              middle
            />}
            {!error && <Image
              url={url}
              scale={scale}
              rotate={rotate}
              onLoad={this.handleLoad}
              onError={this.handleError}
            />}
          </div>
          <ViewerToolbar
            currentPage={currentPage}
            totalPages={pages.length}
            fullscreen={!this.props.hasWatermark}
            zoom
            rotate
            zoomInDisabled={zoomInDisabled}
            zoomOutDisabled={zoomOutDisabled}
            onItemClick={this.handleToolbarItemClick}
            visible={loaded && toolBarVisible}
            inViewer={this.props.inViewer}
          />
        </Fullscreen>
      </div>
    );
  }
}
