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
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import autobind from 'class-autobind';

import Blankslate from 'components/Blankslate/Blankslate';
import EditorMenu from '../EmailEditor/EditorMenu';
import Frame from 'components/Frame/Frame';
import Loader from 'components/Loader/Loader';

/**
 * Email preview wrapper.
 */
export default class EditorPreview extends PureComponent {
  static propTypes = {
    // html template to be shown
    template: PropTypes.string,

    changed: PropTypes.bool,
    loading: PropTypes.bool,

    /** Alternative sizes */
    size: PropTypes.oneOf(['desktop', 'mobile', 'tablet']),

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    template: '',
    strings: {
      mobile: 'Mobile',
      tablet: 'Tablet',
      desktop: 'Desktop',
      emailHasChanged: 'Email Template Has Been Edited',
      clickReloadPreview: 'Click Reload Preview to view changes.',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      size: props.size || 'desktop',
      loaded: false,
      sizeList: [
        { name: 'Mobile', id: 'mobile' },
        { name: 'Tablet', id: 'tablet' },
        { name: 'Desktop', id: 'desktop' },
      ],
    };
    autobind(this);
  }

  handleSizeChange(e, context) {
    this.setState({ size: context.id });
  }

  handleLoader() {
    this.setState({
      loaded: true
    });
  }

  render() {
    const {
      template,
      changed,
      loading,
      strings,
    } = this.props;
    const {
      size,
      sizeList,
    } = this.state;
    const styles = require('./EmailPreview.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EditorPreview: true,
    }, this.props.className);
    const frameSize = cx({
      mobile: size === 'mobile',
      tablet: size === 'tablet',
      desktop: size === 'desktop',
    });

    return (
      <div className={classes} style={this.props.style}>
        <EditorMenu
          list={sizeList}
          selected={size}
          secondary
          strings={strings}
          onItemClick={this.handleSizeChange}
        />

        {(loading || !this.state.loaded) && <div className={styles.previewLoading}>
          <Loader type="page" />
        </div>}

        {!loading && changed && <Blankslate
          icon="edit-box"
          heading={strings.emailHasChanged}
          message={strings.clickReloadPreview}
          className={styles.templateEdited}
        />}

        {!loading && !changed && <Frame
          html={template}
          height="600px"
          seamless
          onAnchorClick={(e) => (e.preventDefault())}
          onFrameLoaded={this.handleLoader}
          className={frameSize}
          style={{
            display: this.state.loaded ? 'block' : 'none',
            opacity: this.state.loaded ? '1' : '0'
          }}
        />}
      </div>
    );
  }
}
