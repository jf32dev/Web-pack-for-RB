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

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import _differenceBy from 'lodash/differenceBy';

import generatePdfThumbnails from 'helpers/generatePdfThumbnails';

import Loader from 'components/Loader/Loader';
import UserTimeList from 'components/Share/UserTimeList';
import PowerpointThumbnailGenerator from 'components/PowerpointThumbnailGenerator/PowerpointThumbnailGenerator';

const ThumbnailList = ({
  authString,
  composeColumnsWithValues,
  data,
  fileBaseUrl,
  hubShareFileThumbnails,
  loading,
  pageStats,
  onLoadHtmlData,
  onLoadUsersTimeOnPageStatsForFile,
  onSetHubShareThumbnails,
  shareSessionId
}) => {
  const styles = require('./ThumbnailList.less');

  const generateThumbnails = (pagesArr) => {
    generatePdfThumbnails(`${data.url}${authString}`, 150, pagesArr).then(thumbnailsResult => {
      onSetHubShareThumbnails(data.id, thumbnailsResult, 'pdf');
    });
  };

  useEffect(() => {
    onLoadUsersTimeOnPageStatsForFile(shareSessionId, data.id);
    if (data.category === 'powerpoint' && !fileBaseUrl) {
      onLoadHtmlData(data.id);
    }
  }, []);

  useEffect(() => {
    if (data.category === 'pdf') {
      const pageIndexToGenerateThumbnail = _differenceBy(pageStats, hubShareFileThumbnails, item => item.page).map(page => page.page);
      if (!hubShareFileThumbnails || pageIndexToGenerateThumbnail.length > 0) {
        generateThumbnails(pageIndexToGenerateThumbnail);
      }
    }
  }, [pageStats]);

  const handleGetSlideThumbnails = slideThumbnails => {
    onSetHubShareThumbnails(data.id, slideThumbnails, 'powerpoint');
  };

  const pptElementRef = useRef(null);
  const pdfElementRef = useRef(null);
  const [orientation, setOrientation] = useState('');

  const calculateImageOrientation = () => {
    const element = {
      pdf: pdfElementRef,
      powerpoint: pptElementRef
    };
    const elementRef = element[data.category];
    const imgOrientation = elementRef.current.offsetHeight > elementRef.current.offsetWidth ? 'portrait' : 'landscape';
    setOrientation(imgOrientation);
  };

  const cx = classNames.bind(styles);

  const imgOrientationClass = cx({
    thumbnailImage: true,
    portraitImage: orientation === 'portrait',
    landscapeImage: orientation === 'landscape'
  });

  if (loading || !hubShareFileThumbnails.length) {
    return (<div className={styles.loaderWrapper}>
      <Loader type="content" />
      {data.category === 'powerpoint' && fileBaseUrl && <PowerpointThumbnailGenerator
        id={data.id}
        baseUrl={fileBaseUrl}
        onGetSlideThumbnails={handleGetSlideThumbnails}
        onLoad={x => x}
        onError={x => x}
      />}
    </div>);
  }

  return pageStats.map((page, pageIndex) => {
    if (Object.keys(page).length === 0) return null;
    let sourceUrl;
    let elementRef;
    if (data.category === 'pdf') {
      const pdfThumb = hubShareFileThumbnails.find(thumbPage => thumbPage.page === page.page);
      if (pdfThumb) {
        sourceUrl = pdfThumb.thumbnail;
      }
      elementRef = pdfElementRef;
    } else if (data.category === 'powerpoint') {
      const pptThumb = hubShareFileThumbnails[page.page - 1];
      sourceUrl = `${fileBaseUrl}${pptThumb}`;
      elementRef = pptElementRef;
    }
    return (<div key={pageIndex} className={styles.fileTimeOnPageWrapper}>
      <span className={styles.pageNumber}>{page.page}.</span>
      <div className={styles.fileTimeOnPageInnerWrapper}>
        <img
          alt={page.page}
          className={imgOrientationClass}
          onLoad={calculateImageOrientation}
          ref={elementRef}
          src={sourceUrl}
        />
        <div className={styles.userTimeOnPage}>
          <UserTimeList
            data={pageStats}
            pageNum={page.page}
            composeColumnsWithValues={composeColumnsWithValues}
          />
        </div>
      </div>
    </div>);
  });
};

ThumbnailList.propTypes = {
  authString: PropTypes.string.isRequired,
  composeColumnsWithValues: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  fileBaseUrl: PropTypes.string,
  hubShareFileThumbnails: PropTypes.array,
  loading: PropTypes.bool,
  onLoadHtmlData: PropTypes.func.isRequired,
  onLoadUsersTimeOnPageStatsForFile: PropTypes.func.isRequired,
  onSetHubShareThumbnails: PropTypes.func.isRequired,
  shareSessionId: PropTypes.string.isRequired
};

ThumbnailList.defaultProps = {
  fileBaseUrl: '',
  hubShareFileThumbnails: [],
  loading: true
};

export default ThumbnailList;
