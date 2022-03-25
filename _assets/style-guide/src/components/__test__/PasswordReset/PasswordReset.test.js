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
 * @copyright 2010-2018 BigTinCan Mobile Pty Ltd
 * @author Shibu Bhattarai <shibu.bhattarai@bigtincan.com>
 */

import React from 'react';
import { configure, mount } from 'enzyme';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import stylesClass from 'components/PasswordReset/PasswordReset.less';
import PasswordReset from 'components/PasswordReset/PasswordReset';
import _ from 'lodash';

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
const expect = chai.expect;

const styles = _.mapValues(stylesClass, (raw) => '.' + raw);
const testProps = {
  showCurrentPasswordField: false,
  resetPassword: true,
  onCurrentPasswordChange: sinon.spy(),
  onConfirmPassChange: sinon.spy(),
  onButtonClick: sinon.spy(),
  onPassChange: sinon.spy(),
  focusOnMount: true,
  image: '',
  logo: '',
  text: 'Reset title',
  textColour: '',
  loading: false,
  error: {},
  unsupportedBrowser: false,
  blurb: 'To reset your password complete the fields, and then click Submit.',
  btnText: 'Submit',
  btnDesc: '',
  passwordPlaceholder: 'New Password',
  confirmPasswordPlaceholder: 'Confirm Password',
  changeSuccessTitle: 'Success',
  changeSuccessBlurb: 'Your Password has been changed.',
  changeSuccessBtnText: 'Sign In',
  changeSuccess: false,
  redirectUri: '/',
  unsupportedBrowserText: 'Sorry, your browser is not supported by bigtincan hub. You may just need to update your current browser. Download the latest supported browsers below.',
};
describe('<PasswordReset /> basic component structure for reset', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps
    };
    wrapper = mount(<PasswordReset {...defaultProps} />);
  });

  it('should render 2 input box for reset', () => {
    expect(wrapper.find('input[type="password"]').length).to.equal(2);
  });
  it('should render 1 passport input box for reset', () => {
    expect(wrapper.find('input[name="password"]').length).to.equal(1);
  });
  it('should render 1 confirm passport input box for reset', () => {
    expect(wrapper.find('input[name="confirm-password"]').length).to.equal(1);
  });
  it('should render 3 confirm passport input box for change password', () => {
    wrapper.setProps({ showCurrentPasswordField: true });
    expect(wrapper.find('input[type="password"]').length).to.equal(3);
  });
});

describe('<PasswordReset /> props update component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps
    };

    wrapper = mount(<PasswordReset {...defaultProps} />);
  });
  it('unsupported Browser view', () => {
    wrapper.setProps({ unsupportedBrowser: true });
    expect(wrapper.contains('Unsupported Browser')).to.equal(true);
  });
  it('loading view', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.childAt(0)).to.have.descendants(styles.loading);
  });
});

describe('<PasswordReset /> props functions', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps,
    };

    wrapper = mount(<PasswordReset {...defaultProps} />);
  });

  it('should password input trigger onPassChange call', () => {
    const value = 'password';
    wrapper.find('input[name="password"]').simulate('change', { target: { value } });
    expect(defaultProps.onPassChange.args[0][0].target.value).to.equal(value);
    expect(defaultProps.onPassChange.callCount).to.equal(1);
  });
  it('should confirm password input trigger onConfirmPassChange call', () => {
    const value = 'password';
    wrapper.find('input[name="confirm-password"]').simulate('change', { target: { value } });
    expect(defaultProps.onConfirmPassChange.args[0][0].target.value).to.equal(value);
    expect(defaultProps.onConfirmPassChange.callCount).to.equal(1);
  });
  it('should current password input trigger onCurrentPasswordChange call', () => {
    const value = 'currentpassword';
    wrapper.setProps({ showCurrentPasswordField: true });
    wrapper.find('input[name="currentPassword"]').simulate('change', { target: { value } });
    expect(defaultProps.onCurrentPasswordChange.args[0][0].target.value).to.equal(value);
    expect(defaultProps.onCurrentPasswordChange.callCount).to.equal(1);
  });
});
