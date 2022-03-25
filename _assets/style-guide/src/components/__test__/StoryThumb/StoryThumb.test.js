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
import { configure, shallow } from 'enzyme';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import stylesClass from 'components/StoryThumbNew/StoryThumbNew.less';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';
import StoryBadgesNew from 'components/StoryBadgesNew/StoryBadgesNew';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    authString: '',
    className: '',
    colour: '',
    isCard: true,
    isFeatured: false,
    grid: true,
    thumbSize: 'small'
  };
  wrapper = shallow(<StoryThumbNew {...defaultProps} />);
});

describe('<StoryThumbNew /> basic component structure', () => {
  it('should render container', () => {
    expect(wrapper.find(styles.StoryThumb)).to.have.lengthOf(1);
  });

  it('should not render badges', () => {
    expect(wrapper.find(StoryBadgesNew)).to.have.lengthOf(0);
  });
});

describe('<StoryCard /> props update component structure', () => {
  it('should render badges', () => {
    wrapper.setProps({ thumbSize: 'medium' });
    expect(wrapper.find(StoryBadgesNew)).to.have.lengthOf(1);
  });
});
