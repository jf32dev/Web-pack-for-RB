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

import React, { Fragment, useEffect, useState }  from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import filesize from 'filesize';
import moment from 'moment-timezone';

import FileThumb from 'components/FileThumb/FileThumb';
import Tags from 'components/Tags/Tags';
import take from 'lodash/take';
import _differenceBy from 'lodash/differenceBy';
import _get from 'lodash/get';

const FileDetails = props => {
  const {
    authString,
    category,
    customDetailsText,
    customDetailsIsEnabled,
    dateAdded,
    description,
    fileSettings,
    id,
    shareStatus,
    size,
    canCreateCustomFileDetails,
    strings,
    thumbnail,

    // Tags
    fileTag,
    canEdit,
    tags,
    addTag,
    onAddTagToFile,
    onTagChange,
    onTagDeleteClick,
  } = props;

  const [searchingTag, setSearchingTag] = useState('');
  const [filterTags, setFilterTags] = useState([fileTag.allTags.map(() => (tag) => tag.id)]);

  // Filter selected tags from suggestion tags
  useEffect(() => {
    setFilterTags(
      _differenceBy(fileTag.allTags, tags, (tag) => tag.id)
    );
  }, [fileTag.allTags, tags]);

  useEffect(() => {
    const newTagId = _get(fileTag, 'currentTag.id', null);
    const tagName = _get(fileTag, 'currentTag.name', null);
    const fileId = _get(fileTag, 'currentTag.fileId', null);
    const isTagDuplicated = tags.find(tag => tag.name === tagName);

    if (newTagId && fileId === id && !isTagDuplicated) {
      onAddTagToFile({
        ...fileTag.currentTag
      });
    }
  }, [fileTag.currentTag]);

  // Reset search when a new file is opened
  useEffect(() => {
    setSearchingTag('');
  }, [id]);

  const handleInputKeyDown = event => {
    // handle return clicked
    const tagName = event.target.value;
    const isExistingTag = fileTag.allTags.find(tag => tag.name === tagName);
    const isTagDuplicated = tags.find(tag => tag.name === tagName);

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) &&
      !event.shiftKey && /\S/.test(tagName) &&
      !fileTag.fileTagAdding &&
      !fileTag.saving) {
      event.preventDefault();

      if (!isExistingTag) {
        addTag({ name: tagName });
      } else if (!isTagDuplicated) {
        onAddTagToFile({
          name: tagName,
          id: isExistingTag.id
        });
      }
      setSearchingTag('');
    }
  };

  const handleTagChange = event => {
    const tagName = event.target.value;
    onTagChange(event);
    setSearchingTag(tagName);
  };

  const handleTagClick = event => {
    event.preventDefault();
    const tagName = event.currentTarget.dataset.name;
    const tagObject = fileTag.allTags.find(tag => tag.name === tagName);
    if (tagObject) {
      onAddTagToFile(tagObject);
    }
  };

  const handleTagDeleteClick = event => {
    event.preventDefault();
    const tagIndex = event.currentTarget.dataset.index;
    if (typeof onTagDeleteClick === 'function') {
      onTagDeleteClick(tags[tagIndex]);
    }
  };

  const { fileGeneralSettings } = fileSettings;
  const styles = require('./FileDetailsModal.less');

  // Thumbnail stored remotely (secure storage)
  const remoteThumb = thumbnail && thumbnail.indexOf('https://') === 0 && thumbnail.indexOf('bigtincan') > 0;

  // Don't attach authString if stored remotely
  const thumbUrl = thumbnail + (remoteThumb && authString ? authString : '');
  const urlRegexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;

  return (
    <Fragment>
      <div className={styles.thumbnail}>
        <h4>{description}</h4>
        {!thumbnail && <FileThumb
          {...props}
          thumbSize="large"
          grid
          showThumb
          className={styles.thumb}
          authString={authString}
        />}
        {thumbnail && <div className={styles.customThumbnail} style={{ backgroundImage: `url(${thumbUrl})` }} />}
      </div>
      <ul className={styles.table}>
        <li>
          <label htmlFor="category">{strings.fileType}</label>
          <p id="category">{category}</p>
        </li>
        <li>
          <label htmlFor="size">{strings.fileSize}</label>
          <p id="size">{filesize(size)}</p>
        </li>
        <li>
          <label htmlFor="shareStatus">{strings.shareStatus}</label>
          <p id="shareStatus" className={styles.statusDropdown} data-type={shareStatus}>{shareStatus}</p>
        </li>
        <li>
          <label htmlFor="dateAdded">{strings.dateModified}</label>
          <p id="dateAdded"><FormattedDate
            value={dateAdded * 1000} year="numeric" month="short"
            day="2-digit"
          /></p>
        </li>
      </ul>

      {canCreateCustomFileDetails.isEnabled && customDetailsIsEnabled && <div className={styles.fileMetadataBadge}>
        {fileGeneralSettings.detailsFieldLabel || strings.customisableLabel}
        {customDetailsText && <b>:</b>}
        {urlRegexp.test(customDetailsText) && <a target="_blank" rel="noopener noreferrer" href={customDetailsText}>{customDetailsText}</a>}
        {customDetailsText && !urlRegexp.test(customDetailsText) && <span>{customDetailsText}</span>}
      </div>}

      <h3>{strings.tags}</h3>
      <Tags
        list={tags.map(tag => tag.name)}
        onItemDeleteClick={canEdit ? handleTagDeleteClick : null}
        enableInput={canEdit}
        currentSearch={searchingTag}
        onInputKeyDown={handleInputKeyDown}
        onInputChange={handleTagChange}
      />
      {canEdit &&
      <div className={styles.suggestedTags}>
        <div className={styles.titleContainer}>
          <h5>{strings.suggestions}</h5>
        </div>
        {filterTags && filterTags.length > 0 && <Tags
          className={styles.fileTags}
          list={take(filterTags, 10).map(tag => tag.name)}
          onItemClick={handleTagClick}
        />
        }
        {filterTags && filterTags.length === 0 &&
        <div className={styles.noTag}>
          <span className={styles.tagIcon} />
          <span className={styles.noRelatedTags}>{strings.noRelatedTags}</span>
        </div>
        }
      </div>}
    </Fragment>
  );
};

FileDetails.propTypes = {
  authString: PropTypes.string,

  // Content to be displayed
  className: PropTypes.string,
  description: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  canCreateCustomFileDetails: PropTypes.object,
  strings: PropTypes.object,
  style: PropTypes.object,

  thumbnail: PropTypes.string,
};

FileDetails.defaultProps = {
  size: 0,
  dateAdded: moment().unix(),
  canEdit: true,
  canCreateCustomFileDetails: {},
  strings: {
    headerTitle: 'File Details',
    fileType: 'File Type',
    fileSize: 'File Size',
    shareStatus: 'Share Status',
    dateAdded: 'Date Added',
    expiry: 'Expiry',
    tags: 'Tags',
    tagDescription: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.',
    newTag: 'New tag',
  },
  tags: [],
};

export default FileDetails;
