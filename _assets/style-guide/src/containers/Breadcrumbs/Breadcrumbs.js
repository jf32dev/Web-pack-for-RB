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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';

const BreadcrumbsDocs = require('!!react-docgen-loader!components/Breadcrumbs/Breadcrumbs.js');

const paths1 = [{
  name: 'Single Level',
  path: '/Breadcrumbs'
}];

const paths2 = [{
  name: 'Two Levels',
  path: '/Breadcrumbs'
}, {
  name: 'Second Path',
  path: '/Breadcrumbs/SecondPath'
}];

const paths3 = [{
  name: 'Three Levels',
  path: '/Breadcrumbs'
}, {
  name: 'Second Path',
  path: '/Breadcrumbs/SecondPath'
}, {
  name: 'Third Path',
  path: '/Breadcrumbs/ThirdPath'
}];

const paths4 = [{
  name: 'Four Levels',
  path: '/Breadcrumbs'
}, {
  name: 'Second Path',
  path: '/Breadcrumbs/SecondPath'
}, {
  name: 'Third Path',
  path: '/Breadcrumbs/ThirdPath'
}, {
  name: 'Fourth Path',
  path: '/Breadcrumbs/FourthPath'
}];

export default class BreadcrumbsView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  handleAnchorClick(event) {
    event.preventDefault();
    let path = event.currentTarget.getAttribute('href');
    if (!path) {
      path = event.currentTarget.dataset.path;
    }
    console.log(path);
  }

  render() {
    return (
      <section id="BreadcrumbsView">
        <h1>Breadcrumbs</h1>
        <Docs {...BreadcrumbsDocs} />

        <ComponentItem>
          <Breadcrumbs
            paths={paths1}
            onPathClick={this.handleAnchorClick}
          />
          <Breadcrumbs
            paths={paths2}
            onPathClick={this.handleAnchorClick}
          />
          <Breadcrumbs
            paths={paths3}
            onPathClick={this.handleAnchorClick}
          />
          <Breadcrumbs
            paths={paths3}
            onPathClick={this.handleAnchorClick}
            sortDate
            remove
            sortName
            onDropDownItemClick={this.handleAnchorClick}
          />
          <Breadcrumbs
            paths={paths4}
            noLink
            onPathClick={this.handleAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
