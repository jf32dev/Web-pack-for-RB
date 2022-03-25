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

/* eslint-disable react/no-unused-state */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

//import ChatMessages from 'components/ChatMessages/ChatMessages';
import Fullscreen from 'components/Fullscreen/Fullscreen';
import UserItem from 'components/UserItem/UserItem';

/**
 * ChatRoom description
 */
export default class ChatRoom extends PureComponent {
  static propTypes = {
    /** room id */
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** name of room */
    name: PropTypes.string,

    /** status of call */
    status: PropTypes.oneOf(['empty', 'incoming', 'invited', 'accepted', 'connected', 'declined', 'expired', 'disconnected']),

    /** User that sent room invite, will be empty is current user has created a room */
    inviteUser: PropTypes.object,

    messages: PropTypes.array,

    /** messages pane will be open on initial render */
    showMessages: PropTypes.bool,

    /** fullscreen on initial render */
    isFullscreen: PropTypes.bool,

    /** OpenTok apiKey - required for initialise a session */
    apiKey: PropTypes.string,

    /** OpenTok session - required for initialise a session  */
    sessionId: PropTypes.string,

    /** Room token - required to connect */
    token: PropTypes.string,

    /** Publish audio on connect */
    publishAudio: PropTypes.bool,

    /** Publish video on connect */
    publishVideo: PropTypes.bool,

    /** Current user's stream resolution */
    resolution: PropTypes.oneOf(['1280x720', '640x480', '320x240']),

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onCallInvitation: PropTypes.func,

    onPublishError: PropTypes.func,

    /** OpenTok session 'sessionConnect' event, returns the event and room id */
    onSessionConnect: PropTypes.func,

    /** OpenTok session 'sessionDisconnected' event, returns the event and room id */
    onSessionDisconnect: PropTypes.func,

    onDisconnectClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    name: 'Untitled Chat Room',
    messages: [],
    resolution: '1280x720',
    strings: {
      connecting: 'Connecting...',
      connected: 'Connected',
      calling: 'Calling...',
      disconnected: 'Disconnected',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isFullscreen: props.isFullscreen,
      showMessages: props.showMessages,
      publishAudio: props.publishAudio,
      publishVideo: props.publishVideo,

      isPublishing: false,
      canPublish: true,

      isSubscribed: false,
      streamId: '',
      hasVideo: false,
      hasAudio: false
    };
    autobind(this);

    // refs
    this.publisher = null;
    this.subscriber = null;

    this.publisherView = null;
    this.subscriberView = null;
  }

  UNSAFE_componentWillMount() {
    // Current user has created a room, allow handler to invite user
    if (this.props.status === 'empty') {
      this.props.onCallInvitation(this.props.id);
    }
  }

  componentDidMount() {
    const { apiKey, sessionId, token } = this.props;
    if (window.OT && apiKey && sessionId && token) {
      this.initSessionAndConnect();
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (this.publisher) {
      if (nextState.publishAudio !== this.state.publishAudio) {
        this.publisher.publishAudio(nextState.publishAudio);
      }

      if (nextState.publishVideo !== this.state.publishVideo) {
        this.publisher.publishVideo(nextState.publishVideo);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { sessionId } = prevProps;
    if (window.OT && !sessionId && this.props.sessionId) {
      this.initSessionAndConnect();
    }
  }

  componentWillUnmount() {
    this.unpublishAndDisconnect();
  }

  // https://tokbox.com/developer/sdks/js/reference/Session.html
  initSessionAndConnect() {
    const { apiKey, sessionId, token } = this.props;

    // Initialise session
    this.session = window.OT.initSession(apiKey, sessionId);

    // Handle events
    this.session.on('sessionConnected', (event) => {
      if (typeof this.props.onSessionConnect === 'function') {
        this.props.onSessionConnect(event, this.props.id);
      }
      this.initPublisher();
    });

    this.session.on('sessionDisconnected', (event) => {
      if (typeof this.props.onSessionDisconnect === 'function') {
        this.props.onSessionDisconnect(event, this.props.id);
      }
    });

    // Subscribe to stream when created
    this.session.on('streamCreated', (event) => {
      this.subscribeToStream(event.stream);
    });

    // Disconnect and unpublish when stream destroyed
    this.session.on('streamDestroyed', (event) => {
      this.unpublishAndDisconnect();
      this.props.onDisconnectClick(event, this.props.id);
    });

    // Local/remote stream changed
    this.session.on('streamPropertyChanged', (event) => {
      // Ignore own stream change
      if (event.stream.id === this.state.streamId) {
        this.setState({
          [event.changedProperty]: event.newValue
        });
      }
    });

    this.session.on('exception', (event) => {
      console.log(event);  // eslint-disable-line
    });

    // Connect and publish stream on success
    this.session.connect(token, (error) => {
      if (error) {
        if (typeof this.props.onPublishError === 'function') {
          this.props.onPublishError(error, this.props.id);
        }
      }
    });
  }

  // https://tokbox.com/developer/sdks/js/reference/Publisher.html
  initPublisher() {
    const opts = {
      name: this.props.name,
      publishAudio: this.state.publishAudio,
      publishVideo: this.state.publishVideo,
      resolution: this.props.resolution,
      showControls: false
    };

    this.publisher = window.OT.initPublisher(this.publisherView, opts, (error) => {
      if (error) {
        if (typeof this.props.onPublishError === 'function') {
          this.props.onPublishError(error, this.props.id);
        }
        this.setState({ canPublish: false });
      } else {
        this.publishStream();
      }
    });
  }

  publishStream() {
    this.session.publish(this.publisher, (error) => {
      if (error) {
        if (typeof this.props.onPublishError === 'function') {
          this.props.onPublishError(error, this.props.id);
        }
        this.setState({ canPublish: false });
      } else {
        this.setState({ isPublishing: true });
      }
    });
  }

  subscribeToStream(stream) {
    const opts = {
      preferredResolution: { width: 1280, height: 960 },
      showControls: false,
      subscribeToAudio: true,
      subscribeToVideo: true,
      height: '100%',
      width: '100%',
    };

    // Subscribe to stream and render to targetElement
    this.subscriber = this.session.subscribe(stream, this.subscriberView, opts, (error) => {
      if (error) {
        console.log(error.message);
      } else {
        if (typeof this.props.onSubscribed === 'function') {
          this.props.onSubscribed(stream, this.props.id);
        }
        this.setState({
          isSubscribed: true,
          streamId: stream.id,
          hasAudio: stream.hasAudio,
          hasVideo: stream.hasVideo
        });
      }
    });
  }

  unpublishAndDisconnect() {
    if (this.publisher) {
      this.publisher.destroy();
    }
    if (this.session) {
      this.session.disconnect();
      this.session.off();
    }
    this.setState({ isPublishing: false, isSubscribed: false, streamId: '' });
  }

  handleFullScreenClick() {
    this.setState({
      isFullscreen: !this.state.isFullscreen
    });
  }

  handleMessagesClick() {
    this.setState({
      showMessages: !this.state.showMessages
    });
  }

  handleAudioClick() {
    if (this.state.canPublish) {
      this.setState({
        publishAudio: !this.state.publishAudio
      });
    }
  }

  handleVideoClick() {
    if (this.state.canPublish) {
      this.setState({
        publishVideo: !this.state.publishVideo
      });
    }
  }

  handleDisconnectClick(event) {
    this.props.onDisconnectClick(event, this.props.id);
  }

  render() {
    const {
      //showMessages,
      canPublish,
      publishAudio,
      publishVideo,
      isSubscribed,
      hasVideo
    } = this.state;
    const { status, inviteUser, strings } = this.props;
    const styles = require('./ChatRoom.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ChatRoom: true
    }, this.props.className);

    const audioControlClasses = cx({
      audioControl: true,
      disabled: !publishAudio || !canPublish,
      unavailable: !canPublish
    });

    const videoControlClasses = cx({
      videoControl: true,
      disabled: !publishVideo || !canPublish,
      unavailable: !canPublish
    });

    const subscriberStyles = {
      opacity: hasVideo ? '1' : '0'
    };

    const publisherStyle = {
      display: (publishVideo && canPublish) ? 'block' : 'none'
    };

    let statusText;
    switch (status) {
      case 'empty':
      case 'connecting':
        statusText = strings.connecting;
        break;
      case 'accepted':
      case 'connected':
        statusText = strings.connected;
        break;
      case 'invited':
        statusText = strings.calling;
        break;
      case 'expired':
        statusText = strings.disconnected;
        break;
      default:
        break;
    }

    return (
      <Fullscreen
        fullScreenToggle={this.state.isFullscreen}
        onExitFullScreen={this.handleFullScreenClick}
        data-status={status}
        className={classes}
        style={this.props.style}
      >
        <div className={styles.callWrap}>
          <div className={styles.callView}>
            <ul className={styles.uiControls}>
              {isSubscribed && <li className={styles.fullscreenControl} onClick={this.handleFullScreenClick} />}
              {/*<li className={styles.messagesControl} onClick={this.handleMessagesClick} />*/}
            </ul>

            <ul className={styles.callControls}>
              <li className={audioControlClasses} onClick={this.handleAudioClick} />
              <li className={styles.disconnectControl} onClick={this.handleDisconnectClick} />
              <li className={videoControlClasses} onClick={this.handleVideoClick} />
            </ul>

            {!hasVideo && <div className={styles.incomingView}>
              <UserItem
                {...inviteUser}
                thumbWidth="large"
                showNote={false}
                grid
                noLink
                className={styles.inviteUser}
              />
              <p className={styles.userStatus}>{statusText}</p>
            </div>}

            <div className={styles.subscriberView} style={subscriberStyles}>
              <div
                ref={(c) => { this.subscriberView = c; }}
                className={styles.subscriber}
              />
            </div>

            <div className={styles.publisherView} style={publisherStyle}>
              <div
                ref={(c) => { this.publisherView = c; }}
                className={styles.publisher}
              />
            </div>
          </div>
        </div>
        {/*showMessages && <div key="messages" className={styles.messagesView}>
          <ChatMessages
            userId={this.props.id}
            messages={this.props.messages}
            onAnchorClick={this.props.onAnchorClick}
            onFileClick={this.props.onFileClick}
            onStoryClick={this.props.onStoryClick}
            onAttachClick={this.props.onAttachClick}
            onInputChange={this.props.onInputChange}
            onSendClick={this.props.onSendClick}
          />
        </div>*/}
      </Fullscreen>
    );
  }
}
