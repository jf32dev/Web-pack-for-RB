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
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import { defineMessages, FormattedMessage } from 'react-intl';
import generateStrings from 'helpers/generateStrings';

import Btn from 'components/Btn/Btn';
import GroupItem from 'components/GroupItem/GroupItem';
import Select from 'components/Select/Select';

const messages = defineMessages({
  cancel: { id: 'cancel', defaultMessage: 'Cancel' },
  view: { id: 'view', defaultMessage: 'View' },
  publish: { id: 'publish', defaultMessage: 'Publish' },
  viewAndPublish: { id: 'view-and-publish', defaultMessage: 'View & Publish' },
  viewAndEdit: { id: 'view-and-edit', defaultMessage: 'View & Edit' },
  addGroups: { id: 'add-groups', defaultMessage: 'Add groups' },
});

/**
 * Displays when adding groups into a channel.
 */
export default class AdminGroupAdd extends PureComponent {
  static propTypes = {
    /** Valid GroupItem array */
    list: PropTypes.array.isRequired,

    strings: PropTypes.object,

    showAdd: PropTypes.bool,
    isLoading: PropTypes.bool,

    onAddClick: function(props) {
      if (props.showAdd && typeof props.onAddClick !== 'function') {
        return new Error('onAddClick is required when showAdd is provided.');
      }
      return null;
    },

    onCancel: PropTypes.func,
    onChange: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
  };


  static contextTypes = {
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleStopPropagation(event) {
    event.stopPropagation();
  }

  handleOnChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e, this.props);
    }
  }

  handleAddClick(e) {
    if (typeof this.props.onAddClick === 'function') {
      this.props.onAddClick(e, this.props);
    }
  }

  handleGroupClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handlePermissionChange(context) {
    // Propagate event if clicking anchor
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(null, context);
    }
  }

  render() {
    const {
      list,
      showAdd,
      isLoading,
      className,
      style
    } = this.props;

    const { formatMessage } = this.context.intl;
    const strings = generateStrings(messages, formatMessage);

    const styles = require('./AdminGroupAdd.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      GroupSettings: true
    }, className);

    return (
      <div className={classes} style={style} onClick={this.handleStopPropagation}>
        <div className={styles.headerWrap}>
          <span className={styles.headerCounter}>{
            <FormattedMessage
              id="adding-n-groups"
              defaultMessage="{count, plural, one {Adding # group} other {Adding # groups}}"
              values={{ count: list.length }}
            />
          }</span>
          <span className={styles.actions} onClick={this.props.onCancel}>{strings.cancel}</span>
        </div>
        <div className={styles.itemListing}>
          {list.map((group) => {
            const customPermissionGroup = [
              { id: 1, name: strings.view, group: group },
              { id: 2, name: strings.publish, group: group },
              { id: 3, name: strings.viewAndPublish, group: group },
              { id: 9, name: strings.viewAndEdit, group: group },
            ];
            const permission = group.permissions || 1;
            const groupSelected = customPermissionGroup.find((obj) => obj.id === permission);

            return (<div className={styles.detailWrap} key={'group-' + group.id}>
              <GroupItem
                thumbSize="small"
                grid={false}
                showThumb
                className={styles.groupItem}
                onClick={this.handleGroupClick}
                {...group}
              />
              <Select
                name="permissions"
                value={{ id: groupSelected.id, name: groupSelected.name }}
                clearable={false}
                options={customPermissionGroup}
                onChange={this.handlePermissionChange}
                className={styles.select}
                valueKey="id"
                labelKey="name"
              />
            </div>);
          })}
        </div>
        {showAdd && <div className={styles.saveWrap}>
          <Btn
            inverted
            large
            loading={isLoading}
            onClick={this.handleAddClick}
          >
            {strings.addGroups}
          </Btn>
        </div>}
      </div>
    );
  }
}
