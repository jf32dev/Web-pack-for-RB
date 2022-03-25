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
import { configure, mount } from 'enzyme';
import sinon from 'sinon';
import Dialog from 'components/Dialog/Dialog';
import styles from 'components/Dialog/Dialog.less';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());
const expect = chai.expect;

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<Dialog /> basic component structure', () => {
  let wrapper;
  let onCancel;
  let onConfirm;
  const title = 'title';
  const message = 'message';
  let modal;
  beforeEach(() => {
    onCancel = sinon.spy();
    onConfirm = sinon.spy();
    wrapper = mount(<Dialog onCancel={onCancel} onConfirm={onConfirm} />);
    wrapper.setProps({
      message,
      title,
      isVisible: true
    });
    modal = wrapper.find('Modal');
  });

  it('should render title and message', () => {
    expect(wrapper.find(`div.${styles.Header}`).text()).to.equal(title);
    expect(modal.props().isVisible).to.equal(true);
    expect(wrapper.find('div[data-id="body"]').find('p').text()).to.equal(message);
  });

  it('should trigger onCancel method', () => {
    modal.find('button').at(0).simulate('click');
    expect(onCancel.callCount).to.equal(1);
  });

  it('should trigger onConfirm method', () => {
    modal.find('button').at(1).simulate('click');
    expect(onConfirm.callCount).to.equal(1);
  });
});
