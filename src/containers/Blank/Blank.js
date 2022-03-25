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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  load
} from 'redux/modules/content';
//import { mapStories } from 'redux/modules/entities/helpers';

import AppHeader from 'components/AppHeader/AppHeader';
import Blankslate from 'components/Blankslate/Blankslate';

const messages = defineMessages({
  example: { id: 'example', defaultMessage: 'Example' },
});

function mapStateToProps(state) {
  const { company } = state;
  return company;
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    load
  })
)
export default class Blank extends Component {
  static propTypes = {
    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    //this.state = { somethingIs: true };
    autobind(this);

    // refs
    this.container = null;
  }

  componentDidMount() {
    //if (!this.props.loaded) {
    //  this.props.load();
    //}
  }

  render() {
    //const { settings } = this.context;
    const { formatMessage } = this.context.intl;
    //const { item } = this.props;
    const styles = require('./Blank.less');

    // Translations
    const strings = generateStrings(messages, formatMessage);

    return (
      <div
        ref={(c) => { this.container = c; }}
        className={styles.Blank}
      >
        <AppHeader />
        <h3>{strings.example}</h3>
        <Blankslate
          icon="wheelbarrow"
          iconSize={128}
          message="We’re still building this page for you, please check back soon"
          style={{ marginTop: '2rem' }}
        />
      </div>
    );
  }
}
