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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
//redux
import {
  getStories,
  updateStories,
} from 'redux/modules/admin/stories';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminStoryArchiving from 'components/Admin/AdminStoryArchiving/AdminStoryArchiving';

const ARCHIVING = 'archiving';

const messages = defineMessages({
  enableInactiveStoryMarking: {
    id: 'enable-inactive-story-marking',
    defaultMessage: 'Enable inactive {story} marking'
  },
  markStoriesInactiveAfter: {
    id: 'mark-stories-inactive-after',
    defaultMessage: 'Mark {stories} inactive after:',
  },
  contentIQMsg: {
    id: 'content-IQ-msg',
    defaultMessage: 'With a Content IQ score lower than'
  },
  week: {
    id: 'week',
    defaultMessage: 'Week'
  },
  updateImpact: {
    id: 'update-impact',
    defaultMessage: 'Update Impact'
  },
  fallBelowInfo: {
    id: 'fall-below-info',
    defaultMessage: '({affected} from {total} {stories} fall below Content IQ threshold)'
  },
  enableInactiveStoryArchiving: {
    id: 'enable-inactive-story-archiving',
    defaultMessage: 'Enable inactive {story} archiving',
  },
  inactiveAfter: {
    id: 'inactive-after',
    defaultMessage: 'Archive {stories} after being marked inactive for:'
  },
  storyAuthorsNotifiedInfo: {
    id: 'story-authors-notified-info',
    defaultMessage: '{story} authors will be notified when {stories} are archived.'
  },
  enableArchivedStoryDeleting: {
    id: 'enable-archived-story-deleting',
    defaultMessage: 'Enable archived {story} deleting'
  },
  enableArchivedStoryDeletingDesc: {
    id: 'enable-archived-story-deleting-desc',
    defaultMessage: 'Use this section to set up hard delete options for your archived {stories}.'
  },
  deleteStoriesAfterBeingArchivedFor: {
    id: 'delete-stories-after-being-archived-for',
    defaultMessage: 'Delete {stories} after being archived for:'
  },
  day: {
    id: 'day',
    defaultMessage: 'day',
  },
  month: {
    id: 'month',
    defaultMessage: 'month'
  },
  oneDay: {
    id: 'one-day',
    defaultMessage: '1 day'
  },
  oneWeek: {
    id: 'one-week',
    defaultMessage: '1 week'
  },
  fourWeeks: {
    id: 'four-weeks',
    defaultMessage: '4 weeks',
  },
  eightWeeks: {
    id: 'eight-weeks',
    defaultMessage: '8 weeks'
  },
  twelveWeeks: {
    id: 'twelve-weeks',
    defaultMessage: '12 weeks'
  },
  deleteArchivedWarning: {
    id: 'delete-archived-warning',
    defaultMessage: 'Use caution when enabling this feature. {stories} will be permanently deleted and cannot be restored.'
  },
});

@connect(state => state.admin.stories,
  bindActionCreatorsSafe({
    getStories,
    updateStories,
    createPrompt
  })
)
export default class AdminStoryArchivingView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (this.props.getStories) {
      this.props.getStories(ARCHIVING);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'archiving-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleChange(values, update) {
    let newUpdate = update;
    const keyString = Object.keys(update)[0];
    if (newUpdate.archiveExpiryDays === 0) {
      newUpdate = {
        archiveExpiryDays: -1
      };
    }
    if (this.props.updateStories && newUpdate[keyString] !== this.props[keyString]) {
      this.props.updateStories(newUpdate);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      archiveExpiryDays,
      contentScoreLimitStats,
      inactivateLimitMonths,
      inactiveContentscoreLimit,
      waitTimeBeforeArchivingDays,
      loading,
      className,
      style
    } = this.props;
    const strings = generateStrings(messages, formatMessage, {
      ...naming,
      affected: _get(contentScoreLimitStats, 'affected', 0),
      total: _get(contentScoreLimitStats, 'total', 0)
    });
    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminStoryArchiving
          onChange={this.handleChange}
          inactivateLimitMonths={inactivateLimitMonths}
          inactiveContentscoreLimit={inactiveContentscoreLimit}
          waitTimeBeforeArchivingDays={waitTimeBeforeArchivingDays}
          archiveExpiryDays={archiveExpiryDays}
          contentScoreLimitStatsPercentage={_get(contentScoreLimitStats, 'percentage', 0).toFixed(2)}
          strings={strings}
        />}
      </div>
    );
  }
}
