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
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Loader from 'components/Loader/Loader';
import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Radio from 'components/Radio/Radio';
import Blankslate from 'components/Blankslate/Blankslate';
import moment from 'moment';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

/**
 * Simple delete modal with message, cancel button and delete button
 */
export default class FolderSelector extends PureComponent {
  static propTypes = {
    contents: PropTypes.array,

    nextPage: PropTypes.string,

    folderId: PropTypes.string,

    paths: PropTypes.array,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    contents: [],
    nextPage: '',
    folderId: '',
    strings: {
      name: 'Name'
    },
    paths: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      action: 'content',
      headerSelected: '',
      isAsc: true,
    };
    this.action = 'content';
    autobind(this);
  }

  handlePathClick(event) {
    event.preventDefault();
    let path = event.currentTarget.getAttribute('href');
    if (!path) {
      path = event.currentTarget.dataset.path;
    }
    this.updateValues({
      action: 'path',
      path,
    });
  }

  handleCompareContentItem(a, b) {
    let result = 0;
    const { headerSelected, isAsc } = this.state;

    if (headerSelected === 'name') {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        result = isAsc ? -1 : 1;
      }

      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        result = isAsc ? 1 : -1;
      }
    }

    if (headerSelected === 'modified' && a.category !== 'folder' && b.category !== 'folder') {
      if (a.modified > b.modified) {
        result = isAsc ? -1 : 1;
      }

      if (a.modified < b.modified) {
        result = isAsc ? 1 : -1;
      }
    }

    if (a.category === 'folder' && b.category !== 'folder') {
      result = -1;
    }
    if (b.category === 'folder' && a.category !== 'folder') {
      result = 1;
    }
    // a must be equal to b
    return result;
  }

  handleRadioToggle(e) {
    this.updateValues({
      action: 'contentChecked',
      currentCheckedId: e.currentTarget.value
    });
  }

  handleItemClick(e) {
    const { dataset } = e.currentTarget;
    if (dataset.category === 'folder') {
      this.updateValues({
        action: 'content',
        ...dataset
      });
    } else if (dataset.name === 'modified' || dataset.name === 'name') {
      this.setState({
        headerSelected: dataset.name,
        isAsc: this.state.headerSelected === dataset.name ? !this.state.isAsc : true
      });
    }
  }

  handleSyncing() {
    const { paths } = this.props;
    this.updateValues({
      action: 'content',
      type: 'syncing',
      id: paths.length > 0 ? paths[paths.length - 1].path : '',
      name: paths.length > 0 ? paths[paths.length - 1].name : ''
    });
  }

  updateValues(update) {
    const { onChange } = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
    // this.action = update.action;
    if (update.action !== 'contentChecked' && update.type !== 'syncing') {
      this.setState({
        action: update.action
      });
    }
  }

  render() {
    const styles = require('./FolderSelector.less');
    const { contents, strings, paths, loading, folderId, syncRootPath, nextPage } = this.props;
    const { action, headerSelected, isAsc } = this.state;

    const cx = classNames.bind(styles);
    const classes = cx({
      FolderSelector: true,
      syncRootPath
    }, this.props.className);

    const refreshClasses = cx({
      refresh: true,
      syncing: loading,
    });

    const structureClasses = cx({
      structure: true,
      disable: loading,
    });

    const disableClasses = cx({
      disable: loading,
    });

    if (loading === false) {
      this.action = action + (paths.length > 0 ? paths[paths.length - 1].path : '');
    }

    let height = 1.563 + 2.063 + 0.625 + ((2.813 * contents.length) === 0 ? 12.56 : (2.813 * contents.length));
    if (height > 22) {
      height = 22;
    }

    const maxHeight = syncRootPath ? 0 : height;

    return (
      <div
        className={classes}
        style={{
          maxHeight: `${maxHeight}rem`,
          overflow: `${maxHeight === 0 ? 'hidden' : 'visible'}`,
        }}
      >
        <div className={styles.paths}>
          <Breadcrumbs
            paths={paths}
            onPathClick={this.handlePathClick}
            className={`${styles.crumbs} ${disableClasses}`}
          />
          <div className={refreshClasses} onClick={this.handleSyncing} />
        </div>
        <div className={styles.header}>
          <h5 onClick={this.handleItemClick} data-name="name">
            {strings.name}
            {headerSelected === 'name' && <span className={isAsc ? '' : styles.rotation} />}
          </h5>
          {contents.filter(item => item.category !== 'folder' && item.modified).length > 0 &&
          <h5 onClick={this.handleItemClick} data-name="modified">
            {strings.modified}
            {headerSelected === 'modified' && <span className={isAsc ? '' : styles.rotation} />}
          </h5>}
        </div>
        <div className={structureClasses}>
          <TransitionGroup>
            <CSSTransition
              key={this.action}
              classNames={{
                enter: action === 'content' ? styles['slide-enter'] : styles['slide-exit'],
                enterActive: action === 'content' ? styles['slide-enter-active'] : styles['slide-exit-active'],
                exit: action === 'content' ? styles['slide-exit'] : styles['slide-enter-leave'],
                exitActive: action === 'content' ? styles['slide-exit-active'] : styles['slide-enter-leave-active']
              }}
              timeout={{
                enter: 500,
                exit: 500
              }}
              appear
            >
              <div
                className={styles.content}
                key={this.action}
                onScroll={this.props.handleListScroll}
              >
                {contents.slice().sort(this.handleCompareContentItem).map(item => (
                  <div key={item.id} className={`${styles.item} ${loading ? styles.loading : ''} ${item.category !== 'folder' ? styles.disable : ''}`}>
                    <Radio
                      value={item.id}
                      checked={folderId !== null && item.id === folderId}
                      className={item.category !== 'folder' ? styles.hidden : styles.radioFolder}
                      onClick={this.handleRadioToggle}
                      onChange={() => {}}
                      disabled={loading}
                    />
                    <div
                      className={`${item.category === 'folder' ? styles.folder : styles.file} ${disableClasses}`}
                      data-id={item.id}
                      data-category={item.category}
                      {...Object.keys(item).reduce((accumulator, key) => ({
                        ...accumulator,
                        [`data-${key.toLowerCase()}`]: item[key]
                      }), {})}
                      onClick={this.handleItemClick}
                    >{item.name}</div>
                    {item.modified && item.category !== 'folder' && <div className={styles.last}>
                      {moment(item.modified).format('DD/MM/YYYY hh:mm a')}
                      </div>}
                  </div>
                ))}
                {contents.length === 0 && <Blankslate
                  icon="content"
                  heading={strings.emptyHeading}
                  message={strings.emptyFileMessage}
                  middle
                />}
              </div>
            </CSSTransition>
          </TransitionGroup>
          {nextPage && <Loader type="content" style={{ margin: '0 auto' }} />}
        </div>
      </div>
    );
  }
}
