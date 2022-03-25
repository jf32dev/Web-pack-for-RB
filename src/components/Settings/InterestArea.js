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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadInterestArea,
  toggleInterestArea,
} from 'redux/modules/userSettings';

import Blankslate from 'components/Blankslate/Blankslate';
import List from 'components/List/List';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  pickYourFavorites: { id: 'pick-your-favorites', defaultMessage: 'Pick your favorites' },
  interestAreaHeading: { id: 'interest-area-heading-info', defaultMessage: 'Click any of the following topics to get access to additional content. You can change these at any time.' },
  noInterestArea: { id: 'no-interest-areas', defaultMessage: 'No interest areas' },
  noInterestAreaMessage: { id: 'no-interest-areas-message', defaultMessage: 'Interest Areas allow access to additional content, there are currently none available for your company.' },
});

function mapStateToProps(state) {
  const { userSettings } = state;

  return {
    ...userSettings,
    interestArea: userSettings.interestArea.map(id => userSettings.interestAreaById[id]),
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadInterestArea,
    toggleInterestArea,
  })
)
export default class InterestArea extends Component {
  static propTypes = {
    list: PropTypes.array
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.interestAreaLoaded && !this.props.interestAreaLoading && !this.props.interestArea.length) {
      this.props.loadInterestArea();
    }
  }

  handleClick(event, item) {
    event.preventDefault();
    this.props.toggleInterestArea(item.props.id, !item.props.selected);
  }

  handleListScroll(event) {
    const target = event.target;
    const {
      interestArea,
      interestAreaLoading,
      //interestAreaMoreLoading,
      interestAreaComplete,
    } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left
    const offset = interestArea.length;

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger && !interestAreaLoading) {
      // Load more
      if (!interestAreaComplete) {
        this.props.loadInterestArea(offset);
      }
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const styles = require('./InterestArea.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    if (this.props.interestArea && !this.props.interestArea.length && this.props.interestAreaLoading) {
      return (<Loader type="page" />);
    }

    if (!this.props.interestArea || !this.props.interestArea.length) {
      return (
        <Blankslate
          iconSize={128}
          heading={strings.noInterestArea}
          message={strings.noInterestAreaMessage}
          middle
        />
      );
    }

    return (
      <div className={styles.InterestArea}>
        <div className={styles.header}>
          <h3>{strings.pickYourFavorites}</h3>
          <span>{strings.interestAreaHeading}</span>
        </div>

        <div className={styles.ListController} onScroll={this.handleListScroll}>
          <List
            key={`list-${uniqueId()}`}
            onItemClick={this.handleClick}
            //onScroll={this.handleListScroll}
            grid
            showThumb
            list={this.props.interestArea}
            loadingMore={this.props.interestAreaLoading}
          />
        </div>
      </div>
    );
  }
}
