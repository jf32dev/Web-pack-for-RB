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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import { emojify } from 'react-emojione';
import Truncate from 'react-truncate';

import Accordion from 'components/Accordion/Accordion';
import Btn from 'components/Btn/Btn';

/**
 * Accordion to show the share message with expand toggle
 */
export default class ShareMessage extends PureComponent {
  static propTypes = {
    /** Share message */
    description: PropTypes.string,

    /** Email of user who sent the Share */
    email: PropTypes.string,

    /** Share title */
    title: PropTypes.string,

    /** Max lines to truncate */
    maxLines: PropTypes.number,

    strings: PropTypes.object,

    onForwardClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    maxLines: 4,
    strings: {
      expand: 'Expand',
      message: 'Message',
      noMessageProvided: 'No message provided'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      isTruncated: false,
      parsedDescription: emojify(props.description, { output: 'unicode' })
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.description !== this.props.description) {
      this.setState({
        parsedDescription: emojify(nextProps.description, { output: 'unicode' })
      });
    }
  }

  handleMessageClick() {
    if (this.state.isTruncated && !this.state.isExpanded) {
      this.setState({ isExpanded: true });
    }
  }

  handleExpandClick() {
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  handleTruncated(isTruncated) {
    this.setState({ isTruncated: isTruncated });
  }

  renderDescription() {
    return this.state.parsedDescription.split('\n').map((line, i, arr) => {
      const lineElem = <span key={i}>{line}</span>;
      if (i === arr.length - 1) {
        return lineElem;
      }
      return [lineElem, <br key={i + 'br'} />];
    });
  }

  render() {
    const { email, title, maxLines, strings, onForwardClick } = this.props;
    const { isExpanded, isTruncated, parsedDescription } = this.state;
    const styles = require('./ShareMessage.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ShareMessage: true
    }, this.props.className);
    const messageClasses = cx({
      message: true,
      isTruncated: isTruncated
    });
    const expandClasses = cx({
      expand: true,
      isExpanded: isExpanded
    });

    // Toggle Truncation
    const expandElem = (<span
      aria-label={strings.expand}
      onClick={this.handleExpandClick}
      className={expandClasses}
    />);

    return (
      <div className={classes} style={this.props.style}>
        <Accordion
          title={strings.message}
          defaultOpen
          className={styles.accordion}
        >
          <div
            onClick={this.handleMessageClick}
            className={messageClasses}
          >
            {parsedDescription && (<article>
              <Truncate
                lines={!isExpanded ? maxLines : false}
                ellipsis={<span>...{expandElem}</span>}
                trimWhitespace
                onTruncate={this.handleTruncated}
              >
                {this.renderDescription()}
                {isExpanded && expandElem}
              </Truncate>
            </article>)}
            {!parsedDescription && <article>
              <p className={styles.noMessage}>{strings.noMessageProvided}</p>
            </article>}
          </div>
          <div className={styles.actions}>
            <Btn
              href={`mailto:${email}?subject=${title}`}
              small
              alt
            >
              {strings.reply}
            </Btn>
            <Btn
              data-name="forward"
              inverted
              small
              onClick={onForwardClick}
            >
              {strings.forward}
            </Btn>
          </div>
        </Accordion>
      </div>
    );
  }
}
