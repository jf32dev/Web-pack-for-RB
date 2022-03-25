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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Loader from 'components/Loader/Loader';
import Btn from 'components/Btn/Btn';
import NavMenu from 'components/NavMenu/NavMenu';

import SAML from './SAML';
import OAuth from './OAuth';
import LDAP from './LDAP';

/**
 * AdminSecurityAuthentication description
 */
export default class AdminSecurityAuthentication extends PureComponent {
  static propTypes = {
    /** Description*/
    saml: PropTypes.object,

    selectedMenuItem: PropTypes.oneOf(['ldap', 'saml', 'oAuth']),

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onAnchorClick: PropTypes.func,

    onHeaderClick: PropTypes.func,

    onDnsAliasChange: PropTypes.func,

    onSave: PropTypes.func,

    ldapSaveDisabled: PropTypes.bool,
    samlSaveDisabled: PropTypes.bool,
    oAuthSaveDisabled: PropTypes.bool,

    isMetadataFileUploading: PropTypes.bool,

    saveLoading: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      ldap: 'LDAP',
      saml: 'SAML',
      oAuth: 'OAUTH',
      activeDirectory: 'Active Directory',
      eDirectory: 'eDirectory',
      onPremiseAdBridge: 'On-premise AD bridge',
      bridgeAddress: 'Bridge Address',
      bridgeToken: 'Bridge Token',
      additionalSettings: 'Additional Settings',
      manageAiaAdGroups: 'Manage via AD groups',
      recursiveGroups: 'Recursive groups',
      AdSecure: 'AD secure',
      port: 'Port',
      activeForest: 'Active Forest',
      addActiveForest: 'Add Active Forest',
      delete: 'Delete',
      forestName: 'Forest Name',
      serviceAccount: 'Service Account',
      serviceAccountPassword: 'Service Account Password',
      domainController: 'Domain Controller',
      localoffice: 'localoffice',
      edit: 'Edit',
      addDomainController: 'Add Domain Controller',
      credentials: 'Credentials',
      username: 'Username',
      password: 'Password',
      testCredentials: 'Test Credentials',
      userAuthenticationFailed: 'User authentication failed',
      userAuthenticationSucceed: 'User authentication successful',
      email: 'Email',
      groups: 'Groups',
      moreDetails: 'More details',
      enableSAML: 'Enable SAML',
      SpPublicCertificate: 'SP Public Certificate',
      downloadSpPublicCertificate: 'Download SP Public Certificate',
      SpRolloverCertificate: 'SP Rollover Certificate',
      downloadSpRolloverCertificate: 'Download SP Rollover Certificate',
      SpMetadata: 'SP Metadata',
      downloadSpMetadata: 'Download SP metadata',
      samlIdpMetadata: 'SAML 2.0 - IdP metadata',
      samlIdpMetadataInfo: 'These bindings affect which URLs will be selected upon importing an IdP metadata file.',
      singleSignOnBinding: 'Single sign-on binding',
      redirect: 'Redirect',
      singleSignOffBinding: 'Single sign-off binding',
      importMetadataFile: 'Import Metadata File',
      metadataOverwriteInfo: 'Uploading an IdP metadata file will overwrite the values set below.',
      entityId: 'Entity ID',
      singleSignOnUrl: 'Single sign-on URL',
      singleSignOffUrl: 'Single sign-off URL',
      x509PublicCertificate: 'X.509 public certificate',
      samlOtherIdpSettings: 'SAML 2.0 - IdP metadata',
      signMessages: 'Sign messages',
      signAssertions: 'Sign assertions',
      encryptNameId: 'Encrypt NameID',
      replaceUserMetadataOnReauth: 'Replace user metadata on re-authentication',
      accessTokenExpiry: 'Access token expiry',
      refreshToken: 'Refresh token',
      oneHour: '1 hour',
      twoHours: '2 hours',
      threeHours: '3 hours',
      fourHours: '4 hours',
      fiveHours: '5 hours',
      sixHours: '6 hours',
      sevenHours: '7 hours',
      eightHours: '8 hours',
      days: 'Days',
      ldapServer: 'LDAP Server',
      edAccountSuffix: 'LDAP account suffix',
      edBaseDn: 'LDAP base DN',
      edUsernamePrefix: 'LDAP username prefix',
      manageViaAdGroups: 'Manage via AD groups',
      edAdminDn: 'LDAP admin DN',
      edAdminPassword: 'LDAP admin password',
      edFilter: 'LDAP filter',
      edPort: 'LDAP port',
      edSecure: 'LDAP secure',
      directoryServer: 'Directory Server',
      onPremiseLDAPBridge: 'On-premise LDAP bridge',
      setDomainController: 'Set Domain Controller',
      post: 'Post',
      save: 'Save',
      uploading: 'Uploading'
    },
    selectedMenuItem: 'ldap',
    ldapSaveDisabled: true,
    samlSaveDisabled: true,
    oAuthSaveDisabled: true,
    saveLoading: false,
    isMetadataFileUploading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentActiveForestIndex: 0,
    };
    this.menu = [
      { name: 'LDAP', url: 'ldap' },
      { name: 'SAML', url: 'saml' },
      { name: 'OAuth', url: 'oAuth' }
    ];
    this.emptyActiveForest = {
      forestName: '',
      serviceAccount: '',
      serviceAccountPassword: '',
      domains: [{
        accountSuffix: '',
        baseDn: '',
        domainController: '',
        usernamePrefix: '',
      }]
    };
    autobind(this);
  }

  handleLdapChange(e, newOrder, itemName) {
    const { dataset, type, value, checked } = e.currentTarget;
    const action = _get(dataset, 'action', false);
    const name = _get(dataset, 'name', false);
    const id = _get(dataset, 'id', false);
    const index = _get(dataset, 'index', false);
    const { currentActiveForestIndex } = this.state;

    let update = {};
    const activeForest = _get(this.props.ldap, 'list', [{ domains: [{}] }]);
    if (action && action === 'addActiveForest') {
      update = {
        activeForest: activeForest.concat(this.emptyActiveForest)
      };
    } else if (action && action === 'addDomainController') {
      this.handleUpdate(currentActiveForestIndex, 'onAddDomain');
    } else if (action && action === 'deleteActiveForest') {
      update = {
        activeForest: activeForest.length > 1 ? activeForest.filter((item, i) => (i !== Number(currentActiveForestIndex))) :
          [this.emptyActiveForest]
      };
    } else if (action && action === 'mouseEnter') {
      if (this.state.currentActiveForestIndex !== index) {
        this.setState({
          currentActiveForestIndex: index
        });
      }
    } else if (newOrder && itemName) {
      if (itemName === 'ActiveForestItem') {
        update = {
          activeForest: newOrder.map(newIndex => (activeForest[newIndex]))
        };
      } else if (itemName === 'DomainControllerItem') {
        update = {
          activeForest: activeForest.map((item, i) => (i !== Number(currentActiveForestIndex) ? item : {
            ...item,
            domains: newOrder.map(newIndex => (item.domains[newIndex])),
          }))
        };
      }
    } else if (name === 'activeForest' && type === 'text') {
      update = {
        activeForest: activeForest.map((item, i) => (i !== Number(currentActiveForestIndex) ? item : {
          ...item,
          [id]: value,
        }))
      };
    } else if (action && action === 'domainControllerItem-edit') {
      this.handleUpdate({
        index,
        currentActiveForestIndex,
      }, 'onEditDomain');
    } else if (action && action === 'domainControllerItem-delete') {
      this.handleUpdate({
        index,
        currentActiveForestIndex,
      }, 'onDeleteDomain');
    } else if (type === 'checkbox') {
      update = {
        [e.currentTarget.name]: checked
      };
    } else if (type === 'text' || type === 'password' || type === 'number') {
      update = {
        [e.currentTarget.name]: value
      };
    } else if (type === 'button' && action === 'testCredentials') {
      update = {
        [action]: true
      };
    }

    if (!_isEmpty(update)) {
      this.handleUpdate(update, 'onLdapChange');
    }
  }

  handleSmalChange(e) {
    const { name, type, checked, value, id } = e.currentTarget;

    let update = {};
    if (type === 'checkbox') {
      update = {
        [name]: checked
      };
    } else if (type === 'radio') {
      update = {
        [id.replace(`-${value}`, '')]: value
      };
    } else if (type === 'text' || type === 'textarea') {
      update = {
        [id]: value
      };
    } else if (type === 'file') {
      update = {
        [name]: e.target.files
      };
    }

    if (!_isEmpty(update)) {
      this.handleUpdate(update, 'onSamlChange');
    }
  }

  handleOAuthChange(e) {
    const { type, value, name } = e.currentTarget;
    let update = {};
    if (type === 'number') {
      update = {
        [name]: value
      };
    }

    if (!_isEmpty(update) && !_isEmpty(update)) {
      this.handleUpdate(update, 'onOAuthChange');
    }
  }

  handleUpdate(update, method) {
    if (this.props[method] && typeof this.props[method] === 'function') {
      this.props[method](update);
    }
  }

  handleServerSelect({ value }) {
    this.handleUpdate({
      ldapType: value
    }, 'onLdapChange');
  }

  handleNavItemClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    if (href && this.props.onHeaderClick) {
      this.props.onHeaderClick(href);
    }
  }


  render() {
    const {
      strings,
      saml,
      oAuth,
      ldap,
      onOAuthChange,
      loading,
      selectedMenuItem,
      ldapSaveDisabled,
      samlSaveDisabled,
      oAuthSaveDisabled,
      saveLoading,
      isMetadataFileUploading,
      onSave,
      onDnsAliasChange
    } = this.props;
    const styles = require('./AdminSecurityAuthentication.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminSecurityAuthentication: true
    }, this.props.className);

    let saveDisabled = true;
    if (selectedMenuItem === 'ldap') {
      saveDisabled = ldapSaveDisabled;
    } else if (selectedMenuItem === 'saml') {
      saveDisabled = samlSaveDisabled;
    } else {
      saveDisabled = oAuthSaveDisabled;
    }

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.header}>
          <NavMenu
            list={this.menu}
            selectedUrl={selectedMenuItem}
            horizontal
            secondary
            style={{ flex: '1', marginRight: '0.625rem' }}
            onItemClick={this.handleNavItemClick}
          />
          <Btn
            borderless inverted disabled={(saveDisabled || isMetadataFileUploading)}
            loading={saveLoading} onClick={onSave}
          >
            {isMetadataFileUploading ? strings.uploading : strings.save}
          </Btn>
        </div>
        <div>
          {loading && selectedMenuItem !== 'saml' && <Loader type="page" />}
          {(!loading || selectedMenuItem === 'saml') &&
            <div>
              {selectedMenuItem === 'ldap' &&
                <LDAP
                  strings={strings}
                  onChange={this.handleLdapChange}
                  onServerSelect={this.handleServerSelect}
                  {...ldap}
                />
              }
              {selectedMenuItem === 'saml' &&
                <SAML
                  strings={strings}
                  onChange={this.handleSmalChange}
                  {...saml}
                  {...{ isMetadataFileUploading }}
                  {...{ onDnsAliasChange }}
                />
              }
              {selectedMenuItem === 'oAuth' &&
                <OAuth
                  strings={strings}
                  onChange={this.handleOAuthChange}
                  onSelectUpdate={onOAuthChange}
                  {...oAuth}
                />
              }
            </div>
          }
        </div>
      </div>
    );
  }
}
