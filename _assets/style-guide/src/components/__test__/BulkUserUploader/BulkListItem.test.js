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
import { configure, mount } from 'enzyme';
import BulkListItem from 'components/BulkListItem/BulkListItem';
import ProgressBar from 'components/ProgressBar/ProgressBar';
import stylesClass from 'components/BulkListItem/BulkListItem.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import moment from 'moment';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<BulkListItem /> basic component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      completedRecords: null,
      errors: [],
      fileName: '',
      id: null,
      status: '',
      totalRecords: null,
      uploadedAt: '',
      user: '',
      strings: {}
    };
    wrapper = mount(<BulkListItem {...defaultProps} />);
  });

  it('should render container element', () => {
    expect(wrapper.find(styles.bulkListItemContainer)).to.have.lengthOf(1);
  });
});

describe('<BulkListItem /> props update component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      completedRecords: null,
      errors: [],
      fileName: '',
      id: null,
      status: '',
      totalRecords: null,
      uploadedAt: '',
      user: '',
      strings: {},
      type: ''
    };
    wrapper = mount(<BulkListItem {...defaultProps} />);
  });

  it('should have a file name', () => {
    wrapper.setProps({ fileName: 'userFile' });
    expect(wrapper.find('p').first().text()).to.equal('userFile');
  });

  it('should have a date and user', () => {
    wrapper.setProps({
      uploadedAt: '2019-09-09T04:09:45+00:00',
      user: 'Super User'
    });
    expect(wrapper.find('p').at(1).text()).to.equal(`${moment('2019-09-09T04:09:45+00:00').format('DD MMM YYYY hh:mm A')} - Super User`);
  });

  it('should have a processing status', () => {
    wrapper.setProps({
      type: 'user_import',
      status: 'pending',
      strings: { importingUsers: 'Importing users...' }
    });
    expect(wrapper.find('p').at(2).text()).to.equal('Importing users...');
  });

  it('should have a completed status', () => {
    wrapper.setProps({
      status: 'completed',
      strings: { viewResults: 'View Results' }
    });
    expect(wrapper.find('a').text()).to.equal('View Results');
  });

  it('should render a progress bar', () => {
    wrapper.setProps({ status: 'pending' });
    expect(wrapper.find(ProgressBar)).to.have.lengthOf(1);
  });
});
