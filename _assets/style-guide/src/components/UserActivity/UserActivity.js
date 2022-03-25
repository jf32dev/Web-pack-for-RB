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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Blankslate from 'components/Blankslate/Blankslate';
import List from 'components/List/List';

/**
 * UserActivity is a set of User, File and Story lists.
 */
export default class UserActivity extends PureComponent {
  static propTypes = {
    recentlyFollowed: PropTypes.array,
    recentlyShared: PropTypes.array,
    mostUsedStories: PropTypes.array,
    mostUsedFiles: PropTypes.array,

    authString: PropTypes.string,
    strings: PropTypes.object,

    onAnchorClick: PropTypes.func,
    onFileClick: PropTypes.func
  };

  static defaultProps = {
    recentlyFollowed: [],
    recentlyShared: [],
    mostUsedStories: [],
    mostUsedFiles: [],
    strings: {
      emptyHeading: 'No Activity',
      emptyMessage: 'User has not been active recently',
      recentlyFollowed: 'Recently Followed',
      recentlyShared: 'Recently Shared',
      mostUsedStories: 'Most Used Stories',
      mostUsedFiles: 'Most Used Files'
    }
  };

  render() {
    const {
      recentlyFollowed,
      recentlyShared,
      mostUsedStories,
      mostUsedFiles,
      authString,
      strings,
      onAnchorClick,
      onFileClick
    } = this.props;
    const styles = require('./UserActivity.less');

    // No Activity
    if (!recentlyFollowed.length && !recentlyShared.length && !mostUsedStories.length && !mostUsedFiles.length) {
      const placeholder = require('./noActivityPlaceholder.svg');
      return (
        <Blankslate
          icon={<img alt={strings.emptyHeading} src={placeholder} />}
          heading={strings.emptyHeading}
          message={strings.emptyMessage}
          spacious
        />
      );
    }

    return (
      <div className={styles.UserActivity}>
        {recentlyFollowed.length > 0 && <div className={styles.listWrap} data-type="recently-followed">
          <h5>{strings.recentlyFollowed}</h5>
          <List
            list={recentlyFollowed}
            thumbSize="small"
            showThumb
            grid
            authString={authString}
            onItemClick={onAnchorClick}
            className={styles.userList}
          />
        </div>}

        {recentlyShared.length > 0 && <div className={styles.listWrap} data-type="recently-shared">
          <h5>{strings.recentlyShared}</h5>
          <List
            list={recentlyShared}
            thumbSize="small"
            showThumb
            grid
            authString={authString}
            onItemClick={onAnchorClick}
            className={styles.storyList}
          />
        </div>}

        {mostUsedStories.length > 0 && <div className={styles.listWrap} data-type="most-used-stories">
          <h5>{strings.mostUsedStories}</h5>
          <List
            list={mostUsedStories}
            thumbSize="small"
            showThumb
            grid
            authString={authString}
            onItemClick={onAnchorClick}
            className={styles.storyList}
          />
        </div>}

        {mostUsedFiles.length > 0 && <div className={styles.listWrap} data-type="most-used-files">
          <h5>{strings.mostUsedFiles}</h5>
          <List
            list={mostUsedFiles}
            itemProps={{
              fileSettings: this.props.fileSettings
            }}
            thumbSize="small"
            showThumb
            grid
            authString={authString}
            onItemClick={onFileClick}
            className={styles.fileList}
          />
        </div>}
      </div>
    );
  }
}
