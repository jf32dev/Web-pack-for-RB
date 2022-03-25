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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import React from 'react';
import { expect } from 'chai';
import { configure, mount } from 'enzyme';
// import sinon from 'sinon';
import TestCom from 'components/Admin/AdminNamingConvention/AdminNamingConvention';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<AdminNamingConvention /> component structure', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<TestCom />);
  });

  it('should render 6 <Text /> component', () => {
    expect(wrapper.find('Text').length).to.equal(11);
  });

  it('should render 1 <Select /> components', () => {
    expect(wrapper.find('Select').length).to.equal(2);
  });

  it('should render 1 <Btn /> components', () => {
    expect(wrapper.find('Btn').length).to.equal(1);
  });
});

describe('<AdminGeneralGeneral /> state update', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<TestCom />);
  });

  it('should input changes update state', () => {
    const input = wrapper.find('Text').at(4);
    const inputValue = {
      id: 'tabs',
      value: '1234567900'
    };
    input.props().onChange({ currentTarget: inputValue });
    expect(wrapper.state().inputs[inputValue.id]).to.equal(inputValue.value);
  });
});
