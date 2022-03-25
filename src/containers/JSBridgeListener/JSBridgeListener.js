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

import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';

import { connect } from 'react-redux';
import ApiClient from 'helpers/ApiClient';
import { bindActionCreatorsSafe } from 'helpers/safeDispatch';
import { readFileContent, validateEmailsInArray, validateStoryEventInArray, validateStoryFilesInArray } from '../../redux/modules/jsbridge/helpers/helpers';
import generateFiles from '../../redux/modules/jsbridge/helpers/createFileForJSBridge';

import {
  addInterestArea,
  closeFileViewer,
  cloudFilesProxy,
  createComment,
  createCommentReply,
  createStory,
  createFile,
  createShare,
  editStory,
  editUserProfile,
  followUser,
  getBookmarkList,
  getCluiCourseURL,
  getCRMDetail,
  getDraftList,
  getEntity,
  getEvents,
  getInterestAreas,
  getList,
  getLocation,
  getNewList,
  getRecommendedList,
  getSystemConfig,
  likeStory,
  openEntity,
  openInterestAreas,
  openMenu,
  openURL,
  proxyRequest,
  search,
  searchResult,
  sendEmail,
  subscribeStory,
  switchAccount,

  getStoryDescription,
  unsafeGetAccessToken,
  postMessage,
  bridgeError,

  searchFiles,
  searchStories,

  readFile,
  getFeaturedList
} from 'redux/modules/jsbridge/actions';

import {
  load as loadStory,
  close as closeStory,
  setData as setStoryData,
  addChannel as addStoryChannel,
  setDescriptionHeight as setStoryDescriptionHeight,
  setScrollTo as setStoryDescriptionScrollTo,
  addEvent as addStoryEvent,
  updateEvent as updateStoryEvent,
  addFile as addStoryFile
} from 'redux/modules/story/story';
import {
  parseMessage
} from 'redux/modules/story/helpers';

import {
  addFile,
  loadFile,
  removeFile,
  removeFiles,
  toggleDock
} from 'redux/modules/viewer';
import { setData as setShareModalData } from 'redux/modules/share';

const appVersion = require('../../../package.json').version;

function mapStateToProps(state) {
  const { jsbridge, settings, viewer } = state;
  const unsentResponses = [];

  // Map unsent responses
  Object.keys(jsbridge).forEach(app => {
    jsbridge[app].requests.forEach(id => {
      if (jsbridge[app].responsesById[id] && !jsbridge[app].responsesById[id].sent) {
        unsentResponses.push({
          response: jsbridge[app].responsesById[id],
          originalRequest: jsbridge[app].requestsById[id],
        });
      }
    });
  });

  return {
    ...jsbridge,
    unsentResponses,
    accessToken: state.auth.BTCTK_A,
    activeFileId: viewer.activeFileId,
    isDocked: viewer.isDocked,
    location: {
      lat: settings.geolocation.latitude || -180,
      long: settings.geolocation.longitude || -180,
      lastUpdatedTimestamp: settings.geolocation.updated || 0
    },
    storyDescription: {
      id: state.story.id,
      permId: state.story.permId,
      excerpt: state.story.excerpt,
      message: parseMessage(state.story.message),
      title: state.story.name,
    },
    systemConfig: {
      appName: 'Hub Web App',
      appVersion: appVersion,
      bridgeVersion: '3.0.2',
      mainThemeHexColor: settings.theme.baseColor,
      serverURL: window.BTC.BTCAPI,
      terminology: {
        nounSingular: {
          tab: settings.naming.tab,
          channel: settings.naming.channel,
          story: settings.naming.story
        },
        nounPlural: {
          tab: settings.naming.tabs,
          channel: settings.naming.channels,
          story: settings.naming.stories
        }
      },
      userId: settings.user.id,
      locale: settings.user.langCode
    },
    crmAccountId: settings.crm.crmAccountId,
    allFiles: state.entities.files,
    fileDefaults: state.settings.fileDefaults,
    defaultShareSubject: settings.sharing.defaultSubject,
    isSharingPublic: settings.storyDefaults.sharingPublic,
    userCapabilities: settings.userCapabilities
  };
}

@connect(mapStateToProps,
  bindActionCreatorsSafe({
    addInterestArea,
    closeFileViewer,
    cloudFilesProxy,
    createComment,
    createCommentReply,
    createStory,
    createFile,
    createShare,
    editStory,
    editUserProfile,
    followUser,
    getBookmarkList,
    getCluiCourseURL,
    getCRMDetail,
    getDraftList,
    getEntity,
    getEvents,
    getInterestAreas,
    getList,
    getLocation,
    getNewList,
    getRecommendedList,
    getSystemConfig,
    likeStory,
    openEntity,
    openInterestAreas,
    openMenu,
    openURL,
    proxyRequest,
    search,
    searchResult,
    sendEmail,
    subscribeStory,
    switchAccount,

    getStoryDescription,
    unsafeGetAccessToken,
    postMessage,
    bridgeError,

    loadStory,
    closeStory,
    setStoryData,
    addStoryChannel,
    addStoryEvent,
    addStoryFile,
    updateStoryEvent,
    setStoryDescriptionHeight,
    setStoryDescriptionScrollTo,
    addFile,
    loadFile,
    removeFiles,
    removeFile,
    toggleDock,

    searchFiles,
    searchStories,

    readFile,
    getFeaturedList,

    setShareModalData
  })
)
export default class JSBridgeListener extends PureComponent {
  static propTypes = {
    unsentResponses: PropTypes.array,
    postMessage: PropTypes.func,
    bridgeError: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // window sources for postMessage
    this.source = {};

    // Define valid actions
    this.validActions = [
      'unsafeGetAccessToken',

      'addInterestArea',
      'closeFileViewer',
      'cloudFilesProxy',
      'createComment',
      'createCommentReply',
      'createStory',
      'createFile',
      'createShare',
      'editStory',
      'editUserProfile',
      'followUser',
      'getBookmarkList',
      'getCluiCourseURL',
      'getCRMDetail',
      'getDraftList',
      'getEntity',
      'getEvents',
      'getInterestAreas',
      'getList',
      'getLocation',
      'getNewList',
      'getRecommendedList',
      'getSystemConfig',
      'likeStory',
      'openEntity',
      'openInterestAreas',
      'openMenu',
      'openURL',
      'proxyRequest',
      'removeInterestArea',
      'search',
      'searchResult',
      'sendEmail',
      'subscribeStory',
      'switchAccount',
      'unfollowUser',
      'unlikeStory',
      'unsubscribeStory',

      'getStoryDescription',
      'storyDescriptionHeight',
      'storyDescriptionScrollTo',

      'searchFiles',
      'searchStories',

      'readFile',
      'getFeaturedList'
    ];

    autobind(this);
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('message', this.handleMessage);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.unsentResponses.length) {
      nextProps.unsentResponses.forEach(r => {
        const handle = r.originalRequest.handle;
        if (handle && this.source[handle]) {
          this.handleMessageCallback(
            r.response,
            r.originalRequest,
            this.source[handle].source,
            this.source[handle].origin
          );
        }
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  // Returns an array of Blobs from an array of Blob URLs
  getBlobs(blobURLs) {
    return new Promise((resolve, reject) => {
      const filesPromise = [];
      blobURLs.forEach(url => {
        const fileName = url.split(',')[0].split(':')[1];
        const blobURL = url.split(',')[1];

        filesPromise.push(
          new Promise((resolveFile, rejectFile) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.open('GET', blobURL, true);
            xhr.onreadystatechange = (e) => {
              if (xhr.readyState === 4) {
                resolveFile({
                  fileName,
                  fileExt: e.target.response.type.split('/')[1],
                  blob: e.target.response
                });
              }
            };
            xhr.onerror = () => rejectFile(xhr.statusText);
            xhr.send();
          })
        );
      });
      Promise.all(filesPromise).then(files => {
        resolve(files);
      }).catch(function (err) {
        reject(err.message);
      });
    });
  }

  openInNewWindow(url) {
    // If we're missing a protocol, assume http
    let fixedUrl = url;
    if (fixedUrl.indexOf('://') === -1) {
      fixedUrl = 'http://' + url;
    }

    // https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
    const newWindow = window.open(fixedUrl);
    newWindow.opener = null;
  }

  handleMessage(event) {
    const data = event.data;

    // Parse btca.js source
    if (data.source === 'btc-js-bridge' && data.action && data.data && data.data.action) {
      // Check source and valid data is passed
      if (this.validActions.indexOf(data.data.action) > -1) {
        const { action, params } = data.data;

        // app window source
        if (!this.source[data.handle]) {
          this.source[data.handle] = {
            source: event.source,
            origin: event.origin
          };
        }

        switch (action) {
          // response from api
          case 'cloudFilesProxy':
            this.props.cloudFilesProxy(data);
            break;
          case 'createComment':
            this.props.createComment(data);
            break;
          case 'createCommentReply':
            this.props.createCommentReply(data);
            break;

          case 'createStory':
            if (params.visual) {
              if (params.storyId) delete params.storyId; // in case, client pass unexpected params
              this.handleCreateEditStoryVisual(data);
              break;
            }
            this.handleCreateEditStory(data);
            break;
          case 'editStory':
            if (params.visual) {
              this.handleCreateEditStoryVisual(data);
              break;
            }
            this.handleCreateEditStory(data);
            break;

          case 'createFile':
            this.props.createFile(data);
            break;
          case 'createShare': {
            const invalidEmailTo = validateEmailsInArray(params.to);
            const invalidEmailCc = validateEmailsInArray(params.cc);

            if (invalidEmailTo.length > 0 || invalidEmailCc.length > 0) {
              const errorMsg = invalidEmailTo.length ? `to: ${invalidEmailTo[0]}` : `cc: ${invalidEmailCc[0]}`;
              console.warn(`Invalid value for Parameter ${errorMsg}`)  // eslint-disable-line
              this.props.bridgeError(data, {
                code: 102,
                message: `Invalid value for Parameter ${errorMsg}`
              });
            } else if (params.visual || typeof params.visual === 'undefined') {
              this.handleOpenShareModal(data);
            } else {
              this.props.createShare(data);
            }
            break;
          }
          case 'getCluiCourseURL':
            this.props.getCluiCourseURL(data);
            break;
          case 'getDraftList':
            this.props.getDraftList(data);
            break;
          case 'getEntity':
            this.props.getEntity(data, this.props.activeFileId, this.props.systemConfig.userId);
            break;
          case 'getEvents':
            this.props.getEvents(data);
            break;
          case 'getInterestAreas':
            this.props.getInterestAreas(data);
            break;
          case 'getList':
            this.props.getList(data);
            break;
          case 'getBookmarkList':
            this.props.getBookmarkList(data);
            break;
          case 'getRecommendedList':
            this.props.getRecommendedList(data);
            break;
          case 'getNewList':
            this.props.getNewList(data);
            break;
          case 'searchResult':
            this.props.searchResult(data);
            break;
          case 'proxyRequest':
            this.props.proxyRequest(data);
            break;

          case 'addInterestArea':
          case 'removeInterestArea':
            this.props.addInterestArea(data, action);
            break;
          case 'likeStory':
          case 'unlikeStory':
            this.props.likeStory(data, action);
            break;
          case 'subscribeStory':
          case 'unsubscribeStory':
            this.props.subscribeStory(data, action);
            break;
          case 'followUser':
          case 'unfollowUser':
            this.props.followUser(data, action);
            break;

          // response from redux store or app action
          case 'unsafeGetAccessToken':
            this.handleUnsafeGetAccessToken(data);
            break;
          case 'closeFileViewer':
            this.handleCloseFileViewer(data);
            break;
          case 'editUserProfile':
            this.handleEditUserProfile(data);
            break;
          case 'openEntity':
            this.handleOpenEntity(data);
            break;
          case 'openInterestAreas':
            this.handleOpenInterestAreas(data);
            break;
          case 'openMenu':
            this.handleOpenMenu(data);
            break;
          case 'openURL':
            this.handleOpenURL(data);
            break;
          case 'getCRMDetail':
            this.handleGetCRMDetail(data);
            break;
          case 'getLocation':
            this.handleGetLocation(data);
            break;
          case 'getSystemConfig':
            this.handleGetSystemConfig(data);
            break;
          case 'search':
            this.handleSearch(data);
            break;
          case 'sendEmail':
            this.handleSendEmail(data);
            break;
          case 'searchFiles':
            this.props.searchFiles(data);
            break;
          case 'searchStories':
            this.props.searchStories(data);
            break;

          // unsupported actions
          case 'switchAccount':
            this.props.switchAccount(data);
            break;

          // story description template
          case 'getStoryDescription':
            this.handleGetStoryDescription(data);
            break;
          case 'storyDescriptionHeight':
            this.handleStoryDescriptionHeight(data);
            break;
          case 'storyDescriptionScrollTo':
            this.handleStoryDescriptionScrollTo(data);
            break;
          case 'readFile':
            this.handleReadFile(data);
            break;

          case 'getFeaturedList':
            this.props.getFeaturedList(data);
            break;

          default:
            console.info(action + ' not handled');  // eslint-disable-line
            break;
        }

        //  Invalid action passed
      } else {
        this.handleInvalidAction(data);
      }
    }
  }

  async handleOpenShareModal(data) {
    const context = data.data.params;
    try {
      let fileResponse;
      if (context.files && context.files.length > 0) {
        const client = new ApiClient();
        fileResponse = await client.get('/file/getHubShare', 'webapi', {
          params: {
            files: JSON.stringify([...context.files])
          }
        });
      }

      this.props.setShareModalData({
        id: 0,
        isVisible: true,
        name: '',
        showMoreOptions: true, // go to advance share when enabled
        url: '',
        toAddress: context.to && context.to.map(item => ({ id: item, name: item, status: 'valid' })) || [],
        ccAddress: context.cc && context.cc.map(item => ({ id: item, name: item, status: 'valid' })) || [],
        subject: context.subject || this.props.defaultShareSubject,
        message: context.message,
        files: fileResponse && fileResponse.body && fileResponse.body.length > 0 ? [...fileResponse.body] : [],
        sharingPublic: this.props.isSharingPublic,
        sharingFacebookDescription: '',
        sharingLinkedinDescription: '',
        sharingTwitterDescription: '',
      });

      this.props.createShare(data, {
        sent: true
      });
    } catch (response) {
      console.warn('Invalid request.', response.errors[0].message);  // eslint-disable-line

      this.props.createShare(data, {
        code: 103,
        message: response.errors[0].message
      });
    }
  }

  handleInvalidAction(data) {
    const { action } = data.data;
    console.warn('Invalid Request: ' + action)  // eslint-disable-line
    this.props.bridgeError(data, {
      code: 100,
      message: 'Invalid Request'
    });
  }

  handleUnsafeGetAccessToken(data) {
    const result = { accessToken: this.props.accessToken };
    this.props.unsafeGetAccessToken(data, result);
  }

  handleCloseFileViewer(data) {
    const params = data.data.params ? data.data.params : data.data.data;
    // Handle invalid req
    if (!params || !params.option) {
      this.props.closeFileViewer(data, false);
    }

    // close all files
    const option = params.option;
    if (option === 'all') {
      this.props.removeFiles();
      this.props.closeFileViewer(data, true);

      // close active file
    } else if (option === 'currentTab' && this.props.activeFileId > 0) {
      this.props.removeFile(this.props.activeFileId);
      this.props.closeFileViewer(data, true);

      // invalid request
    } else {
      this.props.closeFileViewer(data, false);
    }
  }

  handleEditUserProfile(data) {
    this.props.editUserProfile(data, true);
    this.props.toggleDock();
    this.context.router.history.push('/profile/edit');
  }

  handleJSBridgeEventsValidation(params, resp) {
    let error = null;
    const events = [];

    if (params.events && params.events.length > 0) {
      // check if there is any incorrect eventId
      const invalidEventId = [];
      for (const evt of params.events) {
        if (evt.id) {
          const index = resp.body.events.findIndex(e => e.id === evt.id);
          if (index === -1) invalidEventId.push(evt.id);
        }
      }

      if (invalidEventId.length > 0) {
        return [{ code: 102, message: `Event${invalidEventId.length === 1 ? '' : '(s)'} not found with id${invalidEventId.length === 1 ? '' : '(s)'}: ${invalidEventId.join(', ')}` }];
      }

      error = validateStoryEventInArray(params.events.map(evt => {
        let eventForValidation = evt;
        let eventForApiRequest = {
          id: evt.id,
          end: evt.endDate,
          start: evt.startDate,
          title: evt.name,
          tz: evt.timezone,
          allDay: evt.isAllDay
        };
          // map values for validation
        if (evt.id) {
          const index = resp.body.events.findIndex(e => e.id === evt.id);
          if (index !== -1) {
            // get event saved in server
            const savedEvent = resp.body.events[index];
            const isAllDay = evt.isAllDay === undefined ? savedEvent.allDay : evt.isAllDay;

            eventForApiRequest = {
              id: evt.id,
              end: evt.endDate || savedEvent.end,
              start: evt.startDate || savedEvent.start,
              title: evt.name || savedEvent.title,
              tz: evt.timezone || savedEvent.tz,
              allDay: isAllDay
            };
            // merge event data with JsBridge params
            eventForValidation = {
              endDate: evt.endDate || savedEvent.end,
              startDate: evt.startDate || savedEvent.start,
              name: evt.name || savedEvent.title,
              timezone: evt.timezone || savedEvent.tz
            };
          }
        }

        // build events Array which will be used as args of this.props.loadStory
        events.push(eventForApiRequest);
        return eventForValidation;
      }));
    }

    return [error, events];
  }

  handleEditStoryActionDispatch(data, files) {
    const client = new ApiClient();
    const { params } = data.data;

    if (!params.storyId || !params.title || !params.channelId) {
      this.props.bridgeError(data, {
        code: 101,
        message: 'Missing Parameter: `storyId` or `channelId` or `title`'
      });
      return;
    }

    client.get(`/story/get?id=${params.storyId}`, 'webapi').then(resp => {
      const [error, events] = this.handleJSBridgeEventsValidation(params, resp);
      if (error) {
        this.props.bridgeError(data, error);
      } else {
        if (params.events) {
          data.data.params.events = events; // eslint-disable-line
        }
        this.props.editStory(data, files, resp.body);
      }
    }).catch(err => {
      this.props.bridgeError(data, {
        code: 400,
        message: err.message || 'Fail to get story detail'
      });
    });
  }

  handleCreateStoryActionDispatch(data, files) {
    const error = validateStoryEventInArray(data.data.params.events);
    if (error) {
      this.props.bridgeError(data, error);
    } else {
      this.props.createStory(data, files);
    }
  }

  handleCreateEditStory(data) {
    const { fileDefaults } = this.props;
    const { params, action } = data.data;
    const client = new ApiClient();

    if (params.attachmentURLs && params.attachmentURLs.length) {
      this.getBlobs(params.attachmentURLs).then((blobs) => {
        const fileUploadPromise = [];

        blobs.forEach(fileObject => {
          const { fileName, fileExt } = { ...fileObject };
          // eslint-disable-next-line no-param-reassign
          fileObject.blob.filename = `${fileName}.${fileExt === 'plain' ? 'txt' : fileExt}`;
          // eslint-disable-next-line no-param-reassign
          fileObject.blob.description = `${fileName}.${fileExt === 'plain' ? 'txt' : fileExt}`;
          fileUploadPromise.push(
            client.post('/story/uploadFile', 'webapi', {
              params: {  // should be named data
                upload_type: 'file',
                uploadData: {
                  file: [fileObject.blob]
                }
              }
            })
          );
        });

        Promise.all(fileUploadPromise).then(response => {
          // Add fileDefaults to each item in response
          const files = response.map((file) => ({
            ...file.body[0],
            shareStatus: fileDefaults.shareStatus,
            hasWatermark: fileDefaults.hasWatermark || false,
            convertSettings: fileDefaults.convertSettings
          }));

          if (action === 'editStory') {
            this.handleEditStoryActionDispatch(data, files);
          } else {
            this.handleCreateStoryActionDispatch(data, files);
          }
        });
      });
    } else if (params.files && params.files.length) {
      this.handleCreateEditStoryWithFiles(data);
    } else if (action === 'editStory') {
      this.handleEditStoryActionDispatch(data);
    } else {
      this.handleCreateStoryActionDispatch(data);
    }
  }

  handleCreateEditStoryVisual(data) {
    const { params, action } = data.data;
    const { storyId } = params;

    const defaultCreateStoryData = {
      name: '',
      message: '',
      excerpt: '',
      expiresAt: 0,
      expiresAtTz: 'Australia/Sydney',
      notify: false,
      tags: [],
      events: []
    };

    const storyData = {
      name: params.title,
      message: params.description,
      excerpt: params.excerpt,
      expiresAt: params.expiryTimeStamp,
      expiresAtTz: params.expiryTimeStampTz,
      notify: params.notify,
      tags: params.tags
    };

    // clear undefined params to prevent from unexcepted overwritting default/saved values
    Object.keys(storyData).forEach(key => {
      if (storyData[key] === undefined) {
        delete storyData[key];
      }
    });

    // Create Story
    if (action === 'createStory') {
      if (params.events && params.events.length > 0) {
        const error = validateStoryEventInArray(params.events);
        if (error) {
          this.props.bridgeError(data, error);
          return;
        }
      }

      // Close existing Story
      this.props.closeStory({ ...defaultCreateStoryData, ...storyData });

      // Load and add Channel
      if (params.channelId) {
        this.props.addStoryChannel({ id: params.channelId });
      }

      if (params.events && params.events.length > 0) {
        params.events.forEach(evt => {
          this.props.addStoryEvent({
            end: evt.endDate,
            start: evt.startDate,
            title: evt.name,
            tz: evt.timezone,
            allDay: evt.isAllDay
          });
        });
      }

      if (params.files && params.files.length) {
        this.handleCreateEditStoryWithFiles(data);
      } else {
        this.context.router.history.push('/story/new');
        this.props.toggleDock();
      }
    }

    // Edit Story
    if (action === 'editStory') {
      // fetch story detail from server, then use permId to redirect & load story
      const client = new ApiClient();
      client.get(`/story/get?id=${storyId}`, 'webapi').then(resp => {
        const { permId } = resp.body;
        const [error, events] = this.handleJSBridgeEventsValidation(params, resp);
        if (error) {
          this.props.bridgeError(data, error);
        } else if (params.files && params.files.length >= 0) {
          this.handleCreateEditStoryWithFiles(
            data,
            {
              permId,
              payload: { ...resp.body, ...storyData, hasUnsavedChanges: true },
              events: params.events && events
            }
          );
        } else {
          this.props.loadStory(
            permId,
            { ...resp.body,
              ...storyData,
              hasUnsavedChanges: true
            },
            params.events && events
          );
          this.context.router.history.push(`/story/${permId}/edit`);
          this.props.toggleDock();
        }
      });
    }
  }

  handleGetCRMDetail(data) {
    const result = {
      accountId: this.props.crmAccountId
    };
    this.props.getCRMDetail(data, result);
  }

  handleGetLocation(data) {
    const result = this.props.location;
    this.props.getLocation(data, result);
  }

  handleGetSystemConfig(data) {
    const result = this.props.systemConfig;
    this.props.getSystemConfig(data, result);
  }

  handleOpenEntity(data) {
    const { entityName, id } = data.data.params;

    switch (entityName) {
      case 'tab':
        this.props.openEntity(data, true);
        this.props.toggleDock();
        this.context.router.history.push({
          pathname: '/content/tab/' + id,
          state: { jsbridgeRequest: true }
        });

        break;
      case 'channel':
        // we first need to fetch the channel data
        this.props.openEntity(data, true);
        break;
      case 'story': {
        // we first need to fetch the story data. if the story has quicklink configure we need to made correct action based on those quick link info
        this.props.openEntity(data, true);
        break;
      }
      case 'file':
        this.props.openEntity(data, true);
        this.openFile(id);
        break;
      case 'fileCollection':
        this.props.openEntity(data, false);
        console.warn('openEntity `fileCollection` is currently unsupported in Web App');  // eslint-disable-line
        break;
      case 'user':
        this.props.openEntity(data, true);
        this.props.toggleDock();
        this.context.router.history.push('/people/' + id);
        break;
      default:
        break;
    }
  }

  handleOpenInterestAreas(data) {
    this.props.openInterestAreas(data, true);
    this.context.router.history.push('/settings/interest-areas');
    this.props.toggleDock();
  }

  handleOpenMenu(data) {
    const { menuType } = data.data.params;
    const openMenuTypes = [
      'chat',
      'company',
      'content',
      'me',
      'meetings',
      'notes',
      'notifications',
      'search',
      'blocksearch',
      'calendar'
    ];

    if (openMenuTypes.indexOf(menuType) !== -1) {
      let path = '/';
      switch (menuType) {
        case 'company':
          break;
        case 'meetings':
        case 'notifications':
          path += 'activity';
          break;
        case 'calendar':
          path += 'calendar';
          break;
        default:
          path += menuType;
          break;
      }

      this.props.openMenu(data, true);
      this.context.router.history.push(path);
      this.props.toggleDock();
    } else {
      this.props.openMenu(data, false);
    }
  }

  handleOpenURL(data) {
    const { url, target, rel } = data.data.params;

    // app link
    if (url && rel === 'app') {
      this.props.openURL(data, true);
      this.context.router.history.push(url);

      // external link
    } else if (url && (!rel || rel !== 'app') || target) {
      this.props.openURL(data, true);
      this.openInNewWindow(url);

      // invalid request
    } else {
      this.props.openURL(data, false);
    }
  }

  handleSearch(data) {
    const { keywords } = data.data.params;
    const { hasPageSearch, hasBlockSearch } = this.props.userCapabilities;
    if (keywords) {
      this.props.toggleDock();
      if (hasPageSearch) {
        this.context.router.history.push({
          pathname: '/pagesearch',
          query: {
            keyword: keywords
          },
          state: {
            jsbridgeRequest: true
          }
        });
      } else if (hasBlockSearch) {
        this.context.router.history.push(`/blocksearch?keyword=${keywords}`);
      } else {
        this.context.router.history.push(`/search?keyword=${keywords}&type=stories`);
      }
    }
  }

  handleSendEmail(data) {
    const { to, cc, bcc, subject, body } = data.data.params;

    // Valid request
    if (to || body || subject) {
      this.props.sendEmail(data, true);
      let tmp = subject ? `?subject=${subject}` : '';
      if (body) tmp = tmp ? `${tmp}&body=${body}` : `?body=${body}`;
      if (cc) tmp = tmp ? `${tmp}&cc=${cc}` : `?cc=${cc}`;
      if (bcc) tmp = tmp ? `${tmp}&bcc=${bcc}` : `?bcc=${bcc}`;

      const url = `mailto:${to}${tmp}`;
      const newWindow = window.open(url, '_self');
      newWindow.opener = null;

      // Invalid request
    } else {
      this.props.sendEmail(data, false);
    }
  }

  handleGetStoryDescription(data) {
    this.props.getStoryDescription(data, this.props.storyDescription);
  }

  handleStoryDescriptionHeight(data) {
    const { params } = data.data;

    if (params.height) {
      this.props.setStoryDescriptionHeight(params.height);
    }
  }

  handleStoryDescriptionScrollTo(data) {
    const { params } = data.data;

    this.props.setStoryDescriptionScrollTo(params.offsetTop);
  }

  handleStoryOpen(storyDetails, originalRequest) {
    const { disableLegacyRouting } = originalRequest.data.params;

    if (storyDetails.quickLink) {
      // open quickLink
      this.openInNewWindow(storyDetails.quickLink);
    } else if (storyDetails.quickFileId > 0) {
      // open quick file
      this.openFile(storyDetails.quickFileId);
    } else {
      // regular story open
      if (!this.props.isDocked) this.props.toggleDock();
      let isModal = false;
      if (disableLegacyRouting &&
        (typeof disableLegacyRouting === 'string' && disableLegacyRouting.toLowerCase() === 'true' ||
          typeof disableLegacyRouting === 'boolean')
      ) {
        isModal = true;
      }
      this.context.router.history.push('/story/' + storyDetails.id, { modal: isModal });
    }
  }

  handleMessageCallback(response, originalRequest, source, origin) {
    const { action, params } = originalRequest.data;
    const entityName = params ? params.entityName : '';
    let data = {
      result: response.result,
      error: response.error,
      originalRequest: originalRequest
    };

    // if action is openEntity for story then need to handle
    if (action === 'openEntity' && entityName === 'story') {
      if (response.result) {
        this.handleStoryOpen(response.result, originalRequest);
      }
      data = { ...data, result: !response.error };
    } else if (action === 'openEntity' && entityName === 'channel') {
      if (response.result && response.result.tabs.length > 0) {
        this.props.toggleDock();
        // One channel may belong to multiple tabs so setting first tab id as the desired tab
        this.context.router.history.push({
          pathname: `/content/tab/${response.result.tabs[0].id}/channel/${response.result.id}`,
          state: { jsbridgeRequest: true }
        });
        data = { ...data, result: !response.error };
      } else {
        data = {
          ...data,
          error: {
            code: 102,
            message: 'Channel not found'
          }
        };
      }
      // Parse error msg and error code for createShare
    } else if (action === 'createShare') {
      if (response.error && response.error.errors && response.error.errors.length) {
        const serverErrorCode = response.error.errors[0].code;
        const serverErrorMsg = response.error.errors[0].message;
        let errorCode = serverErrorCode;
        console.warn(serverErrorMsg)  // eslint-disable-line

        switch (serverErrorCode) {
          case 422:
            errorCode = 103;
            break;
          default:
            break;
        }

        data = {
          ...data,
          error: {
            code: errorCode,
            message: serverErrorMsg
          }
        };

        // Parse API response if it is sent
      } else if (data.result && data.result.sent) {
        data = {
          ...data,
          result: { sent: true }
        };
      }
    }
    // postMessage handled in reducer
    this.props.postMessage(data, source, origin);
  }

  openFile(fileId) {
    // File has not been loaded previously
    if (!this.props.allFiles[fileId]) {
      this.props.loadFile(parseInt(fileId, 10));
    } else {
      this.props.addFile(parseInt(fileId, 10));
    }
  }

  async handleReadFile(data) {
    const { params } = data.data;
    if (!params.fileId) {
      this.props.bridgeError(data, {
        code: 101,
        message: 'Missing Parameter'
      });
    } else if (typeof params.fileId !== 'number') {
      this.props.bridgeError(data, {
        code: 102,
        message: 'Invalid Parameter'
      });
    } else {
      try {
        const client = new ApiClient();
        const fileResponse = await client.get('/file/get', 'webapi', {
          params: {
            id: params.fileId
          }
        });

        const validFileTypes = [
          'csv',
          'txt',
          'none' // Refers to json file
        ];

        // Invalid file type
        if (validFileTypes.indexOf(fileResponse.body.category) === -1) {
          console.warn(`Invalid filetype: ${fileResponse.body.category}`)  // eslint-disable-line
          this.props.bridgeError(data, {
            code: 102,
            message: `Invalid filetype: ${fileResponse.body.category}`
          });
        } else {
          const fileContent = await readFileContent(fileResponse.body.url);
          this.props.readFile(data, fileContent);
        }
      } catch (error) {
        this.props.bridgeError(data, {
          code: 103,
          message: error
        });
      }
    }
  }

  async handleCreateEditStoryWithFiles(data, loadStoryPayload) {
    // validate the `files` value & merge JSB params with API response data
    const { params, action } = data.data;
    const { files: paramFiles, storyId, channelId, visual } = params;

    // validation
    // file id should not be presented in createStory action
    if (action === 'createStory' && paramFiles.findIndex(f => f.id) !== -1) {
      this.props.bridgeError(data, { code: 102, message: 'Invalid Parameter: file id should not be presented when create a new story' });
      return;
    }

    const resultOfValidatingFile = validateStoryFilesInArray(paramFiles);
    if (resultOfValidatingFile) {
      this.props.bridgeError(data, resultOfValidatingFile);
      return;
    }

    let files = [];

    try {
      files = await generateFiles(paramFiles, storyId, this.props.fileDefaults, loadStoryPayload && loadStoryPayload.payload);
    } catch (error) {
      this.props.bridgeError(data, error);
      return;
    }


    // eslint-disable-next-line no-param-reassign
    data.data.params.files = files;

    if (visual) {
      if (action === 'createStory') {
        // Load and add Channel
        if (channelId) {
          this.props.addStoryChannel({ id: channelId });
        }

        files.forEach(f => {
          this.props.addStoryFile(f, '', null);
        });

        this.context.router.history.push('/story/new');
        this.props.toggleDock();
      }

      if (action === 'editStory') {
        this.props.loadStory(loadStoryPayload.permId, loadStoryPayload.payload, loadStoryPayload.events, files);
        this.context.router.history.push(`/story/${loadStoryPayload.permId}/edit`);
        this.props.toggleDock();
      }
    } else if (action === 'editStory') {
      this.handleEditStoryActionDispatch(data);
    } else {
      this.props.createStory(data);
    }
  }

  render() {
    return null;
  }
}
