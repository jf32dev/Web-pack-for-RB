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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import CommentItem from 'components/CommentItem/CommentItem';
import CommentInput from 'components/CommentInput/CommentInput';

const CommentItemDocs = require('!!react-docgen-loader!components/CommentItem/CommentItem.js');
const CommentInputDocs = require('!!react-docgen-loader!components/CommentInput/CommentInput.js');

const comments = require('../../static/comments.json');

export default class CommentsView extends Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  handleAddComment(parentId, message) {
    console.log(parentId, message);
  }

  handleDeleteComment() {
    console.log('handleDeleteComment');
  }

  render() {
    return (
      <section id="CommentsView">
        <h1>Comments</h1>
        <p>Comments are displayed on the Story Detail page.</p>

        <h2>CommentItem</h2>
        <Docs {...CommentItemDocs} />

        <ComponentItem>
          <CommentItem
            {...comments[0]}
            user={comments[1].author}
            onUserClick={this.handleAnchorClick}
            onAddComment={this.handleAddComment}
            onDeleteComment={this.handleDeleteComment}
          />
          <CommentItem
            {...comments[2]}
            user={comments[1].author}
            onUserClick={this.handleAnchorClick}
            onAddComment={this.handleAddComment}
            onDeleteComment={this.handleDeleteComment}
          />
        </ComponentItem>

        <h2>CommentInput</h2>
        <Docs {...CommentInputDocs} />

        <ComponentItem>
          <CommentInput
            user={comments[1].author}
            parentId={0}
            placeholderText="Write a comment..."
            onSubmit={this.handleAddComment}
            style={{ borderTop: 'none' }}
          />
        </ComponentItem>
      </section>
    );
  }
}
