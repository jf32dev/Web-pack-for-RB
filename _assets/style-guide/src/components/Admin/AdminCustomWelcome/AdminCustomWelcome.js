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
import _debounce from 'lodash/debounce';
import _clone from 'lodash/clone';
import _compose from 'lodash/fp/compose';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import RadioGroup from 'components/RadioGroup/RadioGroup';
import Text from 'components/Admin/AdminUtils/InnerUpdateText/InnerUpdateText';
import Checkbox from 'components/Checkbox/Checkbox';
import Editor from 'components/Editor/Editor';
import WelcomeScreenSVG from './WelcomeScreenSVG';

export const DONE = 'done';
export const ACCEPT = 'accept';

/**
 * Admins can edit the Custom Welcome screens for the company.
 */
export default class AdminCustomWelcome extends PureComponent {
  static propTypes = {
    /** all the screens name */
    screens: PropTypes.array,

    /** custom welcome screens active true or false */
    customWelcomeScreens: PropTypes.bool,

    /** active Screens name list */
    activeScreens: PropTypes.array,

    /** selected screen name */
    selectedScreen: PropTypes.string,

    /** selected screen enable: true or false */
    enable: PropTypes.bool,

    /** selected screen title */
    title: PropTypes.string,

    /** selected screen description */
    description: PropTypes.string,

    /** selected screen enable: true or false */
    acceptButton: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** onChange method to get the update value */
    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      customWelcomeScreens: 'Custom Welcome screens',
      screen1: 'Screen 1',
      screen2: 'Screen 2',
      screen3: 'Screen 3',
      screen4: 'Screen 4',
      screen5: 'Screen 5',
      enable: 'Enable',
      title: 'Title',
      acceptButton: 'Accept Button',
      done: 'Done',
      decline: 'Decline',
      accept: 'Accept',
      description: 'Description',
    },
    screens: ['screen1', 'screen2', 'screen3', 'screen4', 'screen5'],
    customWelcomeScreens: false,
    activeScreens: [],
    selectedScreen: 'screen1',
    enable: false,
    acceptButton: DONE,
    title: '',
    description: '',
  };

  constructor(props) {
    super(props);
    //ref
    this.elem = null;
    this.handleDebounceChange = _compose(
      _debounce(this.handleChange.bind(this), 300),
      _clone
    );

    this.editor = null;

    //events
    this.events = {
      'froalaEditor.image.beforeUpload': this.handleImageUpload,
      'froalaEditor.initialized': (e, editor) => {
        this.editor = editor;
      }
    };

    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.selectedScreen !== nextProps.selectedScreen) {
      // this.editor.froalaEditor('html.set', nextProps.description);
      this.editor.html.set(nextProps.description);
    }
  }

  handleImageUpload(e, editor) {
    editor.popups.hide('image.insert');
    return false;
  }

  handleChange(e) {
    const { type, name, id, value, dataset } = _get(e, 'currentTarget', {});

    let update = {};

    if (type === 'checkbox') {
      update = {
        [name]: !this.props[name],
      };
    } else if (type === 'radio') {
      update = {
        [id.split('-')[0]]: id.split('-')[1],
      };
    } else if (_get(dataset, 'name', false) && _get(dataset, 'type', false)) {
      update = {
        [dataset.name]: dataset.type
      };
    } else if (type === 'text') {
      update = {
        [name]: value,
      };
    }

    this.handleUpdateValues(update);
  }

  handleEditorChange(value) {
    this.handleUpdateValues({
      description: value,
    });
  }

  handleUpdateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  handleFroalaInit() {
    // Adding id supports for NightWatch tests
    if (document.getElementById('editor-container')) {
      document.getElementById('editor-container')
        .querySelector('div[contenteditable=true]')
        .setAttribute('id', 'FroalaEditorWelcome');
    }
  }

  render() {
    const {
      screens,
      customWelcomeScreens,
      activeScreens,
      selectedScreen,
      acceptButton,
      strings,
      enable,
      description,
      title,
    } = this.props;

    const styles = require('./AdminCustomWelcome.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      AdminCustomWelcome: true
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        <Checkbox
          label={strings.customWelcomeScreens}
          name="customWelcomeScreens"
          className={styles.customWelcomeScreens}
          checked={customWelcomeScreens}
          onChange={this.handleChange}
        />
        {customWelcomeScreens && <div className={styles.screens}>
          {screens.map(key => (<div
            key={key} onClick={this.handleChange} data-type={key}
            data-name="selectedScreen"
          >
            <div className={`${styles.screen} ${selectedScreen === key ? styles.selectedScreen : ''} ${activeScreens.indexOf(key) > -1 ? styles.activeScreen : ''}`}>
              <WelcomeScreenSVG
                type="blank"
              />
            </div>
            <h5 className={`${selectedScreen === key ? styles.selectedScreenTitle : ''}`}>{strings[key]}</h5>
          </div>))}
        </div>}
        {customWelcomeScreens && <div className={styles.content}>
          <h3>{strings[selectedScreen]}</h3>
          <Checkbox
            label={strings.enable}
            name="enable"
            className={styles.enable}
            checked={enable}
            onChange={this.handleChange}
          />
          <Text
            id="title"
            name="title"
            label={strings.title}
            defaultValue={title}
            className={styles.title}
            type="text"
            onChange={this.handleDebounceChange}
          />
          <div id="editor-container" className={styles.editorWrapper}>
            <label className={styles.description}>{strings.description}</label>
            <Editor
              ref={elem => { this.elem = elem; }}
              froalaOptions={{
                toolbarButtons: ['fontSize', 'fontFamily', 'bold',
                  'italic', 'underline', 'align', 'formatOL',
                  'formatUL', 'outdent', 'indent', 'insertImage',
                  'html'],
                iframe: false, //otherwise the fabric could not draw the canvas
                imageInsertButtons: ['imageByURL'],
                imagePaste: false,
                imagePasteProcess: true,
                imageDefaultWidth: '100%',
                editorClass: styles.editor,
                events: this.events,
                pluginsEnabled: ['align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable',
                  'emoticons', 'entities', 'file', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageManager',
                  'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat', 'paragraphStyle',
                  'quote', 'save', 'table', 'url', 'video', 'wordPaste'],
              }}
              placeholder={strings.description}
              defaultValue={description}
              onChange={this.handleEditorChange}
              onInit={this.handleFroalaInit}
            />
          </div>
          <div className={styles.acceptContainer}>
            <h3>{strings.acceptButton}</h3>
            <div>
              <RadioGroup
                className={styles.acceptRadioGroup}
                name="acceptButton"
                selectedValue={acceptButton}
                onChange={this.handleChange}
                options={[{
                  label: '',
                  value: DONE,
                }, {
                  label: '',
                  value: ACCEPT,
                }]}
              />
              <div>
                <div>
                  <Btn>{strings.done}</Btn>
                </div>
                <div>
                  <Btn className={styles.grayBtn}>{strings.decline}</Btn>
                  <Btn>{strings.accept}</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}
