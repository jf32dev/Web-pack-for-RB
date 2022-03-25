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

import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import { Prompt } from 'react-router';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { createPrompt } from 'redux/modules/prompts';
//redux
import {
  getConfBundle,
  setConfBundle,
  setData
} from 'redux/modules/admin/structure';

import Btn from 'components/Btn/Btn';
import Loader from 'components/Loader/Loader';
import AdminConfBundleDetails from 'components/Admin/AdminConfBundleDetails/AdminConfBundleDetails';

const messages = defineMessages({
  editConfBundle: { id: 'edit-configuration-bundle', defaultMessage: 'Edit Configuration Bundle' },
  unsavedChangesMessage: { id: 'unsaved-changes-message', defaultMessage: 'You have unsaved content, are you sure you want to leave?' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  save: { id: 'save', defaultMessage: 'Save' },
  current: { id: 'current', defaultMessage: 'Current' },
  legacy: { id: 'legacy', defaultMessage: 'Legacy' },

  details: { id: 'details', defaultMessage: 'Details' },
  detailsInfo: { id: 'enable-or-disable-general-settings', defaultMessage: 'Enable or disable general settings' },
  integrations: { id: 'integrations', defaultMessage: 'Integrations' },
  integrationsInfo: { id: 'integrations-admin-info', defaultMessage: 'Enable features that integrate Hub with 3rd party platforms.' },
  channels: { id: 'channels', defaultMessage: '{channels}' },
  channelsInfo: { id: 'channels-admin-info', defaultMessage: 'Enable or disable {channel} features.' },
  gamification: { id: 'gamification', defaultMessage: 'Gamification' },
  gamificationInfo: { id: 'gamification-admin-info', defaultMessage: 'Enable or disable gamification features.' },
  device_settings: { id: 'device-settings', defaultMessage: 'Device Settings' },
  device_settingsInfo: { id: 'device-settings-info', defaultMessage: 'Enable or disable device settings below.' },
  features: { id: 'features', defaultMessage: 'Features' },
  featuresInfo: { id: 'features-info', defaultMessage: 'Customize the major features of Hub.' },
  publishing: { id: 'publishing', defaultMessage: 'Publishing' },
  publishingInfo: { id: 'publishing-info', defaultMessage: 'Enable or disable settings that users will see when publishing {stories}.' },
  story_options: { id: 'story-options', defaultMessage: '{story} Options' },
  story_optionsInfo: { id: 'story-options-info', defaultMessage: 'Enable or disable {story} options below.' },
  story_sharing: { id: 'story-sharing', defaultMessage: '{story} Sharing' },
  story_sharingInfo: { id: 'story-sharing-info', defaultMessage: 'Enable or disable share options in {stories}.' },

  // Legacy
  general: { id: 'general', defaultMessage: 'general' },
  generalInfo: { id: 'enable-or-disable-general-settings', defaultMessage: 'Enable or disable general settings' },
  story_settings: { id: 'story-settings', defaultMessage: '{story} Settings' },
  story_settingsInfo: { id: 'enable-or-disable-story-settings', defaultMessage: 'Enable or disable {story} settings.' },
  my_files_legacy: { id: 'my-files', defaultMessage: 'My Files' },
  my_files_legacyInfo: { id: 'enable-or-disable-options-in-my-files', defaultMessage: 'Enable or disable options in My Files' },
  remote_repositories_legacy: { id: 'remote-repositories', defaultMessage: 'Remote Repositories' },
  remote_repositories_legacyInfo: { id: 'remote-repositories-info', defaultMessage: 'Enable or disable one or more remote repositories below' },
  home_screen: { id: 'home-screens', defaultMessage: 'Home Screens' },
  home_screenInfo: { id: 'home-screens-info', defaultMessage: 'Set custom home screens below.' }
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
  const { structure } = state.admin;
  return {
    confBundleDetails: structure.confBundleDetails,
    confBundleDetailsLoading: structure.confBundleDetailsLoading,
    confBundleDetailsLoaded: structure.confBundleDetailsLoaded,
    confBundleDetailsSaved: structure.confBundleDetailsSaved,
    confBundleDetailsSaving: structure.confBundleDetailsSaving,
    accordionState: structure.accordionState,
    hasUnsavedChanges: structure.hasUnsavedChanges,
    confBundleSaved: structure.confBundleSaved,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    getConfBundle,
    setConfBundle,
    setData,

    createPrompt,
  })
)
export default class AdminConfBundleEdit extends Component {
  static propTypes = {
    /** Conf Bundle Id */
    id: PropTypes.number,

    onClose: PropTypes.func,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSection: 'current',
    };
    autobind(this);
  }

  componentDidMount() {
    this.props.getConfBundle(this.props.id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    // Handle save errors
    if (error && error.message && (!this.props.error || error.message !== this.props.error.message)) {
      this.props.createPrompt({
        id: uniqueId('ConfBundle-'),
        type: 'error',
        title: 'Error',
        message: error.message,
        dismissible: true,
        autoDismiss: 10
      });
    }
  }

  // Toggle Active section
  handleNavClick(event) {
    event.preventDefault();
    const section = event.currentTarget.getAttribute('href').split('#')[1];
    this.setState({ activeSection: section });
  }

  handleClose(event) {
    event.preventDefault();
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  handleToggleAccordion(section, isOpen) {
    this.props.setData({
      accordionState: {
        ...this.props.accordionState,
        [section + '_' + this.state.activeSection]: isOpen
      }
    });
  }

  handleAttributeChange(attribute, value, section) {
    const list = { ...this.props.confBundleDetails };
    const item = list[this.state.activeSection][section].find(bundle => bundle.id === attribute);
    item.value = value;

    this.props.setData({
      confBundleDetails: list,
      hasUnsavedChanges: true
    });
  }

  handleSaveClick() {
    const data = { ...this.props.confBundleDetails };
    this.props.setConfBundle(this.props.id, data);
  }

  handleAccordionIconType(type) {
    let icon;
    switch (type) {
      case 'details':
        icon = 'note';
        break;
      case 'features':
        icon = 'folders';
        break;
      case 'integrations':
        icon = 'folders';
        break;
      case 'gamification':
        icon = 'gamification';
        break;
      case 'channels':
        icon = 'folders';
        break;
      case 'publishing':
        icon = 'edit-box';
        break;
      case 'story_options':
        icon = 'folders';
        break;
      case 'story_sharing':
        icon = 'folders';
        break;
      case 'device_settings':
        icon = 'mobile';
        break;
      default:
        icon = 'note';
        break;
    }
    return icon;
  }

  render() {
    const {
      confBundleDetails,
      confBundleDetailsLoading,
      confBundleDetailsLoaded,
    } = this.props;
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { activeSection } = this.state;
    const styles = require('./AdminConfBundleEdit.less');

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Available sections
    const sections = [{
      id: 'current',
      name: strings.current,
      enabled: true,
    }, {
      id: 'legacy',
      name: strings.legacy,
      enabled: true,
    }];

    const confBundleList = confBundleDetails[activeSection];

    // Loading indicator
    if (!confBundleDetailsLoaded || confBundleDetailsLoading) {
      return (<div className={styles.AdminConfBundleEdit}>
        <Loader type="page" />
      </div>);
    }

    return (
      <div className={styles.AdminConfBundleEdit}>
        <Helmet>
          <title>{strings.editConfBundle}</title>
        </Helmet>
        <header className={styles.editHeader}>
          <nav className="horizontal-nav">
            <ul>
              {sections.map(s => (s.enabled &&
                <NavItem key={s.id} rootUrl="/" active={activeSection === s.id} onClick={this.handleNavClick} {...s} />
              ))}
            </ul>
          </nav>
          <div className={styles.actions}>
            <Btn alt large onClick={this.handleClose}>
              {strings.cancel}
            </Btn>
            <Btn inverted large disabled={!this.props.hasUnsavedChanges} loading={this.props.confBundleDetailsSaving} onClick={this.handleSaveClick}>
              {strings.save}
            </Btn>
          </div>
        </header>

        {Object.keys(confBundleList).map((section) => (
          <AdminConfBundleDetails
            key={section + '_' + activeSection}
            icon={this.handleAccordionIconType(section)}
            section={section}
            onChange={this.handleAttributeChange}
            isOpen={this.props.accordionState[section + '_' + activeSection]}
            onToggle={this.handleToggleAccordion}
            header={strings[section] || section}
            description={strings[section + 'Info']}
            list={confBundleList[section]}
            toggle={uniqueId('bundle')}
          />
        ))}

        <Prompt
          when={this.props.hasUnsavedChanges && !this.props.confBundleSaved}
          message={strings.unsavedChangesMessage}
        />
      </div>
    );
  }
}
