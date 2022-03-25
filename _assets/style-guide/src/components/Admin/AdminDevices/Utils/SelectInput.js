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
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Text from 'components/Text/Text';
import Select from 'components/Select/Select';

/**
 * Blank description
 */
export default class SelectInput extends PureComponent {
  static propTypes = {
    /** select options */
    options: PropTypes.array,

    /** result list */
    list: PropTypes.array,

    /** add button label */
    btnLabel: PropTypes.string,

    /** event method to remove the items in the list */
    onRemove: PropTypes.func,

    /** event method to add the items to the list */
    onAdd: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    list: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: {},
      value: '',
    };
    autobind(this);
  }

  handleSelectChange(selected) {
    this.setState({
      selected,
    });
  }

  handleChange(e) {
    const { type, value, dataset } = e.currentTarget;
    const { selected } = this.state;
    const { onRemove, onAdd } = this.props;
    if (type === 'text') {
      this.setState({
        value,
      });
    } else if (type === 'button' && dataset.action === 'add' && onAdd && typeof onAdd === 'function') {
      this.setState({
        value: '',
        selected: {}
      });
      onAdd({
        option: selected.value,
        value: this.state.value,
      });
    } else if (type === 'button' && dataset.action === 'remove' && onRemove && typeof onRemove === 'function') {
      onRemove(dataset.id);
    }
  }

  render() {
    const { className, style, options, list, btnLabel } = this.props;
    const { selected, value } = this.state;
    const styles = require('./SelectInput.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SelectInput: true
    }, className);

    return (
      <div className={classes} style={style}>
        <div className={styles.input}>
          <Select
            name="select"
            value={selected || ''}
            options={options}
            className={styles.select}
            searchable={false}
            clearable={false}
            onChange={this.handleSelectChange}
          />
          <Text
            value={value}
            onChange={this.handleChange}
            placeholder={_get(selected, 'placeHolder', '')}
          />
          <Btn
            inverted
            small
            data-action="add"
            disabled={_isEmpty(selected) || _isEmpty(value)}
            onClick={this.handleChange}
          >
            {btnLabel}
          </Btn>
        </div>
        <div className={styles.list}>
          <table>
            <tbody>
              {list.length > 0 && list.map((item, i) => (
                <tr key={i}>
                  <td>{item.option}</td>
                  <td>{item.value}</td>
                  <td className={styles.deleteBtnTD}>
                    <Btn
                      icon="zoomIn" borderless data-action="remove"
                      data-id={item.id} className={styles.btn} onClick={this.handleChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
