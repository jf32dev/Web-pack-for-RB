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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Loader from 'components/Loader/Loader';

/**
 * AppReceiver iframe with loading indicator.
 */
export default class WebViewer extends PureComponent {
  static propTypes = {
    /** iframe `src` */
    sourceUrl: PropTypes.string,

    /** iframe `allowFullScreen` */
    allowFullScreen: PropTypes.bool,

    /** iframe 'load' event */
    onLoad: PropTypes.func,

    /** iframe 'error' event */
    onError: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    allowFullScreen: true
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    autobind(this);
  }

  handleLoad(event) {
    this.setState({
      loaded: true
    });

    if (typeof this.props.onLoad === 'function') {
      this.props.onLoad(event);
    }
  }

  render() {
    const { loaded } = this.state;
    const { sourceUrl, data } = this.props;
    const styles = require('./WebViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      WebViewer: true
    }, this.props.className);

    return (
      <div tabIndex="-1" className={classes} style={this.props.style}>
        {!loaded && <div className={styles.loader}>
          <Loader type="content" />
        </div>}
        {(sourceUrl || data) && <iframe
          src={sourceUrl}
          srcDoc={data}
          height="100%"
          width="100%"
          sandbox="allow-scripts allow-same-origin allow-forms"
          allowFullScreen={this.props.allowFullScreen}
          seamless
          onLoad={this.handleLoad}
          onError={this.props.onError}
        />}
      </div>
    );
  }
}
