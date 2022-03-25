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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

export default class SelectSearchItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    isSelected: PropTypes.bool,
    onFocus: PropTypes.func,
    onSelect: PropTypes.func,
    onUnfocus: PropTypes.func,
    option: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter(event) {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove(event) {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  handleMouseLeave(event) {
    this.props.onUnfocus(this.props.option, event);
  }

  render() {
    const styles = require('./SelectSearchItem.less');
    const color = this.props.option.color ? this.props.option.color : '#ccc';
    const thumbStyle = {
      backgroundColor: (!this.props.option.thumbnail) ? color : false,
      backgroundImage: (this.props.option.thumbnail) ? 'url(' + this.props.option.thumbnail + ')' : false
    };

    const note = (
      <FormattedMessage
        id="n-item"
        description="Total items"
        defaultMessage="{count} {item}"
        values={{
          count: this.props.option.count,
          item: this.props.option.childType
        }}
      />);

    return (
      <div
        className={styles.SelectSearchItem}
        onMouseDown={::this.handleMouseDown}
        onMouseEnter={::this.handleMouseEnter}
        onMouseMove={::this.handleMouseMove}
        title={this.props.option.title}
      >

        <div style={thumbStyle} className={styles.listThumbnail} />
        <div>
          <span className={styles.title}>
            {this.props.option.term}
          </span>
          <span className={styles.note}>
            {note}
          </span>
        </div>
      </div>
    );
  }
}
