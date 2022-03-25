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

/**
 * I don't think this component is neccessary, why not use a <List> ?
 * - Lochlan
 * TODO - Replace this component with List
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

export default class UserList extends PureComponent {
  static propTypes = {
    clients: PropTypes.array,
    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      clients,
      className,
      style
    } = this.props;
    const styles = require('./UserList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      UserList: true,
    }, className);

    return (
      <div className={classes} style={style}>
        {clients.map((client, index) => (<div className={styles.listItem} key={index}>
          <span>{client}</span></div>))}
      </div>
    );
  }
}
