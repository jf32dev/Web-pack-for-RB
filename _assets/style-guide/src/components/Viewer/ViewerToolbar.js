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

class ToolbarItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    action: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    this.props.onClick(event, this.props.action);
  }

  render() {
    return (
      <li
        title={this.props.title}
        className={this.props.className}
        onClick={this.handleClick}
      >
        {this.props.text}
      </li>
    );
  }
}

export default class ViewerToolbar extends Component {
  static propTypes = {
    currentPage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalPages: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    fullscreen: PropTypes.bool,
    zoom: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    rotate: PropTypes.bool,

    inViewer: PropTypes.bool,

    prevPageDisabled: PropTypes.bool,
    nextPageDisabled: PropTypes.bool,
    zoomInDisabled: PropTypes.bool,
    zoomOutDisabled: PropTypes.bool,
    zoomMenuDisabled: PropTypes.bool,

    fullscreenLabel: PropTypes.string,
    prevPageLabel: PropTypes.string,
    nextPageLabel: PropTypes.string,
    zoomInLabel: PropTypes.string,
    zoomOutLabel: PropTypes.string,
    rotateLabel: PropTypes.string,
    fullPageLabel: PropTypes.string,
    pageWidthLabel: PropTypes.string,

    onCurrentPageChange: PropTypes.func,
    onItemClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,

    visible: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    fullscreenLabel: 'Fullscreen',
    ofLabel: 'of',
    prevPageLabel: 'Previous Page',
    nextPageLabel: 'Next Page',
    zoomInLabel: 'Zoom In',
    zoomOutLabel: 'Zoom Out',
    rotateLabel: 'Rotate',
    fullPageLabel: 'Full Page',
    pageWidthLabel: 'Page Width',
    visible: true,
    zoomMenuDisabled: true
  };

  constructor(props) {
    super(props);
    this.state = {
      fadeInTime: 0,
      showZoomMenu: false
    };
    autobind(this);

    // refs
    this.zoomControls = null;
    this.zoomMenuLabel = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible === true && this.state.fadeInTime === 0) {
      this.setState({ fadeInTime: 1 });
    }
  }

  handleInputFocus(event) {
    event.target.select();
  }

  handleInputChange(event) {
    const { totalPages, onCurrentPageChange } = this.props;
    const pageNumber = parseInt(event.target.value, 10);

    // Propagate event if valid number
    if (typeof pageNumber === 'number' && !isNaN(pageNumber)
        && pageNumber <= totalPages && pageNumber > 0
        && typeof onCurrentPageChange === 'function') {
      onCurrentPageChange(event, pageNumber);
    }
  }

  handleZoomMenuClick() {
    this.setState({ showZoomMenu: !this.state.showZoomMenu }, () => {
      const zoomControls = this.zoomControls;
      if (zoomControls) {
        const zoomMenuLabel = this.zoomMenuLabel;
        zoomControls.style.left = (zoomMenuLabel.offsetLeft + zoomMenuLabel.offsetWidth / 2 - zoomControls.offsetWidth / 2) + 'px';
      }
    });
  }

  handleZoomMenuClose() {
    this.setState({ showZoomMenu: false });
  }

  render() {
    const {
      currentPage,
      totalPages,
      fullscreen,
      zoom,
      rotate,

      prevPageDisabled,
      nextPageDisabled,
      zoomInDisabled,
      zoomOutDisabled,

      fullscreenLabel,
      ofLabel,
      prevPageLabel,
      nextPageLabel,
      zoomInLabel,
      zoomOutLabel,
      rotateLabel,
      fullPageLabel,
      pageWidthLabel,

      onItemClick,
      onMouseEnter,
      onMouseLeave,

      visible,

      className,
      style } = this.props;
    const styles = require('./ViewerToolbar.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ViewerToolbar: true,
      inViewer: this.props.inViewer,
      disappear: !visible && this.state.fadeInTime === 0,
      fadeOut: !visible && this.state.fadeInTime > 0,
      fadeIn: visible,
    }, className);

    const prevPageClasses = cx({
      prevPage: true,
      disabled: prevPageDisabled
    });

    const nextPageClasses = cx({
      nextPage: true,
      disabled: nextPageDisabled
    });

    const zoomOutClasses = cx({
      zoomOut: true,
      disabled: zoomOutDisabled
    });

    const zoomInClasses = cx({
      zoomIn: true,
      disabled: zoomInDisabled
    });

    const sortHeaderClasses = cx({
      sortKey: true,
      reverseSort: this.state.showZoomMenu
    });

    const currentPageStyle = {
      width: currentPage > 99 ? '2.5rem' : '1.5rem'
    };

    return (
      <div
        className={classes} style={style} data-name="viewerToolbar"
        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      >
        {totalPages > 0 && <ul className={styles.pageIndicator}>
          <li><label htmlFor="currentPage">Page</label></li>
          <li>
            <input
              type="text"
              id="currentPage"
              value={currentPage}
              className={styles.currentPage}
              style={currentPageStyle}
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
            />
          </li>
          <li>{ofLabel}</li>
          <li className={styles.totalPages}>{totalPages}</li>
        </ul>}
        {totalPages > 0 && <ul className={styles.pageTools}>
          <ToolbarItem
            title={prevPageLabel} action="prevPage" className={prevPageClasses}
            onClick={onItemClick}
          />
          <ToolbarItem
            title={nextPageLabel} action="nextPage" className={nextPageClasses}
            onClick={onItemClick}
          />
        </ul>}
        {zoom && <ul className={styles.zoomTools}>
          <ToolbarItem
            title={zoomOutLabel} action="zoomOut" className={zoomOutClasses}
            onClick={onItemClick}
          />
          {!this.props.zoomMenuDisabled && <li
            ref={(c) => { this.zoomMenuLabel = c; }}
            title={this.props.zoom}
            action="zoomMenu"
            onClick={this.handleZoomMenuClick}
            className={sortHeaderClasses}
          >
            {parseInt(this.props.zoom * 100, 10)}%
          </li>}
          <ToolbarItem
            title={zoomInLabel} action="zoomIn" className={zoomInClasses}
            onClick={onItemClick}
          />
        </ul>}
        {rotate && <ul className={styles.rotateTools}>
          <ToolbarItem
            title={rotateLabel} action="rotate" className={styles.rotate}
            onClick={onItemClick}
          />
        </ul>}
        {fullscreen && <ul className={styles.screenTools}>
          <ToolbarItem
            title={fullscreenLabel} action="fullscreen" className={styles.fullscreen}
            onClick={onItemClick}
          />
        </ul>}

        {!this.props.zoomMenuDisabled && this.state.showZoomMenu && <div
          ref={(c) => { this.zoomControls = c; }}
          className={styles.zoomControls}
        >
          <ul>
            <ToolbarItem
              action="zoom25" className={styles.zoomLabel} onClick={onItemClick}
              text="25%" title="25%"
            />
            <ToolbarItem
              action="zoom50" className={styles.zoomLabel} onClick={onItemClick}
              text="50%" title="50%"
            />
            <ToolbarItem
              action="zoom75" className={styles.zoomLabel} onClick={onItemClick}
              text="75%" title="75%"
            />
            <ToolbarItem
              action="zoom100" className={styles.zoomLabel} onClick={onItemClick}
              text="100%" title="100%"
            />
            <ToolbarItem
              action="zoomPageFit" className={styles.zoomLabel} onClick={onItemClick}
              text={fullPageLabel} title={fullPageLabel}
            />
            <ToolbarItem
              action="zoomPageWidth" className={styles.zoomLabel} onClick={onItemClick}
              text={pageWidthLabel} title={pageWidthLabel}
            />
          </ul>
        </div>}
      </div>
    );
  }
}
