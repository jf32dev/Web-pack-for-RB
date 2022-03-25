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
 * @package hub-web-app-v5
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { uniqBy, difference, uniqueId } from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  addSection,
  editSection,
  editSectionOrder,
  addSlides,
  editSlide,
  deleteSlide,
  setNewIndicator,
  getTemplates,
  getThumbnails,
  generateThumbnails,
  saveActivity,
  clear,
} from 'redux/modules/canvas/canvas';
import { processSectionsToPitchbuilder, createPageJsonForPitch } from 'redux/modules/canvas/helpers';

import { loadChannels } from 'redux/modules/browser';
import { createPrompt } from 'redux/modules/prompts';
import { save, close } from 'redux/modules/story/story';
import { loadFile, removeFiles } from 'redux/modules/viewer';

import AppHeader from 'components/AppHeader/AppHeader';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import CanvasEditor from 'components/CanvasEditor/CanvasEditor';
import Dialog from 'components/Dialog/Dialog';
import FilePickerModal from 'components/FilePickerModal/FilePickerModal';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

const messages = defineMessages({
  canvas: { id: 'canvas', defaultMessage: 'Canvas' },
  pitchBuilder: { id: 'pitch-builder', defaultMessage: 'Pitch Builder' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  select: { id: 'select', defaultMessage: 'Select' },
  close: { id: 'close', defaultMessage: 'Close' },
  export: { id: 'export', defaultMessage: 'Export' },
  save: { id: 'save', defaultMessage: 'Save' },
  exportError: { id: 'export-error', defaultMessage: 'Export Error' },
  saveError: { id: 'save-error', defaultMessage: 'Save Error' },
  presentationName: { id: 'presentation-name', defaultMessage: 'Presentation Name' },
  savePresentation: { id: 'save-presentation', defaultMessage: 'Save Presentation' },
  exportPresentation: { id: 'export-presentation', defaultMessage: 'Export Presentation' },
  presentationExported: { id: 'presentation-exported', defaultMessage: 'Presentation Exported' },
  presentationSavedMessage: { id: 'presentation-saved-message', defaultMessage: 'Your presentation is now processing and will be available shortly. Click here to view.' },
  noBlocksErrorTitle: { id: 'no-blocks-error-title', defaultMessage: 'Not able to add file at this time.' },
  pleaseTryAgainLater: { id: 'please-try-again-later', defaultMessage: 'Please try again later.' },
});

const VALID_TEMPLATES = [
  {
    id: 'cover',
    name: 'cover',
    template_id: 1,
    title: 24,
    blocks: [25],
    date: 26,
    footer: 3,
  },

  // one block
  {
    id: 'one-col',
    name: 'one-col',
    template_id: 2,
    blocks: [8],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 'one-col-title',
    name: 'one-col-title',
    template_id: 2,
    title: 7,
    blocks: [8],
    count: 13,
    footer: 12,
    date: 11,
  },

  // two blocks
  {
    id: 'two-col',
    name: 'two-col',
    template_id: 4,
    blocks: [8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 'two-col-title',
    name: 'two-col-title',
    template_id: 3,
    title: 7,
    blocks: [8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },

  // three blocks
  {
    id: 'three-col',
    name: 'three-col',
    template_id: 5,
    blocks: [9, 8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 'three-col-title',
    name: 'three-col-title',
    template_id: 6,
    title: 7,
    blocks: [9, 8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
  {
    id: 'three-row',
    name: 'three-row',
    template_id: 7,
    blocks: [7, 8, 3],
    count: 13,
    footer: 12,
    date: 11,
  },
];

function mapStateToProps(state) {
  const { browser, canvas, entities, settings, story, viewer } = state;
  const {
    order,
    templates,
    sectionsById,
    slidesById,
    blocksById,
    queuedThumbnails
  } = canvas;
  const { channelsById } = browser;
  const { storyDefaults, userCapabilities } = settings;
  const { permId, saving, saved, saveError } = story;
  const loadingFile = viewer.loading;

  let sections = order.map((sectionId) => {
    return {
      ...sectionsById[sectionId],
      slides: sectionsById[sectionId].slides.map((slideId) => {
        return {
          ...slidesById[slideId],
          blocks: slidesById[slideId].blocks.map(blockId => blocksById[blockId]),
        };
      })
    };
  });

  // Filter deleted sections
  sections = sections.filter(s => !s.deleted);

  const thumbsToRequest = [];
  Object.keys(queuedThumbnails).forEach((fileId) => {
    if (queuedThumbnails[fileId]) {
      thumbsToRequest.push({
        fileId: fileId,
        locations: queuedThumbnails[fileId]
      });
    }
  });

  // Personal Channel ID
  const personalChannelId = Object.keys(channelsById)[0];

  return {
    templates,
    sections,
    thumbsToRequest,
    storyDefaults,
    personalChannelId,
    saving,
    saved,
    saveError,
    storyId: permId,
    userCapabilities: userCapabilities,
    filesById: entities.files,
    loadingFile,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addSection,
    editSection,
    editSectionOrder,
    addSlides,
    editSlide,
    deleteSlide,
    getTemplates,
    getThumbnails,
    generateThumbnails,
    saveActivity,
    setNewIndicator,
    clear,
    loadChannels,
    createPrompt,
    save,
    close,
    loadFile,
    removeFiles
  })
)
export default class Canvas extends Component {
  static propTypes = {
    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      filePickerModalVisible: false,
      noBlocksDialogVisible: false,
      saveModalVisible: false,
      presentationName: '',
      personalChannelId: props.personalChannelId,
    };
    autobind(this);

    this.thumbTimer = null;
  }

  UNSAFE_componentWillMount() {
    if (!this.props.userCapabilities.hasPitchBuilderWeb && !this.props.templates.length) {
      this.props.getTemplates();
    }

    if (this.props.thumbsToRequest.length) {
      this.requestThumbnails(this.props.thumbsToRequest);
    }

    if (!this.props.personalChannelId) {
      this.props.loadChannels('personal');
    }
  }

  componentDidMount() {
    this.props.setNewIndicator(false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { saveError } = nextProps;

    if (nextProps.thumbsToRequest.length && !this.props.thumbsToRequest.length) {
      this.requestThumbnails(nextProps.thumbsToRequest);
    }

    if (nextProps.saved && !this.props.saved) {
      this.handleSaveClose();
      this.createSavedPrompt(nextProps.storyId);
    }

    if (saveError && saveError.message && saveError.message !== this.props.saveError.message) {
      this.createSaveErrorPrompt(saveError);
    }

    if (!this.state.personalChannelId && nextProps.personalChannelId) {
      this.setState({
        personalChannelId: nextProps.personalChannelId
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.thumbTimer);
  }

  addFileToCanvas(file) {
    const { userCapabilities } = this.props;
    const blocksAttr = 'blocks';

    // PDFs are handled as a full page
    // and cannot be combined with other blocks
    const fullPage = file.category === 'pdf' || userCapabilities.hasPageSearch;

    // Unique blocks by page if adding full pages
    const matchedBlocks = fullPage ? uniqBy(file[blocksAttr], 'page') : file[blocksAttr];

    // Sort blocks by page
    matchedBlocks.sort((a, b) => a.page - b.page);

    const slides = [];
    const blocks = [];

    // Create slides from blocks
    matchedBlocks.forEach(block => {
      slides.push({
        title: '',
        fullPage: fullPage,
        template: fullPage ? 'one-col' : 'one-col-title',
        blocks: [{
          ...block,
          type: 'image',
          file: file,
          searchPhrase: ''
        }]
      });
      blocks.push(block);
    });

    this.props.addSlides(slides, 0, null, file.description);
    this.props.generateThumbnails(file.id, blocks);
    this.props.setNewIndicator(true);

    // Save activity
    const data = {
      fileId: file.id,
      locations: blocks.map(b => b.location),
      searchPhrase: '',
      page: null,
      type: fullPage ? 'page' : 'block',
      action: 'add'
    };
    this.props.saveActivity(data);
  }

  requestThumbnails(thumbsToRequest) {
    if (thumbsToRequest.length) {
      thumbsToRequest.forEach((item) => {
        this.props.getThumbnails(item.fileId, item.locations);
      });

      // check again in 3 seconds
      this.thumbTimer = setTimeout(() => {
        this.requestThumbnails(this.props.thumbsToRequest);
      }, 3000);
    }
  }

  createSavedPrompt(storyId) {
    const { userCapabilities  } = this.props;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    this.props.createPrompt({
      id: uniqueId('canvas-'),
      type: 'success',
      title: userCapabilities.hasPageSearch ? strings.savePresentation : strings.exportPresentation,
      message: strings.presentationSavedMessage,
      link: `/story/${storyId}`,
      dismissible: true,
      autoDismiss: 15
    });

    // clear story
    this.props.close();
  }

  createSaveErrorPrompt(saveError) {
    const { userCapabilities  } = this.props;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    let title = userCapabilities.hasPageSearch ? strings.saveError : strings.exportError;
    let message = saveError.message;

    if (saveError.statusCode) {
      title = `(${saveError.statusCode}) ${title}`;
    }
    if (saveError.original) {
      message += ': ' + saveError.original;
    }

    this.props.createPrompt({
      id: uniqueId('canvas-'),
      type: 'error',
      title: title,
      message: message,
      dismissible: true,
      autoDismiss: 5
    });

    // clear story
    this.props.close();
  }

  saveDeleteActivity(slide) {
    slide.blocks.forEach(b => {
      const file = b.file || slide.slide.file;
      const data = {
        fileId: file.id,
        locations: [b.location],
        searchPhrase: b.searchPhrase || slide.searchPhrase,
        page: b.page,
        type: slide.fullPage ? 'page' : 'block',
        action: 'delete'
      };
      this.props.saveActivity(data);
    });
  }

  handleSectionListChange(context) {
    // We are only interested in section order
    this.props.editSectionOrder(context && context.sectionOrder);
  }

  handleSectionChange(section, sectionIndex) {
    // We are only interested in slide order
    // If changing a slide use props.editSlide
    const sectionProps = {
      ...section
    };
    if (section.slides) {
      sectionProps.slides = sectionProps.slides.map(slide => slide.id);
    }

    // Get section ID by it's index
    const sectionId = this.props.sections[sectionIndex].id;

    this.props.editSection(sectionId, sectionProps);
  }

  handleSectionDelete(sectionIndex) {
    // Get section ID by it's index
    const sectionId = this.props.sections[sectionIndex].id;
    const sectionSlides = this.props.sections[sectionIndex].slides;

    // Set section as deleted
    this.props.editSection(sectionId, {
      deleted: true
    });

    // Delete all slides in section
    sectionSlides.forEach(slide => {
      this.props.deleteSlide(slide.id);
      this.saveDeleteActivity(slide);
    });
  }

  handleSlideChange(slide) {
    const fixedSlide = {
      ...slide,
      blocks: slide.blocks.map(b => b.id)
    };

    this.props.editSlide(slide.id, fixedSlide);
  }

  handleSlideDelete(slide, isMultiPages) {
    if (isMultiPages) {
      // Delete all selected slides
      slide.forEach(sld => {
        this.props.deleteSlide(sld.id);
        this.saveDeleteActivity(sld);
      });
    } else {
      this.props.deleteSlide(slide.id);
      this.saveDeleteActivity(slide);
    }
  }

  handleAddSlides(slides, slideIndex = 0, sectionIndex) {
    const sectionId = this.props.sections[sectionIndex].id;
    this.props.addSlides(slides, slideIndex, sectionId);
  }

  handleNewSection(slide, sectionIndex) {
    const slides = (slide && slide.id) ? [slide.id] : [];

    // Add slide to new section after current section
    this.props.addSection({
      name: '',
      slides: slides
    });

    // Remove slide from old section
    if (slide && slide.id) {
      const sectionId = this.props.sections[sectionIndex].id;
      const slideIndex = this.props.sections[sectionIndex].slides.findIndex(s => s.id === slide.id);
      const newSlides = this.props.sections[sectionIndex].slides.map(s => s.id);
      newSlides.splice(slideIndex, 1);

      this.props.editSection(sectionId, {
        slides: newSlides
      });
    }
  }

  handleSelectAllNewSection(allSlidesSelected, slidesOrSection) {
    if (allSlidesSelected) {
    // Add slides to new section after current section
      const allSlides = slidesOrSection.map(section => section.slides).flat();

      this.props.addSection({
        name: '',
        slides: allSlides
      });

      // Remove slide from old section
      slidesOrSection.forEach(section => {
        this.props.editSection(section.id, {
          slides: []
        });
      });
    } else {
      // Add slide to new section after current section
      this.props.addSection({
        name: '',
        slides: slidesOrSection.map(slide => {
          const {
            sectionId,
            ...rest
          } = slide;
          return rest;
        })
      });

      // Remove slide from old section
      const groupBySectionId = slidesOrSection.reduce(
        (result, item) => ({
          ...result,
          [item.sectionId]: [
            ...(result[item.sectionId] || []),
            item,
          ],
        }),
        {},
      );

      Object.keys(groupBySectionId).forEach(sectionId => {
        const sectionSlidesId = this.props.sections.find(section => section.id === sectionId).slides.map(s => s.id);
        const selectedSlidesIdFromSection = groupBySectionId[sectionId].map(s => s.id);
        const remainingSlidesId = difference(sectionSlidesId, selectedSlidesIdFromSection);
        this.props.editSection(sectionId, {
          slides: remainingSlidesId
        });
      });
    }
  }

  handleClear() {
    this.props.sections.forEach(section => {
      section.slides.forEach(slide => {
        this.saveDeleteActivity(slide);
      });
    });
    this.props.clear();
  }

  handleSave() {
    this.setState({
      saveModalVisible: true
    });
  }

  handleSaveClose() {
    this.setState({
      saveModalVisible: false
    });
  }

  handleSaveConfirm() {
    const { sections, templates, storyDefaults, userCapabilities  } = this.props;
    const { presentationName, personalChannelId } = this.state;

    const pitchBuilderJSON = {
      pitchbuilder: userCapabilities.hasPitchBuilderWeb ? createPageJsonForPitch(presentationName, sections) : processSectionsToPitchbuilder(presentationName, sections, templates[0].template_id, VALID_TEMPLATES)
    };

    const storyJSON = {
      ...storyDefaults,
      id: 'new',
      name: presentationName,
      channels: [
        {
          id: personalChannelId,
          alias: false
        }
      ],
      pitchbuilder_json: JSON.stringify(pitchBuilderJSON)
    };

    this.props.save(storyJSON);
  }

  handlePresentationNameChange(event) {
    this.setState({
      presentationName: event.currentTarget.value
    });
  }

  handleBreadcrumbClick(event) {
    event.preventDefault();
  }

  handleAddFile() {
    this.setState({
      filePickerModalVisible: true,
    });
  }

  handleFilePickerCancel() {
    this.setState({
      filePickerModalVisible: false,
    });
  }

  handleFilePickerSave(event, selectedFiles) {
    const file = selectedFiles[0];

    // Try loading file blocks if they don't exist on file (via search results)
    if (file && (!file.blocks || !file.blocks.length)) {
      this.props.loadFile(file.id, false).then(() => {
        this.props.removeFiles(); // Remove files loaded in viewer state to prevent opening of that file when other file/s are opened from story

        const pendingFile = this.props.filesById[file.id];

        // No blocks -- display message
        if (!pendingFile || (pendingFile && !pendingFile.blocks.length)) {
          this.setState({
            noBlocksDialogVisible: true
          });

        // Has blocks -- add to Canvas
        } else if (pendingFile && pendingFile.blocks.length) {
          this.addFileToCanvas(pendingFile);
        }
      });
    }

    this.setState({
      filePickerModalVisible: false,
    });
  }

  handleNoBlocksClose() {
    this.setState({
      noBlocksDialogVisible: false,
    });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { sections, saving, userCapabilities } = this.props;
    const { saveModalVisible, presentationName, personalChannelId } = this.state;

    const styles = require('./Canvas.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.Canvas}>
        <Helmet>
          <title>{userCapabilities.hasPageSearch ? strings.pitchBuilder : strings.canvas}</title>
        </Helmet>

        <AppHeader>
          <h3>{userCapabilities.hasPageSearch ? strings.pitchBuilder : strings.canvas}</h3>
        </AppHeader>

        <div className={styles.container}>
          <CanvasEditor
            sections={sections}
            showSideBarSettings={!userCapabilities.hasPageSearch}
            isPitchBuilderEnabled={userCapabilities.hasPageSearch}
            templates={VALID_TEMPLATES}
            loading={this.props.loadingFile}
            onSectionListChange={this.handleSectionListChange}
            onSectionChange={this.handleSectionChange}
            onSectionDelete={this.handleSectionDelete}
            onSlideChange={this.handleSlideChange}
            onSlideDelete={this.handleSlideDelete}
            onAddSlides={this.handleAddSlides}
            onAddSection={this.handleNewSection}
            onSelectAllAddSection={this.handleSelectAllNewSection}
            onAddFile={this.handleAddFile}
            onClear={this.handleClear}
            onSave={this.handleSave}
          />
        </div>

        {/* File Picker Modal */}
        {this.state.filePickerModalVisible && <FilePickerModal
          confirmButtonText={strings.select}
          ignoreCategories={[
            'app',
            'audio',
            'btc',
            'cad',
            'csv',
            'earthviewer',
            'ebook',
            'epub',
            'excel',
            'folder',
            'form',
            'ibooks',
            'image',
            'keynote',
            'learning',
            'none',
            'numbers',
            'oomph',
            'pages',
            // 'pdf',
            'potx',
            // 'powerpoint',
            'project',
            'prov',
            'rtf',
            'rtfd',
            'scrollmotion',
            'stack',
            'twixl',
            'txt',
            '3d-model',
            'vcard',
            // 'video',
            'visio',
            'web',
            'word',
            'zip'
          ]}
          isVisible
          canShare
          onClose={this.handleFilePickerCancel}
          onSave={this.handleFilePickerSave}
        />}

        <Dialog
          title={strings.noBlocksErrorTitle}
          isVisible={this.state.noBlocksDialogVisible}
          confirmText={strings.close}
          onConfirm={this.handleNoBlocksClose}
        >
          <p className={styles.dialogMessage}>
            {strings.pleaseTryAgainLater}
          </p>
        </Dialog>

        <Modal
          isVisible={saveModalVisible}
          width="medium"
          backdropClosesModal
          escClosesModal
          headerChildren={<h3>{userCapabilities.hasPageSearch ? strings.savePresentation : strings.exportPresentation}</h3>}
          footerChildren={(<div>
            <Btn
              alt
              large
              disabled={saving}
              onClick={this.handleSaveClose}
            >
              {strings.cancel}
            </Btn>
            <Btn
              inverted
              large
              disabled={!presentationName || saving || !personalChannelId}
              loading={saving}
              onClick={this.handleSaveConfirm}
            >
              {userCapabilities.hasPageSearch ? strings.save : strings.export}
            </Btn>
          </div>)}
          onClose={this.handleSaveClose}
        >
          <div style={{ padding: '1rem 1.5rem' }}>
            <Text
              id="presentation-name"
              autoFocus
              label={strings.presentationName}
              value={presentationName}
              maxLength={255}
              onChange={this.handlePresentationNameChange}
            />

            <div className={styles.saveLocation}>
              <h4>Save Location</h4>
              <Breadcrumbs
                paths={[
                  {
                    name: 'Content',
                    path: '/content'
                  }, {
                    name: 'Personal Content',
                    path: '/content/personal'
                  }, {
                    name: 'My Channel',
                    path: '/content/personal/channel/1'
                  }
                ]}
                className={styles.breadcrumbs}
                onPathClick={this.handleBreadcrumbClick}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
