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

export default class ModalBody extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isScrollable: false
    };

    // refs
    this.body = null;
  }

  componentDidMount() {
    // Check if scroll height is greater than visible height
    // Maxheight and height are equal if this is the case
    // This prevents the modal resizing if the content changes
    // after initial mount
    if (this.body.scrollHeight > this.body.clientHeight) {
      this.setState({  // eslint-disable-line react/no-did-mount-set-state
        isScrollable: true
      });
    }
  }

  render() {
    const { isScrollable } = this.state;
    const { className, style, ...others } = this.props;
    const styles = require('./Modal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ModalBody: true
    }, className);

    const mergedStyle = {
      height: isScrollable ? style.maxHeight : null,
      ...style,
    };

    return (
      <div
        {...others}
        ref={(c) => { this.body = c; }}
        data-id="body"
        className={classes}
        style={mergedStyle}
      />
    );
  }
}
