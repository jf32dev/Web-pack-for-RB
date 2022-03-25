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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Buttons are used for <strong>actions</strong>, like in forms,
 * while textual <strong>hyperlinks</strong> are used for destinations,
 * or moving from one page to another.
 */
export default class Btn extends PureComponent {
  static propTypes = {
    /** button text */
    children: PropTypes.node,

    type: PropTypes.string,

    /** pass to render as an anchor tag */
    href: PropTypes.string,

    /** display a number after the button text */
    counter: PropTypes.number,

    /** pass a valid <strong>btc-font</strong> icon name */
    icon: PropTypes.string,
    title: PropTypes.string,

    alt: PropTypes.bool,

    /** borderless style */
    borderless: PropTypes.bool,

    /** disabled style */
    disabled: PropTypes.bool,

    /** inverted/active style */
    inverted: PropTypes.bool,
    warning: PropTypes.bool,

    /** loading style */
    loading: PropTypes.bool,

    /** small style */
    small: PropTypes.bool,

    /** large style */
    large: PropTypes.bool,

    onClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    type: 'button'
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.btn = null;
  }

  click() {
    this.btn.click();
  }

  render() {
    const {
      href,
      small,
      large,
      disabled,
      inverted,
      warning,
      remove,
      secondary,
      alt,
      borderless,
      counter,
      children,
      loading,
      icon,
      onClick,
      className,
      ...other
    } = this.props;
    const styles = require('./Btn.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Btn: true,
      small: small,
      large: large,
      alt: alt,
      inverted: inverted,
      warning: warning,
      remove: remove,
      secondary: secondary,
      borderless: borderless,
      counter: counter,
      iconOnly: !children,
      loading: loading,
      disabled: disabled || loading
    }, className);

    const comp = href ? 'a' : 'button';

    return (
      React.createElement(comp, {
        'ref': (c) => { this.btn = c; },
        'href': href,
        'role': 'button',
        'className': classes + (icon ? ' icon-' + icon : ''),
        'data-count': counter,
        'onClick': (!disabled && !loading) ? onClick : undefined,
        'disabled': disabled,
        ...other
      }, children)
    );
  }
}
