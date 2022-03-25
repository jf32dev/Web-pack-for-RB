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
 * @copyright 2010-2021 BigTinCan Mobile Pty Ltd
 * @author Rubenson Barrios <rubenson.barrios@bigtincan.com>
 */

import React, { createContext, useCallback, useState } from 'react';
import { fabric } from 'fabric';

export const FabricContext = createContext([]);

export const FabricContextProvider = ({ children }) => {
  const [canvas, setCanvas] = useState(null);
  const [historyList, setHistoryList] = useState(0);
  const [activeObject, setActiveObject] = useState(null);
  const canvasOptions = {
    isDrawingMode: true
  };

  const setPencilBrush = (el, options) => {
    const canvasEl = el;
    canvasEl.freeDrawingBrush = new fabric.PencilBrush(canvasEl);
    canvasEl.freeDrawingBrush.color = options.lineColor;
    canvasEl.freeDrawingBrush.width = parseInt(options.lineWidth, 10) || 1;
  };

  const initCanvas = useCallback((el, options) => {
    const c = new fabric.Canvas(el, canvasOptions);

    if (options && options.width) c.setWidth(options.width);
    if (options && options.height) c.setHeight(options.height);

    c.renderAll();
    setPencilBrush(c, options);
    setCanvas(c);
  }, []);

  const loadFromJSON = useCallback((el, options, json, canvasEl) => {
    let c;
    if (el) {
      c = el;
    } else { // create new canvas if not initialized
      c = new fabric.Canvas(canvasEl, canvasOptions);
    }

    c.loadFromJSON(
      json,
      () => {
        if (options && options.width) c.setWidth(options.width);
        if (options && options.height) c.setHeight(options.height);

        c.renderAll();
      },
      (o, object) => {
        fabric.log(o, object);
      });
    setPencilBrush(c, options);
    setCanvas(c);
  }, []);

  return (
    <FabricContext.Provider
      value={{
        activeObject,
        canvas,
        historyList,
        initCanvas,
        loadFromJSON,
        setActiveObject,
        setCanvas,
        setHistoryList,
        setPencilBrush
      }}
    >
      {children}
    </FabricContext.Provider>
  );
};
