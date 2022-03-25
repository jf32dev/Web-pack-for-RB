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
import classNames from 'classnames/bind';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Text from 'components/Text/Text';

export default class ArchivedHeader extends PureComponent {
  static propTypes = {
    /** Table headers <code>[{ key: 'author', title: strings.author }]</code> */
    tableHeaders: PropTypes.array,
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),
    filterPlaceholder: PropTypes.string,
    filterValue: PropTypes.string,
    onFilterChange: PropTypes.func,

    showThumbnail: PropTypes.bool,
    gridView: PropTypes.bool,

    strings: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    tableHeaders: [],
    gridView: false,
    thumbSize: 'small',
    strings: {
      title: 'Title',
      author: 'Author',
      date: 'Date',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isFilterEnabled: false,
    };
    autobind(this);
  }

  // Filter list functions
  handleFilterClick(event) {
    event.stopPropagation();

    this.setState({
      isFilterEnabled: !this.state.isFilterEnabled
    });
  }

  handleFilterClear() {
    const { filterValue } = this.props;
    if (filterValue) {
      this.props.onFilterChange('');
    }
  }

  handleFilterChange(event) {
    this.props.onFilterChange(event.target.value);
  }

  handleInputKeyUp(event) {
    // Trigger filter close on ESC
    if (event.keyCode === 27) {
      this.handleFilterClear();
      this.handleFilterClick(event);
    }
  }

  renderHeadings() {
    const {
      tableHeaders,
      strings,
      thumbSize
    } = this.props;

    const styles = require('./ArchivedHeader.less');
    const cx = classNames.bind(styles);
    const filterClasses = cx({
      iconFilter: true,
      isFilterEnabled: this.state.isFilterEnabled
    });

    // Widths should match StoryItemArchived CSS
    let width = 60;
    if (thumbSize === 'medium') {
      width = '3.375rem';
    } else if (thumbSize === 'small') {
      width = '3.25 rem';
    }

    const headings = tableHeaders.length ? tableHeaders : [
      { key: 'title', title: strings.title, showFilter: true },
      { key: 'author', title: strings.author },
      { key: 'date', title: strings.date },
    ];

    const headers = (
      headings.map(heading =>
        (<span
          key={heading.key}
          data-key={heading.key}
          className={styles[heading.key]}
          style={{ width: heading.width }}
        >
          {heading.title}
          {heading.showFilter && <span className={filterClasses} onClick={this.handleFilterClick} />}
        </span>)
      )
    );

    return (<div className={styles.headerWrapper}>
      <div className={styles.img} style={{ width: width }} />
      <div className={styles.header}>
        {headers}
      </div>
    </div>);
  }

  render() {
    const {
      filterPlaceholder,
      filterValue,
      className,
      style,
    } = this.props;
    const styles = require('./ArchivedHeader.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      container: true,
    }, className);

    return (
      <div className={itemClasses} style={style}>
        {this.renderHeadings()}

        <TransitionGroup className={styles.filterContainer}>
          {this.state.isFilterEnabled && <CSSTransition
            classNames={{
              appear: styles['slide-appear'],
              appearActive: styles['slide-appear-active'],
              enter: styles['slide-enter'],
              enterActive: styles['slide-enter-active'],
              exit: styles['slide-exit'],
              exitActive: styles['slide-exit-active']
            }}
            timeout={{
              enter: 160,
              exit: 150
            }}
            appear
          >
            <Text
              autoFocus
              placeholder={filterPlaceholder}
              value={filterValue}
              showClear={!!filterValue}
              onChange={this.handleFilterChange}
              onClearClick={this.handleFilterClear}
              onKeyUp={this.handleInputKeyUp}
              className={styles.filterInput}
            />
          </CSSTransition>}
        </TransitionGroup>
      </div>
    );
  }
}
