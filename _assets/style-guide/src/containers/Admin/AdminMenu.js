import PropTypes from 'prop-types';
import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import AdminMenu from 'components/Admin/AdminMenu/AdminMenu';
import AdminIndex from 'components/Admin/AdminIndex/AdminIndex';

const AdminMenuDocs = require('!!react-docgen-loader!components/Admin/AdminMenu/AdminMenu.js');

const menuList = require('../../static/adminMenu.json');

const messages = defineMessages({
  'settings': { id: 'settings', defaultMessage: 'Settings' },
  'story': { id: 'story', defaultMessage: '{story}' },
  'stories': { id: 'stories', defaultMessage: '{stories}' },
  'story-defaults': { id: 'story-defaults', defaultMessage: 'Story defaults' },
  'system': { id: 'system', defaultMessage: 'System' },
  'users': { id: 'users', defaultMessage: 'Users' },
  'content': { id: 'content', defaultMessage: 'Content' },
  'general': { id: 'general', defaultMessage: 'General' },
  'crm-integration': { id: 'crm-integration', defaultMessage: 'CRM Integration' },
  'custom-naming-convention': { id: 'custom-naming-convention', defaultMessage: 'Custom Naming Convention' },
  'home-screens': { id: 'home-screens', defaultMessage: 'Home Screens' },
  'security': { id: 'security', defaultMessage: 'Security' },
  'structure': { id: 'structure', defaultMessage: 'Structure' },
  'web-sites': { id: 'web-sites', defaultMessage: 'Web Sites' },
  'configuration-bundles': { id: 'configuration-bundles', defaultMessage: 'Configuration Bundles' },
  'custom-user-metadata': { id: 'custom-user-metadata', defaultMessage: 'Custom User Metadata' },
  'gamification': { id: 'gamification', defaultMessage: 'Gamification' },
  'user-self-enrolment': { id: 'user-self-enrolment', defaultMessage: 'User Self Enrolment' },
  'email': { id: 'email', defaultMessage: 'Email' },
  'files': { id: 'files', defaultMessage: 'Files' },
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
  'metadata': { id: 'metadata', defaultMessage: 'Metadata' },
  'templates': { id: 'templates', defaultMessage: 'Templates' },
  'sender-information': { id: 'sender-information', defaultMessage: 'Sender Information' },
  'smtp-server-setup': { id: 'smtp-server-setup', defaultMessage: 'SMTP Server Setup' },
  'file-uploads': { id: 'file-uploads', defaultMessage: 'File Uploads' },
  'cloud-services': { id: 'cloud-services', defaultMessage: 'Cloud Services' },
  'sync-engine': { id: 'sync-engine', defaultMessage: 'Sync Engine' },
  'searchSettings': { id: 'search-settings', defaultMessage: 'Search Settings' },
  'selectCategoryOrSearchBelow': { id: 'select-category-or-search-below', defaultMessage: 'Select a category on the left or search for settings below.' },
});

export default class AdminMenuView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    basePath: '/admin'
  };

  constructor(props) {
    super(props);
    this.state = {
      isMenuCollapse: false,
      menuWith: 310,
      selectedUrl: '',
      lastClick: null,
      selectedMenu: [],

      activeList: 0,
      disableAnimation: false
    };
    autobind(this);
  }

  handleNavItemClick(event, context) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    const isThereSubMenu = context.options && context.options.length > 0;

    this.setState({
      activeList: !isThereSubMenu && typeof context.options !== 'undefined' ? 0 : 1,
      selectedUrl: href,
      lastClick: href,
      selectedMenu: isThereSubMenu ? [...this.state.selectedMenu, context] : this.state.selectedMenu
    });
  }

  handlePathClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href === this.props.basePath) {
      this.setState({
        activeList: 0,
        selectedMenu: []
      });
    }
  }
  handleAnchorClick(event) {
    const href = event.currentTarget.getAttribute('href');
    this.setState({ lastClick: href });
  }
  handleToggleMenuClick(isExpand) {
    const isCollapse = isExpand ? false : !this.state.isMenuCollapse;
    this.setState({
      isMenuCollapse: isCollapse,
      menuWith: isCollapse ? 80 : 310
    });
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, naming);
    const { selectedUrl, selectedMenu, lastClick } = this.state;
    const breadcrumb = [{
      name: strings.settings,
      path: this.props.basePath
    }];

    if (selectedMenu.length) {
      breadcrumb.push({
        name: strings[selectedMenu[0].name],
        path: selectedMenu[0].url
      });
    }

    return (
      <section id="NavMenuView">
        <h1>AdminMenu</h1>
        <Docs {...AdminMenuDocs} />

        <Debug>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>

        <h2>Admin navigation menu</h2>
        <p>Side navigation for switching between pages.</p>

        <ComponentItem>
          <div style={{ display: 'flex' }}>
            <AdminMenu
              basePath={this.props.basePath}
              paths={breadcrumb}
              lists={menuList}
              activeList={this.state.activeList}
              selectedMenu={selectedMenu}
              selectedUrl={selectedUrl}
              menuComponent={(<div style={{ padding: '0.5rem' }}>
                <span>Pass in custom <code>menuComponent</code> prop</span>
              </div>)}
              width={this.state.menuWith}
              onClick={this.handleNavItemClick}
              showToggleMenu
              onToggleMenu={this.handleToggleMenuClick}
              onPathClick={this.handlePathClick}
              strings={strings}
            />
            <AdminIndex
              basePath={this.props.basePath}
              list={menuList}
              placeholder={strings.searchSettings}
              strings={strings}
              onAnchorClick={this.handleAnchorClick}
            />
          </div>
        </ComponentItem>

      </section>
    );
  }
}
