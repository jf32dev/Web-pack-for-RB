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

import FileItem from 'components/FileItem/FileItem';
import StoryItem from 'components/StoryItem/StoryItem';

/**
 * Clickable BookmarkItem generally displayed in a List.
 * Displays a <a href="/StoryItem">StoryItem</a> or <a href="/FileItem">FileItem</a>(FileItem can be a stack)
 */
export default class BookmarkItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    setData: PropTypes.array,

    /** grid style */
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    /** Valid size: <code>small, medium, large</code> */
    thumbSize: PropTypes.oneOf(['small', 'medium', 'large']),

    /* passed to Story */
    showBadges: PropTypes.bool,

    /* passed to Story */
    showIcons: PropTypes.bool,

    /** passed to File/Story */
    showThumb: PropTypes.bool,

    /**Show Story Author */
    showAuthor: PropTypes.bool,

    /** DEPRECATED - use isActive or isSelected instead */
    selected: function(props, propName, componentName) {
      if (props[propName] !== undefined) {
        return new Error(
          '`' + propName + '` is deprecated for' +
          ' `' + componentName + '`. Use isActive or isSelected instead.'
        );
      }
      return null;
    },

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    setData: [],
    authString: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.onClick(event, this);
  }

  render() {
    const {
      setData,
      grid,
      thumbSize,
      showBadges,
      showIcons,
      showThumb,
      isActive,
      authString,
      className,
      showAuthor,
    } = this.props;
    const options = {
      setData: setData,
      grid: grid,
      showIcons: showIcons,
      showBadges: showBadges,
      showThumb: showThumb,
      isActive: isActive,
      authString: authString,
      className: className
    };

    const fileThumbSize = thumbSize === 'medium' ? 'large' : thumbSize;

    // Story Bookmark
    if (setData[0].type === 'story') {
      return (
        <StoryItem
          thumbSize={thumbSize}
          onClick={this.props.onClick}
          {...options}
          {...setData[0]}
          showAuthor={showAuthor}
        />
      );
    }

    // Override description/category if file stack
    if (setData.length > 1) {
      options.description = this.props.name;
      options.category = 'stack';
    }

    return (
      <FileItem
        thumbSize={fileThumbSize}
        stackSize={setData.length}
        onClick={this.props.onClick}
        fileSettings={this.props.fileSettings}
        {...setData[0]}
        {...options}
      />
    );
  }
}
