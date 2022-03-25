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
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Node from './Node';

export default class Nodes extends PureComponent {
  static propTypes = {
    nodeList: PropTypes.array.isRequired,
    orientation: PropTypes.oneOf([
      'horizontal',
      'vertical',
    ]).isRequired,
    transitionDuration: PropTypes.number.isRequired,
    textAnchor: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      nodeList,
      orientation,
      transitionDuration,
      textAnchor,
      onClick
    } = this.props;

    return (
      <TransitionGroup component="g">
        <CSSTransition
          className="node"
          timeout={{
            enter: transitionDuration,
            exit: transitionDuration / 4,
          }}
        >
          <g>
            {nodeList.map((nodeData) =>
              (<Node
                key={nodeData.data.id}
                orientation={orientation}
                transitionDuration={transitionDuration}
                textAnchor={textAnchor}
                nodeData={nodeData}
                name={nodeData.data.name}
                onClick={onClick}
              />)
            )}
          </g>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
