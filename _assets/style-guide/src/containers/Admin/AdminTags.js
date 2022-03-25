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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';
import AdminTags from 'components/Admin/AdminTags/AdminTags';

const TagsSliderDocs = require('!!react-docgen-loader!components/Admin/AdminTags/AdminTags.js');

export default class AdminTagsView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const maxValue = 241;
    const sortBy = 'usage';

    return (
      <section id="NavMenuView">
        <h1>Admin Tags</h1>
        <Docs {...TagsSliderDocs} />

        <h2>Usage</h2>
        <p>Sort tags by total time it's being used.</p>

        <ComponentItem>
          <AdminTags
            sortBy={sortBy}
            maxValue={maxValue}
            list={[
              { id: 1, name: '.house', count: 241 },
              { id: 2, name: '--lol', count: 240 },
              { id: 3, name: 'abandon', count: 231 },
              { id: 4, name: 'dandy', count: 159 },
              { id: 5, name: 'fable', count: 129 },
              { id: 6, name: 'mytag', count: 109 },
              { id: 7, name: 'startDot', count: 89 },
              { id: 8, name: 'cabin', count: 60 }
            ]}
          />
        </ComponentItem>

      </section>
    );
  }
}
