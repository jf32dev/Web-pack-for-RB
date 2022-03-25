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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincan.com>
 */
import prepareSearchFilters from './prepareSearchFilters';

/**
 * generate browser URL according to search conditions
 * @function prepareBrowserURL
 * @param {String} term - search keyword
 * @param {Object} filters - search conditions ['date','channels',etc...]
 * @param {String} type - search type ['pages', 'files', 'stories']
 * @returns {String} URL
 */
const prepareBrowserURL = (term, filters, type) => {
  let urlQuery = {
    keyword: term && term.split(':').pop().trim() || term.trim(),
    type: type
  };

  if (filters && filters.length || filters.selectedFilterList && filters.selectedFilterList.length) {
    const { keyword, showHidden, date, createdDate, ...listFilters } = prepareSearchFilters({ ...filters, isForUrl: true });
    const data = {};

    if (keyword && keyword.split(':').length > 1) {
      data.searchWithIn = keyword.split(':')[0];
    }

    urlQuery =  {
      ...urlQuery,
      ...data,
      ...listFilters
    };
  }

  return urlQuery;
};

export default prepareBrowserURL;
