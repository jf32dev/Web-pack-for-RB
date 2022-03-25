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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  Route,
  Switch
} from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import {
  setLastAdminRoute
} from 'redux/modules/settings';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';

import AdminMenu from 'components/Admin/AdminMenu/AdminMenu';
import AdminIndex from 'components/Admin/AdminIndex/AdminIndex';

import AdminApplicationRestrictions from 'containers/AdminApplicationRestrictions/AdminApplicationRestrictions';
import AdminArchivedStories from 'containers/AdminArchivedStories/AdminArchivedStories';
import AdminCloudServices from 'containers/AdminCloudServices/AdminCloudServices';
//import AdminConfBundle from 'containers/AdminConfBundle/AdminConfBundle';
import AdminContentAlgorithm from 'containers/AdminContentAlgorithm/AdminContentAlgorithm';
import AdminContentBadges from 'containers/AdminContentBadges/AdminContentBadges';
import AdminCRMIntegration from 'containers/AdminCRMIntegration/AdminCRMIntegration';
import AdminCSP from 'containers/AdminCSP/AdminCSP';
import AdminCustomApps from 'containers/AdminCustomApps/AdminCustomApps';
import AdminCustomization from 'containers/AdminCustomization/AdminCustomization';
import AdminCustomWelcome from 'containers/AdminCustomWelcome/AdminCustomWelcome';
import AdminDevices from 'containers/AdminDevices/AdminDevices';
import AdminEmailCompliance from 'containers/AdminEmailCompliance/AdminEmailCompliance';
import AdminEmailTemplates from 'containers/AdminEmailTemplates/AdminEmailTemplates';
import AdminFileGeneral from 'containers/AdminFileGeneral/AdminFileGeneral';
import AdminFileDefaults from 'containers/AdminFileDefaults/AdminFileDefaults';
import AdminFileUploads from 'containers/AdminFileUploads/AdminFileUploads';
import AdminGeneralGeneral from 'containers/AdminGeneralGeneral/AdminGeneralGeneral';
import AdminHomeScreens from 'containers/AdminHomeScreens/AdminHomeScreens';
import AdminHubsharePortal from 'containers/AdminHubsharePortal/AdminHubsharePortal';
import AdminInterestAreas from 'containers/AdminInterestAreas/AdminInterestAreas';
import AdminNamingConvention from 'containers/AdminNamingConvention/AdminNamingConvention';
import AdminNotificationLogo from 'containers/AdminNotificationLogo/AdminNotificationLogo';
import AdminPasswordRules from 'containers/AdminPasswordRules/AdminPasswordRules';
import AdminSecurityAuthentication from 'containers/AdminSecurityAuthentication/AdminSecurityAuthentication';
import AdminSecurityDNS from 'containers/AdminSecurityDNS/AdminSecurityDNS';
import AdminSecurityGeneral from 'containers/AdminSecurityGeneral/AdminSecurityGeneral';
import AdminSMTPSetup from 'containers/AdminSMTPSetup/AdminSMTPSetup';
import AdminSocialAlgorithm from 'containers/AdminSocialAlgorithm/AdminSocialAlgorithm';
import AdminSocialBadges from 'containers/AdminSocialBadges/AdminSocialBadges';
import AdminStoryArchiving from 'containers/AdminStoryArchiving/AdminStoryArchiving';
import AdminStoryDefaults from 'containers/AdminStoryDefaults/AdminStoryDefaults';
import AdminStoryGeneral from 'containers/AdminStoryGeneral/AdminStoryGeneral';
import AdminStructure from 'containers/AdminStructure/AdminStructure';
import AdminSyncEngine from 'containers/AdminSyncEngine/AdminSyncEngine';
import AdminTaggingGuidelines from 'containers/AdminTaggingGuidelines/AdminTaggingGuidelines';
import AdminTrainingLMS from 'containers/AdminTrainingLMS/AdminTrainingLMS';
import AdminTrainingLRS from 'containers/AdminTrainingLRS/AdminTrainingLRS';
import AdminUsers from 'containers/AdminUsers/AdminUsers';
import AdminUserMetadata from 'containers/AdminUserMetadata/AdminUserMetadata';
import AdminWebsites from 'containers/AdminWebsites/AdminWebsites';
import AdminZunosLMS from 'containers/AdminZunosLMS/AdminZunosLMS';
import AdminContentRecommender from 'containers/AdminContentRecommender/AdminContentRecommender';

const messages = defineMessages({
  platformConfiguration: { id: 'platform-configuration', defaultMessage: 'Platform Configuration' },

  // Menu
  'story': { id: 'story', defaultMessage: '{story}' },
  'stories': { id: 'stories', defaultMessage: '{stories}' },
  'story-defaults': { id: 'story-defaults', defaultMessage: '{story} Defaults' },
  'system': { id: 'system', defaultMessage: 'System' },
  'users': { id: 'users', defaultMessage: 'Users' },
  'content': { id: 'content', defaultMessage: 'Content' },
  'general': { id: 'general', defaultMessage: 'General' },
  'crm-integration': { id: 'crm-integration', defaultMessage: 'CRM Integration' },
  'custom-naming-convention': { id: 'custom-naming-convention', defaultMessage: 'Custom Naming Convention' },
  'home-screens': { id: 'home-screens', defaultMessage: 'Home Screens' },
  'security': { id: 'security', defaultMessage: 'Security' },
  'structure': { id: 'structure', defaultMessage: 'Structure' },
  'learning': { id: 'learning', defaultMessage: 'Learning' },
  'lrs': { id: 'unstructured-learning', defaultMessage: 'Unstructured Learning' },
  'lms': { id: 'structured-learning', defaultMessage: 'Structured Learning' },
  'websites': { id: 'websites', defaultMessage: 'Websites' },
  'configuration-bundles': { id: 'configuration-bundles', defaultMessage: 'Configuration Bundles' },
  'custom-user-metadata': { id: 'custom-user-metadata', defaultMessage: 'Custom User Metadata' },
  'gamification': { id: 'gamification', defaultMessage: 'Gamification' },
  'user-self-enrolment': { id: 'user-self-enrolment', defaultMessage: 'User Self Enrolment' },
  'email': { id: 'email', defaultMessage: 'Email' },
  'files': { id: 'files', defaultMessage: 'Files' },
  'interest-areas': { id: 'interest-areas', defaultMessage: 'Interest Areas' },
  'customization': { id: 'customization', defaultMessage: 'Customization' },
  'custom-welcome': { id: 'custom-welcome', defaultMessage: 'Custom Welcome' },
  'authentication': { id: 'authentication', defaultMessage: 'Authentication' },
  'application-restrictions': { id: 'application-restrictions', defaultMessage: 'Application Restrictions' },
  'dns': { id: 'dns', defaultMessage: 'DNS' },
  'devices': { id: 'devices', defaultMessage: 'Devices' },
  'password-rules': { id: 'password-rules', defaultMessage: 'Password Rules' },
  'social-iq-algorithm': { id: 'social-iq-algorithm', defaultMessage: 'Social IQ Algorithm' },
  'social-iq-badges': { id: 'social-iq-badges', defaultMessage: 'Social IQ Badges' },
  'content-iq-algorithm': { id: 'content-iq-algorithm', defaultMessage: 'Content IQ Algorithm' },
  'content-iq-badges': { id: 'content-iq-badges', defaultMessage: 'Content IQ Badges' },
  'archiving': { id: 'archiving', defaultMessage: 'Archiving' },
  'archive-settings': { id: 'archive-settings', defaultMessage: 'Archive Settings' },
  'archived-stories': { id: 'archived-stories', defaultMessage: 'Archived {stories}' },
  'metadata': { id: 'metadata', defaultMessage: 'Metadata' },
  'compliance': { id: 'compliance', defaultMessage: 'Compliance' },
  'templates': { id: 'templates', defaultMessage: 'Templates' },
  'sender-information': { id: 'sender-information', defaultMessage: 'Sender Information' },
  'smtp-server-setup': { id: 'smtp-server-setup', defaultMessage: 'SMTP Server Setup' },
  'defaults': { id: 'file-defaults', defaultMessage: 'File Defaults' },
  'file-uploads': { id: 'file-uploads', defaultMessage: 'File Uploads' },
  'cloud-services': { id: 'cloud-services-for-users', defaultMessage: 'Cloud Services for Users' },
  'sync-engine': { id: 'cloud-services-for-publishers', defaultMessage: 'Cloud Services for Publishers' },
  'searchSettings': { id: 'search-settings', defaultMessage: 'Search Settings' },
  'custom-apps': { id: 'custom-apps', defaultMessage: 'Custom Apps' },
  'selectCategoryOrSearchBelow': { id: 'select-category-or-search-below', defaultMessage: 'Select a category on the left or search for settings below.' },
  'content-security-policy': { id: 'content-security-policy', defaultMessage: 'Content Security Policy' },
  'hubshare-portal': { id: 'hubshare-portal', defaultMessage: 'HubShare Portal' },
  'custom-naming': { id: 'custom-naming', defaultMessage: 'Custom Naming Convention' },
  comingSoon: { id: 'page-coming-soon-message', defaultMessage: 'We’re still building this page for you, please check back soon.' },
  'tagging-guidelines': { id: 'tagging-guidelines', defaultMessage: 'Tagging Guidelines' },
  'digest-email': { id: 'digest-email', defaultMessage: 'Digest Email' },
  'notification-logo': { id: 'notification-logo', defaultMessage: 'Notification logo' },
  'advanced': { id: 'advanced', defaultMessage: 'Advanced' },
  'content-recommender': { id: 'content-recommender', defaultMessage: 'Content Recommender' },
});

@connect(null,
  bindActionCreatorsSafe({
    setLastAdminRoute
  })
)
export default class Admin extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isMenuCollapse: false,
      menuWith: 310,
      activeList: 0,
      selectedUrl: props.location.pathname,
      selectedMenu: []
    };
    autobind(this);

    // Routes with sub-routes
    this.subRoutes = [
      `${props.match.url}/general`,
      `${props.match.url}/security`,
      `${props.match.url}/learning`,
      `${props.match.url}/gamification`,
      `${props.match.url}/stories`,
      `${props.match.url}/email`,
      `${props.match.url}/files`,
    ];

    this.previousLocation = props.location;
  }

  UNSAFE_componentWillMount() {
    const { adminUI } = this.context.settings;
    const { url } = this.props.match;

    // Parse admin route
    const adminRoute = pathToRegexp('/admin/:section?/:link?');
    const adminRouteMatch = adminRoute.exec(location.pathname);
    const section = adminRouteMatch[1];
    const link = adminRouteMatch[2];

    let basePath = section ? url + '/' + section : url;
    const sectionOption = adminUI.find(obj => obj.name === section);
    const linkOption = link && sectionOption && sectionOption.options.length ? sectionOption.options.find(obj => obj.name === link) : '';
    let parentMenu = [];

    if (linkOption) {
      parentMenu = sectionOption && !sectionOption.options.length ? [{
        ...sectionOption,
        path: basePath
      }] : [{ ...sectionOption, path: url }];
    }

    // Valid Submenu selected
    if (link && linkOption) {
      basePath = basePath + '/' + link;

    // Wrong submenu or no access go to root level
    } else if (link || sectionOption && sectionOption.options.length) {
      basePath = url;
      this.props.history.replace(url);
    }

    if (sectionOption) {
      this.setState({
        activeList: link && linkOption ? 1 : 0,
        selectedUrl: basePath,
        selectedMenu: linkOption ? [...parentMenu, { ...linkOption, path: basePath }] : [...parentMenu],
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { adminUI } = this.context.settings;

    // Go to home page if no admin ui is returned
    if ((!adminUI || !adminUI.length) && this.context.router) this.context.router.push('/');

    // Save current route
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.setLastAdminRoute(nextProps.location.pathname);

      // Reset menu selection
      if (nextProps.location.pathname === this.props.match.url) {
        this.setState({
          activeList: 0,
          selectedMenu: []
        });
      }
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { location, match } = this.props;
    if (
      nextProps.history.action !== 'POP' &&
      location.pathname !== match.url &&
      this.subRoutes.indexOf(location.pathname) === -1
    ) {
      this.previousLocation = location;
    }
  }

  handleMenuClick(event, context) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const isThereSubMenu = context.options && context.options.length > 0;

    this.setState({
      activeList: !isThereSubMenu && typeof context.options !== 'undefined' ? 0 : 1,
      selectedUrl: !isThereSubMenu ? href : '',
      selectedMenu: isThereSubMenu ? [...this.state.selectedMenu, context] : this.state.selectedMenu
    });
    this.props.history.replace(href);
  }

  handleToggleMenuClick(isExpand) {
    const isCollapse = isExpand ? false : !this.state.isMenuCollapse;
    this.setState({
      isMenuCollapse: isCollapse,
      menuWith: isCollapse ? 95 : 310
    });
  }

  // Index page filter
  handleAnchorClick(event, context) {
    const {
      match
    } = this.props;
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    this.props.history.push(href);
    let breadcrumb = [];

    // root menu doesnt have breadcrumb
    if (context.path.length && (match.url + '/' + context.path[0].value !== href)) {
      breadcrumb = [{
        name: context.path[0].value,
        path: match.url + '/' + context.path[0].value
      }];
    }

    this.setState({
      activeList: breadcrumb.length ? 1 : 0,
      selectedUrl: href,
      selectedMenu: [...breadcrumb]
    });
  }

  handleV4Redirect(link) {
    return `${window.BTC.WEBAPPV4_URL}#access_token=${localStorage.BTCTK_A}&expires_in=${localStorage.expires_in}&path=${link}`;
  }

  render() {
    const { adminUI, naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const { match, location } = this.props;
    const { selectedUrl, selectedMenu, isMenuCollapse } = this.state;
    const styles = require('./Admin.less');
    const cx = classNames.bind(styles);
    const contentWrapperClasses = cx({
      contentWrapper: true
    });

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    // Menu breadcrumb
    const breadcrumb = [{
      name: strings.platformConfiguration,
      path: match.url
    }];

    if (selectedMenu.length) {
      breadcrumb.push({
        name: strings[selectedMenu[0].name],
        path: selectedMenu[0].path
      });
    }
    const contentStyle = {
      left: this.state.menuWith + 42
    };

    // Render previous route (persist selected section)
    const renderPrevious = location.pathname === match.url || this.subRoutes.indexOf(location.pathname) > -1;

    const V4Links = {
      confBundleV4Link: 'admin/tenant-config/configuration-bundles',
      digestEmailV4Link: 'admin/tenant-config/email',
      metadataV4Link: 'admin/tenant-config/stories/metadata'
    };

    const hasContentRecommender = !!adminUI.find((item) => item.name === 'content-recommender');

    return (
      <div className={styles.Admin}>
        <Helmet title={strings.platformConfiguration} />
        <AppHeader
          showBreadcrumbs
          paths={breadcrumb}
        />
        <AdminMenu
          basePath={match.url}
          lists={adminUI}
          activeList={this.state.activeList}
          selectedMenu={selectedMenu}
          selectedUrl={selectedUrl}
          width={this.state.menuWith}
          onClick={this.handleMenuClick}
          isMenuCollapse={isMenuCollapse}
          showToggleMenu
          onToggleMenu={this.handleToggleMenuClick}
          strings={strings}
          className={styles.adminMenu}
        />
        <div className={contentWrapperClasses} style={contentStyle}>
          <Switch location={renderPrevious ? this.previousLocation : location}>
            <Route path={`${match.url}/general/general`} component={AdminGeneralGeneral} />
            <Route path={`${match.url}/general/customization`} component={AdminCustomization} />
            <Route path={`${match.url}/general/custom-welcome`} component={AdminCustomWelcome} />
            <Route path={`${match.url}/general/hubshare-portal`} component={AdminHubsharePortal} />
            <Route path={`${match.url}/crm-integration`} component={AdminCRMIntegration} />
            <Route path={`${match.url}/home-screens`} component={AdminHomeScreens} />
            <Route path={`${match.url}/custom-naming`} component={AdminNamingConvention} />

            <Route path={`${match.url}/security/general`} component={AdminSecurityGeneral} />
            <Route path={`${match.url}/security/devices`} component={AdminDevices} />
            <Route path={`${match.url}/security/dns`} component={AdminSecurityDNS} />
            <Route path={`${match.url}/security/password-rules`} component={AdminPasswordRules} />
            <Route path={`${match.url}/security/authentication`} component={AdminSecurityAuthentication} />
            <Route path={`${match.url}/security/application-restrictions`} component={AdminApplicationRestrictions} />
            <Route path={`${match.url}/security/content-security-policy`} component={AdminCSP} />

            <Route path={`${match.url}/structure`} component={AdminStructure} />
            <Route path={`${match.url}/websites`} component={AdminWebsites} />

            <Route path={`${match.url}/learning/lrs`} component={AdminTrainingLRS} />
            <Route path={`${match.url}/learning/lms-legacy`} component={AdminTrainingLMS} />
            <Route path={`${match.url}/learning/lms`} component={AdminZunosLMS} />

            <Route path={`${match.url}/users`} component={AdminUsers} />
            <Route
              path={`${match.url}/configuration-bundles`}
              render={() => (<Fragment>
                <header style={{ paddingLeft: '2rem' }}>
                  <h3>{strings['configuration-bundles']}</h3>
                </header>
                <Blankslate
                  icon="wheelbarrow"
                  iconSize={128}
                  heading={strings.comingSoon}
                  message={
                    <span>To update Configuration bundles settings please <a target="_blank" rel="noopener noreferrer" href={this.handleV4Redirect(V4Links.confBundleV4Link)}>use the v4 web app.</a></span>
                  }
                  middle
                />
              </Fragment>)}
            />

            <Route path={`${match.url}/gamification/social-iq-algorithm`} component={AdminSocialAlgorithm} />
            <Route path={`${match.url}/gamification/social-iq-badges`} component={AdminSocialBadges} />
            <Route path={`${match.url}/gamification/content-iq-algorithm`} component={AdminContentAlgorithm} />
            <Route path={`${match.url}/gamification/content-iq-badges`} component={AdminContentBadges} />

            <Route path={`${match.url}/stories/general`} component={AdminStoryGeneral} />
            <Route path={`${match.url}/stories/archive-settings`} component={AdminStoryArchiving} />
            <Route
              path={`${match.url}/stories/archived-stories`}
              render={routeProps => (<AdminArchivedStories
                {...routeProps}
                {...this.props}
              />)}
            />
            <Route path={`${match.url}/stories/story-defaults`} component={AdminStoryDefaults} />
            <Route path={`${match.url}/stories/tagging-guidelines`} component={AdminTaggingGuidelines} />
            <Route
              path={`${match.url}/stories/metadata`}
              render={() => (<Fragment>
                <header style={{ paddingLeft: '2rem' }}>
                  <h3>{strings.metadata}</h3>
                </header>
                <Blankslate
                  icon="wheelbarrow"
                  iconSize={128}
                  heading={strings.comingSoon}
                  message={<span>To update metadata settings please <a target="_blank" rel="noopener noreferrer" href={this.handleV4Redirect(V4Links.metadataV4Link)}>use the v4 web app.</a></span>}
                  middle
                />
              </Fragment>)}
            />
            <Route path={`${match.url}/custom-apps`} component={AdminCustomApps} />

            <Route path={`${match.url}/email/templates`} component={AdminEmailTemplates} />
            <Route path={`${match.url}/email/compliance`} component={AdminEmailCompliance} />
            <Route path={`${match.url}/email/smtp-server-setup`} component={AdminSMTPSetup} />
            <Route
              path={`${match.url}/email/digest-email`}
              render={() => (<Fragment>
                <header style={{ paddingLeft: '2rem' }}>
                  <h3>{strings['digest-email']}</h3>
                </header>
                <Blankslate
                  icon="wheelbarrow"
                  iconSize={128}
                  heading={strings.comingSoon}
                  message={
                    <span>To update Digest Email settings please <a target="_blank" rel="noopener noreferrer" href={this.handleV4Redirect(V4Links.digestEmailV4Link)}>use the v4 web app.</a></span>
                  }
                  middle
                />
              </Fragment>)}
            />
            <Route path={`${match.url}/email/notification-logo`} component={AdminNotificationLogo} />
            <Route path={`${match.url}/files/general`} component={AdminFileGeneral} />
            <Route path={`${match.url}/files/defaults`} component={AdminFileDefaults} />
            <Route path={`${match.url}/files/file-uploads`} component={AdminFileUploads} />
            <Route path={`${match.url}/files/cloud-services`} component={AdminCloudServices} />
            <Route path={`${match.url}/files/sync-engine`} component={AdminSyncEngine} />

            <Route path={`${match.url}/custom-user-metadata`} component={AdminUserMetadata} />

            <Route path={`${match.url}/interest-areas`} component={AdminInterestAreas} />

            {hasContentRecommender && <Route path={`${match.url}/content-recommender`} component={AdminContentRecommender} />}

            <Route
              path={match.url}
              render={(props) => (<AdminIndex
                {...props}
                basePath={match.url}
                list={adminUI}
                placeholder={strings.searchSettings}
                strings={strings}
                onAnchorClick={this.handleAnchorClick}
                className={styles.adminIndex}
              />)}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
