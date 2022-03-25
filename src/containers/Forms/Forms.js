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
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadCategories,
  loadForms
} from 'redux/modules/forms';
import {
  setLastFormsRoute
} from 'redux/modules/settings';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';


const messages = defineMessages({
  category: { id: 'category', defaultMessage: 'Category' },
  forms: { id: 'forms', defaultMessage: 'Forms' },
  comingSoon: { id: 'page-coming-soon-message', defaultMessage: 'We’re still building this page for you, please check back soon.' },
  emptyCategoryHeading: { id: 'no-categories', defaultMessage: 'No Categories' },
  emptyCategoryMessage: { id: 'form-category-empty-message', defaultMessage: 'Create a Form Category to get started with Forms' },

  emptyFormHeading: { id: 'forms', defaultMessage: 'Forms' },
  emptyFormMessage: { id: 'forms-form-empty-message', defaultMessage: 'Select a Category to view Forms' },

  noFormHeading: { id: 'no-forms-available', defaultMessage: 'No Forms available' },
});

function mapStateToProps(state, ownProps) {
  const { forms } = state;
  const selectedCat = forms.categoriesById[ownProps.match.params.catId];

  // Selected Category's forms
  let catForms = [];
  if (selectedCat && selectedCat.forms) {
    catForms = selectedCat.forms.map(id => forms.formsById[id]);
  }

  return {
    ...forms,
    categories: forms.categories.map(id => forms.categoriesById[id]),
    forms: catForms,

    // Selected Tab name for Side list title
    selectedCatId: selectedCat ? selectedCat.id : null,
    selectedCatName: selectedCat ? selectedCat.name : '',

    formsComplete: selectedCat ? selectedCat.formsComplete : {},
    formsLoading: selectedCat ? selectedCat.formsLoading : false,
    formsError: selectedCat ? selectedCat.formsError : {}
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadCategories,
    loadForms,

    setLastFormsRoute
  })
)
export default class Forms extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    forms: PropTypes.array.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.catId && this.props.match.params.catId !== nextProps.match.params.catId) {
      this.props.loadForms(nextProps.match.params.catId);
    }

    // Save current route
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.setLastFormsRoute(nextProps.location.pathname);
    }
  }

  handleIndexClick(event) {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleItemClick(event) {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  /**
   * Side List Event Handlers
   */
  handleSideListMenuOptionClick(event) {
    event.preventDefault();
  }

  handleSideListScroll(event) {
    const target = event.target;
    const { categories, categoriesLoading, categoriesComplete } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    if (scrollBottom >= loadTrigger && !categoriesLoading) {
      // Load more Categories
      if (!categoriesComplete) {
        this.props.loadCategories(categories.length + 1);
      }
    }
  }

  /**
   * Main List Event Handlers
   */
  handleMainListMenuOptionClick(event) {
    event.preventDefault();
  }

  handleMainListScroll(event) {
    const target = event.target;
    const { forms, formsLoading, formsComplete } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    if (scrollBottom >= loadTrigger && !formsLoading) {
      // Load more Forms
      if (this.props.match.params.catId && !formsComplete) {
        this.props.loadForms(this.props.match.params.catId, forms.length + 1);
      }
    }
  }

  render() {
    const { formatMessage } = this.context.intl;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className="listContainer">
        <Helmet>
          <title>{strings.forms}</title>
        </Helmet>
        <header style={{ paddingLeft: '2rem' }}>
          <h3>{strings.forms}</h3>
        </header>
        <AppHeader />
        <Blankslate
          icon="wheelbarrow"
          iconSize={128}
          heading={strings.comingSoon}
          message={
            <span>To use forms please <a target="_blank" rel="noopener noreferrer" href={`${window.BTC.WEBAPPV4_URL}#access_token=${localStorage.BTCTK_A}&expires_in=${localStorage.expires_in}&path=forms`}>use the v4 web app.</a></span>
          }
          middle
        />
      </div>
    );
  }
}
