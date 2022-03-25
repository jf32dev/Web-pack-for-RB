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
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Text from 'components/Text/Text';

/**
 * Display suggested story tags and make selection for filtering by tags.
 */
export default class Tags extends Component {
  static propTypes = {
    /** Array of tag objects ({id: tagId, name: tagName}) */
    list: PropTypes.array.isRequired,

    /** If passed, the tag will render as an anchor */
    rootUrl: PropTypes.string,

    /** Alternate style */
    alt: PropTypes.bool,

    /** Shows an input text at the end of the list */
    enableInput: PropTypes.bool,

    /** current Tag search value, used in input field */
    currentSearch: PropTypes.string,

    strings: PropTypes.object,

    /** Required when rootUrl is passed */
    onItemClick: function(props) {
      if (props.rootUrl && typeof props.onItemClick !== 'function') {
        return new Error('onItemClick is required when rootUrl is provided.');
      }
      return null;
    },
    /** Required when enableInput is passed */
    onInputChange: function(props) {
      if (props.enableInput && typeof props.onInputChange !== 'function') {
        return new Error('onInputChange is required when enableInput is provided.');
      }
      return null;
    },
    /** Required when enableInput is passed */
    onInputKeyDown: function(props) {
      if (props.enableInput && typeof props.onInputKeyDown !== 'function') {
        return new Error('onInputKeyDown is required when enableInput is provided.');
      }
      return null;
    },

    /** Handler to remove a tag */
    onItemDeleteClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,
    itemClassName: PropTypes.string,
    itemStyle: PropTypes.object,
  };

  static defaultProps = {
    list: [],
    strings: {
      tagTitle: 'Search by tag: ',
      searchPlaceholder: 'Search Tag...'
    }
  };

  render() {
    const { enableInput, list, rootUrl, alt, strings, onItemClick, onItemDeleteClick } = this.props;
    const styles = require('./Tags.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Tags: true,
      hasLink: rootUrl,
      isClickable: onItemClick,
      alt: alt
    }, this.props.className);

    const itemClasses = cx({
      tagItem: true
    }, this.props.itemClassName);

    return (
      <ul className={classes} style={this.props.style}>
        {list.map((tag, index) => (
          <li
            key={tag.id} className={itemClasses} data-id={tag.id}
            data-name={tag.name} style={this.props.itemStyle} onClick={!rootUrl && onItemClick}
          >
            <div className={styles.tabItemRoot}>
              {rootUrl && <a
                href={rootUrl + tag.name} title={strings.tagTitle + tag.name} data-id={tag.id}
                data-name={tag.name} onClick={onItemClick}
              >{tag}</a>}
              {!rootUrl && <span className={styles.tagValue}>{tag.name}</span>}
              {onItemDeleteClick && <div className={styles.deleteContainer}><span className={styles.deleteTag} data-index={index} onClick={onItemDeleteClick} /></div>}
            </div>
          </li>))}
        {enableInput && <li key="tag-input" className={styles.itemTagText}>
          <Text
            value={this.props.currentSearch}
            placeholder={strings.searchPlaceholder}
            onChange={this.props.onInputChange}
            onKeyDown={this.props.onInputKeyDown}
            className={styles.tagText}
          />
        </li>}
      </ul>
    );
  }
}
