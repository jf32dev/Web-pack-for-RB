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
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import EmailEditor from 'components/EmailEditor/EmailEditor';
import EmailPreview from 'components/EmailPreview/EmailPreview';
import EmailSubjectEditor from 'components/EmailSubjectEditor/EmailSubjectEditor';
import GroupOptItem from 'components/Select/GroupOptItem';
import Loader from 'components/Loader/Loader';
import Select from 'components/Select/Select';

import JSZip from 'jszip/dist/jszip';

global.JSZip = JSZip; // Fix for JSZip not found error

const messages = defineMessages({
  reloadPreview: { id: 'reload-preview', defaultMessage: 'Reload Preview' },
  emailType: { id: 'email-type', defaultMessage: 'Email Type' },
  resetLayout: { id: 'reset-layout', defaultMessage: 'Reset Layout' },
  language: { id: 'language', defaultMessage: 'Language' },
  emailSubject: { id: 'email-subject', defaultMessage: 'Email Subject' },
  subjectInfo: { id: 'email-subject-info', defaultMessage: 'Add attributes to customize layout, drag attributes to rearrange.' },
  emailBody: { id: 'email-body', defaultMessage: 'Email Body' },
  emailPreview: { id: 'email-preview', defaultMessage: 'Email Preview' },
  emailHasChanged: { id: 'email-has-being-edited', defaultMessage: 'Email Template Has Been Edited' },
  clickReloadPreview: { id: 'click-reload-preview-view-changes', defaultMessage: 'Click Reload Preview to view changes.' },
  backupTemplate: { id: 'backup-template', defaultMessage: 'Backup template' },
  sendTestEmail: { id: 'send-test-email', defaultMessage: 'Send test email' },

  // Subject translations
  customText: { id: 'custom-text', defaultMessage: 'Custom Text' },

  // Editor Menu Translations
  insertVariables: { id: 'insert-variables', defaultMessage: 'Insert Variables' },
  functions: { id: 'functions', defaultMessage: 'Functions' },
  variables: { id: 'variables', defaultMessage: 'Variables' },
  inkyFormattingDoc: { id: 'inky-formatting-documentation', defaultMessage: 'Inky formatting documentation' },

  // Subject Variables
  _Channel_: { id: 'channel', defaultMessage: '{channel}' },
  _Story_: { id: 'story', defaultMessage: '{story}' },
  _Stories_: { id: 'stories', defaultMessage: '{stories}' },

  // Body variables
  actor_first_name: { id: 'actor-first-name', defaultMessage: 'Actor first name' },
  actor_last_name: { id: 'actor-last-name', defaultMessage: 'Actor last name' },
  actor_job_title: { id: 'actor-job-title', defaultMessage: 'Actor job title' },
  actor_thumbnail: { id: 'actor-thumbnail', defaultMessage: 'Actor thumbnail' },
  actor_email: { id: 'actor-email', defaultMessage: 'Actor email' },
  actor_profile_link: { id: 'actor-profile-link', defaultMessage: 'Actor Profile Link' },
  actor_signature: { id: 'actor-signature', defaultMessage: 'Actor Signature' },

  original_share_date: { id: 'original-share-date', defaultMessage: 'Original share date' },
  original_share_user_first_name: { id: 'original-share-user-first-name', defaultMessage: 'Original share user - first name' },
  original_share_user_last_name: { id: 'original-share-user-last-name', defaultMessage: 'Original share user - last name' },
  original_share_user_job_title: { id: 'original-share-user-job-title', defaultMessage: 'Original share user - job title' },
  original_share_user_thumbnail: { id: 'original-share-user-thumbnail', defaultMessage: 'Original share user - thumbnail' },
  original_share_user_profile_link: { id: 'original-share-user-profile-link', defaultMessage: 'Original share user - Profile Link' },

  attendee_email: { id: 'attendee-email', defaultMessage: 'Attendee email' },
  attendee_thumbnail: { id: 'attendee-thumnbnail', defaultMessage: 'Attendee thumbnail' },
  nonattendee_email: { id: 'non-attendee-email', defaultMessage: 'Non-Attendee email' },
  nonattendee_thumbnail: { id: 'non-attendee-thumnbnail', defaultMessage: 'Non-Attendee thumbnail' },

  comment_actor_first_name: { id: 'actor-first-name', defaultMessage: 'Actor first name' },
  comment_actor_last_name: { id: 'actor-last-name', defaultMessage: 'Actor last name' },
  comment_actor_job_title: { id: 'actor-job-title', defaultMessage: 'Actor job title' },
  comment_actor_thumbnail: { id: 'actor-thumbnail', defaultMessage: 'Actor thumbnail' },
  comment_actor_profile_link: { id: 'actor-profile-link', defaultMessage: 'Actor Profile Link' },
  comment_date: { id: 'date', defaultMessage: 'date' },
  comment_user_comment: { id: 'user-comment', defaultMessage: 'User comment' },

  reply_actor_first_name: { id: 'actor-first-name', defaultMessage: 'Actor first name' },
  reply_actor_last_name: { id: 'actor-last-name', defaultMessage: 'Actor last name' },
  reply_actor_job_title: { id: 'actor-job-title', defaultMessage: 'Actor job title' },
  reply_actor_thumbnail: { id: 'actor-thumbnail', defaultMessage: 'Actor thumbnail' },
  reply_actor_profile_link: { id: 'actor-profile-link', defaultMessage: 'Actor Profile Link' },
  reply_date: { id: 'date', defaultMessage: 'date' },
  reply_user_comment: { id: 'user-comment', defaultMessage: 'User comment' },

  author_first_name: { id: 'author-first-name', defaultMessage: 'Author first name' },
  author_last_name: { id: 'author-last-name', defaultMessage: 'Author last name' },
  author_job_title: { id: 'author-job-title', defaultMessage: 'Author job title' },
  author_thumbnail: { id: 'author-thumbnail', defaultMessage: 'Author thumbnail' },

  recipient_email: { id: 'recipient-email', defaultMessage: 'Recipient email' },
  recipient_first_name: { id: 'recipient-first-name', defaultMessage: 'Recipient first name' },
  recipient_last_name: { id: 'recipient-last-name', defaultMessage: 'Recipient last name' },
  recipient_job_title: { id: 'recipient-job-title', defaultMessage: 'Recipient job title' },
  recipient_thumbnail: { id: 'recipient-thumbnail', defaultMessage: 'Recipient thumbnail' },

  apple_app_store_link: { id: 'apple-app-store-link', defaultMessage: 'App Store link' },
  google_play_link: { id: 'google-play-link', defaultMessage: 'Google Play link' },
  microsoft_link: { id: 'microsoft-link', defaultMessage: 'Microsoft link' },
  base_url: { id: 'base-url', defaultMessage: 'Base URL' },

  channel_title: { id: 'channel-title', defaultMessage: '{channel} title' },
  channel_thumbnail: { id: 'channel-thumbnail', defaultMessage: '{channel} thumbnail' },
  channel_link: { id: 'channel-link', defaultMessage: '{channel} link' },
  story_description: { id: 'story-description', defaultMessage: '{story} description' },
  story_title: { id: 'story-title', defaultMessage: '{story} title' },
  story_thumbnail: { id: 'story-thumbnail', defaultMessage: '{story} thumbnail' },
  story_link: { id: 'story-link', defaultMessage: '{story} link' },

  company_address: { id: 'company-address', defaultMessage: 'Company address' },
  company_name: { id: 'company-name', defaultMessage: 'Company name' },
  notifications_link: { id: 'notifications-link', defaultMessage: 'Notifications link' },
  total_stories: { id: 'total-stories', defaultMessage: 'Total {stories}' },
  broadcast_link: { id: 'broadcast-link', defaultMessage: 'Broadcast link' },
  typed_message: { id: 'typed-message', defaultMessage: 'Typed message' },
  unsubscribe_link: { id: 'unsubscribe-link', defaultMessage: 'Unsubscribe link' },
  broadcast_datetime: { id: 'broadcast-datetime', defaultMessage: 'Broadcast datetime' },
  broadcast_total_time: { id: 'broadcast-total-time', defaultMessage: 'Broadcast total time' },
  total_viewers: { id: 'total-viewers', defaultMessage: 'Total viewers' },
  activation_link: { id: 'activation-link', defaultMessage: 'Activation link' },
  file_link_internal: { id: 'file-link-internal', defaultMessage: 'File internal link' },
  story_link_internal: { id: 'story-link-internal', defaultMessage: '{story} internal link' },
  user_guides_link: { id: 'user-guides-link', defaultMessage: 'User guides link' },
  file_colour: { id: 'file-color', defaultMessage: 'File color' },
  file_link: { id: 'file-link', defaultMessage: 'File link' },
  file_title: { id: 'file-title', defaultMessage: 'File title' },
  file_type: { id: 'file-type', defaultMessage: 'File type' },
  date: { id: 'date', defaultMessage: 'date' },
  description: { id: 'description', defaultMessage: 'Description' },
  reset_link: { id: 'reset-link', defaultMessage: 'Reset Link' },
  content_link: { id: 'content-link', defaultMessage: 'Content Link' },
  event_day: { id: 'event-day', defaultMessage: 'Event day' },
  event_time: { id: 'event-time', defaultMessage: 'Event time' },
  event_title: { id: 'event-title', defaultMessage: 'Event title' },
  tag_name: { id: 'tag-name', defaultMessage: 'Tag name' },
  flag_icon: { id: 'flag-icon', defaultMessage: 'Flag icon' },
  flag_type: { id: 'flag-type', defaultMessage: 'Flag type' },
  user_comment: { id: 'user-comment', defaultMessage: 'User comment' },
});

export default class AdminManageEmails extends PureComponent {
  static propTypes = {
    /** Email category id */
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

    /** Email category name */
    name: PropTypes.string,

    /** Email category description - help text */
    description: PropTypes.string,

    /** Email Subject for language selected */
    subject: PropTypes.string,

    /** HTML result template for language selected */
    template: PropTypes.string,

    /** Editable version of the template */
    inky: PropTypes.string,

    /** Css for language selected */
    css: PropTypes.string,

    /** Displays subject and templates in language selected */
    language: PropTypes.string,

    isTemplateChanged: PropTypes.bool,
    isTemplateLoading: PropTypes.bool,
    defaultLayout: PropTypes.bool,

    /** List of languages <code>{"en-us": "English (US)", ...}</code>*/
    languageList: PropTypes.object.isRequired,

    /** Email category list */
    list: PropTypes.array.isRequired,

    /** List of variables for subject and body <code>{"header": welcome_email, "children": []}</code>*/
    variables: PropTypes.array,

    /** handle click on link */
    onAnchorClick: PropTypes.func,
    onCategoryChange: PropTypes.func,
    onLanguageChange: PropTypes.func,
    onResetLayout: PropTypes.func,
    onTemplateChange: PropTypes.func,
    onCssChange: PropTypes.func,
    onSubjectChange: PropTypes.func,
    onSendTestEmail: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,
    strings: PropTypes.object
  };

  static defaultProps = {
    list: [],
    strings: {},
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
    this._customOptionHeightsSelect = {};
  }

  // Custom Select Filter to keep header
  getFilterOptions(options, filter) { //currentValues
    const {
      list,
      strings // Strings from parents
    } = this.props;

    let nOptions = list;
    if (filter) {
      nOptions = list.map(header => {
        let nChild = header.children;
        let headerHasContent = false;

        // Translate header
        const translatedHeader = strings[header.header] || header.header;
        if (translatedHeader.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
          // whether filter is applied to the header show all children
          headerHasContent = true;
        } else {
          nChild = header.children.map(item => {
            const nItems = Object.assign({}, item);

            // Translate subheader
            const translatedSubHeader = strings[nItems.subheader] || nItems.subheader;
            if (translatedSubHeader.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
              // Whether filter is applied to subheader

            } else {
              // filter children
              nItems.children = nItems.children.filter(child => {
                const translatedType = strings[child] || child;
                return translatedType.toLowerCase().indexOf(filter.toLowerCase()) > -1;
              });
            }
            return nItems;
          });

          nChild.map(o => {
            if (o.children.length) headerHasContent = true;
            return o;
          });
        }

        const nHeader = {
          ...header,
          children: nChild,
          noResults: !(filter && headerHasContent)
        };

        return nHeader;
      });
    }

    // Remove categories without results when a filter is applied
    const onlyHeaderWithContent = nOptions.filter(obj => !obj.noResults);

    return this.getNestedData(onlyHeaderWithContent);
  }

  getNestedData(customList) {
    const {
      list,
      strings // Strings from parents
    } = this.props;
    const nestedData = [];
    const nestedList = customList || list;

    nestedList.map((item) => {
      nestedData.push({ id: item.header, name: strings[item.header] || item.header, type: 'header', disabled: true });

      if (item.children && item.children.length) {
        item.children.map((childItem) => {
          // Subheader item
          let nestedType = 'category';
          if (childItem.subheader && childItem.children && childItem.children.length) {
            nestedType = 'hasSubHeader';
            nestedData.push({
              id: childItem.subheader,
              name: strings[childItem.subheader] || childItem.subheader,
              type: 'subheader',
              disabled: true,
              header: item.header,
            });
          }
          // List of template types
          if (childItem.children && childItem.children.length) {
            childItem.children.map((category) => {
              nestedData.push({
                id: category,
                name: strings[category] || category,
                type: nestedType,
                subheader: childItem.subheader,
              });
              return category;
            });
          }
          return childItem;
        });
      }
      return item;
    });
    return nestedData;
  }

  handleResetLayout(event) {
    if (typeof this.props.onResetLayout === 'function') {
      this.props.onResetLayout(event, this.props);
    }
  }

  handleLanguageChange(context) {
    if (typeof this.props.onLanguageChange === 'function') {
      this.props.onLanguageChange(context);
    }
  }

  handleCategoryChange(context) {
    if (typeof this.props.onCategoryChange === 'function') {
      this.props.onCategoryChange(context);
    }
  }

  handleReloadPreview(event) {
    if (typeof this.props.onReloadPreviewClick === 'function') {
      this.props.onReloadPreviewClick(event, this.props);
    }
  }

  handleDownloadBackup() {
    const {
      css,
      inky,
      template
    } = this.props;
    const zip = new JSZip();
    zip.file('template/inky.txt', inky);
    zip.file('template/css.txt', css);
    zip.file('template/template.html', template);

    const filename = 'archive.zip';
    zip
      .generateAsync({ type: 'blob' })
      .then(function (blob) {
        // Always IE :(
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were
          // revoked by closing the blob for which they were created.
          // These URLs will no longer resolve as the data backing
          // the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        } else {
          const blobURL = window.URL.createObjectURL(blob);
          const tempLink = document.createElement('a');
          tempLink.style.display = 'none';
          tempLink.href = blobURL;
          tempLink.setAttribute('download', filename);

          // Safari thinks _blank anchor are pop ups. We only want to set _blank
          // target if the browser does not support the HTML5 download attribute.
          // This allows you to download files in desktop safari if pop up blocking
          // is enabled.
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
          }

          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
        }
      });
  }

  handleSendTestEmail(event) {
    if (typeof this.props.onSendTestEmail === 'function') {
      this.props.onSendTestEmail(event, this.props);
    }
  }

  // Group Option render
  renderGroupOptions(elem) {
    const {
      key,
      ...others
    } = elem;
    return <GroupOptItem {...others} key={key} keyValue={key} />;
  }

  render() {
    const {
      id,
      name,
      description,
      subheader,
      language,
      languageList,
      defaultLayout,
      isLoading,
      subject,
      variables,
      template,
      inky,
      css,
      onTemplateChange,
      onCssChange,
    } = this.props;
    const styles = require('./AdminManageEmails.less');
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, naming);

    const cx = classNames.bind(styles);
    const classes = cx({
      Emails: true,
    }, this.props.className);

    const languages = Object.keys(languageList).map((k) => (
      {
        id: k,
        name: languageList[k]
      }
    ));

    const subjectVariables = variables.filter((vSubject) => vSubject.type === 'subject').map(nSubject => nSubject.id);
    const bodyVariables = variables.filter((vSubject) => vSubject.type === 'body');
    const functionVariables = variables.filter((vSubject) => vSubject.type !== 'body' && vSubject.type !== 'subject');

    const hideSubject = (id === 'shared_content_external' || id === 'shared_content_forwarded_external' || id === 'shared_content_forwarded_internal');

    return (
      <div className={classes}>
        <div className={styles.Header}>

          <div className={styles.headerWrapper}>
            <div className={styles.selectWrapper}>
              <h4>{strings.emailType}</h4>
              <Select
                name="categories"
                value={{ id: id, name: name }}
                options={this.getNestedData()}
                valueKey="id"
                labelKey="name"
                searchable
                clearable={false}
                placeholder={strings.search}
                onChange={this.handleCategoryChange}
                className={styles.select}

                valueComponents={(option) => (<span className="Select-value">
                  {subheader && <span className={styles.subHeaderLabel} title={subheader}>{subheader}</span>}
                  <span className="Select-value-label">{option.value.name}</span>
                </span>)}
                filterOptions={this.getFilterOptions}
                optionHeight={({ option }) => (option.type === 'header' ? 25 : 35)}
                optionRenderer={this.renderGroupOptions}
                ref={(ref) => { this._customOptionHeightsSelect = ref; }}
                strings={strings}
              />

              <span className={styles.categoryDescription}>{description}</span>
            </div>

            <div className={styles.selectWrapper}>
              <h4>{strings.language}</h4>
              <Select
                name="language"
                value={{ id: language, name: languageList[language] }}
                options={languages}
                valueKey="id"
                labelKey="name"
                searchable
                clearable={false}
                placeholder="Select"
                onChange={this.handleLanguageChange}
                className={styles.select}
              />
            </div>

            {!defaultLayout && <Btn warning disabled={isLoading || this.props.isTemplateLoading} onClick={this.handleResetLayout}>{strings.resetLayout}</Btn>}
          </div>
        </div>

        {isLoading && <div className={styles.loader}>
          <Loader type="content" />
        </div>}

        {!isLoading && <div className={styles.contentWrapper}>
          {!hideSubject && <section>
            <h4>{strings.emailSubject}</h4>
            <div className={styles.subjectWrapper}>
              <EmailSubjectEditor
                subject={subject}
                variables={subjectVariables || []}
                strings={strings}
                onSave={this.props.onSubjectChange}
              />
            </div>
            <span className={styles.subjectInfo}>{strings.subjectInfo}</span>
          </section>}

          <section>
            <h4>{strings.emailBody}</h4>
            <EmailEditor
              autoFocus={false}
              language={language}
              category={name}
              template={inky}
              css={css}
              strings={strings}
              variables={bodyVariables || []}
              functions={functionVariables || []}
              onTemplateChange={onTemplateChange}
              onCssChange={onCssChange}
              onFocusChange={this.props.onEditorFocusChange}
              onAnchorClick={this.props.onAnchorClick}
              className={styles.emailEditor}
            />
            <div className={styles.editorActionButtons}>
              <Btn
                inverted
                icon="download"
                onClick={this.handleDownloadBackup}
              >
                {strings.backupTemplate}
              </Btn>
              <Btn
                inverted
                onClick={this.handleSendTestEmail}
              >
                {strings.sendTestEmail}
              </Btn>
            </div>
          </section>

          <section>
            <div className={styles.previewHeader}>
              <h4>{strings.emailPreview}</h4>
              <Btn
                alt={!this.props.isTemplateChanged}
                inverted={this.props.isTemplateChanged}
                loading={this.props.isTemplateLoading}
                disabled={!this.props.isTemplateChanged}
                onClick={this.handleReloadPreview}
              >
                {strings.reloadPreview}
              </Btn>
            </div>
            <EmailPreview
              template={template}
              loading={this.props.isTemplateLoading}
              changed={this.props.isTemplateChanged}
              strings={strings}
              className={styles.emailPreview}
            />
          </section>
        </div>}
      </div>
    );
  }
}
