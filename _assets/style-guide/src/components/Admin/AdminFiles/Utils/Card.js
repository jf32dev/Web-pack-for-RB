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
import SVGIcon from './SVGIcon';
import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Card
 */
export default class Card extends PureComponent {
  static propTypes = {
    label: PropTypes.string,

    type: PropTypes.string,

    showCheckbox: PropTypes.bool,

    checked: PropTypes.bool,

    onItemClick: PropTypes.func,

    onCheckboxChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    checked: false,
    label: '',
    type: '',
    activeStep: 2,
    showCheckbox: false,
  };

  constructor(props) {
    super(props);
    this.isMouseOver = false;
    autobind(this);
  }

  handleCheckboxChange(e) {
    const { type, onCheckboxChange } = this.props;
    if (onCheckboxChange) {
      onCheckboxChange(type, e.currentTarget.checked);
    }
  }

  handleClick() {
    const { type, onItemClick } = this.props;
    if (!this.isMouseOver && onItemClick) {
      onItemClick(type);
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
    const styles = require('./Card.less');
    const { label, type, showCheckbox, checked, isEmpty } = this.props;

    const cx = classNames.bind(styles);
    const classes = cx({
      Card: true,
      isEmpty,
    }, this.props.className);

    return (
      <div className={classes} onClick={this.handleClick}>
        <div className={styles.svg}>
          <SVGIcon type={type} />
        </div>
        <label className={styles.label}>{label}</label>
        <div
          onMouseOut={this.handleMouseOut}
          onMouseOver={this.handleMouseOver}
          className={showCheckbox ? '' : styles.hidden}
        >
          <Checkbox
            label="Admin account"
            name={type}
            className={styles.cardCheckbox}
            checked={checked}
            onChange={this.handleCheckboxChange}
          />
        </div>
      </div>
    );
  }
}
