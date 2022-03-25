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

import uniqueId from 'lodash/uniqueId';
import findIndex from 'lodash/findIndex';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import {
  Btn,

  //Viewer,
  ViewerHeader,
  ViewerPages,
  ViewerTabs,
  ViewerToolbar,

  ProgressControl,
  VolumeControl
} from 'components';

const ViewerDocs = require('!!react-docgen-loader!components/Viewer/Viewer.js');
const ViewerHeaderDocs = require('!!react-docgen-loader!components/Viewer/ViewerHeader.js');
const ViewerPagesDocs = require('!!react-docgen-loader!components/Viewer/ViewerPages.js');
const ViewerTabsDocs = require('!!react-docgen-loader!components/Viewer/ViewerTabs.js');
const ViewerToolbarDocs = require('!!react-docgen-loader!components/Viewer/ViewerToolbar.js');

const ProgressControlDocs = require('!!react-docgen-loader!components/Viewer/ProgressControl.js');
const VolumeControlDocs = require('!!react-docgen-loader!components/Viewer/VolumeControl.js');

const files = require('../../static/files.json');
const word = files[9];

export default class ViewerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFileId: files[0].id,

      currentPage: 1,
      activeTabId: 1,
      elapsed1: 0.2,
      elapsed2: 0.4,
      showPages: false,
      tabs: [{
        id: 1,
        title: 'Tab 1',
        note: 'Description'
      }, {
        id: 2,
        title: 'Tab 2',
        note: 'Another description'
      }],

      theme: 'light',

      toolbarCurrentPage: 1,
      toolbarTotalPages: 20,

      viewerOpen: false,
      viewerDocked: false,
      volume1: 0.7,
      volume2: 0.9
    };

    autobind(this);
  }

  handleViewerToggleClick() {
    if (this.state.viewerOpen && this.refs.viewer.state.isDocked) {
      this.refs.viewer.toggleDocked();
    } else {
      this.setState({ viewerOpen: !this.state.viewerOpen });
    }
  }

  handleThemeToggle() {
    this.setState({
      theme: this.state.theme === 'light' ? 'dark' : 'light'
    });
  }

  handleHeaderItemClick(event) {
    console.log(event);
  }

  handleHeaderMenuItemClick(event) {
    console.log(event);
  }

  handleViewerDockToggleClick() {
    this.setState({ viewerDocked: !this.state.viewerDocked });
  }

  handleViewerTabCloseClick(tabId) {
    console.log('close: ' + tabId);  // eslint-disable-line
  }

  handleUpdateFile() {
    console.log('handleUpdateFile');
  }

  handleAddTab() {
    const newTabs = [...this.state.tabs];
    const newId = uniqueId('new-');
    newTabs.push({
      id: newId,
      title: 'Tab ' + newId,
      note: 'Blah blah...'
    });
    this.setState({ tabs: newTabs });
  }

  handleCloseClick() {
    this.setState({ viewerOpen: false });
  }

  handleTabClick(event, fileId) {
    this.setState({
      activeTabId: fileId,
      activeFileId: fileId
    });
  }

  handleTabCloseClick(tabId) {
    const newTabs = [...this.state.tabs];
    newTabs.splice(findIndex(newTabs, function(tab) {
      return tab.id === tabId;
    }), 1);
    this.setState({ tabs: newTabs });
  }

  handlePageClick(event, pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  handleToolbarItemClick(event, action) {
    console.log(action);
  }

  handleToolbarPageChange(event) {
    let val = event.currentTarget.value;

    if (val < 1) {
      val = 1;
    } else if (val > this.state.toolbarTotalPages) {
      val = this.state.toolbarTotalPages;
    }

    this.setState({ toolbarCurrentPage: val });
  }

  handleProgress1Change(value) {
    this.setState({ elapsed1: value.toPrecision(2) });
  }

  handleProgress2Change(value) {
    this.setState({ elapsed2: value.toPrecision(2) });
  }

  handleVolume1Change(value) {
    this.setState({ volume1: value.toPrecision(2) });
  }

  handleVolume2Change(value) {
    this.setState({ volume2: value.toPrecision(2) });
  }

  handleMultiImagePagesToggle() {
    this.setState({ showPages: !this.state.showPages });
  }

  handleFullScreenClick() {
    console.log('handleFullScreenClick');  // eslint-disable-line
  }

  render() {
    return (
      <section id="ViewerView">
        <h1>Viewer</h1>
        <Docs {...ViewerDocs} />

        {/*<p><Btn onClick={this.handleViewerToggleClick}>Toggle Viewer</Btn></p>*/}
        <p><Btn small onClick={this.handleThemeToggle}>Toggle Theme ({this.state.theme})</Btn></p>

        <h3>File Support</h3>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code><a href="/AppViewer">AppViewer</a></code></td>
              <td>app</td>
            </tr>
            <tr>
              <td><code><a href="/AudioVideo">AudioVideo</a></code></td>
              <td>audio, video</td>
            </tr>
            <tr>
              <td><code><a href="/Csv">Csv</a></code></td>
              <td>csv*</td>
            </tr>
            <tr>
              <td><code><a href="/Epub">Epub</a></code></td>
              <td>epub</td>
            </tr>
            <tr>
              <td><code><a href="/Form">Form</a></code></td>
              <td>form</td>
            </tr>
            <tr>
              <td><code><a href="/ImageViewer">ImageViewer</a></code></td>
              <td>image, project</td>
            </tr>
            <tr>
              <td><code><a href="/MultiImageViewer">MultiImageViewer</a></code></td>
              <td>excel, word</td>
            </tr>
            <tr>
              <td><code><a href="/PdfViewer">PdfViewer</a></code></td>
              <td>pdf, numbers, pages, visio</td>
            </tr>
            <tr>
              <td><code><a href="/PlainText">PlainText</a></code></td>
              <td>txt</td>
            </tr>
            <tr>
              <td><code><a href="/Presentation">Presentation</a></code></td>
              <td>btc, powerpoint, keynote</td>
            </tr>
            <tr>
              <td>Unsupported</td>
              <td>dwg, earthviewer, ebook, ibook, oomph, prov, rtf, rtfd, twixl, vcard, web, zip</td>
            </tr>
          </tbody>
        </table>

        {/*this.state.viewerOpen && <Viewer
          ref="viewer"
          files={files}
          activeFileId={this.state.activeFileId}
          apiPath="https://push.bigtincan.org/v5/webapi"
          theme={this.state.theme}
          fullscreen
          isDocked={this.state.viewerDocked}
          onCloseClick={this.handleCloseClick}
          onDockToggleClick={this.handleViewerDockToggleClick}
          onHeaderItemClick={this.handleHeaderItemClick}
          onTabClick={this.handleTabClick}
          onTabCloseClick={this.handleViewerTabCloseClick}
          updateFile={this.handleUpdateFile}
        />*/}

        <h2>ViewerHeader</h2>
        <Docs {...ViewerHeaderDocs} />
        <ComponentItem>
          <ViewerHeader
            activeFile={word}
            pages
            toc
            findtext
            bookmark
            broadcast
            share
            bookmarkAll
            createStory
            addFiles
            theme={this.state.theme}
            onItemClick={this.handleHeaderItemClick}
            onMenuItemClick={this.handleHeaderMenuItemClick}
          />
          <br />
          <ViewerHeader
            activeFile={word}
            isDocked
            theme={this.state.theme}
            onItemClick={this.handleHeaderItemClick}
            onMenuItemClick={this.handleHeaderMenuItemClick}
          />
        </ComponentItem>

        <h2>ViewerPages</h2>
        <Docs {...ViewerPagesDocs} />

        <ComponentItem style={{ position: 'relative', height: '320px', overflow: 'auto' }}>
          <ViewerPages
            pages={word.pages}
            currentPage={this.state.currentPage}
            theme={this.state.theme}
            onPageClick={this.handlePageClick}
          />
        </ComponentItem>

        <h2>ViewerTabs</h2>
        <Docs {...ViewerTabsDocs} />

        <p><Btn onClick={this.handleAddTab}>Add Tab</Btn></p>
        <ComponentItem style={{ position: 'relative' }}>
          <ViewerTabs
            tabs={this.state.tabs}
            activeId={this.state.activeTabId}
            theme={this.state.theme}
            onTabClick={this.handleTabClick}
            onTabCloseClick={this.handleTabCloseClick}
          />
        </ComponentItem>

        <h2>ViewerToolbar</h2>
        <Docs {...ViewerToolbarDocs} />
        <ComponentItem>
          <ViewerToolbar
            currentPage={this.state.toolbarCurrentPage}
            totalPages={this.state.toolbarTotalPages}
            fullscreen
            zoom
            zoomOutDisabled
            onCurrentPageChange={this.handleToolbarPageChange}
            onItemClick={this.handleToolbarItemClick}
            style={{ position: 'static', transform: 'none' }}
          />
        </ComponentItem>

        <h2>ProgressControl</h2>
        <Docs {...ProgressControlDocs} />
        <p>Progress 1: {this.state.elapsed1}</p>
        <p>Progress 2: {this.state.elapsed2}</p>
        <ComponentItem>
          <ProgressControl
            buffer={0.25}
            elapsed={this.state.elapsed1}
            onChange={this.handleProgress1Change}
          />
        </ComponentItem>
        <ComponentItem style={{ backgroundColor: '#000' }}>
          <ProgressControl
            buffer={0.75}
            elapsed={this.state.elapsed2}
            dark
            onChange={this.handleProgress2Change}
          />
        </ComponentItem>

        <h2>VolumeControl</h2>
        <Docs {...VolumeControlDocs} />
        <p>Volume 1: {this.state.volume1}</p>
        <p>Volume 2: {this.state.volume2}</p>
        <ComponentItem style={{ display: 'inline-block', height: '180px' }}>
          <VolumeControl
            volume={this.state.volume1}
            onChange={this.handleVolume1Change}
          />
        </ComponentItem>
        <ComponentItem style={{ backgroundColor: '#000', display: 'inline-block', height: '180px', marginLeft: '2rem' }}>
          <VolumeControl
            volume={this.state.volume2}
            dark
            onChange={this.handleVolume2Change}
          />
        </ComponentItem>

      </section>
    );
  }
}
