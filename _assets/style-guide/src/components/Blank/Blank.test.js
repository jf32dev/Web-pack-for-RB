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
 * @package style-guide
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Btn from 'components/Btn/Btn';

import Blank from './Blank';

const Comp = Blank;
const testProps = {
  customProp1: 'Test'
};

describe('<Blank/>', () => {
  it('has .Blank', () => {
    const wrapper = mount(<Comp {...testProps} />);
    expect(wrapper.hasClass('Blank'));
  });

  it('contains a <p> with `customProp1`', () => {
    const wrapper = mount(<Comp {...testProps} />);
    const label = wrapper.find('p');

    expect(label).to.have.length(1);
    expect(label.text()).to.equal('Test');
  });

  it('contains a <Btn/>', () => {
    const wrapper = mount(<Comp {...testProps} />);
    expect(wrapper.find(Btn)).to.have.length(1);
  });
});
