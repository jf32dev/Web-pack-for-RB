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
 * @package hub-web-app-v5
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React from 'react';
import { configure } from 'enzyme';
import BulkUserImportUploadProgress from 'components/BulkUserImportUploadProgress/BulkUserImportUploadProgress';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import FileItem from 'components/FileItem/FileItem';
import stylesClass from 'components/BulkUserImportUploadProgress/BulkUserImportUploadProgress.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<BulkUserImportUploadProgress /> basic component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      strings: {},
      currentFileName: ''
    };
    wrapper = mountWithIntl(<BulkUserImportUploadProgress {...defaultProps} />);
  });

  it('should render container element', () => {
    expect(wrapper.find(styles.uploadProgressContainer)).to.have.lengthOf(1);
  });

  it('should render one FileItem component', () => {
    expect(wrapper.find(FileItem)).to.have.lengthOf(1);
  });

  it('should render one ProgressBar component', () => {
    expect(wrapper.find(ProgressBar)).to.have.lengthOf(1);
  });
});

describe('<BulkUserImportUpload /> props update component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      strings: {},
      currentFileName: ''
    };
    wrapper = mountWithIntl(<BulkUserImportUploadProgress {...defaultProps} />);
  });

  it('should have file name', () => {
    wrapper.setProps({ currentFileName: 'testing.csv' });
    expect(wrapper.find('p').first().text()).to.equal('testing.csv');
  });
});
