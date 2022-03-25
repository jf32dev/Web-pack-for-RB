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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

// redux
import {
  getTaggingGuidelines,
  updateTaggingGuidelines
} from 'redux/modules/admin/stories';

// components
import Loader from 'components/Loader/Loader';
import Editor from 'components/Editor/Editor';
import Btn from 'components/Btn/Btn';
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';

const messages = defineMessages({
  messagePlaceholder: { id: 'type-your-guideline', defaultMessage: 'Type your guideline...' },
  save: { id: 'save', defaultMessage: 'Save' },
  storyTaggingGuidelinesText: { id: 'story-tagging-guidelines-text', defaultMessage: '{story} Tagging Guidelines' }
});

function mapStateToProps(state) {
  return {
    taggingGuidelines: state.admin.stories.taggingGuidelines
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getTaggingGuidelines,
    updateTaggingGuidelines
  })
)

export default class AdminTaggingGuidelines extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  }

  static propTypes = {
    taggingGuidelines: PropTypes.string,
    editorHeight: PropTypes.number,
  }

  static defaultProps = {
    taggingGuidelines: '',
    editorHeight: 300
  }

  constructor(props) {
    super(props);
    this.toolbar = ['bold', 'italic', 'underline', '|', 'insertLink'];
    // Customise Froala options
    this.editorOptions = {
      heightMax: 300,
      heightMin: 200,
      htmlRemoveTags: ['script', 'base'],
      iframeDefaultStyle: '',
      linkAlwaysBlank: true,
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
      events: {},
    };

    this.state = {
      loaded: false,
      textChanged: false
    };

    autobind(this);
  }

  componentDidMount() {
    this.props.getTaggingGuidelines()
      .then(() => {
        // set loaded state to true once to render component
        this.setState({ loaded: true });
      });
  }

  handleFroalaInit(context) {
    // Adding id supports for NightWatch tests
    context.currentTarget.parentElement.querySelector('iframe').setAttribute('id', 'FroalaEditorTaggingGuidelines');
  }

  handleMessageChange() {
    this.setState({
      textChanged: true
    });
  }

  handleSaveChange() {
    this.props.updateTaggingGuidelines(this.editorEl.editor.oldModel);
    this.setState({
      textChanged: false
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { taggingGuidelines } = this.props;
    const { loaded } = this.state;
    const styles = require('./AdminTaggingGuidelines.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);
    return (
      <div id="admin-tagging-guidelines" className={styles.AdminTaggingGuideline}>
        {!loaded && <Loader type="page" />}
        {loaded && <div className={styles.taggingHeader}>
          <div className={styles.taggingTitle}>{strings.storyTaggingGuidelinesText}</div>
          <Btn
            className={styles.saveButton}
            inverted
            disabled={!this.state.textChanged}
            id="save"
            onClick={this.handleSaveChange}
          >
            {strings.save}
          </Btn>
        </div>}
        {loaded && <Editor
          ref={(el) => { this.editorEl = el; }}
          id="edit-hubshare-text"
          defaultValue={taggingGuidelines}
          froalaOptions={{
            ...this.editorOptions
          }}
          placeholder={strings.messagePlaceholder}
          onChange={this.handleMessageChange}
          onInit={this.handleFroalaInit}
        />}
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={this.state.textChanged} />}
      </div>
    );
  }
}
