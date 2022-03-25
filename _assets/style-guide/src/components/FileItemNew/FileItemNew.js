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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import _get from 'lodash/get';
import classNames from 'classnames/bind';
import MEDIA_TYPES from 'static/FileTypes/FileTypes';
import FileThumbNew from 'components/FileThumbNew/FileThumbNew';
import getFileSize from 'helpers/getFileSize';

const FileItemNew = props => {
  const {
    id,
    isShare,
    customDetailsIsEnabled,
    description: name,
    fileSettings,
    grid,
    onClick,
    thumbnail,
    category,
    dateAdded,
    stackSize,
    setData,
    authString,
    storyTitle,
    size,
    showFileSize,
    className,
    style,
  } = props;

  const imgElementRef = React.useRef(null);
  const [orientation, setOrientation] = React.useState();

  const styles = require('./FileItemNew.less');

  const cx = classNames.bind(styles);

  const imgOrientationClass = cx({
    imageContainer: true,
    portraitStack: stackSize > 1 && orientation === 'portrait',
    landscapeStack: stackSize > 1 && orientation === 'landscape'
  }, className);

  const iconDefaultClass = cx({
    iconDefault: true,
    [`icon-${category}`]: true,
  });

  const fileDetailLabel = _get(fileSettings, 'fileGeneralSettings.detailsFieldLabel', '');
  const showContentApproveBadge = _get(fileSettings, 'fileGeneralSettings.showCustomFileDetailsIcon', false) && customDetailsIsEnabled;

  const labelClass = cx({
    name: true,
    labelList: !grid
  });

  const badgeStyle = {
    backgroundColor: category && `${MEDIA_TYPES[category].color}`
  };

  const thumbnailUrl = `${thumbnail}${authString}`;

  const handleClick = e => {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(e, setData || [{ id }]);
    }
  };

  const calculateImageOrientation = () => {
    if (imgElementRef.current) {
      const imgOrientation = imgElementRef.current.offsetHeight > imgElementRef.current.offsetWidth ? 'portrait' : 'landscape';
      setOrientation(imgOrientation);
    }
  };

  if (grid) {
    return (
      <a
        className={styles.fileItem}
        aria-label={name}
        onClick={handleClick}
        style={style}
      >
        <div className={imgOrientationClass}>
          {thumbnail ? <img
            src={thumbnailUrl} alt={name} ref={imgElementRef}
            onLoad={calculateImageOrientation}
          /> :
          <i data-category={category} className={iconDefaultClass} /> }
        </div>
        {!isShare && <div className={styles.fileMetadata}>
          <div className={styles.titleContainer}>
            {showContentApproveBadge && <span aria-label={fileDetailLabel} className={styles.tooltip}><span /></span>}
            <label className={labelClass} title={name}>{name}</label>
          </div>
          <span className={styles.category} style={badgeStyle}>
            {stackSize > 1 ? `${stackSize} Files` : MEDIA_TYPES[category].shortLabel}
          </span>
          {showFileSize && <span>{getFileSize(size, 0)}</span>}
          {showFileSize && <span>&middot;</span>}
          <FormattedDate
            value={dateAdded * 1000}
            day="2-digit"
            month="short"
            year="numeric"
          />
        </div>}
      </a>
    );
  }

  // List view
  const renderThumbnailDetail = props.children ? (
    props.children
  ) : (
    <div className={styles.descriptionWrapper}>
      <div>
        {showContentApproveBadge && <span aria-label={fileDetailLabel} className={styles.tooltip}><span /></span>}
        <label style={showContentApproveBadge ? { 'marginLeft': '0.5rem' } : null} className={labelClass} title={name}>{name}</label>
      </div>
      <p>{storyTitle}</p>
    </div>
  );

  return (
    <div
      aria-label={name}
      className={styles.fileItemList}
      onClick={handleClick}
      style={style}
    >
      <FileThumbNew {...props} />
      {renderThumbnailDetail}
    </div>
  );
};

FileItemNew.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),

  isShare: PropTypes.bool,

  /** pass `true` with fileSettings to enable "Approved Content Badge" */
  customDetailsIsEnabled: PropTypes.bool,
  fileSettings: PropTypes.object,

  /** pass `true/false` to toggle grid/list view */
  grid: PropTypes.bool,

  /** file name */
  name: PropTypes.string,
  stackSize: PropTypes.number,
  setData: PropTypes.array,

  /** pass true/false to show/hide thumbnail */
  showThumb: PropTypes.bool,

  /** pass `small`/`medium`/`large` for thumb size in list view */
  thumbSize: PropTypes.string,

  /** pass number in rem for custom thumb size in list view */
  customThumbSize: PropTypes.number,

  size: PropTypes.number,
  showFileSize: PropTypes.bool,

  authString: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object
};

FileItemNew.defaultProps = {
  authString: '',
  customDetailsIsEnabled: false,
  fileSettings: {},
  grid: true,
  isShare: false,
  showThumb: true,
  size: 0,
  showFileSize: false
};

export default FileItemNew;
