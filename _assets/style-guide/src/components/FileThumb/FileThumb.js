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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import TetherComponent from 'react-tether';

import SVGIcon from 'components/SVGIcon/SVGIcon';

export default class FileThumb extends PureComponent {
  static propTypes = {
    category: PropTypes.oneOf([
      '3d-model',
      'app',
      'audio',
      'btc',
      'cad',
      'csv',
      'earthviewer',
      'ebook',
      'epub',
      'excel',
      'form',
      'folder',
      'ibooks',
      'image',
      'keynote',
      'learning',
      'none',
      'numbers',
      'oomph',
      'pages',
      'pdf',
      'potx',
      'powerpoint',
      'project',
      'prov',
      'rtf',
      'rtfd',
      'scrollmotion',
      'stack',
      'twixl',
      'txt',
      'vcard',
      'video',
      'visio',
      'web',
      'word',
      'zip'
    ]),

    grid: PropTypes.bool,
    showThumb: PropTypes.bool,
    thumbnail: PropTypes.string,
    thumbSize: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']).isRequired,

    repoFileCount: PropTypes.number,
    stackSize: PropTypes.number,
    authString: PropTypes.string,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    thumbSize: 'large',
    authString: ''
  };

  constructor(props) {
    super(props);
    const svgIconTypes = ['3d-model', 'cad', 'excel', 'folder', 'potx', 'project', 'scrollmotion', 'word', 'visio'];

    this.state = {
      isThumbnailVisible: false
    };
    // Some files have a special multi-coloured icon
    // for this we use an embedded SVG
    this.hasSvgIcon = svgIconTypes.indexOf(this.props.category) > -1;
    this.tether = null;
    this.thumbContainer = null;

    autobind(this);
  }

  handleMouseEnterToggle() {
    this.setState({
      isThumbnailVisible: !this.state.isThumbnailVisible
    });
  }

  render() {
    const {
      category,
      thumbnail,

      thumbSize,
      showThumb,
      grid,
      repoFileCount,
      stackSize,
      authString
    } = this.props;
    const styles = require('./FileThumb.less');
    const cx = classNames.bind(styles);

    // Thumbnail stored remotely (secure storage)
    const remoteThumb = thumbnail && thumbnail.indexOf('https://') === 0;

    // Don't attach authString if stored remotely
    const thumbUrl = thumbnail + (remoteThumb ? authString : '');
    let iconClass = ' icon-' + category;
    let categoryText;
    let thumbWidth;

    // Grid sizes
    if (grid) {
      switch (thumbSize) {
        case 'small':
          thumbWidth = 3.375;  // in rem
          break;
        case 'medium':
          thumbWidth = 4.5;
          break;
        default:
          thumbWidth = 6.875;
          break;
      }

    // List sizes
    } else {
      switch (thumbSize) {
        case 'xsmall':
          thumbWidth = 3;
          break;
        case 'small':
          thumbWidth = 4.125;
          break;
        case 'medium':
          thumbWidth = 4.375;
          break;
        default:
          thumbWidth = 4.75;
          break;
      }
    }

    // Category text and icons
    switch (category) {
      case 'folder':
        // Display file count for folder
        if (typeof repoFileCount === 'number' && repoFileCount > 0) {
          categoryText = repoFileCount + ' files';
        }

        // Service icon for repo folder
        if (this.props.repo && this.props.repo.service) {
          iconClass = ' icon-' + this.props.repo.service;
        }
        break;
      case 'stack':
        // Display stack size for file stack
        if (typeof stackSize === 'number' && stackSize > 0) {
          categoryText = stackSize + ' files';
          iconClass = ' icon-bookmark-all';
        }
        break;
      default:
        categoryText = category;
    }

    const classes = cx({
      listThumbnail: !grid,
      gridThumbnail: grid,
      showThumb: (thumbnail && showThumb && category !== 'folder'),
      folderThumb: category === 'folder',

      listLargeThumb: !grid && (thumbSize === 'large'),
      listMediumThumb: !grid && (thumbSize === 'medium'),
      listSmallThumb: !grid && (thumbSize === 'small' || thumbSize === 'xsmall'),

      gridLargeThumb: grid && (thumbSize === 'large'),
      gridMediumThumb: grid && (thumbSize === 'medium'),
      gridSmallThumb: grid && (thumbSize === 'small'),
    }, this.props.className);

    const style = {
      ...this.props.style,
      backgroundImage: (thumbnail && showThumb && grid) ? 'url(' + thumbUrl + ')' : 'none',
      width: thumbWidth + 'rem',
      height: grid ? (thumbWidth * 1.23) + 'rem' : thumbWidth + 'rem'
    };

    const thumbStyle = {
      width: '110px',
      height: '137.5px',
      backgroundImage: 'url(' + thumbUrl + ')',
      opacity: +this.state.isThumbnailVisible
    };

    // Grid view
    if (grid) {
      return (
        <div
          data-category={categoryText}
          className={classes + iconClass}
          style={style}
        >
          {this.hasSvgIcon && (!thumbnail || !showThumb) && <SVGIcon type={category} />}
        </div>
      );
    }

    const renderFileThumb = (
      this.state.isThumbnailVisible && this.thumbContainer && <TetherComponent
        ref={(tether) => { this.tether = tether; }}
        attachment="bottom center"
        targetAttachment="bottom center"
        style={{
          zIndex: 20,
          width: '110px',
          height: '137.5px',
          marginTop: '-38px'
        }}
        constraints={[
          {
            to: this.thumbContainer,
            attachment: 'together',
          },
        ]}
        /* renderTarget: This is what the item will be tethered to, make sure to attach the ref */
        renderTarget={(ref) => (
          <div ref={ref} />
        )}
        /* renderElement: If present, this item will be tethered to the the component returned by renderTarget */
        renderElement={ref =>
          (<div
            ref={ref}
            className="listThumbPreview"
            style={thumbStyle}
          />)
        }
      />
    );

    // List view
    return (
      <div
        ref={(c) => { this.thumbContainer = c; }}
        data-category={category}
        className={classes}
        style={style}
        onMouseEnter={this.handleMouseEnterToggle}
        onMouseLeave={this.handleMouseEnterToggle}
      >
        {thumbnail && showThumb && renderFileThumb}
        {category === 'folder' && <SVGIcon type={category} />}
      </div>
    );
  }
}
