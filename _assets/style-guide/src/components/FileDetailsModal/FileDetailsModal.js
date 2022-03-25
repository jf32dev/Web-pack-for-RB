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

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import FileDetails from './FileDetails';

const FileDetailsModal = props => {
  const {
    authString,
    canEdit,
    fileTag,
    id,
    canCreateCustomFileDetails,
    strings,
    onAddTag,
    onAddTagToFile,
    onClose,
    onTagChange,
    onTagDeleteClick
  } = props;

  const handleAddTag = context => {
    if (typeof onAddTag === 'function') {
      onAddTag({
        name: context.name,
        fileId: id
      });
    }
  };

  const handleAddTagToFile = context => {
    if (typeof onAddTagToFile === 'function') {
      onAddTagToFile({
        tagName: context.name,
        tagId: context.id,
        fileId: id
      });
    }
  };

  const handleTagDeleteClick = context => {
    if (typeof onTagDeleteClick === 'function') {
      onTagDeleteClick({
        tagName: context.name,
        tagId: context.id,
        fileId: id
      });
    }
  };

  const handleCancelClick = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const styles = require('./FileDetailsModal.less');

  return (
    <Modal
      isVisible
      escClosesModal
      width="medium"
      headerChildren={<span className={styles.headerTitle}>{strings.fileDetails}</span>}
      footerChildren={(<div>
        <Btn
          large inverted onClick={handleCancelClick}
          loading={props.loading}
        >{strings.close}</Btn>
      </div>)}
      onClose={handleCancelClick}
      className={styles.modal}
      bodyClassName={styles.modalBody}
      headerClassName={styles.header}
      footerClassName={styles.footer}
      fixedAutoHeight
    >
      <div className={styles.contentWrapper}>
        <FileDetails
          {...props}
          {... {
            authString,
            canCreateCustomFileDetails,
            canEdit,
            fileTag,
            strings
          }}
          addTag={handleAddTag}
          onAddTagToFile={handleAddTagToFile}
          onTagChange={onTagChange}
          onTagDeleteClick={handleTagDeleteClick}
        />
      </div>
    </Modal>
  );
};

FileDetailsModal.propTypes = {
  authString: PropTypes.string,

  // Content to be displayed
  className: PropTypes.string,
  description: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  filename: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  shareStatus: PropTypes.oneOf(['blocked', 'mandatory', 'optional']),
  status: PropTypes.oneOf(['active', 'processing', 'syncing', 'failed']),
  canCreateCustomFileDetails: PropTypes.object,
  strings: PropTypes.object,
  style: PropTypes.object,

  // List of file tags
  tags: PropTypes.array,

  thumbnail: PropTypes.string,

  /** Repository details for a Kloudless file */
  repo: PropTypes.object,

  onAddTags: PropTypes.func,
  onTagChange: PropTypes.func,
  onClose: PropTypes.func,
};

FileDetailsModal.defaultProps = {
  name: null,
  strings: {
    fileDetails: 'File details',
    close: 'Close',
    tags: 'Tags',
    customMetadata: 'Custom Metadata',
    customisableLabel: 'Customisable Label',
    expiry: 'Expiry',
    shareStatus: 'Share Status',
    optional: 'Optional',
    blocked: 'Blocked',
    mandatory: 'Mandatory',
    fileType: 'File Type',
    fileSize: 'File Size',
    dateAdded: 'Date Added',
    dateModified: 'Date Modified',

    tagDescription: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.',
    newTag: 'New tag',
    suggestions: 'Suggestions',
    noRelatedTags: 'No Related Tags',
  }
};

export default FileDetailsModal;
