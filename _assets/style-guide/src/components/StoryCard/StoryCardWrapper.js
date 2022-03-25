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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import PropTypes from 'prop-types';
import StoryCard from 'components/StoryCard/StoryCard';

const StoryCardWrapper = ({
  list,
  onClickHandler,
  ...rest
}) => {
  const styles = require('./StoryCardWrapper.less');

  return (
    <div className={styles.storyCardWrapper}>
      {list.map(item => (
        <StoryCard
          key={item.id}
          {...item}
          onClick={onClickHandler}
          {...rest}
        />
      ))}
    </div>
  );
};

StoryCardWrapper.defaultProps = {
  list: []
};

StoryCardWrapper.propTypes = {
  list: PropTypes.array.isRequired,
  onClickHandler: PropTypes.func
};

export default StoryCardWrapper;
