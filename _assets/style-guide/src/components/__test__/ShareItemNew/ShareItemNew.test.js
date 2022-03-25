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
import ShareItemNew from 'components/ShareItemNew/ShareItemNew';
import FileThumbNew from 'components/FileThumbNew/FileThumbNew';
import StoryThumbNew from 'components/StoryThumbNew/StoryThumbNew';
import stylesClass from 'components/ShareItemNew/ShareItemNew.less';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 1,
    isActive: false,
    onClick: sinon.spy(),
    subject: '',
    contactsCount: 1,
    filesCount: 1,
    file: {
      id: 1,
      customDetailsIsEnabled: false
    },
    grid: false,
    story: null,
    thumbSize: 'small',
  };
  wrapper = mountWithIntl(<ShareItemNew {...defaultProps} />);
});


describe('<ShareItemNew /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.ShareItem)).to.have.lengthOf(1);
  });

  it('should render <FileThumbNew /> component', () => {
    expect(wrapper.find(FileThumbNew)).to.have.lengthOf(1);
  });

  it('should not render <StoryThumbNew /> component', () => {
    expect(wrapper.find(StoryThumbNew)).to.have.lengthOf(0);
  });

  it('should render "(No Subject)" title', () => {
    expect(wrapper.find('p').at(0).text()).to.equal('(No Subject)');
  });

  it('should render "1 Contact · 1 File" title', () => {
    expect(wrapper.find('span').text()).to.equal('1 Contact · 1 File');
  });
});

describe('<ShareItemNew /> props update component structure', () => {
  it('should render share title', () => {
    wrapper.setProps({ subject: 'File Management' });
    expect(wrapper.find('p').at(0).text()).to.equal('File Management');
  });

  it('should render "2 Contacts · 2 Files" title', () => {
    wrapper.setProps({
      contactsCount: 2,
      filesCount: 2
    });
    expect(wrapper.find('span').text()).to.equal('2 Contacts · 2 Files');
  });
});

describe('<ShareItemNew /> props functions', () => {
  it('should simulate click and call onClick()', () => {
    wrapper.find(styles.ShareItem).simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });

  it('should render <StoryThumbNew /> component', () => {
    wrapper.setProps({ story: { id: 1 } });
    expect(wrapper.find(FileThumbNew)).to.have.lengthOf(0);
    expect(wrapper.find(StoryThumbNew)).to.have.lengthOf(1);
  });
});
