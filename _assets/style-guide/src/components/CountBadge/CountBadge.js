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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

/**
 * Clickable abbreviated value and description.
 */
export default class CountBadge extends PureComponent {
  static propTypes = {
    /** href for anchor tag */
    href: PropTypes.string.isRequired,

    /** Valid size: <code>medium, large</code> */
    size: PropTypes.oneOf(['medium', 'large']),

    /** text displayed below count */
    title: PropTypes.string.isRequired,

    /** Number to display, is automatically abbreviated */
    value: PropTypes.number.isRequired,

    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    size: 'medium',
    value: 0
  };

  constructor(props) {
    super(props);
    this.state = { fixedValue: this.props.value };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { value } = this.props;
    let newValue;

    /**
     * Abbreviate value if required
     * e.g.
     * 1000 => 1K
     * 9100 => 9.1K
     * 10000 => 10K
     * 11000 => 10K (no decimals)
     * 1000000 => 1M
     */
    if (value > 999 && value < 10000) {
      newValue = (value / 1000).toFixed(1).replace('.0', '') + 'K';
      this.setState({ fixedValue: newValue });
    } else if (value >= 10000 && value < 1000000) {
      newValue = (value / 1000).toFixed(0) + 'K';
      this.setState({ fixedValue: newValue });
    } else if (value >= 1000000) {
      newValue = (value / 1000000).toFixed(0) + 'M';
      this.setState({ fixedValue: newValue });
    }
  }

  handleClick(event) {
    const { value, onClick } = this.props;
    event.preventDefault();
    if (value > 0 && onClick && typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  render() {
    const { title, href, size, className, style, value } = this.props;
    const { fixedValue } = this.state;
    const styles = require('./CountBadge.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      CountBadge: true,
      disablePointer: value <= 0,
      medium: size === 'medium',
      large: size === 'large'
    }, className);

    const titleAttr = fixedValue + ' ' + title;

    return (
      <a
        href={href} title={titleAttr} onClick={this.handleClick}
        className={itemClasses} style={style}
      >
        <div className={styles.valueWrap}>
          <span>{fixedValue}</span>
        </div>
        <span className={styles.title}>{title}</span>
      </a>
    );
  }
}
