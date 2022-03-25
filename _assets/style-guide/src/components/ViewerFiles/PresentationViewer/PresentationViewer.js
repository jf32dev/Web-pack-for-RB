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

import _get from 'lodash/get';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Fullscreen from 'components/Fullscreen/Fullscreen';
import Modal from 'components/Modal/Modal';

import BroadcastControl from './BroadcastControl';
import NoteControl from './NoteControl';
import PresentationSlides from './PresentationSlides';
import PresentationToolbar from './PresentationToolbar';
import UserList from './UserList';
import ViewerToolbar from 'components/Viewer/ViewerToolbar';

/**
 * Displays a <code>btc/btcp</code> file. Powerpoint and Keynote files are converted to this format.
 * Note: The internal player does not yet propagate <code>mousemove</code> events, preventing the toolbar from showing.
 */
export default class PresentationViewer extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,

    /** base url of the html string */
    baseUrl: PropTypes.string,

    /** Transition to new slide */
    currentSlide: PropTypes.number,

    /** Ttoggle thumb panel */
    thumbPanelVisible: PropTypes.bool,

    /** Slide count is available shortly after load */
    onGetSlideCount: PropTypes.func,

    /** The broadcast object */
    broadcast: PropTypes.object,

    /** Useful to keep currentSlide in sync when changed by player */
    onSlideChange: PropTypes.func,

    /** Useful to keep thumbPanelVisible in sync when changed by player */
    onThumbPanelChange: PropTypes.func,

    /** note element to show the notes */
    personalNotesElement: PropTypes.element,

    /** display presentation tool bar or not*/
    isToolbarVisible: PropTypes.bool,

    /** select speak note or personal note */
    selectTypes: PropTypes.func,

    /** call back when presenter fill all the information and click the share btn */
    onShareClick: PropTypes.func,

    onBroadcastStop: PropTypes.func,

    onBroadcastStart: PropTypes.func,

    /** an object to define allowHideSlide, allowLiveBroadcast, allowSorter  */
    convertSettings: PropTypes.object,

    /** define whether a use can use note feature or not*/
    canCreateNote: PropTypes.bool,

    strings: PropTypes.object,

    onLoad: PropTypes.func,
    onError: PropTypes.func,

    className: PropTypes.string,
  };

  static defaultProps = {
    broadcast: {},
    isToolbarVisible: false,
    convertSettings: {
      allowHideSlide: false,
      allowLiveBroadcast: false,
      allowSorter: false
    },
    canCreateNote: false,
    strings: {
      broadcast: 'Broadcast',
      startBroadcast: 'Start Broadcast',
      stopBroadcast: 'Stop Broadcast',
      passwordProtected: 'Password Protected',
      inviteGuests: 'Invite Guests',
      shareLinkLabel: 'Share link with others',
      guests: 'Guests',
      guest: 'Guest',
      viewGuests: 'View Guests',
      cancel: 'Cancel',
      share: 'Share',
      message: 'Message',
      to: 'To',
      emailFormatDesc: 'Seperate email addresses with Semi-colon',
      exit: 'Exit',
      timeResetMessage: 'Click to reset timer',
      warning: 'Warning',
      broadcastExitMessage: 'Are you sure you want to exit the broadcast?',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      broadcastVisible: false,
      clients: [],
      currentSlide: 0,
      docPagesVisible: false,
      hideSlides: {},
      isAnnotateActive: false,
      isBroadcastActive: false,
      isEyeActive: false,
      noteVisible: false,
      slideThumbnails: [],
      speakerNotes: '',
      thumbPanelVisible: false,
      viewerHeaderClick: '',
      viewerToolbarVisible: false
    };

    this.speakNotes = [];
    this.currentOrder = {};
    //ref
    this.elem = null;
    this.frame = null;
    this.elemContainer = null;
    autobind(this);
  }

  componentDidMount() {
    this.setupFrame();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(this.props.broadcast.starting, nextProps.broadcast.started);
    if (nextProps.currentSlide && nextProps.currentSlide !== this.state.currentSlide) {
      this.goToSlide(nextProps.currentSlide);
    }

    if (nextProps.thumbPanelVisible !== this.state.thumbPanelVisible) {
      this.toggleThumbPanel(nextProps.thumbPanelVisible);
    }

    if (this.props.broadcast.starting && nextProps.broadcast.started) {
      // console.log('start', nextProps.broadcast.broadcastRoomId, nextProps.broadcast.presenterKey);
      //this.btcFrame.contentWindow.startBroadcast(nextProps.broadcast.broadcastRoomId, nextProps.broadcast.presenterKey);
      this.btcFrame.contentWindow.postMessage('startBroadcast(\'' + nextProps.broadcast.broadcastRoomId + '\',\'' + nextProps.broadcast.presenterKey + '\')', '*');
    }

    if (this.props.isToolbarVisible !== nextProps.isToolbarVisible) {
      this.handleClose();
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (!this.state.isAnnotateActive && nextState.isAnnotateActive && _get(this.btcFrame, 'contentWindow', false)) {
      //this.btcFrame.contentWindow.toggleAnnotation(true);
      this.btcFrame.contentWindow.postMessage('toggleAnnotation(true)', '*');
    }

    if (this.state.isAnnotateActive && !nextState.isAnnotateActive && _get(this.btcFrame, 'contentWindow', false)) {
      //this.btcFrame.contentWindow.toggleAnnotation(false);
      this.btcFrame.contentWindow.postMessage('toggleAnnotation(false)', '*');
    }
  }

  componentWillUnmount() {
    // Remove BTC event listener
    window.removeEventListener('message', this.receiveMessage);
    this.speakNotes = [];
    this.currentOrder = {};
  }

  setupFrame() {
    // Reference to BTC iframe
    if (!this.btcFrame) {
      this.btcFrame = this.elem;

      // Listen for BTC events
      window.addEventListener('message', this.receiveMessage, false);

      // Focus for built-in keyboard shortcuts
      this.btcFrame.focus();

      this.handleFrameLoaded();
    }
  }

  // Recieve message from BTC iFrame
  receiveMessage(event) {
    if (event.source !== this.btcFrame.contentWindow) {
      return; // Skip message in this event listener
    }

    const { id } = this.props;
    const data = event.data;

    if (typeof data === 'string' && data.indexOf('slideshowtimeupdate') < 0) {
      // Total Slides
      if (data.indexOf('getSlideCount') > -1) {
        const slideCount = parseInt(data.split(':')[1], 10);
        // Propagate event
        if (typeof this.props.onGetSlideCount === 'function') {
          this.props.onGetSlideCount(event, { id, slideCount });
        }

        if (!this.speakerNotes) {
          //console.info('this.speakNotes: getSpeakerNote()');
          //this.speakNotes = JSON.parse(this.btcFrame.contentWindow.getSpeakerNote());
          this.btcFrame.contentWindow.postMessage('getSpeakerNote?', '*');
        }

        if (!this.slideThumbnails) {
          //console.info('this.speakNotes: getSlideThumbnails()');
          this.btcFrame.contentWindow.postMessage('getSlideDimension?', '*');
          this.btcFrame.contentWindow.postMessage('getSlideThumbnails?', '*');
          /*
          this.setState({
            slideThumbnails: JSON.parse(this.btcFrame.contentWindow.getSlideThumbnails()),
            slideDimension: this.btcFrame.contentWindow.getSlideDimension(),
          });
          this.currentOrder = JSON.parse(this.btcFrame.contentWindow.getSlideThumbnails())
            .map(url => url.match(/\d+/g)[1]);
          // this.slideThumbnails = JSON.parse(this.btcFrame.contentWindow.getSlideThumbnails());
          */
        }
      } else if (data.indexOf('getSlideThumbnails') > -1) {
        const slideThumbnails = data.split(':')[1];
        this.setState({
          slideThumbnails: JSON.parse(slideThumbnails)
        });
        this.currentOrder = JSON.parse(slideThumbnails);
      } else if (data.indexOf('getSlideDimension') > -1) {
        const slideDimension = data.split(':')[1];
        this.setState({
          slideDimension: slideDimension
        });
      } else if (data.indexOf('getSpeakerNote') > -1) {
        this.speakNotes = JSON.parse(data.substr(15));
      // Current slide
      } else if (data.indexOf('slideindexchange') > -1) {
        const currentSlide = parseInt(data.split(':')[1], 10);
        /*if (!this.speakerNotes) {
          console.info('this.speakNotes: getSpeakerNote()');
          //this.speakNotes = JSON.parse(this.btcFrame.contentWindow.getSpeakerNote());
        }*/
        this.setState({
          currentSlide,
          speakerNotes: _get(this.speakNotes.filter(note => note.id === currentSlide), '0.notes', ''),
        });

        // Propagate event
        if (typeof this.props.onSlideChange === 'function') {
          this.props.onSlideChange(event, { id, currentSlide });
        }

      // Hide Thumbnail Panel
      } else if (data === 'hideThumbnailPanelEND') {
        this.setState({ thumbPanelVisible: false });

        // Propagate event
        if (typeof this.props.onThumbPanelChange === 'function') {
          this.props.onThumbPanelChange(event, { id, thumbPanelVisible: false });
        }

      // Show Thumbnail Panel
      } else if (data === 'showThumbnailPanelEND') {
        this.setState({ thumbPanelVisible: true });

        // Propagate event
        if (typeof this.props.onThumbPanelChange === 'function') {
          this.props.onThumbPanelChange(event, { id, thumbPanelVisible: true });
        }
      } else if (data === 'socketConnected') {
        this.setState({
          isBroadcastActive: true,
        });
      } else if (data.indexOf('liveUserList') > -1) {
        this.setState({
          clients: JSON.parse(decodeURIComponent(data.replace('liveUserList:', '')))
        });
        //console.info('this.speakNotes: sendCommand()');
        //this.btcFrame.contentWindow.sendCommand(data.replace('liveUserList', 'broadcastLiveUserList'));
      }
    }
  }

  goToSlide(n) {
    if (this.btcFrame) {
      // slide not ready, try again
      // this happens when triggering gotoSlide before slideThumbnails are fetched
      // viewer may need a "ready" message to improve this
      if (!this.state.slideThumbnails.length) {
        setTimeout(() => {
          this.goToSlide(n);
        }, 500);
      } else {
        this.btcFrame.contentWindow.postMessage('clipActionGotoSlide:' + n, '*');
      }
    }
  }

  toggleThumbPanel(isVisible) {
    if (this.btcFrame) {
      if (isVisible) {
        this.btcFrame.contentWindow.postMessage('showThumbPanel()', '*');
      } else {
        this.btcFrame.contentWindow.postMessage('hideThumbPanel()', '*');
      }
    }
  }

  handleFrameLoaded(frame) {
    // Get slideCount
    if (this.btcFrame) {
      this.btcFrame.contentWindow.postMessage('getSlideCount?', '*');
    }

    // Propagate event
    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(frame);
    }
  }

  handlePresentationSlidesClick(event) {
    if (this.state.isEyeActive) {
      const { hideSlides } = this.state;
      //const { onGetSlideCount, id } = this.props;
      const slideId = event.currentTarget.dataset.id - 1;
      let newHideSlides = {};
      if (hideSlides[slideId] === 0) {
        newHideSlides = Object.keys(hideSlides).reduce((accumulator, key) => (
          parseInt(key, 10) === slideId ? accumulator : {
            ...accumulator,
            [key]: hideSlides[key]
          }
        ), {});

        this.setState({
          hideSlides: newHideSlides,
        });
        // console.log(JSON.stringify({ [id]: id + 1 }), JSON.stringify({ [id]: this.currentOrder[id] }));
        // if (Object.keys(this.currentOrder).length === 0) {
        //   this.btcFrame.contentWindow.setSlideOrders(JSON.stringify({ [id]: id + 1 }));
        // } else {
        //   this.btcFrame.contentWindow.setSlideOrders(JSON.stringify({ [id]: this.currentOrder[id] }));
        // }
      } else {
        newHideSlides = {
          ...this.state.hideSlides,
          [slideId]: 0,
        };

        this.setState({
          hideSlides: newHideSlides,
        });
      }
      // console.log(Object.keys(newHideSlides).filter((key) => newHideSlides[key] !== 0));
      // onGetSlideCount(null, { id, slideCount: Object.keys(newHideSlides).filter((key) => newHideSlides[key] !== 0).length });
      this.handleUpdateSlides(this.currentOrder, newHideSlides);
    } else if (event.type === 'click' || event.type === 'dragstart') {
      const slideId = Number(event.currentTarget.dataset.id);
      this.goToSlide(slideId);
    }
    // this.AnnotationActive = false;
    // this.btcFrame.contentWindow.toggleAnnotation(this.AnnotationActive);
  }

  handleTogglePen() {
    this.setState({
      isAnnotateActive: !this.state.isAnnotateActive,
    });
  }

  handleTogglePages() {
    this.setState({
      docPagesVisible: !this.state.docPagesVisible,
      isEyeActive: false,
      viewerHeaderClick: '-docPages',
    });
  }

  handleMouseOver() {
    if (this.props.onHandleMouseOver) {
      this.props.onHandleMouseOver(this);
    }
    if (!this.state.viewerToolbarVisible && !this.isFullScreen()) {
      this.setState({ viewerToolbarVisible: true });
    }
  }

  handleMouseOut() {
    if (this.props.onHandleMouseOut) {
      this.props.onHandleMouseOut(this);
    }
    if (this.state.viewerToolbarVisible) {
      this.setState({ viewerToolbarVisible: false });
    }
  }

  handleExitFullScreen() {
    this.setState({ viewerToolbarVisible: true, fullScreenToggle: false });
  }

  handleToolbarItemClick(event) {
    const type = _get(event, 'currentTarget.dataset.type', '');
    const defaultRightVisible = {
      noteVisible: false,
      broadcastVisible: false,
    };

    if (type === 'note' || type === 'docPages' || type === 'broadcast') {
      const updateVisible = Object.assign({}, type === 'docPages' ? {} : defaultRightVisible, {
        [`${type}Visible`]: !this.state[`${type}Visible`],
        viewerHeaderClick: '',
      });
      this.setState(updateVisible);
      if (type === 'docPages') {
        this.setState({
          isEyeActive: false,
        });
      }
      this.handleUpdateCurrentPage();
    } else if (type === 'annotate') {
      this.setState({
        isAnnotateActive: !this.state.isAnnotateActive,
      });
    } else if (type === 'close' && this.props.onBroadcastClose && typeof this.props.onBroadcastClose === 'function') {
      // this.handleClose();
      if (this.state.isBroadcastActive) {
        this.setState({
          isExistWarningVisible: true,
        });
      } else {
        this.props.onBroadcastClose();
      }
    } else if (type === 'eye') {
      if (this.state.isEyeActive) {
        this.handleUpdateCurrentPage();
      }
      this.setState({
        isEyeActive: !this.state.isEyeActive,
        docPagesVisible: !this.state.isEyeActive ? true : this.state.docPagesVisible
      });
    }
  }

  handleUpdateCurrentPage() {
    if (this.state.hideSlides[this.state.currentSlide - 1] === 0) {
      const newSlides = this.state.slideThumbnails
        .map(url => url.match(/\d+/g)[1] - 1)
        .filter(id => id > this.state.currentSlide - 1 && this.state.hideSlides[id] !== 0);
      this.goToSlide(newSlides[0] + 1);
    }
  }

  handleClose() {
    if (this.state.isBroadcastActive) {
      //this.btcFrame.contentWindow.stopBroadcast();
      this.btcFrame.contentWindow.postMessage('stopBroadcast()', '*');
      this.props.onBroadcastStop('broadcast-stop');
    }

    this.setState({
      clients: [],
      docPagesVisible: false,
      isEyeActive: false,
      noteVisible: false,
      broadcastVisible: false,
      isBroadcastActive: false,
      viewerHeaderClick: '',
      isAnnotateActive: false,
    });
  }

  handleFabricClick(event) {
    const type = _get(event, 'currentTarget.dataset.type', '');
    if (type.indexOf('color') > -1 && _get(this.btcFrame, 'contentWindow', false)) {
      //this.btcFrame.contentWindow.changeCurrentAnnotationColor(type.replace('color-', ''));
      this.btcFrame.contentWindow.postMessage('changeCurrentAnnotationColor(\'' + type.replace('color-', '') + '\')', '*');
    } else if (type === 'done') {
      this.setState({
        isAnnotateActive: false,
      });
    } else if (type === 'trash' && _get(this.btcFrame, 'contentWindow', false)) {
      //this.btcFrame.contentWindow.clearAllAnnotations();
      this.btcFrame.contentWindow.postMessage('clearAllAnnotations()', '*');
    }
  }

  handleBroadcastItemClick(event, password) {
    const type = _get(event, 'currentTarget.dataset.type', '');

    if (type.indexOf('broadcast-start') > -1 && !this.state.isBroadcastActive) {
      // this.isPasswordProtected = isPasswordProtected;
      this.props.onBroadcastStart(type, password);
    } else if (type.indexOf('broadcast-start') > -1 && this.state.isBroadcastActive) {
      //this.btcFrame.contentWindow.stopBroadcast();
      this.btcFrame.contentWindow.postMessage('stopBroadcast()', '*');
      this.props.onBroadcastStop('broadcast-stop');
      this.setState({
        isBroadcastActive: false,
        clients: [],
      });
    }
  }

  handleSetSlideOrders(newOrder) {
    const { hideSlides } = this.state;
    this.currentOrder = newOrder;
    this.handleUpdateSlides(newOrder, hideSlides);
  }

  handleUpdateSlides(newOrder, hideSlides) {
    const jsonNewOrder = JSON.stringify({
      ...newOrder,
      ...hideSlides,
    });
    console.info('setSlideOrders()');
    //this.btcFrame.contentWindow.setSlideOrders(jsonNewOrder);
    this.btcFrame.contentWindow.postMessage('setSlideOrders(\'' +  jsonNewOrder + '\')', '*');
  }

  handleExitBroadcast(event) {
    const type = _get(event, 'currentTarget.dataset.type', '');
    this.setState({
      isExistWarningVisible: false,
    });
    if (type === 'exit') {
      this.props.onBroadcastClose();
    }
  }

  handleViewerToolbarItemClick(event, action) {
    switch (action) {
      case 'fullscreen':
        this.setState({ fullScreenToggle: !this.state.fullScreenToggle });
        setTimeout(() => {
          if (this.state.viewerToolbarVisible && this.isFullScreen()) {
            this.setState({ viewerToolbarVisible: false });
          }
        }, 300);
        break;
      default:
        if (typeof this.props.onViewerToolbarMenuItemClick === 'function') {
          this.props.onViewerToolbarMenuItemClick(event, action);
        }
        break;
    }
  }

  isFullScreen() {
    return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement
      || document.msFullscreenElement);
  }

  render() {
    const {
      id,
      baseUrl,
      category,
      onError,
      selectTypes,
      personalNotesElement,
      className,
      isToolbarVisible,
      broadcast,
      strings,
      onShareClick,
      convertSettings,
      canCreateNote,
    } = this.props;
    const {
      noteVisible,
      docPagesVisible,
      speakerNotes,
      broadcastVisible,
      slideThumbnails,
      slideDimension,
      isAnnotateActive,
      isBroadcastActive,
      isEyeActive,
      currentSlide,
      clients,
      viewerHeaderClick,
      hideSlides,
      isExistWarningVisible,
    } = this.state;
    const {
      allowHideSlide,
      allowLiveBroadcast,
      allowSorter,
    } = convertSettings;
    const styles = require('./PresentationViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PresentationViewer: true,
    }, className);
    const iFrameClasses = cx({
      paddingLeft: noteVisible || broadcastVisible,
      paddingRight: docPagesVisible,
    });

    return (
      <div
        ref={elem => { this.frame = elem; }} tabIndex="-1" className={classes}
        onMouseEnter={this.handleMouseOver} onMouseLeave={this.handleMouseOut}
      >
        {isToolbarVisible && <PresentationToolbar
          onItemClick={this.handleToolbarItemClick}
          onFabricClick={this.handleFabricClick}
          isBroadcastActive={isBroadcastActive}
          isDocPagesActive={docPagesVisible}
          isAnnotateActive={isAnnotateActive}
          isEyeActive={isEyeActive}
          isNoteActive={noteVisible}
          allowLiveBroadcast={allowLiveBroadcast}
          allowHideSlide={allowHideSlide}
          strings={strings}
        />}
        <PresentationSlides
          isVisible={docPagesVisible}
          slideThumbnails={slideThumbnails}
          baseUrl={baseUrl}
          slideDimension={slideDimension}
          isToolbarVisible={isToolbarVisible}
          currentSlide={currentSlide}
          hideSlides={hideSlides}
          isEyeActive={isEyeActive}
          allowSorter={allowSorter}
          onSetSlideOrders={this.handleSetSlideOrders}
          onClick={this.handlePresentationSlidesClick}
          strings={strings}
          className={styles[`viewerHeader${viewerHeaderClick}`]}
        />
        <div
          className={styles.Frame}
          ref={elem => { this.elemContainer = elem; }}
        >
          <Fullscreen
            fullScreenToggle={this.state.fullScreenToggle}
            style={{ height: '100%', width: '100%' }}
            onExitFullScreen={this.handleExitFullScreen}
          >
            {this.props.children}
            {category !== 'keynote' && <iframe
              ref={elem => { this.elem = elem; }}
              src={baseUrl + 'index.html?fileid=' + id}
              width="100%"
              height="100%"
              sandbox={category === 'btc' ? null : 'allow-same-origin allow-scripts allow-popups allow-forms'}
              //allowFullScreen
              className={iFrameClasses}
              onError={onError}
              onLoad={this.handleFrameLoaded}
              style={this.state.fullScreenToggle ? { paddingRight: '0' } : {}}
            />}
            {category === 'keynote' && <iframe
              ref={elem => { this.elem = elem; }}
              src={baseUrl + 'kn_assets/player/KeynoteDHTMLPlayer.html?fileid=' + id}
              width="100%"
              height="100%"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              //allowFullScreen
              seamless
              className={iFrameClasses}
              onError={onError}
              onLoad={this.handleFrameLoaded}
              style={this.state.fullScreenToggle ? { paddingRight: '0' } : {}}
            />}
            {this.props.totalPages && !this.props.isBroadcastToolbarVisible && <ViewerToolbar
              currentPage={this.props.currentPage || 1}
              totalPages={this.props.totalPages}
              fullscreen={!this.props.hasWatermark}
              inViewer
              onCurrentPageChange={this.props.onCurrentPageChange}
              onItemClick={this.handleViewerToolbarItemClick}
              visible={this.state.viewerToolbarVisible}
            />}
          </Fullscreen>
        </div>
        <Modal
          isVisible={isExistWarningVisible}
          width="small"
          backdropClosesModal
          escClosesModal
          headerTitle={strings.warning}
          headerCloseButton
          footerChildren={(<div>
            <Btn
              alt large onClick={this.handleExitBroadcast}
              style={{ marginRight: '0.5rem' }}
            >Cancel</Btn>
            <Btn
              inverted large data-type="exit"
              onClick={this.handleExitBroadcast} style={{ marginLeft: '0.5rem' }}
            >Exit</Btn>
          </div>)}
          onClose={this.handleExitBroadcast}
        >
          <div style={{ padding: '1rem 1.5rem' }}>
            <p>{strings.broadcastExitMessage}</p>
          </div>
        </Modal>
        <BroadcastControl
          isBroadcastActive={isBroadcastActive}
          onShareClick={onShareClick}
          isVisible={broadcastVisible}
          personalBroadcastElement={<UserList clients={clients} />}
          onClick={this.handleBroadcastItemClick}
          clients={clients}
          strings={strings}
          broadcast={broadcast}
        />
        <NoteControl
          speakerNotes={speakerNotes}
          isVisible={noteVisible}
          personalNotesElement={personalNotesElement}
          selectTypes={selectTypes}
          strings={strings}
          canCreateNote={canCreateNote}
        />
      </div>
    );
  }
}
