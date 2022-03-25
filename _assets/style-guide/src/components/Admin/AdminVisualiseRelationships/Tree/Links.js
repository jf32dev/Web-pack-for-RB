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

import Link from './Link';

export default class Links extends PureComponent {
  static propTypes = {
    linkList: PropTypes.array.isRequired,
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

  render() {
    const {
      linkList,
      orientation,
      pathFunc,
      transitionDuration
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
            {linkList.map((linkData) =>
              (<Link
                key={linkData.data.id}
                orientation={orientation}
                pathFunc={pathFunc}
                linkData={linkData}
                transitionDuration={transitionDuration}
              />)
            )}
          </g>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
