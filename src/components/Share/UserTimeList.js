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

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ListItem from 'components/ListItem/ListItem';
import UserItemNew from 'components/UserItemNew/UserItemNew';
import ExternalUser from 'components/Share/ExternalUser';

const UserTimeList = ({
  data,
  pageNum,
  composeColumnsWithValues
}) => {
  const [pageStats, setPageStats] = useState([]);
  const [isSingleUser, setIsSingleUser] = useState(false);

  useEffect(() => {
    const stats = data.length && data.find(pageStat => pageStat.page === pageNum);
    setPageStats(stats.stats);
    if (stats.stats.length === 1) {
      setIsSingleUser(true);
    }
  }, [data]);

  if (!pageStats) {
    return <div />;
  }

  return pageStats.map((userItem, index) => {
    return (
      <ListItem
        key={index}
        component={userItem.userId === null ? <ExternalUser {...userItem} /> : <UserItemNew
          grid={false}
          thumbSize="x-tiny"
          {...userItem}
          id={userItem.userId}
          name={`${userItem.firstName}  ${userItem.lastName}`}
          thumbnail={userItem.avatar}
          hideEmail
        />}
        columns={composeColumnsWithValues('contents_time_on_page', userItem)}
        isSingleUser={isSingleUser}
        listItemId={userItem.userId}
        noBorder
      />
    );
  });
};

UserTimeList.propTypes = {
  data: PropTypes.array,
  pageNum: PropTypes.number,
  composeColumnsWithValues: PropTypes.func.isRequired
};

UserTimeList.defaultProps = {
  data: [],
  pageNum: null
};

export default UserTimeList;
