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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

import RecordAudio from 'components/RecordAudio/RecordAudio';
import FabricEditor from 'components/FabricEditor/FabricEditor';
import { replaceHtmlPaths, uniqueId } from 'components/FabricEditor/fabricEditorUtil';
import FroalaHeader from 'components/FabricEditor/Header/FroalaHeader';
import FabricHeader from 'components/FabricEditor/Header/FabricHeader';
import NoteDeleteHeader from 'components/FabricEditor/Header/NoteDeleteHeader';
import DropMenu from 'components/DropMenu/DropMenu';
import Btn from 'components/Btn/Btn';
import RecordAudioDropMenu from 'components/RecordAudio/DropMenu';

const FabricEditorDocs = require('!!react-docgen-loader!components/FabricEditor/FabricEditor.js');
const defaultHtml = require('../../static/fabricEditor.txt');
const fabricListArray = require('../../static/fabricEditor.json');

export default class FabricEditorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditor: true,
      lineColor: '#222222',
      lineWidth: '10',
      newSource: {},
      newFroalaMethod: {},
      iosHtmlValue: '',
      history: 0,
      mobileHtml: '',
      lastClick: '',
      audioActive: false,
    };

    this.rightBtns = ['annotate', 'microphone', 'image'];
    //ref
    this.fabricEditor = null;
    this.fileUpload = null;

    autobind(this);
  }

  handleEditorChange(html, source) {
    console.info(html, source);
  }

  handleCanvasClick() {
    this.setState({
      isEditor: false,
      isAttachFabric: false,
      audioActive: false,
    });
  }

  handleClick(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    if (href.indexOf('#') > -1) {
      this.setState({ lineColor: href });
    } else {
      this.setState({ lineWidth: href });
    }
  }

  handleImageUploadChange(e) {
    if (e.target.files[0]) {
      const reader = new FileReader();
      const name = e.target.files[0].name;
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        const newSource = {
          id: uniqueId(),
          value: reader.result,
          type: 'image',
          mobileHtml: name,
          webHtml: reader.result,
        };
        this.setState({ newSource });
        this.fileUpload.value = '';
      };
    }
    //re-upload the file
    // this.fileUpload.value = '';
    // fileUploadDom.value = '';
  }

  handleCenterItemClick(e, method, value) {
    const editor = this.fabricEditor.froalaEditor;
    // console.log(this.refs.fabricEditor);
    if (method === 'commands.link') {
      const regexTags = /(<([^>]+)>)/ig;
      const text = editor.html.getSelected().replace(regexTags, '') || ' ';

      if (!editor.link.get()) {
        editor.link.insert('https', text, { 'target': '_blank' });
      }
    } else {
      const methods = method.split('.');
      if(methods.length === 2) {
        editor[methods[0]][methods[1]](value);
      } else if (methods.length === 1) {
        editor[methods[0]](value);
      }
    }
  }

  handleRightItemClick(e) {
    e.preventDefault();
    const type = e.currentTarget.dataset.type;
    if (type === 'annotate') {
      if (this.state.isEditor) {
        this.setState({
          newSource: {},
          lineColor: '#222222',
          lineWidth: '10',
          isEditor: false,
          audioActive: false,
        });
      }
    } else if (type === 'microphone') {
      this.setState({ newSource: {
        id: uniqueId(),
        value: fabricListArray[3].value,
        type: 'media',
      } });
    } else if (type === 'image') {
      this.fileUpload.click();
    }
  }

  handleFabricClick(e) {
    e.preventDefault();
    const type = e.currentTarget.dataset.type;

    if (type === 'undo') {
      this.setState({ history: this.state.history - 1 });
    } else if (type === 'redo') {
      this.setState({ history: this.state.history + 1 });
    } else if (type === 'cancel' || type === 'attach') {
      this.setState({
        isEditor: !this.state.isEditor,
        isAttachFabric: type === 'attach',
        history: 0
      });
    } else if (type === 'penSize' || type === 'penColor') {
      const href = e.currentTarget.getAttribute('href');
      if (href.indexOf('#') > -1) {
        this.setState({ lineColor: href });
      } else {
        this.setState({ lineWidth: href });
      }
    }
  }

  handleFabricCanvasUpdate(value, prevId) {
    this.setState({
      newSource: {
        id: uniqueId(),
        type: 'fabric',
        value,
        prevId,
      }
    });
  }

  handleCloseClick() {
    this.setState({
      lastClick: 'Close Click'
    });
  }

  //audio
  handleAudioDropMenuClick() {
    this.setState({ audioActive: true });
  }

  handleAttachClick(event, audio) {
    this.setState({
      audioActive: false,
      newSource: {
        id: uniqueId(),
        value: audio && (window.URL || window.webkitURL).createObjectURL(audio),
        type: 'media'
      },
    });
  }

  handleWindowClickClose() {
    console.log('handleWindowClickClose');
    this.setState({ audioActive: false });
  }

  handleError(error) {
    this.setState({
      lastClick: error.message || '',
    });
  }

  render() {
    const {
      isEditor,
      lineWidth,
      lineColor,
      newSource,
      isAttachFabric,
      newFroalaMethod,
      history,
      lastClick,
      audioActive,
      onCloseClick
    } = this.state;

    const styles = require('./FabricEditor.less');

    const strings = {
      delete: 'Delete',
      logToSalesforce: 'Log to Salesforce'
    };

    return (
      <section id="FabricEditorView">
        <h1>FabricEditor</h1>
        <Docs {...FabricEditorDocs} />
        <Debug>
          <div>
            <code>lastEvent: {lastClick}</code>
          </div>
        </Debug>
        <ComponentItem>
          <input
            ref={(c) => { this.fileUpload = c; }}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={this.handleImageUploadChange}
          />
          <NoteDeleteHeader />
        </ComponentItem>
        <ComponentItem>
          {isEditor &&
          <div>
            <FroalaHeader
              onCloseClick={this.handleCloseClick}
              onItemClick={this.handleCenterItemClick}
            >
              <div className={styles.rightBtns}>
              {this.rightBtns.map((name) => {
                if (name === 'microphone') {
                  return (<RecordAudioDropMenu
                    icon={name}
                    key={name}
                    width="auto"
                    className={styles['right' + name]}
                    onOpen={this.handleAudioDropMenuClick}
                    active={audioActive}
                  >
                    {audioActive ? <RecordAudio
                      onAttachClick={this.handleAttachClick}
                      onCancelClick={this.handleWindowClickClose}
                      onError={this.handleError}
                    /> : <div></div>}
                  </RecordAudioDropMenu>);
                }

                return (<Btn
                  icon={name}
                  key={name}
                  borderless
                  className={styles['right' + name]}
                  href={name}
                  data-type={name}
                  onClick={this.handleRightItemClick}
                />);
              })}
              <DropMenu
                width="12.5rem"
                icon="share"
                activeIcon="share-fill"
                className={styles.viewerDropMenu}
                activeClassName={styles.viewerActiveDropMenu}
              >
                <ul>
                  <a
                    href="logToSalesforce"
                    key="logToSalesforce"
                    className={styles.dropdownItem}
                    onClick={this.handleRightItemClick}
                    data-type="edit"
                  >
                    <li className={styles.logToSalesforce} >{strings.logToSalesforce}</li>
                  </a>

                  <a
                    href="delete"
                    key="delete"
                    className={styles.dropdownItem}
                    onClick={this.handleRightItemClick}
                    data-type="edit"
                  >
                    <li className={styles.delete}>{strings.delete}</li>
                  </a>
                </ul>
              </DropMenu>
              </div>
            </FroalaHeader>
          </div>}
          {!isEditor && <FabricHeader
            onClick={this.handleFabricClick}
          />}
        </ComponentItem>
        <ComponentItem>
          <FabricEditor
            ref={elem => { this.fabricEditor = elem; }}
            isEditor={isEditor}
            lineWidth={lineWidth}
            lineColor={lineColor}
            history={history}
            defaultAttachments={fabricListArray}
            defaultValue={defaultHtml}
            onEditorChange={this.handleEditorChange}
            onFabricCanvasUpdate={this.handleFabricCanvasUpdate}
            onCanvasClick={this.handleCanvasClick}
            isAttachFabric={isAttachFabric}
            newFroalaMethod={newFroalaMethod}
            newSource={newSource}
            leftTopElement={<span className={styles.close} onClick={this.handleCloseClick}>Close</span>}
            rightTopElement={<div className={styles.rightBtns}>
              {this.rightBtns.map((name) => {
                if (name === 'microphone') {
                  return (<RecordAudioDropMenu
                    icon={name}
                    key={name}
                    width="auto"
                    className={styles['right' + name]}
                    onOpen={this.handleAudioDropMenuClick}
                    onClose={this.handleWindowClickClose}
                    active={audioActive}
                  >
                    {audioActive ? <RecordAudio
                      onAttachClick={this.handleAttachClick}
                      onCancelClick={this.handleWindowClickClose}
                      onError={this.handleError}
                    /> : <div></div>}
                  </RecordAudioDropMenu>);
                }

                return (<Btn
                  icon={name}
                  key={name}
                  borderless
                  className={styles['right' + name]}
                  href={name}
                  data-type={name}
                  onClick={this.handleRightItemClick}
                />);
              })}
              <DropMenu
                width="12.5rem"
                icon="share"
                activeIcon="share-fill"
                className={styles.viewerDropMenu}
                activeClassName={styles.viewerActiveDropMenu}
              >
                <ul>
                  <a
                    href="logToSalesforce"
                    key="logToSalesforce"
                    className={styles.dropdownItem}
                    onClick={this.handleRightItemClick}
                    data-type="edit"
                  >
                    <li className={styles.logToSalesforce} >{strings.logToSalesforce}</li>
                  </a>

                  <a
                    href="delete"
                    key="delete"
                    className={styles.dropdownItem}
                    onClick={this.handleRightItemClick}
                    data-type="edit"
                  >
                    <li className={styles.delete}>{strings.delete}</li>
                  </a>
                </ul>
              </DropMenu>
            </div>}
          />
        </ComponentItem>
      </section>
    );
  }
}
