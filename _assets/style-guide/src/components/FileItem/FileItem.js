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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import _get from 'lodash/get';
import filesize from 'filesize';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import TagItems from './TagItems';
import Checkbox from 'components/Checkbox/Checkbox';
import FileThumb from 'components/FileThumb/FileThumb';

const messages = defineMessages({
  more: { id: 'more', defaultMessage: 'More' },
  blocked: { id: 'blocked', defaultMessage: 'blocked' },
  mandatory: { id: 'mandatory', defaultMessage: 'mandatory' },
  optional: { id: 'optional', defaultMessage: 'optional' },
  processing: { id: 'processing', defaultMessage: 'Processing' },
  syncing: { id: 'syncing', defaultMessage: 'Syncing' },
});

export default class FileItem extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    filename: PropTypes.string,
    description: PropTypes.string.isRequired,

    /** Valid category */
    category: PropTypes.oneOf([
      'app',
      'audio',
      'btc',
      'cad',
      'csv',
      'earthviewer',
      'ebook',
      'epub',
      'excel',
      'folder',
      'form',
      'ibooks',
      'image',
      'keynote',
      'learning',
      'none',
      'numbers',
      'oomph',
      'pages',
      'pdf',
      'potx',
      'powerpoint',
      'project',
      'prov',
      'rtf',
      'rtfd',
      'scrollmotion',
      'stack',
      'twixl',
      'txt',
      '3d-model',
      'vcard',
      'video',
      'visio',
      'web',
      'word',
      'zip'
    ]),

    /** Only required if showThumb is passed */
    thumbnail: PropTypes.string,

    url: PropTypes.string,          // view url e.g. converted file
    downloadUrl: PropTypes.string,  // original file

    dateAdded: PropTypes.number,
    readCount: PropTypes.number,
    shareStatus: PropTypes.oneOf(['blocked', 'mandatory', 'optional']),
    status: PropTypes.oneOf(['active', 'processing', 'syncing', 'failed']),

    /** Number representing conversion progress - paired with processing status */
    progress: PropTypes.number,

    /** File size in bytes */
    size: PropTypes.number,
    storyId: PropTypes.number,
    sharing: PropTypes.number,

    height: PropTypes.number,
    width: PropTypes.number,

    isRead: PropTypes.bool,
    hasWatermark: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked */
    isSelected: PropTypes.bool,

    /** Show checkbox */
    showCheckbox: PropTypes.bool,

    /** Show checkbox on folder item */
    showFolderCheckbox: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Grid layout */
    grid: PropTypes.bool,

    /** show file info icon */
    showInfo: PropTypes.bool,

    /** Grey out the checkbox in list view */
    disabled: PropTypes.bool,

    // Custom file settings
    fileSettings: PropTypes.object,

    /** Enables download link if available */
    showDownload: PropTypes.bool,

    /** Show Share Status in list view */
    showShareStatus: PropTypes.bool,

    /** Show thumbnails (if available) */
    showThumb: PropTypes.bool,

    /** Enables view link if available */
    showView: PropTypes.bool,

    /** Hides metadata in list view */
    hideMeta: PropTypes.bool,

    stackSize: PropTypes.number,

    /** DEPRECATED - use thumbSize instead */
    thumbWidth: function (props, propName, componentName) {
      if (!props.thumbSize) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use a valid thumbSize instead.'
        );
      }
      return null;
    },

    /** DEPRECATED - use showCheckbox instead */
    select: function (props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use showCheckbox.'
        );
      }
      return null;
    },

    /** DEPRECATED - use showFolderCheckbox instead */
    selectFolder: function (props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use showFolderCheckbox.'
        );
      }
      return null;
    },

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function (props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive or isSelected instead.'
        );
      }
      return null;
    },

    authString: PropTypes.string,

    onDownloadClick: PropTypes.func,
    onClick: PropTypes.func,
    onInfoIconClick: PropTypes.func,
    onTagMoreClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: '',
    dateAdded: 0,
    disabled: false,
    isSelected: false,
    showDownload: false,
    thumbSize: 'large',
    tags: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // These categories are compatible with Viewer
    this.viewTypes = [
      'app',
      'audio',
      'btc',
      'cad',
      'csv',
      'epub',
      'excel',
      'form',
      'image',
      'keynote',
      'numbers',
      'pages',
      'pdf',
      'powerpoint',
      'project',
      'txt',
      'word',
      'video',
      'visio',
      'web'
    ];

    // These categories cannot be downloaded
    this.noDownloadTypes = [
      'app',
      'btc',
      'folder',
      'form',
      'web'
    ];

    this.state = {
      tagWidth: 0,
      canDownload: this.getCanDownload(props),
      canView: this.getCanView(props)  // eslint-disable-line react/no-unused-state
    };
    this.tagElement = null;
    autobind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeThrottler, false);
    if (this.tagElement) {
      this.resizeThrottler(true);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.showDownload !== this.props.showDownload) {
      this.setState({ canDownload: this.getCanDownload(nextProps) });
    }

    if (nextProps.showView !== this.props.showView) {
      this.setState({ canView: this.getCanView(nextProps) });  // eslint-disable-line react/no-unused-state
    }
    if (this.props.status !== nextProps.status) {
      this.resizeThrottler(true);
    }
    if (this.props.grid && !nextProps.grid ||
      this.props.id !== nextProps.id ||
      this.props.name !== nextProps.name) {
      this.resizeThrottler(false);
    }
  }

  getCanDownload(props) {
    return props.showDownload && props.downloadUrl && this.noDownloadTypes.indexOf(props.category) < 0;
  }

  getCanView(props) {
    return props.showView && this.viewTypes.indexOf(props.category) > -1;
  }

  handleDownloadClick(event) {
    event.stopPropagation();
    const { onDownloadClick } = this.props;
    if (typeof onDownloadClick === 'function') {
      onDownloadClick(event, this.props.downloadUrl);
    }
  }

  handleClick(event) {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleFileInfoClick(event) {
    const { onInfoIconClick } = this.props;
    if (onInfoIconClick && typeof onInfoIconClick === 'function') {
      onInfoIconClick(event, this);
    }
  }

  handleInputChange(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  resizeThrottler(now) {
    if (this.currentThrottle) {
      window.clearTimeout(this.currentThrottle);
      this.currentThrottle = null;
    }
    this.currentThrottle = window.setTimeout(() => {
      if (this.tagElement) {
        this.setState({
          tagWidth: this.tagElement.offsetWidth
        });
      }
      this.currentThrottle = null;
    }, now ? 0 : 500);
  }

  renderTags(styles, strings) {
    const { tags } = this.props;
    const { onInfoIconClick } = this.props;
    if (onInfoIconClick && typeof onInfoIconClick === 'function') {
      return (<TagItems
        totalWidth={this.state.tagWidth}
        tags={tags} strings={strings}
        styles={styles}
        onMoreClick={this.handleFileInfoClick}
      />);
    }
    return null;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { canDownload } = this.state;
    const {
      id,
      category,
      dateAdded,
      description,
      disabled,
      fileSettings,
      shareStatus,
      size,
      status,
      progress,

      thumbSize,
      grid,
      showInfo,
      isActive,
      isSelected,
      showCheckbox,
      showFolderCheckbox,
      showShareStatus,
      hideMeta,
      stackSize,
      style,
      className,
      tags
    } = this.props;
    const styles = require('./FileItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      FileItem: true,
      isActive: isActive,
      gridItem: grid,
      listItem: !grid,

      listItemLarge: !grid && thumbSize === 'large',
      listItemMedium: !grid && thumbSize === 'medium',
      listItemSmall: !grid && thumbSize === 'small',

      gridItemLarge: grid && thumbSize === 'large',
      gridItemMedium: grid && thumbSize === 'medium',
      gridItemSmall: grid && thumbSize === 'small',

      fileStack: stackSize
    }, className);

    // Do not render if no category is provided
    if (!category) {
      return false;
    }

    let thumbWidth = this.props.thumbWidth;

    // Grid sizes
    if (grid) {
      switch (thumbSize) {
        case 'small':
          thumbWidth = 84;
          break;
        case 'medium':
          thumbWidth = 101;
          break;
        default:
          thumbWidth = 150;
          break;
      }

      // List sizes
    } else {
      switch (thumbSize) {
        case 'small':
          thumbWidth = 45;
          break;
        case 'medium':
          thumbWidth = 54;
          break;
        default:
          thumbWidth = 60;
          break;
      }
    }

    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    const fileThumbProps = {
      category: category,
      grid: grid,
      showThumb: this.props.showThumb,
      thumbnail: this.props.thumbnail,
      thumbSize: thumbSize,
      dateAdded: dateAdded,
      repoFileCount: this.props.repoFileCount,
      stackSize: stackSize,
      authString: this.props.authString
    };

    // Translations
    const strings = generateStrings(messages, formatMessage);
    const humanFileSize = size ? filesize(size) + ' · ' : null;
    const descriptionTitle = description;// + ' (' + humanFileSize + ')';

    // Repo folder is syncing
    // should instead return repoId, repoFolderId and syncing status
    const isProcessing = status === 'processing';
    const isSyncing = (this.props.source === 'file_repository' && isProcessing) || status === 'syncing';

    // TODO: move to component FileStatus
    const syncStatus = (
      <div className={styles.syncing} style={{ width: hideMeta ? '6.5rem' : null }}>
        <div
          data-category={this.props.category}
          className={styles.syncBar}
          style={{ width: progress * 100 + '%' }}
        />
        <p>{strings.syncing}</p>
      </div>
    );
    const processingStatus = (
      <div className={styles.processing} style={{ width: hideMeta ? '6.5rem' : null }}>
        <div
          data-category={this.props.category}
          className={styles.progressBar}
          style={{ width: progress * 100 + '%' }}
        />
        <p>{strings.processing}</p>
      </div>
    );

    const fileDetailLabel = _get(fileSettings, 'fileGeneralSettings.detailsFieldLabel', '');
    const showContentApproveBadge = _get(fileSettings, 'fileGeneralSettings.showCustomFileDetailsIcon', false) && this.props.customDetailsIsEnabled;

    const descriptionStyles = cx({
      description: true,
      name: tags && tags.length === 0
    });

    // Grid view
    if (grid) {
      return (
        <div
          aria-label={description}
          data-category={category}
          data-id={id}
          data-status={status}
          className={itemClasses}
          style={itemStyle}
          onClick={this.handleClick}
        >
          <div className={styles.ThumbnailContainer}>
            <FileThumb {...fileThumbProps} />
          </div>
          <div
            aria-label={fileDetailLabel}
            className={styles.nameWrapper}
            title={descriptionTitle}
            onClick={this.handleInputChange}
          >
            {showContentApproveBadge && <span aria-label={fileDetailLabel} className={styles.tooltipGridView}>
              <span />
            </span>}
            <span className={descriptionStyles}>{description}</span>
          </div>
          {showInfo && !(showCheckbox || hideMeta) &&
            <div className={styles.sizeAndDate} title={humanFileSize} onClick={this.handleFileInfoClick}>
              <div className={styles.container}>
                <span>{humanFileSize}</span>
                <FormattedDate
                  value={dateAdded * 1000}
                  year="numeric"
                  month="short"
                  day="2-digit"
                />
                <span className={styles.infoIcon} />
              </div>
            </div>
          }
          {(category !== 'folder' && showCheckbox || category === 'folder' && showFolderCheckbox) &&
            <div className={styles.checkbox}>
              <Checkbox
                name={'file-' + description}
                value={id}
                checked={isSelected}
                disabled={disabled}
                onChange={this.handleInputChange}
              />
            </div>}
          {(isProcessing && !isSyncing) && processingStatus}
          {isSyncing && syncStatus}
        </div>
      );
    }
    const tagWithDesctiption = cx({
      notag: tags && tags.length === 0,
    }, styles.desctiption);
    // List with view no children prop
    if (!this.props.children) {
      return (
        <div
          aria-label={description}
          data-category={category}
          data-id={id}
          data-status={status}
          className={itemClasses}
          style={itemStyle}
          onClick={this.handleClick}
        >
          <div
            className={styles.checkbox}
            style={{
              width: showCheckbox ? null : '0',
              visibility: showCheckbox ? 'visible' : 'hidden'
            }}
          >
            {(category !== 'folder' || category === 'folder' && showFolderCheckbox) && <Checkbox
              name={'file-' + description}
              value={id}
              checked={isSelected}
              disabled={disabled}
              onChange={this.handleInputChange}
              style={{ opacity: showCheckbox ? '1' : '0' }}
            />}
          </div>
          <div className={styles.thumbnailNameContainer}>
            <FileThumb {...fileThumbProps} />
            <div className={styles.name} style={(showCheckbox || hideMeta) ? { flex: 1 } : {}} title={descriptionTitle}>
              <div className={tagWithDesctiption}>
                {showContentApproveBadge && <span aria-label={fileDetailLabel} className={styles.tooltipListView}><span /></span>}
                <p>{description}</p>
              </div>
              {!isProcessing && !(showCheckbox || hideMeta) && <div
                className={styles.tags}
                style={{ maxWidth: '43rem' }}
                title={descriptionTitle}
                ref={elem => { this.tagElement = elem; }}
              >{this.renderTags(styles, strings)}</div>}
            </div>
          </div>
          {!isProcessing && !(showCheckbox || hideMeta) && <div><span data-status={shareStatus} className={styles.shareActive} /> <div className={styles.shareStatusColumn} data-share-status={shareStatus}>{strings[shareStatus]}</div></div>}
          {!isProcessing && !hideMeta && <div className={styles.category} data-category={category}>{category}</div>}
          {!isProcessing && !hideMeta && <div className={styles.size}>
            {(category !== 'folder' && size && size > 0) && humanFileSize}
          </div>}
          {!isProcessing && (!hideMeta && dateAdded > 0) && <div className={styles.date}>
            {(!isProcessing && !isSyncing) &&
              <FormattedDate
                value={dateAdded * 1000}
                day="2-digit"
                month="short"
                year="numeric"
              />
            }
          </div>}
          {(isProcessing && !isSyncing) && processingStatus}
          {isSyncing && syncStatus}
          {(showShareStatus && !isProcessing && !isSyncing) && <div
            className={styles.shareStatus}
            data-share-status={shareStatus}
          >
            {strings[shareStatus]}
          </div>}
          {!isProcessing && showInfo && !(showCheckbox || hideMeta) &&
            <div className={styles.actionContainer}>
              <div
                className={styles.download}
                style={{
                  width: (showCheckbox || hideMeta) ? '0' : null,
                  visibility: (showCheckbox || hideMeta) ? 'hidden' : 'visible'
                }}
              >
                {canDownload && shareStatus !== 'blocked' && <span
                  className={styles.downloadIcon}
                  onClick={this.handleDownloadClick}
                  style={{ opacity: !showCheckbox ? '1' : '0' }}
                />}
              </div>
              {showInfo && !(showCheckbox || hideMeta) &&
                <div
                  className={styles.info}
                  style={{
                    width: (hideMeta) ? '0' : null,
                    visibility: (hideMeta) ? 'hidden' : 'visible'
                  }}
                >
                  <span className={styles.infoIcon} onClick={this.handleFileInfoClick} />
                </div>
              }
            </div>
          }
        </div>
      );
    }

    // List view with a children prop
    return (
      <div
        aria-label={description}
        data-category={category}
        data-id={id}
        data-status={status}
        className={itemClasses}
        style={itemStyle}
        onClick={this.handleClick}
      >
        <FileThumb {...fileThumbProps} />
        {this.props.children}
      </div>
    );
  }
}
