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

import isEqual from 'lodash/isEqual';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { Swipeable } from 'react-swipeable';
import FeaturedItem from 'components/FeaturedItem/FeaturedItem';

/**
 * FeaturedSlider displays Featured Stories in a carousel.
 */
export default class FeaturedSlider extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,

    autoSlide: PropTypes.bool,
    containerWidth: PropTypes.number,
    slideTiming: PropTypes.number,
    slideWidth: PropTypes.number,
    controlWidth: PropTypes.number,

    showBadges: PropTypes.bool,
    showStoryAuthor: PropTypes.bool,
    authString: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: [],
    autoSlide: false,
    containerWidth: null,   // auto-resizes
    slideTiming: 5000,
    slideWidth: 640,
    controlWidth: 74,
    showBadges: false,
    authString: '',
    showStoryAuthor: true,
  };

  constructor(props) {
    super(props);

    const list = this.prepareList(props.list);
    this.initialSlide = parseInt(list.length / 2, 10);

    this.state = {
      containerWidth: props.containerWidth,
      currentSlide: this.initialSlide,
      isHoveringLeft: false,
      isHoveringRight: false,
      list: list,
      trackWidth: props.slideWidth * (list.length + 1)
    };

    autobind(this);

    // refs
    this.container = null;

    this.slideInterval = null;
    this.checkEndTimeout = null;
  }

  componentDidMount() {
    this.updateContainerWidth(this.container.offsetWidth);

    if (!this.props.containerWidth) {
      window.addEventListener('resize', this.handleResize);
    }
    if (this.props.autoSlide && this.state.list.length) {
      this.startAutoSlide();
    }

    this._isMounted = true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.list, this.props.list)) {
      const list = this.prepareList(nextProps.list);
      this.initialSlide = parseInt(list.length / 2, 10);
      this.setState({
        list: list,
        currentSlide: this.initialSlide,
        trackWidth: nextProps.slideWidth * (list.length + 1)
      });
    }
  }

  componentDidUpdate() {
    if (this.state.action === 'slide') {
      this.checkEndTimeout = window.setTimeout(this.checkEnd, 500);
    }
  }

  componentWillUnmount() {
    if (!this.props.containerWidth) {
      window.removeEventListener('resize', this.handleResize);
    }
    if (this.props.autoSlide) {
      this.stopAutoSlide();
    }

    clearTimeout(this.checkEndTimeout);
    this._isMounted = false;
  }

  prepareList(list) {
    // Duplicate items to fill list
    return [...list, ...list, ...list, ...list];
  }

  handleResize() {
    this.updateContainerWidth(this.container.offsetWidth);
  }

  updateContainerWidth(width) {
    this.setState({ containerWidth: width });
  }

  handleMouseEnter() {
    if (this.props.autoSlide) {
      this.stopAutoSlide();
    }
  }

  handleMouseMove(event) {
    const containerWidth = this.state.containerWidth;
    const slideWidth = this.props.slideWidth;
    const hoverSpace = containerWidth - slideWidth;
    const x = event.clientX - this.container.getBoundingClientRect().left;

    const leftX = hoverSpace / 2;
    const rightX = containerWidth - (hoverSpace / 2);

    let isHoveringLeft = false;
    let isHoveringRight = false;

    if (x <= leftX) {
      isHoveringLeft = true;
    } else if (x >= rightX) {
      isHoveringRight = true;
    }

    this.setState({
      isHoveringLeft: isHoveringLeft,
      isHoveringRight: isHoveringRight
    });
  }

  handleMouseOut() {
    if (this.props.autoSlide) {
      this.startAutoSlide();
    }

    this.setState({
      isHoveringLeft: false,
      isHoveringRight: false
    });
  }

  handleSwiping() {
    this.stopAutoSlide();
  }

  handleSwipedLeft() {
    this.handleNextSlideClick();

    // Re-enable autoslide
    if (this.props.autoSlide) {
      this.startAutoSlide();
    }
  }

  handleSwipedRight() {
    this.handlePrevSlideClick();

    // Re-enable autoslide
    if (this.props.autoSlide) {
      this.startAutoSlide();
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(this.handleNextSlideClick, this.props.slideTiming);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  handleNextSlideClick() {
    if (this._isMounted && !this.checkEndTimeout) {
      this.setState({
        action: 'slide',
        currentSlide: this.state.currentSlide + 1
      });
    }
  }

  handlePrevSlideClick() {
    if (this._isMounted && !this.checkEndTimeout) {
      this.setState({
        action: 'slide',
        currentSlide: this.state.currentSlide - 1
      });
    }
  }

  checkEnd() {
    const { currentSlide, list } = this.state;
    this.checkEndTimeout = null;

    if (currentSlide === list.length - 3 || currentSlide === 2) {
      const newSlide = currentSlide === 2 ? this.initialSlide + 2 : this.initialSlide - 3;
      this.setState({
        action: 'none',
        currentSlide: newSlide
      });
    }
  }

  render() {
    const {
      slideWidth,
      showBadges,
      controlWidth,
      authString,
      onAnchorClick,
      onStoryClick,
      showStoryAuthor,
    } = this.props;
    const {
      containerWidth,
      currentSlide,
      isHoveringLeft,
      isHoveringRight,
      list
    } = this.state;
    const styles = require('./FeaturedSlider.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FeaturedSlider: true
    }, this.props.className);

    const margin = 16;
    let offset = 0;
    if (containerWidth) {
      offset = (containerWidth - (slideWidth + margin)) / 2;
    }

    const xPos = -((currentSlide) * (slideWidth + margin)) + offset;
    const trackStyle = {
      width: this.state.trackWidth + 'px',
      transform: 'translate3d(' + xPos + 'px, 0, 0)',
      transition: this.state.action === 'slide' ? 'transform 500ms ease' : 'none'
    };

    const prevStyle = {
      transform: isHoveringLeft ? 'translate3d(0, 0, 0)' : `translate3d(${-controlWidth}px, 0, 0)`,
      width: controlWidth + 'px'
    };

    const nextStyle = {
      transform: isHoveringRight ? 'translate3d(0, 0, 0)' : `translate3d(${controlWidth}px, 0, 0)`,
      width: controlWidth + 'px'
    };

    return (
      <Swipeable
        onSwiping={this.handleSwiping}
        onSwipedLeft={this.handleSwipedLeft}
        onSwipedRight={this.handleSwipedRight}
        trackMouse
        className={classes}
        style={this.props.style}
      >
        <div
          ref={(c) => { this.container = c; }}
          onMouseEnter={this.handleMouseEnter}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseOut}
          className={styles.slider}
        >
          <div className={styles.prev} style={prevStyle} onClick={this.handlePrevSlideClick} />
          <div className={styles.next} style={nextStyle} onClick={this.handleNextSlideClick} />
          <div className={styles.track} style={trackStyle}>
            <div className={styles.list}>
              {list.map((item, index) => (
                <FeaturedItem
                  key={item.permId + '-' + index}
                  showBadges={showBadges}
                  showIcons
                  authString={authString}
                  className={styles.listItem}
                  onAnchorClick={onAnchorClick}
                  onStoryClick={onStoryClick}
                  {...item}
                  showStoryAuthor={showStoryAuthor}
                />
              ))}
            </div>
          </div>
        </div>
      </Swipeable>
    );
  }
}
