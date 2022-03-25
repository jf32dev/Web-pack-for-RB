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

import debounce from 'lodash/debounce';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Combokeys from 'combokeys';
import Transition from 'react-transition-group/Transition';

import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';

/**
 * Displays content in an overlay.
 */
export default class Modal extends PureComponent {
  static propTypes = {
    /** id attribute to assist with testing */
    id: PropTypes.string,

    /** clicking backdrop will dismiss modal */
    backdropClosesModal: PropTypes.bool,

    /** ESC key will dismiss modal */
    escClosesModal: PropTypes.bool,

    /** Modal is visible */
    isVisible: PropTypes.bool,

    /** Automatically set height on resize */
    autosize: PropTypes.bool,

    /** fixed height as autosize mode */
    fixedAutoHeight: PropTypes.bool,

    /** Explicitly set a numeric width or provide one of three sizes */
    width: PropTypes.oneOfType([
      PropTypes.oneOf(['small', 'medium', 'large']),
      PropTypes.number,
    ]),

    /** Rendered in to ModalBody */
    children: PropTypes.node,

    /** Alternative to using the <code>headerTitle</code> */
    headerChildren: PropTypes.node,

    /** Displays Close in header */
    headerCloseButton: PropTypes.bool,

    /** Displays title in header */
    headerTitle: PropTypes.string,

    /** Alternative to using the <code>footerCloseButton</code> */
    footerChildren: PropTypes.node,

    /** Displays a Close button in footer */
    footerCloseButton: PropTypes.bool,

    /** Handle close events on the modal; typically sets isVisible to false */
    onClose: function(props) {
      if (
        (props.headerCloseButton ||
         props.footerCloseButton ||
         props.backdropClosesModal ||
         props.escClosesModal
        ) && typeof props.onClose !== 'function'
      ) {
        return new Error('onClose is required when headerCloseButton, footerCloseButton, backdropClosesModal or escClosesModal is provided.');
      }
      return null;
    },

    /** applies to Modal Content wrapper */
    className: PropTypes.string,

    /** applies to ModalHeader */
    headerClassName: PropTypes.string,

    /** applies to ModalBody */
    bodyClassName: PropTypes.string,
    bodyStyle: PropTypes.object,

    /** applies to ModalFooter */
    footerClassName: PropTypes.string,

    onScroll: PropTypes.func
  };

  static defaultProps = {
    autosize: true,
    width: 'medium',
    fixedAutoHeight: false
  };

  constructor(props) {
    super(props);
    this.state = {
      hasHeader: props.headerChildren || props.headerCloseButton || props.headerTitle,
      hasFooter: props.footerChildren || props.footerCloseButton,
      maxBodyHeight: null
    };
    autobind(this);

    // refs
    this.overlay = null;

    this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 250);
  }

  UNSAFE_componentWillMount() {
    if (this.props.autosize) {
      this.setBodyHeight();
    }
  }

  componentDidMount() {
    if (this.props.escClosesModal) {
      this.combokeys = new Combokeys(document.documentElement);
      this.combokeys.bind(['esc'], this.handleShortcut);
    }

    if (this.props.isVisible) {
      this.addResizeHandler();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      document.body.style.overflow = 'hidden';
      this.addResizeHandler();

      if (this.props.autosize) {
        this.setBodyHeight();
      }
    } else if (prevProps.isVisible && !this.props.isVisible) {
      document.body.style.overflow = '';
      this.removeResizeHandler();
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = '';

    if (this.combokeys) {
      this.combokeys.detach();
    }

    this.removeResizeHandler();
  }

  setBodyHeight() {
    const innerHeight = window.innerHeight;
    let h = innerHeight - (innerHeight * 0.2);

    if (this.state.hasHeader) {
      h -= (innerHeight * 0.085);
    }

    if (this.state.hasFooter) {
      h -= (innerHeight * 0.085);
    }

    this.setState({
      maxBodyHeight: h
    });
  }

  addResizeHandler() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  removeResizeHandler() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleClose() {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  handleDialogClick(event) {
    if (this.props.backdropClosesModal) {
      event.stopPropagation();
    }
  }

  handleOverlayClick(event) {
    if (event.target === this.overlay) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.props.backdropClosesModal) {
      this.handleClose();
    }
  }

  handleOverlayKeyUp() {
    if (this.props.backdropClosesModal) {
      this.handleClose();
    }
  }

  handleShortcut(event) {
    if (event.keyCode === 27 && this.props.isVisible && this.props.escClosesModal) {
      this.handleClose();
    }
  }

  handleWindowResize() {
    if (this.props.autosize) {
      this.setBodyHeight();
    }
  }

  renderDialog() {
    const { hasHeader, hasFooter } = this.state;
    const { id, children, width } = this.props;
    const styles = require('./Modal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      ModalDialog: true,
      ModalDialogSmall: width === 'small',
      ModalDialogMedium: width === 'medium',
      ModalDialogLarge: width === 'large'
    });

    return (
      <div
        id={id}
        className={classes}
        onClick={this.handleDialogClick}
        style={{ width: width && !isNaN(width) ? width + 20 : null }}
      >
        <div className={styles.ModalContent}>
          {hasHeader && this.renderHeader()}
          {children && this.renderBody()}
          {hasFooter && this.renderFooter()}
        </div>
      </div>
    );
  }

  renderHeader() {
    const {
      headerChildren,
      headerCloseButton,
      headerTitle,
      width,
      onClose,
      headerClassName
    } = this.props;

    return (
      <ModalHeader
        title={headerTitle}
        showCloseButton={headerCloseButton}
        width={width}
        className={headerClassName}
        onClose={onClose}
      >
        {headerChildren}
      </ModalHeader>
    );
  }

  renderBody() {
    const { maxBodyHeight } = this.state;
    const { children, bodyClassName, bodyStyle, fixedAutoHeight, onScroll } = this.props;

    const styles = {
      maxHeight: maxBodyHeight,
      ...bodyStyle
    };
    //if fixedAutoHeight is set then set the height with autocalculate value
    if (fixedAutoHeight) {
      styles.height = maxBodyHeight;
    }
    return (
      <ModalBody className={bodyClassName} style={styles} onScroll={onScroll}>
        {children}
      </ModalBody>
    );
  }

  renderFooter() {
    const {
      footerChildren,
      footerCloseButton,
      width,
      onClose,
      footerClassName
    } = this.props;

    return (
      <ModalFooter
        showCloseButton={footerCloseButton}
        width={width}
        className={footerClassName}
        onClose={onClose}
      >
        {footerChildren}
      </ModalFooter>
    );
  }

  render() {
    const styles = require('./Modal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      Modal: true
    }, this.props.className);

    return (
      <Transition
        in={this.props.isVisible}
        timeout={{
          enter: 0,
          exit: 150
        }}
        appear
        mountOnEnter
        unmountOnExit
      >
        {(status) => (
          <div
            ref={(c) => { this.overlay = c; }}
            className={`Modal-${status} ${classes}`}
            onClick={this.handleOverlayClick}
          >
            {this.renderDialog(status)}
          </div>
        )}
      </Transition>
    );
  }
}
