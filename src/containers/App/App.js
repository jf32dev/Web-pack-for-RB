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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router';
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  load as loadAppSettings,
  loadAndSaveLocation as loadAppSettingsAndSaveLocation,
  setAuthString,
  setAttribute,
  setLocation,
  saveLocation,
} from 'redux/modules/settings';
import {
  saveCrmAccount,
} from 'redux/modules/userSettings';

// Top-level routes
// Containers use lazyLoad in production (webpack/prod.config.js)
import Activity from 'containers/Activity/Activity';
import Admin from 'containers/Admin/Admin';
import Archive from 'containers/Archive/Archive';
import BlockSearch from 'containers/BlockSearch/BlockSearch';
import Calendar from 'containers/Calendar/Calendar';
import Canvas from 'containers/Canvas/Canvas';
import ChatRoot from 'containers/ChatRoot/ChatRoot';
import Comments from 'containers/Comments/Comments';
import Company from 'containers/Company/Company';
import Content from 'containers/Content/Content';
import Forms from 'containers/Forms/Forms';
import Help from 'containers/Help/Help';
import Me from 'containers/Me/Me';
import NoteEdit from 'containers/NoteEdit/NoteEdit';
import Notes from 'containers/Notes/Notes';
import PageSearch from 'containers/PageSearch/PageSearch';
import Reports from 'containers/Reports/Reports';
import Search from 'containers/Search/Search';
import Settings from 'containers/Settings/Settings';
import Shares from 'containers/Shares/Shares';
import Story from 'containers/Story/Story';
import UserDetail from 'containers/UserDetail/UserDetail';
import UserEdit from 'containers/UserEdit/UserEdit';

// Global HOCs
import ClickEventsHOC from 'containers/ClickEventsHOC/ClickEventsHOC';

// Global components
import FileViewer from 'containers/FileViewer/FileViewer';
import JSBridgeListener from 'containers/JSBridgeListener/JSBridgeListener';
import LocaleHandler from 'containers/LocaleHandler/LocaleHandler';
import Onboard from 'containers/Onboard/Onboard';
import Prompts from 'containers/Prompts/Prompts';
import SearchListener from 'containers/SearchListener/SearchListener';
import ShareModal from 'components/Share/ShareModal';

import AppNav from 'components/AppNav/AppNav';
import Bundle from 'components/Bundle/Bundle';
import ColourScheme from 'components/ColourScheme/ColourScheme';
import InteractionTimer from 'components/InteractionTimer/InteractionTimer';
import Loader from 'components/Loader/Loader';

const webappV4Routes = ['#story/', '#file/', '#people/', '#tab/'];

export default withRouter(ClickEventsHOC(@connect(
  state => ({
    auth: state.auth,
    settings: state.settings,
    viewerIsDocked: state.viewer.isDocked && state.viewer.activeFileId,
    loadedLocale: state.intl.locale,
  }),
  bindActionCreatorsSafe({
    loadAppSettings,
    loadAppSettingsAndSaveLocation,
    setAuthString,
    setLocation,
    saveCrmAccount,
    saveLocation,
    setAttribute,
  })
)
  class App extends PureComponent {
  static propTypes = {
    auth: PropTypes.object,
    settings: PropTypes.object
  };

  static contextTypes = {
    events: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired
  };

  static childContextTypes = {
    settings: PropTypes.object
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.previousLocation = props.location;
  }

  getChildContext() {
    return {
      settings: this.props.settings
    };
  }

  UNSAFE_componentWillMount() {
    const { settings } = this.props;
    const { hasLocationConstraints } = settings.userCapabilities;

    this.getLocation(hasLocationConstraints);

    // Update authString
    this.props.setAuthString('&access_token=' + this.props.auth.BTCTK_A);
  }

  componentDidMount() {
    // Load app settings and set location if available
    const { geolocation } = this.props.settings;

    if (geolocation.latitude && geolocation.longitude) {
      this.props.loadAppSettingsAndSaveLocation(geolocation);

    // Load app settings without setting location
    } else {
      this.props.loadAppSettings();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Translate old webapp v4 hash URLs
    this.handleV4Route(nextProps);

    // App settings loaded - let user in
    if (nextProps.settings.loaded && !this.props.settings.loaded) {
      if (nextProps.settings.userCapabilities.hasLocationConstraints && !(this.props.settings.geolocation.latitude || this.props.settings.geolocation.longitude)) {
        this.getLocation(true);
      }
      // Set valid authString
      this.props.setAuthString('&access_token=' + nextProps.auth.BTCTK_A);

      // Determine index path
      const landingPage = nextProps.settings.userCapabilities.landingPageV5;
      let path = nextProps.location.pathname + nextProps.location.search || '/';

      const { hasContent, hasHome, isAdmin, hasArchives, hasBlockSearch, hasPageSearch } = nextProps.settings.userCapabilities;
      // Index path requested and custom landingPage is set
      if (path === '/' && landingPage !== 'company' && (hasContent || hasHome || hasArchives)) {
        switch (landingPage) {
          case 'archive':
            path = nextProps.settings.archiveSettings.lastRoute || '/archive';
            break;
          case 'content':
            path = nextProps.settings.contentSettings.lastRoute || '/content';
            break;
          case 'forms':
            path = nextProps.settings.formsSettings.lastRoute || '/forms';
            break;
          case 'search':
            path = '/search';
            if (hasPageSearch) {
              path = nextProps.settings.blocksearchSettings.lastRoute || '/pagesearch';
            } else if (hasBlockSearch) {
              path = nextProps.settings.blocksearchSettings.lastRoute || '/blocksearch';
            }
            break;
          default:
            path = '/' + landingPage;
            break;
        }
        // Redirect to admin when all UIs are disabled
      } else if (path === '/' && isAdmin && !(hasContent && hasHome && hasArchives)) {
        path = '/admin';
      } else if (path === '/' && landingPage !== 'company') {
        path = '/' + landingPage;
      }
      this.props.history.push(path);

    // New access_token set
    } else if (nextProps.auth.BTCTK_A && nextProps.auth.BTCTK_A !== this.props.auth.BTCTK_A) {
      this.props.setAuthString('&access_token=' + nextProps.auth.BTCTK_A);

      // Load app settings (token restored)
      if (!nextProps.settings.loaded) {
        this.props.loadAppSettings();
      }

    // User logged out
    } else if (!nextProps.auth.BTCTK_R && this.props.auth.BTCTK_R) {
      const logoutPath = this.props.settings.company.logoutLandingPage || '/';
      this.props.history.push(logoutPath);
    }

    // Store previous location
    if (this.props.location.pathname !== nextProps.location.pathname && nextProps.history.action !== 'REPLACE') {
      window.previousLocation = this.props.location;
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { location } = this.props;
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      this.props.location.pathname.indexOf('file') === -1 &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  getGlobalProps() {
    return {
      onAnchorClick: this.props.onAnchorClick,
      onCallClick: this.props.onCallClick,
      onFileClick: this.props.onFileClick,
      onFilesClick: this.props.onFilesClick,
      onStoryClick: this.props.onStoryClick
    };
  }

  // Set location data
  getLocation(toggle) {
    if ('geolocation' in navigator && toggle) {
      navigator.geolocation.getCurrentPosition(this.setLocation);
    }
  }

  setLocation(geoposition) {
    const { coords } = geoposition;
    const data = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      updated: Math.floor(Date.now() / 1000)  // unix timestamp in s
    };

    // Location available and settings have not been loaded
    if (coords.latitude && !this.props.settings.loaded) {
      this.props.setLocation(data);

    // Location available and settings have loaded
    } else if (coords.latitude && this.props.settings.loaded) {
      this.props.saveLocation(data);
    }
  }

  handleV4Route(nextProps) {
    // Translate old webapp v4 hash URLs
    webappV4Routes.forEach(page => {
      if (nextProps.location.hash && nextProps.location.hash.indexOf(page) >= 0) {
        const tabPath = page.substring(1) === 'tab/' ? 'content' : '';
        const customPath = `${tabPath}/${page.substring(1)}${nextProps.location.hash.split(page)[1]}`;
        if (this.props.location.pathname !== nextProps.location.pathname && nextProps.history.action !== 'REPLACE') {
          this.previousLocation.pathname = customPath;
          window.previousLocation.pathname = customPath;
        }
        window.location.replace(customPath);
      }
    });
  }

  renderRoute(RouteComponent, props) {
    if (process.env.NODE_ENV === 'production') {
      return (
        <Bundle load={RouteComponent}>
          {(Comp) => (
            <Comp
              {...props}
              {...this.getGlobalProps()}
            />
          )}
        </Bundle>
      );
    }
    return (
      <RouteComponent
        {...props}
        {...this.getGlobalProps()}
      />
    );
  }

  render() {
    const { location, settings, viewerIsDocked } = this.props;
    const {
      hasCalendar,
      hasTextChat,
      hasContent,
      hasNotifications,
      isAdmin,
      isGroupAdmin,
      hasArchives,
      hasBlockSearch,
      hasPageSearch,
      hasPitchBuilderWeb
    } = settings.userCapabilities;
    const styles = require('./App.less');
    const cx = classNames.bind(styles);
    const appFrameClasses = cx({
      appFrame: true,
      viewerDocked: viewerIsDocked
    });
    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    );

    // Treat file route as a modal
    const fileRoute = pathToRegexp('/file/:fileId(\\d+)');
    const fileRouteMatch = fileRoute.exec(location.pathname);

    const filePermIdRoute = pathToRegexp('/file/p/:fileId(\\d+)');
    const filePermIdRouteMatch = filePermIdRoute.exec(location.pathname);

    const mePaths = [
      'me',
      'bookmarks',
      'liked',
      'published',
      'scheduled',
      'recent'
    ];

    // Page title
    let titleTemplate = '%s - Bigtincan Hub';
    if (process.env.NODE_ENV !== 'production') {
      titleTemplate = '[dev] %s - Bigtincan Hub';
    }

    // Render App if access_token exists and is valid
    if (settings.loaded) {
      return (
        <div className={styles.App}>
          <Helmet
            titleTemplate={titleTemplate}
            defaultTitle={window.document.title}
          />
          <div className={appFrameClasses}>
            <AppNav settings={this.props.settings} />
            <main className={styles.appContent}>
              {/* Handler for Old Routers */}
              {location.hash && location.hash.indexOf('#story') === 0 && <Redirect to={location.hash.substring(1)} />}
              {location.hash && location.hash.indexOf('#people') === 0 && <Redirect to={location.hash.substring(1)} />}
              {location.hash && location.hash.indexOf('#file') === 0 && <Redirect to={location.hash.substring(1)} />}
              {location.hash && location.hash.indexOf('#tab') === 0 && <Redirect to={`content/${location.hash.substring(1)}`} />}

              <Switch location={(isModal || fileRouteMatch || filePermIdRouteMatch) ? this.previousLocation : location}>
                <Route exact path="/(|people|web|links|hubshare)/(all|new)?" render={(props) => this.renderRoute(Company, props)} />
                <Route path="/people/:id" render={(props) => this.renderRoute(UserDetail, props)} />

                {hasContent && <Route exact path="/content" render={(props) => this.renderRoute(Content, props)} />}
                {hasContent && <Route path="/content/tab/:tabId/channel/:channelId" render={(props) => this.renderRoute(Content, props)} />}
                {hasContent && <Route path="/content/tab/:tabId" render={(props) => this.renderRoute(Content, props)} />}
                {hasContent && <Route path="/content/personal/channel/:channelId" render={(props) => this.renderRoute(Content, props)} />}
                {hasContent && <Route path="/content/personal/:sectionId?" render={(props) => this.renderRoute(Content, props)} />}
                {/*<Route path="/chat/:recipientId?" render={(props) => this.renderRoute(Chat, props)} />*/}
                <Route path="/chat/:recipientId?" render={(props) => this.renderRoute(ChatRoot, props)} />
                {hasNotifications && <Route path="/activity" render={(props) => this.renderRoute(Activity, props)} />}

                {hasCalendar && <Route path="/calendar" render={(props) => this.renderRoute(Calendar, props)} />}

                <Route path={`/(${mePaths.join('|')})`} render={(props) => this.renderRoute(Me, props)} />
                <Route path="/comments/story/:storyId" render={(props) => this.renderRoute(Comments, props)} />
                <Route path="/comments" render={(props) => this.renderRoute(Comments, props)} />

                <Route path="/notes" render={(props) => this.renderRoute(Notes, props)} />
                <Route path="/note/new" render={(props) => this.renderRoute(NoteEdit, props)} />
                <Route path="/note/:noteId/edit" render={(props) => this.renderRoute(NoteEdit, props)} />
                <Redirect from="/note/:noteId" to="/note/:noteId/edit" />

                <Route path="/profile/edit" render={(props) => this.renderRoute(UserEdit, props)} />
                <Route path="/profile" render={(props) => this.renderRoute(UserDetail, props)} />

                <Redirect exact from="/share" to="/shares" />
                <Route path="/shares" render={(props) => this.renderRoute(Shares, props)} />
                <Route path="/share/new" render={(props) => this.renderRoute(Shares, props)} />
                <Route path="/share/:shareId/user/:userId" render={(props) => this.renderRoute(Shares, props)} />
                <Route path="/share/:shareId" render={(props) => this.renderRoute(Shares, props)} />

                {hasArchives && <Route exact path="/archive" render={(props) => this.renderRoute(Archive, props)} />}
                {hasArchives && <Route path="/archive/tab/:tabId/channel/:channelId/story/:storyId" render={(props) => this.renderRoute(Archive, props)} />}
                {hasArchives && <Route path="/archive/tab/:tabId/channel/:channelId" render={(props) => this.renderRoute(Archive, props)} />}
                {hasArchives && <Route path="/archive/tab/:tabId" render={(props) => this.renderRoute(Archive, props)} />}

                {hasPageSearch && <Route path="/pagesearch/:fileId?" render={(props) => this.renderRoute(PageSearch, props)} />}
                {hasPageSearch && <Redirect from="/search" to="/pagesearch" />}
                {hasPageSearch && <Redirect from="/blocksearch" to="/pagesearch" />}
                {(hasPageSearch && hasPitchBuilderWeb) && <Redirect from="/canvas" to="/pitchbuilder" />}
                {hasBlockSearch && !hasPageSearch && <Route path="/blocksearch/:fileId?" render={(props) => this.renderRoute(BlockSearch, props)} />}
                {(hasBlockSearch || (hasPageSearch && hasPitchBuilderWeb)) && <Route path="/canvas" render={(props) => this.renderRoute(Canvas, props)} />}
                {(hasBlockSearch || (hasPageSearch && hasPitchBuilderWeb)) && <Route path="/pitchbuilder" render={(props) => this.renderRoute(Canvas, props)} />}
                {hasBlockSearch && !hasPageSearch && <Redirect from="/search" to="/blocksearch" />}
                {!hasBlockSearch && !hasPageSearch && <Route path="/search" render={(props) => this.renderRoute(Search, props)} />}

                <Route path="/forms" render={(props) => this.renderRoute(Forms, props)} />

                <Route path="/reports" render={(props) => this.renderRoute(Reports, props)} />
                {(isAdmin || isGroupAdmin) && <Route path="/admin" render={(props) => this.renderRoute(Admin, props)} />}

                <Route path="/settings" render={(props) => this.renderRoute(Settings, props)} />
                <Route path="/help" render={(props) => this.renderRoute(Help, props)} />

                <Route path="/story/new" render={(props) => this.renderRoute(Story, props)} />
                <Route path="/story/:storyId" render={(props) => this.renderRoute(Story, props)} />
                <Route path="/quicklink" render={(props) => this.renderRoute(Story, props)} />

                <Route path="/file/p/:fileId" render={(props) => this.renderRoute(FileViewer, props)} />
                <Route path="/file/:fileId" render={(props) => this.renderRoute(FileViewer, props)} />

                <Redirect from="/company" to="/" />
                <Redirect to="/" />
              </Switch>
              {isModal ? (
                <Switch>
                  <Route path="/search" render={(props) => this.renderRoute(Search, props)} />
                  <Route path="/story/:storyId" render={(props) => this.renderRoute(Story, props)} />
                  <Route path="/note/new" render={(props) => this.renderRoute(NoteEdit, props)} />
                  <Route path="/note/:noteId/edit" render={(props) => this.renderRoute(NoteEdit, props)} />
                </Switch>
              ) : null}
            </main>
          </div>
          {hasTextChat && location.pathname.indexOf('chat') === -1 &&
            <Route render={(props) => this.renderRoute(ChatRoot, { ...props, enableChatSocket: true, location: this.props.location })} />
          }
          <ColourScheme
            varSelectors={window.BTC.scheme}
            vars={settings.theme}
          />
          <FileViewer />
          <InteractionTimer />
          <JSBridgeListener />
          <LocaleHandler />
          <Onboard />
          <Prompts />
          <SearchListener />
          <ShareModal ignoreCategories={['app', 'btc', 'folder', 'form']} />
        </div>
      );
    }

    // Render Loader (show with CSS)
    return (
      <div className={styles.appLoader} style={{ opacity: 0 }}>
        <Loader type="app" />
      </div>
    );
  }
}));
