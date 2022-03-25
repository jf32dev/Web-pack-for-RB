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

import _get from 'lodash/get';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames/bind';
import MEDIA_TYPES from '../FileItemNew/FileType';

import Checkbox from 'components/Checkbox/Checkbox';
import DropMenu from 'components/DropMenu/DropMenu';
import Icon from 'components/Icon/Icon';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Loader from 'components/Loader/Loader';

const PageSearchFileItem = props => {
  const {
    allowAddToEditor,
    authString,
    blocks,
    bookmarks,
    category,
    createdAt: dateModified,
    description: name,
    excerpt,
    id,
    story,
    tab,
    isChecked,
    isGrid,
    isSelectModeEnabled,
    hasPitchBuilderWeb,
    matchedBlocks,
    showContentApprovedBadge,
    stackItem,
    customDetailsIsEnabled,
    fileGeneralSettings,
    showStack,
    thumbnail,

    className,
    strings,
    style,

    onCheckboxChange,
    onClick,
    onMenuClick,
    onOpenPagesClick,
    generateThumbnails,

    setReferrerPath
  } = props;

  // For page search
  const canAddToEditor = matchedBlocks[0] && allowAddToEditor ? matchedBlocks.filter(i => i.canAddToCanvas).length > 0 : false;

  // For File search
  const canAddFileToEditor = category === 'video' && (blocks && blocks.length > 0 || canAddToEditor);
  const canAddAllToEditor = category !== 'video' && (blocks && blocks.length > 0 || canAddToEditor);

  const imgElementRef = useRef(null);
  const dropDownMenuOptions = useRef(null);
  const [opacity, setImgOpacity] = useState(0);
  const [orientation, setOrientation] = useState();
  const singleMatch = matchedBlocks.length === 1;
  const isDisabled = isSelectModeEnabled && singleMatch && !canAddToEditor && hasPitchBuilderWeb;
  const showOpenStackBtn = !singleMatch && !isSelectModeEnabled && !showStack;
  const isBookmarked = bookmarks && bookmarks.find(b => b.stackSize === 1);

  const styles = require('./PageSearchFileItem.less');

  const cx = classNames.bind(styles);

  const itemClass = cx({
    PageSearchFileItem: true,
    isGrid: isGrid,
    isSelected: isChecked && (canAddAllToEditor || canAddFileToEditor),
    isList: !isGrid,
    disabled: isDisabled,
    pageAdded: stackItem && !isSelectModeEnabled && singleMatch && !canAddToEditor && hasPitchBuilderWeb
  }, className);

  const isFullSize = (!excerpt || category === 'image') && !showOpenStackBtn && isGrid;
  const imgClass = cx({
    imageContainer: true,
    portrait: orientation === 'portrait' && !isFullSize,
    landscape: orientation === 'landscape' && !isFullSize && !isGrid,
    isFullSize: isFullSize,
    imgFullSizeLandscape: isGrid && orientation === 'landscape',
    stackedPage: matchedBlocks.length > 1
  });

  const iconDefaultClass = cx({
    iconDefault: true,
    [`icon-${category}`]: true,
  });

  const footerClass = cx({
    footer: true,
    hoverState: !isSelectModeEnabled && (canAddAllToEditor || canAddFileToEditor),
    selectModeFooter: isSelectModeEnabled && (canAddAllToEditor || canAddFileToEditor)
  });

  const labelClass = cx({
    name: true,
  });

  const badgeStyle = {
    backgroundColor: `${MEDIA_TYPES[category].color}`,
  };

  const fileDetailLabel = _get(fileGeneralSettings, 'detailsFieldLabel', '');
  const showApprovedBadge = showContentApprovedBadge && customDetailsIsEnabled && !isSelectModeEnabled;

  // Use matchedBlocks thumbUrl
  let thumbnailUrl = (!singleMatch || category === 'video') && thumbnail;  //show file thumbnail only when there is stack of pages or file category is video
  if (matchedBlocks[0] && matchedBlocks[0].thumbnailUrl && singleMatch) {
    thumbnailUrl = matchedBlocks[0].thumbnailUrl;
  }

  // Add auth string
  if (thumbnailUrl && authString) {
    thumbnailUrl += authString.indexOf('access_token') ? authString : `&access_token=${authString}`;
  }

  const isThumbnailLoading = !thumbnailUrl;

  const getPageNumber = () => {
    // Count matches
    let matchLocation = strings.preview;
    let textMatchCount = 0;

    // Single match
    if (singleMatch) {
      switch (category) {
        // Add 'Page' in front of match string
        case 'pdf':
          matchLocation = `${strings.page} ${matchedBlocks[0].page}`;
          break;
        // Add 'Slide' in front of match string
        case 'powerpoint':
          matchLocation = `${strings.slide} ${matchedBlocks[0].page}`;
          break;
        // Display match time
        case 'video':
          matchLocation = matchedBlocks[0].time;
          break;
        default:
          break;
      }

      // Summarise multiple matches
      // all results currently text
      // image and video to follow
    } else {
      textMatchCount = matchedBlocks.length;
    }

    return { matchLocation, textMatchCount };
  };

  const getPaths = () => {
    const { channel, permId, title } = story;
    const { tabId, tabName } = tab;

    return [
      // tab path
      { name: tabName, path: `/content/tab/${tabId}` },
      // channel path
      { name: channel.name, path: `/content/tab/${tabId}/channel/${channel.id}` },
      // story path
      { name: title, path: `/story/${permId}` }
    ];
  };

  const handleCheckboxChange = (e, toggle) => {
    if (canAddToEditor && typeof onCheckboxChange === 'function') {
      const checked = typeof toggle !== 'undefined' ? toggle : e.currentTarget.checked;
      onCheckboxChange(checked, matchedBlocks[0].id);
    }
  };

  const handleClick = (e) => {
    const isDropMenuClicked = e.target.closest('#dropmenu');
    const canOpen = !isGrid || singleMatch || showStack;
    if (!isDropMenuClicked && !isSelectModeEnabled && canOpen && typeof onClick === 'function' && e.target.data !== 'dropmenu') {
      onClick(e, props);
    } else if (e.target.nodeName !== 'LABEL') {
      handleCheckboxChange(e, !isChecked);
    }
  };

  const handleOpenPagesClick = (e) => {
    const isDropMenuClicked = e.target.closest('#dropmenu');
    if (!isDropMenuClicked && typeof onOpenPagesClick === 'function') {
      onOpenPagesClick(props);
    }
  };

  const handleMenuClick = (action) => {
    if (typeof onMenuClick === 'function') {
      onMenuClick(action, props);
    }
  };

  const handleAddToPitchBuilder = () => {
    handleMenuClick(isGrid || canAddFileToEditor ? 'canvas' : 'canvas-all');
  };

  const calculateImageOrientation = () => {
    let imgOrientation = 'portrait';
    if (imgElementRef.current) {
      imgOrientation = imgElementRef.current.offsetHeight > imgElementRef.current.offsetWidth ? 'portrait' : 'landscape';
      setImgOpacity(1);
    }
    setOrientation(imgOrientation);
  };

  const largeCardImgCalculator = () => {
    if (thumbnailUrl) {
      const newImg = new Image();
      newImg.onload = () => {
        const imgOrientation = newImg.height > newImg.width ? 'portrait' : 'landscape';
        setOrientation(imgOrientation);
      };
      newImg.src = thumbnailUrl;
    }
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

  useEffect(() => {
    if (isGrid) { // calculate largeCard img size to set cover landscaping images
      largeCardImgCalculator();
      if (!showStack && category !== 'video' && matchedBlocks[0] && !matchedBlocks[0].thumbnailUrl && singleMatch) {
        generateThumbnails(id, matchedBlocks);
      }
    }
  }, []);

  const thumbnailComp = (
    thumbnail ?
      (<img
        src={thumbnail}
        alt={name}
        ref={imgElementRef}
        style={{ opacity: opacity }}
        onLoad={calculateImageOrientation}
      />) :
      <i data-category={category} className={iconDefaultClass} />
  );

  const dotsMenu = (
    <DropMenu
      id="dropmenu"
      icon="more"
      className={styles.dropMenu}
      position={{ right: 0 }}
      onClick={handleDropMenuClick}
    >
      <ul ref={dropDownMenuOptions}>
        {!isDisabled && <li onClick={() => handleMenuClick('open-page')}>{strings.open}</li>}
        {!isGrid && <li onClick={() => handleMenuClick('share')}>{strings.share}</li>}
        {!isGrid && <li onClick={() => handleMenuClick('file-details')}>{strings.fileDetails}</li>}
        {!isGrid && <li onClick={() => handleMenuClick('bookmark')}>{isBookmarked ? strings.removeBookmark : strings.bookmark}</li>}
        {!(isSelectModeEnabled && singleMatch) && isGrid && canAddToEditor && <li onClick={() => handleMenuClick('canvas')}>{strings.addToPitchBuilder}</li>}
      </ul>
    </DropMenu>
  );

  const ClickElement = (clickProps) => (
    <a
      aria-label={name}
      onClick={!isGrid || singleMatch || showStack ? handleClick : handleOpenPagesClick}
    >
      {clickProps.children}
    </a>
  );

  const smallCardComp = (
    <Fragment>
      <ClickElement>
        <div className={imgClass}>
          {thumbnailComp}
        </div>
      </ClickElement>
      <div className={styles.info}>
        <div className={styles.metadata}>
          <span className={styles.category} style={badgeStyle}>
            {MEDIA_TYPES[category].shortLabel}
          </span>
          <span>{strings.updated} </span>
          <FormattedDate
            value={dateModified}
            day="2-digit"
            month="short"
            year="numeric"
          />
          {showApprovedBadge && <span aria-label={fileDetailLabel} className={styles.approvedBadge}>
            <Icon name="approved-content" />
            </span>}
        </div>
        <div className={styles.fileDescription}>
          <ClickElement>
            <div className={styles.labelWrapper}>
              <label className={labelClass} title={name}>{name}</label>
            </div>
          </ClickElement>
        </div>
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
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
      {(
        matchedBlocks.length > 0 && allowAddToEditor) && ((canAddAllToEditor || canAddFileToEditor) ?
          <span className={styles.pitch} onClick={handleAddToPitchBuilder} /> :
          <span className={styles.tick}>{strings.addedToPitchBuilder}</span>
      )}
      {dotsMenu}
    </Fragment>
  );

  const largeCardComp = (
    <Fragment>
      {/* card header */}
      <header>
        <div className={styles.fileDescription}>
          <div className={styles.metadata}>
            <span className={styles.category} style={badgeStyle}>
              {MEDIA_TYPES[category].shortLabel}
            </span>
          </div>
          <div className={styles.dateTime}>
            {`${strings.updated} `}
            <FormattedDate
              value={dateModified}
              day="2-digit"
              month="short"
              year="numeric"
            />
          </div>
          {showApprovedBadge && <span aria-label={fileDetailLabel} className={styles.approvedBadge}>
            <Icon name="approved-content" />
          </span>}
        </div>
        <h3 className={labelClass} title={name}>
          <span>
            {name}
          </span>
        </h3>
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
      </header>

      {/* card body */}
      <div className={styles.cardBody}>
        <ClickElement>
          <div className={imgClass} style={{ backgroundImage: `url(${thumbnailUrl})` }}>
            {isThumbnailLoading && <Loader type="content" style={{ margin: 'auto' }} />}
            <div className={styles.matchIndicator}>
              {singleMatch && getPageNumber().matchLocation && <span className={styles.matchLocation}>{getPageNumber().matchLocation}</span>}
              {!singleMatch && <span className={styles.matchLocation}>{matchedBlocks.length} {strings.pages}</span>}
            </div>
          </div>
        </ClickElement>

        {(category !== 'image' && !showOpenStackBtn && excerpt) && <div className={styles.info}>
          <h5>{strings.excerpt}</h5>
          <ClickElement>
            <p dangerouslySetInnerHTML={{ __html: excerpt }} />
          </ClickElement>
        </div>}

        {showOpenStackBtn && !isSelectModeEnabled && (
          matchedBlocks.length === 1
            ? (
              <div className={styles.info}>
                <h5>{strings.excerpt}</h5>
                <p dangerouslySetInnerHTML={{ __html: excerpt }} />
              </div>
            )
            : (
              <div className={cx({ info: true, nPagesInsideFile: true })}>
                <p>{`${matchedBlocks.length} ${strings.pagesInsideOfThisFile}`}</p>
              </div>
            )

        )}
      </div>
      {/* Card Footer */}
      {allowAddToEditor && <div className={footerClass} onClick={!isSelectModeEnabled ? handleAddToPitchBuilder : null}>
        {(canAddAllToEditor || canAddFileToEditor)
          ? (
            <Fragment>
              {isSelectModeEnabled && <Checkbox
                name={`pages-${id}`}
                checked={isChecked}
                disabled={isDisabled}
                value={matchedBlocks[0].id}
                label={strings.addToSelection}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
              />}
              {!isSelectModeEnabled && <Fragment>
                <span className={styles.pitch} />
                {matchedBlocks.length > 1
                  ? (
                    <FormattedMessage
                      id="add-n-pages-to-pitch-builder"
                      defaultMessage="Add {itemCount} Pages to Pitch Builder"
                      values={{ itemCount: matchedBlocks.length }}
                    />
                  )
                  : (
                    <FormattedMessage
                      id="add-page-to-pitch-builder"
                      defaultMessage="Add Page to Pitch Builder"
                    />
                  )}
              </Fragment>}
            </Fragment>
          )
          : (
            <Fragment>
              <span className={styles.tick} />
              {strings.addedToPitchBuilder}
            </Fragment>
          )}
      </div>}
    </Fragment>
  );

  return (
    <span
      className={itemClass}
      aria-label={name}
      style={style}
    >
      {!isGrid && smallCardComp}
      {isGrid && largeCardComp}
    </span>
  );
};

PageSearchFileItem.propTypes = {
  authString: PropTypes.string,
  canAddToCanvas: PropTypes.bool,
  excerpt: PropTypes.string,
  id: PropTypes.number.isRequired,
  isChecked: PropTypes.bool,
  isGrid: PropTypes.bool,
  isSelectModeEnabled: PropTypes.bool,
  name: PropTypes.string,
  showOpenStackBtn: PropTypes.bool,

  className: PropTypes.string,
  style: PropTypes.object,

  onCheckboxChange: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func,
  onOpenPagesClick: PropTypes.func,
};

PageSearchFileItem.defaultProps = {
  authString: '',
  matchedBlocks: [],
  strings: {
    addToSelection: 'Add to Selection',
    addToPitchBuilder: 'Add to Pitch Builder',
    addedToPitchBuilder: 'Added to Pitch Builder',
    fileDetails: 'File Details',
    share: 'Share',
    bookmark: 'Bookmark',
    removeBookmark: 'Remove Bookmark',
    modified: 'Modified',
    excerpt: 'Excerpt',
    openPages: 'Open Pages',
    open: 'Open',
    results: 'Results',
    page: 'Page',
    slide: 'Slide',
  }
};

export default withRouter(PageSearchFileItem);
