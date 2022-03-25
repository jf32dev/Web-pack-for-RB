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

import Checkbox from 'components/Checkbox/Checkbox';
import Text from 'components/Text/Text';

/**
 * Displayed when <code>sharing</code> is enabled on a Story.
 */
export default class StoryEditSharing extends PureComponent {
  static propTypes = {
    /** Device & Public Sharing enabled */
    sharingPublic: PropTypes.bool,

    sharingLinkedinDescription: PropTypes.string,
    sharingTwitterDescription: PropTypes.string,

    sharingDownloadLimit: PropTypes.number,

    /** File expiry in days after share */
    sharingDownloadExpiry: PropTypes.number,

    sharingIncludeDescription: PropTypes.bool,

    readonly: PropTypes.bool,

    strings: PropTypes.object,

    onPublicShareChange: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func
    ]),
    onShareDescriptionChange: PropTypes.func,
    onDownloadLimitChange: PropTypes.func,
    onDownloadExpiryChange: PropTypes.func,
    onIncludeSharingDescriptionChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      sharingPublicTitle: 'Allow device’s publicly available sharing options',
      sharingPublicNote: 'Allow users to share Stories via native share methods available to their device; this includes email, social networks and other means that might be available. Note: This does not provide usage statistics or an audit trail.',
      linkedin: 'LinkedIn',
      twitter: 'Twitter',

      downloadLimitTitle: 'Limit number of downloads per file',
      downloadLimitNote: 'Number of downloads allowed for each file shared, once the limit is reached the file will be unavailble for download unless shared again.',
      downloadExpiryTitle: 'Expire links to files',
      downloadExpiryNote: 'Number of days available to download the shared files, once reached the file will be unavailble for download unless shared again.',
      descriptionSharingTitle: 'Description Sharing',
      descriptionSharingNote: 'Include Story description when sharing.',

      days: 'Days',
      downloads: 'Downloads'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);

    // refs
    this.sharingDownloadLimit = null;
    this.sharingDownloadExpiry = null;
  }

  handleDownloadLimitChange(event) {
    const { onDownloadLimitChange } = this.props;
    const value = parseInt(event.target.value, 10);
    const validNumber = !!value && typeof value === 'number';

    // Propagate event if valid number
    if (validNumber && typeof onDownloadLimitChange === 'function') {
      onDownloadLimitChange(event);
    }
  }

  handleDownloadExpiryChange(event) {
    const { onDownloadExpiryChange } = this.props;
    const value = parseInt(event.target.value, 10);
    const validNumber = !!value && typeof value === 'number';

    // Propagate event if valid number
    if (validNumber && typeof onDownloadExpiryChange === 'function') {
      onDownloadExpiryChange(event);
    }
  }

  handleDownloadLimitFocus() {
    this.selectDownloadLimitInput();
  }

  handleDownloadExpiryFocus() {
    this.selectDownloadExpiryInput();
  }

  selectDownloadLimitInput() {
    if (this.sharingDownloadLimit) {
      this.sharingDownloadLimit.select();
    }
  }

  selectDownloadExpiryInput() {
    if (this.sharingDownloadExpiry) {
      this.sharingDownloadExpiry.select();
    }
  }

  render() {
    const {
      sharingPublic,
      sharingLinkedinDescription,
      sharingTwitterDescription,
      sharingDownloadLimit,
      sharingDownloadExpiry,
      sharingIncludeDescription,
      readonly,
      onPublicShareChange,
      onShareDescriptionChange,
      onDownloadLimitChange,
      onDownloadExpiryChange,
      onIncludeSharingDescriptionChange,
      strings,
      className,
      style
    } = this.props;
    const styles = require('./StoryEditSharing.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      StoryEditSharing: true
    }, className);

    return (
      <div className={classes} style={style}>
        {onPublicShareChange && <div>
          <Checkbox
            label={strings.sharingPublicTitle}
            name="sharingPublic"
            value="sharingPublic"
            disabled={readonly}
            checked={sharingPublic}
            onChange={onPublicShareChange}
          >
            <span aria-label={strings.sharingPublicNote} data-longtip className={styles.tooltip}>
              <span />
            </span>
          </Checkbox>
          {sharingPublic && <div className={styles.options}>
            <Text
              data-type="sharingLinkedin"
              id="linkedin-description"
              label={strings.linkedin}
              value={sharingLinkedinDescription}
              maxLength={140}
              disabled={readonly}
              onChange={onShareDescriptionChange}
              className={styles.descriptionInput}
            />
            <Text
              data-type="sharingTwitter"
              id="twitter-description"
              label={strings.twitter}
              value={sharingTwitterDescription}
              maxLength={140}
              disabled={readonly}
              onChange={onShareDescriptionChange}
              className={styles.descriptionInput}
            />
          </div>}
        </div>}
        <div>
          <Checkbox
            label={strings.downloadLimitTitle}
            name="sharingDownloadLimit"
            value="sharingDownloadLimit"
            disabled={readonly}
            checked={!!sharingDownloadLimit}
            onChange={onDownloadLimitChange}
          >
            <span aria-label={strings.downloadLimitNote} data-longtip className={styles.tooltip}>
              <span />
            </span>
          </Checkbox>
          {sharingDownloadLimit > 0 && <div className={styles.smlOptions}>
            <Text
              ref={(c) => { this.sharingDownloadLimit = c; }}
              value={sharingDownloadLimit}
              inline
              maxLength={3}
              disabled={readonly}
              onChange={this.handleDownloadLimitChange}
              onFocus={this.handleDownloadLimitFocus}
              className={styles.downloadLimitInput}
            />
            <span>{strings.downloads}</span>
          </div>}
        </div>
        <div>
          <Checkbox
            label={strings.downloadExpiryTitle}
            name="sharingDownloadExpiry"
            value="sharingDownloadExpiry"
            disabled={readonly}
            checked={!!sharingDownloadExpiry}
            onChange={onDownloadExpiryChange}
          >
            <span aria-label={strings.downloadExpiryNote} data-longtip className={styles.tooltip}>
              <span />
            </span>
          </Checkbox>
          {sharingDownloadExpiry > 0 && <div className={styles.smlOptions}>
            <Text
              ref={(c) => { this.sharingDownloadExpiry = c; }}
              value={sharingDownloadExpiry}
              maxLength={3}
              inline
              disabled={readonly}
              onChange={this.handleDownloadExpiryChange}
              onFocus={this.handleDownloadExpiryFocus}
              className={styles.downloadExpiryInput}
            />
            <span>{strings.days}</span>
          </div>}
        </div>
        {onIncludeSharingDescriptionChange && <div>
          <Checkbox
            label={strings.descriptionSharingTitle}
            name="sharingIncludeDescription"
            value="sharingIncludeDescription"
            disabled={readonly}
            checked={!!sharingIncludeDescription}
            onChange={onIncludeSharingDescriptionChange}
          >
            <span aria-label={strings.descriptionSharingNote} className={styles.tooltip}>
              <span />
            </span>
          </Checkbox>
        </div>}
      </div>
    );
  }
}
