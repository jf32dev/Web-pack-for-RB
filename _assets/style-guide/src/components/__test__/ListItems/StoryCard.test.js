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
import stylesClass from 'components/StoryCard/StoryCard.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import StoryCard from 'components/StoryCard/StoryCard';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 2458605,
    permId: 2458600,
    badgeTitle: 'New',
    commentCount: 0,
    files: [],
    fileCount: 0,
    isFeatured: false,
    isLiked: false,
    isProtected: false,
    isQuickfile: false,
    isQuicklink: false,
    name: 'Launch',
    noLink: false,
    onClick: sinon.spy(),
    quicklinkUrl: '',
    ratingCount: 0,
    rootUrl: '',
    thumbSize: 'small',
    thumbWidth: '',
    updated: 1465261443
  };
  wrapper = mountWithIntl(<StoryCard {...defaultProps} />);
});

describe('<StoryCard /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.listItem)).to.have.lengthOf(1);
  });

  it('should render one <StoryThumbNew /> component', () => {
    expect(wrapper.find(StoryThumbNew)).to.have.lengthOf(1);
  });

  it('should render anchor tag', () => {
    expect(wrapper.find('a')).to.have.lengthOf(1);
  });

  it('should render badge title', () => {
    expect(wrapper.find('span').at(0).text()).to.equal('New');
  });

  it('should render story name', () => {
    expect(wrapper.find('span').at(2).text()).to.equal('Launch');
  });

  it('should not render file icon', () => {
    expect(wrapper.find(styles.fileIcon)).to.have.lengthOf(0);
  });

  it('should not render like icon', () => {
    expect(wrapper.find(styles.isLikedIcon)).to.have.lengthOf(0);
  });

  it('should not render comment icon', () => {
    expect(wrapper.find(styles.commentCountIcon)).to.have.lengthOf(0);
  });
});

describe('<StoryCard /> props update component structure', () => {
  it('should not render anchor tag', () => {
    wrapper.setProps({ noLink: true });
    expect(wrapper.find('a')).to.have.lengthOf(0);
  });

  it('should render file, like, comment icon, and counts', () => {
    wrapper.setProps({
      fileCount: 5,
      isLiked: true,
      ratingCount: 100,
      commentCount: 34
    });
    expect(wrapper.find(styles.fileIcon)).to.have.lengthOf(1);
    expect(wrapper.find('span').at(3).text()).to.equal('5');
    expect(wrapper.find(styles.isLikedIcon)).to.have.lengthOf(1);
    expect(wrapper.find('span').at(5).text()).to.equal('100');
    expect(wrapper.find(styles.commentCountIcon)).to.have.lengthOf(1);
    expect(wrapper.find('span').at(6).text()).to.equal('34');
  });
});

describe('<StoryCard /> functions called', () => {
  it('should simulate click and call onClick once if noLink', () => {
    wrapper.setProps({ noLink: true });
    wrapper.find(styles.listItem).simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });

  it('should simulate click and call onClick once if there is link', () => {
    wrapper.setProps({ noLink: false });
    wrapper.find('a').simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });
});
