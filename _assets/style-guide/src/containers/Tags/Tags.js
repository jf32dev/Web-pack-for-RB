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

import Tags from 'components/Tags/Tags';

const TagsDocs = require('!!react-docgen-loader!components/Tags/Tags.js');

export default class TagsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: ['potato', 'banana', 'avocado'],
      currentSearch: ''
    };

    autobind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const tagName = event.currentTarget.dataset.name;
    console.log(tagName);
  }

  handleDeleteClick(event) {
    event.preventDefault();
    const tagIndex = event.currentTarget.dataset.index;

    const newTags = [...this.state.tags];
    newTags.splice(tagIndex, 1);

    this.setState({
      tags: newTags
    });
  }

  handleSearchInputChange(event) {
    const value = event.target.value;

    this.setState({
      currentSearch: value
    });
  }

  handleInputKeyDown(event) {
    const value = event.target.value;

    // handle return clicked
    if ((event.keyCode === 13 || event.keyCode === 32) && !event.shiftKey && /\S/.test(value)) {
      event.preventDefault();

      this.setState({
        currentSearch: '',
        tags: [...this.state.tags, value]
      });
    }
  }

  render() {
    return (
      <section id="TagsView">
        <h1>Tags</h1>
        <Docs {...TagsDocs} />

        <h2>Regular List</h2>
        <p>By default, a list is just styled text.</p>
        <ComponentItem>
          <Tags list={this.state.tags} />
        </ComponentItem>

        <h2>List with anchors</h2>
        <p>Pass a <code>rootUrl</code> to render the list with anchor tags. A click handler must be passed to prevent default browser behaviour.</p>
        <ComponentItem>
          <Tags
            list={this.state.tags}
            rootUrl="/search/tags/"
            onItemClick={this.handleClick}
            onItemDeleteClick={this.handleDeleteClick}
          />
        </ComponentItem>

        <h2>List with Input text</h2>
        <p>Pass <code>enableInput</code> to render the input text to search tags. Input events required (onInputChange, onInputKeyDown).</p>
        <ComponentItem>
          <Tags
            enableInput
            currentSearch={this.state.currentSearch}
            onInputKeyDown={this.handleInputKeyDown}
            onInputChange={this.handleSearchInputChange}
            list={this.state.tags}
            onItemDeleteClick={this.handleDeleteClick}
          />
        </ComponentItem>

        <h2>Alternate style</h2>
        <p>...</p>
        <ComponentItem>
          <Tags
            list={this.state.tags}
            rootUrl="/search/tags/"
            alt
            onItemClick={this.handleClick}
          />
        </ComponentItem>
      </section>
    );
  }
}
