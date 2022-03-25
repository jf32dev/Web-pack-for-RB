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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import moment from 'moment-timezone';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Checkbox from 'components/Checkbox/Checkbox';
import DateTimePicker from 'components/DateTimePicker/DateTimePicker';
import StoryThumb from 'components/StoryThumb/StoryThumb';
import Text from 'components/Text/Text';

import StoryEditChannels from './StoryEditChannels';

const messages = defineMessages({
  addCoverArt: { id: 'add-cover-art', defaultMessage: 'Add Cover Art', },
  removeCoverArt: { id: 'remove-cover-art', defaultMessage: 'Remove Cover Art', },
  confirmRemoveCoverArt: { id: 'are-you-sure', defaultMessage: 'Are you sure?' },

  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  remove: { id: 'remove', defaultMessage: 'Remove' },

  storyTitle: { id: 'story-title', defaultMessage: '{story} Title' },
  quicklinkTitle: { id: 'quicklink-title', defaultMessage: 'Quicklink Title' },
  channel: { id: 'channel', defaultMessage: '{channel}' },
  primary: { id: 'primary', defaultMessage: 'Primary' },
  addChannel: { id: 'add-channel', defaultMessage: 'Add {channel}' },
  selectChannel: { id: 'select-channel', defaultMessage: 'Select {channel}' },
  delete: { id: 'delete', defaultMessage: 'Delete' },

  featuredStory: { id: 'featured-story', defaultMessage: 'Featured {story}' },
  featuredStoryDescription: { id: 'featured-story-description', defaultMessage: 'Set a time period for this {story} to be featured. Use wisely as the more {stories} that are featured the less likely they will be seen.' },
  featuredStoryNote: { id: 'featured-story-note', defaultMessage: 'Promotes the {story} to the home page with large artwork for maximum visual impact.' },

  featuredImageNote: { id: 'featured-image-note', defaultMessage: 'Image requirements: 1000 × 540 px' },
  //featuredImageUpload: { id: 'upload-image', defaultMessage: 'Upload Image' },
  featuredImageSelect: { id: 'select-image', defaultMessage: 'Select image' },
  startDate: { id: 'start-date', defaultMessage: 'Start Date' },
  endDate: { id: 'end-date', defaultMessage: 'End Date' },
  timeZone: { id: 'time-zone', defaultMessage: 'Time Zone' },

  publishTime: { id: 'schedule-publishing-time', defaultMessage: 'Schedule Publishing Time' },
  publishTimeNote: { id: 'schedule-publishing-time-note', defaultMessage: 'Set a date and time to publish this {story}.' },
  expiryTime: { id: 'schedule-expiry-time', defaultMessage: 'Schedule Expiry Time' },
  expiryTimeNote: { id: 'schedule-expiry-time-note', defaultMessage: 'Set a date and time for this {story} to expire. The {story} and content will be removed from devices after the scheduled time.' },
  expiryTimeValidationMessage: { id: 'expiry-time-validation-message', defaultMessage: 'The expiry date and time must occur after the publish date' },
});

const FeaturedStoryOption = (props) => {
  const {
    enabled,
    readonly,
    featuredImage,
    featuredStartsAt,
    featuredExpiresAt,
    featuredAtTz,
    authString,
    strings,
    styles,
    onStartTimeChange,
    onExpireTimeChange,
    onTimezoneChange,
    onToggle,
    onUploadClick
  } = props;
  const cx = classNames.bind(styles);
  const previewClasses = cx({
    featuredImagePreview: true,
    featuredImageEmpty: !featuredImage
  });

  const previewStyle = {
    backgroundImage: featuredImage ? 'url(' + featuredImage + authString + ')' : 'none'
  };

  const minStart = new Date();
  const minExpire = new Date(featuredStartsAt * 1000);

  return (
    <div data-id="featuredStory" className={styles.featuredStory}>
      <Checkbox
        label={strings.featuredStory}
        name="featuredStory"
        value="isFeatured"
        disabled={readonly}
        checked={enabled}
        onChange={onToggle}
      >
        <span aria-label={strings.featuredStoryNote} className={styles.tooltip}>
          <span />
        </span>
      </Checkbox>
      {enabled && <div className={styles.featuredStorySettings}>
        <p className={styles.note}>{strings.featuredStoryDescription}</p>
        <div className={styles.flexWrapper}>
          <div className={styles.featuredDateSettings}>
            <div className={styles.dateTimeWrapper}>
              <h4>{strings.startDate}</h4>
              <DateTimePicker
                datetime={featuredStartsAt * 1000}
                min={minStart}
                tz={moment.tz.guess()}
                showTz={false}
                disabled={readonly}
                onChange={onStartTimeChange}
              />
            </div>
            <div className={styles.dateTimeWrapper}>
              <h4>{strings.endDate}</h4>
              <DateTimePicker
                datetime={featuredExpiresAt * 1000}
                min={minExpire}
                showTz={false}
                disabled={readonly}
                onChange={onExpireTimeChange}
              />
            </div>
            <div className={styles.dateTimeWrapper}>
              <h4>{strings.timeZone}</h4>
              <DateTimePicker
                tz={featuredAtTz}
                showDate={false}
                showTime={false}
                disabled={readonly}
                onChange={onTimezoneChange}
              />
            </div>
          </div>
          <div className={styles.featuredImageSettings}>
            <div className={previewClasses} style={previewStyle} />
            <p className={styles.note}>{strings.featuredImageNote}</p>
            <Btn disabled={readonly} inverted onClick={onUploadClick}>{strings.featuredImageSelect}</Btn>
          </div>
        </div>
      </div>}
    </div>
  );
};

const PublishTimeOption = (props) => {
  const {
    publishAt,
    publishAtTz,
    enabled,
    readonly,
    strings,
    styles,
    onChange,
    onToggle
  } = props;
  const minStart = new Date();

  return (
    <div data-id="publishTime" className={styles.publishTime}>
      <Checkbox
        label={strings.publishTime}
        name="publishTime"
        value="isFeatured"
        checked={enabled}
        disabled={readonly}
        onChange={onToggle}
      />
      {enabled && <div className={styles.publishTimeSettings}>
        <p className={styles.note}>{strings.publishTimeNote}</p>
        <DateTimePicker
          datetime={publishAt * 1000}
          tz={publishAtTz}
          min={minStart}
          disabled={readonly}
          onChange={onChange}
        />
      </div>}
    </div>
  );
};

const ExpiryTimeOption = (props) => {
  const {
    expiresAt,
    expiresAtTz,
    publishAt,
    enabled,
    readonly,
    strings,
    styles,
    onChange,
    onToggle
  } = props;

  //if publishAt time set then the min expireDate should be publishtime + 30 min otherwise current date
  const minExpire = publishAt > 0 ? (moment(new Date(publishAt * 1000)).add(30, 'minutes').toDate()) : new Date();
  const isValidExpireDate = publishAt > expiresAt;
  return (
    <div data-id="expiryTime" className={styles.expiryTime}>
      <Checkbox
        label={strings.expiryTime}
        name="expiryTime"
        value="isFeatured"
        checked={enabled}
        disabled={readonly}
        onChange={onToggle}
      />
      {enabled && <div className={styles.expiryTimeSettings}>
        <p className={styles.note}>{strings.expiryTimeNote}</p>
        <div className={styles.expireTimeContainer}>
          {isValidExpireDate && <span className={styles.error} aria-label={strings.expiryTimeValidationMessage}>
            <span className={styles.warning} />
          </span>}
          <DateTimePicker
            datetime={expiresAt * 1000}
            tz={expiresAtTz}
            min={minExpire}
            disabled={readonly}
            onChange={onChange}
          />
        </div>
      </div>}
    </div>
  );
};

export default class StoryEditDetails extends PureComponent {
  static propTypes = {
    permId: PropTypes.number,
    name: PropTypes.string,
    thumbnail: PropTypes.string,
    channels: PropTypes.array,

    featuredImage: PropTypes.string,
    featuredStartsAt: PropTypes.number,
    featuredExpiresAt: PropTypes.number,
    featuredAtTz: PropTypes.string,

    expiresAt: PropTypes.number,
    expiresAtTz: PropTypes.string,
    publishAt: PropTypes.number,
    publishAtTz: PropTypes.string,

    canPublishToChannel: PropTypes.bool,

    onThumbnailClick: PropTypes.func.isRequired,

    onNameChange: PropTypes.func.isRequired,

    onFeaturedToggle: PropTypes.func.isRequired,
    onFeaturedStartTimeChange: PropTypes.func.isRequired,
    onFeaturedExpireTimeChange: PropTypes.func.isRequired,
    onFeaturedTimezoneChange: PropTypes.func.isRequired,
    onFeaturedUploadClick: PropTypes.func.isRequired,

    onPublishTimeToggle: PropTypes.func.isRequired,
    onPublishTimeChange: PropTypes.func.isRequired,

    onExpiryTimeToggle: PropTypes.func.isRequired,
    onExpiryTimeChange: PropTypes.func.isRequired
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false
    };
    autobind(this);
  }

  handlePreventClick(event) {
    event.preventDefault();
  }

  handleCancelRemoveThumbnailClick(event) {
    event.preventDefault();
    this.setState({ confirmDelete: false });
  }

  handleRemoveThumbnailClick(event) {
    // Confirm remove thumbnail
    if (this.props.thumbnail && !this.state.confirmDelete) {
      this.setState({ confirmDelete: true });

    // Propagate event
    } else {
      this.setState({ confirmDelete: false });
      this.props.onThumbnailClick(event);
    }
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { authString, naming, userCapabilities } = this.context.settings;
    const {
      hasAliases,
      showStoryOptionExpiryDate,
      showStoryOptionFeatured,
      showStoryOptionPublishDate,
      showStoryAuthor,
    } = userCapabilities;
    const { confirmDelete } = this.state;
    const { author, name, thumbnail, thumbnailProgress, thumbnailUploading, canPublishToChannel } = this.props;
    const styles = require('./StoryEditDetails.less');
    const cx = classNames.bind(styles);
    const thumbClasses = cx({
      thumbWrap: true,
      thumbUploading: thumbnailUploading
    }, this.props.className);

    // Translations
    const strings = generateStrings(messages, formatMessage, naming);

    const isNew = location.pathname.indexOf('/new') > -1 || location.pathname.indexOf('quicklink') > -1;
    const isFeatured = !!this.props.featuredStartsAt;
    const isQuicklink = this.props.isQuicklink || this.props.isQuickfile;
    const hasPublishTime = !!this.props.publishAt;
    const hasExpiryTime = !!this.props.expiresAt;

    const placeholderTitle = isQuicklink ? strings.quicklinkTitle : strings.storyTitle;

    let showPublish = false;
    if (showStoryOptionPublishDate && (!this.props.permId || this.props.publishAt)) {
      showPublish = true;
    }

    let thumbActionElem = (
      <div data-id="story-thumbnail" className={styles.thumbActionText} onClick={this.props.onThumbnailClick}>
        {strings.addCoverArt}
      </div>
    );
    if (thumbnail && confirmDelete) {
      thumbActionElem = (
        <div data-id="story-thumbnail" className={styles.thumbActionConfirm}>
          <p>{strings.confirmRemoveCoverArt}</p>
          <div>
            <Btn alt onClick={this.handleCancelRemoveThumbnailClick}>{strings.cancel}</Btn>
            <Btn inverted onClick={this.handleRemoveThumbnailClick}>{strings.remove}</Btn>
          </div>
        </div>
      );
    } else if (thumbnail && !confirmDelete) {
      thumbActionElem = (
        <div data-id="story-thumbnail" className={styles.thumbActionText} onClick={this.handleRemoveThumbnailClick}>
          {strings.removeCoverArt}
        </div>
      );
    }

    return (
      <div className={styles.StoryEditDetails}>
        <div className={styles.flexWrapper}>
          <div className={styles.thumbPreview}>
            <div className={thumbClasses}>
              <StoryThumb
                {...this.props}
                grid
                showThumb
                readonly={!isNew && !canPublishToChannel}
                authString={thumbnailUploading ? '' : authString}
                onClick={this.handlePreventClick}
              />
              {(isNew || !isNew && canPublishToChannel) && thumbActionElem}
              {thumbnailUploading && <span className={styles.thumbProgress} style={{ width: thumbnailProgress + '%' }} />}
            </div>
            <div className={styles.storyInfo}>
              <span className={styles.storyName}>{name || placeholderTitle}</span>
              {showStoryAuthor && <span className={styles.storyNote}>{author.role || author.name}</span>}
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div className={styles.title}>
              <Text
                id="story-edit-name"
                disabled={!isNew && !canPublishToChannel}
                placeholder={placeholderTitle}
                value={this.props.name}
                onChange={this.props.onNameChange}
              />
            </div>
            <StoryEditChannels
              channels={this.props.channels}
              allowMultiple={hasAliases}
              readonly={!isNew && !canPublishToChannel}
              strings={strings}
              authString={authString}
              onAddChannelClick={this.props.onAddChannelClick}
              onPrimaryChannelChange={this.props.onPrimaryChannelChange}
              onDeleteChannelClick={this.props.onDeleteChannelClick}
            />
          </div>
        </div>

        {showStoryOptionFeatured && <FeaturedStoryOption
          featuredImage={this.props.featuredImage}
          featuredStartsAt={this.props.featuredStartsAt}
          featuredExpiresAt={this.props.featuredExpiresAt}
          featuredAtTz={this.props.featuredAtTz}

          authString={authString}
          enabled={isFeatured}
          strings={strings}
          styles={styles}

          onStartTimeChange={this.props.onFeaturedStartTimeChange}
          onExpireTimeChange={this.props.onFeaturedExpireTimeChange}
          onTimezoneChange={this.props.onFeaturedTimezoneChange}

          onToggle={this.props.onFeaturedToggle}
          onUploadClick={this.props.onFeaturedUploadClick}
        />}

        {showPublish && <PublishTimeOption
          publishAt={this.props.publishAt}
          publishAtTz={this.props.publishAtTz}
          enabled={hasPublishTime}
          readonly={!isNew && !canPublishToChannel}
          strings={strings}
          styles={styles}
          onChange={this.props.onPublishTimeChange}
          onToggle={this.props.onPublishTimeToggle}
        />}

        {showStoryOptionExpiryDate && <ExpiryTimeOption
          publishAt={this.props.publishAt}
          expiresAt={this.props.expiresAt}
          expiresAtTz={this.props.expiresAtTz}
          enabled={hasExpiryTime}
          readonly={!isNew && !canPublishToChannel}
          strings={strings}
          styles={styles}
          onChange={this.props.onExpiryTimeChange}
          onToggle={this.props.onExpiryTimeToggle}
        />}
      </div>
    );
  }
}
