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
import autobind from 'class-autobind';
import Combokeys from 'combokeys';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { setActiveRecipient } from 'redux/modules/chat/actions';
import UserThumb from 'components/UserThumb/UserThumb';

const messages = defineMessages({
  content: { id: 'content', defaultMessage: 'Content' },
  chat: { id: 'chat', defaultMessage: 'Chat' },
  activity: { id: 'activity', defaultMessage: 'Activity' },
  calendar: { id: 'calendar', defaultMessage: 'Calendar' },
  me: { id: 'me', defaultMessage: 'Me' },
  search: { id: 'search', defaultMessage: 'Search' },
  canvas: { id: 'canvas', defaultMessage: 'Canvas' },
  pitchBuilder: { id: 'pitch-builder', defaultMessage: 'Pitch Builder' },
  archive: { id: 'archive', defaultMessage: 'Archive' },
  forms: { id: 'forms', defaultMessage: 'Forms' },
  reports: { id: 'reports', defaultMessage: 'Reports' },
  platformConfiguration: { id: 'platform-configuration', defaultMessage: 'Platform Configuration' },
  help: { id: 'help', defaultMessage: 'Help' },


  comingSoon: { id: 'coming-soon', defaultMessage: 'Coming Soon!' },
  subject: { id: 'subject', defaultMessage: 'Subject' },
  message: { id: 'message', defaultMessage: 'Message' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  send: { id: 'send', defaultMessage: 'Send' },
  close: { id: 'close', defaultMessage: 'Close' },

  iFoundABug: { id: 'i-found-a-bug', defaultMessage: 'I found a bug' },
  iHaveASuggestion: { id: 'i-have-a-suggestion', defaultMessage: 'I have a suggestion' },
});

function mapStateToProps(state, ownProps) {
  const { canvas, entities, settings } = state;
  let mostRecentChatUser = null;
  let mostRecentChatUserUnreadCount = false;

  const lastMessage = entities.messagesById[entities.lastMessage];
  if (lastMessage && lastMessage.user && entities.users[lastMessage.user]) {
    mostRecentChatUser = entities.users[lastMessage.user];
    mostRecentChatUserUnreadCount = mostRecentChatUser.unreadCount || 0;
  }

  // Restore last paths
  let contentPath = settings.contentSettings.lastRoute || '/content';
  if (ownProps.location.pathname.indexOf('/content') > -1) {
    contentPath = '/content';
  }

  let blockSearchPath = settings.blocksearchSettings.lastRoute || '/blockSearch';
  if (ownProps.location.pathname.indexOf('/blockSearch') > -1) {
    blockSearchPath = '/archive';
  }

  let archivePath = settings.archiveSettings.lastRoute || '/archive';
  if (ownProps.location.pathname.indexOf('/archive') > -1) {
    archivePath = '/archive';
  }

  let formsPath = settings.formsSettings.lastRoute || '/forms';
  if (ownProps.location.pathname.indexOf('/forms') > -1) {
    formsPath = '/forms';
  }

  let adminPath = settings.adminSettings.lastRoute || '/admin';
  if (ownProps.location.pathname.indexOf('/admin') > -1) {
    adminPath = '/admin';
  }

  const listSlidesId = Object.keys(canvas.slidesById).filter(i => !canvas.slidesById[i].deleted).map(k => k);

  return {
    name: settings.company.name,
    logo: settings.company.brandingPhoto,
    contentPath,
    blockSearchPath,
    archivePath,
    formsPath,
    adminPath,

    chatUnreadCount: entities.unreadCount,
    newActivity: settings.user.hasUnreadNotifications,
    activeRecipientId: entities.activeRecipientId,
    mostRecentChatUser,
    mostRecentChatUserUnreadCount,

    newCanvas: canvas.newIndicator,
    hasContentCanvas: listSlidesId.length > 0
  };
}

export default withRouter(@connect(mapStateToProps,
  bindActionCreatorsSafe({
    setActiveRecipient,
  })
)
  class AppNav extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string,

    contentPath: PropTypes.string,
    blockSearchPath: PropTypes.string,
    archivePath: PropTypes.string,
    formsPath: PropTypes.string,
    adminPath: PropTypes.string,

    chatUnreadCount: PropTypes.number,
    newActivity: PropTypes.bool,
    activeRecipientId: PropTypes.number,
    mostRecentChatUser: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    contentPath: '/content',
    blockSearchPath: '/blocksearch',
    archivePath: '/archive',
    formsPath: '/forms',
    adminPath: '/admin'
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.menu = null;
    this.nav = null;
  }

  componentDidMount() {
    this.combokeys = new Combokeys(document.documentElement);
    this.combokeys.bind(['1', '2', '3', '4', '5', '6', '7', '8', '9'], this.handleShortcut);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.location;

    // navigated to search
    if (pathname.indexOf('/search') > -1 && this.props.location.pathname.indexOf('/search') === -1) {
      this.handleHideNav();

      // navigated from search
    } else if (pathname.indexOf('/search') === -1 && this.props.location.pathname.indexOf('/search') > -1) {
      this.handleShowNav();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.hasContentCanvas !== nextProps.hasContentCanvas || this.props.newCanvas !== nextProps.newCanvas) {
      return true;
    } else if (nextProps.location.state && nextProps.location.state.modal) { // Do not update if navigating to a modal-route
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    this.combokeys.detach();
  }

  // directly apply style to hide nav, render blocked by shouldComponentUpdate
  handleHideNav() {
    this.nav.style.cssText = 'transform: translateX(-100%); width: 0; opacity: 0;';
  }

  handleShowNav() {
    this.nav.style.cssText = '';
  }

  handleShortcut(event, key) {
    this.handleTriggerNavLink(key - 1);
  }

  handleTriggerNavLink(index) {
    const navLink = this.menu.children[index] ? this.menu.children[index].children[0] : null;
    if (navLink) {
      navLink.click();
    }
  }

  handleLogoClick() {
    const { hasContent, hasHome, isAdmin, isGroupAdmin } = this.props.settings.userCapabilities;
    // if hasContent and hasHome is enabled
    if (hasContent || hasHome) {
      this.props.history.push('/');
    } else if (isAdmin || isGroupAdmin) {
      this.props.history.push('/admin');
    }
  }

  handleChatUserClick() {
    const { activeRecipientId, mostRecentChatUser } = this.props;
    const chatActive = this.props.location.pathname.indexOf('chat') > -1;

    if (!chatActive && activeRecipientId) {
      this.props.setActiveRecipient(0);
    } else if (!chatActive && mostRecentChatUser && mostRecentChatUser.id) {
      this.props.setActiveRecipient(mostRecentChatUser.id);
    }
  }

  isCompanyActive(match, location) {
    // also keep old /web route because global service might hardcoaded  that url;
    const paths = [
      '/web',
      '/links',
      '/people'
    ];
    return paths.some(url => location.pathname === '/' || location.pathname.indexOf(url) === 0);
  }

  isMeActive(match, location) {
    const paths = [
      '/bookmarks',
      '/comments',
      '/drafts',
      '/liked',
      '/me',
      '/note',
      '/published',
      '/scheduled',
      '/profile',
      '/recent/files',
      '/recent/stories',
      '/shares',
      '/settings'
    ];
    return paths.some(url => location.pathname.indexOf(url) === 0);
  }

  isBlockSearchActive(match, location) {
    return location.pathname.indexOf('/blocksearch') === 0 || location.pathname.indexOf('/pagesearch') === 0;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, userCapabilities } = this.context.settings;
    const {
      name,
      logo,
      chatUnreadCount,
      hasContentCanvas,
      newActivity,
      mostRecentChatUser,
      mostRecentChatUserUnreadCount,
      newCanvas,
      location,
    } = this.props;

    const {
      hasArchives,
      hasCalendar,
      hasContent,
      hasForms,
      hasHome,
      hasNotifications,
      hasReports,
      hasTextChat,
      hasBlockSearch,
      hasPageSearch,
      hasPitchBuilderWeb,
      isAdmin,
      isGroupAdmin,
    } = userCapabilities;
    const styles = require('./AppNav.less');

    // Hide nav if rendering search
    let style = null;
    if (location.pathname.indexOf('/search') > -1) {
      style = {
        transform: 'translateX(-100%)',
        width: '0',
        opacity: '0'
      };
    }

    // light theme
    const itemClasses = styles.light;
    const activeStyle = styles.lightActive;

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Use logo if it exists
    const logoStyle = {
      backgroundImage: logo ? 'url(' + logo + authString + ')' : null
    };

    // Display new Chat message indicator?
    const chatActive = location.pathname.indexOf('chat') > -1;
    const newChat = !chatActive && chatUnreadCount > 0;

    return (
      <nav
        id="app-nav"
        ref={(c) => { this.nav = c; }}
        className={styles.AppNavLight}
        style={style}
      >
        <div
          title={name}
          className={styles.AppLogo}
          style={logoStyle}
          onClick={this.handleLogoClick}
        />
        <ul ref={(c) => { this.menu = c; }}>
          {hasHome && <li className={styles.CompanyNav} aria-label={name}>
            <NavLink
              to="/"
              exact
              isActive={this.isCompanyActive}
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {hasContent && <li className={styles.ContentNav} aria-label={strings.content}>
            <NavLink
              to={this.props.contentPath}
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {hasTextChat && <li className={styles.ChatNav} aria-label={strings.chat}>
            <NavLink
              to="/chat"
              className={itemClasses + ' ' + (newChat ? styles.newIndicator : '')}
              activeClassName={activeStyle}
            />
          </li>}
          {hasCalendar && <li className={styles.CalendarNav} aria-label={strings.calendar}>
            <NavLink
              to="/calendar"
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {hasNotifications && <li className={styles.ActivityNav} aria-label={strings.activity}>
            <NavLink
              to="/activity"
              className={itemClasses + ' ' + (newActivity ? styles.newIndicator : '')}
              activeClassName={activeStyle}
            />
          </li>}
          <li className={styles.MeNav} aria-label={strings.me}>
            <NavLink
              to="/me"
              isActive={this.isMeActive}
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>
          {(hasBlockSearch || hasPageSearch) && <li className={styles.SearchNav} aria-label={strings.search}>
            <NavLink
              to={this.props.blockSearchPath}
              isActive={this.isBlockSearchActive}
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {(hasBlockSearch && !(hasPageSearch && hasPitchBuilderWeb)) && <li className={styles.CanvasNav} aria-label={hasPitchBuilderWeb ? strings.pitchBuilder : strings.canvas}>
            <NavLink
              to="/canvas"
              className={itemClasses + ' ' + ((newCanvas || hasContentCanvas) ? styles.newIndicator : '')}
              activeClassName={activeStyle}
            />
          </li>}
          {(hasPageSearch && hasPitchBuilderWeb) && <li className={styles.CanvasNav} aria-label={hasPitchBuilderWeb ? strings.pitchBuilder : strings.canvas}>
            <NavLink
              to="/pitchbuilder"
              className={itemClasses + ' ' + (hasContentCanvas ? styles.newIndicator : '')}
              activeClassName={activeStyle}
            />
          </li>}
          <span className={styles.separator} />
          {hasArchives && <li className={styles.ArchiveNav} aria-label={strings.archive}>
            <NavLink
              to={this.props.archivePath}
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {hasForms && <li
            className={styles.FormsNav}
            aria-label={strings.forms}
          >
            <NavLink
              to={this.props.formsPath}
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {hasReports && <li className={styles.ReportsNav} aria-label={strings.reports}>
            <NavLink
              to="/reports"
              className={itemClasses}
              activeClassName={activeStyle}
            />
          </li>}
          {(isAdmin || isGroupAdmin) &&
            <li className={styles.AdminNav} aria-label={strings.platformConfiguration}>
              <NavLink
                to={this.props.adminPath}
                className={itemClasses}
                activeClassName={activeStyle}
              />
            </li>}
          <li className={styles.HelpNav} aria-label={strings.help}>
            <a href="http://help.bigtincan.com/" className={itemClasses} target="_blank" rel="noopener noreferrer" />
          </li>
        </ul>
        {mostRecentChatUser && mostRecentChatUser.name && <div
          className={styles.mostRecentChatUser + ' ' + (mostRecentChatUserUnreadCount ? styles.newIndicator : '')}
          onClick={this.handleChatUserClick}
        >
          <UserThumb
            width={32}
            {...mostRecentChatUser}
          />
        </div>}
      </nav>
    );
  }
});
