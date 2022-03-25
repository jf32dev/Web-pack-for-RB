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

/* eslint-disable import/prefer-default-export */

import moment from 'moment';
import isFileInternal from 'helpers/isFileInternal';

export function processSectionsToPitchbuilder(description, sections, templateId, templates) {
  const dateString = moment().format('LL');   //  July 23, 2020
  const pitchbuilderJSON = {
    description: description,  // file.description
    version: '1.0',
    outputFormat: 'pptx',
    commands: []
  };

  // Insert cover template as the first page
  const coverTemplate = templates.find(t => t.name === 'cover');
  pitchbuilderJSON.commands.push({
    createFromTemplate: {
      srcFile: {
        url: {
          templateId: templateId  // cover template id
        }
      },
      templateNumber: coverTemplate.id,
      edits: [
        // Insert date
        {
          fillPlaceholder: {
            destination: {
              id: coverTemplate.date
            },
            source: {
              text: dateString
            }
          }
        }
      ]
    }
  });

  // Create a command per slide
  let slides = sections.map(s => s.slides).flat();

  // Filter deleted slides
  slides = slides.filter(s => !s.deleted);

  slides.forEach((slide, index) => {
    let cmd = {};

    // Create slide from full page
    if (slide.fullPage || slide.showAsFullPage) {
      const block = slide.blocks[0];
      const file = block.file || slide.slide.file;

      // Don't include if file is blocked/internal
      const internalFile = isFileInternal(file);
      if (internalFile) {
        return;
      }

      // If no block location is available, use srcPage attribute
      const blockLocation = block.location || 1;
      const locationAttr = blockLocation === 1 ? 'srcPage' : 'blockId';

      cmd = {
        addPage: {
          srcFile: {
            url: {
              fileId: file.id
            },
          },
          [locationAttr]: blockLocation
        }
      };

    // Create slide from template & blocks
    } else {
      // Get template id from slide template name
      const slideTemplate = templates.find(t => t.name === slide.template);
      cmd = {
        createFromTemplate: {
          srcFile: {
            url: {
              templateId: templateId  // cover template id
            }
          },
          templateNumber: slideTemplate.id,
          edits: []
        }
      };

      // Create an edit if the slide has a title
      if (slideTemplate.title && slide.title) {
        cmd.createFromTemplate.edits.push({
          fillPlaceholder: {
            destination: {
              id: slideTemplate.title
            },
            source: {
              text: slide.title
            }
          }
        });
      }

      // Create an edit to insert the page count
      if (slideTemplate.count) {
        cmd.createFromTemplate.edits.push({
          fillPlaceholder: {
            destination: {
              id: slideTemplate.count
            },
            source: {
              text: (index + 2).toString()  // must be string, cover is #1
            }
          }
        });
      }

      // Create an edit to insert the date
      if (slideTemplate.date) {
        const dateEdit = {
          fillPlaceholder: {
            destination: {
              id: slideTemplate.date
            },
            source: {
              text: dateString
            }
          }
        };
        cmd.createFromTemplate.edits.push(dateEdit);
      }

      // Create an edit per block
      slide.blocks.forEach((block, blockIndex) => {
        const file = block.file;

        // Don't include if file is blocked/internal
        const internalFile = isFileInternal(file);
        if (internalFile) {
          return;
        }

        const edit = {
          fillPlaceholder: {
            destination: {
              id: slideTemplate.blocks[blockIndex]
            },
            source: {
              srcFile: {
                url: {
                  fileId: file.id
                }
              },
              blockId: block.location
            }
          }
        };

        cmd.createFromTemplate.edits.push(edit);
      });
    }

    pitchbuilderJSON.commands.push(cmd);
  });

  return pitchbuilderJSON;
}

export function createPageJsonForPitch(description, sections) {
  const pitchbuilderJSON = {
    description: description,  // file.description
    version: '1.0',
    outputFormat: 'pptx',
    commands: []
  };

  // Create a command per slide
  let slides = sections.map(s => s.slides).flat();
  // Filter deleted slides
  slides = slides.filter(s => !s.deleted);

  slides.forEach(slide => {
    let cmd = {};

    const block = slide.blocks[0];
    const file = block.file || slide.slide.file;

    // Don't include if file is blocked/internal
    const internalFile = isFileInternal(file);
    if (internalFile) {
      return;
    }

    cmd = {
      addPage: {
        srcFile: {
          url: {
            fileId: file.id
          },
        },
        srcPage: block.page //PageNumber of the matched page of file
      }
    };

    pitchbuilderJSON.commands.push(cmd);
  });

  return pitchbuilderJSON;
}
