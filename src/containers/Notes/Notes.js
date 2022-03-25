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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  toggleEntityAttribute
} from 'redux/modules/entities/entities';
import {
  loadNotes
} from 'redux/modules/me';
import {
  deleteNotes
} from 'redux/modules/note';
import {
  setMeNotesSortBy
} from 'redux/modules/settings';
import { mapNotes } from 'redux/modules/entities/helpers';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import AppHeader from 'components/AppHeader/AppHeader';
import BreadcrumbList from 'components/BreadcrumbList/BreadcrumbList';
import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';
import NotesSettings from 'components/NotesSettings/NotesSettings';

const messages = defineMessages({
  me: { id: 'me', defaultMessage: 'Me' },
  notes: { id: 'notes', defaultMessage: 'Notes' },
  details: { id: 'details', defaultMessage: 'Details' },
  notesEmptyHeading: {
    id: 'notes-empty-heading',
    defaultMessage: 'No Notes'
  },
  notesEmptyMessage: {
    id: 'notes-empty-message',
    defaultMessage: 'You have not created any Notes'
  },

  name: { id: 'name', defaultMessage: 'Name' },
  date: { id: 'date', defaultMessage: 'Date' },

  options: {
    id: 'options',
    defaultMessage: 'Options'
  },
  deleteNotes: {
    id: 'delete-notes',
    defaultMessage: 'Delete Notes'
  },
  sortByName: {
    id: 'sort-by-name',
    defaultMessage: 'Sort by name'
  },
  sortByDate: {
    id: 'sort-by-date',
    defaultMessage: 'Sort by date'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete'
  },
  deleteNotesTitle: {
    id: 'delete-notes-title',
    defaultMessage: 'Delete Notes?'
  },
  deleteNotesMessage: {
    id: 'delete-notes-message',
    defaultMessage: 'Are you sure you want to delete {itemCount} {itemCount, plural, =1 {Note} one {Result} other {Notes}}?'
  },
});

function mapStateToProps(state) {
  const { entities, me, settings } = state;
  const allNotes = mapNotes(me.notes, entities);
  const notes = allNotes.filter(n => n.status !== 'deleted');
  const selectedNotes = notes.filter(n => n.isSelected);

  const notesSortBy = settings.meSettings.notesSortBy;

  return {
    notes,
    selectedNotes,
    notesSortBy,

    notesLoaded: me.notesLoaded,
    notesLoading: me.notesLoading,
    notesComplete: me.notesComplete,
    notesError: me.notesError
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    toggleEntityAttribute,
    loadNotes,
    deleteNotes,
    setMeNotesSortBy
  })
)
export default class Notes extends Component {
  static propTypes = {
    notes: PropTypes.array.isRequired,
    selectedNotes: PropTypes.array.isRequired,
    notesSortBy: PropTypes.oneOf(['name', 'date_updated']),

    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    notes: [],
    selectedNotes: []
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteDialogVisible: false,
      deleteMode: false
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { notesSortBy } = this.props;

    // Load notes if changing notesSortBy
    if (nextProps.notesSortBy && nextProps.notesSortBy !== notesSortBy) {
      this.props.loadNotes(0, nextProps.notesSortBy);
    }
  }

  handleNotesLoad(offset = 0) {
    this.props.loadNotes(offset, this.props.notesSortBy);
  }

  handleSortOrderChange(selected) {
    this.props.setMeNotesSortBy(selected.value);
  }

  handleDeleteModeClick(event) {
    event.preventDefault();
    this.setState({
      deleteMode: !this.state.deleteMode
    });

    // simulate click to hide DropMenu
    window.document.body.click();
  }

  handleCancelDeleteClick(event) {
    event.preventDefault();

    // De-select all notes
    this.props.selectedNotes.forEach(n => {
      this.props.toggleEntityAttribute('notes', n.id, 'isSelected');
    });

    this.setState({
      deleteMode: false
    });
  }

  handleDeleteClick(event) {
    event.preventDefault();
    this.setState({
      deleteDialogVisible: true
    });
  }

  handleConfirmDeleteClick(event) {
    event.preventDefault();
    const selectedIds = this.props.selectedNotes.map(n => n.id);
    this.props.deleteNotes(selectedIds);

    this.setState({
      deleteDialogVisible: false,
      deleteMode: false
    });
  }

  handleDialogClose(event) {
    event.preventDefault();

    this.setState({
      deleteDialogVisible: false
    });
  }

  handleNoteClick(event, context) {
    event.preventDefault();

    if (this.state.deleteMode) {
      const id = context.props.id;
      this.props.toggleEntityAttribute('notes', id, 'isSelected');
    } else {
      this.props.history.push(event.currentTarget.getAttribute('href'));
    }
  }

  handleCloseClick() {
    this.props.history.push('/');
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { settings } = this.context;
    const { hasNotes, hasStoryBadges } = settings.userCapabilities;
    const { deleteMode } = this.state;
    const { notes, selectedNotes } = this.props;
    const styles = require('./Notes.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, { itemCount: selectedNotes.length });

    // Check user permission
    if (!hasNotes) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="You are not allowed to view Notes"
          onCloseClick={this.handleCloseClick}
        />
      );
    }

    // Header breadcrumbs
    let paths = [{
      name: strings.me,
      path: '/me'
    }, {
      name: strings.notes,
      path: '/notes'
    }];

    // Alternate title when deleting notes
    if (deleteMode) {
      paths = [{
        name: strings.deleteNotes,
        path: '/me'
      }];
    }

    const lists = [{
      list: notes,
      isLoaded: this.props.notesLoaded,
      isLoading: this.props.notesLoading,
      isLoadingMore: this.props.notesLoading && this.props.notes.length > 0,
      isComplete: this.props.notesComplete,
      error: this.props.notesErrror,
      onGetList: this.handleNotesLoad,
      listProps: {
        grid: true,
        itemProps: { showCheckbox: deleteMode },
        showBadges: hasStoryBadges,
        emptyMessage: strings.notesEmptyMessage,
        showThumb: true,
        emptyHeading: strings.notesEmptyHeading,
        onItemClick: this.handleNoteClick,
        className: styles.notesList
      }
    }];

    return (
      <div className={styles.Notes}>
        <Helmet>
          <title>{strings.notes}</title>
        </Helmet>
        <AppHeader
          style={{ display: deleteMode ? 'none' : null }}
        />
        {deleteMode && <div className={styles.deleteHeader}>
          <Btn alt large onClick={this.handleCancelDeleteClick}>{strings.cancel}</Btn>
          <Btn disabled={!selectedNotes.length} inverted large onClick={this.handleDeleteClick}>{strings.delete}</Btn>
        </div>}
        <BreadcrumbList
          disableAnimation
          lists={lists}
          menuComponent={(
            <NotesSettings
              sortOrder={this.props.notesSortBy}
              sortOptions={[
                { value: 'name', label: strings.name },
                { value: 'date_updated', label: strings.date }
              ]}
              deleteActive={deleteMode}
              showDelete
              strings={strings}
              onSortOrderChange={this.handleSortOrderChange}
              onDeleteClick={this.handleDeleteModeClick}
            />
          )}
          paths={paths}
          onPathClick={this.props.onAnchorClick}
          className={styles.notesListWrapper}
        />
        <Dialog
          title={strings.deleteNotesTitle}
          message={strings.deleteNotesMessage}
          isVisible={this.state.deleteDialogVisible}
          cancelText={strings.cancel}
          confirmText={strings.delete}
          onCancel={this.handleDialogClose}
          onConfirm={this.handleConfirmDeleteClick}
        />
      </div>
    );
  }
}
