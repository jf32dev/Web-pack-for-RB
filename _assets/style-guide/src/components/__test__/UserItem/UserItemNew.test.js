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
 * @author Nimesh Sherpa <nimesh.sherpa@bigtincan.com>
 */

import React from 'react';
import { configure } from 'enzyme';
import sinon from 'sinon';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import faker from 'faker';
import UserItemNew from 'components/UserItemNew/UserItemNew';
import stylesClass from 'components/UserItemNew/UserItemNew.less';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 141589,
    email: faker.internet.email(),
    type: 'people',
    name: faker.name.findName(),
    thumbnail: faker.image.avatar(),
    role: 'Designer',
    onClick: sinon.spy(),
    hasUserActions: true
  };
  wrapper = mountWithIntl(<UserItemNew {...defaultProps} />);
});

describe('<UserItemNew /> basic component structure', () => {
  it('should render grid container element', () => {
    wrapper.setProps({ grid: true });
    expect(wrapper.find(styles.gridItem)).to.have.lengthOf(1);
  });

  it('should render list container element', () => {
    wrapper.setProps({ grid: false });
    expect(wrapper.find(styles.listItem)).to.have.lengthOf(1);
  });

  it('should render one <UserThumb />', () => {
    expect(wrapper.find('UserThumb')).to.have.lengthOf(1);
  });

  it('should render one name and one email or role', () => {
    expect(wrapper.find(styles.name)).to.have.lengthOf(1);
    expect(wrapper.find(styles.emailRole)).to.have.lengthOf(1);
  });

  it('should render <UserActions />', () => {
    expect(wrapper.find('UserActions')).to.have.lengthOf(1);
  });

  it('should not render <UserActions /> if `hasUserActions` is false', () => {
    wrapper.setProps({ hasUserActions: false });
    expect(wrapper.find('UserActions')).to.have.lengthOf(0);
  });
});

describe('<UserItemNew /> function call', () => {
  it('should simulate onClick call and call it once', () => {
    wrapper.find(`[data-id=${defaultProps.id}]`).simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });
});
