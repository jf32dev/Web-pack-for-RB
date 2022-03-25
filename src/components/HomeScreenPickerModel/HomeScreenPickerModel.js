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
 * @author Shibu Bhattarai <Shibu.Bhattarai@bigtincan.com>
 */

import { get, difference, uniqueId, sortBy } from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';
import Loader from 'components/Loader/Loader';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Icon  from 'components/Icon/Icon';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  getConfigurationBundles,
  assignHomeScreenToConfigBundle,
  clearConfigurationState
} from 'redux/modules/admin/homeScreens';
import { createPrompt } from 'redux/modules/prompts';

const messages = defineMessages({
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  save: { id: 'save', defaultMessage: 'Save' },
  search: { id: 'search', defaultMessage: 'Search' },
  noResults: { id: 'no-results', defaultMessage: 'No Results' },
  emptyMessage: { id: 'search-empty-message', defaultMessage: 'Your search criteria returned no matched results. Please try again.' },
  saving: { id: 'saving', defaultMessage: 'Saving' },
  to: { id: 'to', defaultMessage: 'To' },
  savedSuccessfully: { id: 'saved-successfully', defaultMessage: 'Saved successfully.' },
  manageConfigBundles: { id: 'manage-config-bundles', defaultMessage: 'Manage Configuration Bundles' },
  replaceHomeScreenMessage: { id: 'replace-homescreen-message', defaultMessage: 'This will replace the ‘{homeScreenName}’ Home Screen currently assigned to this Config Bundle' },
});

@connect(state => {
  const {
    configuratonBundles = [],
    configuratonBundlesLoaded,
    configuratonBundlesLoading,
    error,
    homeScreenAssignComplete
  } = state.admin.homeScreens;
  return {
    configuratonBundles: sortBy(configuratonBundles, (bundle) => bundle.name.toLowerCase()),
    configuratonBundlesLoaded,
    configuratonBundlesLoading,
    error,
    homeScreenAssignComplete
  };
}, bindActionCreatorsSafe({
  getConfigurationBundles,
  assignHomeScreenToConfigBundle,
  createPrompt,
  clearConfigurationState
}))
export default class HomeScreenPickerModel extends PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    pages: PropTypes.array
  };

  static defaultProps = {
    isVisible: false
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currentAssignBundle: [],
      saving: false,
      searchTerm: '',
      searchActive: false,
      isValid: false
    };
    this.initialAssignedBundle = [];
    this.pendingOperation = [];
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.getConfigurationBundles();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const strings = generateStrings(messages, formatMessage, { ...naming, homeScreenName: '' });
    if (get(nextProps, 'homeScreenAssignComplete', 0) > 0) {
      this.pendingOperation = this.pendingOperation.filter((id) => id !== get(nextProps, 'homeScreenAssignComplete', 0));
      if (this.pendingOperation.length === 0) {
        this.setState({
          saving: false
        });
        this.props.getConfigurationBundles();
        this.props.clearConfigurationState();
        const { onClose } = this.props;
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
        this.props.createPrompt({
          id: uniqueId('info-'),
          type: 'info',
          message: strings.savedSuccessfully,
          dismissible: true,
          autoDismiss: 5
        });
      } else {
        this.startUpdating();
      }
    }
    if (!get(this.props, 'configuratonBundlesLoaded', false) && get(nextProps, 'configuratonBundlesLoaded', false)) {
      const id = this.props.id;
      const currentAssignBundle = [];
      const type = this.props.type;
      nextProps.configuratonBundles.forEach((item) => {
        let configId = item.currentHomeScreenId;
        if (type === 'legacy') {
          configId = item.currentLegacyHomeScreenId;
        }
        if (configId === id) {
          currentAssignBundle.push(item.id);
        }
      });
      this.setState({
        currentAssignBundle
      });
      this.initialAssignedBundle = Object.assign([], currentAssignBundle);
    }
  }

  getHomeScreenName(bundle) {
    const hsCollections = this.props.type === 'legacy' ? this.props.legacy : this.props.pages;
    const currentHomeScreenId = this.props.type === 'legacy' ? bundle.currentLegacyHomeScreenId : bundle.currentHomeScreenId;
    const hsItem =  hsCollections.find((page) => +page.id === currentHomeScreenId);
    return hsItem ? hsItem.name : '';
  }

  getConfigItem(bundle) {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { currentAssignBundle } = this.state;
    const styles = require('./HomeScreenPickerModel.less');
    const isHsAssignedToBundle = currentAssignBundle.some((item) => item === bundle.id);
    const currentHomeScreenId = this.props.type === 'legacy' ? bundle.currentLegacyHomeScreenId : bundle.currentHomeScreenId;
    const isHSOverride = (currentHomeScreenId !== this.props.id) && isHsAssignedToBundle && currentHomeScreenId > 0;
    const homeScreenName = this.getHomeScreenName(bundle);
    const strings = generateStrings(messages, formatMessage, { ...naming, homeScreenName: homeScreenName });
    const userCountLabel =  (<FormattedMessage
      id="n-users"
      defaultMessage="{itemCount, plural, one {# user} other {# users}}"
      values={{ itemCount: bundle.userCount }}
    />);
    const hsItemLabel = homeScreenName.length > 0 ? ` · ${homeScreenName}` : '';
    return (
      <div className={styles.configBundleItem} key={bundle.id}>
        <Icon className={styles.icon} name="package" />
        <div className={styles.body}>
          <div className={styles.title}>{bundle.name}</div>
          <div className={styles.subtitle}>
            {userCountLabel}
            {hsItemLabel}
          </div>
        </div>
        <div className={styles.action}>
          {isHSOverride && <span className={styles.error} aria-label={strings.replaceHomeScreenMessage}>
            <span className={styles.warning} />
            </span>}
          <Checkbox
            name="config"
            value={bundle.id}
            checked={isHsAssignedToBundle}
            onChange={this.handleCheckboxChange}
          />
        </div>
      </div>
    );
  }

  handleCheckboxChange(event) {
    const { checked, value } = event.target;
    const configBundleId = +value;
    let currentAssignBundle = Object.assign([], this.state.currentAssignBundle);
    if (checked) {
      currentAssignBundle.push(configBundleId);
    } else {
      currentAssignBundle = currentAssignBundle.filter((id) => id !== configBundleId);
    }
    const added = difference(currentAssignBundle, this.initialAssignedBundle);
    const removed = difference(this.initialAssignedBundle, currentAssignBundle);
    const currentStatusCollection = added.concat(removed);
    this.setState({
      currentAssignBundle,
      isValid: currentStatusCollection.length > 0
    });
  }

  handleSave() {
    const currentAssignBundle = Object.assign([], this.state.currentAssignBundle);
    const added = difference(currentAssignBundle, this.initialAssignedBundle);
    const removed = difference(this.initialAssignedBundle, currentAssignBundle);
    this.pendingOperation = [];
    added.forEach((configId) => {
      this.pendingOperation.push({
        configBundleId: configId,
        homeScreenId: this.props.id,
        type: this.props.type
      });
    });
    removed.forEach((configId) => {
      this.pendingOperation.push({
        configBundleId: configId,
        homeScreenId: 0,
        type: this.props.type
      });
    });
    if (this.pendingOperation.length > 0) {
      this.startUpdating();
      this.setState({
        saving: true
      });
    }
  }

  startUpdating() {
    if (this.pendingOperation.length > 0) {
      const currentOperation = this.pendingOperation.pop();
      this.props.assignHomeScreenToConfigBundle(currentOperation.configBundleId, currentOperation.homeScreenId, currentOperation.type);
    }
  }

  handleSearchClear() {
    this.setState({ searchTerm: '' });
  }

  handleSearch(event) {
    this.setState({ searchTerm: event.currentTarget.value });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { naming } = this.context.settings;
    const { isVisible,
      configuratonBundles,
      configuratonBundlesLoading,
      configuratonBundlesLoaded,
      name
    } = this.props;
    const { searchTerm, searchActive, isValid } = this.state;
    const searchTearmLowerCase = searchTerm.toLowerCase();
    const styles = require('./HomeScreenPickerModel.less');
    const strings = generateStrings(messages, formatMessage, { ...naming, homeScreenName: '' });
    const configListFilter = configuratonBundles.filter(bundle => bundle.name.toLowerCase().indexOf(searchTearmLowerCase) !== -1);
    return (
      <Modal
        className={styles.HomeScreenDialog}
        isVisible={isVisible}
        escClosesModal
        fixedAutoHeight
        width="medium"
        headerChildren={
          <span className={styles.modelHeader}>
            <h3 className={styles.headerTitle}>{strings.manageConfigBundles}</h3>
            <span data-name={searchActive ? 'active' : ''} className={styles.search} onClick={() => this.setState({ searchActive: !searchActive })}>
              <Icon name="search" className={styles.searchIcon} />
            </span>
          </span>
        }
        footerChildren={(<div>
          <Btn
            alt
            large
            onClick={this.props.onClose}
            style={{ marginRight: '0.5rem' }}
          >
            {strings.cancel}
          </Btn>
          <Btn inverted disabled={!isValid} large style={{ marginLeft: '0.5rem' }} loading={this.state.saving} onClick={this.handleSave}>
            {this.state.saving ? strings.saving : strings.save}
          </Btn>
        </div>)}
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
        footerClassName={styles.footer}
      >
        <div className={styles.dialogBody}>
          { configuratonBundlesLoading &&
          <div className={styles.loaderContainer}>
            <Loader
              type="content"
              style={{ margin: '0 auto', height: '100%' }}
            />
          </div>}
          {configuratonBundlesLoaded &&
            <div className={styles.bodyContainer}>
              <div className={styles.header} data-name="active">
                { searchActive &&
                <Text
                  className={styles.search}
                  id="config-search"
                  icon="search"
                  placeholder={strings.search}
                  value={searchTerm}
                  showClear={!!(searchTerm && searchTerm.length > 0)}
                  onChange={this.handleSearch}
                  onClearClick={this.handleSearchClear}
                />
              }
                { !searchActive &&
                <div className={styles.nameContainer}>
                  <h4>{strings.to}</h4>
                  <div className={styles.name}>: {name}</div>
                </div>
                }
              </div>
              <div className={styles.list}>
                {configuratonBundlesLoaded && configListFilter.length > 0 && configListFilter.map((bundle) => this.getConfigItem(bundle, strings))}
                {configuratonBundlesLoaded && configListFilter.length === 0 &&
                <div className={styles.noContent}>
                  <Blankslate
                    icon="package"
                    heading={strings.noResults}
                    message={strings.emptyMessage}
                  />
                </div>
                }
              </div>
            </div>}
        </div>
      </Modal>
    );
  }
}
