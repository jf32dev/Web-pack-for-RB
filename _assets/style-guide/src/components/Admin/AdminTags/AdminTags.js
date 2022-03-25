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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Blankslate from 'components/Blankslate/Blankslate';

export default class AdminTags extends PureComponent {
  static propTypes = {
    /** Array of menu list */
    list: PropTypes.array.isRequired,

    /** Pass all strings as key/value pairs */
    strings: PropTypes.object,

    sortBy: PropTypes.string,

    maxValue: PropTypes.number,

    /** handle click on link */
    onAnchorClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: [],
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const {
      list,
      maxValue,
    } = this.props;
    const styles = require('./AdminTags.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      Index: true,
    }, this.props.className);

    if (!list.length) {
      return (
        <Blankslate
          icon="content"
          message={'There isn\'t any tag available.'}
          className={classes}
        />
      );
    }

    const percent = maxValue ? (100 / maxValue) : 1;
    return (
      <div className={styles.List}>
        {list.map((item) => (
          <div className={styles.ItemList} style={{ width: item.count * percent + '%' }}>
            <span>{item.name}</span>
            <span>{item.count}</span>
          </div>
        ))}
      </div>
    );
  }
}
