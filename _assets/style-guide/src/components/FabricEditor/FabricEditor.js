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

/* eslint-disable react/no-find-dom-node */
/* eslint-disable no-confusing-arrow */

import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Editor from 'components/Editor/Editor';
import FabricCanvas from 'components/FabricEditor/FabricCanvas';
import { FabricContextProvider } from './FabricContext';

import {
  getFroalaOptions,
  handleAddCanvasClickListener,
  handleAudioEnd,
} from './FabricActions';

import { insertDrawing, insertAfterSpace, addAuthPaths } from './fabricEditorUtil';
import audioPlay from './audioPlay.svg';
import audioPause from './audioPause.svg';

/**
 * Component description
 * http://fabricjs.com/freedrawing
 * bigtincan-hub-ios/ThirdParty/froalaEditor/js/editor.js
 * support Audio and image input
 * generate html and replace list to replace the strings to that ios can read
 */
export default class FabricEditor extends PureComponent {
  static propTypes = {
    /** switch between editor and fabric */
    isEditor: PropTypes.bool,
    /** parent component can set the state to finish the fabric drawing and get the fabric data */
    isAttachFabric: PropTypes.bool,
    /** line color when drawing fabric object */
    lineColor: PropTypes.string,
    /** line width when drawing fabric object */
    lineWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    /** redo and undo */
    history: PropTypes.number,
    /** default html string */
    defaultValue: PropTypes.string,
    /** use the id to replace the image src value */
    defaultAttachments: PropTypes.array,
    /** only accept number, e.g. 900, don't put anything else*/
    fabricCanvasHeight: PropTypes.number,
    /** new fabric, audio or image object { id: string, value: string, type: string, mobileHtml: string, webHtml: string  }
     * id: PropTypes.string.isRequired,
     * value: PropTypes.string,
     * prevId: PropTypes.string,
     * type: PropTypes.oneOf(['media', 'image', 'fabric']),
     * mobileHtml: PropTypes.string,
     * webHtml: PropTypes.string,
     * */
    newSource: PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
      prevId: PropTypes.string,
      type: PropTypes.oneOf(['media', 'image', 'fabric']),
      mobileHtml: PropTypes.string,
      webHtml: PropTypes.string,
    }),
    /** new Froala method object { name: string, value: string }
     * name is Froala's method name
     * value is the Froala's method value
     * */
    newFroalaMethod: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }),
    /** call back method when the editor update the content, return html string */
    onFabricCanvasUpdate: PropTypes.func,
    /** call back method when click the existing fabric canvas inside the editor */
    onCanvasClick: PropTypes.func,
    /** call back method editor update
     * return html, source data
     * */
    onEditorChange: PropTypes.func,
    /** call back method when remove fabric canvas
     * */
    onFabricCanvasRemoved: PropTypes.func,
    /** update froala Editor option,
     * E.g.: { language: 'es' }
     * */
    froalaOptions: PropTypes.object,

    strings: PropTypes.object,

    leftTopElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.bool,
    ]),
    rightTopElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.bool,
    ]),
    storyElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.bool,
    ]),
    titleElement: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.bool,
    ]),

    textAreaOnly: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    isEditor: true,
    isAttachFabric: false,
    lineColor: '#3ac119',
    lineWidth: 4,
    defaultValue: '',
    defaultAttachments: [],
    newFroalaMethod: {},
    strings: {
      content: 'Content',
    }
  };

  static contextTypes = {
    settings: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      currentFabric: {
        id: '',
        value: '',
      },
      isFabricClick: false,
      playingAudioId: '',
    };
    //{ id, value, type, mobile, web }
    this.source = [];
    // audio object to play audio
    this.audio = new Audio();
    // to check the width and height of the editor
    this.node = {};

    // refs
    this.fabricEditor = null;

    //editor
    this.froalaEditor = null;

    this.editorRef = React.createRef();

    this.froalaOptions = getFroalaOptions(null, {
      handleImageRemove: () => this.handleImageRemove.bind(this),
      handleInsertedImage: () => this.handleInsertedImage.bind(this),
      handleEnterKeyPress: () => this.handleEnterKeyPress.bind(this),
      handleEditorChange: () => this.handleEditorChange.bind(this),
      handleReloadResource: () => this.handleReloadResource.bind(this),
      mouseupCallback: () => { if (this.froalaEditor) this.froalaEditor.selection.save(); },
      initializedCallback: (e, editor) => {
        this.froalaEditor = this.editorRef.current ? this.editorRef.current.getEditor() : editor;
      },
    });

    autobind(this);
  }

  /* insert default html
   * add one audio stop svg to the replacePath
   * loop the default replace list and update the fabric, image and audio
   */
  componentDidMount() {
    this.audio.onended = () => handleAudioEnd(this.state.playingAudioId);
    const { defaultAttachments, isEditor } = this.props;
    /* always only one stop image need to be replaced */
    this.source = [{ id: 'for-play-audio', mobileHtml: 'img/media-element.svg', webHtml: audioPause }];

    if (this.editorRef) {
      if (!this.froalaEditor) this.froalaEditor = this.editorRef.current.getEditor();
      if (this.froalaEditor) this.froalaEditor.events.focus();
    }

    if (defaultAttachments) {
      defaultAttachments.forEach(this.handleLoadingResource);

      setTimeout(() => {
        defaultAttachments.forEach(this.handleLoadingResource);
      }, 500);
      const { onEditorChange } = this.props;
      if (this.froalaEditor && onEditorChange && typeof onEditorChange === 'function') {
        onEditorChange(this.froalaEditor.html.get(true), this.source);
      }
    }

    if (isEditor) {
      this.node = ReactDOM.findDOMNode(this.fabricEditor);
    }
  }

  /* if receive new fabric need to be created
   * if new fabric is finish drawing
   * if receive new image
   * if receive new audio
   * if receive new Froala method
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { newSource, isEditor, isAttachFabric, newFroalaMethod } = nextProps;
    const isImage = newSource && newSource.type === 'image' && _get(this.props.newSource, 'id', -1) !== newSource.id && newSource.value;
    const isAudio = newSource && newSource.type === 'media' && _get(this.props.newSource, 'id', -1) !== newSource.id && newSource.value;
    if (!this.froalaEditor) this.froalaEditor = this.editorRef.current.getEditor();
    /*update fabric canvas, trigger when finish drawing*/
    if (!this.props.isEditor && isEditor && isAttachFabric === true && this.props.onFabricCanvasUpdate) {
      //update source with new fabric value
      this.props.onFabricCanvasUpdate(this.state.currentFabric.value, this.state.currentFabric.id);
    } else if (isImage || isAudio) {
      const authString = _get(this.context.settings, 'authString', '');

      this.source = [...this.source, {
        id: newSource.id,
        value: newSource.value,
        type: newSource.type,
        mobileHtml: newSource.mobileHtml || 'img/media-element.svg',
        webHtml: newSource.webHtml || audioPlay
      }];

      this.froalaEditor.image.insert(isImage ? addAuthPaths(newSource.value, authString) : audioPlay, true, {
        'data-type': newSource.type,
        'data-id': newSource.id,
        type: newSource.type,
        id: newSource.id
      });

      // Fix for insert img resiting canvas callback
      setTimeout(() => {
        this.handleReloadResource();
      }, 500);
    } else if (newFroalaMethod && this.props.newFroalaMethod.id !== newFroalaMethod.id) {
      /*update froala method*/
      this.froalaEditor[newFroalaMethod.name](newFroalaMethod.value);
    } else if ((_isEmpty(this.props.newSource) && !_isEmpty(newSource)) ||
      (!_isEmpty(this.props.newSource) && !_isEmpty(newSource) && this.props.newSource.id !== newSource.id)) {
      if (newSource.prevId && document.getElementById(newSource.prevId)) {
        document.getElementById(newSource.prevId).removeEventListener('click', this.handleCanvasClickEventListener);
        document.getElementById(newSource.prevId).id = newSource.id;
        this.source = this.source.map((data) => data.id === newSource.prevId ? Object.assign({}, data, {
          id: newSource.id,
          value: newSource.value
        }) : data);
      } else {
        this.source = [...this.source, {
          id: newSource.id,
          value: newSource.value,
          type: 'fabric'
        }];
      }
      insertDrawing(this.froalaEditor, newSource.id, newSource.value, !newSource.prevId);
      handleAddCanvasClickListener(newSource.id, this.handleCanvasClickEventListener);
      this.handleReloadResource();
      const { onEditorChange } = this.props;
      if (onEditorChange && typeof onEditorChange === 'function') {
        onEditorChange(this.froalaEditor.html.get(true), this.source);
      }
    } else if (this.props.isEditor && !isEditor && _isEmpty(newSource) && !this.state.isFabricClick) {
      this.setState({ currentFabric: {
        id: '',
        value: ''
      } });
    } else if (this.props.isEditor && !isEditor && this.state.isFabricClick) {
      this.setState({ isFabricClick: false });
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isEditor && this.props.isEditor) {
      this.handleReloadResource();
    }
  }

  /* clean value */
  componentWillUnmount() {
    this.node = null;
    this.audio = null;
    this.source = null;
  }

  handleOnEditorInit(e, editor) {
    if (!this.froalaEditor) this.froalaEditor = editor || this.editorRef.current.getEditor();
  }

  handleLoadingResource(data) {
    const element = document.getElementById(data.id);
    if (element && this.props.defaultValue.indexOf(data.id) > -1) {
      const isImage = element.getAttribute('data-type') === 'image' && element.tagName.toLowerCase() === 'img';
      const isAudio = element.getAttribute('data-type') === 'media' && element.tagName.toLowerCase() === 'img';

      if (isImage || isAudio) {
        /* handle image display */
        this.source = [...this.source, {
          id: data.id,
          value: data.value,
          type: element.getAttribute('data-type'),
          mobileHtml: isImage ? element.getAttribute('src') : 'img/media-element.svg',
          webHtml: isImage ? data.value : audioPlay
        }];
        element.src = isImage ? addAuthPaths(data.value, _get(this.context.settings, 'authString', '')) : audioPlay;
        if (isAudio) {
          element.addEventListener('click', this.handleImageResizeFalse);
        }
      } else if (element.tagName === 'CANVAS') {
        /* handle fabric canvas display */
        this.source = [...this.source, {
          id: data.id,
          value: data.value,
          type: 'fabric'
        }];

        if (!this.froalaEditor) this.froalaEditor = this.editorRef.current.getEditor();
        insertDrawing(this.froalaEditor, data.id, data.value, false);
        handleAddCanvasClickListener(data.id, this.handleCanvasClickEventListener);
      }
    }
  }

  handleReloadResource() {
    if (this.source) {
      this.source.forEach((data) => {
        const element = document.getElementById(data.id);
        // const isImage = element && data.type === 'image';
        const isAudio = element && data.type === 'media';
        const isFabric = element && data.type === 'fabric';

        if (isAudio) {
          element.addEventListener('click', this.handleImageResizeFalse);
        }

        if (isFabric) {
          if (!this.froalaEditor) this.froalaEditor = this.editorRef.current.getEditor();
          insertDrawing(this.froalaEditor, data.id, data.value, false);
          handleAddCanvasClickListener(data.id, this.handleCanvasClickEventListener);
        }
      });
    }
  }

  handleEnterKeyPress(keydownEvent) {
    if (keydownEvent.keyCode === 13) {
      this.handleReloadResource();
    }
    setTimeout(() => {
      this.handleEditorChange();
    }, 300);
  }

  handleInsertedImage($img) {
    $img.addClass('fr-dii');
    $img.css('width', 'auto');
    $img.attr('id', $img.data('id'));
    const element = $img.get(0);
    if ($img.data('type') !== 'image') {
      element.addEventListener('click', this.handleImageResizeFalse);
    }
    this.handleEditorChange();
    this.removeUnusedResource();
  }

  /* click the item and set the data for the fabric editor */
  handleCanvasClickEventListener(e) {
    const data = this.source.filter((item) => item.id === e.currentTarget.id)[0];
    const currentFabric = Object.assign({}, this.state.currentFabric, {
      id: data.id,
      value: data.value
    });
    this.setState({ currentFabric, isFabricClick: true });

    const { onCanvasClick } = this.props;
    if (onCanvasClick && typeof onCanvasClick === 'function') {
      onCanvasClick(data.id);
    }
  }

  /* when click the canvas, the editor would go back to fabric drawing editor */
  handleFabricCanvasUpdate(canvasJson) {
    const currentFabric = Object.assign({}, this.state.currentFabric, { value: canvasJson });
    this.setState({ currentFabric });
  }

  /* when editor changes update all the click event
   * if not all the click would loose
   * FIXME may not be a good idea to do this
   * */
  handleEditorChange() {
    const { onEditorChange } = this.props;
    if (!this.froalaEditor) this.froalaEditor = this.editorRef.current.getEditor();
    const webHtml = this.froalaEditor.html.get(true);
    if (onEditorChange && typeof onEditorChange === 'function') {
      onEditorChange(webHtml, this.source);
    }
    this.handleReloadResource();
  }

  // remove image
  handleImageRemove(e, editor, img) {
    const removeId = img[0].id;
    this.source = this.source.filter((path) => path.id !== removeId);
    this.handleEditorChange();
  }

  /* hide the Froala resize square
   * since only audio need to do this, also add the audio play stop method
   * */
  handleImageResizeFalse(e) {
    const audioId = e.target.id;
    const data = this.source.find((item) => item.id === audioId);
    const element = document.getElementById(audioId);
    const { playingAudioId } = this.state;
    const authString = _get(this.context.settings, 'authString', '');
    /*
     * if click the same icon when the audio is still playing, audio stop (pause and go back to 0)
     * if click different audio, audio stop and play the new audio.
     */
    if (!this.audio.ended && audioId === playingAudioId && !this.audio.paused) {
      this.audio.pause();
      element.src = audioPlay;
    } else if (!this.audio.ended && audioId === playingAudioId) {
      this.audio.play();
      element.src = audioPause;
    } else if (this.audio.ended && audioId === playingAudioId) {
      this.audio.play();
      element.src = audioPause;
    } else if (audioId !== playingAudioId) {
      this.audio.load();
      this.audio = new Audio(addAuthPaths(data.value, authString));
      this.audio.onended = () => handleAudioEnd(this.state.playingAudioId);
      this.audio.play();
      this.setState({ playingAudioId: audioId });
      element.src = audioPause;
      if (playingAudioId) {
        const prevElement = document.getElementById(playingAudioId);
        prevElement.src = audioPlay || '';
      }
    }
  }

  removeUnusedResource() {
    const { onFabricCanvasRemoved } = this.props;
    if (!this.froalaEditor) this.froalaEditor = this.editorRef.current.getEditor();
    const webHtml = this.froalaEditor.html.get(true);
    const removeFabricList = this.source.filter((path) => webHtml.indexOf(path.id) < 0 && path.type === 'fabric');
    if (removeFabricList.length > 0 && onFabricCanvasRemoved && typeof onFabricCanvasRemoved === 'function') {
      onFabricCanvasRemoved(removeFabricList);
    }

    this.source = this.source.filter((path) => webHtml.indexOf(path.id) > -1);
    this.source.forEach((data) => {
      if (data.type === 'fabric') {
        const element = document.getElementById(data.id);
        if (element) {
          insertAfterSpace(element);
        }
      }
    });
  }

  render() {
    const {
      lineWidth,
      lineColor,
      isEditor,
      className,
      defaultValue,
      history,
      froalaOptions,
      fabricCanvasHeight,
      strings,
      leftTopElement,
      rightTopElement,
      titleElement,
      textAreaOnly,
      storyElement
    } = this.props;
    const styles = require('./FabricEditor.less');
    const cx = classNames.bind(styles);
    const editorClasses = cx({
      editor: isEditor,
      textAreaOnly: textAreaOnly,
      hidden: !isEditor,
    });
    const currentSource = this.source.filter((item) => item.id === this.state.currentFabric.id);
    const fOptions = {
      ...this.froalaOptions,
      ...froalaOptions,
      editorClass: styles.editBox,
    };

    return (
      <div className={className} ref={(c) => { this.fabricEditor = c; }}>
        {!textAreaOnly && <div className={styles.leftRight}>
          <div className={styles.left}>{leftTopElement}</div>
          <div className={styles.right}>{rightTopElement}</div>
        </div>}
        {!textAreaOnly && <div className={styles.title}>{titleElement}</div>}
        {!textAreaOnly && <div className={styles.story}>{storyElement}</div>}
        <div className={editorClasses}>
          <Editor
            ref={this.editorRef}
            onInit={this.handleOnEditorInit}
            defaultValue={defaultValue}
            placeholder={strings.content}
            froalaOptions={{
              ...fOptions,
            }}
          />
        </div>
        <FabricContextProvider>
          {!isEditor && <FabricCanvas
            lineWidth={lineWidth}
            lineColor={lineColor}
            history={history}
            onFabricCanvasUpdate={this.handleFabricCanvasUpdate}
            defaultValue={currentSource[0] && currentSource[0].value}
            width={this.node.clientWidth}
            height={fabricCanvasHeight || this.node.clientHeight}
          />}
        </FabricContextProvider>
      </div>);
  }
}
