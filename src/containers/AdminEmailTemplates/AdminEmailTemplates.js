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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

import AdminManageEmails from 'components/Admin/AdminManageEmails/AdminManageEmails';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getEmailTemplate,
  loadCategories,
  resetTemplate,
  saveTemplate,
  saveSubject,
  sendTestEmail,
  setData,
} from 'redux/modules/admin/emailTemplates';
import { createPrompt } from 'redux/modules/prompts';

const messages = defineMessages({
  //subjectIsRequired: { id: 'subject-is-required', defaultMessage: 'Subject is required' },
  reload: { id: 'reload', defaultMessage: 'Reload' },
  error: { id: 'error', defaultMessage: 'Error' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  send: { id: 'send', defaultMessage: 'Send' },
  email: { id: 'email', defaultMessage: 'Email' },
  testEmail: { id: 'test-email', defaultMessage: 'Test Email' },
  emailErrorMessage: { id: 'email-address-invalid-format', defaultMessage: 'The Email Address is in an invalid format.' },
  emailSentSuccessfully: { id: 'email-sent-successfully', defaultMessage: 'Email sent successfully.' },

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
  story_commented_via_other_comments: { id: 'new-comments-where-i-have-commented', defaultMessage: 'New comments where I have commented' },
  story_promoted: { id: 'story-promoted', defaultMessage: '{story} promoted' },

  annotations_on_files: { id: 'annotations-on-files', defaultMessage: 'Annotations on files' },
  file_annotated_via_channel: { id: 'channels-i-have-access-to', defaultMessage: '{channels} I have access to' },
  file_annotated_via_channel_subscribed: { id: 'channels-i-am-subscribed-to', defaultMessage: '{channels} I am subscribed to' },
  file_annotated_via_story_subscribed: { id: 'stories-i-am-subscribed-to', defaultMessage: '{stories} I am subscribed to' },
  file_annotated_via_user_followed: { id: 'users-i-follow', defaultMessage: 'Users I follow' },

  story_flag_removed: { id: 'when-stories-i-flag-are-cleared', defaultMessage: 'When {stories} I flag are cleared' },
  added_to_channel: { id: 'when-others-add-me-to-their-channel', defaultMessage: 'When others add me to their {channel}' },

  share_notifications: { id: 'share-notifications', defaultMessage: 'Share notifications' },
  //shared_content_internal: { id: 'when-others-share-content-with-me', defaultMessage: 'When others share content with me' },
  shared_content_internal: { id: 'when-content-is-shared-with-internal-users', defaultMessage: 'When content is shared with internal users' },
  shared_content_external: { id: 'when-content-is-shared-with-external-users', defaultMessage: 'When content is shared with external users' },
  shared_content_forwarded_external: { id: 'when-content-is-forwarded-to-external-users', defaultMessage: 'When content is forwarded to external users' },
  shared_content_forwarded_internal: { id: 'when-content-is-forwarded-to-internal-users', defaultMessage: 'When content is forwarded to internal users' },
  //shared_content_forwarded_internal: { id: 'when-content-is-forwarded-to-me', defaultMessage: 'When content is forwarded to me' },

  profile_activities: { id: 'profile-activities', defaultMessage: 'Profile Activities' },
  praise_email: { id: 'others-praise-me', defaultMessage: 'Others Praise me' },
  follow_user_notification: { id: 'others-follow-me', defaultMessage: 'Others follow me' },

  broadcasts: { id: 'broadcasts', defaultMessage: 'Broadcasts' },
  broadcast_invitation: { id: 'broadcast-invitation', defaultMessage: 'Broadcast invitation' },
  broadcast_invitation_external: { id: 'broadcast-invitation-to-external', defaultMessage: 'Broadcast invitation to external users' },
  broadcast_summary: { id: 'broadcast-summary', defaultMessage: 'Broadcast summary' },

  story_inactive: { id: 'inactive-content', defaultMessage: 'Inactive content' },

  // Info message
  email_activation_info: { id: 'activation-email-info', defaultMessage: 'Sent to a new user to help them activate their account ' },
  reset_email_info: { id: 'password-reset-info', defaultMessage: 'Sent to a user to help them reset their password' },
  new_browser_login_info: { id: 'new-browser-login-info', defaultMessage: 'A security email sent to notify users when there is a new device login from their account' },

  forwarded_your_content_info: { id: 'others-forward-content-i-share-info', defaultMessage: 'Sent to notify a user when others forward content they share' },
  shared_content_viewed_info: { id: 'when-content-i-share-has-been-viewed-info', defaultMessage: 'Sent to notify a user when others view the content they share' },
  story_comment_replied_info: { id: 'replies-to-my-comments-info', defaultMessage: 'Sent to notify a user of a reply to a comment they posted' },

  story_commented_to_author_info: { id: 'comments-made-on-my-stories-info', defaultMessage: 'Sent to notify a user of comments made on their {story}' },
  file_annotated_to_author_info: { id: 'annotations-on-my-files-info', defaultMessage: 'Sent to notify a user of annotations made on their {story}' },
  shared_content_notify_author_info: { id: 'others-share-my-content-info', defaultMessage: 'Sent to notify a user of when others share their content' },
  subscribed_story_to_author_info: { id: 'others-subscribe-to-my-stories-info', defaultMessage: 'Sent to notify a user when others subscribe to their {story}' },
  story_flag_added_info: { id: 'others-flag-my-story-info', defaultMessage: 'Sent to notify a user when others flag their {story}' },

  story_published_via_user_followed_info: { id: 'story-published-users-i-follow-info', defaultMessage: 'Sent to notify a user when a new {story} is published by a user they follow' },
  story_published_via_channel_subscribed_info: { id: 'story-published-channels-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when a new {story} is published in {channels} they are subscribed to' },
  story_published_via_channel_info: { id: 'story-published-channels-i-have-access-to-info', defaultMessage: 'Sent to notify a user when a new {story} is published in {channels} they have access to' },

  story_updated_via_user_followed_info: { id: 'story-updated-users-i-follow-info', defaultMessage: 'Sent to notify a user when a {story} published by a user they follow, is updated' },
  story_updated_via_channel_subscribed_info: { id: 'story-updated-channels-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when a {story} in a {channel} they are subscribed to is updated' },
  story_updated_via_channel_info: { id: 'story-updated-channels-i-have-access-to-info', defaultMessage: 'Sent to notify a user when a {story} in a {channel} they have access to is updated' },
  story_updated_via_story_subscribed_info: { id: 'story-updated-stories-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when a {story} they have subscribed to is updated ' },

  story_commented_via_channel_info: { id: 'story-commented-channels-i-have-access-to-info', defaultMessage: 'Sent to notify a user when a comment is posted in a {channel} they have access to' },
  story_commented_via_user_followed_info: { id: 'story-commented-users-i-follow-info', defaultMessage: 'Sent to notify a user when someone they follow posts a new a comment' },
  story_commented_via_channel_subscribed_info: { id: 'story-commented-channels-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when a comment is posted in a {channel} they are subscribed to' },
  story_commented_via_story_subscribed_info: { id: 'story-commented-stories-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when a comment is posted on a {story} they are subscribed to ' },

  file_annotated_via_channel_info: { id: 'file-annotated-channels-i-have-access-to-info', defaultMessage: 'Sent to notify a user when annotations are made to a file in a {channel} they have access to' },
  file_annotated_via_channel_subscribed_info: { id: 'file-annotated-channels-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when annotations are made to a file in {channel} they are subscribed to ' },
  file_annotated_via_story_subscribed_info: { id: 'file-annotated-stories-i-am-subscribed-to-info', defaultMessage: 'Sent to notify a user when annotations are made to a file in a {story} they are subscribed to ' },
  file_annotated_via_user_followed_info: { id: 'file-annotated-users-i-follow-info', defaultMessage: 'Sent to notify a user someone they follow has made new annotations' },

  story_flag_removed_info: { id: 'when-stories-i-flag-are-cleared-info', defaultMessage: 'Sent to notify a user when a {story} they flagged is cleared ' },
  added_to_channel_info: { id: 'when-added-to-channel-info', defaultMessage: 'Sent to notify a user when they are added to a {channel}' },

  shared_content_internal_info: { id: 'when-others-share-content-with-me-info', defaultMessage: 'Sent to a user when others share content with them' },
  shared_content_external_info: { id: 'when-content-is-shared-with-external-users-info', defaultMessage: 'Sent to external users when content is shared with them ' },

  praise_email_info: { id: 'others-praise-me-info', defaultMessage: 'Sent to users to notify them of when others Praise them' },
  follow_user_notification_info: { id: 'others-follow-me-info', defaultMessage: 'Sent to users to notify them of new followers' },

  broadcast_invitation_info: { id: 'broadcast-invitation-info', defaultMessage: 'An email inviting users to join a presentation Broadcast ' },
  broadcast_invitation_external_info: { id: 'broadcast-invitation-to-external-info', defaultMessage: 'An email inviting external users to join a presentation Broadcast' },
  broadcast_summary_info: { id: 'broadcast-summary-info', defaultMessage: 'A summary email sent to the Broadcast organizer showing details such as the duration of the presentation and the emails of participants' },

  story_inactive_info: { id: 'inactive-content-info', defaultMessage: 'Sent to notify a user when content has been marked as inactive and is nominated for archiving' },
  file_expiry: { id: 'file-expiry', defaultMessage: 'When a file is about to expire' },
});

function mapStateToProps(state) { //ownProps
  const { settings } = state;
  const { emailTemplates } = state.admin;
  const categoryList = emailTemplates.categories;
  const defaultSelected = categoryList[0] && categoryList[0].children[0] ? categoryList[0].children[0].children[0] : null;

  return {
    languages: Object.assign({}, settings.languages),
    langCode: emailTemplates.langCode || settings.user.langCode,
    category: emailTemplates.categorySelected,
    subHeaderSelected: emailTemplates.subHeaderSelected,

    defaultSelected: defaultSelected,
    categories: categoryList,
    categoriesLoaded: emailTemplates.categoriesLoaded,
    categoriesLoading: emailTemplates.categoriesLoading,

    subject: emailTemplates.subject,
    css: emailTemplates.css,
    inky: emailTemplates.inky,
    template: emailTemplates.template,
    variables: emailTemplates.variables,

    isSubjectChanged: emailTemplates.isSubjectChanged,
    isTemplateChanged: emailTemplates.isTemplateChanged,
    defaultLayout: emailTemplates.defaultLayout,
    isSaving: emailTemplates.isSaving,
    loading: emailTemplates.loading,
    loaded: emailTemplates.loaded,
    error: emailTemplates.error,

    testEmailSentStatus: emailTemplates.testEmailSentStatus,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    getEmailTemplate,
    loadCategories,
    resetTemplate,
    saveTemplate,
    saveSubject,
    sendTestEmail,
    setData,
  })
)
export default class AdminTemplates extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    loading: PropTypes.bool,

    onAnchorClick: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showTestEmail: false,
      testEmailValue: '',
      isEmailFormatError: false,
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      categoriesLoading,
      categories,
      error,
    } = this.props;

    if (!categories.length && !categoriesLoading && !error) {
      this.props.loadCategories();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Translations
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);

    const { error, loaded, loading, testEmailSentStatus } = nextProps;

    if (!this.props.categories.length && nextProps.categories.length && !loaded && !loading) {
      this.props.getEmailTemplate(nextProps.defaultSelected, this.props.langCode);
    }

    if ((this.props.category && this.props.category !== nextProps.category) ||
      (this.props.langCode && this.props.langCode !== nextProps.langCode)) {
      this.props.getEmailTemplate(nextProps.category || this.props.category, nextProps.langCode || this.props.langCode);
    }

    if (this.props.subject !== nextProps.subject && nextProps.isSubjectChanged) {
      this.props.saveSubject({
        type: this.props.category,
        langCode: this.props.langCode,
        subject: nextProps.subject
      });
    }

    if (testEmailSentStatus && !this.props.testEmailSentStatus) {
      this.props.createPrompt({
        id: uniqueId('info-'),
        type: 'info',
        message: strings.emailSentSuccessfully,
        dismissible: true,
        autoDismiss: 5
      });
    }

    const prevError = this.props.error ? this.props.error.message : '';
    if (error && error.message && (error.message !== prevError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleReload() {
    this.props.getEmailTemplate(this.props.category, this.props.langCode);
  }

  handleReloadPreview() {
    //this.props.getEmailTemplate(this.props.category, this.props.langCode);
  }

  handleAnchorClick(e) {
    //e.preventDefault();
    if (typeof this.props.onAnchorClick === 'function') {
      this.props.onAnchorClick(e);
    }
  }

  handleCategoryChange(context) {
    this.props.setData({
      categorySelected: context.id,
      subHeaderSelected: context.subheader || '',
    });
  }

  handleLanguageChange(context) {
    this.props.setData({
      langCode: context.id
    });
  }

  handleResetLayout() {
    this.props.resetTemplate(this.props.category, this.props.langCode);
  }

  handleEditorFocusChange(isFocused) {
    if (!isFocused && this.props.isTemplateChanged) {
      this.props.saveTemplate({
        type: this.props.category,
        langCode: this.props.langCode,
        inky: this.props.inky,
        css: this.props.css
      });
    }
  }

  handleTemplateChange(newCode) {
    this.props.setData({
      inky: newCode,
      isTemplateChanged: true
    });
  }

  handleCssChange(newCode) {
    this.props.setData({
      css: newCode,
      isTemplateChanged: true
    });
  }

  handleSubjectChange(nSubject) {
    if (this.props.subject !== nSubject) {
      this.props.setData({
        subject: nSubject,
        isSubjectChanged: true
      });
    }
  }

  handleToggleTestEmail() {
    this.setState({
      showTestEmail: !this.state.showTestEmail,
      isEmailFormatError: false
    });
  }

  handleTestEmailChange(context) {
    this.setState({
      testEmailValue: context.target.value,
      isEmailFormatError: false
    });
  }

  handleSendClick() {
    const re = /[^@]+@[^@]+\.[^@]+/;

    if (re.test(this.state.testEmailValue)) {
      this.props.sendTestEmail({
        type: this.props.category,
        langCode: this.props.langCode,
        email: this.state.testEmailValue
      });
      this.handleToggleTestEmail();
    } else {
      this.setState({ isEmailFormatError: true });
    }
  }

  render() {
    const {
      categoriesLoaded,
      error,
      loaded,
      style,
    } = this.props;
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    // Translations
    const strings = generateStrings(messages, formatMessage, naming);
    const styles = require('./AdminEmailTemplates.less');

    // Loading
    if (!categoriesLoaded && !error) {
      return <Loader type="page" />;

      // Error
    } else if (error && (!categoriesLoaded || !loaded)) {
      return (
        <Blankslate
          icon="error"
          heading={strings.error}
          message={error.message}
          middle
        >
          <Btn onClick={this.handleReload}>{strings.reload}</Btn>
        </Blankslate>
      );
    }

    return (
      <div className={styles.AdminEmailTemplates} style={style}>
        <AdminManageEmails
          id={this.props.category}
          name={strings[this.props.category]}
          description={strings[this.props.category + '_info'] || ''}
          subheader={this.props.subHeaderSelected ? strings[this.props.subHeaderSelected] : ''}
          subject={this.props.subject}
          inky={this.props.inky}
          css={this.props.css}
          template={this.props.template}
          variables={this.props.variables}
          language={this.props.langCode}
          isLoading={!loaded}
          isTemplateChanged={this.props.isTemplateChanged}
          isTemplateLoading={this.props.isSaving}
          defaultLayout={this.props.defaultLayout}

          languageList={this.props.languages}
          list={this.props.categories}

          onAnchorClick={this.handleAnchorClick}
          onCategoryChange={this.handleCategoryChange}
          onLanguageChange={this.handleLanguageChange}
          onResetLayout={this.handleResetLayout}
          onTemplateChange={this.handleTemplateChange}
          onCssChange={this.handleCssChange}
          onSubjectChange={this.handleSubjectChange}
          onEditorFocusChange={this.handleEditorFocusChange}
          onReloadPreviewClick={this.handleReloadPreview}
          onSendTestEmail={this.handleToggleTestEmail}
          strings={strings}
        />

        <Modal
          isVisible={this.state.showTestEmail}
          width="medium"
          headerTitle={strings.testEmail}
          footerChildren={(
            <div>
              <Btn borderless alt large onClick={this.handleToggleTestEmail}>
                {strings.cancel}
              </Btn>
              <Btn borderless inverted large onClick={this.handleSendClick}>
                {strings.send}
              </Btn>
            </div>
          )}
          onClose={this.handleToggleTestEmail}
        >
          <div className={styles.testEmailWrapper}>
            <Text
              name="email"
              placeholder={strings.email}
              value={this.state.testEmailValue}
              onChange={this.handleTestEmailChange}
            />
            {this.state.isEmailFormatError && <div className={styles.error}>{strings.emailErrorMessage}</div>}
          </div>
        </Modal>
      </div>
    );
  }
}
