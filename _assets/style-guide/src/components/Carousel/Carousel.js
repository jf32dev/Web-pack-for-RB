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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { useReducer, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSwipeable } from 'react-swipeable';
import classNames from 'classnames/bind';
import Loader from 'components/Loader/Loader';
import Blankslate from 'components/Blankslate/Blankslate';
import getComponentWidth from 'helpers/getComponentWidth';

export const NEXT = 'NEXT';
export const PREV = 'PREV';
export const RESET = 'RESET';
export const HOVERING = 'HOVERING';

const initialState = {
  dir: NEXT,
  isHoveringLeft: false,
  isHoveringRight: false,
  navDots: 0,
};

const reducer = (state, { type, navDotsCount, isHoveringLeft, isHoveringRight }) => {
  switch (type) {
    case RESET:
      return initialState;
    case PREV: {
      const dotsPos = state.navDots === 0 ? navDotsCount - 1 : state.navDots - 1;
      return {
        ...state,
        dir: PREV,
        navDots: dotsPos
      };
    }
    case NEXT: {
      const dotsPos = state.navDots === navDotsCount - 1 ? 0 : state.navDots + 1;
      return {
        ...state,
        dir: NEXT,
        navDots: dotsPos
      };
    }
    case HOVERING:
      return { ...state, isHoveringLeft, isHoveringRight };
    default:
      return state;
  }
};

const Carousel = props => {
  const {
    children,
    className,
    controlWidth,
    dots,
    emptyHeading,
    emptyMessage,
    icon,
    itemMargin,
    itemSize,
    loading,
    isCircularCarousel,
    startingX
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      // Reset and calculate the positions again
      dispatch({ type: RESET });
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const numItems = React.Children.count(children);

  // calculations to calculate required variables

  const carouselWidth = (window.innerWidth || document.body.clientWidth) - 58; // 58 is the nav width
  const totalCarouselItemsWidth = getComponentWidth(numItems, 0, itemMargin, itemSize);
  const navDotsCount = Math.ceil(totalCarouselItemsWidth / carouselWidth);

  const showControls = totalCarouselItemsWidth > carouselWidth;
  const showLeftControl = state.navDots !== 0;
  const showRightControl = state.navDots !== navDotsCount - 1;

  const individualCarouselItemWidth = getComponentWidth(1, 0, 20, itemSize);
  const itemsPerCarouselScreen = (carouselWidth / individualCarouselItemWidth);

  const slide = direction => {
    dispatch({
      type: direction,
      navDotsCount: navDotsCount,
    });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => slide(NEXT),
    onSwipedRight: () => slide(PREV),
    preventDefaultTouchmoveEvent: false,
    trackMouse: true,
    trackTouch: true,
  });

  const handleMouseMove = event => {
    const containerWidth = containerRef.current.offsetWidth;
    const x = event.clientX - containerRef.current.getBoundingClientRect().left;
    const leftX = containerWidth / 2;
    const rightX = leftX + 1;

    let isHoveringLeft = false;
    let isHoveringRight = false;

    if (x <= leftX) {
      isHoveringLeft = true;
    } else if (x >= rightX) {
      isHoveringRight = true;
    }

    dispatch({
      type: HOVERING,
      isHoveringLeft: isHoveringLeft,
      isHoveringRight: isHoveringRight
    });
  };

  const handleMouseOut = () => {
    dispatch({
      type: HOVERING,
      isHoveringLeft: false,
      isHoveringRight: false
    });
  };

  const styles = require('./Carousel.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    CarouselSlider: true,
    Wrapper: true
  }, className);

  const prevStyle = {
    transform: state.isHoveringLeft ? 'translate3d(0, 0, 0)' : `translate3d(${-controlWidth}px, 0, 0)`,
    width: controlWidth + 'px'
  };

  const nextStyle = {
    transform: state.isHoveringRight ? 'translate3d(0, 0, 0)' : `translate3d(${controlWidth}px, 0, 0)`,
    width: controlWidth + 'px'
  };

  let translateValue = '';

  const isLastScreen = state.navDots !== 0 && state.navDots === navDotsCount - 1;
  const mainTranslate = state.navDots * -100;
  const initialPadding = state.navDots * (carouselWidth - (Math.floor(itemsPerCarouselScreen) * individualCarouselItemWidth));

  if (state.navDots === 0) {
    translateValue = `translateX(${mainTranslate}%) translateX(${startingX}px)`;
  } else if (isLastScreen) {
    const itemCountInLastScreen = numItems - (state.navDots * itemsPerCarouselScreen);
    const deficitItemSpace = (itemsPerCarouselScreen - itemCountInLastScreen) * individualCarouselItemWidth;

    translateValue = `translateX(${mainTranslate}%)  translateX(${deficitItemSpace}px)`;
  } else {
    translateValue = `translateX(${mainTranslate}%)  translateX(${startingX}px)  translateX(${initialPadding}px)`;
  }

  const containerStyle = {
    transition: 'transform 1s ease',
    transform: translateValue
  };


  if (loading) {
    return (
      <div className={styles.loader}>
        <Loader type="content" />
      </div>
    );
  } else if (!children.length) {
    return (
      <Blankslate
        icon={icon}
        heading={emptyHeading}
        message={emptyMessage}
        middle
      />
    );
  }


  return (
    <div style={{ flex: 'auto' }} {...handlers}>
      <div
        ref={containerRef}
        className={classes}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
      >
        <div
          className={styles.Container}
          style={containerStyle}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={showControls ? styles.ItemWrapper : null}
              style={{ marginRight: itemMargin }}
            >
              {child}
            </div>
          ))}
        </div>
        {showControls && (isCircularCarousel || showLeftControl) && <div className={styles.prev} style={prevStyle} onClick={() => slide(PREV)} />}
        {showControls && (isCircularCarousel || showRightControl) && <div className={styles.next} style={nextStyle} onClick={() => slide(NEXT)} />}
      </div>
      {dots && showControls && <nav className={styles.bullets}>
        {[...Array(navDotsCount).fill(0)].map((item, ix) => (
          <span
            key={ix}
            className={ix === state.navDots ? styles.selected : null}
          />
        ))}
      </nav>}
    </div>
  );
};

Carousel.propTypes = {
  // Content to be displayed
  children: PropTypes.node,

  // Next and Prev button with
  controlWidth: PropTypes.number,

  // Set the starting margin distance from the left of the screen
  startingX: PropTypes.number,

  // navigation dots
  dots: PropTypes.bool,

  // set initial size of the item
  itemSize: PropTypes.number,

  // item right margin
  itemMargin: PropTypes.number,

  // direction
  dir: PropTypes.string,

  onAnchorClick: PropTypes.func,

  className: PropTypes.string,
  sliding: PropTypes.bool,
  style: PropTypes.object,
};

Carousel.defaultProps = {
  controlWidth: 60,
  dots: false,
  itemSize: 200,
  itemMargin: 16,
  startingX: 40
};

export default Carousel;
