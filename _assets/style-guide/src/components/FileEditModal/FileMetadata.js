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

import React  from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

import Btn from 'components/Btn/Btn';
import FileThumb from 'components/FileThumb/FileThumb';
import Text from 'components/Text/Text';
import { FormattedDate } from 'react-intl';
import moment from 'moment-timezone';


const FileMetadata = props => {
  const {
    authString,
    category,
    dateAdded,
    description,
    id,
    size,
    strings,
    thumbnail,

    onInputChange,
    onUploadClick,
  } = props;

  const styles = require('./FileEditModal.less');

  const handleUploadClick = event => {
    event.preventDefault();
    onUploadClick(event, id);
  };

  // Thumbnail stored remotely (secure storage)
  const remoteThumb = thumbnail && thumbnail.indexOf('https://') === 0 && thumbnail.indexOf('bigtincan') > 0;

  // Don't attach authString if stored remotely
  const thumbUrl = thumbnail + (remoteThumb ? authString : '');

  return (
    <div>
      <h3>{strings.fileName}</h3>
      <Text
        id="description"
        name="description"
        inline
        value={description}
        className={styles.inputClass}
        onChange={onInputChange}
      />
      <div className={styles.editThumbnail}>
        <h3>{strings.thumbnail}</h3>
        {!thumbnail && <FileThumb
          {...props}
          thumbSize="large"
          grid
          showThumb
          className={styles.thumb}
          authString={authString}
        />}
        {thumbnail && <div className={styles.customThumbnail} style={{ backgroundImage: `url(${thumbUrl})` }} />}
        <div>
          {category === 'folder' && <div className={styles.folderNote}>
            <p>{strings.folderNote}</p>
          </div>}
          {category !== 'folder' && category !== 'form' && <div className={styles.customThumbBtn}>
            <Btn
              borderless
              data-id="file-thumb-upload"
              onClick={handleUploadClick}
            >
              {strings.replaceThumbnail}
            </Btn>
          </div>}
        </div>
      </div>
      <ul className={styles.table}>
        <li>
          <label htmlFor="category">{strings.fileType}</label>
          <p id="category">{category}</p>
        </li>
        <li>
          <label htmlFor="category">{strings.fileSize}</label>
          <p id="category">{filesize(size)}</p>
        </li>
        <li>
          <label htmlFor="category">{strings.dateModified}</label>
          <p id="category"><FormattedDate
            value={dateAdded * 1000} year="numeric" month="short"
            day="2-digit"
          /></p>
        </li>
      </ul>
    </div>
  );
};

FileMetadata.propTypes = {
  authString: PropTypes.string,

  // Content to be displayed
  className: PropTypes.string,
  description: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  strings: PropTypes.object,
  style: PropTypes.object,

  thumbnail: PropTypes.string,

  onInputChange: function(props) {
    if (typeof props.onInputChange !== 'function') {
      return new Error('onInputChange is required');
    }
    return null;
  },
  onUploadClick: PropTypes.func,
};

FileMetadata.defaultProps = {
  size: 0,
  dateAdded: moment().unix(),
  strings: {
    headerTitle: 'File details',
    fileName: 'File Name',
    thumbnail: 'Thumbnail',
    replaceThumbnail: 'Replace Thumbnail',
  }
};

export default FileMetadata;
