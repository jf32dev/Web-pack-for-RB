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
import Helmet from 'react-helmet';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';

const messages = defineMessages({
  help: { id: 'help', defaultMessage: 'Help' },
  comingSoon: { id: 'page-coming-soon-message', defaultMessage: 'We’re still building this page for you, please check back soon.' },
});

export default class Help extends Component {
  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  render() {
    const { formatMessage } = this.context.intl;
    const styles = require('./Help.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={styles.Help}>
        <Helmet>
          <title>{strings.help}</title>
        </Helmet>
        <AppHeader>
          <div className={styles.headingWrap}>
            <h3>{strings.help}</h3>
          </div>
        </AppHeader>

        <Blankslate
          middle
          icon="wheelbarrow"
          iconSize={128}
          message={strings.comingSoon}
        />
      </div>
    );
  }
}
