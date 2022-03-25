/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import uniqueId from 'lodash/uniqueId';

import { ReactSortable } from 'react-sortablejs';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import areCommonElements from 'helpers/areCommonElements';

import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';
import Icon from 'components/Icon/Icon';
import Loader from 'components/Loader/Loader';
import Select from 'components/Select/Select';
import SVGIcon from 'components/SVGIcon/SVGIcon';
import Text from 'components/Text/Text';

import CanvasSlideThumb from 'components/CanvasSlideThumb/CanvasSlideThumb';
import CanvasSlideLayout from 'components/CanvasSlideLayout/CanvasSlideLayout';

const messages = defineMessages({
  organise: { id: 'organise', defaultMessage: 'Organise' },
  organiseAndStyleYourSlides: { id: 'organise-and-style-your-slides', defaultMessage: 'Organise and style your slides' },
  save: { id: 'save', defaultMessage: 'Save' },
  export: { id: 'export', defaultMessage: 'Export' },
  combine: { id: 'combine', defaultMessage: 'Combine' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  clear: { id: 'clear', defaultMessage: 'Clear' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  done: { id: 'done', defaultMessage: 'Done' },
  sectionName: { id: 'section-name', defaultMessage: 'Section name' },
  newSection: { id: 'new-section', defaultMessage: 'New Section' },
  collapseAllSections: { id: 'collapse-all-sections', defaultMessage: 'Collapse all Sections' },
  expandAllSections: { id: 'expand-all-sections', defaultMessage: 'Expand all Sections' },
  addFile: { id: 'add-file', defaultMessage: 'Add File' },
  clearCanvas: { id: 'clear-canvas', defaultMessage: 'Clear Canvas' },
  clearAll: { id: 'clear-all', defaultMessage: 'Clear All' },
  clearSelection: { id: 'clear-selection', defaultMessage: 'Clear Selection' },
  selectBlocks: { id: 'select-blocks', defaultMessage: 'Select Blocks' },
  deletePitch: { id: 'delete-pitch', defaultMessage: 'Delete Pitch' },
  selectASlide: { id: 'select-a-slide', defaultMessage: 'Select a Slide' },
  deleteSlide: { id: 'delete-slide', defaultMessage: 'Delete Slide' },
  deleteBlock: { id: 'delete-block', defaultMessage: 'Delete Block' },
  convertToPage: { id: 'convert-to-page', defaultMessage: 'Convert to Page' },
  convertToBlock: { id: 'convert-to-block', defaultMessage: 'Convert to Block' },
  separateBlocks: { id: 'separate-blocks', defaultMessage: 'Separate Blocks' },
  show: { id: 'show', defaultMessage: 'Show' },
  everything: { id: 'everything', defaultMessage: 'Everything' },
  page: { id: 'page', defaultMessage: 'Page' },
  block: { id: 'block', defaultMessage: 'Block' },
  slides: { id: 'slides', defaultMessage: 'Slides' },
  images: { id: 'images', defaultMessage: 'Images' },
  video: { id: 'video', defaultMessage: 'Video' },
  text: { id: 'text', defaultMessage: 'Text' },
  layoutTemplates: { id: 'layout-templates', defaultMessage: 'Layout templates' },
  emptyLayoutsMessage: { id: 'empty-layouts-message', defaultMessage: 'Select blocks to view the available layout templates.' },
  title: { id: 'title', defaultMessage: 'Title' },
  addTitle: { id: 'add-title', defaultMessage: 'Add Title' },
  clearDialogTitle: { id: 'clear-dialog-title', defaultMessage: 'Are you sure you want to clear the canvas?' },
  clearDialogMessage: { id: 'clear-dialog-message', defaultMessage: 'All slides and media will be removed from the canvas.' },
  clearDialogTitleForPitchBuilder: { id: 'clear-dialog-title-for-pitch-builder', defaultMessage: 'Are you sure you want to clear all pages?' },
  clearDialogMessageForPitchBuilder: { id: 'clear-dialog-message-for-pitch-builder', defaultMessage: 'All pages and media will be removed from this presentation.' },
  internalOnly: { id: 'internal-only', defaultMessage: 'Internal Only' },

  deleteSlideDialogTitle: { id: 'delete-slide-dialog-title', defaultMessage: 'Delete Slide' },
  deleteSlideDialogMessage: { id: 'delete-slide-dialog-message', defaultMessage: 'Are you sure you want to delete this slide?' },
  deletePageDialogTitle: { id: 'delete-page-dialog-title', defaultMessage: 'Delete Page' },
  deletePageDialogMessage: { id: 'delete-page-dialog-message', defaultMessage: 'Are you sure you want to delete this page?' },
  deleteSectionDialogTitle: { id: 'delete-section-dialog-title', defaultMessage: 'Delete Section' },
  deleteSectionDialogMessage: { id: 'delete-section-dialog-message', defaultMessage: 'Are you sure you want to delete this section and all slides within it?' },
  deleteSectionDialogMessageForPitchBuilder: { id: 'delete-section-dialog-message-for-pitch-builder', defaultMessage: 'Are you sure you want to delete this section and all pages within it?' },
  deletePagesDialogTitle: { id: 'delete-pages-dialog-title', defaultMessage: 'Are you sure you want to delete {pageCount, plural, one {page} other {pages}}?' },
  deletePagesDialogMessage: { id: 'delete-pages-dialog-message', defaultMessage: 'The {pageCount} selected {pageCount, plural, one {page} other {pages}} will be removed from this presentation.' },

  emptyCanvasTitle: { id: 'empty-canvas-title', defaultMessage: 'Empty Canvas' },
  emptyCanvasMessage: { id: 'empty-canvas-message', defaultMessage: 'Find files using search and add them to canvas to start building a presentation.' },
  emptySlideLayoutMessage: { id: 'empty-slide-layout-message', defaultMessage: 'Make a selection from your Canvas to organise your presentation.' },

  emptyPBTitle: { id: 'empty-pb-title', defaultMessage: 'Empty Pitch Builder' },
  emptyPBMessage: { id: 'empty-pb-message', defaultMessage: 'Find files using search and add them to Pitch Builder to start building a presentation.' },
  deleteSelected: { id: 'delete-selected', defaultMessage: 'Delete Selected' },
  select: { id: 'select', defaultMessage: 'Select' },
  selectAll: { id: 'select-all', defaultMessage: 'Select All' },
  deletePages: { id: 'delete-pages', defaultMessage: 'Delete Pages' }
});

// Find a slide by it's block
// returns the slide and the section index
function getSlideWithBlock(block, sections) {
  let found = {
    slide: null,
    section: null,
  };

  sections.some((section, i) => {
    const slide = section.slides.find(s => !s.deleted && s.blocks.find(b => b === block));
    if (slide) {
      found = {
        slide: slide,
        section: i
      };
      return true;
    }
    return false;
  });

  return found;
}

/**
 * CanvasEditor displays block/file results as slides
 * that can be arranged into a presentation.
 */
export default class CanvasEditor extends PureComponent {
  static propTypes = {
    sections: PropTypes.array,
    templates: PropTypes.array.isRequired,

    // Display Side bar file options for BlockSearch
    showSideBarSettings: PropTypes.bool,

    // Toggle options and theme for Pitch Builder
    isPitchBuilderEnabled: PropTypes.bool,

    loading: PropTypes.bool,

    onSectionChange: PropTypes.func.isRequired,
    onSectionDelete: PropTypes.func.isRequired,
    onSlideChange: PropTypes.func.isRequired,
    onSlideDelete: PropTypes.func.isRequired,

    onAddSlides: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    onAddFile: PropTypes.func.isRequired,

    onClear: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    showSideBarSettings: true,
    isPitchBuilderEnabled: false,
    sections: [
      {
        id: 1,
        name: 'Section 1',
        collapsed: false,
        slides: []
      }
    ]
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,

      // complete object of active slide
      activeSlide: null,

      // complete object of edited (unsaved) active slide
      activeSlideEdit: null,

      // index of section of active slide
      activeSection: null,

      // index of section to delete
      sectionToDelete: null,

      // array of currently selected blocks (max 3)
      activeBlocks: [],

      // sorting is disabled
      sortingDisabled: false,

      // index of section name being edited
      editingSection: [],

      // block select mode is active
      selectBlockMode: false,

      selectPageMode: false,

      filterValue: 'everything',

      showClearDialog: false,
      showDeleteDialog: false,
      showDeleteSectionDialog: false,
    };

    // Get max blocks.length of template
    this.SLIDE_BLOCK_LIMIT = props.templates.reduce((accumulator, currentValue) => {
      if (currentValue.blocks && currentValue.blocks.length > accumulator) {
        return currentValue.blocks.length;
      }
      return accumulator;
    }, 0);

    // ref to sortablejs instance
    this.sortable = [];

    autobind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.sortingDisabled && !this.state.sortingDisabled) {
      this.disableSortable();
    } else if (!nextState.sortingDisabled && this.state.sortingDisabled) {
      this.enableSortable();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside);
  }

  disableSortable() {
    this.sortable.forEach(sortable => {
      // disables sorting within section
      sortable.option('sort', false);

      // disables put/pull to disable sorting between sections
      sortable.option('group', {
        name: 'slides',
        pull: false,
        put: false
      });
    });
  }

  enableSortable() {
    this.sortable.forEach(sortable => {
      // enables sorting within section
      sortable.option('sort', true);

      // enables put/pull to enable sorting between sections
      sortable.option('group', {
        name: 'slides',
        pull: true,
        put: true
      });
    });
  }

  getSlideCount(sections, sectionIndex, slideIndex) {
    // const { sections } = this.props;

    // Return the slide number based on the section and slide index
    const count = sections.reduce((acc, cur, idx) => {
      if (idx < sectionIndex) {
        return acc + cur.slides.filter(s => !s.deleted).length;
      } else if (idx === sectionIndex) {
        return acc + cur.slides.filter(s => !s.deleted).slice(0, slideIndex).length;
      }
      return acc + 0;
    }, 1);

    return count;
  }

  getDisableDrag(slide) {
    const { activeSlide, sortingDisabled } = this.state;

    // Determine if dragging of a slide is disabled
    return sortingDisabled && !slide.blocks.length || activeSlide && (activeSlide.id === slide.id) || activeSlide && !activeSlide.blocks.length;
  }

  setBlocksToActiveSlide(blocks) {
    const { activeSlideEdit, activeSection } = this.state;

    // Get the first template that matches the blocks length
    // const template = this.props.templates.find(t => t.name !== 'cover' && t.blocks.length === blocks.length);

    // Set blocks to active slide's blocks
    const modifiedSlide = {
      ...activeSlideEdit,
      // template: template.name,
      blocks: [...blocks]
    };

    // Remove slides with the other blocks
    const otherBlocks = blocks.slice(1, blocks.length);
    otherBlocks.forEach(block => {
      const found = getSlideWithBlock(block, this.props.sections);
      if (found.slide) {
        // Set slide to deleted -- not blocks
        this.props.onSlideChange({
          ...found.slide,
          deleted: true
        }, found.section);
      }
    });

    this.props.onSlideChange(modifiedSlide, activeSection);

    this.setState({
      activeBlocks: [],
      activeSlide: modifiedSlide,
      activeSlideEdit: modifiedSlide,
      selectBlockMode: false,
    });
  }

  resetActiveSlide() {
    this.setState({
      activeSlides: [],
      activeBlocks: [],
      activeSlide: null,
      activeSlideEdit: null,
      activeSection: null,
      sortingDisabled: false,
    });
  }

  handleClickOutside() {
    if (!this.state.isDragging) {
      this.resetActiveSlide();
    }
  }

  handleSlideClick(event, slide, sectionIndex) {
    const { activeBlocks, activeSlides, activeSlide, selectBlockMode, selectPageMode, isDragging } = this.state;
    event.stopPropagation();

    // Determine if clicked and active slide are set as full page
    const fullPage = slide.fullPage || slide.showAsFullPage;
    const activeSlideFullPage = activeSlide && (activeSlide.fullPage || activeSlide.showAsFullPage);

    // Ignore click event if currently dragging
    // or if clicking on active slide
    // or if clicking a slide with an active block
    const clickingActiveSlide = activeSlide && (activeSlide.id === slide.id);
    const clickingActiveBlock = areCommonElements(slide.blocks.map(b => b.id), activeBlocks.map(b => b.id));
    const clickingFullPageSlide = fullPage || activeSlideFullPage;

    if (!isDragging && !clickingActiveSlide && !clickingActiveBlock) {
      // Another block has been selected
      // Cannot combine more than 3 blocks
      // cannot combine full page slides
      if (
        selectBlockMode &&
        !clickingFullPageSlide &&
        slide.blocks.length && (activeSlide && activeSlide.blocks.length) &&
        (slide.blocks.length + activeBlocks.length) <= this.SLIDE_BLOCK_LIMIT
      ) {
        // If activeBlocks is populated, merge with the clicked slide's blocks
        // If activeBlocks isn't populated, merge the activeSlide's blocks with the clicked slide's blocks
        const newBlocks = activeBlocks.length ? [...activeBlocks, ...slide.blocks] : [...activeSlide.blocks, ...slide.blocks];
        this.setState({
          activeBlocks: newBlocks,
          editingSection: null,
          sortingDisabled: true,
        });

      // selectPageMode(Multi select slide) is enabled
      } else if (selectPageMode && slide.blocks.length && (activeSlide && activeSlide.blocks.length)) {
        // If activeBlocks is populated, merge with the clicked slide's blocks
        // If activeBlocks isn't populated, merge the activeSlide's blocks with the clicked slide's blocks
        const newBlocks = activeBlocks.length ? [...activeBlocks, ...slide.blocks] : [...activeSlide.blocks, ...slide.blocks];
        const newSlides = (activeSlides && activeSlides.length) ? [...activeSlides, {
          ...slide,
          sectionId: this.props.sections[sectionIndex].id
        }] : [{
          ...slide,
          sectionId: this.props.sections[sectionIndex].id
        }];
        this.setState({
          activeSlides: newSlides,
          activeBlocks: newBlocks,
          activeSection: sectionIndex,
          editingSection: null,
          sortingDisabled: true,
        });
      // A regular slide is selected
      } else {
        this.setState({
          activeSlides: [{
            ...slide,
            sectionId: this.props.sections[sectionIndex].id
          }],
          activeBlocks: slide.blocks,
          activeSlide: slide,
          activeSlideEdit: slide,
          activeSection: sectionIndex,
          editingSection: null,
          sortingDisabled: true,
        });
      }

    // Toggle active slide
    } else if (clickingActiveSlide || clickingActiveBlock) {
      this.resetActiveSlide();
    }
  }

  handleSetSectionList(list) {
    const ids = list.map(item => item.id);
    this.props.onSectionListChange({
      sectionOrder: ids
    });
  }

  handleSectionSortStart() {
    this.setState({
      isDragging: true,
    });
  }

  handleSectionSortEnd() {
    this.setState({
      isDragging: false,
    });
  }

  handleSetList(list, sectionIndex) {
    this.props.onSectionChange({
      slides: list
    }, sectionIndex);
  }

  handleSlideSortStart() {
    this.setState({
      isDragging: true,
      editingSection: null
    });
  }

  handleSlideSortEnd() {
    // add delay to prevent click event triggering
    setTimeout(() => {
      this.setState({
        isDragging: false,
      });
    }, 100);
  }

  handleNewSection(event) {
    event.stopPropagation();
    if (this.state.selectPageMode) {
      const totalActiveSlides = this.props.sections.map(section => section.slides).flat().filter(slide => !slide.deleted).length;
      const totalSelectedSlides = this.state.activeSlides.length;
      if (totalActiveSlides === totalSelectedSlides) {
        this.props.onSelectAllAddSection(true, this.props.sections);
      } else {
        this.props.onSelectAllAddSection(false, this.state.activeSlides);
      }
    } else {
      this.props.onAddSection(this.state.activeSlide, this.state.activeSection);
    }
    this.resetActiveSlide();
  }

  handleEditSectionNameClick(index) {
    this.setState({
      editingSection: index
    });
  }

  handleSectionNameChange(event, index) {
    const value = event.currentTarget.value;
    this.props.onSectionChange({
      name: value
    }, index);
  }

  handleSectionKeyUp(event) {
    // Exit edit mode on press enter
    if (event.which === 13 || event.keyCode === 13) {
      this.setState({
        editingSection: null
      });
    }
  }

  handleEditSectionDoneClick() {
    this.setState({
      editingSection: null
    });
  }

  handleCollapseSectionClick(index) {
    const totalSections = this.props.sections.length;
    const totalCollapsed = this.props.sections.filter(s => s.collapsed).length;

    // Set collapse of all sections
    if (index === 'all') {
      const collapsed = totalCollapsed !== totalSections;
      this.props.sections.forEach((s, i) => {
        setTimeout(() => {
          this.props.onSectionChange({
            collapsed: collapsed
          }, i);
        }, 10);
      });

    // Toggle collapse of single section
    } else {
      this.props.onSectionChange({
        collapsed: !this.props.sections[index].collapsed
      }, index);
    }
  }

  handleClearCanvasClick() {
    this.setState({
      showClearDialog: true
    });
  }

  handleSelectPagesClick() {
    this.setState({
      selectPageMode: true
    });
  }

  handleSelectPagesDoneClick() {
    this.setState({
      selectPageMode: false
    });
  }

  handleSelectBlocksClick() {
    this.setState({
      selectBlockMode: true
    });
  }

  handleSelectBlocksCancelClick() {
    this.setState({
      selectBlockMode: false
    });
  }

  handleFilterChange(option) {
    this.setState({
      filterValue: option.value
    });
  }

  handleClearCancel() {
    this.setState({
      showClearDialog: false
    });
  }

  handleClearConfirm() {
    this.props.onClear();
    this.setState({
      activeBlocks: [],
      activeSection: null,
      activeSlide: null,
      showClearDialog: false,
    });
  }

  handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showDeleteDialog: true
    });
  }

  handleDeleteCancel() {
    this.setState({
      showDeleteDialog: false
    });
  }

  handleDeleteConfirm() {
    this.props.onSlideDelete(this.state.activeSlide);

    this.setState({
      activeBlocks: [],
      activeSlide: null,
      activeSection: null,
      showDeleteDialog: false
    });
  }

  handleDeletePagesClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.setState({
      showDeletePagesDialog: true
    });
  }

  handleDeletePagesCancel() {
    this.setState({
      showDeletePagesDialog: false
    });
  }

  handleDeletePagesConfirm() {
    this.props.onSlideDelete(this.state.activeSlides, true);

    this.setState({
      activeSlides: [],
      activeBlocks: [],
      activeSlide: null,
      activeSection: null,
      showDeletePagesDialog: false
    });
  }

  handleDeleteSectionClick(e, index) {
    e.stopPropagation();
    this.setState({
      showDeleteSectionDialog: true,
      sectionToDelete: index
    });
  }

  handleDeleteSectionCancel() {
    this.setState({
      showDeleteSectionDialog: false,
      sectionToDelete: null
    });
  }

  handleDeleteSectionConfirm() {
    this.props.onSectionDelete(this.state.sectionToDelete);

    // Deleting active section
    if (this.state.sectionToDelete === this.state.activeSection) {
      this.setState({
        activeBlocks: [],
        activeSlide: null,
        activeSection: null,
      });
    }

    this.setState({
      showDeleteSectionDialog: false,
      sectionToDelete: null,
    });
  }

  handleClearActiveBlocksClick() {
    if (this.state.selectPageMode) {
      this.setState({
        activeBlocks: [],
        activeSlides: []
      });
    } else {
      this.setState({
        activeBlocks: [],
      });
    }
  }

  handleCombineClick() {
    this.setBlocksToActiveSlide(this.state.activeBlocks);
  }

  handleSaveClick() {
    const { activeSlideEdit, activeSection } = this.state;

    this.props.onSlideChange(activeSlideEdit, activeSection);

    this.setState({
      activeBlocks: [],
      // activeSlide: modifiedSlide,
      // activeSlideEdit: modifiedSlide,
      selectBlockMode: false
    });
  }

  handleSeparateClick() {
    const { activeSlide, activeSection } = this.state;
    const defaultTemplate = 'one-col-title';

    // Active Slide index
    const activeSlideIndex = this.props.sections[activeSection].slides.findIndex(s => s.id === activeSlide.id);

    // Keep first block in active slide
    const modifiedSlide = {
      ...activeSlide,
      template: defaultTemplate,
      blocks: activeSlide.blocks.slice(0, 1)
    };

    // Remove all blocks except first from slide
    const otherBlocks = activeSlide.blocks.slice(1, activeSlide.blocks.length);

    // Create new slides
    const newSlides = otherBlocks.map(block => ({
      id: uniqueId('slide-'),
      template: defaultTemplate,
      blocks: [block]
    }));

    this.props.onSlideChange(modifiedSlide, activeSection);
    this.props.onAddSlides(newSlides, activeSlideIndex + 1, activeSection);

    this.setState({
      activeBlocks: [],
      activeSlide: modifiedSlide
    });
  }

  handleSlideChange(attr) {
    const { activeSlide, activeSection } = this.state;

    // merge changed props to activeSlide
    const newSlide = {
      ...activeSlide,
      ...attr
    };

    this.setState({
      activeSlide: newSlide
    });

    this.props.onSlideChange(newSlide, activeSection);
  }

  // Slide has changed but not saved
  // when editing Slide layout/title in block select mode
  handleSlideLayoutChange(attr) {
    const { activeSlideEdit } = this.state;

    // merge changed props to activeSlide
    const newSlide = {
      ...activeSlideEdit,
      ...attr
    };

    this.setState({
      activeSlideEdit: newSlide
    });
  }

  handleActiveSlideContainerClick(event) {
    // prevent slide de-selection
    event.stopPropagation();
  }

  handleSelectAllSlides(event) {
    event.stopPropagation();
    const allSlides = [];
    this.props.sections.map(section => section.slides).forEach(section => {
      allSlides.push(section.map((slide, ind) => ({
        ...slide,
        section: ind
      })));
    });

    this.setState({
      activeSlides: [...allSlides.flat()],
      activeBlocks: allSlides.flat().map(slide => slide.blocks[0]),
      activeSlide: allSlides[0][0],
      activeSlideEdit: allSlides[0][0],
      editingSection: null,
      sortingDisabled: true
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { isPitchBuilderEnabled, loading, sections, templates, showSideBarSettings } = this.props;
    const {
      activeSlide,
      activeSlideEdit,
      activeBlocks,
      editingSection,
      isDragging,
      selectBlockMode,
      selectPageMode,
      activeSlides
    } = this.state;

    let styles = require('./CanvasEditor.less');
    if (isPitchBuilderEnabled) {
      styles = require('./PitchBuilderEditor.less');
    }
    const cx = classNames.bind(styles);
    const classes = cx({
      CanvasEditor: true,
      isDragging: isDragging,
    }, this.props.className);

    const slidesWrapper = cx({
      slidesWrapper: true,
      rightPadding: !showSideBarSettings,
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, { pageCount: activeSlides && activeSlides.length });

    // A slide is active
    const slideIsActive = !!activeSlide;

    // Canvas is empty is there are no sections or no slides or all slides are deleted
    const isEmpty = !sections.length || sections.every(s => !s.slides.length) || sections.every(s => s.slides.every(sl => sl.deleted));

    // All sections are collapsed
    const allSectionsCollapsed = sections.filter(s => s.collapsed).length === sections.length;

    // Filter options
    const filterOptions = [
      { value: 'everything', label: strings.everything },
      { value: 'slides', label: strings.slides },
      { value: 'images', label: strings.images },
      { value: 'text', label: strings.text },
      // { value: 'video', label: strings.video },
    ];

    // Filter templates based on number of active blocks
    const validTemplates = templates.filter(t => {
      // Filter out master from templates
      if (t.name === 'cover') {
        return false;

      // Only show templates with same number of blocks
      } else if (slideIsActive) {
        return t.blocks.length === activeBlocks.length;
      }
      return true;
    });

    // Show 'Combine' if blocks are to be merged
    let showCombine = false;
    if (selectBlockMode && activeSlide) {
      showCombine = activeSlide.blocks.length < activeBlocks.length;
    }

    // Show 'Save' if only template or title is being changed
    // and 'Combine' is not visible
    let showSave = false;
    if (selectBlockMode && activeSlide && activeSlideEdit && !showCombine) {
      if (activeSlideEdit.title !== activeSlide.title || activeSlideEdit.template !== activeSlide.template) {
        showSave = true;
      }
    }

    return (
      <div className={classes} style={this.props.style}>
        <header>
          <div className={styles.stepDescription}>
            <h2>{strings.organise}</h2>
            <p>{strings.organiseAndStyleYourSlides}</p>
          </div>

          <Btn
            inverted
            disabled={isEmpty}
            onClick={this.props.onSave}
            className={styles.saveBtn}
          >
            {isPitchBuilderEnabled ? strings.save : strings.export}
            <Icon name="triangle" />
          </Btn>
        </header>

        <div className={styles.editorWrapper}>
          <div className={slidesWrapper}>
            {!(selectBlockMode || selectPageMode) && <header>
              <div className={styles.sectionControls}>
                <Btn
                  onClick={this.props.onAddFile}
                >
                  {strings.addFile}
                </Btn>
                <Btn
                  disabled={isEmpty}
                  onClick={this.handleNewSection}
                >
                  {strings.newSection}
                </Btn>
                <Btn
                  disabled={isEmpty}
                  onClick={() => this.handleCollapseSectionClick('all')}
                >
                  {allSectionsCollapsed ? strings.expandAllSections : strings.collapseAllSections}
                </Btn>
                <Btn
                  disabled={isEmpty}
                  onClick={this.handleSelectPagesClick}
                >
                  {strings.select}
                </Btn>
                <Select
                  id="filter"
                  name="filter"
                  label={`${strings.show}:`}
                  value={this.state.filterValue}
                  options={filterOptions}
                  disabled={isEmpty}
                  searchable={false}
                  clearable={false}
                  onChange={this.handleFilterChange}
                  className={styles.filter}
                />
              </div>

              <div>
                {/* Disabling for now {!showSideBarSettings && <Btn
                  remove
                  inverted
                  disabled={!(activeSlide && activeSlide.id)}
                  onClick={this.handleDeleteClick}
                >
                  {strings.deleteSelected}
                </Btn>} */}
                {!isPitchBuilderEnabled && <Btn
                  disabled={isEmpty}
                  onClick={this.handleSelectBlocksClick}
                >
                  {strings.selectBlocks}
                </Btn>}
                <Btn
                  disabled={isEmpty}
                  remove
                  inverted
                  onClick={this.handleClearCanvasClick}
                >
                  {isPitchBuilderEnabled ? strings.deletePitch : strings.clearCanvas}
                </Btn>
              </div>
            </header>}

            {/* Select Pages actions */}
            {selectPageMode && <header>
              <div>
                <Btn
                  alt
                  onClick={this.handleSelectPagesDoneClick}
                >
                  {strings.done}
                </Btn>
                <Btn
                  alt
                  secondary
                  disabled={!activeBlocks.length}
                  onClick={this.handleNewSection}
                >
                  {strings.newSection}
                </Btn>
                <Btn
                  remove
                  inverted
                  disabled={!activeBlocks.length}
                  onClick={this.handleDeletePagesClick}
                >
                  {strings.deletePages}
                </Btn>
              </div>
              <div>
                <Btn
                  borderless
                  onClick={this.handleSelectAllSlides}
                >
                  {strings.selectAll}
                </Btn>
                <Btn
                  alt
                  borderless
                  disabled={!activeBlocks.length}
                  onClick={this.handleClearActiveBlocksClick}
                >
                  {strings.clearSelection}
                </Btn>
              </div>
            </header>}


            {/* Select Block actions */}
            {selectBlockMode && <header>
              <div>
                <Btn
                  borderless
                  inverted
                  warning
                  disabled={!activeBlocks.length}
                  onClick={this.handleClearActiveBlocksClick}
                >
                  {strings.clearSelection}
                </Btn>
              </div>

              <div>
                {showSave && <Btn
                  inverted
                  disabled={!showSave}
                  onClick={this.handleSaveClick}
                >
                  {strings.save}
                </Btn>}
                {!showSave && <Btn
                  inverted
                  disabled={!showCombine}
                  onClick={this.handleCombineClick}
                >
                  {strings.combine}
                </Btn>}
                <Btn
                  onClick={this.handleSelectBlocksCancelClick}
                >
                  {strings.cancel}
                </Btn>
              </div>
            </header>}

            {isEmpty && <Blankslate
              icon={<SVGIcon type="sharedFile" />}
              heading={isPitchBuilderEnabled ? strings.emptyPBTitle : strings.emptyCanvasTitle}
              message={isPitchBuilderEnabled ? strings.emptyPBMessage : strings.emptyCanvasMessage}
              middle
              className={styles.blankslate}
            />}

            {!isEmpty && <ReactSortable
              tag="div"
              group="sections"
              animation={150}
              delay={15}
              filter={`.${styles.disableDrag}`}
              handle=".icon-align-jusify"
              list={sections}
              setList={(newList) => this.handleSetSectionList(newList)}  // eslint-disable-line
              onStart={this.handleSectionSortStart}
              onEnd={this.handleSectionSortEnd}
              className={styles.sectionWrapper}

              forceFallback
              fallbackClass={styles.sectionFallback}
              dragClass={styles.sectionDrag}
            >
              {sections.map((section, sectionIndex) => (
                <section
                  key={`section-${sectionIndex}`}
                  className={section.collapsed ? styles.isCollapsed + ' section' : 'section'}
                >
                  <header>
                    {(editingSection !== sectionIndex) && <h3>
                      <Icon name="align-jusify" className={styles.sectionHeaderIcon} />
                      {!section.name && <FormattedMessage
                        id="section-n"
                        defaultMessage="Section {n}"
                        values={{ n: sectionIndex + 1 }}
                      />}
                      <span>{section.name}</span>
                      <Btn
                        icon="edit"
                        borderless
                        onClick={() => this.handleEditSectionNameClick(sectionIndex)}
                        className={styles.editBtn}
                      />
                      <Btn
                        icon="trash"
                        borderless
                        warning
                        inverted
                        onClick={(e) => this.handleDeleteSectionClick(e, sectionIndex)}
                        className={styles.deleteBtn}
                      />
                    </h3>}
                    {editingSection === sectionIndex && <div className={styles.editNameWrapper}>
                      <Text
                        id={`name-${sectionIndex}`}
                        autosize
                        autoFocus
                        placeholder={strings.sectionName}
                        value={section.name}
                        maxLength={60}
                        onChange={(e) => this.handleSectionNameChange(e, sectionIndex)}
                        onKeyUp={this.handleSectionKeyUp}
                      />
                      <Btn
                        onClick={() => this.handleEditSectionDoneClick(sectionIndex)}
                      >
                        {strings.done}
                      </Btn>
                    </div>}

                    <Btn
                      icon="triangle"
                      borderless
                      onClick={() => this.handleCollapseSectionClick(sectionIndex)}
                      className={styles.collapseBtn}
                    />
                  </header>

                  <ReactSortable
                    ref={node => {
                      if (node) {
                        this.sortable[sectionIndex] = node.sortable;
                      }
                    }}
                    tag="ol"
                    group="slides"
                    animation={150}
                    delay={15}
                    filter={`.${styles.disableDrag}`}
                    forceFallback
                    fallbackClass={styles.sortableFallback}
                    ghostClass={styles.sortableGhost}
                    chosenClass={styles.sortableChosen}
                    dragClass={styles.sortableDrag}
                    list={section.slides}
                    setList={(list) => this.handleSetList(list, sectionIndex)}  // eslint-disable-line
                    onStart={(e) => this.handleSlideSortStart(e, sectionIndex)}
                    onEnd={this.handleSlideSortEnd}
                    className={styles.slideList}
                  >
                    {section.slides.filter(s => !s.deleted).map((slide, slideIndex) => (
                      <CanvasSlideThumb
                        key={slide.id}
                        tagName="li"
                        count={this.getSlideCount(sections, sectionIndex, slideIndex)}
                        active={activeSlide && (activeSlide.id === slide.id) || areCommonElements(slide.blocks.map(b => b.id), activeBlocks.map(b => b.id))}
                        disabled={selectBlockMode && (!slide.blocks.length || slide.fullPage || slide.showAsFullPage)}
                        showActions={!isPitchBuilderEnabled}
                        strings={strings}
                        onDeleteClick={this.handleDeleteClick}
                        onSeparateClick={this.handleSeparateClick}
                        onChange={this.handleSlideChange}
                        onClick={(e) => this.handleSlideClick(e, slide, sectionIndex, this.getSlideCount(sections, sectionIndex, slideIndex))}
                        className={this.getDisableDrag(slide) ? styles.disableDrag : undefined}
                        {...slide}
                      />
                    ))}
                  </ReactSortable>
                </section>
              ))}
            </ReactSortable>}

            {loading && <div className={styles.loading}>
              <Loader type="content" />
            </div>}
          </div>

          {showSideBarSettings && <div
            onClick={this.handleActiveSlideContainerClick}
            className={styles.activeSlideContainer}
          >
            {!isEmpty && <CanvasSlideLayout
              {...activeSlideEdit}
              validTemplates={validTemplates}
              activeBlocks={activeBlocks}
              selectBlockMode={selectBlockMode}
              strings={strings}
              onChange={this.handleSlideLayoutChange}
            />}
          </div>}
        </div>

        <Dialog
          title={isPitchBuilderEnabled ? strings.clearDialogTitleForPitchBuilder : strings.clearDialogTitle}
          message={isPitchBuilderEnabled ? strings.clearDialogMessageForPitchBuilder : strings.clearDialogMessage}
          isVisible={this.state.showClearDialog}
          cancelText={strings.cancel}
          confirmText={isPitchBuilderEnabled ? strings.delete : strings.clear}
          onCancel={(this.handleClearCancel)}
          onConfirm={this.handleClearConfirm}
          className={isPitchBuilderEnabled ? styles.dialogForPitch : null}
        />

        <Dialog
          title={isPitchBuilderEnabled ? strings.deletePageDialogTitle : strings.deleteSlideDialogTitle}
          message={isPitchBuilderEnabled ? strings.deletePageDialogMessage : strings.deleteSlideDialogMessage}
          isVisible={this.state.showDeleteDialog}
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={(this.handleDeleteCancel)}
          onConfirm={this.handleDeleteConfirm}
          className={isPitchBuilderEnabled ? styles.dialogForPitch : null}
        />

        <Dialog
          title={strings.deleteSectionDialogTitle}
          message={isPitchBuilderEnabled ? strings.deleteSectionDialogMessageForPitchBuilder : strings.deleteSectionDialogMessage}
          isVisible={this.state.showDeleteSectionDialog}
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={(this.handleDeleteSectionCancel)}
          onConfirm={this.handleDeleteSectionConfirm}
          className={isPitchBuilderEnabled ? styles.dialogForPitch : null}
        />

        <Dialog
          title={strings.deletePagesDialogTitle}
          message={strings.deletePagesDialogMessage}
          isVisible={this.state.showDeletePagesDialog}
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={(this.handleDeletePagesCancel)}
          onConfirm={this.handleDeletePagesConfirm}
          className={styles.dialogForPitch}
        />
      </div>
    );
  }
}
