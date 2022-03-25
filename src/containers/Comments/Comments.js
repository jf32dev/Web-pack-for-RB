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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadStoriesWithComments
} from 'redux/modules/me';
import { mapComments, mapStories } from 'redux/modules/entities/helpers';

import AppHeader from 'components/AppHeader/AppHeader';
import Btn from 'components/Btn/Btn';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import List from 'components/List/List';
import CommentItem from 'components/CommentItem/CommentItem';

const messages = defineMessages({
  me: { id: 'me', defaultMessage: 'Me' },
  comments: { id: 'comments', defaultMessage: 'Comments' },
  viewInStory: { id: 'view-in-story', defaultMessage: 'View in {story}' },
});

function mapStateToProps(state, ownProps) {
  const { entities, me } = state;
  const storiesWithComments = mapStories(me.storiesWithComments, entities);
  const selectedStory = entities.stories[ownProps.match.params.storyId];
  const selectedStoryComments = selectedStory ? mapComments(selectedStory.comments, entities) : [];

  return {
    ...me,
    storiesWithComments,
    selectedStory,
    selectedStoryComments
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadStoriesWithComments
  })
)
export default class Comments extends Component {
  static propTypes = {
    storiesWithComments: PropTypes.array,
    storiesWithCommentsLoaded: PropTypes.bool,
    storiesWithCommentsLoading: PropTypes.bool,
    storiesWithCommentsComplete: PropTypes.bool,

    loadStoriesWithComments: PropTypes.func.isRequired,

    onAnchorClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    storiesWithComments: []
  };

  UNSAFE_componentWillMount() {
    this.props.loadStoriesWithComments();
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { selectedStory, selectedStoryComments, onAnchorClick } = this.props;
    const styles = require('./Comments.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Me > Comments
    const path = [{
      name: strings.me,
      path: '/me'
    }, {
      name: strings.comments,
      path: '/comments'
    }];

    // Selected Story name
    const storyPath = [];
    if (selectedStory && selectedStory.name) {
      storyPath.push({
        name: selectedStory.name,
        path: '/story/' + selectedStory.permId
      });
    }

    return (
      <div className="listContainer">
        <Helmet>
          <title>{strings.comments}</title>
        </Helmet>
        <AppHeader />
        <div className={styles.storyList}>
          <header className={styles.crumbWrap}>
            <Breadcrumbs
              paths={path}
              onPathClick={onAnchorClick}
            />
          </header>
          <div className={styles.listWrapper}>
            <div className={styles.storiesWrap}>
              <List
                list={this.props.storiesWithComments}
                type="story"
                loading={this.props.storiesWithCommentsLoading && !selectedStoryComments.length}
                loadingMore={this.props.storiesWithComments.length > 0 && this.props.storiesWithCommentsLoading}
                activeId={selectedStory ? selectedStory.id : 0}
                rootUrl="/comments"
                showThumb
                thumbSize="small"
                itemProps={{
                  note: ''
                }}
                onItemClick={onAnchorClick}
              />
            </div>
          </div>
        </div>

        <div className={styles.commentList}>
          <header className={styles.crumbWrap}>
            <Breadcrumbs
              paths={storyPath}
              onPathClick={onAnchorClick}
            />
          </header>
          <div className={styles.listWrapper}>
            <div className={styles.commentsWrap}>
              {selectedStoryComments && selectedStoryComments.map(comment =>
                (<CommentItem
                  {...comment}
                  key={comment.id}
                  user={this.context.settings.user}
                  replyDisabled
                  deleteDisabled
                  onUserClick={onAnchorClick}
                />)
              )}
              {selectedStory && selectedStory.permId && <Btn
                href={'/story/' + selectedStory.permId}
                inverted
                onClick={onAnchorClick}
                className={styles.storyBtn}
              >
                {strings.viewInStory}
              </Btn>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
