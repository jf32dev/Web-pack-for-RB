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

/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

function elemInView(el, parentEl) {
  // Not in view (above) || Not in view (below)
  if (el.offsetTop < parentEl.scrollTop || el.offsetTop > (parentEl.scrollTop + parentEl.clientHeight)) {
    return false;
  }

  return true;
}

class PageItem extends Component {
  static propTypes = {
    title: PropTypes.any,
    number: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    this.props.onClick(event, this.props.number);
  }

  render() {
    const styles = require('./ViewerPages.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      pageItem: true,
      activeItem: this.props.active,
    });

    return (
      <li className={classes} onClick={this.handleClick}>
        <img src={this.props.url} alt={this.props.title} title={this.props.title} />
        <p>{this.props.title}</p>
      </li>
    );
  }
}

/**
 * Pages are displayed for Documents with images and PDFs.
 */
export default class ViewerPages extends Component {
  static propTypes = {
    /** Pages objects: <code>[{ title: '', number: '', url: '' }]</code> */
    pages: PropTypes.array.isRequired,

    /** Current page index */
    currentPage: PropTypes.number,

    /** PDF pages render differently */
    isPdf: PropTypes.bool,

    /** Set the theme (light/dark) */
    theme: PropTypes.oneOf(['light', 'dark']),

    /** Returns event and pageNumber */
    onPageClick: PropTypes.func.isRequired,

    /** Only required for PDF */
    onRequestThumbnail: PropTypes.func
  };

  static defaultProps = {
    currentPage: 1,
    theme: 'light'
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.scrollTimeout = null;
    this.thumbsToRequest = [];
    this.thumbLimit = 5;

    // refs
    this.list = null;
    this.pages = null;
  }

  componentDidMount() {
    if (this.props.currentPage) {
      this.scrollTo(this.props.currentPage);

      // Request first 5 thumbs
      // could do this after PDF load to avoid
      // animation delay
      if (this.props.isPdf && this.props.pages && this.props.pages.length) {
        this.requestNextThumbs(this.props.currentPage);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage !== this.props.currentPage) {
      // Scroll to thumb if not in view
      if (!elemInView(this.list.children[nextProps.currentPage - 1], this.pages)) {
        this.scrollTo(nextProps.currentPage);
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.currentPage !== this.props.currentPage ||
      nextProps.pages !== this.props.pages ||
      nextProps.theme !== this.props.theme) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  requestNextThumbs(pageNumber) {
    const { pages } = this.props;
    this.thumbsToRequest.length = 0;

    for (let i = pageNumber - 1; i < pages.length; i++) {
      if (this.thumbsToRequest.length > this.thumbLimit) {
        break;
      } else if (pages[i] && !pages[i].url) {
        this.thumbsToRequest.push(i + 1);  // pageNumber
      }
    }

    // Process first thumbnail
    if (this.thumbsToRequest.length) {
      this.props.onRequestThumbnail(this.thumbsToRequest[0], this.thumbSuccess);
    }
  }

  thumbSuccess() {
    this.thumbsToRequest.splice(0, 1);

    // Process next thumb in array
    if (this.thumbsToRequest.length) {
      this.props.onRequestThumbnail(this.thumbsToRequest[0], this.thumbSuccess);
    }
  }

  scrollTo(pageNumber) {
    const offset = this.list.children[pageNumber - 1].offsetTop - 16;
    this.pages.scrollTop = offset;
  }

  findCurrentPage() {
    const { pages, list } = this;

    for (const i in list.children) {
      if (elemInView(list.children[i], pages)) {
        return parseInt(i, 10) + 1;  // pageNumber
      }
    }

    return false;
  }

  handleScroll(event) {
    // Detect scrollStop
    if (this.props.isPdf) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(this.handleScrollStop.bind(null, event), 150);
    }
  }

  handleScrollStop() {
    clearTimeout(this.scrollTimeout);
    const nearestPage = this.findCurrentPage();
    this.requestNextThumbs(nearestPage - 1);
  }

  render() {
    const { currentPage, pages, theme, onPageClick, className, style } = this.props;
    const styles = require('./ViewerPages.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ViewerPages: true,
      isDark: theme === 'dark'
    }, className);

    return (
      <div
        ref={(c) => { this.pages = c; }}
        className={classes}
        style={style}
        onScroll={this.handleScroll}
      >
        <ul
          ref={(c) => { this.list = c; }}
          className={styles.listWrap}
        >
          {pages.map((page, index) => (<PageItem
            key={'page-' + (index + 1)}
            title={index + 1}
            number={index + 1}
            url={page.url}
            active={currentPage === (index + 1)}
            onClick={onPageClick}
          />))}
        </ul>
      </div>
    );
  }
}
