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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ComponentItem from 'views/ComponentItem';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import Docs from '../../views/Docs';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  importingUsers: { id: 'importing-users', defaultMessage: 'Importing users...' },
  uploading: { id: 'uploading', defaultMessage: 'Uploading...' }
});

const ProgressBarDocs = require('!!react-docgen-loader!components/ProgressBar/ProgressBar.js');

export default class ProgressBarView extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  render() {
    const { formatMessage } = this.context.intl;
    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <section id="progress-bar-view">
        <h1>ProgressBar</h1>
        <Docs {...ProgressBarDocs} />
        <h2>Simple Progress Bar</h2>
        <p>This is a simple progress bar shows how many items have been completed and the total number still to be completed.</p>
        <ComponentItem>
          <ProgressBar
            completedRecords={352}
            totalRecords={1000}
            action={strings.importingUsers}
          />
        </ComponentItem>

        <h2>Percentage Progress Bar</h2>
        <p>This progress bar shows the number of completed items in a percentage.</p>
        <ComponentItem>
          <ProgressBar
            completedRecords={638}
            totalRecords={1000}
            action={strings.uploading}
            percentage
          />
        </ComponentItem>
      </section>
    )
  }
}
