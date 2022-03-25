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

import * as d3 from 'd3';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

export default class Node extends PureComponent {
  static propTypes = {
    nodeData: PropTypes.object.isRequired,
    orientation: PropTypes.oneOf([
      'horizontal',
      'vertical',
    ]).isRequired,
    transitionDuration: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    textAnchor: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    textAnchor: 'start',
    maxLengthString: 30,
    defaultColor: {
      tab: {
        light: '#F5AABB',
        dark: '#e2023a'
      },
      channel: {
        light: '#FBCBB5',
        dark: '#f26724'
      },
      group: {
        light: '#B7E0F9',
        dark: '#0092ec'
      },
      user: {
        light: '#B8F7CC',
        dark: '#04e44a'
      },
      'interest-group': {
        light: '#DAD2C3',
        dark: '#7e622a'
      },
      link: {
        light: '#CCCCCC',
        dark: '#4c4c4c'
      },
      web: {
        light: '#CCCCCC',
        dark: '#4c4c4c'
      },
    }
  };

  constructor(props) {
    super(props);
    const { parent } = props.nodeData;
    const originX = parent ? parent.x : 0;
    const originY = parent ? parent.y : 0;

    this.state = {
      transform: this.setTransformOrientation(originX, originY),
      initialStyle: {
        opacity: 1,
      },
    };
    autobind(this);
  }

  componentDidMount() {
    const { x, y } = this.props.nodeData;
    const transform = this.setTransformOrientation(x, y);

    this.applyTransform(transform);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const transform = this.setTransformOrientation(nextProps.nodeData.x, nextProps.nodeData.y);
    this.applyTransform(transform);
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  setTransformOrientation(x, y) {
    return this.props.orientation === 'horizontal' ?
      `translate(${y},${x})` :
      `translate(${x},${y})`;
  }

  componentWillLeave(callback) {
    const { transitionDuration } = this.props;
    const { parent } = this.props.nodeData;
    const originX = parent ? parent.x : 0;
    const originY = parent ? parent.y : 0;
    const transform = this.setTransformOrientation(originX, originY);

    d3.select(this.node)
      .transition()
      .duration(transitionDuration)
      .attr('transform', transform);

    // Calls unmount component
    this.timer = setTimeout(function() {
      if (callback) callback();
    }, transitionDuration - 50);
  }

  applyTransform(transform, opacity = 1) { //done = () => {}
    const { transitionDuration } = this.props;

    d3.select(this.node)
      .transition()
      .duration(transitionDuration)
      .attr('transform', transform)
      .style('opacity', opacity);
  }

  handleClick() {
    this.props.onClick(this.props.nodeData.id || this.props.nodeData.data.id);
  }

  // Util functions for nodes
  createCanvas(elem, maxLengthString, length) {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.font = '10px sans-serif';
    const textLength = elem.data.name.length > maxLengthString ? elem.data.name.substring(0, maxLengthString - 3) + '...' : elem.data.name;

    return length || ctx.measureText(textLength).width + 25;
  }

  render() {
    const { defaultColor, maxLengthString, name, nodeData } = this.props;
    const style = require('./Tree.less');
    const parseName = name.length > maxLengthString ? name.substring(0, maxLengthString - 3) + '...' : name;

    const topPosition = -7.5;
    const height = 14.55;
    const rectX = this.createCanvas(nodeData, maxLengthString, -12);
    const rectWidth = this.createCanvas(nodeData, maxLengthString);

    const darkColor = defaultColor[nodeData.data.type].dark;
    const lightColor = nodeData.data._collapsed && nodeData.data.children && nodeData.data.children.length ? defaultColor[nodeData.data.type].light : '#fafafa';

    return (
      <g
        id={nodeData.data.id}
        ref={(n) => { this.node = n; }}
        style={this.state.initialStyle}
        className={style.node}
        transform={this.state.transform}
        onClick={this.handleClick}
      >
        <rect
          y={topPosition}
          x={rectX}
          width={rectWidth}
          height={height}
          rx={7}
          ry={7}
          fillOpacity={1}
          fill={lightColor}
          stroke={darkColor}
          strokeWidth="1px"
        />
        <text
          textAnchor={this.props.textAnchor}
          x="0"
          dy="0.35em"
          fillOpacity={1}
          //fill={(d) => (d._children ? '#454545' : '#fafafa')}
        >
          {parseName}
          <title>{name}</title>
        </text>
      </g>
    );
  }
}
