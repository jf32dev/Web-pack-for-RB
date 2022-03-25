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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import FileItemNew from 'components/FileItemNew/FileItemNew';

const BookmarkItemNew = ({
  id,
  name,
  setData,
  grid,
  fileSettings,
  showThumb,
  authString,
  className,
  style,
  onFilesClick,
  onStoryClick,
  showAuthor,
  strings
}) => {
  const options = {
    id,
    grid,
    showThumb,
    authString,
    className,
    style,
    ...setData[0]
  };

  // Override description/category if file stack

  if (setData.length > 1) {
    options.description = name;
    options.category = 'stack';
  }

  return setData[0].type === 'story' ?
    <StoryItemNew
      thumbSize="medium"
      onClick={onStoryClick}
      {...{ showAuthor }}
      {...{ strings }}
      {...options}
    /> : <FileItemNew
      {...options}
      {...{ setData }}
      fileSettings={fileSettings}
      stackSize={setData.length}
      onClick={onFilesClick}
    />;
};

BookmarkItemNew.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  setData: PropTypes.array,

  /** grid style */
  grid: PropTypes.bool,

  showAuthor: PropTypes.bool,

  /** passed to File/Story */
  showThumb: PropTypes.bool,

  strings: PropTypes.object,

  authString: PropTypes.string,

  onFilesClick: PropTypes.func.isRequired,
  onStoryClick: PropTypes.func.isRequired,


  className: PropTypes.string,
  style: PropTypes.object
};

BookmarkItemNew.defaultProps = {
  setData: [],
  showAuthor: false,
  authString: '',
  strings: {}
};

export default BookmarkItemNew;
