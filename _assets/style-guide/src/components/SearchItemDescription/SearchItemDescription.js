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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import PropTypes from 'prop-types';
import React from 'react';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import classNames from 'classnames/bind';
import _get from 'lodash/get';

const messages = defineMessages({
  foundIn: { id: 'found-in', defaultMessage: 'Found in' }
});

const SearchItemDescription = (props, context) => {
  const {
    description,
    story,
    excerpt,
    fileSettings,
    onSetStoryReferrerPath,
    onBookmarkClick,
    onShareClick,
    shareStatus,
    id,
    bookmarkLoading,
    currentFileId,
    downloadUrl,
    onDownloadClick,
    authString,
    hasShare,
    bookmarks,
    permId,
    filename,
    tab
  } = props;
  const style = require('./SearchItemDescription.less');

  const handleAnchorClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const href = event.currentTarget.getAttribute('href');
    const { pathname, search } = context.router.history.location;
    onSetStoryReferrerPath(pathname + search);
    context.router.history.push(href, { modal: false });
  };

  // Translations
  const { formatMessage } = context.intl;
  const strings = generateStrings(messages, formatMessage);
  const channelUrl = tab && (tab.tabId || tab.tab_id) ? `content/tab/${tab.tabId || tab.tab_id}/channel/${story.channel.id}` : null;

  const isBookmarkSelf = bookmarks.filter(b => (b.stackSize === 1 || b.name === description));
  const bookmarkRemoveClass = bookmarks.length && isBookmarkSelf.length;

  const cx = classNames.bind(style);
  const bookmarkClasses = cx({
    bookmarkIcon: true,
    bookmarkRemove: bookmarkRemoveClass,
    disable: id === currentFileId && bookmarkLoading,
    actions: true
  });

  const isBlocked = shareStatus === 'blocked';

  const currentBookmark = bookmarks.find(b => b.stackSize === 1 || b.name === description);

  const bookmarkProps = {
    bookmarkId: currentBookmark && currentBookmark.id,
    id,
    description,
    permId,
    story,
    filename
  };

  const showContentApproveBadge = _get(fileSettings, 'fileGeneralSettings.showCustomFileDetailsIcon', false) && props.customDetailsIsEnabled;
  const nameClasses = cx({
    name: true,
    showApproveBadge: showContentApproveBadge
  });

  return (
    <div className={style.searchItemDescription}>
      <div className={style.nameContainer}>
        <div className={nameClasses}>{description}</div>
        <div data-id="bookmark" className={bookmarkClasses} onClick={(event) => onBookmarkClick(event, bookmarkProps, isBookmarkSelf.length)} />
        {!isBlocked && hasShare && <div data-id="email" className={`${style.shareIcon} ${style.actions}`} onClick={(event) => onShareClick(event, [{ ...props }])} />}
        {downloadUrl && !isBlocked && <div data-id="download" className={`${style.downloadIcon} ${style.actions}`} onClick={(event) => onDownloadClick(event, downloadUrl, authString)} />}
      </div>
      <div className={style.content} dangerouslySetInnerHTML={{ __html: excerpt }} />
      <div className={style.navPath}>
        {strings.foundIn}:
        <a href={channelUrl} onClick={handleAnchorClick}>{story.channel.name}</a>
        <span>&rsaquo;</span>
        <a href={`/story/${story.permId}`} onClick={handleAnchorClick}>{story.title}</a>
      </div>
    </div>
  );
};

SearchItemDescription.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  filename: PropTypes.string,
  description: PropTypes.string.isRequired,
  searchKeyword: PropTypes.string,
  excerpt: PropTypes.string,
  onSetStoryReferrerPath: PropTypes.func,
  onBookmarkClick: PropTypes.func.isRequired,
  onShareClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  bookmarks: PropTypes.array,
  shareStatus: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string,
  authString: PropTypes.string,
  hasShare: PropTypes.bool.isRequired
};

SearchItemDescription.contextTypes = {
  router: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};

export default SearchItemDescription;
