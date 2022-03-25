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
import Select from 'components/Select/Select';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });

describe('<Select /> component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: '',
      name: '',
      value: '',
      options: [],
    };
    wrapper = mount(<Select {...defaultProps} />);
  });

  it('should render 1 <Select /> component', () => {
    expect(wrapper.find('div.Select').length).to.equal(1);
  });
});

describe('<Select /> props update component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: '',
      name: '',
      value: '',
      options: []
    };
    wrapper = mount(<Select {...defaultProps} />);
  });

  it('should display loading animation', () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper.exists('span.Select-loading')).to.equal(true);
  });

  it('should be clearable', () => {
    wrapper.setProps({ clearable: true, value: { label: 'test' } });
    expect(wrapper.find('span.Select-clear').exists()).to.equal(true);
  });

  it('should not be clearable button', () => {
    wrapper.setProps({ clearable: false });
    expect(wrapper.find('span.Select-clear').exists()).to.equal(false);
  });

  it('should be searchable', () => {
    wrapper.setProps({ searchable: true });
    expect(wrapper.find('div.Select.is-searchable').exists()).to.equal(true);
  });

  it('should not be searchable', () => {
    wrapper.setProps({ searchable: false });
    expect(wrapper.find('div.Select.is-searchable').exists()).to.equal(false);
  });

  it('should select only one option', () => {
    wrapper.setProps({ multi: false });
    expect(wrapper.find('div.Select.Select--multi').exists()).to.equal(false);
  });

  it('should select multiple options', () => {
    wrapper.setProps({ multi: true });
    expect(wrapper.find('div.Select.Select--multi').exists()).to.equal(true);
  });

  it('should display label', () => {
    wrapper.setProps({ label: 'test' });
    expect(wrapper.find('label').exists()).to.equal(true);
  });

  it('should not display label', () => {
    wrapper.setProps({ label: '' });
    expect(wrapper.find('label').exists()).to.equal(false);
  });
});
