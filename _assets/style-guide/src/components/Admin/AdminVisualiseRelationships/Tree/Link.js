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
import * as d3 from 'd3';

export default class Link extends PureComponent {
  static propTypes = {
    linkData: PropTypes.object.isRequired,
    orientation: PropTypes.oneOf([
      'horizontal',
      'vertical',
    ]).isRequired,
    pathFunc: PropTypes.oneOf([
      'diagonal',
      'elbow',
    ]).isRequired,
    transitionDuration: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      initialStyle: {
        opacity: 0,
      }
    };
    autobind(this);
    this.link = null;
  }

  componentDidMount() {
    this.applyOpacity(1);
  }

  componentWillUnmount() {
    this.applyOpacity(0);
  }

  componentWillLeave(callback) {
    const { transitionDuration } = this.props;
    const { parent } = this.props.linkData;
    const originX = parent ? parent.x : 0;
    const originY = parent ? parent.y : 0;
    const d = this.diagonalPath({
      x: originX,
      y: originY,
      parent: {
        x: originX,
        y: originY
      }
    });

    d3.select(this.link)
      .transition()
      .duration(transitionDuration)
      .attr('d', d)
      .style('opacity', 0);

    this.timer = setTimeout(function() {
      if (callback) callback();
    }, transitionDuration - 50);
  }

  applyOpacity(opacity) {
    const { transitionDuration } = this.props;

    d3.select(this.link)
      .transition()
      .duration(transitionDuration)
      .style('opacity', opacity);
  }

  diagonalPath(linkData) {
    return 'M' + linkData.y + ',' + linkData.x
      + 'C' + (linkData.y + linkData.parent.y) / 2 + ',' + linkData.x
      + ' ' + (linkData.y + linkData.parent.y) / 2 + ',' + linkData.parent.x
      + ' ' + linkData.parent.y + ',' + linkData.parent.x;
  }

  elbowPath(d, orientation) {
    return orientation === 'horizontal' ?
      `M${d.y},${d.x}V${d.parent.x}H${d.parent.y}` :
      `M${d.x},${d.y}V${d.parent.y}H${d.parent.x}`;
  }

  drawPath() {
    const { linkData, orientation, pathFunc } = this.props;
    return pathFunc === 'diagonal'
      ? this.diagonalPath(this.props.linkData)
      : this.elbowPath(linkData, orientation);
  }

  render() {
    const { styles } = this.props;
    const style = require('./Tree.less');

    return (
      <path
        ref={(l) => { this.link = l; }}
        style={{ ...this.state.initialStyle, ...styles }}
        className={style.linkBase}
        d={this.drawPath()}
      />
    );
  }
}
