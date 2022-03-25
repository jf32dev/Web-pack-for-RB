/**
 *
 * BIGTINCAN - CONFIDENTIAL
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
 *
 * This component render headers [name of the section, total result text] for each section [pages,files,stories] of page search results
 * Display Blankslate if `props.showBlankslate` is true
 * Display `<header>...</header>` if `props.showHeader` is true
 *
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import prepareSearchFilters from 'helpers/prepareSearchFilters';
import { bindActionCreatorsSafe } from '../../helpers/safeDispatch';
import { withRouter } from 'react-router-dom';
import ApiClient from 'helpers/ApiClient';

import { setReferrerPath } from 'redux/modules/story/story';
import {
  loadOpenFile,
  loadFile,
  toggleDock,
  setInitialQuery,
  setInitialPage,
} from 'redux/modules/viewer';
import {
  setInteraction,
  deleteStoryBookmark,
  addStoryBookmark,
  likeStory,
  searchFiles,
  searchStories
} from 'redux/modules/supersearch';
import {
  setData,
} from 'redux/modules/pageSearch';
import {
  generateThumbnails
} from 'redux/modules/canvas/canvas';

import generateStrings from 'helpers/generateStrings';
import List from 'components/PageSearchResultList/PageSearchResultList';

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  previous: { id: 'previous', defaultMessage: 'Previous' },
  next: { id: 'next', defaultMessage: 'Next' },
  file: { id: 'file', defaultMessage: 'File' },
  files: { id: 'files', defaultMessage: 'Files' },
  pages: { id: 'pages', defaultMessage: 'Pages' },
  stories: { id: 'stories', defaultMessage: '{stories}' },
  viewAll: { id: 'view-all', defaultMessage: 'View All' },
  close: { id: 'close', defaultMessage: 'Close' },

  // PageSearchListHeader
  emptyBlockSearchTitle: { id: 'empty-block-search-title', defaultMessage: 'No matched results' },
  emptyBlockSearchMessage: { id: 'empty-block-search-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },

  // PageSearchStoryItem
  like: { id: 'like', defaultMessage: 'Like' },
  removeLike: { id: 'remove-like', defaultMessage: 'Remove Like' },

  // Page search file item
  addToSelection: { id: 'add-to-selection', defaultMessage: 'Add to Selection' },
  addToPitchBuilder: { id: 'add-to-pitch-builder', defaultMessage: 'Add to Pitch Builder' },
  addedToCanvas: { id: 'added-to-canvas', defaultMessage: 'Added to Canvas' },
  addedToPitchBuilder: { id: 'added-to-pitch-builder', defaultMessage: 'Added to Pitch Builder' },
  share: { id: 'share', defaultMessage: 'Share' },
  bookmark: { id: 'bookmark', defaultMessage: 'Bookmark' },
  removeBookmark: { id: 'remove-bookmark', defaultMessage: 'Remove Bookmark' },
  modified: { id: 'modified', defaultMessage: 'Modified' },
  excerpt: { id: 'excerpt', defaultMessage: 'Excerpt' },
  openPages: { id: 'open-pages', defaultMessage: 'Open Pages' },
  open: { id: 'open', defaultMessage: 'Open' },
  results: { id: 'results', defaultMessage: 'Results' },
  page: { id: 'page', defaultMessage: 'Page' },
  slide: { id: 'slide', defaultMessage: 'Slide' },
  fileSize: { id: 'file-size', defaultMessage: 'File Size' },
  fileAddedToPitchBuilder: { id: 'file-added-to-pitch-builder', defaultMessage: 'A file has been added to Pitch Builder' },
  view: { id: 'view', defaultMessage: 'View' },
  lastModified: { id: 'last-modified', defaultMessage: 'Last Modified' },
  name: { id: 'name', defaultMessage: 'Name' },
  confirm: { id: 'confirm', defaultMessage: 'Confirm' },
  pageInfoLabel: { id: 'page-info-label', defaultMessage: 'Pages are individual slides or pages that contain your search term' },
  updated: { id: 'updated', defaultMessage: 'Updated' },
  foundIn: { id: 'found-in', defaultMessage: 'Found in' },
  pagesInsideOfThisFile: { id: 'pages-inside-of-this-file', defaultMessage: 'Pages inside of this file' },
  fileDetails: { id: 'file-details', defaultMessage: 'File Details' },

  // Pagination
  of: { id: 'of', defaultMessage: 'of' }
});

const mapStateToProps = (state) => {
  const {
    searchTypeSelected,
    hasSearch,
    selectedStackId,
    selectedBlocks,
    selectMode,
    keyword,
    selectedFilters
  } = state.pagesearch;
  const { userCapabilities, fileSettings } = state.settings;
  const { slidesById, blocksById } = state.canvas;
  const {
    files,
    stories,
    totalCount: totalFilesCount,
    totalStoriesCount,
    isLoadingMoreStories,
    isStoriesComplete,
    isLoadingMoreFiles,
    isFilesComplete
  } = state.supersearch;
  const { files: filesById } = state.entities;

  return {
    hasSearch,
    files,
    slidesById,
    blocksById,
    searchTypeSelected,
    selectedStackId,
    userCapabilities,
    selectedBlocks,
    selectMode,
    fileSettings,
    totalFilesCount,
    totalStoriesCount,
    stories,
    keyword,
    filesById,
    isLoadingMoreStories,
    isStoriesComplete,
    isLoadingMoreFiles,
    isFilesComplete,
    selectedFilters
  };
};
@connect(mapStateToProps, bindActionCreatorsSafe({
  setData,
  setReferrerPath,
  loadOpenFile,
  loadFile,
  toggleDock,
  setInitialQuery,
  setInitialPage,
  setInteraction,
  deleteStoryBookmark,
  addStoryBookmark,
  likeStory,
  generateThumbnails,
  searchStories,
  searchFiles
}))
class PageSearchResultList extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    autobind(this);

    this.limitExcerptCharacters = 130;
    this.scrollContainer = null;
  }


  handlePageCheckedChange(checked, id) {
    const newSelected = [...this.props.selectedBlocks];

    if (checked) {
      newSelected.push(id);
    } else {
      const i = newSelected.findIndex(b => b === id);
      newSelected.splice(i, 1);
    }

    this.props.setData({
      selectedBlocks: newSelected
    });
  }


  loadFileAndOpen(file, openAtBlock) {
    const { id, category, downloadUrl } = file;
    if (this.props.isDocked) {
      this.props.toggleDock();
    }

    // Open at Page
    let initialPage = 1;
    let firstBlock = null;
    if (category === 'pdf') {
      const searchTerm = this.props.keyword.replace(/"/g, '');  // remove quotes
      this.props.setInitialQuery(searchTerm);

      const pages = [...file.matchedBlocks];

      // Sort by page number
      if (pages) pages.sort((a, b) => parseInt(a.page, 10) - parseInt(b.page, 10));

      firstBlock = pages ? pages[0] : null;

      if (firstBlock && openAtBlock) {
        initialPage = firstBlock.page;
        this.props.setInitialPage(initialPage);
      }
    } else if (category === 'powerpoint') {
      const pages = [...file.matchedBlocks];

      // Sort by page number
      if (pages) pages.sort((a, b) => parseInt(a.page, 10) - parseInt(b.page, 10));

      firstBlock = pages ? pages[0] : null;
      if (firstBlock) {
        initialPage = firstBlock.page;
        this.props.setInitialPage(initialPage);
      }
    }

    // load file because search result payload has not data enough to get from cache.
    if (category === 'web' || category === 'pdf' && !downloadUrl) {
      this.props.loadOpenFile(id);
    } else {
      this.props.loadFile(id);
    }
  }

  handleFileDetailsClick(file) {
    this.props.setData({
      showFileDetailsModel: true,
      selectedFile: file
    });
  }

  handleActionClick(action, file) {
    switch (action) {
      case 'canvas': {
        if (file.matchedBlocks && file.matchedBlocks.length === 1 && file.category !== 'video') {
          this.props.addBlocksToCanvas(file);
        } else if (file.matchedBlocks && file.matchedBlocks.length > 1 && file.category !== 'video') {
          this.props.setData({
            pendingFile: file,
            showBlocksDialog: true
          });
        } else {
          this.props.addFileToCanvas(file);
        }
        break;
      }
      case 'canvas-all':
        // Try loading file blocks if they don't exist on file (via search results)
        if (!file.blocks || !file.blocks.length) {
          this.props.loadFile(file.id, false).then(() => {
            const pendingFile = this.props.filesById[file.id];

            // No blocks -- display message
            if (!pendingFile || (pendingFile && !pendingFile.blocks.length)) {
              this.props.setData({
                showNoBlocksDialog: true
              });

            // Has blocks -- display confirm dialog
            } else if (pendingFile && pendingFile.blocks.length) {
              this.props.setData({
                pendingFile: pendingFile,
                showAllBlocksDialog: true
              });
            }
          });
        } else {
          this.props.setData({
            pendingFile: file,
            showAllBlocksDialog: true
          });
        }
        break;
      case 'open':
      case 'open-page':

        // Tracking search interaction
        this.props.setInteraction({
          searchDataId: this.props.searchDataFileId,
          resultOpenedId: file.id
        });

        this.loadFileAndOpen(file, action === 'open-page');
        break;
      case 'bookmark':
        this.props.toggleBookmark(file);
        break;
      case 'share':
        this.props.createShare(file);
        break;
      case 'stack':
        this.props.setData({ selectedStackId: file.id });
        this.scrollContainer.scrollTop = 0;

        // Update URL
        this.props.history.push({
          pathname: `${this.props.location.pathname}/${file.id}`,
          query: this.props.location.query
        });

        // Generate thumbnails if any matched blocks do not have a thumbnail
        if (file.matchedBlocks.find(b => !b.thumbnailUrl)) {
          this.props.generateThumbnails(file.id, file.matchedBlocks);
        }
        break;
      case 'file-details':
        this.handleFileDetailsClick(file);
        break;
      default:
        console.info(`Unhandled action: ${action} ${file.id}`);  // eslint-disable-line
        break;
    }
  }

  getFilesDetails(files) {
    const client = new ApiClient();

    return Promise.all(files.map(file =>
      client.get('/file/get', 'webapi', {
        params: {
          id: file.id
        }
      }).then(fileResponse => (fileResponse && fileResponse.body))
    ));
  }

  async handleStoryShare(story) {
    const filesToShare = await this.getFilesDetails(story.files);
    this.props.setShareData({
      id: story.id,
      permId: story.permId,
      isVisible: true,
      name: story.title,
      showMoreOptions: true, // go to advance share when enabled
      files: filesToShare,
      url: '',
      subject: this.context.settings.sharing.defaultSubject,
      sharingPublic: this.context.settings.storyDefaults.sharingPublic,
      sharingFacebookDescription: '',
      sharingLinkedinDescription: '',
      sharingTwitterDescription: '',
    });
  }

  handleStoryActionClick(event, action, context) {
    // Tracking search interaction
    this.props.setInteraction({
      searchDataId: this.props.searchDataStoryId,
      resultOpenedId: context.id
    });

    switch (action) {
      case 'open':
        this.props.onStoryClick(event, { props: context });
        break;
      case 'bookmark':
        if (context.isBookmark) {
          this.props.deleteStoryBookmark(context.bookmarkId, context.permId);
        } else {
          this.props.addStoryBookmark(context.title, context.permId);
        }
        break;
      case 'like':
        this.props.likeStory(context.permId, !context.isLiked);
        break;
      case 'share':
        this.handleStoryShare(context);
        break;
      default:
        console.info(`Unhandled action: ${action} ${context.id}`);  // eslint-disable-line
        break;
    }
  }

  handleOnClick = (e, context, storyContext) => {
    if (this.props.type === 'pages') this.handleActionClick('open-page', context);
    if (this.props.type === 'files') this.handleActionClick('open', context);
    if (this.props.type === 'stories') this.handleStoryActionClick(e, context, storyContext);
  }

  handleListScroll(event) {
    const target = event.target;
    const { isLoadingMoreStories, isStoriesComplete, isLoadingMoreFiles, isFilesComplete } = this.props;
    const type = this.props.searchTypeSelected;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    if (scrollBottom >= loadTrigger && ['stories', 'files'].includes(type)) {
      // Story data
      let query;
      const { selectedFilters, keyword, sortBy } = this.props;
      const data = {
        keyword: keyword,
        selectedFilterList: selectedFilters,
        sortBy: {
          value: sortBy,
          order: 'asc'
        }
      };

      // Load more list
      switch (type) {
        case 'stories':
          if (!isStoriesComplete && !isLoadingMoreStories) {
            query = prepareSearchFilters({ ...data, type: 'stories' });
            this.props.searchStories({
              ...query,
              offset: this.props.stories.length,
              keywordOriginal: keyword
            });
          }
          break;
        case 'files':
          if (!isFilesComplete && !isLoadingMoreFiles) {
            query = prepareSearchFilters({ ...data, type: 'files' });
            this.props.searchFiles({
              ...query,
              offset: this.props.files.length,
              keywordOriginal: keyword
            });
          }
          break;
        default:
          break;
      }
    }
  }

  render() {
    const {
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
      displayPageList,
      setRef,
      slidesById,
      blocksById
    } = this.props;
    const { formatMessage } = this.context.intl;
    const { authString, naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    return (
      <div
        ref={c => {
          this.scrollContainer = c;
          setRef(c);
        }}
        style={{
          overflow: 'auto'
        }}
        onScroll={(e) => this.handleListScroll(e)}
      >
        {/* Page Listing */}
        <List
          type="pages"
          strings={strings}
          authString={authString}
          searchTypeSelected={searchTypeSelected}
          selectedStackId={selectedStackId}
          files={files}
          selectedBlocks={selectedBlocks}
          userCapabilities={userCapabilities}
          selectMode={selectMode}
          fileSettings={fileSettings}
          totalFilesCount={totalFilesCount}
          totalStoriesCount={totalStoriesCount}
          stories={stories}
          displayPageList={displayPageList}
          naming={naming}
          setReferrerPath={this.props.setReferrerPath}
          onViewAllClick={this.props.onNavMenuClick}
          setData={this.props.setData}
          onActionClick={this.handleActionClick}
          onStoryActionClick={this.handleStoryActionClick}
          slidesById={slidesById}
          blocksById={blocksById}
          generateThumbnails={this.props.generateThumbnails}
        />

        {/* File Listing */}
        <List
          type="files"
          strings={strings}
          authString={authString}
          searchTypeSelected={searchTypeSelected}
          selectedStackId={selectedStackId}
          files={files}
          selectedBlocks={selectedBlocks}
          userCapabilities={userCapabilities}
          selectMode={selectMode}
          fileSettings={fileSettings}
          totalFilesCount={totalFilesCount}
          totalStoriesCount={totalStoriesCount}
          stories={stories}
          displayPageList={displayPageList}
          naming={naming}
          setReferrerPath={this.props.setReferrerPath}
          onViewAllClick={this.props.onNavMenuClick}
          setData={this.props.setData}
          onActionClick={this.handleActionClick}
          onStoryActionClick={this.handleStoryActionClick}
          slidesById={slidesById}
          blocksById={blocksById}
          generateThumbnails={this.props.generateThumbnails}
        />
        {/* Story Listing */}
        <List
          type="stories"
          strings={strings}
          authString={authString}
          searchTypeSelected={searchTypeSelected}
          selectedStackId={selectedStackId}
          files={files}
          selectedBlocks={selectedBlocks}
          userCapabilities={userCapabilities}
          selectMode={selectMode}
          fileSettings={fileSettings}
          totalFilesCount={totalFilesCount}
          totalStoriesCount={totalStoriesCount}
          stories={stories}
          displayPageList={displayPageList}
          naming={naming}
          setReferrerPath={this.props.setReferrerPath}
          onViewAllClick={this.props.onNavMenuClick}
          setData={this.props.setData}
          onActionClick={this.handleActionClick}
          onStoryActionClick={this.handleStoryActionClick}
          slidesById={slidesById}
          blocksById={blocksById}
          generateThumbnails={this.props.generateThumbnails}
        />
      </div>
    );
  }
}

export default withRouter(PageSearchResultList);
