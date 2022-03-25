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
 * @package style-guide
 * @copyright 2010-2020 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import _mapValues from 'lodash/mapValues';

import React from 'react';
import { configure, mount } from 'enzyme';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';

import stylesClass from 'components/Admin/AdminContentRecommender/AdminContentRecommender.less';
import AdminContentRecommender from 'components/Admin/AdminContentRecommender/AdminContentRecommender';

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
const expect = chai.expect;

const styles = _mapValues(stylesClass, (raw) => '.' + raw);
const testProps = {
  onSave: sinon.spy(),
  onChange: sinon.spy(),
  frequency: 'none',
  turnedOn: false,
  error: {},
  loading: false,
  saveLoading: false,
  saveDisabled: true,
  strings: {
    general: 'General',
    customFileMetadata: 'Custom File Metadata',
    detailsFieldLabel: 'Details field label',
    showIcon: 'Show icon on files with custom detail',
    hintText: 'Hint text',
    save: 'Save',
    savedSuccessfully: 'Saved successfully',
    customFileMetadataDesc: 'The custom text field will only be available to publishers on web'
  },
};
describe('<AdminContentRecommender /> content recommender is disabled with default values', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps
    };
    wrapper = mount(<AdminContentRecommender {...defaultProps} />);
  });

  it('<button /> save should be disabled on initial load', () => {
    expect(wrapper.find('header button').props().disabled).to.equal(true);
  });
  it('should render 1 check box for turnOn Genie Content recommender', () => {
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(1);
  });
  it('should not render <Select />', () => {
    expect(wrapper.find(styles.selectWrap)).to.have.lengthOf(0);
  });
});

describe('<AdminContentRecommender /> content recommender is enabled', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps,
      turnedOn: true,
    };
    wrapper = mount(<AdminContentRecommender {...defaultProps} />);
  });

  it('should render 1 check box for turnOn Genie Content recommender', () => {
    expect(wrapper.find('input[type="checkbox"]').length).to.equal(1);
  });
  it('should render <Select /> when Genie is enabled', () => {
    expect(wrapper.find(styles.selectWrap)).to.have.lengthOf(1);
  });
});

describe('<AdminContentRecommender /> should toggle other options and enable save button', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps
    };
    wrapper = mountWithIntl(<AdminContentRecommender {...defaultProps} />);
  });

  it('should enable genie and show Frequency dropdown', () => {
    wrapper.setProps({ turnedOn: true });
    expect(wrapper.find('label')).to.have.lengthOf(2);
  });

  it('should enable save button', () => {
    wrapper.setProps({ saveDisabled: false });
    expect(wrapper.find('button').prop('disabled')).to.equal(false);
  });
});
