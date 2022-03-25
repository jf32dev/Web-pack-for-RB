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
import classNames from 'classnames/bind';

/**
 * Displays a <code>excel</code> file. Excel and Numbers files are converted to this format.
 * TODO: Does component need a ViewerToolbar ?
 * Move any data parsing and toolbar render logic to HOC: SpreadsheetViewer
 */
export default class SpreadsheetViewer extends PureComponent {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    baseUrl: PropTypes.string,

    inViewer: PropTypes.bool,

    onLoad: PropTypes.func,
    onError: PropTypes.func
  };

  constructor(props) {
    super(props);

    // refs
    this.elem = null;
  }

  render() {
    const styles = require('./SpreadsheetViewer.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      SpreadsheetViewer: true,
      inViewer: this.props.inViewer
    });

    return (
      <div ref={(c) => { this.elem = c; }} tabIndex="-1" className={classes}>
        {this.props.children}
        <iframe
          src={this.props.baseUrl + 'index.html'}
          width="100%"
          height="100%"
          allowFullScreen
          //sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          className={styles.frame}
        />
      </div>
    );
  }
}
