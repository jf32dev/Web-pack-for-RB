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
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Btn from 'components/Btn/Btn';
import Blankslate from 'components/Blankslate/Blankslate';
import SVGIcon from 'components/SVGIcon/SVGIcon';
import FormField from 'components/Admin/AdminUtils/FormField/FormField';
import TriggerList from 'components/TriggerList/TriggerList';

const NEW = 'new';
const AppItem = ({ name, strings, authMethod, id, onEdit, onRemove }) => (
  <div>
    <div>{name}</div>
    <div>{authMethod === 'api_key' ? strings.serverAuthentication : strings.userAuthentication}</div>
    <div>
      <Btn
        data-id={id}
        data-action="edit"
        borderless
        inverted
        onClick={onEdit}
      >
        {strings.edit}
      </Btn>
      <Btn
        data-id={id}
        data-action="delete"
        borderless
        warning
        small
        onClick={onRemove}
      >
        {strings.delete}
      </Btn>
    </div>
  </div>
);
/**
 * Admin Custom Apps
 */
export default class CustomAppsList extends PureComponent {
  static propTypes = {
    /** Pass all strings as an object */
    strings: PropTypes.object,

    list: PropTypes.array,

    /** Custom SMTP Server true or false */
    onCreate: PropTypes.func,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,

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
    strings: {
      noApplications: 'No Applications',
      noApplicationsInfo: 'You don’t have any applications. Click to add an app.',
      addApplication: 'Add Application',
      application: 'Application',
      authType: 'Auth type',
      edit: 'Edit',
      delete: 'Delete',
      userAuthentication: 'User Authentication',
      serverAuthentication: 'Server Authentication'
    },
    list: []
  };

  render() {
    const {
      strings,
      list,
      className,
      onCreate,
      onEdit,
      onRemove,
      style,
      //pagination
      isLoaded,
      isLoading,
      isLoadingMore,
      isComplete,
      error,
      onGetList,
    } = this.props;

    const styles = require('./CustomAppsList.less');
    const cx = classNames.bind(styles);
    const classes = cx({
      CustomApps: true,
      List: true,
    }, className);

    return (
      <div className={classes} style={style}>
        {list.length === 0 && <Blankslate
          icon={<SVGIcon type="noApplications" style={{ width: '18rem' }} />}
          heading={strings.noApplications}
          message={strings.noApplicationsInfo}
        >
          <Btn
            small onClick={onCreate} inverted
            data-id={NEW}
          >{strings.addApplication}</Btn>
        </Blankslate>}
        <div className={list.length === 0 ? styles.displayNone : ''}>
          <FormField
            type="create"
            label={strings.addApplication}
            className={styles.addApplication}
            dataKey="addApplication"
            onChange={onCreate}
          />
          <header className={styles.header}>
            <ul>
              {['application', 'authType'].map(item => (
                <li
                  key={item}
                >
                  <span
                    data-key={item}
                    data-action="sort"
                    onClick={this.handleChange}
                  >
                    {strings[item]}
                  </span>
                </li>
              ))}
              <li />
            </ul>
          </header>
          <TriggerList
            list={list}
            isLoaded={isLoaded}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            isComplete={isComplete}
            error={error}
            onGetList={onGetList}
            listProps={{
              itemComponent: AppItem,
              onItemClick: () => {},
              thumbSize: 'small',
              itemProps: {
                strings,
                onRemove,
                onEdit,
              },
            }}
            emptyHeading={strings.emptyHeading}
            emptyMessage={strings.emptyMessage}
          />
        </div>
      </div>
    );
  }
}
