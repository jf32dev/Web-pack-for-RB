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
import sinon from 'sinon';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebItem from 'components/WebItem/WebItem';
import stylesClass from 'components/WebItem/WebItem.less';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 1,
    name: 'google',
    url: 'https://www.google.com.au',
    thumbnail: '',
    authString: '',
    onClick: sinon.spy()
  };
  wrapper = mount(<WebItem {...defaultProps} />);
});

describe('<WebItem /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find('a')).to.have.lengthOf(1);
  });

  it('should render name or link', () => {
    expect(wrapper.find('span').text()).to.equal('google');
  });

  it('shoud render launch icon', () => {
    expect(wrapper.find('i')).to.have.lengthOf(1);
  });

  it('should render default web icon if thumbnail does not exist', () => {
    expect(wrapper.find(styles.noThumb)).to.have.lengthOf(1);
  });

  it('should have an aria-label', () => {
    expect(wrapper.find('a').prop('aria-label')).to.equal('https://www.google.com.au');
  });
});

describe('<WebItem /> props update component behaviour', () => {
  it('should render thumbnail if thumbnail exist', () => {
    wrapper.setProps({ thumbnail: 'https://upload.test.thumbnail.com' });
    expect(wrapper.find(styles.noThumb)).to.have.lengthOf(0);
  });
});

describe('<WebItem /> functions called', () => {
  it('should simulate click and call onClick once', () => {
    wrapper.find('a').simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });
});
