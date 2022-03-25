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
import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mountWithIntl } from 'helpers/intlEnzymeTestHelper';
import BookmarkItemNew from 'components/BookmarkItemNew/BookmarkItemNew';
import StoryItemNew from 'components/StoryItemNew/StoryItemNew';
import FileItemNew from 'components/FileItemNew/FileItemNew';

chai.use(chaiEnzyme());
const expect = chai.expect;

configure({ adapter: new Adapter() });

let wrapper;
let defaultProps;
beforeEach(() => {
  defaultProps = {
    id: 1,
    name: 'Single Story Bookmark',
    created: 1234,
    type: 'bookmark',
    setData: [
      {
        'id': 1000853133,
        'permId': 1000329825,
        'name': 'Example Story',
        'thumbnail': 'src/static/images/story3.png',
        'colour': '#e202ae',
        'type': 'story',
        'badgeColour': '#de000b',
        'badgeTitle': 'Incredible Deal',
        'excerpt': '',
        'isLiked': true,
        'isBookmark': true,
        'isQuicklink': false,
        'isQuickfile': true,
        'updated': 1449637627,
        'likeCount': 2,
        'commentCount': 3,
        'fileCount': 1,
        'isProtected': true,
        'isGeoProtected': true,
        'rating': 5,
        'ratingCount': 4,
      }
    ],
    onFilesClick: () => {},
    onStoryClick: () => {}
  };
  wrapper = mountWithIntl(<BookmarkItemNew {...defaultProps} />);
});

describe('<BookmarkItemNew /> basic component structure', () => {
  it('should render one <StoryItemNew />', () => {
    expect(wrapper.find(StoryItemNew)).to.have.lengthOf(1);
  });

  it('should not render <FileItemNew/>', () => {
    expect(wrapper.find(FileItemNew)).to.have.lengthOf(0);
  });

  it('should render one <FileItemNew />', () => {
    wrapper.setProps({
      setData: [{
        ...defaultProps.setData,
        type: 'file',
        category: 'video',
        dateAdded: 1449637627,
      }]
    });
    expect(wrapper.find(FileItemNew)).to.have.lengthOf(1);
  });

  it('should not render <StoryItemNew/>', () => {
    wrapper.setProps({
      setData: [{
        ...defaultProps.setData,
        type: 'file',
        category: 'video',
        dateAdded: 1449637627,
      }]
    });
    expect(wrapper.find(StoryItemNew)).to.have.lengthOf(0);
  });
});
