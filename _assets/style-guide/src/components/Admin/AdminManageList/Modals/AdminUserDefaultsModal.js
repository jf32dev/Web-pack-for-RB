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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Modal from 'components/Modal/Modal';
import Select from 'components/Select/Select';
import TimezoneSelect from 'components/TimezoneSelect/TimezoneSelect';
import Text from 'components/Text/Text';

const messages = defineMessages({
  userDefaults: { id: 'user-defaults', defaultMessage: 'User Defaults' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  create: { id: 'create', defaultMessage: 'Create' },
  save: { id: 'save', defaultMessage: 'Save' },
  email: { id: 'email', defaultMessage: 'Email' },
  push: { id: 'push', defaultMessage: 'Push' },
  updateExistingUsers: { id: 'update-existing-users', defaultMessage: 'Update Existing Users' },
  privateActivity: { id: 'private-activity', defaultMessage: 'Private Activity' },
  enabled: { id: 'enabled', defaultMessage: 'Enabled' },

  allowUserPromoteStories: { id: 'allow-user-promote-stories', defaultMessage: 'Allow user to promote {stories}' },
  userDefaultSettings: { id: 'user-default-settings', defaultMessage: 'User Default Settings' },
  metadataAttributes: { id: 'metadata-attributes', defaultMessage: 'Metadata Attributes' },
  defaultLanguage: { id: 'default-language', defaultMessage: 'Default Language' },
  configurationBundle: { id: 'configuration-bundle', defaultMessage: 'Configuration Bundle' },
  timeZone: { id: 'time-zone', defaultMessage: 'Time Zone' },
  storyPromoting: { id: 'story-promoting', defaultMessage: '{story} Promoting' },
  allow: { id: 'allow', defaultMessage: 'Allow' },
  deny: { id: 'deny', defaultMessage: 'Deny' },
  sendDigestEmail: { id: 'send-digest-email', defaultMessage: 'Send Digest Email' },
  platform: { id: 'platform', defaultMessage: 'Platform' },
  web: { id: 'web', defaultMessage: 'Web' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  digestEmail: { id: 'digest-email', defaultMessage: 'Digest Email' },
  deviceStorageLimit: { id: 'device-storage-limit', defaultMessage: 'Device Storage Limit' },
  availableForBigtincanHub: { id: 'available-for-bigtincan-hub', defaultMessage: 'Available for Bigtincan Hub' },

  never: { id: 'never', defaultMessage: 'Never' },
  daily: { id: 'daily', defaultMessage: 'Daily' },
  weekly: { id: 'weekly', defaultMessage: 'Weekly' },
  monthly: { id: 'monthly', defaultMessage: 'Monthly' },

  doNothing: { id: 'do-nothing', defaultMessage: 'Do Nothing' },
  emailMe: { id: 'email-me', defaultMessage: 'Email me' },
  sendPushNotification: { id: 'send-push-notification', defaultMessage: 'Send me a push notification' },
  sendEmailAndPushNotifications: { id: 'send-email-push-notifications', defaultMessage: 'Send email and push notifications' },

  notifications: { id: 'notifications', defaultMessage: 'Notifications' },
  storyIPublishedCommented: { id: 'story-i-published-commented', defaultMessage: 'When a {story} I have published is commented on' },
  commentsOnStoryICommented: { id: 'coments-on-story-i-commented', defaultMessage: 'When a comment is made on a {story} I have commented on' },
  newStoryInAccessChannel: { id: 'new-story-in-access-channel', defaultMessage: 'When a new {story} is created in a {channel} I have access to' },
  updatedStoryInAccessChannel: { id: 'updated-story-in-access-channel', defaultMessage: 'When a {story} is updated in a {channel} I have access to' },
  annotationOnStoryIAccess: { id: 'annotation-on-story-i-access', defaultMessage: 'When an annotation is made on a {story} I have access to' },
  userSubscribesToMyStory: { id: 'user-subscribes-to-my-stories', defaultMessage: 'When a user subscribes to one of my {stories}' },
  subscribedContentOnly: { id: 'subscribed-content-only:', defaultMessage: 'Subscribed content only' },
  myStoryIsMarked: { id: 'story-i-published-is-marked', defaultMessage: 'When a {story} I have published is marked' },

  reportingBi: { id: 'reporting-bi', defaultMessage: 'Reporting / Business Inteligence' },
  enablePersonalReports: { id: 'personal-reports', defaultMessage: 'Personal Reports' },
  enableCompanyReports: { id: 'company-reports', defaultMessage: 'Company Reports' },
  enableAdvancedReports: { id: 'company-reports-with-private-data', defaultMessage: 'Company Reports with Private Data' },
  enableScheduledReports: { id: 'scheduled-reports', defaultMessage: 'Scheduled Reports' },

  limitCacheSize: { id: 'limit-cache-size', defaultMessage: 'Limit Cache Size' },

  platformInfo: { id: 'choose-platforms-user-gain-access-hub', defaultMessage: 'Choose the platforms from which users can gain access to the Hub.' },
  userDefaultSettingsInfo: { id: 'user-default-settings-info', defaultMessage: 'Configure default settings for new users below. You can also update settings for existing users by selecting \'Update Existing Users\' in the relevant sections.' },
  storyPromotingInfo: { id: 'story-promoting-info', defaultMessage: 'Enable this option to allow users to promote {stories}. When a {story} is promoted, users are alerted to the {story} through their device notifications system.' },
  reportingInfo: { id: 'reporting-info', defaultMessage: 'Enable the following so that user activity can be captured in Reports.' },
  deviceStorageLimitInfo: { id: 'device-storage-limit-info', defaultMessage: 'Enable the cache size limit on user\'s devices and set the size in GB. The minimum cache size is 1GB. If the cached size is larger than the space available on their device, the cache size will be reduced to fit.' },

  // Notification groups and items
  security: { id: 'security', defaultMessage: 'Security' },
  a_new_browser_login: { id: 'a-new-browser-login', defaultMessage: 'A new browser login' },
  profile_activities: { id: 'profile-activities', defaultMessage: 'Profile activities' },
  profile_activities_info: { id: 'profile-activities-info', defaultMessage: 'Notify me when others Praise or follow me' },
  others_praise_me: { id: 'others-praise-me', defaultMessage: 'Others Praise me' },
  others_follow_me: { id: 'others-follow-me', defaultMessage: 'Others follow me' },

  general_updates: { id: 'general-updates', defaultMessage: 'General updates' },
  general_updates_info: { id: 'general-updates-info', defaultMessage: 'Notify me of activity that occurs on my content' },
  forwarded_your_content: { id: 'others-forward-content-i-share', defaultMessage: 'Others forward content I share' },
  shared_content_viewed: { id: 'when-content-i-share-has-been-viewed', defaultMessage: 'When content I share has been viewed' },
  story_comment_replied: { id: 'replies-to-my-comments', defaultMessage: 'Replies to my comments' },
  my_content: { id: 'my-content', defaultMessage: 'My content' },
  my_content_info: { id: 'my-content-info', defaultMessage: 'Notify me of activity that occurs on my content' },
  story_commented_to_author: { id: 'comments-made-on-my-stories', defaultMessage: 'Comments made on my {stories}' },
  file_annotated_to_author: { id: 'annotations-on-my-files', defaultMessage: 'Annotations on my files' },
  shared_content_notify_author: { id: 'others-share-my-content', defaultMessage: 'Others share my content' },
  subscribed_story_to_author: { id: 'others-subscribe-to-my-stories', defaultMessage: 'Others subscribe to my {stories}' },
  story_flag_added: { id: 'others-flag-my-story', defaultMessage: 'Others flag my {story}' },
  broadcast_summary: { id: 'broadcast-summary', defaultMessage: 'Broadcast summary' },

  other_users_content: { id: 'other-users-content', defaultMessage: 'Other users\' content' },
  other_users_content_info: { id: 'other-users-content-info', defaultMessage: 'Notify me of activity that occurs with others\' content' },

  others_stories_are_published: { id: 'others-stories-are-published', defaultMessage: 'Others\' {stories} are published' },
  story_published_via_user_followed: { id: 'users-i-follow', defaultMessage: 'Users I follow' },
  story_published_via_channel_subscribed: { id: 'channels-i-am-subscribed-to', defaultMessage: '{channels} I am subscribed to' },
  story_published_via_channel: { id: 'channels-i-have-access-to', defaultMessage: '{channels} I have access to' },

  updates_on_others_stories: { id: 'updates-on-others-stories', defaultMessage: 'Updates on others\' {stories}' },
  story_updated_via_user_followed: { id: 'users-i-follow', defaultMessage: 'Users I follow' },
  story_updated_via_channel_subscribed: { id: 'channels-i-am-subscribed-to', defaultMessage: '{channels} I am subscribed to' },
  story_updated_via_channel: { id: 'channels-i-have-access-to', defaultMessage: '{channels} I have access to' },
  story_updated_via_story_subscribed: { id: 'stories-i-am-subscribed-to', defaultMessage: '{stories} I am subscribed to' },

  comments_on_others_stories: { id: 'comments-on-others-stories', defaultMessage: 'Comments on others\' {stories}' },
  story_commented_via_channel: { id: 'channels-i-have-access-to', defaultMessage: '{channels} I have access to' },
  story_commented_via_user_followed: { id: 'users-i-follow', defaultMessage: 'Users I follow' },
  story_commented_via_channel_subscribed: { id: 'channels-i-am-subscribed-to', defaultMessage: '{channels} I am subscribed to' },
  story_commented_via_story_subscribed: { id: 'stories-i-am-subscribed-to', defaultMessage: '{stories} I am subscribed to' },
  story_commented_via_other_comments: { id: 'new-comments-where-i-have-commented', defaultMessage: 'New comments where I have commented' },

  annotations_on_files: { id: 'annotations-on-files', defaultMessage: 'Annotations on files' },
  file_annotated_via_channel: { id: 'channels-i-have-access-to', defaultMessage: '{channels} I have access to' },
  file_annotated_via_channel_subscribed: { id: 'channels-i-am-subscribed-to', defaultMessage: '{channels} I am subscribed to' },
  file_annotated_via_story_subscribed: { id: 'stories-i-am-subscribed-to', defaultMessage: '{stories} I am subscribed to' },
  file_annotated_via_user_followed: { id: 'users-i-follow', defaultMessage: 'Users I follow' },

  shared_content_internal: { id: 'when-others-share-content-with-me', defaultMessage: 'When others share content with me' },
  story_flag_removed: { id: 'when-stories-i-flag-are-cleared', defaultMessage: 'When {stories} I flag are cleared' },
  added_to_channel: { id: 'when-others-add-me-to-their-channel', defaultMessage: 'When others add me to their {channel}' }
});

/**
 * Create/Edit user Admin modal
 */
export default class AdminUserDefaultsModal extends PureComponent {
  static propTypes = {
    notifications: PropTypes.object,
    notificationsLoading: PropTypes.bool,

    digestEmail: PropTypes.object,
    privateActivity: PropTypes.object,
    langCode: PropTypes.object,
    tz: PropTypes.object,
    sendDigestEmail: PropTypes.object,

    /** Configuration bundle selected */
    configurationBundle: PropTypes.object,
    storyPromoting: PropTypes.object,

    platform: PropTypes.object,
    //reporting: PropTypes.object,
    enablePersonalReports: PropTypes.object,
    enableCompanyReports: PropTypes.object,
    enableAdvancedReports: PropTypes.object,
    enableScheduledReports: PropTypes.object,

    languageList: PropTypes.object,
    configurationBundleList: PropTypes.array,
    digestEmailOptions: PropTypes.array,

    deviceCacheLimit: PropTypes.object,
    onToggleLimitCacheSize: PropTypes.func,
    limitCacheSizeCheckbox: PropTypes.bool,

    isVisible: PropTypes.bool,
    loading: PropTypes.bool,

    onChange: function(props) {
      if (typeof props.onChange !== 'function') {
        return new Error('onChange is required');
      }
      return null;
    },

    onClose: PropTypes.func,
    onSave: PropTypes.func
  };

  static defaultProps = {
    digestEmail: {},
    langCode: {},
    tz: {},
    platform: {
      value: {
        ios: { enabled: 0 },
        android: { enabled: 0 },
        web: { enabled: 0 },
        windows: { enabled: 0 }
      },
      update: false
    },
    enablePersonalReports: {},
    enableCompanyReports: {},
    enableAdvancedReports: {},
    enableScheduledReports: {},
    privateActivity: {},
    deviceCacheLimit: { value: null },
    limitCacheSizeCheckbox: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleLanguageChange(context) {
    this.props.onChange({
      key: 'langCode',
      value: context.id
    });
  }

  handleTzChange(context) {
    this.props.onChange({
      key: 'tz',
      value: context
    });
  }

  handleConfigurationBundleChange(context) {
    this.props.onChange({
      key: 'configurationBundle',
      value: context.id
    });
  }

  handleDigestEmailChange(context) {
    this.props.onChange({
      key: 'digestEmail',
      value: context.value
    });
  }

  handlePlatformChange(event) {
    this.props.onChange({
      key: 'platform',
      type: event.currentTarget.value,
      value: event.currentTarget.checked
    });
  }

  handleReportingChange(event) {
    let name = event.currentTarget.name;
    let attribute = '';
    if (name === 'update') {
      name = event.currentTarget.value;
      attribute = 'update';
    }

    this.props.onChange({
      key: name,
      value: event.currentTarget.checked,
      inputType: 'checkbox',
      attribute: attribute
    });
  }

  // Notifications
  handleCheckboxChange(event) {
    const {
      onChange
    } = this.props;

    if (typeof onChange === 'function') {
      let name = event.currentTarget.name;
      let attribute = '';
      if (name === 'update') {
        name = event.currentTarget.value;
        attribute = 'update';
      }

      onChange({
        key: name,
        value: event.currentTarget.checked,
        inputType: 'checkbox',
        attribute: attribute
      });
    }
  }

  handleLimitCacheSizeChange(event) {
    const {
      onChange,
      onHandleLimitCacheValueChange
    } = this.props;

    const value = event.currentTarget.value === '' ? '' : parseFloat(event.currentTarget.value);

    if (typeof onHandleLimitCacheValueChange === 'function') {
      onHandleLimitCacheValueChange(value);
    }

    if (typeof onChange === 'function') {
      const name = event.currentTarget.name === 'update' ? event.currentTarget.value : event.currentTarget.name;
      onChange({
        key: name,
        value
      });
    }
  }

  handleBlur() {
    this.props.onHandleBlur(this.props.limitCacheSizeValue, 'limitCacheSizeValue');
  }

  render() {
    const {
      privateActivity,
      digestEmail,
      tz,
      configurationBundle,
      langCode,
      storyPromoting,
      configurationBundleList,
      languageList,
      isVisible,
      limitCacheSizeValue,
      limitCacheSizeCheckbox
    } = this.props;
    const styles = require('./AdminUserDefaultsModal.less');

    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, naming);

    const languages = Object.keys(languageList).map((k) => (
      {
        id: k,
        name: languageList[k]
      }
    ));

    const digestEmailList = [
      { value: 0, label: strings.never },
      { value: 1, label: strings.daily },
      { value: 2, label: strings.weekly },
      { value: 3, label: strings.monthly },
    ];

    return (
      <Modal
        isVisible={isVisible}
        headerTitle={strings.userDefaultSettings}
        escClosesModal
        width="medium"
        footerChildren={(<div>
          <Btn
            alt large onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large loading={this.props.loading}
            onClick={this.props.onSave} style={{ marginLeft: '0.5rem' }}
          >{strings.save}</Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div>
          <div className={styles.selectWrapper}>
            <div className={styles.headerInfo}>
              <h3>{strings.userDefaultSettings}</h3>
              <p>{strings.userDefaultSettingsInfo}</p>
            </div>

            <div className={styles.fieldContainer}>
              <Select
                id="langCode"
                name="langCode"
                label={strings.defaultLanguage}
                value={{ id: langCode.value, name: languageList[langCode.value] }}
                clearable={false}
                options={languages}
                onChange={this.handleLanguageChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />

              <Checkbox
                label={strings.updateExistingUsers}
                name="update"
                value="langCode"
                checked={!!langCode.update}
                onChange={this.handleCheckboxChange}
              />
            </div>
          </div>

          <div>
            <div className={styles.fieldContainer}>
              <div>
                <label htmlFor="tz">{strings.timeZone}</label>
                <TimezoneSelect
                  name="tz"
                  value={tz.value}
                  onChange={this.handleTzChange}
                  className={styles.select}
                />
              </div>
              <Checkbox
                label={strings.updateExistingUsers}
                name="update"
                value="tz"
                checked={!!tz.update}
                onChange={this.handleCheckboxChange}
              />
            </div>
          </div>

          <div className={styles.fieldContainer}>
            <Select
              id="digestEmail"
              name="digestEmail"
              label={strings.digestEmail}
              value={digestEmail ? digestEmail.value : 0}
              clearable={false}
              options={digestEmailList}
              onChange={this.handleDigestEmailChange}
              className={styles.select}
              valueKey="value"
              labelKey="label"
            />

            <Checkbox
              label={strings.updateExistingUsers}
              name="update"
              value="digestEmail"
              checked={!!digestEmail.update}
              onChange={this.handleCheckboxChange}
            />
          </div>

          <div className={styles.fieldContainer}>
            <Select
              id="configurationBundle"
              name="configurationBundle"
              label={strings.configurationBundle}
              value={configurationBundle ? configurationBundle.value : 0}
              clearable={false}
              options={configurationBundleList}
              onChange={this.handleConfigurationBundleChange}
              className={styles.select}
              valueKey="id"
              labelKey="name"
            />

            <Checkbox
              label={strings.updateExistingUsers}
              name="update"
              value="configurationBundle"
              checked={!!configurationBundle.update}
              onChange={this.handleCheckboxChange}
            />
          </div>

          <div className={styles.fieldContainer}>
            <div>
              <label htmlFor="privateActivity">{strings.privateActivity}</label>
              <Checkbox
                label={strings.enabled}
                name="privateActivity"
                value={1}
                checked={!!privateActivity.value}
                onChange={this.handleCheckboxChange}
              />
            </div>
            <Checkbox
              label={strings.updateExistingUsers}
              name="update"
              value="privateActivity"
              checked={!!privateActivity.update}
              onChange={this.handleCheckboxChange}
            />
          </div>

          <div className={styles.fieldContainer}>
            <div>
              <label htmlFor="storyPromoting">{strings.storyPromoting}</label>
              <p className={styles.info}>{strings.storyPromotingInfo}</p>
              <Checkbox
                label={strings.allowUserPromoteStories}
                name="storyPromoting"
                value={1}
                checked={!!storyPromoting.value}
                onChange={this.handleCheckboxChange}
              />
            </div>
            <Checkbox
              label={strings.updateExistingUsers}
              name="update"
              value="storyPromoting"
              checked={!!storyPromoting.update}
              onChange={this.handleCheckboxChange}
            />
          </div>

          <div className={styles.fieldContainer}>
            <div className={styles.reportWrap}>
              <label>{strings.reportingBi}</label>
              <p className={styles.info}>{strings.reportingInfo}</p>
              <div className={styles.reportCheckboxes}>
                <div className={styles.checkboxGroupWrap} style={{ flex: '1 0' }}>
                  <Checkbox
                    label={strings.enablePersonalReports}
                    name="enablePersonalReports"
                    value="enablePersonalReports"
                    checked={!!this.props.enablePersonalReports.value}
                    onChange={this.handleReportingChange}
                  />

                  <Checkbox
                    label={strings.enableCompanyReports}
                    name="enableCompanyReports"
                    value="enableCompanyReports"
                    checked={!!this.props.enableCompanyReports.value || !!this.props.enableScheduledReports.value || !!this.props.enableAdvancedReports.value}
                    onChange={this.handleReportingChange}
                  />

                  <Checkbox
                    label={strings.enableAdvancedReports}
                    name="enableAdvancedReports"
                    value="enableAdvancedReports"
                    checked={!!this.props.enableAdvancedReports.value}
                    style={{ marginLeft: '1.2rem' }}
                    onChange={this.handleReportingChange}
                  />

                  <Checkbox
                    label={strings.enableScheduledReports}
                    name="enableScheduledReports"
                    value="enableScheduledReports"
                    checked={!!this.props.enableScheduledReports.value}
                    style={{ marginLeft: '1.2rem' }}
                    onChange={this.handleReportingChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.fieldContainer}>
            <div>
              <label>{strings.platform}</label>
              <p className={styles.info}>{strings.platformInfo}</p>
              <div className={styles.twoColumns}>
                <Checkbox
                  label="iOS"
                  name="platform"
                  value="ios"
                  checked={!!this.props.platform.value.ios.enabled}
                  onChange={this.handlePlatformChange}
                />

                <Checkbox
                  label={strings.web}
                  name="platform"
                  value="web"
                  checked={!!this.props.platform.value.web.enabled}
                  onChange={this.handlePlatformChange}
                />

                <Checkbox
                  label="Android"
                  name="platform"
                  value="android"
                  checked={!!this.props.platform.value.android.enabled}
                  onChange={this.handlePlatformChange}
                />

                <Checkbox
                  label="Windows"
                  name="platform"
                  value="windows"
                  checked={!!this.props.platform.value.windows.enabled}
                  onChange={this.handlePlatformChange}
                />
              </div>
            </div>
            <Checkbox
              label={strings.updateExistingUsers}
              name="update"
              value="platform"
              checked={!!this.props.platform.update}
              onChange={this.handleCheckboxChange}
            />
          </div>
          <div className={styles.fieldContainer}>
            <div className={styles.deviceCacheLimit}>
              <label>{strings.deviceStorageLimit}</label>
              <p className={styles.info}>{strings.deviceStorageLimitInfo}</p>
              <Checkbox
                label={strings.limitCacheSize}
                name="toggleDeviceCacheLimit"
                value="deviceCacheLimit"
                checked={limitCacheSizeCheckbox}
                onChange={this.props.onToggleLimitCacheSize}
                style={{ marginBottom: '0.75rem' }}
              />
              {limitCacheSizeCheckbox && <p>{strings.availableForBigtincanHub}</p>}
              {limitCacheSizeCheckbox && <Text
                id="deviceCacheLimit"
                inline
                name="deviceCacheLimit"
                width="4.25rem"
                type="number"
                value={limitCacheSizeValue}
                onChange={this.handleLimitCacheSizeChange}
                onBlur={this.handleBlur}
              />}
              {limitCacheSizeCheckbox && <span className={styles.textInlineLabel}>GB</span>}
            </div>
            <Checkbox
              label={strings.updateExistingUsers}
              name="update"
              value="deviceCacheLimit"
              onChange={this.handleCheckboxChange}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
