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

import debounce from 'lodash/debounce';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getArchivedStories,
  setData
} from 'redux/modules/admin/stories';
import { createPrompt } from 'redux/modules/prompts';
import { mapStories } from 'redux/modules/entities/helpers';

import ArchivedHeader from 'components/StoryItemArchived/ArchivedHeader';
import TriggerList from 'components/TriggerList/TriggerList';

const messages = defineMessages({
  warning: { id: 'warning', defaultMessage: 'Warning' },
  title: { id: 'story-title', defaultMessage: '{story} Title' },
  author: { id: 'author', defaultMessage: 'Author' },
  date: { id: 'date', defaultMessage: 'Date' },
  filterStories: { id: 'filter-stories', defaultMessage: 'Filter {stories}' }
});

function mapStateToProps(state) {
  const { admin, entities } = state;

  const archivedStories = mapStories(admin.stories.archivedStories, entities);
  archivedStories.map(item => {
    const newItem = item;
    newItem.type = 'archivedStory';
    return newItem;
  });

  return {
    ...admin.stories,
    filterValue: admin.stories.filterValue,
    completed: admin.stories.archivedStoriesComplete,
    stories: archivedStories
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getArchivedStories,
    setData,

    createPrompt
  })
)
export default class AdminArchivedStoriesView extends Component {
  static propTypes = {
    stories: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    loaded: PropTypes.bool,
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    settings: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
  };

  static defaultProps = {
    gridView: false,
    thumbSize: 'small',
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.handleSearch = debounce(this.handleSearch.bind(this), 500);
  }

  componentWillMount() {
    if (!this.props.loaded) {
      this.props.getArchivedStories();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);

    if (this.props.error && !this.props.error.message && nextProps.error.message) {
      this.props.createPrompt({
        id: 'archived-story-error',
        type: 'warning',
        title: strings.warning,
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleGetList() {
    const { completed, filterValue, loading, stories } = this.props;

    if (!completed && !loading) {
      this.props.getArchivedStories(stories.length, filterValue);
    }
  }

  // Filter functions
  handleFilterChange(filterValue) {
    this.props.setData({ filterValue: filterValue });
    this.handleSearch(filterValue);
  }

  handleSearch(filterValue) {
    this.props.getArchivedStories(0, filterValue);
  }

  render() {
    const {
      completed,
      error,
      filterValue,
      gridView,
      loading,
      loaded,
      stories,
      className,
      style
    } = this.props;
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);

    const styles = require('./AdminArchivedStories.less');
    const cx = classNames.bind(styles);
    const wrapperClasses = cx({
      wrapper: true,
    }, className);

    return (
      <div className={wrapperClasses} style={style}>
        {!gridView && <ArchivedHeader
          strings={strings}
          filterValue={filterValue}
          filterPlaceholder={strings.filterStories}
          onFilterChange={this.handleFilterChange}
          className={styles.tableWidth}
        />}

        <TriggerList
          list={stories}
          isLoaded={loaded}
          isLoading={loading}
          isLoadingMore={loading && stories.length > 0}
          isComplete={completed}
          error={error}
          onGetList={this.handleGetList}
          listProps={{
            className: styles.listClass,
            itemProps: {
              grid: false,
              showThumb: true
            },
            thumbSize: this.props.thumbSize,
            onItemClick: this.props.onStoryClick,
          }}
        />
      </div>
    );
  }
}
