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

import debounce from 'lodash/debounce';
import uniqueId from 'lodash/uniqueId';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import getKloudlessConfig from 'helpers/getKloudlessConfig';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  addContact,
  addMultipleContact,
  addCrmFilter,
  removeContact,
  removeFile,
  searchContacts,
  searchCrmByEntities,
  selectFile,
  sendShare,
  setData,
  reset,
} from 'redux/modules/share';
import {
  reset as resetPicker,
} from 'redux/modules/browser';
import {
  setAttribute
} from 'redux/modules/settings';
import {
  loadCrmEntityList,
  saveCrmAccount
} from 'redux/modules/userSettings';
import { createPrompt } from 'redux/modules/prompts';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import Dialog from 'components/Dialog/Dialog';
import FileItem from 'components/FileItem/FileItem';
import FilePickerModal from 'components/FilePickerModal/FilePickerModal';
import Modal from 'components/Modal/Modal';
import MultiSelect from 'components/MultiSelect/MultiSelect';
import Select from 'react-select';
import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';

import ShareIcon from './ShareIcon';
import PreviewModal from './PreviewModal';

const messages = defineMessages({
  contentSuccessfullyShared: { id: 'content-successfully-shared', defaultMessage: 'Content successfully shared' },
  emailPreview: { id: 'email-preview', defaultMessage: 'Email preview' },
  deleteAll: { id: 'delete-all', defaultMessage: 'Delete All' },
  hide: { id: 'hide', defaultMessage: 'Hide' },
  show: { id: 'show', defaultMessage: 'Show' },
  logShareCrm: { id: 'log-share-to-crm', defaultMessage: 'Log Share to {crm}' },
  salesAiInfo: { id: 'sales-ai-info', defaultMessage: 'Sales AI will log this share against the relevant {entity} in {crm}' },
  autoLogToCRM: { id: 'auto-log-to-crm', defaultMessage: 'Auto Log to {crm}' },
  people: { id: 'people', defaultMessage: 'People' },
  share: { id: 'share', defaultMessage: 'Share' },
  shareWithOthers: { id: 'share-with-others', defaultMessage: 'Share with others' },
  loading: { id: 'loading', defaultMessage: 'Loading' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  confirm: { id: 'confirm', defaultMessage: 'Confirm' },
  startTypingToFindEntity: { id: 'start-typing-to-find-entity', defaultMessage: 'Start typing to find {entity}' },
  language: { id: 'language', defaultMessage: 'Language' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  addMessage: { id: 'add-message', defaultMessage: 'Add a message' },
  optional: { id: 'optional', defaultMessage: 'optional' },

  toAddress: { id: 'to', defaultMessage: 'To' },

  ccAddress: { id: 'cc', defaultMessage: 'Cc' },
  subject: { id: 'subject', defaultMessage: 'Subject' },
  message: { id: 'message', defaultMessage: 'Message' },
  files: { id: 'files', defaultMessage: 'Files' },
  addFiles: { id: 'add-files', defaultMessage: 'Add Files' },
  addFilesSingular: { id: 'add-files-singular', defaultMessage: 'Add File(s)' },

  confirmAddContacts: { id: 'confirm-add-contacts', defaultMessage: 'Confirm add contacts' },
  confirmAddContactsMessage: { id: 'confirm-add-contacts-message', defaultMessage: 'This account contains {usersCount} contacts, are you sure you would like to include it?' },
  confirmShareTitle: { id: 'confirm-share', defaultMessage: 'Confirm Share' },
  confirmShareMessage: { id: 'confirm-share-no-files-message', defaultMessage: 'No optional files have been selected, do you want to continue?' },
  mandatoryInfo: { id: 'mandatory-file-info', defaultMessage: 'This mandatory file cannot be deleted as it\'s linked to other file(s)' },
});

class FileItemWrapper extends PureComponent {
  static propTypes = {
    file: PropTypes.object,
    authString: PropTypes.string,
    canRemoveMandatory: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.string
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e, this.props);
    }
  }

  render() {
    const {
      canRemoveMandatory,
      file,
      authString,
      classes,
    } = this.props;
    const styles = require('./ShareModal.less');
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage, { crm: '', entity: '', usersCount: 0 });

    return (
      <div key={file.id} className={classes}>
        {(file.shareStatus !== 'mandatory' || canRemoveMandatory) && <span className={styles.removeBtn} onClick={this.handleClick} />}
        {file.shareStatus === 'mandatory' && !canRemoveMandatory &&
          <span aria-label={strings.mandatoryInfo} data-longtip className={styles.tooltip}><span /></span>
        }
        <FileItem
          thumbSize="small"
          showThumb={false}
          authString={authString}
          className={styles.fileItem}
          hideMeta
          fileSettings={this.props.fileSettings}
          {...file}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { fileSettings, share, settings, userSettings } = state;

  // Ignore blocked files
  let files = share.files.filter(file => file.shareStatus !== 'blocked');

  // Filter ignored categories
  if (ownProps.ignoreCategories && ownProps.ignoreCategories.length) {
    files = files.filter(file => (ownProps.ignoreCategories.indexOf(file.category) === -1));
  }

  // if files have a 'syncing' status
  const isThereFileProcessing = share.files.findIndex(f => f.status === 'processing' || f.status === 'syncing') > -1;

  // Remove processing status as sever will handle it
  if (isThereFileProcessing) {
    const filesProcessing = share.files.filter(f => f.status === 'processing' || f.status === 'syncing');

    for (const pFile of filesProcessing) {
      share.files.find(f => f.id === pFile.id).status = 'active';
    }
  }

  // Filter selected contacts in toAddress
  const contacts = share.contacts.filter(function(contact) {
    return (!share.toAddress.find(item => item.id === contact.id));
  });
  const ccContacts = share.ccContacts.filter(function(contact) {
    return (!share.ccAddress.find(item => item.id === contact.id));
  });

  const languages = [];

  // Format language list for drop down element
  for (const key of Object.keys(settings.languages)) {
    languages.push({ value: key, label: settings.languages[key] });
  }

  // Select first entity - should be opportunity
  let crmAccountType = {};
  if (userSettings.entityCrmList.share) crmAccountType = userSettings.entityCrmList.share[0];

  return {
    ...share,
    ...settings.crm,
    ...settings.shareMenu,
    hideShareCcField: settings.sharing.hideShareCcField,
    attachOptionalFiles: settings.sharing.attachOptionalFiles,
    languages: languages,
    toggleAttributes: settings.toggleAttributes,
    files: files,
    fileSettings: fileSettings,
    contacts: contacts,
    ccContacts: ccContacts,
    entityCrmList: userSettings.entityCrmList.share || [],
    entityCrmListLoaded: userSettings.entityCrmListLoaded,
    entityCrmListLoading: userSettings.entityCrmListLoading,
    entityCrmListError: userSettings.entityCrmListError,
    crmAccountType: crmAccountType,
    previewLoading: share.previewLoading,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    createPrompt,

    addContact,
    addMultipleContact,
    addCrmFilter,
    removeContact,
    removeFile,
    searchContacts,
    searchCrmByEntities,
    selectFile,
    sendShare,
    setData,
    reset,

    resetPicker,

    setAttribute,

    loadCrmEntityList,
    saveCrmAccount
  })
)
export default class ShareModal extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    url: PropTypes.string,
    name: PropTypes.string, // Story title
    files: PropTypes.array,
    ignoreCategories: PropTypes.array,
    sharingPublic: PropTypes.bool,
    sharingFacebookDescription: PropTypes.string,
    sharingLinkedinDescription: PropTypes.string,
    sharingTwitterDescription: PropTypes.string,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    url: '',
    confirmShareNotFile: false,
    serviceDescription: 'Salesforce',
    authenticated: false,
    crmAccountType: {},
    crmAccountTypeList: [],
    ignoreCategories: []
  };

  constructor(props) {
    super(props);

    if (window.share === undefined) {
      window.share = {}; //eslint-disable-line
    }
    this.state = {
      confirmShareNotFile: false,
      confirmAddContacts: false,
      toggleCc: false,
      toggleFileList: true,
      toggleMessage: false,
      logShareToCrm: true,
      showPreview: false,
      crmSearchKeyword: '',
    };

    autobind(this);
    this.handleSearchContacts = debounce(this.handleSearchContacts.bind(this), 500);
    this.handleSearchCrmByEntities = debounce(this.handleSearchCrmByEntities.bind(this), 500);
    this.logShareContainer = null;
    this.authenticatorScript = document.createElement('script');
    this.authBtnRef = React.createRef();
  }

  componentWillMount() {
    const { authenticated, entityCrmListLoaded, entityCrmListLoading } = this.props;

    if (window.share._popup) {  // eslint-disable-line
      window.share._popup.close();  // eslint-disable-line
      window.share._popup = undefined;  // eslint-disable-line
    }

    if (authenticated && !entityCrmListLoaded && !entityCrmListLoading) {
      this.props.loadCrmEntityList(this.props.source);
    }
  }

  componentDidMount() {
    if (window.Kloudless === undefined && !document.getElementById('kloudless')) {
      const { source, id, async } = getKloudlessConfig();
      this.authenticatorScript.src = source;
      this.authenticatorScript.id = id;
      this.authenticatorScript.async = async;
      document.body.appendChild(this.authenticatorScript);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authenticated, contactsError, crmByEntitiesError, files, isVisible, sendError, sent } = nextProps;

    // Confirmation message
    if (sent) {
      this.timer = window.setTimeout(() => {
        window.clearTimeout(this.timer);
        this.props.setData({ sent: false, crmAccountFilter: [], crmAccountType: {} });
      }, 2000);
    }

    // Handle sent errors
    if (sendError.message && (sendError.message !== this.props.sendError.message)) {
      this.props.createPrompt({
        id: uniqueId('sendError-'),
        type: 'error',
        title: 'Error',
        message: sendError.message,
        dismissible: true,
        autoDismiss: 10
      });
    }

    // Handle search contacts errors
    if (contactsError.message && (contactsError.message !== this.props.contactsError.message)) {
      this.props.createPrompt({
        id: uniqueId('contactsError-'),
        type: 'error',
        title: 'Error',
        message: contactsError.message,
        dismissible: true,
        autoDismiss: 10
      });

      if (contactsError.message.indexOf('CRM Account is not authenticated') > -1) {
        this.props.setAttribute('authenticated', false, 'crm');
      }
    }

    if (crmByEntitiesError.message && (crmByEntitiesError.message !== this.props.crmByEntitiesError.message)) {
      this.props.createPrompt({
        id: uniqueId('crmByEntitiesError-'),
        type: 'error',
        title: 'Error',
        message: crmByEntitiesError.message,
        dismissible: true,
        autoDismiss: 10
      });

      if (crmByEntitiesError.message.indexOf('CRM Account is not authenticated') > -1) {
        this.props.setAttribute('authenticated', false, 'crm');
        this.props.setData({ crmAccountFilter: [], crmAccountType: {} });
      }
    }

    // Opening share sheet with files
    if (files.length && isVisible && isVisible !== this.props.isVisible) {
      const optionalFiles = files.filter(file => file.shareStatus === 'optional');
      if (optionalFiles && optionalFiles.length) {
        for (const oFile of optionalFiles) {
          if (this.props.attachOptionalFiles) {
            if (!oFile.selected) { this.props.selectFile(oFile.id); }
          } else if (!this.props.attachOptionalFiles && !this.props.id && this.props.id !== nextProps.id) {
          // Attach Optional files is disabled from Conf bundle
            this.props.removeFile(oFile.id);
          }
        }
      }
    }

    if (authenticated && !this.props.authenticated && !this.props.entityCrmListLoaded && !this.props.entityCrmListLoading) {
      this.props.loadCrmEntityList(this.props.source);
    }

    // Replace variables in the subject
    if (nextProps.subject !== this.props.subject) {
      let parsedSubject = nextProps.subject;
      parsedSubject = parsedSubject.replace(/%first_name%/g, this.context.settings.user.firstname);
      parsedSubject = parsedSubject.replace(/%story_title%/g, nextProps.name);
      this.props.setData({ subject: parsedSubject });
    }

    // toggle description and cc if there is data
    if (nextProps.ccAddress.length > 0 || nextProps.message) {
      this.setState({
        toggleMessage: nextProps.message || this.state.toggleMessage,
        toggleCc: nextProps.ccAddress.length > 0 || this.state.toggleCc,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isVisible !== this.props.isVisible && this.props.isVisible) {
      this.initializeKloudless(this.props.source, this.props.sandbox);
    }
  }

  componentWillUnmount() {
    this.props.reset();
    this.props.resetPicker();
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
    this.props.setAttribute('showAuthenticator', false, 'crm');
    this.setState({ toggleMessage: false, toggleCc: false, toggleFileList: true });
  }

  initializeKloudless = (crmSource, sandbox) => {
    if (window.Kloudless !== undefined && this.authBtnRef.current !== null) {
      const options = {
        client_id: this.props.appId,
        scope: crmSource,
        developer: sandbox === 1 || sandbox === true
      };
      // Launch the Authenticator when the button is clicked
      window.Kloudless.authenticator(this.authBtnRef.current.btn, options, this.handleOnAuthenticateClick);
    }
  }

  handleToggleChannelNavigation() {
    this.props.setData({
      isVisible: false,
      isStoryPickerVisible: true
    });
  }

  handleToggleDialog() {
    this.setState({ confirmShareNotFile: !this.state.confirmShareNotFile });
  }

  handleToggleMessage() {
    this.setState({ toggleMessage: !this.state.toggleMessage });
  }

  handleToggleCc() {
    this.setState({ toggleCc: !this.state.toggleCc });
  }

  handleToggleFileList() {
    this.setState({ toggleFileList: !this.state.toggleFileList });
  }

  handleConfirmAddContact() {
    this.setState({ confirmAddContacts: false, contactType: '' });
  }

  handleCancelAddContactDialog() {
  // Remove last contact added
    if (this.state.contactType === 'contact') {
      this.handlePopContact();
    } else {
      this.handlePopCcContact();
    }

    this.setState({ confirmAddContacts: false, contactType: '', usersCount: 0 });
  }

  handleKeyUp(event) {
    const value = event.target.value;
    // On press enter make a search
    if (value && (event.which === 13 || event.keyCode === 13)) {
    // Sends email - share
      console.log('Sends email to: ' + value); // eslint-disable-line
    }
  }

  handleInputChange(event) {
    const data = {};
    if (event) {
      data[event.target.name] = event.target.value;
      this.props.setData(data);
    }
  }

  handleCancelClick(event) {
    event.preventDefault();
    this.props.setAttribute('showAuthenticator', false, 'crm');
    this.props.reset();
    this.props.resetPicker();
    this.setState({ toggleMessage: false, toggleCc: false, toggleFileList: true });

    this.goBack();
  }

  handleShareClick(event) {
    event.preventDefault();

    const optionalFiles = this.props.files.filter(file =>
      file.shareStatus === 'optional' || (file.shareStatus === 'mandatory' && file.permId !== this.props.id)
    );
    const data = {};
    if (this.state.showPreview) data.showPreview = false;

    if (!optionalFiles || !optionalFiles.length) {
      this.setState({ confirmShareNotFile: true, ...data });
    } else {
      this.handleShare();
      if (this.state.showPreview) this.setState({ ...data });
    }

    this.goBack();
  }

  handlePreviewClick(event) {
    event.preventDefault();
    const { user, userCapabilities } = this.context.settings;
    const langCode = { langCode: this.props.langCode || user.langCode };

    this.props.sendShare({
      ...this.props,
      ...langCode,
      hasCrmIntegration: userCapabilities.hasCrmIntegration,
      logToCrm: this.state.logShareToCrm,
    }, 1);
    this.setState({ showPreview: true });
  }

  goBack() {
    const { router } = this.context;

    // On Share modal Close Redirect to previous path
    if (!window.previousLocation && router.route.location.pathname.indexOf('share/new') > -1) {
      router.history.push('/');
    } else if (window.previousLocation && router.route.location.pathname.indexOf('share/new') > -1) {
      router.history.goBack();

    // Share opened via story
    } else if (router.route.location.pathname.indexOf('/story') === 0) {
      const isModal = router.route.location.state && router.route.location.state.modal;
      router.history.push(router.route.location.pathname.replace('/share', ''), { modal: isModal });

    // Share opened via jsBridge
    } else if (router.route.location.pathname.indexOf('hubshare/new') > -1) {
      router.history.push('/');
    }
  }

  handleConfirmShare() {
    this.handleToggleDialog();
    this.handleShare();
  }

  handleShare() {
    const { user, userCapabilities } = this.context.settings;
    const langCode = { langCode: this.props.langCode || user.langCode };

    this.props.sendShare({
      ...this.props,
      ...langCode,
      hasCrmIntegration: userCapabilities.hasCrmIntegration,
      logToCrm: this.state.logShareToCrm
    });
  }

  handleFileClick(event, context) {
    event.preventDefault();
    this.props.selectFile(context.props.id);
  }

  handleRemoveFileClick(event, context) {
    event.preventDefault();
    this.props.removeFile(context.file.id);
  }

  handleDeleteAllFiles(event) {
    event.preventDefault();
    this.props.removeFile(null, true, this.props.permId);
  }

  handlePreviewCancel(event) {
    event.preventDefault();
    this.setState({ showPreview: false });
    this.props.setData({ isVisible: true });
  }

  handleFilePickerCancel() {
    this.props.setData({
      isVisible: true,
      isStoryPickerVisible: false
    });
  }

  handleFilePickerSelect(event, selectedFiles) {
    const currentFiles = this.props.files;

    // Check new selected list doesnt have any file duplicated
    const tmpSelectedFiles = selectedFiles.map(file => {
      const nFile = file;
      const isFileDuplicated = selectedFiles.find(f => f.filename === file.filename && f.id !== file.id);
      if (isFileDuplicated) {
      // - mandatory override optional files
        if (nFile.shareStatus === 'mandatory' && isFileDuplicated !== 'mandatory') {
          isFileDuplicated.duplicated = true;
        } else {
          nFile.duplicated = true;
        }
      }

      return nFile;
    });

    // Compare current file list with new files selected and Mark file as duplicated
    let nSelectedList = tmpSelectedFiles.map(file => {
      const nFile = file;
      const isFileDuplicated = currentFiles.find(f => f.filename === file.filename && f.id !== file.id);
      if (isFileDuplicated) {
      // - mandatory override optional files
        if (nFile.shareStatus === 'mandatory' && isFileDuplicated !== 'mandatory') {
          isFileDuplicated.duplicated = true;
        } else {
          nFile.duplicated = true;
        }
      }

      return nFile;
    });

    // Avoid inserting same story files twice
    //const nFileList = unionBy(currentFiles, nSelectedList, 'id');
    nSelectedList = nSelectedList.filter(file => {
      return !currentFiles.find(f => f.id === file.id);
    });

    nSelectedList = nSelectedList.concat(currentFiles);

    this.props.setData({
      isVisible: true,
      isStoryPickerVisible: false,
      files: nSelectedList
    });
  }

  handleLanguageChange(item) {
  // Reset other fields when this has changed
    this.props.setData({
      'langCode': item.value,
    });
  }

  ////////////////////////
  // CRM
  ////////////////////////
  handleToggleLogShareToCrm() {
    const styles = require('./ShareModal.less');
    if (this.logShareContainer) {
      this.logShareContainer.className += ' ' + styles.crmFilterContainer;

      // Add overflow class for sliding effect.
      // Note: overflow has to be removed so dropdown menu is visible
      if (this.timer) window.clearInterval(this.timer);
      this.timer = window.setTimeout(() => {
        if (this.logShareContainer) this.logShareContainer.classList.remove(styles.crmFilterContainer);
      }, 5000);
    }
    this.setState({ logShareToCrm: !this.state.logShareToCrm });
  }

  handleOnAuthenticateClick = (result) => {
    this.props.setAttribute('authenticated', true, 'crm');
    this.props.saveCrmAccount(result.account.id, result.account.service);
  }

  handleSearchCcContacts(item) {
    this.handleSearchContacts(item, 'ccContacts');
  }

  handleSearchContacts(item, attribute) {
    const { userCapabilities } = this.context.settings;
    const crmFilter = this.props.crmAccountFilter.length ? this.props.crmAccountFilter[0].accountId : null;

    if (!userCapabilities.hasCrmIntegration || (userCapabilities.hasCrmIntegration && item.length >= 3)) {
      this.props.searchContacts(
        this.props.source,
        10,
        25,
        item,
        'firstname',
        userCapabilities.hasCrmIntegration && this.props.authenticated,
        crmFilter,
        attribute);
    }
  }

  handleAddUser(context, attribute) {
    // CRM Acount user confirmation
    if (context.type === 'crm_account') {
      this.setState({ confirmAddContacts: true, contactType: 'contact', usersCount: context.usersCount });
    }

    // Add new item in field toAddress | ccAddress
    if (Array.isArray(context)) {
      const list = [];
      // copy and paste multiple emails
      for (const value of context) {
        list.push({ id: value.value, name: value.label, status: value.status, ...value });
      }
      this.props.addMultipleContact(list, attribute);
    } else {
      this.props.addContact({
        id: context.value, name: context.label, status: context.status, ...context
      }, attribute);
    }
  }

  handleAddContact(event, context) {
    this.handleAddUser(context, 'toAddress');
  }

  handleAddCcContact(event, context) {
    this.handleAddUser(context, 'ccAddress');
  }

  handlePopContact() {
    // remove last item from field toAddress
    this.props.removeContact('toAddress');

    /*if (this.props.crmAccountType === 'lead') {
     // Remove lead in the toAddress field
     this.handlePopCrmByEntities();
     }*/
  }

  handlePopCcContact() {
    // remove last item from field ccAddress
    this.props.removeContact('ccAddress');
  }

  handleSearchCrmByEntities(keyword) {
    if (keyword.length >= 3) {
      this.props.searchCrmByEntities(this.props.source, this.props.crmAccountType.type, keyword);
      this.setState({ crmSearchKeyword: keyword });
    }
  }

  handleAddCrmByEntities(event, context) {
    let data = {};

    if (Array.isArray(context)) {
      data = {
        id: context[0].value,
        name: context[0].label,
        status: context[0].status,
        email: context[0].email
      };
    } else {
      data = {
        id: context.value,
        name: context.label,
        status: context.status,
        email: context.email
      };
    }

    /*if (this.props.crmAccountType === 'lead') {
     // Insert lead in the toAddress field
     this.handleAddContact(null, { ...data, type: 'crm_contact' });
     }*/

    this.props.addCrmFilter(
      { ...context, ...data },
      'crmAccountFilter'
    );
  }

  handlePopCrmByEntities() {
    // remove last item from field crmAccountFilter
    this.props.removeContact('crmAccountFilter');
  }

  handleEntitiesFilterScroll(event) {
    const target = event.target;
    const {
      crmByEntitiesLoading,
      crmNextPage,
    } = this.props;

    // Determine when near end of list
    const scrollBottom = target.scrollTop + target.offsetHeight;
    const listHeight = target.scrollHeight;
    const loadTrigger = listHeight - (listHeight * 0.25); // 25% of list left

    // Don't trigger if already loading
    if (scrollBottom >= loadTrigger && !crmByEntitiesLoading) {
      // Load more
      if (crmNextPage) {
        this.props.searchCrmByEntities(
          this.props.source,
          this.props.crmAccountType.type,
          this.state.crmSearchKeyword,
          null,
          crmNextPage
        );
      }
    }
  }

  render() {
    const { user, userCapabilities } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const {
      id,
      permId,
      langCode,
      languages,

      files,
      toAddress,
      ccAddress,
      subject,
      message,

      crmAccountType,
      crmAccountFilter,
      crmByEntities,
      serviceDescription,
      source,

      contacts,
      ccContacts,

      isServiceVisible,
      isMessageVisible,
    } = this.props;
    const styles = require('./ShareModal.less');
    const cx = classNames.bind(styles);

    const toAddressInput = cx({
      addressInput: true,
      ccToggleUl: !this.state.toggleCc
    });

    const crmLogButton = cx({
      crmButton: true,
      salesforceBg: source === 'salesforce',
      dynamicsBg: source === 'dynamics',
      defaultCrmBg: source !== 'dynamics' && source !== 'salesforce'
    });

    const sourceIconClass = cx({
      salesforce: source === 'salesforce',
      dynamics: source === 'dynamics',
      defaultCRM: source !== 'dynamics' && source !== 'salesforce'
    });

    let crmIcon = source;
    if (source === 'salesforce') crmIcon = 'cloud-sf';

    const modalWidth = 670;

    // Translations
    const strings = generateStrings(messages, formatMessage, {
      crm: serviceDescription,
      entity: crmAccountType.display, //entityLabel.display
      usersCount: this.state.usersCount || 0
    });

    if (this.state.showPreview) {
      return (<PreviewModal
        template={this.props.preview}
        loading={this.props.previewLoading}
        isVisible
        onClose={this.handlePreviewCancel}
        onShare={this.handleShareClick}
      />);
    }

    if (this.state.confirmShareNotFile) {
      return (<Dialog
        title={strings.confirmShareTitle}
        message={strings.confirmShareMessage}
        isVisible={this.state.confirmShareNotFile}
        cancelText={strings.cancel}
        confirmText={strings.share}
        className={styles.confirmShareDialog}
        onCancel={this.handleToggleDialog}
        onConfirm={this.handleConfirmShare}
      />);
    }

    if (this.state.confirmAddContacts) {
      return (<Dialog
        title={strings.confirmAddContacts}
        message={strings.confirmAddContactsMessage}
        isVisible={this.state.confirmAddContacts}
        cancelText={strings.cancel}
        confirmText={strings.confirm}
        onCancel={this.handleCancelAddContactDialog}
        onConfirm={this.handleConfirmAddContact}
      />);
    }

    // Sent confirmation
    if (this.props.sent) {
      return (<Modal
        isVisible
        autosize={false}
        className={styles.modalTransition}
        bodyClassName={styles.confirmationBodyModal}
        headerClassName={styles.hideHeader}
        backdropClosesModal
        escClosesModal
        onClose={() => {}}
      >
        <svg id="successfullyConfirmation" className={styles.checkmark} viewBox="0 0 52 52">
          <circle className={styles.checkmark__circle} cx="26" cy="26" r="25" fill="none" />
          <path className={styles.checkmark__check} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <h3>{strings.contentSuccessfullyShared}</h3>
      </Modal>);
    }

    // Do not show duplicated files but keep them to validate if mandatory files can be removed
    const fileList = files.filter(file => !file.duplicated);

    const mainModal = (
      <Modal
        isVisible={this.props.isVisible}
        width={modalWidth}
        className={styles.modalTransition}
        headerTitle={strings.shareWithOthers}
        footerChildren={(
          <div>
            <Btn
              large
              alt
              onClick={this.handleCancelClick}
            >
              {strings.cancel}
            </Btn>
            <Btn
              large
              inverted
              loading={this.props.sending}
              disabled={!this.props.toAddress.length || (!fileList.length && !id)}
              onClick={this.handleShareClick}
            >
              {strings.share}
            </Btn>
            <Btn
              large
              inverted
              icon="eye"
              loading={this.props.sending}
              disabled={!this.props.toAddress.length || (!fileList.length && !id)}
              onClick={this.handlePreviewClick}
              className={styles.previewButton}
            />
          </div>
        )}
        headerClassName={styles.header}
        footerClassName={styles.footer}
        onClose={this.handleCancelClick}
      >
        <div className={styles.bodyWrap}>
          <div className={styles.formContainer}>
            <h3>{strings.people}</h3>
            <div className={styles.addressContainer}>
              <span className={styles.addressInputLabel}>{strings.toAddress}:</span>
              <MultiSelect
                id="toAddress"
                name="toAddress"
                value={toAddress}
                options={contacts}
                keyValue="id"
                keyLabel="name"
                multi
                preventSpaceBreak
                insertWhenEnterIsPress
                loading={this.props.contactsLoading}
                backspaceRemoves
                allowsCreateType="email"
                onInputChange={this.handleSearchContacts}
                onAddValue={this.handleAddContact}
                onPopValue={this.handlePopContact}
                className={toAddressInput}
                crmSource={source}
              />
              {!this.props.hideShareCcField && !this.state.toggleCc && <span className={styles.ccToggle} onClick={this.handleToggleCc}>{strings.ccAddress}</span>}
            </div>

            {!this.props.hideShareCcField && this.state.toggleCc && this.props.isCcVisible && <div className={styles.addressContainer}>
              <span className={styles.addressInputLabel}>{strings.ccAddress}:</span>
              <MultiSelect
                id="ccAddress"
                name="ccAddress"
                value={ccAddress}
                options={ccContacts}
                keyValue="id"
                keyLabel="name"
                multi
                preventSpaceBreak
                insertWhenEnterIsPress
                loading={this.props.ccContactsLoading}
                backspaceRemoves
                allowsCreateType="email"
                onInputChange={this.handleSearchCcContacts}
                onAddValue={this.handleAddCcContact}
                onPopValue={this.handlePopCcContact}
                className={toAddressInput}
                crmSource={source}
              />
            </div>}

            <h3>{strings.subject}</h3>
            <Text
              id="subject"
              name="subject"
              value={subject}
              style={{ width: '100%' }}
              onChange={this.handleInputChange}
            />

            {this.state.toggleMessage && <div>
              <h3>{strings.message}</h3>
              {isMessageVisible && <Textarea
                id="message"
                name="message"
                value={message}
                rows={4}
                onChange={this.handleInputChange}
              />}
            </div>}

            <div className={styles.languageWrap}>
              <div className={styles.toggleLink}>
                {!this.state.toggleMessage && <span onClick={this.handleToggleMessage}>{strings.addMessage} {'(' + strings.optional + ')'}</span>}
              </div>
              {languages.length > 0 && <div className={styles.languageContainer}>
                <h3>{strings.language}:</h3>
                <Select
                  id="langCode"
                  name="langCode"
                  value={langCode || user.langCode}
                  options={languages}
                  placeholder={strings.language}
                  clearable={false}
                  className={styles.menuOuterTop}
                  onChange={this.handleLanguageChange}
                  valueKey="value"
                  labelKey="label"
                  autoBlur
                  valueComponent={(option) => (<span className={styles.selectValueInput + ' Select-value'}>
                    <span className={styles.dropdownLink}>{option.value.label}</span>
                  </span>)}
                />
              </div>}
            </div>

            <div>
              <Btn
                small
                inverted
                onClick={this.handleToggleChannelNavigation}
                className={styles.addFilesLink}
              >
                {strings.addFilesSingular}
              </Btn>
            </div>
          </div>

          {files && files.length > 0 && <div className={styles.fileContent}>
            <span className={styles.hideLink} onClick={this.handleToggleFileList}>
              {this.state.toggleFileList && strings.hide}
              {!this.state.toggleFileList && strings.show}
            </span>
            <FormattedMessage
              id="n-files-attached"
              defaultMessage="{itemCount, plural, one {# File attached} other {# Files attached}}"
              values={{ itemCount: files.length }}
              tagName="h4"
            />
            <TransitionGroup className={styles.sliderContainer}>
              {this.state.toggleFileList && <CSSTransition
                classNames={{
                  appear: styles['slide-appear'],
                  appearActive: styles['slide-appear-active'],
                  enter: styles['slide-enter'],
                  enterActive: styles['slide-enter-active'],
                  exit: styles['slide-exit'],
                  exitActive: styles['slide-exit-active']
                }}
                timeout={250}
                appear
              >
                <div className={styles.fileListContainer}>
                  <div className={styles.deleteWrap}>
                    {files.filter(f => (f.shareStatus !== 'mandatory')).length > 0 &&
                    <div
                      className={styles.deleteAll}
                      onClick={this.handleDeleteAllFiles}
                    >
                      {strings.deleteAll}
                    </div>
                    }
                  </div>
                  <div className={styles.fileList}>
                    {fileList.map((file, index) => {
                      const tmpFiles = [...files];
                      // Check whether there is an optional file selected so mandatory can be removed
                      const adHocFiles = tmpFiles.filter(obj => (obj.permId !== id && obj.permId === file.permId && obj.shareStatus !== 'mandatory'));
                      return (<FileItemWrapper
                        key={index}
                        file={{
                          ...file,
                          shareStatus: permId === file.permId ? file.shareStatus : 'optional',
                        }}
                        storyId={id}
                        authString={this.context.settings.authString}
                        canRemoveMandatory={file.shareStatus === 'mandatory' && permId !== file.permId && id !== file.permId && adHocFiles.length === 0}
                        onClick={this.handleRemoveFileClick}
                      />);
                    })}
                  </div>
                </div>
              </CSSTransition>}
            </TransitionGroup>
          </div>}

          {isServiceVisible && userCapabilities.hasCrmIntegration && <div className={styles.crmContainer}>
            {!this.props.authenticated && <Btn
              icon={crmIcon}
              inverted
              className={crmLogButton}
              ref={this.authBtnRef}
            >
              {strings.autoLogToCRM}
            </Btn>}
            {this.props.authenticated && crmAccountType.type && <div>
              <div>
                <Checkbox
                  label={strings.logShareCrm}
                  name="logShare"
                  value={1}
                  checked={!!this.state.logShareToCrm}
                  onChange={this.handleToggleLogShareToCrm}
                  className={sourceIconClass}
                />
                <ShareIcon type="salesAi" className={styles.salesAiIcon} />
              </div>

              <TransitionGroup>
                {this.state.logShareToCrm && <CSSTransition
                  classNames={{
                    appear: styles['slide-appear'],
                    appearActive: styles['slide-appear-active'],
                    enter: styles['slide-enter'],
                    enterActive: styles['slide-enter-active'],
                    exit: styles['slide-exit'],
                    exitActive: styles['slide-exit-active']
                  }}
                  timeout={250}
                  appear
                >
                  <div ref={(node) => { this.logShareContainer = node; }}>
                    <h4>{serviceDescription} {crmAccountType.display} ({strings.optional})</h4>
                    {crmAccountFilter.length === 0 && <MultiSelect
                      id="crmAccountFilter"
                      name="crmAccountFilter"
                      value={crmAccountFilter}
                      options={crmByEntities}
                      placeholder={strings.startTypingToFindEntity + '...'}
                      keyValue="id"
                      keyLabel="name"
                      preventSpaceBreak
                      clearInputOnFocusOut
                      selectItemOnPaste={false}
                      loading={this.props.crmByEntitiesLoading}
                      fetchingMore={this.props.crmByEntitiesLoaded}
                      onInputChange={this.handleSearchCrmByEntities}
                      onAddValue={this.handleAddCrmByEntities}
                      className={styles.selectCrmFilter}
                      onScroll={this.handleEntitiesFilterScroll}
                    />}
                    {crmAccountFilter.length > 0 && <div className={styles.entitySelectedBoxContainer}>
                      <span className={styles.entitySelectedBox}>
                        <span className={crmAccountFilter[0].status === 'error' ? styles.underlineError : null}>{crmAccountFilter[0].name}</span>
                        <span className={styles.removeBtn} onClick={this.handlePopCrmByEntities} />
                      </span>
                    </div>}
                    <span className={styles.salesAiInfo}>{strings.salesAiInfo}</span>
                  </div>
                </CSSTransition>}
              </TransitionGroup>
            </div>}
          </div>}
        </div>
      </Modal>
    );

    return (<div>
      {<FilePickerModal
        width={modalWidth}
        permId={this.props.permId}
        ignoreCategories={this.props.ignoreCategories}
        canShare
        autoSelectMandatory
        allowMultiple
        isVisible={this.props.isStoryPickerVisible}
        onClose={this.handleFilePickerCancel}
        onSave={this.handleFilePickerSelect}
      />}
      {mainModal}
    </div>);
  }
}
