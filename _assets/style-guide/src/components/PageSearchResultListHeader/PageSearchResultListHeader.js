/**
 *
 * BIGTINCAN - CONFIDENTIAL
 *
 * Display Blankslate if `props.showBlankslate` is true
 * Display `<header>...</header>` if `props.showHeader` is true
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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincancom>
 *
 * This component render headers [name of the section, total result text] for each section [pages,files,stories] of page search results
 */
import React from 'react';
import classNames from 'classnames';

import Blankslate from 'components/Blankslate/Blankslate';

import styles from './PageSearchResultListHeader.less';

const PageSearchResultListHeader = ({
  title,
  strings,
  showHeader,
  showBlankslate,
  showPaging,
  headerIcon,
  showViewAll,
  onViewAllClick,
  totalResultText,

  children
}) => (
  <React.Fragment>
    {showHeader && <header>
      <div className={classNames(styles.headerWrapper, styles.hasTooltip)}>
        <h4>{title}</h4>
        {headerIcon}
      </div>
      {showPaging && showViewAll && (
        <div>
          {totalResultText}
          <a
            title={strings.viewAll}
            onClick={onViewAllClick}
            className={styles.viewAll}
            href="/pagesearch"
          >
            {strings.viewAll}
          </a>
        </div>
      )}
    </header>}
    {showBlankslate && <div className={styles.emptyWrapper}>
      <Blankslate
        icon="content"
        heading={strings.emptyBlockSearchTitle}
        message={strings.emptyBlockSearchMessage}
      />
      </div>}
    {children}
  </React.Fragment>

);


export default PageSearchResultListHeader;
