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

import { defineMessages, FormattedRelative } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import UserItem from 'components/UserItem/UserItem';

const messages = defineMessages({
  storyHistory: { id: 'story-history', defaultMessage: '{story} history' },
  storyHistoryEmptyMessage: { id: 'story-history-empty', defaultMessage: 'No {story} history available' },

  // v5 history actions
  // https://bigtincan.atlassian.net/browse/HS-2526
  'annotation-added': { id: 'annotation-added', defaultMessage: 'Annotation added' },
  'annotation-deleted': { id: 'annotation-deleted', defaultMessage: 'Annotation deleted' },
  'annotation-edited': { id: 'annotation-edited', defaultMessage: 'Annotation edited' },
  'channel-subscribed': { id: 'channel-subscribed', defaultMessage: '{channel} subscribed' },
  'channel-unsubscribed': { id: 'channel-unsubscribed', defaultMessage: '{channel} unsubscribed' },
  'scheduled-story-created': { id: 'scheduled-story-created', defaultMessage: 'Scheduled {story} created' },
  'scheduled-story-edited': { id: 'scheduled-story-edited', defaultMessage: 'Scheduled {story} edited' },
  'scheduled-story-published': { id: 'scheduled-story-published', defaultMessage: 'Scheduled {story} published' },
  'story-add-bookmark': { id: 'story-add-bookmark', defaultMessage: 'Bookmarked added' },
  'story-remove-bookmark': { id: 'story-remove-bookmark', defaultMessage: 'Bookmarked removed' },
  'story-created': { id: 'story-created', defaultMessage: '{story} created' },
  'story-comment-deleted': { id: 'story-comment-deleted', defaultMessage: 'Comment removed' },
  'story-commented': { id: 'story-commented', defaultMessage: 'Comment added' },
  'story-commented-by-email': { id: 'story-commented-by-email', defaultMessage: 'Comment added via email' },
  'story-deleted': { id: 'story-deleted', defaultMessage: '{story} removed' },
  'story-edited': { id: 'story-edited', defaultMessage: '{story} edited' },
  'story-flagged': { id: 'story-flagged', defaultMessage: '{story} flagged' },
  'story-moved': { id: 'story-moved', defaultMessage: '{story} moved' },
  'story-promoted': { id: 'story-promoted', defaultMessage: '{story} promoted' },
  'story-rated': { id: 'story-rated', defaultMessage: '{story} rated' },
  'story-shared': { id: 'story-shared', defaultMessage: '{story} shared' },
  'story-subscribed': { id: 'story-subscribed', defaultMessage: '{story} subscribed' },
  'story-unrated': { id: 'story-unrated', defaultMessage: '{story} unrated' },
  'story-unsubscribed': { id: 'story-unsubscribed ', defaultMessage: '{story} unsubscribed' },
});

class StoryHistoryItem extends PureComponent {
  static propTypes = {
    action: PropTypes.string.isRequired,
    timeRecorded: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    strings: PropTypes.object,
    styles: PropTypes.object,
    onUserClick: PropTypes.func.isRequired
  };

  render() {
    const { styles } = this.props;

    return (
      <tr>
        <td className={styles.author}>
          <UserItem
            thumbSize="tiny"
            showThumb
            onClick={this.props.onUserClick}
            {...this.props.user}
          />
        </td>
        <td className={styles.action}>
          {this.props.strings[this.props.action]}
        </td>
        <td className={styles.time}>
          <FormattedRelative
            value={this.props.timeRecorded * 1000}
            style="best fit"
          />
        </td>
      </tr>
    );
  }
}

export default class StoryHistoryModal extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    loading: PropTypes.bool,
    list: PropTypes.array,

    onClose: PropTypes.func,
    onLoad: PropTypes.func.isRequired,
    onUserClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    list: []
  };

  componentDidMount() {
    this.props.onLoad(0);
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible && !prevProps.isVisible) {
      this.props.onLoad(0);
    }
  }

  renderBody(strings) {
    const { loading, list, onUserClick } = this.props;
    const styles = require('./StoryHistoryModal.less');

    if (loading && !list.length) {
      return (
        <div className={styles.loader}>
          <Loader type="content" />
        </div>
      );
    }

    if (!loading && !list.length) {
      return (
        <Blankslate
          icon="history"
          iconSize={96}
          message={strings.storyHistoryEmptyMessage}
          style={{ padding: '2rem 0 0' }}
        />
      );
    }

    return (
      <div className={styles.StoryHistoryModal}>
        <table>
          <tbody>
            {list.map((item, index) =>
              (<StoryHistoryItem
                key={'history-' + index}  // eslint-disable-line
                strings={strings}
                styles={styles}
                onUserClick={onUserClick}
                {...item}
              />)
            )}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <Modal
        backdropClosesModal
        escClosesModal
        isVisible={this.props.isVisible}
        headerCloseButton
        headerTitle={strings.storyHistory}
        footerCloseButton
        onClose={this.props.onClose}
      >
        {this.renderBody(strings)}
      </Modal>
    );
  }
}
