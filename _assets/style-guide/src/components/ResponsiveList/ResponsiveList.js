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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from 'components/List/List';

/**
 * ResponsiveList adjusts <code>thumbSize</code> according to the matched media query.
 * Note: Any parent should not be a PureComponent as it relies on context
 */
export default class ResponsiveList extends Component {
  static propTypes = {
    /** Uses breakpoint provided my context.media if not provided */
    breakpoint: PropTypes.oneOf([
      'mobile-xs',
      'mobile',
      'tablet',
      'desktop',
      'desktop-xl'
    ]),

    /** Specify thumbSize for matched media query */
    rules: PropTypes.shape({
      'mobile-xs': PropTypes.oneOf(['small', 'medium', 'large']),
      'mobile': PropTypes.oneOf(['small', 'medium', 'large']),
      'tablet': PropTypes.oneOf(['small', 'medium', 'large']),
      'desktop': PropTypes.oneOf(['small', 'medium', 'large']),
      'desktop-xl': PropTypes.oneOf(['small', 'medium', 'large'])
    })
  };

  static contextTypes = {
    media: PropTypes.array
  };

  static defaultProps = {
    rules: {
      'mobile-xs': 'small',
      'mobile': 'small',
      'tablet': 'medium',
      'desktop': 'large',
      'desktop-xl': 'large'
    },
  };

  render() {
    const { breakpoint, maxSize, maxGridSize, rules, ...others } = this.props;
    const rule = breakpoint || this.context.media[0];
    const thumbSize = rules[rule] || 'medium';

    return (
      <List
        {...others}
        thumbSize={thumbSize}
      />
    );
  }
}
