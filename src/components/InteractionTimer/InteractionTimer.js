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

import { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  postInteraction,
  setInteraction
} from 'redux/modules/interactions';

function mapStateToProps(state) {
  const { files, stories } = state.interactions;

  const fileData = Object.keys(files).map(id => ({
    ...files[id],
    type: 'file'
  }));

  const storyData = Object.keys(stories).map(id => ({
    ...stories[id],
    type: 'story'
  }));

  const interactionData = fileData.concat(storyData);

  return {
    loggedIn: state.auth.loggedIn,
    interactionData: interactionData,

    // active story
    storyId: state.story.id,

    // active file
    fileId: state.viewer.activeFileId,
    fileOrder: state.viewer.order
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    postInteraction,
    setInteraction
  })
)
export default class InteractionTimer extends Component {
  static propTypes = {
    interactionData: PropTypes.array,

    storyId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    fileId: PropTypes.number,

    postInteraction: PropTypes.func.isRequired,
    setInteraction: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.interval = 1000;  // match increment in interactions.js
    this.timer = null;
  }

  UNSAFE_componentWillMount() {
    const { interactionData } = this.props;

    // post interaction data if it exists
    if (interactionData.length) {
      this.postInteraction();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Active Story/File
    if (nextProps.storyId && nextProps.storyId !== this.props.storyId ||
        nextProps.fileId && nextProps.fileId !== this.props.fileId) {
      this.startInterval();

    // No Active Story/File
    } else if (!nextProps.storyId && !nextProps.fileId) {
      this.stopInterval();
    }

    // Post when Story id changes
    // Post file-only interaction (no active storyId and viewer closed)
    if (nextProps.storyId !== this.props.storyId ||
        nextProps.fileId !== this.props.fileId && !nextProps.storyId && !nextProps.fileOrder.length) {
      this.postInteraction();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this.stopInterval();
  }

  setInteraction() {
    const { fileId, storyId } = this.props;

    if (typeof fileId === 'number' || typeof storyId === 'number') {
      this.props.setInteraction({
        fileId: fileId,
        storyId: storyId
      });
    }
  }

  postInteraction() {
    const { interactionData, loggedIn } = this.props;

    if (interactionData.length && loggedIn) {
      this.props.postInteraction(interactionData);
    }
  }

  startInterval() {
    this.stopInterval();
    this.timer = window.setInterval(this.setInteraction, this.interval);
  }

  stopInterval() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  }

  render() {
    return null;
  }
}
