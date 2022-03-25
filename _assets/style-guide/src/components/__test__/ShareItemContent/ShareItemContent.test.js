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
import stylesClass from 'components/ShareItemContent/ShareItemContent.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntlAndRouter } from 'helpers/intlEnzymeTestHelper';
import ShareItemContent from 'components/StoryItemNew/StoryItemNew';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
beforeEach(() => {
  const defaultProps = {
    badgeTitle: 'New',
    colour: '',
    isShare: true,
    noLink: true,
    name: 'Story Title',
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
  wrapper = mountWithIntlAndRouter(<ShareItemContent {...defaultProps} />);
});

describe('<ShareItemContent /> basic component structure', () => {
  it('should render shareItemContent component', () => {
    expect(wrapper.find(styles.shareItemContentWrapper)).to.have.lengthOf(1);
  });

  it('should render <StoryThumbNew /> component', () => {
    expect(wrapper.find(StoryThumbNew)).to.have.lengthOf(1);
  });

  it('should render 4 links', () => {
    expect(wrapper.find('a')).to.have.lengthOf(4);
  });

  it('should render story name in link', () => {
    expect(wrapper.find('a').at(1).text()).to.equal('Story Title');
  });

  it('should render tab name in link', () => {
    expect(wrapper.find('a').at(2).text()).to.equal('All Pizza');
  });

  it('should render link to tab', () => {
    expect(wrapper.find('a').at(2).prop('href')).to.equal('/content/tab/74313');
  });

  it('should render channel name in link', () => {
    expect(wrapper.find('a').at(3).text()).to.equal('pizza');
  });

  it('should render link to channel', () => {
    expect(wrapper.find('a').at(3).prop('href')).to.equal('/content/tab/74313/channel/73581');
  });

  it('should render ">"', () => {
    expect(wrapper.find('span').text()).to.equal('›');
  });

  it('should wrap name when props.wrapName is truthy', () => {
    wrapper.setProps({
      wrapName: true
    });
    expect(wrapper.find('a').at(1)).to.have.descendants(styles.wrappedName);
    expect(wrapper.find('a').at(1)).to.not.have.descendants(styles.name);
  });

  it('should not wrap name when props.wrapName is undefined', () => {
    expect(wrapper.find('a').at(1)).to.not.have.descendants(styles.wrappedName);
    expect(wrapper.find('a').at(1)).to.have.descendants(styles.name);
  });
});
