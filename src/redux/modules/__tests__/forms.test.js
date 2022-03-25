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
 * @author Lochlan McBride <lochlan.mcbride@bigtincan.com>
 */

import { expect } from 'chai';
import reducer, {
  initialState,

  LOAD_CATEGORIES_SUCCESS,
  LOAD_FORMS_SUCCESS
} from '../forms';

const categories = [{
  id: 1,
  name: 'Category 1'
}, {
  id: 2,
  name: 'Category 2',
  forms: []
}];

const forms = [{
  id: 1,
  name: 'Form 1'
}, {
  id: 2,
  name: 'Form 2'
}];

describe('forms reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should normalize categories result', () => {
    const expectedState = {
      ...initialState,
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1'
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    expect(
      reducer(initialState, {
        type: LOAD_CATEGORIES_SUCCESS,
        result: categories,
      })
    ).to.eql(expectedState);
  });

  it('should normalize categories result and merge existing data', () => {
    const state = {
      ...initialState,
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1'
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    const testResult = [{
      id: 1,
      name: 'Category 1 - edited',
      forms: []
    }];

    const expectedState = {
      ...initialState,
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1 - edited',
          forms: []
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_CATEGORIES_SUCCESS,
        result: testResult,
      })
    ).to.eql(expectedState);
  });

  it('should normalize categories result with nested forms', () => {
    const nestedResult = [{
      id: 1,
      name: 'Category 1',
      forms: [{
        id: 1,
        name: 'Form 1'
      }, {
        id: 2,
        name: 'Form 2'
      }]
    }, {
      id: 2,
      name: 'Category 2',
      forms: []
    }];

    const expectedState = {
      ...initialState,
      formsById: {
        1: {
          id: 1,
          name: 'Form 1'
        },
        2: {
          id: 2,
          name: 'Form 2'
        }
      },
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1',
          forms: [1, 2]
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };


    expect(
      reducer(initialState, {
        type: LOAD_CATEGORIES_SUCCESS,
        result: nestedResult,
      })
    ).to.eql(expectedState);
  });

  it('should add forms to category by id', () => {
    const state = {
      ...initialState,
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1'
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    const expectedState = {
      ...initialState,
      formsById: {
        1: {
          id: 1,
          name: 'Form 1'
        },
        2: {
          id: 2,
          name: 'Form 2'
        }
      },
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1',
          forms: [1, 2],
          formsLoading: false,
          formsComplete: true,
          formsError: null
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_FORMS_SUCCESS,
        catId: 1,
        result: forms,
      })
    ).to.eql(expectedState);
  });

  it('should add more forms to populated category', () => {
    const state = {
      ...initialState,
      formsById: {
        1: {
          id: 1,
          name: 'Form 1'
        },
        2: {
          id: 2,
          name: 'Form 2'
        }
      },
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1',
          forms: [1, 2],
          formsLoading: false,
          formsComplete: true,
          formsError: null
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    const moreForms = [{
      id: 3,
      name: 'Form 3'
    }, {
      id: 4,
      name: 'Form 4'
    }];

    const expectedState = {
      ...initialState,
      formsById: {
        1: {
          id: 1,
          name: 'Form 1'
        },
        2: {
          id: 2,
          name: 'Form 2'
        },
        3: {
          id: 3,
          name: 'Form 3'
        },
        4: {
          id: 4,
          name: 'Form 4'
        }
      },
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1',
          forms: [1, 2, 3, 4],
          formsLoading: false,
          formsComplete: true,
          formsError: null
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_FORMS_SUCCESS,
        catId: 1,
        result: moreForms,
      })
    ).to.eql(expectedState);
  });

  it('should add more forms to empty category', () => {
    const state = {
      ...initialState,
      formsById: {
        1: {
          id: 1,
          name: 'Form 1'
        },
        2: {
          id: 2,
          name: 'Form 2'
        }
      },
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1',
          forms: [1, 2],
          formsLoading: false,
          formsComplete: true,
          formsError: null
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: []
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    const moreForms = [{
      id: 3,
      name: 'Form 3'
    }, {
      id: 4,
      name: 'Form 4'
    }];

    const expectedState = {
      ...initialState,
      formsById: {
        1: {
          id: 1,
          name: 'Form 1'
        },
        2: {
          id: 2,
          name: 'Form 2'
        },
        3: {
          id: 3,
          name: 'Form 3'
        },
        4: {
          id: 4,
          name: 'Form 4'
        }
      },
      categoriesById: {
        1: {
          id: 1,
          name: 'Category 1',
          forms: [1, 2],
          formsLoading: false,
          formsComplete: true,
          formsError: null
        },
        2: {
          id: 2,
          name: 'Category 2',
          forms: [3, 4],
          formsLoading: false,
          formsComplete: true,
          formsError: null
        }
      },
      categories: [1, 2],
      categoriesLoading: false,
      categoriesComplete: true
    };

    expect(
      reducer(state, {
        type: LOAD_FORMS_SUCCESS,
        catId: 2,
        result: moreForms,
      })
    ).to.eql(expectedState);
  });
});
