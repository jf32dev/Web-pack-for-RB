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

import Text from 'components/Text/Text';
import Textarea from 'components/Textarea/Textarea';
import Checkbox from 'components/Checkbox/Checkbox';
import Btn from 'components/Btn/Btn';

/**
 * Admin File General & custom file metadata
 */
const AdminFileGeneral = props => {
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

    if (name === 'showCustomFileDetailsIcon') {
      update = { [name]: !props[name], };
    }

    updateValues(update);
  };

  const handleSave = () => {
    if (typeof props.onSave === 'function') {
      props.onSave();
    }
  };

  const { hintText, detailsFieldLabel, showCustomFileDetailsIcon, strings, saveDisabled, saveLoading } = props;
  const styles = require('./AdminFileGeneral.less');
  const cx = classNames.bind(styles);
  const classes = cx({
    AdminFileGeneral: true
  }, props.className);

  return (
    <div className={classes} style={props.style}>
      <header>
        <h3>{strings.customFileDetail}</h3>
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
        <p>{strings.customFileMetadataDesc}</p>
        <div className={styles.textContainers}>
          <Text
            id="detailsFieldLabel"
            name="detailsFieldLabel"
            label={strings.fileDetailLabel}
            value={detailsFieldLabel}
            maxLength={60}
            onChange={handleChange}
          />
          <Textarea
            id="hintText"
            name="hintText"
            label={strings.hintText}
            data-type="hintText"
            rows={3}
            maxLength={60}
            value={hintText}
            onChange={handleChange}
          />
          <Checkbox
            label={strings.showIcon}
            name="showCustomFileDetailsIcon"
            checked={!!showCustomFileDetailsIcon}
            value={showCustomFileDetailsIcon}
            onChange={handleChange}
          />
        </div>
      </section>
    </div>
  );
};

AdminFileGeneral.propTypes = {
  detailsFieldLabel: PropTypes.string,
  hintText: PropTypes.string,

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

AdminFileGeneral.defaultProps = {
  strings: {
    general: 'General',
    fileDetailLabel: 'File Detail Label',
    hintText: 'Hint Text',
    showIcon: 'Show icon',
  },
  showIcon: false,
};

export default AdminFileGeneral;
