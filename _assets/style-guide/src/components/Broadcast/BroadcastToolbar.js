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

export default class BroadcastToolbar extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    active: PropTypes.bool,

    onItemClick: PropTypes.func,
    rightItems: PropTypes.array,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      exit: 'Exit',
      live: 'Live',
      offline: 'Offline',
    },
    rightItems: [{ name: 'user', value: 0 }],
  };

  render() {
    const {
      name,
      active,
      onItemClick,
      strings,
      rightItems,
      className,
      style,
    } = this.props;
    const styles = require('./BroadcastToolbar.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BroadcastToolbar: true,
    }, className);

    const activeClasses = cx({
      live: active,
      offline: !active
    });

    return (
      <div className={classes} style={style}>
        <div className={styles.leftItems}>
          <div className={styles.exit} data-action="exit" onClick={onItemClick}>
            {strings.exit}
          </div>
        </div>
        <div className={styles.centerItems}>
          <span className={styles.centerItemsName}>{name}</span>
          <div className={activeClasses}>{ active ? strings.live : strings.offline}</div>
        </div>
        <div className={styles.rightItems}>
          {rightItems.map(item =>
            (<div key={item.name} className={styles['div' + item.name]}>
              <div className={styles[item.name]} data-action={item.name} onClick={onItemClick} />
              <span>{item.value}</span>
            </div>)
          )}
        </div>
      </div>
    );
  }
}
