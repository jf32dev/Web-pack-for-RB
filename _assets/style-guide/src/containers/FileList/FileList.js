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
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import { Btn, FileList } from 'components';

const FileListDocs = require('!!react-docgen-loader!components/FileList/FileList.js');

const fileList = require('../../static/files.json');

export default class FileListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: fileList,
      showCheckbox: false,
      grid: false,
      showHeader: true,
      showDownload: true,
      thumbSize: 'medium'
    };
    autobind(this);
  }

  handleToggleProcessing() {
    const newFiles = [];
    this.state.files.forEach((file, index) => {
      if (index === 0 || index === 2) {
        newFiles.push({
          ...file,
          status: file.status === 'processing' ? 'active' : 'processing',
          progress: 1
        });
      } else {
        newFiles.push({ ...file });
      }
    });
    this.setState({
      files: newFiles
    });
  }

  handleToggleHideMeta() {
    const newFiles = [];
    this.state.files.forEach((file) => {
      newFiles.push({
        ...file,
        hideMeta: !file.hideMeta,
        showShareStatus: !file.showShareStatus,
      });
    });
    this.setState({
      files: newFiles,
      showHeader: !this.state.showHeader,
      showDownload: !this.state.showDownload
    });
  }

  handleSelectToggle(event) {
    event.preventDefault();
    this.setState({ showCheckbox: !this.state.showCheckbox });
  }

  handleGridToggle(event) {
    event.preventDefault();
    this.setState({
      grid: !this.state.grid,
      thumbSize: !this.state.grid ? 'large' : 'medium'
    });
  }

  handleDownloadAllClick(event) {
    event.preventDefault();
    console.info('download all files');
  }

  handleViewAllClick() {
    console.info('view all files: ');
  }

  handleDownloadSelectedClick() {
    const selectedIds = [];
    for (const file of this.state.files) {
      if (file.isSelected) {
        selectedIds.push(file.id);
      }
    }

    console.info('download selected files: ' + JSON.stringify(selectedIds));
  }

  handleViewSelectedClick() {
    const selectedIds = [];
    for (const file of this.state.files) {
      if (file.isSelected) {
        selectedIds.push(file.id);
      }
    }

    console.info('view selected files: ' + JSON.stringify(selectedIds));
  }

  handleDownloadFileClick(event, context) {
    console.info('download file: ' + context.props.id);
  }

  handleFileClick(event, context) {
    event.preventDefault();
    const fileId = context.props.id;

    // Toggle isSelected attribute on file
    if (this.state.showCheckbox) {
      const newFiles = [...this.state.files];
      const index = newFiles.findIndex(f => f.id === fileId);

      if (index > -1) {
        newFiles[index].isSelected = !newFiles[index].isSelected;
        this.setState({ files: newFiles });
      }

    // Open file
    } else {
      console.info('open file: ' + fileId);
    }
  }

  render() {
    const { files } = this.state;

    return (
      <section id="FileList">
        <h1>FileList</h1>
        <Docs {...FileListDocs} />
        <p>
          <Btn onClick={this.handleToggleProcessing}>Toggle Processing Status</Btn>
          <Btn onClick={this.handleToggleHideMeta}>Toggle Metadata</Btn>
        </p>

        <h2>Header</h2>
        <p>Use <code>showHeader</code> to display a header with sortable headings.</p>
        <ComponentItem>
          <FileList
            list={files}
            thumbSize={this.state.thumbSize}
            grid={this.state.grid}
            showCheckbox={this.state.showCheckbox}
            showDownload={this.state.showDownload}
            showHeader={this.state.showHeader}
            onSelectToggle={this.handleSelectToggle}
            onGridToggleClick={this.handleGridToggle}
            onDownloadAllClick={this.handleDownloadAllClick}
            onViewAllClick={this.handleViewAllClick}
            onDownloadSelectedClick={this.handleDownloadSelectedClick}
            onViewSelectedClick={this.handleViewSelectedClick}
            onDownloadFileClick={this.handleDownloadFileClick}
            onFileClick={this.handleFileClick}
          />
        </ComponentItem>

        <h2>Ignore by file type</h2>
        <p>Set <code>ignore</code> to hide file categories. e.g. <code>image, web, pdf</code></p>
        <ComponentItem>
          <FileList
            list={files}
            thumbSize="medium"
            showDownload={this.state.showDownload}
            showHeader={this.state.showHeader}
            ignore={['image', 'web', 'pdf']}
          />
        </ComponentItem>

        <h2>Empty list</h2>
        <p>If an empty or no <code>list</code> is passed. A <code>Blankslate</code> will display. Pass <code>emptyHeading</code> and <code>emptyMessage</code> to set a custom empty state.</p>
        <ComponentItem>
          <FileList
            emptyHeading="No files"
            emptyMessage="You have not attached any files"
          />
        </ComponentItem>
      </section>
    );
  }
}
