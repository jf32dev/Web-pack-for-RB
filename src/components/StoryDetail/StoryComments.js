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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Btn from 'components/Btn/Btn';
import Blankslate from 'components/Blankslate/Blankslate';
import CommentItem from 'components/CommentItem/CommentItem';
import CommentInput from 'components/CommentInput/CommentInput';

export default class StoryComments extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,

    comments: PropTypes.array,
    loading: PropTypes.bool,
    readOnly: PropTypes.bool,
    hasPeople: PropTypes.bool,

    strings: PropTypes.object,

    onUserClick: PropTypes.func.isRequired,
    onAddComment: function(props) {
      if (!props.readOnly && typeof props.onAddComment !== 'function') {
        return new Error('onAddComment is required when readOnly is false.');
      }
      return null;
    },
    onDeleteComment: function(props) {
      if (!props.readOnly && typeof props.onDeleteComment !== 'function') {
        return new Error('onDeleteComment is required when readOnly is false.');
      }
      return null;
    }
  };

  static defaultProps = {
    comments: [],
    strings: {
      emptyHeading: 'No comments',
      emptyMessage: 'Be the first to comment on this Story',
      writeAComment: 'Write a comment',
      commentInputNote: 'Shift + Enter for line break',
      reply: 'Reply',
      replyPlaceholder: 'Write a reply...',
      deleteConfirm: 'Are you sure you want to delete this comment?',
      deleteRepliesConfirm: 'Are you sure you want to delete this comment and all replies?',
      cancel: 'Cancel',
      delete: 'Delete'
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const comments = nextProps.comments.filter(item => item.status !== 'deleted');
    if (comments.length === 0 && prevState.totalComments > 0) {
      return {
        inputVisible: comments.length,
        totalComments: comments.length
      };
    }
    if (comments.length !== prevState.totalComments) {
      return {
        totalComments: comments.length
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const comments = props.comments.filter(item => item.status !== 'deleted');
    this.state = {
      inputVisible: comments.length,
      totalComments: comments.length
    };
    autobind(this);

    // refs
    this.commentInput = null;
  }

  handleBlankBtnClick(event) {
    event.preventDefault();
    this.setState({ inputVisible: true });
    this.commentInput.focusInput();
  }

  renderEmpty() {
    const { strings } = this.props;
    const { inputVisible } = this.state;

    return (
      <TransitionGroup>
        <CSSTransition
          classNames="fade"
          timeout={250}
          appear
        >
          <Blankslate
            icon="comment"
            iconSize={96}
            heading={strings.emptyHeading}
            message={strings.emptyMessage}
            style={{ marginBottom: '1.25rem' }}
          >
            {!inputVisible && <Btn small inverted onClick={this.handleBlankBtnClick} style={{ marginBottom: '1rem' }}>
              {strings.writeAComment}
            </Btn>}
          </Blankslate>
        </CSSTransition>
      </TransitionGroup>
    );
  }

  renderComments() {
    const { user, comments, readOnly, hasPeople } = this.props;

    return (
      <TransitionGroup>
        {comments.map((comment, index) => (comment.status !== 'deleted' && user && user.name) &&
        <CSSTransition
          key={'comment-' + index}  // eslint-disable-line
          classNames="fade"
          timeout={250}
          appear
        >
          <CommentItem
            user={user}
            replyDisabled={!comment.id || readOnly}
            linkDisabled={!hasPeople}
            strings={this.props.strings}
            onUserClick={this.props.onUserClick}
            onAddComment={this.props.onAddComment}
            onDeleteComment={this.props.onDeleteComment}
            {...comment}
          />
        </CSSTransition>)}
      </TransitionGroup>
    );
  }

  render() {
    const { inputVisible } = this.state;
    const { user, comments, readOnly } = this.props;
    const styles = require('./StoryComments.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryComments: true,
      loading: this.props.loading
    });

    // Non-deleted comments
    const validComments = comments.filter(c => c.status !== 'deleted');

    return (
      <div data-id="story-comments" className={classes}>
        {!validComments.length && this.renderEmpty()}
        {validComments.length > 0 && this.renderComments()}
        {!readOnly && <CommentInput
          ref={(c) => { this.commentInput = c; }}
          user={user}
          placeholderText={this.props.strings.writeAComment}
          noteText={this.props.strings.commentInputNote}
          onSubmit={this.props.onAddComment}
          style={{ display: inputVisible ? 'block' : 'none' }}
        />}
      </div>
    );
  }
}
