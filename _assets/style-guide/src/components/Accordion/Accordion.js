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
import classNames from 'classnames/bind';
import autobind from 'class-autobind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default class Accordion extends PureComponent {
  static propTypes = {
    /** Item Id. */
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** Header to be displayed. */
    title: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.node.isRequired
    ]),
    description: PropTypes.string,

    /** a valid btc-font icon or DOM node */
    icon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),

    // Content to be displayed
    children: PropTypes.node,

    /** Initial state of accordion. */
    defaultOpen: PropTypes.bool,

    /** Alternative style. */
    alt: PropTypes.bool,

    position: PropTypes.oneOf(['left', 'right']),

    /** Disable accordion. */
    disabled: PropTypes.bool,

    /** Pass a custom Component to render next to the header */
    headerComponent: PropTypes.func,

    className: PropTypes.string,
    headerClassName: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.defaultOpen
    };
    autobind(this);
  }

  handleExpand(event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.props.disabled) {
      this.setState({ isOpen: !this.state.isOpen });
      const itemId = event.currentTarget.getAttribute('data-id');
      if (typeof this.props.onToggle === 'function') {
        this.props.onToggle(!this.state.isOpen, itemId);
      }
      this.setState({ isOpen: !this.state.isOpen });
    }
  }

  render() {
    const {
      alt,
      description,
      icon,
      headerComponent,
      title,
      id,
      style
    } = this.props;
    const styles = require('./Accordion.less');
    const cx = classNames.bind(styles);

    const mainClasses = cx({
      Accordion: true,
      alternative: !!alt,
      disabled: this.props.disabled
    }, this.props.className);

    const headerClass = cx({
      header: true,
      iconToLeft: this.props.position === 'left',
      alternativeHeader: !!alt,
      active: this.state.isOpen && !this.props.disabled
    }, this.props.headerClassName);

    const itemClasses = cx({
      heading: true,
    });

    const stateClasses = cx({
      content: true,
      //visible: this.state.isOpen && !this.props.disabled
    });

    // If icon is a string, use btc-font
    let iconClasses;
    if (typeof icon === 'string') {
      iconClasses = ' icon-' + icon;
    }

    return (
      <div className={mainClasses} style={style}>
        <div className={headerClass}>
          {icon && iconClasses && <span className={iconClasses} />}
          {icon && !iconClasses && <span className={styles.iconNode}>{icon}</span>}
          {!headerComponent && <div onClick={this.handleExpand} data-id={id}>
            <a
              href="#toggle"
              title={typeof title !== 'object' ? title : undefined}
              className={itemClasses}
              data-id={id}
            >
              {title}
            </a>
            {alt && description && <span>{description}</span>}
          </div>}
          {headerComponent}
        </div>
        <TransitionGroup component="span">
          {this.state.isOpen && !this.props.disabled && <CSSTransition
            classNames={{
              appear: styles['slide-appear'],
              appearDone: styles['slide-appear-done'],
              enter: styles['slide-enter'],
              enterActive: styles['slide-enter-active'],
              exit: styles['slide-exit'],
              exitActive: styles['slide-exit-active']
            }}
            timeout={{
              enter: 150,
              exit: 150
            }}
            appear
          >
            <div className={stateClasses} data-section="content">
              {this.props.children}
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
