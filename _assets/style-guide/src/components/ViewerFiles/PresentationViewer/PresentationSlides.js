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

/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-restricted-globals */

import _get from 'lodash/get';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import moment from 'moment';

/**
 * PresentationSlides description
 */
export default class PresentationSlides extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    baseUrl: PropTypes.string,

    /** Description of customProp2 */
    slideThumbnails: PropTypes.array,

    onClick: PropTypes.func,

    slideDimension: PropTypes.string,

    currentSlide: PropTypes.number,

    isToolbarVisible: PropTypes.bool,

    onSetSlideOrders: PropTypes.func,

    isVisible: PropTypes.bool,

    hideSlides: PropTypes.object,

    isEyeActive: PropTypes.bool,

    allowSorter: PropTypes.bool,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    slideThumbnails: [],
    slideDimension: '',
    baseUrl: '',
    allowSorter: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dragging: NaN,
      time: 0,
    };
    autobind(this);

    this.down = { cleared: true };
    this.up = { cleared: true };
    this.data = [];

    // refs
    this.slideContainer = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.slideThumbnails.length === 0 && nextProps.slideThumbnails.length > 0) {
      this.setState({ data: nextProps.slideThumbnails });
      this.slides = [...nextProps.slideThumbnails];
      this.data = [...nextProps.slideThumbnails];
    }

    if (this.props.slideDimension.length === 0 && nextProps.slideDimension.length > 0) {
      const width = isFinite(nextProps.slideDimension.split(',')[0]) ? Number(nextProps.slideDimension.split(',')[0]) : 1;
      const height = isFinite(nextProps.slideDimension.split(',')[1]) ? Number(nextProps.slideDimension.split(',')[1]) : 1;

      this.setState({ dimensionPercentage: `${height / width * 100}%` });
    }

    if (this.props.currentSlide !== nextProps.currentSlide) {
      this.handleResetTimer();
    }

    if (!this.props.isToolbarVisible && nextProps.isToolbarVisible) {
      if (this.counter) {
        clearInterval(this.counter);
        this.counter = null;
      }

      this.counter = window.setInterval(() => {
        this.setState({
          time: this.state.time + 1
        });
      }, 1000);
    }

    if (this.props.isToolbarVisible && !nextProps.isToolbarVisible) {
      clearInterval(this.counter);
      this.counter = null;
      this.setState({
        time: 0,
      });
    }

    // if (this.props.isEyeActive && !nextProps.isEyeActive) {
    //   this.setState({
    //     data: this.state.data.filter((url) => this.props.hideSlides[url.match(/\d+/g)[1] - 1] !== 0),
    //   });
    // }

    if (!this.props.isEyeActive && nextProps.isEyeActive) {
      this.setState({
        data: this.state.data === [] ? this.props.slideThumbnails : this.data,
      });
      //console.log(this.props.slideThumbnails);
    }
  }

  componentWillUnmount() {
    clearInterval(this.counter);
    this.counter = null;
    this.data = [];
  }

  sort(data, dragging) {
    if (this.state.data !== data || this.state.dragging !== dragging) {
      this.data = data;
      this.setState({ data, dragging });
    }
  }

  handleDragEnd() {
    const newOrder = this.data.map((url, index) => ({
      [url.match(/\d+/g)[1] - 1]: index + 1
    }));

    this.slides = [...this.data];

    this.props.onSetSlideOrders(Object.assign({}, ...newOrder));

    this.sort(this.data, undefined);

    this.handleDragLeave();
  }

  handleDragStart(e) {
    this.dragged = Number(e.currentTarget.dataset.index);
    const dt = e.dataTransfer;
    dt.effectAllowed = 'move';
    //console.log(e);
    this.handleClick(e);
    //e.dataTransfer.effectAllowed = 'move';
    //dt.setData('text/html', null);
  }

  handleDragOver(e) {
    e.preventDefault();
    const over = e.currentTarget;
    const dragging = this.state.dragging;
    const from = isFinite(dragging) ? dragging : this.dragged;
    const to = Number(over.dataset.index);

    if (from !== to) {
      const items = this.state.data;
      items.splice(to, 0, items.splice(from, 1)[0]);
      this.sort(items, to);
    }

    //drag and drop
    const ele = this.slideContainer;
    const rect = ele.getBoundingClientRect();

    if (e.clientY > rect.height + rect.top - 100) {
      if (this.down.cleared) {
        ele.scrollTop += 2;
        this.down = window.setInterval(function() {
          ele.scrollTop += 2;
        }, 1);
      }
    }

    if (e.clientY >= (rect.top + 100) && e.clientY <= (rect.height + rect.top - 100)) {
      this.handleDragLeave();
    }

    if (e.clientY < rect.top + 100) {
      if (this.up.cleared) {
        ele.scrollTop -= 2;
        this.up = window.setInterval(function () {
          ele.scrollTop -= 2;
        }, 1);
      }
    }
  }

  handleDragLeave() {
    if (!this.down.cleared) {
      window.clearInterval(this.down);
      this.down = { cleared: true };
    }

    if (!this.up.cleared) {
      window.clearInterval(this.up);
      this.up = { cleared: true };
    }
  }

  handleClick(event) {
    const dataId = _get(event, 'currentTarget.dataset.id', '');
    if (this.props.currentSlide === Number(dataId)) {
      this.handleResetTimer();
    }

    this.props.onClick(event);
  }

  handleResetTimer() {
    clearInterval(this.counter);
    this.setState({
      time: 0
    });
    this.counter = window.setInterval(() => {
      this.setState({
        time: this.state.time + 1
      });
    }, 1000);
  }

  render() {
    const { isVisible, baseUrl, style, currentSlide, hideSlides, isEyeActive, allowSorter } = this.props;
    const { dimensionPercentage, dragging, data, time } = this.state;
    const styles = require('./PresentationSlides.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PresentationSlides: true,
      hidden: !isVisible
    }, this.props.className);

    return (
      <div className={classes} style={style}>
        <div
          ref={(c) => { this.slideContainer = c; }}
          className={styles.slideContainer}
        >
          <ul data-type={!isEyeActive ? 'slides' : 'hidden'}>
            {data && data.map((url, index) =>
              (<li
                key={index}
                className={`${styles.image}`}
              >
                <div
                  className={`${index === dragging ? styles.dragging : ''} ${styles.slideImage} ${Number(url.match(/\d+/g)[1]) === currentSlide ? styles.active : ''}`}
                  style={{
                    backgroundImage: `url(${baseUrl + url})`,
                    paddingBottom: dimensionPercentage,
                  }}
                  draggable={isEyeActive || !allowSorter ? 'false' : 'true'}
                  data-id={url.match(/\d+/g)[1]}
                  data-index={index}
                  data-type={hideSlides[url.match(/\d+/g)[1] - 1] === 0 ? 'hidden' : 'visible'}
                  onClick={this.handleClick}
                  onDragEnd={this.handleDragEnd}
                  onDragOver={this.handleDragOver}
                  onDragStart={this.handleDragStart}
                >
                  <div className={styles.slideTimer}>
                    {Number(url.match(/\d+/g)[1]) === currentSlide && !isEyeActive && moment.utc(moment.duration(time * 1000).asMilliseconds()).format('HH:mm:ss')}
                  </div>
                </div>
                <div>{index + 1}</div>
              </li>))}
          </ul>
        </div>
      </div>
    );
  }
}
