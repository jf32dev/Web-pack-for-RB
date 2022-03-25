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
 * @package style-guide
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import { useState } from 'react';

const initialState = {
  dateFrom: null,
  dateTo: null,
};

export const useDateChange = () => {
  const [dateFrom, setDateFrom] = useState(initialState.dateFrom);
  const [dateTo, setDateTo] = useState(initialState.dateTo);

  const handleDateChange = (date, type) => {
    switch (type) {
      case 'to': {
        const end = date;

        if (dateFrom && end && end <= dateFrom) {
          setDateFrom(end);
        }
        setDateTo(end);
        break;
      }
      case 'from': {
        const start = date;

        if (dateTo && dateTo <= start) {
          setDateTo(start);
        }
        setDateFrom(start);
        break;
      }
      default:
        break;
    }
  };
  return [dateFrom, dateTo, setDateFrom, setDateTo, handleDateChange];
};

export const useFilterChange = () => {
  const [matchinResultSelected, setMatchinResultSelected] = useState([]);
  const [fileTypeSelected, setFileTypeSelected] = useState([]);
  const [fileSizeSelected, setFileSizeSelected] = useState([]);

  const updateValues = (newVal, type) => {
    switch (type) {
      case 'searchWithIn':
        setMatchinResultSelected([newVal]);
        break;
      case 'fileType': {
        let fileTypeList = fileTypeSelected;
        if (fileTypeSelected.includes(newVal)) {
          fileTypeList = fileTypeList.filter(i => parseInt(i, 10) !== parseInt(newVal, 10));
        } else {
          fileTypeList.push(newVal.toString());
        }
        setFileTypeSelected([...new Set(fileTypeList)]);
        break;
      }
      case 'fileSize':
        setFileSizeSelected([newVal.toString()]);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (selectedItem, type) => {
    const id = selectedItem.id || selectedItem.value || 0;
    updateValues(id, type);
  };

  const handleCheckboxChange = (e, type) => {
    const newVal = e.currentTarget.value;
    updateValues(newVal, type);
  };

  const handleUpdateValues = (newVal, type) => {
    updateValues(newVal, type);
  };

  return [matchinResultSelected, fileSizeSelected, fileTypeSelected, handleCheckboxChange, handleUpdateValues, handleSelectChange];
};
