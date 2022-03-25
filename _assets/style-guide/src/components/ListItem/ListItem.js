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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

const ListItem = props => {
  const {
    listItemId,
    component,
    columns,
    onClick,
    className,
    noBorder,
    isSingleUser
  } = props;

  const styles = require('./ListItem.less');

  const cx = classNames.bind(styles);

  const listItemClass = cx({
    listItem: true,
    noBorder: noBorder,
    singleUser: isSingleUser
  }, className);

  const RenderColumns = () => Object.keys(columns).map((item, ind) => {
    let renderedElement = '';
    if (item === 'emptyColumn' && columns.emptyColumn === true) {
      renderedElement = <span key={ind} className={styles.firstCol} />;
    } else if (columns[item].noOfRow === 1) {
      renderedElement = <span key={ind} className={columns[item].firstCol ? styles.firstCol : styles.common}>{columns[item].rowValue}</span>;
    } else if (columns[item].noOfRow === 2) {
      renderedElement = (<div key={ind} className={styles.common}>
        <span className={styles.bold}>{columns[item].firstRowValue}</span>
        <FormattedMessage
          id="files-count"
          defaultMessage="{secondRowValue, plural, one {# {label}} other {# {labels}}}"
          values={{
            secondRowValue: columns[item].secondRowValue,
            label: columns[item].labelSingular,
            labels: columns[item].labelPlural
          }}
        />
      </div>);
    }
    return renderedElement;
  });

  return (
    <li className={listItemClass} onClick={onClick} data-listitemid={listItemId}>
      {component}
      <RenderColumns />
    </li>
  );
};

ListItem.defaultProps = {
  isSingleUser: false,
  noBorder: false
};

ListItem.propTypes = {
  isSingleUser: PropTypes.bool,
  listItemId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  component: PropTypes.node,
  columns: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  noBorder: PropTypes.bool
};

export default ListItem;
