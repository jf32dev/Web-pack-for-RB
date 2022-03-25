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
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import { FileEditList, FileEditModal } from 'components';
import Btn from 'components/Btn/Btn';

const FileEditListDocs = require('!!react-docgen-loader!components/FileEditList/FileEditList.js');

const fileList = require('../../static/files.json');

export default class FileEditListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: fileList,
      lastEvent: null,
      isModalVisible: false,
      modalData: fileList[0]
    };
    autobind(this);
  }

  handleSortStart(item) {
    this.setState({
      lastEvent: 'onSortStart: ' + item.index + ' ' + item.node.dataset.id
    });
  }

  handleAnchorClick(event) {
    this.setState({
      lastEvent: 'handleAnchorClick: ' + event.currentTarget.getAttribute('href')
    });
  }

  handleOrderChange(event, order) {
    console.log(order);
    this.setState({
      lastEvent: 'onOrderChange: ' + order
    });
  }

  handleOptionsToggleClick(event, fileId) {
    const newFiles = [...this.state.files];
    const i = newFiles.findIndex(f => f.id === fileId);
    if (i > -1) {
      newFiles[i] = {
        ...newFiles[i],
        showOptions: !newFiles[i].showOptions
      };
    }

    this.setState({
      files: newFiles,
      lastEvent: 'onFileOptionsToggleClick: ' + fileId,
      modalData: newFiles[i]
    });

    this.handleToggleModal();
  }

  handleDeleteClick(event, fileId) {
    this.setState({
      lastEvent: 'onFileDeleteClick: ' + fileId
    });
  }

  handleDescriptionChange(event) {
    console.log(event);
  }

  handleUploadClick(event) {
    console.log(event);
  }

  handleShareChange(event, fileId) {
    const value = event.target.value;
    console.log(value, fileId);
  }

  handlePresentationSettingChange(event) {
    console.log(event);
  }

  handleWatermarkChange(event) {
    console.log(event);
  }

  handleSourceUrlChange(event) {
    console.log(event);
  }

  handleToggleModal() {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  }

  render() {
    const { files, lastEvent } = this.state;

    return (
      <section id="FileEditList">
        <h1>FileEditList</h1>
        <Docs {...FileEditListDocs} />

        <Debug>
          <div>
            <code>{lastEvent}</code>
          </div>
        </Debug>

        <ComponentItem style={{ height: '500px' }}>
          <FileEditList
            list={files}
            //disableSortable
            fileSettings={{ fileGeneralSettings: {
                detailsFieldLabel: '',
                hintText: '',
                showCustomFileDetailsIcon: false
              }
            }}
            onAddClick={() => {}}
            onFileHubshareDownloadChange={() => {}}
            onSortStart={this.handleSortStart}
            onOrderChange={this.handleOrderChange}
            onAnchorClick={this.handleAnchorClick}
            onFileOptionsToggleClick={this.handleOptionsToggleClick}
            onFileDeleteClick={this.handleDeleteClick}
            onFileDescriptionChange={this.handleDescriptionChange}
            onFileUploadClick={this.handleUploadClick}
            onFileShareChange={this.handleShareChange}
            onFilePresentationSettingChange={this.handlePresentationSettingChange}
            onFileWatermarkChange={this.handleWatermarkChange}
            onFileSourceUrlChange={this.handleSourceUrlChange}
          />
        </ComponentItem>

        <ComponentItem>
          <Btn alt onClick={this.handleToggleModal}>Show Modal</Btn>

          {/* Modals */}
          {this.state.isModalVisible && <FileEditModal
            onClose={this.handleToggleModal}
            {...this.state.modalData}
          />}
        </ComponentItem>
      </section>
    );
  }
}
