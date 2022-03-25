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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import AddFileMenu from 'components/AddFileMenu/AddFileMenu';
import FileEditList from 'components/FileEditList/FileEditList';
import FileEditModal from 'components/FileEditModal/FileEditModal';
import Text from 'components/Text/Text';
import autobind from 'class-autobind';

const messages = defineMessages({
  files: { id: 'files', defaultMessage: 'Files' },
  searchFiles: { id: 'search-files', defaultMessage: 'Search Files' },

  emptyHeading: { id: 'files', defaultMessage: 'Files' },
  emptyMessage: { id: 'story-files-empty-message', defaultMessage: 'There are currently no files attached to this {story}' },

  addFiles: { id: 'add-files', defaultMessage: 'Add Files' },
  desktop: { id: 'desktop', defaultMessage: 'Desktop' },
  hubFiles: { id: 'hub-files', defaultMessage: 'Hub Files' },
  forms: { id: 'forms', defaultMessage: 'Forms' },
  webLink: { id: 'web-link', defaultMessage: 'Web Link' },
  cloudFiles: { id: 'cloud-files', defaultMessage: 'Cloud Files' },
  allowHubShareDownloads: { id: 'allow-hubshare-downloads', defaultMessage: 'Allow HubShare Downloads' },
  headerTitle: { id: 'file-details', defaultMessage: 'File details' },
  save: { id: 'save', defaultMessage: 'Save' },
  fileName: { id: 'file-name', defaultMessage: 'File Name' },
  thumbnail: { id: 'thumbnail', defaultMessage: 'Thumbnail' },
  replaceThumbnail: { id: 'replace-thumbnail', defaultMessage: 'Replace Thumbnail' },
  fileOptions: { id: 'file-options', defaultMessage: 'File Options' },
  sharing: { id: 'sharing', defaultMessage: 'Sharing' },
  applyWatermark: { id: 'apply-watermark', defaultMessage: 'Apply Watermark' },
  customMetadata: { id: 'custom-metadata', defaultMessage: 'Custom Metadata' },
  customisableLabel: { id: 'customisable-label', defaultMessage: 'Customisable Label' },
  fileExpireDate: { id: 'file-expire-date', defaultMessage: 'File Expire Date' },
  shareStatus: { id: 'share-status', defaultMessage: 'Share Status' },
  optional: { id: 'optional', defaultMessage: 'Optional' },
  blocked: { id: 'blocked', defaultMessage: 'Blocked' },
  mandatory: { id: 'mandatory', defaultMessage: 'Mandatory' },
  links: { id: 'links', defaultMessage: 'Links' },
  presentationSettings: { id: 'presentation-settings', defaultMessage: 'Presentation Settings' },
  allowBroadcast: { id: 'allow-broadcast', defaultMessage: 'Allow Broadcast' },
  allowSlideReorder: { id: 'allow-slide-reorder', defaultMessage: 'Allow Slide Reorder' },
  allowSlideHiding: { id: 'allow-slide-hiding', defaultMessage: 'Allow Slide Hiding' },
  tagDescription: { id: 'tag-description-applying-tags', defaultMessage: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.', },
  newTag: { id: 'new-tag', defaultMessage: 'New tag' },
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  noRelatedTags: { id: 'no-related-tags', defaultMessage: 'No Related Tags' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  metadata: { id: 'metadata', defaultMessage: 'Metadata' },
  options: { id: 'options', defaultMessage: 'Options' },
  tags: { id: 'tags', defaultMessage: 'Tags' },

  fileType: { id: 'file-type', defaultMessage: 'File Type' },
  fileSize: { id: 'file-size-search', defaultMessage: 'File Size' },
  dateAdded: { id: 'date-added', defaultMessage: 'Date Added' },
  dateModified: { id: 'date-modified', defaultMessage: 'Date Modified' },
  synchronizedFiles: { id: 'synchronized-files', defaultMessage: 'Synchronized files' },
  fileExpireTime: { id: 'file-expire-time', defaultMessage: 'Schedule file expiry date & time' },
  fileExpireNote: { id: 'file-expire-note', defaultMessage: 'Set a date and time to expire this file' },
});

export default class StoryEditFiles extends PureComponent {
  static propTypes = {
    showEditModal: PropTypes.bool,
    currentFileEditing: PropTypes.object,
    files: PropTypes.array,
    filterValue: PropTypes.string,
    canCreateCustomFileDetails: PropTypes.object,
    onAddClick: PropTypes.func.isRequired,

    onDragStart: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,

    onFileEditChange: PropTypes.func,
    onFilterChange: PropTypes.func,

    onAddTag: PropTypes.func.isRequired,
    onAnchorClick: PropTypes.func.isRequired,
    onOrderChange: PropTypes.func.isRequired,
    onFileOptionsToggleClick: PropTypes.func.isRequired,
    onFileDeleteClick: PropTypes.func.isRequired,
    onFileUploadClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    files: []
  };


  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, userCapabilities } = this.context.settings;
    const {
      hasCloudStorage,
      showStoryOptionWeblink,
      canCreateCustomFileDetails
    } = userCapabilities;
    const { files, filterValue, onAddClick } = this.props;
    const styles = require('./StoryEditFiles.less');
    const cx = classNames.bind(styles);
    const menuWrapperClasses = cx({
      menuWrapper: true,
      singleFile: files.length === 1
    }, this.props.className);

    // No Files at all
    const emptyFiles = !filterValue && !files.length;

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const fileMenu = (
      <AddFileMenu
        desktop
        file
        form
        web={showStoryOptionWeblink}
        cloud={hasCloudStorage}
        //audio
        onItemClick={onAddClick}
        position={{ left: 0 }}
      />
    );

    return (
      <div className={styles.StoryEditFiles}>
        <div className={styles.filesWrapper}>
          {emptyFiles && <h3>{strings.files}</h3>}
          {emptyFiles && <Blankslate
            icon="files"
            iconSize={96}
            heading={strings.emptyHeading}
            message={strings.emptyMessage}
            inline
          >
            {fileMenu}
          </Blankslate>}

          {(filterValue.length > 0 || files.length > 0) && <div className={styles.filesHeader}>
            <h3>{strings.files} <span>({files.length})</span></h3>
            <Text
              placeholder={strings.searchFiles}
              value={filterValue}
              onChange={this.props.onFilterChange}
              className={styles.searchFilter}
            />
          </div>}

          {(filterValue.length > 0 || files.length > 0) && <div className={styles.scrollWrap}>
            <div className={styles.listWrap}>
              <FileEditList
                list={files}
                disableSortable={files.length < 2}
                fileSettings={this.props.fileSettings}
                onAddClick={this.props.onAddClick}
                onDragStart={this.props.onDragStart}
                onDragEnd={this.props.onDragEnd}
                onOrderChange={this.props.onOrderChange}
                onAnchorClick={this.props.onAnchorClick}
                onFileOptionsToggleClick={this.props.onFileOptionsToggleClick}
                onFileDeleteClick={this.props.onFileDeleteClick}
              />
              {this.props.showEditModal && <FileEditModal
                onAddTag={this.props.onAddTag}
                onChange={this.props.onFileEditChange}
                onClose={this.props.onFileOptionsToggleClick}
                onSave={this.props.onSaveClick}
                onUploadClick={this.props.onFileUploadClick}
                fileSettings={this.props.fileSettings}
                {... {
                  canCreateCustomFileDetails,
                  authString,
                  strings,
                  ...this.props.currentFileEditing
                }}
              />}
            </div>
          </div>}
          {(filterValue.length > 0 || files.length > 0) && <div className={menuWrapperClasses}>
            {fileMenu}
          </div>}
        </div>
      </div>
    );
  }
}
