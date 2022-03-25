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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import Btn from 'components/Btn/Btn';
import Textarea from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';
import Frame from 'components/Frame/Frame';

const FrameDocs = require('!!react-docgen-loader!components/Frame/Frame.js');

const style = require('../../static/style.txt');
const script = require('../../static/script.txt');
const body = require('../../static/body.txt');

import broken from 'raw-loader!../../static/html/broken.html';
import maintenance from 'raw-loader!../../static/html/maintenance.html';

export default class FrameView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      frameHeight: '250px',
      customBody: '<p>Custom body...</p>',
      customStyle: 'body { font-family: sans-serif; background: #111; color:#fff; }',
      customScript: 'console.log("Custom script inserted...")'
    };

    this.fixedOptions = [
      { value: broken, label: 'broken' },
      { value: maintenance, label: 'maintenance' },
    ];

    autobind(this);
  }

  handleFrameLoaded(frame, height) {
    if (height > 0) {
      this.setState({ frameHeight: height + 'px' });
    }
  }

  handleFrameAnchorClick(event, target) {
    console.log(event);  // eslint-disable-line
    console.log(target);  // eslint-disable-line
  }

  handleRenderCustomClick(event) {
    this.setState({
      customBody: this.refs.customBody.getValue(),
      customStyle: this.refs.customStyle.getValue(),
      customScript: this.refs.customScript.getValue()
    });
    event.preventDefault();
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    if (file.type === 'text/html') {
      const reader = new FileReader();

      reader.onload = () => {
        const content = reader.result;
        this.setState({
          html: content
        });
      };

      reader.readAsText(file);
    } else {
      console.log('file not supported, must be text/html');
    }
  }

  handleRenderFileClick(event) {
    event.preventDefault();
  }

  handleSelectChange(select) {
    this.setState({
      html: select.value
    })
  }

  render() {
    const globalStyle = 'body {margin-top:0;} h1 {background:red;}';
    const globalScript = 'window.onresize = function() { console.log("global resize event"); }';

    /**
     * Manually trigger resize event from JS
     * window.dispatchEvent(new Event('resize'));
     */

    const textinputStyle = {
      width: '30%',
      display: 'inline-block',
      marginRight: '1rem'
    };

    return (
      <section id="FrameView">
        <h1>Frame</h1>
        <Docs {...FrameDocs} />

        <ComponentItem>
          <Frame
            title={'Example Title'}
            headScript={globalScript + script}
            headStyle={globalStyle + style}
            body={body}
            height={this.state.frameHeight}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onFrameLoaded={this.handleFrameLoaded}
            onAnchorClick={this.handleFrameAnchorClick}
            onInternalAnchorClick={this.handleFrameAnchorClick}
            allowFullScreen
            seamless
          />
        </ComponentItem>

        <h2>Render from inputs</h2>
        <div style={{ margin: '1rem 0 0.5rem' }}>
          <Textarea ref="customBody" id="customBody" label="Body (HTML)" defaultValue={this.state.customBody} style={textinputStyle} />
          <Textarea ref="customStyle" id="customStyle" label="Style (CSS)" defaultValue={this.state.customStyle} style={textinputStyle} />
          <Textarea ref="customScript" id="customScript" label="Script (JavaScript)" defaultValue={this.state.customScript} style={textinputStyle} />
        </div>

        <p><Btn onClick={this.handleRenderCustomClick}>Render</Btn></p>
        <ComponentItem>
          <Frame
            body={this.state.customBody}
            headStyle={this.state.customStyle}
            headScript={this.state.customScript}
            height="300px"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            seamless
          />
        </ComponentItem>

        <h2>Render from HTML file</h2>
        <div style={{ margin: '1rem 0 0.5rem' }}>
          <input type="file" onChange={this.handleFileChange} />
        </div>
        <Select
          id="fixed"
          name="fixed"
          options={this.fixedOptions}
          value={this.state.html}
          searchable={false}
          clearable={false}
          style={{ width: '20rem', paddingBottom: '.5rem' }}
          placeholder="Choose one value!"
          onChange={this.handleSelectChange}
        />
        <p><Btn disabled={!this.state.html} onClick={this.handleRenderFileClick}>Render</Btn></p>
        <ComponentItem>
          <Frame
            html={this.state.html}
            height="300px"
            sandbox="allow-same-origin allow-scripts"
            seamless
            onAnchorClick={this.handleFrameAnchorClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
