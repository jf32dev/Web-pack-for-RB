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
 * @author Rubenson Barrios <rubenson.barrios@bigtincancom>
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';
import Modal from 'components/Modal/Modal';

import {
  useDateChange,
} from 'helpers/filterHooks';

const DateModalPicker = props => {
  const {
    className,
    dates,
    strings,
    style,

    onSetDate,
    onToggleModal,
  } = props;

  const styles = require('./DateModalPicker.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    DateModalPicker: true,
  }, className);

  const [dateFrom, dateTo, setDateFrom, setDateTo, handleDateChange] = useDateChange();

  // Update properties passed
  useEffect(() => {
    if (dates[0] && dates[0].to) {
      setDateTo(dates[0].to);
    }
    if (dates[0] && dates[0].from) {
      setDateFrom(dates[0].from);
    }
  }, [dates]);

  const handleDone = () => {
    if (typeof onSetDate === 'function') {
      onSetDate({
        from: dateFrom,
        to: dateTo
      });
    }
    onToggleModal();
  };

  return (
    <div
      className={classes}
      style={style}
    >
      <Modal
        isVisible
        backdropClosesModal
        className={styles.modalContainerClass}
        bodyClassName={styles.modalBodyClass}
        escClosesModal
        headerTitle={strings.dateModified}
        headerClassName={styles.modalHeader}
        onClose={onToggleModal}
        footerChildren={(
          <div>
            <Btn
              large
              alt
              borderless
              onClick={onToggleModal}
            >
              {strings.cancel}
            </Btn>
            <Btn
              inverted
              large
              borderless
              onClick={handleDone}
            >
              {strings.done}
            </Btn>
          </div>)}
      >
        <div className={styles.contentModalBody}>
          <div>
            <label htmlFor="from">{strings.from}</label>
            {dateFrom && <span className={styles.selectClearZone}><span className={styles.selectClear} onClick={() => handleDateChange(null, 'from')} /></span>}
            <DateTimePicker
              id="from"
              className={styles.dateTimePicker}
              datetime={dateFrom}
              tz={null}
              placeholder={`${strings.selectDate}...`}
              max={new Date()}
              format="DD MMM YYYY"
              showTime={false}
              showTz={false}
              onChange={(date) => handleDateChange(date, 'from')}
            />
          </div>

          <div>
            <label htmlFor="to">{strings.to}</label>
            {dateTo && <span className={styles.selectClearZone}><span className={styles.selectClear} onClick={() => handleDateChange(null, 'to')} /></span>}
            <DateTimePicker
              id="to"
              datetime={dateTo}
              tz={null}
              placeholder={`${strings.selectDate}...`}
              max={new Date()}
              format="DD MMM YYYY"
              showTime={false}
              showTz={false}
              onChange={(date) => handleDateChange(date, 'to')}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

DateModalPicker.propTypes = {
  onSetDate: PropTypes.func,
};

DateModalPicker.defaultProps = {
  strings: {
    dateModified: 'Date Modified',
    from: 'From',
    to: 'To',
    cancel: 'Cancel',
    done: 'Done',
    selectDate: 'Select Date'
  }
};

export default DateModalPicker;
