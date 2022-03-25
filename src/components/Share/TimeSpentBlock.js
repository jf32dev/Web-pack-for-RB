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
import classNames from 'classnames/bind';
import TetherComponent from 'react-tether';
import secondsToTime from 'helpers/secondsToTime';

import styles from './TimeSpentSection.less';

const TimeSpentBlock = ({ thumbnail, width, pageIndex, viewDuration, strings }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const dynamicWidthStyle = {
    width
  };

  const cx = classNames.bind(styles);

  const blockSectionClass = cx({
    timeSpent: true,
    isHovered: isHovered
  });

  const renderFileThumb = (<TetherComponent
    attachment="bottom center"
    targetAttachment="top center"
    style={{
      zIndex: 20,
      borderRadius: '8px',
      boxShadow: '0 2px 16px 0 rgba(34, 34, 34, 0.12)',
      border: 'solid 1px #e9e9e9',
      backgroundColor: '#f4f4f4',
      height: '150px',
      width: '200px'
    }}
    constraints={[
      {
        to: 'scrollParent',
        attachment: 'none together',
      },
    ]}
      /* renderTarget: This is what the item will be tethered to, make sure to attach the ref */
    renderTarget={(ref) => (
      <div
        ref={ref}
      />
    )}
      /* renderElement: If present, this item will be tethered to the the component returned by renderTarget */
    renderElement={ref =>
      isHovered && (<div
        ref={ref}
        className={styles.thumbnailPreviewWrapper}
      >
        <div style={{ backgroundImage: `url(${thumbnail})` }} className={styles.thumbnailPreview} />
        <span>{strings.viewed} <span>{secondsToTime(viewDuration)}</span></span>
      </div>)
      }
  />);

  return (<div
    className={styles.timeSpentSectionWrapper}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {renderFileThumb}
    <span style={dynamicWidthStyle} className={blockSectionClass} /> <span>{pageIndex}</span>
  </div>);
};

TimeSpentBlock.propTypes = {
  thumbnail: PropTypes.string,
  width: PropTypes.number,
  viewDuration: PropTypes.number,
  strings: PropTypes.object,
  className: PropTypes.string,
};

export default TimeSpentBlock;
