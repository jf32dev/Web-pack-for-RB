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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Checkbox from 'components/Checkbox/Checkbox';
/**
 * Admin Cloud Services
 */
export default class AdminCloudServices extends PureComponent {
  static propTypes = {
    /** onChange method return the whole list */
    onChange: PropTypes.func,

    cloudServices: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      service: 'Service',
      myFiles: 'My Files',
      syncEngine: 'Sync Engine'
    },
    cloudServices: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleCheckboxChange(event) {
    const { cloudServices, onChange } = this.props;
    const data = _get(event, 'currentTarget.name', '').split('-');
    const find = cloudServices.find(item => item.nickname === data[0]);
    const update = cloudServices.map(item => (item.nickname === data[0] ? {
      ...item,
      [data[1]]: event.currentTarget.checked
    } : item));

    const set = cloudServices.reduce((accumulator, item) => (
      item.nickname === data[0] ? {
        ...accumulator,
        [item.nickname]: {
          myFiles: data[1] === 'myFiles' ? event.currentTarget.checked : find.myFiles,
        }
      } : {
        ...accumulator,
        [item.nickname]: {
          myFiles: item.myFiles,
        }
      }
    ), {});
    if (onChange) {
      onChange(update, set);
    }
  }

  render() {
    const { cloudServices, strings } = this.props;
    const styles = require('./AdminCloudServices.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      cloudServices: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.header}>
          <div>{strings.service}</div><div>{strings.myFiles}</div>{false && <div>{strings.syncEngine}</div>}
        </div>
        {cloudServices.map((item, i) => (
          <div className={styles.row} key={item.service + i}>
            <div className={styles[item.nickname] + ' icon-' + item.nickname} data-service={item.service}>{item.name}</div>
            <div>
              <Checkbox
                name={`${item.nickname}-myFiles`}
                value={`${item.nickname}-myFiles`}
                checked={item.myFiles}
                onChange={this.handleCheckboxChange}
              />
            </div>
            {false && <div>
              <Checkbox
                name={`${item.nickname}-syncEngine`}
                value={`${item.nickname}-syncEngine`}
                checked={item.syncEngine}
                onChange={this.handleCheckboxChange}
              />
            </div>}
          </div>
        ))}
      </div>
    );
  }
}
