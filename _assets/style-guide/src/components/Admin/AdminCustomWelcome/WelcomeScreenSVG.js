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
 * @author Jason Huang <jason.huang@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

// Next only
const Next = (props) => (
  <svg
    viewBox="0 0 128 140" width="128" height="140"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M0 0h128v140H0z" />
      <path fill="#EEE" d="M0 128h128v12H0z" />
      <rect
        width="20" height="6" x="105"
        y="131" fill="#AAA" rx="1"
      />
      <path fill="#EEE" d="M0 0h128v12H0z" />
      <path fill="#888" d="M44 4h40v4H44zM54 133h20v2H54z" />
    </g>
  </svg>
);

// Prev/Next
const PrevNext = (props) => (
  <svg
    viewBox="0 0 128 140" width="128" height="140"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M0 0h128v140H0z" />
      <path fill="#EEE" d="M0 128h128v12H0z" />
      <rect
        width="20" height="6" x="105"
        y="131" fill="#AAA" rx="1"
      />
      <rect
        width="20" height="6" x="3"
        y="131" fill="#AAA" rx="1"
      />
      <path fill="#EEE" d="M0 0h128v12H0z" />
      <path fill="#888" d="M44 4h40v4H44zM54 133h20v2H54z" />
    </g>
  </svg>
);

// Decline/Accept
const DeclineAccept = (props) => (
  <svg
    viewBox="0 0 128 140" width="128" height="140"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M0 0h128v140H0z" />
      <path fill="#EEE" d="M0 128h128v12H0z" />
      <rect
        width="20" height="6" x="66"
        y="131" fill="#AAA" rx="1"
      />
      <rect
        width="20" height="6" x="42"
        y="131" fill="#AAA" rx="1"
      />
      <path fill="#EEE" d="M0 0h128v12H0z" />
      <path fill="#888" d="M44 4h40v4H44z" />
    </g>
  </svg>
);

// Blank
const Blank = (props) => (
  <svg
    viewBox="0 0 128 140" width="128" height="140"
    className={props.className} style={props.style}
  >
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M0 0h128v140H0z" />
      <path fill="#EEE" d="M0 128h128v12H0zM0 0h128v12H0z" />
    </g>
  </svg>
);

export default class WelcomeScreenSVG extends PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'next',
      'prevNext',
      'declineAccept',
      'blank'
    ]),
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const styles = require('./WelcomeScreenSVG.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FolderSVG: this.props.type === 'folder'
    }, this.props.className);

    let Comp;
    switch (this.props.type) {
      case 'next':
        Comp = Next;
        break;
      case 'prevNext':
        Comp = PrevNext;
        break;
      case 'declineAccept':
        Comp = DeclineAccept;
        break;
      case 'blank':
        Comp = Blank;
        break;
      default:
        return false;
    }

    return <Comp {...this.props} className={classes} />;
  }
}
