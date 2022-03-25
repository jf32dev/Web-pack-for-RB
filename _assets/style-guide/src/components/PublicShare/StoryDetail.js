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
import classNames from 'classnames/bind';

import Accordion from 'components/Accordion/Accordion';
import StoryItem from 'components/StoryItem/StoryItem';

/**
 * Story Detail accordion
 */
export default class StoryDetail extends PureComponent {
  static propTypes = {
    /** story object */
    story: PropTypes.object,

    content: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object,
    showAuthor: PropTypes.bool,
  };

  static defaultProps = {
    strings: {
      storyDetails: 'Story Details',
    },
    showAuthor: true
  };

  render() {
    const { strings, story, onClick, showAuthor } = this.props;
    const styles = require('./StoryDetail.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryDetail: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <Accordion
          title={strings.storyDetails}
          defaultOpen
          className={styles.accordion}
        >
          <div className={styles.storyContainer}>
            <StoryItem
              showAuthor={showAuthor}
              thumbSize="small"
              showThumb
              noLink
              onClick={onClick}
              {...story}
            />
          </div>
        </Accordion>
      </div>
    );
  }
}
