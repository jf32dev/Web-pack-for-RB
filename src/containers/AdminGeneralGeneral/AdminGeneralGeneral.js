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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { connect } from 'react-redux';

import {
  load as loadSettings
} from 'redux/modules/settings';
import {
  clearPopularSearches
} from 'redux/modules/search';
import {
  ALL,
  CURRENT,
  PURGE_POPULAR_SEARCH_DATA,
  getGeneral,
  setGeneralData,
  postGeneral,
} from 'redux/modules/admin/general';
import { createPrompt } from 'redux/modules/prompts';

import Loader from 'components/Loader/Loader';
import AdminGeneralGeneral from 'components/Admin/AdminGeneralGeneral/AdminGeneralGeneral';

import currencies from 'helpers/currencies';

const messages = defineMessages({
  companyName: {
    id: 'company-name',
    defaultMessage: 'Company Name'
  },
  supportEmailAddress: {
    id: 'support-email-address',
    defaultMessage: 'Support Email Address',
  },
  enableInterestAreaScoping: {
    id: 'enable-interest-area-scoping',
    defaultMessage: 'Enable interest area scoping'
  },
  advancedUserManagement: {
    id: 'advanced-user-management',
    defaultMessage: 'Advanced user management'
  },
  groupAdminCanDeleteUsers: {
    id: 'group-admin-can-delete-users',
    defaultMessage: 'Group admin can delete users'
  },
  metadataSettings: {
    id: 'metadata-settings',
    defaultMessage: 'Metadata Settings'
  },
  defaultCurrency: {
    id: 'default-currency',
    defaultMessage: 'Default Currency'
  },
  popularSearches: {
    id: 'popular-searches',
    defaultMessage: 'Popular Searches',
  },
  popularSearchRecommendations: {
    id: 'popular-search-recommendations',
    defaultMessage: 'Popular search recommendations'
  },
  toManuallyClearData: {
    id: 'manually-clear-data-info',
    defaultMessage: 'To manually clear the popular search cache, select "Purge".'
  },
  purge: {
    id: 'purge',
    defaultMessage: 'Purge'
  },
  cancel: {
    id: 'cancel',
    defaultMessage: 'Cancel'
  },
  confirm: {
    id: 'confirm',
    defaultMessage: 'Confirm'
  },
  confirmPurge: {
    id: 'confirm-purge',
    defaultMessage: 'Confirm Purge'
  },
  confirmPurgeMsg: {
    id: 'confirm-purge-msg',
    defaultMessage: 'Purging data will erase popular search data. Are you sure?'
  },
  fileDetailLabel: {
    id: 'file-detail-label',
    defaultMessage: 'File Detail Label'
  }
});

@connect(state => {
  const {
    currencyDefault,
    interestAreaScoping,
    groupAdminAdvanced,
    groupAdminCanDeleteUsers,
    trackSearchData,
  } = state.admin.general;
  let currencySelected;
  if (currencies) {
    currencySelected = currencies.find(item => item.code === currencyDefault);
    if (currencySelected && currencySelected.code !== currencyDefault) {
      currencySelected = currencies.find(item => item.code === currencyDefault);
    }
  }

  return {
    ...state.admin.general,
    interestAreaScoping: interestAreaScoping === 1,
    groupAdminAdvanced: groupAdminAdvanced === 1,
    groupAdminCanDeleteUsers: groupAdminCanDeleteUsers === 1,
    trackSearchData: trackSearchData === 1,
    currencyOptions: currencies && currencies.map((item) => ({
      value: item.code,
      label: `${item.name} (${item.code})`,
    })),
    currencyDefaultId: currencySelected && currencySelected.code
  };
},
bindActionCreatorsSafe({
  loadSettings,
  clearPopularSearches,
  getGeneral,
  setGeneralData,
  postGeneral,
  createPrompt
})
)
export default class AdminSMTPSetup extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.settingTimer = null;
  }

  componentDidMount() {
    if (this.props.getGeneral) {
      this.props.getGeneral(ALL);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /*error*/
    if (!_get(this.props, 'error', false) && _get(nextProps, 'error', false)) {
      this.props.createPrompt({
        id: 'GENERAL-error',
        type: 'error',
        title: 'Error',
        message: nextProps.error.message,
        dismissible: true,
        autoDismiss: 5
      });
    }
  }

  componentWillUnmount() {
    if (this.settingTimer) {
      window.clearTimeout(this.settingTimer);
    }
  }

  loadSettings() {
    window.clearTimeout(this.settingTimer);
    this.timer = window.setTimeout(() => {
      this.props.loadSettings();
    }, 1000);
  }

  handleChange(update) {
    const key = Object.keys(update)[0];
    const {
      name,
      email
    } = this.props;
    let newUpdate = {
      name,
      email,
    };

    if (key === 'currencyDefaultId') {
      const currencySelected = currencies.find(item => item.code === update[key]);
      newUpdate = {
        ...newUpdate,
        currencyDefault: currencySelected.code
      };
    }

    newUpdate = {
      ...newUpdate,
      ...update,
    };

    if (typeof update[key] === 'boolean') {
      newUpdate = {
        ...newUpdate,
        [key]: update[key] ? 1 : 0
      };
    }

    if (key === 'confirm' && update[key] === 'purge') {
      newUpdate = null;
      this.props.postGeneral(PURGE_POPULAR_SEARCH_DATA);
      this.props.clearPopularSearches();
      this.loadSettings();
    }

    if (key === 'trackSearchData' && !update[key]) {
      this.props.clearPopularSearches();
    }

    if (this.props.setGeneralData && newUpdate) {
      this.props.setGeneralData(CURRENT, newUpdate);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      loading,
      currencyOptions,
      className,
      style,
    } = this.props;
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={className} style={style}>
        {loading && <Loader type="page" />}
        {!loading && <AdminGeneralGeneral
          {...this.props}
          currency={currencyOptions}
          strings={strings}
          onChange={this.handleChange}
        />}
      </div>
    );
  }
}
