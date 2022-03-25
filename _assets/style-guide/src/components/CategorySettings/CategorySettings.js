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
import classNames from 'classnames/bind';
import Select from 'react-select';

import CategoryItem from 'components/CategoryItem/CategoryItem';
import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Displays a Form Category's settings.
 */
export default class CategorySettings extends PureComponent {
  static propTypes = {
    /** Valid CategoryItem data */
    category: PropTypes.object.isRequired,

    /** grid view is active */
    isGrid: PropTypes.bool,

    /** selected sort order */
    sortOrder: PropTypes.string,

    /** Provided to override defaults */
    sortOptions: PropTypes.array,

    /** Show Edit button */
    showEdit: PropTypes.bool,

    strings: PropTypes.object,

    /** Handler for links */
    onAnchorClick: PropTypes.func.isRequired,

    /** Shows Edit button for Personal Tabs */
    onEditClick: PropTypes.func,

    /** Handle `isGrid` checkbox change */
    onOptionChange: PropTypes.func,

    /** Handle `sortOrder` select change */
    onSortOrderChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    sortOrder: 'name',
    sortOptions: [
      { value: 'name', label: 'Name' },
      { value: 'submissionsCount', label: 'Submissions count' }
    ],
    strings: {
      categoryDetails: 'Category Details',
      gridView: 'Grid View'
    }
  };

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  render() {
    const {
      category,
      isGrid,
      showEdit,
      strings,
      onAnchorClick,
      onEditClick,
      onOptionChange,
      onSortOrderChange,
      className,
      style
    } = this.props;
    const styles = require('./CategorySettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CategorySettings: true
    }, className);

    const hasAction = true;

    return (
      <div
        data-id="category-settings" className={classes} style={style}
        onClick={this.handleStopPropagation}
      >
        <div className={styles.detailWrap}>
          <h3>{strings.categoryDetails}</h3>
          <CategoryItem
            {...category}
            grid
            noLink
            thumbWidth={60}
            isActive={false}
            note={category.description}
            showEdit={showEdit}
            onEditClick={onEditClick}
            onClick={onAnchorClick}
            className={styles.categoryItem}
          />
        </div>
        <div className={styles.sortOrder}>
          <Select
            name={`${category.id}-sortOrder`}
            value={this.props.sortOrder}
            options={this.props.sortOptions}
            clearable={false}
            searchable={false}
            onChange={onSortOrderChange}
          />
        </div>
        {hasAction && <ul className={styles.actions}>
          <li>
            <Checkbox
              inputId={`${category.id}-isGrid`}
              name={`${category.id}-isGrid`}
              label={strings.gridView}
              data-option="isGrid"
              checked={isGrid}
              onChange={onOptionChange}
            />
          </li>
        </ul>}
      </div>
    );
  }
}
