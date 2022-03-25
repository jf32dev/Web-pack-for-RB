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
import { FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import StoryItem from 'components/StoryItem/StoryItem';

export default class StoryItemArchived extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    permId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    colour: PropTypes.string.isRequired,

    author: PropTypes.object,
    excerpt: PropTypes.string,
    updated: PropTypes.number,
    status: PropTypes.string,

    /** pass a string or property (i.e. <code>role</code>) */
    note: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /** Manually set thumbnail width, <code>thumbSize</code> will be ignored */
    thumbWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** display thumbnail if available */
    showThumb: PropTypes.bool,

    /** Show Story Author */
    showAuthor: PropTypes.bool,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    authString: '',
    showAuthor: true
  };

  render() {
    const {
      archivedAt,
      author,
      grid,
      name,
      selected,
      className,
      style,
      showAuthor
    } = this.props;
    const styles = require('./StoryItemArchived.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      StorySearchItem: true,
      selected: selected
    }, className);

    const containerClasses = cx({
      container: true,
      grid: grid
    }, className);

    return (
      <div className={itemClasses} style={style}>
        <StoryItem
          showTags={this.props.searchType === 'tags'}
          thumbSize="medium"
          showThumb
          noLink
          onClick={this.props.onClick}
          {...this.props}
          showBadges={false}
          showIcons={false}
          showAuthor={showAuthor}
        >
          <div className={containerClasses}>
            <span className={styles.name}>{name}</span>
            {!grid && author && author.name && <span className={styles.author}>{author.name}</span>}
            {archivedAt && <span className={styles.time}><FormattedDate
              value={archivedAt * 1000} year="numeric" month="short"
              day="2-digit"
            /></span>}
          </div>
        </StoryItem>
      </div>
    );
  }
}
