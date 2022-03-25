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

import Tags from 'components/Tags/Tags';

const messages = defineMessages({
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  noneAvailable: { id: 'none-available', defaultMessage: 'None available' },
  searchPlaceholder: { id: 'tag-search-placeholder', defaultMessage: 'New Tag...' },
});

export default class StoryEditTags extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    suggestedTags: PropTypes.array,
    readonly: PropTypes.bool,

    strings: PropTypes.object,

    onTagAdd: PropTypes.func.isRequired,
    onTagDelete: PropTypes.func.isRequired,
    onTagSearchChange: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    tags: [],
    suggestedTags: []
  };

  constructor(props) {
    super(props);
    this.state = {
      currentSearch: ''
    };
    autobind(this);
  }

  handleDeleteTag(event) {
    event.preventDefault();
    const { onTagDelete } = this.props;
    const tagIndex = event.currentTarget.dataset.index;

    if (typeof onTagDelete === 'function') {
      onTagDelete(event, tagIndex);
    }
  }

  handleSuggestedTagClick(event) {
    event.preventDefault();
    const { onTagAdd } = this.props;
    const tagName = event.currentTarget.dataset.name;

    if (typeof onTagAdd === 'function') {
      onTagAdd(event, tagName);
    }
  }

  handleSearchInputChange(event) {
    const { onTagSearchChange } = this.props;
    const value = event.target.value;

    this.setState({
      currentSearch: value
    });

    // Propagate event
    if (typeof onTagSearchChange === 'function') {
      onTagSearchChange(event, value);
    }
  }

  handleInputKeyDown(event) {
    const { onTagAdd } = this.props;
    const value = event.target.value;

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(value)) {
      event.preventDefault();

      this.setState({ currentSearch: '' });

      if (typeof onTagAdd === 'function') {
        onTagAdd(event, value);
      }
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { tags, suggestedTags, readonly } = this.props;
    const hasTags = suggestedTags.length > 0;
    const styles = require('./StoryEditTags.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div id="story-edit-tags" className={styles.StoryEditTags}>
        <div className={styles.tagSearch}>
          {tags && <Tags
            strings={strings}
            list={tags}
            disabled={readonly}
            onItemDeleteClick={this.handleDeleteTag}
            className={styles.tagList}
            enableInput
            currentSearch={this.state.currentSearch}
            onInputKeyDown={this.handleInputKeyDown}
            onInputChange={this.handleSearchInputChange}
          />}
        </div>
        {!readonly && <div className={styles.suggestedTags}>
          <h5>{strings.suggestions}</h5>
          {!hasTags && <p>{strings.noneAvailable}</p>}
          {hasTags && <Tags
            list={suggestedTags}
            alt
            onItemClick={this.handleSuggestedTagClick}
          />}
        </div>}
      </div>
    );
  }
}
