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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';
import {
  Route,
  NavLink,
  Switch
} from 'react-router-dom';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  clearResults,
  loadPeople,
  loadRecommendations,
  setPeopleKeyword
} from 'redux/modules/people';
import {
  toggleUserFollow
} from 'redux/modules/user';
import {
  addFile as addFileToViewer
} from 'redux/modules/viewer';
import { mapUsers } from 'redux/modules/entities/helpers';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import Loader from 'components/Loader/Loader';
import PeopleList from 'components/People/PeopleList';
import Recommendations from 'components/People/Recommendations';

const messages = defineMessages({
  people: { id: 'people', defaultMessage: 'People' },
  person: { id: 'person', defaultMessage: 'Person' },
  searchPlaceholder: { id: 'search', defaultMessage: 'Search' },
  emptyHeading: { id: 'no-results', defaultMessage: 'No results found', },
  emptyMessage: { id: 'search-empty-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
});

function mapStateToProps(state) {
  const { entities, chat, people } = state;

  return {
    ...people,
    featuredUsers: mapUsers(people.featured, entities),
    similarUsers: mapUsers(people.similar, entities),
    results: mapUsers(people.people, entities),

    audioSupported: chat.audioSupported,
    videoSupported: chat.videoSupported
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    clearResults,
    loadPeople,
    loadRecommendations,
    setPeopleKeyword,
    toggleUserFollow,
    addFileToViewer
  })
)
export default class People extends Component {
  static propTypes = {
    featuredUsers: PropTypes.array,
    similarUsers: PropTypes.array,
    results: PropTypes.array
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    featuredUsers: [],
    similarUsers: [],
    results: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { hasPeople } = this.context.settings.userCapabilities;

    if (hasPeople) {
      this.props.loadRecommendations();
      this.props.loadPeople({ type: 'people', keyword: this.props.keyword });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.keyword !== this.props.keyword) {
      this.props.clearResults();
      this.props.loadPeople({ keyword: nextProps.keyword });
    }
  }

  handleAccessDeniedCloseClick(event) {
    event.preventDefault();
    if (!window.previousLocation || window.previousLocation.pathname === this.props.history.location.pathname) {
      this.props.history.push('/');
    } else {
      this.props.history.goBack();
    }
  }

  handleUserClick(event, context) {
    this.props.history.push('/people/' + context.props.id);
  }

  handleFollowClick(event, context) {
    this.props.toggleUserFollow(context.props.id, !context.props.isFollowed);
  }

  handleSearchChange(event) {
    this.props.setPeopleKeyword(event.currentTarget.value);
  }

  handleSearchClearClick(event) {
    event.preventDefault();
    this.props.setPeopleKeyword('');
  }

  handlePeopleLoad() {
    this.props.loadPeople({ keyword: this.props.keyword, offset: this.props.results.length });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { hasPeople, hasTextChat } = this.context.settings.userCapabilities;
    const {
      recommendationsLoaded
    } = this.props;
    const styles = require('./People.less');

    // Check user permission
    if (!hasPeople) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="You are not allowed to view People"
          onCloseClick={this.handleAccessDeniedCloseClick}
        />
      );
    }

    // Loading indicator
    if (!recommendationsLoaded) {
      return <Loader type="page" />;
    }

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const canVideoChat = false; //set to false to hide call button

    return (
      <div className={styles.People}>
        <Helmet title={strings.people} />
        <nav className="horizontal-nav secondary-nav">
          <ul>
            <li>
              <NavLink to="/people" exact activeClassName="active">
                <FormattedMessage id="recommendations" defaultMessage="Recommendations" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/people/all" activeClassName="active">
                <FormattedMessage id="directory" defaultMessage="Directory" />
              </NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route
            path="/people"
            exact
            render={() => (
              <Recommendations
                similarUsers={this.props.similarUsers || []}
                featuredUsers={this.props.featuredUsers || []}
                onCallClick={canVideoChat ? this.props.onCallClick : null}
                onChatClick={hasTextChat ? this.props.onAnchorClick : null}
                onFollowClick={this.handleFollowClick}
                onStoryClick={this.props.onStoryClick}
                onUserClick={this.handleUserClick}
              />
            )}
          />
          <Route
            path="/people/all"
            render={() => (
              <PeopleList
                searchValue={this.props.keyword}
                list={this.props.results}
                loading={this.props.peopleLoading}
                loadingMore={this.props.peopleLoadingMore}
                error={this.props.peopleError}
                strings={strings}
                onUserClick={this.handleUserClick}
                onCallClick={canVideoChat ? this.props.onCallClick : null}
                onChatClick={hasTextChat ? this.props.onAnchorClick : null}
                onFollowClick={this.handleFollowClick}
                onSearchChange={this.handleSearchChange}
                onSearchClearClick={this.handleSearchClearClick}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}
