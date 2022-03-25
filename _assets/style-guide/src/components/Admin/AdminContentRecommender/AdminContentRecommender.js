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
 * @author Rubenson Barrios<rubenson.barrios@bigtincan.com>
 */

import React  from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Select from 'components/Select/Select';
import Checkbox from 'components/Checkbox/Checkbox';
import Btn from 'components/Btn/Btn';

const frequencyList = ['none', 'daily', 'weekly', 'monthly'];

/**
 * Genie Content Recommender
 */
const AdminContentRecommender = props => {
  const updateValues = (data) => {
    const { onChange } = props;

    if (onChange && typeof onChange === 'function') {
      onChange(data);
    }
  };

  const handleChange = event => {
    const { value, name } = event.currentTarget;
    let update = {
      [name]: value,
    };

    if (name === 'turnedOn') {
      update = { [name]: !props[name], };
    }

    updateValues(update);
  };

  const handleSelectChange = data => {
    updateValues({
      frequency: data.value
    });
  };

  const handleSave = () => {
    if (typeof props.onSave === 'function') {
      props.onSave();
    }
  };

  const { frequency, turnedOn, strings, saveDisabled, saveLoading } = props;
  const styles = require('./AdminContentRecommender.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    ContentRecommender: true
  }, props.className);

  return (
    <div className={classes} style={props.style}>
      <header>
        <h3>{strings.contentRecommender}</h3>
        <Btn
          borderless inverted disabled={saveDisabled}
          loading={saveLoading} onClick={handleSave}
        >
          {strings.save}
        </Btn>
      </header>
      <div className={styles.checkboxContainer}>
        <Checkbox
          label={strings.enableGenieRecommender}
          name="turnedOn"
          checked={turnedOn}
          value={turnedOn}
          onChange={handleChange}
        />
      </div>
      {turnedOn && <div className={styles.selectWrap}>
        <label htmlFor="frequency">{strings.frequency}</label>
        <Select
          id="frequency"
          name="frequency"
          value={frequency && frequency.toLowerCase() || 'none'}
          options={frequencyList.map(k => ({ value: k, label: strings[k.toLowerCase()] }))}
          clearable={false}
          onChange={handleSelectChange}
        />
      </div>}
    </div>
  );
};

AdminContentRecommender.propTypes = {
  frequency: PropTypes.string,
  saveDisabled: PropTypes.bool,
  saveLoading: PropTypes.bool,

  /** Pass all strings as an object */
  strings: PropTypes.object,

  /** Content recommender is enabled */
  turnedOn: PropTypes.bool,

  onChange: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

AdminContentRecommender.defaultProps = {
  strings: {
    genieRecommender: 'Genie Recommender',
    frequency: 'Frequency',
    none: 'None',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    turnedOn: 'Turned on',
    enableGenieRecommender: 'Enable Content Recommender'
  },
  turnedOn: false,
  frequency: 'none',
};

export default AdminContentRecommender;
