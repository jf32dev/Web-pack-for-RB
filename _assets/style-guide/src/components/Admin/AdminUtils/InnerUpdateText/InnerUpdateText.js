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
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

export default class InnerUpdateText extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func,

    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    defaultValue: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: null,
      isUpdated: false,
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({
        value: nextProps.defaultValue
      });
    }
  }

  handleChange (e) {
    const { value } = e.currentTarget;
    const { onChange, disabled } = this.props;

    if (!disabled) {
      this.setState({
        value: value || '',
      });

      if (!this.state.isUpdated) {
        this.setState({
          isUpdated: true,
        });
      }

      if (onChange && typeof onChange === 'function') {
        onChange(e);
      }
    }
  }

  handleClear(e) {
    this.setState({
      value: ''
    });

    const { onClearClick } = this.props;

    if (onClearClick && typeof onClearClick === 'function') {
      onClearClick(e);
    }
  }

  render() {
    const {
      defaultValue,
      textArea,
      ...others
    } = this.props;

    const { isUpdated, value } = this.state;

    if (textArea) {
      return (<Textarea
        {...others}
        value={isUpdated ? value : defaultValue}
        onChange={this.handleChange}
      />);
    }

    const checkDefault = defaultValue || '';
    const checkZero = defaultValue === 0 ? defaultValue : checkDefault;

    return (
      <Text
        {...others}
        value={isUpdated ? value : checkZero}
        onClearClick={others.showClear && this.handleClear}
        onChange={this.handleChange}
      />
    );
  }
}
