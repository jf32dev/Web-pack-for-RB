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

// import _update from 'lodash/update';

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
// import Debug from '../../views/Debug';

import AdminSecurityAuthentication from 'components/Admin/AdminSecurityAuthentication/AdminSecurityAuthentication';
import AddDomainModal from 'components/Admin/AdminSecurityAuthentication/Utils/AddDomainModal';

const AdminSecurityAuthenticationDocs = require('!!react-docgen-loader!components/Admin/AdminSecurityAuthentication/AdminSecurityAuthentication.js');
const saml = require('../../static/admin/saml.json');
const oAuth = require('../../static/admin/oAuth.json');
const ldap = require('../../static/admin/ldap.json');

export default class AdminSecurityAuthenticationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ldap: {
        activeForest: [{
          domains: [{}]
        }]
      },
      addDomain: {},
      update: {},
      currentActiveForestIndex: 0,
    };
    autobind(this);
  }

  handleTestSettingClick(event) {
    event.preventDefault();
    console.info('click');
  }

  handleChange(update) {
    console.log(update);
    // this.setState({
    //   values: {
    //     ...this.state.values,
    //     ...update,
    //   },
    //   update,
    // });
  }

  handleDomain(e) {
    const { type, value, dataset } = e.currentTarget;
    const { currentActiveForestIndex, addDomain, ldap } = this.state;
    let update = {};

    if (type === 'text') {
      update = {
        addDomain: {
          ...addDomain,
          [dataset.id]: value
        }
      };
    } else if (type === 'button') {
      let activeForest = [];
      if (Object.prototype.hasOwnProperty.call(addDomain, 'domainIndex')) {
        activeForest = ldap.activeForest.map((item, index) =>
          (index === Number(currentActiveForestIndex) ? {
            ...item,
            domainController: item.domainController.map((item, i) => (i !== addDomain.domainIndex ? item : this.state.addDomain))
          } : item)
        );
      } else {
        activeForest = ldap.activeForest.map((item, index) =>
          (index === Number(currentActiveForestIndex) ? {
            ...item,
            domainController: item.domainController.concat(this.state.addDomain)
          } : item)
        );
      }

      update = {
        ldap: {
          ...ldap,
          activeForest,
        },
        addDomain: {
          isVisible: !this.state.addDomain.isVisible
        }
      };
    }

    if (update) {
      this.setState(update);
    }
  }

  handleShowAddDomain() {
    this.setState({
      addDomain: {
        isVisible: !this.state.addDomain.isVisible
      }
    });
  }

  handleShowEditDomain(index) {
    const { addDomain, ldap, currentActiveForestIndex } = this.state;
    // console.log(currentActiveForestIndex, ldap.activeForest[currentActiveForestIndex]);
    this.setState({
      currentActiveForestIndex,
      addDomain: {
        domainIndex: Number(index),
        isVisible: !addDomain.isVisible,
        ...ldap.activeForest[currentActiveForestIndex].domains[index]
      }
    });
  }

  handleDeleteDomain(index) {
    const { ldap, currentActiveForestIndex } = this.state;
    const activeForest = ldap.activeForest.map((item, activeForestIndex) =>
      (activeForestIndex === Number(currentActiveForestIndex) ? {
        ...item,
        domainController: item.domainController.length > 1 ? item.domainController.filter((item, i) => (i !== Number(index))) : [{}]
      } : item)
    );

    this.setState({
      ldap: {
        ...ldap,
        activeForest,
      }
    });
  }



  handleLdapChange(update) {
    // console.log('handleLdapChange');
    this.setState({
      ldap: {
        ...this.state.ldap,
        ...update,
      }
    });
  }

  render() {
    const { ldap, saml, oAuth, addDomain } = this.state;
    // console.log(ldap);
    return (
      <section id="BlankView">
        <h1>Admin Security Authentication</h1>
        <Docs {...AdminSecurityAuthenticationDocs} />
        <ComponentItem>
          <AdminSecurityAuthentication
            onTestSettingClick={this.handleTestSettingClick}
            onSmalChange={this.handleChange}
            onOAuthChange={this.handleChange}
            onLdapChange={this.handleLdapChange}
            onAddDomain={this.handleShowAddDomain}
            onEditDomain={this.handleShowEditDomain}
            onDeleteDomain={this.handleDeleteDomain}
            ldap={ldap}
            saml={saml}
            oAuth={oAuth}
          />
          <AddDomainModal {...addDomain} onChange={this.handleDomain} onClose={this.handleShowAddDomain} />
        </ComponentItem>
      </section>
    );
  }
}
