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
import { configure, mount } from 'enzyme';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CrmOpportunity from 'components/CrmOpportunity/CrmOpportunity';
import stylesClass from 'components/CrmOpportunity/CrmOpportunity.less';
import faker from 'faker';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    opportunity: faker.lorem.words(),
    stage: faker.lorem.word(),
    crmIcon: 'cloud-sf-fill'
  };
  wrapper = mount(<CrmOpportunity {...defaultProps} />);
});

describe('<CrmOpportunity /> basic component structure', () => {
  it('should render one <section/>', () => {
    expect(wrapper.find('section')).to.have.lengthOf(1);
  });

  it('should render one div for opportunity name wrapper ', () => {
    expect(wrapper.find(styles.opportunityWrapper)).to.have.lengthOf(1);
  });

  it('should render opportunity name', () => {
    expect(wrapper.find('p').at(0).text()).to.equal(defaultProps.opportunity);
  });

  it('should render opportunity stage', () => {
    expect(wrapper.find('p').at(1).text()).to.equal(defaultProps.stage);
  });
});
