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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getLanguage,
  getNaming,
  postNaming,
} from 'redux/modules/admin/namingConvention';
import { createPrompt } from 'redux/modules/prompts';

import AdminNamingConvention from 'components/Admin/AdminNamingConvention/AdminNamingConvention';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  tab: {
    id: 'tab-title',
    defaultMessage: 'Tab'
  },
  channel: {
    id: 'channel-tag-title',
    defaultMessage: 'Channel',
  },
  story: {
    id: 'story-tag-title',
    defaultMessage: 'Story'
  },
  meeting: {
    id: 'meeting-tag-title',
    defaultMessage: 'Meeting'
  },
  plural: {
    id: 'plural',
    defaultMessage: 'Plural'
  },
  singular: {
    id: 'singular',
    defaultMessage: 'Singular'
  },
  customNamingConvention: {
    id: 'custom-naming-convention',
    defaultMessage: 'Custom Naming Convention'
  },
  language: {
    id: 'language',
    defaultMessage: 'Language'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  discard: {
    id: 'discard',
    defaultMessage: 'Discard'
  },
  unSaveChanges: {
    id: 'un-save-changes',
    defaultMessage: 'Unsaved Changes'
  },
  discardMessage: {
    id: 'discard-message',
    defaultMessage: 'If you change languages you will lose any unsaved changes you have made. Would you like to save your changes?'
  },
  emptyErrorMessage: {
    id: 'empty-error-message',
    defaultMessage: 'The value of the inputs could not be empty',
  },
  storyFlags: {
    id: 'story-flags',
    defaultMessage: '{story} Flags'
  },
  major: {
    id: 'major',
    defaultMessage: 'Major'
  },
  minor: {
    id: 'minor',
    defaultMessage: 'Minor'
  },
  possible: {
    id: 'possible',
    defaultMessage: 'Possible'
  },
  redFlag: {
    id: 'red-flag',
    defaultMessage: 'Red Flag'
  },
  yellowFlag: {
    id: 'yellow-flag',
    defaultMessage: 'Yellow Flag'
  },
  blueFlag: {
    id: 'blue-flag',
    defaultMessage: 'Blue Flag'
  }
});

@connect(state => state.admin.namingConvention,
  bindActionCreatorsSafe({
    getLanguage,
    getNaming,
    postNaming,
    createPrompt
  })
)
export default class AdminNamingConventionViewer extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    encryption: 'none',
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidMount() {
    if (typeof this.props.getNaming === 'function') {
      this.props.getNaming(null, 'initNameLoad');
    }
    if (typeof this.props.getLanguage === 'function') {
      this.props.getLanguage('initLangLoad');
    }
  }

  componentDidUpdate(prevProps) {
    /*error*/
    if (!_get(prevProps, 'error', false) && _get(this.props, 'error', false)) {
      this.props.createPrompt({
        id: 'custom-naming-error',
        type: 'error',
        title: 'Error',
        message: this.props.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    /* success message for save*/
    if (!_get(prevProps, 'NamingPosted', false) && _get(this.props, 'NamingPosted', false)) {
      const saveSuccessMessage = (<FormattedMessage
        id="save-success-message"
        defaultMessage="Saved"
      />);

      this.props.createPrompt({
        id: 'custom-naming-success',
        type: 'success',
        title: 'success',
        message: saveSuccessMessage,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  handleGetLanguage(langCode) {
    if (typeof this.props.getNaming === 'function') {
      this.props.getNaming({ lang_code: langCode });
    }
  }

  handleSaveNaming(naming, notUpdate) {
    if (typeof this.props.postNaming === 'function') {
      this.props.postNaming(naming, notUpdate);
    }
  }

  handleEmptyError() {
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    this.props.createPrompt({
      id: 'custom-naming-empty-error',
      type: 'error',
      title: 'Error',
      message: strings.emptyErrorMessage,
      dismissible: true,
      autoDismiss: 5
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming: customNaming } = this.context.settings;
    const {
      className,
      style,
      initLangLoaded,
      initNameLoaded,
      NamingLoading,
      NamingPosting,
      language,
      naming,
    } = this.props;

    const strings = generateStrings(messages, formatMessage, { story: naming && (naming.story.custom || naming.story.original) || customNaming.story });

    return (
      <div className={className} style={style}>
        {(!initLangLoaded || !initNameLoaded) && <Loader type="page" />}
        {initLangLoaded && initNameLoaded && <AdminNamingConvention
          strings={strings}
          onExecute={this.handleExecute}
          language={language}
          isLoaded={!NamingLoading && !NamingPosting}
          naming={naming}
          onGetLanguage={this.handleGetLanguage}
          languageCode={this.context.settings.user.langCode}
          onSave={this.handleSaveNaming}
          onSaveNotUpdate={this.handleSaveNaming}
          onEmptyError={this.handleEmptyError}
        />}
      </div>
    );
  }
}
