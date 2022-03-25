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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import camelCase from 'lodash/camelCase';

/**
 * CanvasSlideTemplate description
 */
export default class CanvasSlideTemplate extends PureComponent {
  static propTypes = {
    tagName: PropTypes.string,

    template: PropTypes.oneOf([
      'one-col',
      'one-col-title',
      'two-col',
      'two-col-title',
      'three-col',
      'three-col-title',
      'three-row',
    ]).isRequired,

    disabled: PropTypes.bool,
    selected: PropTypes.bool,

    onClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    tagName: 'div',
    disabled: false,
    selected: false,
  };

  constructor(props) {
    super(props);
    this.state = {};
    autobind(this);
  }

  render() {
    const { disabled, selected, template } = this.props;
    const styles = require('./CanvasSlideTemplate.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CanvasSlideTemplate: true,
      [camelCase(template)]: true,
      isDisabled: disabled,
      isSelected: selected,
    }, this.props.className);

    const TagName = this.props.tagName;

    let content = null;
    switch (template) {
      case 'one-col':
        content = (<Fragment>
          <div className={styles.col} />
        </Fragment>);
        break;
      case 'one-col-title':
        content = (<Fragment>
          <div className={styles.title} />
          <div className={styles.col} />
        </Fragment>);
        break;
      case 'two-col-title':
        content = (<Fragment>
          <div className={styles.title} />
          <div className={styles.row}>
            <div className={styles.col} />
            <div className={styles.col} />
          </div>
        </Fragment>);
        break;
      case 'three-col-title':
        content = (<Fragment>
          <div className={styles.title} />
          <div className={styles.row}>
            <div className={styles.col} />
            <div className={styles.col} />
            <div className={styles.col} />
          </div>
        </Fragment>);
        break;
      case 'two-col':
        content = (<Fragment>
          <div className={styles.row}>
            <div className={styles.col} />
            <div className={styles.col} />
          </div>
        </Fragment>);
        break;
      case 'three-col':
        content = (<Fragment>
          <div className={styles.row}>
            <div className={styles.col} />
            <div className={styles.col} />
            <div className={styles.col} />
          </div>
        </Fragment>);
        break;
      case 'three-row':
        content = (<Fragment>
          <div className={styles.row} />
          <div className={styles.row} />
          <div className={styles.row} />
        </Fragment>);
        break;
      default:
        break;
    }

    return (
      <TagName
        data-template={template}
        onClick={!disabled ? this.props.onClick : undefined}
        className={classes}
        style={this.props.style}
      >
        {content}
      </TagName>
    );
  }
}
