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
import FileItemNew from 'components/FileItemNew/FileItemNew';
import stylesClass from 'components/FileItemNew/FileItemNew.less';
import faker from 'faker';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 8591,
    description: 'File Bookmark Item',
    type: 'file',
    category: 'video',
    dateAdded: 1456952030,
    grid: true,
    thumbnail: faker.image.imageUrl(),
    stackSize: 1,
    onClick: sinon.spy()
  };
  wrapper = mountWithIntl(<FileItemNew {...defaultProps} />);
});

describe('<FileItemNew /> basic component structure', () => {
  it('should render one <a/>', () => {
    expect(wrapper.find('a')).to.have.lengthOf(1);
  });

  it('should render one <img/>', () => {
    expect(wrapper.find('img')).to.have.lengthOf(1);
  });

  it('should render one <label/>', () => {
    expect(wrapper.find('label')).to.have.lengthOf(1);
    expect(wrapper.find('label').text()).to.equal('File Bookmark Item');
  });

  it('should render one category span', () => {
    expect(wrapper.find(styles.category).text()).to.equal('Video');
  });

  it('should render one <FormattedDate />', () => {
    expect(wrapper.find('FormattedDate')).to.have.lengthOf(1);
  });
});

describe('<FileItemNew /> props update component structure', () => {
  it('should render a category span with accurate text', () => {
    wrapper.setProps({ stackSize: 2 });
    expect(wrapper.find(styles.category).text()).to.equal('2 Files');
  });
});

describe('<FileItemNew /> functions called', () => {
  it('should simulate click and call onClick once on <a>', () => {
    wrapper.find('a').simulate('click');
    expect(defaultProps.onClick.callCount).to.equal(1);
  });
});
