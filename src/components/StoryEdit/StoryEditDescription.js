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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Editor from 'components/Editor/Editor';
import Textarea from 'components/Textarea/Textarea';

const messages = defineMessages({
  descriptionExcerpt: { id: 'description-excerpt', defaultMessage: 'Description excerpt' },
  excerptPlaceholder: { id: 'story-excerpt-placeholder', defaultMessage: 'Type your excerpt...' },
  messagePlaceholder: { id: 'story-message-placeholder', defaultMessage: 'Type your message...' },
});

export default class StoryEditDescription extends PureComponent {
  static propTypes = {
    excerpt: PropTypes.string,
    message: PropTypes.string,

    accessToken: PropTypes.string,
    createPrompt: PropTypes.func,

    showExcerpt: PropTypes.bool,
    showDescription: PropTypes.bool,
    imageTypes: PropTypes.array,

    editorHeight: PropTypes.number,

    onExcerptChange: PropTypes.func.isRequired,
    onMessageChange: PropTypes.func.isRequired,
    onImageUploadRejected: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    showExcerpt: true,
    showDescription: true,
    imageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    editorHeight: 300
  };

  constructor(props) {
    super(props);
    this.toolbar = [['bold', 'italic', 'underline', '|', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'insertLink', 'showAnchor', 'insertImage', 'insertTable', 'insertHR', 'clearFormatting', 'html']];
    // Customise Froala options
    this.editorOptions = {
      heightMax: props.editorHeightMax,
      heightMin: props.editorHeight,
      htmlRemoveTags: ['script', 'base'],
      iframeDefaultStyle: '',
      linkAlwaysBlank: true,
      linkAttributes: {
        rel: 'Relationship'
      },
      linkAutoPrefix: 'https://',
      linkConvertEmailAddress: true,
      linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
      linkInsertButtons: ['linkBack'],
      linkList: [],
      linkStyles: {},
      tabSpaces: 4,
      toolbarButtons: this.toolbar,
      toolbarButtonsMD: this.toolbar,
      toolbarButtonsSM: this.toolbar,
      toolbarButtonsXS: this.toolbar,
      imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
      imageUploadParams: {
        name: 'file',
      },
      imageUploadURL: `${window.BTC.BTCAPI}/story/uploadFile?upload_type=description_image`,
      imageMaxSize: 5 * 1024 * 1024,
      imageDefaultWidth: 200,
      imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|', 'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-', 'imageDisplay', 'imageAlt', 'imageSize'],
      imageDefaultDisplay: 'inline',
      imageResizeWithPercent: false,
      imageOutputSize: true,
      events: {
        'image.uploaded': this.handleImageUploaded.bind(this),
        'image.beforeUpload': this.handleImageBeforeUploaded.bind(this)
      },
    };

    autobind(this);
  }

  handleImageUploaded(response) {
    const responseData = JSON.parse(response);
    const discEditor = window.editor;

    discEditor.image.insert(responseData.url, true, null, discEditor.image.get(), null);
    return false;
  }

  handleImageBeforeUploaded(images) {
    // Image too text-large.
    if (images[0].size > 5 * 1024 * 1024) {
      this.props.onImageUploadRejected('size');
      return false;
    }

    if (this.props.imageTypes.indexOf(images[0].type) === -1) {
      this.props.onImageUploadRejected('format');
      return false;
    }
    return true;
  }

  handleFroalaInit() {
    // Adding id supports for NightWatch tests
    document.getElementById('story-edit-description').querySelector('iframe').setAttribute('id', 'FroalaEditorStory');
  }

  render() {
    const { theme } = this.context.settings;
    const { formatMessage, locale } = this.context.intl;
    const { showDescription, showExcerpt, accessToken } = this.props;
    const styles = require('./StoryEditDescription.less');
    const reset = require('./editorReset.min.css.raw');
    const editorStyle = reset + `a{color:${theme.baseColor}}`;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div id="story-edit-description" className={styles.StoryEditDescription}>
        {showDescription && <Editor
          id="story-edit-message"
          defaultValue={this.props.message}
          editorStyle={editorStyle}
          froalaOptions={{
            ...this.editorOptions,
            language: locale,
            requestHeaders: {
              Authorization: 'Bearer ' + accessToken,
            }
          }}
          placeholder={strings.messagePlaceholder}
          onChange={this.props.onMessageChange}
          onInit={this.handleFroalaInit}
        />}
        {showExcerpt && <div className={styles.excerpt}>
          {showDescription && <h4>{strings.descriptionExcerpt}</h4>}
          <Textarea
            id="story-edit-excerpt"
            placeholder={strings.excerptPlaceholder}
            value={this.props.excerpt}
            rows={1}
            maxLength={90}
            onChange={this.props.onExcerptChange}
          />
        </div>}
      </div>
    );
  }
}
