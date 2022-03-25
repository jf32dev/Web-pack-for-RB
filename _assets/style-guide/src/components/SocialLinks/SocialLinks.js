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

/* eslint-disable jsx-a11y/anchor-has-content */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

/**
 * User social links.
 * Note that some inputs require an ID and some a URL.
 */
export default class SocialLinks extends PureComponent {
  static propTypes = {
    appleId: PropTypes.string,
    bloggerUrl: PropTypes.string,
    facebookUrl: PropTypes.string,
    skypeId: PropTypes.string,
    twitterUrl: PropTypes.string,
    linkedin: PropTypes.string,

    custom1: PropTypes.string,
    custom2: PropTypes.string,

    onAnchorClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const {
      appleId,
      bloggerUrl,
      facebookUrl,
      skypeId,
      twitterUrl,
      linkedin,
      custom1,
      custom2,
      onAnchorClick
    } = this.props;
    const styles = require('./SocialLinks.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SocialLinks: true
    }, this.props.className);

    return (
      <ul className={classes} style={this.props.style}>
        {skypeId && <li aria-label={skypeId} className={styles.skypeId}>
          <a href={'skype:' + skypeId + '?add'} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {bloggerUrl && <li aria-label={bloggerUrl} className={styles.bloggerUrl}>
          <a href={bloggerUrl} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {facebookUrl && <li aria-label={facebookUrl} className={styles.facebookUrl}>
          <a href={facebookUrl} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {twitterUrl && <li aria-label={twitterUrl} className={styles.twitterUrl}>
          <a href={twitterUrl} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {linkedin && <li aria-label={linkedin} className={styles.linkedin}>
          <a href={linkedin} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {appleId && <li aria-label={appleId} className={styles.appleId}>
          <a rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {custom1 && <li aria-label={custom1} className={styles.custom1}>
          <a href={custom1} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
        {custom2 && <li aria-label={custom2} className={styles.custom2}>
          <a href={custom2} rel="noopener noreferrer" onClick={onAnchorClick} />
        </li>}
      </ul>
    );
  }
}
