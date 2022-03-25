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
import uniqueId from 'lodash/uniqueId';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import CanvasEditor from 'components/CanvasEditor/CanvasEditor';

const CanvasEditorDocs = require('!!react-docgen-loader!components/CanvasEditor/CanvasEditor.js');

const staticFiles = require('static/filesSearch.json');

// array of sections with array of slides
const staticSections = [
  {
    id: 1,
    name: 'Primary',
    collapsed: false,
    slides: [
      {
        id: 1,
        title: 'First page',
        slide: {
          file: staticFiles[0],
          page: 10,
          thumbnail: 'src/static/images/file1.png'
        },
        blocks: []
      },
      {
        id: 2,
        title: '',
        template: 'one-col-title',
        blocks: [
          {
            type: 'image',
            file: staticFiles[2],
            page: 10,
            thumbnail: 'src/static/images/file2.png'
          },
        ]
      },
      {
        id: 3,
        title: '',
        template: 'one-col-title',
        blocks: [
          {
            type: 'text',
            file: staticFiles[1],
            page: 23,
            text: 'Running a successful small business, required owners to be efficient and resourceful. That\'s why Mastercard has enhanced our offers for...',
          }
        ]
      },
    ],
  },
  {
    id: 2,
    name: '',
    collapsed: true,
    slides: [
      {
        id: 4,
        title: '',
        template: 'one-col-title',
        blocks: [
          {
            type: 'image',
            file: staticFiles[3],
            page: 10,
            thumbnail: 'src/static/images/file3.png'
          },
        ]
      },
      {
        id: 5,
        template: 'one-col-title',
        blocks: [
          {
            type: 'image',
            file: staticFiles[3],
            page: 10,
            thumbnail: 'src/static/images/file4.png'
          },
        ]
      },
    ],
  }
];

const VALID_TEMPLATES = [
  {
    id: 1,
    name: 'cover',
    title: 24,
    blocks: [25],
    date: 26,
    footer: 3,
  },
  {
    id: 2,
    name: 'one-col-title',
    title: 7,
    blocks: [8],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 3,
    name: 'two-col-title',
    title: 7,
    blocks: [8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 6,
    name: 'three-col-title',
    title: 7,
    blocks: [9, 8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 4,
    name: 'two-col',
    blocks: [8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 5,
    name: 'three-col',
    blocks: [9, 8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 7,
    name: 'three-row',
    blocks: [7, 8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
];

export default class CanvasEditorView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: staticSections,
    };

    autobind(this);
  }

  handleSectionChange(section, sectionIndex) {
    // Replace all slides in section
    const newSections = this.state.sections.slice();
    newSections.splice(sectionIndex, 1, {
      ...newSections[sectionIndex],
      ...section
    });

    this.setState({
      sections: newSections
    });
  }

  handleSlideChange(slide, sectionIndex) {
    const newSections = this.state.sections.slice();
    const slideIndex = this.state.sections[sectionIndex].slides.findIndex(s => s.id === slide.id);

    // Merge changed slide props into activeSlide
    // and replace in section
    newSections[sectionIndex].slides.splice(slideIndex, 1, slide);

    this.setState({
      sections: newSections
    });
  }

  handleAddSlides(slides, slideIndex = 0, sectionIndex) {
    // Add new slides to section
    const newSections = this.state.sections.slice();

    const mergedSlides = newSections[sectionIndex].slides.slice();
    mergedSlides.splice(slideIndex, 0, ...slides);

    // Replace slides in section
    newSections.splice(sectionIndex, 1, {
      ...newSections[sectionIndex],
      slides: mergedSlides
    });

    this.setState({
      sections: newSections
    });
  }

  handleNewSection(slide, sectionIndex) {
    const newSections = this.state.sections.slice();

    // Add slide to new section after current section
    newSections.splice(sectionIndex + 1, 0, {
      id: uniqueId('section-'),
      name: 'Untitled Section',
      slides: slide ? [slide] : []
    });

    // Remove slide from old section
    if (slide && slide.id) {
      const slideIndex = this.state.sections[sectionIndex].slides.findIndex(s => s.id === slide.id);
      const newSlides = newSections[sectionIndex].slides.slice();
      newSlides.splice(slideIndex, 1);
      newSections.splice(sectionIndex, 1, {
        ...newSections[sectionIndex],
        slides: newSlides
      });
    }

    this.setState({
      sections: newSections
    });
  }

  handleClear() {
    this.setState({
      sections: []
    });
  }

  handleSave() {
    console.log(this.state.sections);
  }

  render() {
    const { sections } = this.state;

    return (
      <section id="CanvasEditorView">
        <h1>CanvasEditor</h1>
        <Docs {...CanvasEditorDocs} />

        <ComponentItem>
          <CanvasEditor
            sections={sections}
            templates={VALID_TEMPLATES}
            onSectionChange={this.handleSectionChange}
            onSlideChange={this.handleSlideChange}
            onAddSlides={this.handleAddSlides}
            onAddSection={this.handleNewSection}
            onClear={this.handleClear}
            onSave={this.handleSave}
          />
        </ComponentItem>
      </section>
    );
  }
}
