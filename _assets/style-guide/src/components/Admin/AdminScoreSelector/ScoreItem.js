import PropTypes from 'prop-types';
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

import React, { Component } from 'react';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Checkbox from 'components/Checkbox/Checkbox';
import RangeSlider from 'components/RangeSlider/RangeSlider';

export default class ScoreItem extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.number,

    /** Key name of the attribute */
    keyValue: PropTypes.string,
    keyLabel: PropTypes.string,
    index: PropTypes.number,

    onToggle: PropTypes.func,
    onChange: PropTypes.func,
    onSave: PropTypes.func,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      enabled: !!props.value,
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps;

    if (value && !this.props.value) {
      this.setState({ enabled: true });
    }
  }

  handleToggle(event) {
    this.setState({ enabled: !this.state.enabled });
    if (typeof this.props.onToggle === 'function') {
      this.props.onToggle(event, this.props);
    }
  }

  handleChange(value) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value, this.props);
    }
  }

  handleOnSave(value) {
    if (typeof this.props.onSave === 'function') {
      this.props.onSave(value, this.props);
    }
  }

  render() {
    const {
      index,
      min,
      max,
      step,
      value,
      keyValue,
      keyLabel,
      style,
      strings,
      className,
    } = this.props;
    const styles = require('./AdminScoreSelector.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ItemContainer: true
    }, className);

    return (
      <div className={classes} ref={() => this['badgeItem_' + index]} style={style}>
        <Checkbox
          label={keyLabel}
          name={'enabled_' + keyValue}
          value={!!value}
          checked={!!this.state.enabled}
          onChange={this.handleToggle}
        />

        <TransitionGroup className={styles.sliderContainer}>
          {!!this.state.enabled && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.rangeContainer}>
              <RangeSlider
                handleIconType="round"
                min={min}
                max={max}
                step={step}
                value={value}
                withBars
                barColour={['var(--base-color)']}
                showTooltip
                onChange={this.handleChange}
                onAfterChange={this.handleOnSave}
                className={styles.rangeSlider}
              />
              <span className={styles.rangeValue}>{value}</span>
              <span className={styles.lessLabel}>{keyValue === 'content_to_activity_ratio' ? strings.content : strings.less}</span>
              <span className={styles.moreLabel}>{keyValue === 'content_to_activity_ratio' ? strings.activity : strings.more}</span>
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
