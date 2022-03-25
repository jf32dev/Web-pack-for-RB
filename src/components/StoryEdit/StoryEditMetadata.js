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
import Metadata from 'components/Metadata/Metadata';

export default class StoryEditMetadata extends Component {
  static propTypes = {
    metadata: PropTypes.array,
    metadataSettings: PropTypes.object,

    /** Sets disabled state to inputs */
    readonly: PropTypes.bool,

    onMetadataAdd: PropTypes.func.isRequired,
    onMetadataDelete: PropTypes.func.isRequired,
    onMetadataChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    metadata: [],
    metadataSettings: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isThereEmpty: false,
      error: {
        category: 0,
        showPrompt: false,
        message: ''
      }
    };
    autobind(this);
  }

  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  handleAddItem(e, type) {
    const { onMetadataAdd } = this.props;

    if (!this.state.isThereEmpty) {
      const newItem = {
        metadataId: null,
        categoryId: type,
        propertyId: 0,
        value: '',
      };

      if (typeof onMetadataAdd === 'function') {
        onMetadataAdd(newItem);
        this.setState({ isThereEmpty: true });
      }
    }
  }

  handleDeleteItem(state) {
    this.props.onMetadataDelete(state);

    if (state.new && !state.propertyId) {
      this.setState({ isThereEmpty: false });
    }
  }

  handleChange(state) {
    const category = this.props.metadataSettings.categories.filter(obj => obj.id === state.categoryId);
    const propertySelected = category.length ? category[0].propertyTypes.filter(obj => obj.id === state.propertyId) : {};
    const duplicatedItem = propertySelected.length ? this.props.metadata.filter(obj => obj.categoryId === state.categoryId && obj.metadataId !== state.metadataId && obj.propertyId === propertySelected[0].id) : [];

    if (propertySelected.length && !propertySelected[0].allowMultiple && duplicatedItem.length) {
      this.setState({
        error: {
          category: state.categoryId,
          showPrompt: true,
          message: 'Only one of property type allowed'
        }
      });

      // Hide message after 5 secs
      this.timer = window.setTimeout(() => {
        this.setState({
          error: {
            category: 0,
            showPrompt: false,
            message: ''
          }
        });
      }, 5000);
    } else {
      this.props.onMetadataChange(state);
      this.setState({ isThereEmpty: false });
    }
  }

  render() {
    const {
      metadata,
      metadataSettings,
      readonly,
    } = this.props;
    const styles = require('./StoryEditMetadata.less');

    return (
      <div id="story-edit-metadata" className={styles.StoryEditMetadata}>
        {metadataSettings.categories.map(result => (
          <Metadata
            key={'metadata_' + result.id}
            entity={result}
            items={metadata.filter(item => item.categoryId === result.id)}
            currency={metadataSettings.currency}
            addItem
            deleteItem
            readonly={readonly}
            disableAddButton={this.state.isThereEmpty}
            onAdd={this.handleAddItem}
            onDelete={this.handleDeleteItem}
            onChange={this.handleChange}
            error={this.state.error.category === result.id ? this.state.error : {}}
          />
        ))}
      </div>
    );
  }
}
