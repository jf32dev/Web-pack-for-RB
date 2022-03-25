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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import uniqueId from 'lodash/uniqueId';
import { expect } from 'chai';
import reducer, {
  initialState,
  addSection,
  editSection,
  addSlides,
  editSlide,
  setNewIndicator,
  clear,

  ADD_SECTION,
  EDIT_SECTION,
  ADD_SLIDES,
  EDIT_SLIDE,
  GENERATE_THUMBNAILS_SUCCESS,
  GET_THUMBNAILS_SUCCESS,
  SET_NEW_INDICATOR,
  CLEAR,
} from '../canvas/canvas';

const testSections = [{
  id: 1,
  name: 'Test Section 1',
  deleted: false,
  slides: [
    {
      id: 1,
      title: 'Actual First page',
      deleted: false,
      slide: {
        file: {},
        page: 10,
        thumbnail: ''
      },
      blocks: [
        {
          id: 5,
          location: 'abc123',
          type: 'image',
          file: {},
          thumbnail: '',
        }
      ]
    },
  ]
}];

const testSlides = [
  {
    id: 1,
    title: 'First page',
    deleted: false,
    slide: {
      file: {},
      page: 10,
      thumbnail: ''
    },
    blocks: []
  },
  {
    id: 3,
    title: 'Second page',
    deleted: false,
    slide: {
      file: {},
      page: 10,
      thumbnail: ''
    },
    blocks: []
  },
  {
    id: 4,
    title: 'Third page',
    deleted: false,
    slide: {
      file: {},
      page: 10,
      thumbnail: ''
    },
    blocks: []
  },
];

describe('canvas reducer actions', () => {
  it('should add section', () => {
    const expectedAction = {
      type: ADD_SECTION,
      props: testSections[0]
    };

    expect(addSection(testSections[0])).to.eql(expectedAction);
  });

  it('should edit section', () => {
    const editSectionProps = {
      name: 'Test Section 1 (edited)'
    };

    const expectedAction = {
      type: EDIT_SECTION,
      id: testSections[0].id,
      props: editSectionProps
    };

    expect(editSection(testSections[0].id, editSectionProps)).to.eql(expectedAction);
  });

  it('should add slides', () => {
    const expectedAction = {
      type: ADD_SLIDES,
      slides: testSlides,
      slideIndex: 0,
      sectionId: testSections[0].id,
      sectionName: undefined
    };

    expect(addSlides(testSlides, 0, testSections[0].id)).to.eql(expectedAction);
  });

  it('should edit slide', () => {
    const expectedAction = {
      type: EDIT_SLIDE,
      id: testSlides[0].id,
      props: testSlides[0]
    };

    expect(editSlide(testSlides[0].id, testSlides[0])).to.eql(expectedAction);
  });

  it('should clear', () => {
    const expectedAction = {
      type: CLEAR,
    };

    expect(clear()).to.eql(expectedAction);
  });

  it('should set new indicator', () => {
    const expectedAction = {
      type: SET_NEW_INDICATOR,
      value: true
    };

    expect(setNewIndicator(true)).to.eql(expectedAction);
  });
});

describe('canvas reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should add section without slides', () => {
    const newSection = {
      ...testSections[0],
      slides: []
    };

    const expectedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: newSection
      },
      slidesById: {},
    };

    expect(
      reducer(initialState, {
        type: ADD_SECTION,
        props: newSection
      })
    ).to.eql(expectedState);
  });

  it('should add section with slides & blocks', () => {
    const newSection = {
      ...testSections[0]
    };

    const expectedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: newSection
      },
      slidesById: {
        [newSection.slides[0].id]: {
          ...newSection.slides[0],
          blocks: [newSection.slides[0].blocks[0].id]
        }
      },
      blocksById: {
        [newSection.slides[0].blocks[0].id]: newSection.slides[0].blocks[0]
      }
    };

    const reducedState = reducer(initialState, {
      type: ADD_SECTION,
      props: newSection
    });

    // console.log(JSON.stringify(expectedState, null, '  '));
    // console.log(JSON.stringify(reducedState, null, '  '));

    expect(reducedState).to.eql(expectedState);
  });

  it('should add slides to an existing section by id', () => {
    const newSection = testSections[0];

    const populatedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: []
        }
      },
      slidesById: {},
    };

    const expectedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          deleted: false,
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0]
      },
    };

    expect(
      reducer(populatedState, {
        type: ADD_SLIDES,
        slides: [testSlides[0]],
        sectionId: newSection.id
      })
    ).to.eql(expectedState);
  });

  it('should add slides to an existing section by name', () => {
    const newSection = testSections[0];

    const populatedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: []
        }
      },
      slidesById: {},
    };

    const expectedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0]
      },
    };

    expect(
      reducer(populatedState, {
        type: ADD_SLIDES,
        slides: [testSlides[0]],
        sectionName: newSection.name
      })
    ).to.eql(expectedState);
  });

  it('should add slides to an existing section with existing slides at a set index', () => {
    const newSection = testSections[0];

    const populatedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: [2, 3]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0],
        [testSlides[1].id]: testSlides[1],
      },
    };

    const expectedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: [2, 4, 3]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0],
        [testSlides[1].id]: testSlides[1],
        [testSlides[2].id]: testSlides[2],
      },
    };

    expect(
      reducer(populatedState, {
        type: ADD_SLIDES,
        slides: [testSlides[2]],
        slideIndex: 1,
        sectionId: newSection.id
      })
    ).to.eql(expectedState);
  });

  it('should add slides to a non-existing section without a name', () => {
    const newSectionId = uniqueId('section-');

    const expectedState = {
      ...initialState,
      order: [newSectionId],
      sectionsById: {
        [newSectionId]: {
          id: newSectionId,
          name: '',
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0]
      },
    };

    expect(reducer(initialState, {
      type: ADD_SLIDES,
      slides: [testSlides[0]],
      sectionId: newSectionId
    })).to.eql(expectedState);
  });

  it('should add slides to a non-existing section with a name', () => {
    const newSectionId = uniqueId('section-');
    const newSectionName = 'Cool Section';

    const expectedState = {
      ...initialState,
      order: [newSectionId],
      sectionsById: {
        [newSectionId]: {
          id: newSectionId,
          name: newSectionName,
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0]
      },
    };

    expect(reducer(initialState, {
      type: ADD_SLIDES,
      slides: [testSlides[0]],
      sectionId: newSectionId,
      sectionName: newSectionName
    })).to.eql(expectedState);
  });

  it('should edit existing slide', () => {
    const newSection = testSections[0];

    const populatedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0]
      },
    };

    const expectedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: {
          ...testSlides[0],
          name: 'Edited Slide'
        }
      },
    };

    expect(
      reducer(populatedState, {
        type: EDIT_SLIDE,
        id: testSlides[0].id,
        props: {
          name: 'Edited Slide'
        }
      })
    ).to.eql(expectedState);
  });

  it('should add location id to non-existing queued thumbnails', () => {
    const fileId = 1;
    const location = 'abc123';

    const populatedState = {
      ...initialState,
      queuedThumbnails: {},
    };

    const expectedState = {
      ...initialState,
      queuedThumbnails: {
        [fileId]: location
      },
    };

    expect(
      reducer(populatedState, {
        type: GENERATE_THUMBNAILS_SUCCESS,
        fileId,
        locations: location,
      })
    ).to.eql(expectedState);
  });

  it('should add location id to existing queued thumbnails', () => {
    const fileId = 1;
    const location1 = 'abc123';
    const location2 = 'def456';

    const populatedState = {
      ...initialState,
      queuedThumbnails: {
        [fileId]: location1
      },
    };

    const expectedState = {
      ...initialState,
      queuedThumbnails: {
        [fileId]: location1.concat(',' + location2)
      },
    };

    expect(reducer(populatedState, {
      type: GENERATE_THUMBNAILS_SUCCESS,
      fileId,
      locations: location2,
    })).to.eql(expectedState);
  });

  it('should add returned thumbnail to blocks and modify queued thumbnails', () => {
    const fileId = 1;
    const location1 = 'abc123';
    const location2 = 'def456';
    const thumbnail1 = 'thumb1.png';

    const apiResult = [
      {
        id: testSections[0].slides[0].blocks[0].id,
        location: location1,
        thumbnailUrl: thumbnail1
      }
    ];

    const populatedState = {
      ...initialState,
      order: [testSections[0].id],
      sectionsById: {
        [testSections[0].id]: {
          ...testSections[0],
          slides: [testSections[0].slides[0].id]
        }
      },
      slidesById: {
        [testSections[0].slides[0].id]: {
          ...testSections[0].slides[0],
          blocks: [testSections[0].slides[0].blocks[0].id]
        }
      },
      blocksById: {
        [testSections[0].slides[0].blocks[0].id]: testSections[0].slides[0].blocks[0]
      },
      queuedThumbnails: {
        [fileId]: location1.concat(',' + location2)
      },
    };

    const expectedState = {
      ...populatedState,
      blocksById: {
        [testSections[0].slides[0].blocks[0].id]: {
          ...testSections[0].slides[0].blocks[0],
          thumbnail: thumbnail1
        }
      },
      queuedThumbnails: {
        [fileId]: location2
      },
    };

    const reducedState = reducer(populatedState, {
      type: GET_THUMBNAILS_SUCCESS,
      fileId,
      result: apiResult,
    });

    expect(reducedState).to.eql(expectedState);
  });

  it('should clear all sections, slides & thumbnails', () => {
    const newSection = testSections[0];

    const populatedState = {
      ...initialState,
      order: [newSection.id],
      sectionsById: {
        [newSection.id]: {
          ...newSection,
          slides: [testSlides[0].id]
        }
      },
      slidesById: {
        [testSlides[0].id]: testSlides[0]
      },
      queuedThumbnails: {
        1: 'abc123,def456'
      }
    };

    expect(reducer(populatedState, {
      type: CLEAR,
    })).to.eql(initialState);
  });

  it('should set new indicator to true', () => {
    const expectedState = {
      ...initialState,
      newIndicator: true
    };

    expect(
      reducer(initialState, {
        type: SET_NEW_INDICATOR,
        value: true
      })
    ).to.eql(expectedState);
  });
});
