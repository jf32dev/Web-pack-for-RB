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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';

import moment from 'moment';
import CryptoJS from 'crypto-js';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import {
  getReports,
  deleteReports,
} from 'redux/modules/settings';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';

import AppHeader from 'components/AppHeader/AppHeader';
import Dialog from 'components/Dialog/Dialog';
import Loader from 'components/Loader/Loader';
import Reports from 'components/Reports/Reports';

const messages = defineMessages({
  personalReports: { id: 'personal-reports', defaultMessage: 'Personal Reports' },
  companyReports: { id: 'company-reports', defaultMessage: 'Company Reports' },
  customReports: { id: 'custom-reports', defaultMessage: 'Custom Reports' },
  users: { id: 'users', defaultMessage: 'Users' },
  systemContent: { id: 'system-content', defaultMessage: 'System Content' },
  systemActivity: { id: 'system-activity', defaultMessage: 'System Activity' },
  myActivity: { id: 'my-activity', defaultMessage: 'My Activity' },
  openMultiple: { id: 'open-multiple', defaultMessage: 'Open Multiple' },
  open: { id: 'open', defaultMessage: 'Open' },
  report: { id: 'report', defaultMessage: 'Report' },
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  createCustomReport: { id: 'create-custom-report', defaultMessage: 'Create Custom Report' },

  reports: { id: 'reports', defaultMessage: 'Reports' },
  preparingReport: { id: 'preparing-report', defaultMessage: 'Preparing report' },
  preparingReportInfo: { id: 'preparing-report-info', defaultMessage: 'Please wait while we gather data for your report. This may take a few minutes to complete...' },
  myContent: { id: 'my-content', defaultMessage: 'My Content' },
  activityAnalyis: { id: 'activity-analyis', defaultMessage: 'Activity analyis' },
  company: { id: 'company', defaultMessage: 'Company' },
  usageActivity: { id: 'usage-activity', defaultMessage: 'Usage activity' },
  fileStatistics: { id: 'file-statistics', defaultMessage: 'File statistics' },

  webReport: { id: 'web-report', defaultMessage: 'Web Report' },
  pageReport: { id: 'page-report', defaultMessage: 'Page Report' },
  dashboard: { id: 'dashboard', defaultMessage: 'Dashboard' },
  analysis: { id: 'analysis', defaultMessage: 'Analysis' },
  myDashboards: { id: 'my-dashboards', defaultMessage: 'My Dashboards' },
  deleteReport: { id: 'delete-report', defaultMessage: 'Delete {report}' },
  deleteReportMsg: { id: 'delete-report-msg', defaultMessage: 'Are you sure you want to delete {report}?' },

  'my-stories-dashboard': { id: 'reports-my-stories-dashboard', defaultMessage: 'My {stories} Dashboard' },
  'my-stories-dashboard-info': { id: 'reports-my-stories-dashboard-info', defaultMessage: 'Overview of {story} activity' },
  'my-stories': { id: 'reports-my-stories', defaultMessage: 'My {stories}' },
  'my-stories-info': { id: 'reports-my-stories-info', defaultMessage: '{stories} I have published' },
  'activity-on-my-stories': { id: 'reports-activity-on-my-stories', defaultMessage: 'Activity on My {stories}' },
  'activity-on-my-stories-info': { id: 'reports-activity-on-my-stories-info', defaultMessage: 'A list of actions made on my {stories}' },
  'activity-on-my-files': { id: 'reports-activity-on-my-files', defaultMessage: 'Activity on My Files' },
  'activity-on-my-files-info': { id: 'reports-activity-on-my-files-info', defaultMessage: 'A list of actions made on my files' },
  'my-story-shares': { id: 'reports-my-story-shares', defaultMessage: 'My {story} Shares' },
  'my-story-shares-info': { id: 'reports-my-story-shares-info', defaultMessage: 'Shows share activity for my {stories}' },
  'my-activity-on-files': { id: 'reports-my-activity-on-files', defaultMessage: 'My Activity on Files' },
  'my-activity-on-files-info': { id: 'reports-my-activity-on-files-info', defaultMessage: 'Shows my actions on files' },
  'my-activity-on-stories': { id: 'reports-my-activity-on-stories', defaultMessage: 'My Activity on {stories}' },
  'my-activity-on-stories-info': { id: 'reports-my-activity-on-stories-info', defaultMessage: 'Shows my actions on {stories}' },
  'stories-i-have-shared': { id: 'reports-stories-i-have-shared', defaultMessage: '{stories} I have Shared' },
  'stories-i-have-shared-info': { id: 'reports-stories-i-have-shared-info', defaultMessage: 'Shows my share activity' },
  'user-dashboard': { id: 'reports-user-dashboard', defaultMessage: 'User Dashboard' },
  'user-dashboard-info': { id: 'reports-user-dashboard-info', defaultMessage: 'User overview' },
  'group-dashboard': { id: 'reports-group-dashboard', defaultMessage: 'Group Dashboard' },
  'group-dashboard-info': { id: 'reports-group-dashboard-info', defaultMessage: 'Group activity summary' },
  'all-users': { id: 'reports-all-users', defaultMessage: 'All Users' },
  'all-users-info': { id: 'reports-all-users-info', defaultMessage: 'A list of all user accounts' },
  'users-added-or-deleted': { id: 'reports-users-added-or-deleted', defaultMessage: 'Users Added or Deleted' },
  'users-added-or-deleted-info': { id: 'reports-users-added-or-deleted-info', defaultMessage: 'Recently added or deleted users' },
  'user-by-interest-group': { id: 'reports-user-by-interest-group', defaultMessage: 'User by Interest Group' },
  'user-by-interest-group-info': { id: 'reports-user-by-interest-group-info', defaultMessage: 'A list of users organized by Interest Groups' },
  'user-attributes': { id: 'reports-user-attributes', defaultMessage: 'User Attributes' },
  'user-attributes-info': { id: 'reports-user-attributes-info', defaultMessage: 'A list of users organized by custom attributes' },
  'stories-dashboard': { id: 'reports-stories-dashboard', defaultMessage: '{stories} Dashboard' },
  'stories-dashboard-info': { id: 'reports-stories-dashboard-info', defaultMessage: 'Overview of {stories}' },
  'file-dashboard': { id: 'reports-file-dashboard', defaultMessage: 'File Dashboard' },
  'file-dashboard-info': { id: 'reports-file-dashboard-info', defaultMessage: 'Summary of file activity' },
  'stories-hierarchy': { id: 'reports-stories-hierarchy', defaultMessage: '{stories} Hierarchy' },
  'stories-hierarchy-info': { id: 'reports-stories-hierarchy-info', defaultMessage: 'Shows {stories} by {tabs} and {channels}' },
  'stories-authored-by-channel': { id: 'reports-stories-authored-by-channel', defaultMessage: '{stories} Authored By {channels}' },
  'stories-authored-by-channel-info': { id: 'reports-stories-authored-by-channel-info', defaultMessage: 'Shows {stories} organized by {channels}' },
  'inactive-stories': { id: 'reports-inactive-stories', defaultMessage: 'Inactive {stories}' },
  'inactive-stories-info': { id: 'reports-inactive-stories-info', defaultMessage: 'A list of {stories} that aren\'t being used' },
  'featured-stories': { id: 'reports-featured-stories', defaultMessage: 'Featured {stories}' },
  'featured-stories-info': { id: 'reports-featured-stories-info', defaultMessage: 'A list of Featured {stories}' },
  'upcoming-featured-stories': { id: 'reports-upcoming-featured-stories', defaultMessage: 'Upcoming Featured {stories}' },
  'upcoming-featured-stories-info': { id: 'reports-upcoming-featured-stories-info', defaultMessage: 'A list of planned Featured {stories}' },
  'activity-dashboard': { id: 'reports-activity-dashboard', defaultMessage: 'Activity Dashboard' },
  'activity-dashboard-info': { id: 'reports-activity-dashboard-info', defaultMessage: 'Activity overview' },
  'crm-overview-dashboard': { id: 'reports-crm-overview-dashboard', defaultMessage: 'CRM Overview Dashboard' },
  'crm-overview-dashboard-info': { id: 'reports-crm-overview-dashboard-info', defaultMessage: 'Overview of CRM activity' },
  'marketing-dashboard': { id: 'reports-marketing-dashboard', defaultMessage: 'Marketing Dashboard' },
  'marketing-dashboard-info': { id: 'reports-marketing-dashboard-info', defaultMessage: 'Overview of marketing activity' },
  'activity-on-stories': { id: 'reports-activity-on-stories', defaultMessage: 'Activity on {stories}' },
  'activity-on-stories-info': { id: 'reports-activity-on-stories-info', defaultMessage: 'A list of historic activity on {stories}' },
  'activity-on-files': { id: 'reports-activity-on-files', defaultMessage: 'Activity on Files' },
  'activity-on-files-info': { id: 'reports-activity-on-files-info', defaultMessage: 'List of activity on files' },
  'shared-stories': { id: 'reports-shared-stories', defaultMessage: 'Shared {stories}' },
  'shared-stories-info': { id: 'reports-shared-stories-info', defaultMessage: 'A list of all shared {stories}' },
  'stories-shared-by-group': { id: 'reports-stories-shared-by-group', defaultMessage: '{stories} Shared By Group' },
  'stories-shared-by-group-info': { id: 'reports-stories-shared-by-group-info', defaultMessage: 'Shows {stories} shared by groups' },
  'crm-share-summary': { id: 'reports-crm-share-summary', defaultMessage: 'CRM Share Summary' },
  'crm-share-summary-info': { id: 'reports-crm-share-summary-info', defaultMessage: 'A summary of CRM shares' },
  'crm-share-summary-by-user': { id: 'reports-crm-share-summary-by-user', defaultMessage: 'CRM Share Summary By User' },
  'crm-share-summary-by-user-info': { id: 'reports-crm-share-summary-by-user-info', defaultMessage: 'A summary of CRM shares by user' },
});

function mapStateToProps(state) {
  return {
    accessToken: state.auth.BTCTK_A,
    refreshToken: state.auth.BTCTK_R,
    ...state.settings,
  };
}

@connect(mapStateToProps, bindActionCreatorsSafe({
  getReports,
  deleteReports
}))
export default class ReportsViewer extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      stringsServer: null,
      showDeleteDialog: false,
      returnData: null
    };

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.getReports) {
      this.props.getReports();
    }
  }

  componentWillUnmount() {
    window.onfocus = null;
  }

  setUrlParameters(item) {
    // Crypto variables
    const year = moment().format('YYYY');
    const month = moment().format('MMMM');
    const dateToday = moment().format('YYYY-MM-DD');
    const timeToday = moment().format('YYYY-MM-DD hh:mm:ss');
    const dateMonthBeforeNow = moment().subtract(7, 'days').format('YYYY-MM-DD');

    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const accessToken = this.props.accessToken || localStorage.getItem('BTCTK_A');
    const refreshToken = this.props.refreshToken || localStorage.getItem('BTCTK_R');

    const key128Bits100Iterations = CryptoJS.PBKDF2(window.BTC.REPORT_KEY, salt, { keySize: 128 / 32, iterations: 100 }); // eslint-disable-line new-cap
    const ciphertext = CryptoJS.AES.encrypt(accessToken + '\\' + refreshToken, key128Bits100Iterations, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    let options = '';

    switch (item.category) {
      case 'dashboard': {
        const dashboardOptions = `{"jrd_params":{"reportDateRange":"Last 7 days", "reportYear": ${year}, "reportMonthRangeType": "month", "reportMonthRange":"Jan - Dec (12 months)", "reportStoryShareType":"All Story Shares", "reportDateFrom": "${dateMonthBeforeNow}", "reportDateTo":"${dateToday}"}}`;
        options = `?jrd_resext={"active":0,"reslst":[{"name":"${item.dashboardLocation}", "dsh_params":[${dashboardOptions}] } ]}&jrd_dashboard_mode=edit`;
        break;
      }
      case 'Create': {
        options += `&jrd_params$={"reportDateRange":"All","reportYear":${year},"reportMonthRangeType": "month","reportMonthRange":"Jan - Dec (12 months)","reportMonth":${month},"reportChannel":true,"reportStoryTitle":true,"reportUserStatus":true,"reportDateFrom": "2010-01-01","reportDateTo":"${dateToday}","reportSystemTime": "${timeToday}"}`;
        break;
      }
      case 'webReport': {
        options += '?jrs.catalog=' + item.catalogLocation;
        options += '&jrs.report=' + item.reportLocation;
        options += '&jrs.result_type=' + item.resultType;
        options += '&jrs.param$reportYear=' + year;
        options += '&jrs.param$reportMonth=' + month;
        options += '&jrs.param$reportDateRange=Last 7 days';
        options += '&jrs.param.isAll$reportChannel=true';
        options += '&jrs.param$reportChannel=%07';
        options += '&jrs.param.isAll$reportStoryTitle=true';
        options += '&jrs.param$reportStoryTitle=%07';
        options += '&jrs.param.isAll$reportUserStatus=true';
        options += '&jrs.param$reportUserStatus=%07';

        if (!(window.location.hostname.includes('.com') && this.props.company.id === 2128)) {
          options += '&jrs.param$reportDateFrom=' +
          ((item.languageKey === 'featured-stories' || item.languageKey === 'upcoming-featured-stories') ? '2010-01-01' : dateMonthBeforeNow);  //'2016-12-20'
          options += '&jrs.param$reportDateTo=' + dateToday;
        }

        options += '&jrs.param$reportSystemTime=' + timeToday;
        options += '&jrs.param$reportMonthRange=' + month;


        if (item.languageKey === 'my-stories') {
          options += '&jrs.param$reportStoryType=My Stories';
        } else if (item.languageKey === 'activity-on-my-stories') {
          options += '&jrs.param$reportStoryActivityType=Activity on My Stories';
        } else if (item.languageKey === 'my-activity-on-stories') {
          options += '&jrs.param$reportStoryActivityType=My Activity on Stories';
        } else if (item.languageKey === 'activity-on-my-files') {
          options += '&jrs.param$reportFileActivityType=Activity on My Files';
        } else if (item.languageKey === 'my-activity-on-files') {
          options += '&jrs.param$reportFileActivityType=My Activity on Files';
        } else if (item.languageKey === 'my-story-shares') {
          options += '&jrs.param$reportStoryShareType=My Story Shares';
        } else if (item.languageKey === 'stories-i-have-shared') {
          options += '&jrs.param$reportStoryShareType=Stories I have Shared';
        } else {
          options += '&jrs.param$reportStoryType=All Stories';
          options += '&jrs.param$reportStoryActivityType=All Story Activities';
          options += '&jrs.param$reportFileActivityType=All File Activities';
          options += '&jrs.param$reportStoryShareType=All Story Shares';
        }

        break;
      }
      default:
        break;
    }

    if (item.category.toLowerCase() === 'create') {
      return window.BTC.REPORT_URL + item.url + salt + ':' + iv + ':' + encodeURIComponent(ciphertext.toString()) + options;
    } else if (item.category.toLowerCase() === 'result') {
      return window.BTC.REPORT_URL + item.fullUrl + '&authorized_user=' + salt + ':' + iv + ':' + encodeURIComponent(ciphertext.toString());
    }

    return window.BTC.REPORT_URL + item.url.split('?')[0] + options + '&authorized_user=' + salt + ':' + iv + ':' + encodeURIComponent(ciphertext.toString());
  }

  setCreateUrl(item) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const accessToken = this.props.accessToken || localStorage.getItem('BTCTK_A');
    const refreshToken = this.props.refreshToken || localStorage.getItem('BTCTK_R');

    const key128Bits100Iterations = CryptoJS.PBKDF2(window.BTC.REPORT_KEY, salt, { keySize: 128 / 32, iterations: 100 }); // eslint-disable-line new-cap
    const ciphertext = CryptoJS.AES.encrypt(accessToken + '\\' + refreshToken, key128Bits100Iterations, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

    if (item.languageKey === 'create-visual-analysis') {
      return this.setUrlParameters(item);
    }

    return window.BTC.REPORT_URL + item.url + salt + ':' + iv + ':' + encodeURIComponent(ciphertext.toString());
  }

  openInNewWindow(url) {
    // Browsers don't like opening multiple windows at once
    // setTimeout seems to get around this
    window.setTimeout(() => {
      // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
      const newWindow = window.open(url);
      newWindow.opener = null;
    }, 10);
  }

  handleOpenReports(openList) {
    for (const item of openList) {
      this.openInNewWindow(this.setUrlParameters(item));
    }
  }

  handleCreateReport(e) {
    const { dataset } = e.currentTarget;
    const create = this.props.reports.find(item => item.type === 'Create').options.find(item => item.languageKey === dataset.name);
    this.openInNewWindow(this.setCreateUrl(create));
  }

  handleDeleteClick(e, returnData) {
    this.setState({
      showDeleteDialog: true,
      returnData,
    });
  }

  handleCancelDialog() {
    this.setState({
      showDeleteDialog: false
    });
  }

  handleConfirmDialog() {
    if (this.props.deleteReports) {
      this.props.deleteReports({
        resourceLocation: this.state.returnData.dashboardLocation || this.state.returnData.reportLocation
      });
    }
    this.handleCancelDialog();
  }

  focusInHandler() {
    if (this.props.getReports) {
      this.props.getReports();
    }
  }

  render() {
    const { naming } = this.context.settings;
    const { formatMessage } = this.context.intl;
    const styles = require('./Reports.less');
    const { reports } = this.props;
    // Translations
    const strings = generateStrings(messages, formatMessage, { ...naming, report: _get(this.state.returnData, 'title', '') });
    // Header breadcrumbs
    const paths = [{
      name: strings.reports,
      path: '/reports'
    }];
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{strings.reports}</title>
        </Helmet>
        <AppHeader paths={paths} showBreadcrumbs />
        {!reports && <Loader type="page" />}
        {reports &&
        <Reports
          list={reports.map(item => ({
            ...item,
            options: item.options.map(option => ({
              ...option,
              clickUrl: this.setUrlParameters(option)
            }))
          }))}
          className={styles.reportsMain}
          onCreateReportClick={this.handleCreateReport}
          containerClassName={styles.reportContainer}
          strings={{
            ...strings,
            ...this.state.stringsServer
          }}
          onDeleteClick={this.handleDeleteClick}
          onOpenReports={this.handleOpenReports}
        />}
        <Dialog
          title={strings.deleteReport}
          message={strings.deleteReportMsg}
          isVisible={this.state.showDeleteDialog}
          onCancel={this.handleCancelDialog}
          onConfirm={this.handleConfirmDialog}
        />
      </div>
    );
  }
}
