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
import React from 'react';
import { configure, mount } from 'enzyme';
import sinon from 'sinon';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';

import AdminFileGeneral from 'components/Admin/AdminFileGeneral/AdminFileGeneral';

configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
const expect = chai.expect;

const testProps = {
  onSave: sinon.spy(),
  onChange: sinon.spy(),
  hintText: null,
  detailsFieldLabel: null,
  showCustomFileDetailsIcon: false,
  error: {},
  loading: false,
  saveLoading: false,
  saveDisabled: true,
  strings: {
    general: 'General',
    detailsFieldLabel: 'Metadata field label',
    hintText: 'Hint Text',
    showIcon: 'Show icon',
    save: 'Save',
    savedSuccessfully: 'Saved successfully',
    customFileMetadataDesc: 'The custom text field will only be available to publishers on web'
  },
};
describe('<AdminFileGeneral /> component structure', () => {
  let wrapper;
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      ...testProps
    };
    wrapper = mount(<AdminFileGeneral {...defaultProps} />);
  });

  it('should render an <Text /> for custom label', () => {
    expect(wrapper.find('Text')).to.have.lengthOf(1);
  });
  it('should render a <Textarea /> for hint text', () => {
    expect(wrapper.find('Textarea')).to.have.lengthOf(1);
  });
  it('should render a <Checkbox /> to show icon', () => {
    expect(wrapper.find('Checkbox')).to.have.lengthOf(1);
  });
});

describe('<AdminFileGeneral /> changing props and firing events ', () => {
  let wrapper;
  let defaultProps;
  let onChange;
  let onSave;
  beforeEach(() => {
    defaultProps = {
      ...testProps
    };
    onChange = sinon.spy();
    onSave = sinon.spy();
    wrapper = mount(<AdminFileGeneral {...defaultProps} onChange={onChange} onSave={onSave} />);
  });

  it('should call onChange', () => {
    wrapper.find('input[type="text"]').simulate('change', { target: { value: 'Custom metadata label' } });
    expect(onChange.callCount).to.equal(1);
  });

  it('should enable save button', () => {
    wrapper.setProps({ saveDisabled: false });
    expect(wrapper.find('button').prop('disabled')).to.equal(false);
  });

  it('should call onSave', () => {
    wrapper.setProps({ saveDisabled: false });
    wrapper.find('button').at(0).simulate('click');
    expect(onSave.callCount).to.equal(1);
  });
});
