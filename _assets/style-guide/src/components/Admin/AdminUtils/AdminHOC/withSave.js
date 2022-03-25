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
import React, { PureComponent, Fragment } from 'react';
import autobind from 'class-autobind';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import _lowerFirst from 'lodash/lowerFirst';
import _upperFirst from 'lodash/upperFirst';
import _transform from 'lodash/transform';
import _isObject from 'lodash/isObject';
import _isEqual from 'lodash/isEqual';

import AdminPrompt from '../AdminPrompt/AdminPrompt';
import { FormattedMessage } from 'react-intl';

/**
 * All the post(create), put(update), delete method need to follow the crud rules.
 *
 * for example:
 * {
 *  dataName1: 1,
 *  dataName2: 2,
 *  tableName: [],
 *  }
 * put({dataName: 1}),
 * putTableName({ ...tableObject }),
 * postTableName({ ...tableObject }),
 * deleteTableName(id),
 *
 * all the method would ignore the second param to format the data, so use second param if the method is ware
 */

function difference(arg1, arg2) {
  function changes(object, base) {
    return _transform(object, function(resultArg, value, key) {
      const result = resultArg;
      const valueStr = typeof value === 'number' ? value + '' : value;
      const baseStr = typeof base[key] === 'number' ? base[key] + '' : base[key];

      if (!_isEqual(valueStr, baseStr)) {
        result[key] = (_isObject(value) && _isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(arg1, arg2);
}

const withSave = Com =>
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        changes: {},
        defaults: Object.keys(props).filter(key => typeof props[key] !== 'function').reduce((accumulator, key) => ({
          ...accumulator,
          [key]: props[key]
        }), {}),
        requests: []
      };

      autobind(this);

      this.methods = Object.keys(props).filter(key => typeof props[key] === 'function').reduce((accumulator, key) => ({
        ...accumulator,
        [key]: (...item) => this.handleMethods(key, ...item)
      }), {
        onExecute: this.handleExecute
      });

      this.maxIds = {};
      this.isSaving = false;
      this.first = 1;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const newValues = Object.keys(nextProps).filter(key => typeof nextProps[key] !== 'function').reduce((accumulator, key) => ({
        ...accumulator,
        [key]: nextProps[key]
      }), {});
      if (!_isEmpty(this.state.changes) && this.isSaving) {
        if (!_get(nextProps, 'error', false) &&
            _isEmpty(difference(this.removeIds({ ...newValues, ...this.state.changes }), this.removeIds(newValues)))) {
          const saveSuccessMessage = (<FormattedMessage
            id="save-success-message"
            defaultMessage="Saved"
          />);

          this.props.createPrompt({
            id: 'security-success',
            type: 'success',
            title: 'success',
            message: saveSuccessMessage,
            dismissible: true,
            autoDismiss: 5
          });

          this.setState({
            changes: {},
          });
        }
        /*
        * init all the values
        * */
        this.setState({
          requests: []
        });
        this.maxIds = {};

        this.isSaving = false;
      }

      if (window.location.pathname.indexOf('/admin') < 0) {
        this.setState({
          changes: {},
        });
        this.setState({
          requests: []
        });
        this.maxIds = {};

        this.isSaving = false;
      }

      this.setState({
        defaults: newValues
      });
    }

    handleExecute() {
      this.isSaving = true;
      const fire = this.state.requests.reduce((accumulator, item) => {
        const methodName = Object.keys(item)[0];
        const cudKey = ['put', 'post', 'delete'].find(str => methodName.startsWith(str));
        const tableName = _lowerFirst(methodName.substring(cudKey.length));
        const [currentUpdatedArg, ...rest] = item[methodName];
        const maxId = +this.maxIds[tableName] || 0;

        //delete method array item
        if (cudKey === 'delete') {
          const itemId = +currentUpdatedArg;
          if (maxId - itemId < 0) {
            const newIndex = itemId - maxId - this.first;
            return [
              ...accumulator.map((obj, i) => (+i === +newIndex ? {} : obj)),
              {},
            ];
          }

          const deleteIndex = accumulator.findIndex(obj => +_get(obj, `put${_upperFirst(tableName)}.id`, -1) === +itemId);

          if (deleteIndex > -1) {
            return [
              ...accumulator.map((obj, i) => (i === +deleteIndex ? {} : obj)),
              item,
            ];
          }
        }

        if (cudKey === 'put') {
          if (methodName !== 'put') {
            const itemId = +currentUpdatedArg.id;
            /**
             * update post list method.
             */
            if (maxId - itemId < 0) {
              const newIndex = itemId - maxId - this.first;
              const removeIdItem = Object.keys(currentUpdatedArg).reduce((acc, key) => (
                key === 'id' ? acc : {
                  ...acc,
                  [key]: currentUpdatedArg[key]
                }
              ), {});

              return [
                ...accumulator.map((obj, i) => (i === +newIndex ? {
                  ['post' + _upperFirst(tableName)]: [removeIdItem, ...rest]
                } : obj)),
                {},
              ];
              /**
               * update put list method.
               */
            } else if (maxId - itemId >= 0) {
              const newIndex = accumulator.findIndex(obj => +_get(obj, `${methodName}.0.id`, -1) === itemId);

              if (newIndex > -1) {
                return [
                  ...accumulator.map((obj, i) => (i === newIndex ? item : obj)),
                  {},
                ];
              }
            }
          } else if (methodName === 'put') {
            /**
             * if update the updated exist key and value, replace the new value with updated exist value.
             */
            const newIndex = accumulator.findIndex(obj => obj[methodName] && Object.keys(obj[methodName][0])[0] === Object.keys(currentUpdatedArg)[0]);

            if (newIndex > -1) {
              return [
                ...accumulator.map((obj, i) => (i === newIndex ? item : obj)),
                {},
              ];
            }
          }
        }

        return [
          ...accumulator,
          item,
        ];
      }, []);
      fire.forEach(item => {
        if (!_isEmpty(item)) {
          const methodName = Object.keys(item)[0];
          this.props[methodName](...item[methodName]);
        }
      });
    }

    updateValues(key, arg, cudKey) {
      const { changes, defaults } = this.state;
      const old = {
        ...defaults,
        ...changes
      };

      let updatedItem = {};
      const tableName = _lowerFirst(key.substring(cudKey.length));
      const oldTable = old[tableName] || [];

      if (tableName.length > 0 && !Object.prototype.hasOwnProperty.call(this.maxIds, tableName)) {
        this.maxIds[tableName] = oldTable.length > 0 ? Math.max(...oldTable.map(item => item.id)) : 0;
      }

      if (cudKey === 'put') {
        if (tableName.length > 0) {
          updatedItem = {
            [tableName]: oldTable.map(item => (+item.id === +arg.id ? arg : item))
          };
        } else {
          updatedItem = arg;
        }
      } else if (cudKey === 'post') {
        updatedItem = {
          [tableName]: oldTable.concat({
            ...arg,
            id: this.maxIds[tableName] + this.state.requests.length + this.first,
          })
        };
      } else if (cudKey === 'delete') {
        updatedItem = {
          [tableName]: oldTable.filter(item => +item.id !== +arg)
        };
      }

      return {
        ...changes,
        ...updatedItem,
      };
    }

    removeIds(obj) {
      return Object.keys(obj).reduce((accumulator, key) => {
        if (Array.isArray(obj[key])) {
          return {
            ...accumulator,
            [key]: this.removeArrayIds(obj[key])
          };
        }

        return {
          ...accumulator,
          [key]: obj[key]
        };
      }, {});
    }

    removeArrayIds(arr) {
      return arr.map(item => {
        if (item !== null && typeof item === 'object') {
          return Object.keys(item).reduce((accumulator, key) => {
            if (key === 'id') {
              return {
                ...accumulator,
              };
            }

            if (Array.isArray(item[key])) {
              return {
                ...accumulator,
                [key]: this.removeArrayIds(item[key])
              };
            }

            return {
              ...accumulator,
              [key]: item[key]
            };
          }, {});
        }

        return item;
      });
    }

    handleMethods(key, ...args) {
      const cudKey = ['put', 'post', 'delete'].find(item => key.startsWith(item));
      if (cudKey) {
        this.setState({
          changes: this.updateValues(key, args[0], cudKey),
          requests: this.state.requests.concat({
            [key]: args
          })
        });
      } else {
        this.props[key](...args);
      }
    }

    render() {
      const values = {
        ...this.state.defaults,
        ...this.state.changes,
      };
      const executeDisabled = _isEmpty(difference(this.removeIds(this.state.defaults), this.removeIds(values))) || _isEmpty(this.state.requests);
      return (
        <Fragment>
          <Com {...values} {...this.methods} executeDisabled={executeDisabled} />
          {window.location.pathname.indexOf('/admin') > -1 && <AdminPrompt isDifferent={!executeDisabled} />}
        </Fragment>
      );
    }
  };

export default withSave;
