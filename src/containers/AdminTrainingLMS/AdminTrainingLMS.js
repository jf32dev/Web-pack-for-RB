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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import generateStrings from 'helpers/generateStrings';
import { defineMessages, FormattedMessage } from 'react-intl';

import AdminManageList from 'components/Admin/AdminManageList/AdminManageList';
import Dialog from 'components/Dialog/Dialog';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import {
  getLmsCreateUrl,
  loadCourses,
  loadLMSUsers,
  removeUserLink,
  setData,
  setUserLink
} from 'redux/modules/admin/education';
import { createPrompt } from 'redux/modules/prompts';

const messages = defineMessages({
  addExistingUsers: { id: 'add-existing-users', defaultMessage: 'Add Existing Users' },
  addUser: { id: 'add-user', defaultMessage: 'Add user' },
  courses: { id: 'courses', defaultMessage: 'Courses' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
  continue: { id: 'continue', defaultMessage: 'Continue' },
  remove: { id: 'remove', defaultMessage: 'Remove' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  confirmRemoveUserHeader: { id: 'confirm-remove-user-header', defaultMessage: 'Are you sure you want to remove this User?' },
  confirmCourseCreateHeader: { id: 'confirm-course-create-header', defaultMessage: 'Create LMS Course?' },
  confirmCourseCreateMessage: { id: 'confirm-course-create-message', defaultMessage: 'You are about to create a new LMS course. Are you sure you want to continue?' },

  users: { id: 'users', defaultMessage: 'Users' },
  selectUser: { id: 'select-user', defaultMessage: 'Select User' },
  selectCourse: { id: 'select-course', defaultMessage: 'Select Course' },
  filter: { id: 'filter', defaultMessage: 'Filter' },
  noUsersFound: { id: 'no-users-found', defaultMessage: 'No Users found' },
  noCoursesFound: { id: 'no-courses-found', defaultMessage: 'No courses found' },

  popupBlockerHeader: { id: 'popup-window-blocker', defaultMessage: 'Pop-up windows blocked' },
  popupBlockerMessage: { id: 'popup-window-blocker-message', defaultMessage: 'You have pop-up windows disabled. Please enable them in your browser or copy the link provided in a new tab.' },
});

const randomColour = () => {
  const colours = ['#e2023a', '#e202ae', '#7e00b9', '#0092ec', '#02e8d1', '#04e44a', '#ffd400', '#f26724', '#7e622a', '#4c4c4c'];
  return colours[Math.floor(Math.random() * colours.length)];
};

function mapStateToProps(state) {
  const { admin, settings } = state;
  const { education } = admin;

  const courses = education.courses.map(id => {
    const entity = education.coursesById[id];
    entity.id = entity.courseId;
    entity.name = entity.title;
    entity.colour = !entity.colour ? randomColour() : entity.colour;
    return entity;
  });

  const courseSelected = courses.find(obj => !obj.deleted && obj.id === education.courseSelected.id) || {};
  const userSelected = education.userSelected.deleted ? {} : education.userSelected;
  let usersByCourse = [];
  if (courseSelected && courseSelected.id && education.usersByCourse[courseSelected.id]) {
    // TODO - update api attributes returned
    usersByCourse = education.usersByCourse[courseSelected.id].userIds.map(id => (
      {
        ...education.users[id],
        name: education.users[id].firstname + ' ' + education.users[id].lastname,
        note: education.users[id].email,
        type: 'people'
      }
    ));
  }

  let userSearchList = [];
  const userSearchByGroup = education.userSearchByCourse;

  if (courseSelected && courseSelected.id && userSearchByGroup && userSearchByGroup[courseSelected.id] && userSearchByGroup[courseSelected.id].userIds) {
    userSearchList = userSearchByGroup[courseSelected.id].userIds.map(id => (
      {
        ...education.users[id],
        note: education.users[id].email,
        type: 'people',
        name: education.users[id].name || education.users[id].firstname + ' ' + education.users[id].lastname
      }
    ));
  }

  return {
    companyId: settings.company.id,
    userId: settings.user.id,
    courses: courses,
    courseSelected: courseSelected,
    coursesComplete: education.coursesComplete,
    //coursesFilter: education.coursesFilter,
    coursesLoading: education.coursesLoading,

    users: usersByCourse,
    userSelected: userSelected,
    usersLoading: education.usersLoading,
    usersComplete: education.usersComplete,
    usersFilter: education.usersFilter,

    userSearchKeyword: education.userSearchKeyword,
    userSearchList: userSearchList,
    userSearchLoading: education.userSearchLoading,
    userSearchComplete: education.userSearchComplete,

    lmsLoading: education.lmsLoading,
    lmsLoaded: education.lmsLoaded,
    lmsURL: education.lmsURL,
    error: education.error,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    getLmsCreateUrl,
    loadCourses,
    loadLMSUsers,
    removeUserLink,
    setData,
    setUserLink
  })
)
export default class AdminTrainingLMSView extends Component {
  static propTypes = {
    courses: PropTypes.array.isRequired,
    coursesLoading: PropTypes.bool,
    coursesComplete: PropTypes.bool,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showPopupBlockerDialog: false,
      showCourceCreateConfirmDialog: false,

      // Modals
      userDetails: {},
      confirmRemoveUser: false,
    };
    autobind(this);
    this.handleLoadUsers = debounce(this.handleLoadUsers.bind(this), 500);
    this.listWrapper = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      companyId,
      courseSelected,
      error,
      //usersLoading,
      lmsURL
    } = this.props;

    // Groups error
    const prevError = error ? error.message : '';
    if (nextProps.error && nextProps.error.message && (nextProps.error.message !== prevError)) {
      this.props.createPrompt({
        id: uniqueId('error-'),
        type: 'error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }

    // Handle new url s - open new window
    if (lmsURL !== nextProps.lmsURL) {
      const newWindow = window.open(nextProps.lmsURL);
      if (newWindow === null || typeof (newWindow) === 'undefined') {
        this.setState({
          showPopupBlockerDialog: true
        });
      }
      if (newWindow && newWindow.opener) newWindow.opener = null;
    }

    // Load Users if Course selected is changed
    if (nextProps.courseSelected && nextProps.courseSelected.id && nextProps.courseSelected.id !== courseSelected.id) {
      this.props.setData({
        usersSelected: {},
        //usersComplete: false
      });

      this.props.loadLMSUsers(companyId, nextProps.courseSelected.id, '');
    }
  }

  // Popup blocker dialog
  handleCloseDialog() {
    this.setState({
      showPopupBlockerDialog: !this.state.showPopupBlockerDialog
    });
  }

  handleFocus(event) {
    event.target.select();
  }

  // Tabs function
  handleGetCoursesList(offset) {
    const {
      companyId,
      coursesLoading
    } = this.props;

    if (!coursesLoading) {
      this.props.loadCourses(companyId, offset);
    }
  }

  handleCourseClick(event, context) {
    const { lmsLoading, coursesLoading } = this.props;
    if (!lmsLoading && !coursesLoading) {
      this.props.setData({
        courseSelected: {
          id: context.courseId,
          courseId: context.courseId,
          companyId: context.companyId,
          title: context.title,
          name: context.title,
          position: context.position
        },
      });
    }
  }

  // Course functions
  handleCreateCourse() {
    const {
      companyId,
      userId
    } = this.props;
    this.props.getLmsCreateUrl(companyId, userId);
    this.setState({
      showCourceCreateConfirmDialog: false
    });
  }

  handleToggleCreateCourse(event) {
    event.preventDefault();
    this.setState({
      showCourceCreateConfirmDialog: !this.state.showCourceCreateConfirmDialog
    });
  }

  handleEditCourse(event, context) {
    event.preventDefault();
    const {
      companyId,
      userId
    } = this.props;

    this.props.getLmsCreateUrl(companyId, userId, context.props.courseId);
  }

  // Group functions
  handleLoadUsers(offset, keyword, filterType) {
    const {
      companyId,
      courseSelected,
      usersLoading
    } = this.props;

    if (courseSelected.id && !usersLoading) {
      this.props.loadLMSUsers(companyId, courseSelected.id, offset, keyword, filterType);
    }
  }

  handleGetUserList(offset) {
    const {
      companyId,
      courseSelected,
      usersLoading
    } = this.props;

    if (courseSelected.id && !usersLoading) {
      this.props.loadLMSUsers(companyId, courseSelected.id, offset);
    }
  }

  handleGetUserSearchList(offset) {
    const {
      companyId,
      courseSelected,
      error,
      userSearchLoading,
    } = this.props;

    if (courseSelected.id && !userSearchLoading && !(error && error.message)) {
      this.props.loadLMSUsers(companyId, courseSelected.id, offset, 'unlinked');
    }
  }

  handleUserClick(event, context) {
    this.props.setData({
      userSelected: {
        id: context.id,
        name: context.name,
        position: context.position,
        type: context.type
      }
    });
  }

  // User Search list
  handleUserSearchInputChange(event) {
    this.props.setData({ userSearchKeyword: event.currentTarget.value });
    this.handleLoadUsers(0, event.currentTarget.value, 'unlinked');
  }

  handleUserSearchClear() {
    this.props.setData({ userSearchKeyword: '' });
    this.handleLoadUsers(0, '', 'unlinked');
  }

  handleUserAddSearchItems(event, items) {
    const {
      companyId,
      courseSelected
    } = this.props;

    // Insert Items in courseList
    this.props.setUserLink(
      companyId,
      courseSelected.id,
      items.map(obj => obj.id),
    );
  }

  // Unlink users
  handleToggleConfirmRemoveUser(event, details) {
    let data = {};
    if (details) data = details.id ? details : details.user;

    this.setState({
      userDetails: data, // Set item to be deleted
      confirmRemoveUser: !this.state.confirmRemoveUser
    });
  }

  handleRemoveUserClick() {
    const {
      companyId,
      courseSelected,
    } = this.props;

    this.props.removeUserLink(
      companyId,
      courseSelected.id,
      this.state.userDetails.id,
    );

    this.setState({
      confirmRemoveUser: !this.state.confirmRemoveUser
    });
  }

  renderList() {
    const {
      courses,
      coursesLoading,
      coursesComplete,
      courseSelected,

      users,
      usersLoading,
      usersComplete,
      userSelected,
      //usersFilter,
      userSearchList,
      userSearchKeyword,
      userSearchLoading,
      userSearchComplete,

      className,
      style,
    } = this.props;
    const styles = require('./AdminTrainingLMS.less');
    const { formatMessage } = this.context.intl;
    const { authString, naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, naming);
    const columnWidth = 300;

    const listLeftPosition = 0;

    return (
      <div
        ref={(node) => { this.listWrapper = node; }}
        className={className}
        style={style}
      >
        <AdminManageList
          authString={authString}
          list={courses}
          headerTitle={strings.courses}
          width={columnWidth}
          placeholder={strings.selectCourse}
          itemSelected={courseSelected}

          onItemClick={this.handleCourseClick}

          isLoaded={courses.length > 1}
          isLoading={coursesLoading}
          isLoadingMore={coursesLoading && courses.length > 1 && !coursesComplete}
          isComplete={coursesComplete}
          onGetList={this.handleGetCoursesList}

          showCreate
          onCreateClick={this.handleToggleCreateCourse}
          showEdit
          onEditClick={this.handleEditCourse}

          style={{ position: 'absolute', left: listLeftPosition, top: 0 }}
          className={styles.CustomTab}

          noResultsPlaceholder={strings.noCoursesFound}
        />

        <AdminManageList
          authString={authString}
          list={users}
          headerTitle={strings.users}
          width={columnWidth}
          placeholder={strings.selectUser}
          itemSelected={userSelected}
          initialState={!(courseSelected && courseSelected.id)}

          onItemClick={this.handleUserClick}

          hidePlaceholderArrow
          isLoaded={users.length > 1}
          isLoading={usersLoading}
          isLoadingMore={usersLoading && users.length > 1 && !usersComplete}
          isComplete={usersComplete}
          onGetList={this.handleGetUserList}

          showExisting
          addExistingLabel={strings.addExistingUsers}

          showUnlink
          onUnlinkClick={this.handleToggleConfirmRemoveUser}

          searchList={userSearchList}
          searchInputValue={userSearchKeyword}
          searchInputPlaceholder={strings.addUser}
          searchListHeader={strings.selectUser}
          isSearchLoaded={userSearchList.length > 1}
          isSearchLoading={userSearchLoading}
          isSearchLoadingMore={userSearchLoading && userSearchList.length > 1 && !userSearchComplete}
          isSearchComplete={userSearchComplete}
          onGetSearchList={this.handleGetUserSearchList}
          onSearchChange={this.handleUserSearchInputChange}
          onSearchClear={this.handleUserSearchClear}

          onAddClick={this.handleUserAddSearchItems}
          addTotalItemType="user"

          style={{ position: 'absolute', left: (300 + listLeftPosition), top: 0 }}
          noResultsPlaceholder={strings.noUsersFound}
        />

        {/* Modals */}
        {this.state.confirmRemoveUser && <Dialog
          title={strings.confirmRemoveUserHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.remove}
          onCancel={this.handleToggleConfirmRemoveUser}
          onConfirm={this.handleRemoveUserClick}
        >
          <FormattedMessage
            id="confirm-remove-user-from-course-message"
            defaultMessage={'This action only removes "{name}" from the "{groupName}" Course. "{name}" will still be able to access other courses they have been assigned to.'}
            values={{ name: this.state.userDetails.name, groupName: this.props.courseSelected.name, ...naming }}
            tagName="p"
          />
        </Dialog>}

        {this.state.showPopupBlockerDialog && <Modal
          isVisible
          width="small"
          backdropClosesModal
          escClosesModal
          headerTitle={strings.popupBlockerHeader}
          headerCloseButton
          onClose={this.handleCloseDialog}
        >
          <div className={styles.modalContent}>
            <p>{strings.popupBlockerMessage}</p>
            <Text
              name="copylink"
              value={this.props.lmsURL}
              onChange={() => {}}
              readOnly
              onClick={this.handleFocus}
              onFocus={this.handleFocus}
            />
          </div>
        </Modal>}

        {this.state.showCourceCreateConfirmDialog && <Dialog
          title={strings.confirmCourseCreateHeader}
          isVisible
          cancelText={strings.cancel}
          confirmText={strings.continue}
          onCancel={this.handleToggleCreateCourse}
          onConfirm={this.handleCreateCourse}
        >
          <div className={styles.modalContent}>
            <p>{strings.confirmCourseCreateMessage}</p>
          </div>
        </Dialog>}
      </div>
    );
  }

  render() {
    return (
      this.renderList()
    );
  }
}
