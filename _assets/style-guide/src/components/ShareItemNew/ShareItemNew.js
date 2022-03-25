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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FormattedMessage } from 'react-intl';

import FileItemNew from 'components/FileItemNew/FileItemNew';
import FileThumbNew from 'components/FileThumbNew/FileThumbNew';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';

const ShareItemNew = (props) => {
  const {
    className,
    contactsCount,
    file,
    filesCount,
    grid,
    isActive,
    onClick,
    shareSessionId,
    story,
    strings,
    subject,
    thumbSize
  } = props;

  const styles = require('./ShareItemNew.less');
  const cx = classNames.bind(styles);
  const itemClasses = cx({
    ShareItem: !grid,
    gridItem: grid,
    isActive: isActive,
  }, className);

  const nameClass = cx({
    ellipsis: true,
    fileText: grid,
    noMargin: !grid
  });

  const shareDetailsClass = cx({
    generalShareDetails: true,
    gridShareDetails: grid && !!story,
    textLeft: !grid
  });

  const shareItemWrapper = {
    width: '12.5rem'
  };

  const category = file.category;

  const handleClick = (event) => {
    event.preventDefault();

    if (typeof onClick === 'function') {
      onClick(props);
    }
  };

  return (
    <div className={itemClasses} onClick={handleClick} style={grid ? shareItemWrapper : null}>
      {story && <StoryThumbNew
        colour={story.colour}
        commentCount={story.commentsCount}
        grid={grid}
        ratingCount={story.likesCount}
        style={!grid ? { marginRight: 0 } : {}}
        thumbnail={story.thumbnail}
        thumbSize={thumbSize}
      />}
      {!grid && !story && file.id && <FileThumbNew
        category={category}
        grid={false}
        thumbnail={file.thumbnail}
      />}
      {grid && !story && file.id && <FileItemNew
        isShare
        id={shareSessionId}
        category={file.category}
        grid
        thumbnail={file.thumbnail}
        onClick={() => {}}
      />}
      <div className={grid ? null : styles.listShareDetails}>
        <p className={nameClass}>{subject || `(${strings.noSubject})`}</p>
        <div className={shareDetailsClass}>
          <FormattedMessage
            id="files-count"
            defaultMessage="{contactsCount, plural, one {# Contact} other {# Contacts}} · {filesCount, plural, one {# File} other {# Files}}"
            values={{
              contactsCount,
              filesCount,
            }}
          />
        </div>
      </div>
    </div>
  );
};

ShareItemNew.propTypes = {
  className: PropTypes.string,
  contactsCount: PropTypes.number,
  filesCount: PropTypes.number,
  file: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),

  grid: PropTypes.bool,

  /** Highlights item to indicate active state */
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  shareSessionId: PropTypes.string.isRequired,
  story: PropTypes.object,
  style: PropTypes.object,
  subject: PropTypes.string,
  thumbSize: PropTypes.string
};

ShareItemNew.defaultProps = {
  className: '',
  contactsCount: 0,
  filesCount: 0,
  file: {},
  grid: false,
  isActive: false,
  subject: '',
  story: {},
  strings: {
    noSubject: 'No Subject'
  },
  style: {},
  thumbSize: 'small'
};

export default ShareItemNew;
