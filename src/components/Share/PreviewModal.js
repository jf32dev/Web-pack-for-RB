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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Frame from 'components/Frame/Frame';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';

/**
 * Modal
 */
export default class PreviewModal extends PureComponent {
  static propTypes = {
    /* HTML preview template */
    template: PropTypes.string,
    loading: PropTypes.bool,
    onShare: PropTypes.func,
    onClose: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    template: '',
    strings: {
      emailPreview: 'Email Preview',
      share: 'Share',
      goBack: 'Go Back',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
    autobind(this);
  }

  handleLoader() {
    this.setState({
      loaded: true
    });
  }

  handleClose(e) {
    if (typeof this.props.onClose !== 'undefined') {
      this.props.onClose(e, this.props);
    }
  }

  handleShare(e) {
    if (typeof this.props.onShare !== 'undefined') {
      this.props.onShare(e, this.props);
    }
  }

  render() {
    const {
      template,
      loading,
      strings,
      className,
    } = this.props;
    const styles = require('./PreviewModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      PreviewModal: true
    }, className);

    const iframeClasses = cx({
      iframeHidden: !this.state.loaded,
    });

    return (
      <Modal
        isVisible
        backdropClosesModal
        escClosesModal
        headerTitle={strings.emailPreview}
        footerChildren={(
          <div>
            <Btn
              large
              alt
              onClick={this.handleClose}
            >
              {strings.goBack}
            </Btn>
            <Btn
              large
              inverted
              loading={(loading || !this.state.loaded)}
              onClick={this.handleShare}
            >
              {strings.share}
            </Btn>
          </div>
        )}
        onClose={this.handleClose}
        bodyStyle={{ height: '620px' }}
        className={styles.Preview}
      >
        <div className={classes}>
          {(loading || !this.state.loaded) && <span className={styles.previewLoading}>
            <Loader type="page" />
          </span>}

          {!loading &&
            <Frame
              html={template}
              height="100%"
              seamless
              onAnchorClick={(e) => (e.preventDefault())}
              onFrameLoaded={this.handleLoader}
              containerClassName={iframeClasses}
            />
            }
        </div>
      </Modal>
    );
  }
}
