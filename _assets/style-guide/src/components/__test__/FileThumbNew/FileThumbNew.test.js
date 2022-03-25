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
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React from 'react';
import { configure, mount } from 'enzyme';
import stylesClass from 'components/FileThumbNew/FileThumbNew.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FileThumbNew from 'components/FileThumbNew/FileThumbNew';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    category: 'csv',
    className: '',
    customThumbSize: 0,
    style: {},
    thumbnail: '',
    thumbSize: 'small',
  };
  wrapper = mount(<FileThumbNew {...defaultProps} />);
});


describe('<FileThumbNew /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.noShrink)).to.have.lengthOf(1);
  });

  it('should render file type text', () => {
    expect(wrapper.find('span')).to.have.lengthOf(1);
    expect(wrapper.find('span').text()).to.equal('CSV');
  });
});

describe('<FileThumbNew /> props update component structure', () => {
  it('should render folder svg', () => {
    wrapper.setProps({ category: 'folder' });
    expect(wrapper.find('span')).to.have.lengthOf(0);
    expect(wrapper.find('svg')).to.have.lengthOf(1);
  });
});
