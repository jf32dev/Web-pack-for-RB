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
import stylesClass from 'components/StoryItemNew/StoryItemNew.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntlAndRouter } from 'helpers/intlEnzymeTestHelper';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';
import ShareItemContent from 'components/ShareItemContent/ShareItemContent';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
beforeEach(() => {
  const defaultProps = {
    badgeTitle: 'New',
    colour: '',
    isShare: false,
    noLink: false,
    name: 'Story Title',
    permId: 234,
    rootUrl: '',
    thumbSize: 'small',
    tab: {
      id: 74313,
      name: 'All Pizza'
    },
    channel: {
      id: 73581,
      name: 'pizza'
    },
    updated: 1465261443
  };
  wrapper = mountWithIntlAndRouter(<StoryItemNew {...defaultProps} />);
});

describe('<StoryItemNew /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.storyItem)).to.have.lengthOf(1);
  });

  it('should render <StoryThumbNew /> component', () => {
    expect(wrapper.find(StoryThumbNew)).to.have.lengthOf(1);
  });

  it('should render itemContent container', () => {
    expect(wrapper.find(styles.nameItem)).to.have.lengthOf(1);
  });

  it('should render badge title "New"', () => {
    expect(wrapper.find('span').at(0).text()).to.equal('New');
  });
});

describe('<StoryItemNew /> props update component structure', () => {
  it('should render <ShareItemContent /> component', () => {
    wrapper.setProps({
      isShare: true,
      noLink: true
    });
    expect(wrapper.find(ShareItemContent)).to.have.lengthOf(1);
  });
});
