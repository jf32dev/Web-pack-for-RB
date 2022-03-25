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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Tags from './Tags';

const messages = defineMessages({
  suggestions: { id: 'suggestions', defaultMessage: 'Suggestions' },
  noneAvailable: { id: 'no-suggestion', defaultMessage: 'No suggestion' },
  searchPlaceholder: { id: 'tag-filter-placeholder', defaultMessage: 'Search Tag...' },
});

export default class TagFilter extends PureComponent {
  static propTypes = {
    tags: PropTypes.array,
    suggestedTags: PropTypes.array,

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
      this.setState({
        currentSearch: ''
      });
    }
  }

  handleSuggestedTagClick(event) {
    event.preventDefault();
    const { onTagAdd } = this.props;
    const tagId = event.currentTarget.dataset.id;
    const tagName = event.currentTarget.dataset.name;

    if (typeof onTagAdd === 'function') {
      onTagAdd(event, { id: tagId, name: tagName });
      this.setState({
        currentSearch: ''
      });
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
    const value = event.target.value;

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(value)) {
      event.preventDefault();
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { tags, suggestedTags } = this.props;
    const hasTags = suggestedTags.length > 0;
    const styles = require('./TagFilter.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div id="tags-filter" className={styles.TagFilter} style={this.props.style}>
        <div className={styles.tagSearch}>
          {tags && <Tags
            strings={strings}
            list={tags}
            onItemDeleteClick={this.handleDeleteTag}
            className={styles.tagList}
            enableInput
            currentSearch={this.state.currentSearch}
            onInputKeyDown={this.handleInputKeyDown}
            onInputChange={this.handleSearchInputChange}
          />}
        </div>
        <div className={styles.suggestedTags}>
          {!hasTags && this.state.currentSearch && <p>{strings.noneAvailable}</p>}
          {hasTags && <Tags
            list={suggestedTags}
            alt
            onItemClick={this.handleSuggestedTagClick}
          />}
        </div>
      </div>
    );
  }
}
