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
import { configure } from 'enzyme';
import sinon from 'sinon';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import stylesClass from 'components/StoryItemNew/StoryItemNew.less';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    badgeColour: '',
    badgeTitle: '',
    id: null,
    permId: 123456789,
    name: 'Best story',
    childType: '',
    files: [],
    isProtected: false,
    rootUrl: '',
    grid: true,
    isQuickfile: false,
    isQuicklink: false,
    onClick: sinon.spy(),
    quicklinkUrl: '',
    style: {},
    thumbSize: 'medium',
    thumbWidth: '',
    noLink: false,
    updated: 1449637627
  };
  wrapper = mountWithIntl(<StoryItemNew {...defaultProps} />);
});

describe('<StoryItemNew /> basic component structure', () => {
  it('should render wrapper container', () => {
    expect(wrapper.find(styles.storyItem)).to.have.lengthOf(1);
  });

  it('should render <StoryThumbNew />', () => {
    expect(wrapper.find(StoryThumbNew)).to.have.lengthOf(1);
  });

  it('should render <a>', () => {
    expect(wrapper.find('a')).to.have.lengthOf(1);
  });

  it('should render story link', () => {
    expect(wrapper.find({ href: '/story/123456789' })).to.have.lengthOf(1);
  });

  it('should render story name', () => {
    expect(wrapper.find('label').at(0).text()).to.equal('Best story');
  });
});

describe('<StoryItemNew /> props update component structure', () => {
  it('should not render <a>', () => {
    wrapper.setProps({ noLink: true });
    expect(wrapper.find('a')).to.have.lengthOf(0);
  });

  it('should render a badge', () => {
    wrapper.setProps({
      badgeTitle: 'Popular',
      badgeColour: '#49FF00'
    });
    expect(wrapper.find(styles.badgeTitle)).to.have.lengthOf(1);
    expect(wrapper.find('span').at(0).text()).to.equal('Popular');
  });
});

describe('<StoryItemNew /> functions called', () => {
  it('should simulate click and call onClick once on <a>', () => {
    wrapper.find('a').simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });

  it('should simulate click and call onClick once on <div>', () => {
    wrapper.setProps({ noLink: true });
    wrapper.find(styles.storyItem).simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });
});
