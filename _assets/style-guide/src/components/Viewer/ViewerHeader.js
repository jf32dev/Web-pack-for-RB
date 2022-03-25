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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import DropMenu from 'components/DropMenu/DropMenu';

const messages = defineMessages({
  close: { id: 'close', defaultMessage: 'Close' },
  minimizeViewer: { id: 'minimize-viewer', defaultMessage: 'Minimize Viewer' },
  maximizeViewer: { id: 'maximize-viewer', defaultMessage: 'Maximize Viewer' },
  toc: { id: 'table-of-contents', defaultMessage: 'Table of Contents' },
  pages: { id: 'pages', defaultMessage: 'Pages' },
  findtext: { id: 'findtext', defaultMessage: 'Find Text' },
  bookmark: { id: 'bookmark', defaultMessage: 'Bookmark' },
  more: { id: 'more', defaultMessage: 'More' },
  share: { id: 'share', defaultMessage: 'Share' },
  shareFileStack: { id: 'share-file-stack', defaultMessage: 'Share File Stack' },
  broadcast: { id: 'broadcast', defaultMessage: 'Broadcast' },
  addBookmarkStack: { id: 'add-bookmark-stack', defaultMessage: 'Add Bookmark Stack' },
  bookmarkAllDelete: { id: 'remove-bookmark-stack', defaultMessage: 'Remove Bookmark Stack' },
  poweredBy: { id: 'powered-by', defaultMessage: 'powered by' },
  bigtincan: { id: 'bigtincan', defaultMessage: 'Bigtincan' },
  openFileDetails: { id: 'open-file-details', defaultMessage: 'Open File Details' },
  addFileToCanvas: { id: 'add-file-to-canvas', defaultMessage: 'Add File to Canvas' },
  addFileToPitchBuilder: { id: 'add-file-to-pitch-builder', defaultMessage: 'Add File to Pitch Builder' },
  addPageToCanvas: { id: 'add-page-to-canvas', defaultMessage: 'Add Page to Canvas' },
  addPageToPitchBuilder: { id: 'add-page-to-pitch-builder', defaultMessage: 'Add Page to Pitch Builder' },
  copyInternalFileLink: { id: 'copy-internal-file-link', defaultMessage: 'Copy Internal File Link' },
});

/**
 * Displays various Viewer File controls and toggles docking mode.
 */
export default class ViewerHeader extends Component {
  static propTypes = {
    activeFile: PropTypes.object,

    /** Toggle docked mode */
    isDocked: PropTypes.bool,

    /** Display pages toggle (Document/PDF) */
    pages: PropTypes.bool,

    /** Display Table of Contents toggle (PDF) */
    toc: PropTypes.bool,

    /** Display search icon to allow search text in document (PDF) */
    findtext: PropTypes.bool,

    /** Display Bookmark toggle */
    bookmark: PropTypes.bool,

    /** Display pen toggle */
    pen: PropTypes.bool,

    /** Display Broadcast toggle */
    broadcast: PropTypes.bool,

    /** Display Share in menu */
    share: PropTypes.bool,

    /** Display Share All in menu */
    shareAll: PropTypes.bool,

    /** Display Canvas options in menu */
    hasBlockSearch: PropTypes.bool,
    hasPageSearch: PropTypes.bool,
    hasPitchBuilderWeb: PropTypes.bool,

    /** Viewer is being displayed on a Public page, displays text */
    isPublic: PropTypes.bool,

    /** whether the presentation slide component is visible or not */
    isPresentationSlidesVisible: PropTypes.bool,

    /** Display Bookmark All in menu */
    bookmarkAll: PropTypes.bool,
    bookmarkAllDelete: PropTypes.bool,

    /** Allows user to copy file PermId Internal URL */
    copyInternalFileLink: PropTypes.bool,

    /** Display Create Story from File in menu */
    createStory: PropTypes.bool,

    /** Show File Details in menu */
    openFileDetails: PropTypes.bool,

    /** Display Add File to Story in menu */
    addFiles: PropTypes.bool,

    /** Set the theme (light/dark) */
    theme: PropTypes.oneOf(['light', 'dark']),

    onCloseClick: PropTypes.func,

    /** Handle clicking Copy to Clipboard action  */
    onCopyToClipboard: PropTypes.func,
    onDockToggleClick: PropTypes.func,

    /** Handle clicking on a header item (pages/toc etc.) */
    onItemClick: PropTypes.func.isRequired,

    /** Handle click on a header menu item (Share, Bookmark All etc.) */
    onMenuItemClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.leftMenuItems = ['toc', 'pages', 'findtext', 'pen', 'broadcast', 'fullscreen'];
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      addFiles,
      activeFile,
      bookmark,
      bookmarkAll,
      bookmarkAllDelete,
      copyInternalFileLink,
      createStory,
      hasBlockSearch,
      hasPageSearch,
      hasPitchBuilderWeb,
      hasShare,
      isDocked,
      isPublic,
      openFileDetails,
      openStory,
      share,
      shareAll,
      theme,

      onCloseClick,
      onCopyToClipboard,
      onDockToggleClick,
      onItemClick,
      onMenuItemClick
    } = this.props;
    const styles = require('./ViewerHeader.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ViewerHeader: true,
      headerDocked: isDocked,
      isDark: theme === 'dark',
      isPublic: isPublic,
      actionsWrapper: isPublic,
      alignToTheLeft: isPublic && !this.props.isPresentationSlidesVisible,
      alignToTheLeftWithPadding: isPublic && this.props.isPresentationSlidesVisible
    });

    const {
      hostname,
      port,
      protocol
    } = window.location;
    const activeFilePermIdURL = `${protocol || 'https:'}//${hostname}${port ? `:${port}` : ''}/file/p/${activeFile.filePermId}`;

    const dockClasses = cx({
      dock: true,
      isDocked: isDocked
    });

    // Action icons
    const bookmarkClasses = cx({
      bookmark: true,
      bookmarkRemove: activeFile.isBookmarkSelf,
      disable: activeFile.bookmarkLoading
    });
    const bookmarkAllClasses = cx({
      bookmarkAll: true
    });
    const bookmarkAllDeleteClasses = cx({
      bookmarkAllDelete: true
    });

    // Block Search enabled
    let addPageToCanvas = false;
    let addFileToCanvas = false;
    let pageBlock = null;
    const canAddFileToPB = activeFile.blocks && activeFile.blocks.filter(i => i.canAddToCanvas).length > 0;

    if (canAddFileToPB && (hasBlockSearch || (hasPageSearch && hasPitchBuilderWeb)) && activeFile.blocks && activeFile.blocks.length) {
      // Show 'Add File to Canvas'
      addFileToCanvas = true;
      const showMenuOptionFromIndex = hasPageSearch && hasPitchBuilderWeb ? 0 : 1; // Pitch builder page index starts counting from 0

      // Current page has a block, show 'Add to Canvas'
      pageBlock = activeFile.blocks.find(b => (b.page + showMenuOptionFromIndex) === activeFile.currentPage);  // block page is index-based
      const canAddPageToPB = activeFile.blocks && activeFile.blocks.find(i => i.page === activeFile.currentPage && i.canAddToCanvas);

      if (pageBlock && canAddPageToPB) {
        addPageToCanvas = true;
      }
    }

    // Should menu display?
    const showMenu = share || bookmarkAll || bookmarkAllDelete || createStory || openStory || addFiles;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Only create the following strings if naming is available
    // as they are not required for Public Viewing
    let createStoryString = '';
    let addFilesString = '';
    let openStoryString = '';
    if (this.context.settings && this.context.settings.naming) {
      createStoryString = (
        <FormattedMessage
          id="create-story-from-files"
          defaultMessage={'Create {story} from {fileCount, plural, one {File} other {Files}}'}
          values={{ story: this.context.settings.naming.story, fileCount: this.props.files.length }}
        />
      );

      addFilesString = (
        <FormattedMessage
          id="add-file-to-story"
          defaultMessage="Add file to {story}"
          values={this.context.settings.naming}
        />
      );
      openStoryString = (
        <FormattedMessage
          id="open-story"
          defaultMessage="Open {story}"
          values={this.context.settings.naming}
        />
      );
    }

    if (isDocked) {
      const fileLocation = activeFile.story ? activeFile.story.name : '';

      return (
        <header className={classes}>
          <div className={styles.left}>
            <span className={styles.close} onClick={onCloseClick} />
          </div>
          <div className={styles.center} onClick={onDockToggleClick}>
            <h1 className={styles.fileDescription}>{activeFile.description}</h1>
            {fileLocation && <h2 className={styles.fileLocation}>{fileLocation}</h2>}
          </div>
          <div className={styles.right}>
            <span title={strings.maximizeViewer} className={dockClasses} onClick={onDockToggleClick} />
          </div>
        </header>
      );
    }
    if (isPublic) {
      return (
        <header className={classes} data-name="viewHeader">
          {this.leftMenuItems.map(item => (
            this.props[item] &&
              <span
                key={item}
                title={strings[item]}
                data-action={item}
                className={`${styles[item]} ${activeFile['show' + item.charAt(0).toUpperCase() + item.slice(1)] ? styles.isActive : ''}`}
                onClick={onMenuItemClick}
              />
          ))}
        </header>
      );
    }
    return (
      <header className={classes} data-name="viewHeader">
        <div className={styles.left}>
          <span className={styles.close} data-action="close" onClick={onCloseClick}>{strings.close}</span>
          {!activeFile.loading && <div className={styles.actionsWrapper} data-name="actionsWrapper">
            {this.leftMenuItems.map(item => (
              this.props[item] &&
                <span
                  key={item}
                  title={strings[item]}
                  data-action={item}
                  className={`${styles[item]} ${activeFile['show' + item.charAt(0).toUpperCase() + item.slice(1)] ? styles.isActive : ''}`}
                  onClick={onMenuItemClick}
                />
            ))}
          </div>}
        </div>
        <div className={styles.center}>
          {onDockToggleClick && <span
            title={strings.minimizeViewer} data-action="dock" className={dockClasses}
            onClick={onDockToggleClick}
          />}
        </div>
        <div className={styles.right}>
          {activeFile.downloadUrl && share && <div className={styles.actionsWrapper}><span
            className={styles.downloadIcon}
            onClick={this.props.onDownloadClick}
          /></div>}
          {!activeFile.loading && <div className={styles.actionsWrapper}>
            {bookmark && <span
              title={strings.bookmark} data-action="bookmark" className={bookmarkClasses}
              onClick={onItemClick}
            />}
          </div>}
          {showMenu && <DropMenu
            title={strings.more}
            width="13.5rem"
            data-action="dropMenu"
            icon="more"
            activeIcon="more-fill"
            className={styles.viewerDropMenu}
            activeClassName={styles.viewerActiveDropMenu}
          >
            <ul>
              {share && hasShare && <li className="icon-share" data-action="share" onClick={onMenuItemClick}>
                {strings.share}
              </li>}
              {shareAll && hasShare && <li className="icon-share-fill" data-action="share-all" onClick={onMenuItemClick}>
                {strings.shareFileStack}
              </li>}
              {bookmarkAll && <li className={bookmarkAllClasses} data-action="bookmark-all" onClick={onMenuItemClick}>
                {strings.addBookmarkStack}
              </li>}
              {bookmarkAllDelete && <li className={bookmarkAllDeleteClasses} data-action="bookmark-all-delete" onClick={onMenuItemClick}>
                {strings.bookmarkAllDelete}
              </li>}
              {addFileToCanvas && <li className="icon-story-plus" data-action="canvas-file" onClick={onMenuItemClick}>
                {hasPageSearch ? strings.addFileToPitchBuilder : strings.addFileToCanvas}
              </li>}
              {addPageToCanvas && <li className="icon-story-plus" data-action="canvas-page" onClick={onMenuItemClick}>
                {hasPageSearch ? strings.addPageToPitchBuilder : strings.addPageToCanvas}
              </li>}
              {createStory && <li className="icon-story-plus" data-action="create-story" onClick={onMenuItemClick}>
                {createStoryString}
              </li>}
              {openStory && <li className="icon-story" data-action="open-story" onClick={onMenuItemClick}>
                {openStoryString}
              </li>}
              {addFiles && <li className="icon-file" data-action="add-files" onClick={onMenuItemClick}>
                {addFilesString}
              </li>}
              {openFileDetails && <li className="icon-file-alt" data-action="open-file-details" onClick={onMenuItemClick}>
                {strings.openFileDetails}
              </li>}
              {copyInternalFileLink && <CopyToClipboard text={activeFilePermIdURL} onCopy={onCopyToClipboard}>
                <li className="icon-link" data-action="copy-internal-link">
                  {strings.copyInternalFileLink}
                </li>
              </CopyToClipboard>}
            </ul>
          </DropMenu>}
        </div>
      </header>
    );
  }
}
