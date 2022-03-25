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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import uniqBy from 'lodash/uniqBy';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Combokeys from 'combokeys';
import Transition from 'react-transition-group/Transition';

import Accordion from 'components/Accordion/Accordion';
import Btn from 'components/Btn/Btn';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';
import getSearchFilterOptions from 'helpers/getSearchFilterOptions';
import Tags from 'components/Tags/Tags';

import {
  ListCheckboxes,
  TagListModal
} from 'helpers/filterHelpers';

import {
  useFilterChange,
  useDateChange,
} from 'helpers/filterHooks';

const PageSearchFilter = props => {
  const {
    backdropClosesModal,
    dates,
    escClosesModal,
    filtersApplied,
    selectedChannelsForFilterModal,
    isVisible,
    searchType,
    showFileFilters,

    className,
    strings,

    onApplyFilters,
    onClose,
    onLocationClick,
    onResetAllFilters
  } = props;

  const overlayRef = useRef(null);
  const [dateFrom, dateTo, setDateFrom, setDateTo, handleDateChange] = useDateChange();
  const [matchinResultSelected, fileSizeSelected, fileTypeSelected, handleCheckboxChange, handleUpdateValues] = useFilterChange();
  const [isOpenDateAccordion, setDateAccordionToggle] = useState(false);
  const [isFilterModalVisible, toggleFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  let searchWithInOptions = getSearchFilterOptions({ strings }).searchWithInOptions;
  if (searchType === 'files' || searchType === 'pages') {
    searchWithInOptions = searchWithInOptions.filter(i => i.for === 'files' || i.for === 'all').map(i => ({ ...i, label: i.fileLabel || i.label }));
  } else if (searchType === 'stories') {
    searchWithInOptions = searchWithInOptions.filter(i => i.for === 'stories' || i.for === 'all');
  }

  const fileTypeOptions = getSearchFilterOptions({ strings }).fileTypeOptions;
  const fileSizeOptions = getSearchFilterOptions({ strings }).fileSizeOptions;

  const styles = require('./PageSearchFilter.less');
  const cx = classNames.bind(styles);

  const classes = cx({
    Container: true
  }, className);

  const dateAccordionClasses = cx({
    DateAccordion: true,
    isOpenAccordion: !!isOpenDateAccordion
  }, className);

  const handleClose = (data) => {
    if (typeof onClose === 'function') {
      onClose(data);
    }
  };

  const handleShortcut = (event) => {
    if (event.keyCode === 27 && isVisible && escClosesModal) {
      handleClose();
    }
  };

  let combokeys;
  // Attached ESC close modal event
  useEffect(() => {
    if (escClosesModal) {
      combokeys = new Combokeys(document.documentElement);
      combokeys.bind(['esc'], handleShortcut);
    }

    return () => { combokeys.detach(); };
  });

  // Update Filters Applied from Parent Class
  useEffect(() => {
    const filterList = [];
    let selectedFilterList = [...selectedFilters];

    filtersApplied.map((item) => {
      if (!selectedFilterList.find(i => i.id === item.id && i.type === item.type)) {
        switch (item.type) {
          case 'searchWithIn':
          case 'fileSize':
            // remove any other item same type
            selectedFilterList = selectedFilterList.filter(i => i.type !== item.type);
            break;
          case 'fileType':
            break;
          case 'date':
            if (item.to) {
              setDateTo(item.to);
            }
            if (item.from) {
              setDateFrom(item.from);
            }
            break;
          default:
            break;
        }

        const data = {
          ...item,
          id: item.id,
          name: item.type === 'channel' && item.name.indexOf(`${strings.channel}:`) === -1 ? `${strings.channel}: ${item.name}` : item.name,
          type: item.type,
          status: 'active'
        };
        filterList.push(data);
        handleUpdateValues(data.id, item.type);
      }
      return true;
    });

    if (filterList.length) {
      selectedFilterList = [...selectedFilterList, ...filterList];
    } else if (selectedChannelsForFilterModal.clearAll) {
      const otherSelectedFilters = [...selectedFilters.filter(i => i.type !== 'channel')];
      selectedFilterList = [...otherSelectedFilters];
    } else if (selectedChannelsForFilterModal.channelList.length > 0) {
      const selectedChannelsForPageSearchFilterModal = selectedChannelsForFilterModal.channelList.map(item => ({
        ...item,
        name: item.name.indexOf(`${strings.channel}:`) === -1 ? `${strings.channel}: ${item.name}` : item.name,
        type: item.type,
        status: 'active'
      }));

      const initialSelectedChannels = [...selectedFilters.filter(i => i.type === 'channel')];
      const otherSelectedFilters = [...selectedFilters.filter(i => i.type !== 'channel')];
      const uniqueUpdatedChannels = uniqBy([...initialSelectedChannels, ...selectedChannelsForPageSearchFilterModal], 'id');

      selectedFilterList = [...otherSelectedFilters, ...uniqueUpdatedChannels];
    }
    setSelectedFilters(() => [...selectedFilterList]);
  }, [filtersApplied, selectedChannelsForFilterModal]);

  // Update properties passed
  useEffect(() => {
    if (dates[0] && dates[0].to) {
      setDateTo(dates[0].to);
    }
    if (dates[0] && dates[0].from) {
      setDateFrom(dates[0].from);
    }
  }, []);

  const handleDialogClick = (e) => {
    if (backdropClosesModal) {
      e.stopPropagation();
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (backdropClosesModal) {
      handleClose();
    }
  };

  const handleClearFiltersClick = () => {
    setSelectedFilters([]);
    toggleFilterModalVisible(false);
  };

  const handleFilterDeleteClick = (event) => {
    const indexToDelete = event.target.dataset.index;

    const SelectedChannelsFilters = [...selectedFilters.filter(i => i.type === 'channel')];
    const updatedSelectedChannelsFilters = [...SelectedChannelsFilters.filter((item, index) => index !== parseInt(indexToDelete, 10))];
    const otherSelectedFilters = [...selectedFilters.filter(i => i.type !== 'channel')];

    setSelectedFilters([...otherSelectedFilters, ...updatedSelectedChannelsFilters]);
  };

  const handleApplyFilters = () => {
    const channelList = selectedFilters.filter(i => i.type === 'channel');
    const dateFormat = 'MMM DD, YYYY';
    const from = dateFrom ? moment(dateFrom).format(dateFormat) : '';
    const to = dateTo ? `${strings.to} ${moment(dateTo).format(dateFormat)}` : '';
    const date = {
      id: 'dateFilter',
      name: `${strings.date}: ${from} ${to}`,
      type: 'date',
      from: dateFrom,
      to: dateTo
    };
    const searchWithIn = searchWithInOptions
      .filter(i => matchinResultSelected.includes(i.value))
      .map(i => ({ id: i.value, name: i.label, type: 'searchWithIn' }));

    const fileType = fileTypeOptions
      .filter(i => fileTypeSelected.includes(String(i.id)))
      .map(i => ({ id: i.id, name: i.name, type: 'fileType' }));

    const fileSize = fileSizeOptions
      .filter(i => fileSizeSelected.includes(String(i.value)))
      .map(i => ({
        ...i,
        id: i.value,
        name: i.label,
        type: 'fileSize'
      }));

    const tempData = [
      ...searchWithIn,
      ...channelList,
      ...fileType,
      ...fileSize,
    ];

    if (dateFrom || dateTo) tempData.push(date);

    setSelectedFilters(tempData);
    onApplyFilters(tempData);
    handleClose();
  };

  const handleToggleFilterModal = () => {
    toggleFilterModalVisible(!isFilterModalVisible);
  };

  // Search Tags filters selected
  // Limit number of selected filters to display
  let filtersToDisplay = 6;

  // Display less if selected filters have long names
  if (selectedFilters.length && selectedFilters.map(i => i.name).toString().length > 70) {
    filtersToDisplay = 4;
  }

  const selectedFilterNames = selectedFilters.filter(i => i.type === 'channel' && i.status !== 'deleted').map(i => i.name);
  const filtersDisplayed = selectedFilterNames.slice(0, filtersToDisplay);
  const remainingFilterCount = selectedFilterNames.length - filtersToDisplay;

  const renderBody = () => (
    <div className={styles.filterBody}>
      <Accordion
        title={strings.displayResultsMatching}
      >
        <ListCheckboxes
          list={searchWithInOptions}
          options={showFileFilters ? searchWithInOptions : searchWithInOptions.filter(i => i.for !== 'files')}
          selectedItems={matchinResultSelected}
          onCheckboxChange={handleCheckboxChange}
          keyName="label"
          keyValue="value"
          type="searchWithIn"
          {...{ styles }}
        />
      </Accordion>
      <Accordion
        title={strings.location}
      >
        <Btn
          className={styles.selectLocationBtn}
          onClick={onLocationClick}
        >
          {strings.select} {strings.location}...
        </Btn>

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
          </Tags>
        </div>
      </Accordion>
      <Accordion
        title={strings.dateModified}
        className={dateAccordionClasses}
        onToggle={(isOpen) => {
          setDateAccordionToggle(isOpen);
        }}
      >
        <div>
          <label htmlFor="from">{strings.from}</label>
          {dateFrom && <span className={styles.selectClearZone}><span className={styles.selectClear} onClick={() => handleDateChange(null, 'from')} /></span>}
          <DateTimePicker
            id="from"
            className={styles.dateTimePicker}
            datetime={dateFrom}
            tz={null}
            placeholder={`${strings.selectDate}...`}
            max={new Date()}
            format="DD MMM YYYY"
            showTime={false}
            showTz={false}
            onChange={(date) => handleDateChange(date, 'from')}
          />
        </div>
        <div>
          <label htmlFor="to">{strings.to}</label>
          {dateTo && <span className={styles.selectClearZone}><span className={styles.selectClear} onClick={() => handleDateChange(null, 'to')} /></span>}
          <DateTimePicker
            id="to"
            datetime={dateTo}
            tz={null}
            placeholder={`${strings.selectDate}...`}
            max={new Date()}
            format="DD MMM YYYY"
            showTime={false}
            showTz={false}
            onChange={(date) => handleDateChange(date, 'to')}
          />
        </div>
      </Accordion>
      {searchType !== 'stories' && <Accordion title={strings.fileType}>
        <ListCheckboxes
          list={fileTypeOptions}
          selectedItems={fileTypeSelected}
          onCheckboxChange={handleCheckboxChange}
          keyName="name"
          keyValue="id"
          type="fileType"
          {...{ styles }}
        />
      </Accordion>}
      {searchType !== 'stories' && <Accordion title={strings.fileSize}>
        <ListCheckboxes
          list={fileSizeOptions}
          selectedItems={fileSizeSelected}
          onCheckboxChange={handleCheckboxChange}
          keyName="label"
          keyValue="value"
          type="fileSize"
          {...{ styles }}
        />
      </Accordion>}
    </div>
  );

  const renderFilterLayout = () => (
    <div
      className={styles.PageSearchFilter}
      onClick={handleDialogClick}
    >
      <div className={styles.filterContent}>
        <header>
          <h3>{strings.filters}</h3>
          <span
            className={styles.close}
            onClick={onClose}
          />
        </header>
        {renderBody()}
        <div className={styles.footer}>
          <Btn
            large
            alt
            className={styles.customBtn}
            disabled={!(filtersApplied.length || selectedFilters.length || matchinResultSelected.length || dateFrom || dateTo || fileSizeSelected.length || fileTypeSelected.length)}
            onClick={onResetAllFilters}
          >
            {strings.resetAll}
          </Btn>
          <Btn
            inverted
            large
            className={styles.customBtn}
            disabled={!(filtersApplied.length || selectedFilters.length || matchinResultSelected.length || dateFrom || dateTo || fileSizeSelected.length || fileTypeSelected.length)}
            onClick={handleApplyFilters}
          >
            {strings.applyFilters}
          </Btn>
        </div>
      </div>

      <TagListModal
        {...{
          isFilterModalVisible,
          selectedFilterNames,
          strings,
          styles,
          handleClearFiltersClick,
          handleFilterDeleteClick,
          handleToggleFilterModal
        }}
      />
    </div>
  );

  return (
    <Transition
      in={isVisible}
      timeout={{
        enter: 0,
        exit: 150
      }}
      appear
      mountOnEnter
      unmountOnExit
    >
      {(status) => (
        <div
          ref={overlayRef}
          className={`Filter-${status} ${classes}`}
          onClick={handleOverlayClick}
        >
          {renderFilterLayout(status)}
        </div>
      )}
    </Transition>
  );
};

PageSearchFilter.propTypes = {
  /** clicking backdrop will dismiss modal */
  backdropClosesModal: PropTypes.bool,

  /** ESC key will dismiss modal */
  escClosesModal: PropTypes.bool,

  className: PropTypes.string,
  style: PropTypes.object,

  onApplyFilters: PropTypes.func,
  onClick: PropTypes.func,
  onResetAllFilters: PropTypes.func,
};

PageSearchFilter.defaultProps = {
  authString: '',
  dates: [],
  locations: [],
  strings: {
    all: 'All',
    title: 'Title',
    content: 'Content',
    description: 'Description',
    tags: 'Tags',
    filters: 'Filters',
    applyFilters: 'Apply Filters',
    resetAll: 'Reset All',
    resetAllFilters: 'Reset All Filters',
    select: 'Select',
    from: 'From',
    to: 'To',
    selectDate: 'Select Date',
    displayResultsMatching: 'Display Results Matching',
    location: 'Location',
    dateModified: 'Date Modified',
    fileType: 'File Type',
    fileSize: 'File Size',
    channel: 'Channel',
    filtersSelected: 'Filters Selected',
    locationsSelected: 'Locations Selected',
    close: 'Close',
    date: 'Date',
  }
};

export default PageSearchFilter;
