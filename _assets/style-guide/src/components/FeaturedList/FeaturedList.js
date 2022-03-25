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
import FeaturedItem from 'components/FeaturedItem/FeaturedItem';

/**
 * FeaturedList is intended as an alternate to FeaturedSlider.
 */
export default class FeaturedList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,

    showBadges: PropTypes.bool,
    showStoryAuthor: PropTypes.bool,
    authString: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    list: [],
    authString: '',
    showStoryAuthor: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      list: this.filterList(props.list)
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({
        list: this.filterList(nextProps.list)
      });
    }
  }

  filterList(list) {
    // How many Stories are featured
    const newList = [];
    const featuredStories = list.filter(s => s.isFeatured);
    const totalFeatured = featuredStories.length;

    // 1 Featured Story - insert at start with total of 5
    if (totalFeatured === 1) {
      list.forEach(s => {
        if (!s.isFeatured && newList.length < 4) {
          newList.push(s);
        }
      });
      newList.unshift(featuredStories[0]);

    // 2 Featured Stories - insert at start/end with total of 4
    } else if (totalFeatured === 2) {
      list.forEach(s => {
        if (!s.isFeatured && newList.length < 2) {
          newList.push(s);
        }
      });
      newList.unshift(featuredStories[0]);
      newList.push(featuredStories[1]);

    // All other conditions, total of 6
    } else {
      list.forEach(s => {
        if (newList.length < 6) {
          newList.push({
            ...s,
            isFeatured: false
          });
        }
      });
    }

    return newList;
  }

  render() {
    const {
      showBadges,
      authString,
      onAnchorClick,
      onStoryClick,
      showStoryAuthor,
    } = this.props;
    const styles = require('./FeaturedList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FeaturedList: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        {this.state.list.map((item) => (
          <FeaturedItem
            showStoryAuthor={showStoryAuthor}
            key={item.permId}
            showBadges={showBadges}
            showExcerpt
            showIcons
            thumbSize={item.isFeatured ? 'medium' : 'small'}
            authString={authString}
            onAnchorClick={onAnchorClick}
            onStoryClick={onStoryClick}
            {...item}
          />
        ))}
      </div>
    );
  }
}
