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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';

import Btn from 'components/Btn/Btn';
import Modal from 'components/Modal/Modal';
import Text from 'components/Text/Text';
import SelectInput from './SelectInput';
import GroupList from 'components/Admin/AdminUtils/GroupList/GroupList';
import RadioGroup from 'components/RadioGroup/RadioGroup';

/**
 * Restriction Edit modal to create or update a restriction
 */
export default class RestrictionsModal extends PureComponent {
  static propTypes = {
    /** show modal */
    isVisible: PropTypes.bool,
    /** close modal callback */
    onClose: PropTypes.func,

    /** restriction name */
    name: PropTypes.string,

    /** restriction type: whitlist or blacklist */
    type: PropTypes.string,

    /** groupList placeHolder */
    groupListPlaceHolder: PropTypes.string,

    /** restriction matches list */
    items: PropTypes.array,

    /** restriction groups */
    groups: PropTypes.array,

    /** all restriction groups, would display when clicking the input box */
    allGroupList: PropTypes.array,

    /** click event for clicking the grouplist component */
    onGroupListClick: PropTypes.func,

    /** input event for the grouplist component search */
    onGroupSearchChange: PropTypes.func,

    /** let the parent know it need to save the changes */
    onSave: PropTypes.func,

    /** Pass all strings as an object */
    strings: PropTypes.object,

    onScroll: PropTypes.func,

    loadingMore: PropTypes.bool,

    loading: PropTypes.bool,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    items: [],
    name: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      disabled: props.name === ''
    };
    autobind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.setState({
        disabled: nextProps.name === ''
      });
    }
  }

  handleChange(e) {
    const { type, name, value, id } = e.currentTarget;
    let update = {};
    if (type === 'text') {
      update = {
        [name]: value
      };
    } else if (type === 'radio') {
      const keyValue = id.split('-');
      update = {
        [keyValue[0]]: value
      };
    }

    if (name === 'name') {
      this.setState({
        disabled: value === ''
      });
    }

    this.updateValue(update);
  }

  handleSelectInputAdd({ option, value }) {
    this.updateValue({
      action: 'add',
      items: { type: option, match: value }
    });
  }

  handleSelectInputRemove(id) {
    this.updateValue({
      action: 'remove',
      items: { id }
    });
  }

  updateValue(update) {
    const { onChange } = this.props;
    if (onChange && typeof onChange === 'function') {
      onChange(update);
    }
  }

  render() {
    const styles = require('./RestrictionsModal.less');
    const {
      isVisible,
      onClose,
      strings,
      className,
      name,
      type,
      items,
      groups,
      allGroupList,
      onAddGroupItem,
      onRemoveGroupItem,
      onGroupSearchChange,
      onSave,
      loadingMore,
      loading,
      groupListPlaceHolder,
    } = this.props;
    const cx = classNames.bind(styles);
    const classes = cx({
      RestrictionsModal: true
    }, className);

    return (
      <Modal
        isVisible={isVisible}
        backdropClosesModal
        escClosesModal
        onClose={onClose}
        headerChildren={<p style={{ fontSize: '1.2rem', margin: 0 }}>{strings.createBrowserRestriction}</p>}
        footerChildren={(<div>
          <Btn
            alt large onClick={onClose}
            style={{ marginRight: '0.5rem' }}
          >{strings.cancel}</Btn>
          <Btn
            inverted large onClick={onSave}
            disabled={this.state.disabled} data-action="confirm" data-name="device"
            style={{ marginLeft: '0.5rem' }}
          >
            {strings.save}
          </Btn>
        </div>)}
      >
        <div style={{ padding: '1rem 1.5rem' }} className={classes}>
          <table cellSpacing="0" cellPadding="0" className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.restrictionName}>{strings.restrictionName}</td>
                <td>
                  <Text
                    id="name"
                    className={styles.input}
                    name="name"
                    defaultValue={name || ''}
                    onChange={this.handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td>{strings.restrictionType}</td>
                <td>
                  <RadioGroup
                    name="type"
                    selectedValue={type || 'whitelist'}
                    onChange={this.handleChange}
                    className={styles.radio}
                    options={[{
                      label: strings.allowlist,
                      value: 'whitelist'
                    }, {
                      label: strings.denylist,
                      value: 'blacklist'
                    }]}
                  />
                </td>
              </tr>
              <tr>
                <td>{strings.matches}</td>
                <td className={styles.selectedInputTd}>
                  <SelectInput
                    options={[{
                      label: strings.domain,
                      value: 'domain',
                      placeHolder: `${strings.eg}: awebsite.co`
                    }, {
                      label: strings.scheme,
                      value: 'scheme',
                      placeHolder: `${strings.eg}: ftp`
                    }, {
                      label: strings.url,
                      value: 'url',
                      placeHolder: `${strings.eg}: http://www.full_domain.com`
                    }]}
                    list={items.map((item, i) => ({
                      id: i,
                      option: item.type,
                      value: item.match
                    }))}
                    btnLabel={strings.add}
                    onAdd={this.handleSelectInputAdd}
                    onRemove={this.handleSelectInputRemove}
                  />
                </td>
              </tr>
              <tr>
                <td className={styles.stringsGroupList}>{strings.groupList}</td>
                <td>
                  <GroupList
                    className={styles.groupList}
                    activeGroups={groups.map(item => ({
                      id: item.id,
                      colour: item.colour || item.defaultColour,
                      isSelected: item.isSelected,
                      name: item.name,
                      thumbnail: item.thumbnail,
                      type: item.type,
                      childCount: item.childCount || item.usersCount,
                    }))}
                    all={allGroupList}
                    placeholder={groupListPlaceHolder}
                    onScroll={this.props.onScroll}
                    loading={loading}
                    loadingMore={loadingMore}
                    onAddGroupItem={onAddGroupItem}
                    onRemoveGroupItem={onRemoveGroupItem}
                    onSearchInputChange={onGroupSearchChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Modal>
    );
  }
}
