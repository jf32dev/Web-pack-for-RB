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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _minBy from 'lodash/minBy';
import _maxBy from 'lodash/maxBy';
import _differenceBy from 'lodash/differenceBy';

import TimeSpentBlock from 'components/Share/TimeSpentBlock';
import generatePdfThumbnails from 'helpers/generatePdfThumbnails';
import PowerpointThumbnailGenerator from 'components/PowerpointThumbnailGenerator/PowerpointThumbnailGenerator';

import Loader from 'components/Loader/Loader';

import styles from './TimeSpentSection.less';

const  MAX_SECTION_WIDTH = 155;
const  MIN_SECTION_WIDTH = 24;

let MAX_TIME = 0;
let MIN_TIME = 0;

const TimeSpentSection = props => {
  const {
    category,
    hubShareFileThumbnails,
    onSetHubShareThumbnails,
    onLoadHtmlData,
    sharedFileId,
    sourceUrl,
    fileBaseUrl,
    pageStats,
    strings
  } = props;

  const generateThumbnails = (pageIndexToGenerateThumbnail) => {
    generatePdfThumbnails(sourceUrl, 150, pageIndexToGenerateThumbnail).then(thumbnailsResult => {
      onSetHubShareThumbnails(sharedFileId, thumbnailsResult, category);
    });
  };

  useEffect(() => {
    if (category === 'pdf') {
      const pageIndexToGenerateThumbnail = _differenceBy(pageStats, hubShareFileThumbnails, item => item.page).map(page => page.page);
      if (!hubShareFileThumbnails || pageIndexToGenerateThumbnail.length > 0) {
        generateThumbnails(pageIndexToGenerateThumbnail);
      }
    } else if (category === 'powerpoint' && !fileBaseUrl) {
      onLoadHtmlData(sharedFileId);
    }
  }, []);

  MIN_TIME = _minBy(pageStats, item => item.viewDuration).viewDuration;
  MAX_TIME = _maxBy(pageStats, item => item.viewDuration).viewDuration;

  const calculateDynamicSectionWidth = (viewDuration) => {
    let width = MIN_SECTION_WIDTH;
    if (viewDuration === MAX_TIME) {
      width = MAX_SECTION_WIDTH;
    } else if (viewDuration >= MIN_TIME && viewDuration <= MAX_TIME) {
      width = (MAX_SECTION_WIDTH / MAX_TIME) * viewDuration;
    }
    return width;
  };

  const composedPages = pageStats.map(page => {
    let thumbnailResult = {};
    if (category === 'pdf') {
      thumbnailResult = hubShareFileThumbnails && hubShareFileThumbnails.find(thumb => thumb.page === page.page);
    } else if (category === 'powerpoint') {
      thumbnailResult = {
        thumbnail: hubShareFileThumbnails && fileBaseUrl + hubShareFileThumbnails[page.page - 1]
      };
    }

    return {
      ...page,
      pageIndex: page.page,
      width: calculateDynamicSectionWidth(page.viewDuration),
      thumbnail: thumbnailResult && thumbnailResult.thumbnail
    };
  });

  const handleGetSlideThumbnails = slideThumbnails => {
    onSetHubShareThumbnails(sharedFileId, slideThumbnails, category);
  };

  return (
    <div className={styles.container}>
      {hubShareFileThumbnails && composedPages.map((page, inx) => <TimeSpentBlock key={inx} {...page} {...{ strings }} />) || <Loader type="content" style={{ margin: 'auto', height: '50px' }} /> }
      {category === 'powerpoint' && !hubShareFileThumbnails && fileBaseUrl && <PowerpointThumbnailGenerator
        id={sharedFileId}
        baseUrl={fileBaseUrl}
        onGetSlideThumbnails={handleGetSlideThumbnails}
        onLoad={x => x}
        onError={x => x}
      />}
    </div>
  );
};

TimeSpentSection.propTypes = {
  hubShareFileThumbnails: PropTypes.array,
  sharedFileId: PropTypes.number,
  sourceUrl: PropTypes.string,
  pagesStats: PropTypes.array,
  onSetHubShareThumbnails: PropTypes.func.isRequired,
  onLoadHtmlData: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
};

TimeSpentSection.defaultProps = {
  strings: {
    viewed: 'Viewed'
  },
};

export default TimeSpentSection;
