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

import isEqual from 'lodash/isEqual';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  arrayMove
} from 'react-sortable-hoc';

import FileEditItem from 'components/FileEditItemNew/FileEditItemNew';

const messages = defineMessages({
  title: { id: 'title', defaultMessage: 'Title' },
  shareStatus: { id: 'share-status', defaultMessage: 'Share status' },
  fileOptions: { id: 'file-options', defaultMessage: 'File options' },

  // FileEditItem
  done: { id: 'done', defaultMessage: 'Done' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  deleteConfirm: { id: 'confirm-file-delete', defaultMessage: 'Are you sure you want to delete this file?' },
  disconnect: { id: 'disconnect', defaultMessage: 'Disconnect' },
  disconnectConfirm: { id: 'confirm-file-disconnect', defaultMessage: 'Are you sure you want to disconnect this folder?' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  options: { id: 'options', defaultMessage: 'Options' },
  filedescription: { id: 'file-description', defaultMessage: 'File Description' },
  customThumbnail: { id: 'custom-thumbnail', defaultMessage: 'Custom Thumbnail' },
  thumbNote: { id: 'file-thumbnail-note', defaultMessage: 'Upload a different thumbnail' },
  upload: { id: 'upload', defaultMessage: 'Upload' },
  addThumbnail: { id: 'add-thumbnail', defaultMessage: 'Add Thumbnail' },
  applyWatermark: { id: 'apply-watermark', defaultMessage: 'Apply Watermark' },
  presentationSettings: { id: 'presentation-settings', defaultMessage: 'Presentation Settings' },
  allowBroadcast: { id: 'allow-broadcast', defaultMessage: 'Allow Broadcast' },
  allowSlideReorder: { id: 'allow-slide-reorder', defaultMessage: 'Allow Slide Reorder' },
  allowSlideHiding: { id: 'allow-slide-hiding', defaultMessage: 'Allow Slide Hiding' },
  optional: { id: 'optional', defaultMessage: 'Optional' },
  mandatory: { id: 'mandatory', defaultMessage: 'Mandatory' },
  blocked: { id: 'blocked', defaultMessage: 'Blocked' },
  synchronizedFiles: { id: 'synchronized-files', defaultMessage: 'Synchronized files' },
  folderNote: { id: 'folder-options-note', defaultMessage: 'Folder options apply to all synchonized files.' },
  link: { id: 'link', defaultMessage: 'Link' },
  allowHubshareDownload: { id: 'allow-hubShare-downloads', defaultMessage: 'Allow HubShare downloads' },
  update: { id: 'update', defaultMessage: 'Update' },
  showMore: { id: 'more', defaultMessage: 'More' },
  addTags: { id: 'add-tags', defaultMessage: 'Add tags' },
  fileExpireTime: { id: 'file-expire-time', defaultMessage: 'Schedule file expiry date & time' },
  fileExpireNote: { id: 'file-expire-note', defaultMessage: 'Set a date and time to expire this file' },
});

const SortableItem = sortableElement((props) => (
  <li data-id={props.id} onMouseUp={props.onMouseUp}>
    <FileEditItem
      disableSortable={!!props.disabled}
      {...props}
    />
  </li>
));

const SortableList = sortableContainer((props) => (
  <ol>{props.children}</ol>
));

/**
 * Used by Story Edit.
 * See <a href="https://github.com/clauderic/react-sortable-hoc">react-sortable-hoc</a>.
 */
export default class FileEditList extends Component {
  static propTypes = {
    /** items passed to <code>FileEditItem</code> */
    list: PropTypes.array,

    /** disabled drag/drop sorting behaviour */
    disableSortable: PropTypes.bool,

    onSortStart: PropTypes.func,

    /** returns array of file ids by newly sorted order */
    onOrderChange: function(props) {
      if (!props.disableSortable && typeof props.onOrderChange !== 'function') {
        return new Error('onOrderChange is required.');
      }
      return null;
    },

    onAddClick: PropTypes.func.isRequired,
    onAnchorClick: PropTypes.func.isRequired,
    onFileOptionsToggleClick: PropTypes.func.isRequired,
    onFileDeleteClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: []
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isSorting: false,
    };
    autobind(this);

    this.fileList = null;
  }

  componentDidUpdate(prevProps) {
    // Scroll file in to view if needed
    if (prevProps.list.length < this.props.list.length) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const scrollHeight = this.fileList.container.scrollHeight;
    const height = this.fileList.container.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.fileList.container.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  handleSortStart(event) {
    this.setState({ isSorting: true });

    if (typeof this.props.onSortStart === 'function') {
      this.props.onSortStart(event);
    }
  }

  handleSortEnd(value, event) {
    this.setState({ isSorting: false });

    const currentOrder = this.props.list.map(item => item.id);
    const newOrder = arrayMove([...currentOrder], value.oldIndex, value.newIndex);
    const orderChanged = !isEqual(currentOrder, newOrder);

    if (typeof this.props.onOrderChange === 'function' && orderChanged) {
      this.props.onOrderChange(event, newOrder);
    }
  }

  renderHeadings(strings) {
    const styles = require('./FileEditList.less');
    const headings = [
      { key: 'name', title: strings.title },
      { key: 'share', title: strings.shareStatus },
      { key: 'options', title: strings.fileOptions }
    ];

    // Add sequence heading if not disabled
    if (!this.props.disableSortable) {
      headings.unshift({ key: 'sequence', title: '' });
    }

    return (
      headings.map(heading =>
        (<li
          key={heading.key}
          data-key={heading.key}
          className={styles[heading.key]}
        >
          {heading.title}
        </li>)
      )
    );
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { list, disableSortable } = this.props;
    const styles = require('./FileEditList.less');
    const cx = classNames.bind(styles);
    const listClasses = cx({
      FileEditList: true,
      isSorting: this.state.isSorting
    }, this.props.className);
    const headingClasses = cx({
      headings: true,
      withSequence: !this.props.disableSortable
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={listClasses} style={this.props.style}>
        <header className={styles.header}>
          <ul className={headingClasses}>{this.renderHeadings(strings)}</ul>
        </header>
        <SortableList
          ref={(c) => { this.fileList = c; }}
          lockAxis="y"
          helperClass={styles.isSorting}
          lockToContainerEdges
          //pressDelay={100}
          useDragHandle
          onSortStart={this.handleSortStart}
          onSortEnd={this.handleSortEnd}
        >
          {list.map((file, index) => (!file.hasFolder &&
            <SortableItem
              key={file.id}
              index={index}
              value={file.id}
              thumbSize="small"
              disabled={disableSortable}
              disableSortable={disableSortable}
              fileSettings={this.props.fileSettings}
              strings={strings}
              authString={this.context.settings.authString}
              onAddClick={this.props.onAddClick}
              onAnchorClick={this.props.onAnchorClick}
              onOptionsToggleClick={this.props.onFileOptionsToggleClick}
              onDeleteClick={this.props.onFileDeleteClick}
              {...file}
            />
          ))}
        </SortableList>
      </div>
    );
  }
}
