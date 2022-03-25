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
 * FormViewer iframe with loading indicator.
 */
export default class FormViewer extends PureComponent {
  static propTypes = {
    /** iframe `src` */
    baseUrl: PropTypes.string,

    /** v4 API path: Required to submit v4 Forms -- to be removed for v5 */
    apiPathv4: PropTypes.string,

    /** Required to submit v4 Forms -- to be removed for v5 */
    accessToken: PropTypes.string,

    /** iframe `allowFullScreen` */
    allowFullScreen: PropTypes.bool,

    /** iframe `error` event */
    onError: PropTypes.func,

    /** iframe `load` event */
    onLoad: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    apiPathv4: 'https://push.bigtincan.org/webapi',
    accessToken: '',
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
    const {
      baseUrl,
      apiPathv4,
      accessToken
    } = this.props;
    const { loaded } = this.state;
    const styles = require('./FormViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      FormViewer: true
    }, this.props.className);

    const params = `?apiUrl=${apiPathv4}&accessToken=${accessToken}`;
    const frameSrc = baseUrl + 'index.html' + params;

    return (
      <div tabIndex="-1" className={classes} style={this.props.style}>
        {!loaded && <div className={styles.loader}>
          <Loader type="content" />
        </div>}
        {baseUrl && <iframe
          src={frameSrc}
          width="100%"
          height="100%"
          sandbox="allow-same-origin allow-scripts allow-forms"
          allowFullScreen={this.props.allowFullScreen}
          seamless
          onLoad={this.handleLoad}
          onError={this.props.onError}
        />}
      </div>
    );
  }
}
