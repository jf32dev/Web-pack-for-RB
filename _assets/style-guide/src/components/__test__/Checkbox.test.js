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
import Checkbox from 'components/Checkbox/Checkbox';
import stylesClass from 'components/Checkbox/Checkbox.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<Checkbox /> basic component structure', () => {
  const wrapper = mount(<Checkbox />);

  it('should render checkbox', () => {
    expect(wrapper.find("input[type='checkbox']").length).to.equal(1);
  });
});

describe('<Checkbox /> props update component strucutre', () => {
  const wrapper = mount(<Checkbox />);

  it('should render required state', () => {
    wrapper.setProps({ required: true });
    expect(wrapper).to.have.descendants(styles.required);
  });
});

describe('<Checkbox /> props functions', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onChange: sinon.spy(),
      name: '',
    };

    wrapper = mount(<Checkbox {...defaultProps} />);
  });

  it('should click checkbox and trigger onChange call', () => {
    wrapper.find('input').simulate('change', { target: { checked: true } });
    expect(defaultProps.onChange.args[0][0].target.checked).to.equal(true);
    expect(defaultProps.onChange.callCount).to.equal(1);
  });
});
