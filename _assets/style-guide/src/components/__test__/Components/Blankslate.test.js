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
 * @copyright 2010-2019 BigTinCan Mobile Pty Ltd
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React from 'react';
import { configure, mount } from 'enzyme';
import Blankslate from 'components/Blankslate/Blankslate';
import SVGIcon from 'components/SVGIcon/SVGIcon';
import stylesClass from 'components/Blankslate/Blankslate.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

const defaultProps = {
  icon: null,
  iconSize: 96,
  heading: '',
  message: '',
  inline: false,
  spacious: false,
};
const wrapper = mount(<Blankslate {...defaultProps} />);

describe('<Blankslate /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find(styles.Blankslate)).to.have.lengthOf(1);
  });

  it('should render default icon size', () => {
    expect(wrapper.find(styles.Blankslate).hasClass('iconSize-96')).to.equal(true);
  });
});

describe('<Blankslate /> props update component structure', () => {
  it('should have a string icon', () => {
    wrapper.setProps({
      icon: 'share'
    });
    expect(wrapper.find('span.icon-share')).to.have.lengthOf(1);
  });

  it('should have a heading', () => {
    wrapper.setProps({
      heading: 'This is a blankslate'
    });
    expect(wrapper.find('h3').first().text()).to.equal('This is a blankslate');
  });

  it('should have a message', () => {
    wrapper.setProps({
      message: 'This is a message in the blankslate'
    });
    expect(wrapper.find('p').first().text()).to.equal('This is a message in the blankslate');
  });

  it('should render elements inline', () => {
    wrapper.setProps({
      inline: true
    });
    expect(wrapper.find(styles.inline)).to.have.lengthOf(1);
  });

  it('should render a svg icon', () => {
    wrapper.setProps({
      icon: <SVGIcon type="brokenFile" style={{ marginTop: '-0.25rem' }} />
    });
    expect(wrapper.find(styles.iconNode)).to.have.lengthOf(1);
  });
});
