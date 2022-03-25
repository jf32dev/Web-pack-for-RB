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
import ProgressBar from 'components/ProgressBar/ProgressBar';
import stylesClass from 'components/ProgressBar/ProgressBar.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<ProgressBar /> basic component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: null,
      completedRecords: 1,
      totalRecords: 1,
      percentage: false,
      action: ''
    };
    wrapper = mount(<ProgressBar {...defaultProps} />);
  });

  it('should render container element', () => {
    expect(wrapper.find(styles.progressContainer)).to.have.lengthOf(1);
  });

  it('should render progress container element', () => {
    expect(wrapper.find(styles.progressText)).to.have.lengthOf(1);
  });

  it('should render two "p" elements', () => {
    expect(wrapper.find(styles.progressText).children('p')).to.have.lengthOf(2);
  });

  it('should render progress bar', () => {
    expect(wrapper.find(styles.progressBar)).to.have.lengthOf(1);
    expect(wrapper.find(styles.progressBar).children(styles.progressBarBackground)).to.have.lengthOf(1);
  });

  it('should have a progress of 100%', () => {
    expect(wrapper.find(styles.progressBarBackground).prop('style')).to.have.property('width').to.equal('100%');
  });
});

describe('<ProgressBar /> props update component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: null,
      completedRecords: null,
      totalRecords: null,
      percentage: false,
      action: ''
    };
    wrapper = mount(<ProgressBar {...defaultProps} />);
  });

  it('should have an incompleted progress bar', () => {
    wrapper.setProps({
      status: 'processing',
      completedRecords: 5,
      totalRecords: 10
    });
    expect(wrapper.find(styles.progressBarBackground).prop('style')).to.have.property('width').to.equal('50%');
  });
});
