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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import _get from 'lodash/get';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { FormattedDate } from 'react-intl';

import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Clickable ReportItem generally displayed in a List.
 */
export default class ReportItem extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    category: PropTypes.string,

    title: PropTypes.string,

    desc: PropTypes.string,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked */
    isSelected: PropTypes.bool,

    /** Show checkbox */
    showCheckbox: PropTypes.bool,

    /** DEPRECATED - use showCheckbox instead */
    checkbox: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use showCheckbox.'
        );
      }
      return null;
    },

    /** DEPRECATED - use isSelected instead */
    checked: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isSelected.'
        );
      }
      return null;
    },

    /** DEPRECATED - use isActive instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive instead.'
        );
      }
      return null;
    },

    canDelete: PropTypes.bool,

    iconColor: PropTypes.oneOf(['base', 'secondary']),

    icon: PropTypes.string,

    isScheduledReports: PropTypes.bool,

    onClick: PropTypes.func,

    onCheckboxChange: PropTypes.func,

    languageKey: PropTypes.string,

    strings: PropTypes.object,

    onDeleteClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    isScheduledReports: false,
    isSelected: false
  };

  constructor(props) {
    super(props);
    this.state = {
      isLinkClickAble: true,
      isCheckboxClick: false,
    };
    autobind(this);
  }

  handleCheck(e) {
    const { onCheckboxChange, returnData, id } = this.props;
    if (onCheckboxChange) {
      onCheckboxChange(e, {
        id,
        ...returnData,
      });
    }
  }

  handleClick(e) {
    const { onDeleteClick, returnData, id } = this.props;
    if (onDeleteClick) {
      onDeleteClick(e, {
        id,
        ...returnData,
      });
    }
    if (e.stopPropagation) e.stopPropagation();
  }

  handleMouseEnter() {
    this.setState({
      isLinkClickAble: false,
    });
  }

  handleMouseOut() {
    this.setState({
      isLinkClickAble: true,
    });
  }

  handleCheckboxMouseEnter() {
    this.setState({
      isCheckboxClick: true,
    });
  }

  handleCheckboxMouseOut() {
    this.setState({
      isCheckboxClick: false,
    });
  }

  handleAnchorMouseOver() {
    this.setState({
      showTooltip: true
    });
  }

  handleAnchorMouseOut() {
    this.setState({
      showTooltip: false
    });
  }

  render() {
    const {
      icon,
      iconColor,
      isActive,
      isScheduledReports,
      title,
      onClick,
      showCheckbox,
      canDelete,
      isSelected,
      id,
      languageKey,
      clickUrl,
      strings,
      className,
      reportInfo,
      versionDate,
      style
    } = this.props;
    const styles = require('./ReportItem.less');
    const cx = classNames.bind(styles);
    const reportClasses = cx({
      ReportItem: true,
      isActive: isActive,
      tooltip: this.state.showTooltip
    }, className);

    const iconClasses = cx({
      iconBox: true,
      base: iconColor === 'base',
      secondary: iconColor === 'secondary'
    });

    const name = _get(strings, languageKey, false) || title;
    const desc = _get(strings, `${languageKey}-info`, false) || reportInfo;
    const optionsParams = desc ? { 'aria-label': desc } : { 'aria-label': title };
    return (
      <a
        className={reportClasses}
        style={style}
        onClick={showCheckbox && !this.state.isCheckboxClick ? this.handleCheck : null}
        href={this.state.isLinkClickAble && !showCheckbox ? clickUrl : null}
        target={this.state.isLinkClickAble && !showCheckbox ? '_blank' : null}
        {...optionsParams}
        data-longtip
        onMouseOver={this.handleAnchorMouseOver}
        onMouseOut={this.handleAnchorMouseOut}
      >
        <div className={`classes${icon ? ' icon-' + icon : ''} ${iconClasses}`} data-id={id} />
        <div className={styles.content} data-id={id} onClick={onClick}>
          <div className={styles.title}>{name}</div>
          {desc && <div className={styles.desc}>{desc}</div>}
          {isScheduledReports && <FormattedDate
            value={versionDate}
            day="2-digit"
            month="short"
            year="numeric"
          />}
        </div>
        {canDelete && !showCheckbox && <div
          className={styles.canDelete}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseOut}
        />}
        {(!canDelete || showCheckbox) && !isScheduledReports &&
        <div
          onMouseEnter={this.handleCheckboxMouseEnter}
          onMouseLeave={this.handleCheckboxMouseOut}
        >
          <Checkbox
            name={id}
            className={!showCheckbox ? styles.hidden : styles.mouseNormal}
            checked={isSelected}
            onChange={this.handleCheck}
          />
        </div>}
        {isScheduledReports && <div className={styles.downloadIcon} />}
      </a>
    );
  }
}
