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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Yi Zhang <yi.zhang@bigtincan.com>
 */

export default function(files, allCanvasBlocks, blocksById) {
  return files.map(f => {
    if (f.matchedBlocks.length) {
      return {
        ...f,
        matchedBlocks: f.matchedBlocks.map(b => {
          return {
            ...b,
            canAddToCanvas: allCanvasBlocks.indexOf(b.id) === -1,
            thumbnailUrl: b.thumbnailUrl || (blocksById[b.id] && blocksById[b.id].thumbnail)
          };
        })
      };

      // Diplay Video results as blocks -- temporary until API is returning video blocks
    } else if (f.category === 'video') {
      return {
        ...f,
        matchedBlocks: [{
          id: f.id,
          location: null,
          page: 0,
          text: f.description,
          highlight: f.description,
          canAddToCanvas: allCanvasBlocks.indexOf(f.id) === -1,
        }]
      };
    }

    return f;
  });
}
