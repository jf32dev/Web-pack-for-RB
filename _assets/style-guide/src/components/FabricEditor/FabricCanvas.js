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

import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';

import { FabricContext } from './FabricContext';
import { uniqueId } from './fabricEditorUtil';

const FabricCanvas = (props) => {
  const {
    defaultValue,
    height,
    history,
    lineColor,
    lineWidth,
    width,
    onFabricCanvasUpdate
  } = props;
  const canvasRef = useRef(null);
  const {
    canvas,
    historyList,
    initCanvas,
    loadFromJSON,
    setActiveObject,
    setCanvas,
    setHistoryList,
    setPencilBrush
  } = useContext(FabricContext);

  const historyRef = useRef(false);
  const [fabricId, setFabricIdCanvas] = useState(null);

  useEffect(() => {
    setFabricIdCanvas(uniqueId());
  }, []);

  useLayoutEffect(() => {
    if (defaultValue) {
      loadFromJSON(
        null,
        { ...{
          fabricId,
          width,
          height,
          lineColor,
          lineWidth
        } },
        defaultValue,
        canvasRef.current
      );
    } else {
      initCanvas(canvasRef.current, { ...{
        fabricId,
        width,
        height,
        lineColor,
        lineWidth
      } });
    }
  }, [canvasRef, initCanvas, loadFromJSON, defaultValue, height, width]);

  const updateActiveObject = useCallback((e) => {
    if (!e) {
      return;
    }
    setActiveObject(canvas.getActiveObject());
    canvas.renderAll();
  }, [canvas, setActiveObject]);

  useEffect(() => {
    if (!canvas) {
      return undefined;
    }

    canvas.on('selection:created', updateActiveObject);
    canvas.on('selection:updated', updateActiveObject);
    canvas.on('selection:cleared', updateActiveObject);
    canvas.on('mouse:up', () => {
      setHistoryList([]);
      onFabricCanvasUpdate(JSON.stringify(canvas));
    });

    return () => {
      canvas.off('selection:created');
      canvas.off('selection:cleared');
      canvas.off('selection:updated');
      canvas.off('mouse:up');
      canvas.dispose();
      setCanvas(null);
    };
  }, [canvas, updateActiveObject]);

  useEffect(() => {
    if (!canvas) {
      return undefined;
    }

    setPencilBrush(canvas, { ...{
      lineColor,
      lineWidth
    } });

    return undefined;
  }, [lineColor, lineWidth]);

  useEffect(() => {
    // history updates
    if (!canvas) {
      return undefined;
    }

    const rawCanvas = JSON.parse(JSON.stringify(canvas));
    const fullList = [...rawCanvas.objects];
    const previousHistory = historyRef.current;

    if (previousHistory > history && fullList.length > 0) {
      setHistoryList(historyList.concat(fullList[fullList.length - 1]));
      fullList.splice(-1, 1);
    } else if (previousHistory < history && historyList.length > 0) {
      const index = historyList.length - 1;
      const addObject = historyList[index];
      setHistoryList(historyList.slice(0, index));
      fullList.push(addObject);
    }

    // Update history index
    historyRef.current = history;

    const jsonValue = { ...rawCanvas, objects: fullList };
    loadFromJSON(
      canvas,
      { ...{
        lineColor,
        lineWidth
      } },
      jsonValue
    );
    onFabricCanvasUpdate(JSON.stringify(canvas));

    return undefined;
  }, [history]);

  return (
    <canvas
      ref={canvasRef}
      id={fabricId}
    />
  );
};

FabricCanvas.propTypes = {
  /** default json string value */
  defaultValue: PropTypes.string,

  /** height of the fabric canvas editor */
  height: PropTypes.number,

  /** list of history to redo and undo */
  history: PropTypes.number,

  /** line color when drawing fabric object */
  lineColor: PropTypes.string,

  /** line width when drawing fabric object */
  lineWidth: PropTypes.string,

  /** width of the fabric canvas editor */
  width: PropTypes.number,

  /** default json string value */
  onFabricCanvasUpdate: PropTypes.func,
};

FabricCanvas.defaultProps = {
  defaultValue: '',
  lineColor: '#3ac119',
  lineWidth: 4,
};

export default FabricCanvas;
