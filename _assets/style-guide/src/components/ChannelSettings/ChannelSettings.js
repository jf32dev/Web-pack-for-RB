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

import Select from 'react-select';
import { FormattedMessage } from 'react-intl';

import ChannelItem from 'components/ChannelItem/ChannelItem';
import Checkbox from 'components/Checkbox/Checkbox';
import Btn from 'components/Btn/Btn';

/**
 * Displays a Channel's settings.
 */
export default class ChannelSettings extends PureComponent {
  static propTypes = {
    /** Valid ChannelItem data */
    channel: PropTypes.object.isRequired,

    /** grid view is active */
    isGrid: PropTypes.bool,

    /** selected sort order */
    sortOrder: PropTypes.string,
    sortOptions: PropTypes.array,

    authString: PropTypes.string,
    strings: PropTypes.object,

    /** Handler for links */
    onAnchorClick: PropTypes.func.isRequired,

    /** Shows Edit button for Personal Channels */
    onEditClick: PropTypes.func,
    onOptionChange: PropTypes.func.isRequired,
    onSortOrderChange: PropTypes.func.isRequired,
    onSubscribeClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onLeaveClick: PropTypes.func,
    onClickManageSharing: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,

    showDescription: PropTypes.bool,
    showDeleteOption: PropTypes.bool,
    showLeaveOption: PropTypes.bool,
    disableDeleteButton: PropTypes.bool,
    showSharing: PropTypes.bool,
    sharingDescription: PropTypes.string,
    showEdit: PropTypes.bool,
  };

  static defaultProps = {
    sortOrder: 'date',
    sortOptions: [
      { value: 'date', label: 'Date' },
      { value: 'title', label: 'Title' },
      { value: 'sequence', label: 'Priority' },
      { value: 'likes', label: 'Likes' },
      { value: 'mostread', label: 'Most Read' },
      { value: 'leastread', label: 'Least Read' },
      { value: 'author_first_name', label: 'Author First Name' },
      { value: 'author_last_name', label: 'Author Last Name' },
      { value: 'content_score', label: 'Content IQ' }
    ],
    authString: '',
    strings: {
      channelDetails: 'Channel Details',
      subscribe: 'Subscribe',
      subscribed: 'Subscribed',
      addPeople: 'Add People',
      gridView: 'Grid View',
    },
    showDescription: true,
    showSharing: false,
    sharingDescription: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      addPeopleActive: false
    };
    autobind(this);
  }

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  handleAddPeopleClick() {
    this.setState({ addPeopleActive: !this.state.addPeopleActive });
  }

  handleDelete(event) {
    const { onDeleteClick } = this.props;
    if (onDeleteClick && typeof onDeleteClick === 'function') {
      onDeleteClick(event, this);
    }
  }

  handleManageSharing(event) {
    const { onClickManageSharing } = this.props;
    if (onClickManageSharing && typeof onClickManageSharing === 'function') {
      onClickManageSharing(event, this);
    }
  }

  handleEditClick() {
    const { onEditClick } = this.props;
    if (onEditClick && typeof onEditClick === 'function') {
      onEditClick(event, this);
    }
  }

  handleLeave(event) {
    const { onLeaveClick } = this.props;
    if (onLeaveClick && typeof onLeaveClick === 'function') {
      onLeaveClick(event, this);
    }
  }

  render() {
    //const { addPeopleActive } = this.state;
    const {
      channel,
      isGrid,
      authString,
      strings,
      onAnchorClick,
      onEditClick,
      onOptionChange,
      onSortOrderChange,
      onSubscribeClick,
      className,
      style,
      showDescription,
      showDeleteOption,
      showLeaveOption,
      showSharing,
      showEdit
    } = this.props;
    const isSubscribed = channel.isSubscribed;
    const styles = require('./ChannelSettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChannelSettings: true
    }, className);

    const subscribeClasses = cx({
      subscribe: true,
      subscribeActive: isSubscribed
    });
    const totalShareCount = channel.shareCount || 0;
    return (
      <div
        data-id="channel-settings" className={classes} style={style}
        onClick={this.handleStopPropagation}
      >
        <div className={styles.detailWrap}>
          <h3>{strings.channelDetails}</h3>
          <ChannelItem
            {...channel}
            grid
            showThumb
            showIcons={false}
            thumbWidth={60}
            noLink
            authString={authString}
            onClick={onAnchorClick}
            onEditClick={onEditClick}
            className={styles.channelItem}
          />
        </div>
        { showDescription && channel.description &&
          <div className={styles.description}>{channel.description}</div>
        }
        { showEdit &&
          <ul className={styles.editAction}>
            <li className={styles.editSection}>
              <div className={styles.edit} onClick={this.handleEditClick}>
                <span className={styles.editIcon} />
                <span className={styles.editDesctiption}>{strings.editChannel}</span>
              </div>
            </li>
          </ul>
        }
        <div className={styles.channelAtrributeSection}>
          <Select
            name={`${channel.id}-sortOrder`}
            value={this.props.sortOrder}
            options={this.props.sortOptions}
            clearable={false}
            searchable={false}
            onChange={onSortOrderChange}
          />
          <ul>
            <li>
              <Checkbox
                inputId={`${channel.id}-isGrid`}
                name={`${channel.id}-isGrid`}
                label={strings.gridView}
                data-option="isGrid"
                checked={isGrid}
                onChange={onOptionChange}
              />
            </li>
            {onSubscribeClick && <li className={subscribeClasses} onClick={onSubscribeClick}>
              <span>{isSubscribed ? strings.subscribed : strings.subscribe}</span>
            </li>}
          </ul>
        </div>
        { showSharing &&
          <ul className={styles.actions}>
            <li className={styles.sharingSection}>
              <div className={styles.sharing}>
                {totalShareCount > 0 && <FormattedMessage
                  id="shared-with-n-people"
                  defaultMessage="Shared with {count, plural, one {# person} other {# people}}"
                  values={{ count: totalShareCount }}
                  tagName="div"
                />}
              </div>
              { totalShareCount > 0 &&
                <div className={styles.manageSharing} onClick={this.handleManageSharing}>
                  <span className={styles.sharingIcon} />
                  <span className={styles.manageSharingDescription}>{strings.manageSharing}</span>
                </div>
              }
              { totalShareCount === 0 &&
                <div className={styles.manageSharing} onClick={this.handleManageSharing}>
                  <span className={styles.copyIcon} />
                  <span className={styles.manageSharingDescription}>{strings.addPeople}</span>
                </div>
              }
            </li>
          </ul>
        }
        { showDeleteOption &&
          <div className={styles.actionContainer}>
            <Btn
              onClick={this.handleDelete}
              className={styles.button}
              disabled={this.props.disableDeleteButton}
              borderless
              inverted
            >{strings.deleteChannel}</Btn>
          </div>
        }
        { showLeaveOption &&
          <div className={styles.actionContainer}>
            <Btn
              onClick={this.handleLeave}
              className={styles.button}
              borderless
              inverted
            >{strings.leaveChannel}</Btn>
          </div>
        }
      </div>
    );
  }
}
