import PropTypes from 'prop-types';
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

import React, { Component } from 'react';
import classNames from 'classnames/bind';

class OutlineItem extends Component {
  static propTypes = {
    dest: PropTypes.any,
    title: PropTypes.string,
    color: PropTypes.object,
    url: PropTypes.string,
    bold: PropTypes.bool,
    italic: PropTypes.bool,
    items: PropTypes.array,
    onClick: PropTypes.func
  };

  static defaultProps = {
    color: [0, 0, 0]
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleTitleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onClick(event, this.props.dest);
  }

  handleToggleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.props.items.length > 0) {
      this.setState({ expanded: !this.state.expanded });
    }
  }

  render() {
    const { title, color, bold, italic, items } = this.props;
    const styles = require('./PdfOutline.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      OutlineItem: true,
      isExpanded: this.state.expanded
    });

    const toggleClasses = cx({
      toggle: true,
      toggleVisible: items.length > 0,
      toggleExanded: this.state.expanded
    });

    const titleStyle = {
      fontWeight: bold ? 'bold' : 'normal',
      fontStyle: italic ? 'italic' : 'normal',
      color: 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')'
    };

    return (
      <li className={classes}>
        <span className={toggleClasses} onClick={this.handleToggleClick} />
        <span
          aria-label={title} className={styles.outlineTitle} style={titleStyle}
          onClick={this.handleTitleClick}
        >{title}</span>
        {items.length > 0 && <ul>
          {items.map((item, i) => (
            <OutlineItem key={'so-' + i} onClick={this.props.onClick} {...item} />
          ))}
        </ul>}
      </li>
    );
  }
}

export default class PdfOutline extends Component {
  static propTypes = {
    outline: PropTypes.array,
    strings: PropTypes.object,
    onItemClick: PropTypes.func
  };

  static defaultProps = {
    strings: {
      tableOfContents: 'Table of Contents'
    }
  };

  render() {
    const { outline, strings } = this.props;
    const styles = require('./PdfOutline.less');

    return (
      <div className={styles.PdfOutlineBox}>
        <div className={styles.PdfOutlineHeader}>
          {strings.tableOfContents}
        </div>
        <div className={styles.PdfOutlineWrapper}>
          <ul className={styles.PdfOutline}>
            {outline.map((item, i) => (
              <OutlineItem key={'o-' + i} onClick={this.props.onItemClick} {...item} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
