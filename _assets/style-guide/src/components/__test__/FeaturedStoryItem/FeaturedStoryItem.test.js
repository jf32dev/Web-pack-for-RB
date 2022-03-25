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
import FeaturedStoryItem from 'components/FeaturedStoryItem/FeaturedStoryItem';
import stylesClass from 'components/FeaturedStoryItem/FeaturedStoryItem.less';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 99999999,
    permId: 5610279,
    name: 'Milkiway Galaxy is beautiful',
    featuredImage: 'https://homepages.cae.wisc.edu/~ece533/images/monarch.png',
    colour: '#02e8d1',
    type: 'story',
    files: [],
    isLiked: true,
    isBookmark: false,
    isFeatured: true,
    isQuicklink: false,
    quicklinkUrl: '',
    isQuickfile: false,
    updated: 1487631573,
    commentCount: 7,
    fileCount: 2,
    isProtected: false,
    rating: 0,
    ratingCount: 5,
    badgeTitle: 'Expert',
    badgeColour: '#00e66b',
    onAnchorClick: sinon.spy(),
  };
  wrapper = mountWithIntl(<FeaturedStoryItem {...defaultProps} />);
});

describe('<FeaturedStoryItem /> basic component structure', () => {
  it('should render container element <a/>', () => {
    expect(wrapper.find('a')).to.have.lengthOf(1);
  });

  it('should render container with classname featuredItem', () => {
    expect(wrapper.find(styles.featuredItem)).to.have.lengthOf(1);
  });

  it('should render <StoryBadgesNew />', () => {
    expect(wrapper.find('StoryBadgesNew')).to.have.lengthOf(1);
  });

  it('should render one img', () => {
    expect(wrapper.find('img')).to.have.lengthOf(1);
  });

  it('should render one h3', () => {
    expect(wrapper.find('h3')).to.have.lengthOf(1);
  });

  it('should render featured story title', () => {
    expect(wrapper.find('h3').text()).to.equal('Milkiway Galaxy is beautiful');
  });

  it('should render one <FormattedDate />', () => {
    expect(wrapper.find('FormattedDate')).to.have.lengthOf(1);
  });
});

describe('<FeaturedStoryItem /> function call', () => {
  it('should simulate click and call onAnchorClick once on <a />', () => {
    wrapper.find('a').simulate('click');
    expect(defaultProps.onAnchorClick.callCount).to.equal(1);
  });
});
