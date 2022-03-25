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

import React, { Fragment }  from 'react';
import PropTypes from 'prop-types';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';
import Select from 'components/Select/Select';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';

const ExpiryTimeOption = (props) => {
  const {
    expiresAt,
    expiresAtTz,
    strings,
    styles,
    onChange,
    onToggle,
    minFileExpiryTime
  } = props;

  //if publishAt time set then the min expireDate should be publishtime + 30 min otherwise current date
  return (
    <div data-id="fileExpiryTime" className={styles.expiryTime}>
      <Checkbox
        label={strings.fileExpireTime}
        name="hasFileExpiryTime"
        checked={!!expiresAt}
        onChange={onToggle}
      />
      {!!expiresAt && <div className={styles.expiryTimeSettings}>
        <p className={styles.note}>{strings.fileExpireNote}</p>
        <div className={styles.expireTimeContainer}>
          <DateTimePicker
            datetime={expiresAt * 1000}
            tz={expiresAtTz}
            min={minFileExpiryTime}
            onChange={onChange}
          />
        </div>
      </div>}
    </div>
  );
};


const FileOptions = props => {
  const {
    allowHubshareDownloads,
    canShare,
    category,
    canWatermark,
    convertSettings,
    customDetailsIsEnabled,
    customDetailsText,
    fileSettings,
    hasWatermark,
    isNew,
    isPresentation,
    shareStatus,
    sourceUrl,
    canCreateCustomFileDetails,
    strings,
    url,

    onCheckboxChange,
    onInputChange,

    onFileExpiryChange,
    onFileExpiryCheck,
    expiresAt,
    expiresAtTz,
    minFileExpiryTime,

    onAnchorClick,
    onShareStatusChange,
    onPresentationSettingChange,
  } = props;

  const { fileGeneralSettings } = fileSettings;
  const {
    show_custom_text_input_field,
  } = canCreateCustomFileDetails.children;

  // Mutate event with default http:// prepended if no protocol is set
  const handleSourceUrlBlur = (event) => {
    const value = event.target.value;
    if (value && value.indexOf('://') === -1) {
      event.target.value = 'http://' + value;  // eslint-disable-line no-param-reassign
      onInputChange(event);
    }
  };

  const shareStatusList = [
    { value: 'optional', label: strings.optional },
    { value: 'mandatory', label: strings.mandatory },
    { value: 'blocked', label: strings.blocked }
  ];
  const styles = require('./FileEditModal.less');

  return (
    <Fragment>
      {category === 'web' && <section className={styles.sectionsForm}>
        <h3>{strings.links}</h3>
        <span className={styles.sourceUrl}>
          {!isNew && <a
            href={sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onAnchorClick}
          >
            {sourceUrl}
          </a>}
          {isNew && !url && <Text
            id="sourceUrl"
            name="sourceUrl"
            placeholder="https://www.example.com/"
            inline
            value={sourceUrl}
            className={styles.inputClass}
            onChange={onInputChange}
            onBlur={handleSourceUrlBlur}
          />}
        </span>
      </section>}
      <section className={styles.sectionsForm}>
        <h3>{strings.fileOptions}</h3>
        {canWatermark && <Checkbox
          label={strings.applyWatermark}
          name="hasWatermark"
          checked={!!hasWatermark}
          onChange={onCheckboxChange}
        />}
        {canCreateCustomFileDetails.isEnabled && <Fragment>
          <Checkbox
            label={fileGeneralSettings.detailsFieldLabel || strings.customisableLabel}
            name="customDetailsIsEnabled"
            checked={!!customDetailsIsEnabled}
            onChange={onCheckboxChange}
          />
          {show_custom_text_input_field && <Text
            id="customDetailsText"
            name="customDetailsText"
            inline
            placeholder={fileGeneralSettings.hintText}
            value={customDetailsText}
            className={styles.inputClass}
            onChange={onInputChange}
          />}
        </Fragment>}
        <ExpiryTimeOption
          expiresAt={expiresAt}
          expiresAtTz={expiresAtTz}
          strings={strings}
          styles={styles}
          onChange={onFileExpiryChange}
          onToggle={onFileExpiryCheck}
          minFileExpiryTime={minFileExpiryTime}
        />
      </section>
      {canShare && <section className={styles.sectionsForm}>
        <h3>{strings.sharing}</h3>
        <Select
          className={styles.dropdown}
          id="shareStatus"
          name="shareStatus"
          label={strings.shareStatus}
          value={shareStatus}
          searchable={false}
          clearable={false}
          options={shareStatusList}
          valueComponent={(option) => (
            <span className="Select-value">
              <span className={styles.statusDropdown} data-type={option.value.value}>{option.value.label}</span>
            </span>
          )}
          //optionRenderer={(items) => (<span>{items}</span>)}
          onChange={onShareStatusChange}
        />
        <Checkbox
          name="allowHubshareDownloads"
          label={strings.allowHubShareDownloads}
          checked={!!allowHubshareDownloads}
          onChange={onCheckboxChange}
        />
      </section>}
      {(isPresentation || category === 'folder') && <section className={styles.sectionsForm}>
        <h3>{strings.presentationSettings}</h3>
        <Checkbox
          name="allowLiveBroadcast"
          label={strings.allowBroadcast}
          checked={convertSettings.allowLiveBroadcast}
          value="allowLiveBroadcast"
          onChange={onPresentationSettingChange}
        />
        <Checkbox
          name="allowSorter"
          label={strings.allowSlideReorder}
          checked={convertSettings.allowSorter}
          value="allowSorter"
          onChange={onPresentationSettingChange}
        />
        <Checkbox
          name="allowHideSlide"
          label={strings.allowSlideHiding}
          checked={convertSettings.allowHideSlide}
          value="allowHideSlide"
          onChange={onPresentationSettingChange}
        />
      </section>}

    </Fragment>
  );
};

FileOptions.propTypes = {
  allowHubshareDownloads: PropTypes.bool,
  canShare: PropTypes.bool,
  canWatermark: PropTypes.bool,
  className: PropTypes.string,
  fileSettings: PropTypes.object,
  hasWatermark: PropTypes.bool,
  convertSettings: PropTypes.object,
  customMetadataEnabled: PropTypes.bool,
  customMetadataField: PropTypes.string,
  fileExpiryDate: PropTypes.number,
  expiresAt: PropTypes.number,
  expiresAtTz: PropTypes.string,
  fileExpireTime: PropTypes.string,
  fileExpireNote: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isPresentation: PropTypes.bool,
  shareStatus: PropTypes.string,
  strings: PropTypes.object,
  style: PropTypes.object,
  onCheckboxChange: PropTypes.func,
  onInputChange: PropTypes.func
};

FileOptions.defaultProps = {
  customDetailsText: '',
  strings: {
    fileOptions: 'File Options',
    sharing: 'Sharing',
    applyWatermark: 'Apply Watermark',
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
  }
};

export default FileOptions;
