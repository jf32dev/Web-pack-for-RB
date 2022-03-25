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
 * @author Jason Huang <jason.huang@bigtincan.com>
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import ComponentItem from '../../views/ComponentItem';
import Btn from 'components/Btn/Btn';
import NoteItem from 'components/NoteItem/NoteItem';
import NoteItemNew from 'components/NoteItemNew/NoteItemNew';

import Debug from '../../views/Debug';
import Docs from '../../views/Docs';

const NoteItemDocs = require('!!react-docgen-loader!components/NoteItem/NoteItem.js');

const notes = require('../../static/notes.json');

export default class NoteItemView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: true,
      showCheckbox: false,
      lastClick: null
    };
    autobind(this);
  }

  handleClick(event, note) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');

    // Non-anchor StoryItem
    // Quicklink Detail Btn
    if (!href) {
      this.setState({ lastClick: note.props.id });
    } else {
      this.setState({ lastClick: href });
    }
  }

  handleToggleGridClick() {
    this.setState({ grid: !this.state.grid });
  }

  handleToggleShowCheckbox() {
    this.setState({ showCheckbox: !this.state.showCheckbox });
  }

  render() {
    const { grid, showCheckbox, lastClick } = this.state;

    const mediumStyle = {
      margin: grid ? '0 -0.75rem -0.75rem' : '-0.5rem',
      display: 'flex',
      flexDirection: grid ? 'row' : 'column',
      flexWrap: 'wrap'
    };

    const styles = require('./NoteItem.less');
    const cx = classNames.bind(styles);
    const noteItemNewClass = cx({
      noteItemNewWrapper: true
    });

    return (
      <section id="NoteItemView">
        <h1>NoteItem</h1>
        <Docs {...NoteItemDocs} />

        <Debug>
          <div>
            <Btn small inverted={grid} onClick={this.handleToggleGridClick}>grid</Btn>
            <Btn small inverted={showCheckbox} onClick={this.handleToggleShowCheckbox}>showCheckbox</Btn>
          </div>
          <div>
            <code>onClick: {lastClick}</code>
          </div>
        </Debug>
        <h2>{grid ? 'Grid' : 'List'} - Large</h2>
        {!grid && <p>Note name restricted to one line.</p>}
        {!grid && <p>Note excerpt is restricted to one line.</p>}
        {grid && <p>Note name is restricted to two lines.</p>}
        {grid && <p>Note excerpt would check the thumbnail and story to update the lines.</p>}
        <ComponentItem style={{ width: grid ? 'auto' : '300px' }}>
          <div style={mediumStyle}>
            {notes.map((note, index) => {
              const isLoad = index === 0;
              return (
                <NoteItem
                  key={index}
                  grid={grid}
                  showCheckbox={showCheckbox}
                  showThumb
                  loading={isLoad}
                  onClick={this.handleClick}
                  {...note}
                />
              )
            })}
          </div>
        </ComponentItem>

        <h1>NoteItemNew</h1>
        <ComponentItem>
          <div className={noteItemNewClass}>
            {notes.map((note, index) => {
              const isLoad = index === 3;
              return (
                <NoteItemNew
                  key={index}
                  loading={isLoad}
                  onClick={this.handleClick}
                  showThumb
                  {...note}
                />
              )
            })}
          </div>
        </ComponentItem>
      </section>
    );
  }
}
