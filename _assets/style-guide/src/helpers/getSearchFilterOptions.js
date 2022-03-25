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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

export default function getSearchFilterOptions({
  strings = {
    all: 'All',
    title: 'Title',
    fileName: 'File Name',
    description: 'Description',
    tags: 'Tags'
  },
}) {
  const searchWithInOptions = [
    { value: 'all', label: strings.all, for: 'all' },
    { value: 'title', label: strings.title, for: 'all' },
    { value: 'description', label: strings.description, for: 'stories' },
    { value: 'text', label: strings.content, for: 'files' },
    { value: 'tags', label: strings.tags, for: 'all' },
  ];

  const fileTypeOptions = [
    // More popular file types on the top of list
    { name: 'PDF', id: 1 },
    { name: 'Powerpoint', id: 2 },
    { name: 'Video', id: 3 },
    { name: 'Audio', id: 4 },
    { name: 'Word', id: 5 },
    { name: 'Excel', id: 6 },

    { name: 'App', id: 7 },
    // { name: 'CAD', id: 8 },
    { name: 'CSV', id: 9 },
    { name: 'eBook', id: 10 },
    { name: 'ePub', id: 11 },
    { name: 'Form', id: 12 },
    // { name: 'iBooks', id: 13 },
    { name: 'Image', id: 14 },
    { name: 'Keynote', id: 15 },
    { name: 'Numbers', id: 16 },
    // { name: 'Oomph', id: 17 },
    { name: 'Pages', id: 18 },
    // { name: 'Prov', id: 19 },
    { name: 'RTF', id: 20 },
    // { name: 'Scrollmotion', id: 21 },
    // { name: 'Twixl', id: 22 },
    { name: 'TXT', id: 23 },
    { name: 'Vcard', id: 24 },
    { name: 'Visio', id: 25 },
    { name: 'Web', id: 26 },
    { name: 'Zip', id: 27 }
  ];
  const fileSizeOptions = [
    { label: 'Any', value: 0, lowerLimit: 0, upperLimit: 2048 },
    { label: '0 - 1 MB', value: 1, lowerLimit: 0, upperLimit: 1 },
    { label: '1 - 5 MB', value: 2, lowerLimit: 1, upperLimit: 5 },
    { label: '5 - 25 MB', value: 3, lowerLimit: 5, upperLimit: 25 },
    { label: '25 - 100 MB', value: 4, lowerLimit: 25, upperLimit: 100 },
    { label: '100 MB - 1 GB', value: 5, lowerLimit: 100, upperLimit: 1024 },
    { label: '1 GB+', value: 6, lowerLimit: 1024, upperLimit: 2048 }
  ];

  const mapObjectsToName = (type, context, fullObject) => {
    let mapObject;
    switch (type) {
      case 'searchWithIn':
        mapObject = searchWithInOptions
          .filter(i => context.includes(i.value))
          .map(i => (fullObject ? { id: i.value, ...i, type: 'searchWithIn' } : i.label));
        break;
      case 'fileSize':
      case 'size':
        mapObject = fileSizeOptions
          .filter(i => context.includes(i.value))
          .map(i => (fullObject ? { id: i.value, ...i, type: 'fileSize' } : i.label));
        break;
      case 'fileType':
      case 'category':
        mapObject = fileTypeOptions
          .filter(i => context.includes(i.name.toLowerCase()))
          .map(i => (fullObject ? { id: i.value, ...i, type: 'fileType' } : i.name));
        break;
      default:
        break;
    }
    return mapObject;
  };

  return {
    searchWithInOptions,
    fileTypeOptions,
    fileSizeOptions,
    mapObjectsToName
  };
}
