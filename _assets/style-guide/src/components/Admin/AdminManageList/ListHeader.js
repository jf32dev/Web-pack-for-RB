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

import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import DropMenu from 'components/DropMenu/DropMenu';

/**
 * Manage List Header.
 */
export default class ListHeader extends PureComponent {
  static propTypes = {
    /** Header label */
    name: PropTypes.string.isRequired,

    /** SubMenu label */
    addNewLabel: PropTypes.string,
    addExistingLabel: PropTypes.string,

    /** Shows icon add */
    showAdd: PropTypes.bool,

    /** Show Existing items list to be added */
    showExisting: PropTypes.bool,

    /** Show Filter button */
    showFilter: PropTypes.bool,

    /** Toggle filter status */
    isFilterEnabled: PropTypes.bool,

    onAddClick: function(props) {
      if (props.showAdd && typeof props.onAddClick !== 'function') {
        return new Error('onAddClick is required when showAdd is provided.');
      }
      return null;
    },

    onExistingClick: function(props) {
      if (props.showExisting && typeof props.onExistingClick !== 'function') {
        return new Error('onExistingClick is required when showExisting is provided.');
      }
      return null;
    },

    onFilterClick: function(props) {
      if (props.showFilter && typeof props.onFilterClick !== 'function') {
        return new Error('onFilterClick is required when showFilter is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.string
  };

  static defaultProps = {
    isFilterEnabled: false,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleAddClick(event) {
    event.stopPropagation();
    const { onAddClick } = this.props;

    if (typeof onAddClick === 'function') {
      onAddClick(event, this);
    }
  }

  handleFilterClick(event) {
    event.stopPropagation();
    const { onFilterClick } = this.props;

    if (typeof onFilterClick === 'function') {
      onFilterClick(event, this);
    }
  }

  render() {
    const {
      addNewLabel,
      addExistingLabel,
      isFilterEnabled,
      name,
      showAdd,
      showExisting,
      showFilter,
      className,
      style
    } = this.props;

    const styles = require('./ListHeader.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      Header: true
    }, className);

    const filterClasses = cx({
      iconFilter: !isFilterEnabled,
      isFilterEnabled: isFilterEnabled
    }, className);

    return (
      <div className={itemClasses} style={style}>
        <div className={styles.wrapper}>
          <h4 className={styles.name}>{name}</h4>
          {(showAdd || showExisting || showFilter) && <div className={styles.actions}>
            {((!showAdd && showExisting) || (showAdd && showExisting)) &&
              <DropMenu
                icon="plus"
                position={{ right: 10 }}
                className={styles.iconPlus}
                width={160}
              >
                <ul>
                  {showAdd && <li onClick={this.handleAddClick}>{addNewLabel || 'Add new'}</li>}
                  {showExisting && <li onClick={this.props.onExistingClick}>{addExistingLabel || 'Add existing'}</li>}
                </ul>
              </DropMenu>
            }
            {showAdd && !showExisting && <span className={styles.iconAdd} onClick={this.handleAddClick} />}
            {showFilter && <span className={filterClasses} onClick={this.handleFilterClick} />}
          </div>}
        </div>
      </div>
    );
  }
}
