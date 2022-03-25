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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';
import {
  Route,
  Switch
} from 'react-router-dom';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import AppHeader from 'components/AppHeader/AppHeader';
import ContactSupport from 'components/Settings/ContactSupport';
import Crm from 'components/Settings/Crm';
import General from 'components/Settings/General';
import InterestArea from 'components/Settings/InterestArea';
import Legal from 'components/Settings/Legal';
import ManageSubscriptions from 'components/Settings/ManageSubscriptions';
import Menu from 'components/Settings/Menu';
import Notifications from 'components/Settings/Notifications';

const messages = defineMessages({
  settings: { id: 'settings', defaultMessage: 'Settings' },

  // Menu
  general: { id: 'general', defaultMessage: 'General' },
  interestArea: { id: 'interest-areas', defaultMessage: 'Interest areas' },
  notifications: { id: 'notifications', defaultMessage: 'Notifications' },
  manageSubscriptions: { id: 'manage-subscriptions', defaultMessage: 'Manage Subscriptions' },
  crm: { id: 'crm', defaultMessage: 'CRM' },
  contactSupport: { id: 'contact-support', defaultMessage: 'Contact Support' },
  legal: { id: 'legal', defaultMessage: 'Legal' },
  noInterestArea: { id: 'no-interest-areas', defaultMessage: 'No interest areas' },
  noInterestAreaMessage: { id: 'no-interest-areas-message', defaultMessage: 'Interest Areas allow access to additional content, there are currently none available for your company.' },

  comingSoon: { id: 'page-coming-soon-message', defaultMessage: 'We’re still building this page for you, please check back soon.' },
});

export default class Settings extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  UNSAFE_componentWillMount() {
    const { pathname } = this.props.location;
    const { userCapabilities } = this.context.settings;
    if (pathname === '/settings/crm' && !userCapabilities.hasCrmIntegration) {
      this.props.history.push('/settings');
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { userCapabilities } = this.context.settings;
    const { match, location } = this.props;
    const styles = require('./Settings.less');
    const cx = classNames.bind(styles);
    const contentWrapperClasses = cx({
      contentWrapper: true,
      withHeader: location.pathname.indexOf('interest-areas') > -1 || location.pathname.indexOf('notifications') > -1
    });

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const { hasInterestAreas, hasNotifications } = userCapabilities;

    // Get base URL to set Menu
    /*eslint-disable no-unused-vars*/
    const [root, base, link, option] = location.pathname.split('/');
    let basePath = '/' + base;
    if (link) basePath += '/' + link;

    return (
      <div className={styles.Settings}>
        <Helmet>
          <title>{strings.settings}</title>
        </Helmet>
        <AppHeader />
        <Menu
          showManageSubscriptions={hasInterestAreas}
          showNotifications={hasNotifications}
          showInterestAreas={hasInterestAreas}
          pathname={basePath}
          showCrm={userCapabilities.hasCrmIntegration}
          strings={strings}
          onItemClick={this.props.onAnchorClick}
        />
        <div className={contentWrapperClasses}>
          <Switch>
            <Route path={`${match.url}/general`} component={General} />
            {hasInterestAreas && <Route path={`${match.url}/interest-areas`} component={InterestArea} />}
            {hasNotifications && <Route path={`${match.url}/notifications`} component={Notifications} />}
            <Route path={`${match.url}/crm`} component={Crm} />
            {hasInterestAreas && <Route path={`${match.url}/subscriptions`} component={ManageSubscriptions} />}
            <Route path={`${match.url}/support`} component={ContactSupport} />
            <Route path={`${match.url}/legal`} component={Legal} />
          </Switch>
        </div>
      </div>
    );
  }
}
