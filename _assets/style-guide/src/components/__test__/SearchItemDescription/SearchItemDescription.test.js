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
import SearchItemDescription from 'components/SearchItemDescription/SearchItemDescription';
import stylesClass from 'components/SearchItemDescription/SearchItemDescription.less';
import _mapValues from 'lodash/mapValues';
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntlAndRouter } from 'helpers/intlEnzymeTestHelper';


chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });
const styles = _mapValues(stylesClass, (raw) => '.' + raw);

describe('<SearchItemDescription /> component structure', () => {
  let wrapper;
  let defaultProps;
  before(() => {
    defaultProps = {
      id: 1,
      story: {
        channel: {
          name: 'BTC Channel'
        }
      },
      hasShare: true,
      shareStatus: 'optional',
      description: 'BTC Tester',
      bookmarks: [],
      onBookmarkClick: sinon.spy()
    };

    wrapper = mountWithIntlAndRouter(<SearchItemDescription {...defaultProps} />);
  });

  it('should render container element', () => {
    expect(wrapper.find(styles.searchItemDescription)).to.have.lengthOf(1);
  });

  it('should render file or story name', () => {
    expect(wrapper.find(styles.name)).to.have.text('BTC Tester');
  });

  it('should render excerpt/description', () => {
    expect(wrapper.find(styles.content).length).to.equal(1);
  });

  it('should render 1 navigation path component', () => {
    expect(wrapper.find(styles.navPath).length).to.equal(1);
  });
});
