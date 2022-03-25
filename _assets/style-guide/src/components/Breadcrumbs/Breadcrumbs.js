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

/**
 * Displays a horizontal list of links, the last path is always active.
 */
export default class Breadcrumbs extends PureComponent {
  static propTypes = {
    /** Valid path objects: <code>{ name: 'Root', path: '/' }</code> */
    paths: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })),

    /** Does not render an anchor tag */
    noLink: PropTypes.bool,

    /** Required if more than 1 path */
    onPathClick: function(props) {
      if (props.paths.length > 1 && !props.noLink && typeof props.onPathClick !== 'function') {
        return new Error('onPathClick is required if more than 1 path.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    paths: []
  };

  render() {
    const { paths, noLink, onPathClick, className } = this.props;
    const styles = require('./Breadcrumbs.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Breadcrumbs: true
    }, className);

    return (
      <ul className={classes} style={this.props.style}>
        {paths.map((p, i) => (
          <li key={p.name + i} className={styles.pathItem}>
            {i >= (paths.length - 1) && p.name &&
            <span data-path={p.path} onClick={onPathClick}>{p.name}</span>}

            {i !== (paths.length - 1) && !noLink &&
            <a href={p.path} title={p.name} onClick={onPathClick}>{p.name}</a>}

            {i !== (paths.length - 1) && noLink &&
            <span
              className={styles.noLinkItem} data-path={p.path} title={p.name}
              onClick={onPathClick}
            >{p.name}</span>}
          </li>
        ))}
      </ul>
    );
  }
}
