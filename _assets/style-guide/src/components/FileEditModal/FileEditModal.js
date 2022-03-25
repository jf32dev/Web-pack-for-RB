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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import FileMetadata from './FileMetadata';
import FileOptions from './FileOptions';
import FileTags from './FileTags';


const initialState = {
  activeSection: 'metadata',
};

const NavItem = props => {
  const { id, name, active, onClick } = props;
  const rootUrl =  location.pathname;
  const handleOnCLick = (event) => {
    onClick(event, props);
  };

  return (
    <li>
      <a
        href={rootUrl + '#' + id} title={name} onClick={handleOnCLick}
        className={active ? 'active' : null}
      >{name}</a>
    </li>
  );
};

const FileEditModal = props => {
  const {
    authString,
    id,
    canCreateCustomFileDetails,
    strings,
    onAddTags,
    onChange,
    onClose,
    onUploadClick,
    onSave
  } = props;

  const [activeSection, setActiveSection] = useState(props.activeSection || initialState.activeSection);
  const [isModified, setModified] = useState(false);
  const presentationTypes = ['btc', 'keynote', 'powerpoint'];
  const excludeWatermark = ['app', 'audio', 'web'];
  const excludeShare = ['app'];

  const isPresentation = presentationTypes.indexOf(props.category) > -1;
  const canWatermark = excludeWatermark.indexOf(props.category) === -1;
  const canShare = excludeShare.indexOf(props.category) === -1;
  const minFileExpiryTime = moment().add(1, 'hours').toDate();

  const handleSaveClick = event => {
    event.preventDefault();
    if (typeof onSave === 'function') {
      onSave();
      setModified(false);
    }
  };

  const handleInputChange = event => {
    const attributeKey = event.currentTarget.name;
    const attributeValue = event.currentTarget.value;
    setModified(true);
    if (typeof onChange === 'function') {
      onChange(event, {
        id,
        key: attributeKey,
        value: attributeValue
      });
    }
  };

  const handleCheckboxChange = event => {
    const attributeKey = event.currentTarget.name;
    const attributeValue = !!event.target.checked;
    setModified(true);
    if (typeof onChange === 'function') {
      onChange(event, {
        id,
        key: attributeKey,
        value: attributeValue
      });
    }
  };

  const handleShareChange = context => {
    setModified(true);
    if (typeof onChange === 'function') {
      onChange(event, {
        id,
        key: 'shareStatus',
        value: context.value
      });
    }
  };

  const handlePresentationSettingChange = event => {
    const attributeKey = event.currentTarget.name;
    const attributeValue = !!event.target.checked;
    setModified(true);
    if (typeof onChange === 'function') {
      onChange(event, {
        id,
        key: attributeKey,
        value: attributeValue,
        parent: 'convertSettings'
      });
    }
  };

  const handleAddTags = event => {
    if (typeof onAddTags === 'function') {
      onAddTags(event, id);
    }
  };

  const handleCancelClick = () => {
    setModified(false);
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleUploadClick = event => {
    event.preventDefault();
    setModified(true);
    onUploadClick(event, id);
  };

  const handleNavClick = (event, context) => {
    event.preventDefault();
    setActiveSection(context.id);
  };

  const handleFileExpiryChange = (timestamp, tz) => {
    setModified(true);
    onChange(undefined, {
      id,
      key: 'expiresAt',
      value: parseInt(timestamp / 1000, 10),
    });
    onChange(undefined, {
      id,
      key: 'expiresAtTz',
      value: tz,
    });
  };

  const handleFileExpiryCheck = () => {
    setModified(true);
    if (props.expiresAt) {
      // reset
      handleFileExpiryChange(0, '');
    } else {
      const fileDefaultSettings = props.fileSettings.fileDefaultSettings;
      const defaultDays = fileDefaultSettings && fileDefaultSettings.enableFilesExpireDefaults && fileDefaultSettings.filesExpireDefaultDays;
      const proposedExpiryDate = moment().add(defaultDays || 7, 'days');
      const proposedTz = moment.tz.guess();
      handleFileExpiryChange(proposedExpiryDate, proposedTz);
    }
  };

  // Available sections
  const sections = [{
    id: 'metadata',
    name: strings.metadata,
    enabled: true,
    component: (<FileMetadata
      {...props}
      {... { authString }}
      onInputChange={handleInputChange}
      onUploadClick={handleUploadClick}
    />)
  }, {
    id: 'options',
    name: strings.options,
    enabled: true,
    component: (<FileOptions
      isPresentation={isPresentation}
      canWatermark={canWatermark}
      canShare={canShare}
      onInputChange={handleInputChange}
      onCheckboxChange={handleCheckboxChange}
      onShareStatusChange={handleShareChange}
      onPresentationSettingChange={handlePresentationSettingChange}
      canCreateCustomFileDetails={canCreateCustomFileDetails}
      onFileExpiryChange={handleFileExpiryChange}
      onFileExpiryCheck={handleFileExpiryCheck}
      minFileExpiryTime={minFileExpiryTime}
      {...props}
    />)
  }, {
    id: 'tags',
    name: strings.tags,
    enabled: false,
    component: (<FileTags
      onAddTags={handleAddTags}
      {...props}
    />)
  }
  ];

  const styles = require('./FileEditModal.less');

  return (
    <Modal
      isVisible
      escClosesModal
      width="medium"
      headerChildren={<span className={styles.headerTitle}>{strings.headerTitle}</span>}
      footerChildren={(<div>
        <Btn
          alt
          large
          onClick={handleCancelClick}
          style={{ marginRight: '0.5rem' }}
          loading={props.loading}
        >
          {strings.cancel}
        </Btn>
        <Btn
          inverted
          large
          disabled={!isModified}
          onClick={handleSaveClick}
          style={{ marginLeft: '0.5rem' }}
          loading={props.loading}
        >
          {strings.save}
        </Btn>
      </div>)}
      onClose={handleCancelClick}
      bodyClassName={styles.modalBody}
      headerClassName={styles.header}
      footerClassName={styles.footer}
      fixedAutoHeight
    >
      <nav className="horizontal-nav">
        <ul>
          {sections.map(s => (s.enabled &&
            <NavItem
              key={s.id}
              active={activeSection === s.id}
              onClick={handleNavClick}
              {...s}
              fileId={id}
            />
          ))}
        </ul>
      </nav>
      <div className={styles.contentWrapper}>
        {sections.map(s => (s.enabled && activeSection === s.id &&
          <section
            key={s.id}
            data-id={s.id}
          >
            {s.component}
          </section>
        ))}
      </div>
    </Modal>
  );
};

FileEditModal.propTypes = {
  activeSection: PropTypes.oneOf(['metadata', 'options', 'tags']),
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
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  filename: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  shareStatus: PropTypes.oneOf(['blocked', 'mandatory', 'optional']),
  status: PropTypes.oneOf(['active', 'processing', 'syncing', 'failed']),
  strings: PropTypes.object,
  style: PropTypes.object,
  uploading: PropTypes.bool,

  // List of file tags
  tags: PropTypes.array,

  thumbnail: PropTypes.string,
  thumbnailProgress: PropTypes.number,
  thumbnailUploading: PropTypes.bool,

  /** Repository details for a Kloudless file */
  repo: PropTypes.object,

  onAddTags: PropTypes.func,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onUploadClick: PropTypes.func
};

FileEditModal.defaultProps = {
  name: null,
  strings: {
    headerTitle: 'File details',
    save: 'Save',
    cancel: 'Cancel',
    fileName: 'File Name',
    thumbnail: 'Thumbnail',
    replaceThumbnail: 'Replace Thumbnail',
    metadata: 'Metadata',
    options: 'Options',
    tags: 'Tags',

    fileOptions: 'File Options',
    sharing: 'Sharing',
    applyWatermark: 'Apply Watermark',
    customMetadata: 'Custom Metadata',
    customisableLabel: 'Customisable Label',
    fileExpireDate: 'File Expire Date',
    fileExpireTime: 'Schedule file expiry date & time',
    fileExpireNote: 'Set a date and time to expire this file',
    shareStatus: 'Share Status',
    allowHubShareDownloads: 'Allow HubShare Downloads',
    optional: 'Optional',
    blocked: 'Blocked',
    mandatory: 'Mandatory',
    links: 'Links',
    presentationSettings: 'Presentation Settings',
    allowBroadcast: 'Allow Broadcast',
    allowSlideReorder: 'Allow Slide Reorder',
    allowSlideHiding: 'Allow Slide Hiding',

    tagDescription: 'Applying tags to files allows others to find it later on. Create a new tag by typing it below.',
    newTag: 'New tag',
    suggestions: 'Suggestions',
    noRelatedTags: 'No Related Tags',
  }
};

export default FileEditModal;
