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
 * AnnotationToolbar description
 */
export default class AnnotationToolbar extends PureComponent {
  static propTypes = {
    /** Description of customProp1 */
    //customProp1: PropTypes.string,

    /** Description of customProp2 */
    //customProp2: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    //customProp2: []
  };

  render() {
    const styles = require('./AnnotationToolbar.less');

    return (
      <div className={styles.toolbar} style={this.props.style}>
        <button
          className="cursor" type="button" title="Cursor"
          data-tooltype="cursor"
        >➚</button>
        <div className={styles.spacer} />
        <button
          className={styles.rectangle} type="button" title="Rectangle"
          data-tooltype="area"
        >&nbsp;</button>
        <button
          className={styles.highlight} type="button" title="Highlight"
          data-tooltype="highlight"
        >&nbsp;</button>
        <button
          className={styles.strikeout} type="button" title="Strikeout"
          data-tooltype="strikeout"
        >&nbsp;</button>
        <div className={styles.spacer} />
        <button
          className={styles.text} type="button" title="Text Tool"
          data-tooltype="text"
        />
        <select className={styles['text-size']} />
        <div className={styles['text-color']} />
        <div className={styles.spacer} />
        <button
          className={styles.pen} type="button" title="Pen Tool"
          data-tooltype="draw"
        >✎</button>
        <select className={styles['pen-size']} />
        <div className={styles['pen-color']} />
        <div className={styles.spacer} />
        <button
          className={styles.comment} type="button" title="Comment"
          data-tooltype="point"
        >🗨</button>
        <div className={styles.spacer} />
        <a href="#clear" className={styles.clear} title="Clear">×</a>
      </div>
    );
  }
}
