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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FormattedDate } from 'react-intl';


import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import UserItem from 'components/UserItem/UserItem';

export default class PraiseItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    message: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    praisedBy: PropTypes.object.isRequired,
    canDeletePraise: PropTypes.bool,
    status: PropTypes.string,

    authString: PropTypes.string,

    onUserClick: PropTypes.func.isRequired,
    onDeletePraise: PropTypes.func,
    deleteLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
    confirmDeleteMessage: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  static defaultProps = {
    authString: '',
    confirmDeleteMessage: 'Are you sure you want to delete this praise?',
    cancelLabel: 'Cancel',
    deleteLabel: 'Delete'
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({ confirmDelete: false });
  }

  handleCancelDelete() {
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    this.props.onDeletePraise(this, event);
  }

  handleDeleteClick() {
    this.setState({ confirmDelete: true });
  }

  render() {
    const { confirmDelete } = this.state;
    const {
      id,
      time,
      status,
      deleting,
      canDeletePraise
    } = this.props;
    const style = require('./Praises.less');
    const actualDateParsed = (<FormattedDate
      value={time * 1000}
      day="2-digit"
      month="short"
      year="numeric"
    />);


    const cx = classNames.bind(style);
    const itemClasses = cx({
      message: true,
      messageAdmin: canDeletePraise && id && status !== 'loading',
    });

    return (
      <li>
        <TransitionGroup>
          {confirmDelete && <CSSTransition
            classNames="fade"
            timeout={250}
            appear
          >
            <div className={style.confirmDelete}>
              <p>{this.props.confirmDeleteMessage}</p>
              <ul>
                <li><Btn alt onClick={this.handleCancelDelete}>{this.props.cancelLabel}</Btn></li>
                <li><Btn inverted onClick={this.handleConfirmDelete}>{this.props.deleteLabel}</Btn></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <UserItem
          note={actualDateParsed}
          thumbSize="small"
          authString={this.props.authString}
          onClick={this.props.onUserClick}
          {...this.props.praisedBy}
          showThumb
          className={style.user}
        />
        <div className={itemClasses}>{this.props.message}</div>
        {canDeletePraise && (!confirmDelete && !deleting) && id && status !== 'loading' && <span className={style.deleteMessage} onClick={this.handleDeleteClick}>{this.props.deleteLabel || 'Delete'}</span>}
        {(!id || status === 'loading') && <Loader type="content" />}
      </li>
    );
  }
}
