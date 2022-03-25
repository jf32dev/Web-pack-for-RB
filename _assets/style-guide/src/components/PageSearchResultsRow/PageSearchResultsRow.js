/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * This component is used for rendering all the navigation tabs on <PageSearch />
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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincancom>
 */

import React from 'react';

import Select from 'components/Select/Select';

import TabNavLink from './TabNavLink';

const PageSearchResultsRow = ({
  isVisible,
  styles,
  searchTypeSelected,
  onHandleNavMenuClick,
  totalFilesCount,
  totalStoriesCount,
  strings,
  sortBy,
  onHandleSortChange,
  nameSortOrder,
  lastModifiedSortOrder
}) => {
  if (!isVisible) return null;

  const renderOptions = (context, checkedClass, sortAscending, sortDescending) => {
    let defaultClassName = 'VirtualizedSelectOption';
    if (context.option === context.focusedOption) {
      defaultClassName += ' VirtualizedSelectFocusedOption';
    }

    let selectedClass = null;

    if (sortBy === context.option[context.valueKey]) {
      if (context.option.label === 'Relevance') {
        selectedClass = checkedClass;
      } else if (context.option.label === 'Name') {
        selectedClass = nameSortOrder === 'asc' ? sortAscending : sortDescending;
      } else if (context.option.label === 'Last Modified') {
        selectedClass = lastModifiedSortOrder === 'asc' ? sortAscending : sortDescending;
      }
    }

    return (<div
      key={context.labelKey + context.key}
      className={defaultClassName}
      onClick={() => context.selectValue(context.option)}
      onMouseOver={() => context.focusOption(context.option)}
      style={context.style}
    >
      <div className={selectedClass}>{context.option.label}</div>
    </div>);
  };

  const TABS = [
    { type: 'all', to: '#all', label: strings.allResults  },
    { type: 'pages', to: '#pages', label: strings.pages },
    { type: 'files', to: '#fList', label: strings.files, count: totalFilesCount },
    { type: 'stories', to: 'sList', label: strings.stories, count: totalStoriesCount }
  ];

  return (<div className={styles.resultsRow}>
    <nav className="horizontal-nav">
      <ul>
        {TABS.map(({ type, label, count, to }) => (
          <TabNavLink
            key={type}
            to={to}
            isActive={() => searchTypeSelected === type}
            onClick={e => onHandleNavMenuClick(e, type)}
            label={label}
            count={count}
          />
        ))}
      </ul>
    </nav>

    <Select
      id="sortBy"
      name="sortBy"
      label={`${strings.sortBy}:`}
      value={sortBy}
      options={[{
        value: '',
        label: strings.relevance
      }, {
        value: 'name',
        label: strings.name
      }, {
        value: 'updated_at',
        label: strings.lastModified,
      }]}
      clearable={false}
      searchable={false}
      className={styles.sortBy}
      optionRenderer={i => renderOptions(i, styles.isChecked, styles.sortAscending, styles.sortDescending)}
      onChange={onHandleSortChange}
    />
  </div>);
};

export default PageSearchResultsRow;
