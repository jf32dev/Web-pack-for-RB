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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  mapFiles, mapNotes
} from 'redux/modules/entities/helpers';

import {
  uploadFiles,
  addNote,
  close,
} from 'redux/modules/note';
import {
  load as loadStoryByPermId
} from 'redux/modules/story/story';
import {
  updateEntity
} from 'redux/modules/entities/entities';

import classNames from 'classnames/bind';

import NoteItem from 'components/NoteItem/NoteItem';
import Btn from 'components/Btn/Btn';
import FabricEditor from 'components/FabricEditor/FabricEditor';
import Loader from 'components/Loader/Loader';
import Text from 'components/Text/Text';
import { replaceHtmlPaths, uniqueId } from 'components/FabricEditor/fabricEditorUtil';

const messages = defineMessages({
  back: {
    id: 'back',
    defaultMessage: 'Back'
  },
  createNote: {
    id: 'create-note',
    defaultMessage: 'Create Note'
  },
  addNote: {
    id: 'add-note',
    defaultMessage: 'Add Note'
  },
  addANote: {
    id: 'add-a-note',
    defaultMessage: 'Add a note'
  },
  title: {
    id: 'title',
    defaultMessage: 'Title'
  },
});

function mapStateToProps(state) {
  const { note, settings, entities, viewer } = state;
  const files = mapFiles(viewer.order, entities);
  const newFiles = Object.keys(note.newFiles).map((k) => note.newFiles[k]);
  const newNotes = Object.keys(state.entities.notes).filter(key => _get(state, `entities.notes.${key}.story[0].permId`, false) === state.story.permId);

  return {
    activeStoryId: state.story.permId,
    activeFileId: state.viewer.activeFileId,
    files,
    newFiles: newFiles && newFiles.filter(file => file.deleted !== true),
    notes: mapNotes(state.story.notes.concat(newNotes), state.entities),
    note,
    geoAddress: _get(settings, 'geolocation.address', Date()),
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    updateEntity,
    loadStoryByPermId,
    uploadFiles,
    addNote,
    close,
  })
)
export default class PresentationNote extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { activeFileId, files } = this.props;
    const activeFile = files.find(file => activeFileId === file.id);
    if (!this.props.activeStoryId && this.props.loadStoryByPermId) {
      this.props.loadStoryByPermId(activeFile.permId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // save note
    const newWebFiles = nextProps.newFiles.filter(item => item.category === 'web' && _get(item, 'url', false));

    if (newWebFiles.length === 1 && this.props.note.uploading && nextProps.note.uploaded) {
      const { newFiles, activeStoryId, files, activeFileId } = nextProps;
      const activeFile = files.find(file => activeFileId === file.id);
      const { selectNote } = activeFile;

      const noteFiles = newFiles && newFiles.filter(item => this.mobileHtml.indexOf(item.id) > -1 ||
        item.category === 'web').map(item => ({
        category: item.category,
        filename: item.filename,
        identifier: item.id,
        url: item.url,
        size: item.size,
      }));

      const existingFiles = selectNote.files && selectNote.files.filter(item =>
        item.category !== 'web' && this.mobileHtml.indexOf(item.identifier) > -1
      );

      const data = Object.assign({
        title: selectNote.name,
        indexFile: newWebFiles[0].id,
        storyPermId: activeStoryId,
        files: files.length > 0 ? JSON.stringify(noteFiles) : null,
        requestId: uniqueId()
      }, selectNote.id ? {
        userNoteId: selectNote.id
      } : {});

      if (existingFiles && existingFiles.length > 0) {
        data.existingFiles = JSON.stringify(existingFiles);
      }

      this.props.addNote(data);
    }

    if (nextProps.note.added && this.props.note.adding) {
      const { activeFileId } = nextProps;
      this.props.updateEntity('files', activeFileId, {
        selectNote: null,
        isNoteLoading: false,
      });
    }
  }

  handleNoteCreateBtnClick(event) {
    const type = _get(event, 'currentTarget.dataset.type', '');
    if (type === 'create-note') {
      const { activeFileId } = this.props;
      this.props.updateEntity('files', activeFileId, { selectNote: {
        name: this.props.geoAddress,
        value: ''
      } });
    }
    this.noteTitle = this.props.geoAddress;
  }

  handleBackBtnClick() {
    const { activeFileId, files } = this.props;
    const activeFile = files.find(file => activeFileId === file.id);
    const { selectNote } = activeFile;

    const defaultHtml = _get(selectNote, 'files', false) ?
      selectNote.files.find(file => file.identifier === selectNote.indexFile && file.category === 'web').content : '';
    const value = this.mobileHtml || defaultHtml || '';

    if ((value !== defaultHtml || selectNote.name !== this.noteTitle) && selectNote.name) {
      const type = 'text/html';
      const id = uniqueId();
      const blob = new Blob([value || '<p></p>'], { type });
      blob.name = `${id}.html`;
      this.handleUploadFile(blob, id);
      this.props.updateEntity('files', activeFileId, { isNoteLoading: true });
    } else {
      this.props.updateEntity('files', activeFileId, { selectNote: null });
    }
  }

  handleUploadFile(file, id) {
    const { fileDefaults } = this.context.settings;
    const newFile = file;
    newFile.id = id;
    newFile.convertSettings = fileDefaults.convertSettings;
    newFile.shareStatus = fileDefaults.shareStatus;
    newFile.hasWatermark = false;
    this.props.uploadFiles([newFile], this.context.store.dispatch);
  }

  handleNoteItemClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const selectNote = this.props.notes.find(note => href.indexOf(note.id) > -1);
    this.noteTitle = selectNote.name;

    const { activeFileId } = this.props;
    this.props.updateEntity('files', activeFileId, { selectNote });
  }

  handleEditorChange(html, source) {
    this.mobileHtml = replaceHtmlPaths(html, source);
    this.webHtml = html;
  }

  handleUpdateFile(id, attrs) {
    if (id > 0) {
      this.props.updateEntity('files', id, attrs);
    }
  }

  handleTitleChange(event) {
    const { activeFileId } = this.props;
    const activeFile = this.props.files.find(file => activeFileId === file.id);

    const selectNote = Object.assign(activeFile.selectNote, { name: event.currentTarget.value });
    this.props.updateEntity('files', activeFileId, { selectNote });
  }

  render() {
    const { activeFileId, files, notes, geoAddress, note } = this.props;
    const { formatMessage } = this.context.intl;
    const activeFile = files.find(file => activeFileId === file.id);

    const isEmptyNotes = _isEmpty(notes) && !note.added;

    const styles = require('./PresentationNote.less');
    const cx = classNames.bind(styles);
    const personalNotesBtnClasses = cx({
      personalNotesBtnDiv: !isEmptyNotes,
      personalNotesBigBtnDiv: isEmptyNotes,
      hidden: !_isEmpty(_get(activeFile, 'selectNote', {})),
    });

    const isNoteLoading = _get(activeFile, 'isNoteLoading', false);

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const resourceCategoryList = ['image', 'note', 'audio'];

    const resourceFiles = _get(activeFile, 'selectNote.files', false) ? activeFile.selectNote.files.filter(file => resourceCategoryList.indexOf(file.category) > -1) : [];

    const defaultAttachments = !_isEmpty(_get(activeFile, 'selectNote', {})) ? resourceFiles.map(file => ({
      id: file.identifier,
      value: file.category === 'note' ? file.content : file.url
    })) : [];

    const selectNote = _get(activeFile, 'selectNote', {});

    return (
      <div className={styles.fullHeight}>
        <div className={personalNotesBtnClasses}>
          {isEmptyNotes && <div className={styles.noteBigIcon} />}
          {isEmptyNotes && <div className={styles.noteBtnTitle}>{strings.addANote}</div>}
          {isEmptyNotes && <div className={styles.noteBtnDesc}>{strings.emptyNotesMessage}</div>}
          <Btn
            inverted
            data-type="create-note"
            large={isEmptyNotes}
            onClick={this.handleNoteCreateBtnClick}
          >{isEmptyNotes ? strings.addNote : strings.createNote}</Btn>
        </div>
        <div className={styles.personalNotes}>
          {isNoteLoading && <Loader type="page" />}
          {!isNoteLoading &&
          <div>
            {_isEmpty(selectNote) && notes.map(noteItem =>
              <NoteItem key={noteItem.id} small white onClick={this.handleNoteItemClick} {...noteItem} />)}
            {!_isEmpty(selectNote) && <div>
              <Btn alt small className={styles.backBtn} onClick={this.handleBackBtnClick}>{strings.back}</Btn>
              <Text
                value={selectNote.name}
                className={styles.editTitleInput}
                placeholder={geoAddress || strings.title}
                onChange={this.handleTitleChange}
              />
              <FabricEditor
                className={styles.fabircEditorClass}
                defaultAttachments={defaultAttachments}
                defaultValue={selectNote.files && selectNote.files.find(file => file.identifier === selectNote.indexFile && file.category === 'web').content}
                onEditorChange={this.handleEditorChange}
                fabricCanvasHeight={400}
                textAreaOnly
              />
            </div>}
          </div>}
        </div>
      </div>);
  }
}
