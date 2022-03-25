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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */
import _debounce from 'lodash/debounce';
import _get from 'lodash/get';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import getKloudlessConfig from 'helpers/getKloudlessConfig';
import { defineMessages } from 'react-intl';
import {
  setData,
  searchCrmByEntities,
  addCrmFilter,
  removeContact,
} from 'redux/modules/share';
import {
  setAttribute
} from 'redux/modules/settings';
import generateStrings from 'helpers/generateStrings';
import MultiSelect from 'components/MultiSelect/MultiSelect';
import {
  logCRM
} from 'redux/modules/note';
import {
  saveCrmAccount,
} from 'redux/modules/userSettings';

import Select from 'react-select';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import MessageInput from 'components/MessageInput/MessageInput';

import classNames from 'classnames/bind';

const messages = defineMessages({
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  log: { id: 'log', defaultMessage: 'Log' },
  noteTitle: { id: 'noteTitle', defaultMessage: 'Note Title' },
  logToCRM: { id: 'log-to-crm', defaultMessage: 'Log to {crm}' },
  selectAnOption: { id: 'select-an-option', defaultMessage: 'Select an option' },
  searchForCrmSolution: { id: 'search-for-crm-solution', defaultMessage: 'Search for a {crm} {entity}' },
  relatedToCRM: { id: 'related-to-crm', defaultMessage: 'Related to ({crm})' },
  crmItem: { id: 'crm-item', defaultMessage: '{crm} {entity}' },
});

function mapStateToProps(state) {
  return {
    ...state.share,
    ...state.settings.crm,
    toggleAttributes: state.settings.toggleAttributes,
    entityCrmList: _get(state.userSettings, 'entityCrmList.note', []),
    entityCrmListLoaded: state.userSettings.entityCrmListLoaded,
    entityCrmListLoading: state.userSettings.entityCrmListLoading,
    entityCrmListError: state.userSettings.entityCrmListError,
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    setData,
    searchCrmByEntities,
    addCrmFilter,
    removeContact,
    logCRM,
    setAttribute,
    saveCrmAccount
  })
)

export default class LogNoteModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    onLogClick: PropTypes.func,
    isVisible: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    isVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      showAccountTypeFilter: false,
      crmSearchKeyword: ''
    };
    autobind(this);

    this.handleDebounceChange = _debounce(this.handleSearchCrmByEntities.bind(this), 300);

    // refs
    this.crmAccountFilter = null;
    this.authenticatorScript = document.createElement('script');
    this.authBtnRef = React.createRef();
  }

  componentDidMount() {
    if (window.Kloudless === undefined && !document.getElementById('kloudless')) {
      const { source, id, async } = getKloudlessConfig();
      this.authenticatorScript.src = source;
      this.authenticatorScript.id = id;
      this.authenticatorScript.async = async;
      document.body.appendChild(this.authenticatorScript);

      this.authenticatorScript.onload = () => this.initializeKloudless(this.props.source, this.props.sandbox);
    } else {
      this.initializeKloudless(this.props.source, this.props.sandbox);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isModalVisible !== nextProps.isModalVisible) {
      this.handleClear();
    }
  }

  initializeKloudless = (crmSource, sandbox) => {
    if (window.Kloudless !== undefined) {
      const options = {
        client_id: this.props.appId,
        scope: crmSource,
        developer: sandbox === 1 || sandbox === true
      };
      // Launch the Authenticator when the button is clicked
      window.Kloudless.authenticator(document.getElementById('note'), options, this.handleOnAuthenticateClick);
    }
  }

  handleDoNothing(e) {
    e.preventDefault();
  }

  handleOnAuthenticateClick = (result) => {
    if (!this.props.showAuthenticator) {
      this.props.setAttribute('authenticated', true, 'crm');
      this.props.saveCrmAccount(result.account.id, result.account.service);
    }
  }

  handleSelectListOpen() {
    if (!this.props.authenticated) {
      document.getElementById('note').click();
    }
  }

  handleCrmAccountTypeChange(item) {
    this.props.setData({
      'crmAccountType': item.type,
      'crmByEntities': [],
    });
    this.setState({ showAccountTypeFilter: true });
    if (this.crmAccountFilter) {
      this.crmAccountFilter.state.inputValue = '';
    }
  }

  handleClose(e) {
    this.handleClear();
    this.props.onClose(e);
  }

  handleSearchCrmByEntities(keyword) {
    if (keyword.length >= 3) {
      this.props.searchCrmByEntities(this.props.source, this.props.crmAccountType, keyword);
      this.setState({
        crmSearchKeyword: keyword
      });
    }
  }

  handleAddCrmByEntities(event, context) {
    this.props.addCrmFilter(
      { id: context.value, name: context.label, status: context.status, ...context },
      'crmAccountFilter'
    );
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
          this.props.crmAccountType,
          this.state.crmSearchKeyword,
          null,
          crmNextPage
        );
      }
    }
  }

  handleLog() {
    this.handleClear();
    this.props.onLogClick(this.props.crmAccountFilter[0].id, this.props.crmAccountType, 'salesforce');
  }

  handlePopCrmByEntities() {
    // remove last item from field crmAccountFilter
    this.props.removeContact('crmAccountFilter');
  }

  handleClear() {
    this.props.setData({
      'crmAccountType': '',
      'crmByEntities': [],
    });
    this.handlePopCrmByEntities();
  }

  render() {
    const styles = require('./LogNoteModal.less');
    const cx = classNames.bind(styles);

    const { formatMessage } = this.context.intl;
    const {
      entityCrmList,
      isModalVisible,
      crmAccountType,
      crmAccountFilter,
      serviceDescription,
      crmByEntities,
      title,
    } = this.props;

    const entityLabel = entityCrmList.find((entity) => entity.type === crmAccountType) || {};
    const strings = generateStrings(messages, formatMessage, { crm: serviceDescription, entity: entityLabel.display });

    const isLogActive = crmAccountType && crmAccountFilter.length > 0 && title;

    const crmAccountFilterClasses = cx({
      selectCrmFilter: crmAccountFilter.length > 0,
      focusHidden: isLogActive
    });
    if (isModalVisible) {
      this.initializeKloudless(this.props.source, this.props.sandbox);
    }

    return (
      <div>
        <Modal
          isVisible={isModalVisible}
          width="medium"
          backdropClosesModal
          escClosesModal
          bodyClassName={styles.modalBody}
          headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.logToCRM}</p>}
          footerChildren={(<div>
            <Btn alt large onClick={this.handleClose} style={{ marginRight: '0.5rem' }}>{strings.cancel}</Btn>
            <Btn
              inverted
              large
              disabled={!isLogActive}
              onClick={this.handleLog}
              style={{ marginLeft: '0.5rem' }}
            >
              {strings.log}
            </Btn>
          </div>)}
          onClose={this.handleClose}
        >
          <div style={{ padding: '1rem 1.5rem' }}>
            <div className={styles.row}>
              <div className={styles.label}>{strings.noteTitle}</div>
              <div className={styles.field}>
                <MessageInput
                  rows={1}
                  value={title}
                  disabled
                  onChange={this.handleDoNothing}
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>
                {strings.relatedToCRM}
              </div>
              <div className={styles.field}>
                <div className={styles.crmContainer}>
                  <Select
                    id="note"
                    name="crmAccountType"
                    value={crmAccountType}
                    options={entityCrmList}
                    placeholder={strings.relatedToCRM}
                    clearable={false}
                    className={styles.selectCrmType}
                    onChange={this.handleCrmAccountTypeChange}
                    onOpen={this.handleSelectListOpen}
                    valueKey="type"
                    labelKey="display"
                    isLoading={this.props.entityCrmListLoading}
                    autoBlur
                  />
                </div>
              </div>
            </div>
            {this.state.showAccountTypeFilter && this.props.authenticated && crmAccountType &&
            <div className={styles.row}>
              <div className={styles.label}>
                {strings.crmItem}
              </div>
              <div className={styles.field}>
                <div className={styles.crmContainer}>
                  <MultiSelect
                    ref={(c) => { this.crmAccountFilter = c; }}
                    name="crmAccountFilter"
                    value={crmAccountFilter}
                    options={crmByEntities}
                    placeholder={strings.searchForCrmSolution}
                    keyValue="id"
                    keyLabel="name"
                    loading={this.props.crmByEntitiesLoading}
                    fetchingMore={this.props.crmByEntitiesLoaded}
                    backspaceRemoves
                    canRemove
                    preventSpaceBreak
                    allowsCreateType="email"
                    onInputChange={this.handleDebounceChange}
                    onRemoveClick={this.handlePopCrmByEntities}
                    onAddValue={this.handleAddCrmByEntities}
                    onPopValue={this.handlePopCrmByEntities}
                    className={crmAccountFilterClasses}
                    onScroll={this.handleEntitiesFilterScroll}
                  />
                </div>
              </div>
            </div>}
          </div>
        </Modal>
      </div>
    );
  }
}
