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
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  nValues: { id: 'n-values', defaultMessage: '{itemCount, plural, one {# value} other {# values}}' },
});

export default class CustomFilterItem extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    values: PropTypes.array,

    isFocused: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e, this.props);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      id,
      values,
      name,
      className,
    } = this.props;
    // Translations
    const strings = generateStrings(messages, formatMessage, { itemCount: values && values.length || 0 });

    const styles = require('./CustomFilter.less');
    const cx = classNames.bind(styles);

    const classes = cx({
      item: true,
      isFocused: this.props.isFocused,
      hasChildren: values && values.length,
    });

    return (
      <div className={className}>
        {values && values.length > 0 &&
        <a className={classes + ' customSelectItem'} data-id={id} onClick={this.handleClick}>
          <b className="customSelectItem">{name}</b>: <span className="customSelectItem">{strings.nValues}</span>
        </a>
        }

        {(typeof (values) === 'undefined' || !values || values.length === 0) &&
        <a className={classes + ' customSelectItem'} data-id={id} onClick={this.handleClick}>
          {name}
        </a>
        }
      </div>
    );
  }
}
