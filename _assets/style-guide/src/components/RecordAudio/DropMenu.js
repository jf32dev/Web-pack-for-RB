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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

/**
 * Any elements can be passed as <code>children</code>, this allows complete control of the menu content. Some default styles are provided for a simple unorderd list.
 * Be sure to add <code>onClick</code> handlers to children in your parent component.
 *
 * new feature:
 * the props.active would make the drop menu display or not
 * onClose method is to let the parent component to set the props.active to false and not display the drop menu
 * onOpen method is to let the parent component to set the props.active to true and display the drop menu
 * click inside the drop menu would not trigger onClose and onOpen method
 * parent component could set the props.active to true or false when require
 */
export default class DropMenu extends PureComponent {
  static propTypes = {
    /** Text or element that toggles menu visibility */
    heading: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),

    /** Title attribute for menu, defaults to heading */
    title: PropTypes.string,

    /** top/bottom/left/right CSS properties */
    position: PropTypes.shape({
      top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      botttom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      left: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),

    /** menu width in pixels */
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /** Valid <strong>btc-font</strong> icon name to use as menu toggle */
    icon: PropTypes.string,

    /** CSS colour property */
    iconColour: PropTypes.string,

    /** Valid <strong>btc-font</strong> icon name to display when menu is active */
    activeIcon: PropTypes.string,

    /** CSS colour property */
    activeIconColour: PropTypes.string,

    /** CSS colour property */
    headingColour: PropTypes.string,

    /** CSS colour property */
    activeHeadingColour: PropTypes.string,

    /** Button-styled menu */
    button: PropTypes.bool,

    /** Disable menu from showing on click */
    disabled: PropTypes.bool,

    /** Elements to render in the body of the menu */
    children: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,

    /** onOpen method is to let the parent component to set the props.active to true and display the drop menu */
    onOpen: PropTypes.func,

    /** onClose method is to let the parent component to set the props.active to false and not display the drop menu */
    onClose: PropTypes.func,

    active: PropTypes.bool,

    // isVisible: PropTypes.bool,

    // /** Callback when a click event trigger outside the menu window */
    // onOutsideWindowClick: PropTypes.func,

    /** icon style for additional styling for icon */
    iconCustomStyle: PropTypes.object,

    /** class for additional styling */
    className: PropTypes.string,

    /** class applied when menu is active */
    activeClassName: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    position: { right: 0 },
    iconCustomStyle: {},
  };

  constructor(props) {
    super(props);

    //check if the mouse is in the menu window;
    this.isMouseOver = false;
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.active && nextProps.active) {
      window.addEventListener('click', this.handleWindowClick);
    } else if (this.props.active && !nextProps.active) {
      window.removeEventListener('click', this.handleWindowClick);
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   // Add window event listener
  //   if (!this.state.active && nextState.active) {
  //     this.addWindowClickEvent();
  //   } else if (this.state.active && !nextState.active) {
  //     this.removeWindowClickEvent();
  //   }
  //
  //   // Propagate toggle
  //   if (nextState.active !== this.state.active && this.props.onToggle) {
  //     this.props.onToggle(this, event);
  //   }
  // }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick);
  }

  handleWindowClick(event) {
    if (!this.isMouseOver && this.props.active) {
      this.props.onClose(event);
      event.stopPropagation();
    }
  }

  handleMenuToggle(event) {
    if (this.props.active) {
      this.props.onClose(event);
    } else if (!this.props.active) {
      this.props.onOpen(event);
    }
  }

  handleMouseOut() {
    if (this.isMouseOver) {
      this.isMouseOver = false;
    }
  }

  handleMouseOver() {
    if (!this.isMouseOver) {
      this.isMouseOver = true;
    }
  }

  render() {
    const {
      heading,
      position,
      width,

      icon,
      iconColour,
      activeIcon,
      activeIconColour,
      headingColour,
      activeHeadingColour,

      button,
      disabled,

      children,
      className,
      activeClassName,
      iconCustomStyle,

      active,
    } = this.props;
    const styles = require('./DropMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      DropMenu: true,
      DropMenuActive: active,
      DropMenuDisabled: disabled,
      buttonMenu: button,
      buttonMenuActive: button && active,
    }, (active && activeClassName) ? activeClassName : className);

    const iconClass = ' icon-' + ((active && activeIcon) ? activeIcon : icon);
    const iconStyle = {
      color: (active && activeIconColour) ? activeIconColour : iconColour,
      ...iconCustomStyle
    };

    const headingStyle = {
      color: (active && activeHeadingColour) ? activeHeadingColour : headingColour
    };

    const contentWrapStyle = {
      width: width,
      ...position
    };

    return (
      <div className={classes}>
        <div className={styles.headingWrap} onMouseOut={this.handleMouseOut} onMouseOver={this.handleMouseOver}>
          {icon && <span className={styles.icon + iconClass} style={iconStyle} onClick={this.handleMenuToggle} />}
          {heading && typeof heading === 'string' &&
          <span className={styles.heading} style={headingStyle} onClick={this.handleMenuToggle}>{heading}</span>}
          {heading && typeof heading === 'object' && heading}
          <div className={styles.contentWrap} style={contentWrapStyle}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
