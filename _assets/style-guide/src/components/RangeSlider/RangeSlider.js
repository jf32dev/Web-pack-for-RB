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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import ReactSlider from 'rc-rangeslider';

export default class RangeSlider extends PureComponent {
  static propTypes = {
    /** The minimum value of the slider */
    min: PropTypes.number,

    /** The maximum value of the slider */
    max: PropTypes.number,

    /**
     * Value to be added or subtracted on each step the slider makes.
     * Must be greater than zero.
     * `max - min` should be evenly divisible by the step value.
     */
    step: PropTypes.number,

    /** Minimal distance between any pair of handles. */
    minDistance: PropTypes.number,

    /**
     * Determines the initial positions of the handles and the number of handles if the component has no children.
     *
     * If a number is passed a slider with one handle will be rendered.
     * If an array is passed each value will determine the position of one handle.
     * The values in the array must be sorted.
     * If the component has children, the length of the array must match the number of children.
     */
    defaultValue: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ]),

    /**
     * Like `defaultValue` but for [controlled components](http://facebook.github.io/react/docs/forms.html#controlled-components).
     */
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ]),

    /** show tooltip on handles - must set onChatClick */
    showTooltip: PropTypes.bool,

    /** show number labels below slider */
    showNumbers: PropTypes.bool,

    /** allow pushing of surrounding handles when moving an handle */
    pushable: PropTypes.bool,

    /** Handle bar style */
    handleIconType: PropTypes.oneOf(['rect', 'round']),

    className: PropTypes.string,
    handleClassName: PropTypes.string,
    handleActiveClassName: PropTypes.string,

    /** If true bars between the handles will be rendered. */
    withBars: PropTypes.bool,
    barClassName: PropTypes.string,

    /** Colors to each bar can set here. If withBars is enabled */
    barColour: PropTypes.array,

    /** Callback called before starting to move a handle.*/
    onBeforeChange: PropTypes.func,

    /** Callback called on every value change.*/
    onChange: PropTypes.func,

    /** Callback called only after moving a handle has ended or when a new value is set by clicking on the slider.*/
    onAfterChange: PropTypes.func,

    /** Callback called when the the slider is clicked (handle or bars). Receives the value at the clicked position as argument.*/
    onSliderClick: PropTypes.func,

    style: PropTypes.object
  };

  static defaultProps = {
    showTooltip: false,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      min,
      max,
      minDistance,
      value,
      handleIconType,
      barColour,
      pushable,
      showTooltip,
      withBars,
      step,
      showNumbers,

      className,
      barClassName,
      handleClassName,
      handleActiveClassName,
      ...restProps
    } = this.props;
    const styles = require('./RangeSlider.less');
    const cx = classNames.bind(styles);
    const sliderClasses = cx({
      slider: true,
      sliderRoundClass: handleIconType === 'round',
      sliderRectClass: handleIconType === 'rect' || !handleIconType
    }, className);
    const barClasses = cx({
      bar: true,
      barRoundClass: handleIconType === 'round',
      barRectClass: handleIconType === 'rect' || !handleIconType
    }, barClassName);
    const handleClasses = cx({
      handle: true,
      handleRound: handleIconType === 'round',
      handleRectangle: handleIconType === 'rect' || !handleIconType
    }, handleClassName);
    const handleActiveClasses = cx({
      activeHandle: true,
    }, handleActiveClassName);

    const numericList = [];
    if (showNumbers) {
      for (let i = min || 0; i <= max; i += step) {
        numericList.push(
          <span
            className={styles.numeric}
            key={i}
            style={{ left: `${(i - min) >= 10000 / (max - min) ? '100' : (i - min) * 100 / (max - min)}%` }}
          >
            <span className={styles.numericItem}>{i}</span>
          </span>
        );

        if ((max - i) < step && (max - i) > 0) {
          numericList.push(
            <span
              className={styles.numeric}
              key={i + 1}
              style={{ left: '100%' }}
            >
              <span className={styles.numericItem}>{max}</span>
            </span>
          );
        }
      }
    }

    return (
      <div style={this.props.style}>
        <ReactSlider
          min={min}
          max={max}
          step={step}
          minDistance={minDistance}
          value={value}
          className={sliderClasses}
          handleClassName={handleClasses}
          handleActiveClassName={handleActiveClasses}
          barClassName={barClasses}
          withBars={withBars}
          barColour={barColour}
          pearling={pushable}
          showTooltip={showTooltip}
          {...restProps}
        />
        {showNumbers && <div className={styles.numericContainer}>
          {numericList}
        </div>}
      </div>
    );
  }
}
