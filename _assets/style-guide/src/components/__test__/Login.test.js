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
import Login from 'components/Login/Login';
import stylesClass from 'components/Login/Login.less';
import _ from 'lodash';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());
const expect = chai.expect;

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
const styles = _.mapValues(stylesClass, (raw) => '.' + raw);

describe('<Login /> basic component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onUserChange: sinon.spy(),
      onPassChange: sinon.spy(),
      onButtonClick: sinon.spy(),
      onOptionChange: sinon.spy(),
      onRememberChange: sinon.spy(),
      blurb: '',
      btnText: '',
      passPlaceholder: '',
      rememberText: '',
      recoverText: '',
      cloudText: '',
      userPlaceholder: '',
      ldapText: '',
      samlText: '',
      unsupportedBrowserText: '',
      unableToLogoutText: '',
    };

    wrapper = mount(<Login {...defaultProps} />);
  });

  it('should render 1 username input box', () => {
    expect(wrapper.find('input[name="username"]').length).to.equal(1);
  });

  it('should render 1 password input box', () => {
    expect(wrapper.find('input[name="password"]').length).to.equal(1);
  });

  it('should render 1 <Btn /> component', () => {
    expect(wrapper.find('Btn').length).to.equal(1);
  });

  it('should render 1 remember <Checkbox /> component', () => {
    expect(wrapper.find('Checkbox[name="remember"]').length).to.equal(1);
  });
});

describe('<Login /> props update component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onUserChange: sinon.spy(),
      onPassChange: sinon.spy(),
      onButtonClick: sinon.spy(),
      onOptionChange: sinon.spy(),
      onRememberChange: sinon.spy(),
      blurb: '',
      btnText: '',
      passPlaceholder: '',
      rememberText: '',
      recoverText: '',
      cloudText: '',
      userPlaceholder: '',
      ldapText: '',
      samlText: '',
      unsupportedBrowserText: '',
      unableToLogoutText: '',
    };

    wrapper = mount(<Login {...defaultProps} />);
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

describe('<Login /> props functions', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onUserChange: sinon.spy(),
      onPassChange: sinon.spy(),
      onButtonClick: sinon.spy(),
      onOptionChange: sinon.spy(),
      onRememberChange: sinon.spy(),
      blurb: '',
      btnText: '',
      passPlaceholder: '',
      rememberText: '',
      recoverText: '',
      cloudText: '',
      userPlaceholder: '',
      ldapText: '',
      samlText: '',
      settings: {
        cloud: 'on',  // on, off, forced
        ldap: 'on',
        saml: 'on',
      },
      userValue: '',
      passValue: '',
      selectedLogin: 'cloud',
      rememberChecked: false,
      disableInputs: false,
      disableButton: true,
      disableForgot: false,
      loading: false,
      error: {},
      unsupportedBrowser: false,
      unsupportedBrowserText: '',
      unableToLogoutText: '',
    };

    wrapper = mount(<Login {...defaultProps} />);
  });

  it('should username input trigger onUserChange call', () => {
    const value = 'username@bigtincan.com';
    wrapper.find('input[name="username"]').simulate('change', { target: { value } });
    expect(defaultProps.onUserChange.args[0][0].target.value).to.equal(value);
    expect(defaultProps.onUserChange.callCount).to.equal(1);
  });

  it('should password input trigger onPassChange call', () => {
    const value = 'password';
    wrapper.find('input[name="password"]').simulate('change', { target: { value } });
    expect(defaultProps.onPassChange.args[0][0].target.value).to.equal(value);
    expect(defaultProps.onPassChange.callCount).to.equal(1);
  });

  it('should click submit button trigger onButtonClick call', () => {
    wrapper.setProps({ disableButton: false });
    wrapper.find('button[name="submit"]').simulate('click');
    expect(defaultProps.onButtonClick.callCount).to.equal(1);
  });

  it('should radio trigger onOptionChange call', () => {
    wrapper.find('input[value="cloud"]').simulate('change', { target: { checked: true } });
    wrapper.find('input[value="ldap"]').simulate('change', { target: { checked: true } });
    wrapper.find('input[value="saml"]').simulate('change', { target: { checked: true } });
    expect(defaultProps.onOptionChange.args[0][0].target.checked).to.equal(true);
    expect(defaultProps.onOptionChange.callCount).to.equal(3);
  });


  it('should click remember button trigger onRememberChange call', () => {
    wrapper.find('input[name="remember"]').simulate('change', { target: { checked: true } });
    expect(defaultProps.onRememberChange.args[0][0].target.checked).to.equal(true);
    expect(defaultProps.onRememberChange.callCount).to.equal(1);
  });
});
