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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';
//import classNames from 'classnames/bind';

import BadgeItem from './BadgeItem';
import Btn from 'components/Btn/Btn';
import RangeSlider from 'components/RangeSlider/RangeSlider';

const messages = defineMessages({
  'badge': { id: 'badge', defaultMessage: 'Badge' },
  'reset': { id: 'reset', defaultMessage: 'Reset' },
  'range': { id: 'range', defaultMessage: 'Range' },
  'badgeName': { id: 'badge-name', defaultMessage: 'Badge Name' },
  'color': { id: 'color', defaultMessage: 'Color' },
  'delete': { id: 'delete', defaultMessage: 'Delete' },
  'cancel': { id: 'cancel', defaultMessage: 'Cancel' },
  'enabled': { id: 'enabled', defaultMessage: 'Enabled' },
  'addUserBadge': { id: 'add-user-badge', defaultMessage: 'Add User Badge' },
  'typeBadgeName': { id: 'type-badge-name', defaultMessage: 'Type Badge Name' },
  'confirmDeleteMessage': { id: 'confirm-delete-badge', defaultMessage: 'Are you sure you want to delete this badge?' },
});

export default class AdminBadgeSelector extends PureComponent {
  static propTypes = {
    /** The minimum value of the slider */
    list: PropTypes.array,

    /** The minimum value of the slider */
    minValue: PropTypes.number,

    /** The maximum value of the slider */
    maxValue: PropTypes.number,

    /** The maximum length of characters for title */
    titleMaxLength: PropTypes.number,

    /** minimum of bars required. */
    minBars: PropTypes.number,
    /** maximum of bars required. */
    maxBars: PropTypes.number,

    /** Allows to ad new badges. */
    showAdd: PropTypes.bool,
    disableAdd: PropTypes.bool,

    /** Shows Reset Button */
    showReset: PropTypes.bool,
    isResetLoading: PropTypes.bool,

    onResetClick: function(props) {
      if (props.showReset && typeof props.onResetClick !== 'function') {
        return new Error('onResetClick is required when showReset is provided.');
      }
      return null;
    },

    /** Callback called on every value change.*/
    onRangeChange: PropTypes.func,
    onAfterChange: PropTypes.func,

    /** called every time Title value change.*/
    onTitleChange: PropTypes.func,
    onTitleBlur: PropTypes.func,

    /** called every time enabled value change.*/
    onToggleEnable: PropTypes.func,

    /** Callback called on delete is pressed.*/
    onDelete: PropTypes.func,

    /** Add a new badge .*/
    onAddClick: function(props) {
      if (props.showAdd && typeof props.onAddClick !== 'function') {
        return new Error('onAddClick is required when showAdd is provided.');
      }
      return null;
    },

    className: PropTypes.string,

    style: PropTypes.object
  };

  static defaultProps = {
    showTooltip: false,
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleRangeChange(values) {
    const { list, maxValue } = this.props;
    if (typeof this.props.onRangeChange === 'function') {
      const nList = list.map(function(obj, i) {
        const nObj = obj;
        if (i > 0) nObj.min = values[i - 1] + 1;
        if (i !== values.length) {
          nObj.max = values[i];
        } else {
          nObj.max = maxValue;
        }
        return (nObj);
      });
      this.props.onRangeChange(nList);
    }
  }

  handleOnAfterChange(value) {
    if (typeof this.props.onAfterChange === 'function') {
      this.props.onAfterChange(value, this.props);
    }
  }

  handleAddBadge() {
    const { disableAdd, isResetLoading, maxValue } = this.props;
    const badge = {
      min: maxValue - 1,
      max: maxValue,
      title: '',
      colour: '#' + Math.floor(Math.random() * 16777215).toString(16), // random color
      enabled: true,
    };
    if (!disableAdd && !isResetLoading) this.props.onAddClick(badge);
  }

  render() {
    const {
      header,
      disableAdd,
      showAdd,
      minBars,
      maxBars,
      minValue,
      maxValue,
      titleMaxLength,
      list,
      onToggleEnable,
      showReset,
      isResetLoading,
      onResetClick,
      onColorChange,
      onDelete,
      onTitleChange,
      onTitleBlur,
    } = this.props;
    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);
    const styles = require('./AdminBadgeSelector.less');

    const values = [];
    const colours = [];
    list.map(function(obj) {
      values.push(obj.max);
      colours.push(obj.colour);
      return obj;
    });

    //const requireFields = list.filter(obj => (!obj.title || !obj.color) && obj.enabled).length;
    //const requireFieldsIndex = list.findIndex(obj => (!obj.title || !obj.color) && obj.enabled);

    return (
      <div className={styles.AdminBadgeSelector}>
        <div className={styles.headerContainer}>
          {header && <h3>{header}</h3>}
          {showReset && <Btn inverted onClick={onResetClick} loading={isResetLoading}>{strings.reset}</Btn>}
        </div>
        <RangeSlider
          handleIconType="rect"
          min={minValue + 1}
          max={maxValue - 2}
          minDistance={2}
          value={values.slice(0, -1)}
          withBars
          barColour={colours}
          pushable
          showTooltip
          onChange={this.handleRangeChange}
          onAfterChange={this.handleOnAfterChange}
          className={isResetLoading ? styles.disabled : null}
        />
        <header className={styles.Header}>
          <ul>
            <li>{strings.badge}</li>
            <li>{strings.range}</li>
            <li>{strings.badgeName}</li>
            <li>{strings.color}</li>
            <li />
            <li />
          </ul>
        </header>

        {list.map((item, index) => (
          <BadgeItem
            key={'badgeItem_' + index}
            index={index}
            min={item.min}
            max={item.max}
            title={item.title}
            titleMaxLength={titleMaxLength}
            colour={item.colour}
            enabled={item.enabled}
            strings={strings}
            onToggleEnable={onToggleEnable}
            onColorChange={onColorChange}
            onTitleChange={onTitleChange}
            onTitleBlur={onTitleBlur}
            enableDelete={list.length <= minBars}
            onDelete={onDelete}
            className={isResetLoading ? styles.disabled : null}
            //className={requireFields && requireFieldsIndex !== index ? styles.disableItemContainer : null}
          />
        ))}
        {showAdd && list.length < maxBars && <span
          className={styles.addBadge}
          onClick={this.handleAddBadge}
          disabled={disableAdd || isResetLoading}
        >
          {strings.addUserBadge}
        </span>}
      </div>
    );
  }
}
