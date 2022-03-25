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

import React from 'react';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import Tags from 'components/Tags/Tags';
import classNames from 'classnames/bind';

import PageSearchFileItem from 'components/PageSearchFileItem/PageSearchFileItem';
import PageSearchStoryItem from 'components/PageSearchStoryItem/PageSearchStoryItem';
import { FormattedMessage } from 'react-intl';

export function TagListModal({
  isFilterModalVisible,
  selectedFilterNames,
  strings,
  styles,
  handleClearFiltersClick,
  handleFilterDeleteClick,
  handleToggleFilterModal
}) {
  return (
    <Modal
      isVisible={isFilterModalVisible}
      backdropClosesModal
      escClosesModal
      headerTitle={strings.locationsSelected}
      headerClassName={styles.modalHeader}
      onClose={handleToggleFilterModal}
      footerChildren={(<div className={styles.footerWrapper}>
        <Btn
          inverted
          large
          className={styles.modalClose}
          onClick={handleToggleFilterModal}
        >
          {strings.close}
        </Btn>
      </div>)}
    >
      <div className={styles.selectedFilters} style={{ padding: '1rem 1.5rem' }}>
        <Tags
          list={selectedFilterNames}
          className={styles.tagsForModal}
          onItemDeleteClick={handleFilterDeleteClick}
        />
        <div className={styles.clearFiltersItem}>
          <Btn
            className={styles.clearFiltersBtn}
            onClick={handleClearFiltersClick}
          >
            {strings.resetAll}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

export function ListCheckboxes({
  list,
  selectedItems,
  styles,
  type,

  keyName,
  keyValue,

  onCheckboxChange
}) {
  const cx = classNames.bind(styles);

  return (
    <div className={styles.optionListContainer}>
      {list.map((item, ix) => {
        const isChecked = !!selectedItems.find(i => String(i) === String(item[keyValue]));
        const checkboxesClasses = cx({
          CustomCheckboxes: true,
          isChecked: isChecked
        });

        return (<Checkbox
          key={ix}
          label={item[keyName]}
          name={type}
          value={item[keyValue]}
          checked={isChecked}
          className={checkboxesClasses}
          onChange={(e) => onCheckboxChange(e, type)}
        />);
      })}
    </div>
  );
}

export function PageEditSelectMenu({
  allPagesAddedToPB,
  imageMatches,
  selectMode,
  selectedBlocks,
  selectedStackItem,
  strings,
  styles,
  textMatches,
  isVisible,

  onAddSelectedToCanvasClick,
  onClearSelectionClick,
  onSelectAllClick,
  onToggleSelectClick
}) {
  if (!isVisible) return null;

  const cx = classNames.bind(styles);

  return (
    <div className={styles.openStack}>
      {selectMode && <header>
        <div className={styles.editModeHeader}>
          <FormattedMessage
            id="n-pages-selected"
            defaultMessage="{itemCount, plural, one {# Page} other {# Pages}} Selected"
            values={{ itemCount: selectedBlocks.length }}
          />
          <Btn
            warning
            inverted
            disabled={!selectedBlocks.length}
            className={styles.cancelBtn}
            onClick={onClearSelectionClick}
          >
            {strings.clearSelection}
          </Btn>
          <Btn
            disabled={selectedBlocks.length === (imageMatches.length + textMatches.length)}
            className={styles.selectAllBtn}
            onClick={onSelectAllClick}
          >
            {strings.selectAll}
          </Btn>
        </div>

        <div>
          <Btn
            inverted
            disabled={!selectedBlocks.length}
            onClick={onAddSelectedToCanvasClick}
          >
            {strings.addToCanvas}
          </Btn>
          <Btn alt onClick={onToggleSelectClick}>{strings.cancel}</Btn>
        </div>
      </header>}

      {(!selectMode && selectedStackItem) && <header>
        <h3>{selectedStackItem.description}</h3>
        <div>
          {/* Add-all will be disabled if all pages from the selected stack are currently on the PB. */}
          <Btn
            icon="canvas-add"
            small
            borderless
            onClick={() => onAddSelectedToCanvasClick({ action: 'addAll' })}
            className={cx({ addAllButton: true, disabled: allPagesAddedToPB })}
            disabled={allPagesAddedToPB}
          >
            {strings.addAllToPitchBuilder}
          </Btn>
          <Btn
            inverted
            // disabled if all pages from the selected stack are currently on the PB
            disabled={allPagesAddedToPB}
            className={styles.selectBtn}
            onClick={onToggleSelectClick}
          >
            {strings.select}
          </Btn>
        </div>
      </header>}
    </div>
  );
}

export function SearchListing({
  isGrid,
  list,
  title,
  selectedBlocks,
  showBlankslate,
  showPaging,
  showViewAll,
  showStack,
  stackItem,
  onViewAllClick,
  totalResultText,
  styles,
  strings,
  itemComponent,
  itemProps,
  headerIcon,

  onScroll,
  ...actions
}) {
  const renderItem = (item, ix) => {
    let Comp = itemComponent;
    if (!Comp) {
      switch (item.type) {
        case 'page':
          Comp = PageSearchFileItem;
          break;
        case 'file':
          Comp = PageSearchFileItem;
          break;
        case 'story':
          Comp = PageSearchStoryItem;
          break;
        default:
          break;
      }

      if (!Comp) {
        return (
          <div style={{ marginBottom: '1rem' }}>
            <code>{JSON.stringify(item)}</code>
          </div>
        );
      }
    }
    let isChecked = false;
    if (selectedBlocks && selectedBlocks.length > 0 && item.matchedBlocks && item.matchedBlocks[0]) {
      isChecked = !!selectedBlocks.includes(item.matchedBlocks[0].id);
    }

    return (
      <Comp
        key={`${item.id} ${ix}`}
        grid={!!isGrid}
        inList
        {...item}
        {...itemProps}
        {...{
          showStack,
          isChecked,
          strings,
          stackItem
        }}
        {...actions}
      />
    );
  };

  return (
    <React.Fragment>
      {!stackItem && (showBlankslate || list.length > 0) && <header>
        <div className={styles.headerWrapper}>
          <h4>{title}</h4>
          {headerIcon}
        </div>
        {showPaging && <div>
          {totalResultText}

          {showViewAll && <a
            title={strings.viewAll}
            onClick={onViewAllClick}
            className={styles.viewAll}
          >
            {strings.viewAll}
          </a>}
        </div>}
      </header>}

      {showBlankslate && list.length === 0 && <div className={styles.emptyWrapper}>
        <Blankslate
          icon="content"
          heading={strings.emptyBlockSearchTitle}
          message={strings.emptyBlockSearchMessage}
        />
      </div>}

      {list.length > 0 && <div className={styles.list} onScroll={onScroll}>
        {list.map((item, ix) => renderItem(item, ix))}
      </div>}
    </React.Fragment>
  );
}
