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

import Btn from 'components/Btn/Btn';

/**
 * Blankslates are for when there is a lack of content within a page or section.
 * Use them as placeholders to tell users why something isn’t there.
 */
export default class Blankslate extends PureComponent {
  static propTypes = {
    /** a valid btc-font icon or DOM node */
    icon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node
    ]),

    /** only used for btc-font icon */
    iconSize: PropTypes.oneOf([32, 48, 64, 96, 112, 128, 144, 160, 176, 192]),

    /** optional heading text */
    heading: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.node
    ]),

    /** optional message text */
    messages: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.node
    ]),
    children: PropTypes.node,

    /** icon appears inline with text */
    inline: PropTypes.bool,

    /** increase vertical padding */
    spacious: PropTypes.bool,

    /** vertically aligns in it's container */
    middle: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    btnMessage: '',
    iconSize: 96,
  };

  render() {
    const {
      btnMessage,
      icon,
      iconSize,
      heading,
      message,
      onClickHandler,
      children
    } = this.props;
    const styles = require('./Blankslate.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Blankslate: true,
      [`iconSize-${iconSize}`]: true,
      error: icon === 'error',
      inline: this.props.inline,
      spacious: this.props.spacious,
      middle: this.props.middle,
    }, this.props.className);

    // If icon is a string, use btc-font
    let iconClasses;
    if (typeof icon === 'string') {
      iconClasses = 'icon-' + iconSize + ' icon-' + icon;
    }

    return (
      <div className={classes} style={this.props.style}>
        {icon && iconClasses && <span className={iconClasses} />}
        {icon && !iconClasses && <span className={styles.iconNode}>{icon}</span>}
        <div className={styles.content}>
          {heading && <h3>{heading}</h3>}
          {message && <p className={styles.message}>{message}</p>}
          {children}
          {btnMessage && <Btn inverted onClick={onClickHandler}>{btnMessage}</Btn>}
        </div>
      </div>
    );
  }
}
