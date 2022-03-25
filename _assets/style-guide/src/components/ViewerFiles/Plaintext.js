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

/**
 * Displays a <code>txt</code> file.
 */
export default class Plaintext extends PureComponent {
  static propTypes = {
    /** required to fetch text file */
    url: PropTypes.string,

    /** text string, if not passed, attempt to fetch via url */
    content: PropTypes.string,

    /** required to display files in secure storage */
    authString: PropTypes.string,

    onLoad: PropTypes.func,
    onError: PropTypes.func
  };

  static defaultProps = {
    authString: ''
  };

  constructor(props) {
    super(props);

    // refs
    this.frame = null;
  }

  UNSAFE_componentWillMount() {
    if (!this.props.content && this.props.url) {
      this.fetchText();
    }
  }

  fetchText() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', this.props.url + this.props.authString, true);
    //xmlhttp.withCredentials = true;

    xmlhttp.onreadystatechange = function readyStateChange() {
      if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
        if (typeof this.props.onLoad === 'function') {
          this.props.onLoad(xmlhttp);
        }
      } else if (xmlhttp.readyState === 4 && xmlhttp.status === 0) {
        if (typeof this.props.onError === 'function') {
          this.props.onError(xmlhttp);
        }
      }
    }.bind(this);

    xmlhttp.send();
  }

  render() {
    const { content } = this.props;
    const styles = require('./Plaintext.less');

    return (
      <div
        ref={(c) => { this.frame = c; }}
        tabIndex="-1"
        className={styles.Plaintext}
      >
        {this.props.children}
        {content && <pre>{content}</pre>}
      </div>
    );
  }
}
