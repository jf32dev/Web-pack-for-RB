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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames/bind';

import DropMenu from 'components/DropMenu/DropMenu';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

const PageSearchStoryItem = props => {
  const {
    id,
    permId,
    name,
    excerpt,
    isLiked,
    isBookmark,
    updatedAt: dateModified,
    channel,
    tab,
    className,
    strings,
    style,

    onClick,
    setReferrerPath
  } = props;

  const styles = require('./PageSearchStoryItem.less');
  const dropDownMenuOptions = React.useRef(null);

  const cx = classNames.bind(styles);

  const imgOrientationClass = cx({
    imageContainer: true,
  }, className);

  const handleClick = (e, action) => {
    if (e) e.preventDefault();
    const isDropMenuClicked = e.target.closest('#dropmenu');
    if (!isDropMenuClicked && typeof onClick === 'function' && e.target.data !== 'dropmenu') {
      onClick(e, action, props);
    }
  };

  // Story anchor URL
  const anchorUrl = `/story/${(permId || id)}`;

  // create breadcrumbs paths
  const getPaths = () => {
    const { tabId, tabName } = tab;

    return [
      // tab path
      { name: tabName, path: `/content/tab/${tabId}` },
      // channel path
      { name: channel.name, path: `/content/tab/${tabId}/channel/${channel.id}` }
    ];
  };

  /**
   * scroll up the screen, let the user see the full list of drop-down menu options
   * @function handleDropMenuClick
   * @returns void
   */
  const handleDropMenuClick = () => {
    if (dropDownMenuOptions.current) {
      // if the options menu is out of the browser window
      // auto scroll the menu into browser window view
      const { bottom } = dropDownMenuOptions.current.getBoundingClientRect();
      const { innerHeight } = window;
      if (bottom > innerHeight) {
        dropDownMenuOptions.current.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' });
      }
    }
  };

  return (
    <span
      className={styles.PageSearchStoryItem}
      aria-label={name}
      style={style}
    >
      <div className={imgOrientationClass}>
        <a
          href={anchorUrl}
          rel="noopener noreferrer"
          aria-label={name}
          onClick={(e) => handleClick(e, 'open')}
        >
          <StoryThumbNew
            showThumb
            customThumbSize={142}
            showBadges
            showIcons
            onClick={(e) => handleClick(e, 'open')}
            className={styles.listItem}
            {...props}
          />
        </a>
      </div>
      <div className={styles.info}>
        <div className={styles.metadata}>
          <span>{`${strings.updated} `}</span>
          <FormattedDate
            value={dateModified}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </div>
        <a
          href={anchorUrl}
          rel="noopener noreferrer"
          aria-label={name}
          onClick={(e) => handleClick(e, 'open')}
        >
          <label className={styles.name} title={name}>{name}</label>
          <p>{excerpt}</p>
        </a>
        <div className={styles.breadcrumbsContainer}>
          <span className={styles.label}>{strings.foundIn}:</span>
          <Breadcrumbs
            paths={getPaths()}
            className={styles.breadcrumbs}
            onPathClick={(event) => {
              event.preventDefault();

              const path = event.currentTarget.dataset.path || event.currentTarget.getAttribute('href');
              const { pathname, search } = props.history.location;
              if (path) {
                setReferrerPath(`${pathname}${search}`);
                props.history.push(path);
              }
            }}
          />
        </div>
      </div>
      <DropMenu
        id="dropmenu"
        icon="more"
        className={styles.dropMenu}
        position={{ right: 0 }}
        onClick={handleDropMenuClick}
      >
        <ul ref={dropDownMenuOptions}>
          <li data-path={anchorUrl} onClick={(e) => onClick(e, 'open', props)}>{strings.open}</li>
          <li onClick={(e) => onClick(e, 'share', props)}>{strings.share}</li>
          <li onClick={(e) => onClick(e, 'like', props)}>{isLiked ? strings.removeLike : strings.like}</li>
          <li onClick={(e) => onClick(e, 'bookmark', props)}>{isBookmark ? strings.removeBookmark : strings.bookmark}</li>
        </ul>
      </DropMenu>
    </span>
  );
};

PageSearchStoryItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  excerpt: PropTypes.string,
  updated: PropTypes.number,
  authString: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

PageSearchStoryItem.defaultProps = {
  authString: '',
  strings: {
    story: 'story',
    share: 'Share',
    like: 'Like',
    removeLike: 'Remove Like',
    bookmark: 'Bookmark',
    removeBookmark: 'Remove Bookmark',
    modified: 'Modified',
  }
};

export default withRouter(PageSearchStoryItem);
