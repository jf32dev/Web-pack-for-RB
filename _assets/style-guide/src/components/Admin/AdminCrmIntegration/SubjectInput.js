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
import _isEmpty from 'lodash/isEmpty';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import EmailSubjectItem from 'components/EmailSubjectEditor/EmailSubjectItem';

const PlusValues = ({ onClick, strings, styles, disabled }) => (<div
  onClick={disabled ? undefined : onClick}
  className={`${styles.plusValues} ${disabled ? styles.disabled : ''}`}
>
  {strings.values}
</div>);

const messages = defineMessages({
  values: { id: 'values', defaultMessage: 'Values' },
});

export default class SubjectInput extends PureComponent {
  static propTypes = {
    /** Email category id */
    values: PropTypes.array,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    values: [],
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      inputs: null,
      valueActiveIndex: -1,
    };
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  getInputs() {
    if (Array.isArray(this.state.inputs)) {
      return [...this.state.inputs];
    }
    return [...this.props.values];
  }

  handleAdd() {
    const inputs = this.getInputs().concat('');
    this.setState({
      inputs: inputs,
      valueActiveIndex: inputs.length - 1
    });
  }

  handleRemove() {
    const inputs = this.getInputs().filter(item => !_isEmpty(item));
    this.setState({ inputs });
    this.updateData(inputs);
  }

  handleCustomTextChange(context, value) {
    const inputs = this.getInputs().map((item, i) => (i === +context.sortId ? value : item));
    this.setState({ inputs });
    this.updateData(inputs.filter(item => !_isEmpty(item)));
  }

  updateData(values) {
    if (this.props.onChange) {
      this.props.onChange(values);
    }
  }

  render() {
    const {
      valueActiveIndex
    } = this.state;
    const styles = require('./SubjectInput.less');

    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, naming);

    const cx = classNames.bind(styles);
    const classes = cx({
      SubjectInput: true,
    }, this.props.className);

    const results = this.getInputs();

    return (
      <div className={classes}>
        {results.length > 0 && results.map((value, i) => (<EmailSubjectItem
          name={value}
          key={i}
          sortId={i}
          type={+valueActiveIndex === +i ? 'custom' : 'variable'}
          strings={strings}
          styles={styles}
          className={`${styles.SubjectItem} ${+results.length - 1 > +i && _isEmpty(value) ? styles.displayNone : ''}`}
          onChange={this.props.onChange}
          onAdd={this.handleAdd}
          showAdd={this.props.showAdd || true}
          onRemove={this.handleRemove}
          onCustomTextChange={this.handleCustomTextChange}
        />))}
        {results.length === 0 && <PlusValues
          styles={styles}
          strings={strings}
          disabled={this.props.disabled}
          onClick={this.handleAdd}
        />}
      </div>
    );
  }
}
