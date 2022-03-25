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
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';

/**
 * DomainControllerItem description
 */
export default class DomainControllerItem extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const {
      strings,
      dragIcon,
      itemIndex,
      accountSuffix,
      onChange,
    } = this.props;
    const styles = require('./DomainControllerItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      DomainControllerItem: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style} data-index={itemIndex}>
        <div className={styles.input}>
          {dragIcon}
          <div className={styles.text}>{accountSuffix || strings.setDomainController}</div>
        </div>
        <Btn
          inverted data-action="domainControllerItem-edit" data-index={itemIndex}
          onClick={onChange}
        >{strings.edit}</Btn>
        <Btn
          warning data-action="domainControllerItem-delete" data-index={itemIndex}
          onClick={onChange}
        >{strings.delete}</Btn>
      </div>
    );
  }
}
