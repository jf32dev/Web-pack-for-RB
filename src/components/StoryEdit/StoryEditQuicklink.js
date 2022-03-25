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
import autobind from 'class-autobind';

import AddFileMenu from 'components/AddFileMenu/AddFileMenu';
import Btn from 'components/Btn/Btn';
import FileEditItem from 'components/FileEditItemNew/FileEditItemNew';
import FileEditModal from 'components/FileEditModal/FileEditModal';
import Radio from 'components/Radio/Radio';
import Text from 'components/Text/Text';

export default class StoryEditQuicklink extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['url', 'file', 'form']),
    url: PropTypes.string,
    backupUrl: PropTypes.string,
    file: PropTypes.object,

    hasQuicklink: PropTypes.bool,
    hasQuickfile: PropTypes.bool,
    hasQuickform: PropTypes.bool,

    hasCloudStorage: PropTypes.bool,

    strings: PropTypes.object,

    onTypeChange: PropTypes.func.isRequired,
    onUrlChange: PropTypes.func.isRequired,
    onAddFileClick: PropTypes.func.isRequired,
    onAddFormClick: PropTypes.func.isRequired,

    onFileOptionsToggleClick: PropTypes.func,
    onFileDeleteClick: PropTypes.func,
    onFileDescriptionChange: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onFileShareChange: PropTypes.func,
    onFilePresentationSettingChange: PropTypes.func,
    onFileWatermarkChange: PropTypes.func,
    //onFileHubshareDownloadChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    type: 'url',
    hasQuicklink: true,
    hasQuickfile: true,
    hasQuickform: true,
    strings: {
      url: 'URL',
      file: 'File',
      form: 'Form',
      backupUrl: 'Backup URL (optional)',
      urlDescription: 'URL Quicklinks are published into Channels alongside Stories and are used to access websites immediately using the built-in web browser. A backup URL can be specified if needed, e.g. local and external addresses.',
      fileDescription: 'File Quicklinks are published into Channels alongside Stories and are used for quick access to documents using the tabbed file viewer.',
      formDescription: 'Form Quicklinks are published into Channels alongside Stories and are used for quick access to Forms using the tabbed file viewer.',
      fileExpireTime: 'Schedule file expiry date & time',
      fileExpireNote: 'Set a date and time to expire this file',
      addForm: 'Add Form'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleItemClick(event) {
    const type = event.currentTarget.dataset.type;
    if (typeof this.props.onTypeChange === 'function') {
      this.props.onTypeChange(event, type);
    }
  }

  handleRadioClick(event) {
    const type = event.target.value;
    if (typeof this.props.onTypeChange === 'function') {
      this.props.onTypeChange(event, type);
    }
  }

  render() {
    const {
      authString,
      type,
      file,
      fileSettings,
      hasQuicklink,
      hasQuickfile,
      hasQuickform,
      hasCloudStorage,
      canCreateCustomFileDetails,
      strings
    } = this.props;
    const styles = require('./StoryEditQuicklink.less');

    return (
      <div className={styles.StoryEditQuicklink}>
        <ul className={styles.typeWrap}>
          {hasQuicklink && <li className={styles.url} data-type="url" onClick={this.handleItemClick}>
            <p>{strings.url}</p>
            <Radio
              name="quicklinkType"
              value="url"
              checked={type === 'url'}
              onChange={this.handleRadioClick}
            />
          </li>}
          {hasQuickfile && <li className={styles.file} data-type="file" onClick={this.handleItemClick}>
            <p>{strings.file}</p>
            <Radio
              name="quicklinkType"
              value="file"
              checked={type === 'file'}
              onChange={this.handleRadioClick}
            />
          </li>}
          {hasQuickform && <li className={styles.form} data-type="form" onClick={this.handleItemClick}>
            <p>{strings.form}</p>
            <Radio
              name="quicklinkType"
              value="form"
              checked={type === 'form'}
              onChange={this.handleRadioClick}
            />
          </li>}
        </ul>

        {type === 'url' && <div className={styles.urlOptions}>
          <p className={styles.description}>{strings.urlDescription}</p>
          <Text name="quicklinkUrl" placeholder={strings.url} value={this.props.url} onChange={this.props.onUrlChange} />
          <Text name="quicklinkBackupUrl" placeholder={strings.backupUrl} value={this.props.backupUrl} onChange={this.props.onUrlChange} />
        </div>}

        {type === 'file' && <div className={styles.fileOptions}>
          <p className={styles.description}>{strings.fileDescription}</p>
          <div className={styles.filePreview}>
            {file && <FileEditItem
              thumbSize="small"
              disableSortable
              style={{ width: '100%' }}
              onAddClick={this.props.onAddFileClick}
              onOptionsToggleClick={this.props.onFileOptionsToggleClick}
              onDeleteClick={this.props.onFileDeleteClick}
              isQuickFile
              {... {
                fileSettings,
                ...file
              }}
            />}
            {!file && <AddFileMenu
              desktop
              file
              cloud={hasCloudStorage}
              onItemClick={this.props.onAddFileClick}
              position={{ left: 0 }}
            />}
          </div>
        </div>}

        {type === 'form' && <div className={styles.formOptions}>
          <p className={styles.description}>{strings.formDescription}</p>
          <div className={styles.formPreview}>
            {file && <FileEditItem
              thumbSize="small"
              disableSortable
              style={{ width: '100%' }}
              onOptionsToggleClick={this.props.onFileOptionsToggleClick}
              onDeleteClick={this.props.onFileDeleteClick}
              isQuickFile
              {... {
                fileSettings,
                ...file
              }}
            />}
            {!file && <Btn inverted onClick={this.props.onAddFormClick}>{strings.addForm}</Btn>}
          </div>
        </div>}
        {this.props.showEditModal && <FileEditModal
          onAddTag={this.props.onAddTag}
          onChange={this.props.onFileEditChange}
          onClose={this.props.onFileOptionsToggleClick}
          onSave={this.props.onSaveClick}
          onUploadClick={this.props.onFileUploadClick}
          {...{
            authString,
            canCreateCustomFileDetails,
            fileSettings,
            strings,
            ...this.props.currentFileEditing
          }}
        />}
      </div>
    );
  }
}
