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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Hong Nguyen <hong.nguyen@bigtincan.com>
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Editor from 'components/Editor/Editor';
import Checkbox from 'components/Checkbox/Checkbox';

/**
 * Admin General General
 */
export default class AdminHubsharePortal extends PureComponent {
  static propTypes = {
    customText: PropTypes.string,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onSave: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object,

    disableForward: PropTypes.bool,
    disableDownload: PropTypes.bool,


    /** onChange method, trigger every time some input changes */
    onChange: PropTypes.func,
  };

  static defaultProps = {
    strings: {
      save: 'Save'
    }
  };

  constructor(props) {
    super(props);

    this.toolbar = [['bold', 'italic', 'underline', '|', 'insertLink']];
    // Customise Froala options
    this.editorOptions = {
      heightMax: 300,
      heightMin: 200,
      htmlRemoveTags: ['script', 'base'],
      iframeDefaultStyle: '',
      linkAlwaysBlank: true,
      linkAutoPrefix: 'https://',
      linkConvertEmailAddress: true,
      linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
      linkInsertButtons: ['linkBack'],
      linkList: [],
      linkStyles: {},
      tabSpaces: 4,
      toolbarButtons: this.toolbar,
      toolbarButtonsMD: this.toolbar,
      toolbarButtonsSM: this.toolbar,
      toolbarButtonsXS: this.toolbar,
      events: {},
    };

    this.editorEl = React.createRef();
    autobind(this);
  }

  handleTextChange(context) {
    this.props.onChange({
      customText: context
    });
  }

  handleCheckBoxChange(event) {
    const { checked, name } = event.currentTarget;
    this.props.onChange({
      [name]: checked
    });
  }

  handleFroalaInit() {
    // Adding id supports for NightWatch tests
    document.getElementById('editor-container').querySelector('iframe').setAttribute('id', 'FroalaEditorHubShare');
  }

  handleChange(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const {
      strings,
      customText,
      disableForward,
      disableDownload,
      saveDisabled,
      saveLoading,
      onSave
    } = this.props;
    const styles = require('./AdminHubsharePortal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PrivacyPolicy: true
    }, this.props.className);

    return (
      <div id="editor-container" className={classes} style={this.props.style}>
        <div className={styles.privacyHeader}>
          <div className={styles.privacyTitle}>{strings.hubshareCustomTextFooter}</div>
          <div className={styles.privacyControls}>
            <Btn
              borderless
              className={styles.privacyButton}
              inverted
              loading={saveLoading}
              disabled={saveDisabled}
              id="save"
              onClick={onSave}
            >
              {strings.save}
            </Btn>
          </div>
        </div>
        <Editor
          ref={this.editorEl}
          defaultValue={customText}
          froalaOptions={{
            ...this.editorOptions
          }}
          placeholder={strings.hubshareCustomTextPlaceholder}
          onChange={this.handleTextChange}
          onInit={this.handleFroalaInit}
        />

        <h3>{strings.options}</h3>
        <div className={styles.hubshareOptions}>
          <Checkbox
            inline
            label={strings.disableForwardingHubshares}
            name="disableForward"
            checked={disableForward}
            onChange={this.handleCheckBoxChange}
          />

          <Checkbox
            inline
            label={strings.disableFileDownloads}
            name="disableDownload"
            checked={disableDownload}
            onChange={this.handleCheckBoxChange}
          />
        </div>
      </div>
    );
  }
}
