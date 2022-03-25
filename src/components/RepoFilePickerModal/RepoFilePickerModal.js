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
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadRepos,
  loadRepoContent,
  searchRepoContent,
  reset,
  selectSingleRepo,
  selectSingleRepoFolder,
  selectSingleFile,
  toggleSelectedFile
} from 'redux/modules/browser';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';
import TriggerList from 'components/TriggerList/TriggerList';

const messages = defineMessages({
  addFiles: { id: 'add-files', defaultMessage: 'Add Files' },
  addFile: { id: 'add-file', defaultMessage: 'Add File' },
  nItems: { id: 'n-items', defaultMessage: '{itemCount, plural, one {# item} other {# items}}' },
  selectAll: { id: 'select-all', defaultMessage: 'Select All' },

  cloudFiles: { id: 'cloud-files', defaultMessage: 'Cloud Files' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  add: { id: 'add', defaultMessage: 'Add' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  search: { id: 'search', defaultMessage: 'Search' },
  searchRepository: { id: 'search-repository', defaultMessage: 'Search Repository' },

  noReposHeading: { id: 'repositories', defaultMessage: 'Repositories' },
  noReposMessage: { id: 'no-repositories-available', defaultMessage: 'No Repositories available' },

  noFilesHeading: { id: 'files', defaultMessage: 'Files' },
  noFilesMessage: { id: 'no-files-available', defaultMessage: 'No Files available' },
});

function mapStateToProps(state, ownProps) {
  const { browser, settings } = state;

  const availableRepos = browser.repos.map(id => browser.reposById[id]);
  const selectedRepo = availableRepos.find(t => t.isSelected);
  let selectedFolderName;

  // Selected Repo's content
  let selectedRepoContent = [];
  if (selectedRepo && selectedRepo.selectedFolder) {
    const selectedFolder = selectedRepo.selectedFolder;
    selectedRepoContent = selectedRepo[selectedFolder].map(id => browser.filesById[id]);

    // Does our folder have a name?
    if (selectedFolder && browser.filesById[selectedFolder]) {
      selectedFolderName = browser.filesById[selectedFolder].description;
    }

    // Filter ignored categories
    if (ownProps.ignore && ownProps.ignore.length) {
      selectedRepoContent = selectedRepoContent.filter(function(f) {
        return ownProps.ignore.indexOf(f.category) === -1;
      });
    }
  }

  // All Selected Files
  const selectedFiles = [];
  for (const key in browser.filesById) {
    if (browser.filesById[key].isSelected) {
      selectedFiles.push(browser.filesById[key]);
    }
  }

  // Is the current list empty?
  let currentListEmpty = false;
  if (selectedRepo && !selectedRepoContent.length) {
    currentListEmpty = true;
  }

  // Detect IE10/11 for flex bug workaround
  const isIE = settings.platform.name === 'IE';

  return {
    ...browser,
    repos: availableRepos,
    selectedRepo: selectedRepo,
    selectedRepoContent: selectedRepoContent,
    selectedFolderName: selectedFolderName,
    selectedFiles: selectedFiles,
    currentListEmpty: currentListEmpty,

    isIE: isIE
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    loadRepos,
    loadRepoContent,
    searchRepoContent,
    reset,
    selectSingleRepo,
    selectSingleRepoFolder,
    selectSingleFile,
    toggleSelectedFile
  })
)
export default class RepoFilePickerModal extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,

    repos: PropTypes.array,
    selectedRepo: PropTypes.object,

    allowMultiple: PropTypes.bool,

    /** allow folders to be selected (checkbox) */
    allowFolderSelect: PropTypes.bool,

    /** file categories to ignore */
    ignore: PropTypes.array,

    /** applies flexbox style fix */
    isIE: PropTypes.bool,

    loadRepos: PropTypes.func,
    loadRepoContent: PropTypes.func,
    searchRepoContent: PropTypes.func,
    reset: PropTypes.func,

    selectSingleRepo: PropTypes.func,
    selectSingleRepoFolder: PropTypes.func,
    selectSingleFile: PropTypes.func,
    toggleSelectedFile: PropTypes.func,

    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };

    // refs
    this.searchBtn = null;

    autobind(this);
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleLoadRepos(offset) {
    this.props.loadRepos(offset);
  }

  handleLoadRepoContent() {
    const { selectedRepo } = this.props;
    const repoId = selectedRepo.id;
    const folderId = selectedRepo.folderIdFetchMore || selectedRepo.folderId;
    const nextPage = selectedRepo.nextPage;
    this.props.loadRepoContent(repoId, folderId, nextPage);
  }

  handlePathClick(event) {
    event.preventDefault();
    const { selectedRepo } = this.props;
    const repoId = selectedRepo.id;
    const folderId = selectedRepo.folderId;
    const path = event.target.dataset.path;

    // Return to repo list
    if (!path) {
      this.props.selectSingleRepo(0);

    // Path exists - show repo folderId
    } else {
      this.props.selectSingleRepoFolder(repoId, folderId);
    }

    this.setState({ searchValue: '' });
  }

  handleRepoClick(event, context) {
    event.preventDefault();
    this.props.selectSingleRepo(context.props.id);
  }

  handleFileClick(event, context) {
    event.preventDefault();
    const id = context.props.id;
    const { filesById, selectedRepo } = this.props;

    if (filesById[id].category === 'folder' && event.target.nodeName !== 'LABEL') {
      this.props.loadRepoContent(selectedRepo.id, id);
      return;
    }

    if (this.props.allowMultiple) {
      this.props.toggleSelectedFile(id);
    } else {
      this.props.selectSingleFile(id);
    }
  }

  handleSaveClick(event) {
    this.props.onSave(event, this.props.selectedFiles);
  }

  handleRepoSearchChange(event) {
    this.setState({
      searchValue: event.target.value
    });
  }

  handleRepoSearchKeyUp(event) {
    if (event.keyCode === 13) {
      this.searchBtn.click();
    }
  }

  handleRepoSearchClick() {
    const { id, folderId } = this.props.selectedRepo;
    const value = this.state.searchValue;
    if (id && value) {
      this.props.searchRepoContent(id, value, folderId);
    } else if (id && !value) {
      this.props.loadRepoContent(id, folderId);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      isLoading,
      allowMultiple,
      selectedFiles,

      repos,
      reposLoading,
      reposComplete,
      reposError,

      currentListEmpty,
      selectedRepo,
      selectedRepoContent,
      selectedFolderName,
      onClose
    } = this.props;
    const styles = require('./RepoFilePickerModal.less');
    const cx = classNames.bind(styles);
    const listWrapperClasses = cx({
      listWrapper: true,
      ieBody: this.props.isIE,
      loading: isLoading,
      empty: currentListEmpty
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { itemCount: selectedFiles.length });

    // Breadcrumbs
    const paths = [{
      name: strings.cloudFiles,
      path: ''
    }];

    if (selectedRepo) {
      paths.push({
        name: selectedRepo.name,
        path: 'repo/' + selectedRepo.id
      });
    }

    if (selectedRepo && selectedFolderName) {
      paths.push({
        name: selectedFolderName,
        path: 'folder/' + selectedRepo.selectedFolder
      });
    }

    // Title String
    let titleString = allowMultiple ? strings.addFiles : strings.addFile;
    if (selectedFiles.length) {
      titleString += ` (${strings.nItems})`;
    }

    return (
      <Modal
        id="repo-file-picker"
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
              disabled={!selectedRepoContent.length}
              onClick={this.handleSaveClick}
            >
              {strings.add}
            </Btn>
          </div>
        )}
        className={styles.RepoFilePickerModal}
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
        {selectedRepo && !isLoading && <div className={styles.searchRepo}>
          <Text
            disabled={isLoading}
            value={this.state.searchValue}
            placeholder={strings.searchRepository}
            onChange={this.handleRepoSearchChange}
            onKeyUp={this.handleRepoSearchKeyUp}
          />
          <Btn
            ref={(c) => { this.searchBtn = c; }}
            disabled={isLoading}
            onClick={this.handleRepoSearchClick}
          >
            {strings.search}
          </Btn>
        </div>}
        <div className={listWrapperClasses}>
          {!selectedRepo && <TriggerList
            list={repos}
            isLoaded={repos.length > 0}
            isLoading={reposLoading}
            isLoadingMore={reposLoading && repos.length > 1 && !reposComplete}
            isComplete={reposComplete}
            error={reposError}
            listProps={{
              thumbSize: 'small',
              icon: 'cloud',
              noLink: true,
              emptyHeading: strings.noReposHeading,
              emptyMessage: strings.noReposMessage,
              onItemClick: this.handleRepoClick,
              itemClassName: styles.item
            }}
            onGetList={this.handleLoadRepos}
          />}
          {selectedRepo && <TriggerList
            list={selectedRepoContent}
            isLoaded={selectedRepoContent.length > 0}
            isLoading={selectedRepo.contentLoading}
            isLoadingMore={selectedRepo.contentLoading && selectedRepoContent.length > 1 && !selectedRepo.contentComplete}
            isComplete={selectedRepo.contentComplete}
            error={selectedRepo.contentError}
            listProps={{
              thumbSize: 'small',
              icon: 'file',
              noLink: true,
              itemProps: {
                showCheckbox: true,
                showFolderCheckbox: this.props.allowFolderSelect,
                hideMeta: true
              },
              emptyHeading: strings.noFilesHeading,
              emptyMessage: strings.noFilesMessage,
              onItemClick: this.handleFileClick,
              itemClassName: styles.item
            }}
            onGetList={this.handleLoadRepoContent}
          />}
        </div>
      </Modal>
    );
  }
}
