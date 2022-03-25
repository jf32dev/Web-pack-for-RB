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
import React from 'react';
import SVGIcon from 'components/SVGIcon/SVGIcon';

const FileSearchThumb = (props) => {
  const {
    thumbnail,
    authString,
    description,
    category
  } = props;

  const svgIconList = ['powerpoint', 'word', 'excel', 'cad', 'scrollmotion', 'visio', 'potx', '3d-model'];

  const styles = require('./FileSearchThumb.less');

  let childElement = '';

  if (thumbnail !== '') {
    // Thumbnail stored remotely (secure storage)
    const remoteThumb = thumbnail && thumbnail.indexOf('https://') === 0;

    // Don't attach authString if stored remotely
    const thumbUrl = thumbnail + (remoteThumb ? authString : '');

    childElement = (<img alt={description} src={thumbUrl} />);
  } else if (category) {
    childElement = (
      <div className={styles.icon} data-category={category.toLowerCase()}>
        {svgIconList.indexOf(category) !== -1 && <SVGIcon type={category.toLowerCase()} />}
      </div>);
  }

  return (
    <div className={styles.thumbnail}>
      {childElement}
    </div>
  );
};

FileSearchThumb.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  filename: PropTypes.string,
  description: PropTypes.string.isRequired,
  authString: PropTypes.string,
  thumbnail: PropTypes.string,
};

export default FileSearchThumb;
