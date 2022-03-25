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
import PropTypes from 'prop-types';
import { expect } from 'chai';
import { configure, mount } from 'enzyme';
import sinon from 'sinon';
import AdminCustomApps from 'components/Admin/AdminCustomApps/AdminCustomApps';
import AdminCustomList from 'components/Admin/AdminCustomApps/CustomAppsList';
import CreateModal from 'components/Admin/AdminCustomApps/CreateModal';
import AdminCustomEdit, { EDIT, KEY, checkIsSaveDisable } from 'components/Admin/AdminCustomApps/CustomAppsEdit';

const list = require('static/admin/customAppsList.json');
const users = require('static/users.json');

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<AdminCustomApps /> component structure', () => {
  let wrapper;
  let onGetList;
  beforeEach(() => {
    onGetList = sinon.spy();
    const context = { settings: { authString: 'authString' } };
    wrapper = mount(<AdminCustomApps onGetList={onGetList} />, {
      context,
      childContextTypes: {
        settings: PropTypes.object
      }
    });
  });

  it('should render 1 <CustomAppsList /> components if view is LIST', () => {
    wrapper.setProps({ view: 'list' });
    expect(wrapper.find('CustomAppsList').length).to.equal(1);
  });

  it('should render 1 <CustomAppsEdit /> component if view is EDIT', () => {
    wrapper.setProps({ view: 'edit' });
    expect(wrapper.find('CustomAppsEdit').length).to.equal(1);
  });
});

describe('<AdminCustomList /> component structure', () => {
  let wrapper;
  let onGetList;
  beforeEach(() => {
    onGetList = sinon.spy();
    const context = { settings: { authString: 'authString' } };
    wrapper = mount(<AdminCustomList onGetList={onGetList} />, {
      context,
      childContextTypes: {
        settings: PropTypes.object
      }
    });
  });

  it('should empty list make <Blankslate /> visible', () => {
    wrapper.setProps({ list: [] });
    expect(wrapper.find('Blankslate').length).to.equal(2);
  });

  it('should show list if has list', () => {
    wrapper.setProps({ list });
    expect(wrapper.find('li').length).to.equal(6);
  });
});

describe('<AdminCustomList /> props functions', () => {
  let wrapper;
  let onCreate;
  let onGetList;
  beforeEach(() => {
    onCreate = sinon.spy();
    onGetList = sinon.spy();
    const context = { settings: { authString: 'authString' } };
    wrapper = mount(<AdminCustomList onCreate={onCreate} onGetList={onGetList} />, {
      context,
      childContextTypes: {
        settings: PropTypes.object
      }
    });
    wrapper.setState({ modalVisible: false });
  });

  it('full list onCreate call', () => {
    wrapper.setProps({ list });
    wrapper.find('FormField').simulate('click');
    expect(onCreate.callCount).to.equal(1);
  });

  it('empty list onCreate call', () => {
    wrapper.find('button').at(0).simulate('click');
    expect(onCreate.callCount).to.equal(1);
  });
});

describe('<CreateModal /> component structure', () => {
  let wrapper;
  let onClose;
  beforeEach(() => {
    onClose = sinon.spy();
    wrapper = mount(<CreateModal onClose={onClose} isVisible />);
  });

  it('should render auth select view', () => {
    wrapper.setState({ view: 1 });
    expect(wrapper.find('div[data-type="api_key"]').length).to.equal(1);
    expect(wrapper.find('div[data-type="authorization"]').length).to.equal(1);
  });

  it('should render authorization create view', () => {
    wrapper.setState({ view: 2 });
    expect(wrapper.find('Text[id="name"]').length).to.equal(1);
    expect(wrapper.find('Text[id="redirectUri"]').length).to.equal(1);
  });

  it('should render api key create view', () => {
    wrapper.setState({ view: 2 });
    wrapper.setProps({ user: users[3] });
    expect(wrapper.find('Text[id="name"]').length).to.equal(1);
    expect(wrapper.find('UserItem').length).to.equal(1);
  });

  it('should render key  view', () => {
    wrapper.setState({ view: 2 });
    wrapper.setProps({ user: users[3] });
    expect(wrapper.find('Text[id="name"]').length).to.equal(1);
    expect(wrapper.find('UserItem').length).to.equal(1);
  });

  it('should render authorization key view', () => {
    wrapper.setState({ view: 3 });
    expect(wrapper.find('Text[id="oauthClientId"]').length).to.equal(1);
    expect(wrapper.find('Text[id="oauthSecret"]').length).to.equal(1);
  });
});

describe('<CreateModal /> state update', () => {
  let wrapper;
  let onClose;
  let onSave;
  beforeEach(() => {
    onClose = sinon.spy();
    onSave = sinon.spy();
    wrapper = mount(<CreateModal onClose={onClose} onSave={onSave} isVisible />);
  });

  it('should select authorization go to authorization create view', () => {
    wrapper.setState({ view: 1 });
    wrapper.find('div[data-type="authorization"]').simulate('click');
    expect(wrapper.state('view')).to.equal(2);
    expect(wrapper.find('Text[id="name"]').length).to.equal(1);
    expect(wrapper.find('Text[id="redirectUri"]').length).to.equal(1);
  });

  it('should trigger onSave method', () => {
    wrapper.setState({ isSaveDisable: false, view: 2 });
    wrapper.find('button[data-action="confirm"]').simulate('click');
    expect(onSave.callCount).to.equal(1);
  });
});

describe('<AdminCustomEdit /> state update', () => {
  let wrapper;
  let onSaveDisableUpdate;
  beforeEach(() => {
    onSaveDisableUpdate = sinon.spy();
    wrapper = mount(<AdminCustomEdit onSaveDisableUpdate={onSaveDisableUpdate} />);
  });

  it('should input name and scopes trigger onSaveDisableUpdate', () => {
    wrapper.setProps({ user: users[3], views: [EDIT] });
    wrapper.setState({
      isSaveDisable: checkIsSaveDisable({
        name: 'name',
        scopes: ['history_w']
      }, null, users[3]),
    });
    expect(onSaveDisableUpdate.getCall(0).args[0]).to.equal(false);
  });

  it('should only input scopes not trigger onSaveDisableUpdate', () => {
    wrapper.setProps({ user: users[3], views: [EDIT] });
    wrapper.setState({ isSaveDisable: false });
    wrapper.setState({
      isSaveDisable: checkIsSaveDisable({
        scopes: ['history_w']
      }, null, users[3]),
    });
    expect(onSaveDisableUpdate.getCall(1).args[0]).to.equal(true);
  });
});

describe('<AdminCustomEdit /> component structure', () => {
  let wrapper;
  let onSaveDisableUpdate;
  beforeEach(() => {
    onSaveDisableUpdate = sinon.spy();
    wrapper = mount(<AdminCustomEdit onSaveDisableUpdate={onSaveDisableUpdate} />);
  });

  it('should render api_key edit form', () => {
    wrapper.setProps({ user: users[3], views: [EDIT, KEY] });
    expect(wrapper.find('Text[id="name"]').length).to.equal(1);
    expect(wrapper.find('Text[id="redirectUri"]').length).to.equal(0);
    expect(wrapper.find('UserItem').length).to.equal(1);
    expect(wrapper.find('Text[id="oauthClientId"]').length).to.equal(1);
    expect(wrapper.find('Text[id="oauthSecret"]').length).to.equal(1);
    expect(wrapper.find('Text[id="apiKey"]').length).to.equal(1);
  });

  it('should render authorization edit form', () => {
    wrapper.setProps({ user: null, views: [EDIT, KEY] });
    expect(wrapper.find('Text[id="name"]').length).to.equal(1);
    expect(wrapper.find('Text[id="redirectUri"]').length).to.equal(1);
    expect(wrapper.find('UserItem').length).to.equal(0);
    expect(wrapper.find('Text[id="oauthClientId"]').length).to.equal(1);
    expect(wrapper.find('Text[id="oauthSecret"]').length).to.equal(1);
    expect(wrapper.find('Text[id="apiKey"]').length).to.equal(0);
  });
});
