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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';

const ShareItemContent = props => {
  const {
    anchorUrl,
    channel,
    name,
    onAnchorClick,
    tab,
    wrapName
  } = props;
  const styles = require('./ShareItemContent.less');
  return (
    <div className={styles.shareItemContentWrapper}>
      <Link to={anchorUrl}>
        <StoryThumbNew {...props} />
      </Link>
      <div className={styles.shareItemContent}>
        <Link to={anchorUrl} className={wrapName ? styles.wrappedName : styles.name}>{name}</Link>
        <div className={wrapName ? styles.wrapText : null}>
          <Link to={`/content/tab/${tab.id}`} onClick={onAnchorClick}>{tab.name}</Link>
          <span>&rsaquo;</span>
          <Link to={`/content/tab/${tab.id}/channel/${channel.id}`} onClick={onAnchorClick}>{channel.name}</Link>
        </div>
      </div>
    </div>
  );
};

ShareItemContent.defaultProps = {
  anchorUrl: '',
  channel: {},
  name: '',
  tab: {},
};

ShareItemContent.propTypes = {
  anchorUrl: PropTypes.string,
  channel: PropTypes.object,
  name: PropTypes.string,
  tab: PropTypes.object,
  onAnchorClick: PropTypes.func
};

export default ShareItemContent;
