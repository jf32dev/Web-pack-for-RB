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
import stylesClass from 'components/StoryCard/StoryCardWrapper.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import StoryCardWrapper from 'components/StoryCard/StoryCardWrapper';
import StoryCard from 'components/StoryCard/StoryCard';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    list: [
      {
        id: 1,
        permId: 12,
        name: 'random',
        isProtected: false,
        updated: 1476073924
      }
    ],
    onClickHandler: sinon.spy()
  };
  wrapper = mountWithIntl(<StoryCardWrapper {...defaultProps} />);
});


describe('<StoryCardWrapper /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.storyCardWrapper)).to.have.lengthOf(1);
  });

  it('should render one <StoryCard /> component', () => {
    expect(wrapper.find(StoryCard)).to.have.lengthOf(1);
  });
});
