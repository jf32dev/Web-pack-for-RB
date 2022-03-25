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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Checkbox from 'components/Checkbox/Checkbox';
import Select from 'react-select';
import Btn from 'components/Btn/Btn';

/**
 * Admin Form Field
 */
export default class FormField extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    dataKey: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    /** Description of customProp2 */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),

    type: PropTypes.oneOf(['text', 'checkbox', 'select', 'title', 'hr', 'desc', 'div', 'create']),

    /** Pass all strings as an object */
    label: PropTypes.string,

    paddingBottom: PropTypes.string,

    options: PropTypes.array,

    disabled: PropTypes.bool,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {};

    if (props.onChange) {
      this.handleDebounceChange = _compose(
        _debounce(this.handleChange.bind(this), 300),
        _clone
      );
    }
    autobind(this);
  }

  handleOptionsChange(data) {
    this.updateValues({
      [this.props.dataKey]: data.value
    });
  }

  handleChange(e) {
    const { value, type, checked } = e.currentTarget;

    if (['text'].indexOf(type) > -1) {
      this.updateValues({
        [this.props.dataKey]: value
      }, e);
    } else if (['checkbox'].indexOf(type) > -1) {
      this.updateValues({
        [this.props.dataKey]: checked
      }, e);
    } else {
      this.updateValues({
        [this.props.type]: this.props.dataKey
      }, e);
    }
  }

  updateValues(update, e) {
    const { onChange, disabled } = this.props;
    if (onChange && !disabled) {
      onChange(update, e);
    }
  }

  render() {
    const {
      className,
      type,
      label,
      dataKey,
      options,
      value,
      disabled,
      style,
      ...others
    } = this.props;
    const styles = require('./FormField.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FormField: true,
      maxWidth: ['text', 'select'].indexOf(type) > -1,
      hr: type === 'hr',
      title: type === 'title',
      desc: type === 'desc',
      text: type === 'text',
      checkbox: type === 'checkbox',
      select: type === 'select',
      padding: type === 'padding',
      create: type === 'create',
      disabled,
    }, className);

    let component;

    const othersRemoveUndefined = Object.keys(others).reduce((obj, key) => {
      if (others[key] && key !== 'onChange') {
        return { ...obj, [key]: others[key] };
      }
      return obj;
    }, {});

    switch (type) {
      case 'text':
        component = (<Text
          id={dataKey}
          name={dataKey}
          label={label}
          defaultValue={value}
          className={classes}
          {...othersRemoveUndefined}
          onChange={this.handleDebounceChange}
        />);
        break;
      case 'checkbox':
        component = (<Checkbox
          label={label}
          name={dataKey}
          value={dataKey}
          checked={value}
          className={classes}
          onChange={this.handleChange}
        />);
        break;
      case 'hr':
        component = (<div className={classes} />);
        break;
      case 'title':
        component = (<div className={classes}>
          {label}
        </div>);
        break;
      case 'select':
        component = (
          <div className={classes}>
            <label>{label}</label>
            <Select
              name={dataKey}
              value={value}
              options={options}
              clearable={false}
              onChange={this.handleOptionsChange}
            />
          </div>);
        break;
      case 'desc':
        component = (<div className={classes}>
          {label}
        </div>);
        break;
      case 'div':
        component = (
          <div className={classes} style={style} />
        );
        break;
      case 'create':
        component = (
          <Btn
            icon="zoomIn-fill" borderless small
            className={classes} id={dataKey} onClick={this.handleChange}
          >{label}</Btn>
        );
        break;
      default:
        component = (<div />);
        break;
    }

    return component;
  }
}
