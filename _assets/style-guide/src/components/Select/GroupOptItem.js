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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

export default class GroupOptItem extends Component {
  static propTypes = {
    focusedOption: PropTypes.object,
    focusedOptionIndex: PropTypes.number,
    keyValue: PropTypes.string,
    labelKey: PropTypes.string,
    option: PropTypes.object,
    optionIndex: PropTypes.number,

    /* Options should include type and disabled parameters
     <code> type: header, subheader, category</code>
     <code>{ id: 15, name: 'Other Users’ Content', type: 'header', disabled: true }</code>
     */
    options: PropTypes.array,
    valueArray: PropTypes.array,
    style: PropTypes.object,

    selectValue: PropTypes.func,
    focusOption: PropTypes.func,
    styles: PropTypes.object,
    strings: PropTypes.object,
    className: PropTypes.object,
  };

  static defaultProps = {
    strings: {},
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      keyValue,
      option,
      focusedOption,
      valueArray,
      selectValue,
      focusOption,
      style,
      strings,
      className,
    } = this.props;
    const styles = require('./GroupOptItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      nameOption: true,
      nameHeader: option.type === 'header',
      nameHasSubHeader: option.type === 'hasSubHeader',
      nameOptionFocused: option.type !== 'header' && option === focusedOption,
      nameOptionSelected: option.type !== 'header' && valueArray.indexOf(option) >= 0,
    }, className);

    switch (option.type) {
      case 'header':
        return (
          <div
            className={classes}
            key={keyValue}
            style={style}
          >
            {strings[option.name] || option.name}
          </div>
        );
      case 'subheader':
        return (
          <div
            className={classes}
            key={keyValue}
            style={{ ...style, fontWeight: 'bold' }}
          >
            {strings[option.name] || option.name}
          </div>
        );
      case 'search':
        return (
          <div
            className={classes}
            key={keyValue}
            style={style}
          >
            {strings[option.name] || option.name}
          </div>
        );
      default:
        return (
          <div
            className={classes}
            key={keyValue}
            onClick={() => selectValue(option)}
            onMouseOver={() => focusOption(option)}
            style={{ ...style, paddingLeft: '1.5rem' }}
          >
            {strings[option.name] || option.name}
          </div>
        );
    }
  }
}
