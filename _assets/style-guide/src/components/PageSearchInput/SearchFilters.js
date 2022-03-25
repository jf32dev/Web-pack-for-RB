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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Select from 'components/Select/Select';
import getSearchFilterOptions from 'helpers/getSearchFilterOptions';

const SearchFilters = props => {
  const {
    fileSize,
    fileType,
    searchWithIn,
    searchType,
    showFileFilters,

    strings,
    className,

    onDateModifiedClick,
    onLocationClick,
    onSelectChange,
  } = props;

  const styles = require('./SearchFilters.less');
  const cx = classNames.bind(styles);

  let searchWithInOptions = getSearchFilterOptions({ strings }).searchWithInOptions;
  if (searchType === 'files' || searchType === 'pages') {
    searchWithInOptions = searchWithInOptions.filter(i => i.for === 'files' || i.for === 'all').map(i => ({ ...i, label: i.fileLabel || i.label }));
  } else if (searchType === 'stories') {
    searchWithInOptions = searchWithInOptions.filter(i => i.for === 'stories' || i.for === 'all');
  }

  const fileTypeOptions = getSearchFilterOptions({ strings }).fileTypeOptions;
  const fileSizeOptions = getSearchFilterOptions({ strings }).fileSizeOptions;

  const handleSelectChange = (selectedItem, context) => {
    if (typeof onSelectChange === 'function') {
      onSelectChange(selectedItem, context);
    }
  };

  const renderOptions = (context, type) => {
    let defaultClassName = 'VirtualizedSelectOption';
    if (context.option === context.focusedOption) {
      defaultClassName += ' VirtualizedSelectFocusedOption';
    }
    const isChecked = !!props[type].length > 0 && props[type].find(i => i.id === context.option[context.valueKey]);

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
      <div className={classChecked}>{context.option.label || context.option.name}</div>
    </div>);
  };

  const classes = cx({
    SearchFilter: true,
  }, className);

  return (
    <div className={classes}>
      <Select
        className={styles.dropdownMenu}
        clearable={false}
        id="searchWithIn"
        name="searchWithIn"
        options={showFileFilters ? searchWithInOptions : searchWithInOptions.filter(i => i.for !== 'files')}
        optionRenderer={(i) => renderOptions(i, 'searchWithIn')}
        placeholder={strings.displayResultsMatching}
        searchable={false}
        value={searchWithIn[0]}
        valueRenderer={() => <span>{strings.displayResultsMatching}</span>}
        onChange={(item) => handleSelectChange(item, { key: 'searchWithIn' })}
        style={{ minWidth: '12.5rem' }}
      />

      <Btn
        icon="folder"
        className={styles.customBtn}
        onClick={onLocationClick}
      >
        {strings.location}...
      </Btn>

      <Btn
        icon="calendar"
        className={styles.customBtn}
        onClick={onDateModifiedClick}
      >
        {strings.dateModified}...
      </Btn>

      {showFileFilters && <Select
        className={styles.dropdownMenu}
        clearable={false}
        id="fileType"
        labelKey="name"
        name="fileType"
        options={fileTypeOptions}
        optionRenderer={(i) => renderOptions(i, 'fileType')}
        placeholder={strings.fileType}
        searchable={false}
        style={{ maxWidth: '12rem' }}
        value={fileType[0]}
        valueKey="id"
        valueRenderer={() => <span>{strings.fileType}</span>}
        onChange={(item) => handleSelectChange(item, { key: 'fileType', isMulti: true })}
      />}

      {showFileFilters && <Select
        className={styles.dropdownMenu}
        clearable={false}
        id="fileSize"
        name="fileSize"
        options={fileSizeOptions}
        optionRenderer={(i) => renderOptions(i, 'fileSize')}
        placeholder={strings.fileSize}
        searchable={false}
        style={{ maxWidth: '12rem' }}
        value={fileSize[0]}
        valueRenderer={() => <span>{strings.fileSize}</span>}
        onChange={(item) => handleSelectChange(item, { key: 'fileSize' })}
      />}
    </div>
  );
};

SearchFilters.propTypes = {
  fileSize: PropTypes.array,
  fileType: PropTypes.array,
  searchWithIn: PropTypes.array,
  showFileFilters: PropTypes.bool,

  onDateModifiedClick: PropTypes.func,
  onLocationClick: PropTypes.func,
  onSelectChange: PropTypes.func,

  className: PropTypes.string,
  style: PropTypes.object
};

SearchFilters.defaultProps = {
  showFileFilters: true,
  strings: {
    all: 'All',
    title: 'Title',
    content: 'Content',
    dateModified: 'Date Modified',
    description: 'Description',
    tags: 'Tags',
    displayResultsMatching: 'Display Results Matching',
    fileName: 'File Name',
    fileType: 'File Type',
    fileSize: 'File Size',
    location: 'Location',
  }
};

export default SearchFilters;
