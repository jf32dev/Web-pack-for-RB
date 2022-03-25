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
 * @package hub-web-app-v5
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import DropMenu from 'components/DropMenu/DropMenu';
import { FormattedMessage } from 'react-intl';

import UserActions from 'components/UserActions/UserActions';

/**
 * Clickable WebItem generally displayed in a List.
 */
export default class WebItemLegacy extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,

    isPersonal: PropTypes.bool,
    showUrl: PropTypes.bool,
    grid: PropTypes.bool,

    /** Highlights item to indicate active state */
    isActive: PropTypes.bool,

    thumbWidth: PropTypes.number,

    authString: PropTypes.string,

    onClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    authString: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isHovering: false
    };
    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();

    if (this.props.onClick) {
      this.props.onClick(event, this);
    }
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false
    });
  }

  handleEditClick(event) {
    event.preventDefault();

    if (this.props.onEditClick) {
      this.props.onEditClick(event, this);
    }
  }

  handleDeleteClick(event) {
    event.preventDefault();

    if (this.props.onDeleteClick) {
      this.props.onDeleteClick(event, this);
    }
  }

  handleToggleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const {
      id,
      name,
      url,
      isPersonal,
      thumbnail,
      showEdit,
      showUrl,
      grid,
      isActive,
      authString,
      className,
      style
    } = this.props;
    let thumbWidth = this.props.thumbWidth;
    if (!thumbWidth) thumbWidth = grid ? 272 : 82;

    const styles = require('./WebItemLegacy.less');
    const cx = classNames.bind(styles);
    const itemClasses = cx({
      WebItem: true,
      isActive: isActive,
      listItem: !grid,
      gridItem: grid
    }, className);

    const thumbClasses = cx({
      thumbnail: true,
      thumbnailPublic: !isPersonal,
      noThumb: !thumbnail,
      listThumbnail: !grid,
      gridThumbnail: grid,
      overlayContainer: true,
    });

    const thumbStyle = {
      height: (thumbWidth / 1.7766).toFixed(0) + 'px',
      width: thumbWidth + 'px',
      minWidth: thumbWidth + 'px',
      backgroundImage: thumbnail ? 'url(' + thumbnail + authString + ')' : 'none'
    };

    const nameClasses = cx({
      name: true,
      personal: isPersonal,
    });

    const textWrapClasses = cx({
      listView: !grid && showEdit,
    });

    const hasActions = !grid && showEdit;

    return (
      <div
        aria-label={url}
        className={itemClasses}
        style={style}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <a
          href={url} rel="noopener noreferrer" target="_blank"
          onClick={this.handleClick}
        >
          <div className={thumbClasses} style={thumbStyle}>
            {isPersonal &&
            <div className={styles.overlay}>
              <DropMenu
                icon="more-fill"
                iconColour="#fff"
                activeIconColour="#F26724"
                headingColour="#fff"
                activeHeadingColour="#F26724"
                className={styles.dropMenu}
                onClick={this.handleToggleMenu}
              >
                <ul>
                  <li onClick={this.handleEditClick}>
                    <FormattedMessage id="edit" defaultMessage="Edit" />
                  </li>
                  <li onClick={this.handleDeleteClick}>
                    <FormattedMessage id="delete" defaultMessage="Delete" />
                  </li>
                </ul>
              </DropMenu>
            </div>
            }
          </div>
          <div className={textWrapClasses}>
            <span className={nameClasses}>{name}</span>
            {showUrl && !grid && <span className={styles.url}>{url}</span>}
          </div>
          {hasActions && <UserActions
            id={id}
            showFollow={false}
            showEdit={showEdit && this.state.isHovering}
            onEditClick={this.handleEditClick}
          />}
        </a>
      </div>
    );
  }
}
