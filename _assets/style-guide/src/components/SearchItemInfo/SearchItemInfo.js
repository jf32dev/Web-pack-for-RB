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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import { defineMessages, FormattedDate } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
import TagItems from 'components/FileItem/TagItems';


const messages = defineMessages({
  updated: { id: 'updated', defaultMessage: 'Updated' },
  fileInfo: { id: 'file-info', defaultMessage: 'File info' },
  showMore: { id: 'show-more', defaultMessage: 'more' }
});

export default class SearchItemInfo extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    createdAt: PropTypes.string,
    tags: PropTypes.array,
    onInfoIconClick: PropTypes.func
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      tagWidth: 0
    };
    this.tagElement = React.createRef();
    autobind(this);
  }

  componentDidMount() {
    this.setState({
      tagWidth: this.tagElement.current.offsetWidth * 2 - 72 // Displayed in two rows
    });
  }

  handleFileInfoClick(event) {
    const { onInfoIconClick } = this.props;
    if (onInfoIconClick && typeof onInfoIconClick === 'function') {
      onInfoIconClick(event, this);
    }
  }

  renderTags(strings, styles) {
    const { tags } = this.props;
    return (<TagItems
      totalWidth={this.state.tagWidth} tags={tags} strings={strings}
      styles={styles} onMoreClick={this.handleFileInfoClick}
    />);
  }


  render() {
    const {
      createdAt
    } = this.props;

    const styles = require('./SearchItemInfo.less');

    // Translations
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);


    return (
      <div className={styles.itemInfoContainer}>
        <span className={styles.updatedLabel}>{strings.updated}</span>
        <span className={styles.date}> <FormattedDate
          value={new Date(createdAt)} year="numeric" month="short"
          day="2-digit"
        /></span>
        <div style={{ width: '17.25rem' }} ref={this.tagElement}>{this.state.tagWidth > 0 && this.renderTags(strings, styles)}</div>
        <div className={styles.info} onClick={this.handleFileInfoClick}>
          <span className={styles.infoIcon} /> <span className={styles.infoLabel}>{strings.fileInfo}</span>
        </div>
      </div>
    );
  }
}
