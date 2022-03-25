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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import StoryItem from 'components/StoryItem/StoryItem';

export default class StorySearchItem extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    permId: PropTypes.number,
    name: PropTypes.string.isRequired,
    colour: PropTypes.string,
    thumbnail: PropTypes.string,
    channel: PropTypes.object,

    /** Valid comment user data */
    author: PropTypes.object,
    excerpt: PropTypes.string,
    updated: PropTypes.number,
    note: PropTypes.string,

    channelName: PropTypes.string,
    channelId: PropTypes.number,

    searchResult: PropTypes.object,

    tags: PropTypes.array,

    showThumb: PropTypes.bool,
    selected: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object,
    searchType: PropTypes.string
  };

  static defaultProps = {
    searchResult: {},
    authString: '',
    showAuthor: true,
    tags: [],
  };

  renderTags(styles) {
    const { tags } = this.props;
    return <div className={styles.tagContiner}>{tags.map(tag =>  <div className={styles.tagItem} key={tag.id}><div>{tag.name}</div></div>)}</div>;
  }

  render() {
    const {
      name,
      excerpt,
      channel,
      selected,
      searchResult,
      className,
      style,
      showAuthor
    } = this.props;
    const styles = require('./StorySearchItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      StorySearchItem: true,
      selected: selected
    }, className);
    const channelName =  channel ? channel.name : '';
    let nameElem = <span className={styles.name}>{name}</span>;
    if (searchResult.name) {
      nameElem = <span className={styles.name} dangerouslySetInnerHTML={{ __html: searchResult.name }} />;
    }

    let excerptElem = <span className={styles.excerpt}>{excerpt}</span>;
    if (searchResult.description) {
      excerptElem = <span className={styles.excerpt} dangerouslySetInnerHTML={{ __html: searchResult.description }} />;
    }
    return (
      <div className={itemClasses} style={style}>
        <StoryItem
          showTags={this.props.searchType === 'tags'}
          thumbSize="medium"
          showBadges
          showThumb
          onClick={this.props.onClick}
          isQuicklink={this.props.quickLink !== ''}
          quicklinkUrl={this.props.quickLink}
          isQuickfile={this.props.quickFile}
          {...this.props}
          showAuthor={showAuthor}
        >
          {nameElem}
          {channelName && <span className={styles.channel}>{channelName}</span>}
          {excerptElem}
          <div>{this.renderTags(styles)}</div>
        </StoryItem>
      </div>
    );
  }
}
