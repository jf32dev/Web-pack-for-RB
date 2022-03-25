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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincan.com>
 */

import React from 'react';
import { configure } from 'enzyme';
import stylesClass from 'components/NotificationItem/NotificationItem.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import sinon from 'sinon';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import NotificationItem from 'components/NotificationItem/NotificationItem';
import NOTIFICATIONJSON from '../../../static/notification.json';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);


describe('<NotificationItem /> basic component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...NOTIFICATIONJSON,
      onClick: sinon.spy(),
      styles
    };
    wrapper = mountWithIntl(<NotificationItem {...defaultProps} />);
  });
  it('should render container element as anchor tag when story.isArchived is false', () => {
    expect(wrapper.find('a')).to.have.length(1);
    expect(wrapper.find('FormattedMessage')).to.have.length(1);
  });

  it('should not render container element as anchor tag when story.isArchived is true', () => {
    wrapper.setProps({ ...defaultProps, story: { ...defaultProps.story, isArchived: true } });
    expect(wrapper.find('a')).to.have.length(0);
  });

  it('should render 1 <FormattedMessage/> component', () => {
    expect(wrapper.find('FormattedMessage')).to.have.length(1);
  });

  it('should render 1 <FormattedDate/> component', () => {
    expect(wrapper.find('FormattedDate')).to.have.length(1);
  });
});
