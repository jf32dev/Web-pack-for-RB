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

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import classNames from 'classnames/bind';

const StoryBadgesNew = ({
  commentCount,
  fileCount,
  ratingCount,
  className,
}) => {
  const styles = require('./StoryBadgesNew.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    iconsWrapper: true,
  }, className);

  const gradientTop = cx({
    gradientTop: ratingCount > 0 || commentCount > 0
  });

  const gradientBottom = cx({
    gradientBottom: fileCount > 0
  });

  return (
    <div className={classes}>
      <div className={gradientTop}>
        {ratingCount > 0 && <Fragment>
          <i className={styles.likeCountIcon} aria-label="number of likes" />
          <FormattedNumber value={ratingCount} />
        </Fragment>}
        {commentCount > 0 && <Fragment>
          <i className={styles.commentCountIcon} aria-label="number of comments" />
          <FormattedNumber value={commentCount} />
        </Fragment>}
      </div>
      <div className={gradientBottom}>
        {fileCount > 0 && <Fragment>
          <i className={styles.fileIcon} aria-label="number of files" />
          <FormattedNumber value={fileCount} />
        </Fragment>}
      </div>
    </div>
  );
};

StoryBadgesNew.propTypes = {
  commentCount: PropTypes.number,
  ratingCount: PropTypes.number,

  className: PropTypes.string,
  style: PropTypes.object
};

export default StoryBadgesNew;
