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

import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';

/**
 * number input & checkbox input, 0 only shows then checkbox, click checkbox would change to 1
 */
export default class CheckboxInput extends PureComponent {
  static propTypes = {

    /** show checkbox or text title */
    checkbox: PropTypes.bool,

    id: PropTypes.string,

    name: PropTypes.string,

    /** label of the checkbox */
    title: PropTypes.string,

    /** label of the checkbox */
    label: PropTypes.string,

    /** description of the input */
    desc: PropTypes.string,

    /** min value of the input, 0 means no min */
    min: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    /** max value of the input, 0 means no max */
    max: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),

    onChange: PropTypes.func,

    /** value of the input */
    value: PropTypes.number,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    checkbox: true,
    value: 0,
    min: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentCheckbox: false
    };
    autobind(this);
    this.handleChangeDebounce = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );
  }

  UNSAFE_componentWillMount () {
    if (this.props.value > 0) {
      this.setState({
        currentCheckbox: true
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(this.props.value, nextProps.value);
    if (this.props.value === 0 && nextProps.value > 0) {
      this.setState({
        currentCheckbox: true
      });
    }

    if (this.props.value > 0 && nextProps.value === 0) {
      this.setState({
        currentCheckbox: false
      });
    }
  }

  handleChange(e) {
    const { type, checked, value } = e.currentTarget;
    const { id, name, min } = this.props;
    let update = {};
    if (type === 'checkbox') {
      this.setState({
        currentCheckbox: checked
      });
      if (checked === true && min === 0) {
        update = {};
      } else {
        update = {
          [id || name]: checked ? min : 0
        };
      }
    } else if (type === 'number') {
      update = {
        [id || name]: Number(value)
      };
    }

    this.updateValue(update);
  }

  updateValue(update) {
    const { onChange } = this.props;
    if (!_isEmpty(update) && onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const styles = require('./CheckboxInput.less');
    const { title, desc, className, min, max, id, value, checkbox, label, name } = this.props;
    const cx = classNames.bind(styles);
    const classes = cx({
      CheckboxInput: true
    }, className);

    const minMax = Object.assign({ min }, max !== 0 ? { max } : {});
    return (
      <div className={classes} style={this.props.style}>
        {checkbox ?
          <Checkbox
            label={title}
            name={id || name}
            checked={this.state.currentCheckbox}
            onChange={this.handleChange}
          /> :
          <div>{title}</div>}
        <TransitionGroup>
          {(this.state.currentCheckbox || !checkbox) && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={styles.inputContainer}>
              <div className={styles.inputDiv}>
                <Text
                  id={`${id}Input`}
                  className={styles.input}
                  name={`${id}Input`}
                  type="number"
                  defaultValue={value || min}
                  onChange={this.handleChangeDebounce}
                  {...minMax}
                />
                <label>{label}</label>
              </div>
              <div className={styles.desc}>{desc}</div>
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
