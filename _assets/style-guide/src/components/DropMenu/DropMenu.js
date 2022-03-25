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
import TetherComponent from 'react-tether';

/**
 * Any elements can be passed as <code>children</code>, this allows complete control of the menu content. Some default styles are provided for a simple unorderd list.
 * Be sure to add <code>onClick</code> handlers to children in your parent component.
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
    position: PropTypes.object,

    /** menu width in pixels */
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),

    /** Valid <strong>btc-font</strong> icon name to use as menu toggle */
    icon: PropTypes.string,

    /** CSS colour property */
    iconColour: PropTypes.string,

    /** Wether dropdown container is floating as fixed position or absolute */
    isDropDownTether: PropTypes.bool,

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

    onClick: PropTypes.func,

    /** Callback when menu toggles active state */
    onToggle: PropTypes.func,

    /** class for additional styling */
    className: PropTypes.string,

    /** class applied when menu is active */
    activeClassName: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    position: { right: 0 },
    width: 'auto'
  };

  constructor(props) {
    super(props);
    this.state = { active: false };
    autobind(this);

    // refs
    this.tether = null;
    this.dropmenu = null;
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // Add window event listener
    if (!this.state.active && nextState.active) {
      this.addWindowClickEvent();
    } else if (this.state.active && !nextState.active) {
      this.removeWindowClickEvent();
    }

    // Propagate toggle
    if (nextState.active !== this.state.active && this.props.onToggle) {
      this.props.onToggle(this); // removing event from parameters - it isn't defined
    }
  }

  componentWillUnmount() {
    this.removeWindowClickEvent();
  }

  addWindowClickEvent() {
    window.addEventListener('click', this.handleWindowClick);
  }

  removeWindowClickEvent() {
    window.removeEventListener('click', this.handleWindowClick);
  }

  handleWindowClick(event) {
    // Check if we are not clicking on the menu
    // This would be a propagated handleMenuToggle
    const menu = this.dropmenu;
    const isMenu = menu === event.target || menu === event.target.offsetParent;
    if (!isMenu && (!event.target.type || !menu.contains(event.target))) {
      this.setState({ active: false });
      event.stopPropagation();
    }
  }

  handleMenuToggle(event) {
    if (!this.props.disabled) {
      this.setState({ active: !this.state.active }, () => {
        if (this.props.onClick && typeof this.props.onClick === 'function') {
          this.props.onClick(event, this);
        }
      });
    }
  }

  render() {
    const { active } = this.state;
    const {
      heading,
      position,
      width,

      icon,
      iconColour,
      isDropDownTether,
      activeIcon,
      activeIconColour,
      headingColour,
      activeHeadingColour,

      button,
      disabled,

      children,
      className,
      activeClassName,
      onClick,

      inverted,

      onToggle, // eslint-disable-line

      ...others
    } = this.props;
    const styles = require('./DropMenu.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      DropMenu: true,
      DropMenuActive: active,
      DropMenuDisabled: disabled,
      buttonMenu: button,
      buttonMenuActive: button && active,
      invertedButtonMenu: button && inverted && !active
    }, (active && activeClassName) ? activeClassName : className);

    const iconClass = ' icon-' + ((active && activeIcon) ? activeIcon : icon);
    const iconStyle = {
      color: (active && activeIconColour) ? activeIconColour : iconColour
    };

    const headingStyle = {
      color: (active && activeHeadingColour) ? activeHeadingColour : headingColour
    };

    const contentWrapStyle = {
      width: width,
      ...position,
    };

    const tetherWrapStyle = {
      width: width,
      display: 'block !important',
      position: 'relative !important',
      ...position,
    };

    const contentWrapActive = cx({
      contentWrap: true,
      contentWrapActive: true,
    });

    const renderContent = (
      active && this.dropmenu && <TetherComponent
        ref={(tether) => { this.tether = tether; }}
        attachment="bottom center"
        targetAttachment="bottom center"
        style={{
          zIndex: 99,
          width: '110px',
          height: '2px',
          marginTop: '-27px',
          display: 'block',
        }}
        constraints={[
          {
            to: this.dropmenu,
            attachment: 'together',
          },
        ]}
        /* renderTarget: This is what the item will be tethered to, make sure to attach the ref */
        renderTarget={(ref) => (
          <div ref={ref} />
        )}
        /* renderElement: If present, this item will be tethered to the the component returned by renderTarget */
        renderElement={ref =>
          (<div
            ref={ref}
            className={contentWrapActive}
            style={tetherWrapStyle}
          >
            {children}
          </div>)
        }
      />
    );

    return (
      <div
        ref={(c) => { this.dropmenu = c; }}
        data-id="dropmenu"
        onClick={this.handleMenuToggle}
        className={classes}
        {...others}
      >
        <div className={styles.headingWrap}>
          {icon && <span className={styles.icon + iconClass} style={iconStyle} />}
          {heading && typeof heading === 'string' && <span className={styles.heading} style={headingStyle}>{heading}</span>}
          {heading && typeof heading === 'object' && heading}
          {isDropDownTether && renderContent}
          {!isDropDownTether && <div className={styles.contentWrap} style={contentWrapStyle}>
            {this.state.active && children}
          </div>}
        </div>
      </div>
    );
  }
}
