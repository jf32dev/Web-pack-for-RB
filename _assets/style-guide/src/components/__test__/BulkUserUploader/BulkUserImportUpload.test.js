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
import sinon from 'sinon';
import BulkUserImportUpload from 'components/BulkUserImportUpload/BulkUserImportUpload';
import Dropzone from 'react-dropzone';
import Blankslate from 'components/Blankslate/Blankslate';
import FileItem from 'components/FileItem/FileItem';
import Btn from 'components/Btn/Btn';
import stylesClass from 'components/BulkUserImportUpload/BulkUserImportUpload.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

const defaultProps = {
  onFileDropAccepted: sinon.spy(),
  onSampleCsvClick: sinon.spy(),
  handleBrowseClick: sinon.spy(),
  showSampleFiles: false,
  strings: {}
};

const wrapper = mountWithIntl(<BulkUserImportUpload {...defaultProps} />);

describe('<BulkUserImportUpload /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.bulkUserImportUploadContainer)).to.have.lengthOf(1);
  });

  it('should render one Dropzone component', () => {
    expect(wrapper.find(Dropzone)).to.have.lengthOf(1);
  });

  it('should render one Blankslate component', () => {
    expect(wrapper.find(Blankslate)).to.have.lengthOf(1);
  });

  it('should render one FileItem component', () => {
    expect(wrapper.find(FileItem)).to.have.lengthOf(1);
  });

  it('should render one Btn component', () => {
    expect(wrapper.find(Btn)).to.have.lengthOf(1);
  });
});

describe('<BulkUserImportUpload /> props update component structure', () => {
  it('should render two "p" elements', () => {
    wrapper.setProps({ showSampleFiles: true });
    expect(wrapper.find('p')).to.have.lengthOf(2);
  });
  it('should render download heading', () => {
    wrapper.setProps({ strings: { downloadSampleCSV: 'Download sample CSV' } });
    expect(wrapper.find('p').at(0).text()).to.equal('Download sample CSV');
  });

  it('should render download sample heading', () => {
    wrapper.setProps({ strings: { sample: 'Sample' } });
    expect(wrapper.find('p').at(1).text()).to.equal('Sample');
  });
});

describe('<BulkUserImportUpload /> props functions', () => {
  it('should simulate click and call onSampleCsvClick()', () => {
    wrapper.find('span').last().simulate('click');
    expect(defaultProps.onSampleCsvClick.callCount).to.equal(1);
  });
});
