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

import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Text from 'components/Text/Text';
import Checkbox from 'components/Checkbox/Checkbox';
import Btn from 'components/Btn/Btn';

/**
 * Admin File Default Values
 */
const AdminFileDefaults = props => {
  const {
    strings,
    saveDisabled,
    saveLoading,
    enableFilesExpireDefaults,
    enableFilesExpireWarning,
    filesExpireDefaultDays,
    filesExpireWarningDays,
    customFileDetailsEnabled,
  } = props;

  const [currentExpireWarningDays, setCurrentExpireWarningDays] = useState(filesExpireWarningDays);

  const updateValues = data => {
    const { onChange } = props;

    if (onChange && typeof onChange === 'function') {
      onChange(data);
    }
  };

  const handleChange = event => {
    const { value, name } = event.currentTarget;
    let update = {
      [name]: isNaN(value) ? value : Number(value),
    };

    if (name === 'enableFilesExpireDefaults') {
      update = {
        'enableFilesExpireDefaults': !enableFilesExpireDefaults,
        'filesExpireDefaultDays': Math.max(enableFilesExpireWarning && filesExpireWarningDays + 1, filesExpireDefaultDays || 7),
      };
    } else if (name === 'enableFilesExpireWarning') {
      update = {
        'enableFilesExpireWarning': !enableFilesExpireWarning,
        'filesExpireWarningDays': enableFilesExpireDefaults ? Math.max(1, filesExpireDefaultDays - 1) : filesExpireWarningDays || 6,
      };
    } else if (name === 'filesExpireWarningDays') {
      let intVal = Number(value);
      if (intVal > filesExpireDefaultDays - 1) {
        // warning days cannot be greater than default expiry days
        intVal = filesExpireDefaultDays - 1;
      }
      update = {
        'enableFilesExpireWarning': true,
        'filesExpireWarningDays': intVal,
      };
    } else if (name === 'customFileDetailsEnabled') {
      update = {
        'customFileDetailsEnabled': !customFileDetailsEnabled,
      };
    }

    updateValues(update);
  };

  const handleBlur = (event) => {
    // when delete, allow empty value for typing convenience
    // but set it to minimum 1 on blur
    const { value, name } = event.currentTarget;
    if (name === 'filesExpireWarningDays') {
      if (!value && enableFilesExpireWarning) {
        updateValues({
          'enableFilesExpireWarning': true,
          'filesExpireWarningDays': 1,
        });
      }
    } else if (name === 'filesExpireDefaultDays') {
      if (!value && enableFilesExpireDefaults) {
        updateValues({
          'enableFilesExpireDefaults': true,
          'filesExpireDefaultDays': (enableFilesExpireWarning ? filesExpireWarningDays + 1 : 1),
        });
      }
      if (enableFilesExpireWarning && value < filesExpireWarningDays + 1) {
        updateValues({
          'enableFilesExpireDefaults': true,
          'filesExpireDefaultDays': filesExpireWarningDays + 1,
        });
      }
    }
  };

  const handleSave = () => {
    if (typeof props.onSave === 'function') {
      props.onSave();
    }
    setCurrentExpireWarningDays(filesExpireWarningDays);
  };

  const styles = require('./AdminFileDefaults.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    AdminFileDefaults: true
  }, props.className);

  return (
    <div className={classes} style={props.style}>
      <header>
        <h3>{strings.customFileDetails}</h3>
        <Btn
          borderless
          inverted
          disabled={saveDisabled}
          loading={saveLoading}
          onClick={handleSave}
        >
          {strings.save}
        </Btn>
      </header>
      <section>
        <Checkbox
          label={strings.customFileDetailsEnabled}
          name="customFileDetailsEnabled"
          checked={!!customFileDetailsEnabled}
          value={customFileDetailsEnabled}
          onChange={handleChange}
        />
      </section>
      <React.Fragment>
        <header>
          <h3>{strings.defaultFilesExpiration}</h3>
        </header>
        <section>
          <Checkbox
            label={strings.enableFilesExpireDefaults}
            name="enableFilesExpireDefaults"
            checked={!!enableFilesExpireDefaults}
            value={enableFilesExpireDefaults}
            onChange={handleChange}
          />
          {!!enableFilesExpireDefaults &&
            <React.Fragment>
              <div className={styles.expiryContainer}>
                <Text
                  id="filesExpireDefaultDays"
                  name="filesExpireDefaultDays"
                  value={filesExpireDefaultDays || ''}
                  size={3}
                  type="number"
                  pattern="[0-9]*"
                  className={styles.expiryText}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className={styles.expiryDays}>{strings.days}</span>
              </div>
              <p>{strings.filesExpireDefaultsNote}</p>
            </React.Fragment>
          }
        </section>
        <section>
          <Checkbox
            label={strings.enableFilesExpireWarning}
            name="enableFilesExpireWarning"
            checked={!!enableFilesExpireWarning}
            value={enableFilesExpireWarning}
            onChange={handleChange}
          />
          {!!enableFilesExpireWarning &&
            <React.Fragment>
              <div className={styles.expiryContainer}>
                <Text
                  id="filesExpireWarningDays"
                  name="filesExpireWarningDays"
                  value={filesExpireWarningDays || ''}
                  size={3}
                  type="number"
                  pattern="[0-9]*"
                  className={styles.expiryText}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <span className={styles.expiryDays}>{strings.days}</span>
              </div>
              {currentExpireWarningDays > filesExpireWarningDays && <p className={styles.error}>
                {strings.expiryDaysChangeWarning}
              </p>}
              <p>
                {strings.filesExpireWarningNote}
              </p>
            </React.Fragment>
          }
        </section>
      </React.Fragment>
    </div>
  );
};

AdminFileDefaults.propTypes = {
  saveDisabled: PropTypes.bool,
  saveLoading: PropTypes.bool,
  showCustomFileDetailsIcon: PropTypes.bool,

  /** Pass all strings as an object */
  strings: PropTypes.object,

  onChange: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

AdminFileDefaults.defaultProps = {
  strings: {
    defaults: 'File Defaults',
    customFileDetails: 'Custom File Details',
    customFileDetailsEnabled: 'Custom File Details Enabled'
  },
  showIcon: false,
};

export default AdminFileDefaults;
