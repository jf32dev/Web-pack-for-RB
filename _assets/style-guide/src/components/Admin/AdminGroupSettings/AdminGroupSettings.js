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

import Btn from 'components/Btn/Btn';
import RadioGroup from 'components/RadioGroup/RadioGroup';

/**
 * Displays Admin Group's settings.
 */
export default class AdminGroupSettings extends PureComponent {
  static propTypes = {
    /** Valid ChannelItem data */
    group: PropTypes.object.isRequired,

    strings: PropTypes.object,

    showRemove: PropTypes.bool,
    showSave: PropTypes.bool,
    isLoading: PropTypes.bool,

    onSaveClick: function(props) {
      if (props.showSave && typeof props.onSaveClick !== 'function') {
        return new Error('onSaveClick is required when showSave is provided.');
      }
      return null;
    },

    onRemoveClick: function(props) {
      if (props.showRemove && typeof props.onRemoveClick !== 'function') {
        return new Error('onRemoveClick is required when showRemove is provided.');
      }
      return null;
    },

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    strings: {
      removeChannel: 'Remove Group',
      view: 'View',
      publish: 'Publish',
      viewAndPublish: 'View & Publish',
      viewAndEdit: 'View & Edit',
      save: 'Save',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isSaveEnabled: false,
      permissions: props.group.permissions
    };
    autobind(this);
    this.container = null;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.group.permissions && nextProps.group.permissions !== this.props.group.permissions) {
      this.setState({
        permissions: nextProps.group.permissions
      });
    }
  }

  handleStopPropagation(event) {
    const componentContainer = this.container;

    // Avoid to close on click within modal
    if (componentContainer && componentContainer.contains(event.target) && componentContainer !== event.target) {
      event.stopPropagation();
    }
  }

  handleOnChange(event) {
    this.setState({
      permissions: event.currentTarget.value,
      isSaveEnabled: true
    });
  }

  handleSaveClick(e) {
    this.setState({ isSaveEnabled: false });
    if (typeof this.props.onSaveClick === 'function') {
      this.props.onSaveClick(e, {
        ...this.props.group,
        permissions: this.state.permissions
      });
    }
  }

  handleRemoveClick(e) {
    if (typeof this.props.onRemoveClick === 'function') {
      this.props.onRemoveClick(e, this.props);
    }
  }

  render() {
    const {
      group,
      strings,
      showRemove,
      showSave,
      isLoading,
      className,
      style
    } = this.props;
    const { permissions } = this.state;
    const styles = require('./AdminGroupSettings.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      GroupSettings: true
    }, className);

    const hasAction = showSave;
    const permissionOptions = [{
      label: strings.view,
      value: 1,
    }, {
      label: strings.publish,
      value: 2,
    }, {
      label: strings.viewAndPublish,
      value: 3
    }, {
      label: strings.viewAndEdit,
      value: 9
    }];

    return (
      <div
        ref={(c) => { this.container = c; }} className={classes} style={style}
        onClick={this.handleStopPropagation}
      >
        {showRemove && <div className={styles.removeWrap}>
          <Btn
            warning
            loading={isLoading}
            onClick={this.handleRemoveClick}
          >{strings.removeChannel}</Btn>
        </div>}
        {group.notes && <div className={styles.detailWrap}>
          {group.notes}
        </div>}
        {hasAction && <RadioGroup
          name={'groupItem-' + group.id}
          selectedValue={parseInt(permissions, 10)}
          options={permissionOptions}
          onChange={this.handleOnChange}
          className={styles.radioGroup}
        />}
        {showSave && <div className={styles.saveWrap}>
          <Btn
            inverted
            large
            loading={isLoading}
            disabled={!this.state.isSaveEnabled}
            onClick={this.handleSaveClick}
          >
            {strings.save}
          </Btn>
        </div>}
      </div>
    );
  }
}
