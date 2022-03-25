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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  loadNote,
  addNote,
  deleteNotes,
  uploadFiles,
  close,
  logCRM,
} from 'redux/modules/note';
import { createPrompt } from 'redux/modules/prompts';
import {
  setData as setShareData
} from 'redux/modules/share';

import { replaceHtmlPaths, uniqueId } from 'components/FabricEditor/fabricEditorUtil';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';
import DropMenu from 'components/DropMenu/DropMenu';
import FabricEditor from 'components/FabricEditor/FabricEditor';
import FabricHeader from 'components/FabricEditor/Header/FabricHeader';
import Loader from 'components/Loader/Loader';
import LogNoteModal from 'components/NoteEdit/LogNoteModal';
import Modal from 'components/Modal/Modal';
import RecordAudio from 'components/RecordAudio/RecordAudio';
import RecordAudioDropMenu from 'components/RecordAudio/DropMenu';
import StoryPickerModal from 'components/StoryPickerModal/StoryPickerModal';
import StoryThumb from 'components/StoryThumb/StoryThumb';
import Text from 'components/Text/Text';

const StoryItem = (props) => {
  const { story, authString, onClose, styles, label } = props;
  // const thumbnail = _get(story, 'thumbnail', ''); test 2
  const showThumb = !_isEmpty(story);
  const style = {
    width: 32,
    height: 32,
  };

  return (
    <div className={styles.storyComponent}>
      <span className={styles.storyLabel}>{label}:</span>
      <div className={styles.storyItem}>
        <div className={styles.storyDetail}>
          <div className={styles.storyThumb}>
            {!_isEmpty(story) &&
            <StoryThumb {...story} style={style} thumbSize="small" showThumb={showThumb} authString={authString} />}
          </div>
          <div className={styles.storyContent}>
            <div className={styles.storyTitle}>{_get(story, 'name', '')}</div>
            <div className={styles.storySubTitle}>{_get(story, 'author.role', '')}</div>
          </div>
        </div>
        <div className={styles.storyClose} onClick={onClose} />
      </div>
    </div>
  );
};

const messages = defineMessages({
  delete: { id: 'delete', defaultMessage: 'Delete' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel1' },
  close: { id: 'close', defaultMessage: 'Close' },
  attach: { id: 'attach', defaultMessage: 'Attach' },
  reset: { id: 'reset', defaultMessage: 'Reset' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
  error: { id: 'error', defaultMessage: 'Error' },
  font: { id: 'font', defaultMessage: 'Font' },
  size: { id: 'size', defaultMessage: 'Size' },

  logToCRM: { id: 'log-to-crm', defaultMessage: 'Log to {crm}' },
  linkedTo: { id: 'linked-to', defaultMessage: 'Linked To' },
  recordAudio: { id: 'record-audio', defaultMessage: 'Record Audio' },

  deleteNote: { id: 'delete-note', defaultMessage: 'Delete Note' },
  deleteNoteMessage: { id: 'delete-note-message', defaultMessage: 'Are you sure you want to delete this note?' },

  createNote: { id: 'create-new-note', defaultMessage: 'Create New Note' },
  emptyNoteMessage: { id: 'empty-note-message', defaultMessage: 'Please input the title and content' },

  unsavedChangesMessage: { id: 'unsaved-changes-message', defaultMessage: 'You have unsaved content, are you sure you want to leave?' }
});

const styles = require('./NoteEdit.less');

function mapStateToProps(state) {
  const { settings, note } = state;
  const isNewNote = location.pathname.indexOf('/new') > -1;
  const isDefaultLoaded = isNewNote || note.loaded;
  const newFiles = Object.keys(note.newFiles).map((k) => note.newFiles[k]);
  const isUploading = newFiles.filter(file => file.uploading).length > 0;

  return {
    newFiles: newFiles && newFiles.filter(file => file.deleted !== true),
    geoAddress: _get(settings, 'geolocation.address', Date()) || Date(), // Blocked location was setting value as false
    isDefaultLoaded,
    note,
    isUploading,
    ...settings.crm,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    uploadFiles,
    setShareData,
    loadNote,
    addNote,
    deleteNotes,
    close,
    logCRM,
    createPrompt
  })
)

export default class NoteEdit extends Component {
  static propTypes = {
    notes: PropTypes.array,
    notesLoaded: PropTypes.bool,
    notesLoading: PropTypes.bool,
    notesMoreLoading: PropTypes.bool,
    notesComplete: PropTypes.bool,
    className: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // Linked Story passed via router state (StoryDetail)
    const linkedStory = (props.location.state && props.location.state.story) ? props.location.state.story : {};

    this.state = {
      isEditor: true,
      /* title */
      titleValue: '',
      //fabric canvas draw property
      lineColor: '#222222',
      lineWidth: '10',
      //new data like image, audio, fabric
      newSource: null,
      //click the toolbar and then change Froala text area text
      newFroalaMethod: {},
      //check the back and forward on the fabric canvas toolbar and check the value
      history: 0,
      audioActive: false,
      logNoteModalVisible: false,
      linkedStory: linkedStory,
      isContentEmpty: false,
      //open delete dialog
      showDeleteDialog: false,
    };

    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.webkitGetUserMedia);

    if (!this.audioContext && (window.AudioContext || window.webkitAudioContext)) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const isAudio = !navigator.getUserMedia || !window.MediaRecorder || this.audioContext;
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (document.documentMode || /Edge/.test(navigator.userAgent)) {
      this.isSafari = true;
    }
    this.rightBtns = ['annotate', 'image'].concat(isAudio && !this.isSafari ? 'microphone' : []);
    this.prevFabricId = '';
    this.browserHeight = window.innerHeight || document.body.clientHeight;
    this.mobileHtml = '';
    this.isUpdated = false;
    this.nextPath = null;

    autobind(this);

    // refs
    this.fileUpload = null;
  }

  UNSAFE_componentWillMount() {
    const { noteId } = this.props.match.params;
    const { previousLocation } = window;
    const { location } = this.props;

    // Creating a new Note?
    this.isNewNote = location.pathname.indexOf('/new') > -1;

    // Keep track of referring path to accurately redirect on Story Detail Close
    if (location.state && location.state.previousPath) {
      this.previousPath = location.state.previousPath;
    } else if (previousLocation && previousLocation.pathname && previousLocation.pathname.indexOf(noteId) === -1) {
      this.previousPath = previousLocation.pathname;
    } else {
      this.previousPath = '/';
    }

    //define default value
    if (noteId && !this.isNewNote) {
      this.props.loadNote(noteId);
    }

    this.saved = false;
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { newFiles, note, geoAddress, location } = nextProps;
    const { titleValue, linkedStory } = this.state;

    if (this.props.note.uploading && note.uploaded) {
      const differentFiles = newFiles.filter((data) => _findIndex(this.props.newFiles, { filename: data.filename }) < 0);
      let allHaveUrl = true;

      for (const i in differentFiles) {
        if (!differentFiles[i].url) {
          allHaveUrl = false;
        }
      }

      if (allHaveUrl) {
        for (const i in differentFiles) {
          if (differentFiles[i].category === 'image') {
            this.setState({ newSource: {
              id: differentFiles[i].id,
              value: differentFiles[i].url,
              type: 'image',
              mobileHtml: differentFiles[i].filename,
              webHtml: differentFiles[i].url,
            } });
          } else if (differentFiles[i].category === 'audio') {
            this.setState({ newSource: {
              id: differentFiles[i].id,
              value: differentFiles[i].url,
              type: 'media'
            } });
          } else if (differentFiles[i].category === 'note') {
            this.setState({ newSource: {
              id: differentFiles[i].id,
              type: 'fabric',
              value: differentFiles[i].content,
              prevId: this.prevFabricId || null,
            } });
          }
        }
      }
    }

    // save note
    const newWebFiles = newFiles.filter(item => item.category === 'web' && _get(item, 'url', false));

    if (newWebFiles.length === 1 && this.props.note.uploading && note.uploaded) {
      const files = newFiles && newFiles.filter(item => this.mobileHtml.indexOf(item.id) > -1 ||
        item.category === 'web').map(item => ({
        category: item.category,
        filename: item.filename,
        identifier: item.id,
        url: item.url,
        size: item.size,
      }));

      const existingFiles = note.files && note.files.filter(item =>
        item.category !== 'web' && this.mobileHtml.indexOf(item.identifier) > -1
      );

      const data = Object.assign({
        title: titleValue.trim() || geoAddress,
        indexFile: newWebFiles[0].id,
        storyPermId: _get(linkedStory, 'permId', 0),
        files: files.length > 0 ? JSON.stringify(files) : null,
        requestId: uniqueId()
      }, note && note.id ? {
        userNoteId: note && note.id
      } : {}, existingFiles && existingFiles.length > 0 ? {
        existingFiles: JSON.stringify(existingFiles)
      } : {});
      this.isUpdated = false;
      this.props.addNote(data);
    }

    /* set default */
    if (!this.isNewNote && _get(this.props.note, 'loading', false) && _get(note, 'loaded', false)) {
      this.handleSetDefault(note);
    }

    /*finish log*/
    if (_get(this.props, 'note.logging', false) && _get(note, 'logged', false)) {
      const sentMessage = (
        <FormattedMessage
          id="note-logged-successfully"
          defaultMessage="Note logged successfully"
        />);
      this.props.createPrompt({
        id: uniqueId('share-'),
        type: 'info',
        message: sentMessage,
        dismissible: true,
        autoDismiss: 5
      });
      this.logData = null;
      if (location.pathname.indexOf('/new') > -1) {
        this.props.history.push(`/note/${note.id}/edit`);
      }
    }

    /*error*/
    if (!_get(this.props, 'note.error', false) && _get(note, 'error', false)) {
      this.isUpdated = true;
      const noteErrorMsg = (<FormattedMessage
        id="note-error"
        defaultMessage="Note Error"
      />);
      this.props.createPrompt({
        id: uniqueId(),
        type: 'warning',
        title: 'Warning',
        message: _get(nextProps, 'note.error.message', false) || noteErrorMsg,
        dismissible: true,
        autoDismiss: 5
      });
    }

    if ((_get(note, 'deleted', false) === true) ||
      (note.added && this.props.note.adding && !this.logData)) {
      if (this.nextPath) {
        this.context.router.push(this.nextPath);
      } else {
        this.handleGoBack();
      }
    }


    if (note.added && this.props.note.adding && this.logData) {
      this.isNewNote = false;
      this.handleSetDefault(note);
      this.props.logCRM(note.id, this.logData.crmEntity, this.logData.source);
    }
  }

  componentWillUnmount() {
    if (this.audioContext) {
      if (this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }
      this.audioContext = null;
    }

    if (this.logData) {
      this.logData = null;
    }
    this.isUpdated = false;
    document.body.style.overflow = '';
    this.props.close();
  }

  handleSetDefault(note) {
    this.setState({
      titleValue: _get(note, 'name', ''),
      linkedStory: _isEmpty(note.story) ? {} : note.story[0],
    });

    if (!this.isNewNote && !_isEmpty(note.files && _get(note, 'indexFile', false))) {
      const defaultWebFiles = note.files.filter(file => file.identifier === note.indexFile && file.category === 'web');
      this.defaultHtml = _get(defaultWebFiles, '0.content', '');
      this.mobileHtml = this.defaultHtml;

      // note, audio image
      const resourceCategoryList = ['image', 'note', 'audio'];
      const resourceFiles = note.files.filter(file => resourceCategoryList.indexOf(file.category) > -1);
      this.defaultAttachments = resourceFiles.map(file => ({
        id: file.identifier,
        value: file.category === 'note' ? file.content : file.url
      }));
    }
  }

  /*
   * title
   */
  handleTitleChange(event) {
    if (!this.isUpdated) {
      this.isUpdated = true;
    }
    this.setState({ titleValue: event.currentTarget.value });
  }

  /* Add Story Link */
  handleStoryLinkClick(event) {
    event.preventDefault();
    this.setState({ storyPickerModalVisible: true });
  }


  handleStoryPickerClose() {
    this.setState({ storyPickerModalVisible: false });
  }

  handleStoryPickerSave(event, selectedStories) {
    event.preventDefault();
    if (!this.isUpdated) {
      this.isUpdated = true;
    }
    this.setState({
      storyPickerModalVisible: false,
      linkedStory: selectedStories[0]
    });
  }

  handleLinkedStoryRemove() {
    if (!this.isUpdated) {
      this.isUpdated = true;
    }
    this.setState({
      linkedStory: {}
    });
  }

  /*
   * editor header
   */
  handleRightItemClick(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;

    if (type === 'annotate') {
      if (this.state.isEditor) {
        this.prevFabricId = '';
        this.setState({
          newSource: {},
          lineColor: '#222222',
          lineWidth: '10',
          isEditor: false,
          audioActive: false,
        });
      }
    } else if (type === 'image') {
      const fileUploadDom = this.fileUpload;
      fileUploadDom.click();
    }
  }

  handleDeleteClick() {
    this.setState({ showDeleteDialog: true });
  }

  handleLogToSalesforceClick() {
    const title = this.state.titleValue || this.props.geoAddress;
    const value = this.mobileHtml || this.defaultHtml;

    if (title && value) {
      this.setState({ logNoteModalVisible: true });
    } else {
      this.setState({ isContentEmpty: true });
    }
  }

  //save
  handleSaveNote() {
    const title = this.state.titleValue.trim() || this.props.geoAddress;
    const value = this.mobileHtml || this.defaultHtml || '<p></p>';

    if (title && this.isUpdated) {
      const type = 'text/html';
      const id = uniqueId();
      const blob = new Blob([value], { type });
      blob.name = `${id}.html`;
      this.handleUploadFile(blob, id);
      this.isUpdated = false;
    } else {
      this.handleGoBack();
    }
  }

  handleLogNoteModalClose() {
    this.setState({ logNoteModalVisible: false });
  }

  handleFabricClick(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;

    if (type === 'undo') {
      this.setState({ history: this.state.history - 1 });
    } else if (type === 'redo') {
      this.setState({ history: this.state.history + 1 });
    } else if (type === 'cancel' || type === 'attach') {
      this.setState({
        isEditor: !this.state.isEditor,
        isAttachFabric: type === 'attach',
        history: 0
      });
    } else if (type === 'penSize' || type === 'penColor') {
      const href = event.currentTarget.getAttribute('href');
      if (href.indexOf('#') > -1) {
        this.setState({ lineColor: href });
      } else {
        this.setState({ lineWidth: href });
      }
    }
  }

  handleAudioDropMenuOpen() {
    this.setState({ audioActive: true });
  }

  handleAudioDropMenuClose() {
    this.setState({ audioActive: false });
  }

  handleImageUploadChange(event) {
    if (event.target.files[0]) {
      const file = event.target.files;
      /* eslint-disable no-param-reassign */
      const id = uniqueId();

      if (file.length && file[0].size <= 1024 * 1024 * 2) { // not bigger than 2MB
        // upload the file
        this.handleUploadFile(file[0], id);
      } else {
        const imageSizeErrorMesage = (<FormattedMessage
          id="image-size-should-be-less-n"
          defaultMessage="Images size should be less than 2MB"
          values={{ size: '2MB' }}
        />);
        this.props.createPrompt({
          id: uniqueId(),
          type: 'warning',
          title: 'Warning',
          message: imageSizeErrorMesage,
          dismissible: true,
          autoDismiss: 5
        });
      }
    }
    //re-upload the file
    const fileUploadDom = this.fileUpload;
    fileUploadDom.value = '';
  }

  /*
   * audio
   * */
  handleAttachClick(event, audio) {
    /* convert file*/
    const type = {
      type: 'audio/wav'
    };
    const id = uniqueId();
    const file = new File([audio], `${id}.wav`, type);
    this.handleUploadFile(file, id);
    this.setState({ audioActive: false });
  }

  handleAudioError(error) {
    this.props.createPrompt({
      id: uniqueId(),
      type: 'warning',
      title: 'Warning',
      message: error.message || error || 'Audio Recording Error',
      dismissible: true,
      autoDismiss: 5
    });
  }

  /*
   * editor body
   * */
  handleEditorChange(html, source) {
    this.mobileHtml = replaceHtmlPaths(html || '<p></p>', source);
    this.webHtml = html;
    if (!this.isUpdated && this.webHtml !== this.defaultHtml && (this.webHtml || this.defaultHtml)) {
      this.isUpdated = true;
    }
  }

  handleFabricCanvasUpdate(value, prevFabricId) {
    if (!this.isUpdated) {
      this.isUpdated = true;
    }
    const type = {
      type: 'application/json'
    };
    const blob = new Blob([value], type);
    const id = uniqueId();
    blob.name = `${id}.btcd`;
    this.prevFabricId = prevFabricId;
    this.handleUploadFile(blob, id);
  }

  handleUploadFile(file, id) {
    const { fileDefaults } = this.context.settings;
    file.id = id;
    file.convertSettings = fileDefaults.convertSettings;
    file.shareStatus = fileDefaults.shareStatus;
    file.hasWatermark = false;
    this.props.uploadFiles([file], this.context.store.dispatch);
  }

  handleCanvasClick() {
    this.setState({
      isEditor: false,
      isAttachFabric: false,
      audioActive: false,
    });
  }

  handleCancelDialog() {
    this.setState({ showDeleteDialog: false });
  }

  handleContentModalClose() {
    this.setState({ isContentEmpty: false });
  }

  handleConfirmDialog() {
    this.setState({ showDeleteDialog: false });
    const { noteId } = this.props.match.params;
    this.props.deleteNotes([Number(noteId)]);
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  handleGoBack() {
    // Are we currently on a modal route
    const isModal = window.previousLocation && window.previousLocation.state && window.previousLocation.state.modal;
    this.props.history.push(this.previousPath, { modal: isModal });
  }

  handleLog(id, type, source) {
    if (!this.isUpdated) {
      this.isUpdated = true;
    }
    const crmEntity = JSON.stringify({
      id,
      type,
    });

    const data = {
      crmEntity,
      source,
    };

    this.logData = data;
    this.setState({ logNoteModalVisible: false });
    this.handleSaveNote();
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming, userCapabilities } = this.context.settings;
    const { hasNotes } = userCapabilities;
    const {
      geoAddress,
      isDefaultLoaded,
      note,
      isUploading,
      serviceDescription,
      source
    } = this.props;
    const {
      titleValue,
      isEditor,
      lineWidth,
      lineColor,
      newSource,
      isAttachFabric,
      newFroalaMethod,
      history,
      audioActive,
      linkedStory,
      showDeleteDialog,
    } = this.state;
    const cx = classNames.bind(styles);

    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, crm: serviceDescription });

    // Check user permission
    if (!hasNotes) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="You are not allowed to view Notes"
          onCloseClick={this.handleGoBack}
        />
      );
    }

    const loaded = (isDefaultLoaded || note.logged || note.uploaded || note.uploading) && !note.added && !note.adding;

    const fabircEditorClass = cx({
      editFabircEditor: true,
      hidden: isUploading && loaded,
    });

    const fabircEditorLoadingClass = cx({
      hidden: !isUploading || !loaded,
    });

    // Page Title
    let pageTitle = strings.edit + ' ' + titleValue;
    if (!this.props.permId) {
      pageTitle = strings.createStory;
    }

    return (
      <div className={styles.NoteEdit}>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <Loader type="page" className={(loaded || !_isEmpty(note.error)) ? styles.hidden : ''} />
        {!note.loading && <div className={(!loaded && _isEmpty(note.error)) ? styles.hidden : ''}>
          <input
            ref={(c) => { this.fileUpload = c; }}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={this.handleImageUploadChange}
          />
          <div className={fabircEditorLoadingClass}>
            <Loader type="page" />
          </div>
          {!isEditor && <FabricHeader
            strings={strings}
            onClick={this.handleFabricClick}
            className={styles.fabricHeader}
          />}
          <FabricEditor
            authString={_get(this.context.settings, 'authString', '')}
            className={fabircEditorClass}
            isEditor={isEditor}
            lineWidth={lineWidth}
            lineColor={lineColor}
            history={history}
            defaultAttachments={this.defaultAttachments}
            defaultValue={this.defaultHtml}
            onEditorChange={this.handleEditorChange}
            onFabricCanvasUpdate={this.handleFabricCanvasUpdate}
            onCanvasClick={this.handleCanvasClick}
            isAttachFabric={isAttachFabric}
            newFroalaMethod={newFroalaMethod}
            newSource={newSource}
            froalaOptions={{
              imagePaste: false,
              height: 'calc(100vh - 15rem)'
            }}
            fabricCanvasHeight={this.browserHeight - 80}
            titleElement={
              isEditor && <div className={styles.editTitle}>
                <Text
                  id="titleValue"
                  value={titleValue}
                  className={styles.editTitleInput}
                  placeholder={geoAddress}
                  onChange={this.handleTitleChange}
                />
              </div>
            }
            storyElement={
              isEditor && <div className={styles.editStoryLink}>
                {_isEmpty(linkedStory) && <Btn
                  inverted
                  data-type="editStoryLink"
                  onClick={this.handleStoryLinkClick}
                >{strings.linkedTo}</Btn>}
                {!_isEmpty(linkedStory) && <StoryItem
                  story={linkedStory}
                  onClose={this.handleLinkedStoryRemove}
                  styles={styles}
                  authString={_get(this.context.settings, 'authString', '')}
                  label={strings.linkedTo}
                />}
              </div>
            }
            leftTopElement={isEditor && <span className={styles.close} onClick={this.handleSaveNote}>{strings.close}</span>}
            rightTopElement={isEditor && <div className={styles.rightBtns}>
              {this.rightBtns.map((name) => {
                if (name === 'microphone') {
                  return (<RecordAudioDropMenu
                    icon={name}
                    key={name}
                    width="auto"
                    className={styles['right' + name]}
                    onOpen={this.handleAudioDropMenuOpen}
                    onClose={this.handleAudioDropMenuClose}
                    active={audioActive}
                  >
                    {audioActive ? <RecordAudio
                      onAttachClick={this.handleAttachClick}
                      onCancelClick={this.handleAudioDropMenuClose}
                      onError={this.handleAudioError}
                      strings={strings}
                    /> : <div />}
                  </RecordAudioDropMenu>);
                }

                return (<Btn
                  icon={name}
                  key={name}
                  borderless
                  className={styles['right' + name]}
                  href={name}
                  data-type={name}
                  onClick={this.handleRightItemClick}
                />);
              })}
              <DropMenu
                width={source === 'salesforce' ? '12.5rem' : '15rem'}
                icon="more"
                activeIcon="more-fill"
                className={styles.dropMenu}
                activeClassName={styles.dropMenuAcive}
              >
                <ul>
                  {_get(this.context, 'settings.userCapabilities.hasCrmIntegration', false) && <li
                    onClick={this.handleLogToSalesforceClick}
                    className={`icon-${source}`}
                  >
                    <span>{strings.logToCRM}</span>
                  </li>}
                  <li
                    onClick={this.handleDeleteClick}
                    className="icon-trash"
                  >
                    <span>{strings.delete}</span>
                  </li>
                </ul>
              </DropMenu>
            </div>}
          />
          <Dialog
            title={strings.deleteNote}
            message={strings.deleteNoteMessage}
            isVisible={showDeleteDialog}
            cancelText={strings.cancel}
            confirmText={strings.delete}
            onCancel={this.handleCancelDialog}
            onConfirm={this.handleConfirmDialog}
          />
          <StoryPickerModal
            backdropClosesModal
            escClosesModal
            isVisible={this.state.storyPickerModalVisible}
            excludeFeedChannels
            headerCloseButton
            onClose={this.handleStoryPickerClose}
            onSave={this.handleStoryPickerSave}
          />
          <LogNoteModal
            isModalVisible={this.state.logNoteModalVisible}
            onClose={this.handleLogNoteModalClose}
            onLogClick={this.handleLog}
            title={this.state.titleValue || geoAddress}
          />
          <Modal
            isVisible={this.state.isContentEmpty}
            width="small"
            backdropClosesModal
            escClosesModal
            headerTitle={strings.error}
            footerCloseButton
            onClose={this.handleContentModalClose}
          >
            <div style={{ padding: '1rem 1.5rem' }}>
              <p>{strings.emptyNoteMessage}</p>
            </div>
          </Modal>
        </div>}
      </div>
    );
  }
}
