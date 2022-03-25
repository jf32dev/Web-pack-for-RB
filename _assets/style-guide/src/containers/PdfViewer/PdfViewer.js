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
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';
import { Btn } from 'components';

import PdfViewer from 'components/ViewerFiles/PdfViewer/PdfViewer';

const PdfDocs = require('!!react-docgen-loader!components/ViewerFiles/PdfViewer/PdfViewer.js');

export default class PdfViewerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 2,
      totalPages: 0,
      loading: true,
      scale: 1.0,
      outline: [],
      showPages: false,
      showFind: false
    };
    autobind(this);

    // refs
    this.PdfViewer = null;
  }

  handlePrevPageClick() {
    const { currentPage, totalPages } = this.state;

    let newPage = currentPage - 1;
    if (!newPage) {
      newPage = totalPages;
    }

    this.setState({
      currentPage: newPage
    });
  }

  handleNextPageClick() {
    const { currentPage, totalPages } = this.state;

    let newPage = currentPage + 1;
    if (newPage > totalPages) {
      newPage = 1;
    }

    this.setState({
      currentPage: newPage
    });
  }

  handleDocumentComplete(id, pdf) {
    this.setState({
      pdf: pdf,
      totalPages: pdf.numPages,
      loading: false
    });
  }

  handleDocumentError(id, event) {
    console.log(event);
  }

  handlePageComplete(data) {
    this.setState({ currentPage: data.currentPage });
  }

  handleCurrentPageChange(event, pageNumber) {
    this.setState({ currentPage: pageNumber });
  }

  handlePageClick(event, page) {
    this.setState({ currentPage: page });
  }

  handleAnchorClick(event, anchor) {
    console.log(anchor);
  }

  handleToggleFind() {
    this.setState({ showFind: !this.state.showFind, showPages: false });
    this.PdfViewer.handleToggleFind();
  }

  handleToggleOutline() {
    this.PdfViewer.handleToggleOutline();
  }

  handleTogglePages() {
    this.setState({ showPages: !this.state.showPages, showFind: false });
    this.PdfViewer.handleTogglePages();
  }

  handleSidePanelClose() {
    //update parent when component change state
    this.setState({ showPages: false, showFind: false });
  }

  render() {
    const { showPages, showFind, currentPage } = this.state;

    return (
      <section id="PdfViewerView">
        <h1>PdfViewer</h1>
        <Docs {...PdfDocs} />
        <Debug>
          <div>
            <Btn small onClick={this.handlePrevPageClick}>Prev Page</Btn>
            <Btn small onClick={this.handleNextPageClick}>Next Page</Btn>
          </div>
          <div>
            <code>currentPage: {currentPage}</code>
          </div>
        </Debug>

        <Btn small inverted={showFind} onClick={this.handleToggleFind} style={{ marginBottom: '0.5rem' }}>Find</Btn>
        <Btn small inverted={showPages} onClick={this.handleTogglePages} style={{ marginBottom: '0.5rem' }}>Pages</Btn>
        <Btn small onClick={this.handleToggleOutline} style={{ marginBottom: '0.5rem' }}>Outline</Btn>

        <ComponentItem style={{ height: '500px' }}>
          <PdfViewer
            id={1337}
            ref={(c) => { this.PdfViewer = c; }}
            url="/src/static/medical.pdf"
            currentPage={currentPage}
            initialQuery="sollten"
            onDocumentComplete={this.handleDocumentComplete}
            onDocumentError={this.handleDocumentError}
            onPageComplete={this.handlePageComplete}
            onPageClick={this.handlePageClick}
            onAnchorClick={this.handleAnchorClick}
            onCurrentPageChange={this.handleCurrentPageChange}
            onSidePanelClose={this.handleSidePanelClose}
          />
        </ComponentItem>
      </section>
    );
  }
}
