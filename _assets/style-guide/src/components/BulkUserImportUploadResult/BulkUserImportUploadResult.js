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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'class-autobind';
import classNames from 'classnames/bind';
import Accordion from '../Accordion/Accordion';
import Select from '../Select/Select';

import ComponentItem from 'views/ComponentItem';

export default class BulkUserImportUploadResult extends Component {
  static propTypes = {
    currentFileName: PropTypes.string,
    strings: PropTypes.object,
    completedRecords: PropTypes.number,
    totalRecords: PropTypes.number,
    resultRecord: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      activeList: {
        label: '(' + props.strings.showAll + ')',
        value: ''
      }
    };
    autobind(this);
  }

  handleFilterListChange(value) {
    return this.setState({
      activeList: value
    });
  }

  handleDownload() {
    console.log('Not implemented');
  }

  render() {
    const {
      strings,
      resultRecord,
      type
    } = this.props;
    const styles = require('./BulkUserImportUploadResult.less');
    const cx = classNames.bind(styles);

    const isUserImport = type === 'user_import';

    const errorListStyles = cx({
      errorList: isUserImport,
      metadataErrorList: !isUserImport
    }, this.props.className);

    let errorList = null;
    let errorProps = [];

    let resultContainerClass = styles.uploadResultContainer;

    if (resultRecord.errors && resultRecord.errors.length > 0) {
      resultContainerClass = [styles.uploadResultContainer, styles.hasErrors].join(' ');
      errorProps = resultRecord.errors.reduce((props, err) => {
        // api returns errors in different formats for 'Bulk user upload' and 'Bulk metadata upload'. Bulk user upload has props.type of 'user_import'. Bulk metadata has props.type of 'user_metadata_import'
        if (isUserImport) {
          err.details.forEach(det => {
            const prop = det.property || `(${strings.moreDetails})`;
            if (!props.find(itm => itm.value === prop)) {
              props.push({
                value: prop,
                label: prop
              });
            }
          });
        } else {
          const prop = err.message || `(${strings.moreDetails})`;
          if (!props.find(itm => itm.value === prop)) {
            props.push({
              value: prop,
              label: prop
            });
          }
        }
        return props;
      }, [{
        label: `(${strings.showAll})`,
        value: ''
      }]);

      errorList = resultRecord.errors.map((error, errIdx) => {
        let errorTitles = [];
        if (isUserImport) {
          errorTitles = error.details.reduce((props, err) => {
            const prop = err.property || `(${strings.moreDetails})`;

            if (props.indexOf(prop) < 0) {
              props.push(prop);
            }
            return props;
          }, []);
        } else {
          errorTitles.push(error.message || `(${strings.moreDetails})`);
        }

        if (this.state.activeList && this.state.activeList.value && errorTitles.indexOf(this.state.activeList.value) < 0) {
          return null;
        }

        return (
          <li
            className={errorListStyles}
            key={'error-' + errIdx}
          >
            <div className={styles.resultRowTitle}>{strings.row} {error.row || error.line}</div>
            {isUserImport && <Accordion
              title={errorTitles.join(', ')}
              className={styles.resultAccordion}
            >
              <ul>
                {error.details.map((detail, detailIdx) => (
                  <li key={'detail-' + detailIdx}>
                    <div>
                      <span><b>{detail.property}</b> {detail.message}</span>
                      <span className={styles.errorValue}>{detail.value ? `"${detail.value}"` : ''}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Accordion>}
            {!isUserImport && <div>{error.message}</div>}
          </li>
        );
      });
    }

    return (
      <div className={resultContainerClass}>
        {/* Hide this until api for download errors is ready */}
        {/* {resultRecord.errors && resultRecord.errors.length > 0 &&
          <a onClick={this.handleDownload} className={styles.downloadButton}>{isUserImport ? strings.downloadUserErrors : strings.downloadMetadataErrors}</a>
        } */}
        <p className={styles.importStatus}>{isUserImport ? strings.importedUsers : strings.importedUsersMetadata}.</p>
        <p className={styles.importStatus}>{isUserImport ? strings.failedImportedUsers : strings.failedImportedUsersMetadata}.</p>
        {resultRecord.errors && resultRecord.errors.length > 0 && <ul>
          <li className={styles.errorHeader}>
            <span>{strings.row} #</span>
            <Select
              id="list-sources"
              name="activeList"
              label={strings.filterErrors}
              clearable={false}
              options={errorProps}
              value={this.state.activeList}
              className={styles.filterSelect}
              onChange={this.handleFilterListChange}
            />
          </li>
          <ComponentItem style={{ height: '22rem', overflow: 'auto', position: 'relative' }}>
            {errorList}
          </ComponentItem>
        </ul>}
      </div>
    );
  }
}
