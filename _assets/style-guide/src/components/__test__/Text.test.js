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
 * @copyright 2010-2017 BigTinCan Mobile Pty Ltd
 * @author Jason Huang <jason.huang@bigtincan.com>
 */
import React from 'react';
import { configure, mount } from 'enzyme';
import sinon from 'sinon';
import Text from 'components/Text/Text';
import stylesClass from 'components/Text/Text.less';
import _ from 'lodash';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _.mapValues(stylesClass, (raw) => '.' + raw);

describe('<Text /> component structure and props', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onChange: sinon.spy(),
      onClearClick: sinon.spy(),
      onCopyClick: sinon.spy(),
      value: '',
      id: 'input',
    };
    wrapper = mount(<Text {...defaultProps} />);
  });

  it('should render input element', () => {
    expect(wrapper.find('input').length).to.equal(1);
  });

  it('should render fix width input element', () => {
    const width = '300px';
    wrapper.setProps({ width });
    expect(wrapper.find(`Text[width="${width}"]`).length).to.equal(1);
  });

  it('should render inline and disabled input element', () => {
    wrapper.setProps({
      inline: true,
      disabled: true,
    });
    expect(wrapper.find('div')).to.have.descendants(styles.inline);
    expect(wrapper.find('div')).to.have.descendants(styles.disabled);
  });

  it('should render inline plain-text disable element', () => {
    wrapper.setProps({
      type: 'plain-text',
      disabled: true
    });
    expect(wrapper.find('div')).to.have.descendants(styles.disabled);
    expect(wrapper.find('span')).to.have.descendants(styles.plainText);
  });

  it('should not render input element when type === plain-text', () => {
    wrapper.setProps({
      type: 'plain-text',
      disabled: true
    });
    expect(wrapper.find('div')).to.have.descendants(styles.disabled);
    expect(wrapper.find('input').length).to.equal(0);
  });

  it('should render search input element', () => {
    wrapper.setProps({
      icon: 'search',
      showClear: true
    });
    expect(wrapper.find('div[className*="icon-search"]').length).to.equal(1);
    expect(wrapper.find('div')).to.have.descendants(styles.hasIcon);
    expect(wrapper.find('div')).to.have.descendants(styles.hasClear);
    expect(wrapper.find('span')).to.have.descendants(styles.clear);
  });

  it('should render copy input element', () => {
    wrapper.setProps({
      showCopy: true
    });
    expect(wrapper.find('span')).to.have.descendants(styles.copy);
  });
});
