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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

const messages = defineMessages({
  showGuidelines: { id: 'show-guidelines', defaultMessage: 'Show Guidelines' },
  tagGuidelines: { id: 'tag-guidelines', defaultMessage: 'Tag Guidelines' }
});

export default class StoryEditTags extends PureComponent {
  static propTypes = {
    taggingGuidelines: PropTypes.string
  }

  static defaultProps = {
    taggingGuidelines: ''
  }

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      showGuidelines: false
    };
  }

  handleGuidelineToggle() {
    this.setState(prevState => ({
      showGuidelines: !prevState.showGuidelines
    }));
  }

  render() {
    const {
      formatMessage,
      taggingGuidelines
    } = this.props;
    const { showGuidelines } = this.state;
    // Translations
    const strings = generateStrings(messages, formatMessage);
    const styles = require('./StoryEditTaggingGuidelines.less');

    return (
      <div className={styles.guidelinesContainer}>
        <a onClick={this.handleGuidelineToggle}>{strings.showGuidelines}</a>
        {showGuidelines && <div className={styles.guidelines}>
          <div className={styles.guidelinesHeaddingContainer}>
            <p className={styles.guidelinesHeading}>{strings.tagGuidelines}</p>
            <span className={styles.close} onClick={this.handleGuidelineToggle} />
          </div>
          {/* eslint-disable-next-line react/no-danger */}
          <div className={styles.guidelinesContent} dangerouslySetInnerHTML={{ __html: taggingGuidelines }} />
        </div>}
      </div>
    );
  }
}
