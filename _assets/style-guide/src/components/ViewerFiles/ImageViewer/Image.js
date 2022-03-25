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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Loader from 'components/Loader/Loader';

/**
 * Displays an <code>image</code> file.
 */
export default class Image extends PureComponent {
  static propTypes = {
    /** path to file */
    url: PropTypes.string.isRequired,

    /** degrees to rotate image */
    rotate: PropTypes.number,

    /** multiple to scale image */
    scale: PropTypes.number,

    onLoad: PropTypes.func,
    onError: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    rotate: 0,
    scale: 1.0
  };

  constructor(props) {
    super(props);
    this.state = {
      heightGreaterThanFrame: false,
      widthGreaterThanFrame: false,
      fullScreen: false,
      curYPos: 0,
      curXPos: 0,
      curDown: false,
      offsetTop: 0,
      offsetLeft: 0,
      loaded: false
    };

    autobind(this);

    // refs
    this.elem = null;
    this.frame = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.scale !== this.props.scale) {
      const newWidth = this.elem.offsetWidth * nextProps.scale;
      const newHeight = this.elem.offsetHeight * nextProps.scale;

      this.setState({
        heightGreaterThanFrame: newHeight > this.frame.offsetHeight,
        widthGreaterThanFrame: newWidth > this.frame.offsetWidth
      });
    }

    if (nextProps.url !== this.props.url) {
      this.setState({
        loaded: false
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scale !== this.props.scale) {
      this.frame.focus();
    }
  }

  handleOnLoad(event) {
    this.setState({ loaded: true });

    // Propagate event
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(event);
    }
  }

  handleDragScroll(e) {
    const { curYPos, curXPos, offsetTop, offsetLeft } = this.state;

    if (this.state.curDown === true && e.button === 0) {
      this.frame.scrollTop = offsetTop + (curYPos - e.pageY);
      this.frame.scrollLeft = offsetLeft + (curXPos - e.pageX);
    }

    if (e.type === 'mousedown' && e.button === 0) {
      this.setState({
        curDown: true,
        curYPos: e.pageY,
        curXPos: e.pageX
      });
    }

    if ((e.type === 'mouseup' && e.button === 0) || e.type === 'mouseleave') {
      this.setState({
        curDown: false,
        offsetTop: this.frame.scrollTop,
        offsetLeft: this.frame.scrollLeft
      });
    }
  }

  render() {
    const { heightGreaterThanFrame, widthGreaterThanFrame, fullScreen, curDown, loaded } = this.state;
    const { rotate, scale, className, style } = this.props;
    const styles = require('./Image.less');
    const cx = classNames.bind(styles);

    const classes = cx({
      Image: true,
      cursor: curDown,
      lessThanFrame: !heightGreaterThanFrame && !widthGreaterThanFrame,
      heightGreaterThanFrame: heightGreaterThanFrame && !widthGreaterThanFrame,
      widthGreaterThanFrame: !heightGreaterThanFrame && widthGreaterThanFrame,
      bothGreaterThanFrame: heightGreaterThanFrame && widthGreaterThanFrame
    }, className);
    const imageStyle = {
      transform: !fullScreen && 'rotate(' + rotate + 'deg) scale(' + scale + ')',
      maxWidth: fullScreen && '100%',
      height: fullScreen && 'auto',
      width: fullScreen && 'auto',
      display: !loaded && 'none'
    };

    return (
      <div
        ref={(c) => { this.frame = c; }}
        tabIndex="-1"
        className={classes}
        style={style}
      >
        {!loaded && <div className={styles.loaderWrap}>
          <Loader type="content" />
        </div>}
        <img
          ref={(c) => { this.elem = c; }}
          draggable="false"
          alt={this.props.description}
          title={this.props.description}
          src={this.props.url}
          style={imageStyle}
          onLoad={this.handleOnLoad}
          onError={this.props.onError}
          onMouseMove={this.handleDragScroll}
          onMouseDown={this.handleDragScroll}
          onMouseUp={this.handleDragScroll}
          onMouseLeave={this.handleDragScroll}
        />
      </div>
    );
  }
}
