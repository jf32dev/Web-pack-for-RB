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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Checkbox from 'components/Checkbox/Checkbox';
import Select from 'components/Select/Select';

export default class CheckboxSelect extends PureComponent {
  render() {
    const {
      children,
      checkboxLabel,
      checkboxDesc,
      checkboxKey,
      checked,
      selectLabel,
      selectKey,
      selectOptions,
      selectValue,
      onCheckboxChange,
      onSelectChange,
    } = this.props;
    const styles = require('./CheckboxSelect.less');

    const cx = classNames.bind(styles);
    const classes = cx({
      CheckboxSelect: true,
    }, this.props.className);

    return (
      <div className={classes}>
        <Checkbox
          inline
          name={checkboxKey}
          value={checkboxKey}
          label={checkboxLabel}
          checked={checked}
          onChange={onCheckboxChange}
          className={styles.checkboxInput}
        />
        <h5>{checkboxDesc}</h5>
        <TransitionGroup component="span">
          {checked &&
          <CSSTransition
            classNames={{
              appear: styles['slide-appear'],
              appearActive: styles['slide-appear-active'],
              enter: styles['slide-enter'],
              enterActive: styles['slide-enter-active'],
              exit: styles['slide-exit'],
              exitActive: styles['slide-exit-active']
            }}
            timeout={{
              enter: 150,
              exit: 180
            }}
            appear
          >
            <div
              className={children && styles.followupWrap}
            >
              <Select
                id={selectKey}
                name={selectKey}
                label={selectLabel}
                value={selectValue}
                options={selectOptions}
                searchable={false}
                clearable={false}

                onChange={onSelectChange}
                className={styles.selectWrap}
                valueKey="id"
                labelKey="name"
              />
              {children && <div className={styles.children}>{children}</div>}
            </div>
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
