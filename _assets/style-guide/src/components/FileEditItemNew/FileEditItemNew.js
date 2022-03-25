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

import _isEmpty from 'lodash/isEmpty';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { SortableHandle as sortableHandle } from 'react-sortable-hoc';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import AddFileMenu from 'components/AddFileMenu/AddFileMenu';
import Btn from 'components/Btn/Btn';
import FileThumb from 'components/FileThumb/FileThumb';
import TagItems from 'components/FileItem/TagItems';

const DragHandle = sortableHandle(props => props.children);

const initialState = {
  tagWidth: 0,
  confirmDelete: false
};

const ShareStatusIndicator = props => (
  <div className={props.styles.shareStatusIndicator}>
    <span
      data-status={props.status}
      className={props.styles.shareActive}
    >
      {props.strings[props.status]}
    </span>
  </div>
);

const FileEditItemNew = props => {
  const [tagWidth, setTagWidth] = useState(initialState.tagWidth);
  const [confirmDelete, setConfirmDelete] = useState(initialState.confirmDelete);
  const tagRef = useRef(null);
  const {
    canShare,
    category,
    className,
    customDetailsIsEnabled,
    description,
    disableSortable,
    error,
    filePermId,
    fileSettings,
    id,
    isNew,
    progress,
    repo,
    shareStatus,
    strings,
    style,
    uploading,
    tags,

    onAddClick,
    onDeleteClick,
    onOptionsToggleClick
  } = props;

  // Resize Tags and recalculate width
  useEffect(() => {
    const handleResize = () => setTagWidth(tagRef.current.offsetWidth);
    if (tagRef.current) {
      setTagWidth(tagRef.current.offsetWidth);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFileEditModalToggle = (event, activeSection) => {
    if (!uploading && typeof onOptionsToggleClick === 'function') {
      onOptionsToggleClick(event, id, activeSection);
    }
  };

  const handleDeleteClick = () => {
    setConfirmDelete(true);
  };

  const handleCancelDeleteClick = () => {
    setConfirmDelete(false);
  };

  const handleConfirmDeleteClick = (event) => {
    event.preventDefault();
    if (typeof onDeleteClick === 'function') {
      onDeleteClick(event, id);
    }
  };

  const styles = require('./FileEditItemNew.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    FileEditItem: true
  }, className);

  const desriptionWrapClasses = cx({
    descriptionWrap: true,
    noHandler: !!disableSortable
  }, className);

  const { showCustomFileDetailsIcon } = fileSettings.fileGeneralSettings;
  const descriptionClasses = cx({
    description: true,
    showFileMetadataIcon: showCustomFileDetailsIcon && customDetailsIsEnabled
  }, className);

  // Show 'disconnect' instead of 'delete' for folder
  let deleteText = strings.delete;
  let deleteConfirmText = strings.deleteConfirm;
  if (category === 'folder') {
    deleteText = strings.disconnect;
    deleteConfirmText = strings.disconnectConfirm;
  }

  return (
    <div
      className={classes}
      style={style}
    >
      <TransitionGroup>
        {confirmDelete && <CSSTransition
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
              <li><Btn alt large onClick={handleCancelDeleteClick}>{strings.cancel}</Btn></li>
              <li><Btn inverted large onClick={handleConfirmDeleteClick}>{deleteText}</Btn></li>
            </ul>
          </div>
        </CSSTransition>}
      </TransitionGroup>
      <div className={styles.fileWrap}>
        {!disableSortable && !error && <DragHandle>
          <div className={styles.handle} />
        </DragHandle>}
        <FileThumb {...props} thumbSize="small" />
        <div className={desriptionWrapClasses}>
          <span
            aria-label={description}
            className={descriptionClasses}
          >
            {description}
          </span>
          <span ref={tagRef}>
            {tags.length > 0 && <TagItems
              showAddTag={false} // waiting for API support - add tag to new files
              showMoreTag={false}
              tags={tags}
              totalWidth={tagWidth}
              strings={strings}
              styles={styles}
              onMoreClick={(event) => handleFileEditModalToggle(event, 'tags')}
              onAddTagClick={(event) => handleFileEditModalToggle(event, 'tags')}
            />}
            {false && tags.length === 0 &&
              <span
                className={styles.addTag}
                onClick={(event) => handleFileEditModalToggle(event, 'tags')}
              >
                {strings.addTags}...
              </span>
            }
          </span>
        </div>
        <div className={styles.share}>
          {!uploading && !error && canShare && <ShareStatusIndicator status={shareStatus} styles={styles} strings={strings} />}
        </div>
        {!uploading && <Fragment>
          <div className={styles.controls}>
            {category !== 'web' && !isNew && _isEmpty(repo) && category !== 'form' && <AddFileMenu
              desktop
              file
              heading={strings.update}
              position={{ textAlign: 'left', position: 'absolute' }}
              onItemClick={() => onAddClick(event, shareStatus, filePermId, id)}
            />}
          </div>
          <span className={styles.infoBtn} onClick={handleFileEditModalToggle} />
          <span className={styles.trashBtn} onClick={handleDeleteClick} />
        </Fragment>}
        {progress > 0 && uploading && <div className={styles.progress} style={{ width: progress + '%' }} />}
      </div>
    </div>
  );
};

FileEditItemNew.propTypes = {
  authString: PropTypes.string,
  canShare: PropTypes.bool,

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

  // Content to be displayed
  className: PropTypes.string,
  description: PropTypes.string.isRequired,
  disableSortable: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  filename: PropTypes.string,
  fileSettings: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isNew: PropTypes.bool,
  progress: PropTypes.number,
  shareStatus: PropTypes.oneOf(['blocked', 'mandatory', 'optional']),
  status: PropTypes.oneOf(['active', 'processing', 'syncing', 'failed']),
  strings: PropTypes.object,
  style: PropTypes.object,
  uploading: PropTypes.bool,

  // List of file tags
  tags: PropTypes.array,

  thumbnail: PropTypes.string,
  thumbnailProgress: PropTypes.number,
  sequence: PropTypes.number,
  thumbnailUploading: PropTypes.bool,

  /** Repository details for a Kloudless file */
  repo: PropTypes.object,

  onAnchorClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onOptionsToggleClick: PropTypes.func,
};

FileEditItemNew.defaultProps = {
  canShare: true,
  error: null,
  progress: 0,
  shareStatus: 'optional',
  status: 'active',
  uploading: false,
  tags: [],

  strings: {
    done: 'Done',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this file?',
    cancel: 'Cancel',
    options: 'Options',
    filedescription: 'File Description',
    upload: 'Upload',
    shareStatus: 'Share Status',
    optional: 'Optional',
    mandatory: 'Mandatory',
    blocked: 'Blocked',
    update: 'Update',
    showMore: 'More',
    addTags: 'Add tags',
  }
};

export default FileEditItemNew;
