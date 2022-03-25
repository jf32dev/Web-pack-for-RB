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
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Radio from 'components/Radio/Radio';

/**
 * A RadioGroup can be created manually by setting the name attribute on a group of radio buttons to the same value.
 * This component is provided to simplify this process.
 */
export default class RadioGroup extends Component {
  static propTypes = {
    /** legend for fieldset (fieldset is actually a div due to fieldset layout bugs) */
    legend: PropTypes.string,

    /** name attribute for input - must be unique if multiple RadioGroups are present on the same page */
    name: PropTypes.string.isRequired,

    /** set checked radio */
    selectedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),

    /** an array of props to pass to each <code>&lt;Radio&gt;</code> */
    options: PropTypes.array.isRequired,

    /** passes <code>inline</code> prop to <code>&lt;Radio&gt;</code> */
    inlineInputs: PropTypes.bool,

    /** displays legend and options on same line */
    inlineLegend: PropTypes.bool,

    /** displays a required indicator, a legend must also be provided */
    required: function(props) {
      if (!props.legend && typeof props.required === 'boolean') {
        return new Error('Must provide a legend if required is enabled.');
      }
      return null;
    },

    /** must be provided if a <em>controlled</em> component */
    onChange: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { legend } = this.props;
    const styles = require('./RadioGroup.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      RadioGroup: true,
      inlineLegend: this.props.inlineLegend,
      required: this.props.required
    }, this.props.className);

    return (
      <div role="group" className={classes} style={this.props.style}>
        {legend && <legend>{legend}</legend>}
        <div className={styles.radiosWrap}>
          {this.props.options.map(radio => (
            <Radio
              key={'radio-' + radio.value}
              name={this.props.name}
              checked={radio.value === this.props.selectedValue}
              inline={this.props.inlineInputs}
              onChange={this.props.onChange}
              {...radio}
            />))}
        </div>
      </div>
    );
  }
}
