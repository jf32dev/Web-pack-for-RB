import PropTypes from 'prop-types';
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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';

import CustomAppsList from './CustomAppsList';
import CustomAppsEdit from './CustomAppsEdit';

const LIST = 'list';
const EDIT = 'edit';
const KEY = 'key';

export default class AdminCustomApps extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    /** Custom SMTP Server true or false */
    view: PropTypes.oneOf([LIST, EDIT]),

    user: PropTypes.object,

    client: PropTypes.object,

    scopes: PropTypes.object,

    onEdit: PropTypes.func,

    onCreate: PropTypes.func,

    onSave: PropTypes.func,

    onRemove: PropTypes.func,

    onChangeUser: PropTypes.func,

    onCopyError: PropTypes.func,

    onCopySuccess: PropTypes.func,

    //pagination
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool,
    isLoadingMore: PropTypes.bool,
    isComplete: PropTypes.bool,
    error: PropTypes.object,
    onGetList: PropTypes.func,

    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    view: LIST,
    list: [],
  };

  render() {
    const {
      view,
      onCreate,
      onEdit,
      list,
      user,
      strings,
      onEditCancel,
      onChangeUser,
      onRemove,
      scopes,
      onSave,
      client,
      //pagination
      isLoaded,
      isLoading,
      isLoadingMore,
      isComplete,
      error,
      onGetList,
    } = this.props;

    const styles = require('./AdminCustomApps.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CustomApps: true,
      list: view === LIST,
      center: list.length === 0 && view === LIST
    }, this.props.className);

    return (
      <div className={classes} style={this.props.style}>
        {view === LIST && <CustomAppsList
          list={list}
          onCreate={onCreate}
          onEdit={onEdit}
          strings={strings}
          onRemove={onRemove}
          isLoaded={isLoaded}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          isComplete={isComplete}
          error={error}
          onGetList={onGetList}
        />}
        {view === EDIT && <CustomAppsEdit
          user={user}
          error={error}
          scopes={scopes}
          strings={strings}
          onCopyError={this.props.onCopyError}
          onCopySuccess={this.props.onCopySuccess}
          onCancel={onEditCancel}
          onSave={onSave}
          views={[EDIT, KEY]}
          client={client}
          onChangeUser={onChangeUser}
        />}
      </div>
    );
  }
}
