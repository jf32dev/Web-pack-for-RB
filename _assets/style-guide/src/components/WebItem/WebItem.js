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
import classNames from 'classnames/bind';

const WebItem = ({
  id,
  name,
  url,
  thumbnail,
  authString,
  onClick
}) => {
  const handleClick = e => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    }
  };

  const styles = require('./WebItem.less');
  const cx = classNames.bind(styles);

  const thumbClasses = cx({
    thumbnail: true,
    noThumb: !thumbnail,
  });

  const thumbStyle = {
    backgroundImage: thumbnail ? `url(${thumbnail}${authString})` : 'none'
  };

  const linkClasses = cx({
    link: true,
  });

  const iconClasses = cx({
    iconLaunch: true
  });

  return (
    <a
      id={id}
      aria-label={url}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      onClick={handleClick}
      className={linkClasses}
    >
      <div
        aria-label={name}
        className={thumbClasses}
        style={thumbStyle}
      >
        <span>
          {name}
          <i className={iconClasses} />
        </span>
      </div>
    </a>
  );
};

WebItem.defaultProps = {
  authString: ''
};

WebItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
  authString: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default WebItem;
