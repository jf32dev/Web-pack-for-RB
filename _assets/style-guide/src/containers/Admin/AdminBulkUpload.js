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
 * @copyright 2019 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import AdminBulkUpload from 'components/Admin/AdminBulkUpload/AdminBulkUpload';
import AdminBulkUploadMetadata from 'components/Admin/AdminBulkUploadMetadata/AdminBulkUploadMetadata';
import Btn from 'components/Btn/Btn';
import Debug from '../../views/Debug';

const BulkUploadDocs = require('!!react-docgen-loader!components/Admin/AdminBulkUpload/AdminBulkUpload.js');
const BulkUploadMetadataDocs = require('!!react-docgen-loader!components/Admin/AdminBulkUploadMetadata/AdminBulkUploadMetadata.js');

const groupList = require('../../static/groups.json');

const languageList = {
  'en-us': 'English (US)',
  'en-gb': 'English (UK)',
  'da':'Dansk',
  'de':'Deutsch',
  'es':'Español',
  'fr':'Français',
  'it':'Italiano',
  'ja':'日本語',
  'ko':'한국어',
  'no':'Norsk',
  'pt-br':'Portuguese',
  'ru':'русский',
  'sv':'Svenska',
  'th':'ไทย',
  'tr': 'Türkçe',
  'zh-cn': '中文(简体)',
  'zh-hk': '中文(繁體)'
}

export default class AdminBulkUploadView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible1: false,

      groupList: groupList,
      groupSelectedList: groupList.slice(0, 3),

      isUploading: false,
      isUploaded: false,
      lastUpload: 1554773145150,
      status: 'processing'
    };
    autobind(this);
  }

  handleToggleModal1() {
    this.setState({
      modalVisible1: !this.state.modalVisible1
    });
  }

  handleToggleModal() {
    this.setState({
      modalVisible3: !this.state.modalVisible3,
      isUploading: false,
      isUploaded: false,
      isImported: false,
      status: this.state.status === 'done' ? 'new' : this.state.status,
    });
  }

  // Whether Server is precessing the file
  handleToggleStatus() {
    this.setState({
      status: this.state.status !== 'processing' ? 'processing' : 'new',
      isUploading: false,
      isUploaded: false,
      isImported: false,
    })
  }

  // File is being uploaded to the server
  handleToggleUploading() {
    this.setState({
      isUploading: !this.state.isUploading,
      isUploaded: false,
      isImported: false,
      status: 'new',
      lastUpload: 0
    })
  }

  handleToggleUploaded() {
    this.setState({
      isUploaded: !this.state.isUploaded,
      isUploading: false,
      isImported: false,
      status: 'new',
      lastUpload: 0
    })
  }

  handleToggleImported() {
    this.setState({
      isImported: !this.state.isImported,
      isUploaded: false,
      isUploading: false,
      status: 'done',
      lastUpload: 1554856771667
    })
  }

  handleSetLastUpload() {
    this.setState({
      lastUpload: !this.state.lastUpload ? 1554856771667 : 0
    })
  }

  handleSampleCsvClick() {
    console.log('Sample Csv Clicked');
  }

  handleAllUsersCsvClick() {
    console.log('All users Csv Clicked');
  }

  // Group list functions
  handleOnAddGroupItem(id) {
    const { groupList, groupSelectedList } = this.state;
    const item = groupList.find(item => item.id === Number(id));
    item.isSelected = true;
    const nGroups = [...groupSelectedList, item];

    this.setState({
      groupList: groupList,
      groupSelectedList: nGroups
    });
  }

  handleOnRemoveGroupItem(id) {
    const { groupList, groupSelectedList } = this.state;
    const groupListFiltered = groupSelectedList.filter(item => item.id !== Number(id));
    groupList.find(item => item.id === Number(id)).isSelected = false;

    this.setState({
      groupSelectedList: groupListFiltered
    });
  }

  handleGroupSearchChange(e) {
    const { value } = e.currentTarget;

    let groupListFiltered = groups; // Shows all items
    if (value) {
      groupListFiltered = this.state.groupList.filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
    }

    this.setState({
      groupList: groupListFiltered
    });
  }

  handleGroupScroll() {
    console.log('Scrolling group list'); //eslint-disable-line
  }

  // Hanndling Files
  handleFileDropped(context) {
    console.log(context);
  }

  render() {
    return (
      <section id="NavMenuView">
        <h1>Admin Bulk Upload</h1>
        <Docs {...BulkUploadDocs} />

        <h2>User Bulk upload Drag N Drop/ Browse File</h2>
        <p>Admin users bulk upload modal</p>
        <ComponentItem>
          <Btn onClick={this.handleToggleModal1}>Launch Modal</Btn>
          <AdminBulkUpload
            isVisible={this.state.modalVisible1}
            width="medium"
            backdropClosesModal
            escClosesModal

            languageList={languageList}
            groupList={groupList}
            onClose={this.handleToggleModal1}
            onSampleCsvClick={this.handleSampleCsvClick}
            onSampleDeleteCsvClick={this.handleSampleCsvClick}
            onAllUsersCsvClick={this.handleAllUsersCsvClick}
          />
        </ComponentItem>

        <h2>Custom User Metadata</h2>
        <Docs {...BulkUploadMetadataDocs} />
        <p>Bulk upload modal</p>

        <Debug>
          <div>
            <code>Status: {this.state.status} Last Upload: {this.state.lastUpload}</code>
          </div>
        </Debug>

        <ComponentItem>
          <Btn onClick={this.handleToggleModal}>Launch Modal</Btn>
          <Btn onClick={this.handleToggleStatus} alt={this.state.status === 'processing'}>Toggle Status</Btn>
          <Btn onClick={this.handleSetLastUpload} alt={!!this.state.lastUpload}>Set Last upload</Btn>
          <Btn onClick={this.handleToggleUploading} alt={!!this.state.isUploading}>is File Uploading?</Btn>
          <Btn onClick={this.handleToggleUploaded} alt={!!this.state.isUploaded}>is File Uploaded?</Btn>
          <Btn onClick={this.handleToggleImported} alt={!!this.state.isImported}>Import Completed</Btn>

          <AdminBulkUploadMetadata
            isVisible={this.state.modalVisible3}
            width="medium"
            backdropClosesModal
            escClosesModal
            isUploading={this.state.isUploading}
            isFileUploaded={this.state.isUploaded}
            lastUpload={this.state.lastUpload}
            status={this.state.status}
            languageList={languageList}
            groupList={groupList}
            onClose={this.handleToggleModal}
            onSampleCsvClick={this.handleSampleCsvClick}
            onSampleDeleteCsvClick={this.handleSampleCsvClick}
            onAllUsersCsvClick={this.handleAllUsersCsvClick}
            onFileDropAccepted={this.handleFileDropped}
          />
        </ComponentItem>
      </section>
    );
  }
}
