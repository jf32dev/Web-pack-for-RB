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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import { connect } from 'react-redux';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import {
  setActiveRecipient,
  createRoomRequest
} from 'redux/modules/chat/actions';
import {
  setInteraction
} from 'redux/modules/interactions';
import {
  setReferrerPath as setStoryReferrerPath
} from 'redux/modules/story/story';
import {
  addFile as addFileToViewer,
  addFiles as addFilesToViewer
} from 'redux/modules/viewer';
import {
  toggleClearChannelFilter
} from 'redux/modules/content';

/**
 * Wraps all Auth Routes
 * Handlers vailable via this.props in all Auth Route children
 */
export default function ClickEventsHOC(WrappedComponent, passedProps) {
  return @connect(
    state => ({
      settings: state.settings,
      users: state.entities.users
    }),
    bindActionCreatorsSafe({
      setStoryReferrerPath,
      setActiveRecipient,
      createRoomRequest,
      addFileToViewer,
      addFilesToViewer,
      setInteraction,
      toggleClearChannelFilter,
    })
  )
  class ClickEvents extends Component {
    static propTypes = {
      /** Required for handling calls */
      settings: PropTypes.object.isRequired,

      /** Required for handling calls */
      users: PropTypes.object.isRequired,

      /** Required for triggering interaction when opening a new window */
      setInteraction: PropTypes.func.isRequired
    };

    static childContextTypes = {
      events: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);
      autobind(this);
    }

    getChildContext() {
      return {
        events: {
          onAnchorClick: this.handleAnchorClick,
          onCallClick: this.handleCallClick,
          onFileClick: this.handleFileClick,
          onFilesClick: this.handleFilesClick,
          onStoryClick: this.handleStoryClick
        }
      };
    }

    handleOpenInNewWindow(url) {
      // If we're missing a protocol, assume http
      let fixedUrl = url;
      if (fixedUrl.indexOf('://') === -1) {
        fixedUrl = 'http://' + url;
      }

      // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
      const newWindow = window.open(fixedUrl);
      newWindow.opener = null;
    }

    handleAnchorClick(event) {
      event.preventDefault();
      const href = event.currentTarget.getAttribute('href');
      const isEventFromStoryHeader = event.currentTarget.getAttribute('data-location');
      const isHomepage = this.props.location.pathname.indexOf('/') === this.props.location.pathname.length - 1;
      // Route on internal link
      if (href && href.indexOf('/') === 0) {
        // Are we currently on a modal route / only for notes
        const isModal = this.props.location.state && this.props.location.state.modal;
        if (href.indexOf('note') > -1 && this.props.location.pathname.indexOf('story') > -1 && isModal) {
          this.props.history.push(href, { modal: true });
        } else if (href.indexOf('story') !== -1 && isHomepage) {
          // if open a story from homepagetemplate
          this.props.history.push(href, { modal: true });
        } else {
          this.props.history.push(href);
        }

        if (isModal && isEventFromStoryHeader === 'storyHeader') {
          this.props.toggleClearChannelFilter(true);
        }

        // Open other links in new window
      } else if (href) {
        this.handleOpenInNewWindow(href);
      }
    }

    handleCallClick(event, context) {
      event.preventDefault();
      const { company, user } = this.props.settings;
      const type = event.currentTarget.dataset.type || 'audio';
      const activeRecipient = this.props.users[context.props.id];
      const newMessageId = activeRecipient.lastMessageId ? activeRecipient.lastMessageId + 1 : 1;
      const bearerId = user.id + '@' + company.id;

      // Send room create request to chat server
      const data = {
        id: newMessageId,
        bearerId: bearerId,
        calltype: type === 'audio' ? 'audio' : 'video and audio'
      };

      // Set user active and create room
      this.props.setActiveRecipient(activeRecipient.id);
      this.props.createRoomRequest(data, activeRecipient.id);
    }

    handleStoryClick(event, context) {
      event.preventDefault();
      const { pathname, search } = this.props.history.location;
      let href = event.currentTarget.getAttribute('href') || event.currentTarget.dataset.path;
      let itemProps = context.props;

      // Are we currently on a modal route
      const isModal = this.props.location.state && this.props.location.state.modal;

      // story routes open as a modal by default (except search)
      let modal = true;

      // Navigating from a non-modal Search route
      if (pathname.indexOf('/search') === 0 && !isModal) {
        modal = false;

      // Navigating from a non-modal Story route
      } else if (pathname.indexOf('/story') === 0 && !isModal) {
        modal = false;
      }

      // Are we dealing with a Bookmark?
      if (context.props.setData) {
        itemProps = context.props.setData[0];
      }

      // Are we dealing with a revision?
      const isRevision = itemProps.type === 'revision' || itemProps.type === 'archivedStory';

      // Opening as an Admin archived story
      if (itemProps.type === 'archivedStory') {
        href += `?arch=${itemProps.id}`;
      }

      // Quicklink/Quickfile Edit
      if (!isRevision && !href && context && (itemProps.isQuicklink || itemProps.isQuickfile)) {
        // Set Story referrerPath
        if (pathname.indexOf('/story') === -1) {
          this.props.setStoryReferrerPath(pathname + search);
        }
        this.props.history.push('/story/' + itemProps.permId, { modal: modal });

      // Quicklink/Quickfile View
      } else if (!isRevision && !itemProps.isProtected && (itemProps.isQuicklink || itemProps.isQuickfile)) {
        const file = itemProps.files ? itemProps.files[0] : null;

        // Quicklinks
        if (itemProps.isQuicklink) {
          this.handleOpenInNewWindow(href);
          this.props.setInteraction({ storyId: itemProps.id });

        // Quickfile (first file)
        } else if (itemProps.isQuickfile || file.category === 'web') {
          this.props.addFileToViewer(file.id);
          this.props.setInteraction({ fileId: file.id });
        }

      // App URL
      } else if (href && href.indexOf('/story') === 0) {
        // Navigating from a non-story route
        if (pathname.indexOf('/story') === -1) {
          this.props.setStoryReferrerPath(pathname + search);
        }
        this.props.history.push(href, { modal: modal });
      }
    }

    handleFileClick(event, context) {
      event.preventDefault();
      const id = parseInt(context.props.id, 10);
      const category = context.props.category;
      const source = context.props.source;
      const sourceUrl = source !== 'fileurl' ? context.props.sourceUrl : context.props.url;

      // Web URL, open in new window
      if ((category === 'web' && source === 'weburl') || source === 'fileurl') {
        if (!sourceUrl) {
          console.error('No sourceUrl defined');  // eslint-disable-line
        } else {
          this.handleOpenInNewWindow(sourceUrl);
          this.props.setInteraction({ fileId: id });
        }

        // All others files open in viewer
      } else {
        //this.props.addFileToViewer(id);
        // Are we currently on a modal route
        const isModal = this.props.location.state && this.props.location.state.modal;
        this.props.history.push('/file/' + id, { modal: isModal });
      }
    }

    handleFilesClick(event, files) {
      event.preventDefault();
      const fileIds = files.map(f => f.id);
      this.props.addFilesToViewer(fileIds);
    }

    render() {
      const childProps = {
        ...passedProps,

        // react-router-dom
        history: this.props.history,
        location: this.props.location,
        match: this.props.match,

        // Web App
        onAnchorClick: this.handleAnchorClick,
        onCallClick: this.handleCallClick,
        onFileClick: this.handleFileClick,
        onFilesClick: this.handleFilesClick,
        onStoryClick: this.handleStoryClick
      };
      return <WrappedComponent {...childProps} />;
    }
  };
}
