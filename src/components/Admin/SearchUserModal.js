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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import autobind from 'class-autobind';
import {
  clearResults,
  loadPeople,
  loadRecommendations,
  setPeopleKeyword
} from 'redux/modules/people';

import { mapUsers } from 'redux/modules/entities/helpers';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import UsersModal from 'components/Admin/AdminCustomApps/UsersModal';


const messages = defineMessages({
  users: { id: 'users', defaultMessage: 'Users' },
  search: { id: 'search', defaultMessage: 'Search' },
  select: { id: 'select', defaultMessage: 'Select' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  emptyHeading: { id: 'user-list-empty-heading', defaultMessage: 'No results found' },
  emptyMessage: { id: 'user-list-empty-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
});

function mapStateToProps(state) {
  const { entities, people } = state;

  return {
    ...people,
    results: mapUsers(people.people, entities),
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    clearResults,
    loadPeople,
    loadRecommendations,
    setPeopleKeyword,
  })
)
export default class SearchUsersModal extends Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    loading: PropTypes.bool,
    results: PropTypes.array,
    onSelectUser: PropTypes.func,
    onClose: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    results: []
  };

  constructor(props) {
    super(props);
    this.offset = -1;
    autobind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keyword !== this.props.keyword || (this.props.isVisible && !prevProps.isVisible)) {
      this.props.clearResults();
      this.props.loadPeople({ keyword: this.props.keyword });
    }
    if (this.props.isVisible && !prevProps.isVisible) {
      this.props.clearResults();
    }
  }

  handlePeopleLoad() {
    if (this.offset !== this.props.results.length) {
      this.offset = this.props.results.length;
      this.props.loadPeople({ keyword: this.props.keyword, offset: this.offset });
    }
  }

  handleSearchChange(value) {
    this.props.setPeopleKeyword(value);
  }

  handleClick(e, context) {
    if (this.props.onSelectUser) {
      this.props.onSelectUser({
        ...context.props,
        showSelect: false
      });
    }
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { onClose, isVisible, results, peopleLoading, peopleLoadingMore, peopleError, peopleComplete, peopleLoaded } = this.props;
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <UsersModal
        onClose={onClose}
        isVisible={isVisible}
        strings={strings}
        onGetList={this.handlePeopleLoad}
        list={results}
        isLoading={peopleLoading}
        isLoadingMore={peopleLoadingMore}
        isComplete={peopleComplete}
        isLoaded={peopleLoaded}
        onInputChange={this.handleSearchChange}
        error={peopleError}
        onClick={this.handleClick}
      />
    );
  }
}
