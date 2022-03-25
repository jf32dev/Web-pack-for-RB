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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';

import AvatarPickerModal from './AvatarPickerModal';
import Tags from 'components/Tags/Tags';
import Text from 'components/Text/Text';
import UserThumb from 'components/UserThumb/UserThumb';

const messages = defineMessages({
  firstName: { id: 'first-name', defaultMessage: 'First name' },
  lastName: { id: 'last-name', defaultMessage: 'Last name' },
  emailAddress: { id: 'email-address', defaultMessage: 'Email address' },
  jobTitle: { id: 'job-title', defaultMessage: 'Job title' },
  searchForSkills: { id: 'search-for-skills', defaultMessage: 'Search for skills' },
  addSkills: { id: 'add-skills', defaultMessage: 'Add skills' },
  noneAvailable: { id: 'none-available', defaultMessage: 'None available' },
  changeProfilePicture: { id: 'change-profile-picture', defaultMessage: 'Change profile picture' },
  orSelectFromSuggestedSkills: { id: 'or-select-from-popular-skills', defaultMessage: 'Or select from popular skills below' },
});

function mapStateToProps(state) {
  return { user: state.user };
}
@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,
  })
)
export default class UserEditProfile extends Component {
  static propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    jobTitle: PropTypes.string,
    skills: PropTypes.array,
    suggestedSkills: PropTypes.array,
    thumbnail: PropTypes.string,

    authString: PropTypes.string,

    onChange: PropTypes.func,
    onSkillAdd: PropTypes.func,
    onSkillDelete: PropTypes.func,
    onSkillSearchChange: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currentSearch: '',
      imagePickerModalVisible: false,
      imageUploaded: '',
    };

    autobind(this);

    // refs
    this.fileSelector = null;
  }

  handleOnChange(event) {
    const { onChange } = this.props;
    const attribute = event.currentTarget.name;
    const value = event.currentTarget.value;

    // Propagate event
    if (typeof onChange === 'function') {
      onChange(event, { attribute: attribute, value: value });
    }
  }

  /* TAG functions */
  handleDeleteSkill(event) {
    event.preventDefault();
    const { onSkillDelete } = this.props;
    const tagIndex = event.currentTarget.dataset.index;

    if (typeof onSkillDelete === 'function') {
      onSkillDelete(event, tagIndex);
    }
  }

  handleSuggestedTagClick(event) {
    event.preventDefault();
    const { onSkillAdd } = this.props;
    const tagName = event.currentTarget.dataset.name;

    if (typeof onSkillAdd === 'function') {
      onSkillAdd(event, tagName);
    }
  }

  handleSearchInputChange(event) {
    const { onSkillSearchChange } = this.props;
    const value = event.target.value;

    this.setState({
      currentSearch: value
    });

    // Propagate event
    if (typeof onSkillSearchChange === 'function') {
      onSkillSearchChange(event, value);
    }
  }

  handleInputKeyDown(event) {
    const { onSkillAdd } = this.props;
    const value = event.target.value;

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(value)) {
      event.preventDefault();

      this.setState({ currentSearch: '' });

      if (typeof onSkillAdd === 'function') {
        onSkillAdd(event, value);
      }
    }
  }

  // Upload Image functions
  handleImagePickerCancel() {
    this.setState({
      imagePickerModalVisible: false,
      imageUploaded: '',
    });
  }

  handleImagePickerSave(thumbnail) {
    const { onChange } = this.props;

    // Propagate event
    if (typeof onChange === 'function') {
      onChange(null, { attribute: 'thumbnail', value: thumbnail });
      //onChange(null, { attribute: 'imageUploaded', value: true });
    }
  }

  // Upload Image functions
  handleThumbnailClick() {
    this.fileSelector.value = '';
    this.fileSelector.click();
  }

  handleFileUploadSelected(event) {
    const files = event.target.files; // FileList object

    if (files.length && files[0].size <= 1024 * 1024 * 1) { // not bigger than 1MB
      this.processFileUpload(files[0]);
    } else {
      const imageSizeErrorMesage = (<FormattedMessage
        id="image-size-should-be-less-n"
        defaultMessage="Images size should be less than 1MB"
        values={{ size: '1MB' }}
      />);

      this.props.createPrompt({
        id: uniqueId(),
        type: 'warning',
        title: 'Warning',
        message: imageSizeErrorMesage,
        dismissible: true,
        autoDismiss: 5
      });
      this.setState({
        imagePickerModalVisible: false,
        imageUploaded: '',
      });
    }
  }

  processFileUpload(f) {
    const self = this;
    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function() {
      return function(e) {
        self.setState({
          imageUploaded: e.target.result,
          imagePickerModalVisible: true,
        });
      };
    }(f));

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      firstname,
      lastname,
      email,
      jobTitle,
      thumbnail,
      skills,
      suggestedSkills,
    } = this.props;
    const { currentSearch } = this.state;
    const styles = require('./UserEditProfile.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div>
        <div className={styles.UserEditProfile}>
          <div className={styles.thumbnailContainer}>
            <div className={styles.thumbWrap}>
              <UserThumb
                name={firstname + ' ' + lastname}
                width={200}
                thumbnail={thumbnail}
              />
              <div className={styles.thumbActionText} onClick={this.handleThumbnailClick}>
                {strings.changeProfilePicture}
              </div>
              <input
                ref={(c) => { this.fileSelector = c; }}
                name="files"
                id="files"
                type="file"
                onChange={this.handleFileUploadSelected}
                style={{ display: 'none', opacity: 0 }}
                accept="image/*"
              />
            </div>

            <span className={styles.name}>{firstname + ' ' + lastname}</span>
            <span className={styles.note}>{jobTitle}</span>
          </div>

          <div className={styles.wrapper}>
            <Text
              name="firstname"
              value={firstname}
              placeholder={strings.firstName}
              onChange={this.handleOnChange}
            />
            <Text
              name="lastname"
              value={lastname}
              placeholder={strings.lastName}
              onChange={this.handleOnChange}
            />
            <Text
              name="email"
              value={email}
              type="plain-text"
              placeholder={strings.emailAddress}
              onChange={this.handleOnChange}
              disabled
            />
            <Text
              name="jobTitle"
              value={jobTitle}
              placeholder={strings.jobTitle}
              onChange={this.handleOnChange}
            />
          </div>
        </div>

        <div className={styles.editTags}>
          <div className={styles.tagSearch}>
            <Tags
              strings={strings}
              list={skills}
              onItemDeleteClick={this.handleDeleteSkill}
              className={styles.tagList}
              enableInput
              currentSearch={currentSearch}
              onInputKeyDown={this.handleInputKeyDown}
              onInputChange={this.handleSearchInputChange}
            />
          </div>
          <div className={styles.suggestedSkills}>
            <h5>{strings.addSkills}</h5>
            <span>{strings.orSelectFromSuggestedSkills}</span>
            {suggestedSkills.length === 0 && <p>{strings.noneAvailable}</p>}
            {suggestedSkills.length > 0 && <Tags
              list={suggestedSkills}
              onItemClick={this.handleSuggestedTagClick}
            />}
          </div>
        </div>

        <AvatarPickerModal
          backdropClosesModal
          escClosesModal
          isVisible={this.state.imagePickerModalVisible}
          imageUploaded={this.state.imageUploaded}

          onClose={this.handleImagePickerCancel}
          onSave={this.handleImagePickerSave}
        />
      </div>
    );
  }
}
