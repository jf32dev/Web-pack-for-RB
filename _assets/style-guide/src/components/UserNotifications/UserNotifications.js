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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Loader from 'components/Loader/Loader';
import UserNotificationsItem from './UserNotificationsItem';

const messages = defineMessages({
  email: { id: 'email', defaultMessage: 'Email' },
  pushNotification: { id: 'push-notification', defaultMessage: 'Push notification' },
  notifications: { id: 'notifications', defaultMessage: 'Notifications' },
  details: { id: 'details', defaultMessage: 'Details' },

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
  added_to_channel: { id: 'when-others-add-me-to-their-channel', defaultMessage: 'When others add me to their {channel}' },

  updateAllUsers: { id: 'update-all-users', defaultMessage: 'Update All Users' },

  meetings: { id: 'meetings', defaultMessage: '{meetings}' },
  meetings_info: { id: 'meetings-info', defaultMessage: 'Notify me of activities for {meetings}.' },
  meeting_log_reminder: { id: 'meeting-log-reminder', defaultMessage: 'Remind me to log {meetings} to Salesforce.' },
});

export default class UserNotifications extends PureComponent {
  static propTypes = {
    notifications: PropTypes.object,
    notificationsLoading: PropTypes.bool,
    /* admin mode */
    admin: PropTypes.bool,

    onChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    admin: false,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: [],
      toggle: false
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({
      sections: this.prepareSections()
    });
  }

  handleCheckboxChange(event, context) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, context);
    }
  }

  handleToggleDetails(event, context) {
    const sections = this.state.sections;
    const parent = sections.find((section) => section.id === context.parentId);
    const setting = parent.options.find((subItem) => subItem.id === context.id);
    setting.toggleDetails = !setting.toggleDetails;

    this.setState({ sections: sections, toggle: !this.state.toggle });
  }

  prepareSections() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, { meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    const sections = [{
      id: 'general_updates',
      name: strings.general_updates,
      description: strings.general_updates_info,
      enabled: true,
      options: [{
        id: 'general-hubshare-forwarded-by-others',
        name: strings.forwarded_your_content
      }, {
        id: 'general-hubshare-viewed-by-others',
        name: strings.shared_content_viewed
      }, {
        id: 'general-others-replied-to-my-comments',
        name: strings.story_comment_replied
      }, {
        id: 'general-new-comments-where-i-have-commented',
        name: strings.story_commented_via_other_comments
      }, {
        id: 'general-broadcast-summary',
        name: strings.broadcast_summary,
        hidePushCheckbox: true,
      }]
    }, {
      id: 'my_content',
      name: strings.my_content,
      description: strings.my_content_info,
      enabled: true,
      options: [{
        id: 'my-content-comment-added',
        name: strings.story_commented_to_author
      }, {
        id: 'my-content-file-annotated',
        name: strings.file_annotated_to_author
      }, {
        id: 'my-content-shared-by-others',
        name: strings.shared_content_notify_author
      }, {
        id: 'my-content-story-subscribed-by-others',
        name: strings.subscribed_story_to_author
      }, {
        id: 'my-content-flagged-by-others',
        name: strings.story_flag_added
      }]
    }, {
      id: 'other_users_content',
      name: strings.other_users_content,
      description: strings.other_users_content_info,
      enabled: true,
      options: [{
        id: 'others_stories_are_published',
        name: strings.others_stories_are_published,
        toggleDetails: false,
        options: [
          {
            id: 'others-content-story-published-by-followed-user',
            name: strings.story_published_via_user_followed
          }, {
            id: 'others-content-story-published-in-subscribed-channel',
            name: strings.story_published_via_channel_subscribed
          }, {
            id: 'others-content-story-published-in-readable-channel',
            name: strings.story_published_via_channel
          },
        ]
      }, {
        id: 'updates_on_others_stories',
        name: strings.updates_on_others_stories,
        toggleDetails: false,
        options: [
          {
            id: 'others-content-story-edited-by-followed-user',
            name: strings.story_updated_via_user_followed
          }, {
            id: 'others-content-story-edited-in-subscribed-story',
            name: strings.story_updated_via_story_subscribed
          }, {
            id: 'others-content-story-edited-in-subscribed-channel',
            name: strings.story_updated_via_channel_subscribed
          }, {
            id: 'others-content-story-edited-in-readable-channel',
            name: strings.story_updated_via_channel
          },
        ]
      }, {
        id: 'comments_on_others_stories',
        name: strings.comments_on_others_stories,
        toggleDetails: false,
        options: [
          {
            id: 'others-content-story-comment-by-followed-users',
            name: strings.story_commented_via_user_followed
          }, {
            id: 'others-content-story-comment-in-subscribed-story',
            name: strings.story_commented_via_story_subscribed
          }, {
            id: 'others-content-story-comment-in-subscribed-channel',
            name: strings.story_commented_via_channel_subscribed
          }, {
            id: 'others-content-story-comment-in-readable-channel',
            name: strings.story_commented_via_channel
          },
        ]
      }, {
        id: 'annotations_on_files',
        name: strings.annotations_on_files,
        toggleDetails: false,
        options: [
          {
            id: 'others-content-file-annotated-by-followed-users',
            name: strings.file_annotated_via_user_followed
          }, {
            id: 'others-content-file-annotated-in-subscribed-story',
            name: strings.file_annotated_via_story_subscribed
          }, {
            id: 'others-content-file-annotated-in-subscribed-channel',
            name: strings.file_annotated_via_channel_subscribed
          }, {
            id: 'others-content-file-annotated-in-readable-channel',
            name: strings.file_annotated_via_channel
          },
        ]
      }, {
        id: 'others-content-my-flag-removed',
        name: strings.story_flag_removed
      }, {
        id: 'others-content-added-to-their-channel',
        name: strings.added_to_channel
      }
      ]
    },
    {
      id: 'profile_activities',
      name: strings.profile_activities,
      description: strings.profile_activities_info,
      enabled: true,
      options: [{
        id: 'profile-praise-received',
        name: strings.others_praise_me
      }, {
        id: 'profile-followed-by-others',
        name: strings.others_follow_me
      }]
    }, {
      id: 'meetings',
      name: strings.meetings,
      description: strings.meetings_info,
      enabled: true,
      options: [{
        id: 'meeting-log-reminder',
        name: strings.meeting_log_reminder,
        hideEmailCheckbox: true,
      }]
    }];

    return sections;
  }

  render() {
    const {
      notifications,
      notificationsLoading,
      admin,
      className
    } = this.props;

    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, { meeting: 'Meeting', meetings: 'Meetings',  ...naming });

    const styles = require('./UserNotifications.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      Notifications: true,
      admin: admin,
    }, className);

    if (notificationsLoading) {
      return <Loader type="page" />;
    }

    return (
      <div className={classes}>
        <div className={styles.Wrapper}>
          <div className={styles.iconHeader}>
            <div className={styles.itemLabel} />
            <div className={styles.iconsWrapper}>
              <div className={styles.icons}>
                <span className={styles.iconEmail} data-name={strings.email} />
                <span className={styles.iconMobile} data-name={strings.pushNotification} />
                {admin && <span className={styles.iconUsers} data-name={strings.updateAllUsers} />}
              </div>
              <div className={styles.action} />
            </div>
          </div>

          <div className={styles.notificationsWrap}>
            {this.state.sections.map(section => (section.enabled && <section key={section.id}>
              <h3>{section.name}</h3>
              {section.description && <h5 className={styles.subHeader}>{section.description}</h5>}
              {section.options.map(opt => (
                <div key={opt.id} className={opt.options && opt.options.length > 0 && opt.toggleDetails ? (styles.options + ' ' + styles.hasOptions) : styles.options}>
                  <UserNotificationsItem
                    {...opt}
                    value={notifications[opt.id]}
                    parentId={section.id}
                    options={opt.options}
                    notifications={notifications}
                    showDetails={opt.options && opt.options.length > 0}
                    onToggleDetails={this.handleToggleDetails}
                    onChange={this.handleCheckboxChange}
                    admin={admin}
                    strings={strings}
                  />
                  {/* Children items */}
                  {opt.options && opt.options.length > 0 && opt.toggleDetails && opt.options.map(children => (
                    <UserNotificationsItem
                      key={children.id}
                      {...children}
                      value={notifications[children.id]}
                      admin={admin}
                      isSubItem
                      onChange={this.handleCheckboxChange}
                      strings={strings}
                    />
                  ))}
                </div>
              ))}
            </section>))}
          </div>
        </div>
      </div>
    );
  }
}
