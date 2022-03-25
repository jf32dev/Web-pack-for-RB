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
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import RangeSlider from 'components/RangeSlider/RangeSlider';
import PipsRangeSlider from 'components/RangeSlider/PipsRangeSlider';

const RangeSliderDocs = require('!!react-docgen-loader!components/RangeSlider/RangeSlider.js');

export default class RangeSliderView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      valueSecond: 20,
      values: [23, 29, 60],
      colors: ['purple', 'blue', 'green', 'red'],
      lastClick: 0,
      currentChangeValues: [],
    };
    autobind(this);
  }

  handleBeforeChange(values) {
    console.log(values);
  }

  handleChange(values) {
    this.setState({
      currentChangeValues: values,
    });
  }

  handleChangeSecond(value) {
    this.setState({
      valueSecond: value,
      currentChangeValues: [value]
    });
  }

  handleSliderClick(values) {
    this.setState({
      lastClick: values,
    });
  }

  render() {
    return (
      <section id="NavMenuView">
        <h1>Range Slider</h1>
        <Docs {...RangeSliderDocs} />

        <Debug>
          <div>
            <code>Changing values: {JSON.stringify(this.state.currentChangeValues)}</code>
            <code>  Last Clicked: {JSON.stringify(this.state.lastClick)}</code>
          </div>
        </Debug>

        <h2>Range Slider withBars and Rect handlers</h2>
        <p>Range selector used in Gamification - Badges for Admin components.</p>
        <ComponentItem>
          <RangeSlider
            handleIconType={'rect'}
            min={0}
            max={100}
            minDistance={2}
            value={this.state.values}
            withBars
            barColour={this.state.colors}
            pushable
            showTooltip
            onBeforeChange={this.handleBeforeChange}
            onChange={this.handleChange}
            onSliderClick={this.handleSliderClick}
          />
        </ComponentItem>

        <ComponentItem>
          <PipsRangeSlider
            barColour={['#f5f5f5', '#f5f5f5']}
            onChange={this.handleChangeSecond}
            value={this.state.valueSecond}
          />
        </ComponentItem>

        <h2>Range Slider withBars and Round handlers</h2>
        <p>Range selector used in Social IQ for Admin components.</p>
        <ComponentItem>
          <RangeSlider
            handleIconType={'round'}
            min={0}
            max={100}
            step={5}
            minDistance={1}
            value={this.state.valueSecond}
            withBars
            barColour={['var(--base-color)']}
            pushable
            showTooltip
            onBeforeChange={this.handleBeforeChange}
            onChange={this.handleChangeSecond}
            onSliderClick={this.handleSliderClick}
          />
        </ComponentItem>
        <ComponentItem style={{ padding: '1rem 0 2rem' }}>
          <RangeSlider
            handleIconType={'round'}
            min={1}
            max={30}
            step={5}
            minDistance={1}
            value={this.state.valueSecond}
            withBars
            barColour={['var(--base-color)']}
            pushable
            showNumbers
            showTooltip
            onBeforeChange={this.handleBeforeChange}
            onChange={this.handleChangeSecond}
            onSliderClick={this.handleSliderClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
