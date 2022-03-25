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

import React, { Component } from 'react';
import autobind from 'class-autobind';
import ComponentItem from '../../views/ComponentItem';
import Docs from '../../views/Docs';

import AdminCoverArt from 'components/Admin/AdminCoverArt/AdminCoverArt';
import EditImageModal from 'components/Admin/AdminCoverArt/EditImageModal';
import StoriesListModal from 'components/Admin/AdminCoverArt/StoriesListModal';
import moment from 'moment';

const AdminCoverArtDocs = require('!!react-docgen-loader!components/Admin/AdminCoverArt/AdminCoverArt.js');

const coverArtList = require('../../static/admin/coverArt.json');
const stories = require('../../static/stories.json');

export default class AdminCoverArtView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      triggerList: [],
      triggerListLoaded: false,
      triggerListLoading: true,
      triggerListLoadingMore: false,
      triggerListIsComplete: false,
      currentModal: 'EditImageModal',
    };
    autobind(this);
  }

  handleChange(update) {
    console.log(update);
    this.setState({
      values: {
        ...this.state.values,
        ...update
      },
      selected: {}
    })
  }

  handleClick(e) {
    const { dataset } = e.currentTarget;
    let update = {};
    if (dataset.name === 'recentlyUploaded' && dataset.type !== 'asc') {
      update = {
        sort: 'asc'
      }
    } else if (dataset.name === 'recentlyUploaded' && dataset.type === 'asc') {
      update = {
        sort: 'desc'
      }
    } else if (dataset.id) {
      const selected = this.state.triggerList.find(item => item.id.toString() === dataset.id);
      this.setState({
        isVisible: true,
        selected,
      });
    } else if (dataset.path && this.state.selected) {
      this.setState({
        currentModal: dataset.path
      });
    } else if (dataset.action === 'deleteImage') {
      this.setState({
        selected: {}
      });
    }

    if (update) {
      this.setState({
        values: {
          ...this.state.values,
          ...update
        }
      });
    }
  }

  handleGetList(offset) {
    const itemCount = 80;
    const newList = coverArtList.slice(offset, offset + 20);

    this.setState({
      triggerList: [...this.state.triggerList, ...newList],
      triggerListLoaded: true,
      triggerListLoading: newList.length === itemCount,
      triggerListLoadingMore: newList.length < itemCount,
      triggerListIsComplete: newList.length < itemCount,
    });
  }

  handleModalClose() {
    this.setState({
      isVisible: false,
      currentModal: 'EditImageModal',
    });
  }

  handleUpdateTags(tags) {
    this.setState({
      selected: {
        ...this.state.selected,
        tags,
      }
    });
  }

  render() {
    const {
      triggerList,
      triggerListLoaded,
      triggerListLoading,
      triggerListLoadingMore,
      triggerListIsComplete,
      isVisible,
      selected,
      currentModal,
    } = this.state;

    const list = stories.map(item => ({
      ...item,
      thumbnail: selected ? selected.thumbnail : ''
    }));

    return (
      <section id="BlankView">
        <h1>AdminCoverArt</h1>
        <Docs {...AdminCoverArtDocs} />

        <ComponentItem style={{ height: '900px', overflow: 'hidden' }}>
          <AdminCoverArt
            list={triggerList}
            onUpdate={this.handleChange}
            onClick={this.handleClick}
            {...this.state.values}
            isLoaded={triggerListLoaded}
            isLoading={triggerListLoading}
            isLoadingMore={triggerListLoadingMore}
            isComplete={triggerListIsComplete}
            onGetList={this.handleGetList}
          />
          {currentModal === 'EditImageModal' && <EditImageModal
            {...selected}
            updatedFormat={_get(selected, 'updated', false) ? moment.unix(selected.updated).format('MMMM DD, YYYY') : ''}
            onClick={this.handleClick}
            isVisible={isVisible}
            onClose={this.handleModalClose}
            onUpdateTags={this.handleUpdateTags}
          />}
          {currentModal === 'StoriesListModal' && <StoriesListModal
            isVisible={isVisible}
            onClose={this.handleModalClose}
            onClick={this.handleClick}
            list={list}
          />}
        </ComponentItem>
      </section>
    );
  }
}
