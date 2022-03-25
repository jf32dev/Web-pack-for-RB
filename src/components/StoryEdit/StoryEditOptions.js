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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';

import StoryEditSharing from 'components/StoryEditSharing/StoryEditSharing';
import StoryEditLocations from 'components/StoryEdit/StoryEditLocations';

const messages = defineMessages({
  // Sharing
  sharingTitle: { id: 'sharing', defaultMessage: 'Sharing' },
  sharingNote: { id: 'story-sharing-note', defaultMessage: 'Allows users to share the {story} and files attached via the options selected.' },

  // StoryEditSharing
  sharingPublicTitle: { id: 'story-sharing-public-title', defaultMessage: 'Allow device\'s publicly available sharing options' },
  sharingPublicNote: { id: 'story-sharing-public-note', defaultMessage: 'Allow users to share {stories} via native share methods available to their device; this includes email, social networks and other means that might be available. Note: This does not provide usage statistics or an audit trail.' },
  linkedin: { id: 'linkedin', defaultMessage: 'LinkedIn' },
  twitter: { id: 'twitter', defaultMessage: 'Twitter' },

  downloadLimitTitle: { id: 'story-sharing-download-limit-title', defaultMessage: 'Limit number of downloads per file' },
  downloadLimitNote: { id: 'story-sharing-download-limit-note', defaultMessage: 'Number of downloads allowed for each file shared, once the limit is reached the file will be unavailble for download unless shared again.' },

  downloadExpiryTitle: { id: 'story-sharing-download-expiry-title', defaultMessage: 'Expire links to files' },
  downloadExpiryNote: { id: 'story-sharing-download-expiry-note', defaultMessage: 'Number of days available to download the shared files, once reached the file will be unavailble for download unless shared again.' },

  descriptionSharingTitle: { id: 'story-share-description-title', defaultMessage: 'Description Sharing' },
  descriptionSharingNote: { id: 'story-share-description-note', defaultMessage: 'Include {story} description when sharing.' },

  days: { id: 'days', defaultMessage: 'Days' },
  downloads: { id: 'downloads', defaultMessage: 'Downloads' },

  // Password Protect
  isProtectedTitle: { id: 'story-password-protected-title', defaultMessage: 'Password Protected' },
  isProtectedNote: { id: 'story-password-protected-note', defaultMessage: 'Users must enter their Sign In password to view this {story}.' },

  // Location protect
  isGeoProtectedTitle: { id: 'story-location-restriction-title', defaultMessage: 'Restrict Location' },
  isGeoProtectedNote: { id: 'story-location-restriction-note', defaultMessage: 'Make this {story} available only from specific locations.' },

  // Annotating
  annotatingTitle: { id: 'story-annotating-title', defaultMessage: 'Allow Annotations on files' },
  annotatingNote: { id: 'story-annotating-note', defaultMessage: 'Allow others to annotate files attached to this {story}.' },

  // Notifications
  notifyTitle: { id: 'story-notify-title', defaultMessage: 'Allow Notifications' },
  notifyNote: { id: 'story-notify-note', defaultMessage: 'Allow others to be notified of activity for this {story}' },

  // Sequence
  sequenceTitle: { id: 'story-sequence-title', defaultMessage: 'Priority Sequence Ordering' },
  sequenceNote: { id: 'story-sequence-note', defaultMessage: 'Enter a number between 1 and 1000 so that it appears in the specified order when Priority sorting is applied.' },
  sequenceDescription: { id: 'story-sequence-description', defaultMessage: 'If the number is already in use by another {story}, this {story} will take priority.' },
});

const SharingOption = (props) => {
  const {
    enabled,
    readonly,
    styles,
    onChange,
    ...others
  } = props;

  return (
    <div className={styles.sharing}>
      <Checkbox
        label={props.strings.sharingTitle}
        name="sharing"
        value="sharing"
        checked={enabled}
        disabled={readonly}
        onChange={onChange}
      >
        <span aria-label={props.strings.sharingNote} className={styles.tooltip}>
          <span />
        </span>
      </Checkbox>
      {enabled && <StoryEditSharing
        readonly={readonly}
        className={styles.sharingOptions}
        {...others}
      />}
    </div>
  );
};

const ProtectedOption = (props) => {
  const { enabled, readonly, styles, strings, onChange } = props;

  return (
    <div className={styles.isProtected}>
      <Checkbox
        label={strings.isProtectedTitle}
        name="isProtected"
        value="isProtected"
        checked={enabled}
        disabled={readonly}
        onChange={onChange}
      >
        <span aria-label={props.strings.isProtectedNote} className={styles.tooltip}>
          <span />
        </span>
      </Checkbox>
    </div>
  );
};

const AnnotatingOption = (props) => {
  const { enabled, readonly, styles, strings, onChange } = props;

  return (
    <div className={styles.annotating}>
      <Checkbox
        label={strings.annotatingTitle}
        name="annotating"
        value="annotating"
        disabled={readonly}
        checked={enabled}
        onChange={onChange}
      >
        <span aria-label={props.strings.annotatingNote} className={styles.tooltip}>
          <span />
        </span>
      </Checkbox>
    </div>
  );
};

const NotifyOption = (props) => {
  const { enabled, readonly, styles, strings, onChange } = props;

  return (
    <div className={styles.notify}>
      <Checkbox
        label={strings.notifyTitle}
        name="notify"
        value="notify"
        disabled={readonly}
        checked={enabled}
        onChange={onChange}
      >
        <span aria-label={props.strings.notifyNote} className={styles.tooltip}>
          <span />
        </span>
      </Checkbox>
    </div>
  );
};

const SequenceOption = (props) => {
  const { enabled, readonly, value, styles, strings, onChange } = props;

  return (
    <div className={styles.sequence}>
      <Checkbox
        label={strings.sequenceTitle}
        name="sequence"
        value="sequence"
        disabled={readonly}
        checked={enabled}
        onChange={onChange}
      >
        <span aria-label={props.strings.sequenceNote} className={styles.tooltip}>
          <span />
        </span>
        {enabled && <div className={styles.sequenceWrapper}>
          <Text
            type="number"
            value={value}
            disabled={readonly}
            onChange={onChange}
            className={styles.sequenceInput}
            style={{ width: value > 99 ? '4.5rem' : '3.5rem' }}
          />
          <span>{props.strings.sequenceDescription}</span>
        </div>}
      </Checkbox>
    </div>
  );
};

const GeoProtectedOption = (props) => {
  const {
    enabled,
    readonly,
    geolocations,
    styles,
    strings,
    onChange,
    onAddClick,
    onItemDeleteClick
  } = props;

  return (
    <div className={styles.isGeoProtected}>
      <Checkbox
        label={strings.isGeoProtectedTitle}
        name="isGeoProtected"
        value="isGeoProtected"
        checked={enabled}
        disabled={readonly}
        onChange={onChange}
      >
        <span aria-label={props.strings.isGeoProtectedNote} className={styles.tooltip}>
          <span />
        </span>
      </Checkbox>
      {enabled && <StoryEditLocations
        geolocations={geolocations}
        readonly={readonly}
        //strings={strings}
        onAddClick={onAddClick}
        onItemDeleteClick={onItemDeleteClick}
      />}
    </div>
  );
};

export default class StoryEditOptions extends PureComponent {
  static propTypes = {
    // Sharing and related options
    sharing: PropTypes.bool,
    sharingPublic: PropTypes.bool,
    sharingLinkedinDescription: PropTypes.string,
    sharingTwitterDescription: PropTypes.string,
    sharingDownloadLimit: PropTypes.number,
    sharingDownloadExpiry: PropTypes.number,
    sharingIncludeDescription: PropTypes.bool,

    onSharingChange: PropTypes.func,

    isProtected: PropTypes.bool,
    annotating: PropTypes.bool,
    notify: PropTypes.bool,
    sequence: PropTypes.number,

    isGeoProtected: PropTypes.bool,
    geolocations: PropTypes.array,

    readonly: PropTypes.bool,

    onDeviceShareChange: PropTypes.func,
    onShareDescriptionChange: PropTypes.func,
    onShareLimitChange: PropTypes.func,

    onAnnotationsChange: PropTypes.func,
    onNotifyChange: PropTypes.func,
    onSequenceChange: PropTypes.func,

    onGeoProtectedChange: PropTypes.func,
    onLocationAddClick: PropTypes.func,
    onLocationDeleteClick: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { naming, userCapabilities } = this.context.settings;
    const {
      hasShare,
      hasDeviceShare,
      showStoryOptionAnnotations,
      showStoryOptionNotifications,
      showStoryOptionPriority,
      showStoryOptionProtected,
      showStoryOptionGeolocation,
    } = userCapabilities;
    const styles = require('./StoryEditOptions.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <div className={styles.StoryEditOptions}>
        {hasShare && <SharingOption
          enabled={this.props.sharing}
          readonly={this.props.readonly}
          styles={styles}
          strings={strings}
          sharingPublic={this.props.sharingPublic}
          sharingLinkedinDescription={this.props.sharingLinkedinDescription}
          sharingTwitterDescription={this.props.sharingTwitterDescription}
          sharingDownloadLimit={this.props.sharingDownloadLimit}
          sharingDownloadExpiry={this.props.sharingDownloadExpiry}
          sharingIncludeDescription={this.props.sharingIncludeDescription}
          onChange={this.props.onSharingChange}
          onSharingChange={this.props.onSharingChange}
          onPublicShareChange={hasDeviceShare && this.props.onPublicShareChange}
          onShareDescriptionChange={this.props.onShareDescriptionChange}
          onDownloadLimitChange={this.props.onDownloadLimitChange}
          onDownloadExpiryChange={this.props.onDownloadExpiryChange}
          onIncludeSharingDescriptionChange={this.props.onIncludeSharingDescriptionChange}
        />}
        {showStoryOptionProtected && <ProtectedOption
          enabled={this.props.isProtected}
          readonly={this.props.readonly}
          strings={strings}
          styles={styles}
          onChange={this.props.onIsProtectedChange}
        />}
        {showStoryOptionAnnotations && <AnnotatingOption
          enabled={this.props.annotating}
          readonly={this.props.readonly}
          strings={strings}
          styles={styles}
          onChange={this.props.onAnnotationsChange}
        />}
        {showStoryOptionNotifications && <NotifyOption
          enabled={this.props.notify}
          readonly={this.props.readonly}
          strings={strings}
          styles={styles}
          onChange={this.props.onNotifyChange}
        />}
        {showStoryOptionPriority && <SequenceOption
          enabled={this.props.sequence > 0}
          readonly={this.props.readonly}
          value={this.props.sequence}
          strings={strings}
          styles={styles}
          onChange={this.props.onSequenceChange}
        />}
        {showStoryOptionGeolocation && <GeoProtectedOption
          enabled={this.props.isGeoProtected}
          readonly={this.props.readonly}
          geolocations={this.props.geolocations}
          strings={strings}
          styles={styles}
          onChange={this.props.onGeoProtectedChange}
          onAddClick={this.props.onLocationAddClick}
          onItemDeleteClick={this.props.onLocationDeleteClick}
        />}
      </div>
    );
  }
}
