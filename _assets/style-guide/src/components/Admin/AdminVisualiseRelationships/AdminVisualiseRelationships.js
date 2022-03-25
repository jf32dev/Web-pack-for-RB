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
 * @package style-guide`
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Blankslate from 'components/Blankslate/Blankslate';
import Loader from 'components/Loader/Loader';
import Tree from './Tree/Tree';

const messages = defineMessages({
  groups: { id: 'groups', defaultMessage: 'Groups' },
  interestArea: { id: 'interest-area', defaultMessage: 'Interest Area' },
  webSites: { id: 'websites', defaultMessage: 'Websites' },
  users: { id: 'users', defaultMessage: 'Users' },
});

export default class AdminVisualiseRelationships extends PureComponent {
  static propTypes = {
    /** Array of items */
    list: PropTypes.object.isRequired,

    /** Pass all strings as key/value pairs */
    strings: PropTypes.object,

    showZoom: PropTypes.bool,
    showLegend: PropTypes.bool,
    loading: PropTypes.bool,

    /** Array of types in order <code>tabs, channels, groups, users</code> */
    types: PropTypes.array,

    width: PropTypes.number,
    heigth: PropTypes.number,

    onClose: PropTypes.func,
    onDragResize: PropTypes.func,
    onFullScreenChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: {},
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      graphHeight: 0,
      graphWidth: 0,
      zoomInFlag: false,
      zoomOutFlag: false,
    };
    autobind(this);

    this.graphWrapper = null;
  }

  componentDidMount() {
    this.graphTimeout = window.setTimeout(() => {
      if (this.graphWrapper) {
        this.setState({graphHeight: this.graphWrapper.clientHeight, graphWidth: this.graphWrapper.clientWidth}); // eslint-disable-line
      }
    }, 200);
  }

  componentDidUpdate(nextProps) {
    if (this.props.list !== nextProps.list) {
      if (this.graphWrapper) {
        this.setState({graphHeight: this.graphWrapper.clientHeight, graphWidth: this.graphWrapper.clientWidth}); // eslint-disable-line
      }
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.graphTimeout);
  }

  handleZoomOut() {
    this.setState({ zoomOutFlag: !this.state.zoomOutFlag });
  }

  handleZoomIn() {
    this.setState({ zoomInFlag: !this.state.zoomInFlag });
  }

  render() {
    const { formatMessage } = this.context.intl;
    const {
      list,
      loading,
      showLegend,
      showZoom,
    } = this.props;
    const styles = require('./AdminVisualiseRelationships.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Visualise: true,
    }, this.props.className);

    const strings = generateStrings(messages, formatMessage);

    if (!list || !list.name || !list.children || !list.children.length) {
      return (
        <Blankslate
          icon="content"
          message={'There isn\'t enough data available.'}
          className={styles.blank}
        />
      );
    }

    if (loading) {
      return (
        <div className={styles.loading}>
          <Loader type="content" />
        </div>
      );
    }

    return (
      <div style={{ width: '100%', height: '100%' }} className={classes}>
        <div className={styles.wrapper}>
          {showZoom && <div className={styles.actions}>
            <span className={styles.zoomOut} onClick={this.handleZoomOut} />
            <span className={styles.zoomIn} onClick={this.handleZoomIn} />
          </div>}

          <div
            ref={(node) => { this.graphWrapper = node; }}
            className={styles.graphContainer}
            style={{
              width: this.state.width,
              height: this.state.height
            }}
          >
            {this.state.graphHeight > 0 && <Tree
              strings={strings}
              showLegend={showLegend}
              data={[list]}
              depthFactor={300}
              initialDepth={1}
              zoomable={showZoom}
              zoomInFlag={this.state.zoomInFlag}
              zoomOutFlag={this.state.zoomOutFlag}
              nodeSize={{
                y: this.state.graphHeight,
                x: this.state.graphWidth
              }}
            />}
          </div>
        </div>
      </div>
    );
  }
}
