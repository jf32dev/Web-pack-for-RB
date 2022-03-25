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
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import StoryBadgesNew from 'components/StoryBadgesNew/StoryBadgesNew';
import stylesClass from 'components/StoryBadgesNew/StoryBadgesNew.less';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    commentCount: 0,
    fileCount: 0,
    ratingCount: 0
  };
  wrapper = mountWithIntl(<StoryBadgesNew {...defaultProps} />);
});

describe('<StoryBadgesNew /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.iconsWrapper)).to.have.lengthOf(1);
  });

  it('should not render thumbs-up icon', () => {
    expect(wrapper.find(styles.likeCountIcon)).to.have.lengthOf(0);
  });

  it('should not render comment icon', () => {
    expect(wrapper.find(styles.commentCountIcon)).to.have.lengthOf(0);
  });

  it('should not render file icon', () => {
    expect(wrapper.find(styles.fileIcon)).to.have.lengthOf(0);
  });

  it('should not render <span>', () => {
    expect(wrapper.find('span')).to.have.lengthOf(0);
  });
});

describe('<StoryBadgesNew /> props update component structure', () => {
  it('should render thumbs-up icon', () => {
    wrapper.setProps({
      ratingCount: 5
    });
    expect(wrapper.find(styles.likeCountIcon)).to.have.lengthOf(1);
    expect(wrapper.find('span').text()).to.equal('5');
  });

  it('should render comment icon', () => {
    wrapper.setProps({ commentCount: 20 });
    expect(wrapper.find(styles.commentCountIcon)).to.have.lengthOf(1);
    expect(wrapper.find('span').text()).to.equal('20');
  });

  it('should render file icon', () => {
    wrapper.setProps({ fileCount: 3 });
    expect(wrapper.find(styles.fileIcon)).to.have.lengthOf(1);
    expect(wrapper.find('span').text()).to.equal('3');
  });
});
