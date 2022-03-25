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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { emojify } from 'react-emojione';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FormattedDate } from 'react-intl';

import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import CommentInput from 'components/CommentInput/CommentInput';
import UserItem from 'components/UserItem/UserItem';

/**
 * CommentItem
 */
export default class CommentItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    message: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    author: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,  // commenting user

    /** Required if a comment reply */
    parentId: PropTypes.number.isRequired,
    replies: PropTypes.array,

    canDelete: PropTypes.bool,

    replyDisabled: PropTypes.bool,
    deleteDisabled: PropTypes.bool,
    linkDisabled: PropTypes.bool,

    strings: PropTypes.object,

    onUserClick: PropTypes.func.isRequired,
    onAddComment: function (props) {
      if (!props.deleteDisabled && typeof props.onAddComment !== 'function') {
        return new Error('onAddComment is required.');
      }
      return null;
    },
    onDeleteComment: function (props) {
      if (props.canDelete && !props.deleteDisabled && typeof props.onDeleteComment !== 'function') {
        return new Error('onDeleteComment is required when canDelete is provided.');
      }
      return null;
    }
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    replies: [],
    strings: {
      reply: 'Reply',
      replyPlaceholder: 'Write a reply...',
      deleteConfirm: 'Are you sure you want to delete this comment?',
      deleteRepliesConfirm: 'Are you sure you want to delete this comment and all replies?',
      cancel: 'Cancel',
      delete: 'Delete'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      showReplyInput: false,
      confirmDelete: false,
      isLoading: !this.props.id
    };

    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.id && nextProps.id > 0) {
      this.setState({ isLoading: false });
    }
  }

  handleCancelDelete(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleConfirmDelete(event) {
    event.preventDefault();

    const { onDeleteComment } = this.props;
    if (typeof onDeleteComment === 'function') {
      onDeleteComment(this.props.id, this.props);
    }
  }

  handleAddComment(parentId, message) {
    this.setState({ showReplyInput: false });

    const { onAddComment } = this.props;
    if (typeof onAddComment === 'function') {
      onAddComment(parentId, message);
    }
  }

  handleDeleteClick() {
    this.setState({ confirmDelete: true });
  }

  handleReplyClick() {
    this.setState({ showReplyInput: !this.state.showReplyInput });
  }

  handleEmptyReplyBlur() {
    this.setState({ showReplyInput: false });
  }

  render() {
    const { isLoading } = this.state;
    const {
      id,
      user,
      author,
      message,
      status,
      time,
      parentId,
      replies,

      canDelete,
      replyDisabled,
      deleteDisabled,
      linkDisabled,

      strings,

      onUserClick,
      onDeleteComment
    } = this.props;
    const styles = require('./CommentItem.less');
    let replyListElem;

    // Comment input if reply is enabled
    const newReplyElem = (
      <div className={styles.replyInput}>
        <CommentInput
          user={user}
          placeholderText={strings.replyPlaceholder}
          parentId={id}
          authString={this.context.settings.authString}
          onSubmit={this.handleAddComment}
          onEmptyBlur={this.handleEmptyReplyBlur}
        />
      </div>
    );

    // Nested comments (replies)
    if (!parentId) {
      replyListElem = (
        <div className={styles.nestedComments}>
          {replies.map(reply => reply && reply.status !== 'deleted' &&
            <CommentItem
              key={'reply-' + reply.id}
              user={user}
              replyDisabled
              deleteDisabled={deleteDisabled}
              linkDisabled={linkDisabled}
              onUserClick={onUserClick}
              onAddComment={this.handleAddComment}
              onDeleteComment={onDeleteComment}
              {...reply}
            />)}
          {!replyDisabled && this.state.showReplyInput && newReplyElem}
        </div>
      );
    }

    return (
      <div className={styles.CommentItem}>
        <TransitionGroup>
          {this.state.confirmDelete && <CSSTransition
            classNames="fade"
            timeout={150}
            appear
          >
            <div className={styles.confirmDelete}>
              <p>{parentId ? strings.deleteConfirm : strings.deleteRepliesConfirm}</p>
              <ul>
                <li><Btn large alt onClick={this.handleCancelDelete}>{strings.cancel}</Btn></li>
                <li><Btn large inverted onClick={this.handleConfirmDelete}>{strings.delete}</Btn></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <div className={styles.commentWrap}>
          <UserItem
            note={<FormattedDate
              value={time * 1000}
              day="2-digit"
              month="short"
              year="numeric"
            />}
            thumbSize="tiny"
            showThumb
            noLink={this.props.linkDisabled}
            authString={this.context.settings.authString}
            onClick={this.props.onUserClick}
            {...author}
          />
          <div className={styles.message}>
            {emojify(message, { output: 'unicode' })}
          </div>
          {!replyDisabled && status !== 'failed' && <span data-id="reply" className={styles.reply} onClick={this.handleReplyClick}>{strings.reply}</span>}
          {(canDelete && !deleteDisabled) && status !== 'failed' && <span
            data-id="delete" className={styles.delete} title={strings.delete}
            onClick={this.handleDeleteClick}
          />}
          {isLoading && <Loader type="content" style={{ marginLeft: '1rem' }} />}
        </div>
        {replyListElem}
      </div>
    );
  }
}
