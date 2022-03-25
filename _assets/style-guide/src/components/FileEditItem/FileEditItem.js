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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  SortableHandle as sortableHandle
} from 'react-sortable-hoc';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import FileThumb from 'components/FileThumb/FileThumb';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import List from 'components/List/List';
import Text from 'components/Text/Text';

import AddFileMenu from 'components/AddFileMenu/AddFileMenu';

const DragHandle = sortableHandle((props) => props.children);

const ShareStatusIndicator = (props) => (
  <div className={props.styles.shareStatusIndicator}>
    <span
      data-status="optional"
      className={props.status === 'optional' ? props.styles.shareActive : null}
    />
    <span
      data-status="mandatory"
      className={props.status === 'mandatory' ? props.styles.shareActive : null}
    />
    <span
      data-status="blocked"
      className={props.status === 'blocked' ? props.styles.shareActive : null}
    />
  </div>
);

/**
 * Displayed in FileEditList
 */
export default class FileEditItem extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    filename: PropTypes.string,
    description: PropTypes.string.isRequired,

    /** Valid category */
    category: PropTypes.oneOf([
      'app',
      'audio',
      'btc',
      'cad',
      'csv',
      'earthviewer',
      'ebook',
      'epub',
      'excel',
      'folder',
      'form',
      'ibooks',
      'image',
      'keynote',
      'none',
      'numbers',
      'oomph',
      'pages',
      'pdf',
      'potx',
      'powerpoint',
      'project',
      'prov',
      'rtf',
      'rtfd',
      'scrollmotion',
      'stack',
      'twixl',
      'txt',
      '3d-model',
      'vcard',
      'video',
      'visio',
      'web',
      'word',
      'zip'
    ]),

    thumbnail: PropTypes.string,
    thumbnailProgress: PropTypes.number,
    thumbnailUploading: PropTypes.bool,

    /** View URL */
    url: PropTypes.string,

    /** Original file */
    downloadUrl: PropTypes.string,

    sequence: PropTypes.number,
    shareStatus: PropTypes.oneOf(['blocked', 'mandatory', 'optional']),
    hasWatermark: PropTypes.bool,
    allowHubshareDownloads: PropTypes.bool,

    /** Presentation Settings */
    convertSettings: PropTypes.shape({
      allowHideSlide: PropTypes.bool,
      allowLiveBroadcast: PropTypes.bool,
      allowSorter: PropTypes.bool
    }),

    /** Kloudless file id */
    repoDocumentId: PropTypes.string,

    /** Kloudless folder id */
    repoFolderId: PropTypes.string,

    /** Number of files in a Kloudless folder */
    repoFileCount: PropTypes.number,

    /** An array of files in a Kloudless folder */
    contents: PropTypes.array,

    /** Repository details for a Kloudless file */
    repo: PropTypes.object,

    isNew: PropTypes.bool,
    progress: PropTypes.number,
    uploading: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

    disableSortable: PropTypes.bool,

    authString: PropTypes.string,
    strings: PropTypes.object,

    onAnchorClick: function(props) {
      if (props.category === 'web' && typeof props.onAnchorClick !== 'function') {
        return new Error('onAnchorClick is required when editing a file with category `web`.');
      }
      return null;
    },
    onSourceUrlChange: function(props) {
      if (props.category === 'web' && typeof props.onSourceUrlChange !== 'function') {
        return new Error('onSourceUrlChange is required when editing a file with category `web`.');
      }
      return null;
    },
    onAddClick: PropTypes.func.isRequired,
    onOptionsToggleClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onUploadClick: PropTypes.func.isRequired,
    onShareChange: PropTypes.func.isRequired,
    onPresentationSettingChange: PropTypes.func.isRequired,
    onWatermarkChange: PropTypes.func.isRequired,
    onHubshareDownloadChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    convertSettings: {
      allowHideSlide: false,
      allowLiveBroadcast: false,
      allowSorter: false
    },
    contents: [],

    authString: '',

    strings: {
      done: 'Done',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this file?',
      disconnect: 'Disconnect',
      disconnectConfirm: 'Are you sure you want to disconnect this folder?',
      cancel: 'Cancel',
      options: 'Options',
      filedescription: 'File Description',
      customThumbnail: 'Custom Thumbnail',
      thumbNote: 'Upload a different thumbnail',
      upload: 'Upload',
      applyWatermark: 'Apply Watermark',
      presentationSettings: 'Presentation Settings',
      allowBroadcast: 'Allow Broadcast',
      allowSlideReorder: 'Allow Slide Reorder',
      allowSlideHiding: 'Allow Slide Hiding',
      shareStatus: 'Share Status',
      optional: 'Optional',
      mandatory: 'Mandatory',
      blocked: 'Blocked',
      synchronizedFiles: 'Synchronized files',
      folderNote: 'Folder options apply to all synchonized files.',
      link: 'Link',
      allowHubshareDownload: 'Allow HubShare downloads',
      update: 'Update'
    }
  };

  constructor(props) {
    super(props);
    this.presentationTypes = ['btc', 'keynote', 'powerpoint'];
    const excludeWatermark = ['app', 'audio', 'web'];
    const excludeShare = ['app'];

    this.state = {
      isPresentation: this.presentationTypes.indexOf(this.props.category) > -1,
      canWatermark: excludeWatermark.indexOf(this.props.category) === -1,
      canShare: excludeShare.indexOf(this.props.category) === -1,
      confirmDelete: false
    };

    autobind(this);

    // refs
    this.elem = null;
    this.sourceUrl = null;
  }

  componentDidMount() {
    // Focus sourceUrl input if new web link
    if (this.props.isNew && !this.props.sourceUrl && this.props.category === 'web' && this.sourceUrl) {
      this.sourceUrl.focus();
    }
  }

  componentDidUpdate(prevProps) {
    // Scroll file in to view if needed
    if (!prevProps.showOptions && this.props.showOptions) {
      const offsetBottom = this.elem.offsetTop + this.elem.offsetHeight;
      const listScrollHeight = this.elem.parentElement.parentElement.scrollHeight;
      const padding = 10;

      if (offsetBottom >= (listScrollHeight - padding)) {
        this.elem.scrollIntoView();
      }
    }

    if (prevProps.category !== this.props.category) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ isPresentation: this.presentationTypes.indexOf(this.props.category) > -1 });
    }
  }

  handleOptionsToggleClick(event) {
    this.props.onOptionsToggleClick(event, this.props.id);
  }

  handleDeleteClick(event) {
    event.preventDefault();
    this.setState({ confirmDelete: true });
  }

  handleCancelDeleteClick(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleConfirmDeleteClick(event) {
    event.preventDefault();

    const { onDeleteClick } = this.props;
    if (typeof onDeleteClick === 'function') {
      onDeleteClick(event, this.props.id);
    }
  }

  handleDescriptionChange(event) {
    this.props.onDescriptionChange(event, this.props.id);
  }

  handleUploadClick(event) {
    event.preventDefault();
    this.props.onUploadClick(event, this.props.id);
  }

  handleShareChange(event) {
    this.props.onShareChange(event, this.props.id);
  }

  handlePresentationSettingChange(event) {
    this.props.onPresentationSettingChange(event, this.props.id);
  }

  handleWatermarkChange(event) {
    this.props.onWatermarkChange(event, this.props.id);
  }

  handleHubshareDownloadChange(event) {
    this.props.onHubshareDownloadChange(event, this.props.id);
  }

  handleFolderItemClick(event) {
    event.preventDefault();
  }

  handleSourceUrlChange(event) {
    this.props.onSourceUrlChange(event, this.props.id);
  }

  // Mutate event with default http:// prepended if no protocol is set
  handleSourceUrlBlur(event) {
    const value = event.target.value;
    if (value && value.indexOf('://') === -1) {
      event.target.value = 'http://' + value;  // eslint-disable-line no-param-reassign
      this.props.onSourceUrlChange(event, this.props.id);
    }
  }

  render() {
    const {
      id,
      category,
      description,
      shareStatus,
      hasWatermark,
      allowHubshareDownloads,
      convertSettings,
      contents,
      sourceUrl,
      filePermId,

      isNew,
      showOptions,

      progress,
      uploading,
      error,
      disableSortable,

      url,
      repo,

      strings
    } = this.props;
    const { isPresentation, canWatermark, canShare } = this.state;
    const styles = require('./FileEditItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      FileEditItem: true,
      expanded: showOptions,
      uploading: uploading,
      error: error
    }, this.props.className);

    const isDisabled = shareStatus === 'blocked';

    // Show 'disconnect' instead of 'delete' for folder
    let deleteText = strings.delete;
    let deleteConfirmText = strings.deleteConfirm;
    if (category === 'folder') {
      deleteText = strings.disconnect;
      deleteConfirmText = strings.disconnectConfirm;
    }

    return (
      <div
        ref={(c) => { this.elem = c; }}
        className={itemClasses}
        style={this.props.style}
      >
        <TransitionGroup>
          {this.state.confirmDelete && <CSSTransition
            classNames="fade"
            timeout={150}
            appear
          >
            <div
              data-id="confirm-delete"
              className={styles.confirmDelete}
            >
              <p>{deleteConfirmText}</p>
              <ul>
                <li><Btn alt large onClick={this.handleCancelDeleteClick}>{strings.cancel}</Btn></li>
                <li><Btn inverted large onClick={this.handleConfirmDeleteClick}>{deleteText}</Btn></li>
              </ul>
            </div>
          </CSSTransition>}
        </TransitionGroup>
        <div className={styles.fileWrap}>
          {!disableSortable && !error && <DragHandle>
            <div className={styles.handle} />
          </DragHandle>}
          <FileThumb {...this.props} thumbSize="xsmall" />
          {!showOptions && <div className={styles.descriptionWrap}>
            <span
              aria-label={description}
              className={styles.description}
            >
              {description}
            </span>
            {category === 'web' && <span className={styles.sourceUrl}>
              <a
                href={sourceUrl}
                onClick={this.props.onAnchorClick}
              >
                {sourceUrl}
              </a>
            </span>}
          </div>}
          {showOptions && <Text
            placeholder={strings.filedescription}
            value={description}
            disabled={!showOptions || category === 'folder'}
            maxLength={255}
            onChange={this.handleDescriptionChange}
            className={styles.editName}
          />}
          <div className={styles.share}>
            {!uploading && !error && canShare && <ShareStatusIndicator status={shareStatus} styles={styles} />}
          </div>
          <div className={styles.controls}>
            {!showOptions && !uploading && !error && <Btn
              data-id="file-option-toggle"
              alt
              onClick={this.handleOptionsToggleClick}
            >
              {strings.options}
            </Btn>}
            {showOptions && !uploading && <Btn
              data-id="file-option-toggle"
              inverted
              onClick={this.handleOptionsToggleClick}
            >
              {strings.done}
            </Btn>}
            {showOptions && !uploading && <div style={{ position: 'absolute', marginTop: '1.5rem', right: '0.5rem' }}>
              <Btn
                data-id="file-delete"
                onClick={this.handleDeleteClick}
                style={isNew || !_isEmpty(repo) || category === 'form' ? null : { marginRight: '0.5rem' }}
                warning
                inverted
              >
                {strings.delete}
              </Btn>
              {!isNew && _isEmpty(repo) && category !== 'form' && <AddFileMenu
                desktop
                file
                heading={strings.update}
                position={{ textAlign: 'left', position: 'absolute' }}
                onItemClick={() => this.props.onAddClick(event, shareStatus, filePermId, id)}
                inverted
              />}
            </div>}
          </div>
          {progress > 0 && uploading && <div className={styles.progress} style={{ width: progress + '%' }} />}
        </div>
        {showOptions && <div className={styles.optionsWrap}>
          <div className={styles.editThumbnail}>
            <FileThumb
              {...this.props}
              thumbSize="large"
              grid
              showThumb
              className={styles.thumb}
              authString={this.props.authString}
            />
            <div>
              {category === 'folder' && <div className={styles.folderNote}>
                <p>{strings.folderNote}</p>
              </div>}
              {category !== 'folder' && category !== 'form' && <div className={styles.customThumb}>
                <h5>{strings.customThumbnail}</h5>
                <p>{strings.thumbNote}</p>
                <Btn
                  data-id="file-thumb-upload"
                  inverted
                  onClick={this.handleUploadClick}
                >
                  {strings.upload}
                </Btn>
              </div>}
              {canWatermark && <Checkbox
                name={'hasWatermark-' + this.props.id}
                label={strings.applyWatermark}
                checked={hasWatermark}
                value="hasWatermark"
                onChange={this.handleWatermarkChange}
                className={styles.watermarkWrap}
              />}
            </div>
          </div>
          {(isPresentation || category === 'folder') && <div className={styles.editPresentation}>
            <h5>{strings.presentationSettings}</h5>
            <Checkbox
              name={'allowLiveBroadcast-' + this.props.id}
              label={strings.allowBroadcast}
              checked={convertSettings.allowLiveBroadcast}
              value="allowLiveBroadcast"
              onChange={this.handlePresentationSettingChange}
            />
            <Checkbox
              name={'allowSorter-' + this.props.id}
              label={strings.allowSlideReorder}
              checked={convertSettings.allowSorter}
              value="allowSorter"
              onChange={this.handlePresentationSettingChange}
            />
            <Checkbox
              name={'allowHideSlide-' + this.props.id}
              label={strings.allowSlideHiding}
              checked={convertSettings.allowHideSlide}
              value="allowHideSlide"
              onChange={this.handlePresentationSettingChange}
            />
          </div>}
          {category === 'web' && <div className={styles.editWeb}>
            {sourceUrl && <h5>{strings.link}</h5>}
            {!isNew && <a
              href={sourceUrl}
              onClick={this.props.onAnchorClick}
            >
              {sourceUrl}
            </a>}
            {isNew && !url && <Text
              ref={(c) => { this.sourceUrl = c; }}
              placeholder="https://www.example.com/"
              value={sourceUrl}
              onChange={this.handleSourceUrlChange}
              onBlur={this.handleSourceUrlBlur}
            />}
          </div>}
          {canShare && <div className={styles.editSharing}>
            <h5>{strings.shareStatus}</h5>
            <RadioGroup
              name={'shareStatus-' + this.props.id}
              selectedValue={shareStatus}
              options={[{
                label: strings.optional,
                value: 'optional',
                colour: 'green'
              }, {
                label: strings.mandatory,
                value: 'mandatory',
                colour: 'orange'
              }, {
                label: strings.blocked,
                value: 'blocked',
                colour: 'red'
              }]}
              onChange={this.handleShareChange}
            />
            <Checkbox
              name={'allowHubshareDownloads-' + this.props.id}
              label={strings.allowHubshareDownload}
              checked={!isDisabled && allowHubshareDownloads}
              value="allowHubshareDownloads"
              onChange={this.handleHubshareDownloadChange}
              className={styles.watermarkWrap}
              disabled={isDisabled}
            />
          </div>}
        </div>}
        {showOptions && contents.length > 0 && <div className={styles.folderContents}>
          <h5>{strings.synchronizedFiles} ({this.props.repoFileCount})</h5>
          <List
            list={contents}
            thumbSize="small"
            showThumb={false}
            grid
            onItemClick={this.handleFolderItemClick}
          />
        </div>}
      </div>
    );
  }
}
