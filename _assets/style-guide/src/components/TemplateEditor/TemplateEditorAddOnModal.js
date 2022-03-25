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

import Modal from 'components/Modal/Modal';
import List from 'components/List/List';
import Text from 'components/Text/Text';

/**
 * TemplateEditorAddOnModal description
 */
export default class TemplateEditorAddOnModal extends PureComponent {
  static propTypes = {
    /** BTCA files available for use in Template */
    addOns: PropTypes.array,

    strings: PropTypes.object,

    onAddClick: PropTypes.func,

    onClose: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    list: [],
    authString: '',
    strings: {
      noAddOnsAvailable: 'No Add-Ons Available',
      noAddOnsMessage: 'Upload your Add-Ons in Home Screen Administration',
      selectAddOn: 'Select Add-On',
      searchAddOns: 'Search Add-Ons'
    }
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      filtered: props.addOns || [],
      searchValue: ''
    };
  }

  handleSearchChange(event) {
    const val = event.currentTarget.value;
    const filtered = this.props.addOns.filter(obj => obj.description.indexOf(val) > -1);

    this.setState({
      filtered: filtered,
      searchValue: val
    });
  }

  render() {
    const { strings } = this.props;
    const styles = require('./TemplateEditorAddOnModal.less');

    return (
      <Modal
        isVisible={this.props.isVisible}
        headerTitle={strings.selectAddOn}
        escClosesModal
        headerCloseButton
        width="small"
        onClose={this.props.onClose}
        bodyClassName={styles.modalBody}
      >
        <Text
          placeholder={strings.searchAddOns}
          icon="search"
          value={this.state.searchValue}
          onChange={this.handleSearchChange}
          className={styles.search}
        />
        <List
          list={this.state.filtered}
          icon="app"
          emptyHeading={strings.noAddOnsAvailable}
          emptyMessage={strings.noAddOnsMessage}
          itemProps={{
            thumbSize: 'small',
            hideMeta: true,
            className: styles.listItem
          }}
          onItemClick={this.props.onAddClick}
        />
      </Modal>
    );
  }
}
