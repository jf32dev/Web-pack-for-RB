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

import groupBy from 'lodash/groupBy';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { Accordion } from 'components';
import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';
import Select from 'react-select';

const messages = defineMessages({
  'name': { id: 'name', defaultMessage: 'Name' },
  'description': { id: 'description', defaultMessage: 'Description' },
  'details': { id: 'details', defaultMessage: 'Details' },
  'detailsInfo': { id: 'details-conf-bundle-info', defaultMessage: 'Add a name and description for this config bundle' },
  'channel_subscribe': { id: 'subscribing', defaultMessage: 'Subscribing' },
  'channel_subscribeInfo': { id: 'allow-users-to-subscribe-to-channels', defaultMessage: 'Allow users to subscribe to {channels}' },
  'show_hidden_channel_toggle': { id: 'hidden-channels', defaultMessage: 'Hidden {channels}' },
  'show_hidden_channel_toggleInfo': { id: 'allow-users-to-view-hidden-channels', defaultMessage: 'Allow user to view hidden {channels}' },
  'has_open_in': { id: 'allow-open-in', defaultMessage: 'Allow open in' },
  'has_open_inInfo': { id: 'allow-users-to-open-content-in-other-applications', defaultMessage: 'Allow users to open content in other applications' },
  'has_copy_file_viewer': { id: 'can-copy-text-in-viewers', defaultMessage: 'Can copy text in viewers' },
  'has_copy_file_viewerInfo': { id: 'can-copy-text-in-viewers-info', defaultMessage: 'Allow users to use iOS copy-paste functionality to copy text in file viewer' },
  'has_device_browser_restrictions': { id: 'enforce-device-browser-restrictions', defaultMessage: 'Enforce device browser restrictions' },
  'has_device_browser_restrictionsInfo': { id: 'device-browser-restriction-info', defaultMessage: 'Apply browsing restrictions by allowing websites to be denylisted or allowlisted' },
  'force_download_subscribed_only': { id: 'automatically-download-content-user-subscribed-to', defaultMessage: 'Automatically download content the user has subscribed to' },
  'force_download_subscribed_onlyInfo': { id: 'download-subscribed-content-only-info', defaultMessage: 'Only content which the user has subscribed to will be downloaded' },
  'has_android_file_encryption': { id: 'require-android-file-encryption', defaultMessage: 'Require Android file encryption' },
  'has_android_file_encryptionInfo': { id: 'require-android-file-encryption-info', defaultMessage: 'Only content which the user has subscribed to will be downloaded' },
  'cellular_download_max': { id: 'cellular-download-limit', defaultMessage: 'Cellular download limit (MB)' },
  'cellular_download_maxInfo': { id: 'apply-maximum-download-restrictions', defaultMessage: 'Apply maximum download restrictions' },
  'wifi_download_max': { id: 'wifi-download-limit', defaultMessage: 'WiFi download limit (MB)' },
  'wifi_download_maxInfo': { id: 'apply-maximum-wifi-download-restrictions', defaultMessage: 'Apply maximum WiFi download restrictions' },
  'user_lock_screen_timeout': { id: 'inactivity-lock-timeout', defaultMessage: 'Inactivity lock timeout' },
  'user_lock_screen_timeoutInfo': { id: 'inactivity-lock-timeoutInfo', defaultMessage: 'Set a period of time before the user\'s device is locked' },
  'inactivity_lock_type': { id: 'inactivity-lock-type', defaultMessage: 'Inactivity lock type' },
  'inactivity_lock_typeInfo': { id: 'inactivity-lock-type', defaultMessage: 'Inactivity lock type' },
  'has_interest_areas': { id: 'interest-areas', defaultMessage: 'Interest Areas' },
  'has_interest_areasInfo': { id: 'enable-interest-areas', defaultMessage: 'Enable interest areas' },
  'has_leaderboard': { id: 'leaderboard', defaultMessage: 'Leaderboard' },
  'has_leaderboardInfo': { id: 'enable-leaderboard-feature', defaultMessage: 'Enable leaderboard feature' },
  'has_logout': { id: 'logout', defaultMessage: 'Logout' },
  'has_logoutInfo': { id: 'logout-info', defaultMessage: 'Allow users to log out of Bigtincan Hub' },
  'has_meetings': { id: 'meetings', defaultMessage: 'Meetings' },
  'has_meetingsInfo': { id: 'enable-meetings', defaultMessage: 'Enable meetings' },
  'has_my_files': { id: 'my-files', defaultMessage: 'My Files' },
  'has_my_filesInfo': { id: 'enable-my-files-feature', defaultMessage: 'Enable Bigtincan Hub My Files feature' },
  'has_notes': { id: 'notes', defaultMessage: 'Notes' },
  'has_notesInfo': { id: 'enable-notes', defaultMessage: 'Enable notes' },
  'has_people': { id: 'people', defaultMessage: 'People' },
  'has_peoplehas_notesInfo': { id: 'enable-people-feature', defaultMessage: 'Enable Bigtincan Hub People feature' },
  'has_personal_content': { id: 'personal-content', defaultMessage: 'Personal content' },
  'has_personal_contentInfo': { id: 'enable-personal-content', defaultMessage: 'Enable personal content' },
  'has_search': { id: 'search', defaultMessage: 'Search' },
  'has_searchInfo': { id: 'enable-search-feature', defaultMessage: 'Enable Bigtincan Hub Search feature' },
  'has_settings': { id: 'settings', defaultMessage: 'Settings' },
  'has_settingsInfo': { id: 'enable-bigtincan-hub-settings', defaultMessage: 'Enable Bigtincan Hub Settings' },
  'show_annotation_tool': { id: 'show-btc-annotation-tool', defaultMessage: 'Show BTC annotation tool' },
  'show_annotation_toolInfo': { id: 'show-the-annotation-option-in-the-ui', defaultMessage: 'Show the annotation option in the UI' },
  'show_related_stories': { id: 'show-related-stories', defaultMessage: 'Show Related {stories}' },
  'show_related_storiesInfo': { id: 'show-related-stories', defaultMessage: 'Show Related {stories}' },
  'has_text_chat': { id: 'chat', defaultMessage: 'Chat' },
  'has_text_chatInfo': { id: 'enable-text-chat', defaultMessage: 'Enable text chat' },
  'has_top_people': { id: 'my-top-people', defaultMessage: 'My Top People' },
  'has_top_peopleInfo': { id: 'enable-top-people-feature', defaultMessage: 'Enable top people feature' },
  'has_web_tabs': { id: 'web', defaultMessage: 'Web' },
  'has_web_tabsInfo': { id: 'enable-bigtincan-hub-web-tabs-feature', defaultMessage: 'Enable Bigtincan Hub Web {tabs} feature' },
  'webapp_home_screen_tab': { id: 'home-screen', defaultMessage: 'Home screen' },
  'webapp_home_screen_tabInfo': { id: 'home-screen-tab-to-be-shown-when-logging-in', defaultMessage: 'Home screen tab to be shown when logging in' },
  'webapp_v5_landing_page': { id: 'landing-page', defaultMessage: 'Landing page' },
  'webapp_v5_landing_pageInfo': { id: 'landing-page-to-be-shown-after-logging-in', defaultMessage: 'Landing page to be shown after logging in' },
  'show_story_score': { id: 'story-badges', defaultMessage: '{story} badges' },
  'show_story_scoreInfo': { id: 'show-story-badges', defaultMessage: 'Show {story} badges' },
  'show_user_badges': { id: 'user-badges', defaultMessage: 'User badges' },
  'show_user_badgesInfo': { id: 'show-user-badges', defaultMessage: 'Show user badges' },
  'has_cloud_storage': { id: 'cloud-storage', defaultMessage: 'Cloud Storage' },
  'has_cloud_storageInfo': { id: 'allow-users-to-use-cloud-storage', defaultMessage: 'Allow users to use Cloud Storage' },
  'crm_integration': { id: 'crm-integration', defaultMessage: 'CRM Integration' },
  'crm_integrationInfo': { id: 'select-to-enable-crm-integration-for-this-bundle', defaultMessage: 'Select to enable CRM Integration for this bundle' },
  'is_javascript_bridge_enabled': { id: 'javaScript-bridge', defaultMessage: 'JavaScript bridge' },
  'is_javascript_bridge_enabledInfo': { id: 'enable-javaScript-bridge-info', defaultMessage: 'Enable to allow developers to use JavaScript bridge API' },
  'story_author_delete_only': { id: 'enable-author-only-delete', defaultMessage: 'Enable author-only delete' },
  'story_author_delete_onlyInfo': { id: 'author-delete-only-info', defaultMessage: 'Enable author-only delete so that only the author of the {story} can delete it' },
  'story_author_edit_only': { id: 'enable-author-only-edit', defaultMessage: 'Enable author-only edit' },
  'story_author_edit_onlyInfo': { id: 'author-edit-only-info', defaultMessage: 'Enable author-only edit so that only the author of the {story} can edit it' },
  'story_can_alias': { id: 'can-create-story-alias', defaultMessage: 'Can create {story} alias' },
  'story_can_aliasInfo': { id: 'allow-users-to-create-story-aliases', defaultMessage: 'Allow users to create {story} aliases' },
  'story_can_comment': { id: 'can-comment', defaultMessage: 'Can comment' },
  'story_can_commentInfo': { id: 'allow-users-to-comment-on-stories', defaultMessage: 'Allow users to comment on {stories}' },
  'story_can_copy': { id: 'can-copy-to-other-channels', defaultMessage: 'Can copy to other {channels}' },
  'story_can_copyInfo': { id: 'allow-users-to-copy-stories-to-other-channels', defaultMessage: 'Allow users to copy {stories} to other {channels}' },
  'story_can_copy_description': { id: 'can-copy-description', defaultMessage: 'Can copy description' },
  'story_can_copy_descriptionInfo': { id: 'can-copy-description-info', defaultMessage: 'Allow users to copy {story} descriptions using default iOS copy-paste functionality' },
  'story_can_create': { id: 'can-create-stories', defaultMessage: 'Can create {stories}' },
  'story_can_createInfo': { id: 'allow-users-to-create-stories', defaultMessage: 'Allow users to create {stories}' },
  'story_opt_quick_file': { id: 'can-create-quickfile', defaultMessage: 'Can create Quickfile' },
  'story_opt_quick_fileInfo': { id: 'can-create-quickfile-info', defaultMessage: 'Allow users to create Quick file {stories}. Quick file {stories} act as links to files, which can be opened direct from the {story}' },
  'story_opt_quick_form': { id: 'can-create-quickform', defaultMessage: 'Can create Quickform' },
  'story_opt_quick_formInfo': { id: 'can-create-quickform-info', defaultMessage: 'Allow users to create Quickform {stories}. Quickform {stories} act as links to forms, which can be opened directly from the {story}' },
  'story_opt_quick_link': { id: 'can-create-quicklink', defaultMessage: 'Can create Quicklink' },
  'story_opt_quick_linkInfo': { id: 'can-create-quicklink-info', defaultMessage: 'Allow users to create Quick link {stories}. This allows users to open a link direct from the {story}' },
  'story_can_delete': { id: 'can-delete-stories', defaultMessage: 'Can delete {stories}' },
  'story_can_deleteInfo': { id: 'allow-users-to-delete-stories', defaultMessage: 'Allow users to delete {stories}' },
  'story_can_edit': { id: 'can-edit-stories', defaultMessage: 'Can edit {stories}' },
  'story_can_editInfo': { id: 'allow-users-to-edit-stories', defaultMessage: 'Allow users to edit {stories}' },
  'story_can_edit_options': { id: 'can-edit-stories-options', defaultMessage: 'Can edit {stories} options' },
  'story_can_edit_optionsInfo': { id: 'allow-users-to-adjust-story-options', defaultMessage: 'Allow users to adjust {story} options' },
  'story_can_flag': { id: 'can-flag-stories', defaultMessage: 'Can flag {stories}' },
  'story_can_flagInfo': { id: 'allow-users-to-flag-a-story', defaultMessage: 'Allow users to flag a {story}' },
  'story_can_like': { id: 'can-like-rate-stories', defaultMessage: 'Can like / rate {stories}' },
  'story_can_likeInfo': { id: 'allow-users-to-like-rate-stories', defaultMessage: 'Allow users to like/ rate {stories}' },
  'story_can_sort': { id: 'can-sort-stories', defaultMessage: 'Can sort {stories}' },
  'story_can_sortInfo': { id: 'can-sort-stories-info', defaultMessage: 'Allow users to use the sort feature which orders {stories} in a specified way' },
  'story_can_subscribe': { id: 'can-subscribe-to-stories', defaultMessage: 'Can subscribe to {stories}' },
  'story_can_subscribeInfo': { id: 'allow-users-to-subscribe-to-stories', defaultMessage: 'Allow users to subscribe to {stories}' },
  'story_opt_web_file': { id: 'attach-file-web-link', defaultMessage: 'Attach file web link' },
  'story_opt_web_fileInfo': { id: 'attach-file-web-link-info', defaultMessage: 'Allow users to attach a link to a webpage as a HTML file in {stories}' },
  'story_opt_annotations': { id: 'allow-annotations-on-files', defaultMessage: 'Allow Annotations on files' },
  'story_opt_annotationsInfo': { id: 'allow-users-to-use-annotations-for-content', defaultMessage: 'Allow users to use annotations for content' },
  'story_opt_events': { id: 'add-events-to-stories', defaultMessage: 'Add Events to {stories}' },
  'story_opt_eventsInfo': { id: 'allow-users-to-add-events-to-stories', defaultMessage: 'Allow users to add Events to {stories}' },
  'story_opt_expiry': { id: 'schedule-expiry-story', defaultMessage: 'Schedule Expiry {story}' },
  'story_opt_expiryInfo': { id: 'schedule-expiry-story-info', defaultMessage: 'Allow users to set expiry dates for {stories}. The expiry date means {stories} are no longer available after the specified date' },
  'story_opt_featured_dates': { id: 'schedule-featured-story', defaultMessage: 'Schedule Featured {story}' },
  'story_opt_featured_datesInfo': { id: 'schedule-featured-story-info', defaultMessage: 'Allow users to set the featured dates for a {story}' },
  'story_opt_location_constraints': { id: 'set-location-restrictions', defaultMessage: 'Set Location Restrictions' },
  'story_opt_location_constraintsInfo': { id: 'location-constraints-info', defaultMessage: 'Allow users to specify a specific area in which their {story} can be accessed' },
  'story_opt_notifications': { id: 'allow-notifications', defaultMessage: 'Allow Notifications' },
  'story_opt_notificationsInfo': { id: 'notifications-info', defaultMessage: 'Allow users to set notifications for when {stories} have been updated, changed or edited' },
  'story_opt_priority': { id: 'enable-priority-sequence-ordering', defaultMessage: 'Enable Priority Sequence Ordering' },
  'story_opt_priorityInfo': { id: 'allow-users-to-specify-the-priority-of-a-story', defaultMessage: 'Allow users to specify the priority of a {story}' },
  'story_opt_protected': { id: 'password-protect-stories', defaultMessage: 'Password protect {stories}' },
  'story_opt_protectedInfo': { id: 'password-protect-stories-info', defaultMessage: 'Allow users to set a password for their {stories} so that it can only by viewed once a user password has been inputted' },
  'story_opt_publish_date': { id: 'schedule-publishing-time', defaultMessage: 'Schedule Publishing Time' },
  'story_opt_publish_dateInfo': { id: 'schedule-publishing-time-info', defaultMessage: 'Allow users to set the publish date for a {story}' },
  'story_opt_tags': { id: 'add-tags-to-stories', defaultMessage: 'Add Tags to {stories}' },
  'story_opt_tagsInfo': { id: 'allow-users-to-add-tags-to-stories', defaultMessage: 'Allow users to add Tags to {stories}' },
  'story_share_optional_files_attached': { id: 'attach-optional-files-automatically', defaultMessage: 'Attach optional files automatically' },
  'story_share_optional_files_attachedInfo': { id: 'attach-optional-files-automatically-info', defaultMessage: 'Set whether optional files should be attached to a {story} share by default' },
  'story_share_email': { id: 'enable-native-device-sharing', defaultMessage: 'Enable Native device sharing' },
  'story_share_emailInfo': { id: 'enable-native-device-sharing-info', defaultMessage: 'Allow users to share {stories} through email' },
  'story_share_server': { id: 'share-with-audit', defaultMessage: 'Share with Audit' },
  'story_share_serverInfo': { id: 'allow-users-to-share-stories-through-hubshare', defaultMessage: 'Allow users to share {stories} through HubShare' },

  // options
  'forms': { id: 'forms', defaultMessage: 'Forms' },
  'archive': { id: 'archive', defaultMessage: 'Archive' },
  'me': { id: 'me', defaultMessage: 'Me' },
  'activity': { id: 'activity', defaultMessage: 'Activity' },
  'chat': { id: 'chat', defaultMessage: 'Chat' },
  'content': { id: 'content', defaultMessage: 'Content' },
  'company': { id: 'company', defaultMessage: 'Company' },
  'mycontent': { id: 'my-content', defaultMessage: 'My content' },
  'latest': { id: 'latest', defaultMessage: 'Latest' },
  'popular': { id: 'popular', defaultMessage: 'Popular' },
  'recommended': { id: 'recommended', defaultMessage: 'Recommended' },
  'pin_code': { id: 'pin-code', defaultMessage: 'Pin Code' },
  'reauthentication': { id: 'reauthentication', defaultMessage: 'Re-authentication' },
  'never': { id: 'never', defaultMessage: 'Never' },

});

class BundleItem extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['text', 'textlong', 'checkbox', 'select', 'textarea']),
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    label: PropTypes.string,

    /** Value for input */
    value: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number,
      PropTypes.string
    ]),

    description: PropTypes.string,
    options: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    value: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleCheckboxChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event.currentTarget.name, event.currentTarget.checked, this.props.section);
    }
  }

  handleInputChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event.currentTarget.name, event.currentTarget.value, this.props.section);
    }
  }

  handleSelectChange(context) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(context.parentId, context.value, this.props.section);
    }
  }

  render () {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const {
      type,
      id,
      label,
      value,
      options,
      description,
    } = this.props;
    const styles = require('./AdminConfBundleDetails.less');

    let component = '';
    switch (type) {
      case 'textlong':
        component = (<div>
          <h4 className={styles.selectHeader}>{label}</h4>
          {description && <span aria-label={description} data-longtip className={styles.tooltip}>
            <span />
          </span>}
          <Text
            id={id}
            name={id}
            value={value}
            className={styles.inputClass}
            onChange={this.handleInputChange}
          />
        </div>);
        break;
      case 'text':
        component = (<div>
          <h4 className={styles.selectHeader}>{label}</h4>
          {description && <span aria-label={description} data-longtip className={styles.tooltip}>
            <span />
          </span>}
          <Text
            id={id}
            name={id}
            type="number"
            width="7.5rem"
            value={value}
            className={styles.inputClass}
            onChange={this.handleInputChange}
          />
        </div>);
        break;
      case 'select': {
        const tmpOptions = options.map(obj => {
          const tmpObj = obj;
          switch (obj.lang_key) {
            case 'n-second':
              tmpObj.label = (<FormattedMessage
                id="n-second"
                defaultMessage="{itemCount, plural, one {# second} other {# seconds}}"
                values={{ itemCount: obj.value }}
              />);
              break;
            case 'n-minute':
              tmpObj.label = (<FormattedMessage
                id="n-minute"
                defaultMessage="{itemCount, plural, one {# minute} other {# minutes}}"
                values={{ itemCount: (obj.value / 60) }}
              />);
              break;
            default:
              tmpObj.label = strings[obj.lang_key] || obj.lang_key || obj.label;
              break;
          }
          tmpObj.parentId = id;
          return tmpObj;
        });

        component = (<div>
          <h4 className={styles.selectHeader}>{label}</h4>
          {description && <span aria-label={description} data-longtip className={styles.tooltip}>
            <span />
          </span>}
          <Select
            id={id}
            name={id}
            value={value}
            clearable={false}
            options={tmpOptions}
            onChange={this.handleSelectChange}
            className={styles.select}
            valueKey="value"
            labelKey="label"
          />
        </div>);
        break;
      }
      case 'checkbox':
        component = (<Checkbox
          name={id}
          label={label}
          value={value}
          checked={!!JSON.parse(JSON.stringify(value))}
          onChange={this.handleCheckboxChange}
          className={styles.checkbox}
        >
          {description && <span aria-label={description} data-longtip className={styles.tooltip}>
            <span />
          </span>}
        </Checkbox>);
        break;
      case 'textarea':
        component = (<Textarea
          id={id}
          name={id}
          label={label}
          value={value}
          className={styles.inputClass}
          onChange={this.handleInputChange}
        />);
        break;
      default:
        break;
    }
    return component;
  }
}

export default class AdminConfBundleDetails extends PureComponent {
  static propTypes = {
    /** id of the group - section */
    section: PropTypes.string,

    header: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,

    list: PropTypes.array,

    columns: PropTypes.oneOf(['one', 'two']),

    onChange: PropTypes.func,

    isOpen: PropTypes.bool,
    onToggle: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    icon: 'gamification',
    description: '',
    columns: 'two',
    isOpen: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleAccordionToggle(isOpen) {
    // Delay removing overflow from accordion
    // it is required to open dropdown list in overflow container
    if (isOpen) {
      this.timer = setTimeout(() => {
        if (typeof this.props.onToggle === 'function') {
          this.props.onToggle(this.props.section, !this.props.isOpen);
        }
      }, 250);
    } else if (typeof this.props.onToggle === 'function') {
      this.props.onToggle(this.props.section, !this.props.isOpen);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const {
      columns,
      description,
      header,
      icon,
      list,
      section,
      onChange
    } = this.props;
    const styles = require('./AdminConfBundleDetails.less');

    const cx = classNames.bind(styles);
    const columnsClass = cx({
      twoColumns: columns === 'two',
      oneColumn: columns === 'one',
    });
    const accordionClass = cx({
      content: true,
      removeOverflow: this.props.isOpen,
    });

    const strings = generateStrings(messages, formatMessage, naming);
    /* Group by type */
    const bundleList = groupBy(list, bundle => (bundle.type));

    return (
      <Accordion
        title={header}
        description={description}
        icon={icon}
        alt
        defaultOpen={this.props.isOpen}
        className={accordionClass}
        onToggle={this.handleAccordionToggle}
      >
        {Object.keys(bundleList).map(itemGroup => (
          <div className={columnsClass} key={itemGroup}>
            {bundleList[itemGroup].map(item => (item.id && item.type &&
              <BundleItem
                {...item}
                key={item.id}
                label={strings[item.id] || item.label}
                section={section}
                onChange={onChange}
              />
            ))}
          </div>
        ))}
      </Accordion>
    );
  }
}
