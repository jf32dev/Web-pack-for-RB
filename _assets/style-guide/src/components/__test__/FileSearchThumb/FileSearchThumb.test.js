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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import { configure, shallow } from 'enzyme';
import FileSearchThumb from 'components/FileSearchThumb/FileSearchThumb';
import stylesClass from 'components/FileSearchThumb/FileSearchThumb.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<FileSearchThumb /> component structure', () => {
  let wrapper;
  let defaultProps;
  before(() => {
    defaultProps = {
      id: 1,
      description: 'BTC Tester'
    };
    wrapper = shallow(<FileSearchThumb {...defaultProps} />);
  });

  it('should render 1 img if thumbnail is present', () => {
    wrapper.setProps({ thumbnail: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' });
    expect(wrapper.find('img').length).to.equal(1);
  });

  it('should not render img if thumbnail is not present', () => {
    wrapper.setProps({ thumbnail: '' });
    expect(wrapper.find('img').length).to.equal(0);
  });

  it('should render icon if thumbnail is not present', () => {
    wrapper.setProps({ thumbnail: '', category: 'app' });
    expect(wrapper.find('div[data-category="app"]').length).to.equal(1);
  });

  it('should render container element', () => {
    expect(wrapper.find(styles.thumbnail)).to.have.lengthOf(1);
  });
});
