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
import classNames from 'classnames/bind';
import UserItem from 'components/UserItem/UserItem';

/**
 * a message box for showing the title, date, and user simple info, need to put the user object as props
 */
export default class ShareForward extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    title: PropTypes.string,

    /** date format is */
    date: PropTypes.string,

    /** user object */
    user: PropTypes.object,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** if onClick is false or undefined, the user item's style would be un clickable */
    onClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      forward: 'Forward',
    },
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const { strings, title, date, email, onClick, className, user } = this.props;
    const styles = require('./ShareForward.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ShareForward: true
    }, className);

    const isUserClickable = Object.prototype.hasOwnProperty.call(user, 'id') && (user.id > 0);

    const userItemClasses = cx({
      userItem: true,
      handIcon: isUserClickable,
    });

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.header}>
          <div>
            <strong className={styles.title}>{title}</strong>
            <div className={styles.date}>{strings.shared + ' ' + date}</div>
          </div>
        </div>
        {user && <UserItem
          thumbSize="tiny"
          className={userItemClasses}
          onClick={isUserClickable ? onClick : null}
          note={email}
          noLink
          {...user}
        />}
      </div>
    );
  }
}
