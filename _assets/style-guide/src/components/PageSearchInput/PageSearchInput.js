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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincancom>
 */

import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Select from 'components/Select/Select';
import Tags from 'components/Tags/Tags';
import Text from 'components/Text/Text';

import DateModalPicker from './DateModalPicker';
import SearchFilters from './SearchFilters';

const initialState = {
  activeSuggestionOption: 0,
  filteredSuggestions: [],
  isDateModifiedVisible: false,
  isFilterModalVisible: false,
  isSuggestionOpen: false,
  ChannelPickerVisible: false,
  searchKeyword: '',
  selectedFilters: []
};

const PageSearchInput = props => {
  const [activeSuggestionOption, setActiveSuggestionOption] = useState(initialState.activeSuggestionOption);
  const [filteredSuggestions, setFilteredSuggestions] = useState(initialState.filteredSuggestions);
  const [hoveredOnList, setHoveredOnList] = useState(false);
  const [isDateModifiedVisible, toggleDateModifiedVisible] = useState(initialState.isDateModifiedVisible);
  const [isFilterModalVisible, toggleFilterModalVisible] = useState(initialState.isFilterModalVisible);
  const [isSuggestionOpen, toggleSuggestions] = useState(initialState.isSuggestionOpen);
  const [searchKeyword, setSearchKeyword] = useState(initialState.searchKeyword);
  const [selectedFilters, setSelectedFilters] = useState(initialState.selectedFilters);
  const [isSuggestionBeenUsed, setSuggestionAsBeenUsed] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionScrollRef = useRef(null);

  const {
    className,
    disabled,
    filtersApplied,
    isFull,
    keyword,
    searchType,
    showSuggestions,
    strings,
    style,
    suggestions,

    onClearClick,
    onFilterClick,
    onLocationClick,
    onSearchClick,
    onSearchTypeChange,
    onSetFiltersOnFirstPageSearch
  } = props;

  // Update Filters Applied from Parent Class
  useEffect(() => {
    setSelectedFilters(() => [...filtersApplied]);
  }, [filtersApplied]);

  useEffect(() => {
    setSearchKeyword(() => keyword);
  }, [keyword]);

  useEffect(() => {
    setFilteredSuggestions(() => [...suggestions]);
  }, [suggestions]);

  useEffect(() => {
    if (searchInputRef && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    toggleSuggestions(false);
  }, [isFull]);

  if (searchType.includes('only')) {
    return null;
  }

  const dateFormat = 'MMM DD, YYYY';
  const searchTypeOptions = [
    { value: 'all', label: strings.allResults },
    { value: 'pages', label: strings.pages },
    { value: 'files', label: strings.files },
    { value: 'stories', label: strings.stories },
  ];

  const toggleHoverOnList = (toggle) => setHoveredOnList(typeof toggle === 'undefined' ? !hoveredOnList : toggle);

  const handleSearchTypeChange = ({ value }) => {
    if (typeof onSearchTypeChange === 'function') {
      onSearchTypeChange(value);
    }
  };

  const handleSearchClick = (event, filters, tmpKeyword) => {
    if (typeof onSearchClick === 'function' && (typeof tmpKeyword !== 'undefined' && tmpKeyword || searchKeyword)) {
      onSearchClick(tmpKeyword || searchKeyword, filters || selectedFilters);
    }
  };

  const handleFilterClick = () => {
    if (typeof onFilterClick === 'function') {
      onFilterClick();
    }
  };

  const handleInputChange = (event) => {
    const value = event.currentTarget.value;
    setSearchKeyword(value);
    if (searchKeyword.trim() !== value.trim()) {
      toggleSuggestions(true);
      setSuggestionAsBeenUsed(false);
    }
    setActiveSuggestionOption(0);

    // Filter suggestions that don't contain the user's input
    const matched = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    setFilteredSuggestions(matched);
  };

  const handleSuggestionClick = (event) => {
    const value = event.currentTarget.dataset.value;
    setSearchKeyword(value);
    setActiveSuggestionOption(0);
    toggleSuggestions(false);
    handleSearchClick(null, null, value);
  };

  const handleInputKeyPress = (event) => {
    let newSearchKeyword = searchKeyword;
    if (event.key === 'Enter' || event.keyCode === 13) {
      if (filteredSuggestions.length > 0 &&  isSuggestionOpen && isSuggestionBeenUsed) {
        setSearchKeyword(filteredSuggestions[activeSuggestionOption]);
        newSearchKeyword = filteredSuggestions[activeSuggestionOption];
        setActiveSuggestionOption(0);
      }
      setSuggestionAsBeenUsed(false);
      toggleSuggestions(false);
      handleSearchClick(null, null, newSearchKeyword);
    }
  };

  const handleInputKeyDown = (event) => {
    switch (event.keyCode) {
      case 38: // up arrow
        if (activeSuggestionOption > 0) {
          setActiveSuggestionOption(activeSuggestionOption - 1);
          if (suggestionScrollRef.current) suggestionScrollRef.current.scrollTop = activeSuggestionOption * 20 - 20;
        }
        toggleHoverOnList(false);
        setSuggestionAsBeenUsed(true);
        break;
      case 40: // down arrow
        toggleHoverOnList(false);
        setSuggestionAsBeenUsed(true);
        if (!isSuggestionOpen) {
          toggleSuggestions(true);
        }

        if (activeSuggestionOption < filteredSuggestions.slice(0, 10).length - 1) {
          setActiveSuggestionOption(activeSuggestionOption + 1);
          if (suggestionScrollRef.current) suggestionScrollRef.current.scrollTop = activeSuggestionOption * 20;
        }
        break;
      case 27: // esc
        toggleSuggestions(false);
        setSuggestionAsBeenUsed(false);
        break;
      default:
        break;
    }
  };

  const handleInputClear = () => {
    setSearchKeyword('');
    setSelectedFilters([]);
    if (searchInputRef && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    setSuggestionAsBeenUsed(false);
    toggleSuggestions(false);
    onClearClick();
  };

  const handleClearFiltersClick = (event) => {
    setSelectedFilters([]);
    toggleFilterModalVisible(false);
    onSetFiltersOnFirstPageSearch([]);

    // Trigger search
    if (!isFull) handleSearchClick(event, []);
  };

  const handleFilterDeleteClick = (event) => {
    const newSelectedFilters = [...selectedFilters];
    const index = event.target.dataset.index;
    newSelectedFilters.splice(index, 1);
    setSelectedFilters(newSelectedFilters);

    onSetFiltersOnFirstPageSearch(newSelectedFilters);

    // Trigger search
    if (!isFull) handleSearchClick(event, newSelectedFilters);
  };

  const handleToggleFilterModal = () => {
    toggleFilterModalVisible(!isFilterModalVisible);
  };

  const toggleDateModifiedModal = () => {
    toggleDateModifiedVisible(!isDateModifiedVisible);
  };

  const handleToggleSuggestion = (toggle) => {
    const isOpened = typeof toggle !== 'undefined' ? toggle : !isSuggestionOpen;

    // Filter suggestions that don't contain the user's input
    if (isOpened) {
      const matched = suggestions.filter(
        suggestion =>
          suggestion.toLowerCase().trim()
            .indexOf(searchKeyword.toLowerCase().trim()) > -1
      );
      setFilteredSuggestions(matched);
    }

    toggleSuggestions(isOpened);
  };

  const handleFiltersChange = (selectedItem, context) => {
    const id = selectedItem.id || selectedItem.value || 0;
    let selectedFilterList = [...selectedFilters];
    const data = {
      ...selectedItem,
      id: id,
      name: selectedItem.name || selectedItem.label,
      type: context.key,
      status: 'active'
    };

    // if multi selection keep previous values
    if (context && !context.isMulti) {
      selectedFilterList = selectedFilterList.filter(i => i.type !== context.key);
    }

    // Remove item when clicking again
    if (selectedFilterList.find(i => i.id === id && i.type === context.key)) {
      selectedFilterList = selectedFilterList.filter(i => !(i.id === id && i.type === context.key));
      // Avoid duplicated items from multi selection
    } else {
      selectedFilterList.push(data);
    }

    setSelectedFilters(selectedFilterList);
    onSetFiltersOnFirstPageSearch(selectedFilterList);
  };

  const handleSetDateFilter = ({ from, to }) => {
    let selectedFilterList = [...selectedFilters];
    const dateFrom = from && moment(from, dateFormat).isValid() ? moment(from).format(dateFormat) : '';
    const dateTo = to && moment(to, dateFormat).isValid() ? `${strings.to} ${moment(to).format(dateFormat)}` : '';
    selectedFilterList = selectedFilterList.filter(i => !(i.type === 'date'));

    if (dateFrom || dateTo) {
      const data = {
        id: 'dateFilter',
        name: `${strings.date}: ${dateFrom} ${dateTo}`,
        type: 'date',
        from: from,
        to: to,
        status: 'active'
      };
      selectedFilterList.push(data);
    }
    setSelectedFilters(selectedFilterList);
    onSetFiltersOnFirstPageSearch(selectedFilterList);
  };

  const styles = require('./PageSearchInput.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    PageSearchInput: true,
    full: isFull
  }, className);

  const renderOptions = context => {
    let defaultClassName = 'VirtualizedSelectOption';
    if (context.option === context.focusedOption) {
      defaultClassName += ' VirtualizedSelectFocusedOption';
    }

    const isChecked = searchType === context.option[context.valueKey];

    const classChecked = cx({
      isChecked: isChecked,
    });

    return (<div
      key={context.labelKey + context.key}
      className={defaultClassName}
      onClick={() => context.selectValue(context.option)}
      onMouseOver={() => context.focusOption(context.option)}
      style={context.style}
    >
      <div className={classChecked}>{context.option.label}</div>
    </div>);
  };

  // Disable search button if there are no input/filters
  const searchButtonDisabled = disabled || !searchKeyword;

  // Limit number of selected filters to display
  let filtersToDisplay = 6;

  // Display less if selected filters have long names
  if (selectedFilters.length && selectedFilters.map(i => i.name).toString().length > 70) {
    filtersToDisplay = 4;
  }

  const selectedFilterNames = selectedFilters.filter(i => i.status !== 'deleted').map(i => {
    const name = i.name || i.label;
    if (i.type === 'channel' && !i.name.includes(`${strings.channel}:`)) {
      return `${strings.channel}: ${name}`;
    }
    return name;
  });
  const filtersDisplayed = selectedFilterNames.slice(0, filtersToDisplay);
  const remainingFilterCount = selectedFilterNames.length - filtersToDisplay;
  const totalFilterSelected = selectedFilterNames.length;

  return (
    <div
      className={classes}
      style={style}
    >
      <header>
        <h3>{strings.whatAreYouLookingFor}</h3>
      </header>

      <div className={styles.inputWrap}>
        {isFull && <Select
          id="searchType"
          name="searchType"
          className={styles.searchType}
          value={searchType || 'all'}
          options={searchTypeOptions}
          optionRenderer={(i) => renderOptions(i)}
          searchable={false}
          clearable={false}
          onChange={handleSearchTypeChange}
        />}

        <div className={styles.suggestionWrapper}>
          <Text
            id="search-input"
            ref={searchInputRef}
            icon="search"
            list="suggestions"
            placeholder={`${strings.startTyping}...`}
            value={searchKeyword}
            disabled={disabled}
            showClear={!!searchKeyword}
            onBlur={() => handleToggleSuggestion(false)}
            onFocus={() => handleToggleSuggestion(true)}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            onKeyDown={handleInputKeyDown}
            onClearClick={handleInputClear}
            className={styles.textInput}
          />
          {showSuggestions && filteredSuggestions.length > 0 && isSuggestionOpen &&
          <div ref={suggestionScrollRef} className={styles.suggestionContainer}>
            <h4>{strings.recentSearches}</h4>
            <ul
              onMouseEnter={() => toggleHoverOnList(true)}
              onMouseMove={() => toggleHoverOnList(true)}
              onMouseLeave={() => toggleHoverOnList(false)}
              className={hoveredOnList ? styles.suggestionList : ''}
            >
              {filteredSuggestions.slice(0, 10).map((term, ix) => (
                <li
                  className={ix === activeSuggestionOption && !hoveredOnList ? styles.activeSuggestion : null}
                  key={term}
                  value={term}
                  data-value={term}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleSuggestionClick}
                >
                  {term}
                </li>
              ))}
            </ul>
          </div>
          }
        </div>

        <div className={styles.buttonWrap}>
          <Btn
            large
            inverted
            disabled={searchButtonDisabled}
            onClick={handleSearchClick}
            className={styles.searchButton}
          >
            {strings.search}
          </Btn>
          {!isFull && <Btn
            large
            alt
            disabled={searchButtonDisabled}
            onClick={handleFilterClick}
            className={styles.searchButton}
          >
            {strings.filters} {totalFilterSelected ? `(${totalFilterSelected})` : ''}
          </Btn>}
        </div>
      </div>

      <div className={styles.selectedFilters}>
        <Tags
          list={filtersDisplayed}
          className={styles.tags}
          onItemDeleteClick={handleFilterDeleteClick}
        >
          {remainingFilterCount > 0 && <li
            className={styles.remainingCountItem}
            onClick={handleToggleFilterModal}
          >
            <span>+ {remainingFilterCount}</span>
          </li>}
          {selectedFilters.length > 0 && <li className={styles.clearFiltersItem}>
            <Btn
              className={styles.clearFiltersBtn}
              onClick={handleClearFiltersClick}
            >
              {strings.resetAllFilters}
            </Btn>
          </li>}
        </Tags>
      </div>

      {isFull && <div className={styles.filterWrap}>
        <h4>{strings.filters}</h4>
        <SearchFilters
          fileSize={selectedFilters.filter(i => i.type === 'fileSize')}
          fileType={selectedFilters.filter(i => i.type === 'fileType')}
          searchWithIn={selectedFilters.filter(i => i.type === 'searchWithIn')}
          selectedFilters={selectedFilters}
          showFileFilters={searchType !== 'stories'}
          onSelectChange={handleFiltersChange}
          onDateModifiedClick={toggleDateModifiedModal}
          onLocationClick={onLocationClick}
          {...{ searchType }}
        />
      </div>}

      {isFull && isDateModifiedVisible && <DateModalPicker
        dates={selectedFilters.filter(i => i.type === 'date')}
        onToggleModal={toggleDateModifiedModal}
        onSetDate={handleSetDateFilter}
      />}

      <Modal
        isVisible={isFilterModalVisible}
        backdropClosesModal
        escClosesModal
        headerTitle={strings.filtersSelected}
        headerClassName={styles.modalHeader}
        onClose={handleToggleFilterModal}
        footerChildren={(<div className={styles.footerWrapper}>
          <Btn
            large
            borderless
            inverted
            className={styles.modalClose}
            onClick={handleToggleFilterModal}
          >
            {strings.close}
          </Btn>
        </div>)}
      >
        <div className={styles.filterModalBody}>
          <Tags
            list={selectedFilterNames}
            className={styles.tagsForModal}
            onItemDeleteClick={handleFilterDeleteClick}
          />
          {selectedFilterNames.length > 0 && <div className={styles.clearFiltersItem}>
            <Btn
              className={styles.clearFiltersBtn}
              onClick={handleClearFiltersClick}
            >
              {strings.resetAllFilters}
            </Btn>
            </div> || <span>No filters selected</span>}
        </div>
      </Modal>
    </div>
  );
};

PageSearchInput.propTypes = {
  /** Disable inputs/events */
  disabled: PropTypes.bool,

  /** Initial search input value */
  keyword: PropTypes.string,

  searchType: PropTypes.oneOf(['all', 'pages', 'files', 'stories']),

  onClearClick: PropTypes.func,
  onLocationClick: PropTypes.func,
  onSearchClick: PropTypes.func,
  onSearchTypeChange: PropTypes.func,
  onSetFiltersOnFirstPageSearch: PropTypes.func
};

PageSearchInput.defaultProps = {
  keyword: '',
  locations: [],
  isFull: true,
  searchType: 'all',
  suggestions: [],
  disabled: false,
  showSuggestions: true,

  strings: {
    close: 'Close',
    search: 'Search',
    allResults: 'All Results',
    pages: 'Pages',
    files: 'Files',
    stories: 'Stories',
    startTyping: 'Start Typing',
    filters: 'Filters',
    filtersSelected: 'Filters Selected',
    whatAreYouLookingFor: 'What are you looking for?',
    resetAllFilters: 'Reset All Filters',
    to: 'To',
    from: 'From',
    date: 'Date',
    channel: 'Channel',
    recentSearches: 'Recent Searches',
  }
};

export default PageSearchInput;
