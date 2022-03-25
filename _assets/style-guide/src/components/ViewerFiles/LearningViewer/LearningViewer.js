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
import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Blankslate from 'components/Blankslate/Blankslate';

const messages = defineMessages({
  learningFileHeading: { id: 'learning-file-heading', defaultMessage: "Congrats, it's nice to see you level up!" },
  learningFileMessage: { id: 'learning-file-message', defaultMessage: 'Your quest for knowledge is just a few moments away...' },
  open: { id: 'open', defaultMessage: 'Open' }
});

const LearningSVG = (props) => (
  <svg viewBox="0 0 512 512" className={props.className} style={props.style}>
    <g
      stroke="none" strokeWidth="1" fill="none"
      fillRule="evenodd"
    >
      <path
        d="M181.112828,227 C181.112828,227 159.976817,265.848753 167.695776,267.091136 C233.955536,277.721607 248.187367,305 266.996969,305 C285.811932,305 300.043763,277.721607 366.303523,267.091136 C373.674057,265.90277 354.746526,230.44626 353.00976,227.232271" id="Stroke-3" stroke="#DDDDDD"
        strokeWidth="10.7461774" fill="#FFFFFF" strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        stroke="#DDDDDD" strokeWidth="10.7461774" fill="#FFFFFF"
        strokeLinecap="round" strokeLinejoin="round" points="267.5 261 109 197.596979 267.5 134 426 197.596979"
      />
      <path
        d="M269.253319,193.856304 C276.326886,197.417846 330.796591,224.964738 335.390096,227.274637 C339.978211,229.584536 342,233.113847 342,239.098098 L342,255.960362 L331.826355,260 L331.826355,239.962967 C331.826355,237.567118 330.974508,234.934907 328.629232,233.812189 C325.604635,232.372531 270.978579,203.708293 264.38485,200.238072 C259.451684,197.648836 262.708113,190.563355 269.253319,193.856304 Z" id="Stroke-7" stroke="#DDDDDD"
        strokeWidth="2.93077565" fill="#DDDDDD" strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M341.679011,253 C341.679011,253 356.831989,304.679037 357.949259,348.326037 C358.728125,352.89812 350.493628,361 336.474035,361 C322.459814,361 314.794695,356.487016 315.004183,348.326037 C316.121454,304.679037 331.274431,253 331.274431,253 L341.679011,253 Z" id="Stroke-11" stroke="#DDDDDD"
        strokeWidth="10.7461774" fill="#FFFFFF" strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M336.497279,249 C330.701736,249 326,250.828488 326,257.5 C326,264.171512 330.701736,266 336.497279,266 C342.292822,266 347,264.171512 347,257.5 C347,250.828488 342.292822,249 336.497279,249" id="Fill-13" fill="#FFFFFF" />
      <path
        d="M336.497279,249 C330.701736,249 326,250.828488 326,257.5 C326,264.171512 330.701736,266 336.497279,266 C342.292822,266 347,264.171512 347,257.5 C347,250.828488 342.292822,249 336.497279,249 Z" id="Stroke-15" stroke="#DDDDDD"
        strokeWidth="10.7461774" fill="#FFFFFF" strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M73,427.136364 L73,497.103943 C73,502.559369 77.4337788,507 82.8847926,507 L453.115207,507 C458.566221,507 463,502.559369 463,497.103943 L463,14.8960573 C463,9.43883154 458.566221,5 453.115207,5 L82.8847926,5 C77.4337788,5 73,9.43883154 73,14.8960573 L73,358.681818 L209.840989,358.681818 C211.101202,358.681818 212.122807,359.703423 212.122807,360.963636 L212.122807,424.854545 C212.122807,426.114759 211.101202,427.136364 209.840989,427.136364 L73,427.136364 Z" id="Fill-1" stroke="#DDDDDD"
        strokeWidth="9.12727273"
      />
      <path
        d="M53.6333333,427.436364 L211.366667,427.436364 C211.918377,427.436364 212.436364,426.898455 212.436364,426.15 L212.436364,359.85 C212.436364,359.101545 211.918377,358.563636 211.366667,358.563636 L53.6333333,358.563636 C53.0816228,358.563636 52.5636364,359.101545 52.5636364,359.85 L52.5636364,426.15 C52.5636364,426.898455 53.0816228,427.436364 53.6333333,427.436364 Z" id="Fill-3" stroke="#DDDDDD"
        strokeWidth="9.12727273"
      />
    </g>
  </svg>
);

/**
 * Displays a message to launch an unstructured course (xAPI) in a new browser tab.
 */
export default class LearningViewer extends PureComponent {
  static propTypes = {
    description: PropTypes.string,

    /** URL to open in new tab */
    url: PropTypes.string.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleOpenInNewWindowClick(event) {
    event.preventDefault();
    const newWindow = window.open(this.props.url);
    newWindow.opener = null;
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { description, url } = this.props;
    const styles = require('./LearningViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      LearningViewer: true
    }, this.props.className);
    const strings = generateStrings(messages, formatMessage);

    return (
      <div className={classes} style={this.props.style}>
        <Blankslate
          icon={<LearningSVG style={{ width: '7.5rem' }} />}
          heading={strings.learningFileHeading}
          message={strings.learningFileMessage}
          middle
        >
          <Btn
            href={url}
            title={description}
            className={styles.btn}
            onClick={this.handleOpenInNewWindowClick}
          >
            {strings.open}
          </Btn>
        </Blankslate>
      </div>
    );
  }
}
