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
import sinon from 'sinon';
import ColourPicker from 'components/ColourPicker/ColourPicker';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });

describe('<ColourPicker /> basic component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onChange: sinon.spy(),
      onChangeComplete: sinon.spy(),
      isVisible: true,
      hex: ''
    };

    wrapper = mount(<ColourPicker {...defaultProps} />);
  });

  it('should render colour picker', () => {
    expect(wrapper.find('div.chrome-picker').length).to.equal(1);
  });

  it('should not render colour picker', () => {
    wrapper.setProps({ isVisible: false });
    expect(wrapper.find('div.chrome-picker').length).to.equal(0);
  });
});
