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
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import StoryItem from 'components/StoryItem/StoryItem';

/**
 * Stories List Modal
 */
export default class StoriesListModal extends PureComponent {
  static propTypes = {
    /** make the modal visible */
    isVisible: PropTypes.bool,

    /** onClick event method use dataset to figure out what method need to be processed next */
    onClick: PropTypes.func,

    /** close modal event method */
    onClose: PropTypes.func,

    /** stories list */
    list: PropTypes.array,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    className: PropTypes.string,
    style: PropTypes.object,

    showAuthor: PropTypes.bool,
  };

  static defaultProps = {
    strings: {
      editImage: 'Edit Image',
      stories: 'Stories',
      back: 'Back',
      showAuthor: true,
    },
    list: [],
  };

  render() {
    const {
      strings,
      isVisible,
      onClick,
      onClose,
      list,
      showAuthor,
    } = this.props;
    const styles = require('./StoriesListModal.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      EditImageModal: true
    }, this.props.className);

    const paths = [{
      name: strings.editImage,
      path: 'EditImageModal'
    }, {
      name: strings.stories,
      path: '#'
    }];

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        headerChildren={<Breadcrumbs
          className={styles.StoriesListBreadcrumbs}
          noLink
          paths={paths}
          onPathClick={onClick}
        />}
        footerChildren={(<div>
          <Btn
            alt large data-action="switchModal"
            data-path="EditImageModal" onClick={onClick} className={styles.StoriesListBack}
          >
            {strings.back}
          </Btn>
        </div>)}
        onClose={onClose}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          {list.length > 0 && list.map(item => (
            <StoryItem
              key={item.id}
              thumbSize="small"
              onClick={() => {}}
              showThumb
              showAuthor={showAuthor}
              {...item}
            />
          ))}
        </div>
      </Modal>
    );
  }
}
