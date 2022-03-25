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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import AdminManageEmails from 'components/Admin/AdminManageEmails/AdminManageEmails';
const AdminManageEmailsDocs = require('!!react-docgen-loader!components/Admin/AdminManageEmails/AdminManageEmails.js');

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  emailType: { id: 'email-type', defaultMessage: 'Email Type' },
  resetLayout: { id: 'reset-layout', defaultMessage: 'Reset Layout' },
  language: { id: 'language', defaultMessage: 'Language' },
  emailSubject: { id: 'email-subject', defaultMessage: 'Email Subject' },
  subjectInfo: { id: 'email-subject-info', defaultMessage: 'Add attributes to customize layout, drag attributes to rearrange.' },
  emailBody: { id: 'email-body', defaultMessage: 'Email Body' },
  emailPreview: { id: 'email-preview', defaultMessage: 'Email Preview' },
  insertVariables: { id: 'insert-variables', defaultMessage: 'Insert Variables' },
  emailFormattingDoc: { id: 'email-formatting-documentation', defaultMessage: 'Email Formatting Documentation' },

  // Email categories
  welcome_emails: { id: 'welcome-emails', defaultMessage: 'Welcome emails' },
  email_activation: { id: 'account-activation', defaultMessage: 'Account activation' },
  reset_email: { id: 'password-reset', defaultMessage: 'Password reset' },
  security: { id: 'security', defaultMessage: 'Security' },
  a_new_browser_login: { id: 'a-new-browser-login', defaultMessage: 'A new browser login' },
  general_updates: { id: 'general-updates', defaultMessage: 'General updates' },
  forwarded_your_content: { id: 'others-forward-content-i-share', defaultMessage: 'Others forward content I share' },
  shared_content_viewed: { id: 'when-content-i-share-has-been-viewed', defaultMessage: 'When content I share has been viewed' },
  story_comment_replied: { id: 'replies-to-my-comments', defaultMessage: 'Replies to my comments' },
  my_content: { id: 'my-content', defaultMessage: 'My content' },
  story_commented_to_author: { id: 'comments-made-on-my-stories', defaultMessage: 'Comments made on my {stories}' },
  file_annotated_to_author: { id: 'annotations-on-my-files', defaultMessage: 'Annotations on my files' },
  shared_content_notify_author: { id: 'others-share-my-content', defaultMessage: 'Others share my content' },
  subscribed_story_to_author: { id: 'others-subscribe-to-my-stories', defaultMessage: 'Others subscribe to my {stories}' },
  story_flag_added: { id: 'others-flag-my-story', defaultMessage: 'Others flag my {story}' },
  other_users_content: { id: 'other-users-content', defaultMessage: 'Other users\' content' },

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

  annotations_on_files: { id: 'annotations-on-files', defaultMessage: 'Annotations on files' },
  file_annotated_via_channel: { id: 'channels-i-have-access-to', defaultMessage: '{channels} I have access to' },
  file_annotated_via_channel_subscribed: { id: 'channels-i-am-subscribed-to', defaultMessage: '{channels} I am subscribed to' },
  file_annotated_via_story_subscribed: { id: 'stories-i-am-subscribed-to', defaultMessage: '{stories} I am subscribed to' },
  file_annotated_via_user_followed: { id: 'users-i-follow', defaultMessage: 'Users I follow' },

  story_flag_removed: { id: 'when-stories-i-flag-are-cleared', defaultMessage: 'When {stories} I flag are cleared' },
  added_to_channel: { id: 'when-others-add-me-to-their-channel', defaultMessage: 'When others add me to their {channel}' },

  share_notifications: { id: 'share-notifications', defaultMessage: 'Share notifications' },
  shared_content_internal: { id: 'when-others-share-content-with-me', defaultMessage: 'When others share content with me' },
  shared_content_external: { id: 'when-content-is-shared-with-external-users', defaultMessage: 'When content is shared with external users' },

  profile_activities: { id: 'profile-activities', defaultMessage: 'Profile Activities' },
  praise_email: { id: 'others-praise-me', defaultMessage: 'Others Praise me' },
  follow_user_notification: { id: 'others-follow-me', defaultMessage: 'Others follow me' },

  broadcasts: { id: 'broadcasts', defaultMessage: 'Broadcasts' },
  broadcast_invitation: { id: 'broadcast-invitation', defaultMessage: 'Broadcast invitation' },
  broadcast_invitation_external: { id: 'broadcast-invitation-to-external', defaultMessage: 'Broadcast invitation to external users' },
  broadcast_summary: { id: 'broadcast_summary', defaultMessage: 'Broadcast summary' },

  story_inactive: { id: 'inactive-content', defaultMessage: 'Inactive content' },
});

const list = require('../../static/emailTemplates.json');
const categoryList = require('../../static/emailTypes.json');

const languages = {
  "en-us": "English (US)",
  "en-gb": "English (UK)",
  "da":"Dansk",
  "de":"Deutsch",
  "es":"Español",
  "fr":"Français",
  "it":"Italiano",
  "ja":"日本語",
  "ko":"한국어",
  "no":"Norsk",
  "pt-br":"Portuguese",
  "ru":"русский",
  "sv":"Svenska",
  "th":"ไทย",
  "tr": "Türkçe",
  "zh-cn": "中文(简体)",
  "zh-hk": "中文(繁體)"
}

export default class AdminManageEmailsView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      category: {...list.emails[0]},
      language: 'en-us',
      htmlTemplate: list.emails[0].templates['en-us'],
      isTemplateChanged: false,
      isTemplateLoading: false
    }
    autobind(this);
  }

  handleCategoryChange(context) {
    const item = list.emails.find((obj) => (obj.name === context.id));
    this.setState({
      category: item || {}
    })
  }

  handleLanguageChange(context) {
    this.setState({
      language: context.id,
    })
  }

  handleResetLayout(event, context) {
    console.log('Reset > ' + context.id);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    console.log(event.currentTarget.getAttribute('href'));
  }

  handleTemplateChange(newCode) {
    const categories = this.state.category;
    categories.templates[this.state.language] = newCode;
    this.setState({
      category: categories,
      isTemplateChanged: true,
    });
  }

  handleCssChange(newCode) {
    const categories = this.state.category;
    categories.css[this.state.language] = newCode;
    this.setState({
      category: categories,
      isTemplateChanged: true,
    });
  }

  handleSubjectChange(nSubject) {
    const categories = this.state.category;
    console.log(nSubject);
    if (categories.subjects[this.state.language] !== nSubject) {
      categories.subjects[this.state.language] = nSubject;
      this.setState({
        category: categories,
      });
    }
  }

  // Save Changes when email editor focus out
  handleEditorFocusChange(isFocused, type) {
    if (!isFocused && this.state.isTemplateChanged) {
      setTimeout(() => (
        this.setState({
          isTemplateLoading: true,
          isTemplateChanged: false,
        })
      ), 1000);

      setTimeout(() => (
        this.setState({
          isTemplateLoading: false,
        })
      ), 5000);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);

    return (
      <section id="NavMenuView">
        <h1>Admin Manage Emails</h1>
        <Docs {...AdminManageEmailsDocs} />

        <h2>Usage</h2>
        <p>Sort tags by total time it's being used.</p>

        <ComponentItem>
          <AdminManageEmails
            id={this.state.category.id}
            name={this.state.category.name}
            description={this.state.category.description}
            subject={this.state.category.subjects[this.state.language]}
            inky={this.state.category.templates[this.state.language]}
            css={this.state.category.css[this.state.language]}
            template={this.state.htmlTemplate}
            variables={this.state.category.variables}
            language={this.state.language}
            isTemplateChanged={this.state.isTemplateChanged}
            isTemplateLoading={this.state.isTemplateLoading}

            languageList={languages}
            list={categoryList}

            onAnchorClick={this.handleAnchorClick}
            onCategoryChange={this.handleCategoryChange}
            onLanguageChange={this.handleLanguageChange}
            onResetLayout={this.handleResetLayout}
            onDocumentationClick={() => (console.log('Doc Clicked'))}
            onTemplateChange={this.handleTemplateChange}
            onCssChange={this.handleCssChange}
            onSubjectChange={this.handleSubjectChange}
            onEditorFocusChange={this.handleEditorFocusChange}
            strings={strings}
          />
        </ComponentItem>

      </section>
    );
  }
}
