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
import autobind from 'class-autobind';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

class TabControl extends PureComponent {
  render() {
    const styles = require('./ViewerTabs.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TabControl: true,
      prevControl: this.props.prev,
      nextControl: this.props.next,
      disabledControl: this.props.disabled
    });

    return (
      <div className={classes} onClick={this.props.onClick} />
    );
  }
}

class TabItem extends PureComponent {
  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleCloseClick(event) {
    const { onCloseClick } = this.props;
    if (typeof onCloseClick === 'function') {
      this.props.onCloseClick(event, this.props.id);
    }
  }

  handleClick(event) {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      this.props.onClick(event, this.props.id);
    }
  }

  render() {
    const { title, note, active, onlyTab, width, loadPercent, onCloseClick } = this.props;
    const styles = require('./ViewerTabs.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      TabItem: true,
      activeTabItem: active
    });

    const tabStyle = {
      minWidth: width
    };

    return (
      <li onClick={this.handleClick} className={classes} style={tabStyle}>
        {!onlyTab && onCloseClick && <span onClick={this.handleCloseClick} className={styles.closeTab} />}
        <span className={styles.title}>{title}</span>
        <span className={styles.note}>{note}</span>
        {loadPercent && <span className={styles.loading} style={{ width: loadPercent + '%' }} />}
      </li>
    );
  }
}

/**
 * Next/Prev will show if more than 1 tab is available.
 */
export default class ViewerTabs extends PureComponent {
  static propTypes = {
    /** Tab objects: <code>[{ id: 1, title: 'Tab 1', note: 'note' }] */
    tabs: PropTypes.array,

    /** active Tab by ID */
    activeId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,

    /** Fix tab width */
    tabWidth: PropTypes.number,

    /** Set the theme (light/dark) */
    theme: PropTypes.oneOf(['light', 'dark']),

    onTabClick: PropTypes.func.isRequired,

    /** Renders an 'x' on each tab when provided */
    onTabCloseClick: PropTypes.func,
  };

  static contextTypes = {
    settings: PropTypes.object
  };

  static defaultProps = {
    tabWidth: 300
  };

  constructor(props) {
    super(props);
    this.state = {
      prevDisabled: true,
      nextDisabled: true,
      xPos: 0
    };
    autobind(this);

    // refs
    this.listWrap = null;
  }

  componentDidMount() {
    if (this.props.tabs.length > 1) {
      this.checkClientWidth();
    }
  }

  componentDidUpdate(prevProps) {
    // Tab added
    if (this.props.tabs.length > prevProps.tabs.length) {
      this.scrollToEnd();

    // Tab removed
    } else if (this.props.tabs.length < prevProps.tabs.length) {
      if (this.state.xPos + this.props.tabWidth > 0) {
        this.scrollToStart();
      } else {
        this.scrollLeft();
      }
    }
  }

  checkClientWidth() {
    const tabLength = this.props.tabs.length;
    const tabsWidth = this.props.tabWidth * tabLength;

    if (this.listWrap.clientWidth < tabsWidth) {
      this.setState({
        nextDisabled: false
      });
    }
  }

  scrollLeft() {
    this.setState({
      prevDisabled: false,
      nextDisabled: false,
      xPos: this.state.xPos + this.props.tabWidth
    });
  }

  scrollRight() {
    this.setState({
      prevDisabled: false,
      nextDisabled: false,
      xPos: this.state.xPos - this.props.tabWidth
    });
  }

  scrollToStart() {
    this.setState({
      prevDisabled: true,
      nextDisabled: false,
      xPos: 0
    });
  }

  scrollToEnd() {
    const { tabs, tabWidth } = this.props;
    const allTabsWidth = tabWidth * tabs.length;
    const listWrapWidth = this.listWrap.clientWidth;

    if (allTabsWidth - listWrapWidth < 0) {
      this.scrollToStart();
    } else {
      this.setState({
        prevDisabled: false,
        nextDisabled: true,
        xPos: -(allTabsWidth - listWrapWidth)
      });
    }
  }

  handlePrevClick() {
    const newXPos = this.state.xPos + this.props.tabWidth;

    if (newXPos > 0) {
      this.scrollToStart();
    } else {
      this.scrollLeft();
    }
  }

  handleNextClick() {
    const { tabs, tabWidth } = this.props;
    const newXPos = this.state.xPos - this.props.tabWidth;
    const allTabsWidth = tabWidth * tabs.length;
    const listWrapWidth = this.listWrap.clientWidth;

    // is slide available?
    if (-newXPos < allTabsWidth) {
      // end of listWrap, slide remaining space
      if (allTabsWidth + newXPos < listWrapWidth) {
        this.scrollToEnd();

      // slide 1 tab width
      } else {
        this.scrollRight();
      }
    }
  }

  render() {
    const { prevDisabled, nextDisabled, xPos } = this.state;
    const { activeId, tabs, theme, onTabClick, onTabCloseClick, className } = this.props;
    const styles = require('./ViewerTabs.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ViewerTabs: true,
      isDark: theme === 'dark'
    }, className);

    const style = {
      transform: 'translateX(' + xPos + 'px)'
    };

    return (
      <div className={classes}>
        {tabs.length > 1 && <TabControl onClick={this.handlePrevClick} disabled={prevDisabled} prev />}
        <div
          ref={(c) => { this.listWrap = c; }}
          className={styles.tabListWrap}
        >
          <ul className={styles.tabList} style={style}>
            {tabs.map(tab => (<TabItem
              key={'tab-' + tab.id}
              id={tab.id}
              title={tab.title || tab.description}
              note={tab.note || tab.description}
              active={tab.id === activeId}
              onlyTab={tabs.length === 1}
              width={this.props.tabWidth}
              onClick={onTabClick}
              onCloseClick={onTabCloseClick}
            />
            ))}
          </ul>
        </div>
        {tabs.length > 1 && <TabControl onClick={this.handleNextClick} disabled={nextDisabled} next />}
      </div>
    );
  }
}
