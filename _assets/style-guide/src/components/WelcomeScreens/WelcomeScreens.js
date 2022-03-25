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

import { defineMessages } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';

const messages = defineMessages({
  accept: { id: 'accept', defaultMessage: 'Accept' },
  decline: { id: 'decline', defaultMessage: 'Decline' },
  done: { id: 'done', defaultMessage: 'Done' },
  next: { id: 'next', defaultMessage: 'Next' },
  back: { id: 'back', defaultMessage: 'Back' },
  pageXofN: { id: 'page-x-of-n', defaultMessage: 'Page {currentPage} of {totalPages}' }
});

/**
 * WelcomeScreens display the first time a user logs in or if onboarding is reset.
 */
export default class WelcomeScreens extends PureComponent {
  static propTypes = {
    /** Accept/Deny or Done button */
    buttonType: PropTypes.oneOf(['accept', 'done']).isRequired,

    /** Slides to display */
    slides: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })).isRequired,

    /** Modal visibility */
    isVisible: PropTypes.bool,

    /** Handler for Done/Accept button click */
    onAcceptClick: PropTypes.func.isRequired,

    /** Handler for Decline button click */
    onDenyClick: PropTypes.func.isRequired,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static contextTypes = {
    intl: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    autobind(this);
  }

  handlePrevSlideClick() {
    this.setState({
      activeIndex: this.state.activeIndex - 1
    });
  }

  handleNextSlideClick() {
    this.setState({
      activeIndex: this.state.activeIndex + 1
    });
  }

  handleDenyClick(event) {
    this.setState({
      activeIndex: 0
    });
    this.props.onDenyClick(event);
  }

  handleAcceptClick(event) {
    this.setState({
      activeIndex: 0
    });
    this.props.onAcceptClick(event);
  }

  render() {
    const { formatMessage } = this.context.intl;
    const { activeIndex } = this.state;
    const { buttonType, slides, isVisible } = this.props;
    const styles = require('./WelcomeScreens.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      WelcomeScreens: true
    }, this.props.className);

    const strings = generateStrings(messages, formatMessage, {
      currentPage: activeIndex + 1,
      totalPages: slides.length
    });

    const lastSlideVisible = activeIndex === slides.length - 1;
    const showPrev = activeIndex > 0;
    const showNext = activeIndex + 1 < slides.length;

    return (
      <Modal
        id="welcome-screens"
        isVisible={isVisible}
        headerTitle={slides[activeIndex].title}
        footerChildren={(
          <div>
            {!lastSlideVisible && <div className={styles.slideButtons}>
              <div>
                {showPrev && <Btn
                  alt
                  large
                  onClick={this.handlePrevSlideClick}
                >
                  {strings.back}
                </Btn>}
              </div>
              <span className={styles.status}>{strings.pageXofN}</span>
              <div>
                {showNext && <Btn
                  inverted
                  large
                  className={styles.next}
                  onClick={this.handleNextSlideClick}
                >
                  {strings.next}
                </Btn>}
              </div>
            </div>}
            {lastSlideVisible && <div>
              {buttonType === 'accept' && <Btn
                alt
                large
                onClick={this.handleDenyClick}
              >
                {strings.decline}
              </Btn>}
              <Btn
                inverted
                large
                onClick={this.handleAcceptClick}
              >
                {buttonType === 'accept' ? strings.accept : strings.done}
              </Btn>
            </div>}
          </div>
        )}
        bodyClassName={styles.modalBody}
        footerClassName={styles.modalFooter}
        className={classes}
        style={this.props.style}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.title + i}
            dangerouslySetInnerHTML={{ __html: slide.description }}
            style={{ display: i === activeIndex ? 'block' : 'none' }}
          />
        ))}
      </Modal>
    );
  }
}
