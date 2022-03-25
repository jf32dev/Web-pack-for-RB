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

import Btn from 'components/Btn/Btn';

const messages = defineMessages({
  nForms: { id: 'n-forms', defaultMessage: '{itemCount, plural, one {# form} other {# forms}}' }
});

/**
 * Clickable Form CategoryItem generally displayed in a List.
 */
export default class CategoryItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,

    /** pass a string or property (i.e. <code>description</code>) -- defaults to formCount */
    note: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    description: PropTypes.string,
    formCount: PropTypes.number,

    /** Allows nesting the default anchor href */
    rootUrl: PropTypes.string,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

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

    /** do not render an enclosing anchor tag */
    noLink: PropTypes.bool,

    /** Show Edit button */
    showEdit: PropTypes.bool,

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    onClick: PropTypes.func.isRequired,

    onEditClick: function(props) {
      if (props.showEdit && typeof props.onEditClick !== 'function') {
        return new Error('onEditClick is required when showEdit is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    rootUrl: ''
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };


  static defaultProps = {
    rootUrl: ''
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

  render() {
    const { formatMessage } = this.context.intl;
    const {
      name,
      formCount,
      grid,
      isActive,
      noLink,
      showEdit,
      className,
      style
    } = this.props;
    const styles = require('./CategoryItem.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      CategoryItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid,
      noLink: noLink,
      showEdit: showEdit
    }, className);

    // Translations
    const strings = generateStrings(messages, formatMessage, { itemCount: formCount });

    // Category anchor URL
    const anchorUrl = this.props.rootUrl + '/' + this.props.id;

    let thumbWidth = this.props.thumbWidth;
    if (!thumbWidth) {
      thumbWidth = grid ? 60 : 46;
    }

    // Merge passed style with grid thumbWidth
    const itemStyle = {
      ...style,
      width: (style && !style.width || grid) ? thumbWidth + 'px' : 'auto'
    };

    const thumbClasses = cx({
      listThumbnail: !grid,
      gridThumbnail: grid
    });

    const thumbStyle = {
      height: thumbWidth,
      width: thumbWidth
    };

    // Default note falls back to formCount
    let noteText = this.props.note;
    if (typeof noteText === 'string') {
      noteText = this.props[noteText] || noteText;
    } else if (!noteText && formCount > 0) {
      noteText = strings.nForms;
    }

    const itemContent = (
      <div className={styles.wrapper}>
        <div className={styles.thumbWrapper} style={thumbStyle}>
          <div className={thumbClasses + ' icon-form-category'}>
            <div className={styles.thumbBg} />
          </div>
        </div>
        <div className={styles.info}>
          <span className={styles.name}>
            {name}
            {showEdit && <Btn icon="edit" borderless onClick={this.handleEditClick} />}
          </span>
          {noteText && <span className={styles.note}>{noteText}</span>}
        </div>
      </div>
    );

    if (noLink) {
      return (
        <div className={itemClasses} style={itemStyle} onClick={this.handleClick}>
          {itemContent}
        </div>
      );
    }

    return (
      <div className={itemClasses} style={itemStyle}>
        <a href={anchorUrl} title={name} onClick={this.handleClick}>
          {itemContent}
        </a>
      </div>
    );
  }
}
