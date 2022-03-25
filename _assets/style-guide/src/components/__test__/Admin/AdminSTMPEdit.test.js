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
import AdminSMTPEdit from 'components/Admin/AdminSMTPEdit/AdminSMTPEdit';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<AdminSMTPEdit /> component structure', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<AdminSMTPEdit />);
  });

  it('should render 6 <Text /> component', () => {
    wrapper.setProps({ is_custom: true });
    expect(wrapper.find('Text').length).to.equal(6);
  });

  it('should render 0 <Select /> components', () => {
    wrapper.setProps({ is_custom: false });
    expect(wrapper.find('Select').length).to.equal(0);
  });
});

describe('<AdminSMTPEdit /> state update', () => {
  let wrapper;
  const emailErrorMessage = 'emailErrorMessage';
  beforeEach(() => {
    wrapper = mount(<AdminSMTPEdit />);
    wrapper.setProps({ is_custom: true, strings: { emailErrorMessage } });
  });

  it('should not display error message', () => {
    expect(wrapper.contains(emailErrorMessage)).to.equal(false);
  });
});
