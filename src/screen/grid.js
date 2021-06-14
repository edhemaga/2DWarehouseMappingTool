import React from "react";
import { Stage, Layer, Rect } from "react-konva";
import Button from "@material-ui/core/Button";

import { useSelector } from "react-redux";

function Grid() {
  const config = useSelector((state) => state);
  const layerRef = React.useRef();
  const btnRef = React.useRef();
  const selectionRectRef = React.useRef();
  const selection = React.useRef({
    active: false,
    xStart: 0,
    yStart: 0,
    xEnd: 0,
    yEnd: 0,
  });
  let useSelection = false;
  var rectsToConfigure = [];

  const setAttributes = (i, j, colorTemp, selectedTemp) => {
    return {
      id: i.toString() + j.toString(),
      x: j * 60,
      y: i * 60,
      color: colorTemp,
      seleted: selectedTemp,
    };
  };

  const checkColumn = (i, j) => {
    if (
      (j % config.columnToSelect === 0 && j >= 1) ||
      (config.upWall === true && i === 0) ||
      (config.downWall === true && i === config.gridHeigth - 1) ||
      (config.leftWall === true && j === 0) ||
      (config.rightWall === true && j === config.gridWidth - 1)
    )
      return true;
    else return false;
  };

  const checkRectPosition = (xPos, yPos) => {
    if (
      xPos >= Math.min(selection.current.xStart, selection.current.xEnd) - 50 &&
      xPos <= Math.max(selection.current.xStart, selection.current.xEnd) &&
      yPos >= Math.min(selection.current.yStart, selection.current.yEnd) - 50 &&
      yPos <= Math.max(selection.current.yStart, selection.current.yEnd)
    )
      return true;
    else return false;
  };

  const resetSelectionArea = () => {
    selectionRectRef.current.attrs.width = 0;
    selectionRectRef.current.attrs.height = 0;
    selection.current.xStart = 0;
    selection.current.yStart = 0;
    selection.current.xEnd = 0;
    selection.current.yEnd = 0;
    layerRef.current.batchDraw();
  };

  const setSelectionArea = (x, y, isActive, type) => {
    if (type === "start") {
      selection.current.xStart = x;
      selection.current.yStart = y;
      selection.current.active = isActive;
    }
    if (type === "end") {
      selection.current.xEnd = x;
      selection.current.yEnd = y;
      selection.current.active = false;
    }
  };

  const setNodeAttributes = (node) => {
    node.setAttrs({
      visible: selection.current.active,
      x: selection.current.xStart,
      y: selection.current.yStart,
      width: selectionRectRef.current.xEnd - selection.current.xStart,
      height: selectionRectRef.current.yEnd - selection.current.yStart,
      fill: "rgba(0, 161, 255, 0.3)",
    });
    layerRef.current.batchDraw();
  };

  const isSelected = (rect) => {
    var rectExists = false;
    if (rectsToConfigure.length !== 0) {
      for (var i = 0; i < rectsToConfigure.length; i++) {
        if (
          rectsToConfigure[i].x === rect.x &&
          rectsToConfigure[i].y === rect.y
        ) {
          rectExists = true;
        } else {
          rectExists = false;
        }
      }
    }
    return rectExists;
  };

  const generateShapes = (config) => {
    let mapConfig = [];
    for (let i = 0; i < config.gridWidth; i++) {
      for (let j = 0; j < config.gridHeigth; j++) {
        if (checkColumn(i, j)) {
          mapConfig.push(setAttributes(i, j, "#3f51b5", true));
        } else {
          mapConfig.push(setAttributes(i, j, "#e8eaf6", false));
        }
      }
    }

    return mapConfig;
  };

  const startSelect = (e) => {
    if (useSelection) {
      setSelectionArea(e.evt.layerX, e.evt.layerY, true, "start");
    }
  };

  const endSelect = (e) => {
    if (useSelection) {
      setSelectionArea(e.evt.layerX, e.evt.layerY, false, "end");
      for (var i = 0; i < layerRef.current.children.length; i++) {
        var rect = layerRef.current.children[i].attrs;
        var xPos = rect.x;
        var yPos = rect.y;

        if (checkRectPosition(xPos, yPos) && !isSelected(rect)) {
          rect.fill = "#3f51b5";
          rect.selected = true;
          rectsToConfigure.push(rect);
        }
      }
      resetSelectionArea();
    }
  };

  const updateLayer = (e) => {
    if (selection && useSelection) {
      selectionRectRef.current.xEnd = e.evt.layerX;
      selectionRectRef.current.yEnd = e.evt.layerY;
      const node = selectionRectRef.current;
      setNodeAttributes(node);
    }
  };

  const toggleRect = (node) => {
    if (!isSelected(node.currentTarget.attrs)) {
      node.currentTarget.setAttrs({
        fill: "#3f51b5",
        selected: true,
      });

      rectsToConfigure.push(node.currentTarget.attrs);
    } else {
      rectsToConfigure.splice(
        rectsToConfigure.indexOf(node.currentTarget.attrs),
        1
      );
      node.currentTarget.setAttrs({
        fill: "#e8eaf6",
        selected: false,
      });
    }
    layerRef.current.batchDraw();
  };

  const toggleSelection = () => {
    if (useSelection) {
      useSelection = false;
      document.getElementById("btn").style.background = "red";
    } else {
      document.getElementById("btn").style.background = "blue";
      useSelection = true;
    }
  };

  const [rects] = React.useState(() => generateShapes(config));

  return (
    <div>
      <Button
        variant="contained"
        id="btn"
        ref={btnRef}
        onClick={() => {
          toggleSelection();
        }}
      >
        Drag select
      </Button>
      <hr></hr>

      <h1>{config.name}</h1>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: 0, paddingLeft: 25, paddingRight: 25 }}></div>
        <div>
          {[...Array(Number(config.gridWidth))].map((_, i) => (
            <span
              style={{
                display: "inline-block",
                width: 50,
                textAlign: "center",
                paddingRight: 10,
              }}
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          {[...Array(Number(config.gridHeigth))].map((_, i) => (
            <div
              style={{
                width: 10,
                height: 50,
                paddingRight: 15,
                paddingLeft: 25,
                paddingBottom: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              {i}
            </div>
          ))}
        </div>
        <Stage
          width={config.gridWidth * 60}
          height={config.gridHeigth * 60}
          onMouseDown={(e) => startSelect(e)}
          onMouseUp={(e) => endSelect(e)}
          onMouseMove={(e) => updateLayer(e)}
        >
          <Layer ref={layerRef}>
            {rects.map((rect) => (
              <Rect
                // key={rect.id}
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={50}
                height={50}
                fill={rect.color}
                onClick={(node) => toggleRect(node)}
                onTap={(node) => toggleRect(node)}
              />
            ))}
            <Rect ref={selectionRectRef} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default Grid;
