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
import take from 'lodash/take';

import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

/**
 * Displays a list of popular & recent searches and allows a custom input.
 */
export default class SearchModal extends PureComponent {
  static propTypes = {
    /** Search input placeholder text */
    isVisible: PropTypes.bool,

    /** value of controlled Text component */
    searchValue: PropTypes.string,

    strings: PropTypes.object,

    onClose: PropTypes.func.isRequired,
    onSearchInputChange: PropTypes.func.isRequired,
    onSearchKeyUp: PropTypes.func,
    onTagSelected: PropTypes.func,

    /** List of tags */
    tags: PropTypes.array,
  };

  static defaultProps = {
    popular: [],
    recent: [],
    searchValue: '',
    strings: {
      search: 'Search',
      popularSearches: 'Popular Searches',
      recentSearches: 'Recent Searches'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  componentDidUpdate() {
    if (this.props.isVisible) {
      setTimeout(() => {
        if (this.keywordInput) {
          this.keywordInput.focus();
        }
      }, 200);
    }
  }

  handleInputKeyUp(event) {
    // Trigger modal close on ESC
    if (event.keyCode === 27) {
      this.props.onClose(event);

    // Propagate other keys
    } else if (typeof this.props.onSearchKeyUp === 'function') {
      this.props.onSearchKeyUp(event);
    }
  }

  handleTagClick(tag) {
    const { onTagSelected } = this.props;
    if (onTagSelected && typeof onTagSelected === 'function') {
      onTagSelected(tag);
    }
  }

  renderTagsResults(styles) {
    const {
      tags,
      strings
    } = this.props;
    if (tags && tags.length === 0) {
      return (<div className={styles.noTag}>
        <span className={styles.tagIcon} />
        <span className={styles.noRelatedTags}>{strings.noRelatedTags}</span>
      </div>);
    }
    return take(tags, 10).map((tag) => <div key={tag.id} className={styles.tagItem} onClick={this.handleTagClick.bind(this, tag)}>{tag.name}</div>);
  }

  render() {
    const {
      isVisible,
      strings,
    } = this.props;
    const styles = require('./SearchModal.less');
    const cx = classNames.bind(styles);
    const bodyClasses = cx({
      modalBody: true
    }, this.props.className);

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        width="medium"
        headerChildren={(
          <div className={styles.keywordWrap}>
            <Text
              ref={(c) => { this.keywordInput = c; }}
              tabIndex={1}
              icon="search"
              value={this.props.searchValue}
              placeholder={strings.search}
              onChange={this.props.onSearchInputChange}
              onKeyUp={this.handleInputKeyUp}
              className={styles.keywordInput}
            />
          </div>
        )}
        headerClassName={styles.modalHeader}
        bodyClassName={bodyClasses}
        onClose={this.props.onClose}
      >
        <div className={styles.bodyContainer}>
          <h4>{strings.tagSearches}</h4>
          <div className={styles.tagContainer}>
            {this.renderTagsResults(styles)}
          </div>
        </div>
      </Modal>
    );
  }
}
