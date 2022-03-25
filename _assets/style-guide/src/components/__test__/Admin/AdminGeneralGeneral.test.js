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
import sinon from 'sinon';
import AdminGeneralGeneral from 'components/Admin/AdminGeneralGeneral/AdminGeneralGeneral';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<AdminGeneralGeneral /> component structure', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<AdminGeneralGeneral />);
  });

  it('should render 1 <Dialog /> component', () => {
    expect(wrapper.find('Dialog').length).to.equal(1);
  });

  it('should render 14 <FormField /> components', () => {
    expect(wrapper.find('FormField').length).to.equal(14);
  });

  it('should render 1 <Btn /> component', () => {
    expect(wrapper.find('Btn').length).to.equal(1);
  });
});

describe('<AdminGeneralGeneral /> state update', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<AdminGeneralGeneral />);
    wrapper.setState({ modalVisible: false });
  });

  it('should click button make dialog visible', () => {
    wrapper.find('Btn').simulate('click');
    expect(wrapper.state('modalVisible')).to.equal(true);
    expect(wrapper.find('Dialog').prop('isVisible')).to.equal(true);
  });
});

describe('<AdminGeneralGeneral /> props functions', () => {
  let wrapper;
  let onChange;
  beforeEach(() => {
    onChange = sinon.spy();
    wrapper = mount(<AdminGeneralGeneral onChange={onChange} />);
    wrapper.setState({ modalVisible: false });
  });

  it('should onChange call', () => {
    wrapper.find('Btn').simulate('click');
    wrapper.find('Dialog').find('button').at(1).simulate('click');
    expect(onChange.callCount).to.equal(1);
    expect(onChange.calledWith({ confirm: 'purge' })).to.equal(true);
  });
});
