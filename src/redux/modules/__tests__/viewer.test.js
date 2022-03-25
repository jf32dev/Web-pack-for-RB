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
  addFiles,
  addFile,
  removeFiles,
  removeFile,
  setActiveFile,
  toggleDock,

  ADD_FILES,
  ADD_FILE,
  REMOVE_FILES,
  REMOVE_FILE,
  SET_ACTIVE_FILE,
  TOGGLE_DOCK,

  initialState,
} from '../viewer';

require('babel-polyfill');

const testFiles = [{
  id: 1,
  description: 'Test file',
  filename: 'cool.csv',
  category: 'csv'
}, {
  id: 2,
  description: 'Another test file',
  filename: 'cooler.txt',
  category: 'txt'
}];

describe('viewer reducer actions', () => {
  it('should create an action to add multiple files', () => {
    const expectedAction = {
      type: ADD_FILES,
      data: testFiles
    };
    expect(addFiles(testFiles)).to.eql(expectedAction);
  });

  it('should create an action to add single file', () => {
    const newFile = {
      id: 3,
      description: 'New File',
      filename: 'newfile1.pdf',
      category: 'pdf'
    };
    const expectedAction = {
      type: ADD_FILE,
      file: newFile
    };
    expect(addFile(newFile)).to.eql(expectedAction);
  });

  it('should create an action to remove all files', () => {
    const expectedAction = {
      type: REMOVE_FILES
    };
    expect(removeFiles()).to.eql(expectedAction);
  });

  it('should create an action to remove single file', () => {
    const id = 1;
    const expectedAction = {
      type: REMOVE_FILE,
      id: id
    };
    expect(removeFile(id)).to.eql(expectedAction);
  });

  it('should create an action to toggle dock', () => {
    const expectedAction = {
      type: TOGGLE_DOCK
    };
    expect(toggleDock()).to.eql(expectedAction);
  });

  it('should create an action to set activeFileId', () => {
    const id = 1;
    const expectedAction = {
      type: SET_ACTIVE_FILE,
      id
    };
    expect(setActiveFile(id)).to.eql(expectedAction);
  });
});

describe('viewer reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).to.eql(initialState);
  });

  it('should add multiple files to empty list and set first file to active', () => {
    const expectedState = { ...initialState,
      activeFileId: testFiles[0].id,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    expect(
      reducer(initialState, {
        type: ADD_FILES,
        data: testFiles
      })
    ).to.eql(expectedState);
  });

  it('should add multiple files to populated list and set first file to active', () => {
    const testInitialState = { ...initialState,
      activeFileId: testFiles[0].id,
      files: {
        3: {
          id: 3,
          description: 'Test file 3',
          filename: 'cool_guy.csv',
          category: 'csv'
        },
        4: {
          id: 4,
          description: 'Another test file 4',
          filename: 'coolest.txt',
          category: 'txt'
        }
      },
      order: [3, 4]
    };

    const expectedState = { ...initialState,
      activeFileId: testFiles[0].id,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        },
        3: {
          id: 3,
          description: 'Test file 3',
          filename: 'cool_guy.csv',
          category: 'csv'
        },
        4: {
          id: 4,
          description: 'Another test file 4',
          filename: 'coolest.txt',
          category: 'txt'
        }
      },
      order: [3, 4, 1, 2]
    };

    expect(
      reducer(testInitialState, {
        type: ADD_FILES,
        data: testFiles
      })
    ).to.eql(expectedState);
  });

  it('should add single file to empty list and set to active', () => {
    const singleFile = {
      id: 3,
      description: 'Single File',
      filename: 'singlefile.pdf',
      category: 'pdf'
    };
    const expectedState = { ...initialState,
      activeFileId: 3,
      files: {
        3: {
          id: 3,
          description: 'Single File',
          filename: 'singlefile.pdf',
          category: 'pdf'
        }
      },
      order: [3]
    };

    expect(
      reducer(initialState, {
        type: ADD_FILE,
        file: singleFile
      })
    ).to.eql(expectedState);
  });

  it('should add single file to populated list and set to active', () => {
    const testInitialState = { ...initialState,
      activeFileId: testFiles[0].id,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    const singleFile = {
      id: 3,
      description: 'Single File',
      filename: 'singlefile.pdf',
      category: 'pdf'
    };

    const expectedState = { ...initialState,
      activeFileId: 3,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        },
        3: {
          id: 3,
          description: 'Single File',
          filename: 'singlefile.pdf',
          category: 'pdf'
        }
      },
      order: [1, 2, 3]
    };

    expect(
      reducer(testInitialState, {
        type: ADD_FILE,
        file: singleFile
      })
    ).to.eql(expectedState);
  });


  it('should set single file as active if it already is in list', () => {
    const testInitialState = { ...initialState,
      activeFileId: 1,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    const existingFile = {
      id: 2,
      description: 'Another test file',
      filename: 'cooler.txt',
      category: 'txt'
    };

    const expectedState = { ...initialState,
      activeFileId: 2,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    expect(
      reducer(testInitialState, {
        type: ADD_FILE,
        file: existingFile
      })
    ).to.eql(expectedState);
  });

  it('should remove all files', () => {
    const fullState = { ...initialState,
      activeFileId: 1,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    const expectedState = {
      activeFileId: 0,
      isDocked: false,
      files: {},
      order: []
    };

    expect(
      reducer(fullState, {
        type: REMOVE_FILES
      })
    ).to.eql(expectedState);
  });

  it('should remove single file and update activeFileId', () => {
    const fullState = { ...initialState,
      activeFileId: 1,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    const expectedState = { ...initialState,
      activeFileId: 2,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [2]
    };

    expect(
      reducer(fullState, {
        type: REMOVE_FILE,
        id: 1
      })
    ).to.eql(expectedState);
  });

  it('should set active file', () => {
    const fullState = { ...initialState,
      activeFileId: 1,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    const expectedState = { ...initialState,
      activeFileId: 2,
      files: {
        1: {
          id: 1,
          description: 'Test file',
          filename: 'cool.csv',
          category: 'csv'
        },
        2: {
          id: 2,
          description: 'Another test file',
          filename: 'cooler.txt',
          category: 'txt'
        }
      },
      order: [1, 2]
    };

    expect(
      reducer(fullState, {
        type: SET_ACTIVE_FILE,
        id: 2
      })
    ).to.eql(expectedState);
  });

  it('should toggle dock', () => {
    const expectedState = { ...initialState,
      isDocked: true
    };

    expect(
      reducer(initialState, {
        type: TOGGLE_DOCK
      })
    ).to.eql(expectedState);
  });
});
