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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import NavMenu from 'components/NavMenu/NavMenu';

const messages = defineMessages({
  settings: { id: 'settings', defaultMessage: 'Settings' },
  general: { id: 'general', defaultMessage: 'General' },
  interestAreas: { id: 'interest-areas', defaultMessage: 'Interest Areas' },
  notifications: { id: 'notifications', defaultMessage: 'Notifications' },
  manageSubscriptions: { id: 'manage-subscriptions', defaultMessage: 'Manage Subscriptions' },
  crm: { id: 'crm', defaultMessage: 'CRM' },
  contactSupport: { id: 'contact-support', defaultMessage: 'Contact Support' },
  legal: { id: 'legal', defaultMessage: 'Legal' },
  noInterestAreas: { id: 'no-interest-area', defaultMessage: 'No Interest Areas' },
  noInterestAreasMessage: { id: 'no-interest-area-message', defaultMessage: 'Interest Areas allow access to additional content, there are currently none available for your company.' },
});

export default class Menu extends PureComponent {
  static propTypes = {
    pathname: PropTypes.string,
    width: PropTypes.number,
    showCrm: PropTypes.bool,
    onItemClick: PropTypes.func,
    showInterestAreas: PropTypes.bool,
    showNotifications: PropTypes.bool,
    showManageSubscriptions: PropTypes.bool,
  };

  static defaultProps = {
    width: 320,
    showInterestAreas: true,
    showNotifications: true,
    showManageSubscriptions: true,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { formatMessage } = this.context.intl;
    const { pathname, showCrm, onItemClick, showInterestAreas, showManageSubscriptions, showNotifications } = this.props;
    const styles = require('./Menu.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    const menuList = [
      { name: strings.general, url: '/settings/general', icon: 'gear' },
      { name: strings.contactSupport, url: '/settings/support', icon: 'email' },
      { name: strings.legal, url: '/settings/legal', icon: 'document' },
    ];

    if (showInterestAreas) {
      menuList.splice(1, 0, { name: strings.interestAreas, url: '/settings/interest-areas', icon: 'copy' });
    }
    if (showNotifications) {
      menuList.splice(2, 0, { name: strings.notifications, url: '/settings/notifications', icon: 'notifications' });
    }
    if (showManageSubscriptions) {
      menuList.splice(3, 0, { name: strings.manageSubscriptions, url: '/settings/subscriptions', icon: 'subscription' });
    }

    // Insert after manageSubscriptions
    if (showCrm) {
      menuList.splice(4, 0, { name: strings.crm, url: '/settings/crm', icon: 'user-crm' });
    }

    // Selected menu URL
    const selectedUrl = pathname === '/settings' ? '/settings/general' : pathname;

    return (
      <div className={styles.Menu}>
        <header className={styles.listHeader}>
          <div className={styles.titleWrap}>
            <Breadcrumbs
              paths={[{ 'name': strings.settings, path: '/settings' }]}
              className={styles.listCrumbs}
              style={{ maxWidth: (this.props.width - 25) + 'px' }}
            />
          </div>
        </header>
        <NavMenu
          list={menuList}
          selectedUrl={selectedUrl}
          onItemClick={onItemClick}
        />
      </div>
    );
  }
}
