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
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import ListItem from 'components/ListItem/ListItem';
import stylesClass from 'components/ListItem/ListItem.less';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;

const MockComponent = () => <div>Hello World</div>;

beforeEach(() => {
  defaultProps = {
    component: <MockComponent />,
    columns: {
      time: '20',
      views: {
        filesCount: 6,
        viewed: 5
      },
      downloads: {
        filesCount: 6,
        downloaded: 5
      },
    }
  };
  wrapper = mountWithIntl(<ListItem {...defaultProps} />);
});

describe('<ListItem /> basic component structure', () => {
  it('should render one <li/>', () => {
    expect(wrapper.find('li')).to.have.lengthOf(1);
  });

  it('should render container with classname listItem', () => {
    expect(wrapper.find(styles.listItem)).to.have.lengthOf(1);
  });

  it('should render passed <MockComponent/> component', () => {
    expect(wrapper.find('MockComponent')).to.have.lengthOf(1);
  });

  it('should render one <RenderColumns/>', () => {
    expect(wrapper.find('RenderColumns')).to.have.lengthOf(1);
  });
});
