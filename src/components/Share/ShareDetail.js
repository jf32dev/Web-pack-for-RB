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
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';

import secondsToTime from 'helpers/secondsToTime';

import CrmOpportunity from 'components/CrmOpportunity/CrmOpportunity';
import NavMenu from 'components/NavMenu/NavMenu';
import ListItem from 'components/ListItem/ListItem';
import UserItemNew from 'components/UserItemNew/UserItemNew';
import FileItemNew from 'components/FileItemNew/FileItemNew';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import TimeSpentSection from 'components/Share/TimeSpentSection';
import Loader from 'components/Loader/Loader';
import { Accordion } from 'components';
import ExternalUser from 'components/Share/ExternalUser';
import ThumbnailList from 'components/Share/ThumbnailList';

const ShareDetail = props => {
  const {
    authString,
    fileStats,
    storyStats,
    viewerStats,
    sharedAt,
    message,
    opportunity,
    languages,
    langCode,
    userTimeOnPageStatsForFiles,
    shareSessionId,
    hubShareFileThumbnails,
    filesEntity,
    onShareRecipientClick,
    onSetHubShareThumbnails,
    onLoadUsersTimeOnPageStatsForFile,
    onLoadHtmlData,
    strings,
    timeOnPageStatsByFileId,
    fileSettings,
    className,
    style
  } = props;

  const [selectedView, setSelectedView] = useState('/viewer');

  const styles = require('./ShareDetail.less');

  const cx = classNames.bind(styles);

  const shareDetail = cx({
    shareDetail: true,
  }, className);

  const menuList = [
    { name: 'Viewers', url: '/viewer' },
    { name: 'Content Shared', url: '/content' }
  ];

  const handleNavItemClick = event => {
    event.preventDefault();
    setSelectedView(event.currentTarget.getAttribute('href'));
  };

  const handleShareRecipientClick = (isAccordionExpanded, itemId) => {
    event.preventDefault();
    if (isAccordionExpanded) onShareRecipientClick(shareSessionId, itemId);
  };

  const userColumns = {
    time: {
      noOfRow: 1,
      rowValue: 0,
      firstCol: true
    },
    views: {
      noOfRow: 2,
      firstRowValue: 0,
      secondRowValue: 0,
      labelSingular: 'File',
      labelPlural: 'Files'
    },
    downloads: {
      noOfRow: 2,
      firstRowValue: 0,
      secondRowValue: 0,
      labelSingular: 'File',
      labelPlural: 'Files'
    },
  };

  const commonColumns = {
    time: {
      noOfRow: 1,
      rowValue: 0,
      firstCol: true
    },
    views: {
      noOfRow: 1,
      rowValue: 0,
      firstCol: true
    },
  };

  const contentTimeOnPageColumns = {
    ...commonColumns,
    emptyColumn: true
  };

  const viewersTimeOnPageColumns = {
    ...commonColumns,
    downloads: {
      noOfRow: 1,
      rowValue: 0,
      firstCol: true
    },
  };

  const contentFilesColumns = {
    time: {
      noOfRow: 1,
      rowValue: 0,
      firstCol: true,
    },
    views: {
      noOfRow: 2,
      firstRowValue: 0,
      secondRowValue: 0,
      labelSingular: 'Contact',
      labelPlural: 'Contacts'
    },
    downloads: {
      noOfRow: 2,
      firstRowValue: 0,
      secondRowValue: 0,
      labelSingular: 'Contact',
      labelPlural: 'Contacts'
    },
  };

  const composeColumnsWithValues = (section, stats) => {
    let composedColumns = {};
    if (section === 'viewers') {
      composedColumns = {
        ...userColumns,
        time: {
          ...userColumns.time,
          rowValue: secondsToTime(stats.totalTime)
        },
        views: {
          ...userColumns.views,
          firstRowValue: stats.views,
          secondRowValue: stats.uniqueViews
        },
        downloads: {
          ...userColumns.downloads,
          firstRowValue: stats.downloads,
          secondRowValue: stats.uniqueDownloads
        }
      };
    } else if (section === 'contents_files') {
      composedColumns = {
        ...contentFilesColumns,
        time: {
          ...contentFilesColumns.time,
          rowValue: secondsToTime(stats.duration)
        },
        views: {
          ...contentFilesColumns.views,
          firstRowValue: stats.viewsCount,
          secondRowValue: stats.viewByCount
        },
        downloads: {
          ...contentFilesColumns.downloads,
          firstRowValue: stats.downloadsCount,
          secondRowValue: stats.downloadedByCount
        }
      };
    } else if (section === 'contents_time_on_page') {
      composedColumns = {
        ...contentTimeOnPageColumns,
        time: {
          ...contentTimeOnPageColumns.time,
          rowValue: secondsToTime(stats.viewDuration)
        },
        views: {
          ...contentTimeOnPageColumns.views,
          rowValue: stats.viewsCount
        }
      };
    } else if (section === 'viewers_time_on_page') {
      composedColumns = {
        ...viewersTimeOnPageColumns,
        time: {
          ...viewersTimeOnPageColumns.time,
          rowValue: secondsToTime(stats.viewDuration)
        },
        views: {
          ...viewersTimeOnPageColumns.views,
          rowValue: stats.viewsCount
        },
        downloads: {
          ...viewersTimeOnPageColumns.downloads,
          rowValue: stats.downloadsCount
        }
      };
    }

    return composedColumns;
  };

  const title = (<h3>{strings.shared} {moment(sharedAt).format('dddd, DD MMMM YYYY, LT')}</h3>);

  const renderThumbnailList = (data) => {
    const isLoading = timeOnPageStatsByFileId[data.id] ? timeOnPageStatsByFileId[data.id].usersTimeOnPageStatsLoading : true;
    const pageStatsArr = timeOnPageStatsByFileId[data.id] ? timeOnPageStatsByFileId[data.id].filePageStats : [];
    const fileBaseUrl = filesEntity[data.id] && filesEntity[data.id].baseUrl;
    return (<ThumbnailList
      authString={authString}
      composeColumnsWithValues={composeColumnsWithValues}
      data={data}
      fileBaseUrl={fileBaseUrl}
      hubShareFileThumbnails={hubShareFileThumbnails[data.id]}
      loading={isLoading}
      pageStats={pageStatsArr}
      onLoadHtmlData={onLoadHtmlData}
      onLoadUsersTimeOnPageStatsForFile={onLoadUsersTimeOnPageStatsForFile}
      onSetHubShareThumbnails={onSetHubShareThumbnails}
      shareSessionId={shareSessionId}
    />);
  };

  const listItemsForContentShared = (data, ind) => (<ListItem
    key={ind}
    component={<FileItemNew
      grid={false}
      hover={false}
      showThumb={false}
      thumbSize="small"
      {...data}
      {...{ fileSettings }}
      description={data.title}
    />}
    columns={composeColumnsWithValues('contents_files', data)}
  />);

  const listItemsForViewers = (userItem, ind, hideBottomBorder = false) => (<ListItem
    key={ind}
    component={userItem.id !== 0 && <UserItemNew
      grid={false}
      thumbSize="tiny"
      {...userItem}
      name={`${userItem.firstName}  ${userItem.lastName}`}
      thumbnail={userItem.avatar}
    /> || <ExternalUser {...userItem} />}
    columns={composeColumnsWithValues('viewers', userItem)}
    listItemId={userItem.userShareId}
    className={hideBottomBorder ? styles.noBorderBottom : null}
  />
  );

  return (<div className={shareDetail} {...{ style }}>
    <Accordion {...{ title }} defaultOpen className={styles.flexShrinkAccordion}>
      <span className={styles.separator} />
      <section className={styles.shareMessageWrapper}>
        <div className={styles.paragraphWrapper}>
          <p>{message || `(${strings.noMessage})`}</p>
          <h3>{strings.language}: <span>{languages[langCode]}</span></h3>
        </div>
        {opportunity && <aside>
          <CrmOpportunity
            opportunity={opportunity.crmSharedObjectName}
            stage={opportunity.crmSharedObjectStage}
            crmIcon={opportunity.crmName === 'salesforce' ? 'cloud-sf-fill' : 'dynamics'}
          />
        </aside>}
      </section>
    </Accordion>
    <NavMenu
      list={menuList}
      selectedUrl={selectedView}
      className={styles.navBar}
      horizontal
      secondary
      onItemClick={handleNavItemClick}
    />
    {selectedView === '/viewer' && <Fragment>
      <header className={styles.headerStyle}>
        <span className={styles.componentHeader}>{strings.sharedWith}</span>
        <span>{strings.totalTime}</span>
        <span>{strings.views}</span>
        <span>{strings.downloads}</span>
      </header>
      <span className={styles.separator} />
      <div className={styles.listItemWrapper}>
        {viewerStats && viewerStats.map((userItem, ind) => {
          if (userItem.totalTime > 0) {
            const { userTimeOnPageStatsForFilesLoading, ...userFiles } = { ...userTimeOnPageStatsForFiles[userItem.userShareId] };

            return (<Fragment
              key={userItem.userShareId}
            >
              <Accordion
                id={userItem.userShareId}
                headerClassName={styles.accordionHeader}
                onToggle={handleShareRecipientClick}
                className={styles.overflowVisible}
                title={listItemsForViewers(userItem, ind, true)}
              >
                {userTimeOnPageStatsForFilesLoading && <Loader type="content" style={{ margin: 'auto', height: '50px' }} /> ||
                <div className={styles.listItemWrapper} style={{ paddingLeft: '42px' }}>
                  {userFiles && Object.keys(userFiles).filter(fileInd => userFiles[fileInd].viewDuration > 0).map((contentItem, ix) => {
                    const userItemFile = userFiles[contentItem];
                    const fileBaseUrl = filesEntity[userItemFile.fileId] && filesEntity[userItemFile.fileId].baseUrl;
                    return (<Fragment
                      key={ix}
                    >
                      <ListItem
                        component={<FileItemNew
                          grid={false}
                          hover={false}
                          thumbSize="small"
                          {...userItemFile}
                          description={userItemFile.title}
                          showThumb={false}
                          {...{ fileSettings }}
                        />}
                        className={styles.noBorderBottom}
                        columns={composeColumnsWithValues('viewers_time_on_page', userItemFile)}
                      />
                      {(userItemFile.category === 'pdf' || userItemFile.category === 'powerpoint') && userItemFile.pagesStats.length > 0 &&
                      <TimeSpentSection
                        sharedFileId={userItemFile.fileId}
                        hubShareFileThumbnails={hubShareFileThumbnails[userItemFile.fileId]}
                        category={userItemFile.category}
                        onSetHubShareThumbnails={onSetHubShareThumbnails}
                        onLoadHtmlData={onLoadHtmlData}
                        pageStats={userItemFile.pagesStats}
                        sourceUrl={`${userItemFile.url}${authString}`}
                        {...{ fileBaseUrl }}
                      />}
                      {userFiles && Object.keys(userFiles).filter(fileInd => userFiles[fileInd].viewDuration > 0).length - 1 !== ix && <span className={styles.separator} />}
                    </Fragment>);
                  })}
                </div>}
              </Accordion>
              <span className={styles.separator} />
            </Fragment>);
          }
          return listItemsForViewers(userItem, ind);
        })}
      </div>
      </Fragment>
    }

    {selectedView === '/content' && <Fragment>
      {storyStats && <Fragment>
        <header className={styles.headerStyle}>
          <span className={styles.componentHeader}>{strings.sharedStory}</span>
        </header>
        <span className={styles.separator} />
        <div className={styles.listItemWrapper}>
          {storyStats &&
          <ListItem
            component={<StoryItemNew
              thumbSize="small"
              grid={false}
              isShare
              noLink
              {...storyStats}
              name={storyStats.title}
              wrapName
            />}
            columns={{}}
          />
      }
        </div>
      </Fragment>}
      <header className={styles.headerStyle}>
        <span className={styles.componentHeader}>{strings.sharedFiles}</span>
        <span>{strings.totalTime}</span>
        <span>{strings.views}</span>
        <span>{strings.downloads}</span>
      </header>
      <span className={styles.separator} />
      <div className={styles.listItemWrapper}>
        {fileStats && fileStats.length > 0 && fileStats.map((contentItem, ind) => {
          if ((contentItem.category === 'pdf' || contentItem.category === 'powerpoint') && (contentItem.duration > 0)) {
            return (
              <Accordion
                key={ind}
                headerClassName={styles.accordionHeader}
                title={listItemsForContentShared(contentItem, ind)}
                className={styles.overflowVisible}
              >
                {renderThumbnailList(contentItem)}
              </Accordion>
            );
          }
          return listItemsForContentShared(contentItem, ind);
        })}
      </div>
      </Fragment>}
  </div>);
};

ShareDetail.propTypes = {
  onShareRecipientClick: PropTypes.func.isRequired,
  onSetHubShareThumbnails: PropTypes.func.isRequired,
  onLoadUsersTimeOnPageStatsForFile: PropTypes.func.isRequired,
  authString: PropTypes.string,
  fileSettings: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object
};

ShareDetail.defaultProps = {
  authString: '',
  strings: {
    shared: 'Shared',
    language: 'Language',
    sharedWith: 'Shared With',
    sharedStory: 'Shared Story',
    sharedFiles: 'Shared Files',
    totalTime: 'Total Time',
    viewed: 'Viewed',
    downloaded: 'Downloaded',
    views: 'Views',
    downloads: 'Downloads',
    noMessage: 'No message'
  },
  langCode: 'en-US'
};

ShareDetail.contextTypes = {
  settings: PropTypes.object.isRequired,
};

export default ShareDetail;
