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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import FileList from 'components/FileList/FileList';
import Btn from 'components/Btn/Btn';
import FileItemNew from 'components/FileItemNew/FileItemNew';

const FileItemDocs = require('!!react-docgen-loader!components/FileItem/FileItem.js');
const FileItemNewDocs = require('!!react-docgen-loader!components/FileItemNew/FileItemNew.js');

import files from 'static/fileTypes';

const svgFiles = [
  files[1],
  files[2],
  files[6],
  files[16],
  files[17],
  files[25],
  files[27],
  files[29],
  files[30]
];

export default class FileItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fakeFiles: files,
      grid: true,
      showCheckbx: false
    };
    autobind(this);
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleShowCheckbox() {
    this.setState({ showCheckbox: !this.state.showCheckbox });
  }

  handleToggleProcessing() {
    const newFiles = [...this.state.fakeFiles];
    newFiles.forEach(function(file) {
      file.status = file.status === 'processing' ? 'active' : 'processing';  // eslint-disable-line
      file.progress = 1;  // eslint-disable-line
    });
    this.setState({ fakeFiles: newFiles });
  }

  handleToggleSyncing() {
    const newFiles = [...this.state.fakeFiles];
    newFiles.forEach(function(file) {
      file.status = file.status === 'syncing' ? 'active' : 'syncing';  // eslint-disable-line
      file.progress = 1;  // eslint-disable-line
    });
    this.setState({ fakeFiles: newFiles });
  }

  handleToggleProgress() {
    const newFiles = [...this.state.fakeFiles];
    newFiles.forEach(function(file) {
      file.status = 'processing';  // eslint-disable-line
      file.progress = 0.75;  // eslint-disable-line
    });
    this.setState({ fakeFiles: newFiles });
  }

  handleClick() {
    console.log('click!')
  }

  render() {
    const { fakeFiles, grid, showCheckbox } = this.state;

    const fileStyle = {
      margin: '0.625rem 0',
      ...grid && { display: 'inline-block' }
    }

    return (
      <section id="FileItemView">
        <h1>FileItemNew - 2020 Webapp Modern Design</h1>
        <Docs {...FileItemNewDocs} />
        <ComponentItem>
          {files.map((f, index) => (
            <div key={index} style={fileStyle}>
              <FileItemNew
                id={f.id}
                grid={grid}
                hover={false}
                thumbSize="small"
                onClick={this.handleClick}
                {...f}
                {...this.props}
              />
            </div>
          ))}
        </ComponentItem>

        <h1>FileItem - Legacy</h1>
        <p>Total categories: {fakeFiles.length}</p>
        <Docs {...FileItemDocs} />

        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={showCheckbox} onClick={this.handleToggleShowCheckbox}>showCheckbox</Btn>
            <Btn small onClick={this.handleToggleProcessing}>Toggle Processing Status</Btn>
            <Btn small onClick={this.handleToggleSyncing}>Toggle Syncing Status</Btn>
            <Btn small onClick={this.handleToggleProgress}>Toggle Progress Status</Btn>
          </div>
        </Debug>

        <h3>Large</h3>
        {grid && <p>Description limited to 2 lines.</p>}
        <ComponentItem>
          <FileList
            list={fakeFiles}
            thumbSize="large"
            grid={grid}
            showCheckbox={showCheckbox}
          />
        </ComponentItem>

        <h3>Medium</h3>
        {grid && <p>Description limited to 2 lines.</p>}
        <ComponentItem>
          <FileList
            list={fakeFiles}
            thumbSize="medium"
            grid={grid}
            showCheckbox={showCheckbox}
          />
        </ComponentItem>

        <h3>Small</h3>
        {grid && <p>Description shown on hover.</p>}
        <ComponentItem>
          <FileList
            list={fakeFiles}
            thumbSize="small"
            grid={grid}
            showCheckbox={showCheckbox}
          />
        </ComponentItem>

        <h3>SVG Icons</h3>
        <p>Total SVG categories: {svgFiles.length}</p>
        <ComponentItem>
          <FileList
            list={svgFiles}
            thumbSize="large"
            grid={grid}
            showCheckbox={showCheckbox}
          />
        </ComponentItem>
      </section>
    );
  }
}
