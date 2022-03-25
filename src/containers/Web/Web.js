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
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { loadWeb as load } from 'redux/modules/company';

import AccessDenied from 'components/AccessDenied/AccessDenied';
import Blankslate from 'components/Blankslate/Blankslate';
import Btn from 'components/Btn/Btn';
import List from 'components/List/List';
import Loader from 'components/Loader/Loader';

const messages = defineMessages({
  error: { id: 'error', defaultMessage: 'Error' },
  web: { id: 'web', defaultMessage: 'Web' },
  webEmptyHeading: { id: 'web-empty-heading', defaultMessage: 'No Sites available' },
  webEmptyMessage: { id: 'web-empty-message', defaultMessage: 'Add a Personal Site or contact your System Admin to add Sites for your company' },

  //confirmDeleteTitle: { id: 'confirm-delete', defaultMessage: 'Confirm Delete' },
  //confirmDeleteMessage: { id: 'confirm-delete-website', defaultMessage: 'Are you sure you want to delete this website?' },
  //cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  //delete: { id: 'delete', defaultMessage: 'Delete' },
});

function mapStateToProps(state) {
  const { entities, company } = state;
  const list = company.websites.map(id => entities.websites[id]);

  return {
    list: list.filter(obj => !obj.deleted),   // filter deleted
    complete: company.webComplete,
    loaded: company.webLoaded,
    loading: company.webLoading,
    error: company.webError
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    load
  })
)
export default class Web extends Component {
  static propTypes = {
    loaded: PropTypes.bool.isRequired,
    list: PropTypes.array.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    list: []
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    const { hasWeb } = this.context.settings.userCapabilities;

    if (hasWeb) {
      this.props.load();
    }
  }

  handleReloadClick() {
    this.props.load();
  }

  handleCloseClick() {
    this.props.history.push('/');
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { hasWeb } = this.context.settings.userCapabilities;
    const { list, loaded, error } = this.props;
    const styles = require('./Web.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Check user permission
    if (!hasWeb) {
      return (
        <AccessDenied
          heading="Access Denied"
          message="You are not allowed to view Web"
          onCloseClick={this.handleCloseClick}
        />
      );
    }

    // Loading
    if (!loaded && !error) {
      return <Loader type="page" />;

    // Error
    } else if (!loaded && error) {
      return (
        <Blankslate
          icon="error"
          heading={strings.error}
          message={error.message}
          middle
        >
          <Btn onClick={this.handleReloadClick}>Reload</Btn>
        </Blankslate>
      );
    }

    return (
      <div className={styles.Web}>
        <Helmet>
          <title>{strings.web}</title>
        </Helmet>
        <div className={styles.webListWrap}>
          <List
            list={list}
            icon="web"
            grid
            emptyHeading={strings.webEmptyHeading}
            emptyMessage={strings.webEmptyMessage}
            onItemClick={this.props.onAnchorClick}
            onListScroll={this.handleListScroll}
            className={styles.webList}
          />
        </div>
      </div>
    );
  }
}
