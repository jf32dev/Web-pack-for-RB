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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Dialog from 'components/Dialog/Dialog';

import AdminFormField from 'components/Admin/AdminUtils/FormField/FormField';

/**
 * Admin General General
 */
export default class AdminGeneralGeneral extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    interestAreaScoping: PropTypes.bool,
    groupAdminAdvanced: PropTypes.bool,
    groupAdminCanDeleteUsers: PropTypes.bool,
    currencyDefaultId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    trackSearchData: PropTypes.bool,
    currency: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      companyName: 'Company Name',
      supportEmailAddress: 'Support Email Address',
      enableInterestAreaScoping: 'Enable interest area scoping',
      advancedUserManagement: 'Advanced user management',
      groupAdminCanDeleteUsers: 'Group admin can delete users',
      metadataSettings: 'Metadata Settings',
      defaultCurrency: 'Default Currency',
      popularSearches: 'Popular Searches',
      popularSearchRecommendations: 'Popular search recommendations',
      toManuallyClearData: 'To manually clear the popular search cache, select ‘Purge’.'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.fields = [{
      type: 'text',
      labelKey: 'companyName',
      key: 'name'
    }, {
      type: 'text',
      labelKey: 'supportEmailAddress',
      key: 'email'
    }, {
      type: 'div',
      paddingBottom: '1rem'
    }, {
      type: 'checkbox',
      labelKey: 'enableInterestAreaScoping',
      key: 'interestAreaScoping'
    }, {
      type: 'checkbox',
      labelKey: 'advancedUserManagement',
      key: 'groupAdminAdvanced',
    }, {
      type: 'checkbox',
      labelKey: 'groupAdminCanDeleteUsers',
      key: 'groupAdminCanDeleteUsers'
    }, {
      type: 'hr',
    }, {
      type: 'title',
      labelKey: 'metadataSettings',
    }, {
      type: 'select',
      labelKey: 'defaultCurrency',
      key: 'currencyDefaultId'
    }, {
      type: 'hr',
    }, {
      type: 'title',
      labelKey: 'popularSearches'
    }, {
      type: 'checkbox',
      labelKey: 'popularSearchRecommendations',
      key: 'trackSearchData'
    }, {
      type: 'div',
      paddingBottom: '1.5rem',
    }, {
      type: 'desc',
      labelKey: 'toManuallyClearData'
    }];

    autobind(this);
  }

  handleToggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  }

  handleConfirmPurgeClick(event) {
    event.preventDefault();
    this.props.onChange({
      confirm: 'purge'
    });

    this.setState({
      modalVisible: false
    });
  }

  render() {
    const {
      strings,
      currency,
      onChange
    } = this.props;
    const styles = require('./AdminGeneralGeneral.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      GeneralGeneral: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        {this.fields.map((data, i) => (
          <AdminFormField
            key={i}
            type={data.type}
            label={strings[data.labelKey]}
            value={this.props[data.key]}
            dataKey={data.key}
            onChange={onChange}
            options={currency}
            style={{ paddingBottom: data.paddingBottom }}
          />
        ))}
        <Btn inverted id="purge" onClick={this.handleToggleModal}>{strings.purge}</Btn>
        <Dialog
          isVisible={this.state.modalVisible}
          title={strings.confirmPurge}
          message={strings.confirmPurgeMsg}
          cancelText={strings.cancel}
          confirmText={strings.confirm}
          onCancel={this.handleToggleModal}
          onConfirm={this.handleConfirmPurgeClick}
        />
      </div>
    );
  }
}
