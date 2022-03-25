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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import difference from 'lodash/difference';
import differenceBy from 'lodash/differenceBy';
import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';
import { Prompt } from 'react-router';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';
import {
  addSkill,
  addUserMetadata,
  changeUserMetadata,
  deleteUserMetadata,
  clearSkillSuggestions,
  deleteSkill,
  searchSkills,

  loadProfile,
  close,
  setAttributeValue,
  saveUser,
} from 'redux/modules/user';
import {
  getUserMetadata,
  resetNewUserMetadata,
  setAttribute,
  toggleUserMetadata,
} from 'redux/modules/settings';

import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import UserEditDetails from 'components/UserEdit/UserEditDetails';
import UserEditProfile from 'components/UserEdit/UserEditProfile';
import UserEditSocial from 'components/UserEdit/UserEditSocial';
import UserMetadata from 'components/UserMetadata/UserMetadata';

const messages = defineMessages({
  editProfile: { id: 'edit-profile', defaultMessage: 'Edit profile' },
  profile: { id: 'profile', defaultMessage: 'Profile' },
  details: { id: 'details', defaultMessage: 'Details' },
  social: { id: 'social', defaultMessage: 'Social' },
  company: { id: 'company', defaultMessage: 'Company' },
  metadataAttributes: { id: 'metadata-attributes', defaultMessage: 'Metadata attributes' },

  save: { id: 'save', defaultMessage: 'Save' },
  saving: { id: 'saving', defaultMessage: 'Saving' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  unsavedChangesMessage: { id: 'unsaved-changes-message', defaultMessage: 'You have unsaved content, are you sure you want to leave?' }
});

const NavItem = (props) => {
  const { rootUrl, id, name, active, onClick } = props;

  return (
    <li>
      <a href={rootUrl + '#' + id} title={name} onClick={onClick} className={active ? 'active' : null}>{name}</a>
    </li>
  );
};

function mapStateToProps(state) {
  const { entities, settings, user } = state;
  const id = user.id;
  const defaults = settings.user; // TODO - get default skills

  // Merge User Profile
  const details = {
    ...entities.users[id],
    ...user,  // note user store overrides for edit
  };

  // Merge social data
  const loadedSocial = entities.users[id] ? entities.users[id].social : {};
  const social = {
    ...loadedSocial,
    ...user.social
  };

  // Use topTags as suggestedSkills if none set
  const suggestedSkills = user.suggestedSkills.length ? user.suggestedSkills : defaults.popularSkills;

  // Remove skills from suggestedTags
  const filteredSkills = difference(suggestedSkills, user.skills);

  // const metadataValues = settings.metadataValues.map(id => settings.metadataValuesById[id]);
  const metadataValues = settings.metadataValues.map(function (mid) {
    const newObj = settings.metadataValuesById[mid];
    const attrId = settings.metadataValuesById[mid].attribute;
    if (!isNaN(attrId)) newObj.attribute = settings.metadataAttributesById[attrId];
    return newObj;
  });

  // Conver object to array
  const metadataAttributes = Object.keys(settings.metadataAttributesById).map(key => settings.metadataAttributesById[key]);

  return {
    ...details,
    profileError: user.saveError,
    suggestedSkills: filteredSkills,
    skills: user.skills,
    social: social,
    originalThumbnail: user.originalThumbnail,

    hasUnsavedChanges: user.hasUnsavedChanges,
    userSaving: user.saving,
    userSaved: user.saved,

    metadataAttributes: metadataAttributes,
    metadataValues: metadataValues,
    userMetadataLoaded: settings.userMetadataLoaded,
    userMetadataLoading: settings.userMetadataLoading
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addUserMetadata,
    changeUserMetadata,
    deleteUserMetadata,

    addSkill,
    clearSkillSuggestions,
    deleteSkill,
    searchSkills,

    loadProfile,
    close,
    setAttributeValue,
    saveUser,

    getUserMetadata,
    resetNewUserMetadata,
    setAttribute,
    toggleUserMetadata,

    createPrompt,
  })
)
export default class UserEdit extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSection: 'profile',
      thumbnailHasChanged: false
    };
    autobind(this);

    // refs
    this.scrollContainer = null;
    this.section = [];
  }

  UNSAFE_componentWillMount() {
    const { previousLocation } = window;
    const { location } = this.props;

    // Keep track of referring path to accurately redirect on Story Detail Close
    if (location.state && location.state.previousPath) {
      this.previousPath = location.state.previousPath;
    } else if (previousLocation && previousLocation.pathname && previousLocation.pathname.indexOf('profile/edit') === -1) {
      this.previousPath = previousLocation.pathname;
    } else {
      this.previousPath = '/';
    }
  }

  componentDidMount() {
    const id = this.context.settings.user.id;

    if (!this.props.profileLoaded) {
      this.props.loadProfile(id);
    }

    if (!this.props.metadataValues.length) {
      this.props.getUserMetadata();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { profileError } = nextProps;
    // Handle save errors
    if (profileError && profileError.message && (!this.props.profileError || profileError.message !== this.props.profileError.message)) {
      this.props.createPrompt({
        id: uniqueId('settings-'),
        type: 'error',
        title: 'Error',
        message: profileError.message,
        dismissible: true,
        autoDismiss: 10
      });
    }
  }

  componentDidUpdate(prevProps) {
    // Redirect to User Detail if saved
    if (prevProps.userSaving && this.props.userSaved && !Object.keys(this.props.profileError).length) {
      this.props.history.push({
        pathname: '/profile',
        query: null,
        state: { previousPath: '/profile/edit' }
      });
    }
  }

  componentWillUnmount() {
    if (this.state.thumbnailHasChanged) {
      this.props.setAttribute('thumbnail', this.props.originalThumbnail, 'user');
    }
  }

  handleScroll() {
    const target = this.scrollContainer;
    const sections = Array.from(target.children).reverse();  // reverse order
    const scrollTop = target.scrollTop;
    const se = 50;

    // first section default
    let activeSection = sections[sections.length - 1].dataset.id;
    for (const section of sections) {
      if (scrollTop >= (section.offsetTop - se)) {
        activeSection = section.dataset.id;
        break;
      }
    }

    this.setState({ activeSection: activeSection });
  }

  handleNavClick(event) {
    event.preventDefault();
    const section = event.currentTarget.getAttribute('href').split('#')[1];
    const scrollTo = this.section[section].offsetTop;

    this.scrollContainer.scrollTop = scrollTo;
    this.setState({ activeSection: section });
  }

  handleAnchorClick(event) {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleClose(event) {
    event.preventDefault();
    this.props.history.push('/profile');
  }

  handleProfileAttributeChange(event, data) {
    this.props.setAttributeValue(data.attribute, data.value);
    this.props.setAttribute(data.attribute, data.value, 'user');
    if (data.attribute === 'thumbnail') {
      this.setState({ thumbnailHasChanged: true });
    }
  }

  handleDetailsAttributeChange(event, data) {
    if (data.attribute === 'landlineNumber' || data.attribute === 'mobileNumber' || data.attribute === 'shareBCCEmail') {
      this.props.setAttributeValue(data.attribute, data.value);
    } else {
      this.props.setAttributeValue(data.attribute, data.value, 'companyData');
    }
  }

  handleSocialAttributeChange(event, data) {
    this.props.setAttributeValue(data.attribute, data.value, 'social');
  }

  // Avatar Picker
  handleThumbnailClick() {
    // Clear thumbnail if one is already set
    if (this.props.thumbnail) {
      this.props.setAttributeValue('thumbnail', '');
      this.setState({ thumbnailHasChanged: false });
    }
  }

  /**
   * Skills
   */
  handleAddSkill(event, tagName) {
    this.props.addSkill(tagName);
  }

  handleDeleteSkill(event, tagIndex) {
    this.props.deleteSkill(tagIndex);
  }

  handleSearchSkillChange(event, value) {
    if (!value) {
      this.props.clearSkillSuggestions();
    } else {
      this.props.searchSkills(value);
    }
  }

  /*
  * User Metadata
  */
  // values currently selected
  handleOnChangeAttribute(newValue, context) {
    this.props.changeUserMetadata(newValue, context.valueSelected);
  }

  // Value from add list
  handleOnChangeValue(changedItem, toggle) {
    this.props.toggleUserMetadata(changedItem, toggle);
  }

  handleOnAddMetadataValue(items) {
    this.props.addUserMetadata(items);
  }

  handleOnDeleteAttribute(event, context) {
    this.props.deleteUserMetadata(context.valueSelected);
  }

  handleOnResetValues() {
    this.props.resetNewUserMetadata();
  }

  //---

  handleSaveClick() {
    const userId = this.context.settings.user.id;
    const userData = {
      skills: this.props.skills,
      social: this.props.social,
      metadata: this.props.metadata,
      companyData: this.props.companyData,
      shareBCCEmail: this.props.shareBCCEmail,
      landlineNumber: this.props.landlineNumber,
      mobileNumber: this.props.mobileNumber,
      firstname: this.props.firstname,
      lastname: this.props.lastname,
      userEmail: this.props.email,
      jobTitle: this.props.jobTitle,
    };

    if (this.props.thumbnail && this.state.thumbnailHasChanged) {
      userData.thumbnail = this.props.thumbnail;
      this.setState({ thumbnailHasChanged: false });
    }

    this.props.saveUser(userId, userData);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { activeSection } = this.state;
    const rootUrl = this.props.location.pathname;
    const styles = require('./UserEdit.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Available sections
    const sections = [{
      id: 'profile',
      name: strings.profile,
      hideHeader: true,
      enabled: true,
      component: (<UserEditProfile
        onChange={this.handleProfileAttributeChange}
        onSkillAdd={this.handleAddSkill}
        onSkillDelete={this.handleDeleteSkill}
        onSkillSearchChange={this.handleSearchSkillChange}
        authString={this.context.settings.authString}
        {...this.props}
      />)
    }, {
      id: 'details',
      name: strings.details,
      enabled: true,
      component: (<UserEditDetails
        onChange={this.handleDetailsAttributeChange}
        {...this.props.companyData}
        shareBCCEmail={this.props.shareBCCEmail}
        landlineNumber={this.props.landlineNumber}
        mobileNumber={this.props.mobileNumber}
      />)
    }, {
      id: 'social',
      name: strings.social,
      enabled: true,
      component: (<UserEditSocial
        onChange={this.handleSocialAttributeChange}
        {...this.props.social}
      />)
    }, {
      id: 'company',
      name: strings.metadataAttributes,
      enabled: true,
      component: (<UserMetadata
        attributeList={this.props.metadataAttributes}
        valuesSelectedList={this.props.metadata}
        valuesList={differenceBy(this.props.metadataValues, this.props.metadata, 'id')}
        onDelete={this.handleOnDeleteAttribute}
        onChange={this.handleOnChangeAttribute}

        onAdd={this.handleOnAddMetadataValue}
        onResetNewItemList={this.handleOnResetValues}
        onChangeNewItem={this.handleOnChangeValue}
        {...this.props}
      />)
    }];

    // Loading indicator
    if (!this.props.profileLoaded || this.props.profileLoading) {
      return <Loader type="page" />;
    }

    return (
      <div className={styles.UserEdit}>
        <Helmet>
          <title>{strings.editProfile}</title>
        </Helmet>
        <header className={styles.editHeader}>
          <nav className="horizontal-nav">
            <ul>
              {sections.map(s => (s.enabled &&
                <NavItem key={s.id} rootUrl={rootUrl} active={activeSection === s.id} onClick={this.handleNavClick} {...s} />
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            <Btn alt large onClick={this.handleClose}>
              {strings.cancel}
            </Btn>
            <Btn inverted large disabled={!this.props.hasUnsavedChanges} loading={this.props.userSaving} onClick={this.handleSaveClick}>
              {strings.save}
            </Btn>
          </div>
        </header>

        <div
          ref={(c) => { this.scrollContainer = c; }}
          onScroll={this.handleScroll}
          className="scrollContainer"
        >
          {sections.map(s => (s.enabled &&
            <section
              key={s.id}
              ref={(c) => { this.section[s.id] = c; }}
              data-id={s.id}
              className={styles.editSection}
            >
              {!s.hideHeader && <h3>{s.name}</h3>}
              {s.component}
            </section>
          ))}
        </div>

        <Prompt
          when={this.props.hasUnsavedChanges && !this.props.userSaved}
          message={strings.unsavedChangesMessage}
        />
      </div>
    );
  }
}
