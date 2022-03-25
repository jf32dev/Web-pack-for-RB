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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import SVGIcon from 'components/SVGIcon/SVGIcon';


export default class SelectItemWithImage extends Component {
  static propTypes = {
    focusedOption: PropTypes.object,
    focusedOptionIndex: PropTypes.number,
    keyValue: PropTypes.string,
    labelKey: PropTypes.string,
    option: PropTypes.object,
    optionIndex: PropTypes.number,
    options: PropTypes.array,
    valueArray: PropTypes.array,
    style: PropTypes.object,
    selectValue: PropTypes.func,
    focusOption: PropTypes.func,
    styles: PropTypes.object,
    strings: PropTypes.object,
    className: PropTypes.object,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const { focusedOption, focusOption, labelKey, option, selectValue, style, valueArray, selectedValue } = this.props;
    const styles = require('./SelectItemWithImage.less');
    const classNames = [styles.fileItem];
    classNames.push(styles.nameOption);
    if (option === focusedOption) {
      classNames.push(styles.nameOptionFocused);
    }
    if (valueArray.indexOf(option) >= 0) {
      classNames.push(styles.nameOptionSelected);
    }

    let childElement = '';

    if (option.type === 'withImage') {
      childElement = (<React.Fragment>
        <div className={styles.icon} data-category={option.name.toLowerCase()}>
          {option.isSVG && <SVGIcon type={option.name.toLowerCase()} style={{ width: '100%', height: '100%' }} />}
        </div>
        <div className={styles.itemLabel}>{option.name}</div>
        {selectedValue === option.name && <div className={styles.iconChecked} />}
      </React.Fragment>);
    } else {
      childElement = (<React.Fragment>
        <div className={styles.itemLabelDefault}>{option.label}</div>
        {selectedValue === option.label && <div className={styles.iconChecked} />}
      </React.Fragment>);
    }
    return (
      <div
        key={labelKey}
        className={classNames.join(' ')}
        onClick={() => selectValue(option)}
        onMouseOver={() => focusOption(option)}
        style={style}
      >
        {childElement}
      </div>
    );
  }
}
