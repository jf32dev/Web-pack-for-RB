import moment from 'moment-timezone';

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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

const MAX_FILE_SIZE = 2147483647;

export default function prepareSearchFilters({
  type = 'files',
  keyword,
  selectedFilterList,
  sortBy,
  isForUrl
}) {
  const cloneQuery = {
    keyword: keyword
  };

  const channelListFilters = selectedFilterList && selectedFilterList.filter(i => i.type === 'channel');
  const channelFilters = channelListFilters && channelListFilters.map(({ id }) => `channel.id:${id}`).join(' || ');
  if (channelListFilters.length && !isForUrl) {
    cloneQuery.keyword += ` (${channelFilters})`;
  } else {
    cloneQuery.showHidden = false;
  }

  if (sortBy && sortBy.value) {
    let tmpSort;
    if (sortBy.value === 'updated_at') {
      tmpSort = type === 'files' ? 'created_at' : sortBy.value;
    } else if (sortBy.value === 'name') {
      tmpSort = type === 'files' ? 'description' : 'title';
    }

    cloneQuery.sortBy = {
      sort: tmpSort,
      order: sortBy.order
    };
  }

  selectedFilterList.filter(i => i.type !== 'channel').map(item => {
    switch (item.type) {
      case 'fileType':
        cloneQuery.category = selectedFilterList.filter(i => i.type === 'fileType').map(i => i.name.toLowerCase()).join(',');
        break;
      case 'fileSize': {
        const fileSizeList = selectedFilterList.find(i => i.type === 'fileSize');
        if (isForUrl) {
          cloneQuery.size = fileSizeList.value;
        } else {
          cloneQuery.size = {
            'gte': fileSizeList.lowerLimit * 1048576, // 1MB = 1,048,576 in bytes
            'lte': (fileSizeList.upperLimit * 1048576) > MAX_FILE_SIZE ? MAX_FILE_SIZE : fileSizeList.upperLimit * 1048576
          };
        }
        break;
      }
      case 'searchWithIn': {
        let newPrefix = '';
        switch (item.id) {
          case 'all':
            break;
          case 'title':
            newPrefix = type === 'files' && !isForUrl ? 'description:' : `${item.id}:`;
            break;
          case 'text': // only for files
            if (!isForUrl) {
              newPrefix = type === 'files' ? `blocks.${item.id}:` : '';
            } else {
              newPrefix = type === 'files' ? `${item.id}:` : '';
            }
            break;
          case 'description': // only for stories
            newPrefix = `${item.id}:`;
            break;
          case 'tags':
            newPrefix = `${item.id}:`;
            break;
          default:
            break;
        }
        cloneQuery.keyword = `${newPrefix}${cloneQuery.keyword}`;

        break;
      }
      case 'date': {
        if (!isForUrl) {
          const startTime = { hour: 0, minute: 0, second: 0 };
          const endTime = { hour: 23, minute: 59, second: 59 };
          const dateObject = type === 'file' || type === 'files' ? 'createdDate' : 'ModifiedDate';

          cloneQuery[dateObject] = {
            'gte': item.from !== null ?
              moment(item.from).set(startTime).format() :
              moment(new Date(1900, 0, 1)).set(startTime).format(),
            'lte': item.to !== null ?
              moment(item.to).set(endTime).format() :
              moment().set(endTime).format()
          };
        }
        break;
      }
      default:
        break;
    }
    return item;
  });

  return cloneQuery;
}
