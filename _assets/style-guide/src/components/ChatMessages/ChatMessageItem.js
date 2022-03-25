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
import { emojify } from 'react-emojione';
import Linkify from 'linkifyjs/react';
import { FormattedRelative } from 'react-intl';

import Loader from 'components/Loader/Loader';
import StoryItem from 'components/StoryItem/StoryItem';
import FileItem from 'components/FileItem/FileItem';
import UserThumb from 'components/UserThumb/UserThumb';

const ErrorItem = (props) => {
  const styles = require('./ChatMessageItem.less');

  return (<div className={styles.ErrorItem}>
    <span className={styles.errorThumb} />
    <span className={styles.errorMessage}>{props.message}</span>
  </div>);
};

export default class ChatMessageItem extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    body: PropTypes.string,
    time: PropTypes.number,
    type: PropTypes.string,  // chat, hub-attachment

    received: PropTypes.bool,
    sent: PropTypes.bool,
    user: PropTypes.object.isRequired,

    file: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),
    story: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),

    /** alternate styles */
    size: PropTypes.oneOf(['compact', 'full']),

    authString: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,
    onFileClick: PropTypes.func.isRequired,
    onStoryClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object,
    showAuthor: PropTypes.bool,
  };

  static defaultProps = {
    size: 'full',
    authString: '',
    showAuthor: true,
  };

  renderTextBody() {
    const { body, onAnchorClick } = this.props;
    const linkProps = {
      onClick: onAnchorClick
    };

    return (
      <Linkify options={{ attributes: linkProps }}>
        {emojify(body, { output: 'unicode' })}
      </Linkify>
    );
  }

  renderAttachmentBody() {
    const { story, file, size, onFileClick, onStoryClick, authString, showAuthor } = this.props;
    const styles = require('./ChatMessageItem.less');

    const isCompact = size === 'compact';

    // Story attachment
    if (story) {
      if (story.error) {
        return <ErrorItem {...story.error} />;
      }

      if (typeof story === 'number' || !story.name) {
        return (
          <div className={styles.attachmentLoading}>
            <Loader type="content" />
          </div>
        );
      }

      return (
        <StoryItem
          thumbSize={isCompact ? 'small' : 'medium'}
          showThumb
          authString={authString}
          onClick={onStoryClick}
          className={styles.storyAttachment}
          {...story}
          showAuthor={showAuthor}
        />
      );
    }

    // File attachment
    if (file.error) {
      return <ErrorItem {...file.error} />;
    }

    if (typeof file === 'number' || !file.description) {
      return (
        <div className={styles.attachmentLoading}>
          <Loader type="content" />
        </div>
      );
    }

    return (
      <FileItem
        thumbSize={isCompact ? 'medium' : 'large'}
        showThumb
        grid
        authString={authString}
        onClick={onFileClick}
        className={styles.fileAttachment}
        {...file}
      />
    );
  }

  render() {
    const { received, sent, type, size } = this.props;
    const styles = require('./ChatMessageItem.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatMessageItem: true,
      messageReceived: received,
      messageSent: sent,
      isCompact: size === 'compact'
    }, this.props.className);

    const bodyClasses = cx({
      messageBody: true,
      messageBodyReceived: received,
      messageBodySent: sent,
      isCompact: size === 'compact'
    });

    // Display nothing for incoming call invite
    if (type === 'call') {
      return false;
    }

    return (
      <div className={classes} style={this.props.style}>
        <div className={styles.messageWrap}>
          {received && <UserThumb
            width={size === 'full' ? 46 : 23}
            maxInitials={size === 'full' ? 2 : 1}
            className={styles.receivedUser}
            {...this.props.user}
          />}
          <div className={bodyClasses}>
            {type === 'chat' && this.renderTextBody()}
            {type === 'hub-attachment' && this.renderAttachmentBody()}
          </div>
        </div>
        <div className={styles.time}>
          <FormattedRelative value={this.props.time} style="best fit" />
        </div>
      </div>
    );
  }
}
