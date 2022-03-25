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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincancom>
*/

import React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import _get from 'lodash/get';
import mapFiles from 'helpers/pageSearch';

import PageSearchResultListHeader from 'components/PageSearchResultListHeader/PageSearchResultListHeader';
import PageSearchFileItem from 'components/PageSearchFileItem/PageSearchFileItem';
import PageSearchStoryItem from 'components/PageSearchStoryItem/PageSearchStoryItem';
import Icon from 'components/Icon/Icon';

import styles from './PageSearchResultList.less';

const MAX_RESULTS_IN_LIST = 6;

const PageSearchResultList = ({
  searchTypeSelected,
  selectedStackId,
  files,
  selectedBlocks,
  userCapabilities,
  selectMode,
  fileSettings,
  totalFilesCount,
  totalStoriesCount,
  stories,
  type,
  slidesById,
  blocksById,
  naming,
  strings,
  setReferrerPath,
  onViewAllClick,
  authString,
  setData,
  onActionClick: handleActionClick,
  onStoryActionClick: handleStoryActionClick,
  generateThumbnails
}) => {
  const totalFiles = parseInt(totalFilesCount, 10) || files.length;
  const totalStories = parseInt(totalStoriesCount, 10) || stories.length;
  let selectedStackItem = null;
  const filesWithMatchedBlocks = [];

  const isChecked = (item) => {
    if (selectedBlocks && selectedBlocks.length > 0 && item.matchedBlocks && item.matchedBlocks[0]) {
      return !!selectedBlocks.includes(item.matchedBlocks[0].id);
    }
    return false;
  };


  /**
   * This function manupilates supersearch.files or supersearch.stories to generate the list of results for displaying
   * @function getDisplayList
   * @returns {Array} display list of pages, files, or stoires
   */
  const getDisplayList = () => {
    //#region - generate pages or files list
    if (type === 'pages' || type === 'files') {
      const allPageResults = Object.keys(slidesById).filter(sid => !slidesById[sid].deleted).map(sid => slidesById[sid].blocks).flat();
      const mappedFiles = mapFiles(files, allPageResults, blocksById);
      mappedFiles.forEach(f => {
        if (f.matchedBlocks.length) {
          filesWithMatchedBlocks.push(f);
        }
      });
      if (type === 'files') {
        return mappedFiles.map(item => {
        // Checks if highlighted text is within excerpt or in matchBlocks
          const highlight = item.matchedBlocks.length && item.matchedBlocks[0].highlight;
          return {
            ...item,
            excerpt: (highlight && highlight.indexOf('<mark>') >= 0) &&
          (item.excerpt && item.excerpt.indexOf('<mark>') <= 0 || !item.excerpt) ? highlight : item.excerpt
          };
        });
      }
      if (type === 'pages') {
        // Selected Stack
        const textMatches = [];
        let pageList = filesWithMatchedBlocks.slice(0, searchTypeSelected === 'all' ? 6 : 100);
        if (selectedStackId) {
          // Filter match types
          selectedStackItem = filesWithMatchedBlocks.find(f => f.id === selectedStackId);
          if (selectedStackItem) {
            selectedStackItem.matchedBlocks.forEach(m => {
              let highlight = m.highlight.replace(/\s+/g, ' ').trim();

              // Remove initial 6 words if excerpt is too long for PAGES UI so  highlighted term is shown
              if (highlight.toLowerCase().indexOf('<mark>') > this.limitExcerptCharacters) {
                highlight = highlight.split(' ').slice(6).join(' ');
              }

              // Currently all matches are textMatches
              // image and video to follow
              textMatches.push({
                ...selectedStackItem,
                excerpt: highlight || selectedStackItem.excerpt.replace(/\s+/g, ' ').trim(),
                matchedBlocks: [m]
              });
            });

            // Sort by page
            textMatches.sort((a, b) => a.matchedBlocks[0].page - b.matchedBlocks[0].page);
          }

          pageList = textMatches;
        } else {
          const list = [...pageList];
          pageList = list.map(item => {
            let highlight = item.matchedBlocks.length && item.matchedBlocks[0].highlight.replace(/\s+/g, ' ').trim();

            // Checks if highlighted text is within excerpt or in matchBlocks
            highlight = (highlight && highlight.indexOf('<mark>') >= 0) &&
           (item.excerpt && item.excerpt.indexOf('<mark>') <= 0 || !item.excerpt) ? highlight : (item.excerpt && item.excerpt.replace(/\s+/g, ' ').trim());

            // Remove initial 6 words if excerpt is too long for PAGES UI so  highlighted term is shown
            if (highlight && highlight.indexOf('<mark>') > this.limitExcerptCharacters) {
              highlight = highlight.split(' ').slice(6).join(' ');
            }

            return {
              ...item,
              excerpt: highlight
            };
          });
        }
        return pageList;
      }
    }
    //#endregion

    // generate stories list
    if (type === 'stories') return stories.slice(0, searchTypeSelected === 'all' ? 6 : stories.length);

    // type NOT IN ['pages', 'files', 'stories'] return empty array
    return [];
  };

  /**
   * This function generate headerIcon according to props.type
   * @returns {JSX || undefined} <Icon /> or undefined
   */
  const headerIcon = () => {
    if (type === 'pages') return <span aria-label={strings.pageInfoLabel} className={styles.infoIcon}><Icon name="info" /></span>;
    return undefined;
  };
  const displayList = getDisplayList();

  const handleOnViewAllClick = (e) => {
    e.preventDefault();
    onViewAllClick(e, type);
  };


  const handlePageCheckedChange = (checked, id) => {
    const newSelected = [...selectedBlocks];

    if (checked) {
      newSelected.push(id);
    } else {
      const i = newSelected.findIndex(b => b === id);
      newSelected.splice(i, 1);
    }

    setData({
      selectedBlocks: newSelected
    });
  };

  const handleOnClick = (e, context, storyContext) => {
    if (type === 'pages') handleActionClick('open-page', context);
    if (type === 'files') handleActionClick('open', context);
    if (type === 'stories') handleStoryActionClick(e, context, storyContext);
  };

  if (searchTypeSelected !== 'all' && type !== searchTypeSelected) return null;
  if (searchTypeSelected === 'all' && displayList.length === 0) return null;
  if (selectedStackId && (type === 'stories' || type === 'files')) return null;

  const getTotalResultText = () => {
    switch (type) {
      case 'pages':
        return selectedStackId || searchTypeSelected !== 'all' ? <FormattedMessage
          id="showing-n-page-results"
          defaultMessage="Showing {count} page {count, plural, one {result} other {results}}"
          values={{
            count: selectedStackId ? displayList.length : filesWithMatchedBlocks.length,
          }}
        /> : <FormattedMessage
          id="showing-n-results"
          defaultMessage="Showing {count} {count, plural, one {result} other {results}}"
          values={{
            count: filesWithMatchedBlocks.length < MAX_RESULTS_IN_LIST ? filesWithMatchedBlocks.length : MAX_RESULTS_IN_LIST,
          }}
        />;
      case 'files':
        return searchTypeSelected !== 'all' ? <FormattedMessage
          id="showing-n-file-results"
          defaultMessage="Showing {count} file {count, plural, one {result} other {results}}"
          values={{
            count: totalFiles,
          }}
        /> : <FormattedMessage
          id="showing-n-of-x"
          defaultMessage="Showing {count} of {total} {count, plural, one {result} other {results}}"
          values={{
            count: totalFiles < MAX_RESULTS_IN_LIST ? totalFiles : MAX_RESULTS_IN_LIST,
            total: totalFiles,
          }}
        />;
      case 'stories':
        return searchTypeSelected !== 'all' ? <FormattedMessage
          id="showing-n-story-results"
          defaultMessage="Showing {count} {story} {count, plural, one {result} other {results}}"
          values={{
            count: totalStories,
            story: naming.story
          }}
        /> : <FormattedMessage
          id="showing-n-stories-of-x"
          defaultMessage="Showing {count} of {total} {count, plural, one {result} other {results}}"
          values={{
            count: totalStories < MAX_RESULTS_IN_LIST ? totalStories : MAX_RESULTS_IN_LIST,
            total: totalStories,
          }}
        />;
      default:
        return '';
    }
  };

  return  (
    <div className={classNames(styles.fileResults, { [styles.isPages]: type === 'pages' })}>
      <PageSearchResultListHeader
        type={type}
        showBlankslate={searchTypeSelected === type && displayList.length === 0}
        showHeader={!selectedStackItem && displayList.length > 0}
        title={strings[type]}
        showPaging
        strings={strings}
        resultsCount={selectedStackId ? displayList.length : filesWithMatchedBlocks.length}
        showViewAll={searchTypeSelected === 'all' && !selectedStackId}
        onViewAllClick={handleOnViewAllClick}
        totalResultText={getTotalResultText()}
        headerIcon={headerIcon()}
      >
        {displayList.length > 0 && <div className={styles.list}>
          {displayList.map((item, ix) => (type === 'stories'
            ? <PageSearchStoryItem
              key={`search-results-story-${ix}`}
              strings={strings}
              onClick={(e, action, context) => handleStoryActionClick(e, action, context)}
              setReferrerPath={setReferrerPath}
              {...item}
            />
            : <PageSearchFileItem
              key={`search-results-${type}-${ix}`}
              allowAddToEditor={userCapabilities.hasPitchBuilderWeb}
              authString={authString}
              isChecked={isChecked(item)}
              isGrid={type === 'pages'}
              isSelectModeEnabled={selectMode && userCapabilities.hasPitchBuilderWeb}
              stackItem={selectedStackItem}
              strings={strings}
              onCheckboxChange={handlePageCheckedChange}
              onClick={handleOnClick}
              onMenuClick={(action, context) => handleActionClick(action, context)}
              onOpenPagesClick={(context) => handleActionClick('stack', context)}
              setReferrerPath={setReferrerPath}
              fileGeneralSettings={fileSettings.fileGeneralSettings}
              showContentApprovedBadge={_get(fileSettings, 'fileGeneralSettings.showCustomFileDetailsIcon', false)}
              hasPitchBuilderWeb={userCapabilities.hasPitchBuilderWeb}
              generateThumbnails={generateThumbnails}
              {...item}
            />))}
        </div>}
        {selectedStackItem && (
        <React.Fragment>
          <div className={styles.fileHeader}>{strings.file}</div>
          <PageSearchFileItem
            allowAddToEditor={userCapabilities.hasPitchBuilderWeb}
            authString={authString}
            isSelectModeEnabled={selectMode && userCapabilities.hasPitchBuilderWeb}
            stackItem={selectedStackItem}
            strings={strings}
            onCheckboxChange={handlePageCheckedChange}
            onClick={handleOnClick}
            onMenuClick={(action, context) => handleActionClick(action, context)}
            onOpenPagesClick={(context) => handleActionClick('stack', context)}
            setReferrerPath={setReferrerPath}
            fileGeneralSettings={fileSettings.fileGeneralSettings}
            showContentApprovedBadge={_get(fileSettings, 'fileGeneralSettings.showCustomFileDetailsIcon', false)}
            hasPitchBuilderWeb={userCapabilities.hasPitchBuilderWeb}
            {...selectedStackItem}
          />
        </React.Fragment>
        )}
      </PageSearchResultListHeader>
    </div>
  );
};

export default PageSearchResultList;
