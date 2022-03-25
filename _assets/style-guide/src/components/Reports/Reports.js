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
import _union from 'lodash/union';
import _startCase from 'lodash/startCase';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import DropMenu from 'components/DropMenu/DropMenu';
import ReportItem from 'components/ReportItem/ReportItem';
import NavMenu from 'components/NavMenu/NavMenu';

/**
 * Index of Reports with navigation.
 */
export default class Reports extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    category: PropTypes.string,

    desc: PropTypes.string,

    onCheckboxChange: PropTypes.func,

    onCreateReportClick: PropTypes.func,

    onDeleteClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.string,

    strings: PropTypes.object
  };

  static defaultProps = {
    strings: {
      personalReports: 'Personal Reports',
      companyReports: 'Company Reports',
      customReports: 'Custom Reports',
      users: 'Users',
      systemContent: 'System Content',
      systemActivity: 'System Activity',
      myContent: 'My Content',
      myActivity: 'My Activity',
      openMultiple: 'Open Multiple',
      open: 'Open',
      report: 'Report',
      reports: 'Reports',
      cancel: 'Cancel',
      createCustomReport: 'Create Custom Report',
    },
    list: []
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedMenuItem: _get(props, 'list.0.name', 'personal') + 'Reports',
      isMultipleActive: false,
      openList: []
    };

    this.menu = ['personalReports', 'companyReports', 'customReports'];
    //, 'customReports'
    this.categories = ['graph', 'table', 'schedule'];

    autobind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { dataset } = e.currentTarget;
    const name = _get(dataset, 'name', false);
    const dataSetAction = _get(dataset, 'action', false);
    const { onOpenReports } = this.props;
    const { isMultipleActive, openList } = this.state;

    if (name && !!this.menu.find(obj => obj.dataName === name) && name !== this.state.selectedMenuItem) {
      this.setState({
        selectedMenuItem: name
      });

      const { onHeaderSelect } = this.props;

      if (onHeaderSelect && typeof onHeaderSelect === 'function') {
        onHeaderSelect(name);
      }
    } else if (dataSetAction === 'cancel' || dataSetAction === 'isMultipleActive') {
      this.setState({
        isMultipleActive: !isMultipleActive,
        openList: isMultipleActive ? [] : openList
      });
    } else if (dataSetAction === 'open' && onOpenReports) {
      onOpenReports(openList);
    }
  }

  handleCheckboxChange(e, returnData) {
    if (!this.state.openList.find(item => item.id === returnData.id)) {
      this.setState({
        openList: this.state.openList.concat(returnData)
      });
    } else {
      this.setState({
        openList: this.state.openList.filter(item => item.id !== returnData.id)
      });
    }
  }

  render() {
    const {
      isMultipleActive,
      selectedMenuItem,
      openList,
    } = this.state;
    const {
      list,
      className,
      strings,
      containerClassName,
      onCreateReportClick,
      onDeleteClick,
      style
    } = this.props;
    const styles = require('./Reports.less');
    const cx = classNames.bind(styles);
    const reportClasses = cx({
      Reports: true
    }, className);

    const subHeaderClasses = cx({
      subHeader: true,
      right: selectedMenuItem !== 'customReports',
    });

    const ReportContainerClasses = cx({
      ReportContainer: true,
    }, containerClassName);

    const headers = list.filter(item => item.name === selectedMenuItem.replace('Reports', '') && item.type !== 'Create').map(item => item.type);
    const menu = _union(list.map(item => item.name)).map(item => ({
      dataName: `${item}Reports`,
      name: `${item} Reports`,
      url: `/${item}Reports`
    }));

    this.menu = menu;

    const creates = _get(list.find(item => item.type === 'Create'), 'options', []);

    return (
      <div className={reportClasses} style={style}>
        <NavMenu
          list={menu}
          selectedUrl={`/${selectedMenuItem}`}
          className={styles.navBar}
          horizontal
          secondary
          onItemClick={this.handleClick}
          style={{ marginBottom: this.state.selectedMenuItem === 'scheduledReports' ? '2.625rem' : '1rem' }}
        />
        <div className={subHeaderClasses}>
          {selectedMenuItem === 'customReports' &&
            <DropMenu
              heading={strings.createCustomReport}
              button
              className={styles.createCustomReport}
              position={{ left: 0, right: 0 }}
            >
              <ul>
                {creates.map(item => (
                  <li
                    key={item.languageKey}
                    onClick={onCreateReportClick}
                    data-name={item.languageKey}
                  >
                    {strings[item.languageKey] || item.title}
                  </li>
                ))}
              </ul>
            </DropMenu>}
          {!isMultipleActive && this.state.selectedMenuItem !== 'scheduledReports' && <div><Btn borderless onClick={this.handleClick} data-action="isMultipleActive">{strings.openMultiple}</Btn></div>}
          {isMultipleActive && this.state.selectedMenuItem !== 'scheduledReports' && <div>
            <Btn borderless onClick={this.handleClick} data-action="cancel">{strings.cancel}</Btn>
            <Btn
              inverted onClick={this.handleClick} borderless
              data-action="open" disabled={openList.length === 0}
            >
              {`${strings.open} ${openList.length} ${openList.length > 1 ? strings.reports : strings.report}`}
            </Btn>
          </div>}
        </div>
        <div className={ReportContainerClasses}>
          {headers.map((item, i) => (
            <div key={item + i}>
              <div className={styles.type}>{strings[item] || _startCase(item)}</div>
              {this.categories.map(category => (
                <div key={category} className={styles.category}>
                  {list && list.find(listItem => listItem.name === selectedMenuItem.replace('Reports', '') && listItem.type === item)
                    .options.filter(filterItem => filterItem.icon === category)
                    .map((reportItem, index) => (
                      <ReportItem
                        id={`${selectedMenuItem}-${i}-${reportItem.category}-${index}`}
                        key={index}
                        showCheckbox={isMultipleActive}
                        iconColor={reportItem.icon === 'graph' ? 'base' : 'secondary'}
                        className={styles.reportListItem}
                        onCheckboxChange={this.handleCheckboxChange}
                        onDeleteClick={onDeleteClick}
                        returnData={reportItem}
                        strings={strings}
                        canDelete={selectedMenuItem === 'customReports'}
                        isActive={openList.filter(openListItem => openListItem.id === `${selectedMenuItem}-${i}-${reportItem.category}-${index}`).length === 1}
                        isSelected={openList.filter(openListItem => openListItem.id === `${selectedMenuItem}-${i}-${reportItem.category}-${index}`).length === 1}
                        isScheduledReports={selectedMenuItem === 'scheduledReports'}
                        {...reportItem}
                        icon={reportItem.icon === 'graph' ? 'bar-chart' : 'table'}
                      />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
