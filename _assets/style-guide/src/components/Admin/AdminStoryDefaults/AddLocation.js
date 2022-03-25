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

import Btn from 'components/Btn/Btn';
import Text from 'components/Text/Text';

/**
 * AddLocation list
 */
export default class AddLocation extends PureComponent {
  static propTypes = {
    /** all the onChange event includes button click and inputs */
    onChange: PropTypes.func,

    /** geolocation list { id, addr, rad, lat, lng} */
    list: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    emptyHeading: PropTypes.string,

    emptyMessage: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    customProp2: [],
    list: [],
    emptyHeading: 'Empty',
    emptyMessage: 'No locations are available',
  };

  constructor(props) {
    super(props);
    this.state = {
      sortedList: this.props.list,
      sortKey: '',
      reverseSort: false,
      filter: null,
    };
    autobind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.props.list.length) {
      this.sortList(this.props.list, this.state.sortKey, this.state.reverseSort);
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (nextProps.list.length && nextProps.list !== this.props.list) {
      this.sortList(nextProps.list, nextState.sortKey, nextState.reverseSort);
    }

    if (nextState.sortKey !== this.state.sortKey || nextState.reverseSort !== this.state.reverseSort) {
      this.sortList(nextProps.list, nextState.sortKey, nextState.reverseSort);
    }
  }

  //sort
  sortList(list, key, reverse) {
    const newList = [...list];

    // Different sorting methods for strings/integers
    switch (key) {
      case 'location':
        if (reverse) {
          newList.sort((b, a) => a.addr.localeCompare(b.addr));
        } else {
          newList.sort((a, b) => a.addr.localeCompare(b.addr));
        }

        break;
      default:  // sequence, size, date
        if (reverse) {
          newList.sort((b, a) => a[key] - b[key]);
        } else {
          newList.sort((a, b) => a[key] - b[key]);
        }
        break;
    }

    this.setState({ sortedList: newList });
  }

  handleChange(event) {
    event.preventDefault();
    const { dataset, type, value } = event.currentTarget;
    let newState = {};

    if (dataset.action === 'sort') {
      const key = event.currentTarget.dataset.key;
      newState = { sortKey: key };

      if (key === this.state.sortKey) {
        newState.reverseSort = !this.state.reverseSort;
      }
    } else if (dataset.action === 'filter') {
      newState = { filter: this.state.filter === null ? '' : null };
    } else if (type === 'text') {
      newState = { filter: value };
    } else if (dataset.action === 'clear') {
      newState = { filter: '' };
    }

    this.setState(newState);
  }

  render() {
    const {
      strings,
      className,
      onChange,
      list,
      style
    } = this.props;
    const { sortedList, filter } = this.state;

    const styles = require('./AddLocation.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AddLocation: true
    }, className);

    const sortHeaderClasses = cx({
      sortHeadings: true,
      reverseSort: this.state.reverseSort,
    });

    const listClasses = cx({
      List: true,
      listList: true,
      inline: this.props.inline
    });

    const filterList = filter === null ? sortedList : sortedList.filter(obj => obj.addr.toLowerCase().indexOf(filter.toLowerCase()) > -1);

    return (
      <div className={classes} style={style}>
        <div onClick={onChange} data-action="addLocation" className={styles.add}>{strings.addLocation}</div>
        {list.length > 0 && <div className={listClasses}>
          <header className={styles.header}>
            <ul className={sortHeaderClasses}>
              {['location', 'radius', 'coOrdinates'].map(item => (
                <li
                  key={item}
                  className={styles[item] + ' ' + (this.state.sortKey === item ? styles.activeSortKey : styles.sortKey)}
                >
                  {item === 'location' && <span data-key={item} data-action="sort" onClick={this.handleChange}>{strings[item]}</span>}
                  {item === 'location' && <div data-action="filter" onClick={this.handleChange} className={styles.deleteIcon} />}
                  {item !== 'location' && <span data-key={item}>{strings[item]}</span>}
                </li>
              ))}
            </ul>
          </header>
          <ol>
            {filter !== null && <li>
              <Text
                className={styles.filterText}
                value={this.state.filter || ''}
                onChange={this.handleChange}
                showClear
                onClearClick={this.handleChange}
              />
            </li>}
            {filterList.map((obj, index) => (
              <li key={index}>
                <div><div>{obj.addr}</div></div>
                <div className={styles.itemTotalDevices}>
                  {`${obj.rad}${strings.km}`}
                </div>
                <div>
                  <span>{`${obj.lat.toFixed(2)}, ${obj.lng.toFixed(2)}`}</span>
                  <div>
                    <Btn
                      onClick={onChange} className={styles.editBtn} inverted
                      data-index={index} data-action="edit"
                    >{strings.edit}</Btn>
                    <Btn
                      onClick={onChange} warning data-index={index}
                      data-action="delete"
                    >{strings.delete}</Btn>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>}
      </div>
    );
  }
}
