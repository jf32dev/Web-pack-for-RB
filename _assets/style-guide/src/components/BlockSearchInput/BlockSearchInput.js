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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lmcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import DropMenu from 'components/DropMenu/DropMenu';
import Modal from 'components/Modal/Modal';
import Tags from 'components/Tags/Tags';
import Text from 'components/Text/Text';

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  startTyping: { id: 'start-typing', defaultMessage: 'Start typing...' },
  whatIsYourTopic: { id: 'what-is-your-topic', defaultMessage: 'What is your topic?' },
  filters: { id: 'filters', defaultMessage: 'Filters' },
  filterBy: { id: 'filter-by', defaultMessage: 'Filter by:' },
  clearAllFilters: { id: 'clear-all-filters', defaultMessage: 'Clear all filters' },
  filtersSelected: { id: 'filters-selected', defaultMessage: 'Filters Selected' },
});

/**
 * BlockSearchInput description
 */
export default class BlockSearchInput extends PureComponent {
  static propTypes = {
    /** Initial search input value (uncontrolled) */
    keyword: PropTypes.string,

    /** Array of filters */
    filters: PropTypes.array,

    /** Array of initial selected filter IDs (uncontrolled) */
    selectedFilters: PropTypes.array,

    /** Fullscreen style UI */
    full: PropTypes.bool,

    /** Disable inputs/events */
    disabled: PropTypes.bool,

    onSearchClick: PropTypes.func,
    onClearClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    filters: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.keyword || '',
      allFilterOptions: [],
      selectedFilters: props.selectedFilters || [],
      filterModalVisible: false,
      changed: false,
    };

    this.input = null;

    autobind(this);
  }

  componentWillMount() {
    if (this.props.filters) {
      this.flattenFilterOptions(this.props.filters);
    }
  }

  componentDidMount() {
    this.input.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filters !== this.props.filters) {
      this.flattenFilterOptions(nextProps.filters);
    }
  }

  flattenFilterOptions(filters) {
    const allFilterOptions = filters.map(filterType => filterType.options).flat();

    this.setState({
      allFilterOptions: allFilterOptions
    });
  }

  handleSearchClick(event, selectedFilters) {
    this.props.onSearchClick(this.state.inputValue, selectedFilters || this.state.selectedFilters);
    this.setState({ changed: false });
  }

  handleInputChange(event) {
    this.setState({
      inputValue: event.currentTarget.value
    });
  }

  handleInputKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSearchClick();
    }
  }

  handleInputClear() {
    this.setState({
      inputValue: '',
      changed: false
    });
    this.input.focus();
    this.props.onClearClick();
  }

  handleFilterMenuToggle(item) {
    // for some reason DropMenu doesn't propogate nextProps, nextState
    if (item.state.active && this.state.changed) {
      // trigger search when filter menu closes
      this.handleSearchClick();
    }
  }

  handleFilterItemClick(event, filterId, val) {
    event.stopPropagation();
    const newSelectedFilters = [...this.state.selectedFilters];
    const index = newSelectedFilters.indexOf(val.id);

    if (index === -1) {
      newSelectedFilters.push(val.id);
    } else {
      newSelectedFilters.splice(index, 1);
    }

    this.setState({
      selectedFilters: newSelectedFilters,
      changed: true,
    });
  }

  handleFilterDeleteClick(event) {
    const newSelectedFilters = [...this.state.selectedFilters];
    const index = event.target.dataset.index;
    newSelectedFilters.splice(index, 1);

    this.setState({
      selectedFilters: newSelectedFilters,
      changed: true
    });

    // Trigger search
    this.handleSearchClick(event, newSelectedFilters);
  }

  handleClearFiltersClick() {
    this.setState({
      selectedFilters: [],
      filterModalVisible: false,
    });

    // Trigger search
    this.handleSearchClick(event, []);
  }

  handleToggleFilterModal() {
    this.setState({
      filterModalVisible: !this.state.filterModalVisible
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { filters, full, disabled } = this.props;
    const { allFilterOptions, selectedFilters, inputValue } = this.state;
    const styles = require('./BlockSearchInput.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      BlockSearchInput: true,
      full: full,
    }, this.props.className);
    const filterWrapClasses = cx({
      filterWrap: true,
      full: full,
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Limit number of selected filters to display
    let filtersToDisplay = 6;

    // Display less if selected filters have long names
    if (selectedFilters.toString().length > 70) {
      filtersToDisplay = 4;
    }
    const selectedFilterNames = selectedFilters.map(id => allFilterOptions.find(f => f.id === id).name);
    const firstThreeFilters = selectedFilterNames.slice(0, filtersToDisplay);
    const remainingFilterCount = selectedFilterNames.length - filtersToDisplay;

    // Disable search button if there are no input/filters
    const searchButtonDisabled = disabled || (!inputValue && !selectedFilters.length);

    return (
      <div className={classes} style={this.props.style}>
        <h3>{strings.whatIsYourTopic}</h3>
        <div className={styles.inputWrap}>
          <Text
            id="block-search-input"
            ref={(c) => { this.input = c; }}
            icon="search"
            tabIndex={1}
            placeholder={strings.startTyping}
            value={this.state.inputValue}
            disabled={disabled}
            showClear
            onChange={this.handleInputChange}
            onKeyPress={this.handleInputKeyPress}
            onClearClick={this.handleInputClear}
            className={styles.textInput}
          />

          <div className={styles.buttonWrap}>
            <Btn
              large
              inverted
              disabled={searchButtonDisabled}
              onClick={this.handleSearchClick}
              className={styles.searchButton}
            >
              {strings.search}
            </Btn>
          </div>
        </div>

        <div className={styles.selectedFilters}>
          {firstThreeFilters.length > 0 && <Tags
            list={firstThreeFilters}
            className={styles.tags}
            onItemDeleteClick={this.handleFilterDeleteClick}
          >
            {remainingFilterCount > 0 && <li
              className={styles.remainingCountItem}
              onClick={this.handleToggleFilterModal}
            >
              <span>+ {remainingFilterCount}</span>
            </li>}
            {selectedFilters.length > 0 && <li className={styles.clearFiltersItem}>
              <Btn
                className={styles.clearFiltersBtn}
                onClick={this.handleClearFiltersClick}
              >
                {strings.clearAllFilters}
              </Btn>
            </li>}
          </Tags>}
        </div>

        {filters.length > 0 && <div className={filterWrapClasses}>
          {full && <strong>{strings.filters}</strong>}

          <div>
            {!full &&  <span>{strings.filterBy}</span>}

            {filters.map(filter => (<DropMenu
              key={filter.id}
              heading={filter.name}
              button
              position={{ left: '-1px', right: 0, top: '1.8rem' }}
              className={styles.filterSelect}
              activeClassName={styles.filterSelectActive}
              onToggle={this.handleFilterMenuToggle}
            >
              <ul>
                {filter.options.map(opt => (<li
                  key={opt.id}
                  className={styles.filterItem}
                  onClick={(e) => this.handleFilterItemClick(e, filter.id, opt)}
                >
                  <label>{opt.name}</label>
                  <Checkbox
                    name={opt.id}
                    readOnly
                    checked={selectedFilters.indexOf(opt.id) > -1}
                    className={styles.filterCheckbox}
                  />
                </li>))}
              </ul>
            </DropMenu>))}
          </div>
        </div>}

        <Modal
          isVisible={this.state.filterModalVisible}
          backdropClosesModal
          escClosesModal
          headerTitle={strings.filtersSelected}
          footerCloseButton
          onClose={this.handleToggleFilterModal}
        >
          <div className={styles.filterModalBody}>
            <Tags
              list={selectedFilterNames}
              onItemDeleteClick={this.handleFilterDeleteClick}
            >
              <li className={styles.clearFilters}>
                <Btn
                  className={styles.clearFiltersBtn}
                  onClick={this.handleClearFiltersClick}
                >
                  {strings.clearAllFilters}
                </Btn>
              </li>
            </Tags>
          </div>
        </Modal>
      </div>
    );
  }
}
