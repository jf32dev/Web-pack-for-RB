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
 * @author Olivia Mo <olivia.mo@bigtincan.com>
 */

import React from 'react';
import { configure } from 'enzyme';
import stylesClass from 'components/NoteItemNew/NoteItemNew.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import NoteItemNew from 'components/NoteItemNew/NoteItemNew';
import Loader from 'components/Loader/Loader';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    authString: '',
    colour: '#4c4c4c',
    excerpt: 'This is a test excerpt',
    loading: false,
    name: 'Note from Yesterday 45689924',
    showThumb: false,
    story: {
      id: 808367,
      permid: 808367,
      title: 'Story test title',
      thumbnail: '',
      isQuickFile: false,
      isQuickLink: false,
      isProtected: false
    },
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Stourhead_garden.jpg',
    updated: 1477022013
  };
  wrapper = mountWithIntl(<NoteItemNew {...defaultProps} />);
});


describe('<NoteItemNew /> basic component structure', () => {
  it('should render container element', () => {
    expect(wrapper.find('a')).to.have.lengthOf(1);
  });

  it('should render note title', () => {
    expect(wrapper.find('p')).to.have.lengthOf(1);
    expect(wrapper.find('p').text()).to.equal('Note from Yesterday 45689924');
  });

  it('should render note contents', () => {
    expect(wrapper.find('span').at(0).text()).to.equal('This is a test excerpt');
  });
});

describe('<NoteItemNew /> props update component structure', () => {
  it('should render loader', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Loader)).to.have.lengthOf(1);
    expect(wrapper.find(styles.noteItemTitle)).to.have.lengthOf(0);
    expect(wrapper.find(styles.noteItemContent)).to.have.lengthOf(0);
    expect(wrapper.find(styles.noteThumbnail)).to.have.lengthOf(0);
    expect(wrapper.find(styles.storyLink)).to.have.lengthOf(0);
    expect(wrapper.find('span')).to.have.lengthOf(0);
  });
});
