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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Btn from 'components/Btn/Btn';
import Text from 'components/Text/Text';

export default class StoryUnlock extends PureComponent {
  static propTypes = {
    storyName: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,

    error: PropTypes.object,

    btnText: PropTypes.string.isRequired,
    closeText: PropTypes.string.isRequired,
    inputPlaceholder: PropTypes.string.isRequired,
    inputValue: PropTypes.string.isRequired,

    disableButton: PropTypes.bool,
    hideInput: PropTypes.bool,

    onCloseClick: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onUnlockClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // refs
    this.input = null;
  }

  componentDidMount() {
    if (!this.props.hideInput) {
      this.input.focus();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.error && !this.props.error && !this.props.hideInput) {
      this.input.focus();
    }
  }

  render() {
    const { error } = this.props;
    const styles = require('./StoryUnlock.less');

    return (
      <div className={styles.StoryUnlock}>
        <div className={styles.header}>
          <div className={styles.storyClose} onClick={this.props.onCloseClick}>
            {this.props.closeText}
          </div>
          <h1>{this.props.storyName}</h1>
        </div>

        <h2>{this.props.heading}</h2>
        <p>{this.props.description}</p>

        <form className={styles.form}>
          <Text
            ref={(c) => { this.input = c; }}
            type="password"
            disabled={this.props.hideInput}
            value={this.props.inputValue}
            placeholder={this.props.inputPlaceholder}
            inline
            width="20rem"
            onChange={this.props.onInputChange}
            className={styles.password}
            style={{ display: this.props.hideInput ? 'none' : 'initial' }}
          />
          <Btn
            type="submit"
            disabled={this.props.disableButton}
            inverted
            large
            onClick={this.props.onUnlockClick}
          >
            {this.props.btnText}
          </Btn>
          {error && <p className={styles.error}>{error.message}</p>}
        </form>
      </div>
    );
  }
}
