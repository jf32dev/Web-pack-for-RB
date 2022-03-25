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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Checkbox from 'components/Checkbox/Checkbox';

const messages = defineMessages({
  draft: { id: 'draft', defaultMessage: 'Draft' },
  published: { id: 'published', defaultMessage: 'Published' },
  retired: { id: 'retired', defaultMessage: 'Retired' },
});

/**
 * Clickable FormItem generally displayed in a List.
 */
export default class FormItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    author: PropTypes.object,

    /** form status */
    status: PropTypes.oneOf(['draft', 'published', 'retired']),

    /** pass a string or property (i.e. <code>role</code>) */
    note: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /** Allows nesting the default <code>/form/{id}</code> anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Marks checkbox as checked */
    isSelected: PropTypes.bool,

    /** DEPRECATED - use showCheckbox instead */
    select: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use showCheckbox.'
        );
      }
      return null;
    },

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive or isSelected instead.'
        );
      }
      return null;
    },

    /** Grey out the checkbox in list view */
    disabled: PropTypes.bool,

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    disabled: false,
    isSelected: false,
    rootUrl: ''
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(event, this);
    }
  }

  handleInputChange(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      id,
      name,
      author,
      status,
      grid,
      isActive,
      isSelected,
      showCheckbox,
      disabled,
      noLink,
      className,
      style
    } = this.props;
    const anchorUrl = this.props.rootUrl + '/' + this.props.id;
    let thumbWidth = this.props.thumbWidth;
    if (!thumbWidth) thumbWidth = grid ? 200 : 46;

    const styles = require('./FormItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      FormItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,
      noLink: noLink,
      thumbDraft: status === 'draft',
      thumbRetired: status === 'retired'
    }, className);

    let itemStyle = {};
    if (style) itemStyle = style;
    if (!itemStyle.width) itemStyle.width = grid ? thumbWidth : 'auto';

    const thumbClasses = cx({
      listThumbnail: !grid,
      gridThumbnail: grid,
      thumbnailDraft: status === 'draft',
      thumbnailRetired: status === 'retired'
    });

    const thumbStyle = {
      height: thumbWidth + 'px',
      width: thumbWidth + 'px'
    };

    // Translations
    const strings = generateStrings(messages, formatMessage);

    // Default note falls back to role/name
    let noteText = this.props.note;
    if (noteText === undefined && grid && author) {
      noteText = author.role || author.name;

      // List view display role and name by default
    } else if (noteText === undefined && !grid && author) {
      noteText = author.role ? author.role + ' • ' + author.name : author.name;
    }

    const itemContent = (
      <div className={styles.wrapper}>
        {showCheckbox && <Checkbox
          name={'form-' + id}
          value={id}
          checked={isSelected}
          disabled={disabled}
          onChange={this.handleInputChange}
          className={styles.checkbox}
        />}
        <div className={thumbClasses + ' icon-form'} style={thumbStyle} />
        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          {status && <span className={styles.status}>{strings[status]}</span>}
          {noteText && <span className={styles.note}>{noteText}</span>}
        </div>
      </div>
    );

    if (noLink) {
      return (
        <div
          data-id={id} className={itemClasses} style={itemStyle}
          onClick={this.handleClick}
        >
          {itemContent}
        </div>
      );
    }

    return (
      <div data-id={id} className={itemClasses} style={itemStyle}>
        <a href={anchorUrl} title={name} onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
