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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import parser from 'xml-js';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';
import {
  getSecurity,
  getDNSAliases,
  getSamlSettings,
  setSamlSettings,
  setCustomSecurityMultiKeys,
  setCustomSecurityMultiKeysForm,
  customSecurityPost,
  LDAP,
  SAML,
  LDAP_AD,
  LDAP_EDIR,
  LDAP_TEST_POST,
  OAUTHSETTINGS,
} from 'redux/modules/admin/security';

import { createPrompt } from 'redux/modules/prompts';
import AdminSecurityAuthentication from 'components/Admin/AdminSecurityAuthentication/AdminSecurityAuthentication';
import AddDomainModal from 'components/Admin/AdminSecurityAuthentication/Utils/AddDomainModal';
//https://reacttraining.com/react-router/web/example/preventing-transitions
import AdminPrompt from 'components/Admin/AdminUtils/AdminPrompt/AdminPrompt';

const messages = defineMessages({
  ldap: {
    id: 'ldap',
    defaultMessage: 'LDAP'
  },
  saml: {
    id: 'saml',
    defaultMessage: 'SAML',
  },
  oAuth: {
    id: 'oAuth',
    defaultMessage: 'OAuth'
  },
  activeDirectory: {
    id: 'active-directory',
    defaultMessage: 'Active Directory'
  },
  eDirectory: {
    id: 'e-directory',
    defaultMessage: 'eDirectory'
  },
  onPremiseAdBridge: {
    id: 'on-premise-ad-bridge',
    defaultMessage: 'On-premise AD bridge'
  },
  bridgeAddress: {
    id: 'bridge-address',
    defaultMessage: 'Bridge Address'
  },
  bridgeToken: {
    id: 'bridge-token',
    defaultMessage: 'Bridge Token',
  },
  additionalSettings: {
    id: 'additional-settings',
    defaultMessage: 'Additional Settings'
  },
  recursiveGroups: {
    id: 'recursive-groups',
    defaultMessage: 'Recursive groups',
  },
  AdSecure: {
    id: 'ad-secure',
    defaultMessage: 'AD secure',
  },
  port: {
    id: 'port',
    defaultMessage: 'Port'
  },
  activeForest: {
    id: 'active-forest',
    defaultMessage: 'Active Forest'
  },
  addActiveForest: {
    id: 'add-active-forest',
    defaultMessage: 'Add Active Forest'
  },
  delete: {
    id: 'delete',
    defaultMessage: 'Delete',
  },
  forestName: {
    id: 'forest-name',
    defaultMessage: 'Forest Name',
  },
  serviceAccount: {
    id: 'service-account',
    defaultMessage: 'Service Account',
  },
  serviceAccountPassword: {
    id: 'service-account-password',
    defaultMessage: 'Service Account Password',
  },
  domainController: {
    id: 'domain-controller',
    defaultMessage: 'Domain Controller',
  },
  localoffice: {
    id: 'local-office',
    defaultMessage: 'localoffice',
  },
  edit: {
    id: 'edit',
    defaultMessage: 'Edit'
  },
  addDomainController: {
    id: 'add-domain-controller',
    defaultMessage: 'Add Domain Controller',
  },
  credentials: {
    id: 'credentials',
    defaultMessage: 'Credentials'
  },
  username: {
    id: 'username',
    defaultMessage: 'Username'
  },
  password: {
    id: 'password',
    defaultMessage: 'Password'
  },
  testCredentials: {
    id: 'test-credentials',
    defaultMessage: 'Test Credentials'
  },
  userAuthenticationFailed: {
    id: 'user-authentication-failed',
    defaultMessage: 'User authentication failed'
  },
  userAuthenticationSucceed: {
    id: 'user-authentication-succeed',
    defaultMessage: 'User authentication successful',
  },
  moreDetails: {
    id: 'more-details',
    defaultMessage: 'More details'
  },
  email: {
    id: 'email',
    defaultMessage: 'Email'
  },
  groups: {
    id: 'groups',
    defaultMessage: 'Groups'
  },
  enableSAML: {
    id: 'enable-SAML',
    defaultMessage: 'Enable SAML',
  },
  SpPublicCertificate: {
    id: 'sp-public-certificate',
    defaultMessage: 'SP Public Certificate',
  },
  downloadSpPublicCertificate: {
    id: 'download-sp-public-certificate',
    defaultMessage: 'Download SP Public Certificate',
  },
  SpRolloverCertificate: {
    id: 'sp-rollover-certificate',
    defaultMessage: 'SP Rollover Certificate'
  },
  downloadSpRolloverCertificate: {
    id: 'download-sp-rollover-certificate',
    defaultMessage: 'Download SP Rollover Certificate'
  },
  SpMetadata: {
    id: 'sp-metadata',
    defaultMessage: 'SP Metadata'
  },
  downloadSpMetadata: {
    id: 'download-sp-metadata',
    defaultMessage: 'Download SP metadata',
  },
  amlIdpMetadata: {
    id: 'aml-idp-metadata',
    defaultMessage: 'SAML 2.0 - IdP metadata',
  },
  samlIdpMetadataInfo: {
    id: 'saml-idp-metadata-info',
    defaultMessage: 'These bindings affect which URLs will be selected upon importing an IdP metadata file.',
  },
  dnsAlias: {
    id: 'dns-alias',
    defaultMessage: 'DNS Alias'
  },
  samlSettingNote: {
    id: 'saml-setting-note',
    defaultMessage: 'SAML settings are configured separately for each sub domain. Create a DNS alias for each IdP you need to configure.'
  },
  singleSignOnBinding: {
    id: 'single-sign-on-binding',
    defaultMessage: 'Single sign-on binding',
  },
  redirect: {
    id: 'redirect',
    defaultMessage: 'Redirect',
  },
  singleSignOffBinding: {
    id: 'single-sign-off-binding',
    defaultMessage: 'Single sign-off binding',
  },
  importMetadataFile: {
    id: 'import-metadata-file',
    defaultMessage: 'Import Metadata File'
  },
  metadataOverwriteInfo: {
    id: 'metadata-overwrite-info',
    defaultMessage: 'Uploading an IdP metadata file will overwrite the values set below.',
  },
  entityId: {
    id: 'entity-dd',
    defaultMessage: 'Entity ID'
  },
  singleSignOnUrl: {
    id: 'single-sign-on-url',
    defaultMessage: 'Single sign-on URL'
  },
  singleSignOffUrl: {
    id: 'single-sign-off-url',
    defaultMessage: 'Single sign-off URL'
  },
  x509PublicCertificate: {
    id: 'x509-public-certificate',
    defaultMessage: 'X.509 public certificate'
  },
  samlOtherIdpSettings: {
    id: 'saml-other-idp-settings',
    defaultMessage: 'SAML 2.0 - IdP metadata'
  },
  signMessages: {
    id: 'sign-messages',
    defaultMessage: 'Sign messages',
  },
  signAssertions: {
    id: 'sign-assertions',
    defaultMessage: 'Sign assertions'
  },
  encryptNameId: {
    id: 'encrypt-name-id',
    defaultMessage: 'Encrypt NameID',
  },
  replaceUserMetadataOnReauth: {
    id: 'replaceUser-metadata-on-reauth',
    defaultMessage: 'Replace user metadata on re-authentication',
  },
  accessTokenExpiry: {
    id: 'access-token-expiry',
    defaultMessage: 'Access token expiry',
  },
  refreshToken: {
    id: 'refresh-token',
    defaultMessage: 'Refresh token'
  },
  oneHour: {
    id: 'one-hour',
    defaultMessage: '1 hour'
  },
  twoHours: {
    id: 'two-hours',
    defaultMessage: '2 hours'
  },
  threeHours: {
    id: 'three-hours',
    defaultMessage: '3 hours',
  },
  fourHours: {
    id: 'four-hours',
    defaultMessage: '4 hours',
  },
  fiveHours: {
    id: 'five-hours',
    defaultMessage: '5 hours',
  },
  sixHours: {
    id: 'six-hours',
    defaultMessage: '6 hours',
  },
  sevenHours: {
    id: 'seven-hours',
    defaultMessage: '7 hours',
  },
  eightHours: {
    id: 'eight-hours',
    defaultMessage: '8 hours',
  },
  days: {
    id: 'days',
    defaultMessage: 'Days'
  },
  ldapServer: {
    id: 'ldap-server',
    defaultMessage: 'LDAP Server',
  },
  edAccountSuffix: {
    id: 'ldap-account-suffix',
    defaultMessage: 'LDAP account suffix'
  },
  edBaseDn: {
    id: 'ldap-base-dn',
    defaultMessage: 'LDAP base DN'
  },
  edUsernamePrefix: {
    id: 'ldap-username-prefix',
    defaultMessage: 'LDAP username prefix'
  },
  manageViaEdGroups: {
    id: 'manage-via-ldap-groups',
    defaultMessage: 'Manage via LDAP groups'
  },
  manageViaAdGroups: {
    id: 'manage-via-ad-groups',
    defaultMessage: 'Manage via AD groups'
  },
  edAdminDn: {
    id: 'ldap-admin-dn',
    defaultMessage: 'LDAP admin DN'
  },
  edAdminPassword: {
    id: 'ldap-admin-password',
    defaultMessage: 'LDAP admin password',
  },
  edFilter: {
    id: 'ldap-filter',
    defaultMessage: 'LDAP filter'
  },
  edPort: {
    id: 'ldap-port',
    defaultMessage: 'LDAP port',
  },
  edSecure: {
    id: 'ldap-secure',
    defaultMessage: 'LDAP secure',
  },
  directoryServer: {
    id: 'directory-server',
    defaultMessage: 'Directory Server',
  },
  onPremiseLDAPBridge: {
    id: 'on-premise-LDAP-bridge',
    defaultMessage: 'On-premise LDAP bridge'
  },
  setDomainController: {
    id: 'set-domain-controller',
    defaultMessage: 'Set Domain Controller'
  },
  accountSuffix: {
    id: 'account-suffix',
    defaultMessage: 'Account Suffix',
  },
  baseDn: {
    id: 'base-dn',
    defaultMessage: 'Base DN',
  },
  usernamePrefix: {
    id: 'username-prefix',
    defaultMessage: 'User prefix'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  save: {
    id: 'save',
    defaultMessage: 'Save'
  },
  post: {
    id: 'post',
    defaultMessage: 'Post'
  },
  uploading: {
    id: 'uploading',
    defaultMessage: 'Uploading'
  },
  leaveMessage: {
    id: 'leave-message',
    defaultMessage: 'You have made changes on this page that you have not yet confirmed. If you navigate away from this page you will lose your unsaved changes'
  }
});

@connect(state => {
  const {
    loading,
    //ldap
    accountSuffix,
    activeForest,
    onPremiseAdBridge,
    adBridgeConfiguration,
    bridgeToken,
    edAdminDn,
    // token,
    ldapType,
    manageGroups,
    recursiveGroups,
    ldapSecure,
    port,
    domainController,
    baseDn,
    edAdminPassword,
    usernamePrefix,
    edLdapFilter,
    edLdapPort,
    ldapTestResult,
    bridgeEnable,
    //SAML
    enabled,
    idpSloBinding,
    idpSsoBinding,
    idpEntityId,
    idpSsoUrl,
    idpSloUrl,
    idpX509PublicCert,
    idpSignMessages,
    idpSignAssertions,
    idpEncryptNameid,
    replaceUserMetadataOnReauth,
    //oAuth
    accessTokenLifetime,
    refreshTokenLifetime,

    ldapAdUpdating,
    ldapEdirUpdating,
    ldapSamlUpdating,
    oauthUpdating,

    //dnsAlias
    dnsAliases,
    currentSelectedDnsAlias,
    samlLoading,

    error
  } = state.admin.security;

  let aliasName = '';
  if (currentSelectedDnsAlias && dnsAliases) {
    const aliasDetails = dnsAliases.find(alias => alias.id === currentSelectedDnsAlias);
    if (aliasDetails) {
      aliasName = aliasDetails.alias;
    }
  }

  return {
    loading,
    ldap: {
      list: activeForest,
      ldapType,
      onPremiseAdBridge: onPremiseAdBridge === 1 || onPremiseAdBridge === 0 ? onPremiseAdBridge === 1 : bridgeEnable === 1,
      onPremiseLDAPBridge: bridgeEnable === 1 || bridgeEnable === 0 ? bridgeEnable === 1 : onPremiseAdBridge === 1,
      bridgeAddress: adBridgeConfiguration,
      bridgeToken: bridgeToken,
      manageViaAdGroups: manageGroups === 1,
      recursiveGroups: recursiveGroups === 1,
      AdSecure: ldapSecure === 1,
      ldapServer: domainController,
      port: port || edLdapPort,
      edAccountSuffix: accountSuffix,
      edBaseDn: baseDn,
      edUsernamePrefix: usernamePrefix,
      manageViaEdGroups: manageGroups === 1,
      edAdminDn,
      edAdminPassword,
      edFilter: edLdapFilter,
      edPort: edLdapPort || port,
      edSecure: ldapSecure === 1,
      testCredentialsResult: ldapTestResult || {}
    },
    saml: {
      enabled,
      singleSignOnBinding: idpSsoBinding || 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      singleSignOffBinding: idpSloBinding || 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      SpPublicCertificate: `${window.BTC.BTCAPI4}/company/saml_fetch_cert?access_token=${state.auth.BTCTK_A || localStorage.getItem('BTCTK_A')}&dns_alias=${aliasName}`,
      SpRolloverCertificate: `${window.BTC.BTCAPI4}/company/saml_fetch_rollover_cert?access_token=${state.auth.BTCTK_A || localStorage.getItem('BTCTK_A')}&dns_alias=${aliasName}`,
      SpMetadata: `${window.BTC.BTCAPI4}/company/saml_fetch_sp_metadata?access_token=${state.auth.BTCTK_A || localStorage.getItem('BTCTK_A')}&dns_alias=${aliasName}`,
      singleSignOnBindingRedirect: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      singleSignOnBindingPost: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      singleSignOffBindingRedirect: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect',
      singleSignOffBindingPost: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
      entityId: idpEntityId,
      singleSignOnUrl: idpSsoUrl,
      singleSignOffUrl: idpSloUrl,
      x509PublicCertificate: idpX509PublicCert,
      signMessages: idpSignMessages,
      signAssertions: idpSignAssertions,
      encryptNameId: idpEncryptNameid,
      replaceUserMetadataOnReauth: replaceUserMetadataOnReauth,
      dnsAliases,
      currentSelectedDnsAlias,
      samlLoading
    },
    oAuth: {
      accessTokenLifetime,
      refreshTokenLifetime,
    },
    ldapAdUpdating,
    ldapEdirUpdating,
    ldapSamlUpdating,
    oauthUpdating,
    error
  };
}, bindActionCreatorsSafe({
  getSecurity,
  getDNSAliases,
  getSamlSettings,
  setSamlSettings,
  setCustomSecurityMultiKeys,
  setCustomSecurityMultiKeysForm,
  customSecurityPost,
  createPrompt
}))
export default class AdminSecurityAuthenticationView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      ldapTest: {},
      addDomain: {},
      currentActiveForestIndex: 0,
      selectedMenuItem: 'ldap',
      stateToLoaded: true,
      updatedData: {},
      isMetadataFileUploading: false
    };

    this.headers = {
      ldap: LDAP,
      saml: SAML,
      oAuth: OAUTHSETTINGS,
    };

    this.ldapKeys = {
      onPremiseAdBridge: 'onPremiseAdBridge',
      onPremiseLDAPBridge: 'bridgeEnable',
      bridgeAddress: 'adBridgeConfiguration',
      bridgeToken: 'bridgeToken',
      manageViaAdGroups: 'manageGroups',
      recursiveGroups: 'recursiveGroups',
      AdSecure: 'ldapSecure',
      port: 'port',
      activeForest: 'activeForest',
      ldapServer: 'domainController',
      edAccountSuffix: 'accountSuffix',
      edBaseDn: 'baseDn',
      edUsernamePrefix: 'usernamePrefix',
      manageViaEdGroups: 'manageGroups',
      edAdminDn: 'edAdminDn',
      edAdminPassword: 'edAdminPassword',
      edFilter: 'edLdapFilter',
      edPort: 'edLdapPort',
      edSecure: 'ldapSecure',
      credentialUsername: 'ldapUsername',
      credentialPassword: 'password',
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    /* Load all dns alises */
    if (this.props.getDNSAliases) {
      this.props.getDNSAliases();
    }
    this.updateSetting(this.props.location.search);
    this.setState({
      selectedMenuItem: this.getNameFromSearch(this.props.location.search),
      stateToLoaded: true,
    });

    const { adminUI } = this.context.settings;

    this.adminPaths = adminUI.reduce((obj, current) => {
      if (current.options.length > 0) {
        return [
          ...obj,
          ...current.options.map(option => `/admin/${current.name}/${option.name}`)
        ];
      }
      return [
        ...obj,
        `/admin/${current.name}`
      ];
    }, []);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { saml: { currentSelectedDnsAlias, dnsAliases } } = nextProps;
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'security-error',
        type: 'warning',
        title: 'Warning',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
      return;
    }
    if (!currentSelectedDnsAlias && dnsAliases && dnsAliases.length > 0) {
      this.handleDnsAliasChange({ value: dnsAliases[0].id });
    }
    if (this.props.loading && !nextProps.loading) {
      this.setState({
        stateToLoaded: false
      });
    }

    if (this.props.location.search !== nextProps.location.search) {
      this.updateSetting(nextProps.location.search);
    }

    if (this.state.isMetadataFileUploading) {
      this.setState({
        updatedData: {
          ...this.state.updatedData,
          saml: {
            ...this.state.updatedData.saml,
            entityId: nextProps.saml.entityId,
            singleSignOnUrl: nextProps.saml.singleSignOnUrl,
            singleSignOffUrl: nextProps.saml.singleSignOffUrl,
            x509PublicCertificate: nextProps.saml.x509PublicCertificate,
          }
        },
        isMetadataFileUploading: false
      });
    } else if ((this.props.ldapAdUpdating && !nextProps.ldapAdUpdating) ||
        (this.props.ldapEdirUpdating && !nextProps.ldapEdirUpdating) ||
        (this.props.ldapSamlUpdating && !nextProps.ldapSamlUpdatingne) ||
        (this.props.oauthUpdating && !nextProps.oauthUpdating)) {
      this.setState({
        updatedData: {},
      });

      const saveSuccessMessage = (<FormattedMessage
        id="save-success-message"
        defaultMessage="Saved"
      />);

      this.props.createPrompt({
        id: 'security-success',
        type: 'success',
        title: 'success',
        message: saveSuccessMessage,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  getNameFromSearch(search) {
    let result = 'ldap';
    if (search.indexOf('type=saml') > -1) {
      result = 'saml';
    } else if (search.indexOf('type=oAuth') > -1) {
      result = 'oAuth';
    }

    return result;
  }

  updateSetting(search) {
    const name = this.getNameFromSearch(search);
    if (this.props.getSecurity && name !== 'saml') {
      this.props.getSecurity(this.headers[name]);
    }
  }

  handleSamlChange(update) {
    const key = Object.keys(update)[0];

    const {
      singleSignOnBinding,
      singleSignOffBinding
    } = this.state.updatedData.saml || this.props.saml;

    const booleanKeys = ['enabled', 'replaceUserMetadataOnReauth', 'signMessages', 'signAssertions', 'encryptNameId', 'signMessages'];

    if (booleanKeys.indexOf(key) > -1) {
      const newObj = {
        [key]: update[key] ? 1 : 0
      };
      this.handleStateUpdate(newObj);
    } else if (key === 'idpMetadataFile') {
      const files = update[key];
      if (files.length && files[0].size <= 1024 * 1024 * 1) { // not bigger than 1MB
        this.setState({
          isMetadataFileUploading: true
        });

        try {
          const reader = new FileReader();

          reader.onload = () => {
            const xmlData = reader.result;

            try {
              const jsonObj = parser.xml2js(xmlData, {
                compact: true,
                spaces: 4,
                trim: true,
                ignoreDeclaration: true,
                ignoreInstruction: true,
                attributesKey: 'attributes',
                textKey: 'text'
              });

              const idpSsoUrlPost = _get(jsonObj, 'md:EntityDescriptor.md:IDPSSODescriptor.md:SingleSignOnService', []).filter(binding => binding.attributes.Binding.indexOf('HTTP-POST') > -1)[0];
              const idpSsoUrlRedirect = _get(jsonObj, 'md:EntityDescriptor.md:IDPSSODescriptor.md:SingleSignOnService', []).filter(binding => binding.attributes.Binding.indexOf('HTTP-Redirect') > -1)[0];

              const idpSloUrlPost = _get(jsonObj, 'md:EntityDescriptor.md:IDPSSODescriptor.md:SingleSignOffService', []).filter(binding => binding.attributes.Binding.indexOf('HTTP-POST') > -1)[0];
              const idpSloUrlRedirect = _get(jsonObj, 'md:EntityDescriptor.md:IDPSSODescriptor.md:SingleSignOffService', []).filter(binding => binding.attributes.Binding.indexOf('HTTP-Redirect') > -1)[0];

              const fileMetadata = {
                entityId: _get(jsonObj, 'md:EntityDescriptor.attributes.entityID', ''),
                singleSignOnUrl: singleSignOnBinding.indexOf('HTTP-Redirect') > -1 ? _get(idpSsoUrlRedirect, 'attributes.Location', '') : _get(idpSsoUrlPost, 'attributes.Location'),
                singleSignOffUrl: singleSignOffBinding.indexOf('HTTP-Redirect') > -1 ?  _get(idpSloUrlRedirect, 'attributes.Location') :  _get(idpSloUrlPost, 'attributes.Location'),
                x509PublicCertificate: _get(jsonObj, 'md:EntityDescriptor.md:IDPSSODescriptor.md:KeyDescriptor.ds:KeyInfo.ds:X509Data.ds:X509Certificate.text', '')
              };

              this.setState({
                isMetadataFileUploading: false
              });

              this.handleStateUpdate(fileMetadata);
            } catch (error) {
              this.setState({
                isMetadataFileUploading: false
              });

              const invalidFileErrorMessage = (<FormattedMessage
                id="invalid-file"
                defaultMessage="Invalid file uploaded"
              />);

              this.props.createPrompt({
                id: 'security-error',
                type: 'warning',
                title: 'Warning',
                message: invalidFileErrorMessage,
                dismissible: true,
                autoDismiss: 5
              });
            }
          };
          reader.readAsText(files[0]);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error.message);
        }
      } else {
        const imageSizeErrorMesage = (<FormattedMessage
          id="image-size-should-be-less-n"
          defaultMessage="Images size should be less than 1MB"
          values={{ size: '1MB' }}
        />);

        this.props.createPrompt({
          id: 'security-error',
          type: 'warning',
          title: 'Warning',
          message: imageSizeErrorMesage,
          dismissible: true,
          autoDismiss: 5
        });
      }
    } else {
      const newObj = {
        [key]: update[key]
      };
      this.handleStateUpdate(newObj);
    }
  }

  handleStateUpdate(object) {
    if (!_isEmpty(object)) {
      this.setState({
        updatedData: {
          ...this.state.updatedData,
          saml: {
            ...this.props.saml,
            ...this.state.updatedData.saml,
            ...object
          }
        }
      });
    }
  }

  handleDomain(e) {
    const { type, value, dataset } = e.currentTarget;
    const { currentActiveForestIndex, addDomain, updatedData } = this.state;
    const { ldap } = this.props;
    let update = {};

    if (type === 'text') {
      update = {
        addDomain: {
          ...addDomain,
          [dataset.id]: value
        }
      };
    } else if (type === 'button') {
      let activeForest = _get(updatedData, 'ldap.activeForest', false) || ldap.list;
      const firstDomain = activeForest[+currentActiveForestIndex].domains[0];
      if (Object.prototype.hasOwnProperty.call(addDomain, 'domainIndex')) {
        activeForest = activeForest.map((listItem, index) =>
          (index === +currentActiveForestIndex ? {
            ...listItem,
            domains: listItem.domains.map((item, i) => (i !== addDomain.domainIndex ? item : this.state.addDomain))
          } : listItem)
        );
      } else if (activeForest[+currentActiveForestIndex].domains.length === 1 &&
                  Object.keys(firstDomain).every(key => firstDomain[key] === null || firstDomain[key] === '')) {
        activeForest = activeForest.map((item, index) =>
          (index === +currentActiveForestIndex ? {
            ...item,
            domains: [this.state.addDomain]
          } : item)
        );
      } else {
        activeForest = activeForest.map((item, index) =>
          (index === Number(currentActiveForestIndex) ? {
            ...item,
            domains: item.domains.concat(this.state.addDomain)
          } : item)
        );
      }

      update = {
        updatedData: {
          ...this.state.updatedData,
          ldap: {
            ...this.props.ldap,
            ...this.state.updatedData.ldap,
            list: activeForest,
            activeForest,
          }
        },
        addDomain: {
          isVisible: !this.state.addDomain.isVisible
        }
      };
    }

    if (update) {
      this.setState(update);
    }

    if (!update.addDomain.isVisible) {
      this.handleLdapChange({
        activeForest: update.updatedData.ldap.list
      });
    }
  }

  handleShowAddDomain(currentActiveForestIndex) {
    this.setState({
      currentActiveForestIndex,
      addDomain: {
        isVisible: !this.state.addDomain.isVisible
      }
    });
  }

  handleShowEditDomain({ index, currentActiveForestIndex }) {
    const { addDomain, updatedData } = this.state;
    const { list } = this.props.ldap;
    let oldDomain = _get(list, `${currentActiveForestIndex}.domains.${index}`, {});
    if (updatedData.ldap) {
      oldDomain = updatedData.ldap.list[currentActiveForestIndex].domains[index];
    }

    this.setState({
      currentActiveForestIndex,
      addDomain: {
        domainIndex: Number(index),
        isVisible: !addDomain.isVisible,
        ...oldDomain,
      }
    });
  }

  handleHeaderClick(name) {
    if (name !== this.state.selectedMenuItem) {
      this.setState({
        stateToLoaded: true,
        selectedMenuItem: name,
      });
      this.props.history.push(`/admin/security/authentication?type=${name}`);
    }
  }

  handleDeleteDomain({ index, currentActiveForestIndex }) {
    //index
    const { updatedData } = this.state;
    const ldap = updatedData.ldap || this.props.ldap;
    const activeForest = ldap.list.map((listItem, activeForestIndex) =>
      (activeForestIndex === Number(currentActiveForestIndex) ? {
        ...listItem,
        domains: listItem.domains.length > 1 ? listItem.domains.filter((item, i) => (i !== Number(index))) : [{}]
      } : listItem)
    );

    this.setState({
      updatedData: {
        ...this.state.updatedData,
        ldap: {
          ...this.props.ldap,
          ...this.state.updatedData.ldap,
          activeForest,
          list: activeForest,
        }
      }
    });
  }

  handleLdapChange(update) {
    const key = Object.keys(update)[0];
    let name = LDAP_AD;
    let newObj = {};

    switch (key) {
      case 'activeForest':
        newObj = {
          activeForest: update[key],
          list: update[key]
        };
        break;
      case 'credentialUsername':
      case 'credentialPassword':
        this.setState({
          ldapTest: {
            ...this.state.ldapTest,
            [this.ldapKeys[key]]: update[key]
          }
        });
        name = LDAP_TEST_POST;
        break;
      case 'testCredentials':
        name = LDAP_TEST_POST;
        break;
      default:
        break;
    }

    if (this.props.setCustomSecurityMultiKeys && name !== LDAP_TEST_POST) {
      this.setState({
        updatedData: {
          ...this.state.updatedData,
          ldap: {
            ...this.props.ldap,
            ...this.state.updatedData.ldap,
            ...update,
            ...newObj,
          }
        }
      });
    } else if (key === 'testCredentials' && !_isEmpty(this.state.ldapTest) && this.props.customSecurityPost) {
      this.props.customSecurityPost(LDAP_TEST_POST, this.state.ldapTest);
    }
  }

  handleOAuthChange(update) {
    if (update.refreshTokenLifetime && (+update.refreshTokenLifetime < 14 || +update.refreshTokenLifetime > 365)) {
      const refreshTokenLifetimeErrorMesage = (<FormattedMessage
        id="refresh-token-lifetime-error-message"
        defaultMessage="Refresh token days could not less than 14 or more than 365"
        values={{ size: '1MB' }}
      />);

      this.props.createPrompt({
        id: 'security-error',
        type: 'warning',
        title: 'Warning',
        message: refreshTokenLifetimeErrorMesage,
        dismissible: true,
        autoDismiss: 5
      });
    }

    this.setState({
      updatedData: {
        ...this.state.updatedData,
        oAuth: {
          ...this.props.oAuth,
          ...this.state.updatedData.oAuth,
          ...update,
        }
      }
    });
  }

  trimActiveForest(list) {
    let newList = [];
    if (list && list.length > 0) {
      for (const activeForest of list) {
        if (!this.isObjectEmpty(activeForest)) {
          newList = newList.concat(activeForest);
        } else {
          const domains = activeForest.domains.filter(obj => !this.isObjectEmpty(obj));
          if (domains.length > 0) {
            newList = newList.concat({
              ...activeForest,
              domains,
            });
          }
        }
      }
    }
    return newList;
  }

  isObjectEmpty(obj) {
    let result  = true;
    for (const key in obj) {
      if (obj[key] !== '' && !Array.isArray(obj[key])) {
        result = false;
        break;
      }
    }

    return result;
  }

  handleDnsAliasChange({ value }) {
    if (this.props.getSamlSettings) {
      this.setState({
        updatedData: {},
      });
      this.props.getSamlSettings(value);
    }
  }

  handleSave() {
    const { updatedData, selectedMenuItem } = this.state;
    const { saml: { currentSelectedDnsAlias } } = this.props;
    if (selectedMenuItem === 'saml' && this.props.setSamlSettings && !_isEmpty(updatedData.saml)) {
      const {
        enabled,
        singleSignOnBinding,
        singleSignOffBinding,
        entityId,
        singleSignOnUrl,
        singleSignOffUrl,
        x509PublicCertificate,
        signMessages,
        signAssertions,
        encryptNameId,
        replaceUserMetadataOnReauth,
      } = updatedData.saml;
      this.props.setSamlSettings({
        enabled,
        idpSsoBinding: singleSignOnBinding,
        idpSloBinding: singleSignOffBinding,
        idpEntityId: entityId,
        idpSsoUrl: singleSignOnUrl,
        idpSloUrl: singleSignOffUrl,
        idpX509PublicCert: x509PublicCertificate,
        idpSignMessages: signMessages,
        idpSignAssertions: signAssertions,
        idpEncryptNameid: encryptNameId,
        replaceUserMetadataOnReauth,
        dnsAliasPrefixId: currentSelectedDnsAlias
      });
    } else if (selectedMenuItem === 'oAuth' && this.props.setCustomSecurityMultiKeys && !_isEmpty(updatedData.oAuth)) {
      this.props.setCustomSecurityMultiKeys(OAUTHSETTINGS, {
        ...this.props.oAuth,
        ...updatedData.oAuth
      });
    } else if (selectedMenuItem === 'ldap') {
      const {
        ldapType,
        onPremiseAdBridge,
        bridgeAddress,
        bridgeToken,
        recursiveGroups,
        edSecure,
        AdSecure,
        port,
        list,
        edAccountSuffix,
        edBaseDn,
        ldapServer,
        edUsernamePrefix,
        manageViaAdGroups,
        edAdminDn,
        edAdminPassword,
        edFilter,
        edPort,
      } = this.state.updatedData.ldap;

      //activeDirectory
      let update = {
        onPremiseAdBridge: onPremiseAdBridge ? 1 : 0,
        adBridgeConfiguration: bridgeAddress,
        token: bridgeToken,
        manageGroups: manageViaAdGroups ? 1 : 0,
        recursiveGroups: recursiveGroups ? 1 : 0,
        ldapSecure: AdSecure ? 1 : 0,
        port,
        activeForest: JSON.stringify(this.trimActiveForest(list)),
      };

      let name = LDAP_AD;

      //eDirectory
      if ((selectedMenuItem !== 'ldapType' && ldapType === 'edir') || (selectedMenuItem === 'ldapType' && update.ldap === 'edir')) {
        update = {
          accountSuffix: edAccountSuffix,
          baseDn: edBaseDn,
          domainController: ldapServer,
          usernamePrefix: edUsernamePrefix,
          manageGroups: manageViaAdGroups ? 1 : 0,
          ldapSecure: edSecure ? 1 : 0,
          edAdminDn,
          edAdminPassword,
          edLdapFilter: edFilter,
          edLdapPort: edPort,
          bridgeToken,
          dBridgeConfiguration: bridgeAddress
        };

        name = LDAP_EDIR;
      }
      this.props.setCustomSecurityMultiKeys(name, update);
    }
  }

  render() {
    const {
      loading,
      ldap,
      saml,
      oAuth,
      className,
      style,
    } = this.props;
    const { addDomain, selectedMenuItem, stateToLoaded, updatedData, isMetadataFileUploading } = this.state;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    const dataModified = {
      ldapDataModified: false,
      samlDataModified: false,
      oAuthDataModified: false
    };

    Object.keys(updatedData).forEach(key => {
      if (!dataModified[`${key}DataModified`]) {
        if (key === 'saml') {
          const { singleSignOffUrl, ...samlDataToValidate } = updatedData.saml;
          dataModified.samlDataModified = (dataModified.samlDataModified || !_isEmpty(updatedData.saml)) && JSON.stringify(updatedData[key]) !== JSON.stringify(this.props[key]) && !Object.values(samlDataToValidate).some(v => v === '');
        } else {
          dataModified[`${key}DataModified`] = (dataModified[`${key}DataModified`] || !_isEmpty(updatedData[key])) && JSON.stringify(updatedData[key]) !== JSON.stringify(this.props[key]);
        }
      }
    });

    const {
      ldapDataModified,
      samlDataModified,
      oAuthDataModified
    } = dataModified;

    return (
      <div className={className} style={style}>
        <AdminSecurityAuthentication
          onSamlChange={this.handleSamlChange}
          onOAuthChange={this.handleOAuthChange}
          onLdapChange={this.handleLdapChange}
          onAddDomain={this.handleShowAddDomain}
          onEditDomain={this.handleShowEditDomain}
          onDeleteDomain={this.handleDeleteDomain}
          onHeaderClick={this.handleHeaderClick}
          isMetadataFileUploading={isMetadataFileUploading}
          selectedMenuItem={selectedMenuItem}
          ldap={{
            ...ldap,
            ...updatedData.ldap,
          }}
          saml={{
            ...saml,
            ...updatedData.saml,
          }}
          oAuth={{
            ...oAuth,
            ...updatedData.oAuth
          }}
          onSave={this.handleSave}
          ldapSaveDisabled={!ldapDataModified}
          samlSaveDisabled={!samlDataModified}
          oAuthSaveDisabled={!oAuthDataModified}
          strings={strings}
          loading={loading || stateToLoaded}
          onDnsAliasChange={this.handleDnsAliasChange}
        />
        <AddDomainModal {...addDomain} onChange={this.handleDomain} onClose={this.handleShowAddDomain} strings={strings} />
        {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={ldapDataModified || samlDataModified || oAuthDataModified} />}
      </div>
    );
  }
}
