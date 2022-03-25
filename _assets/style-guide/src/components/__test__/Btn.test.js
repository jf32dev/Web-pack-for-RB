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
import Btn from 'components/Btn/Btn';
import stylesClass from 'components/Btn/Btn.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<Btn /> basic component structure', () => {
  const wrapper = mount(<Btn />);

  it('should render button element', () => {
    expect(wrapper.find('button').length).to.equal(1);
  });

  it('should render anchor element', () => {
    wrapper.setProps({ href: '#' });
    expect(wrapper.find('a').length).to.equal(1);
  });
});

describe('<Btn /> props update component strucutre', () => {
  const wrapper = mount(<Btn />);

  it('should render loading state', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).to.have.descendants(styles.loading);
  });

  it('should render disabled state', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).to.have.descendants(styles.disabled);
  });
});
