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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadCategories,
  loadCategoriesNested,
  loadForms,
  reset,
  selectSingleCategory,
  selectSingleForm,
  toggleSelectedForm
} from 'redux/modules/browser';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import TriggerList from 'components/TriggerList/TriggerList';

const messages = defineMessages({
  addForms: { id: 'add-forms', defaultMessage: 'Add Forms' },
  addForm: { id: 'add-form', defaultMessage: 'Add Form' },
  nItems: { id: 'n-items', defaultMessage: '{itemCount, plural, one {# item} other {# items}}' },

  categories: { id: 'categories', defaultMessage: 'Categories' },
  add: { id: 'add', defaultMessage: 'Add' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  remove: { id: 'remove', defaultMessage: 'Remove' },

  noCategoriesMessage: { id: 'no-categories-available', defaultMessage: 'No Categories available' },
  noFormsHeading: { id: 'forms', defaultMessage: 'Forms' },
  noFormsMessage: { id: 'no-forms-available', defaultMessage: 'No Forms available' },
});

function mapStateToProps(state) {
  const { browser, settings } = state;

  const availableCategories = browser.categories.map(id => browser.categoriesById[id]);
  const selectedCat = availableCategories.find(t => t.isSelected);

  // Selected Category's Forms
  let selectedCatsForms = [];
  if (selectedCat && selectedCat.forms) {
    selectedCatsForms = selectedCat.forms.map(id => browser.formsById[id]).filter(item => item.status === 'published');
  }

  // All Selected Forms
  const selectedForms = [];
  for (const key in browser.formsById) {  // eslint-disable-line
    if (browser.formsById[key].isSelected) {
      selectedForms.push(browser.formsById[key]);
    }
  }

  // Detect IE10/11 for flex bug workaround
  const isIE = settings.platform.name === 'IE';

  return {
    ...browser,
    categories: availableCategories.filter(obj => obj.formCount),  // filter empty
    selectedCat: selectedCat,
    selectedCatsForms: selectedCatsForms,
    selectedForms: selectedForms,

    isIE: isIE
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadCategories,
    loadCategoriesNested,
    loadForms,
    reset,
    selectSingleCategory,
    selectSingleForm,
    toggleSelectedForm
  })
)
export default class FormPickerModal extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,

    categories: PropTypes.array,
    selectedCat: PropTypes.object,
    selectedCatsForms: PropTypes.array,
    selectedForms: PropTypes.array,

    /** allow more than 1 file to be selected, displays "select all" option */
    allowMultiple: PropTypes.bool,

    /** applies flexbox style fix */
    isIE: PropTypes.bool,

    loadCategories: PropTypes.func,
    loadForms: PropTypes.func,
    reset: PropTypes.func,
    selectSingleCategory: PropTypes.func,
    selectSingleForm: PropTypes.func,
    toggleSelectedForm: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleGetCategoryList(offset) {
    const {
      categories
    } = this.props;

    // Fetch on initial load or if offset > 0
    if (offset || categories.length <= 1) {
      //this.props.loadCategories('published', offset);
      this.props.loadCategoriesNested(null, offset);
    }
  }

  handleGetFormList(offset) {
    const {
      selectedCat,
      selectedCatsForms
    } = this.props;

    // Fetch on initial load or it offset > 0
    if (selectedCat && selectedCat.id && (offset || !selectedCatsForms.length)) {
      this.props.loadForms(selectedCat.id, 'published', offset);
    }
  }

  handlePathClick(event) {
    event.preventDefault();
    this.props.selectSingleCategory(0);
  }

  handleCatClick(event, item) {
    event.preventDefault();
    this.props.selectSingleCategory(item.props.id);
  }

  handleFormClick(event, item) {
    event.preventDefault();

    if (this.props.allowMultiple) {
      this.props.toggleSelectedForm(item.props.id);
    } else {
      this.props.selectSingleForm(item.props.id);
    }
  }

  handleSaveClick(event) {
    this.props.onSave(event, this.props.selectedForms);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      isLoading,
      allowMultiple,

      categories,
      categoriesLoaded,
      categoriesLoading,
      categoriesComplete,

      selectedCat,
      selectedCatsForms,
      selectedForms,
      onClose
    } = this.props;
    const styles = require('./FormPickerModal.less');
    const cx = classNames.bind(styles);
    const listWrapperClasses = cx({
      listWrapper: true,
      ieBody: this.props.isIE,
      loading: isLoading,
      empty: selectedCat ? !selectedCatsForms.length : !categories.length
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { itemCount: selectedForms.length });

    // Breadcrumbs
    const paths = [{
      name: strings.categories,
      path: ''
    }];

    if (selectedCat) {
      paths.push({
        name: selectedCat.name,
        path: ''
      });
    }

    // Title String
    let titleString = allowMultiple ? strings.addForms : strings.addForm;
    if (selectedForms.length) {
      titleString += ` (${strings.nItems})`;
    }

    return (
      <Modal
        id="form-picker"
        escClosesModal
        isVisible={this.props.isVisible}
        headerTitle={titleString}
        footerChildren={(
          <div>
            <Btn
              data-id="cancel"
              large
              alt
              onClick={onClose}
            >
              {strings.cancel}
            </Btn>
            <Btn
              data-id="add"
              large
              inverted
              disabled={!selectedCatsForms.length}
              onClick={this.handleSaveClick}
            >
              {strings.add}
            </Btn>
          </div>
        )}
        className={styles.FormPickerModal}
        bodyClassName={styles.body}
        footerClassName={styles.footer}
        onClose={onClose}
      >
        <div className={styles.crumbWrapper}>
          <Breadcrumbs
            paths={paths}
            noLink
            onPathClick={this.handlePathClick}
            className={styles.crumbs}
          />
        </div>
        <div className={listWrapperClasses}>
          {!selectedCat && <TriggerList
            list={categories}
            isLoaded={categoriesLoaded}
            isLoading={categoriesLoading}
            isLoadingMore={categoriesLoading && categories.length > 0}
            isComplete={categoriesComplete}
            onGetList={this.handleGetCategoryList}
            listProps={{
              error: this.props.categoriesError,
              noLink: true,
              emptyHeading: strings.categories,
              emptyMessage: strings.noCategoriesMessage,
              onItemClick: this.handleCatClick,
              itemClassName: styles.item
            }}
          />}
          {selectedCat && <TriggerList
            list={selectedCatsForms}
            isLoaded={selectedCat.formsLoaded}
            isLoading={selectedCat.formsLoading && selectedCatsForms.length === 0}
            isLoadingMore={selectedCat.formsLoading && selectedCatsForms.length > 0}
            isComplete={selectedCat.formsComplete}
            onGetList={this.handleGetFormList}
            listProps={{
              error: selectedCat.formsError,
              noLink: true,
              itemProps: {
                showCheckbox: true
              },
              emptyHeading: strings.noFormsHeading,
              emptyMessage: strings.noFormsMessage,
              onItemClick: this.handleFormClick,
              itemClassName: styles.item
            }}
          />}
        </div>
      </Modal>
    );
  }
}
